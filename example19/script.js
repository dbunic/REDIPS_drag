/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redipsInit variable
var redipsInit;

// redips initialization
redipsInit = function () {
	// set REDIPS.drag reference
	var	rd = REDIPS.drag;
	// lib initialization
	rd.init();
	// set hover color for TR
	rd.hover.colorTr = '#ddd';
	// define color for empty row
	rd.style.rowEmptyColor = '#eee';
	// row was clicked - enable / disable tables
	rd.event.rowClicked = function () {
		// find table
		var tbl = rd.findParent('TABLE', rd.obj);
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
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}