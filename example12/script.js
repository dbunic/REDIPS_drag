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
	let rd = REDIPS.drag,	// reference to the REDIPS.drag class
		divDrag = document.getElementById('redips-drag'); // reference to the drag region
	// DIV container initialization
	rd.init();
	// this function (event handler) is called after element is dropped
	rd.event.dropped = function () {
		let div1,		// DIV elements inside DIV id="drag" (collection)
			div2 = [],	// references of DIV elements prepared from collection
			cb, i, j;	// element Id
		// collect DIV elements from drag region
		div1 = divDrag.getElementsByTagName('div');
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
			// element will be moved to the dropped table cell
			rd.moveObject({obj: div2[i]});
			// try to comment upper line and uncomment this line (elements will be relocated without animation)
			// rd.td.target.appendChild(div2[i]);
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
