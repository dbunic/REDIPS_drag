/* eslint-env browser, jquery */
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


// REDIPS.drag initialization
redips.init = function () {
	REDIPS.drag.init();
};


// new table using AJAX/jQuery to the drag container
redips.load_table = function (button) {
	// parameter (example for ajax request)
	let id = 1;
	// disable button (it can be clicked only once)
	button.style.backgroundColor = '#c0c0c0';
	button.disabled = true;
	// AJAX request
	$.ajax({
		type: 'GET',
		url: 'ajax.php',
		data: 'id=' + id,
		cache: false,
		success: function (result) {
			// load new table
			$('#load_content').html(result);
			// rescan tables
			REDIPS.drag.initTables();
		}
	});
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
