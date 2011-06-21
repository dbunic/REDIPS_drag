/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


	// properties
var	rd = REDIPS.drag,	// reference to the REDIPS.drag library
	loc = {},			// initial locations of DIV elements
	// methods
	start_positions,	// remembera start positions of DIV elements
	reset,				// returns elements to their initial positions
	shuffle,			// shuffles (randomizes the order of the elements on table)
	enable,				// enables/disables all elements on page
	get_id;				// returns id of element in opposite table


// initialization -  after page is fully loaded
window.onload = function () {
	// (string) border style for disabled element
	rd.border_disabled = 'solid';
	rd.opacity_disabled = 70;
	// initialize dragging containers (each table is placed in separate container)
	rd.init('drag1');
	rd.init('drag2');
	// save locations of all DIV elements to the "loc" object (it should go after initialization)
	start_positions();
	// row was clicked - set hover color for "row" mode
	rd.myhandler_row_clicked = function () {
		rd.hover_color = '#9BB3DA';
	};
	// element was clicked - set hover color for "cell" mode
	rd.myhandler_clicked = function () {
		rd.hover_color = '#FFCFAE';
	};
	// row was moved - event handler
	rd.myhandler_row_moved = function () {
		// set opacity for moved row (rd.obj is reference of cloned row - mini table)
		rd.row_opacity(rd.obj, 85);
		// set opacity for source row and change source row background color (obj.obj_old is reference of source row)
		rd.row_opacity(rd.obj_old, 20, 'white');
		// disable elements in current container
		//rd.enable_drag(false);
	};
	// row was dropped - move row in other table
	rd.myhandler_row_dropped = function () {
		var	id_new = get_id(rd.obj),	// id of element from opposite table
			row = [];					// returned value from move_object method
		// disable elements in both container (enable is local function)
		enable(false);
		// move row in other table (method returns reference to the mini table and source row)
		// after animation is finished, enable elements in both containers
		row = rd.move_object({
			id: id_new,
			callback: function () {
				enable(true);
			}
		});
		// set opacity for moved row (row[0] is reference of cloned row - mini table)
		rd.row_opacity(row[0], 85);
		// set opacity for source row and change source row background color (row[1] is reference of source row)
		rd.row_opacity(row[1], 20, 'White');
	};
	// row was dropped to the source (mini table (cloned row) will be removed and source row should return to original state)
	rd.myhandler_row_dropped_source = function () {
		// make source row completely visible (no opacity)
		rd.row_opacity(rd.obj_old, 100);
		// enable both containers (this is local function)
		enable(true);
	};
	// element was dropped - move element in other table
	rd.myhandler_dropped = function () {
		var	obj = rd.obj,			// reference to the current element
			id_new = get_id(obj);	// id of element from opposite table
		// disable current element
		rd.enable_drag(false, obj);
		// element with id_new will be moved to the dropped table cell
		// because each table is closed within its own dragging container (tableIndex for both tables is 0)
		rd.move_object({
			id: id_new,
			callback: function () {
				rd.enable_drag(true, obj);
			}
		});
	};
};



// function scans all DIV elements and save their positions to the pos object
start_positions = function () {
	var divs = [], id, i, j, position;
	// collect DIV elements for both dragging area
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



// method returns element to initial positions
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
				rd.move_object({
					id: id,
					target: loc[id]
				});
			}
		}
	}
};



// method shuffles elements on table
shuffle = function () {
	var id,			// element id
		rowIndex,	// row index (random number from 1 to 7)
		cellIndex;	// cell index (random number from 1 to 5)
	// loop goes through every "id" in loc object
	for (id in loc) {
		// test the property (filter properties of the prototype) and if element id begins with "d"
		// other DIV elements are row handlers
		if (loc.hasOwnProperty(id) && id.substring(0, 1) === 'd') {
			// generate random row and cell indexs
			rowIndex = Math.floor(Math.random() * 7) + 1;
			cellIndex = Math.floor(Math.random() * 5) + 1;
			// move object to the random position
			rd.move_object({
				id: id,
				target: [0, rowIndex, cellIndex]
			});
		}
	}
};



/**
 * Function will return id of element in opposite table.
 * e.g. d2_1 -> d2_2 or d4_2 -> d4_1
 * @param {HTMLElement} DIV element.
 * @return {String} Id of element in opposite table. 
 */
get_id = function (obj) {
	var	ri = {1: 2, 2: 1},						// needed for reverse 1 -> 2 or 2 -> 1
		lc = obj.id.charAt(obj.id.length - 1),	// last character of id that should be reversed (1 -> 2 or 2 -> 1)
		id_new = obj.id.slice(0, -1) + ri[lc];	// id of element from opposite table
	// return new id
	return id_new;
};



/**
 * Function enables all elements on page after row in other table is dropped (this is callback function).
 * @param {Boolean} Flag enable or disable elements in both dragging containers.
 */
enable = function (flag) {
	// enable elements
	rd.enable_drag(flag, 'drag1', 'container');
	rd.enable_drag(flag, 'drag2', 'container');
};