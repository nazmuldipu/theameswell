import * as data from "../happenings/happenings.11tydata.json";
const temp_id = window.location.search.split("=")[1];
const events = data.events;
let viewAll = false;
const months = [
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

const isDate = (obj) => {
  return (
    /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime())
  );
};

const render_left = (event) => {
  return `<header class="xmed:hidden pb-4 px-6 xmed:px-0 block">
                    <h1 class="font-medium font-serif text-ams-primary text-2xl uppercase">${event.title}</h1>
            </header>
            <figure class="order-2">
                <img src="${event.url}" class="w-full" loading="lazy" alt="${event.title}">
            </figure>`;
};

const render_right = (event) => {
  let html = `
    <header class="hidden xmed:block">
        <h1 class="font-medium font-serif text-ams-primary text-2xl uppercase">${
          event.title
        }</h1>
    </header>
    <p class="xmed:pt-4 pb-2 text-lg">${months[event.date.month]}, ${
    event.date.day
  }, ${event.date.year}</p>
    <p class="pb-3 text-lg">${event.time}</p>
    <hr class="border-solid border-2 w-11/12 xmed:w-1/2 border-ams-gold">`;

  for (let i = 0; i < event.descriptions.length; i++) {
    html += `
        <p class="pt-3 text-lg"> ${event.descriptions[i]} </p>
        `;
  }
  return html;
};
const renderEventCard = (event, small) => {
  return `<a class="block bg-ams-white xmed:shadow-2xl mb-4 border-b xmed: border-0 ${
    small ? "w-full" : "w-96 h-96"
  }" href="/happenings-detail.html?id=${event.id}">
              <figure>
              <img class="w-full" alt="Event" src="${event.url}"
           width=150" height="70">
                  <figcaption>
                      <header class="px-6 py-4 text-left bg-ams-white">
                          <h3 class="text-lg font-sans">
                          ${months[event.date.month]}, ${event.date.day}, ${
    event.date.year
  }
                          </h3>
                          <h2 class="title-display text-xl xmed:text-2xl font-serif font-medium">
                            ${event.title}
                          </h2>
                      </header>
                  </figcaption>
              </figure>
              ${
                small
                  ? ""
                  : `<div class="pb-5 text-left pl-6 bg-ams-white text-xs text-ams-primary font-medium"> <a  href="happenings-detail.html?id=${event.id}" class="inline-block py-2 px-8 bg-ams-gold text-ams-white font-serif tracking-wide button--primary button"> View More </a></div>`
              }
            </a>`;
};
const showAlsoLike = (event) => {
  let evHtml = "";
  let count = 0;
  let eDate = new Date(event.date.year, event.date.month, event.date.day);
    
  for (let i = 0; i < events.length; i++) {
    const evDate = new Date(
      events[i].date.year,
      events[i].date.month,
      events[i].date.day
    );
    if (evDate.getTime() >= eDate.getTime()) {
      evHtml += renderEventCard(events[i], true);
      count++;
    }
    if (!viewAll && count >= 3) {
      break;
    }
  }
  document.querySelector("#also_like").innerHTML = evHtml;
};

const viewAllEle = (event) => {
    viewAll = true;
    showAlsoLike(event);
};

if (events.length && !isNaN(temp_id) && temp_id > 0) {
  const id = Number(temp_id);
  const event = events.find((ev) => ev.id === id);
  document.querySelector("#details_left").innerHTML = render_left(event);
  document.querySelector("#details_right").innerHTML = render_right(event);
    showAlsoLike(event);
  const btn_view_all = document.querySelector(".btn_view_all");
  btn_view_all.addEventListener('click', function(){
    viewAllEle(event);
  });
}
