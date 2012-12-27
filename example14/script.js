/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


var redipsInit,		// define redipsInit variable
	toggleAnimation,// animation for shift option
	setDropMode;	// function sets dropMode parameter

// redips initialization
redipsInit = function () {
	// reference to the REDIPS.drag lib
	var rd = REDIPS.drag;
	// initialization
	rd.init();
	// set shift drop option
	rd.dropMode = 'shift';
	// enable shift animation
	rd.shift.animation = true;
};


// function sets drop_option parameter
setDropMode = function (radioButton) {
	REDIPS.drag.dropMode = radioButton.value;
};


// enable / disable animation
toggleAnimation = function (chk) {
	REDIPS.drag.shift.animation = chk.checked;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}