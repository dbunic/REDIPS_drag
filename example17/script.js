/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


// initialization -  after page is fully loaded
window.onload = function () {
	// reference to the REDIPS.drag library
	var	rd = REDIPS.drag;
	// initialize dragging containers (each table is placed in separate container)
	rd.init('drag1');
	rd.init('drag2');
	// row was clicked - set hover color for "row" mode
	rd.myhandler_row_clicked = function () {
		rd.hover_color = '#9BB3DA';
	};
	// element was clicked - set hover color for "cell" mode
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
		rd.row_opacity(rd.obj_old, 20, 'white');
	};
	// row was dropped - event handler
	rd.myhandler_row_dropped = function () {
	};
	// row was dropped to the source - event handler
	// mini table (cloned row) will be removed and source row should return to original state
	rd.myhandler_row_dropped_source = function () {
		// make source row completely visible (no opacity)
		rd.row_opacity(rd.obj_old, 100);
	};


	// element was dropped - move element from other table
	rd.myhandler_dropped = function () {
		var	ri = {1: 2, 2: 1},						// needed for reverse id (like d2_1 -> d2_2 or d4_2 -> d4_1)
			id = rd.obj.id,							// element id
			lc = id.charAt(id.length - 1),			// last character of id that should be reversed (1 -> 2 or 2 -> 1)
			id_new = id.slice(0, -1) + ri[lc];		// id of element from opposite table
		// element with id_new will be moved to the dropped table cell
		// because each table is closed within its own dragging area tableIndex for both tables is 0
		rd.move_object(id_new);
	};
};
