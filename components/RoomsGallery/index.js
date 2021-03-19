'use strict';

import ProgressiveElement from '../lib/progressive-element.js';

export default class RoomsGallery extends ProgressiveElement {
    constructor() {
        super([
            {
                id: 'swiper',
                behaviorPath: '../lib/ameswell-rooms.js',
                stylePaths: [],
                type: 'IntersectionObserver',
                observerConfig: {
                    rootMargin: '400px'
                }
            }
        ]);

        this._currentIndex = 0;
    }

    // assuming use of IntersectionObserver
    _onLoad(moduleId, entries, observer) {
        if(entries.some(entry => entry.isIntersecting)) {
            super._onLoad(moduleId).then(({ mod }) => {
                if(mod.roomInfo) {
                    // set up listeners
                    this._titleEl = this.getElementsByClassName('rooms-gallery--title')?.[0];
                    this._sqftEl = this.getElementsByClassName('rooms-gallery--icon-sqft')?.[0];
                    this._workspaceEl = this.getElementsByClassName('rooms-gallery--icon-workspace')?.[0];
                    this._sleepsEl = this.getElementsByClassName('rooms-gallery--icon-sleeps')?.[0];
                    this._prevBtnEl = this.getElementsByClassName('rooms-gallery--prev')?.[0];
                    this._nextBtnEl = this.getElementsByClassName('rooms-gallery--next')?.[0];

                    this._prevBtnEl.onclick = () => {
                        this.prev();
                    }

                    this._nextBtnEl.onclick = () => {
                        this.next();
                    }

                    this._rooms = mod.roomInfo;
                    this._loaded = true;
                }
            });
        }
    }

    changeRoom() {
        // change title
        this._titleEl.textContent = this._rooms[this._currentIndex].title;
        // change icons
        this._sqftEl.lastChild.textContent = this._rooms[this._currentIndex].sqft;
        this._workspaceEl.lastChild.textContent = this._rooms[this._currentIndex].workspace;
        this._sleepsEl.lastChild.textContent = this._rooms[this._currentIndex].sleeps;
    }

    next() {
        if(this._loaded) {
            this._currentIndex++;
            if(this._currentIndex === this._rooms.length) {
                this._currentIndex = 0;
            }
            this.changeRoom()
        }
    }

    prev() {
        if(this._loaded) {
            this._currentIndex--
            if(this._currentIndex < 0) {
                this._currentIndex = this._rooms.length - 1;
            }
            this.changeRoom();
        }
    }
}

customElements.define('rooms-gallery', RoomsGallery);