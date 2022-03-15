import { getAllCommodity } from "../../scripts/utils/commodity/get-happenings";
import { HAPPENINGS_PAGE_ID } from "../../components/lib/constants";

const event_id = window.location.search.split("=")[1]; 
const temp_id = event_id.split('__dd')[0];

getAllCommodity( HAPPENINGS_PAGE_ID, temp_id).then((data) => {
    handleHappenings(data);
});

const handleHappenings = (happenings) => {
    const events = happenings.map((item) => {
        return {
            ...item,
            date: {
                day: parseInt(item.date.day),
                month: parseInt(item.date.month),
                year: parseInt(item.date.year),
            },
        };
    });
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
            /Date/.test(Object.prototype.toString.call(obj)) &&
            !isNaN(obj.getTime())
        );
    };

    const render_left = (event) => {
        return `<header class="xmed:hidden pb-4 px-6 xmed:px-0 block">
                    <h1 class="font-medium font-serif text-ams-primary text-2xl uppercase">${event.title}</h1>
                </header>
                <img src="${event.image}" alt="${event.title}" loading="lazy" class="order-2" decoding="async" alt="">`;
    };

    const render_right = (event) => {
        let ctaEle = "";
        event.actions &&
        event.actions.forEach((item) => {
                ctaEle += `<a class="w-64 h-12 bg-ams-gold flex justify-center items-center text-ams-white text-lg font-medium font-serif-display" href="${item.url}" target="_blank">${item.label}</a>`;
            });

        let html = `
    <header class="hidden xmed:block">
        <h1 class="font-medium font-serif text-ams-primary text-2xl uppercase">${
            event.title
        }</h1>
    </header>
    <p class="xmed:pt-4 pb-2 text-lg">${months[event.date.month - 1]} ${
            event.date.day
        }, ${event.date.year}</p>
    <p class="pb-3 text-lg">${event.time}</p>
    <hr class="border-solid border-3 w-11/12 xmed:w-1/2 border-ams-gold">`;
        html += `
        <div class="pt-3 text-lg"> ${event.description} </div>
        `;
        html += `<div class="pt-10 xmed:pt-14 text-center xmed:text-left text-lg grid xmed:grid-flow-col gap-3 justify-center xmed:justify-start items-center">${ctaEle}</div>`;
        return html;
    };

    const renderOurHappeningsCard = (event) => {
        let ctaEle = "";
        event.actions &&
            event.actions.forEach((item) => {
                const element = item.action;ctaEle += `<a class="w-full h-12 flex justify-center items-center bg-ams-gold text-ams-white text-lg font-medium font-serif-display href="${item.url}" target="_blank">${item.label}</a>`;
            });

        return `<section class="bg-ams-white xmed:shadow-2xl xmed:mb-10 w-ful">
            <a class="hidden xmed:block" href="/happenings-detail/?id=${
                event.id
            }">
              <figure>
                <img src="${event.image}" alt="${event.title}" loading="lazy" decoding="async" alt="">
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
                <img src="${event.image}" alt="${event.title}" loading="lazy" decoding="async" alt="">
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
    };
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
    if (events.length && (temp_id !== undefined) && (temp_id !== null) && (temp_id.length > 0)) {
        const event = events.find((ev) => ev.id === event_id);
        document.querySelector("#details_left").innerHTML = render_left(event);
        document.querySelector("#details_right").innerHTML =
            render_right(event);
        showAlsoLike(event);
        const btn_view_all = document.querySelector(".btn_view_all");
        btn_view_all.addEventListener("click", function () {
            viewAllEle(event);
            btn_view_all.style.visibility = "hidden";
        });
    }
};
