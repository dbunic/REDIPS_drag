/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

window.onload = function () {
	// reference to the REDIPS.drag class
	var rd = REDIPS.drag;
	// initialization
	rd.init();
	// dragged elements can be placed to the empty cells only
	rd.drop_option = 'single';
	// define A and B source elements for the last row only (element ID and class name of the last row)
	rd.only.div.a = 'last';
	rd.only.div.b = 'last';
	// A and B elements can't be placed to other table cells (this is default value)
	rd.only.other = 'deny';
	// set hover color
	rd.hover_color = '#9BB3DA';
	// after element is cloned define dropping rule for last row (only for clones of A or B element)
	rd.myhandler_cloned = function () {
		// define variables
		var cloned_id = rd.obj.id; // cloned id
		// if cloned begins with 'a' or 'b' define dropping rule 'only' for last row
		if (cloned_id.substr(0, 1) === 'a' || cloned_id.substr(0, 1) === 'b') {   
			rd.only.div[cloned_id] = 'last';
		}
	};
	// or cloned elements can be defined one by one
//	rd.only.div.ac0 = 'last';
//	rd.only.div.bc0 = 'last';
};