/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

window.onload = function () {
	var rd = REDIPS.drag,	// reference to the REDIPS.drag class
		div_drag = document.getElementById('drag'); // reference to the drag region
	// DIV container initialization
	rd.init();
	// this function (event handler) is called after element is dropped
	rd.myhandler_dropped = function () {
		var div1,		// DIV elements inside DIV id="drag" (collection)
			div2 = [],	// references of DIV elements prepared from collection
			cb, i, j,	// checkbox and loop variables
			id;			// element Id
		// collect DIV elements from drag region
		div1 = div_drag.getElementsByTagName('div');
		// loop through collected DIV elements
		for (i = 0, j = 0; i < div1.length; i++) {
			// locate checkbox inside DIV element
			cb = div1[i].getElementsByTagName('input');
			// if checkbox inside DIV element is checked
			if (cb.length > 0 && cb[0].checked === true) {
				// uncheck checkbox
				cb[0].checked = false;
				// save reference of DIV element to the div2 array
				div2[j] = div1[i];
				// increment counter j
				j++;
			}
			
		}
		// loop through div2 array and move elements to the target table cell
		for (i = 0; i < div2.length; i++) {
			// define id of element to move
			id = div2[i].id;
			// element will be moved to the dropped table cell
			rd.move_object({id: id});
			// try to comment upper line and uncomment this line (elements will be relocated without animation)
			//rd.target_cell.appendChild(div2[i]);
		}
	};
};