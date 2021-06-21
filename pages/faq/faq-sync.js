'use strict';
import { backToTop } from '../../scripts/backtotop';
import { accordion } from '../../scripts/accordion';

document.addEventListener('DOMContentLoaded', function(){
	// Initialize Accordoin script
	accordion( '.accordion-toggle' );

	// Initialize Back To Top
	backToTop( '.button--backtotop' );
});
