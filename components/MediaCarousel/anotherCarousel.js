'use strict';

import ProgressiveElement from '../lib/progressive-element.js';

export default class CarouselComponent extends ProgressiveElement {
    constructor() {
        super([
            {
                id: 'swiper',
                behaviorPath: '../lib/swiper.js',
                stylePaths: [
                    "https://unpkg.com/swiper/swiper-bundle.min.css"
                ],
                type: 'IntersectionObserver',
                observerConfig: {
                    rootMargin: '400px'
                }
            }
        ]);
    }

    // assuming use of IntersectionObserver
    _onLoad(moduleId, entries, observer) {
        if(entries.some(entry => entry.isIntersecting)) {
            super._onLoad(moduleId).then(({ mod }) => {
                if(mod.Swiper) {
                    this.swiperInstance = new mod.Swiper(
                        this.getElementsByClassName('carousel-container')?.[0],
                        mod.anotherConfig
                    );
                }
            });
        }
    }
}

customElements.define('carousel-component', CarouselComponent);
