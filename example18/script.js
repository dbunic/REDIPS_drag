/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

/* Simple element animation */

var	rd = REDIPS.drag,	// reference to the REDIPS.drag library
	redips_init,		// redips initialization
	move,				// moves object to the random position
	enable_button;		// enables/disables button


// redips initialization
redips_init = function () {
	rd.init();
	// animation pause (lower values mean the animation plays faster)
	rd.animation_pause = 40;
	// animation step (minimum is 1)
	rd.animation_step = 2;
};


/**
 * Function moves element to the random position. Generated position must be different then current position.
 */
move = function () {
	var id = 'd1',	// id of drag element
		rowIndex,	// row index (random number from 0 to 6)
		cellIndex,	// cell index (random number from 0 to 6)
		pos;		// current position as array (returned from get_position method)
	// set current position for DIV element with defined id
	pos = rd.get_position(id);
	// generate random position (must be different then current position)
	do {
		rowIndex = Math.floor(Math.random() * 7);	// from 0 to 6
		cellIndex = Math.floor(Math.random() * 7);	// from 0 to 6
	} while (pos[0] === rowIndex && pos[1] === cellIndex);
	// disable "Move" button
	enable_button(false);
	// move object to the random position
	rd.move_object({
		id: id,								// id of object to move
		target: [0, rowIndex, cellIndex],	// target position
		callback: enable_button				// function to call after animation is over
		//callback: move					// try to comment upper line and uncomment this line (refresh page and click on "Move" button)
	});
};


/**
 * Function enables/disables button.
 * @param {Boolean} Flag enable or disable buttons.
 */
enable_button = function (flag) {
	var button = document.getElementById('btn_move');
	// input parameter is optional (default value is true)
	if (flag === undefined) {
		flag = true;
	}
	// enable/disable button
	button.disabled = !flag;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}