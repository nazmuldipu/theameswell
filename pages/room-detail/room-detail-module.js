'use strict';
import '../../components/MediaCarousel/index.js'
import '../../components/WeatherWidget/index.js';

const items = document.querySelectorAll(".accordion-item");

items.forEach(item => {
    const btns = item.querySelectorAll('.accordion-button');
    const content = item.querySelector('.accordion-content');
    btns.forEach(btn => {
        console.log(btn);
        const icon = btn.querySelector('.arrow');
        icon.style.transform = "rotate(135deg)";
        btn.addEventListener('click', function () {
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.style.transform = "rotate(135deg)";
                icon.style.marginTop = "0px";
                item.classList.remove("bg-ams-base");
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                item.classList.add("bg-ams-base");
                icon.style.marginTop = "10px";
                icon.style.transform = "rotate(-45deg)";
            }
        })
    })

});