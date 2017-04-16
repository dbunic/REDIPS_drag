/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

//create redips container
var redips = {};

// redips initialization
redips.init = function () {
	var num = 0,			// number of successfully placed elements
		rd = REDIPS.drag;	// reference to the REDIPS.drag lib
	// set reference to message HTML elements
	redips.msg = document.getElementById('message');
	// initialization
	rd.init();
	// set hover color
	rd.hover.colorTd = '#9BB3DA';
	// define "green" class name as exception for green cells
	rd.mark.exceptionClass.green = 'green_cell';
	// define "orange" class name as exception for orange cells
	rd.mark.exceptionClass.orange = 'orange_cell';
	// event handler called after DIV element is dropped to TD
	rd.event.dropped = function (targetCell) {
		var	divClass = rd.mark.exceptionClass, // shorter notation for DIV exception class
			text; 
		// if the DIV element was dropped to allowed cell 
		if (targetCell.className.indexOf(divClass.green) > -1 ||
			targetCell.className.indexOf(divClass.orange) > -1) {
			// make DIV unmovable
			rd.enableDrag(false, rd.obj);
			// increase counter
			num++;
			// prepare message
			if (num < 6) {
				text = 'Number of successfully placed elements: ' + num;
			}
			else {
				text = 'Well done!';
			}
			// display message
			redips.msg.innerHTML = text;
		}
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
