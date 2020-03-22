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
	// reference to the REDIPS.drag object
	let rd = REDIPS.drag;
	// define border style (this should go before init() method)
	rd.style.borderEnabled = 'none';
	// initialization
	rd.init();
	// set hover color
	rd.hover.colorTd = '#FFE885';
	// DIV elements can be dropped to the empty cells only
	rd.dropMode = 'single';
	// DIV element was clicked - disable 'mini' tables
	rd.event.clicked = function () {
		// search for table inside DIV element
		let tbl = rd.obj.getElementsByTagName('TABLE');
		// if dragged DIV element contains table then disable all mini tables
		// it is not allowed to drop mini table within another mini table
		if (tbl.length > 0) {
			rd.enableTable(false, 'mini');
		}
	};
	// after dragged DIV element is dropped, enable all mini tables
	// this way, mini tables will be ready for accepting ordinary DIV element (circle DIV)
	rd.event.finish = function () {
		rd.enableTable(true, 'mini');
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
