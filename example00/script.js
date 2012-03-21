/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true, $: true */

/* enable strict mode */
"use strict";

// define functions
var redips_init,
	load_table,
	rd;

	
// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag lib
	rd = REDIPS.drag;
	// initialization
	rd.init();
};


// new table using AJAX/jQuery to the drag container 
load_table = function (button) {
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
			// run REDIPS.drag initialization
			rd.init();
		}
	});
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}