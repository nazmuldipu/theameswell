import * as data from "../_data/data2.json";
const temp_id = window.location.search.split("=")[1];
const events = data.happenings;
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
  const eventPicElement = document.querySelector('.event_id_' + event.id);

  return `<header class="xmed:hidden pb-4 px-6 xmed:px-0 block">
                    <h1 class="font-medium font-serif text-ams-primary text-2xl uppercase">${event.title}</h1>
            </header>
            <figure class="order-2">
                ${eventPicElement.outerHTML}
            </figure>`;
};

const render_right = (event) => {
  let ctaEle = '';
  event.actions && event.actions.forEach(item => {
    const element = item.action
    if (element.type == 'primary') {
        ctaEle += `<a class="w-40 h-12 bg-ams-gold flex justify-center items-center text-ams-white text-lg font-medium font-serif-display" href="${element.url}" target="_blank">${element.copy}</a>
       `
    }
  });
  
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
    html += `
        <div class="pt-3 text-lg"> ${event.descriptions} </div>
        `;
  html += `<div class="pt-10 xmed:pt-14 text-center xmed:text-left text-lg grid xmed:grid-flow-col gap-3 justify-center xmed:justify-start items-center">${ctaEle}</div>`;
  return html;
};

const renderOurHappeningsCard = (event) => {
  const eventPicElement = document.querySelector('.event_id_' + event.id);
  let ctaEle = '';
  event.actions && event.actions.forEach(item => {
    const element = item.action
    if (element.type == 'primary') {
      ctaEle += `<a class="w-full h-12 flex justify-center items-center bg-ams-gold text-ams-white text-lg font-medium font-serif-display ${element.classes? element.classes : ''}" href="${element.url}" target="_blank">${element.copy}</a>
              `
    }else if (element.type == 'details-link-outline') {
      ctaEle += `<a class="w-full h-12 flex justify-center items-center border-4 border-ams-gold text-ams-gold text-lg font-medium font-serif-display" href="/happenings-detail?id=${event.id}">${element.copy}</a>`
    }
    
  });

  return `<section class="bg-ams-white xmed:shadow-2xl xmed:mb-10 w-ful">
            <a class="hidden xmed:block" href="/happenings-detail?id=${event.id}">
              <figure>
                ${eventPicElement.outerHTML}
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
                ${eventPicElement.outerHTML}
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
            <div class="xmed:hidden grid grid-cols-2 gap-3 px-6 pb-5">
              ${ctaEle}
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