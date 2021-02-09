'use strict';

export const lazyLoadVideos = (lazyClass, observerOptions) => () => {
    let lazyVideos = [].slice.call(document.querySelectorAll(`video.${lazyClass}`));

    if ("IntersectionObserver" in window) {
        let lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(video) {
                if (video.isIntersecting) {
                    for (let source in video.target.children) {
                        let videoSource = video.target.children[source];
                        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                            videoSource.src = videoSource.dataset.src;
                        }
                    }

                    video.target.load();
                    console.log('LOADING VIDEO')
                    video.target.classList.remove(lazyClass);
                    // observe just once to initiate the load
                    lazyVideoObserver.unobserve(video.target);
                }
            });
        }, observerOptions);

        lazyVideos.forEach(function(lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    }
}