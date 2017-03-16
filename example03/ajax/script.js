/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


// create redips container
var redips = {};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag object
	var	rd = REDIPS.drag;
	// REDIPS.drag initialization
	rd.init();
	rd.dropMode = 'single';			// dragged elements can be placed to the empty cells only
	rd.hover.colorTd = '#9BB3DA';	// set hover color
	// save - after element is dropped
	rd.event.dropped = function () {
		// get element position (method returns array with current and source positions - tableIndex, rowIndex and cellIndex)
		var pos = rd.getPosition();
		// save DIV element (AJAX handler is not needed)
		rd.ajaxCall('ajax/db_save.php?p=' + rd.obj.id + '_' + pos.join('_'));
	};
	// delete - after element is deleted
	rd.event.deleted = function () {
		// get element position
		var pos = rd.getPosition(),
			row = pos[4],
			col = pos[5];
		// delete element (AJAX handler is not needed)
		rd.ajaxCall('ajax/db_delete.php?p=' + rd.obj.id + '_' + row + '_' + col);
	};
	// set error handler for AJAX call
	rd.error.ajax = function (xhr) {
		// display error message
		document.getElementById('message').innerHTML = 'Error: [' + xhr.status + '] ' + xhr.statusText;
	};
	// print message to the message line
	redips.printMessage('AJAX version');
};


// print message
redips.printMessage = function (message) {
	document.getElementById('message').innerHTML = message;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}