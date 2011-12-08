/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


	// properties
var	rd = REDIPS.drag,	// reference to the REDIPS.drag library
	loc = {},			// initial locations of DIV elements
	lock = 0,			// needed for enable/disable element synchronization (used in enable_rows)
	// methods
	redips_init,		// redips initialization
	start_positions,	// remember a start positions of DIV elements
	reset,				// returns elements to their initial positions
	shuffle,			// shuffles (randomizes the order of the elements on tables)
	enable_elements,	// enables/disables elements on page
	enable_rows,		// enables/disables rows (row handler - blue circles) on page
	enable_buttons,		// enables/disables buttons (called from enable elements and enable_rows)
	get_id;				// returns id of element in opposite table


// redips initialization
redips_init = function () {
	rd.border_disabled = 'solid';	// border style for disabled element will not be changed
	rd.opacity_disabled = 70;		// disabled elements will have opacity effect
	rd.animation_pause = 40;		// set animation loop pause
	// initialize dragging containers (each table is placed in separate container)
	rd.init('drag1');
	rd.init('drag2');
	// elements can be dropped only to the empty table cells
	rd.drop_option = 'single';
	// set hover color for TD and TR
	rd.hover.color_td = '#FFCFAE';
	rd.hover.color_tr = '#9BB3DA';
	// save locations of all DIV elements to the "loc" object (it should go after initialization)
	start_positions();
	// row was moved - event handler
	rd.myhandler_row_moved = function () {
		// set opacity for moved row (rd.obj is reference of cloned row - mini table)
		rd.row_opacity(rd.obj, 85);
		// set opacity for source row and change source row background color (obj.obj_old is reference of source row)
		rd.row_opacity(rd.obj_old, 20, 'white');
	};
	// row was dropped - move row in opposite table
	rd.myhandler_row_dropped = function () {
		// id of element from opposite table (rd.obj_old is source row, redips.div is reference to the <div class="drag row">)
		var	id_new = get_id(rd.obj_old.redips.div),
			// returned value from move_object method
			row = [];
		// disable elements in both containers ("enable_elements" is local function)
		enable_elements(false);
		// move row in other table (method returns reference to the mini table and source row)
		// after animation is finished, callback function "enable_elements" will enable elements in both containers
		row = rd.move_object({
			id: id_new,
			callback: function () {
				enable_elements(true);
			}
		});
		// set opacity for moved row (row[0] is reference of cloned row - mini table)
		rd.row_opacity(row[0], 85);
		// set opacity for source row and change source row background color (row[1] is reference of source row)
		rd.row_opacity(row[1], 20, 'White');
	};
	// row was dropped to the source row (mini table - cloned row, will be removed and source row will return to original state)
	rd.myhandler_row_dropped_source = function () {
		// make source row completely visible (no opacity)
		rd.row_opacity(rd.obj_old, 100);
		// enable both containers
		enable_elements(true);
	};
	// element was dropped - move element in opposite table
	rd.myhandler_dropped = function () {
		var	obj = rd.obj,			// reference to the current element
			id_new = get_id(obj);	// id of element from opposite table
		// disable current element
		rd.enable_drag(false, obj);
		// disable row handlers - blue circles ("enable_rows" is a local function)
		enable_rows(false);
		// element from opposite table with id_new will be moved to the dropped table cell
		// tableIndex for both tables is 0 because each table is closed in separate dragging container
		// after animation is finished, callback function will enable previously disabled element and row handlers (blue circles)
		rd.move_object({
			id: id_new,
			callback: function () {
				rd.enable_drag(true, obj);
				enable_rows(true);
			}
		});
	};
};


/**
 * Function scans all DIV elements and save their positions to the pos object.
 */
start_positions = function () {
	var divs = [], id, i, j, position;
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
				position = rd.get_position(divs[i][j]);
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
reset = function () {
	var id,
		pos1;
	// loop goes through every "id" in loc object
	for (id in loc) {
		// test the property (filter properties of the prototype) and if element id begins with "d"
		// other DIV elements are row handlers
		if (loc.hasOwnProperty(id) && id.substring(0, 1) === 'd') {
			// get current position of element
			pos1 = rd.get_position(id);
			// if current position is different then initial position the return element to the initial position
			if (loc[id].toString() !== pos1.toString()) {
				// disable row handlers - blue circles
				enable_rows(false);
				// move object to the initial position
				rd.move_object({
					id: id,					// id of object to move
					target: loc[id],		// target position
					callback: enable_rows	// callback function after moving is finished
				});
			}
		}
	}
};


/**
 * Function shuffles elements on both tables. Random positions are unique and different then current element positions.
 */
shuffle = function () {
	var id,			// element id
		rowIndex,	// row index (random number from 1 to 7)
		cellIndex,	// cell index (random number from 1 to 5)
		rnd,		// random position
		pos,		// current position as array (returned from get_position method)
		pos1,		// current position in format rowIndex + '_' + cellIndex
		arr = [];	// generated positions will be saved in array (to avoid duplicates)
	// loop goes through every "id" in loc object
	for (id in loc) {
		// test the property (filter properties of the prototype) and
		// if element id begins with "d" (other DIV elements are row handlers) and
		// if id of element ends with "1" (only elements from first table) 
		if (loc.hasOwnProperty(id) && id.substring(0, 1) === 'd' && id.charAt(id.length - 1) === '1') {
			pos = rd.get_position(id);		// set current position for DIV element with defined id
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
			enable_rows(false);
			// move object to the random position in table1
			rd.move_object({
				id: id,								// id of object to move
				target: [0, rowIndex, cellIndex],	// target position (table index is 0 because of separate drag container)
				callback: enable_rows				// callback function after moving is finished
			});
			// disable row handlers - blue circles in first column
			enable_rows(false);
			// move object to the random position in table2
			rd.move_object({
				id: id.slice(0, -1) + '2',			// id of object from table2
				target: [0, rowIndex, cellIndex],	// target position (table index is 0 because of separate drag container)
				callback: enable_rows				// callback function after moving is finished
			});
		}
	}
};


/**
 * Function returns "id" of element in opposite table.
 * e.g. d2_1 -> d2_2 or d4_2 -> d4_1
 * @param {HTMLElement} DIV element (in row dragging context "el" is rowhandler of source row) 
 * @return {String} Id of element in opposite table. 
 */
get_id = function (el) {
	var	ri = {1: 2, 2: 1},						// needed for reverse 1 -> 2 or 2 -> 1
		id = el.id,								// define DIV id or mini table
		lc = id.charAt(id.length - 1),			// last character of id that should be reversed (1 -> 2 or 2 -> 1)
		id_new = id.slice(0, -1) + ri[lc];		// id of element from opposite table
	// return new id
	return id_new;
};


/**
 * Function enables/disables buttons and all elements on page. In case when user drops row, elements (and rows) are disabled until animation finishes.
 * @param {Boolean} Flag enable or disable elements in both dragging containers.
 */
enable_elements = function (flag) {
	rd.enable_drag(flag, 'drag1', 'subtree');
	rd.enable_drag(flag, 'drag2', 'subtree');
	// enable/disable buttons "Reset" and "Shuffle"
	enable_buttons(flag);
};


/**
 * Function enables/disables rows and buttons on page. In case when user drops element, row handlers are disabled until all animations are finished.
 * "lock" variable is used for animation synchronization.
 * @param {Boolean} Flag enable or disable rows in both dragging containers.
 */
enable_rows = function (flag) {
	var id;
	// if input parameter is not boolean type, then enable_rows is called from callback function
	// callback function sends reference of moved element
	if (typeof(flag) !== 'boolean') {
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
		enable_buttons(flag);
		// loop goes through every "id" in loc object
		for (id in loc) {
			// test the property (filter properties of the prototype) and if element id begins with "r"
			// other DIV elements are DIV elements
			if (loc.hasOwnProperty(id) && id.substring(0, 1) === 'r') {
				rd.enable_drag(flag, id);
			}
		}
	}
	// after element is dropped, it will be disabled first (so this code is executed first in enable_rows() function)
	if (!flag) {
		lock++;
	}
};


/**
 * Function enables/disables buttons (it's called from enable_elements() and enable_rows() functions)
 * @param {Boolean} Flag enable or disable buttons.
 */
enable_buttons = function (flag) {
	var buttons, i;
	// collect buttons from buttons area
	buttons = document.getElementById('buttons').getElementsByTagName('input');
	// open loop
	for (i = 0; i < buttons.length; i++) {
		buttons[i].disabled = !flag;
	}
};


// indexOf method - needed for IE browsers ?!
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (el) {
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
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}