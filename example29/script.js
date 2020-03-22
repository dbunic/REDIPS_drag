/* eslint-env browser, jquery */
/* eslint
	 semi: ["error", "always"],
	 indent: [2, "tab"],
	 no-tabs: 0,
	 no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
	 one-var: ["error", "always"] */
/* global REDIPS */

/* enable strict mode */
'use strict';


// redips container
let redips = {};


// initialization
redips.init = function () {
	// set reference to the REDIPS.drag library
	let rd = REDIPS.drag;
	// REDIPS.drag initialization
	rd.init();
	// set animation loop pause
	rd.animation.pause = 20;
	// set shift mode to vertical2
	rd.shift.mode = 'vertical2';
	// event called before DIV element is dropped
	rd.event.droppedBefore = function (td1) {
		let div = redips.getDiv(),
			td2 = rd.findCell('lastInColumn', td1),	// last column in target position
			pos1 = rd.getPosition(),				// source and target position of dragged DIV element
			pos2,			// position of DIV element in table
			r = pos1[1],	// target row index
			c = pos1[2];	// target column index
		// shift down for dropped DIV element - always needed
		redips.shiftDown(td1, td2, pos1);
		// loop through DIV elements in table
		for (let i = 0, j = 1; i < div.length; i++) {
			// get current DIV position
			pos2 = rd.getPosition(div[i]);
			// if DIV element is in the same column and beneath source position
			if (pos1[5] === pos2[2] && pos1[4] < pos2[1]) {
				// shift down target
				redips.shiftDown(td1, td2, pos1);
				// move DIV from source to target postion
				rd.moveObject({
					obj: div[i],
					target: [0, r + j, c]
				});
				// increment row index
				j++;
			}
		}
	};
};


// shift down DIV elements
redips.shiftDown = function (td1, td2, pos) {
	// shift down DIV elements at target position only if dragging isn't in the same column
	if (pos[2] !== pos[5]) {
		REDIPS.drag.shiftCells(td2[2], td1);
	}
};


// method from live HTMLCollection returns DIV array
redips.getDiv = function () {
	let div = document.getElementById('table1').getElementsByTagName('DIV'),
		arr = [];
	// loop through DIV collection
	for (let i = 0; i < div.length; i++) {
		arr[i] = div[i];
	}
	// return static array
	return arr;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
