/* eslint-env browser */
/* eslint
   semi: ["error", "always"],
   indent: [2, "tab"],
   no-tabs: 0,
   no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
   one-var: ["error", "always"] */
/* global REDIPS */

/* enable strict mode */
'use strict';

// create redips container
let redips = {};


// redips initialization
redips.init = function () {
	// set reference to the REDIPS.drag library
	let rd = REDIPS.drag;
	// initialization
	rd.init();
	// enable cloning DIV elements with pressed SHIFT key
	rd.clone.keyDiv = true;
	// handler clicked - set hover color
	rd.event.clicked = function (currentCell) {
		redips.setHoverColor(currentCell);
	};
	// handler changed - set hover color
	rd.event.changed = function (currentCell) {
		redips.setHoverColor(currentCell);
	};
};


// set hover color
redips.setHoverColor = function (cell) {
	let rd = REDIPS.drag,
		color,
		tbl = rd.findParent('TABLE', cell);
	// set hover color depending in nested level
	switch (tbl.redips.nestedLevel) {
	// "ground" level table
	case 0:
		color = '#C7D5ED';
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
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
