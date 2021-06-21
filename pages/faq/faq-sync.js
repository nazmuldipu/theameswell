'use strict';
import { backToTop } from '../../scripts/backtotop.js';
import { accordion } from '../../scripts/accordion.js';

document.addEventListener('DOMContentLoaded', function(){
	// Initialize Accordion script
	accordion( '.accordion-toggle' );

	// Initialize Back To Top
	backToTop( '.button--backtotop' );
});
