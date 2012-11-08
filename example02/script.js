/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redipsInit variable
var redipsInit;

// redips initialization
redipsInit = function () {
	var num = 0,			// number of successfully placed elements
		rd = REDIPS.drag;	// reference to the REDIPS.drag lib
	// initialization
	rd.init();
	// set hover color
	rd.hover.colorTd = '#9BB3DA';
	// define green elements for green cells
	rd.mark.exception.green = 'green_cell';
	rd.mark.exception.greenc0 = 'green_cell';
	rd.mark.exception.greenc1 = 'green_cell';
	// define orange elements for orange cells
	rd.mark.exception.orange = 'orange_cell';
	rd.mark.exception.orangec0 = 'orange_cell';
	rd.mark.exception.orangec1 = 'orange_cell';
	// this function (event handler) is called after element is dropped
	rd.event.dropped = function () {
		// message text
		var msg;
		// if the DIV element was placed on allowed cell then 
		if (rd.td.target.className.indexOf(rd.mark.exception[rd.obj.id]) !== -1) {
			// make it a unmovable
			rd.enableDrag(false, rd.obj);
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

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}
