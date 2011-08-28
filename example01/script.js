/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";

// define redips_init variable
var redips_init;

// redips initialization
redips_init = function () {
	// reference to the REDIPS.drag library and message line
	var	rd = REDIPS.drag,
		msg = document.getElementById('message');
	// how to display disabled elements
	rd.border_disabled = 'solid';	// border style for disabled element will not be changed (default is dotted)
	rd.opacity_disabled = 60;		// disabled elements will have opacity effect
	// initialization
	rd.init();
	// only "smile" can be placed to the marked cell
	rd.mark.exception.d8 = 'smile';
	// prepare handlers
	rd.myhandler_clicked = function () {
		msg.innerHTML = 'Clicked';
	};
	rd.myhandler_dblclicked = function () {
		msg.innerHTML = 'Dblclicked';
	};
	rd.myhandler_moved  = function () {
		msg.innerHTML = 'Moved';
	};
	rd.myhandler_notmoved = function () {
		msg.innerHTML = 'Not moved';
	};
	rd.myhandler_dropped = function () {
		msg.innerHTML = 'Dropped';
	};
	rd.myhandler_switched = function () {
		msg.innerHTML = 'Switched';
	};
	rd.myhandler_clonedend1 = function () {
		msg.innerHTML = 'Cloned end1';
	};
	rd.myhandler_clonedend2 = function () {
		msg.innerHTML = 'Cloned end2';
	};
	rd.myhandler_notcloned = function () {
		msg.innerHTML = 'Not cloned';
	};
	rd.myhandler_deleted = function () {
		msg.innerHTML = 'Deleted';
	};
	rd.myhandler_undeleted = function () {
		msg.innerHTML = 'Undeleted';
	};
	rd.myhandler_cloned = function () {
		// display message
		msg.innerHTML = 'Cloned';
		// append 'd' to the element text (Clone -> Cloned)
		rd.obj.innerHTML += 'd';
	};
	rd.myhandler_changed = function () {
		// get target and source position (method returns positions as array)
		var pos = rd.get_position();
		// display current row and current cell
		msg.innerHTML = 'Changed: ' + pos[1] + ' ' + pos[2];
	};
};

// toggles trash_ask parameter defined at the top
function toggle_confirm(chk) {
	REDIPS.drag.trash_ask = chk.checked;
}

// toggles delete_cloned parameter defined at the top
function toggle_delete_cloned(chk) {
	REDIPS.drag.delete_cloned = chk.checked;
}

// enables / disables dragging
function toggle_dragging(chk) {
	REDIPS.drag.enable_drag(chk.checked);
}

// function sets drop_option parameter defined at the top
function set_drop_option(radio_button) {
	REDIPS.drag.drop_option = radio_button.value;
}

// show prepared content for saving
function save() {
	// scan first table
	var content = REDIPS.drag.save_content(0);
	// if content doesn't exist
	if (content === '') {
		alert('Table is empty!');
	}
	// display query string
	else {
		//window.open('/my/multiple-parameters.php?' + content, 'Mypop', 'width=350,height=160,scrollbars=yes');
		window.open('multiple-parameters.php?' + content, 'Mypop', 'width=350,height=260,scrollbars=yes');
	}
}

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}