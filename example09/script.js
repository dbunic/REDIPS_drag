/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


var redips_init,		// define redips_init variable
	toggle_animation,	// enable / disable animation
	start_positions,	// remember initial positions of DIV elements
	pos = {},			// initial positions of DIV elements
	rd = REDIPS.drag;	// reference to the REDIPS.drag lib


// redips initialization
redips_init = function () {
	// initialization
	rd.init();
	// enable animation on shifted elements
	rd.animation_shift = true;
	// save initial DIV positions to "pos" object (it should go after initialization)
	start_positions();
	// in a moment when DIV element is moved, set drop_option property (shift or single)
	rd.myhandler_moved = function () {
		// find parent table of moved element
		var tbl = rd.find_parent('TABLE', rd.obj);
		// if table id is table1
		if (tbl.id === 'table1') {
			rd.drop_option = 'shift';
		}
		else {
			rd.drop_option = 'single';
		}
	};
	// when DIV element is double clicked return it to the initial position
	rd.myhandler_dblclicked = function () {
		// set dblclicked DIV id
		var id = rd.obj.id;
		// move DIV element to initial position
		rd.move_object({
			id: id,			// DIV element id
			target: pos[id]	// target position
		});
	};
};


// function scans DIV elements and saves their positions to the "pos" object
start_positions = function () {
	var divs, id, i, position;
	// collect DIV elements from dragging area
	divs = document.getElementById('drag').getElementsByTagName('div');
	// open loop for each DIV element
	for (i = 0; i < divs.length; i++) {
		// set DIV element id
		id = divs[i].id;
		// if element id is defined, then save element position 
		if (id) {
			// set element position
			position = rd.get_position(divs[i]);
			// if div has position (filter obj_new) 
			if (position.length > 0) {
				pos[id] = position;
			}
		}
	}
};


// enable / disable animation
toggle_animation = function (chk) {
	REDIPS.drag.animation_shift = chk.checked;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}