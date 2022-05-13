'use strict';
import {exec as e} from 'child_process';
import { promisify } from 'util';
const exec = promisify(e);
import {
    basename,
    join
} from 'path';
import chokidar from 'chokidar';
import browserSync from 'browser-sync';
const bs = browserSync.create('Skipper Dev Server');
import {
    filterForExt,
    getPageAssets,
    getJSLibAssets,
    metafilePath,
    getCSSLibAssets,
    getPageDataMap,
    getPageJSONFilePromises,
    replacePathBase,
    rmNoExist,
    PAGES_DIR,
    BUILD_DIR,
    COMPONENT_DIR,
    ROOT_DIR,
    globForPages,
    globForExts,
    SCRIPTS_DIR
} from './lib.js'
import { buildJS, addGlobalBehavior, removeGlobalBehavior } from './esbuild.js';
import { buildCSS, generateTailwindSafeList } from './postcss.js';
import { watchEventHandler } from './watching.js';
import { platform } from 'os';


const pageEntryPoints = getPageAssets(PAGES_DIR).flat();
// get new entry points for component/lib js and css
// these are from the component libs, which are to be bundled and sent to the server
// so that asynchronously loaded components can dynamically rely on the libraries
const componentJSLibEntryPoints = getJSLibAssets(join(COMPONENT_DIR.pathname, 'lib'));
const componentCSSLibEntryPoints = getCSSLibAssets(join(COMPONENT_DIR.pathname, 'lib'));
const outputPoints = pageEntryPoints.map(point => 
    replacePathBase(point, BUILD_DIR.pathname, basename(PAGES_DIR.pathname)));      
const pageDataMap = getPageDataMap(outputPoints);
const promises = getPageJSONFilePromises(pageDataMap, PAGES_DIR.pathname);
// remove previously built assets
promises.push(rmNoExist(BUILD_DIR.pathname));

let originalPageJSFileBytes;
try {
    // execute first builds
    console.log('Beginning Development Builds')
    console.log('calculating built site filepaths');
    console.log('removing previous builds');
    await Promise.all(promises);
    console.log('Created bundled file data JSON files');
    console.log('generating tailwindcss safelist');
    generateTailwindSafeList();
    console.log('tailwindcss safelist generated');
    // add in initial addGlobalBehavior here
    originalPageJSFileBytes = await addGlobalBehavior(PAGES_DIR, SCRIPTS_DIR);
    console.log('beginning site build processes');
    // build page specific assets
    const buildPromises =[
        buildCSS(
            pageEntryPoints.filter(filterForExt('.css')), 
            BUILD_DIR.pathname, 
            basename(PAGES_DIR.pathname)
        ),
        // js
        buildJS(
            pageEntryPoints.filter(filterForExt('.js')),
            BUILD_DIR.pathname,
            PAGES_DIR.pathname,
            metafilePath('meta-page.json')
        ),
        // 11ty
        exec('npm run watch:html')
    ];
    // build component specific assets
    if (componentJSLibEntryPoints.length) {
        buildPromises.push(
            buildJS(
                componentJSLibEntryPoints,
                BUILD_DIR.pathname,
                COMPONENT_DIR.pathname,
                metafilePath('meta-js-components.json')
            )
        );
    }
    if (componentCSSLibEntryPoints?.bundle?.length) {
        buildPromises.push(
            buildJS(
                componentCSSLibEntryPoints.bundle,
                BUILD_DIR.pathname,
                COMPONENT_DIR.pathname,
                metafilePath('meta-css-bundle-components.json')
            )
        );
    }
    if (componentCSSLibEntryPoints?.process?.length) {
        buildPromises.push(
            buildCSS(
                componentCSSLibEntryPoints.process,
                BUILD_DIR.pathname,
                basename(COMPONENT_DIR.pathname)
            )
        );
    }
    const [cssDepSet, {buildDeps: jsDepSet}] = await Promise.all(buildPromises);
    console.log('js and css and html built; now setting up dev server and file watchers');
    // watch
    const watcher = chokidar.watch(
        [
            ...cssDepSet,
            ...jsDepSet,
            globForPages(['.css', '.js']),
            // TODO: we do not currently watch for changes in global files. We should start doing that at some point
            // maybe via including paths in global-module.json?
            globForExts(['.njk', '.json'], PAGES_DIR.pathname),
            join(ROOT_DIR.pathname, '.eleventy.cjs'),
            join(ROOT_DIR.pathname, 'tailwind.config.cjs')
        ],
        { ignoreInitial: true }
    );
    const handler = watchEventHandler(
        watcher, 
        new Set(['.css', '.js']), 
        BUILD_DIR, 
        bs.reload.bind(bs)
    );
    watcher.on('add', handler('add'))
    watcher.on('change', handler('change'));
    watcher.on('unlink', handler('unlink'));
    watcher.on('unlinkDir', handler('unlinkDir'));

    /**
     * TODO --- need to figure out how to get 11ty to wait until 
     * asset builds are done -- I believe that changes in the json files
     * overwrite the downstream build changes...
     */
    bs.init({
        server: 'build',
        ui: false,
        port: 8080
    });

    const exitHandler = async signal => {
        console.log(`received termination signal ${signal}. Cleaning up and exiting`);
        bs.exit();
        watcher.close();
        //removeGlobalBehavior(originalPageJSFileBytes);
        console.log('watcher and browsersync safely terminated');
        process.exit(0);
    }
    process.on('SIGINT', exitHandler);
    process.on('SIGABRT', exitHandler);
    process.on('SIGQUIT', exitHandler);
    process.on('SIGTERM', exitHandler);
}
catch(e) {
    console.log('ERROR in DEV build and watching: ', e)
    
    if(originalPageJSFileBytes) {
        removeGlobalBehavior(originalPageJSFileBytes);
    }
}