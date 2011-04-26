/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

//onload event
window.onload = function () {
	// initialization
	REDIPS.drag.init();
	// dragged elements can be placed to the empty cells only
	REDIPS.drag.drop_option = 'single';
	// elements could be cloned with pressed SHIFT key
	REDIPS.drag.clone_shiftKey = true;
	// define dropped handler
	REDIPS.drag.myhandler_dropped = function () {
		// definition of local variables
		var tbl = REDIPS.drag.target_cell,	// target cell (where element is dropped)
			id,								// id of scrollable container
			msg;							// message
		// loop up until table found
		while (tbl && tbl.nodeName !== 'TABLE') {
			tbl = tbl.parentNode;
		}
		// test if table belongs to scrollable container
		if (tbl.sca !== undefined) {
			// every table has defined scrollable container (if table belongs to scrollable container)
			// scrollable container has reference to the DIV container and DIV container has Id :)
			id = tbl.sca.div.id;
			// prepare message according to container Id
			// here can be called handler_dropped for scrollable containers
			switch (id) {
			case 'left':
				msg = 'Left container';
				break;
			case 'right':
				msg = 'Right container';
				break;
			default:
				msg = 'Container without Id';
			}
		}
		// table does not belong to any container
		else {
			msg = 'Table does not belong to any container!';
		}
		// display message
		document.getElementById('message').innerHTML = msg;
	};
};