/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


var redips_init,	// define redips_init variable
	save,			// save elements and their positions
	report,			// function shows subject occurring in timetable
	report_button,	// show/hide report buttons
	show_all,		// function show all subjects in timetable
	print_message,	// print message
	div_nl;			// node list of DIV elements in table2 (global variable needed in report() and visibility() function)


// redips initialization
redips_init = function () {
	var	rd = REDIPS.drag;			// reference to the REDIPS.drag object
	// initialization
	rd.init();
	rd.drop_option = 'single';	// dragged elements can be placed to the empty cells only
	rd.hover_color = '#9BB3DA';	// set hover color
	rd.trash_ask = false;		// do not ask on delete
	rd.clone_shiftKey = true;	// elements could be cloned with pressed SHIFT key
	// prepare node list of DIV elements in table2
	div_nl = document.getElementById('table2').getElementsByTagName('div');
	// show / hide report buttons (needed for dynamic version - with index.php)
	report_button();
	// after element is dropped, print message
	rd.myhandler_dropped = function () {
		var	obj_old = rd.obj_old,					// original object
			target_cell = rd.target_cell,			// Target cell
			target_row = rd.target_cell.parentNode,	// Target row
			marked_cell = rd.marked_cell,			// marked cells
			mark_cname = rd.mark_cname,				// name of marked cells
			i, obj_new, mark_found;					// local variables
		// if checkbox is checked and original element is clone type then clone school subject to the week
		if (document.getElementById('week').checked === true && obj_old.className.indexOf('clone') > -1) {
			// loop through table cells
			for (i = 0; i < target_row.cells.length; i++) {
				// skip if table cell is not empty (true for cell where element is currently dropped)
				if (target_row.cells[i].childNodes.length > 0) {
					continue;
				}
				// search for "mark" class name
				mark_found = target_row.cells[i].className.indexOf(mark_cname) > -1 ? true : false;
				// if current cell is marked and access type is 'deny' or current cell is not marked and access type is "allow"
				// then skip this table cell
				if ((mark_found === true && marked_cell === 'deny') || (mark_found === false && marked_cell === 'allow')) {
					continue;
				}
				// clone DIV element
				obj_new = rd.clone_div(obj_old);
				// append to the table cell
				target_row.cells[i].appendChild(obj_new);
			}
		}
		// print message only if target and source table cell differ
		if (rd.target_cell !== rd.source_cell) { 
			print_message('Content has been changed!');
		}
		// show / hide report buttons
		report_button();
	};

	// after element is deleted from the timetable, print message
	rd.myhandler_deleted = function () {
		print_message('Content has been deleted!');
		// show / hide report buttons
		report_button();
	};
	
	// if any element is clicked, then make all subjects in timetable visible
	rd.myhandler_clicked = function () {
		show_all();
	};
};


// save elements and their positions
save = function () {
	// scan second table (timetable)
	var content = REDIPS.drag.save_content(1);
	// and save content
	window.location.href = 'db_save.php?' + content;
};


// function shows subject occurring in timetable
report = function (subject) {
		// define day and time labels
	var day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
		time = ['08:00', '09:00', '10:00', '11:00', '12:00',
		        '13:00', '14:00', '15:00', '16:00'],
		div = [],	// define array
		cellIndex,	// cell index
		rowIndex,	// row index
		id,			// element id
		i,			// loop variable
		num = 0,	// number of found subject
		str = '';	// result string
	// show all elements
	show_all();
	// create array from node list (node list is global variable)
	for (i = 0; i < div_nl.length; i++) {
		div[i] = div_nl[i];
	}
	// sort div elements by the cellIndex (days in week) and rowIndex (hours)
	div.sort(function (a, b) {
		var a_ci = a.parentNode.cellIndex,				// a element cell index
			a_ri = a.parentNode.parentNode.rowIndex,	// a element row index
			b_ci = b.parentNode.cellIndex,				// b element cell index
			b_ri = b.parentNode.parentNode.rowIndex;	// b element row index
		return a_ci * 100 + a_ri - (b_ci * 100 + b_ri);
	});
	// loop goes through all collected elements
	for (i = 0; i < div.length; i++) {
		// define only first two letters of ID
		// (cloned elements have appended c1, c2, c3 ...)
		id = div[i].id.substr(0, 2);
		// if id is equal to the passed subject then we have a match
		if (id === subject) { 
			// define cell index
			cellIndex = div[i].parentNode.cellIndex;
			// table row is parent element of table cell 
			rowIndex = div[i].parentNode.parentNode.rowIndex;
			// add line with found element
			str += day[cellIndex - 1] + '\t\t' + time[rowIndex - 1] + '\n';
			// increase counter
			num++;
		}
		// other elements should be hidden
		else {
			div[i].style.visibility = 'hidden';
		}
	}
	// if "Show report" is checked then show message
	if (document.getElementById('report').checked === true) {
		alert('Number of found subjects: ' + num + '\n' + str);
	}
};


// show/hide report buttons
report_button = function () {
	var	id,			// element id
		i,			// loop variable
		count,		// number of subjects in timetable
		style,		// hidden or visible
		// prepare subjects
		subject = {'en': 0, 'ph': 0, 'ma': 0, 'bi': 0, 'ch': 0, 'it': 0, 'ar': 0, 'hi': 0, 'et': 0};
	// loop goes through all collected elements
	for (i = 0; i < div_nl.length; i++) {
		// define only first two letters of ID
		// (cloned elements have appended c1, c2, c3 ...)
		id = div_nl[i].id.substr(0, 2);
		// increase subject occurring
		subject[id]++;
	}
	// loop through subjects
	for (i in subject) {
		// using the hasOwnProperty method to distinguish the true members of the object
		if (subject.hasOwnProperty(i)) {
			// prepare id of the report button
			id = 'b_' + i;
			// subject count on the timetable
			count = subject[i];
			if (count === 0) {
				style = 'hidden';
			}
			else {
				style = 'visible';
			}
			// hide or show report button
			document.getElementById(id).style.visibility = style;
		}
	}
};


// print message
print_message = function (message) {
	document.getElementById('message').innerHTML = message;
};


// function show all subjects in timetable
show_all = function () {
	var	i; // loop variable
	for (i = 0; i < div_nl.length; i++) {
		div_nl[i].style.visibility = 'visible';
	}
};

// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips_init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips_init);
}