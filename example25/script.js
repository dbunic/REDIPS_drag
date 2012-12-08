/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redipsInit variable
var redipsInit,
	setTable,
	operation = 'addition';


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
		var tr,			// current row
			num1, num2;	// numbers for addition or multiplication
		// set first multiplier
		num1 = rd.obj.innerHTML * 1;
		// set current row
		tr = rd.findParent('TR', targetCell);
		// set second number
		num2 = tr.cells[2].innerHTML * 1;
		// add or multiply num1 and num2 and place result to the last cell in the row
		if (operation === 'addition') {
			tr.cells[4].innerHTML = num1 + num2;
		}
		else {
			tr.cells[4].innerHTML = num1 * num2;
		}
	};
	// even handler called when DIV element is moved
	rd.event.moved = function (cloned) {
		var tr;
		// if DIV element is not cloned
		if (!cloned) {
			// set source row
			tr = rd.findParent('TR', rd.td.source);
			// if number is moved from bottom table then delete result
			if (tr.className.indexOf('upper') === -1) {
				tr.cells[4].innerHTML = '';
			}
		}
	};
};


// set operation
setTable = function (e) {
	// set local variables
	var tables = document.getElementById('drag').getElementsByTagName('table'),
		i;
	// set operation (global) - needed in event.dropped
	operation = e.options[e.selectedIndex].value;
	// loop goes through all fetched tables within drag container
	for (i = 0; i < tables.length; i++) {
		// skip number or mini table
		if (tables[i].id === 'number' || tables[i].id === 'mini') {
			continue;
		}
		// show selected table
		else if (tables[i].id === operation) {
			tables[i].style.display = '';
		}
		// hide all other tables
		else {
			tables[i].style.display = 'none';
		}
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}