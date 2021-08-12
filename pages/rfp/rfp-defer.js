import { DayPicker } from '../../components/DayPicker/index.js'

let minDate = new Date();
// minDate.setDate(minDate.getDate() + 1); //starting day is 1 days from now
let maxDate = new Date;
maxDate.setDate(maxDate.getDate() + 60); //maxlimit is 60 days from now;


var startDate = new DayPicker({
    field: document.getElementById("startDate"),
    minDate,
    maxDate,
    showPrice:false,
    format: "yyyy-MM-dd",
});

var endDate = new DayPicker({
    field: document.getElementById("endDate"),
    minDate,
    maxDate,
    showPrice:false,
    format: "yyyy-MM-dd",
});