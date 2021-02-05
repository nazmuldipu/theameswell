'use strict';

import chokidar from 'chokidar';
import { extname, basename } from 'path';
import { 
    BUILD_DIR,
    getPageAssets,  
    globForPages, 
    PAGES_DIR, 
 } from './lib.js';
import { buildCSS } from './postcss.js';
import { watchEventHandler } from './watching.js'

let pageAssets = getPageAssets(PAGES_DIR, filename => extname(filename) === '.css').flat();


try {
    console.log('BUILDING CSS');
    const depPathSet = await buildCSS(pageAssets, BUILD_DIR.pathname, basename(PAGES_DIR.pathname));
    console.log('CSS Built; setting up file watching for hot reloading');
    // add glob to watch for new entrypoints
    depPathSet.add(globForPages(['.css']));
    // we watch only specific files and new entrypoints in the Pages directory
    const watcher = chokidar.watch([...depPathSet], {ignoreInitial: true});
    // just watching on changes and adds should cover our use case
    const handler = watchEventHandler(watcher, new Set(['.css']), BUILD_DIR);
    watcher.on('add', handler('add'))
    watcher.on('change', handler('change'));
    watcher.on('unlink', handler('unlink'));
    watcher.on('unlinkDir', handler('unlinkDir'));
}
catch (e) {
    console.error('Error in CSS dev build / watching: ', e);
}

