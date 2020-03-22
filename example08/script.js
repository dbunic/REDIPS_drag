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
	let rd = REDIPS.drag;	// reference to the REDIPS.drag class
	// DIV container initialization
	rd.init('drag1');
	rd.init('drag2');
	// elements could be cloned with pressed SHIFT key (for demo)
	rd.clone_shiftKey = true;
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
