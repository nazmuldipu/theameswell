'use strict';
import {rm} from 'fs/promises';
import {extname, join} from 'path';
import { 
    getPageAssets,
    rmNoExist,
    getPageDataMap,
    getPageJSONFilePromises,
    PAGES_DIR,
    BUILD_DIR,
} from './lib.js';
import { buildJS } from './esbuild.js';

// pageAssets is a nested array where each inner array contains assets for a particular page
const pageAssets = getPageAssets(PAGES_DIR, filename => extname(filename) === '.js');

const entryPoints = pageAssets.flat();

try {
    const metafilePath = join(BUILD_DIR.pathname, 'meta.json');
    console.log('removing previous builds')
    await rmNoExist(BUILD_DIR.pathname);
    console.log('bundling and building and loading files');
    const {outputFiles} = await buildJS(entryPoints, BUILD_DIR.pathname, PAGES_DIR.pathname, metafilePath);
    // after build, we take the built filenames and create data for our
    // nunjucks templates
    console.log('Creating bundled file data JSON files');

    // below we create a Map from pagename => { asset_load_type => asset_relative_path }
    const pageDataMap = getPageDataMap(outputFiles);

    // note that this technique assumes that the only meaningful data to 
    // go into ${page}.json comes from this build process
    // for template data that is not build generated, we'll want to explore
    // other convention based naming options
    const promises = getPageJSONFilePromises(pageDataMap, PAGES_DIR.pathname);

    await Promise.all(promises);
    console.log('Created bundled file data JSON files');
    console.log('SUCCESS!');
} catch (err) {
    console.log('THERE WAS AN ERROR IN THE BUILD PROCESS: ', err);
    process.exit(1);
}