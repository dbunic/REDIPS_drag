/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */

/* enable strict mode */
"use strict";


// create redips container
var redips = {};


// redips initialization
redips.init = function () {
	// reference to the REDIPS.drag object
	var	rd = REDIPS.drag;
	// initialization
	rd.init();
	// REDIPS.drag settings
	rd.dropMode = 'single';			// dragged elements can be placed only to the empty cells
	rd.hover.colorTd = '#9BB3DA';	// set hover color
	rd.clone.keyDiv = true;			// enable cloning DIV elements with pressed SHIFT key
	// prepare node list of DIV elements in table2
	redips.divNodeList = document.getElementById('table2').getElementsByTagName('div');
	// show / hide report buttons (needed for dynamic version - with index.php)
	redips.reportButton();
	// element is dropped
	rd.event.dropped = function () {
		var	objOld = rd.objOld,					// original object
			targetCell = rd.td.target,			// target cell
			targetRow = targetCell.parentNode,	// target row
			i, objNew;							// local variables
		// if checkbox is checked and original element is of clone type then clone spread subjects to the week
		if (document.getElementById('week').checked === true && objOld.className.indexOf('redips-clone') > -1) {
			// loop through table cells
			for (i = 0; i < targetRow.cells.length; i++) {
				// skip cell if cell has some content (first column is not empty because it contains label)
				if (targetRow.cells[i].childNodes.length > 0) {
					continue;
				}
				// clone DIV element
				objNew = rd.cloneObject(objOld);
				// append to the table cell
				targetRow.cells[i].appendChild(objNew);
			}
		}
		// print message only if target and source table cell differ
		if (rd.td.target !== rd.td.source) { 
			redips.printMessage('Content has been changed!');
		}
		// show / hide report buttons
		redips.reportButton();
	};

	// after element is deleted from the timetable, print message
	rd.event.deleted = function () {
		redips.printMessage('Content has been deleted!');
		// show / hide report buttons
		redips.reportButton();
	};
	
	// if any element is clicked, then make all subjects in timetable visible
	rd.event.clicked = function () {
		redips.showAll();
	};
};


// save elements and their positions
redips.save = function () {
	// scan timetable content
	var content = REDIPS.drag.saveContent('table2');
	// and save content
	window.location.href = 'db_save.php?' + content;
};


// method shows subject occurring in timetable
redips.report = function (subject) {
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
	redips.showAll();
	// create array from node list (node list is global variable)
	for (i = 0; i < redips.divNodeList.length; i++) {
		div[i] = redips.divNodeList[i];
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
		// alert is placed inside setTimeout because alert() is synchronous functions causing a pause in the code and this pause should be bypassed
		setTimeout(function () {
			alert('Number of found subjects: ' + num + '\n' + str);
		}, 200);
	}
};


// show/hide report buttons
redips.reportButton = function () {
	var	id,			// element id
		i,			// loop variable
		count,		// number of subjects in timetable
		style,		// hidden or visible
		// prepare subjects
		subject = {'en': 0, 'ph': 0, 'ma': 0, 'bi': 0, 'ch': 0, 'it': 0, 'ar': 0, 'hi': 0, 'et': 0};
	// loop goes through all collected elements
	for (i = 0; i < redips.divNodeList.length; i++) {
		// define only first two letters of ID
		// (cloned elements have appended c1, c2, c3 ...)
		id = redips.divNodeList[i].id.substr(0, 2);
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
redips.printMessage = function (message) {
	document.getElementById('message').innerHTML = message;
};


// function show all subjects in timetable
redips.showAll = function () {
	var	i; // loop variable
	for (i = 0; i < redips.divNodeList.length; i++) {
		redips.divNodeList[i].style.visibility = 'visible';
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}