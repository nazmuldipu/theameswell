'use strict';
import '../../components/FormSender/index.js';

function ceremonyPlaceChangeHandler(event) {
    if(event.target.value === 'offsite'){
        ceremonyLocation.style.display = 'block';
    } else{
        ceremonyLocation.style.display = 'none';
    }
}

var ceremonyPlace = document.getElementById('ceremonyPlace');
var ceremonyLocation = document.getElementsByClassName("ceremonyLocation")[0];
ceremonyLocation.style.display = 'none';
ceremonyPlace.addEventListener('change', ceremonyPlaceChangeHandler);