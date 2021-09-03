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
                <img src="${event.image}.jpg" class="w-full" loading="lazy" alt="${event.title}">
            </figure>`;
};

const render_right = (event) => {
  let html = `
    <header class="hidden xmed:block">
        <h1 class="font-medium font-serif text-ams-primary text-2xl uppercase">${
          event.title
        }</h1>
    </header>
    <p class="xmed:pt-4 pb-2 text-lg">${months[event.date.month - 1]}, ${
    event.date.day
  }, ${event.date.year}</p>
    <p class="pb-3 text-lg">${event.time}</p>
    <hr class="border-solid border-3 w-11/12 xmed:w-1/2 border-ams-gold">`;

  for (let i = 0; i < event.descriptions.length; i++) {
    html += `
        <p class="pt-3 text-lg"> ${event.descriptions[i]} </p>
        `;
  }
  html += `<div class="pt-10 xmed:pt-14 text-center xmed:text-left text-lg">
    <a class="w-40 h-12 flex justify-center items-center bg-ams-gold text-ams-white text-lg font-medium font-serif-display" href="${event.url}" target="_blank">Book a Table</a>
  </div>`;
  return html;
};
const renderOurHappeningsCard = (event) => {
  return `<section class="bg-ams-white xmed:shadow-2xl mb-10 w-ful">
            <a class="hidden xmed:block" href="/happenings-detail.html?id=${event.id}">
              <figure>
                <img class="w-full h-96 object-cover" alt="Event" src="${event.image}.jpg" width="150" height="70" />
                <figcaption>
                  <header class="px-6 py-4 text-left bg-ams-white">
                    <h3 class="text-lg font-sans">
                      ${months[event.date.month - 1]}, ${event.date.day}, ${event.date.year}
                    </h3>
                    <h2 class="title-display text-xl xmed:text-2xl font-serif font-medium">
                      ${event.title}
                    </h2>
                  </header>
                </figcaption>
              </figure>              
            </a>
            <span class="xmed:hidden">
              <figure>
                <img class="w-full h-96 object-cover" alt="Event" src="${event.image}.jpg" width="150" height="70" />
                <figcaption>
                  <header class="px-6 py-4 text-left bg-ams-white">
                    <h3 class="text-lg font-sans">
                      ${months[event.date.month - 1]}, ${event.date.day}, ${event.date.year}
                    </h3>
                    <h2 class="title-display text-xl xmed:text-2xl font-serif font-medium">
                      ${event.title}
                    </h2>
                  </header>
                </figcaption>
              </figure>              
            </span>
            <div class="xmed:hidden grid grid-cols-2 gap-3 px-6 ">
              <a class="w-full h-12 flex justify-center items-center bg-ams-gold text-ams-white text-lg font-medium font-serif-display" href="${event.url}" target="_blank">Book a Room</a>
              <a class="w-full h-12 flex justify-center items-center border-4 border-ams-gold text-ams-gold text-lg font-medium font-serif-display" href="/happenings-detail.html?id=${event.id}">More Info</a>
            </div>
          </section>`;
}
const showAlsoLike = (event) => {
  let evHtml = "";
  let count = 0;
  let eDate = new Date();
    
  for (let i = 0; i < events.length; i++) {
    const evDate = new Date(
      events[i].date.year,
      events[i].date.month - 1,
      events[i].date.day
    );
    if (evDate.getTime() >= eDate.getTime()) {
      evHtml += renderOurHappeningsCard(events[i]);
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
    btn_view_all.style.visibility='hidden';
  });
}
