/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init variable
var redips_init;

// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag lib
	var rd = REDIPS.drag;
	// initialization
	rd.init();
	// set switching drop option
	rd.drop_option = 'switching';
};

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}