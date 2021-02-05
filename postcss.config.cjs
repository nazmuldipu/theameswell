module.exports = ctx => {
    const plugins = [
        require('postcss-import'),
        require('tailwindcss')('./tailwind.config.cjs'),
        require('postcss-nesting') 
    ];
    if(ctx.env === 'production') {
        plugins.push(require('autoprefixer'));
        plugins.push(require('cssnano')({ preset: 'default' }));
    }
    return { plugins };
}