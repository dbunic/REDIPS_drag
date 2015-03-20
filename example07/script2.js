/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// create redips container
var redips = {};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag library
	var rd = REDIPS.drag;
	// initialization
	rd.init();
	// set hover color
	rd.hover.colorTd = '#9BB3DA';
	// single element per cell
	rd.dropMode = 'single';
	// event handler invoked after element is cloned
	rd.event.cloned = function () {
		// set id of cloned element
		var clonedId = rd.obj.id;
		// if id of cloned element begins with "e" then make exception (allow DIV element to access cells with class name "redips-mark")
		if (clonedId.substr(0, 1) === 'e') {   
			rd.mark.exception[clonedId] = 'mark';
		}
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}