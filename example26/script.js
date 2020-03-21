/* eslint-env browser, jquery */
/* eslint
   semi: ["error", "always"],
   indent: [2, "tab"],
   no-tabs: 0,
   no-multiple-empty-lines: ["error", {"max": 2, "maxEOF": 1}],
   one-var: ["error", "always"] */
/* global REDIPS */

/* enable strict mode */
'use strict';


// global variables
let redips = {},		// redips container
	rd = REDIPS.drag,	// reference to the REDIPS.drag library
	counter = 0,		// counter for cloned DIV elements
	clonedDIV = false,	// cloned flag set in event.moved
	lastCell;			// reference to the last cell in table


// redips initialization
redips.init = function () {
	// set reference to the last cell in table
	lastCell = document.getElementById('lastCell');
	// initialization
	rd.init();
	// shift DIV elements with animation
	rd.shift.animation = true;
	// disabled elements will have opacity effect
	rd.style.opacityDisabled = 50;
	// set hover color
	rd.hover.colorTd = '#9BB3DA';
	// event handler invoked before DIV element is dropped to the cell
	rd.event.droppedBefore = function (targetCell) {
		// test if target cell is occupied and set reference to the dragged DIV element
		let empty = rd.emptyCell(targetCell, 'test');
		// if target cell is not empty
		if (!empty) {
			// open dialog should be wrapped in setTimeout because of
			// removeChild and return false below
			setTimeout(function () {
				$('#dialog').dialog('open');
			}, 50);
			// remove dragged DIV from from DOM (node still exists in memory)
			rd.obj.parentNode.removeChild(rd.obj);
			// this will disable DIV elements in target cell (DIV element will be somehow marked)
			rd.enableDrag(false, targetCell);
			// return false (deleted DIV will not be returned to source cell)
			return false;
		}
	};
	// add counter to cloned element name
	// (after cloned DIV element is dropped to the table)
	rd.event.cloned = function () {
		// increase counter
		counter++;
		// append to the DIV element name
		rd.obj.innerHTML += counter;
	};
	// in the moment when DIV element is moved, clonedDIV will be set
	rd.event.moved = function (cloned) {
		clonedDIV = cloned;
	};
	// define jQuery dialog
	$('#dialog').dialog({
		autoOpen: false,
		resizable: false,
		modal: true,
		width: 400,
		height: 170,
		// define Shift, Switch and Overwrite buttons
		buttons: {
			'Shift': function () {
				// enable elements in target cell (return solid border)
				rd.enableDrag(true, rd.td.target);
				// DIV element is cloned then shift cells to the last TD
				if (clonedDIV) {
					rd.shiftCells(lastCell, rd.td.target);
				}
				// if DIV element is dragged within table then shift cells
				// from source to target TD position
				else {
					rd.shiftCells(rd.td.source, rd.td.target);
				}
				// append previously removed DIV to the target cell
				rd.td.target.appendChild(rd.obj);
				// close dialog
				$(this).dialog('close');
			},
			'Switch': function () {
				// enable elements in target cell (return solid border) in both cases
				rd.enableDrag(true, rd.td.target);
				// switch elements only if current DIV element is not cloned
				if (!clonedDIV) {
					// relocate target and source cells
					rd.relocate(rd.td.target, rd.td.source);
					// append previously removed DIV to the target cell
					rd.td.target.appendChild(rd.obj);
				}
				// close dialog
				$(this).dialog('close');
			},
			'Overwrite': function () {
				// empty target cell
				rd.emptyCell(rd.td.target);
				// append previously removed DIV to the target cell
				rd.td.target.appendChild(rd.obj);
				// close dialog
				$(this).dialog('close');
			}
		},
		// action when dialog is closed
		close: function (event, ui) {
			// return dragged DIV element to the source cell only if X button is clicked
			// (in this case event.which property exists)
			if (event.which) {
				// enable elements in target cell (return solid border)
				rd.enableDrag(true, rd.td.target);
				// if and DIV element is not cloned then return in to source cell
				if (!clonedDIV) {
					// append previously removed DIV to the target cell
					rd.td.source.appendChild(rd.obj);
				}
			}
		}
	});
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
