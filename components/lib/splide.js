'use strict';
import 'https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/js/splide.min.js';
import 'https://cdn.jsdelivr.net/npm/@splidejs/splide-extension-video@latest/dist/js/splide-extension-video.min.js';

const Extensions = window.splide.Extensions;
const Splide = window.Splide;
const defaultConfig = {
    type: 'loop',
    lazyLoad: 'nearby',
    cover: true,
    heightRatio: 0.5,
    video: {
        autoplay: true,
        mute: true,
        hideControls: true,
        loop: true
    }
};

const captionsConfig = {
    type: 'loop',
    arrows: false,
    perPage: 1
};

const NumberExtension = ( Splide, Components ) => {
    let indexEl, lengthEl;
    return {
        mount() {
            indexEl = Splide.root.getElementsByClassName('splide__index')?.[0];
            lengthEl = Splide.root.getElementsByClassName('splide__length')?.[0];
            this.setIndex(Splide.index + 1);
            
            if ( lengthEl.textContent !== undefined ) {
				lengthEl.textContent = Splide.length;
			} else {
				lengthEl.innerText = Splide.length;
			}
            
            this.bind();
        },

        bind() {
            Splide.on('move', newIndex => {
                this.setIndex(newIndex + 1);
            });
        },

        setIndex(number) {
            if ( indexEl.textContent !== undefined ) {
				indexEl.textContent = number;
			} else {
				indexEl.innerText = number;
			}
        },
    }
}


export {
    Splide,
    Extensions,
    NumberExtension,
    defaultConfig,
    captionsConfig
}
