'use strict';

const htmlmin = require('html-minifier');

module.exports = function(eleventyConfig) {
    eleventyConfig.addNunjucksShortcode('access', function(array, index) {
        return array[index];
    });

    eleventyConfig.addPassthroughCopy('images');

    eleventyConfig.addPassthroughCopy('fonts');

    eleventyConfig.addPassthroughCopy('favicon.ico')
    
    eleventyConfig.addTransform('htmlmin', function(content, outputPath) {
        if(outputPath.endsWith('.html')) {
            return htmlmin.minify(content, {
                useShortDoctype: true,
                collapseWhitespace: true,
                preserveLineBreaks: true
            });
        }
        return content;
    });

    return {
        dir: {
            output: 'build',
            input: 'pages',
            layouts: '_layouts',
            includes: '_includes'
        }
    };
}