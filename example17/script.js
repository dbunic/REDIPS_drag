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


let redips = {},		// create redips container
	rd = REDIPS.drag,	// reference to the REDIPS.drag library
	loc = {},			// initial locations of DIV elements
	lock = 0;			// needed for enable/disable element synchronization (used in enableRows)


// redips initialization
redips.init = function () {
	rd.style.borderDisabled = 'solid';	// border style for disabled element will not be changed
	rd.style.opacityDisabled = 70;		// disabled elements will have opacity effect
	rd.animation.pause = 40;			// set animation loop pause
	// initialize dragging containers (each table is placed in separate container)
	rd.init('drag1');
	rd.init('drag2');
	// elements can be dropped only to the empty table cells
	rd.dropMode = 'single';
	// set hover color for TD and TR
	rd.hover.colorTd = '#FFCFAE';
	rd.hover.colorTr = '#9BB3DA';
	// save locations of all DIV elements to the "loc" object (it should go after initialization)
	redips.startPositions();
	// row was moved - event handler
	rd.event.rowMoved = function () {
		// set opacity for moved row (rd.obj is reference of cloned row - mini table)
		rd.rowOpacity(rd.obj, 85);
		// set opacity for source row and change source row background color (obj.obj_old is reference of source row)
		rd.rowOpacity(rd.objOld, 20, 'white');
	};
	// row was dropped - move row in opposite table
	rd.event.rowDropped = function () {
		// id of element from opposite table (rd.objOld is source row, redips.div is reference to the <div class="drag row">)
		let	idNew = redips.getId(rd.objOld.redips.div),
			// returned value from moveObject method
			row = [];
		// disable elements in both containers ("enableElements" is local function)
		redips.enableElements(false);
		// move row in other table (method returns reference to the mini table and source row)
		// after animation is finished, callback function "enableElements" will enable elements in both containers
		row = rd.moveObject({
			id: idNew,
			callback: function () {
				redips.enableElements(true);
			}
		});
		// set opacity for moved row (row[0] is reference of cloned row - mini table)
		rd.rowOpacity(row[0], 85);
		// set opacity for source row and change source row background color (row[1] is reference of source row)
		rd.rowOpacity(row[1], 20, 'White');
	};
	// row was dropped to the source row (mini table - cloned row, will be removed and source row will return to original state)
	rd.event.rowDroppedSource = function () {
		// make source row completely visible (no opacity)
		rd.rowOpacity(rd.objOld, 100);
		// enable both containers
		redips.enableElements(true);
	};
	// element was dropped - move element in opposite table
	rd.event.dropped = function () {
		let	obj = rd.obj,		// reference to the current element
			idNew = redips.getId(obj);	// id of element from opposite table
		// disable current element
		rd.enableDrag(false, obj);
		// disable row handlers - blue circles ("enableRows" is a local function)
		redips.enableRows(false);
		// element from opposite table with idNew will be moved to the dropped table cell
		// tableIndex for both tables is 0 because each table is closed in separate dragging container
		// after animation is finished, callback function will enable previously disabled element and row handlers (blue circles)
		rd.moveObject({
			id: idNew,
			callback: function () {
				rd.enableDrag(true, obj);
				redips.enableRows(true);
			}
		});
	};
};


/**
 * Function scans all DIV elements and save their positions to the pos object.
 */
redips.startPositions = function () {
	let divs = [], id, i, j, position;
	// collect DIV elements from both dragging area
	divs[0] = document.getElementById('drag1').getElementsByTagName('div');
	divs[1] = document.getElementById('drag2').getElementsByTagName('div');
	// open loop for each dragging area
	for (i = 0; i < divs.length; i++) {
		// open loop for each div element
		for (j = 0; j < divs[i].length; j++) {
			// set element id
			id = divs[i][j].id;
			// if element id is defined, then save element position
			if (id) {
				// set element position
				position = rd.getPosition(divs[i][j]);
				// if div has position (filter obj_new)
				if (position.length > 0) {
					loc[id] = position;
				}
			}
		}
	}
};


/**
 * Method returns element to initial positions.
 */
redips.reset = function () {
	let id,
		pos1;
	// loop goes through every "id" in loc object
	for (id in loc) {
		// test the property (filter properties of the prototype) and if element id begins with "d"
		// other DIV elements are row handlers
		if (loc.hasOwnProperty(id) && id.substring(0, 1) === 'd') {
			// get current position of element
			pos1 = rd.getPosition(id);
			// if current position is different then initial position the return element to the initial position
			if (loc[id].toString() !== pos1.toString()) {
				// disable row handlers - blue circles
				redips.enableRows(false);
				// move object to the initial position
				rd.moveObject({
					id: id,				// id of object to move
					target: loc[id],	// target position
					callback: redips.enableRows // callback function after moving is finished
				});
			}
		}
	}
};


/**
 * Method shuffles elements on both tables. Random positions are unique and different then current element positions.
 */
redips.shuffle = function () {
	let id,			// element id
		rowIndex,	// row index (random number from 1 to 7)
		cellIndex,	// cell index (random number from 1 to 5)
		rnd,		// random position
		pos,		// current position as array (returned from getPosition method)
		pos1,		// current position in format rowIndex + '_' + cellIndex
		arr = [];	// generated positions will be saved in array (to avoid duplicates)
	// loop goes through every "id" in loc object
	for (id in loc) {
		// test the property (filter properties of the prototype) and
		// if element id begins with "d" (other DIV elements are row handlers) and
		// if id of element ends with "1" (only elements from first table)
		if (loc.hasOwnProperty(id) && id.substring(0, 1) === 'd' && id.charAt(id.length - 1) === '1') {
			pos = rd.getPosition(id);		// set current position for DIV element with defined id
			pos1 = pos[1] + '_' + pos[2];	// prepare current position in format rowIndex + '_' + cellIndex
			// generate random position (must be unique and different then current position)
			do {
				rowIndex = Math.floor(Math.random() * 7) + 1;
				cellIndex = Math.floor(Math.random() * 5) + 1;
				rnd = rowIndex + '_' + cellIndex;
			} while (arr.indexOf(rnd) > -1 || rnd === pos1);
			// push generated value to the array (to avoid duplicate positions)
			arr.push(rnd);
			// disable row handlers - blue circles in first column
			redips.enableRows(false);
			// move object to the random position in table1
			rd.moveObject({
				id: id,								// id of object to move
				target: [0, rowIndex, cellIndex],	// target position (table index is 0 because of separate drag container)
				callback: redips.enableRows			// callback function after moving is finished
			});
			// disable row handlers - blue circles in first column
			redips.enableRows(false);
			// move object to the random position in table2
			rd.moveObject({
				id: id.slice(0, -1) + '2',			// id of object from table2
				target: [0, rowIndex, cellIndex],	// target position (table index is 0 because of separate drag container)
				callback: redips.enableRows			// callback function after moving is finished
			});
		}
	}
};


/**
 * Method returns "id" of element in opposite table.
 * e.g. d2_1 -> d2_2 or d4_2 -> d4_1
 * @param {HTMLElement} DIV element (in row dragging context "el" is redips-rowhandler of source row)
 * @return {String} Id of element in opposite table.
 */
redips.getId = function (el) {
	let	ri = {1: 2, 2: 1},					// needed for reverse 1 -> 2 or 2 -> 1
		id = el.id,							// define DIV id or mini table
		lc = id.charAt(id.length - 1),		// last character of id that should be reversed (1 -> 2 or 2 -> 1)
		idNew = id.slice(0, -1) + ri[lc];	// id of element from opposite table
	// return new id
	return idNew;
};


/**
 * Method enables/disables buttons and all elements on page. In case when user drops row, elements (and rows) are disabled until animation finishes.
 * @param {Boolean} Flag enable or disable elements in both dragging containers.
 */
redips.enableElements = function (flag) {
	rd.enableDrag(flag, '#drag1 div');
	rd.enableDrag(flag, '#drag2 div');
	// enable/disable buttons "Reset" and "Shuffle"
	redips.enableButtons(flag);
};


/**
 * Method enables/disables rows and buttons on page. In case when user drops element, row handlers are disabled until all animations are finished.
 * "lock" variable is used for animation synchronization.
 * @param {Boolean} Flag enable or disable rows in both dragging containers.
 */
redips.enableRows = function (flag) {
	let id;
	// if input parameter is not boolean type, then enableRows is called from callback function
	// callback function sends reference of moved element
	if (typeof (flag) !== 'boolean') {
		flag = true;
	}
	// enable element - decrease lock variable
	if (flag) {
		lock--;
	}
	// if lock variable is 0 (condition "lock === 0" will be fine)
	if (lock <= 0) {
		// set lock variable to 0 (just to be sure - it should be 0 anyway)
		lock = 0;
		// enable / disable buttons "Reset" and "Shuffle"
		redips.enableButtons(flag);
		// loop goes through every "id" in loc object
		for (id in loc) {
			// test the property (filter properties of the prototype) and if element id begins with "r"
			// other DIV elements are DIV elements
			if (loc.hasOwnProperty(id) && id.substring(0, 1) === 'r') {
				rd.enableDrag(flag, '#' + id);
			}
		}
	}
	// after element is dropped, it will be disabled first (so this code is executed first in enableRows() function)
	if (!flag) {
		lock++;
	}
};


/**
 * Method enables/disables buttons (it's called from enableElements() and enableRows() functions)
 * @param {Boolean} Flag enable or disable buttons.
 */
redips.enableButtons = function (flag) {
	let buttons, i;
	// collect buttons from buttons area
	buttons = document.getElementById('buttons').getElementsByTagName('input');
	// open loop
	for (i = 0; i < buttons.length; i++) {
		buttons[i].disabled = !flag;
	}
};


// indexOf method - needed for IE browsers ?!
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (el) { // eslint-disable-line no-extend-native
		var i; // local variable
		for (i = 0; i < this.length; i++) {
			if (this[i] === el) {
				return i;
			}
		}
		return -1;
	};
}


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
