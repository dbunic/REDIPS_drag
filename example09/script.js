/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


var redips_init,		// define redips_init variable
	set_drop_option,	// set drop option regarding to the table where DIV element belongs
	toggle_animation,	// enable / disable animation
	rd = REDIPS.drag;	// reference to the REDIPS.drag lib


// redips initialization
redips_init = function () {
	// initialization
	rd.init();
	// "moved" event handler uses reference of the moved element
	rd.myhandler_moved = function () {
		set_drop_option(rd.obj);
	}
	// "cloned" event handler uses reference of the source element (not cloned element)
	rd.myhandler_cloned	= function () {
		set_drop_option(rd.obj_old);
	}
};


// set drop option regarding to the table where DIV element belongs
set_drop_option = function (el) {
	// loop up until found table
	while (el && el.nodeName !== 'TABLE') {
		el = el.parentNode;
	}
	// loop ends and "el" position should be table
	if (el.id === 'table1') {
		rd.drop_option = 'shift';
	}
	else {
		rd.drop_option = 'single';
	}
}


// enable / disable animation
toggle_animation = function (chk) {
	REDIPS.drag.animation_shift = chk.checked;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}