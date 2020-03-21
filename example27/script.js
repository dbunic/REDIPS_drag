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
	let rd = REDIPS.drag;	// reference to the REDIPS.drag lib
	// initialization
	rd.init();
	// set hover color
	rd.hover.colorTd = '#9BB3DA';
	// call initially showContent
	redips.showContent();
	// on each drop refresh content
	rd.event.dropped = function () {
		redips.showContent();
	};
	// call showContent() after DIV element is deleted
	rd.event.deleted = function () {
		redips.showContent();
	};
};


// show TD content
redips.showContent = function () {
	// get content of TD cells in right table
	let td1 = redips.getContent('td1'),
		td2 = redips.getContent('td2'),
		td3 = redips.getContent('td3'),
		td4 = redips.getContent('td4'),
		// set reference to the message DIV (below tables)
		message = document.getElementById('message');
	// show block content
	message.innerHTML = 'td1 = ' + td1 + '<br>' +
						'td2 = ' + td2 + '<br>' +
						'td3 = ' + td3 + '<br>' +
						'td4 = ' + td4;
};


// get content (DIV elements in TD)
redips.getContent = function (id) {
	let td = document.getElementById(id),
		content = '',
		cn, i;
	// TD can contain many DIV elements
	for (i = 0; i < td.childNodes.length; i++) {
		// set reference to the child node
		cn = td.childNodes[i];
		// childNode should be DIV with containing "drag" class name
		if (cn.nodeName === 'DIV' && cn.className.indexOf('drag') > -1) { // and yes, it should be uppercase
			// append DIV id to the result string
			content += cn.id + '_';
		}
	}
	// cut last '_' from string
	content = content.substring(0, content.length - 1);
	// return result
	return content;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}

