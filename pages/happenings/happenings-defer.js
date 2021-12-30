"use strict";
import * as data from '../_data/data2.json';

const events = data.happenings.map((item)=> {
  return {
    ...item,
    date: {
      day: parseInt(item.date.day),
      month: parseInt(item.date.month),
      year: parseInt(item.date.year),
    }
  }
})
console.log(events)
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
      eventHtml += `<div class="c-event hidden xmed:block text-xs truncate uppercase cursor-pointer" id="${et.id}">${et.title}</div> 
                    <span class="d-event xmed:hidden text-ams-magenta inline-block">
                        <svg width="5" height="5" viewBox="0 0 5 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="2.5" cy="2.5" r="2.5" fill="#EC008C"/>
                        </svg>
                    </span>`;
    });
  }
  return `<div class="py-4 xmed:py-8 grid-item">
            <div class="calendar-date font-bold text-2xl xmed:text-6xl cursor-pointer w-9 xmed:w-36 mx-auto   ${
              opts.isToday
                ? "text-ams-white bg-ams-pink"
                : eventList.length > 0
                ? "text-ams-pink"
                : "text-ams-primary"
            } pb-1">${opts.day}</div>
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

const renderEventCard = (event) => {
  const eventPicElement = document.querySelector('.event_id_' + event.id);
  return `<section class="bg-ams-white xmed:shadow-2xl mb-4 border-b xmed: border-0 w-96 h-96">
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
            <div class="pb-5 text-left pl-6 bg-ams-white text-xs text-ams-primary font-medium"> <a  href="happenings-detail?id=${event.id}" class="inline-block py-2 px-8 bg-ams-gold text-ams-white font-serif tracking-wide button--primary button"> View More </a></div>
          </section>`;
};

const renderOurHappeningsCard = (event) => {
  const eventPicElement = document.querySelector('.event_id_' + event.id)

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

  return `<section class="bg-ams-white xmed:shadow-2xl mb-10 w-full">
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
            <div class="xmed:hidden grid grid-cols-2 gap-3 px-6 ">
              ${ctaEle}
            </div>
          </section>`;
}
var Happenings = function (options) {
  var self = this;
  const calendar = document.querySelector("#happening_calendar");
  const our_happenings = document.querySelector("#our_happenings");
  const btn_view_all = document.querySelector(".btn_view_all");
  const our_happenings_title = document.querySelector('#our_happenings_title');
  const screen_width = window.innerWidth || document.documentElement.clientWidth || 
  document.body.clientWidth;
  
  //set tool tip element
  const toolTipEle = document.createElement("div");
  toolTipEle.className = "tooltipText hidden";
  toolTipEle.innerHTML = "tooltip";

  calendar.appendChild(toolTipEle);

  self.gotoDate(new Date());

  self._onClick = function (e) {
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

    // set mobile view events
    if(screen_width < 900){
      if(hasClass(target, "calendar-date")){
        const day = Number(target.innerHTML);
        const evList =  getDayEvents(
          self.calendar.year,
          self.calendar.month,
          day,
          events
        );
        if(evList.length){
          our_happenings_title.innerHTML = "Happenings for <br/>" + months[self.calendar.month] + ' ' + day;
          our_happenings_title.scrollIntoView()
          self.showOurHappenings(our_happenings, evList);
        }

      }
    }
  };
  self._mouseover = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
      pEl = target;

    if (!target) {
      return;
    }
    if (hasClass(target, "calendar-date")) {
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
        const eventEle = renderEventCard(event);
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
      const day = Number(parentEle.querySelector(".calendar-date").innerHTML);
      const eventList = getDayEvents(
        self.calendar.year,
        self.calendar.month,
        day,
        events
      );
      const event = eventList.find((ev) => ev.id == id);
      const eventEle = renderEventCard(event);
      toolTipEle.innerHTML = eventEle;
      removeClass(toolTipEle, "hidden");
      self.adjustPosition(parentEle, toolTipEle);
    }
  };
  self._view_all = function (e) {
    self.viewAll = true;
    self.showOurHappenings(our_happenings);
    addClass(btn_view_all, "hidden");
  };

  addEvent(btn_view_all, "click", self._view_all);
  addEvent(calendar, "click", self._onClick);
  self.showOurHappenings(our_happenings);
  if(screen_width >= 900 ){    
    addEvent(calendar, "mouseover", self._mouseover);
  }

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
  showOurHappenings: function (el, evs) {
    let evHtml = "";
    let curEvents = [];
    if(evs && evs.length > 0){
      for (let j = 0; j < evs.length; j++) {
        evHtml += renderOurHappeningsCard(evs[j]);                
      }
    }
    else{
      const today = new Date();
      for(let i = 0; i < events.length; i++){
        const evn = events[i];
        const evnDate = new Date(evn.date.year, (evn.date.month - 1), evn.date.day);
        if(evnDate.getTime() >= today.getTime()){
          curEvents.push(evn);
        }        
        if(!this.viewAll && curEvents.length >= 3) break;
      }
      
      curEvents.forEach(ev =>{
        evHtml += renderOurHappeningsCard(ev);
      })
    } 
    
    el.innerHTML = evHtml;
  },
};

new Happenings();
