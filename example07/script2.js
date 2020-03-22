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
	// reference to the REDIPS.drag library
	let rd = REDIPS.drag;
	// initialization
	rd.init();
	// set hover color
	rd.hover.colorTd = '#9BB3DA';
	// single element per cell
	rd.dropMode = 'single';
	// event handler invoked after element is cloned
	rd.event.cloned = function () {
		// set id of cloned DIV element
		let clonedId = rd.obj.id;
		// if DIV id begins with "e" then make exception (allow dragged DIV to enter TD with class name "redips-mark")
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
