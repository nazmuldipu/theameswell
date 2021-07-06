'use strict';
import '../../components/FormSender/index.js';
import '../../components/WeatherWidget/index.js';

var infoBox = document.getElementById('foodBeverageYesText');
infoBox.style.display = 'none';

var radios = document.querySelectorAll('input[name="foodBeverage"]');
function changeHandler(event) {
   if ( this.value === 'yes' ) {
      infoBox.style.display = 'block';
   } else if ( this.value === 'no' ) {
      infoBox.style.display = 'none';
   }  
}

Array.prototype.forEach.call(radios, function(radio) {
   radio.addEventListener('change', changeHandler);
});