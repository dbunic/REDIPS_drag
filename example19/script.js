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
	// set REDIPS.drag reference
	let rd = REDIPS.drag;
	// lib initialization
	rd.init();
	// set hover color for TR
	rd.hover.colorTr = '#ddd';
	// define color for empty row
	rd.style.rowEmptyColor = '#eee';
	// row was clicked - enable / disable tables
	rd.event.rowClicked = function () {
		// find table
		let tbl = rd.findParent('TABLE', rd.obj);
		// if row belongs to the "main" table
		if (tbl.className.indexOf('main') > -1) {
			rd.enableTable(false, 'view');
			rd.enableTable(true, 'main');
		}
		// row belongs to the "view" table
		else {
			rd.enableTable(true, 'view');
			rd.enableTable(false, 'main');
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
