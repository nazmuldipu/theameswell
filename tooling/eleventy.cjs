"use strict";

const { readdirSync } = require("fs");
const { join } = require("path");

const DIMENSION_SEP = "_";

const imgOutputDir = join(__dirname, "..", "images", "output");
const buildOutputDir = join(__dirname, "..", "build");

const mediaBaseUri = () => {
  return process.env.CLOUDFRONT_URL ?? ''
}
/**
 *
 * @param imgName
 * @returns String
 */
const getImgSizes = (imgName) => {
  const sizes = readdirSync(imgOutputDir)
    .filter((filename) => filename.startsWith(imgName))
    .reduce((sizes, filename) => {
      // anticipating filenames of form <name>-<size>.<ext>
      const sizeEnd = filename.lastIndexOf(".");
      const sizeStart = filename.lastIndexOf(DIMENSION_SEP) + 1;
      const fileSize = filename.substring(sizeStart, sizeEnd);
      // filter out original file
      !isNaN(fileSize) && sizes.push(fileSize);
      return sizes;
    }, []);
  return [...new Set(sizes)];
};

/**
 *
 * @param imgName
 * @param sizes
 * @param originalWidth
 * @param ext
 * @returns String
 */
const getSrcSet = (imgName, sizes, originalWidth, ext, path='images') => {
  const srcSetArr = [`${path}/${imgName}.${ext} ${originalWidth}w`];
  return srcSetArr
    .concat(
      sizes.map(
        (size) => `${path}/${imgName}${DIMENSION_SEP}${size}.${ext} ${size}w`
      )
    )
    .join(",\n");
};


function get_resized_image_url(url, dimensions, type) {
    let last_index = url.lastIndexOf(".");
    let file_name = url.substr(0, last_index).replace("/upload/", "/resized/");
    let extension = url.substring(last_index + 1);
    let resized_urls = dimensions.map(
      (dim) => mediaBaseUri() + file_name + "_" + dim + "." + type + ` ${dim}w`
    );
    return resized_urls;
}

const getImageUrl = (url) => {
  //let file_name = url.replace("/upload/", "/resized/");
  return mediaBaseUri() + url
}

module.exports = { 
  getImgSizes,
  getSrcSet,
  buildOutputDir,
  get_resized_image_url,
  getImageUrl
};
