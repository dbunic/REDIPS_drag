/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true, $: true */

/* enable strict mode */
"use strict";


// create redips container
var redips = {};


// REDIPS.drag initialization
redips.init = function () {
	REDIPS.drag.init();
};


// new table using AJAX/jQuery to the drag container 
redips.load_table = function (button) {
	// parameter (example for ajax request)
	var id = 1;
	// disable button (it can be clicked only once)
	button.style.backgroundColor = '#c0c0c0';
	button.disabled = true;
	// AJAX request
	$.ajax({
		type: 'get',
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