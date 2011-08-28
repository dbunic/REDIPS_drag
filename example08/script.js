/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init variable
var redips_init;

// redips initialization
redips_init = function () {
	var rd = REDIPS.drag;	// reference to the REDIPS.drag class
	// DIV container initialization
	rd.init('drag1');
	rd.init('drag2');
	// elements could be cloned with pressed SHIFT key (for demo)
	rd.clone_shiftKey = true;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}