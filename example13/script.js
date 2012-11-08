/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var redipsInit,		// define redipsInit variable
	setHoverColor,	// set hover color method
	rd;				// reference to the REDIPS.drag library

// redips initialization
redipsInit = function () {
	// set reference to the REDIPS.drag library
	rd = REDIPS.drag;
	// initialization
	rd.init();
	// enable cloning DIV elements with pressed SHIFT key
	rd.clone.keyDiv = true;
	// handler clicked - set hover color
	rd.event.clicked = function (currentCell) {
		setHoverColor(currentCell);
	};
	// handler changed - set hover color
	rd.event.changed = function (currentCell) {
		setHoverColor(currentCell);
	};
};


// set hover color
setHoverColor = function (cell) {
	var color,
		tbl = rd.findParent('TABLE', cell);
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
	rd.hover.colorTd = color; 
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}