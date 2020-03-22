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
	// set shift drop option
	rd.dropMode = 'shift';
	// enable shift animation
	rd.shift.animation = true;
};


// function sets drop_option parameter
redips.setDropMode = function (radioButton) {
	REDIPS.drag.dropMode = radioButton.value;
};


// enable / disable animation
redips.toggleAnimation = function (chk) {
	REDIPS.drag.shift.animation = chk.checked;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
