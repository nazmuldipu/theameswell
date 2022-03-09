'use strict';
import path, {extname, join, sep } from 'path';
import { accessSync, readdirSync, statSync, writeFileSync, createReadStream, existsSync } from 'fs';
import {platform} from 'os';
import {rm, writeFile} from 'fs/promises';
import { once } from 'events';
import { createInterface } from 'readline';
import compose from "just-compose";
import beautify from 'js-beautify';

export const prettyJSONStringify = json => JSON.stringify(json, null, 2);

export const LOAD_TYPE_REGEX = /-([A-Za-z]+)\./;

export const GITIGNORE_EMPTY_DIR = `*
*/
!.gitignore`;

export const INDEX_PAGE = 'index';
export const HOTEL_SITE_URL = "https://www.theameswellhotel.com/";
/**
 * 
 * @param {Set} a 
 * @param {Set} b 
 */
export const setDifference = (a, b) => 
    new Set([...a].filter(x => !b.has(x)));

export const setUnion = setArr => 
    new Set(setArr.reduce((arr, set) => [...arr, ...set], []));

export const defaultExtValidator = fileName => {
    const extension = extname(fileName);
    return extension === '.js' || extension === '.css' || extension === '.html';
};

export const defaultIgnorePattern = ['_'];

/**
 * 
 * @param {Object} obj 
 * @param {String} propertyPath -- a dotted path like 'a.b.c'
 */
 export const getNestedProperty = (obj, propertyPath) => 
 propertyPath.split('.').reduce((layer, prop) => {
     return layer?.[prop]
 }, obj);

export const globForExts = (extensions, prefix='**/*') => join(prefix, `**/*@(${extensions.join('|')})`);

export const getWatchedPaths = watcher => {
    const filePaths = Object.entries(watcher.getWatched()).reduce((paths, [dirPath, filenames]) => {
        return [...paths, ...filenames.map(name => join(dirPath, name))];
    }, []);
    // dedupe
    return [...new Set(filePaths)];
}

export const filterForExt = ext => filename => extname(filename) === ext;
export const globForPrefixExt = (prefix, fileGlob='*', dirGlob='**') => exts => join(prefix, `!(_)${dirGlob}/${fileGlob}@(${exts.join('|')})`);

const pagesURL = new URL('../pages', import.meta.url);
const buildURL = new URL('../build', import.meta.url);
const scriptsURL = new URL('../scripts', import.meta.url);
const componentLibURL = new URL('../components', import.meta.url);
const rootURL = new URL('..', import.meta.url);

let buildPathName = decodeURI(buildURL.pathname);
let pagesPathName = decodeURI(pagesURL.pathname);
let scriptsPathName = decodeURI(scriptsURL.pathname);
let componentLibPathName = decodeURI(componentLibURL.pathname);
let rootPathName = decodeURI(rootURL.pathname);

if (platform() === 'win32') {
    // need to get rid of prefixing path on windows
    rootPathName = rootPathName.slice(1);
    scriptsPathName = scriptsPathName.slice(1);
    buildPathName = buildPathName.slice(1);
    pagesPathName = pagesPathName.slice(1);
    componentLibPathName = componentLibPathName.slice(1);
}

export const ROOT_DIR = {
    pathname: rootPathName
};
export const BUILD_DIR = {
    pathname: buildPathName
};
export const PAGES_DIR = {
    pathname: pagesPathName
};
export const SCRIPTS_DIR = {
    pathname: scriptsPathName
};
export const COMPONENT_DIR = {
    pathname: componentLibPathName
};

export const globForPages = globForPrefixExt(PAGES_DIR.pathname);
export const globForScripts = (fileGlob) => globForPrefixExt(SCRIPTS_DIR.pathname, fileGlob);

/**
 * 
 * @param {String} filePath -- this is expected to be an absolute path
 * @param {String} newBasePath -- this is expected to be an absolute path
 * @param {String} oldBase -- this is expected to be a directory name
 */
export const replacePathBase = (filePath, newBasePath, oldBase) => {
    const tokens = filePath.split(sep);
    return join(newBasePath, ...tokens.slice(tokens.indexOf(oldBase) + 1))
}

export const removePrefix = (str, prefix) => str.slice( str.indexOf(prefix) + prefix.length );

/**
 * Looks for files like the following:
 * ${pagesDir}/${pageName}/${assetName}.${ { e | e in extensions } }
 * @param {URL} pagesDir -- absolute directory path
 * @param {Set} extensions -- valid file extensions
 */
export const getPageAssetsExtMap = ({ pathname }, extensions) => 
    readdirSync(pathname).reduce((extMap, pageName) => {
        if (!pageName.startsWith("_")) {
            readdirSync(join(pathname, pageName)).forEach(fileName => {
                const ext = extname(fileName);
                if (extensions.has(ext)) {
                    !extMap.has(ext) && extMap.set(ext, []);
                    const filePath = join(pathname, pageName, fileName);
                    extMap.get(ext).push(filePath);
                }
            })
        }
        return extMap;
    }, new Map());

export const getAssetFiles = (pathname, isValidExt) => {
    return readdirSync(pathname).flatMap(pageName => {
        // ignore non-page dirs
        const pageDirPath = join(pathname, pageName);
        if (!pageName.startsWith("_")
                // make sure pageDirPath is a dir
                && statSync(pageDirPath, { throwIfNoEntry: false }).isDirectory()) {
            const pageDirContents = readdirSync(pageDirPath)
                // only process certain file types
                .flatMap(fileName => {
                    return isValidExt(fileName)
                    ? [ join(pathname, pageName, fileName) ]
                    : []
                } );
            return [ pageDirContents ]
        }
        return []
    });
}    

export const getPageAssets = ({ pathname }, isValidExt=defaultExtValidator) => {
    return getAllFiles(pathname)
        .filter(filePath => isValidExt(filePath))  
}

/**
 * The purpose of this function is to collect the paths for 
 * top level JS files in the parameter pathname
 * We ignore nested directories
 * @param {String} pathname 
 */
export const getJSLibAssets = (pathname) => 
    readdirSync(pathname).reduce((jsAssets, assetName) => {
        // ignore non-page dirs
        const assetPath = join(pathname, assetName);
        if (extname(assetPath) === '.js') {
            jsAssets.push(assetPath);
        }
        return jsAssets;
    }, []);

/**
 * we look in the top-levels for styles/bundle and styles/process
 * @param {String} pathname 
 */
export const getCSSLibAssets = (pathname) => {
    const retObj = {};
    ['bundle', 'process'].forEach(term => {
        try {
            const assetsPath = join(pathname, 'styles', term);
            accessSync(assetsPath);
            retObj[term] = readdirSync(assetsPath).reduce((cssAssets, assetName) => {
                const assetPath = join(pathname, 'styles', term, assetName);
                if (extname(assetPath) === '.css') {
                    cssAssets.push(assetPath);
                }
                return cssAssets;
            }, []);
        } catch (e) {} // we catch errors from fs.access as part of its detection of ENOENT
    });
    return retObj;
}

export const rmNoExist = (pathname) => {
    return rm(pathname, { recursive: true }).catch(err => {
        // build continues if file or directory doesn't exist
        if(err.code === 'ENOENT') {
            return Promise.resolve();
        }
        return Promise.reject(err);
    });
};

export const getPathLoadType = token => LOAD_TYPE_REGEX.test(token)
                                        ? LOAD_TYPE_REGEX.exec(token)[1]
                                        : '';
export const getPageDataMap = (outputFiles, prefix='') => outputFiles.reduce((map, assetPath) => {
    // we only want to build template data for handled file types
    if(defaultExtValidator(assetPath)) {
        const pathTokens = assetPath.split(sep).slice(-2);
        /* key is page url */
        const key = path.parse(assetPath).dir.split('/build/')[1];
        /* except for index file we need to use relative path to current directory */
        const pathToUse = key !== INDEX_PAGE ? './' + pathTokens[1] : prefix + join(...pathTokens)
        if(!map.has(key)) {
            map.set(key, {});
        }
        const prev = map.get(key);    
        const loadType = getPathLoadType(pathTokens[1]);
        map.set(key, { 
            ...prev,
            [`${loadType}_${extname(pathTokens[1]).slice(1)}`]: pathToUse
        });
    }
    return map;
}, new Map());

export const getPageJSONFilePromises = (dataMap, dirPath) => platform() === 'win32'
                                            ? [] 
                                            : [...dataMap.entries()].map(([page, assets]) =>{
                                                const fileName = page.includes('/') ? page.split('/').slice(-1)[0] : page;
                                                return writeFile(
                                                    join(dirPath, page, `${fileName}.json`),
                                                    JSON.stringify(assets)
                                                )});

export const constructSiteMap = (dirPath, urlBase) => {
    const urls = readdirSync(dirPath)
        .filter(fileDir => {
            const isIndex = fileDir === INDEX_PAGE;
            const isValidPage = existsSync(join(dirPath, fileDir, 'index.html'));
            return isIndex || isValidPage;
        })
        /* to prevent a url of www.sitename.com/index */
        .map(fileName => fileName === INDEX_PAGE ? '' : fileName)
        .map(fileName => `<url>
            <loc>${new URL(fileName, urlBase).href}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            </url>`
        );

    const sitemapStr = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('\n')}
    </urlset>`;

    writeFileSync(join(dirPath, 'sitemap.xml'), sitemapStr);
}                                               

export const metafilePath = (filename) => join(BUILD_DIR.pathname, filename);

export const removeDuplicateFromPageData = (pageData) => {
    if(!pageData) return pageData;
    return pageData.split(';')
        .map(x => x.replace('\n', '').replace('\n', ''))
        .filter((value, index, array) => {
            return array.indexOf(value) === index && value;
        }).join(';');
}
export const addNewLineToString = (string) => {
    if(!string) return string;
    const stringArray = string.split(';');
    return stringArray.filter(Boolean).map(x => x.replace('\n', '').replace('\n', '') + ';').join('\n');
}
export const addSemicolonIfMissing = (string) => {
    if(!string) return string;
    if(!string && typeof string !== 'string') return string;
    return string.lastIndexOf(';') === string.length - 1 ? string : string + ";";
}

export const formatCode = (code) => {
    return beautify(code, { indent_size: 2, space_in_empty_paren: true, preserve_newlines: true });
}

export const sanitizePageData = compose(removeDuplicateFromPageData, addSemicolonIfMissing, addNewLineToString, formatCode);

const getAllFiles = (dirPath, arrayOfFiles = [], ignorePatterns = defaultIgnorePattern) => {
    let files = readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {  
        // for each file in the directory
        if (!isIgnoredFile(file, ignorePatterns) && statSync(dirPath + "/" + file, { throwIfNoEntry: false }).isDirectory()) {
            getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else if(!isIgnoredFile(file, ignorePatterns)) {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    })  
    return arrayOfFiles
  }

  const isIgnoredFile = (file, ignorePatterns) => {
    return ignorePatterns.some(pattern => {
        return file.startsWith(pattern);
    });
  }

  export const getFirstLine = async (filePath) => {
    let result = '';
    let counter = 0;
    try {
      const rl = createInterface({
        input: createReadStream(filePath),
        crlfDelay: Infinity
      });
  
      rl.on('line', (line) => {
        if(counter > 0){
            rl.close();
        }else{
            result = line;
        }
        counter++;
      });
  
      await once(rl, 'close');
      
    } catch (err) {
      console.error(err);
    }
    return result;
}
