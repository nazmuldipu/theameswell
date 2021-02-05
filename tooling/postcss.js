'use strict';

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { createRequire } from 'module';
import postcss from 'postcss';
import { replacePathBase, setUnion } from './lib.js';

const require = createRequire(import.meta.url);

const plugins = [
    require('postcss-import'),
    require('tailwindcss')('./tailwind.config.cjs'),
    require('postcss-nesting')
];

if (process.env.NODE_ENV === 'production') {
    plugins.push(require('autoprefixer'));
    plugins.push(require('cssnano')({ preset: 'default' }));
}

const processor = postcss(plugins);

/**
 * 
 * @param {String} inputPaths 
 * @param {String} outputDir 
 * @param {String} oldBase
 * 
 * @returns {Promise<Set<String>>} 
 */
export const buildCSS = (inputPaths, outputDir, oldBase) => {
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