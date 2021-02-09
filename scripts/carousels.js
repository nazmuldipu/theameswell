'use strict';

import Splide from '@splidejs/splide';

const defaultSlideOpts = {
    type: "loop",
    arrows: false,
    pagination: false,
    lazyLoad: 'sequential',
    preloadPages: 2 
}

export function CarouselFactory(carouselId, splideOpts=defaultSlideOpts) {
    /* const splide = new Splide(carouselId, splideOpts).mount();

    return {
        previous() { splide.go('-') },
        next() { splide.go('+') },
        current() { splide.index },
        length() { splide.length }
    } */
    return {previous: 12, next: 12, current: 12, length: 15}
}

export class Carousel {
    static get defaultSlideOpts() {
        return {
            type: "loop",
            arrows: false,
            pagination: false,
            lazyLoad: 'sequential',
            preloadPages: 2  
        };
    }

    constructor({ carouselId, splideOpts=Carousel.defaultSlideOpts }) {
        this.id = carouselId;
        this.splide = {}//new Splide(carouselId, splideOpts).mount();
    }

    next() {
        this.splide.go('+');
    }

    previous() {
        this.splide.go('-');
    }

    get current() {
        return this.splide.index;
    }

    get length() {
        return this.splide.length;
    }
    
    destroy() {
        this.splide.destroy();
    }
}