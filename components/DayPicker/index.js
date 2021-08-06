"use strict";

const hasEventListeners = !!window.addEventListener;
const sto = window.setTimeout;
const defaults = {
  // bind the picker to a form field
  field: null,

  // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
  bound: undefined,

  // position of the datepicker, relative to the field (default to bottom & left)
  // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
  position: "bottom left",

  // automatically fit in the viewport even if it means repositioning from the position option
  reposition: true,

  // the default output format for `.toString()` and `field` value
  format: "YYYY-MM-DD",

  // the toString function which gets passed a current date object and format
  // and returns a string
  toString: null,

  // used to create date object from current input string
  parse: null,

  // the minimum/earliest date that can be selected
  minDate: null,
  // the maximum/latest date that can be selected
  maxDate: null,
  minYear: 0,
  maxYear: 9999,
  minMonth: undefined,
  maxMonth: undefined,

  dpickerConst: {
    previousMonth: "Previous Month",
    nextMonth: "Next Month",
    months: [
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
    ],
    weekdays: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  },

  // callback function
  onSelect: null,
  onOpen: null,
  onClose: null,
};
const addEvent = function (el, e, callback, capture) {
  if (hasEventListeners) {
    el.addEventListener(e, callback, !!capture);
  } else {
    el.attachEvent("on" + e, callback);
  }
};

const removeEvent = function (el, e, callback, capture) {
  if (hasEventListeners) {
    el.removeEventListener(e, callback, !!capture);
  } else {
    el.detachEvent("on" + e, callback);
  }
};

const trim = function (str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
};

const hasClass = function (el, cn) {
  return (" " + el.className + " ").indexOf(" " + cn + " ") !== -1;
};

const addClass = function (el, cn) {
  if (!hasClass(el, cn)) {
    el.className = el.className === "" ? cn : el.className + " " + cn;
  }
};

const removeClass = function (el, cn) {
  el.className = trim((" " + el.className + " ").replace(" " + cn + " ", " "));
};

const isArray = function (obj) {
  return /Array/.test(Object.prototype.toString.call(obj));
};

const isDate = function (obj) {
  return (
    /Date/.test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime())
  );
};

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

const compareDates = function (a, b) {
  return a.getTime() === b.getTime();
};

const extend = function (to, from, overwrite) {
  var prop, hasProp;
  for (prop in from) {
    hasProp = to[prop] !== undefined;
    if (
      hasProp &&
      typeof from[prop] === "object" &&
      from[prop] !== null &&
      from[prop].nodeName === undefined
    ) {
      if (isDate(from[prop])) {
        if (overwrite) {
          to[prop] = new Date(from[prop].getTime());
        }
      } else if (isArray(from[prop])) {
        if (overwrite) {
          to[prop] = from[prop].slice(0);
        }
      } else {
        to[prop] = extend({}, from[prop], overwrite);
      }
    } else if (overwrite || !hasProp) {
      to[prop] = from[prop];
    }
  }
  return to;
};

const fireEvent = function (el, eventName, data) {
  var ev;

  if (document.createEvent) {
    ev = document.createEvent("HTMLEvents");
    ev.initEvent(eventName, true, false);
    ev = extend(ev, data);
    el.dispatchEvent(ev);
  } else if (document.createEventObject) {
    ev = document.createEventObject();
    ev = extend(ev, data);
    el.fireEvent("on" + eventName, ev);
  }
};

const adjustCalendar = function (calendar) {
  if (calendar.month < 0) {
    calendar.year -= Math.ceil(Math.abs(calendar.month) / 12);
    calendar.month += 12;
  }
  if (calendar.month > 11) {
    calendar.year += Math.floor(Math.abs(calendar.month) / 12);
    calendar.month -= 12;
  }
  return calendar;
};

const renderDayName = function (opts, day, abbr) {
  while (day >= 7) {
    day -= 7;
  }
  return abbr
    ? opts.dpickerConst.weekdaysShort[day]
    : opts.dpickerConst.weekdays[day];
};

const renderDay = function (opts) {
  var arr = [];
  var ariaSelected = "false";
  if (opts.isEmpty) {
    return '<td class="is-empty"></td>';
  }
  if (opts.isToday) {
    arr.push("is-today");
  }
  if (opts.isSelected) {
    arr.push("is-selected");
    ariaSelected = "true";
  }
  if (opts.isDisabled) {
    arr.push("is-disabled");
  }
  return (
    '<td data-day="' +
    opts.day +
    '" class="' +
    arr.join(" ") +
    '" aria-selected="' +
    ariaSelected +
    '">' +
    '<button class="daypicker-button daypicker-day" type="button" ' +
    'data-daypicker-year="' +
    opts.year +
    '" data-daypicker-month="' +
    opts.month +
    '" data-daypicker-day="' +
    opts.day +
    '">' +
    opts.day +
    "</button>" +
    "</td>"
  );
};

const renderRow = function (days) {
  return `<tr class="daypicker-row">${days.join("")}</tr>`;
};

const renderBody = function (rows) {
  return "<tbody>" + rows.join("") + "</tbody>";
};

const renderHead = function (opts) {
  var i,
    arr = [];
  if (opts.showWeekNumber) {
    arr.push("<th></th>");
  }
  for (i = 0; i < 7; i++) {
    arr.push(
      '<th scope="col"><span title="' +
        renderDayName(opts, i) +
        '">' +
        renderDayName(opts, i, true) +
        "</span></th>"
    );
  }
  return `<thead><tr class="days-name">${arr.join("")}</tr></thead>`;
};

const renderTitle = function (instance, year, month, randId) {
  var opts = instance._o;
  let html = `<div id="${randId}" class="daypicker-title" role="heading" aria-live="assertive">`;

  // Set month and year label, nav buttons
  html += `<div class="daypicker-label"> ${opts.dpickerConst.months[month]} ${year} </div>`;
  if (!(opts.minYear > year || opts.minMonth >= month)) {
    html += `<button class="daypicker-prev" type="button">${opts.dpickerConst.previousMonth}</button>`;
  }
  if (!(opts.maxYear < year || opts.maxMonth <= month)) {
    html += `<button class="daypicker-next" type="button">${opts.dpickerConst.nextMonth}</button>`;
  }

  return (html += "</div>");
};

const renderTable = function (opts, data, randId) {
  return (
    '<table cellpadding="0" cellspacing="0" class="daypicker-table" role="grid" aria-labelledby="' +
    randId +
    '">' +
    renderHead(opts) +
    renderBody(data) +
    "</table>"
  );
};

var DayPicker = function (options) {
  var self = this;
  var opts = self.config(options);

  self._onMouseDown = function (e) {
    if (!self._view) {
      return;
    }
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (!target) {
      return;
    }

    if (hasClass(target, "daypicker-button") && !hasClass(target, "is-empty")) {
      self.setDate(
        new Date(
          target.getAttribute("data-daypicker-year"),
          target.getAttribute("data-daypicker-month"),
          target.getAttribute("data-daypicker-day")
        )
      );
      if (opts.bound) {
        sto(function () {
          self.hide();
        }, 100);
      }
    } else if (hasClass(target, "daypicker-prev")) {
      self.prevMonth();
    } else if (hasClass(target, "daypicker-next")) {
      self.nextMonth();
    }

    // if this is touch event prevent mouse events emulation
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
      return false;
    }
  };

  self._parseFieldValue = function () {
    if (opts.parse) {
      return opts.parse(opts.field.value, opts.format);
    } else {
      return new Date(Date.parse(opts.field.value));
    }
  };

  self._onInputClick = function () {
    self.show();
  };

  self._onClick = function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
      pEl = target;

    if (!target) {
      return;
    }

    do {
      if (hasClass(pEl, "daypicker-single") || pEl === opts.trigger) {
        return;
      }
    } while ((pEl = pEl.parentNode));
    if (self._view && target !== opts.trigger && pEl !== opts.trigger) {
      self.hide();
    }
  };

  self.el = document.createElement("div");
  self.el.className = "daypicker-single";

  addEvent(self.el, "mousedown", self._onMouseDown, true);
  addEvent(self.el, "touchend", self._onMouseDown, true);

  if (opts.field) {
    if (opts.bound) {
      document.body.appendChild(self.el);
    } else {
      opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
    }
  }
  let currDate = new Date();
  if(isDate(opts.minDate) && opts.minDate.getTime() > currDate.getTime()){
    currDate = opts.minDate;
  } else if(isDate(opts.maxDate) && opts.maxDate.getTime() < currDate.getTime()){
    currDate = opts.maxDate;
  }
  self.gotoDate(currDate);

  if (opts.bound) {
    this.hide();
    self.el.className += " is-bound";
    addEvent(opts.trigger, "click", self._onInputClick);
  }
};

DayPicker.prototype = {
  config: function (options) {
    if (!this._o) {
      this._o = extend({}, defaults, true);
    }
    var opts = extend(this._o, options, true);
    opts.field = opts.field && opts.field.nodeName ? opts.field : null;
    opts.bound = !!(opts.bound !== undefined
      ? opts.field && opts.bound
      : opts.field);
    opts.trigger =
      opts.trigger && opts.trigger.nodeName ? opts.trigger : opts.field;

    if (!isDate(opts.minDate)) {
      opts.minDate = false;
    }
    if (!isDate(opts.maxDate)) {
      opts.maxDate = false;
    }
    if (opts.minDate && opts.maxDate && opts.maxDate < opts.minDate) {
      opts.maxDate = opts.minDate = false;
    }
    if (opts.minDate) {
      this.setMinDate(opts.minDate);
    }
    if (opts.maxDate) {
      this.setMaxDate(opts.maxDate);
    }

    return opts;
  },
  toString: function (format) {
    format = format || this._o.format;
    format = format || this._o.format;
    if (!isDate(this._d)) {
      return "";
    }
    if (this._o.toString) {
      return this._o.toString(this._d, format);
    }
    return this.format(format);
  },
  format: function (format) {
    var o = {
      "M+": this._d.getMonth() + 1, //month
      "d+": this._d.getDate(), //day
      "D+": this._d.getDate(), //day
      "h+": this._d.getHours(), //hour
      "m+": this._d.getMinutes(), //minute
      "s+": this._d.getSeconds(), //second
      "q+": Math.floor((this._d.getMonth() + 3) / 3), //quarter
      S: this._d.getMilliseconds(), //millisecond
    };

    if (/((Y+)|(y+))/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (this._d.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }

    // if(/(y+)/.test(format)) {format=format.replace(RegExp.$1,
    //         (this._d.getFullYear()+"").substr(4 - RegExp.$1.length));}

    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return format;
  },
  getDate: function () {
    return isDate(this._d) ? new Date(this._d.getTime()) : null;
  },
  setDate: function (date, preventOnSelect) {
    if (!date) {
      this._d = null;

      if (this._o.field) {
        this._o.field.value = "";
        fireEvent(this._o.field, "change", { firedBy: this });
      }

      return this.draw();
    }
    if (typeof date === "string") {
      date = new Date(Date.parse(date));
    }
    if (!isDate(date)) {
      return;
    }

    var min = this._o.minDate,
      max = this._o.maxDate;

    if (isDate(min) && date < min) {
      date = min;
    } else if (isDate(max) && date > max) {
      date = max;
    }

    this._d = new Date(date.getTime());
    setToStartOfDay(this._d);
    this.gotoDate(this._d);

    if (this._o.field) {
      this._o.field.value = this.toString();
      fireEvent(this._o.field, "change", { firedBy: this });
    }
    if (!preventOnSelect && typeof this._o.onSelect === "function") {
      this._o.onSelect.call(this, this.getDate());
    }
  },
  gotoDate: function (date) {
    var newCalendar = true;

    if (!isDate(date)) {
      return;
    }

    if (this.calendars) {
      var firstVisibleDate = new Date(
        this.calendars[0].year,
        this.calendars[0].month,
        1
      );
      var lastVisibleDate = new Date(
        this.calendars[this.calendars.length - 1].year,
        this.calendars[this.calendars.length - 1].month,
        1
      );
      var visibleDate = date.getTime();
      // get the end of the month
      lastVisibleDate.setMonth(lastVisibleDate.getMonth() + 1);
      lastVisibleDate.setDate(lastVisibleDate.getDate() - 1);
      newCalendar =
        visibleDate < firstVisibleDate.getTime() ||
        lastVisibleDate.getTime() < visibleDate;
    }
    if (newCalendar) {
      this.calendars = [
        {
          month: date.getMonth(),
          year: date.getFullYear(),
        },
      ];
    }
    this.adjustCalendars();
  },
  adjustCalendars: function () {
    this.calendars[0] = adjustCalendar(this.calendars[0]);
    //   for (var c = 1; c < this._o.numberOfMonths; c++) {
    //     this.calendars[c] = adjustCalendar({
    //       month: this.calendars[0].month + c,
    //       year: this.calendars[0].year,
    //     });
    //   }
    this.draw();
  },
  nextMonth: function () {
    this.calendars[0].month++;
    this.adjustCalendars();
  },
  prevMonth: function () {
    this.calendars[0].month--;
    this.adjustCalendars();
  },
  setMinDate: function (value) {
    if (value instanceof Date) {
      setToStartOfDay(value);
      this._o.minDate = value;
      this._o.minYear = value.getFullYear();
      this._o.minMonth = value.getMonth();
    } else {
      this._o.minDate = defaults.minDate;
      this._o.minYear = defaults.minYear;
      this._o.minMonth = defaults.minMonth;
      this._o.startRange = defaults.startRange;
    }

    this.draw();
  },
  setMaxDate: function (value) {
    if (value instanceof Date) {
      setToStartOfDay(value);
      this._o.maxDate = value;
      this._o.maxYear = value.getFullYear();
      this._o.maxMonth = value.getMonth();
    } else {
      this._o.maxDate = defaults.maxDate;
      this._o.maxYear = defaults.maxYear;
      this._o.maxMonth = defaults.maxMonth;
      this._o.endRange = defaults.endRange;
    }

    this.draw();
  },
  draw: function (force) {
    if (!this._view && !force) {
      return;
    }
    var opts = this._o,
      html = "",
      randId;

    //   for (var c = 0; c < opts.numberOfMonths; c++) {
    randId =
      "daypicker-title-" +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substr(0, 2);
    html +=
      '<div class="daypicker-lendar">' +
      renderTitle(
        this,
        this.calendars[0].year,
        this.calendars[0].month,
        randId
      ) +
      this.render(this.calendars[0].year, this.calendars[0].month, randId) +
      "</div>";
    //   }
    this.el.innerHTML = html;

    if (opts.bound) {
      if (opts.field.type !== "hidden") {
        sto(function () {
          opts.trigger.focus();
        }, 200);
      }
    }
  },
  adjustPosition: function () {
    var field,
      pEl,
      width,
      height,
      viewportWidth,
      viewportHeight,
      scrollTop,
      left,
      top,
      clientRect,
      leftAligned,
      bottomAligned;

    this.el.style.position = "absolute";
    field = this._o.trigger;
    pEl = field;
    width = this.el.offsetWidth;
    height = this.el.offsetHeight;
    viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    scrollTop =
      window.pageYOffset ||
      document.body.scrollTop ||
      document.documentElement.scrollTop;
    leftAligned = true;
    bottomAligned = true;

    if (typeof field.getBoundingClientRect === "function") {
      clientRect = field.getBoundingClientRect();
      left = clientRect.left + window.pageXOffset;
      top = clientRect.bottom + window.pageYOffset;
    } else {
      left = pEl.offsetLeft;
      top = pEl.offsetTop + pEl.offsetHeight;
      while ((pEl = pEl.offsetParent)) {
        left += pEl.offsetLeft;
        top += pEl.offsetTop;
      }
    }

    // default position is bottom & left
    if (
      (this._o.reposition && left + width > viewportWidth) ||
      (this._o.position.indexOf("right") > -1 &&
        left - width + field.offsetWidth > 0)
    ) {
      left = left - width + field.offsetWidth;
      leftAligned = false;
    }
    if (
      (this._o.reposition && top + height > viewportHeight + scrollTop) ||
      (this._o.position.indexOf("top") > -1 &&
        top - height - field.offsetHeight > 0)
    ) {
      top = top - height - field.offsetHeight;
      bottomAligned = false;
    }

    if (left < 0) {
      left = 0;
    }

    if (top < 0) {
      top = 0;
    }

    this.el.style.left = left + "px";
    this.el.style.top = top + "px";

    addClass(this.el, leftAligned ? "left-aligned" : "right-aligned");
    addClass(this.el, bottomAligned ? "bottom-aligned" : "top-aligned");
    removeClass(this.el, !leftAligned ? "left-aligned" : "right-aligned");
    removeClass(this.el, !bottomAligned ? "bottom-aligned" : "top-aligned");
  },
  render: function (year, month, randId) {
    var opts = this._o,
      now = new Date(),
      days = getDaysInMonth(year, month),
      before = new Date(year, month, 1).getDay(),
      data = [],
      row = [];
    setToStartOfDay(now);

    var previousMonth = month === 0 ? 11 : month - 1,
      nextMonth = month === 11 ? 0 : month + 1,
      yearOfPreviousMonth = month === 0 ? year - 1 : year,
      yearOfNextMonth = month === 11 ? year + 1 : year,
      daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);
    var cells = days + before,
      after = cells % 7;

    cells += 7 - after;

    for (var i = 0, r = 0; i < cells; i++) {
      var day = new Date(year, month, 1 + (i - before)),
        isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
        isToday = compareDates(day, now),
        isEmpty = i < before || i >= days + before,
        dayNumber = 1 + (i - before),
        monthNumber = month,
        yearNumber = year,
        isDisabled =
          (opts.minDate && day < opts.minDate) ||
          (opts.maxDate && day > opts.maxDate);

      if (isEmpty) {
        if (i < before) {
          dayNumber = daysInPreviousMonth + dayNumber;
          monthNumber = previousMonth;
          yearNumber = yearOfPreviousMonth;
        } else {
          dayNumber = dayNumber - days;
          monthNumber = nextMonth;
          yearNumber = yearOfNextMonth;
        }
      }

      var dayConfig = {
        day: dayNumber,
        month: monthNumber,
        year: yearNumber,
        isSelected: isSelected,
        isToday: isToday,
        isEmpty: isEmpty,
        isDisabled,
        showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths,
      };

      row.push(renderDay(dayConfig));

      if (++r === 7) {
        data.push(renderRow(row));
        row = [];
        r = 0;
      }
    }
    return renderTable(opts, data, randId);
  },
  isVisible: function () {
    return this._view;
  },
  show: function () {
    if (!this.isVisible()) {
      this._view = true;
      this.draw();
      removeClass(this.el, "is-hidden");
      if (this._o.bound) {
        addEvent(document, "click", this._onClick);
        this.adjustPosition();
      }
      if (typeof this._o.onOpen === "function") {
        this._o.onOpen.call(this);
      }
    }
  },
  hide: function () {
    var v = this._view;
    if (v !== false) {
      if (this._o.bound) {
        removeEvent(document, "click", this._onClick);
      }

      this.el.style.position = "static"; // reset
      this.el.style.left = "auto";
      this.el.style.top = "auto";

      addClass(this.el, "is-hidden");
      this._view = false;
      if (v !== undefined && typeof this._o.onClose === "function") {
        this._o.onClose.call(this);
      }
    }
  },
};

export {DayPicker};