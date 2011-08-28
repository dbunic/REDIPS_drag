/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false,  ActiveXObject: false, REDIPS: true */

/* enable strict mode */
"use strict";


var hover1 = '#9BB3DA',				// hover color for original elements
	hover2 = '#FFCFAE',				// hover color for cloned elements
	width = '240px',				// width of DIV element dropped to the right table
	left = 'left',					// id of left DIV container
	right = 'right',				// id of right DIV container
	content_url = 'get-content.php',// get-content URL
	// global parameters
	request,						// XMLHttp request object
	hover_div,						// reference to the hover_div object
	size = {w: 0, h: 0},			// size of DIV elements in question table
	tc,								// target container (defined in myhandler_dropped_before() and used in myhandler_dropped())
	// methods
	redips_init,					// define redips_init variable
	initXMLHttpClient,				// create XMLHttp request object in a cross-browser manner
	send_request,					// send request to the server and display response in obj.innerHTML
	show_tooltip,					// show tooltip (when mouse is over element in question table)
	hide_tooltip,					// hide tooltip
	toggle,							// function shows/hides tables in right container
	hide_tables,					// initially hide all tables but first table
	single_content,					// set class="single" to all cells in question table (left table)
	set_events;						// set onmouseover & onmouseout to all div elements inside DIV id="drag"


// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag class
	var rd = REDIPS.drag;
	// set reference to the hover_div
	hover_div = document.getElementById('hover_div');
	// initially hide all tables in right container except first table
	hide_tables();
	// set class="single" to the table cells question table (left table)
	single_content();
	// set onmouseover & onmouseout to all div elements inside DIV id="drag"
	set_events();
	// create XMLHttp request object
	request = initXMLHttpClient();
	// set fixed position for the left container
	document.getElementById(left).style.position = 'fixed';
	// initialization
	rd.init();
	// drop option is switch - content can be exchanged
	rd.drop_option = 'switch';
	// in a moment when dragging starts, remove mouseover event and hide hover tooltip
	rd.myhandler_moved = function () {
		REDIPS.event.remove(rd.obj, 'mouseover', show_tooltip);
		hide_tooltip();
	};
	// enable cloning option only for DIV elements in right table 
	rd.myhandler_clicked = function () {
		// set start position to find container
		// it should be parentNode because clicked object is DIV element
		var c = rd.obj.parentNode;
		// loop up until found target DIV container 
		while (c && c.id !== left && c.id !== right) {
			c = c.parentNode;
		}
		// set cloning option with shiftKey only for right DIV container
		if (c.id === right) {
			rd.clone_shiftKey = true;
		}
		else {
			rd.clone_shiftKey = false;
		}
		// set hover color for original DIV elements and for cloned DIV elements
		if (rd.obj.className.indexOf('clnd') === -1) {
			rd.hover_color = hover1;
		}
		else {
			rd.hover_color = hover2;
		}
	};
	// event handler called before DIV element is dropped to the table
	// in case when DIV element changes location from left to right DIV container or vice versa 
	rd.myhandler_dropped_before = function (target_cell) {
		var id = rd.obj.id,		// define id of DIV element
			sc = rd.source_cell;// define start point for source container
		// define start point of target container (global variable)
		tc = target_cell;
		// loop up until found target DIV container 
		while (tc && tc.id !== left && tc.id !== right) {
			tc = tc.parentNode;
		}
		// loop up until found source DIV container
		while (sc && sc.id !== left && sc.id !== right) {
			sc = sc.parentNode;
		}
		// if element is dropped from question table to the one of right tables
		// (right tables doesn't have id)
		if (sc.id === left && tc.id === right) {
			// send request (input parameter is object reference)
			send_request(rd.obj, id);
			rd.obj.style.width = width; // width parameter is set as global variable
			rd.obj.style.height = '';
		}
		// if element is dropped from right table to the question table
		else if (sc.id === right && tc.id === left) {
			rd.obj.innerHTML = id;
			rd.obj.style.width = size.w;
			rd.obj.style.height = size.h;
		}
	};
	// after DIV element is dropped, 
	rd.myhandler_dropped = function (target_cell) {
		// target container is defined in myhandler_dropped_before()
		if (tc.id === left) {
			// if cloned element is dropped to the left table then delete it
			if (rd.obj.className.indexOf('clnd') !== -1) {
				// remove child from DOM (node still exists in memory)
				rd.obj.parentNode.removeChild(rd.obj);
			}
			// else return mouseover event (needed for tooltip in left table)
			else {
				REDIPS.event.add(rd.obj, 'mouseover', show_tooltip);
			}
		}
	};
	// add "clnd" (cloned) class name to the cloned elements
	// needed to delete cloned elements in case when dropped to the left table
	rd.myhandler_cloned = function () {
		if (rd.obj.className.indexOf('clnd') === -1) {
			rd.obj.className += ' clnd';
		}
		// set hover color for cloned elements
		rd.hover_color = hover2;
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


// send request to the server and display response in obj.innerHTML
send_request = function (obj, id) {
	// open asynchronus request
	request.open('GET', content_url + '?id=' + id, true);
	// the onreadystatechange event is triggered every time the readyState changes
	request.onreadystatechange = function () {
		//  request finished and response is ready
		if (request.readyState === 4) {
			if (request.status === 200) {
				obj.innerHTML = request.responseText;
			}
			// if request status isn't OK
			else {
				obj.innerHTML = 'Error: [' + request.status + '] ' + request.statusText;
			}
	    }
	};
	request.send(null); // send request
};


// show tooltip (when mouse is over element of question table) 
show_tooltip = function (e) {
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
	hover_div.style.top  = (oTop + 22) + 'px';
	hover_div.style.left = oLeft + 'px';
	// send request (input parameter is object reference)
	send_request(hover_div, id);
	// set visibility
	hover_div.style.visibility = 'visible';
};


// hide tooltip
hide_tooltip = function () {
	hover_div.style.visibility = 'hidden';	
};


// function shows/hides tables in page containers
// input parameters are button reference (to change button label) and id of page container
toggle = function (btn, page_id) {
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
set_events = function () {
	var regex_drag = /\bdrag\b/i,	// regular expression to search "drag" class name
		div, i;
	// collect all div elements inside DIV id="drag"
	div = document.getElementById('drag').getElementsByTagName('div');
	for (i = 0; i < div.length; i++) {
		// only DIV elements that contains "drag" in class name
		if (regex_drag.test(div[i].className)) {
			REDIPS.event.add(div[i], 'mouseover', show_tooltip);
			REDIPS.event.add(div[i], 'mouseout', hide_tooltip);
		}
	}
	// remember size (width and height) of DIV elements in question table
	// needed in case when element is returned to the left table
	size.w = div[0].style.width;
	size.h = div[0].style.height;
};


// initially hide all page containers but first page container
// tables are closed in DIV block - page container
hide_tables = function () {
	var div, i;
	// collect page containers in right DIV container
	div = document.getElementById(right).getElementsByTagName('div');
	// hide all page containers but first
	for (i = 1; i < div.length; i++) {
		div[i].style.display = 'none';
	}
};


// set class="single" to all cells in question table (left table)
single_content = function () {
	var cell, i;
	// collect table cells from left table
	cell = document.getElementById('table1').getElementsByTagName('td');
	// set class='single' to all table cells
	// to prevent 'switching' content from left and right tables
	for (i = 0; i < cell.length; i++) {
		cell[i].className = 'single';
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}