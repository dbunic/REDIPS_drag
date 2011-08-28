/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init variable
var redips_init;

// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag library and message line
	var	rd = REDIPS.drag,
		msg;
	// initialization
	rd.init();
	// row was clicked - event handler
	rd.myhandler_row_clicked = function () {
		// set current element (this is clicked TR)
		var el = rd.obj;
		// set hover color for "row" mode
		rd.hover_color = '#9BB3DA';
		// find parent table
		el = rd.find_parent('TABLE', el);
		// every table has only one SPAN element to display messages
		msg = el.getElementsByTagName('span')[0];
		// display message
		msg.innerHTML = 'Clicked';
	};
	// element clicked - event handler
	rd.myhandler_clicked = function () {
		// set hover color for "cell" mode
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
		// display message
		msg.innerHTML = 'Moved';
	};
	// row was not moved - event handler
	rd.myhandler_row_notmoved = function () {
		msg.innerHTML = 'Not moved';
	};
	// row was dropped - event handler
	rd.myhandler_row_dropped = function () {
		// display message
		msg.innerHTML = 'Dropped';
	};
	// row was dropped to the source - event handler
	// mini table (cloned row) will be removed and source row should return to original state
	rd.myhandler_row_dropped_source = function () {
		// make source row completely visible (no opacity)
		rd.row_opacity(rd.obj_old, 100);
		// display message
		msg.innerHTML = 'Dropped to the source';
	};
	// row position was changed - event handler
	rd.myhandler_row_changed = function () {
		// get target and source position (method returns positions as array)
		var pos = rd.get_position();
		// display current table and current row
		msg.innerHTML = 'Changed: ' + pos[0] + ' ' + pos[1];
	};
};

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}