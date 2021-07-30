"use strict";

const hasEventListeners = !!window.addEventListener;
const sto = window.setTimeout;
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
const isLeapYear = function (year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
const getDaysInMonth = function (year, month) {
  return [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month];
};
const setToStartOfDay = function (date) {
  if (isDate(date)) date.setHours(0, 0, 0, 0);
};
const addClass = function (el, cn) {
  if (!hasClass(el, cn)) {
    el.className = el.className === "" ? cn : el.className + " " + cn;
  }
};
const addEvent = function (el, e, callback, capture) {
  if (hasEventListeners) {
    el.addEventListener(e, callback, !!capture);
  } else {
    el.attachEvent("on" + e, callback);
  }
};
const trim = function (str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
};
const removeClass = function (el, cn) {
  el.className = trim((" " + el.className + " ").replace(" " + cn + " ", " "));
};
const isDate = function (obj) {
  return (
    /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime())
  );
};
const compareDates = function (a, b) {
  return a.getTime() === b.getTime();
};
const hasClass = function (el, cn) {
  return (" " + el.className + " ").indexOf(" " + cn + " ") !== -1;
};

const getDayEvents = (year, month, day, events) => {
  let eve = [];
  events.forEach((e) => {
    if (
      e.date.year === year &&
      e.date.month - 1 === month &&
      e.date.day === day
    ) {
      eve.push(e);
    }
  });
  return eve;
};

const renderTitle = function (year, month) {
  const titleEle = document.querySelector(".month-name");
  titleEle.innerHTML = months[month] + " " + year;
};

const renderDay = (opts, eventList) => {
  let eventHtml = "";
  if (eventList.length > 0) {
    eventList.forEach((et) => {
      eventHtml += `<div class="c-event hidden xmed:block text-xs truncate uppercase" id="${et.id}">${et.title}</div> 
                    <span class="d-event xmed:hidden text-ams-magenta inline-block">
                        <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="#EC008C"/>
                        </svg>
                    </span>`;
    });
  }
  return `<div class="py-4 xmed:py-8 grid-item">
            <div class="calendar_date font-bold text-2xl xmed:text-6xl ${
              opts.isToday
                ? "text-ams-white bg-ams-pink"
                : opts.isWeekend
                ? "text-ams-pink"
                : "text-ams-primary"
            } pb-3">${opts.day}</div>
            ${eventHtml}
          </div>`;
};

const renderBody = (year, month) => {
  const bodyEle = document.querySelector(".calendar-body ");
  const now = new Date();
  setToStartOfDay(now);
  const days = getDaysInMonth(year, month);
  const before = new Date(year, month, 1).getDay();
  const totalCell = days + before;
  let dayHtml = "";
  for (let i = 0; i < totalCell; i++) {
    const day = new Date(year, month, 1 + (i - before));
    const isToday = compareDates(day, now);
    const isEmpty = i < before;
    const isWeekend =
      day.getDay() != 0 && (day.getDay() % 4 == 0 || day.getDay() % 5 == 0);
    const dayNumber = 1 + (i - before);
    if (isEmpty) {
      dayHtml += `<div class="is-empty"></div>`;
    } else {
      const eventList = getDayEvents(year, month, dayNumber, events);
      var dayConfig = {
        day: dayNumber,
        month,
        year,
        isWeekend,
        isToday,
      };
      dayHtml += renderDay(dayConfig, eventList);
    }
  }
  bodyEle.innerHTML = dayHtml;
};

const renderEventCard = (event, small) => {
  return `<section class="bg-ams-white xmed:shadow-2xl mb-4 border-b xmed: border-0 ${
    small ? "w-full" : "w-96 h-96"
  }">
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
                : '<div class="pb-5 text-left pl-6 bg-ams-white text-xs text-ams-primary font-medium"> <a  href="happenings-detail.html?id=${event.id}" class="inline-block py-2 px-8 bg-ams-gold text-ams-white font-serif tracking-wide button--primary button"> View More </a></div>'
            }
          </section>`;
};

var Happenings = function (options) {
  var self = this;
  const calendar = document.querySelector("#happening_calendar");
  const our_happenings = document.querySelector("#our_happenings");
  const btn_view_all = document.querySelector(".btn_view_all");

  //set tool tip element
  const toolTipEle = document.createElement("div");
  toolTipEle.className = "tooltipText hidden";
  toolTipEle.innerHTML = "tooltip";

  calendar.appendChild(toolTipEle);

  self.gotoDate(new Date());

  self._changeMonth = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
      pEl = target;

    if (!target) {
      return;
    }
    if (hasClass(target, "nav-next")) {
      self.nextMonth();
      self.showOurHappenings(our_happenings)
    } else if (hasClass(target, "nav-prev")) {
      self.prevMonth();
      self.showOurHappenings(our_happenings)
    }
  };

  self._mouseover = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
      pEl = target;

    if (!target) {
      return;
    }
    if (hasClass(target, "calendar_date")) {
      const parentEle = target.parentElement;
      const evnCount = parentEle.querySelectorAll(".c-event").length;
      if (evnCount === 1) {
        const day = Number(target.innerHTML);
        const event = getDayEvents(
          self.calendar.year,
          self.calendar.month,
          day,
          events
        )[0];
        const eventEle = renderEventCard(event, false);
        toolTipEle.innerHTML = eventEle;
        removeClass(toolTipEle, "hidden");
        self.adjustPosition(parentEle, toolTipEle);
      } else {
        addClass(toolTipEle, "hidden");
      }
    } else if (hasClass(target, "c-event") || hasClass(target, "d-event")) {
      const parentEle = target.parentElement;
      let id;
      if (hasClass(target, "d-event")) {
        id = parentEle.querySelectorAll(".c-event").id;
      } else {
        id = target.id;
      }
      const day = Number(parentEle.querySelector(".calendar_date").innerHTML);
      const eventList = getDayEvents(
        self.calendar.year,
        self.calendar.month,
        day,
        events
      );
      const event = eventList.find((ev) => ev.id == id);
      const eventEle = renderEventCard(event, false);
      toolTipEle.innerHTML = eventEle;
      removeClass(toolTipEle, "hidden");
      self.adjustPosition(parentEle, toolTipEle);
    }
  };
  self._view_all = function (e) {
    self.viewAll = true;
    self.showOurHappenings(our_happenings);
  };
  addEvent(btn_view_all, "click", self._view_all);
  addEvent(calendar, "click", self._changeMonth);
  addEvent(calendar, "mouseover", self._mouseover);

  self.showOurHappenings(our_happenings);
};

Happenings.prototype = {
  gotoDate: function (date) {
    if (!isDate(date)) {
      return;
    }
    this.calendar = {
      month: date.getMonth(),
      year: date.getFullYear(),
    };
    this.draw();
  },
  nextMonth: function () {
    this.calendar.month++;
    if (this.calendar.month > 11) {
      this.calendar.month = 0;
      this.calendar.year++;
    }
    this.draw();
  },
  prevMonth: function () {
    this.calendar.month--;
    if (this.calendar.month < 0) {
      this.calendar.month = 11;
      this.calendar.year--;
    }
    this.draw();
  },
  draw: function (force) {
    renderTitle(this.calendar.year, this.calendar.month);
    renderBody(this.calendar.year, this.calendar.month);
  },
  adjustPosition: function (parentEle, toolTipEle) {
    toolTipEle.style.position = "absolute";
    const width = toolTipEle.offsetWidth;
    const height = toolTipEle.offsetHeight;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const scrollTop =
      window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop;
    const pHeight = parentEle.offsetHeight;
    const pTop = parentEle.offsetTop;
    const pwidth = parentEle.offsetWidth;
    const pleft = parentEle.offsetLeft;

    let top = 0,
      left = 0,
      pBottom = viewportHeight - pTop - pHeight;

    if (pleft > viewportWidth / 2) {
      left = pleft - width;
    } else {
      left = pleft + pwidth;
    }
    if (pBottom > height) {
      top = pTop;
    } else {
      top = pTop - height + pHeight;
    }

    toolTipEle.style.left = left + "px";
    toolTipEle.style.top = top + "px";
  },
  showOurHappenings: function (el) {
    let evHtml = "";
    let count = 0;
    const days = getDaysInMonth(this.calendar.year, this.calendar.month);
    for (let i = days; i > 0; i--) {
      const evs = getDayEvents(
        this.calendar.year,
        this.calendar.month,
        i,
        events
      );
      for (let j = 0; j < evs.length; j++) {
        evHtml += renderEventCard(evs[j], true);
        count++;
        if (!this.viewAll && count >= 3) {
          break;
        }
      }
      if (!this.viewAll && count >= 3) {
        break;
      }
    }

    el.innerHTML = evHtml;
  },
};

const events = [
  {
    id: 1,
    date: { day: 3, month: 7, year: 2021 },
    time: "6PM - 9PM",
    title: "Live Music with Freddy Clarke and Wobbly World",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Join us for dinner and live music on the patio at Roger with the Vinyl Kings, featuring lead singer and guitarist, Randy Cordeiro (AKA, Surreal Neil) of Super Diamond, Noam Eisen of Cosmo Alley Cats and Vince Littleton of Super Diamond!",
      "Enjoy an evening with friends over craft cocktails and delicious California cuisine, while listening to favorites from these wildly popular musicians.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 2,
    date: { day: 3, month: 7, year: 2021 },
    time: "6:30PM - 9:00PM",
    title: "JULY 4TH WITH VINYL KINGS",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Join us for dinner and live music on the patio at Roger with the Vinyl Kings, featuring lead singer and guitarist, Randy Cordeiro (AKA, Surreal Neil) of Super Diamond, Noam Eisen of Cosmo Alley Cats and Vince Littleton of Super Diamond!",
      "Enjoy an evening with friends over craft cocktails and delicious California cuisine, while listening to favorites from these wildly popular musicians.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 3,
    date: { day: 10, month: 7, year: 2021 },
    time: "6PM - 9PM",
    title: "LLive Music with Freddy & John",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Come out an enjoy some live music before our 1st FREE Family movie of the year- This duo is classic rock/blues.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 4,
    date: { day: 10, month: 7, year: 2021 },
    time: "9:00 AM - 6:00 PM",
    title: "Seoul FoodTech",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "The Agro, Marine & Other Food Products and Beverages Industry Expo",
      "Seoul FoodTech is the Korea's largest International Exhibition. Seoul FoodTech provides participating companies with an opportunity to meet with key importers, distributors and industry buyers from retail, catering and the hospitality trade across the whole of Korea.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 5,
    date: { day: 13, month: 7, year: 2021 },
    time: "10:00 AM - 5:30 PM",
    title: "Agrofood Nigeri",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "International Trade Show on Agriculture - Food & Beverage Technology - Food & Hospitality",
      "Agrofood Nigeria is an international trade fair covering the entire value chain from field to fork consisting of three sub-events with the following exhibition topics: - agro Agrotech Nigeria (agriculture) - food + bev tec Nigeria (process & packaging machinery, food ingredients) - food + hospitality Nigeria (food & drinks, foodservice equipment). It will gather international and Nigerian industry leaders, investors, experts, academia and journalists to discuss latest technologies and conclude business. In order to create valuable synergies for exhibitors and trade visitors alike, agrofood Nigeria is held in conjunction with plastprintpack Nigeria.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 6,
    date: { day: 16, month: 7, year: 2021 },
    time: "10:00 AM - 5:00 PM",
    title: "LRA Showcase",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "International Food & beverage Industry Exhibition",
      "The LRA Showcase is the largest and most attended showcase of its kind in the region. It features the state's food service and hospitality industry among elected officials and regulatory agencies. Under the leadership of its original officers and directors, the association set forth several founding principles that continue to guide the association to this day. Since its inception, it has been recognized as a peer leader among other state restaurant associations in the country.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 7,
    date: { day: 16, month: 7, year: 2021 },
    time: "10:00 AM - 5:00 PM",
    title: "LRA Showcase",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "The Largest Food & Beverage Experience on the West Coast",
      "The Western Foodservice & Hospitality Expo will excite your senses and keep your menu fresh and exciting; culinary demonstration on the Center Stage presents top chefs and artistry live; our educational sessions bring knowledge to enhance your business savvy and boost profits; the New Product Showcase gives you the first look at the latest innovations; Culinary Clash: Battle Los Angeles brings you the thrill of team competition; the Beer, Wine & Spirits Pavilion explores the latest alcoholic beverage trends and how to engineer your beverage menu to maximize profits; and more.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 8,
    date: { day: 16, month: 7, year: 2021 },
    time: "10:00 AM - 4:30 PM",
    title: "Pizza Expo",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "The World's Largest Pizza and Italian Restaurant Trade Show",
      "The International Pizza Expo is the largest pizza pizza show in the world with more than 1,400 booths and 550 exhibitors. Additionally, the education and demonstration schedule is second to none with over 80 sessions to choose from. If you're looking to compete, we've got you covered with the International Pizza Challenge World Championships and the World Pizza Games.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 9,
    date: { day: 20, month: 7, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "Tent Decor Asia",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "World's Largest Exhibition on Tent, Catering and Event Infrastructure Industries",
      "Tent Decor Asia, Pragati Maidan, New Delhi. Tent Decor Asia features Lighting decoration, flowers decoration, inflatable tents, waterproof tent, hanger structure, crockery, catering equipment, cutlery and table products, kitchen equipment and much more etc.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 10,
    date: { day: 22, month: 7, year: 2021 },
    time: "11:00 AM - 07:00 PM",
    title: "India International Hospitality Expo",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "The most comprehensive sourcing hub for the Hospitality, Retail and F&B Industry in India.",
      "After a mega-successful first edition of India International Hospitality Expo that left the biggest names from the hospitality industry enthralled, IHE 19 is now ready for its second instalment. Promising to be bigger, better and grander, this show shall continue to make the hospitality industry a catalyst for economic growth and work towards its lofty vision Ã¢â‚¬â€œ to become the Biggest Hospitality Show in Asia.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 11,
    date: { day: 22, month: 7, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "SIAL Middle East",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Defining Innovation in the Food, Beverage and Hospitality Industry",
      "SIAL Middle East is the leading food, beverage, and hospitality event. SIAL Middle East has grown to attract exhibitors from too many countries, and visitors from all over the world including top buyers. Bakery & confectionery, dairy & egg products, organic products, seafood products, meat & poultry, and various health products are also showcased at the exhibition.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 12,
    date: { day: 22, month: 7, year: 2021 },
    time: "11:00 AM - 6:00 PM",
    title: "Food and Hospitality Asia Virtual Trade Fair",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Maldives exclusive Virtual Trade Fair for the Hotel Sector",
      "Food and Hospitality Asia Virtual Trade Fair offers an unrivaled opportunity for interested trade organizations of the Hospitality Industry to showcase their latest products, services and innovations. An all inclusive web platform for whose objectives are to create an interactive forum for exhibitors and clients. This offers opportunities for diversification of the economy and promotes service sectors.• A Hospitality Industry trade fair organized on an online virtual platform.• New opportunities for entrepreneurs to the Maldives market.• Exhibitors can showcase their latest products and services.• Exhibitors can interact real time with locals and international Visitors / buyers. • Exhibitors will have customized virtual booths.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 13,
    date: { day: 23, month: 7, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "Food & Hotel Thailand",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "International Exhibition of Food & Drink, Hotel, Bakery, Restaurant & Foodservice Equipment, Supplies & Services",
      "The Food & Hotel Thailand (FHT) is the leading premium international trade exhibition for food and hospitality business in Thailand and the region. Working with associations and organizing events together with FHT's marketing and press activities ensures FHT consistently delivers high quality and high numbers of professional visitors from hotels, restaurants, retail, manufacturing, importers, distributors, chefs, sommeliers, baristas and many more.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 14,
    date: { day: 23, month: 7, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "Zuchex International Home & Kitchenwares Fair",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Discover A New Perspective",
      "Zuchex International Home & Kitchenwares Fair is a premier event that brings together manufacturers, producers, and suppliers of housewares, gifts, electrical appliances, bathroom and kitchen accessories, carpets, rugs, kitchenware, decorative accessories, tableware, home textiles under one roof and forges best market deals, which are consumer friendly. Different shades of giftware, homeware are displayed in this event, that stands as the main attraction of the event.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 15,
    date: { day: 27, month: 7, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "Florida Restaurant & Lodging Show",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "The hospitality industry exhibition",
      "Florida Restaurant & Lodging Show is a pioneer show exhibiting products and services from Hotel, Restaurant & Catering industry. It provides access to the hottest menu trends, state of the art design and decor, the best in business education and 450 of the leading vendors and purveyors dedicated to serving the restaurant and food service community - all under one roof. By conducting educational seminars and talk shows, this event gives opportunity to gain a wealth of knowledge from some of the best minds in the restaurant and food service industry.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 16,
    date: { day: 28, month: 7, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "Annual MICE India and Luxury Travel Congress",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Unveiling the Strength of MICE & Luxury Travel from Indi",
      "The MILT Congress is a premium platform that provides the opportunity to industry leaders who represent India's top corporations, most prominent associations, biggest film production houses, top travel agencies, and premium destination wedding planners to meet with global travel & hospitality suppliers.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 17,
    date: { day: 29, month: 7, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "Alberta Food & Beverage Expo - Grande Prairie",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Alberta Food & Beverage Expo - Grande Prairie will feature hundreds of wines, beers, delicious cocktails and food sampling from the very best restaurants and local suppliers that Grande Prairie has to offer. Local restaurants, pubs, and suppliers are also giving out incredible gift certificates.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 18,
    date: { day: 1, month: 8, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "Oklahoma Restaurant Convention & Expo",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "Oklahoma Restaurant Convention & Expo provides the attendees with an opportunity to meet decision makers face-to-face and close the deal on the spot, salesstaff can meet more potential buyers, and customers can touch, taste, feel and experience the products and services, which gives the attendees a competitive edge.",
      "Reservations are recommended and seating is limited.",
    ],
  },
  {
    id: 19,
    date: { day: 3, month: 8, year: 2021 },
    time: "10:00 AM - 6:00 PM",
    title: "THAIFEX - Anuga Asia",
    url: "https://www.nerdwallet.com/assets/blog/wp-content/uploads/2020/01/social-wedding-travel-770x462.jpg",
    descriptions: [
      "International Trade Exhibition Covering Food & Beverage Industry",
      "OTHAIFEX-Anuga Asia is an international trade fair with 11 trade shows under 1 roof. The recent rebranding of the trade event further cements THAIFEX Anuga Asia as a gateway of choice for international companies looking to enter Asia, one of the largest economic zones in the world, and will serve as an international platform for rapidly-expanding Asian businesses. It is a trade event to interact, exchange ideas and shape the future of the F&B industry. With an increased scale and elevated quality, THAIFEX-Anuga Asia 2020 promises a holistic programme to better equip the F&B industry with tools to stay ahead of the curve and solve pressing issues faced.",
      "Reservations are recommended and seating is limited.",
    ],
  },
];

new Happenings();
