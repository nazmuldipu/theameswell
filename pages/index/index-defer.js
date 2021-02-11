import {foo} from '../../scripts/sample';

/**
 * The below pattern should be used to include alpineJS on a page
 * --- setting up component data on global scope
 * --- loading alpine so that it has that component data once loaded
 */
import { CarouselFactory, Carousel } from '../../scripts/carousels.js';
window.carousel = function(carouselId='sample') {
    
    const classInstance = new Carousel({ carouselId: 'id' })
    const carouselInstance = CarouselFactory(carouselId);
    console.log('instance', carouselInstance);
    return carouselInstance;
    /* return {
        previous: function() { console.log('x') },
        next: function() { console.log('y') },
        current: function() { return 'yay' },
        length: function() { return 'boo' },
    } */
    /* const carousel = new Carousel(params);
    console.log('carousel', carousel);
    return {
        next: carousel.next,
        previous: carousel.previous,
        current: carousel.current,
        length: carousel.length
    } */
}

import 'alpinejs';

console.log('FOO bar ba taddas', foo);