/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define header_init and default redips_url variable
var header_init,
	redips_url = redips_url || '/javascript/drag-and-drop-table-content/';

// header initialization
header_init = function () { 
	var header = document.createElement('div'),
		title = document.title;
	// add "header" DIV element
	document.body.insertBefore(header, document.body.firstChild);
	// apply inner HTML
	header.innerHTML = '<div style="background-color:#eee;padding:10px;text-align:center;font-size:20px;font-weight:bold">' + title + '</div>' +
		'<div style="float:left;width:50%;padding-left:10px"><a href="../">Index</a></div>' +
		'<div style="text-align:right;padding-right:10px;margin-bottom:10px"><a href="http://www.redips.net' + redips_url + '">www.redips.net</a></div>';
};

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', header_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', header_init);
}