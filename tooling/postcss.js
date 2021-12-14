'use strict';

import { readFile, writeFile, mkdir } from 'fs/promises';
import { writeFileSync } from 'fs';
import { join, basename, dirname } from 'path';
import { createRequire } from 'module';
import postcss from 'postcss';
import { replacePathBase, setUnion, getNestedProperty, ROOT_DIR } from './lib.js';
import config from '../tailwind.config.cjs';

const SAFELIST_PAIRS = [
    [ ['theme.extend.backgroundImage', 'bg'], ['no-webp__'] ]
];
const SCREENS_CONFIG_PATH = 'theme.extend.screens';

const require = createRequire(import.meta.url);

/**
 * This function generates a text file of classes for TailwindCSS to ignore in its purge logic
 * It generates classes using screen sizes and selected utility classes defined in the Tailwind config
 */
 export const generateTailwindSafeList = () => {
    // const safelist = SAFELIST_PAIRS.flatMap(( [ [ configPath, typePrefix ], classPrefixes ] ) => {
    //     const configKeys = Object.keys( getNestedProperty(config, configPath) )
    //                         .filter(key => classPrefixes.some( prefix => key.includes(prefix) ));
    //     const screenSizes = Object.keys( getNestedProperty(config, SCREENS_CONFIG_PATH) );
    //     const safelist = configKeys.reduce((safelist, key) => {
    //         const sizes = screenSizes.map(size => `${size}:${typePrefix}-${key}`);
    //         sizes.push(`${typePrefix}-${key}`);
    //         return safelist.concat(sizes);
    //     }, []);
    //     return safelist;
    // });
    
    // writeFileSync(join(ROOT_DIR.pathname, 'tailwind-class-safelist.txt'), safelist.join('\n'));
}

let plugins, processor;

const initializePostCSS = () => {
    if (require.cache[require.resolve('tailwindcss')]) {
        delete require.cache[require.resolve('tailwindcss')];
    }
    if (require.cache[require.resolve('postcss-import')]) {
        delete require.cache[require.resolve('postcss-import')];
    }
    plugins = [
        require('postcss-import')({ skipDuplicates: true }),
        require('tailwindcss')('./tailwind.config.cjs'),
        require('postcss-nesting')
    ];
    
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
        plugins.push(require('autoprefixer'));
        plugins.push(require('cssnano')({ preset: 'default' }));
    }

    processor = postcss(plugins);
}
initializePostCSS();

/**
 * 
 * @param {String} inputPaths 
 * @param {String} outputDir 
 * @param {String} oldBase
 * 
 * @returns {Promise<Set<String>>} 
 */
export const buildCSS = (inputPaths, outputDir, oldBase) => {
    initializePostCSS();
    const promises = inputPaths.map(inputPath => {
        // if we're not give an oldBase, we just glom the filename onto the outputDir path
        const outputPath = oldBase 
            ? replacePathBase(inputPath, outputDir, oldBase)
            : join(outputDir, basename(inputPath))
        return mkdir(dirname(outputPath), { recursive: true })
                .then(() => readFile(inputPath))
                .then(css => processor.process(css, {from: inputPath, to: outputPath}))
                .then(result => writeFile(outputPath, result.css)
                                .then(() => getCSSBuildDeps(result)))
    });
    return Promise.all(promises).then(depSets => setUnion(depSets));
}

/**
 * Also adds top-level via "parents"
 * @param {Message} result -- a PostCSS Result Message
 */
export const getCSSBuildDeps = result => {
    return result.messages.reduce((paths, message) => {
        if (message.type === 'dependency') {
            paths.add(message.file);
            paths.add(message.parent);
        }
        return paths;
    }, new Set());
}