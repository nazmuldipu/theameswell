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
const addEvent = function (el, e, callback, capture) {
  if (hasEventListeners) {
    el.addEventListener(e, callback, !!capture);
  } else {
    el.attachEvent("on" + e, callback);
  }
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

const renderTitle = function (year, month) {
  const titleEle = document.querySelector(".month-name");
  titleEle.innerHTML = months[month] + " " + year;
};

const renderDay = (opts) =>{
  return `<div class="py-4 xmed:py-8 grid-item">
            <div class="font-bold text-2xl xmed:text-6xl ${opts.isToday ? 'text-ams-white bg-ams-pink' : opts.isWeekend ? 'text-ams-pink':'text-ams-primary'}">${opts.day}</div>
            <div>Evnet</div>
          </div>`
}

const renderBody = (year, month) => {
  const bodyEle = document.querySelector(".calendar-body ");
  const now = new Date();
  setToStartOfDay(now)
  const days = getDaysInMonth(year, month);
  const before = new Date(year, month, 1).getDay();
  const totalCell = days + before;
  let dayHtml = "";
  for (let i = 0; i < totalCell; i++) {
    const day = new Date(year, month, 1 + (i - before));
    const isToday = compareDates(day, now);
    const isEmpty = i < before;
    const isWeekend = day.getDay() != 0 && (day.getDay()%4==0 || day.getDay()%5==0);
    const dayNumber = 1 + (i - before);
    if(isEmpty){
      dayHtml += `<div class="is-empty"></div>`
    }else{
      var dayConfig = {
        day: dayNumber,
        month,
        year,
        isWeekend,
        isToday,
      };
      
      dayHtml += renderDay(dayConfig);
    }
  }
  console.log(days, before);
  bodyEle.innerHTML = dayHtml;
};

var DayPicker = function (options) {
  var self = this;
  // const next_nav = document.querySelector('.nav-next');
  // const next_prev = document.querySelector('.nav-prev');
  // console.log(next_nav);
  // console.log(next_prev);
  self.gotoDate(new Date());
  self._nextMonth = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
      pEl = target;

    if (!target) {
      return;
    }
    if (hasClass(target, "nav-next")) {
      self.nextMonth();
    } else if (hasClass(target, "nav-prev")) {
      self.prevMonth();
    }
  };
  addEvent(document, "click", self._nextMonth);
  // next_nav.addEventListener("click", self.nextMonth());
};

DayPicker.prototype = {
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
};

new DayPicker();
