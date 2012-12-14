/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips object container
var redips = {};

// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag library and message line
	var	rd = REDIPS.drag,
		msg = document.getElementById('msg');
	// initialization
	rd.init();
	// set hover colors for TD and TR
	rd.hover.colorTd = '#FFCFAE';
	rd.hover.colorTr = '#9BB3DA';
	// set color for "empty row"
	rd.style.rowEmptyColor = '#f8f8f8';
	// set question for row deletion
	rd.trash.questionRow = 'Are you sure you want to delete table row?';
	// enable clone element and clone row with shift key
	rd.clone.keyDiv = rd.clone.keyRow = true;
	// mark row in second table as empty
	rd.rowEmpty('tbl2', 1);
	//
	// row event handlers
	//
	// row clicked (display message and set hover color for "row" mode)
	rd.event.rowClicked = function () {
		msg.innerHTML = 'Clicked';
	};
	// row row_dropped
	rd.event.rowDropped = function () {
		msg.innerHTML = 'Dropped';
	};
	// row was dropped to the source - event handler
	// mini table (cloned row) will be deleted and source row should return to original state
	rd.event.rowDroppedSource = function () {
		// make source row completely visible (no opacity)
		rd.rowOpacity(rd.objOld, 100);
		// display message
		msg.innerHTML = 'Dropped to the source';
	};
	// row changed
	rd.event.rowChanged = function () {
		// get target and source position (method returns positions as array)
		var pos = rd.getPosition();
		// display current table and current row
		msg.innerHTML = 'Changed: ' + pos[0] + ' ' + pos[1];
	};
	// row was moved - event handler
	rd.event.rowMoved = function () {
		// set opacity for moved row
		// rd.obj is reference of cloned row (mini table)
		rd.rowOpacity(rd.obj, 85);
		// set opacity for source row and change source row background color
		// obj.objOld is reference of source row
		rd.rowOpacity(rd.objOld, 20, 'White');
		// display message
		msg.innerHTML = 'Moved';
	};
	// row notmoved
	rd.event.rowNotMoved = function () {
		msg.innerHTML = 'Not moved';
	};
	// row cloned
	rd.event.rowCloned = function () {
		msg.innerHTML = 'Cloned';
	};
	// row not cloned (dropped to the source row)
	rd.event.rowNotCloned = function () {
		msg.innerHTML = 'Not cloned';
	};
	// row deleted
	rd.event.rowDeleted = function () {
		msg.innerHTML = 'Deleted';
	};
	// row is undeleted (return source row to original state)
	rd.event.rowUndeleted = function () {
		rd.rowOpacity(rd.objOld, 100);
		// display message
		msg.innerHTML = 'Undeleted';
	};
};


// function sets drop_option parameter defined at the top
redips.setRowMode = function (radioButton) {
	REDIPS.drag.rowDropMode = radioButton.value;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}