/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init and random color generator
var redipsInit,
	rndColor;

// redips initialization
redipsInit = function () {
	// reference to the REDIPS.drag lib
	var rd = REDIPS.drag;
	// initialization
	rd.init();
	// dragged elements can be placed to the empty cells only
	rd.dropMode = 'single';
	// elements could be cloned with pressed SHIFT key
	rd.clone.keyDiv = true;
	// every change of current TD will have different background color
	rd.event.changed = function () {
		rd.hover.colorTd = rndColor();
	};
};

// random color generator - http://www.redips.net/javascript/random-color-generator/
function rndColor() {
	var hex = '0123456789ABCDEF'.split(''),
		color = '#', i;
	for (i = 0; i < 6 ; i++) {
		color = color + hex[Math.floor(Math.random() * 16)];
	}
	return color;
}

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}