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
                console.log('mod', mod)
                if(mod.Splide) {
                    console.log(this.firstElementChild, this.firstChild)
                    // TODO -- look for .splide class -- if multiple, sync and then mount all
                    // will need to differentiate caption version from normal version
                    this.splideImagesInstance = new mod.Splide(
                        this.getElementsByClassName('splide splide__images')?.[0],
                        mod.defaultConfig
                    ).mount({
                        Video: mod.Extensions.Video,
                        Numbers: mod.NumberExtension
                    });

                    this.splideCaptionsInstance = new mod.Splide(
                        this.getElementsByClassName('splide splide__captions')?.[0],
                        mod.captionsConfig
                    );

                    this.splideCaptionsInstance.sync(this.splideImagesInstance).mount();
                }
            });
        }
    }
}

customElements.define('media-carousel', MediaCarousel);