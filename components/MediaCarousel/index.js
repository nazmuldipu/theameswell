'use strict';
console.log('performance 1 1', performance.now())
import 'https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/js/splide.min.js';
import 'https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-video@latest/dist/js/splide-extension-video.min.js';
console.log('performance 1 2', performance.now())


import ProgressiveElement from '../lib/progressive-element.js';

export default class MediaCarousel extends ProgressiveElement {
    constructor() {
        super([
            {
                id: 'test test',
                behaviorPath: '../lib/splide.js',
                stylePaths: [
                    'https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/css/splide-core.min.css',
                    'https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-video@latest/dist/css/splide-extension-video.min.css'

                ],
                type: 'IntersectionObserver',
                observerConfig: {
                    rootMargin: '200px'
                }
            }
        ]);

        //
    }

    // assuming use of IntersectionObserver
    _onLoad(moduleId, entries, observer) {
        if(entries.some(entry => entry.isIntersecting)) {
            super._onLoad(moduleId).then(({ mod }) => {
                // expect { Splide, Extensions, defaultConfig } to be there
                console.log('mod', mod)
                if(mod.Splide) {
                    console.log(this.firstElementChild, this.firstChild)
                    this.splideInstance = new mod.Splide(this.firstElementChild, mod.defaultConfig).mount({ 
                        Video: mod.Extensions.Video,
                        Numbers: mod.NumberExtension
                     });
                }

                // to do -- need to figure out how to use mod.id?
                // not sure if we do.... using the element should be enough
                // this is where we mount the Splide
                // if this is a Splide to mount
                //this.splideInstance = new Splide(this, defaultConfig).mount(Extensions);
            })
        }
    }
}

customElements.define('media-carousel', MediaCarousel);