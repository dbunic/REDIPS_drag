/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init variable
var redips_init;

// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag object
	var	rd = REDIPS.drag;
	// define border style (this should go before init() method)
	rd.border = 'none';
	// initialization
	rd.init();
	// set hover color
	rd.hover.color_td = '#FFE885';
	// DIV elements can be dropped to the empty cells only
	rd.drop_option = 'single';
	// do not ask on delete
	rd.trash_ask = false;
	// DIV element was clicked - enable / disable tables
	rd.myhandler_clicked = function () {
		// search for table inside DIV element
		var tbl = rd.obj.getElementsByTagName('TABLE');
		// if DIV element contains table then disable all mini tables
		// it is not allowed to drop table within another table
		if (tbl.length > 0) {
			rd.enable_table(false, 'mini');
		}
		// clicked element doesn't contain any table - enable all "mini" tables
		else {
			rd.enable_table(true, 'mini');
		}
	};
};

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}