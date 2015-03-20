/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


var redipsInit,			// define redipsInit variable
	toggleAnimation,	// enable / disable animation
	startPositions,		// remember initial positions of DIV elements
	pos = {},			// initial positions of DIV elements
	rd = REDIPS.drag;	// reference to the REDIPS.drag lib


// redips initialization
redipsInit = function () {
	// initialization
	rd.init();
	// enable shift animation
	rd.shift.animation = true;
	// save initial DIV positions to "pos" object (it should go after initialization)
	startPositions();
	// in a moment when DIV element is moved, set drop_option property (shift or single)
	rd.event.moved = function () {
		// find parent table of moved element
		var tbl = rd.findParent('TABLE', rd.obj);
		// if table id is table1
		if (tbl.id === 'table1') {
			rd.dropMode = 'shift';
		}
		else {
			rd.dropMode = 'single';
		}
	};
	// when DIV element is double clicked return it to the initial position
	rd.event.dblClicked = function () {
		// set dblclicked DIV id
		var id = rd.obj.id;
		// move DIV element to initial position
		rd.moveObject({
			id: id,			// DIV element id
			target: pos[id]	// target position
		});
	};
};


// function scans DIV elements and saves their positions to the "pos" object
startPositions = function () {
	// define local varialbles
	var divs, id, i, position;
	// collect DIV elements from dragging area
	divs = document.getElementById('redips-drag').getElementsByTagName('div');
	// open loop for each DIV element
	for (i = 0; i < divs.length; i++) {
		// set DIV element id
		id = divs[i].id;
		// if element id is defined, then save element position 
		if (id) {
			// set element position
			position = rd.getPosition(divs[i]);
			// if div has position (filter obj_new) 
			if (position.length > 0) {
				pos[id] = position;
			}
		}
	}
};


// enable / disable animation
toggleAnimation = function (chk) {
	REDIPS.drag.shift.animation = chk.checked;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}