/* eslint-env browser */
/* eslint
   semi: ["error", "always"],
   indent: [2, "tab"],
   no-tabs: 0,
   no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
   one-var: ["error", "always"],
   no-trailing-spaces: ["error", { "ignoreComments": true }] */

/* enable strict mode */
'use strict';

// define headerInit and default indexURL / redipsURL variable
var headerInit,
	redipsURL = redipsURL || '/javascript/drag-and-drop-table-content/', // eslint-disable-line no-use-before-define
	indexURL = indexURL || '../'; // eslint-disable-line no-use-before-define

// header initialization
headerInit = function () {
	var header = document.createElement('div'),
		title = document.title;
	// add "header" DIV element
	document.body.insertBefore(header, document.body.firstChild);
	// apply inner HTML
	header.innerHTML = '<div style="color:white;background-color:#1e73be;padding:10px;text-align:center;font-size:20px">' + title + '</div>' +
		'<div style="float:left;width:50%;padding-left:10px"><a href="http://www.redips.net' + redipsURL + '">www.redips.net</a></div>' +
		'<div style="text-align:right;padding-right:10px;margin-bottom:10px"><a href="' + indexURL + '">index</a></div>';
};

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', headerInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', headerInit);
}
