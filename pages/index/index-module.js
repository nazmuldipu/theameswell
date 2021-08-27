'use strict';
import '../../components/MediaCarousel/index.js';
import '../../components/RoomsGallery/index.js';
import '../../components/FormSender/index.js';
import '../../components/WeatherWidget/index.js';
import * as happenigsData from '../happenings/happenings.11tydata.json';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const createMenuItem = (event) =>{
    const date = new Date(event.date.year, event.date.month - 1, event.date.day);
    const dateString = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    let section = document.createElement('section');
    section.className = "bg-ams-white mb-8 shadow-md"
    section.innerHTML = `
    
    <figure>
        <img class="w-full h-80 object-cover" alt="Event" src="${event.image}.jpg" width="150" height="70">
        <figcaption>
            <header class="pl-4 xmed:pl-3 py-4">
                <span class="text-lg font-sans">
                    ${dateString}
                </span>
                <h2 class="title-display text-xl xmed:text-2xl text-left font-serif font-medium">
                   ${event.title}
                </h2>
            </header>
        </figcaption>
    </figure>
            `;
    return section;
}

const happeningsEle = document.querySelector('#happenings');
happenigsData.events.forEach(element => {
    if (element.id === 16 || element.id === 20) {
        happeningsEle.appendChild(createMenuItem(element));
    }
});

