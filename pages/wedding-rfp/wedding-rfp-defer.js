console.log('wedding-rfp-defer.js')

import { DayPicker } from '../../components/DayPicker/index.js'

let minDate = new Date();
// minDate.setDate(minDate.getDate() + 1); //starting day is 1 days from now


var startDate = new DayPicker({
    field: document.getElementById("desiredDate"),
    minDate,
    showPrice:false,
    format: "yyyy-MM-dd",
});
