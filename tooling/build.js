'use strict';

import { basename, join } from 'path';
import { promisify } from 'util';
import child_process from 'child_process';
import {
    getPageAssets, 
    replacePathBase, 
    PAGES_DIR,
    BUILD_DIR,
    getPageDataMap,
    getPageJSONFilePromises,
    filterForExt,
    rmNoExist
} from './lib.js';
import { buildCSS } from './postcss.js';
import { buildJS } from './esbuild.js';

const exec = promisify(child_process.exec)

const entryPoints = getPageAssets(PAGES_DIR).flat();
const outputPoints = entryPoints.map(point => 
    replacePathBase(point, BUILD_DIR.pathname, basename(PAGES_DIR.pathname)));

const pageDataMap = getPageDataMap(outputPoints);

const promises = getPageJSONFilePromises(pageDataMap, PAGES_DIR.pathname);
// remove previously built assets
promises.push(rmNoExist(BUILD_DIR.pathname));

const metafilePath = join(BUILD_DIR.pathname, 'meta.json');
try {
    console.log('calculating built site filepaths');
    console.log('removing previous builds');
    await Promise.all(promises);
    console.log('Created bundled file data JSON files');
    console.log('beginning site build processes');
    await Promise.all([
        // TODO -- opportunity to reduce computation here (duplicate replacePathBase work)
        // maybe refactor arguments to take an options object
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
        // html
        exec('npm run build:html')
    ]);
    
    console.log('SUCCESS -- site assets built');
}
catch (e) {
    console.error('There was an error in the build process', e)
    process.exit(1);
}