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


let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], // board array
	xo = {x: 1, o: -1},	// define values for X and O elements
	redipsInit,		// define redipsInit variable
	rd,				// reference to the REDIPS.drag library
	divO,			// reference to the O DIV element
	// methods
	toggleXO,		// toggle X and O clone elements on the left
	checkBoard,		// method checks board
	checkLine;		// method checks line (row, column or diagonal) for value 3 or -3


// redips initialization
redipsInit = function () {
	// set reference to the REDIPS.drag library
	rd = REDIPS.drag;
	// initialization
	rd.init();
	// define border for disabled element (default is dotted)
	rd.style.borderDisabled = 'none';
	// dragged elements can be placed to the empty cells only
	rd.dropMode = 'single';
	// set reference to the O div element (needed in toggleXO() method)
	divO = document.getElementById('o');
	// toggle X and O elements on the left side
	toggleXO();
	// declare tasks after element is dropped
	rd.event.dropped = function () {
		let obj = rd.obj,		// current element (cloned element)
			objOld = rd.objOld,	// previous element (this is clone element)
			tac = rd.td.target;	// target cell
		// disable dropped DIV element
		rd.enableDrag(false, obj);
		// toggle X and O elements on the left
		toggleXO();
		// check board (objOld.id can be 'x' or 'o')
		checkBoard(objOld.id, tac.parentNode.rowIndex, tac.cellIndex);
	};
};


// toggle X and O clone elements on the left
toggleXO = function () {
	// references to the X and O elements
	if (divO.redips.enabled) {
		rd.enableDrag(false, '#o');
		rd.enableDrag(true, '#x');
	}
	else {
		rd.enableDrag(true, '#o');
		rd.enableDrag(false, '#x');
	}
};


// method checks board (KISS - keep it simple and stupid;)
checkBoard = function (id, rowIdx, cellIdx) {
	// set value for current cell (1 or -1)
	board[rowIdx][cellIdx] = xo[id];
	// test rows
	checkLine(board[0][0] + board[0][1] + board[0][2]);
	checkLine(board[1][0] + board[1][1] + board[1][2]);
	checkLine(board[2][0] + board[2][1] + board[2][2]);
	// test columns
	checkLine(board[0][0] + board[1][0] + board[2][0]);
	checkLine(board[0][1] + board[1][1] + board[2][1]);
	checkLine(board[0][2] + board[1][2] + board[2][2]);
	// test diagonals
	checkLine(board[0][0] + board[1][1] + board[2][2]);
	checkLine(board[0][2] + board[1][1] + board[2][0]);
};


// method checks line (row, column or diagonal) for value 3 or -3
checkLine = function (value) {
	if (value === 3) {
		document.getElementById('message').innerHTML = 'X is the Winner!';
		rd.enableDrag(false); // disable all drag elements
	}
	else if (value === -3) {
		document.getElementById('message').innerHTML = 'O is the Winner!';
		rd.enableDrag(false); // disable all drag elements
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}
