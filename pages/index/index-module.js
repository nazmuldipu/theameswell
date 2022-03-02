"use strict";
import "../../components/MediaCarousel/index.js";
import "../../components/RoomsGallery/index.js";
import "../../components/FormSender/index.js";
import "../../components/WeatherWidget/index.js";
import { getAllCommodity } from "../../scripts/utils/commodity/get-happenings";

getAllCommodity('3cd0acd5-58d2-47da-8a2b-18cd8e2b6080').then((data) => {
    handleHappenings(data);
});

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
        <div class="w-full overflow-hidden grid justify-center">
            <img src="${event.image}" alt="${event.title}" loading="lazy" class="max-w-none w-auto h-96" decoding="async" alt="">
        </div>
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
    // Months are zero-indexed for months, and our data is one-indexed
    const eventDate = new Date(event.date.year, event.date.month-1, event.date.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (eventDate.getTime() >= today.getTime());
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