/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

window.onload = function () {
	var num = 0,			// number of successfully placed elements
		rd = REDIPS.drag;	// reference to the REDIPS.drag class
	// initialization
	rd.init();
	// set hover color
	rd.hover_color = '#9BB3DA';
	// define green elements for green cells
	rd.mark.exception.green = 'green_cell';
	rd.mark.exception.greenc0 = 'green_cell';
	rd.mark.exception.greenc1 = 'green_cell';
	// define orange elements for orange cells
	rd.mark.exception.orange = 'orange_cell';
	rd.mark.exception.orangec0 = 'orange_cell';
	rd.mark.exception.orangec1 = 'orange_cell';
	// this function (event handler) is called after element is dropped
	rd.myhandler_dropped = function () {
		var msg; // message text
		// if the DIV element was placed on allowed cell then 
		if (rd.target_cell.className.indexOf(rd.mark.exception[rd.obj.id]) !== -1) {
			// make it a unmovable
			rd.enable_drag(false, rd.obj.id);
			// increase counter
			num++;
			// prepare and display message
			if (num < 6) {
				msg = 'Number of successfully placed elements: ' + num;
			}
			else {
				msg = 'Well done!';
			}
			document.getElementById('message').innerHTML = msg;
		}
	};
};