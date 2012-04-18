/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false,  ActiveXObject: false, REDIPS: true */

/* enable strict mode */
"use strict";

// create redips container
var redips = {};

// configuration
redips.configuration = function () {
	redips.width = '380px';					// width of DIV element dropped to the right table
	redips.height = '350px';				// height of DIV element dropped to the right table
	redips.left = 'left';					// id of left DIV container
	redips.right = 'right';					// id of right DIV container
	redips.ajax_detail = 'db_ajax.php';		// get content from database (via AJAX)
	redips.ajax_save = 'db_save.php';		// submit form to the server
	redips.size = {w: 0, h: 0};				// size of DIV elements in question table
	redips.pname = '';						// person name
	redips.request = null;					// AJAX request
};
	

// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag class (set globally)
	var rd = REDIPS.drag;
	// set script configuration
	redips.configuration();
	// elements can be dropped only to the empty table cells
	REDIPS.drag.drop_option = 'single';
	// create XMLHttp request object
	redips.request = redips.initXMLHttpClient();
	// REDIPS.drag initialization
	rd.init();
	// remember width & height of DIV element if element is clicked in left container
	rd.myhandler_clicked = function (current_cell) {
		// define container (from current cell)
		var c = rd.find_parent('DIV', current_cell);
		// remember width & height
		if (c.id === redips.left) {
			redips.size.w = rd.obj.style.width;
			redips.size.h = rd.obj.style.height;
		}

	};
	// event handler called before DIV element is dropped to the table
	// in case when DIV element changes location from left to right DIV container or vice versa 
	rd.myhandler_dropped_before = function (target_cell) {
		var id = rd.obj.id,	// define id of DIV element
			sc,				// source container
			tc;				// target container
		// define target container (it is DIV element)
		tc = rd.find_parent('DIV', target_cell);
		// define source container
		sc = rd.find_parent('DIV', rd.source_cell);
		// if element is dropped from left to the right container
		// (right table doesn't have id)
		if (sc.id === redips.left && tc.id === redips.right) {
			// save person name
			redips.pname = rd.obj.innerHTML;
			// send request (input parameter is object reference)
			redips.send_request(rd.obj, id);
			// width & height parameter is set as global variable
			rd.obj.style.width = redips.width;
			rd.obj.style.height = redips.height;
		}
		// if element is dropped back to the left table
		else if (sc.id === redips.right && tc.id === redips.left) {
			// set person name from variable
			rd.obj.innerHTML = redips.pname;
			rd.obj.style.width = redips.size.w;
			rd.obj.style.height = redips.size.h;
		}
	};
};


// XMLHttp request object
redips.initXMLHttpClient = function () {
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


// executed when DIV element is dropped to the right table (dropzone)
redips.send_request = function (obj, id) {
	// open asynchronus request
	redips.request.open('GET', redips.ajax_detail + '?id=' + id, true);
	// the onreadystatechange event is triggered every time the readyState changes
	redips.request.onreadystatechange = function () {
		//  request finished and response is ready
		if (redips.request.readyState === 4) {
			if (redips.request.status === 200) {
				obj.innerHTML = redips.request.responseText;
			}
			// if request status isn't OK
			else {
				obj.innerHTML = 'Error: [' + redips.request.status + '] ' + redips.request.statusText;
			}
	    }
	};
	redips.request.send(null); // send request
};


// method parses form elements and submits to the server
redips.save = function (button) {
	var frm = document.getElementById('myform'),
		div = REDIPS.drag.find_parent('DIV', button),
		msg = document.getElementById('message'),
		el,
		params = '',
		i;
	// prepare all form elements like name1=value1&name2=value2&name3=value3...
	for (i = 0; i < frm.elements.length; i++) {
		// set element reference
		el = frm.elements[i];
		// if form element is input text
		if (el.type === 'text') {
			params += el.name + '=' + el.value + '&';
		}
	}
	// cut last '&' from params string
	params = params.substring(0, params.length - 1);
	// open asynchronus request (POST method)
	redips.request.open('POST', redips.ajax_save, true);
	// set content type for POST method
	redips.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	// the onreadystatechange event is triggered every time the readyState changes
	redips.request.onreadystatechange = function () {
		var status,		// status from the AJAX service (it should return string "OK")
			message,	// displayed message to the user
			delay;		// delay (in milliseconds) after displayed message will be deleted
		//  request finished and response is ready
		if (redips.request.readyState === 4) {
			// response is OK
			if (redips.request.status === 200) {
				// status from the AJAX service
				status = redips.request.responseText;
				// test if returned status is OK
				if (status === 'OK') {
					// set new person name to the redips.pname variable (this will be used when object will be back to the left table)
					redips.pname = document.getElementById('fname').value + ' ' + document.getElementById('lname').value;
					// set message and delay
					message = 'Saved!';
					delay = 2000;
				}
				else {
					message = 'Error [' + status + ']';
					delay = 3000;
				}
			}
			// if request status isn't OK
			else {
				message = 'Error: [' + redips.request.status + '] ' + redips.request.statusText;
				delay = 3000;
			}
			// display message and set timeout to delete message
			msg.innerHTML = message;
		    setTimeout(redips.clear_message, delay);
	    }
	};
	// send request
	redips.request.send(params);
};


// method clears diplayed message
redips.clear_message = function () {
	var msg = document.getElementById('message');
	// if message field exist then clear message
	// it's possible that user will drop back DIV element before message is cleared
	if (msg) {
		document.getElementById('message').innerHTML = '';
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}