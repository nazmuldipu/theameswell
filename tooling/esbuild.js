'use strict';
import esbuild from 'esbuild';
import {readFileSync} from 'fs';
import {join} from 'path';
import { rmNoExist } from './lib.js';

/**
 * We assume that the relative paths given in metadata
 * can be made absolute by process.cwd()
 * because we assume that build commands will be run at the project
 * root directory
 * @param {*} metadata -- esbuild metafile output
 */
export const getJSBuildDeps = metadata =>
    new Set(Object
        .keys(metadata.inputs)
        .map(relativePath => join(process.cwd(), relativePath)))


/**
 * 
 * @param {String[]} inputPaths 
 * @param {String} outDir 
 * @param {String} outBase
 * @param {String} metafilePath
 */
export const buildJS = async (inputPaths, outDir, outBase, metafilePath) => {
    //make sure to tune the operation based on environment
    await esbuild.build({
        entryPoints: inputPaths,
        bundle: true,
        format: 'esm',
        external:[ 
            '*.jpg',
            '*.webp',
            '*.png',
            '*.woff',
            '*.woff2',
            '*.ttf'
        ],
        outdir: outDir,
        outbase: outBase,
        target: ['es2017'],
        minify: process.env.NODE_ENV === 'production',
        metafile: metafilePath
    });

    const metadata = JSON.parse(readFileSync(metafilePath));
    await rmNoExist(metafilePath);
    return {
        buildDeps: getJSBuildDeps(metadata),
        outputFiles: Object.keys(metadata.outputs)
    };
}