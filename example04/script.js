/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], // board array
	xo = {x: 1, o: -1},	// define values for X and O elements
	// methods
	toggle_xo,			// toggle X and O clone elements on the left
	check_board,		// method checks board
	check_line;			// method checks line (row, column or diagonal) for value 3 or -3


// onload event
window.onload = function () {
	// initialization
	REDIPS.drag.init();
	// define border for disabled element (default is dotted)
	REDIPS.drag.border_disabled = 'none';
	// dragged elements can be placed to the empty cells only
	REDIPS.drag.drop_option = 'single';
	// toggle X and O elements on the left side
	toggle_xo();
	// declare tasks after element is dropped
	REDIPS.drag.myhandler_dropped = function () {
		var obj = REDIPS.drag.obj, // current element (cloned element)
			obj_old = REDIPS.drag.obj_old, // previous element (this is clone element)
			tac = REDIPS.drag.target_cell; // target cell
		// disable dropped DIV element
		REDIPS.drag.enable_drag(false, obj.id);
		// toggle X and O elements on the left
		toggle_xo();
		// check board (obj_old.id can be 'x' or 'o')
		check_board(obj_old.id, tac.parentNode.rowIndex, tac.cellIndex);
	};
};


// toggle X and O clone elements on the left
toggle_xo = function () {
	// references to the X and O elements
	if (document.getElementById('o').redips_enabled) {
		REDIPS.drag.enable_drag(false, 'o');
		REDIPS.drag.enable_drag(true, 'x');
	}
	else {
		REDIPS.drag.enable_drag(true, 'o');
		REDIPS.drag.enable_drag(false, 'x');
	}
};


// method checks board (KISS - keep it simple and stupid;)
check_board = function (id, row_idx, cell_idx) {
	// set value for current cell (1 or -1)
	board[row_idx][cell_idx] = xo[id];
	// test rows
	check_line(board[0][0] + board[0][1] + board[0][2]);
	check_line(board[1][0] + board[1][1] + board[1][2]);
	check_line(board[2][0] + board[2][1] + board[2][2]);
	// test columns
	check_line(board[0][0] + board[1][0] + board[2][0]);
	check_line(board[0][1] + board[1][1] + board[2][1]);
	check_line(board[0][2] + board[1][2] + board[2][2]);
	// test diagonals
	check_line(board[0][0] + board[1][1] + board[2][2]);
	check_line(board[0][2] + board[1][1] + board[2][0]);
};


// method checks line (row, column or diagonal) for value 3 or -3
check_line = function (value) {
	if (value === 3) {
		document.getElementById('message').innerHTML = 'X is the Winner!';
		REDIPS.drag.enable_drag(false); // disable all drag elements
	}
	else if (value === -3) {
		document.getElementById('message').innerHTML = 'O is the Winner!';
		REDIPS.drag.enable_drag(false); // disable all drag elements
	}
};