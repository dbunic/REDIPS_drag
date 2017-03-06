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
	// event handler called if error occured during loading table content
	rd.event.loadError = function (obj) {
		// display error message
		console.log(obj.message);
		// return false to stop further processing
		//return false;
	}
	// set reference to the target table
	redips.targetTable = document.getElementById('myTable');
};


// function called on button1 click
redips.button1 = function () {
	REDIPS.drag.ajaxCall('db_ajax1.php', redips.handler1);
};

// AJAX handler1
redips.handler1 = function (xhr) {
	// if status is OK then display DIV content
	if (xhr.status === 200) {
		REDIPS.drag.loadContent(redips.targetTable, xhr.responseText);
	}
	// otherwise display nice error message
	else {
		console.log('Oops, an error occurred: [' + xhr.status + '] ' + xhr.statusText);
	}
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