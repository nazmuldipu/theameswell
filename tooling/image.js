import { readdir, mkdir } from 'fs/promises';
import sharp from 'sharp';
import pAll from 'p-all';
import { join, extname, basename } from 'path';
import { performance } from 'perf_hooks';
import {rmNoExist} from './lib.js';

const imagesPath = new URL('../images', import.meta.url);
const SRC_DIR = 'src';
const OUTPUT_DIR = 'output';

/**
 * For image paths that are non-webp rasters, we want to additionally produce a webp image for them
 * @param {String} imgFile 
 * @param {Number} dimension 
 */
const pathsForDimension = (imgFile, dimension) => {
    const ext = extname(imgFile);
    const paths = [{
        path: `${imagesPath.pathname}/${OUTPUT_DIR}/${basename(imgFile, ext)}${dimension ? '-' + dimension : ''}${ext}`,
        dimension
    }]
    if (!ext.match(/.(svg|webp)$/i)) {
        paths.push({
            path: `${imagesPath.pathname}/${OUTPUT_DIR}/${basename(imgFile, ext)}${dimension ? '-' + dimension : ''}.webp`,
            dimension
        })
    }
    return paths;
}

/**
 * iteratively add to paths dimension wise until and not including width as long as itself
 * @param {String} imgFile 
 * @param {Number} width 
 */
const getResponsivePaths = (imgFile, width) => {
    const paths = [];
    let dimension = 300;
    while (dimension < width) {
        Array.prototype.push.apply(paths, pathsForDimension(imgFile, dimension));
        dimension *= 2;
    }
    Array.prototype.push.apply(paths, pathsForDimension(imgFile));
    return paths;
};

const formatTranslation = ext => {
    switch(ext) {
        case 'jpg':
            return 'jpeg';
        default:
            return ext;
    }
}

try {
    await rmNoExist(join(imagesPath.pathname, OUTPUT_DIR));
    await mkdir(join(imagesPath.pathname, OUTPUT_DIR));
    const imgFiles = await readdir(join(imagesPath.pathname, SRC_DIR));
    const images = imgFiles
        .filter(imgFile => imgFile.match(/.(jpg|jpeg|png|svg|webp)$/i))
        .map(imgFile => ({
            data: sharp(join(imagesPath.pathname, SRC_DIR, imgFile)),
            path: join(imagesPath.pathname, SRC_DIR, imgFile)
        }))
    
    const conversions = [];
    for(const image of images) {
        const { width } = await image.data.metadata();
        const responsivePaths = getResponsivePaths(image.path, width);
        Array.prototype.push.apply(
            conversions,
            responsivePaths.map(responsivePath =>  
                () => image.data
                        .clone()[ formatTranslation(extname(responsivePath.path).substring(1)) ]()
                        .resize(responsivePath.dimension || width)
                        .toFile(responsivePath.path)
            )    
        )
    }
    const start = performance.now();
    await pAll(conversions, { concurrency: 4 }); //we get diminishing returns around 4
    const end = performance.now();
    console.log('time', end - start)
}
catch (e) {
    // TODO: add automated cleanup of files in case of error
    console.error('error', e)
}

/**
 * Below is some prototype code for creating SVG out of raster for possibility of dynamic load
 */

//import ImageTracer from 'imagetracerjs';

/* const { data, info } = await sharp(join(imagesPath.pathname, 'hero-home-large.jpg')).resize(800).raw().toBuffer({ resolveWithObject: true })
const { data: data1, info: info1 } = await sharp(join(imagesPath.pathname, 'hero-home-large.jpg')).resize(600, 800).raw().toBuffer({ resolveWithObject: true }) */

/* const svgStr = ImageTracer.imagedataToSVG(
    {
        width: info.width,
        height: info.height,
        data
    },
    { qtres:10, ltres:10, numberofcolors:16, blurradius:100, blurdelta: 256, strokewidth:32, scale: 5.625 }
);

fs.writeFileSync(path.join(imagesPath.pathname, 'hero-vector.svg'), svgStr)

const svgStr1 = ImageTracer.imagedataToSVG(
    {
        width: info1.width,
        height: info1.height,
        data: data1
    },
    { qtres:10, ltres:10, numberofcolors:16, blurradius:100, blurdelta: 256, strokewidth:16, scale: 1.5 }
);
fs.writeFileSync(path.join(imagesPath.pathname, 'hero-vector-900.svg'), svgStr1) */
