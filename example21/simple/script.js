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


// redips initialization
redips.init = function () {
	// set reference to the REDIPS.drag lib and table row
	let rd = REDIPS.drag,
		tr = document.getElementById('myRow');
	// initialization
	rd.init();
	// dragged elements can be placed to the empty cells only
	rd.dropMode = 'single';
	// event handler executed after DIV element is dropped
	rd.event.dropped = function () {
		// get target and source position of dropped DIV element
		// pos[0] - target table index
		// pos[3] - source table index
		let pos = rd.getPosition(),
			td1, td2,	// source and target cell
			ec,			// empty cell
			i;			// local variables
		// if DIV element is dropped from table 0 to table 1
		if (pos[3] === 0 && pos[0] === 1) {
			// loop through cells in myRow
			for (i = 0, ec = 0; i < tr.cells.length; i++) {
				// define source and target cells
				td1 = tr.cells[i];
				// if cell contains DIV element then shift DIV to the left
				if (td1.childNodes.length > 0) {
					// define target cell and move DIV element
					td2 = tr.cells[i - ec];
					rd.relocate(td1, td2, 'animation');
				}
				// increase number of current empty cells
				else {
					ec++;
				}
			}
		}
	};
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
