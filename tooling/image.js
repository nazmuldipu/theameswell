import ImageTracer from 'imagetracerjs';
import fs from 'fs';
import sharp from 'sharp';
import path, { join } from 'path';

const imagesPath = new URL('../images', import.meta.url);

const { data, info } = await sharp(join(imagesPath.pathname, 'hero-home-large.jpg')).resize(800).raw().toBuffer({ resolveWithObject: true })
const { data: data1, info: info1 } = await sharp(join(imagesPath.pathname, 'hero-home-large.jpg')).resize(600, 800).raw().toBuffer({ resolveWithObject: true })

const svgStr = ImageTracer.imagedataToSVG(
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
fs.writeFileSync(path.join(imagesPath.pathname, 'hero-vector-900.svg'), svgStr1)

/* await sharp(join(imagesPath.pathname, 'hero-home-large.jpg')).resize(900, 1800)
    .toFile(join(imagesPath.pathname, `hero-home-900.jpg`))
const heroWebp = await sharp(join(imagesPath.pathname, 'hero-home-large.jpg')).webp({ lossless: true }).toBuffer();
await sharp(heroWebp).toFile(join(imagesPath.pathname, 'hero-home-large.webp'))
await sharp(heroWebp).resize(4500).toFile(join(imagesPath.pathname, 'hero-home-4500.webp'))
await sharp(heroWebp).resize(900, 1200).toFile(join(imagesPath.pathname, 'hero-home-900.webp'))
await sharp(join(imagesPath.pathname, 'hero-home-large.jpg')).resize(900, 1200)
    .toFile(join(imagesPath.pathname, `hero-home-900.jpg`))
await sharp(join(imagesPath.pathname, 'hero-home-large.jpg')).resize(4500)
    .toFile(join(imagesPath.pathname, `hero-home-4500.jpg`))
 */
/**
 * TODO:
 * - Do this for all input images
 * - have image data objects be input that dictates what sort of processing they need to go through
 * - use streaming / other library affordances to get work done in parallel
 */