/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

/* Simple row animation */

// create redips container
var redips = {};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag library
	var	rd = REDIPS.drag;
	// set button reference (needed in redips.button_enable() method)
	redips.button = document.getElementById('btn_move');
	// initialization
	rd.init();
	// animation pause (lower values mean the animation plays faster)
	rd.animation_pause = 40;
	// animation step (minimum is 1)
	rd.animation_step = 2;
};


/**
 * Function moves first row to the last position.
 */
redips.move = function () {
	var	rd = REDIPS.drag,	// reference to the REDIPS.drag library
		row = [];			// returned value from move_object method (array with source row and mini table reference)
	// disable "Move" button
	redips.button_enable(false);
	// move object to the random position
	row = rd.move_object({
			mode: 'row',					// animation mode - row
			source: [0, 0],					// source position (table index and row index)
			target: [0, 6],					// target position
			callback: redips.button_enable	// function to call after animation is over
			//callback: move				// try to comment line above and uncomment this line (refresh page and click on "Move" button)
		});
	// set opacity for moved row (row[0] is reference of cloned row - mini table)
	rd.row_opacity(row[0], 85);
	// set opacity for source row and change source row background color (row[1] is reference of source row)
	rd.row_opacity(row[1], 20, 'LightBlue');
};


/**
 * Function enables/disables "Move" button and DIV elements.
 * @param {Boolean} Flag enable or disable buttons and DIV elements.
 */
redips.button_enable = function (flag) {
	// if input parameter is not boolean type, then enable_rows is called from callback function
	// callback function sends reference of moved element
	if (typeof(flag) !== 'boolean') {
		flag = true;
	}
	// enable/disable button (reference is set in redips.init)
	redips.button.disabled = !flag;
	// enable/disable DIV elements in dragging container
	REDIPS.drag.enable_drag(flag, 'drag', 'subtree');
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}