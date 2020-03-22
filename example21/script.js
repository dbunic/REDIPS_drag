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
let redips = {},
	counter = 0;

// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag library
	let rd = REDIPS.drag;
	// initialization
	rd.init();
	// set mode option to "shift"
	rd.dropMode = 'shift';
	// set animation loop pause
	rd.animation.pause = 20;
	// enable shift.animation
	rd.shift.animation = true;
	// set TD for overflow elements (initially)
	rd.shift.overflow = document.getElementById('overflow');
	// add counter to cloned element name
	// (after cloned DIV element is dropped to the table)
	rd.event.clonedDropped = function () {
		// increase counter
		counter++;
		// append to the DIV element name
		rd.obj.innerHTML += counter;
	};
};


// set current table
redips.setTable = function (e) {
	let value = e.options[e.selectedIndex].value,
		tables = document.getElementById('redips-drag').getElementsByTagName('table'),
		i;
	// loop goes through all fetched tables within drag container
	for (i = 0; i < tables.length; i++) {
		// skip mini table
		if (tables[i].id === 'mini') {
			continue;
		}
		// show selected table
		else if (tables[i].id === value) {
			tables[i].style.display = '';
		}
		// hide all other tables
		else {
			tables[i].style.display = 'none';
		}
	}
};


// set shift mode
redips.shiftMode = function (radio) {
	REDIPS.drag.shift.mode = radio.value;
};


// set overflow
redips.overflow = function (radio) {
	if (radio.value === 'user') {
		REDIPS.drag.shift.overflow = document.getElementById('overflow');
	}
	else {
		REDIPS.drag.shift.overflow = radio.value;
	}
};


// enable / disable animation
redips.shiftAnimation = function (chk) {
	REDIPS.drag.shift.animation = chk.checked;
};


// enable / disable shift after element is deleted
redips.shiftAfter = function (chk) {
	REDIPS.drag.shift.after = chk.value;
};


// toggles trash_ask parameter defined at the top
redips.toggleConfirm = function (chk) {
	if (chk.checked === true) {
		REDIPS.drag.trash.question = 'Are you sure you want to delete DIV element?';
	}
	else {
		REDIPS.drag.trash.question = null;
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
