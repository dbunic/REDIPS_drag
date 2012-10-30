/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var redipsInit,
	shiftMode,
	toggleAnimation,
	toggleShiftAfter,
	toggleConfirm,
	counter = 0;


// redips initialization
redipsInit = function () {
	// reference to the REDIPS.drag library
	var	rd = REDIPS.drag;
	// initialization
	rd.init();
	// set mode option to "shift"
	rd.dropMode = 'shift';
	// enable animation on shifted elements
	rd.animation.shift = true;
	// set animation loop pause
	rd.animation.pause = 20;
	// add counter to cloned element name
	rd.event.cloned = function () {
		// increase counter
		counter++;
		// append to the DIV element name
		rd.obj.innerHTML += counter;
	};
};


// set shift_mode
shiftMode = function (radio) {
	REDIPS.drag.shift.mode= radio.value;
};


// enable / disable animation
toggleAnimation = function (chk) {
	REDIPS.drag.animation.shift = chk.checked;
};


// enable / disable shift after element is deleted
toggleShiftAfter = function (chk) {
	REDIPS.drag.shift.after = chk.value;
};


// toggles trash_ask parameter defined at the top
toggleConfirm = function (chk) {
	if (chk.checked === true) {
		REDIPS.drag.trash.question = 'Are you sure you want to delete DIV element?';
	}
	else {
		REDIPS.drag.trash.question = null;
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}