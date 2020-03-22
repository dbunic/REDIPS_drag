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


// configuration
redips.configuration = function () {
	redips.width = '380px';					// width of DIV element dropped to the right table
	redips.height = '350px';				// height of DIV element dropped to the right table
	redips.left = 'left';					// id of left DIV container
	redips.right = 'right';					// id of right DIV container
	redips.ajaxDetail = 'db_ajax.php';		// get content from database (via AJAX)
	redips.ajaxSave = 'db_save.php';		// submit form to the server
	redips.size = {w: 0, h: 0};				// size of DIV elements in question table
	redips.pname = '';						// person name
	redips.request = null;					// AJAX request
};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag class (set globally)
	let rd = REDIPS.drag;
	// set script configuration
	redips.configuration();
	// set rd reference to local redips object (needed in AJAX handler)
	redips.rd = rd;
	// elements can be dropped only to the empty table cells
	REDIPS.drag.dropMode = 'single';
	// REDIPS.drag initialization
	rd.init();
	// remember width & height of DIV element if element is clicked in left container
	rd.event.clicked = function (currentCell) {
		// define container (from current cell)
		var c = rd.findParent('DIV', currentCell);
		// remember width & height
		if (c.id === redips.left) {
			redips.size.w = rd.obj.style.width;
			redips.size.h = rd.obj.style.height;
		}
	};
	// event handler called before DIV element is dropped to the table
	// in case when DIV element changes location from left to right DIV container or vice versa
	rd.event.droppedBefore = function (targetCell) {
		let id = rd.obj.id,	// define id of DIV element
			sc,				// source container
			tc;				// target container
		// define target container (it is DIV element)
		tc = rd.findParent('DIV', targetCell);
		// define source container
		sc = rd.findParent('DIV', rd.td.source);
		// if element is dropped from left to the right container
		// (right table doesn't have id)
		if (sc.id === redips.left && tc.id === redips.right) {
			// save person name
			redips.pname = rd.obj.innerHTML;
			// make ajax call and set redips.handler1() as callback function
			rd.ajaxCall(redips.ajaxDetail + '?id=' + id, redips.handler1);
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
	// set error handler for AJAX calls
	rd.error.ajax = function (xhr) {
		// display error message
		redips.rd.obj.innerHTML = 'Oops, an error occurred: [' + xhr.status + '] ' + xhr.statusText;
		// return false to stop calling callback function
		return false;
	};
};


// AJAX handler - called after DIV element is dropped to the right table (dropzone)
redips.handler1 = function (xhr) {
	// display DIV content
	redips.rd.obj.innerHTML = xhr.responseText;
};


// method parses form elements and submits to the server
redips.save = function (button) {
	let frm = document.getElementById('myform'),
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
	// make ajax call and set redips.handler2() as callback function
	redips.rd.ajaxCall(redips.ajaxSave, redips.handler2, {method: 'POST', data: params});
};


// AJAX handler - called after save button is clicked
redips.handler2 = function (xhr) {
	let status, // status from the AJAX service (it should return string "OK")
		message, // displayed message to the user
		msg = document.getElementById('message');
	// status from the AJAX service
	status = xhr.responseText;
	// test if returned status is OK
	if (status === 'OK') {
		// set new person name to the redips.pname variable (this will be used when object will be back to the left table)
		redips.pname = document.getElementById('fname').value + ' ' + document.getElementById('lname').value;
		// set message
		message = 'Saved!';
	}
	// else prepare error message
	else {
		message = 'Error1 [' + status + ']';
	}
	// display message
	msg.innerHTML = message;
	// clear message after 2 seconds
	setTimeout(redips.clearMessage, 2000);
};


// method clears displayed message
redips.clearMessage = function () {
	let msg = document.getElementById('message');
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
