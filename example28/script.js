/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// create redips container
var redips = {};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag library
	var	rd = REDIPS.drag;
	// initialization
	rd.init();
	// error handler called if error occured during loading table content
	rd.error.loadContent = function (obj) {
		// display error message (non blocking alert)
		setTimeout(function () {
			alert(obj.message + ' [error type ' + obj.type + ']');
		}, 10);
		// on first error, return false to stop further processing
		//return false;
	};
	// set reference to the target table
	redips.targetTable = document.getElementById('myTable');
};


// function called on button1 click
redips.button1 = function () {
	REDIPS.drag.loadContent(redips.targetTable, 'db_ajax1.php');
};

// function called on button2 click
redips.button2 = function () {
	REDIPS.drag.loadContent('myTable', [["d6", 6, 2, "green", "A2"], ["d7", 7, 4, "green", "A1"]]);
};

// function called on button2 click
redips.button3 = function () {
	REDIPS.drag.loadContent(redips.targetTable, '[["d16", 6, 2, "orange", "B2"], ["d17", 7, 4, "orange", "B1"]]');
};

// -------------------------------------------------
// attach event listener on body load
// -------------------------------------------------

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}