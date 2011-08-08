/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, ActiveXObject: false, REDIPS: true */

/*

This code shows how to run save.php on every element drop and delete.php on element delete.
All nice features like printing subjects or spreading school objects across week are not supported here.
Just replace the following line in index.php
	<script type="text/javascript" src="script.js"></script>
with:
	<script type="text/javascript" src="script1.js"></script>
and comment (or delete):
	header('location: index.php');
from save.php because redirection (or page refresh) is not needed
*/

/* enable strict mode */
"use strict";

// functions
var initXMLHttpClient,	// create XMLHttp request object in a cross-browser manner
	send_request,		// send AJAX request
	request;			// XMLHttp request object


// after page is loaded
window.onload = function () {
	// reference to the REDIPS.drag object
	var	rd = REDIPS.drag;
	// create XMLHttp request object
	request = initXMLHttpClient();
	// REDIPS.drag initialization
	rd.init();
	rd.drop_option = 'single';	// dragged elements can be placed to the empty cells only
	rd.hover_color = '#9BB3DA';	// set hover color
	rd.trash_ask = false;		// do not ask on delete
	// save - after element is dropped
	rd.myhandler_dropped = function () {
		// get table content
		var content = REDIPS.drag.save_content(1);
		// save table content
		send_request('save.php?' + content);
	};
	// delete - after element is deleted
	rd.myhandler_deleted = function () {
		// get element position (method returns array with current and source positions - tableIndex, rowIndex and cellIndex)
		var pos = rd.get_position(),
			row = pos[4],
			col = pos[5];
		// delete element
		send_request('delete.php?p=' + rd.obj.id + '_' + row + '_' + col);
	};
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
send_request = function (url) {
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
