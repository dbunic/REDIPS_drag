/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var redips_init;


// initialization - after page is fully loaded
redips_init = function () {
	// reference to the REDIPS.drag library and message line
	var	rd = REDIPS.drag;
	// initialization
	rd.init();
	// don't ask on element delete
	rd.trash_ask = false;
	rd.trash_ask_row = true;
	// enable clone element and row
	rd.clone_shiftKey = rd.clone_shiftKey_row = true;
	// row was clicked (set hover color for "row" mode)
	rd.myhandler_row_clicked = function () {
		rd.hover_color = '#9BB3DA';
	};
	// element clicked (set hover color for "cell" mode)
	rd.myhandler_clicked = function () {
		rd.hover_color = '#FFCFAE';
	};
	// row was moved - event handler
	rd.myhandler_row_moved = function () {
		// set opacity for moved row
		// rd.obj is reference of cloned row (mini table)
		rd.row_opacity(rd.obj, 85);
		// set opacity for source row and change source row background color
		// obj.obj_old is reference of source row
		rd.row_opacity(rd.obj_old, 20, 'White');
	};
	// row is undeleted
	// return source row to original state
	rd.myhandler_row_undeleted = function () {
		rd.row_opacity(rd.obj_old, 100);
	};
	// row was dropped to the source - event handler
	// mini table (cloned row) will be deleted and source row should return to original state
	rd.myhandler_row_dropped_source = function () {
		// make source row completely visible (no opacity)
		rd.row_opacity(rd.obj_old, 100);
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}