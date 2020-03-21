/* eslint-env browser */
/* eslint
   semi: ["error", "always"],
   indent: [2, "tab"],
   no-tabs: 0,
   no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
   one-var: ["error", "always"] */
/* global REDIPS */

/* enable strict mode */
'use strict';

// create redips container
let redips = {};

// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag lib
	let rd = REDIPS.drag;
	// initialization
	rd.init();
	// dragged elements can be placed to the empty cells only
	rd.dropMode = 'single';
	// elements could be cloned with pressed SHIFT key
	rd.clone.keyDiv = true;
	// every change of current TD will have different background color
	rd.event.changed = function () {
		rd.hover.colorTd = redips.rndColor();
	};
};


// random color generator - http://www.redips.net/javascript/random-color-generator/
redips.rndColor = function () {
	let hex = '0123456789ABCDEF'.split(''),
		color = '#', i;
	for (i = 0; i < 6; i++) {
		color = color + hex[Math.floor(Math.random() * 16)];
	}
	return color;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
