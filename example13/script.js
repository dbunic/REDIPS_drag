/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var set_hover_color;

// onload event
window.onload = function () {
	// reference to the REDIPS.drag object
	var rd = REDIPS.drag;
	// initialization
	rd.init();
	// elements could be cloned with pressed SHIFT key
	rd.clone_shiftKey = true;
	// handler clicked - set hover color
	rd.myhandler_clicked = function () {
		set_hover_color(REDIPS.drag.current_cell);
	};
	// handler changed - set hover color
	rd.myhandler_changed = function () {
		set_hover_color(REDIPS.drag.current_cell);
	};
};


// set hover color
set_hover_color = function (e) {
	var color;
	// loop up until table found
	while (e && e.nodeName !== 'TABLE') {
		e = e.parentNode;
	}
	// set hover color depending in nested level
	switch (e.redips_nestedLevel) {
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
	REDIPS.drag.hover_color = color; 
};
