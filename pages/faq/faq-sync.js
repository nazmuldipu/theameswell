'use strict';
import { backToTop } from '../../scripts/backtotop.js';

document.addEventListener('DOMContentLoaded', function(){
	var element = document.querySelectorAll('.accordion-toggle');
	
	for (var i = 0; i < element.length; i++) {
		element[i].addEventListener('click', function() {
			var panel = this.nextElementSibling;
			panel.classList.toggle('hidden');
			this.classList.toggle('active');
		});
	}

	// Initialize Back To Top
	backToTop( '.button--backtotop' );
});
