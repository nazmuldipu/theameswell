'use strict';

import { lazyLoadVideos } from '../../scripts/lazyloading.js';

document.addEventListener('DOMContentLoaded', lazyLoadVideos('lazy', {
    rootMargin: '100px'
}));

