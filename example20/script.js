/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var redips_init;

// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag library and message line
	var	rd = REDIPS.drag,
		msg = document.getElementById('msg');
	// initialization
	rd.init();
	// don't ask on element delete but ask for row delete
	rd.trash_ask = false;
	rd.trash_ask_row = true;
	// enable clone element and row with shift key
	rd.clone_shiftKey = rd.clone_shiftKey_row = true;
	// mark row in second table as empty
	rd.row_empty('tbl2', 1);
	// element clicked (set hover color for "cell" mode)
	rd.myhandler_clicked = function () {
		rd.hover_color = '#FFCFAE';
	};
	//
	// row event handlers
	//
	// row clicked (display message and set hover color for "row" mode)
	rd.myhandler_row_clicked = function () {
		rd.hover_color = '#9BB3DA';
		msg.innerHTML = 'Clicked';
	};
	// row row_dropped
	rd.myhandler_row_dropped = function () {
		msg.innerHTML = 'Dropped';
	};
	// row was dropped to the source - event handler
	// mini table (cloned row) will be deleted and source row should return to original state
	rd.myhandler_row_dropped_source = function () {
		// make source row completely visible (no opacity)
		rd.row_opacity(rd.obj_old, 100);
		// display message
		msg.innerHTML = 'Dropped to the source';
	};
	// row changed
	rd.myhandler_row_changed = function () {
		// get target and source position (method returns positions as array)
		var pos = rd.get_position();
		// display current table and current row
		msg.innerHTML = 'Changed: ' + pos[0] + ' ' + pos[1];
	};

	// row was moved - event handler
	rd.myhandler_row_moved = function () {
		// set opacity for moved row
		// rd.obj is reference of cloned row (mini table)
		rd.row_opacity(rd.obj, 85);
		// set opacity for source row and change source row background color
		// obj.obj_old is reference of source row
		rd.row_opacity(rd.obj_old, 20, 'White');
		// display message
		msg.innerHTML = 'Moved';
	};
	// row notmoved
	rd.myhandler_row_notmoved = function () {
		msg.innerHTML = 'Not moved';
	};
	// row cloned
	rd.myhandler_row_cloned = function () {
		msg.innerHTML = 'Cloned';
	};
	// row not cloned (dropped to the source row)
	rd.myhandler_row_notcloned = function () {
		msg.innerHTML = 'Not cloned';
	};
	// row deleted
	rd.myhandler_row_deleted = function () {
		msg.innerHTML = 'Deleted';
	};
	// row is undeleted (return source row to original state)
	rd.myhandler_row_undeleted = function () {
		rd.row_opacity(rd.obj_old, 100);
		// display message
		msg.innerHTML = 'Undeleted';
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}