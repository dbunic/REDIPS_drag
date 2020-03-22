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
	// reference to the REDIPS.drag library
	let rd = REDIPS.drag;
	// initialization
	rd.init();
	// error handler called if error occured during loading table content
	rd.error.loadContent = function (obj) {
		// display error message (non blocking alert)
		setTimeout(function () {
			alert(obj.message + ' (error type ' + obj.type + ')');
		}, 100);
		// return false on first error and stop further processing
		// return false;
	};
	// set reference to the target table
	redips.targetTable = document.getElementById('myTable');
};


// method called on button1 click
// JSON data is retrieved from server script db_ajax2.html
redips.button1 = function () {
	REDIPS.drag.loadContent(redips.targetTable, 'db_ajax2.html');
};

// method called on button2 click
// JSON data is put as second parameter
redips.button2 = function () {
	REDIPS.drag.loadContent('myTable', [['d6', 0, 1, 'green', 'B1'], ['d6', 6, 2, 'green', 'B2'], ['d7', 7, 4, 'green', 'B3']]);
};

// method called on button3 click
// string is read from text input field with id=textField
redips.button3 = function () {
	// prepare JSON data to place to the HTML table
	let data = document.getElementById('textField').value;
	// place content to the table
	REDIPS.drag.loadContent(redips.targetTable, data);
};

// method deletes all DIV elements with redips-drag class name from table with id=myTable
redips.clearTable = function () {
	REDIPS.drag.clearTable('myTable');
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
