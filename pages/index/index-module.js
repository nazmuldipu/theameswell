"use strict";
import "../../components/MediaCarousel/index.js";
import "../../components/RoomsGallery/index.js";
import "../../components/FormSender/index.js";
import "../../components/WeatherWidget/index.js";

const handleHappenings = (happenings)=> {
const events = happenings.map((item)=> {
    return {
      ...item,
      date: {
        day: parseInt(item.date.day),
        month: parseInt(item.date.month),
        year: parseInt(item.date.year),
      }
    }
  })
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
    section.className = "bg-ams-white mb-8 shadow-md mx-6 xmed:mx-0";
    section.innerHTML = `    
    <figure>
        ${eventPicElement.outerHTML}
        <figcaption>
            <header class="p-4">
                <span class="text-lg font-sans text-ams-primary">
                    ${dateString}
                </span>
                <a href="/happenings-detail/?id=${event.id}">
                <h2 class="title-display text-xl xmed:text-2xl text-left font-serif font-medium">
                   ${event.title}
                </h2></a>
            </header>
        </figcaption>
    </figure>
            `;
  return section;
};

const shouldShowEvent = event => {
    console.log('shouldShowEvent', event)
    // Months are zero-indexed for months, and our data is one-indexed
    const eventDate = new Date(event.date.year, event.date.month-1, event.date.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return event.should_show && event.showindexpage && (eventDate.getTime() >= today.getTime());
}

const eventDateAscCmp = (a, b) => {
    // Months are zero-indexed for months, and our data is one-indexed
    const dateA = new Date(a.date.year, a.date.month-1, a.date.day);
    const dateB = new Date(b.date.year, b.date.month-1, b.date.day);
    return dateA.getTime() - dateB.getTime();
}

const HOMEPAGE_SHOW_COUNT = 2; 
const happeningsEle = document.querySelector("#happenings");

const happeningsToShow = events
    .filter(shouldShowEvent)
    .sort(eventDateAscCmp)
    .slice(0, HOMEPAGE_SHOW_COUNT);

happeningsToShow.forEach((event) => {
    happeningsEle.appendChild(createMenuItem(event));
});
}
document.addEventListener("DOMContentLoaded", function () {
    const html = document.querySelector("#happenings-data")
    if(html){
        const items = JSON.parse(html.dataset.happenings);
        if(items && items.length > 0){
          handleHappenings(items)
          html.dataset.items = []
        }
    }
  })