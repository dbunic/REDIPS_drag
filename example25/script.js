/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


// create redips container
var redips = {};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag class
	var rd = REDIPS.drag;
	// set initial math operation
	redips.operation = 'addition';
	// REDIPS.drag initialization
	rd.init();
	// set shift mode and shift animation
	rd.dropMode = 'shift';
	rd.animation.shift = true;
	// set vertical shift (each column is treated separately) and overflowed element will be deleted 
	rd.shift.mode = 'vertical2';
	rd.shift.overflow = 'delete';
	// event handler called after DIV is dropped (create result box in the most right column)
	rd.event.dropped = function () {
		var tr,			// current row
			num1, num2,	// numbers for addition or multiplication
			result;		// result
		// set current row
		tr = REDIPS.drag.findParent('TR', rd.obj);
		// set first and second number
		num1 = rd.obj.innerHTML * 1;
		num2 = tr.cells[2].innerHTML * 1;
		// display result box
		tr.cells[4].innerHTML = '<div class="result box r' + redips.math(num1, num2) + '" onclick="window.redips.showResult(this)">?</div>';
	};
	// even handler called when DIV element is moved (delete result box if DIV is moved in the bottom table)
	rd.event.moved = function () {
		// set source row
		var tr = rd.findParent('TR', rd.td.source);
		// if number is moved from bottom table then delete result box
		if (tr.className.indexOf('upper') === -1) {
			tr.cells[4].innerHTML = '';
		}
	};
	// called before each DIV element is shifted (needed move orange box pn the right side)
	rd.event.relocateBefore = function (div, to) {
		var tr = rd.findParent('TR', div),							// set current TR from DIV element that will be shifted by REDIPS.drag
			resultDiv = tr.cells[4].getElementsByTagName('div')[0],	// define result DIV (right orange DIV element)
			target = to.parentNode.cells[4],						// define target TD
			num1 = div.innerHTML * 1;								// set first number (from DIV element that will be shifted by REDIPS.drag)
		// move right (orange) box
		rd.moveObject({
			obj: resultDiv,
			target:	target,
			// call after result DIV is moved (el is reference to the moved DIV element)
			callback: function (el) {
				var targetTR = rd.findParent('TR', el),			// set target TR
					num2 = targetTR.cells[2].innerHTML * 1;		// set number2 from target TR
				// save (hide) new result to the class r(n+) and display "?" 
				el.className = el.className.replace(/r\d+/g, 'r' + redips.math(num1, num2));
				el.innerHTML = '?';
			}
		});
	};
	// delete last orange box when overflow happen (target is TD where overflow occurred)
	rd.event.shiftOverflow = function (target) {
		var rightCell = target.parentNode.cells[4];
		// empty right cell
		rd.emptyCell(rightCell);
	};
};


// set operation - addition / multiplication
redips.setTable = function (e) {
	// set local variables
	var tables = document.getElementById('drag').getElementsByTagName('table'),
		i;
	// set operation (global) - needed in event.dropped
	redips.operation = e.options[e.selectedIndex].value;
	// loop goes through all fetched tables within drag container
	for (i = 0; i < tables.length; i++) {
		// skip number or mini table
		if (tables[i].id === 'number' || tables[i].id === 'mini') {
			continue;
		}
		// show selected table
		else if (tables[i].id === redips.operation) {
			tables[i].style.display = '';
		}
		// hide all other tables
		else {
			tables[i].style.display = 'none';
		}
	}
};


// do math with num1 and num2
redips.math = function (num1, num2) {
	var result;
	// add or multiply num1 and num2
	if (redips.operation === 'addition') {
		result = num1 + num2;
	}
	else {
		result = num1 * num2;
	}
	// return result
	return result;
};


// display result below "?" (called after user clicks on result DIV)
redips.showResult = function (div) {
	// result is saved as a class name r(n+)
	var	className = div.className,
		matchArray = className.match(/r(\d+)/);
	// show result
	div.innerHTML = matchArray[1];
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}