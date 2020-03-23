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


// configuration
redips.configuration = function () {
	redips.components = 'tblComponents';// left table id (table containing components)
	redips.tableEditor = 'tblEditor';	// right table id (table editor)
	redips.tableEditorDivs = document.getElementById(redips.tableEditor).getElementsByTagName('DIV');	// live collection of DIV elements inside table editor
	redips.ajaxField = 'db_field.php';	// get component details (via AJAX)
	redips.ajaxSave = 'db_save.php';	// save page (via AJAX)
	redips.cDetails = 'cDetails';		// component detail class name (it should be the same as is in CSS file)
	redips.markedColor = '#A9C2EA';		// marked cells background color
	// layout (HTML code) for component placed to the table editor
	redips.component =	'<table class="redips-nolayout cHeader"><tr><td class="hLeft" onclick="redips.details(this)">+</td><td class="hTitle">|</td><td class="hRight" onclick="redips.divDelete(this)">x</td></tr></table>' +
						'<div class="' + redips.cDetails + '">|</div>';
};


// initialization
redips.init = function () {
	// define reference to the REDIPS.drag and REDIPS.table object
	let rt = REDIPS.table,
		rd = REDIPS.drag;
	// configuration
	redips.configuration();
	// attach onmousedown event handler to tblEditor
	rt.onMouseDown(redips.tableEditor, true);
	// selected cell background color
	rt.color.cell = redips.markedColor;
	// disable marking not empty table cells
	rt.markNonEmpty = false;
	// initialize REDIPS.drag library
	rd.init();
	// set drop mode as "single" - DIV element can be dropped only to the empty cells
	rd.dropMode = 'single';
	// event handler invoked on click on DIV element
	rd.event.clicked = function () {
		let div,	// DIV element reference
			i;		// loop variable
		// loop goes through all DIV elements inside table editor
		for (i = 0; i < redips.tableEditorDivs.length; i++) {
			// set reference to the DIV element
			div = redips.tableEditorDivs[i];
			// if DIV element contains class name of component details then hide
			if (div.className.indexOf(redips.cDetails) > -1) {
				redips.details(div, 'hide');
			}
		}
	};
	// event handler invoked before DIV element is dropped to the table cell
	rd.event.droppedBefore = function (targetCell) {
		// set new width to the dropped DIV element
		let width = targetCell.offsetWidth;
		// set width and reset height value
		rd.obj.style.width = (width - 2) + 'px';
		rd.obj.style.height = '';
	};
	// event handler invoked in a moment when DIV element is dropped to the table
	rd.event.dropped = function (targetCell) {
		let st,		// source table
			id;		// DIV id
		// deselect target cell id needed
		rt.mark(false, targetCell);
		// define source table
		st = rd.findParent('TABLE', rd.td.source);
		// if source table is table editor then expand DIV element
		if (redips.components === st.id) {
			// define id of dropped DIV element (only first three characters because cloned element will have addition in id)
			id = rd.obj.id.substring(0, 3);
			// rd.obj.style.borderColor = 'white';
			// send AJAX request (input parameter is field id)
			// div property is reference to the object where AJAX output will be displayed (inside dropped DIV element)
			rd.ajaxCall(redips.ajaxField + '?id=' + id, redips.handler1, {div: rd.obj});
		}
	};
};


// AJAX handler - display response from redips.ajaxField in div.innerHTML
// callback method is called with XHR and obj object (obj is just passed from ajaxCall to this callback function)
// error handling is wrapped inside callback function
redips.handler1 = function (xhr, obj) {
	// prepare title and layout local variables
	let title,
		layout;
	// if status is OK
	if (xhr.status === 200) {
		// prepare title and layout
		title = obj.div.innerHTML;
		layout = redips.component.split('|');
		// set layout and title inside dropped DIV element
		obj.div.innerHTML = layout[0] + title + layout[1] + xhr.responseText + layout[2];
	}
	// otherwise display error inside DIV element
	else {
		obj.div.innerHTML = 'Error: [' + xhr.status + '] ' + xhr.statusText;
	}
};


// delete DIV element from table editor
redips.divDelete = function (el) {
	let div = REDIPS.drag.findParent('DIV', el),	// set reference to the DIV element
		rcell = el.parentNode.cells[1],				// set reference to the right cell of DIV element header
		name = rcell.innerText || rcell.textContent;// set name in a cross-browser manner
	// set name to lower case
	name = name.toLowerCase();
	// confirm deletion
	if (confirm('Delete component (' + name + ')?')) {
		// delete DIV element from table editor
		div.parentNode.removeChild(div);
	}
};


// method shows/hides details of DIV elements sent as input parameter
redips.details = function (el, type) {
	let divDrag = REDIPS.drag.findParent('DIV', el),	// find parent DIV element
		tbl = divDrag.childNodes[0],	// first child node is table
		div = divDrag.childNodes[1],	// second child node is hidden DIV (with containing component details)
		td = tbl.rows[0].cells[0];		// set reference of the first cell in table header
	// show component details
	if (type === undefined || type === 'show') {
		td.innerHTML = '';
		div.style.display = 'block';
		div.style.zIndex = 999;
		// element with position: absolute is taken out of the normal flow of the page and positioned at the desired coordinates relative to its containing block
		// http://www.quirksmode.org/css/position.html
		div.style.position = 'absolute';
		// http://foohack.com/2007/10/top-5-css-mistakes/ (how z-index works)
		// setting z-index and opacity were messing things up (so opacity should be turned off)
		divDrag.style.opacity = 1;
	}
	// hide component details
	else {
		td.innerHTML = '+';
		div.style.display = 'none';
		div.style.zIndex = -1;
		div.style.position = '';
		// return opacity value (if opacity is removed from style.css then this line should be removed as well)
		divDrag.style.opacity = 0.9;
	}
};


// save form
redips.save = function () {
	// declare local variables
	let tblEditor = document.getElementById(redips.tableEditor),
		divs = tblEditor.getElementsByTagName('DIV'),
		frm,			// form reference inside component (it should be only one form)
		JSONobj = [],	// prepare JSON object
		json,			// json converted to the string
		component,		// component object
		div,			// current DIV element
		pos,			// component position
		i;				// loop variable
	// loop goes through each DIV element collected in table editor
	for (i = 0; i < divs.length; i++) {
		// set current DIV element
		div = divs[i];
		// filter only components
		if (div.className.indexOf('redips-drag') > -1) {
			// initialize component object
			component = {};
			// component id (only first three characters because cloned element will have addition in id)
			component.id = div.id.substring(0, 3);
			// component position
			pos = REDIPS.drag.getPosition(div);	// get component position in editor table and remove first item from array (table index is not needed)
			pos.shift();						// remove first item from array (table index is not needed)
			component.position = pos;			// add position to the component
			// set form reference (there shoud be only one form inside DIV component)
			frm = div.getElementsByTagName('FORM')[0];
			// call method to scan component form and return all form elements with their values
			component.form = redips.form2obj(frm);
			// push values for DIV element as Array to the Array
			JSONobj.push(component);
		}
	}
	// prepare query string in JSON format (only if array isn't empty)
	if (JSONobj.length > 0) {
		json = JSON.stringify(JSONobj);
	}
	// make ajax call and set redips.handler2 as callback function
	REDIPS.drag.ajaxCall(redips.ajaxSave, redips.handler2, {method: 'POST', data: 'json=' + json});
};


// AJAX handler - called after save button is clicked
// error handling is wrapped inside callback function
redips.handler2 = function (xhr) {
	// set reference to message element
	let message = document.getElementById('message');
	// if status is OK
	if (xhr.status === 200) {
		message.innerHTML = xhr.responseText;
	}
	// if request status isn't OK
	else {
		message.innerHTML = 'Error: [' + xhr.status + '] ' + xhr.statusText;
	}
};


// method scans form and returns object as result
redips.form2obj = function (frm) {
	let obj = [],	// result array initialization
		type,		// form element type
		name,		// form element name
		value,		// form element value
		idx,		// selected index
		i;			// loop variables
	// loop through each element on form
	for (i = 0; i < frm.elements.length; i++) {
		// define element type and name
		type = frm.elements[i].type;
		name = frm.elements[i].name;
		// switch on element type
		switch (type) {
		case 'text':
		case 'textarea':
		case 'password':
		case 'hidden':
			value = frm.elements[i].value;
			break;
		case 'radio':
		case 'checkbox':
			value = frm.elements[i].checked;
			break;
		case 'select-one':
			idx = frm.elements[i].selectedIndex;
			value = frm.elements[i].options[idx].value;
			break;
		/*
		case 'select-multiple':
			for (let j = 0; j < frm.elements[i].options.length; j++) {
				frm.elements[i].options[j].selected = false;
			}
			break;
		*/
		}
		// push element form to the object
		obj.push({'type': type, 'name': name, 'value': value});
	}
	return obj;
};


// method merge cells horizontally
redips.merge = function () {
	REDIPS.table.merge('h');
};


// method splits cells horizontally
redips.split = function () {
	REDIPS.table.split('h');
};


// insert row (below current row)
redips.rowInsert = function (el) {
	let row = REDIPS.drag.findParent('TR', el),	// find source row (skip inner row)
		topRow,									// cells reference in top row of the table editor
		nr,										// new table row
		lc;										// last cell in newly inserted row
	// set reference to the top row cells
	topRow = row.parentNode.rows[0].cells;
	// insert table row
	nr = REDIPS.table.row(redips.tableEditor, 'insert', row.rowIndex + 1);
	// define last cell in newly inserted table row
	lc = nr.cells[nr.cells.length - 1];
	// copy last cell content from the top row to the last cell of the newly inserted row
	lc.innerHTML = topRow[topRow.length - 1].innerHTML;
	// ignore last cell (attached onmousedown event listener will be removed)
	REDIPS.table.cellIgnore(lc);
};


// remove table row from the table editor
redips.rowDelete = function (el) {
	// find source row (skip inner row)
	let row = REDIPS.drag.findParent('TR', el);
	// confirm deletion
	if (confirm('Delete row?')) {
		// delete row from table editor
		REDIPS.table.row(redips.tableEditor, 'delete', row.rowIndex);
	}
};


// add onload event listener
if (window.addEventListener) {
	window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redips.init);
}
