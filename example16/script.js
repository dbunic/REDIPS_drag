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
	let rd = REDIPS.drag;
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
	// set fixed position for the left container
	document.getElementById(redips.left).style.position = 'fixed';
	// initialization
	rd.init();
	// in a moment when dragging starts, remove mouseover event, hide hover tooltip and set drop mode (depending on container source - left or right)
	// input parameter "cloned" (boolean) is set to true if DIV element is cloned (possible only for elements in right tables with pressed shift key)
	rd.event.moved = function (cloned) {
		// local varible (source container id)
		let scid;
		// remove mouseover event
		REDIPS.event.remove(rd.obj, 'mouseover', redips.showTooltip);
		// hide hover tooltip
		redips.hideTooltip();
		// if DIV element is not cloned then find source container
		if (cloned === false) {
			scid = redips.findContainer(rd.obj);
		}
		// set to single if element is dragged from left container or DIV element in right table is cloned
		// this way DIV elements dragged from left table or cloned in right table can be placed only to the empty TD
		if (scid === redips.left || cloned === true) {
			rd.dropMode = 'single';
		}
		// otherwise set drop mode to "switch" (element is dragged from right container)
		else {
			rd.dropMode = 'switch';
		}
	};
	// enable cloning option only for DIV elements in right table
	rd.event.clicked = function () {
		// find container id
		let cid = redips.findContainer(rd.obj);
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
		let id = rd.obj.id,	// define id of DIV element
			tcid,			// target container id
			scid;			// source container id
		// find target container id and source container id
		tcid = redips.findContainer(targetCell);
		scid = redips.findContainer(rd.td.source);
		// if element is dropped from question table to the one of right tables
		// (right tables doesn't have id)
		if (scid === redips.left && tcid === redips.right) {
			// make AJAX call - input parameter is question id (DIV element)
			// div property is reference to the object where AJAX output will be displayed (inside dropped DIV element)
			rd.ajaxCall(redips.content_url + '?id=' + id, redips.handler, {div: rd.obj});
			// set width and height
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
		let tcid = redips.findContainer(targetCell);
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
	// set error handler for AJAX calls
	rd.error.ajax = function (xhr, obj) {
		// set DIV innerHTML to display error message
		obj.div.innerHTML = 'Error: [' + xhr.status + '] ' + xhr.statusText;
		// return false to stop calling callback function
		return false;
	};
};


// AJAX handler - display response in div.innerHTML
// callback method is called with XHR and obj object
// obj is just passed from ajaxCall to this callback function
redips.handler = function (xhr, obj) {
	obj.div.innerHTML = xhr.responseText;
};


// show tooltip (when mouse is over element of question table)
redips.showTooltip = function (e) {
	let element = e.target || e.srcElement,	// define element from the fired event
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
	redips.hoverDiv.style.top = (oTop + 22) + 'px';
	redips.hoverDiv.style.left = oLeft + 'px';
	// make AJAX call - input parameter is question id (DIV element)
	// obj property is reference to the object where AJAX output will be displayed (see redips.handler)
	REDIPS.drag.ajaxCall(redips.content_url + '?id=' + id, redips.handler, {div: redips.hoverDiv});
	// set visibility
	redips.hoverDiv.style.visibility = 'visible';
};


// hide tooltip
redips.hideTooltip = function () {
	redips.hoverDiv.style.visibility = 'hidden';
};


// function shows/hides tables in page containers
// input parameters are button reference (to change button label) and id of page container
redips.toggle = function (btn, pageId) {
	let page = document.getElementById(pageId);
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
	let regexDrag = /\bdrag\b/i,	// regular expression to search "drag" class name
		div, i;
	// collect all div elements inside DIV id="drag"
	div = document.getElementById('redips-drag').getElementsByTagName('div');
	for (i = 0; i < div.length; i++) {
		// only DIV elements that contains "drag" in class name
		if (regexDrag.test(div[i].className)) {
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
	let div, i;
	// collect page containers in right DIV container
	div = document.getElementById(redips.right).getElementsByTagName('div');
	// hide all page containers but first
	for (i = 1; i < div.length; i++) {
		div[i].style.display = 'none';
	}
};


// set class="single" to all cells in question table (left table)
redips.singleContent = function () {
	let cell, i;
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
