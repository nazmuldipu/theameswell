'use strict';

import { basename, join } from 'path';
import { promisify } from 'util';
import child_process from 'child_process';
import {
    getPageAssets,
    getJSLibAssets,
    getCSSLibAssets, 
    replacePathBase,
    metafilePath, 
    PAGES_DIR,
    BUILD_DIR,
    SCRIPTS_DIR,
    COMPONENT_DIR,
    getPageDataMap,
    getPageJSONFilePromises,
    filterForExt,
    rmNoExist,
    constructSiteMap
} from './lib.js';
import { buildCSS, generateTailwindSafeList } from './postcss.js';
import { buildJS, addGlobalBehavior, removeGlobalBehavior } from './esbuild.js';

const exec = promisify(child_process.exec)

const pageEntryPoints = getPageAssets(PAGES_DIR).flat();
// get new entry points for component/lib js and css
// these are from the component libs, which are to be bundled and sent to the server
// so that asynchronously loaded components can dynamically rely on the libraries
const componentJSLibEntryPoints = getJSLibAssets(join(COMPONENT_DIR.pathname, 'lib'));
const componentCSSLibEntryPoints = getCSSLibAssets(join(COMPONENT_DIR.pathname, 'lib'));
const pageOutputPoints = pageEntryPoints.map(point => 
    replacePathBase(point, BUILD_DIR.pathname, basename(PAGES_DIR.pathname))); 
const pageDataMap = getPageDataMap(pageOutputPoints);
const promises = getPageJSONFilePromises(pageDataMap, PAGES_DIR.pathname);
// remove previously built assets
promises.push(rmNoExist(BUILD_DIR.pathname));

let originalPageJSFileBytes;
try {
    console.log('generating tailwindcss safelist');
    generateTailwindSafeList();
    console.log('tailwindcss safelist generated');
    console.log('adding global behavior to pages');
    originalPageJSFileBytes = await addGlobalBehavior(PAGES_DIR, SCRIPTS_DIR);
    console.log('calculating built site filepaths');
    console.log('removing previous builds');
    console.log('global behavior added');
    await Promise.all(promises);
    console.log('Created bundled file data JSON files');
    console.log('beginning site build processes');
    const buildPromises = [
        // TODO -- opportunity to reduce computation here (duplicate replacePathBase work)
        // maybe refactor arguments to take an options object
        buildCSS(
            pageEntryPoints.filter(filterForExt('.css')), 
            BUILD_DIR.pathname, 
            basename(PAGES_DIR.pathname)
        ),
        // page js
        buildJS(
            pageEntryPoints.filter(filterForExt('.js')),
            BUILD_DIR.pathname,
            PAGES_DIR.pathname,
            metafilePath('meta-page.json')
        ),
        // html
        exec('npm run build:html')
    ];
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
                basename(COMPONENT_DIR.pathname),
            )
        );
    }
    await Promise.all(buildPromises);

    constructSiteMap(BUILD_DIR.pathname, 'https://www.marrammontauk.com')
    
    console.log('SUCCESS -- site assets built');
}
catch (e) {
    console.error('There was an error in the build process', JSON.stringify(e, null, 4))
    process.exit(1);
}
finally {
    if(originalPageJSFileBytes) {
       // removeGlobalBehavior(originalPageJSFileBytes);
    }
}