/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var set_hover_color,	// set hover color method
	rd;					// reference to the REDIPS.drag library

// onload event
window.onload = function () {
	// set reference to the REDIPS.drag library
	rd = REDIPS.drag;
	// initialization
	rd.init();
	// elements could be cloned with pressed SHIFT key
	rd.clone_shiftKey = true;
	// handler clicked - set hover color
	rd.myhandler_clicked = function () {
		set_hover_color(rd.current_cell);
	};
	// handler changed - set hover color
	rd.myhandler_changed = function () {
		set_hover_color(rd.current_cell);
	};
};


// set hover color
set_hover_color = function (e) {
	var color,
		tbl = rd.find_parent('TABLE', e);
	// set hover color depending in nested level
	switch (tbl.redips.nestedLevel) {
	// "ground" level table
	case 0:
		color = '#9BB3DA';
		break;
	// first level of nested table
	case 1:
		color = '#FFCFAE';
		break;
	// second level of nested table
	case 2:
		color = '#B9E0C1';
		break;
	// third level of nested table
	case 3:
		color = '#FFFAAE';
		break;
	}
	// set hover color
	rd.hover_color = color; 
};
