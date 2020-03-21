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
	redips.left = 'left';				// id of left DIV container
	redips.right = 'right';				// id of right DIV container
	redips.form = 'myform';				// id of form beneath right table
	redips.ajaxSave = 'db_save.php';	// submit form to the server
	redips.deleteText = '[delete]';		// delete text before item
	redips.request = null;				// AJAX request
	redips.ol = null;					// OL (Ordered List) reference (reference is set in redips.init)
};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag class (set globally)
	let rd = REDIPS.drag;
	// set script configuration
	redips.configuration();
	// elements can be dropped only to the empty table cells
	rd.dropMode = 'single';
	// set reference to the ul
	redips.ol = document.getElementById('drop-list');
	// REDIPS.drag initialization
	rd.init();
	// after element is dropped to the trash cell (append it to the list below table)
	rd.event.deleted = function (targetCell) {
		redips.addItem(rd.obj);
	};
	// set error handler for AJAX call
	rd.error.ajax = function (xhr) {
		// display error message
		redips.displayMessage('AJAX error: [' + xhr.status + '] ' + xhr.statusText, 2000);
		// return false to stop calling callback function
		return false;
	};
};


// method parses form elements and submits to the server
redips.save = function () {
	let frm = document.getElementById(redips.form),
		el,
		params = '',
		i;
	// prepare all form elements in name-value form like name1=value1&name2=value2&name3=value3...
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
	// make AJAX call and set redips.handler as callback function
	REDIPS.drag.ajaxCall(redips.ajaxSave, redips.handler, {method: 'POST', data: params});
};


// AJAX callback function
redips.handler = function (xhr) {
	/*
	//
	// test status returned from AJAX service
	//
	var status = xhr.responseText;
	// test if status is OK
	if (status === 'OK') {
		message = 'Saved!';
	}
	else {
		message = 'Error [' + status + ']';
	}
	// display message
	redips.displayMessage(message, 2000);
	*/

	//
	// demo code
	//
	// display message
	redips.displayMessage(xhr.responseText, 2000);
};


// method displays message (and clears after timeout)
redips.displayMessage = function (message, delay) {
	// set reference to the message element
	let msg = document.getElementById('message');
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
	let li = document.createElement('li'),
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
	let evt = e || window.event,	// define event (cross browser)
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
	redips.displayMessage(text + ' deleted!', 500);
	// hide "Save" button if needed
	redips.button();
};


// method displays or hides "Save" button
redips.button = function () {
	// set reference to the "Save" button
	let button = document.getElementById('save-button');
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
