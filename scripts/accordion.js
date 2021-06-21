'use strict';

export const accordion = ( element ) => {
	if (element === null) return;

	if ( typeof element === 'string' ) {
		element = document.querySelectorAll( element );
	}
	
	element.forEach( (el, index) => {
		el.addEventListener('click', function() {
			var panel = this.nextElementSibling;
			panel.classList.toggle('hidden');
			this.classList.toggle('active');
		});
	});
}