'use strict';
import chokidar from 'chokidar';
import { join, extname } from 'path';
import { buildJS } from './esbuild.js';
import { watchEventHandler } from './watching.js';
import { 
    PAGES_DIR, 
    BUILD_DIR, 
    globForPages,
    getPageAssets 
} from './lib.js';

let pageAssets = getPageAssets(PAGES_DIR, filename => extname(filename) === '.js').flat();
const metafilePath = join(BUILD_DIR.pathname, 'meta.json');

try {
    console.log('beginning JS Build');
    const { buildDeps } = await buildJS(pageAssets, BUILD_DIR.pathname, PAGES_DIR.pathname, metafilePath);
    console.log('initial JS build finished, starting hot rebuilder');
    buildDeps.add(globForPages(['.js']));
    const watcher = chokidar.watch([...buildDeps, globForPages(['.js'])], { ignoreInitial: true });
    const handler = watchEventHandler(watcher, new Set(['.js']), BUILD_DIR);
    watcher.on('add', handler('add'))
    watcher.on('change', handler('change'));
    watcher.on('unlink', handler('unlink'));
    watcher.on('unlinkDir', handler('unlinkDir'));
}
catch (e) {
    console.error('Error in JS dev build / watching: ', e);
}