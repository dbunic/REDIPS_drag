/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, ActiveXObject: false, REDIPS: true */

/*

This code shows how to run save on every element drop or element delete.
All nice features like printing subjects or spreading school objects across week are not supported here.
Just replace the following line in index.php
	<script type="text/javascript" src="script.js"></script>
with:
	<script type="text/javascript" src="script1.js"></script>
and comment:
	header('location: index.php');
in save.php - redirection (or page refresh) after saving is not needed
*/

/* enable strict mode */
"use strict";

// functions
var initXMLHttpClient,	// create XMLHttp request object in a cross-browser manner
	save,				// save on element drop or element delete
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
		save();
	};
	// save - after element is deleted
	rd.myhandler_deleted = function () {
		save();
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


// save on every element drop or delete
save = function () {
	var content = REDIPS.drag.save_content(1),	// collect element positions from second table (timetable)
		msg;
	// open asynchronus request
	request.open('GET', 'save.php?' + content, true);
	// the onreadystatechange event is triggered every time the readyState changes
	request.onreadystatechange = function () {
		//  request finished and response is ready
		if (request.readyState === 4) {
			// if something went wrong
			if (request.status !== 200) {
				// prepare error message
				msg = 'Error: [' + request.status + '] ' + request.statusText;
				// display error message
				document.getElementById('message').innerHTML = msg;
			}
	    }
	};
	// send request
	request.send(null);
};
