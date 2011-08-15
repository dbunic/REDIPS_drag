/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

window.onload = function () {
	// reference to the REDIPS.drag library and message line
	var	rd = REDIPS.drag;
	// // set hover color
	rd.hover_color = '#DDD';
	// initialization
	rd.init();
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