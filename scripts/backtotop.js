'use strict';

export const backToTop = ( el ) => {

	if (el === null) return;

	if ( typeof el === 'string' ) {
		el = document.querySelector( el );
	}

	el.addEventListener( 'click', (e) => {
		e.preventDefault();

		window.scroll( {
			top: 0, 
			behavior: 'smooth' 
		} );
	} );
}