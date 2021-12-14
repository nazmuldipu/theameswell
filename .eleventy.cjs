'use strict';

const htmlmin = require('html-minifier');
const { basename, join, parse } = require('path');
const { copyFileSync,  readdirSync, renameSync, openSync } = require('fs');
const { getImgSizes, getSrcSet, buildOutputDir, get_resized_image_url, getImageUrl } = require('./tooling/eleventy.cjs');
const util = require('util');

module.exports = function(eleventyConfig) {
    eleventyConfig.addNunjucksShortcode('access', function(array, index) {
        return array[index];
    });

    eleventyConfig.addNunjucksFilter('slideImgSrcSet', function(slide, imgext="jpg") {
        const name = basename(slide.image);
        const sizes = getImgSizes(name);
        return getSrcSet(name, sizes, slide.intrinsicwidth, imgext);
    });

    eleventyConfig.addNunjucksFilter('imgObjSrcSet', function(imgObj, imgext="jpg") {
        const name = basename(imgObj.src);
        const sizes = getImgSizes(name);
        const path = parse(imgObj.src).dir;
        return getSrcSet(name, sizes, imgObj.intrinsicwidth, imgext, path);
    });

    eleventyConfig.addNunjucksFilter('cmsImgObjSrcSet', function(imgObj, type) {
        const dimensions = [320, 600, 640, 900, 1200, 1280, 1536] ;
        return get_resized_image_url(imgObj.src, dimensions, (type + "" ).trim());
    });

    eleventyConfig.addNunjucksFilter('theImgSrc', function(value) {
        return getImageUrl(value)
    });

    eleventyConfig.addNunjucksFilter('getImgSourceType', function(type='jpeg') {
        switch(type) {
            case 'jpg':
                return 'jpeg';
            default:
                return type;
        }
    });

    // dump object data.
    eleventyConfig.addNunjucksFilter( 'json', function ( value ) {
        if (value) {
            let str = JSON.stringify(value)
            return str?.replace(/(<svg.*?<\/svg>)/g,"raw svg load from db")
        }
        return '{}'
    } )

    eleventyConfig.addNunjucksFilter( 'getAssetsPath', function ( path, permalink) {
        const path_parts = permalink.split('/').slice(0, -1).join('/').replace('build', '');
        const parsed_path = path.replace(path_parts, '');
        return "/" + parsed_path;
    } )

    eleventyConfig.addNunjucksFilter( 'parseUrl', function (url) {
        const toIgnorePatterns = ["http://", "https://", 'mailto:', 'tel:'];
        /* will return url as it is except for relative urls */
        return toIgnorePatterns.filter(pattern => url.includes(pattern)).length > 0 ? url : "/" + url;
    } )

    if (process.env.MINIMAL_PREVIEW) {
         // nothing to copy for preview
    } else {
        eleventyConfig.addPassthroughCopy({ 'components/lib': 'lib' })
        
        eleventyConfig.addPassthroughCopy('videos');
    
        eleventyConfig.addPassthroughCopy({ 'images/output': 'images' });
    
        eleventyConfig.addPassthroughCopy({ 'images/svg': 'images' });
    
        eleventyConfig.addPassthroughCopy('fonts');
    
        eleventyConfig.addPassthroughCopy('favicon.*');
    
        eleventyConfig.addPassthroughCopy('robots.txt');
    }
    
    eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
        if(outputPath.endsWith('.html')) {
            const newContent = htmlmin.minify(content, {
                useShortDoctype: true,
                collapseWhitespace: true,
                preserveLineBreaks: true
            });
            return newContent;
        }
        return content;
    });

    /* eleventyConfig.on('afterBuild', () => {
        readdirSync(buildOutputDir).forEach((name) => {
            if(name.endsWith('.html')) {
                const noExtPath = join(buildOutputDir, name.slice(0, -5))
                openSync(noExtPath)
                copyFileSync(join(buildOutputDir, name), noExtPath);  // '.html'.length
            }
        });
    }); */

    return {
        dir: {
            output: 'build',
            input: 'pages',
            layouts: '_layouts',
            includes: '_includes'
        }
    };
}
