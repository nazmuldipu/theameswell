import {bar} from '../../scripts/sample';
import { lazyLoadVideos } from '../../scripts/lazyloading.js';

document.addEventListener("DOMContentLoaded", lazyLoadVideos('lazy', { 
    rootMargin: '-100px' // will start loading video with 100px buffer
 }));
console.log('BAR BAR BAR jjj BAR', bar)