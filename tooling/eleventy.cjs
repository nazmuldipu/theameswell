'use strict';

const { readdirSync } = require('fs');
const { join } = require('path');

const DIMENSION_SEP = '_';

const imgOutputDir = join(__dirname, '..', 'images', 'output');

/**
 * 
 * @param imgName 
 * @returns String
 */
const getImgSizes = imgName => {
    const sizes = readdirSync(imgOutputDir)
                    .filter(filename => filename.startsWith(imgName))
                    .reduce((sizes, filename) => {
                        // anticipating filenames of form <name>-<size>.<ext>
                        const sizeEnd = filename.lastIndexOf('.');
                        const sizeStart = filename.lastIndexOf(DIMENSION_SEP) + 1;
                        const fileSize = filename.substring(sizeStart, sizeEnd);
                        // filter out original file
                        !isNaN(fileSize) && sizes.push(fileSize)
                        return sizes;
                    }, []);
    return [...new Set(sizes)];
}

/**
 * 
 * @param imgName 
 * @param sizes 
 * @param originalWidth 
 * @param ext 
 * @returns String
 */
const getSrcSet = (imgName, sizes, originalWidth, ext) => {
    const srcSetArr = [`images/${imgName}.${ext} ${originalWidth}w`];
    return srcSetArr.concat( sizes.map(size => `images/${imgName}${DIMENSION_SEP}${size}.${ext} ${size}w`) ).join(',\n');
}

module.exports = { getImgSizes, getSrcSet };