import { DayPicker } from '../../components/DayPicker/index.js'

let minDate = new Date();
minDate.setDate(minDate.getDate() + 2); //starting day is 5 days from now
let maxDate = new Date;
maxDate.setDate(maxDate.getDate() + 60); //maxlimit is 60 days from now;


var startDate = new DayPicker({
    field: document.getElementById("startDate"),
    minDate,
    maxDate,
    format: "yyyy-MM-dd",
});

var endDate = new DayPicker({
    field: document.getElementById("endDate"),
    minDate,
    maxDate,
    format: "yyyy-MM-dd",
});