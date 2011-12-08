/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, ActiveXObject: false, REDIPS: true */

/* enable strict mode */
"use strict";

// functions
var redips_init,		// define redips_init variable
	initXMLHttpClient,	// create XMLHttp request object in a cross-browser manner
	send_request,		// send AJAX request
	request,			// XMLHttp request object
	print_message;		// print message


// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag object
	var	rd = REDIPS.drag;
	// create XMLHttp request object
	request = initXMLHttpClient();
	// REDIPS.drag initialization
	rd.init();
	rd.drop_option = 'single';		// dragged elements can be placed to the empty cells only
	rd.hover.color_td = '#9BB3DA';	// set hover color
	rd.trash_ask = false;			// do not ask on delete
	// save - after element is dropped
	rd.myhandler_dropped = function () {
		// get element position (method returns array with current and source positions - tableIndex, rowIndex and cellIndex)
		var pos = rd.get_position();
		// save table content
		send_request('ajax/db_save.php?p=' + rd.obj.id + '_' + pos.join('_'));
	};
	// delete - after element is deleted
	rd.myhandler_deleted = function () {
		// get element position
		var pos = rd.get_position(),
			row = pos[4],
			col = pos[5];
		// delete element
		send_request('ajax/db_delete.php?p=' + rd.obj.id + '_' + row + '_' + col);
	};
	// print message to the message line
	print_message('AJAX version');
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


// print message
print_message = function (message) {
	document.getElementById('message').innerHTML = message;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}