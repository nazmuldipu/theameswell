'use strict';

const htmlmin = require('html-minifier');

module.exports = function(eleventyConfig) {
    eleventyConfig.addNunjucksShortcode('access', function(array, index) {
        return array[index];
    });
    
    // TODO will need to minify on the backend
    eleventyConfig.addPassthroughCopy({ 'components/lib': 'lib' })

    eleventyConfig.addPassthroughCopy('videos');
    
    eleventyConfig.addPassthroughCopy({ 'images/output': 'images' });

    eleventyConfig.addPassthroughCopy('fonts');

    eleventyConfig.addPassthroughCopy('favicon.*')
    
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