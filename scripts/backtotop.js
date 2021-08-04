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


	// Back to top sticky feature
	var _offset;

	function calculateOffset() {
		_offset = 0;
		var _el = el;
		while( _el && !isNaN( _el.offsetLeft ) && !isNaN( _el.offsetTop ) ) {
			_offset += _el.offsetTop - _el.scrollTop;
			_el = _el.offsetParent;
		}
	}
	calculateOffset();

	function stickyBackToTop() {
		if (window.scrollY > (_offset - el.offsetTop)) {
			el.classList.remove('absolute');
			el.classList.add('fixed');
		} else {
			el.classList.add('absolute');
			el.classList.remove('fixed');
		}
	}

	window.addEventListener('resize', calculateOffset);
	window.addEventListener('scroll', stickyBackToTop);
}