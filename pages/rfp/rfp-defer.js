import { DayPicker } from '../../components/DayPicker/index.js'

let minDate = new Date();
// minDate.setDate(minDate.getDate() + 1); //starting day is 1 days from now

var startDate = new DayPicker({
    field: document.getElementById("startDate"),
    minDate,
    showPrice:false,
    format: "yyyy-MM-dd",
});

var endDate = new DayPicker({
    field: document.getElementById("endDate"),
    minDate,
    showPrice:false,
    format: "yyyy-MM-dd",
});