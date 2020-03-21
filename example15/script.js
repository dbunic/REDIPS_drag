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
	// reference to the REDIPS.drag library and message line
	let rd = REDIPS.drag,
		msg;
	// initialization
	rd.init();
	// set hover color for TD and TR
	rd.hover.colorTd = '#FFCFAE';
	rd.hover.colorTr = '#9BB3DA';
	// set hover border for current TD and TR
	rd.hover.borderTd = '2px solid #32568E';
	rd.hover.borderTr = '2px solid #32568E';
	// drop row after highlighted row (if row is dropped to other tables)
	rd.rowDropMode = 'after';
	// row was clicked - event handler
	rd.event.rowClicked = function () {
		// set current element (this is clicked TR)
		let el = rd.obj;
		// find parent table
		el = rd.findParent('TABLE', el);
		// every table has only one SPAN element to display messages
		msg = el.getElementsByTagName('span')[0];
		// display message
		msg.innerHTML = 'Clicked';
	};
	// row was moved - event handler
	rd.event.rowMoved = function () {
		// set opacity for moved row
		// rd.obj is reference of cloned row (mini table)
		rd.rowOpacity(rd.obj, 85);
		// set opacity for source row and change source row background color
		// rd.objOld is reference of source row
		rd.rowOpacity(rd.objOld, 20, 'White');
		// display message
		msg.innerHTML = 'Moved';
	};
	// row was not moved - event handler
	rd.event.rowNotMoved = function () {
		msg.innerHTML = 'Not moved';
	};
	// row was dropped - event handler
	rd.event.rowDropped = function () {
		// display message
		msg.innerHTML = 'Dropped';
	};
	// row was dropped to the source - event handler
	// mini table (cloned row) will be removed and source row should return to original state
	rd.event.rowDroppedSource = function () {
		// make source row completely visible (no opacity)
		rd.rowOpacity(rd.objOld, 100);
		// display message
		msg.innerHTML = 'Dropped to the source';
	};
	/*
	// how to cancel row drop to the table
	rd.event.rowDroppedBefore = function () {
		//
		// JS logic
		//
		// return source row to its original state
		rd.rowOpacity(rd.objOld, 100);
		// cancel row drop
		return false;
	}
	*/
	// row position was changed - event handler
	rd.event.rowChanged = function () {
		// get target and source position (method returns positions as array)
		var pos = rd.getPosition();
		// display current table and current row
		msg.innerHTML = 'Changed: ' + pos[0] + ' ' + pos[1];
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
