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
	// reference to the REDIPS.drag library
	let rd = REDIPS.drag;
	// set button reference (needed in redips.buttonEnable() method)
	redips.button1 = document.getElementById('btn_move1');
	redips.button2 = document.getElementById('btn_move2');
	// initialization
	rd.init();
	// animation pause (lower values mean the animation plays faster)
	rd.animation.pause = 40;
	// animation step (minimum is 1)
	rd.animation.step = 2;
	// define color for "empty row"
	rd.style.rowEmptyColor = '#d3ebf3';
};


/**
 * Function moves row from first or second table.
 * @param {Integer} tbl Table index.
 */
redips.move = function (tbl) {
	let rd = REDIPS.drag,	// reference to the REDIPS.drag library
		row,				// returned value from move_object method (array with source row and mini table reference or false in case of moving "empty row")
		idx;				// index of the last row in table
	// last row index
	idx = redips.lastRow('table' + tbl);
	// move row to the table bottom
	row = rd.moveObject({
		mode: 'row',					// animation mode - row
		source: [1 - tbl, 0],			// source position (table index and row index)
		target: [tbl, idx],				// target position
		callback: redips.buttonEnable	// function to call after animation is finished
	});
	// in case of moving "empty row", method will return false and no row will be moved
	if (row) {
		// disable "Move" buttons
		redips.buttonEnable(false);
		// set opacity for moved row (row[0] is reference of cloned row - mini table)
		rd.rowOpacity(row[0], 85);
		// set opacity for source row and change source row background color (row[1] is reference of source row)
		rd.rowOpacity(row[1], 20, 'LightBlue');
	}
};


/**
 * Function returns index of the last row in table.
 * @param {String} tableId Table id.
 */
redips.lastRow = function (tableId) {
	// define table reference and index of the last row
	// row index is greater then last row in table so, row will be appended to the table end
	let tbl = document.getElementById(tableId),
		idx = tbl.rows.length;
	// return index
	return idx;
};


/**
 * Function enables/disables "Move" button and DIV elements.
 * @param {Boolean} flag enable or disable buttons and DIV elements.
 */
redips.buttonEnable = function (flag) {
	// if input parameter is not boolean type, then enable_rows is called from callback function
	// callback function sends reference of moved element
	if (typeof (flag) !== 'boolean') {
		flag = true;
	}
	// enable/disable button (reference is set in redips.init)
	redips.button1.disabled = !flag;
	redips.button2.disabled = !flag;
	// enable/disable DIV elements in drag container
	REDIPS.drag.enableDrag(flag);
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
