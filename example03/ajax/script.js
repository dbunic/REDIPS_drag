/* eslint-env browser */
/* eslint
   semi: ["error", "always"],
   indent: [2, "tab"],
   no-tabs: 0,
   no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
   one-var: ["error", "always"] */
/* global REDIPS */

/* enable strict mode */
'use strict';

// create redips container
let redips = {};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag object
	let rd = REDIPS.drag;
	// REDIPS.drag initialization
	rd.init();
	rd.dropMode = 'single';			// dragged elements can be placed to the empty cells only
	rd.hover.colorTd = '#9BB3DA';	// set hover color
	// save - after element is dropped
	rd.event.dropped = function () {
		// get element position (method returns array with current and source positions - tableIndex, rowIndex and cellIndex)
		let pos = rd.getPosition();
		// save DIV element (AJAX handler is not needed)
		rd.ajaxCall('ajax/db_save.php?p=' + rd.obj.id + '_' + pos.join('_'));
	};
	// delete - after element is deleted
	rd.event.deleted = function () {
		// get element position
		let pos = rd.getPosition(),
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
