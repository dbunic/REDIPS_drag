/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

window.onload = function () {
	// reference to the REDIPS.drag object
	var	rd = REDIPS.drag;
	// define border style
	rd.border = 'none';
	// initialization
	rd.init();
	// DIV elements can be dropped to the empty cells only
	rd.drop_option = 'single';
	// do not ask on delete
	rd.trash_ask = false;
};