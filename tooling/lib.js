'use strict';
import {extname, join, sep} from 'path';
import {readdirSync, lstatSync} from 'fs';
import {rm, writeFile} from 'fs/promises';

export const prettyJSONStringify = json => JSON.stringify(json, null, 2);

export const LOAD_TYPE_REGEX = /-([A-Za-z]+)\./;

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
    return extension === '.js' || extension === '.css';
};

export const globForExts = (extensions, prefix='**/*') => join(prefix, `**/*@(${extensions.join('|')})`);

export const getWatchedPaths = watcher => {
    const filePaths = Object.entries(watcher.getWatched()).reduce((paths, [dirPath, filenames]) => {
        return [...paths, ...filenames.map(name => join(dirPath, name))];
    }, []);
    // dedupe
    return [...new Set(filePaths)];
}

export const filterForExt = ext => filename => extname(filename) === ext;
export const globForPrefixExt = prefix => exts => join(prefix, `!(_)**/*@(${exts.join('|')})`);

export const PAGES_DIR = new URL('../pages', import.meta.url);
export const globForPages = globForPrefixExt(PAGES_DIR.pathname);
export const BUILD_DIR = new URL('../build', import.meta.url);

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
export const getPageAssetsExtMap = (pagesDir, extensions) => 
    readdirSync(pagesDir).reduce((extMap, pageName) => {
        if (!pageName.startsWith("_")) {
            readdirSync(join(pagesDir.pathname, pageName)).forEach(fileName => {
                const ext = extname(fileName);
                if (extensions.has(ext)) {
                    !extMap.has(ext) && extMap.set(ext, []);
                    const filePath = join(pagesDir.pathname, pageName, fileName);
                    extMap.get(ext).push(filePath);
                }
            })
        }
        return extMap;
    }, new Map());

export const getPageAssets = (pagesDir, isValidExt=defaultExtValidator) => readdirSync(pagesDir)
    .flatMap(pageName => {
        // ignore non-page dirs
        const pageDirPath = join(pagesDir.pathname, pageName);
        if (!pageName.startsWith("_")
                // make sure pageDirPath is a dir
                && lstatSync(pageDirPath, { throwIfNoEntry: false }).isDirectory()) {
            const pageDirContents = readdirSync(pageDirPath)
                // only process certain file types
                .flatMap(fileName => isValidExt(fileName)
                                        ? [ join(pagesDir.pathname, pageName, fileName) ]
                                        : [] );
            return [ pageDirContents ]
        }
        return []
    });

export const rmNoExist = (pathname) => {
    return rm(pathname, { recursive: true }).catch(err => {
        // build continues if file or directory doesn't exist
        if(err.code === 'ENOENT') {
            return Promise.resolve();
        }
        return Promise.reject(err);
    });
};

export const getPageDataMap = (outputFiles, prefix='') => outputFiles.reduce((map, assetPath) => {
    // we only want to build template data for handled file types
    if(defaultExtValidator(assetPath)) {
        const pathTokens = assetPath.split(sep).slice(-2);
        if(!map.has(pathTokens[0])) {
            map.set(pathTokens[0], {});
        }
        const prev = map.get(pathTokens[0]);
        const loadType = LOAD_TYPE_REGEX.test(pathTokens[1])
            ? LOAD_TYPE_REGEX.exec(pathTokens[1])[1]
            : '';
        map.set(pathTokens[0], { 
            ...prev,
            [`${loadType}_${extname(pathTokens[1]).slice(1)}`]: prefix + join(...pathTokens)
        });
    }
    return map;
}, new Map());

export const getPageJSONFilePromises = (dataMap, dirPath) => 
                                            [...dataMap.entries()].map(([page, assets]) =>
                                                writeFile(
                                                    join(dirPath, page, `${page}.json`),
                                                    JSON.stringify(assets)
                                                ));