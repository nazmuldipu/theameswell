'use strict';

export const accordion = ( el ) => {
	if (el === null) return;

	if ( typeof el === 'string' ) {
		el = document.querySelector( el );
	}
	
	for (var i = 0; i < el.length; i++) {
		el[i].addEventListener('click', function() {
			var panel = this.nextElementSibling;
			panel.classList.toggle('hidden');
			this.classList.toggle('active');
		});
	}
}