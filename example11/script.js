/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

window.onload = function () {
	// reference to the REDIPS.drag object
	var	rd = REDIPS.drag;
	// define border style
	rd.border = 'none';
	// // set hover color
	REDIPS.drag.hover_color = '#FFE885';
	// initialization
	rd.init();
	// DIV elements can be dropped to the empty cells only
	rd.drop_option = 'single';
	// do not ask on delete
	rd.trash_ask = false;
	// after cloned element is dropped, call init() method to initialize table layout
	rd.myhandler_cloned_dropped = function () {
		rd.init();
	};
};