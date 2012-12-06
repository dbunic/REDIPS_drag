/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redipsInit variable
var redipsInit;

// redips initialization
redipsInit = function () {
	// reference to the REDIPS.drag class
	var rd = REDIPS.drag;
	// REDIPS.drag initialization
	rd.init();
	// set overwrite mode
	rd.dropMode = 'overwrite';
	// enable cloning with shift key
	rd.clone.keyDiv = true;
	// event handler called after DIV is dropped
	rd.event.dropped = function (targetCell) {
		var tr,		// current row
			m1, m2;	// first and second multiplier
		// set first multiplier
		m1 = rd.obj.innerHTML * 1;
		// set current row
		tr = rd.findParent('TR', targetCell);
		// set second multiplier
		m2 = tr.cells[2].innerHTML * 1;
		// multiply num1 and num2 and place result to the last cell in the row
		tr.cells[4].innerHTML = m1 * m2;
	};
	// even handler called when DIV element is moved
	rd.event.moved = function (cloned) {
		var tr;
		// if DIV element is not cloned
		if (!cloned) {
			// set source row
			tr = rd.findParent('TR', rd.td.source);
			// if ...
			if (tr.className.indexOf('upper') === -1) {
				// delete result
				tr.cells[4].innerHTML = '';
			}
		}
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}