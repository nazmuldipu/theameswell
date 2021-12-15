'use strict';
import esbuild from 'esbuild';
import { readFileSync, readdirSync, statSync, truncateSync, createReadStream, createWriteStream} from 'fs';
import { appendFile, readFile, writeFile, truncate } from 'fs/promises';
import { join, basename, extname, posix, relative, sep} from 'path';
import { platform } from 'os'
import { rmNoExist, SCRIPTS_DIR, getPathLoadType, getPageAssets, PAGES_DIR, sanitizePageData, getFirstLine } from './lib.js';
import { ignorePatterns } from '../config.js';

const defaultPagePath = `${posix.join(PAGES_DIR.pathname, 'pagename')}`;
const createImportPaths = (scriptsPaths, pagePath = defaultPagePath) => {
    //convert to array hanlding
    return scriptsPaths.map(path => {
       // because these paths to to be used in `import` statements in JS files, we need to use the posix
       // style path functions in case the below is run in a windows environment
        const relativePath = posix.relative(posix.join(pagePath), posix.join(SCRIPTS_DIR.pathname, path));
        return `import '${relativePath}';`;
    });
}

const globalJsPath = scriptsPaths => {
    //convert to array hanlding
    return scriptsPaths.map(path => {
        const relativePath = posix.relative(posix.join(PAGES_DIR.pathname, 'pagename'), posix.join(SCRIPTS_DIR.pathname, path));
        return `./scripts${path.substring(1)}`
    });
}

/**
 * 
 * @param {String} pagesDir 
 * @param {String} scriptsDir 
 */
export const addGlobalBehavior = async (pagesDir, scriptsDir) => {
    const globalsPaths = readdirSync(scriptsDir.pathname)
    .reduce((globals, filename) => {
        const loadType = getPathLoadType(basename(filename));
        if(loadType) {
            globals[loadType] = join(scriptsDir.pathname, filename);
        }
        return globals;
    }, {})

    // for each loadType
    const fileBytePairs = []
    const pages = getPageAssets(pagesDir, (filename) => extname(filename) === '.js').flat();
    const globalsCache = {};
    const promises = await pages.reduce(async (promises, page) => {
        // we store original file sizes to enable restoring that file size
        // as a cleanup process
        const { size } = statSync(page);
        fileBytePairs.push({ page, size });
        const loadType = getPathLoadType(basename(page));
        
        if(loadType && globalsPaths[loadType]) {
            if(!globalsCache[loadType]) {
                globalsCache[loadType] = JSON.parse( readFileSync(globalsPaths[loadType]) );
            }
            //globalsCache[loadType] Array of path strings
            //get page name from page full path
            const pageName = page.split(posix.sep).slice(0, -1).join(posix.sep);
            const appendData = createImportPaths( globalsCache[loadType], pageName ).join('\n');
            if ( platform() !== 'win32') {
                try {
                    const firstLine = await getFirstLine(page);
                    /* if a file has ignore pattern at start, it will be ignored */
                    if(!ignorePatterns.some(pattern => firstLine.includes(pattern))) {
                        const pageData = readFileSync(page, 'utf-8');
                        const content = sanitizePageData(pageData);
                        /* will only run if appendData is not added already */
                        if(!content.includes(appendData)){
                            const data = content + appendData;
                            // needs improvement
                            promises.then(promises => promises.push(writeFile(page, data)));
                        }            
                    }            

                }catch(e) {
                    console.log(e)
                }
            }
            if (platform() === 'win32' && process.env.NODE_ENV === 'development' ) {
                buildGlobalEventsJS(globalJsPath(globalsCache[loadType]),loadType)
            }
        }
        return promises;
    }, Promise.resolve([]));

    await Promise.all(promises);

    return fileBytePairs;
}

/**
 * 
 * @param {Object[]} fileBytePairs 
 */
export const removeGlobalBehavior = (fileBytePairs) => {
    fileBytePairs.forEach(({ page, size }) => {
        return truncateSync(page, size);
    });
}

/**
 * We assume that the relative paths given in metadata
 * can be made absolute by process.cwd()
 * because we assume that build commands will be run at the project
 * root directory
 * @param {*} metadata -- esbuild metafile output
 */
export const getJSBuildDeps = metadata =>
    new Set(Object
        .keys(metadata.inputs)
        .map(relativePath => join(process.cwd(), relativePath)))


const getSkipperWebsiteAPIBase = () => {
    if (process.env.ACTIVE_API_URI === 'PROD') {
        return '"https://hotel-site.skipperhospitality.com"';
    }else if (process.env.ACTIVE_API_URI === 'STAGE') {
        return '"https://hotel-site-dev.skipperhospitality.com"';
    }else{
        return '"https://hotel-site-dev.skipperhospitality.com"';
    }
};

const getSkipperWebsiteToken = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '"this-is-my-secret-token-marram"';

        case 'staging':
            return '"this-is-my-secret-token-marram"';

        default:
            return '"this-is-my-secret-token-marram"';
    }
};

const getGoogleMapsApiToken = () => {
    switch(process.env.NODE_ENV) {
        // TODO:: token call from env
        case 'production':
            return '""';
        default:
            return '""';
    }
};

const pathResolvePlugin = {
    name: 'pathResolver',
    setup(build){  
      build.onResolve({ filter: /^components\// || /^scripts\// }, args => { 
        const rootPath = args.resolveDir.split('pages' + sep)[0];
        return { path: join(rootPath, args.path) }
      })
    },
}

/**
 * 
 * @param {String[]} inputPaths 
 * @param {String} outDir 
 * @param {String} outBase
 * @param {String} metafilePath
 */
export const buildJS = async (inputPaths, outDir, outBase, metafilePath) => {
    //make sure to tune the operation based on environment
    await esbuild.build({
        entryPoints: inputPaths,
        bundle: true,
        format: 'esm',
        external:[ 
            '*.jpg',
            '*.webp',
            '*.png',
            '*.woff',
            '*.woff2',
            '*.ttf'
        ],
        outdir: outDir,
        plugins: [pathResolvePlugin],
        outbase: outBase,
        target: ['es2017'],
        minify: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
        // Dane TODO: is there a way to only apply the keepNames property to
        // select files / modules? Only certain files will have this requirement
        // e.g. globalEvents.js
        keepNames: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
        metafile: metafilePath,
        define: {
            GOOGLE_MAPS_API_KEY: getGoogleMapsApiToken(),
            SKIPPER_WEBSITE_API_BASE: getSkipperWebsiteAPIBase(),
            SKIPPER_WEB_API_TOKEN: getSkipperWebsiteToken()
        }
    });

    const metadata = JSON.parse(readFileSync(metafilePath));
    await rmNoExist(metafilePath);
    return {
        buildDeps: getJSBuildDeps(metadata),
        outputFiles: Object.keys(metadata.outputs)
    };
}

// win32 os purpose (git diff issue)
export const buildGlobalEventsJS = async (files,type) => {
    await esbuild.build({
        entryPoints: ['scripts/lib/dummy-entry.js'],
        inject: files,
        outfile: `build/js/global-${type}.js`,
        plugins: [pathResolvePlugin],
        bundle: true,
        target: ['es2017'],
        format: 'esm',
    })
}