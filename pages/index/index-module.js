"use strict";
import "../../components/MediaCarousel/index.js";
import "../../components/RoomsGallery/index.js";
import "../../components/FormSender/index.js";
import "../../components/WeatherWidget/index.js";
import * as happenigsData from "../_data/data.json";

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const createMenuItem = (event) => {
    const eventPicElement = document.querySelector('.event_id_' + event.id);

    const date = new Date(event.date.year, event.date.month - 1, event.date.day);
    const dateString =
        monthNames[date.getMonth()] +
        " " +
        date.getDate() +
        ", " +
        date.getFullYear();
    let section = document.createElement("section");
    section.className = "bg-ams-white mb-8 shadow-md mx-4 xmed:mx-0";
    section.innerHTML = `    
    <figure>
        ${eventPicElement.outerHTML}
        <figcaption>
            <header class="p-4">
                <span class="text-lg font-sans">
                    ${dateString}
                </span>
                <a href="/happenings-detail.html?id=${event.id}">
                <h2 class="title-display text-xl xmed:text-2xl text-left font-serif font-medium">
                   ${event.title}
                </h2></a>
            </header>
        </figcaption>
    </figure>
            `;
  return section;
};

const happeningsEle = document.querySelector("#happenings");
happenigsData.events.forEach((element) => {
    if (element.showIndexPage === true) {
        happeningsEle.appendChild(createMenuItem(element));
    }
});