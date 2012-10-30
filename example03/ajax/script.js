/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, ActiveXObject: false, REDIPS: true */

/* enable strict mode */
"use strict";

// functions
var redipsInit,			// define redipsInit variable
	initXMLHttpClient,	// create XMLHttp request object in a cross-browser manner
	sendRequest,		// send AJAX request
	request,			// XMLHttp request object
	printMessage;		// print message


// redips initialization
redipsInit = function () {
	// reference to the REDIPS.drag object
	var	rd = REDIPS.drag;
	// create XMLHttp request object
	request = initXMLHttpClient();
	// REDIPS.drag initialization
	rd.init();
	rd.dropMode = 'single';			// dragged elements can be placed to the empty cells only
	rd.hover.colorTd = '#9BB3DA';	// set hover color
	// save - after element is dropped
	rd.event.dropped = function () {
		// get element position (method returns array with current and source positions - tableIndex, rowIndex and cellIndex)
		var pos = rd.getPosition();
		// save table content
		sendRequest('ajax/db_save.php?p=' + rd.obj.id + '_' + pos.join('_'));
	};
	// delete - after element is deleted
	rd.event.deleted = function () {
		// get element position
		var pos = rd.getPosition(),
			row = pos[4],
			col = pos[5];
		// delete element
		sendRequest('ajax/db_delete.php?p=' + rd.obj.id + '_' + row + '_' + col);
	};
	// print message to the message line
	printMessage('AJAX version');
};


// XMLHttp request object
initXMLHttpClient = function () {
	var XMLHTTP_IDS,
		xmlhttp,
		success = false,
		i;
	// Mozilla/Chrome/Safari/IE7/IE8 (normal browsers)
	try {
		xmlhttp = new XMLHttpRequest(); 
	}
	// IE (?!)
	catch (e1) {
		XMLHTTP_IDS = [ 'MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
						'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP' ];
		for (i = 0; i < XMLHTTP_IDS.length && !success; i++) {
			try {
				success = true;
				xmlhttp = new ActiveXObject(XMLHTTP_IDS[i]);
			}
			catch (e2) {}
		}
		if (!success) {
			throw new Error('Unable to create XMLHttpRequest!');
		}
	}
	return xmlhttp;
};


// function sends AJAX request to the server (save or delete)
// input parameter is complete URL of service with query string 
sendRequest = function (url) {
	// open asynchronus request
	request.open('GET', url, true);
	// the onreadystatechange event is triggered every time the readyState changes
	request.onreadystatechange = function () {
		//  request finished and response is ready
		if (request.readyState === 4) {
			// if something went wrong
			if (request.status !== 200) {
				// display error message
				document.getElementById('message').innerHTML = 'Error: [' + request.status + '] ' + request.statusText;
			}
	    }
	};
	// send request
	request.send(null);
};


// print message
printMessage = function (message) {
	document.getElementById('message').innerHTML = message;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}