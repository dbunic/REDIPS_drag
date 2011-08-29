/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init variable
var redips_init;

// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag lib
	var	rd = REDIPS.drag;
	// set hover color
	rd.hover_color = '#DDD';
	// initialization
	rd.init();
	// define color for empty row
	rd.row_empty_color = '#eee';
	// row was clicked - enable / disable tables
	rd.myhandler_row_clicked = function () {
		// find table
		var tbl = rd.find_parent('TABLE', rd.obj);
		// if row belongs to the "main" table
		if (tbl.className.indexOf('main') > -1) {
			rd.enable_table(false, 'view');
			rd.enable_table(true, 'main');
		}
		// row belongs to the "view" table
		else {
			rd.enable_table(true, 'view');
			rd.enable_table(false, 'main');
		}
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}