/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false,  ActiveXObject: false, REDIPS: true */

/* enable strict mode */
"use strict";

// create redips container
var redips = {};

// configuration
redips.configuration = function () {
	redips.hover1 = '#9BB3DA';				// hover color for original elements
	redips.hover2 = '#FFCFAE';				// hover color for cloned elements
	redips.width = '240px';					// width of DIV element dropped to the right table
	redips.left = 'left';					// id of left DIV container
	redips.right = 'right';					// id of right DIV container
	redips.content_url = 'get-content.php';	// get-content URL
	redips.size = {w: 0, h: 0};				// size of DIV elements in question table
};

// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag class
	var rd = REDIPS.drag;
	// set script configuration
	redips.configuration();
	// set reference to the hoverDiv
	redips.hoverDiv = document.getElementById('hover-div');
	// initially hide all tables in right container except first table
	redips.hideTables();
	// set class="single" to the table cells question table (left table)
	redips.singleContent();
	// set onmouseover & onmouseout to all div elements inside DIV id="drag"
	redips.setEvents();
	// create XMLHttp request object
	redips.request = redips.initXMLHttpClient();
	// set fixed position for the left container
	document.getElementById(redips.left).style.position = 'fixed';
	// initialization
	rd.init();
	// drop option is switch - content can be exchanged
	rd.dropMode = 'switch';
	// in a moment when dragging starts, remove mouseover event and hide hover tooltip
	rd.event.moved = function () {
		REDIPS.event.remove(rd.obj, 'mouseover', redips.showTooltip);
		redips.hideTooltip();
	};
	// enable cloning option only for DIV elements in right table 
	rd.event.clicked = function () {
		// find container id
		var cid = redips.findContainer(rd.obj);
		// set cloning option with shiftKey only for right DIV container
		if (cid === redips.right) {
			rd.clone.keyDiv = true;
		}
		else {
			rd.clone.keyDiv = false;
		}
		// set hover color for original DIV elements and for cloned DIV elements
		if (rd.obj.className.indexOf('clnd') === -1) {
			rd.hover.colorTd = redips.hover1;
		}
		else {
			rd.hover.colorTd = redips.hover2;
		}
	};
	// event handler called before DIV element is dropped to the table
	// in case when DIV element changes location from left to right DIV container or vice versa 
	rd.event.droppedBefore = function (targetCell) {
		var id = rd.obj.id,	// define id of DIV element
			tcid,			// target container id
			scid;			// source container id
		// find target container id and source container id
		tcid = redips.findContainer(targetCell);
		scid = redips.findContainer(rd.td.source);
		// if element is dropped from question table to the one of right tables
		// (right tables doesn't have id)
		if (scid === redips.left && tcid === redips.right) {
			// send request (input parameter is object reference)
			redips.sendRequest(rd.obj, id);
			rd.obj.style.width = redips.width; // width parameter
			rd.obj.style.height = '';
		}
		// if element is dropped from right table to the question table
		else if (scid === redips.right && tcid === redips.left) {
			rd.obj.innerHTML = id;
			rd.obj.style.width = redips.size.w;
			rd.obj.style.height = redips.size.h;
		}
	};
	// after DIV element is dropped, 
	rd.event.dropped = function (targetCell) {
		// target container id
		var tcid = redips.findContainer(targetCell);
		// target container is defined in event.droppedBefore()
		if (tcid === redips.left) {
			// if cloned element is dropped to the left table then delete it
			if (rd.obj.className.indexOf('clnd') !== -1) {
				// remove child from DOM (node still exists in memory)
				rd.obj.parentNode.removeChild(rd.obj);
			}
			// else return mouseover event (needed for tooltip in left table)
			else {
				REDIPS.event.add(rd.obj, 'mouseover', redips.showTooltip);
			}
		}
	};
	// add "clnd" (cloned) class name to the cloned elements
	// needed to delete cloned elements in case when dropped to the left table
	rd.event.cloned = function () {
		if (rd.obj.className.indexOf('clnd') === -1) {
			rd.obj.className += ' clnd';
		}
		// set hover color for cloned elements
		rd.hover.colorTd = redips.hover2;
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


// send request to the server and display response in obj.innerHTML
redips.sendRequest = function (obj, id) {
	// open asynchronus request
	redips.request.open('GET', redips.content_url + '?id=' + id, true);
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


// show tooltip (when mouse is over element of question table) 
redips.showTooltip = function (e) {
	var element = e.target || e.srcElement,	// define element from the fired event
		id = element.id,					// id of the DIV element is question ID (written as inner HTML)
		box = element,						// remember box object (needed for offset calculation)
		scrollPosition,						// scroll position
		oTop, oLeft;						// offset Top & offset Left
	// get scroll position and include scroll position in offset calculation
	// use REDIPS.drag.getScrollPosition() for scroll position
	scrollPosition = REDIPS.drag.getScrollPosition();
	oLeft = scrollPosition[0];
	oTop = scrollPosition[1];
	// loop to the root element and return box offset (top, right, bottom, left)
	do {
		oLeft += box.offsetLeft;
		oTop += box.offsetTop;
		box = box.offsetParent;
	}
	while (box && box.nodeName !== 'BODY');
	// set popup near to the element
	redips.hoverDiv.style.top  = (oTop + 22) + 'px';
	redips.hoverDiv.style.left = oLeft + 'px';
	// send request (input parameter is object reference)
	redips.sendRequest(redips.hoverDiv, id);
	// set visibility
	redips.hoverDiv.style.visibility = 'visible';
};


// hide tooltip
redips.hideTooltip = function () {
	redips.hoverDiv.style.visibility = 'hidden';	
};


// function shows/hides tables in page containers
// input parameters are button reference (to change button label) and id of page container
redips.toggle = function (btn, page_id) {
	var page = document.getElementById(page_id);
	if (page.style.display === '') {
		btn.value = 'Table';
		page.style.display = 'none';
	}
	else {
		btn.value = 'Hide';
		page.style.display = '';
	}
};


// set onmouseover & onmouseout to all div elements inside DIV id="drag"
redips.setEvents = function () {
	var regex_drag = /\bdrag\b/i,	// regular expression to search "drag" class name
		div, i;
	// collect all div elements inside DIV id="drag"
	div = document.getElementById('redips-drag').getElementsByTagName('div');
	for (i = 0; i < div.length; i++) {
		// only DIV elements that contains "drag" in class name
		if (regex_drag.test(div[i].className)) {
			REDIPS.event.add(div[i], 'mouseover', redips.showTooltip);
			REDIPS.event.add(div[i], 'mouseout', redips.hideTooltip);
		}
	}
	// remember size (width and height) of DIV elements in question table
	// needed in case when element is returned to the left table
	redips.size.w = div[0].style.width;
	redips.size.h = div[0].style.height;
};


// initially hide all page containers but first page container
// tables are closed in P block - page container
redips.hideTables = function () {
	var div, i;
	// collect page containers in right DIV container
	div = document.getElementById(redips.right).getElementsByTagName('div');
	// hide all page containers but first
	for (i = 1; i < div.length; i++) {
		div[i].style.display = 'none';
	}
};


// set class="single" to all cells in question table (left table)
redips.singleContent = function () {
	var cell, i;
	// collect table cells from left table
	cell = document.getElementById('table1').getElementsByTagName('td');
	// set class='single' to all table cells
	// to prevent 'switching' content from left and right tables
	for (i = 0; i < cell.length; i++) {
		cell[i].className = 'redips-single';
	}
};


// find container and return container id
redips.findContainer = function (c) {
	// loop up until found target DIV container 
	while (c && c.id !== redips.left && c.id !== redips.right) {
		c = c.parentNode;
	}
    // return container id
    return c.id;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}