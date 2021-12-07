'use strict';
import '../../components/FormSender/index.js';
import '../../components/WeatherWidget/index.js';

const infoBox = document.getElementById('foodBeverageYesText');
infoBox.style.display = 'none';

const foodBeverageItemsSelect = document.getElementById('foodBeverageItemsSelect');
foodBeverageItemsSelect.required = "";

const radios = document.querySelectorAll('input[name="foodBeverage"]');
function changeHandler(event) {
   if ( this.value === 'yes' ) {
      infoBox.style.display = 'block';
      foodBeverageItemsSelect.required = "required";
   } else if ( this.value === 'no' ) {
      infoBox.style.display = 'none';
      foodBeverageItemsSelect.required = "";
   }  
}

Array.prototype.forEach.call(radios, function(radio) {
   radio.addEventListener('change', changeHandler);
});