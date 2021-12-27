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


// TODO: we will eventually want to include variables like these as env vars
// through a library like dotenv
const getSkipperWebsiteAPIBase = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '"https://hotel-site.skipperhospitality.com"';

        case 'staging':
            return '"https://hotel-site-dev.skipperhospitality.com"';

        default:
            return '"https://hotel-site-dev.skipperhospitality.com"';
    }
};

const getSkipperWebsiteToken = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '"this-is-my-secret-token-ameswell"';

        case 'staging':
            return '"this-is-my-secret-token-ameswell"';

        default:
            return '"this-is-my-secret-token-ameswell"';
    }
};



/**
 * Google Maps API Token goes here
 * @returns API_KEY
 */
 const getGoogleMapsApiToken = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '"AIzaSyAqBsnxV5uQbDoZYikoRuMOd3eKcZ7E568"';
        default:
            return '"AIzaSyAghG_1W2IXIpylPJN6mdQKLcqicijD2vY"';
    }
};

/**
 * Wedding RFP Typeform API ID goes here
 * @returns String
 */
const getWeddingRFPTypeformID = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '"ROLAbgh6"';
        default:
            return '"ROLAbgh6"';
    }
};

/**
 * RFP Typeform API ID goes here
 * @returns String
 */
 const getRFPTypeformID = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '"cvPUGI6P"';
        default:
            return '"cvPUGI6P"';
    }
}

/**
 * Shift Digital GTM ID goes here
 * @returns String
 */
const getShiftDigitalGTMID = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '"GTM-55ZT9LJ"';
        default:
            return '"GTM-FAKE"';
    }
};

/**
 * Skipper GTM ID goes here
 * @returns String
 */
 const getSkipperGTMID = () => {
    switch(process.env.NODE_ENV) {
        case 'production':
            return '"GTM-KKQNLKM"';
        default:
            return '"GTM-FAKE"';
    }
};

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
        minify: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
        metafile: metafilePath,
        define: {
            GOOGLE_MAPS_API_KEY: getGoogleMapsApiToken(),
            SKIPPER_WEBSITE_API_BASE: getSkipperWebsiteAPIBase(),
            SKIPPER_WEB_API_TOKEN: getSkipperWebsiteToken(),
            RFP_TYPEFORM_ID: getRFPTypeformID(),
            WEDDING_RFP_TYPEFORM_ID: getWeddingRFPTypeformID(),
            SKIPPER_GTM_ID: getSkipperGTMID(),
            SHIFT_DIGITAL_GTM_ID: getShiftDigitalGTMID()
        }
    });

    const metadata = JSON.parse(readFileSync(metafilePath));
    await rmNoExist(metafilePath);
    return {
        buildDeps: getJSBuildDeps(metadata),
        outputFiles: Object.keys(metadata.outputs)
    };
}