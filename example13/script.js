/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var redips_init,		// define redips_init variable
	set_hover_color,	// set hover color method
	rd;					// reference to the REDIPS.drag library

// redips initialization
redips_init = function () {
	// set reference to the REDIPS.drag library
	rd = REDIPS.drag;
	// initialization
	rd.init();
	// elements could be cloned with pressed SHIFT key
	rd.clone_shiftKey = true;
	// handler clicked - set hover color
	rd.myhandler_clicked = function (current_cell) {
		set_hover_color(current_cell);
	};
	// handler changed - set hover color
	rd.myhandler_changed = function (current_cell) {
		set_hover_color(current_cell);
	};
};


// set hover color
set_hover_color = function (cell) {
	var color,
		tbl = rd.find_parent('TABLE', cell);
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


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}