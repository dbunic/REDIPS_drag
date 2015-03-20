/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: false, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false,  ActiveXObject: false, REDIPS: true */

/* enable strict mode */
"use strict";

// create redips container
var redips = {};

// configuration
redips.configuration = function () {
	redips.left = 'left';					// id of left DIV container
	redips.right = 'right';					// id of right DIV container
	redips.form = 'myform';					// id of form beneath right table
	redips.ajaxSave = 'db_save.php';		// submit form to the server
	redips.deleteText = '[delete]';		// delete text before item
	redips.request = null;					// AJAX request
	redips.ol = null;						// OL (Ordered List) reference (reference is set in redips.init)
};
	

// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag class (set globally)
	var rd = REDIPS.drag;
	// set script configuration
	redips.configuration();
	// elements can be dropped only to the empty table cells
	rd.dropMode = 'single';
	// create XMLHttp request object
	redips.request = redips.initXMLHttpClient();
	// set reference to the ul
	redips.ol = document.getElementById('drop-list');
	// REDIPS.drag initialization
	rd.init();
	// after element is dropped to the trash cell (append it to the list below table)
	rd.event.deleted = function (targetCell) {
		redips.addItem(rd.obj);
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


// method parses form elements and submits to the server
redips.save = function () {
	var frm = document.getElementById(redips.form),
		el,
		params = '',
		i;
	// prepare all form elements like name1=value1&name2=value2&name3=value3...
	for (i = 0; i < frm.elements.length; i++) {
		// set element reference
		el = frm.elements[i];
		// if form element is hidden element
		if (el.type === 'hidden') {
			params += el.name + '=' + el.value + '&';
		}
	}
	// cut last '&' from params string
	params = params.substring(0, params.length - 1);
	// open asynchronus request (POST method)
	redips.request.open('POST', redips.ajaxSave, true);
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
				/*
				 * original code 
				 * 
				// status from the AJAX service
				status = redips.request.responseText;
				// test if returned status is OK
				if (status === 'OK') {
					// set message and delay
					message = 'Saved!';
					delay = 2000;
				}
				else {
					message = 'Error [' + status + ']';
					delay = 3000;
				}
				*/
				// demo code
				message = redips.request.responseText;
				delay = 2000;
			}
			// if request status isn't OK
			else {
				message = 'Error: [' + redips.request.status + '] ' + redips.request.statusText;
				delay = 2000;
			}
			// display message and set timeout to delete message
			redips.display_message(message, delay);
		}
	};
	// send request
	redips.request.send(params);
};


// method displays message (and clears after timeout)
redips.display_message = function (message, delay) {
	// set reference to the message element
	var msg = document.getElementById('message');
	// display message
	msg.innerHTML = message;
	// clear message after timeout (1.5sec)
	setTimeout(function () {
		msg.innerHTML = '';
	}, delay);
};


// add list item element to OL
redips.addItem = function (obj) {
	// create LI and INPUT elements (as well as text node)
	var li  = document.createElement('li'),
		input = document.createElement('input'),
		span = document.createElement('span'),
		text = obj.innerText || obj.textContent,
		txtLi = document.createTextNode(text),
		txtSpan = document.createTextNode(redips.deleteText);
	// set properties for hidden input element: type, name and value (regex is needed because cloned element contains sufix "c0" like i01c0 that should be discarded)
	input.type = 'hidden';
	input.name = 'p[]';
	input.value = obj.id.match(/(.*)?c\d+/)[1];
	// create span node
	span.appendChild(txtSpan);
	span.onclick = redips.deleteItem;
	span.className = 'deleteItem';
	// append span element
	li.appendChild(span);
	// append text node to the list item element
	li.appendChild(txtLi);
	// append input element
	li.appendChild(input);
	// append list item element to the UL
	redips.ol.appendChild(li);
	// show save button visible
	redips.button();
};


// delete list item from OL
redips.deleteItem = function (e) {
	var evt = e || window.event,	// define event (cross browser)
		span, li, text;				// declare local variables
	// set source tag reference
	if (evt.srcElement) {
		span = evt.srcElement;
	}
	else {
		span = evt.target;
	}
	// set reference for parent LI element
	li = REDIPS.drag.findParent('LI', span);
	// define item text (cross browser - Firefox uses the W3C-compliant textContent property)
	text = li.innerText || li.textContent;
	// cut out "[delete]" string
	text = text.substring(redips.deleteText.length);
	// delete item from the list
	li.parentNode.removeChild(li);
	// display message
	redips.display_message(text + ' deleted!', 500);
	// hide "Save" button if needed
	redips.button();
};


// method displays or hides "Save" button 
redips.button = function () {
	// set reference to the "Save" button
	var button = document.getElementById('save-button');
	// if OL element contains LI (one or more)
	if (redips.ol.children.length > 0) {
		button.style.display = 'block';
	}
	// LI is empty - hide "Save button"
	else {
		button.style.display = 'none';
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}