# The Ameswell
## Built off of the Skipper Site Template

# Getting Started

## Development and Environment Prerequisites
- node v14.x -- we recommend installing node and npm via Node Version Manager ([windows](https://github.com/coreybutler/nvm-windows)) ([unix](https://github.com/nvm-sh/nvm))

## Some relevant technologies we use
- [TailwindCSS](https://tailwindcss.com/docs) for a CSS Framework
- [11ty](https://www.11ty.dev/docs/) for Static Site Generation
- [Nunjucks](https://mozilla.github.io/nunjucks/) for templating
- [esbuild](https://esbuild.github.io/) for JS bundling
- Vanilla JS Web Components ([link1](https://developers.google.com/web/fundamentals/web-components/customelements), [link2](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)) for adding dynamism and behavior

## Directory Structure Overview
- **/build** -- where built assets get put when we are running the site in development or when we are building the site for production
- **/components** -- where Web Components and Custom Element definitions and associated helpers live
- **/fonts** -- where we store font files
- **/images** -- where we store images. Store canonical images in **/images/src** -- resized images will automatically be put into **/images/output**
- **/pages** -- where page specific assets live. These assets include:
    - JavaScript files that will load according to the named strategy (e.g. `module`, `defer`, `async`, `sync`)
    - CSS files that will load according to the named strategy (e.g. `async`, `sync`)
    - JSON data files
    - Nunjucks templating files. These are organized in the following way into subdirectories:
        - **pages/_includes** -- contains reusable nunjucks templates: layouts, includes, macros
        - **pages/{pagename}** -- templates specific to a page
- **/scripts** -- JavaScript used throughout the site that is not component-based in nature
- **/styles** -- Global CSS definitions. Includes some TailwindCSS setup and extensions
- **/tooling** -- Build JS scripts
- **/videos** -- where video files are stored
- **.eleventy.cjs** -- where 11ty is configured
- **tailwind-class-safelist.txt** -- where you can put CSS class names that you don't want [Tailwind](https://tailwindcss.com/docs/just-in-time-mode#known-limitations) to [purge](https://tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html)
- **tailwind.config.js** -- Tailwind [configuration](https://tailwindcss.com/docs/configuration) file

## Doing Stuff 
- `npm install` to start
- `npm run build` will build the site for production
- `npm run watch` will build the site for development. You will see hot module reloads for changes to some files.
- `npm run resize-images` will run the `tooling/images.js` script which takes images in `images/src` and resizes them and puts them into `images/output`

