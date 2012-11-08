/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redipsInit variable
var redipsInit;

// redips initialization
redipsInit = function () {
	// reference to the REDIPS.drag lib
	var rd = REDIPS.drag;
	// initialization
	rd.init();
	// dragged elements can be placed to the empty cells only
	rd.dropMode = 'single';
	// elements could be cloned with pressed SHIFT key
	rd.clone.keyDiv = true;
	// define dropped handler
	rd.event.dropped = function (targetCell) {
		var tbl,	// table reference of dropped element
			id,		// id of scrollable container
			msg;	// message
		// find table of target cell
		tbl = rd.findParent('TABLE', targetCell);
		// test if table belongs to scrollable container
		if (tbl.sca !== undefined) {
			// every table has defined scrollable container (if table belongs to scrollable container)
			// scrollable container has reference to the DIV container and DIV container has Id :)
			id = tbl.sca.div.id;
			// prepare message according to container Id
			// here can be called handler_dropped for scrollable containers
			switch (id) {
			case 'left':
				msg = 'Left container';
				break;
			case 'right':
				msg = 'Right container';
				break;
			default:
				msg = 'Container without Id';
			}
		}
		// table does not belong to any container
		else {
			msg = 'Table does not belong to any container!';
		}
		// display message
		document.getElementById('message').innerHTML = msg;
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}