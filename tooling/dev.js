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
    getPageDataMap,
    getPageJSONFilePromises,
    replacePathBase,
    rmNoExist,
    PAGES_DIR,
    BUILD_DIR,
    globForPages,
    globForExts
} from './lib.js'
import { buildJS } from './esbuild.js';
import { buildCSS } from './postcss.js';
import { watchEventHandler } from './watching.js';


const entryPoints = getPageAssets(PAGES_DIR).flat();
const outputPoints = entryPoints.map(point => 
    replacePathBase(point, BUILD_DIR.pathname, basename(PAGES_DIR.pathname)));

const pageDataMap = getPageDataMap(outputPoints);

const promises = getPageJSONFilePromises(pageDataMap, PAGES_DIR.pathname);
// remove previously built assets
promises.push(rmNoExist(BUILD_DIR.pathname));

const metafilePath = join(BUILD_DIR.pathname, 'meta.json');

try {
    // execute first builds
    console.log('Beginning Development Builds')
    console.log('calculating built site filepaths');
    console.log('removing previous builds');
    await Promise.all(promises);
    console.log('Created bundled file data JSON files');
    console.log('beginning site build processes');
    const [cssDepSet, {buildDeps: jsDepSet}] = await Promise.all([
        buildCSS(
            entryPoints.filter(filterForExt('.css')), 
            BUILD_DIR.pathname, 
            basename(PAGES_DIR.pathname)
        ),
        // js
        buildJS(
            entryPoints.filter(filterForExt('.js')),
            BUILD_DIR.pathname,
            PAGES_DIR.pathname,
            metafilePath
        ),
        // 11ty
        exec('npm run build:html')
    ]);
    console.log('js and css and html built; now setting up dev server and file watchers');
    // watch
    const watcher = chokidar.watch(
        [
            ...cssDepSet,
            ...jsDepSet,
            globForPages(['.css', '.js']),
            globForExts(['.njk', '.json'], PAGES_DIR.pathname)
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

    const exitHandler = signal => {
        console.log(`received termination signal ${signal}. Cleaning up and exiting`);
        bs.exit();
        watcher.close().then(() => {
            console.log('watcher and browsersync safely terminated');
            process.exit(0);
        });
    }
    process.on('SIGINT', exitHandler);
    process.on('SIGABRT', exitHandler);
    process.on('SIGQUIT', exitHandler);
    process.on('SIGTERM', exitHandler);
}
catch(e) {
    console.log('ERROR in DEV build and watching: ', e)
}