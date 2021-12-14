'use strict';
import { join, basename, extname } from 'path';
import {exec as e} from 'child_process';
import { promisify } from 'util';
const exec = promisify(e);
import {
    getPageAssetsExtMap,
    getPageJSONFilePromises,
    getPageDataMap,
    replacePathBase,
    PAGES_DIR,
    BUILD_DIR,
    getWatchedPaths,
    setDifference,
    setUnion,
    ROOT_DIR
} from './lib.js';
import { buildCSS } from './postcss.js';
import { buildJS } from './esbuild.js';

/**
 * Note that this could be improved to make the JSON rebuilding
 * more efficient by:
 *   using a dependency tree to only rebuild affected entrypoint JSON
 * @param {Map} assetMap 
 */
const rebuildPageJSON = async (assetMap) => {
    const outputPoints = [...assetMap.values()].flat().map(point =>
        replacePathBase(point, BUILD_DIR.pathname, basename(PAGES_DIR.pathname)));
    const pageDataMap = getPageDataMap(outputPoints);
    const promises = getPageJSONFilePromises(pageDataMap, PAGES_DIR.pathname);
    return await Promise.all(promises);
}

const isTemplateExt = ext => {
    switch(ext) {
        case '.njk':
        case '.json':
            return true;
        default:
            return false;
    }
}

/**
 * we should rebuild page JSON only for filepaths that
 * are in the Pages directory and with certain extensions
 * @param {String} path -- expects an absolute file path
 */
const shouldRebuildPageJSON = path => {
    const ext = extname(path);
    return ( path.startsWith(PAGES_DIR.pathname) || path.startsWith(ROOT_DIR.pathname) )
        && (
            ext === '.js'
            || ext === '.css'
        );
}

/**
 * 
 * @param {*} pageAssetMap 
 * @param {*} extsToBuild 
 * @param {*} path 
 * @returns Boolean
 */
const shouldRebuildCSS = (pageAssetMap, extsToBuild, path) => 
     ( pageAssetMap.has('.css') && extsToBuild.has('.css') )
     || basename(path) === 'tailwind.config.cjs'
     || [...extsToBuild].some(isTemplateExt);

/**
 * 
 * @param {*} pageAssetMap 
 * @param {*} extsToBuild 
 * @param {*} path 
 * @returns 
 */
const shouldRebuildJS = (pageAssetMap, extsToBuild, path) => 
    ( pageAssetMap.has('.js') && extsToBuild.has('.js') )
    || basename(path) === '.eleventy.cjs'

/**
 * Eventually, I probably want to convert this to a watch manager
 * Will want to have feature sets like queueing, bundled building, etc.
 * 
 * There are also numerous ways to make the execution of this more efficient
 * -- rebuildPageJSON could be more targeted
 *     (e.g. only rebuild json for the directory of the path being rebuilt)
 * -- could batch JSON rebuilds
 *      (right now, a JS change in the pages directory kicks off sequential builds for each page JSON)
 * @param {chokidar.FSWatcher} watcher 
 * @param {Set} extensions -- these are for files that will be part of template data json
 * @param {URL} outputDir
 * @param {Function} cb -- a callback to execute at the end of the event handler
 */

// to do -- may want to eventually evolve these stateful variables
// enclosed in this module and closed over by the exported handler
// into a proper class
let isCurrentlyBuilding = false;
let nextBuild;
let buildExtTypes = new Set();

const rebuildAssets = async (
    watcher, extensions, outputDir, cb, event, extsToBuild, path
) => {
    console.log(`REBUILDING event::'${event}'`, path);
    const pageAssetMap = getPageAssetsExtMap(PAGES_DIR, extensions);
    const buildPromises = [];
    if (shouldRebuildCSS(pageAssetMap, extsToBuild, path)) {
        buildPromises.push(
            buildCSS(
                pageAssetMap.get('.css'),
                outputDir.pathname, 
                basename(PAGES_DIR.pathname)
            )
        );
    }
    if (shouldRebuildJS(pageAssetMap, extsToBuild, path)) {
        buildPromises.push(
            buildJS(
                pageAssetMap.get('.js'),
                outputDir.pathname,
                PAGES_DIR.pathname,
                join(outputDir.pathname, 'meta.json')
            ).then(({ buildDeps }) => buildDeps)
        );
    }
    if ([...extsToBuild].some(isTemplateExt)) {
        // we assume no need to add or remove manual files for this
        // class of files
        // resolves to a set to match resolutions of CSS and JS promises
        buildPromises.push(
            exec('npm run watch:html').then(() => new Set())
        );
    }

    let depPathSet = await Promise.all(buildPromises)
                                .then(pathSets => setUnion(pathSets));
                                // need to get extensions to govern build process, push to promises for Promises.all
    const watchedFiles = getWatchedPaths(watcher);
    const watchedFilesSet = new Set(watchedFiles);
    // we want to add dependencies that are not yet watched
    const pathsToAdd = setDifference(depPathSet, watchedFilesSet);

    watcher.add([...pathsToAdd]);
    console.log('ASSETS REBUILT');

    if (shouldRebuildPageJSON(path)) {
        await rebuildPageJSON(pageAssetMap);
        console.log('JSON metafiles rebuilt');
    }

    console.log('REBUILD DONE');
    if (cb) {
        cb();
    }
    // kickoff enqueued build if available
    if (nextBuild) {
        console.log(`enqueued rebuild beginning for ${nextBuild.path}`);
        const cache = { ...nextBuild }
        nextBuild = null;
        const typesCache = new Set([...buildExtTypes]);
        buildExtTypes.clear();
        await rebuildAssets(
            cache.watcher,
            cache.extensions,
            cache.outputDir,
            cache.cb,
            cache.event,
            typesCache,
            cache.path
        );
    }
}

const getBuildType = path => {
    // get path basename
    switch(basename(path)) {
        case '.eleventy.cjs':
            return '.njk'; // this is hacky. symptom of refactor need
        case 'tailwind.config.cjs':
            return '.css'; // see above
        default:
            return extname(path); 
    } 
}

export const watchEventHandler = (watcher, extensions, outputDir, cb) => event => async path => {
    // will want to edit below -- basically want a helper to check for the special files too
    // e.g. if .eleventy, add '.njk' extension -- is a little brittle, but works
    buildExtTypes.add(getBuildType(path));
    if (isCurrentlyBuilding) {
        console.log(`Currently building. Will queue up next build for ${path} when ready.`);
        // we only enqueue the most recent build request
        nextBuild = { 
            watcher, 
            extensions, 
            outputDir,
            cb, 
            buildExtTypes, 
            event,
            path 
        };
    }
    else {
        isCurrentlyBuilding = true;
        await rebuildAssets(watcher, extensions, outputDir, cb, event, buildExtTypes, path);
        isCurrentlyBuilding = false;
    }
};