/*
Copyright (c) 2008-2011, www.redips.net All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/drag-and-drop-table-content/
Version 4.3.0
Jun 24, 2011.
*/

/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false */

/* reveal module-pattern */

/* enable strict mode */
"use strict";

// create REDIPS namespace (if is not already defined in another REDIPS package)
var REDIPS = REDIPS || {};

REDIPS.drag = (function () {
		// methods
	var	init,						// initialization
		init_tables,				// table initialization
		enable_drag,				// function attaches / detaches onmousedown and onscroll event handlers for DIV elements
		img_onmousemove,			// needed to set onmousemove event handler for images
		handler_onmousedown,		// onmousedown handler
		handler_ondblclick,			// ondblclick handler (calls public myhandler_dblclicked)
		table_top,					// set current table group in "tables" array to the array top
		handler_onmouseup,			// onmouseup handler
		handler_onmousemove,		// onmousemove handler for the document level
		cell_changed,				// private method called from handler_onmousemove(), autoscrollX(), autoscrollY()
		handler_onresize,			// onresize window event handler
		set_trc,					// function sets current table, row and cell
		set_position,				// function sets color for the current table cell and remembers previous position and color
		set_bgcolor,				// function sets background color for the input parameters table, row, cell and background color (color is array)
		get_bgcolor,				// function returns background as array color for the input parameters table, row and cell
		box_offset,					// calculates object (box) offset (top, right, bottom, left)
		calculate_cells,			// calculates table columns and row offsets (cells dimensions)
		getScrollPosition,			// returns scroll positions in array
		autoscrollX,				// horizontal auto scroll function
		autoscrollY,				// vertical auto scroll function
		clone_object,				// clone object
		clone_limit,				// clone limit (after cloning object, take care about climit1_X or climit2_X classnames)
		elementControl,				// function returns true or false if element needs to have control
		trash_delete,				// delete DIV object
		get_style,					// function returns style value of requested object and style name
		save_content,				// scan tables, prepare query string and sent to the multiple-parameters.php
		relocate,					// relocate objects from source cell to the target cell (source and target cells are input parameters)
		move_object,				// method moves object to the destination table, row and cell
		animation,					// object animation
		get_table_index,			// find table index - because tables array is sorted on every element click
		get_position,				// returns position in format: tableIndex, rowIndex and cellIndex (input parameter is optional)
		row_opacity,				// method sets opacity to table row (el, opacity, color)
		row_clone,					// clone table row - input parameter is DIV with class name "row" -> DIV class="drag row"
		row_drop,					// function drops (delete old & insert new) table row (input parameters are current table and row)
	
		// private parameters
		obj_margin = null,			// space from clicked point to the object bounds (top, right, bottom, left)
		window_width = 0,			// window width and height (parameters are set in onload and onresize event handler)
		window_height = 0,
		scroll_width = null,		// scroll width and height of the window (it is usually greater then window)
		scroll_height = null,
		edge = {page: {x: 0, y: 0}, // autoscroll bound values for page and div as scrollable container
				div:  {x: 0, y: 0},	// closer to the edge, faster scrolling
				flag: {x: 0, y: 0}},// flags are needed to prevent multiple calls of autoscrollX and autoscrollY from onmousemove event handler
		scroll_object,				// scroll_object
		bgcolor_old,				// (array) old cell background color
		scrollable_container = [],	// scrollable container areas (contains autoscroll areas, reference to the container and scroll direction)
		tables = [],				// table offsets and row offsets (initialized in onload event)
		sort_idx,					// sort index needed for sorting tables in table_top()
		moved_flag = 0,				// if object is moved, flag gets value 1  
		cloned_flag = 0,			// if object is cloned, flag gets value 1
		cloned_id = [],				// needed for increment ID of cloned elements
		currentCell = [],			// current cell bounds: top, right, bottom, left (decrease number calls of set_trc)
		div_drag = null,			// reference to the div drag
		div_box = null,				// div drag box: top, right, bottom and left margin (decrease number calls of set_trc)
		pointer = {x: 0, y: 0},		// mouse pointer position (this properties are set in handler_onmousemove() - needed for autoscroll)
		
		// selected, previous and source table, row and cell (private parameters too)
		table = null,
		table_old = null,
		table_source = null,
		row = null,
		row_old = null,
		row_source = null,
		cell = null,
		cell_old = null,
		cell_source = null,
		
		// variables in the private scope revealed as public (see init() method)
		obj = false,				// (object) moved object
		obj_old = false,			// (object) previously moved object (before clicked or cloned)
		mode = 'cell',				// (string) drag mode: "cell" or "row" (default is cell)
		hover_color = '#E7AB83',	// (string) hover color
		bound = 25,					// (integer) bound width for autoscroll
		speed = 20,					// (integer) scroll speed in milliseconds
		only = {div: [],			// (array) DIVid -> classname, defined DIV elements can be placed only to the marked table cell with class name 'only'
				cname: 'only',		// (string) class name for marked cells (default is 'only') - only defined objects can be placed there
				other: 'deny'},		// (string) allow / deny dropping marked objects with "only" to other cells
		mark = {action: 'deny',
				cname: 'mark',
				exception: []},
		border = 'solid',			// (string) border style for enabled elements
		border_disabled = 'dotted',	// (string) border style for disabled elements
		opacity_disabled,			// (integer) set opacity for disabled elements
		trash = 'trash',			// (string) cell class name where draggable element will be destroyed
		trash_ask = true,			// (boolean) confirm object deletion (ask a question "Are you sure?" before delete)
		drop_option = 'multiple',	// (string) drop_option has the following options: multiple, single, switch, switching and overwrite
		delete_cloned = true,		// (boolean) delete cloned div if the cloned div is dragged outside of any table
		source_cell = null,			// (object) source table cell (defined in onmousedown and in onmouseup)
		current_cell = null,		// (object) current table cell (defined in onmousemove)
		previous_cell = null,		// (object) previous table cell (defined in onmousemove)
		target_cell = null,			// (object) target table cell (defined in onmouseup)
		animation_pause = 40,		// animation pause (lower values mean the animation plays faster)
		animation_step = 2,			// animation step (minimum is 1)
		
		clone_shiftKey = false;		// (boolean) if true, elements could be cloned with pressed SHIFT key



	// initialization of div drag
	init = function (dd) {
		// define local variables
		var self = this,		// assign reference to current object to "self"
			i,					// used in local for loops
			imgs,				// collect images inside div=drag
			obj_new_div;		// reference to the DIV element needed for cloned elements 

		// if input parameter is undefined, then set reference to the DIV element with id=drag
		if (dd === undefined) {
			dd = 'drag';
		}
		// set reference to the div_drag
		div_drag = document.getElementById(dd);
		// append DIV id="obj_new" if DIV doesn't exist (needed for cloning DIV elements)
		// if automatic creation isn't precise enough, user can manually create and place element with id="obj_new" to prevent window expanding
		// (then this code will be skipped)
		if (!document.getElementById('obj_new')) {
			obj_new_div = document.createElement('div');
			obj_new_div.id = 'obj_new';
			obj_new_div.style.width = obj_new_div.style.height = '1px';
			div_drag.appendChild(obj_new_div);
		}
		// attach onmousedown event handler to the DIV elements
		// attach onscroll='calculate_cells' for DIV elements with 'scroll' in class name (prepare scrollable container areas)
		enable_drag('init');
		// initialize table array (it should go after enable_drag because sca is attached to the table if table belongs to the scrollable container)
		init_tables();
		// set initial window width/height, scroll width/height and define onresize event handler
		// onresize event handler calls calculate columns
		handler_onresize();
		REDIPS.event.add(window, 'resize', handler_onresize);
		// collect images inside div=drag to prevent default action of onmousemove event (needed for IE to enable dragging on image)
		imgs = div_drag.getElementsByTagName('img');
		// disable onmousemove event for images
		for (i = 0; i < imgs.length; i++) {
			REDIPS.event.add(imgs[i], 'mousemove', img_onmousemove);
		}
		// attach onscroll event to the window (needed for recalculating table cells positions)
		REDIPS.event.add(window, 'scroll', calculate_cells);
		// indexOf of needed for IE browsers ?!
		// this code is not longer needed (but I left it here for some time)
		/*
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (el) {
				var i; // local variable
				for (i = 0; i < this.length; i++) {
					if (this[i] === el) {
						return i;
					}
				}
				return -1;
			};
		}
		*/
	};



	// table initialization
	init_tables = function () {
		var	i, j,				// loop variables
			element,			// used in searhing parent nodes of found tables below div id="drag"
			level,				// (integer) 0 - ground table, 1 - nested table, 2 - nested nested table, 3 - nested nested nested table ...
			group_idx,			// tables group index (ground table and its nested tables will have the same group)
			tables_nodeList,	// live nodelist of tables found inside DIV="drag"
			nested_tables,		// nested tables nodelist (search for nested tables for every "ground" table)
			td,					// td nodeList (needed for search rowspan attribute)
			rowspan;			// flag to set if table contains rowspaned cells
		// collect tables inside DIV id="drag" and make static nodeList
		tables_nodeList = div_drag.getElementsByTagName('table');
		// loop through tables and define table sort parameter
		for (i = 0; i < tables_nodeList.length; i++) {
			// set start element for "do" loop
			element = tables_nodeList[i].parentNode;
			// set initial value for nested level
			level = 0;
			// go up through DOM until DIV id="drag" found (drag container)
			do {
				// if "TD" found then this is nested table
				if (element.nodeName === 'TD') {
					// increase nested level
					level++;
					// mark table cell that contains table (needed for settings currentCell.containTable property in set_trc() - see around line 800)
					element.table = true;
				}
				// go one level up
				element = element.parentNode;
			} while (element && element !== div_drag);
			// copy table reference to the static list
			tables[i] = tables_nodeList[i];
			// set redips_container to the table (needed in case when row is cloned)
			tables[i].redips_container = div_drag;
			// set nested level (needed for sorting in "tables" array)
			// level === 0 - means that this is "ground" table ("ground" table may contain nested tables)
			tables[i].redips_nestedLevel = level;
			// set original table index (needed for sorting "tables" array to the original order in save_content() function)
			tables[i].redips_idx = i;
			// prepare td nodeList of current table
			td = tables[i].getElementsByTagName('td');
			// loop through nodeList and search for rowspaned cells
			for (j = 0, rowspan = false; j < td.length; j++) {
				// if only one rowspaned cell is found set flag to "true" and break loop
				if (td[j].rowSpan > 1) {
					rowspan = true;
					break;
				}
			}
			// set redips_rowspan flag (needed in set_trc())
			tables[i].redips_rowspan = rowspan;
		}
		/*
		 * define "redips_nestedGroup" and initial "redips_sort" parameter for each table
		 * 
		 * for example if drag area contains two tables and one of them has nested tables then this code will create two groups
		 * with the following redips_sort values: 100, 200, and 201
		 * 100 - "ground" table of the first group
		 * 200 - "ground" table of the second group
		 * 201 - nested table of the second table group
		 * 
		 * this means that nested table of second group will always be sorted before its "ground" table
		 * after clicking on DIV element in "ground" table of second group or nested table in second group array order will be: 201, 200 and 100
		 * after clicking on DIV element in "ground" table of first group array order will be: 100, 201, 200
		 * 
		 * actually, sort_idx will be increased and sorted result will be: 300, 201, 200
		 * and again clicking on element in nested table sorted result will be: 401, 400, 300 
		 * and so on ...
		 */
		for (i = 0, group_idx = sort_idx = 1; i < tables.length; i++) {
			// if table is "ground" table (lowest level) search for nested tables
			if (tables[i].redips_nestedLevel === 0) {
				// set group index for ground table and initial sort index
				tables[i].redips_nestedGroup = group_idx;
				tables[i].redips_sort = sort_idx * 100;
				// search for nested tables (if there is any)
				nested_tables = tables[i].getElementsByTagName('table');
				// open loop for every nested table
				for (j = 0; j < nested_tables.length; j++) {
					// set group index and initial sort index
					nested_tables[j].redips_nestedGroup = group_idx;
					nested_tables[j].redips_sort = sort_idx * 100 + nested_tables[j].redips_nestedLevel;
				}
				// increase group index and sort index (sort_idx is private parameter of REDIPS.drag)
				group_idx++;
				sort_idx++;
			}
		}
	};


	// needed to set onmousemove event handler for images (for IE to enable dragging DIV on image click)
	// used in init() function
	img_onmousemove = function () {
		return false;
	};



	// onmousedown handler
	handler_onmousedown = function (e) {
		var evt = e || window.event,	// define event (cross browser)
			offset,						// object offset
			mouseButton,				// start drag if left mouse button is pressed
			position,					// position of table or container box of table (if has position:fixed then exclude scroll offset)
			X, Y;						// X and Y position of mouse pointer
		// define X and Y position (pointer.x and pointer.y are needed in set_trc() and autoscroll methods)
		X = pointer.x = evt.clientX;
		Y = pointer.y = evt.clientY;
		// enable control for form elements
		if (elementControl(evt)) {
			return true;
		}
		// remember previous object if defined or set to the clicked object
		REDIPS.drag.obj_old = obj_old = obj || this;
		// set reference to the clicked object
		REDIPS.drag.obj = obj = this;
		// set current table group in "tables" array to the array top
		// table_top() should go before definition of "mode" property 
		table_top(obj);
		// if clicked element doesn't belong to the current container then environment should be changed
		if (div_drag !== obj.redips_container) {
			div_drag = obj.redips_container;
			init_tables();
		}
		// define drag mode ("cell" or "row")
		// mode definition should be after:
		// table_top() - because "obj" is rewritten with table row reference
		// init_tables() - because "obj" is rewritten with table row reference and row doesn't have defined redips_container property
		if (obj.className.indexOf('row') === -1) {
			REDIPS.drag.mode = mode = 'cell';
		}
		else {
			REDIPS.drag.mode = mode = 'row';
			// just return reference of the current row (do not clone)
			REDIPS.drag.obj = obj = row_clone(obj);
		}
		// if user has used a mouse event to increase the dimensions of the table - call calculate_cells() 
		calculate_cells();
		// set high z-index if object isn't "clone" type (clone object is motionless) for "cell" mode only
		if (obj.className.indexOf('clone') === -1 && mode === 'cell') {
			obj.style.zIndex = 999;
		}
		// set current table, row and cell
		set_trc();
		// remember start position (table, row and cell) and set initially old position (the same as start position) 
		table_source = table_old = table;
		row_source = row_old = row;
		cell_source = cell_old = cell;
		// define source cell, current cell and previous cell (needed for myhandlers)
		REDIPS.drag.source_cell = source_cell = tables[table_source].rows[row_source].cells[cell_source];
		REDIPS.drag.current_cell = current_cell = source_cell;
		REDIPS.drag.previous_cell = previous_cell = source_cell;
		// define pressed mouse button
		if (evt.which) {
			mouseButton = evt.which;
		}
		else {
			mouseButton = evt.button;
		}
		// activate onmousemove and onmouseup event handlers on document object
		// if left mouse button is clicked
		if (mouseButton === 1) {
			moved_flag  = 0; // reset moved_flag (needed for clone object in handler_onmousemove)
			cloned_flag = 0; // reset cloned_flag
			REDIPS.event.add(document, 'mousemove', handler_onmousemove);
			REDIPS.event.add(document, 'mouseup', handler_onmouseup);
			// call myhandler_clicked for table content
			if (mode === 'cell') {
				REDIPS.drag.myhandler_clicked();
			}
			// or for table row
			else {
				REDIPS.drag.myhandler_row_clicked();
			}
			// get IE (all versions) to allow dragging outside the window (?!)
			// http://stackoverflow.com/questions/1685326/responding-to-the-onmousemove-event-outside-of-the-browser-window-in-ie
			if (obj.setCapture) {
				obj.setCapture();
			}
		}
		// remember background cell color
		if (table !== null || row !== null || cell !== null) {
			bgcolor_old = get_bgcolor(table, row, cell);
		}
		// set table CSS position (needed for exclusion "scroll offset" if table box has position fixed)
		position = get_style(tables[table_source], 'position');
		// if table doesn't have style position:fixed then table container should be tested 
		if (position !== 'fixed') {
			position = get_style(tables[table_source].parentNode, 'position');
		}
		// define object offset
		offset = box_offset(obj, position);
		// calculate offset from the clicked point inside element to the
		// top, right, bottom and left side of the element
		obj_margin = [Y - offset[0], offset[1] - X, offset[2] - Y, X - offset[3]];
		// dissable text selection (but not for links and form elements)
		// onselectstart is supported by IE browsers, other browsers "understand" return false in onmousedown handler
		div_drag.onselectstart = function (e) {
			evt = e || window.event;
			if (!elementControl(evt)) {
				// this lines are needed for IE8 in case when leftmouse button was clicked and SHIFT key was pressed
				// IE8 selected text anyway but document.selection.clear() prevented text selection
				if (evt.shiftKey) {
					document.selection.clear();
				}
			    return false;
			}
		};
		// disable text selection for non IE browsers
		return false;
	};



	// ondblclick handler
	handler_ondblclick = function (e) {
		// call custom event handler
		REDIPS.drag.myhandler_dblclicked();
	};



	// set current table group in "tables" array to the array top
	// clicked object belongs to the table and this table group ("ground" table + its nested tables) should go to the array top
	table_top = function (obj) {
		var	e,		// element
			i,		// loop variable
			tmp,	// temporary storage (needed for exchanging array members)
			group;	// tables group
		// set start element position
		e = obj.parentNode;
		// loop up until table found for clicked DIV element
		while (e && e.nodeName !== 'TABLE') {
			e = e.parentNode;
		}
		// set tables group
		group = e.redips_nestedGroup;
		// set highest "redips_sort" parameter to the current table group
		for (i = 0; i < tables.length; i++) {
			// "ground" table is table with lowest level hierarchy and with its nested tables creates table group
			// nested table will be sorted before "ground" table
			if (tables[i].redips_nestedGroup === group) {
				tables[i].redips_sort = sort_idx * 100 + tables[i].redips_nestedLevel; // sort = sort_idx * 100 + level
			}
		}
		// sort "tables" array according to redips_sort (tables with higher redips_sort parameter will go to the array top)
		tables.sort(function (a, b) {
			return b.redips_sort - a.redips_sort;
		});
		// increase sort_idx
		sort_idx++;
	};



	// function returns reference to the table row or clones table row
	// if called from onmousedown
	//  * input parameter is DIV class="row"
	//  * function will return reference of the current row
	// if called from onmousemove
	//  * input parameter is TR (current row) - previously returned with this function
	//  * function will clone current row and return reference of the cloned row 
	row_clone = function (el) {
		var table_mini,	// original table is cloned and all rows except picked row are deleted
			offset,		// offset of source TR
			row_obj,	// reference to the row object
			row_index,	// row index
			div1, div2,	// collection of DIV elements in source TR and in cloned TR
			row_last,	// last row in cloned table
			id,			// id of <DIV class="drag row">
			i;			// loop variable
		// clone current row (needed in onmousemove)
		if (el.nodeName === 'TR') {
			// remember row object (source row)
			row_obj = el;
		    // loop up until TABLE element found
			while (el && el.nodeName !== 'TABLE') {
				el = el.parentNode;
		    }
			// remember source row index
			row_index = row_obj.rowIndex;
			// clone whole table
			table_mini = el.cloneNode(true);
			// define source row (needed for source row deletion in row_drop method)
			table_mini.redips_source_row = row_obj;
			// find last row in cloned table
			row_last = table_mini.rows.length - 1;
		    // delete all rows but clicked table row
			for (i = row_last; i >= 0; i--) {
				if (i !== row_index) {
					table_mini.deleteRow(i);
				}
			}
			// collect div elements from the source row
			// needed for setting of custom properties redips_enabled and redips_container in cloned row
			div1 = row_obj.getElementsByTagName('div');
			// now mini table contains only one row
			// collect div elements from the mini table (number and order of div elements should be the same as in div1 collection)
			div2 = table_mini.getElementsByTagName('div');
			// set custom properties to the cloned elements and onmousedown if source DIV element is enabled
			// http://stackoverflow.com/questions/4094811/javascript-clonenode-and-properties
			for (i = 0; i < div2.length; i++) {
				div2[i].redips_enabled = div1[i].redips_enabled;
				div2[i].redips_container = div1[i].redips_container;
				// cloneNode() does not clone event handlers too
				// set onmousedown/ondblclick event handler if source element is enabled
				if (div1[i].redips_enabled) {
					div2[i].onmousedown = handler_onmousedown;
					div2[i].ondblclick = handler_ondblclick;
				}
			}
			// add div_drag container reference (needed in onmousedown event handler)
			// redips_container is defined in init_table method ("el" is reference to the original table)
			table_mini.redips_container = el.redips_container;
			// add id of <DIV class="drag row" id="row1"> (needed for dropped row identification)
			table_mini.redips_dragrow_id = row_obj.redips_dragrow_id;
			// append cloned mini table to the DIV id="obj_new"
			document.getElementById('obj_new').appendChild(table_mini);
			// include scroll position in offset
			offset = box_offset(row_obj, 'fixed');
			// set position and position type
			table_mini.style.position = 'fixed';
			table_mini.style.top = offset[0] + "px";
			table_mini.style.left = offset[3] + "px";
			// define width of mini table
			table_mini.style.width = (offset[1] - offset[3]) + "px";
			// return reference of mini table
			return table_mini;
		}
		// input parameter is DIV class="row"
		// return reference of the current row (needed in onmousedown)
		else {
			// remember id of <DIV class="drag row">
			id = el.id;
		    // loop up until TR element found
			while (el && el.nodeName !== 'TR') {
				el = el.parentNode;
		    }
			// save id to the table row as redips_dragrow_id
			el.redips_dragrow_id = id;
			// return reference to the TR
			return el;
		}
	};



	// function drops (delete old & insert new) table row
	// input parameters are current table and current row; table_mini parameter is optional
	row_drop = function (r_table, r_row, table_mini) {
		// local variable definition
		var ts = tables[r_table].rows[0].parentNode, // reference to the table section element (where row will be inserted / appended)
			tr,			// reference to the TR in mini table
			src,		// reference to the source row (row that should be deleted)
			rowIndex;	// row index that should be deleted
		// if mini table is undefined then use reference to the table_mini from obj
		if (table_mini === undefined) {
			table_mini = obj;
		}

		// set initial position to find source table
		src = table_mini.redips_source_row;
		// set rowIndex from redips_source_row property saved in table_mini
		rowIndex = src.rowIndex;
		// find source table
		while (src && src.nodeName !== 'TABLE') {
			src = src.parentNode;
	    }
		// delete source row
		src.deleteRow(rowIndex);
		// set reference to the TR in mini table (mini table has only one row - first row)
		tr = table_mini.getElementsByTagName('tr')[0];
		// if row is not dropped to the last row position
		if (r_row < tables[r_table].rows.length) {
			// insert table row
			ts.insertBefore(tr, tables[r_table].rows[r_row]);
		}
		// row is dropped to the last row position
		else {
			// row should be appended
			ts.appendChild(tr);
		}
		// destroy mini table
		table_mini.parentNode.removeChild(table_mini);
	};



	// onmouseup handler
	handler_onmouseup = function (e) {
		var evt = e || window.event,	// define event (FF & IE)
			target_table,				// needed for test if cloned element is dropped outside table
			r_table, r_row,				// needed for mode="row"
			mt_tr,						// needed for returning color to the table cell (mt_tr - "mini table" "table_row")
			X, Y,						// X and Y position of mouse pointer
			i,							// used in local loop
			// define target elements and target elements length needed for switching table cells
			// target_elements_length is needed because nodeList objects in the DOM are live 
			// please see http://www.redips.net/javascript/nodelist-objects-are-live/
			target_elements, target_elements_length;
		// define X and Y position
		X = evt.clientX;
		Y = evt.clientY;
		// turn off autoscroll "current cell" handling (if user mouseup in the middle of autoscrolling)
		edge.flag.x = edge.flag.y = 0;
		// remove mouse capture from the object in the current document
		// get IE (all versions) to allow dragging outside the window (?!)
		// http://stackoverflow.com/questions/1685326/responding-to-the-onmousemove-event-outside-of-the-browser-window-in-ie
		if (obj.releaseCapture) {
			obj.releaseCapture();
		}
		// detach onmousemove and onmouseup event handlers
		REDIPS.event.remove(document, 'mousemove', handler_onmousemove);
		REDIPS.event.remove(document, 'mouseup', handler_onmouseup);
		// detach div_drag.onselectstart handler to enable select for IE7/IE8 browser 
		div_drag.onselectstart = null;
		// reset left and top styles
		obj.style.left = 0;
		obj.style.top  = 0;
		// return z-index and position style to 'static' (this is default element position) 
		obj.style.zIndex = -1;
		obj.style.position = 'static';
		// document.body.scroll... only works in compatibility (aka quirks) mode,
		// for standard mode, use: document.documentElement.scroll...
		scroll_width  = document.documentElement.scrollWidth;
		scroll_height = document.documentElement.scrollHeight;	
		// reset autoscroll flags
		edge.flag.x = edge.flag.y = 0;
		// this could happen if 'clone' element is placed in unmovable table cell
		if (cloned_flag === 1 && (table === null || row === null || cell === null)) {
			obj.parentNode.removeChild(obj);
			// decrease cloned_id counter
			cloned_id[obj_old.id] -= 1;
			REDIPS.drag.myhandler_notcloned();
		}
		// if ordinary element was clicked and left button was released, but element is placed inside unmovable table cell
		else if (table === null || row === null || cell === null) {
			REDIPS.drag.myhandler_notmoved();
		}		
		else {
			// if current table is in range, use table for current location
			if (table < tables.length) {
				target_table = tables[table];
				REDIPS.drag.target_cell = target_cell = target_table.rows[row].cells[cell];
				// set background color for destination cell (cell had hover color)
				set_bgcolor(table, row, cell, bgcolor_old);
				// set r_table & r_row (needed for mode === "row")
				r_table = table;
				r_row = row;
			}
			// if any level of old position is undefined, then use source location
			else if (table_old === null || row_old === null || cell_old === null) {
				target_table = tables[table_source];
				REDIPS.drag.target_cell = target_cell = target_table.rows[row_source].cells[cell_source];
				// set background color for destination cell (cell had hover color)
				set_bgcolor(table_source, row_source, cell_source, bgcolor_old);
				// set r_table & r_row (needed for mode === "row")
				r_table = table_source;
				r_row = row_source;
			}
			// or use the previous location
			else {
				target_table = tables[table_old];
				REDIPS.drag.target_cell = target_cell = target_table.rows[row_old].cells[cell_old];
				// set background color for destination cell (cell had hover color)
				set_bgcolor(table_old, row_old, cell_old, bgcolor_old);
				// set r_table & r_row (needed for mode === "row")
				r_table = table_old;
				r_row = row_old;
			}
			// if dragging mode is table row
			if (mode === 'row') {
				// row was clicked and mouse button was released right away (row was not moved)
				if (moved_flag === 0) {
					REDIPS.drag.myhandler_row_notmoved();
				}
				// row was moved
				else {
					// and dropped to the source row
					if (table_source === r_table && row_source === r_row) {
						// reference to the TR in mini table (mini table has only one row)
						mt_tr = obj.getElementsByTagName('tr')[0];
						// return color to the source row from the row of cloned mini table
						// color of the source row can be changed in myhandler_row_moved() (when user wants to mark source row)
						obj_old.style.backgroundColor = mt_tr.style.backgroundColor;
						// return color to the each table cell
						for (i = 0; i < mt_tr.cells.length; i++) {
							obj_old.cells[i].style.backgroundColor = mt_tr.cells[i].style.backgroundColor;
						}
						// remove cloned mini table
						obj.parentNode.removeChild(obj);
						// call myhandler_row_dropped_source() event handler
						REDIPS.drag.myhandler_row_dropped_source(target_cell);
					}
					// and dropped to the new row
					else {
						row_drop(r_table, r_row);
						REDIPS.drag.myhandler_row_dropped(target_cell);
					}	
				}
			}
			// clicked element was not moved - mouse button was clicked and released
			// just call myhandler_notmoved public event handler
			else if (moved_flag === 0) {
				REDIPS.drag.myhandler_notmoved();
			}
			// delete cloned object if dropped on the start position
			else if (cloned_flag === 1 && table_source === table && row_source === row && cell_source === cell) {
				obj.parentNode.removeChild(obj);
				// decrease cloned_id counter
				cloned_id[obj_old.id] -= 1;
				REDIPS.drag.myhandler_notcloned();
			}
			// delete cloned object if dropped outside current table and delete_cloned flag is true
			else if (cloned_flag === 1 && REDIPS.drag.delete_cloned === true &&
					(X < target_table.offset[3] || X > target_table.offset[1] || Y < target_table.offset[0] || Y > target_table.offset[2])) {
				obj.parentNode.removeChild(obj);
				// decrease cloned_id counter
				cloned_id[obj_old.id] -= 1;
				REDIPS.drag.myhandler_notcloned();
			}
			// remove object if destination cell has "trash" in class name
			else if (target_cell.className.indexOf(REDIPS.drag.trash) > -1) {
				// remove child from DOM (node still exists in memory)
				obj.parentNode.removeChild(obj);
				// if parameter trash_ask is "true", confirm deletion (function trash_delete is at bottom of this script)
				if (REDIPS.drag.trash_ask) {
					setTimeout(trash_delete, 10);
				}
				// else call myhandler_deleted handler (reference to the obj still exists)
				else {
					REDIPS.drag.myhandler_deleted();
					// if object is cloned, update climit1_X or climit2_X classname
					if (cloned_flag === 1) {
						clone_limit();
					}
				}
			}
			else if (REDIPS.drag.drop_option === 'switch') {
				// remove dragged element from DOM (source cell) - node still exists in memory
				obj.parentNode.removeChild(obj);
				// move object from the destination to the source cell
				target_elements = target_cell.getElementsByTagName('DIV');
				target_elements_length = target_elements.length;
				for (i = 0; i < target_elements_length; i++) {
					// source_cell is defined in onmouseup
					if (target_elements[0] !== undefined) { //fixes issue with nested DIVS
						source_cell.appendChild(target_elements[0]); // '0', not 'i' because NodeList objects in the DOM are live
					}
				}
				// call myhandler_dropped_before()
				REDIPS.drag.myhandler_dropped_before(target_cell);
				// and finaly, append dragged object to the destination table cell
				target_cell.appendChild(obj);
				// if destination element exists, than elements are switched
				if (target_elements_length) {
					// call myhandler_switched because clone_limit could call myhandler_clonedend1 or myhandler_clonedend2
					REDIPS.drag.myhandler_switched();
					// and myhandler_dropped
					REDIPS.drag.myhandler_dropped(target_cell);
					// if object is cloned, update climit1_X or climit2_X classname
					if (cloned_flag === 1) {
						clone_limit();
					}
				}
				// otherwise element is dropped to the empty cells
				else {
					// call myhandler_dropped because clone_limit could call myhandler_clonedend1 or myhandler_clonedend2
					REDIPS.drag.myhandler_dropped(target_cell);
					// if object is cloned, update climit1_X or climit2_X classname
					if (cloned_flag === 1) {
						clone_limit();
					}
				}
			}
			// overwrite destination table cell with dragged content 
			else if (REDIPS.drag.drop_option === 'overwrite') {
				// remove objects from the destination table cell
				target_elements = target_cell.getElementsByTagName('DIV');
				target_elements_length = target_elements.length;
				for (i = 0; i < target_elements_length; i++) {
					// remove child DIV elements from target cell
					target_cell.removeChild(target_elements[0]); // '0', not 'i' because NodeList objects in the DOM are live
				}
				// call myhandler_dropped_before()
				REDIPS.drag.myhandler_dropped_before(target_cell);
				// append object to the target cell
				target_cell.appendChild(obj);
				// call myhandler_dropped because clone_limit could call myhandler_clonedend1 or myhandler_clonedend2
				REDIPS.drag.myhandler_dropped(target_cell);
				// if object is cloned, update climit1_X or climit2_X classname
				if (cloned_flag === 1) {
					clone_limit();
				}
			}
			// else call myhandler_dropped_before(), append object to the cell and call myhandler_dropped() 
			else {
				// call myhandler_dropped_before()
				REDIPS.drag.myhandler_dropped_before(target_cell);
				// append object to the target cell
				target_cell.appendChild(obj);
				// call myhandler_dropped because clone_limit could call myhandler_clonedend1 or myhandler_clonedend2
				REDIPS.drag.myhandler_dropped(target_cell);
				// if object is cloned, update climit1_X or climit2_X classname
				if (cloned_flag === 1) {
					clone_limit();
				}
			}
			// force naughty browsers (IE6, IE7 ...) to redraw source and destination row (element.className = element.className does the trick)
			// but careful (table_source || row_source could be null if clone element was clicked in denied table cell)
			if (table_source !== null && row_source !== null) {
				tables[table_source].rows[row_source].className = tables[table_source].rows[row_source].className;
			}
			target_cell.parentNode.className = target_cell.parentNode.className;
			// recalculate table cells and scrollers because cell content could change row dimensions 
			calculate_cells();
		}
		// reset old positions
		table_old = row_old = cell_old = null;
	};



	// onmousemove handler for the document level
	// activated after left mouse button is pressed on draggable element
	handler_onmousemove = function (e) {
		var evt = e || window.event,	// define event (FF & IE)
			bound = REDIPS.drag.bound,	// read "bound" public property (maybe code will be faster, and it will be easier to reference in onmousemove handler)
			sca,						// current scrollable container area
			X, Y,						// X and Y position of mouse pointer
			i,							// needed for local loop
			scrollPosition;				// scroll position variable needed for autoscroll call
		// define X and Y position (pointer.x and pointer.y are needed in set_trc() and autoscroll methods)
		X = pointer.x = evt.clientX;
		Y = pointer.y = evt.clientY;
		// if moved_flag isn't set (this is the first moment when object is moved)
		if (moved_flag === 0) {
			// if moved object has clone in class name or clone_shiftKey is enabled and shift key is pressed
			// then duplicate object, set cloned flag and call myhandler_cloned
			if (obj.className.indexOf('clone') > -1 || (REDIPS.drag.clone_shiftKey === true && evt.shiftKey)) {
				clone_object();
				cloned_flag = 1;
				REDIPS.drag.myhandler_cloned();
				// set color for the current table cell and remember previous position and color
				set_position();
			}
			// else ordinary object is moved
			else {
				// if mode is row then remember reference of the source row, clone source row and set obj as reference to the current row
				if (mode === 'row') {
					// remember reference to the source row
					REDIPS.drag.obj_old = obj_old = obj;
					// clone source row and set as obj
					REDIPS.drag.obj = obj = row_clone(obj);
					// set high z-index for cloned mini table
					obj.style.zIndex = 999;
				}
				// get IE (all versions) to allow dragging outside the window (?!)
				// this was needed here also - despite setCaputure in onmousedown
				if (obj.setCapture) {
					obj.setCapture();
				}
				// set style to fixed to allow dragging DIV object
				obj.style.position = 'fixed';
				// call calculate cells for case where moved element changed cell dimension
				// place 3 elements in the same cell in example08 and try to move one out of the table cell
				calculate_cells();
				// set current table, row and column
				set_trc();
				// call myhandler_moved for table content or row
				if (mode === 'cell') {
					REDIPS.drag.myhandler_moved();
				}
				else {
					REDIPS.drag.myhandler_row_moved();
				}
				// set color for the current table cell and remember previous position and color
				// set_position() must go after calling myhandler_moved() and myhandler_row_moved() if user wants to
				// change color of source row
				set_position();
			}
			// if element is far away on the right side of page, set possible right position (window_width - object width)
			// obj_margin[1] + obj_margin[3] = object width
			if (X > window_width - obj_margin[1]) {
				obj.style.left = (window_width - (obj_margin[1] +  obj_margin[3])) + 'px';
			}
			// if element is below page bottom, set possible lower position (window_width - object height)
			// obj_margin[0] + obj_margin[2] = object height
			if (Y > window_height - obj_margin[2]) {
				obj.style.top  = (window_height - (obj_margin[0] + obj_margin[2])) + 'px';
			}
		}
		// set moved_flag
		moved_flag = 1;
		// set left and top styles for the moved element if element is inside window
		// this conditions will stop element on window bounds
		if (X > obj_margin[3] && X < window_width - obj_margin[1]) {
			obj.style.left = (X - obj_margin[3]) + 'px';
		}
		if (Y > obj_margin[0] && Y < window_height - obj_margin[2]) {
			obj.style.top  = (Y - obj_margin[0]) + 'px';
		}
		// set current table, row and cell (this condition should spare CPU):
		// 1) if mouse pointer is inside DIV id="drag"
		// 2) and autoscroll is not working
		// 3) and current table contains nested table or cursor is outside of current cell
		if (X < div_box[1] && X > div_box[3] && Y < div_box[2] && Y > div_box[0] &&
			edge.flag.x === 0 && edge.flag.y === 0 &&
			((currentCell.containTable === 1) ||
			(X < currentCell[3] || X > currentCell[1] || Y < currentCell[0] || Y > currentCell[2]))) {
			// set current table row and table cell
			set_trc();
			// if new location is inside table and new location is different then old location
			cell_changed();
		}
		// calculate horizontally crossed page bound
		edge.page.x = bound - (window_width / 2  > X ? X - obj_margin[3] : window_width - X - obj_margin[1]);
		// if element crosses page bound then set scroll direction and call auto scroll 
		if (edge.page.x > 0) {
			// in case when object is only half visible
			if (edge.page.x > bound) {
				edge.page.x = bound;
			}
			// get horizontal window scroll position
			scrollPosition = getScrollPosition()[0];
			// set scroll direction
			edge.page.x *= X < window_width / 2 ? -1 : 1;
			// if page bound is crossed and this two cases aren't met:
			// 1) scrollbar is on the left and user wants to scroll left
			// 2) scrollbar is on the right and user wants to scroll right
			if (!((edge.page.x < 0 && scrollPosition <= 0) || (edge.page.x > 0 && scrollPosition >= (scroll_width - window_width)))) {
				// fire autoscroll function (this should happen only once)
				if (edge.flag.x++ === 0) {
					// reset onscroll event
					REDIPS.event.remove(window, 'scroll', calculate_cells);
					// call window autoscroll 
					autoscrollX(window);
				}
			}
		}
		else {
			edge.page.x = 0;
		}
		// calculate vertically crossed page bound
		edge.page.y = bound - (window_height / 2 > Y ? Y - obj_margin[0] : window_height - Y - obj_margin[2]);
		// if element crosses page bound
		if (edge.page.y > 0) {
			// set max crossed bound
			if (edge.page.y > bound) {
				edge.page.y = bound;
			}
			// get vertical window scroll position
			scrollPosition = getScrollPosition()[1];
			// set scroll direction
			edge.page.y *= Y < window_height / 2 ? -1 : 1;
			// if page bound is crossed and this two cases aren't met:
			// 1) scrollbar is on the page top and user wants to scroll up
			// 2) scrollbar is on the page bottom and user wants to scroll down
			if (!((edge.page.y < 0 && scrollPosition <= 0) || (edge.page.y > 0 && scrollPosition >= (scroll_height - window_height)))) {
				// fire autoscroll (this should happen only once)
				if (edge.flag.y++ === 0) {
					// reset onscroll event
					REDIPS.event.remove(window, 'scroll', calculate_cells);
					// call window autoscroll
					autoscrollY(window);
				}
			}
		}
		else {
			edge.page.y = 0;
		}
		// test if dragged object is in scrollable container
		// this code will be executed only if scrollable container (DIV with overflow other than 'visible) exists on page
		for (i = 0; i < scrollable_container.length; i++) {
			// set current scrollable container area
			sca = scrollable_container[i];
			// if dragged object is inside scrollable container and scrollable container has enabled autoscroll option
			if (sca.autoscroll && X < sca.offset[1] && X > sca.offset[3] && Y < sca.offset[2] && Y > sca.offset[0]) {
				// calculate horizontally crossed page bound
				edge.div.x = bound - (sca.midstX  > X ? X - obj_margin[3] - sca.offset[3] : sca.offset[1] - X - obj_margin[1]);
				// if element crosses page bound then set scroll direction and call auto scroll 
				if (edge.div.x > 0) {
					// in case when object is only half visible (page is scrolled on that object)
					if (edge.div.x > bound) {
						edge.div.x = bound;
					}
					// set scroll direction: negative - left, positive - right
					edge.div.x *= X < sca.midstX ? -1 : 1; 
					// remove onscroll event handler and call autoscrollY function only once
					if (edge.flag.x++ === 0) {
						REDIPS.event.remove(sca.div, 'scroll', calculate_cells);
						autoscrollX(sca.div);
					}
				}
				else {
					edge.div.x = 0;
				}
				// calculate vertically crossed page bound
				edge.div.y = bound - (sca.midstY  > Y ? Y - obj_margin[0] - sca.offset[0] : sca.offset[2] - Y - obj_margin[2]);
				// if element crosses page bound then set scroll direction and call auto scroll
				if (edge.div.y > 0) {
					// in case when object is only half visible (page is scrolled on that object)
					if (edge.div.y > bound) {
						edge.div.y = bound;
					}
					// set scroll direction: negative - up, positive - down
					edge.div.y *= Y < sca.midstY ? -1 : 1;
					// remove onscroll event handler and call autoscrollY function only once
					if (edge.flag.y++ === 0) {
						REDIPS.event.remove(sca.div, 'scroll', calculate_cells);
						autoscrollY(sca.div);
					}
				}
				else {
					edge.div.y = 0;
				}
				// break the loop (checking for other scrollable containers is not needed) 
				break;
			}
			// otherwise (I mean dragged object isn't inside any of scrollable container) reset crossed edge
			else {
				edge.div.x = edge.div.y = 0;
			} 
		}
		// stop all propagation of the event in the bubbling phase.
		// (save system resources by turning off event bubbling / propagation)
		evt.cancelBubble = true;
		if (evt.stopPropagation) {
			evt.stopPropagation();
		}
	};



	// private method called from handler_onmousemove(), autoscrollX(), autoscrollY()
	cell_changed = function () {
		if (table < tables.length && (table !== table_old || row !== row_old || cell !== cell_old)) {
			// set cell background color to the previous cell
			if (table_old !== null && row_old !== null && cell_old !== null) {
				// set background color for previous table cell
				set_bgcolor(table_old, row_old, cell_old, bgcolor_old);
				// define previous table cell
				REDIPS.drag.previous_cell = previous_cell = tables[table_old].rows[row_old].cells[cell_old];
				// define current table cell
				REDIPS.drag.current_cell = current_cell = tables[table].rows[row].cells[cell];
				// if drop option is 'switching' then replace content from current cell to the previous cell
				if (REDIPS.drag.drop_option === 'switching') {
					// move objects from current cell to the previous cell
					relocate(current_cell, previous_cell);
					// recalculate table cells again (because cell content could change row dimensions) 
					calculate_cells();
					// set current table cell again (because cell content can be larger then cell itself)
					set_trc();
				}
				// target cell changed - call myhandler for table content 
				if (mode === 'cell') {
					REDIPS.drag.myhandler_changed();
				}
				// for mode === 'row', table or row should change (changing cell in the same row will be ignored)
				else if (mode === 'row' && (table !== table_old || row !== row_old)) {
					REDIPS.drag.myhandler_row_changed();
				}
			}
			// set color for the current table cell and remembers previous position and color
			set_position();
		}		
	};



	// onresize window event handler
	// this event handler sets window_width and window_height variables used in onmousemove handler
	handler_onresize = function () {
		// Non-IE
		if (typeof(window.innerWidth) === 'number') {
			window_width  = window.innerWidth;
			window_height = window.innerHeight;
		}
		// IE 6+ in 'standards compliant mode'
		else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			window_width  = document.documentElement.clientWidth;
			window_height = document.documentElement.clientHeight;
		}
		// IE 4 compatible
		else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
			window_width  = document.body.clientWidth;
			window_height = document.body.clientHeight;
		}
		// set scroll size (onresize, onload and onmouseup event)
		scroll_width  = document.documentElement.scrollWidth;
		scroll_height = document.documentElement.scrollHeight;
		// calculate colums and rows offset (cells dimensions)
		calculate_cells();  
	};


	
	// method sets current table, row and cell
	set_trc = function () {
		var cell_current,	// define current cell (needed for some test at the function bottom)
			row_offset,		// row offsets for the selected table (row box bounds)
			row_found,		// remember found row
			cells,			// number of cells in the selected row
			has_content,	// has_content flag
			mark_found,		// (boolean) found "mark" class name
			only_found,		// (boolean) found "only" class name
			single_cell,	// table cell can be defined as single
			row_handler,	// table cell marked as row handler (dragging rows enabled, table content disabled)
			tos = [],		// table offset
			X, Y,			// X and Y position of mouse pointer
			i;				// used in local loop
		// prepare X and Y position of mouse pointer
		X = pointer.x;
		Y = pointer.y;
		// find table below draggable object
		for (table = 0; table < tables.length; table++) {
			// prepare table offset
			tos[0] = tables[table].offset[0]; // top
			tos[1] = tables[table].offset[1]; // right
			tos[2] = tables[table].offset[2]; // bottom
			tos[3] = tables[table].offset[3]; // left
			// if table belongs to the scrollable container then set scrollable container offset if needed
			// in case when some parts of table are hidden (for example with "overflow: auto")
			if (tables[table].sca !== undefined) {
				tos[0] = tos[0] > tables[table].sca.offset[0] ? tos[0] : tables[table].sca.offset[0]; // top
				tos[1] = tos[1] < tables[table].sca.offset[1] ? tos[1] : tables[table].sca.offset[1]; // right
				tos[2] = tos[2] < tables[table].sca.offset[2] ? tos[2] : tables[table].sca.offset[2]; // bottom
				tos[3] = tos[3] > tables[table].sca.offset[3] ? tos[3] : tables[table].sca.offset[3]; // left
			}
			// mouse pointer is inside table (or scrollable container)
			if (tos[3] < X && X < tos[1] && tos[0] < Y && Y < tos[2]) {
				// define row offsets for the selected table (row box bounds)
				row_offset = tables[table].row_offset;
				// find the current row (loop will stop at the current row; row_offset[row][0] is row top offset)
				for (row = 0; row < row_offset.length - 1 && row_offset[row][0] < Y; row++) {
					// set top and bottom cell bounds
					currentCell[0] = row_offset[row][0];
					currentCell[2] = row_offset[row + 1][0];
					// top bound of the next row
					if (Y <= currentCell[2]) {
						break;
					}
				}
				// remember found row
				row_found = row;
				// if loop exceeds, then set bounds for the last row (offset for the last row doesn't work in IE8, so use table bounds) 
				if (row === row_offset.length - 1) {
					currentCell[0] = row_offset[row][0];
					currentCell[2] = tables[table].offset[2];
				}
				// do loop - needed for rowspaned cells (if there is any)
				do {
					// set the number of cells in the selected row
					cells = tables[table].rows[row].cells.length - 1;
					// find current cell (X mouse position between cell offset left and right)
					for (cell = cells; cell >= 0; cell--) {
						// row left offset + cell left offset
						currentCell[3] = row_offset[row][3] + tables[table].rows[row].cells[cell].offsetLeft;
						// cell right offset is left offset + cell width  
						currentCell[1] = currentCell[3] + tables[table].rows[row].cells[cell].offsetWidth;
						// is mouse pointer is between left and right offset, then cell is found
						if (currentCell[3] <= X && X <= currentCell[1]) {
							break;
						}
					}
				} // if table contains rowspaned cells and mouse pointer is inside table but cell was not found (hmm, rowspaned cell - try in upper row)
				while (tables[table].redips_rowspan && cell === -1 && row-- > 0);
				// if cell < 0 or row < 0 then use last possible location
				if (row < 0 || cell < 0) {
					table = table_old;
					row = row_old;
					cell = cell_old;
				}
				// current cell found but if current row differ from previously found row (thanks too while loop with row--)
				// then test if Y is inside current cell
				// (this should prevent case where TD border > 1px and upper colspaned row like in example15)
				// logic will end in upper colspaned row while current row will not move - and that was wrong
				else if (row !== row_found) {
					// recalculate top and bottom row offset (again)
					currentCell[0] = row_offset[row][0];
					currentCell[2] = currentCell[0] + tables[table].rows[row].cells[cell].offsetHeight;
					// if Y is outside of the current row, return previous location 
					if (Y < currentCell[0] || Y > currentCell[2]) {
						table = table_old;
						row = row_old;
						cell = cell_old;
					}
				}
				// set current cell (for easier access in test below)
				cell_current = tables[table].rows[row].cells[cell];
				// if current cell has nested table then set currentCell.containTable property
				// needed in handler_onmousemove() - see around line 567
				// "table" property of cell (TD) is set in initialization phase inside init_tables()
				if ('table' in cell_current) {
					currentCell.containTable = 1;
				}
				else {
					currentCell.containTable = 0;
				}
				// if current cell isn't trash cell, then search for marks in class name
				if (cell_current.className.indexOf(REDIPS.drag.trash) === -1) {
					// search for 'only' class name
					only_found = cell_current.className.indexOf(REDIPS.drag.only.cname) > -1 ? true : false;
					// if current cell is marked with 'only' class name
					if (only_found === true) {
						// marked cell "only" found, test for defined pairs (DIV id -> class name)
						// means to bypass this code
						if (cell_current.className.indexOf(only.div[obj.id]) === -1) {
							// if old location exists then assign old location
							if ((table_old !== null && row_old !== null && cell_old !== null)) {
								table = table_old;
								row = row_old;
								cell = cell_old;
							}
							break;
						}
					}
					// DIV objects marked with "only" can't be placed to other cells (if property "other" is "deny")
					else if (only.div[obj.id] !== undefined && only.other === 'deny') {
						// if old location exists then assign old location
						if ((table_old !== null && row_old !== null && cell_old !== null)) {
							table = table_old;
							row = row_old;
							cell = cell_old;
						}
						break;						
					}
					else {
						// search for 'mark' class name
						mark_found = cell_current.className.indexOf(REDIPS.drag.mark.cname) > -1 ? true : false;
						// if current cell is marked and access type is 'deny' or current cell isn't marked and access type is 'allow'
						// then return previous location
						if ((mark_found === true && REDIPS.drag.mark.action === 'deny') || (mark_found === false && REDIPS.drag.mark.action === 'allow')) {
							// marked cell found, but make exception if defined pairs (DIV id -> class name) exists
							// means to bypass code this code
							if (cell_current.className.indexOf(mark.exception[obj.id]) === -1) {
								// if old location exists then assign old location
								if ((table_old !== null && row_old !== null && cell_old !== null)) {
									table = table_old;
									row = row_old;
									cell = cell_old;
								}
								break;
							}
						}
					}
				}
				// test if current cell is defined as single
				single_cell = cell_current.className.indexOf('single') > -1 ? true : false;
				// if drop_option == single or current cell is single and current cell has child nodes then test if cell is occupied
				if ((REDIPS.drag.drop_option === 'single' || single_cell) && cell_current.childNodes.length > 0) {
					// if cell has only one node and that is text node then break - because this is empty cell
					if (cell_current.childNodes.length === 1 && cell_current.firstChild.nodeType === 3) {
						break;
					}
					// define and set has_content flag to false
					has_content = false;
					// open loop for each child node and jump out if 'drag' className found
					for (i = cell_current.childNodes.length - 1; i >= 0; i--) {
						if (cell_current.childNodes[i].className && cell_current.childNodes[i].className.indexOf('drag') > -1) {
							has_content = true;
							break;
						} 
					}
					// if cell has content and old position exists ...
					if (has_content && table_old !== null && row_old !== null && cell_old !== null) {
						// .. and current position is different then source position then return previous position
						if (table_source !== table || row_source !== row || cell_source !== cell) {
							table = table_old;
							row = row_old;
							cell = cell_old;
							break;
						}
					}
				}
				// if current cell is marked as row_handler
				row_handler = cell_current.className.indexOf('rowhandler') > -1 ? true : false;
				// current cell is marked as row handler and user is dragging table content (do not enable)  
				if (row_handler && mode === 'cell') {
					// if old location exists then assign old location
					if ((table_old !== null && row_old !== null && cell_old !== null)) {
						table = table_old;
						row = row_old;
						cell = cell_old;
					}
					break;
				}
				// break table loop 
				break;
			}
		}
	};



	// function sets color for the current table cell and remembers previous position and color
	// (it's called twice in handler_onmousemove)
	set_position = function () {
		// in case if ordinary element is placed inside 'deny' table cell
		if (table < tables.length && table !== null && row !== null && cell !== null) {
			// remember background color before setting the new background color
			bgcolor_old = get_bgcolor(table, row, cell);
			// set background color to the current table cell
			set_bgcolor(table, row, cell, [REDIPS.drag.hover_color]);
			// remember current position (for table, row and cell)
			table_old = table;
			row_old = row;
			cell_old = cell;
		}
	};



	// function sets background color, input parameters are:
	// t - table
	// r - row
	// c - cell (or column)
	// color - (Array) background color
	// if color has only one value and REDIPS.drag works in "row" mode, then apply this color to all table cells
	set_bgcolor = function (t, r, c, color) {
		// reference to the table row and loop variable
		var tr, i;
		// if drag mode is "cell"
		if (mode === 'cell') {
			tables[t].rows[r].cells[c].style.backgroundColor = color[0];
		}
		// or drag mode is "row"
		else {
			// set reference to the current table row
			tr = tables[t].rows[r];
			// set colors to table cells (respectively) or first color to all cells (in case of settings hover to the row)
			for (i = 0; i < tr.cells.length; i++) {
				tr.cells[i].style.backgroundColor = color[i] ? color[i] : color[0];
			}
		}
	};



	// function returns background color as array for the input parameters table, row and cell; input parameters are:
	// t - table
	// r - row
	// c - cell (or column)
	get_bgcolor = function (t, r, c) {
		var color = [],	// define color as array
			tr,			// reference to the table row
			i;			// loop variable
		// if drag mode is "cell" color array will have only one value
		if (mode === 'cell') {
			color[0] = tables[t].rows[r].cells[c].style.backgroundColor;
		}
		// if drag mode is "row", then color array will contain color for each table cell
		else {
			// set reference to the current table row
			tr = tables[t].rows[r];
			// remember color for each table cell
			for (i = 0; i < tr.cells.length; i++) {
				color[i] = tr.cells[i].style.backgroundColor;
			}
		}
		// return background color as array
		return color;
	};



	// function returns array of box bounds (offset) top, right, bottom, left
	// used in calculate_cells and onmousedown event handler
	// type defines if function will include scrollLeft / scrollTop (needed for scrollable container calculation in calculate_cells) 
	box_offset = function (box, position, box_scroll) {
		var scrollPosition,	// get scroll position
			oLeft = 0,		// define offset left (take care of horizontal scroll position)
			oTop  = 0,		// define offset top (take care od vertical scroll position)
			box_old = box;	// remember box object
		// if table_position is undefined, '' or 'page_scroll' then include page scroll offset
		if (position !== 'fixed') {
			scrollPosition = getScrollPosition();	// get scroll position
			oLeft = 0 - scrollPosition[0];			// define offset left (take care of horizontal scroll position)
			oTop  = 0 - scrollPosition[1];			// define offset top (take care od vertical scroll position)
		}
		// climb up through DOM hierarchy (getScrollPosition() takes care about page scroll positions)
		if (box_scroll === undefined || box_scroll === true) {
			do {
				oLeft += box.offsetLeft - box.scrollLeft;
				oTop += box.offsetTop - box.scrollTop;
				box = box.offsetParent;
			}
			while (box && box.nodeName !== 'BODY');
		}
		// climb up to the BODY element but without scroll positions
		else {
			do {
				oLeft += box.offsetLeft;
				oTop += box.offsetTop;
				box = box.offsetParent;
			}
			while (box && box.nodeName !== 'BODY');
		}
		// return box offset array
		//        top                 right,                     bottom           left
		return [ oTop, oLeft + box_old.offsetWidth, oTop + box_old.offsetHeight, oLeft ];
	};



	// calculates table row offsets (cells dimensions) and save to the tables array
	calculate_cells = function () {
		var i, j,		// local variables used in loops
			row_offset,	// row box
			position,	// if element (table or table container) has position:fixed then "page scroll" offset should not be added
			cb;			// box offset for container box (cb)
		// open loop for each HTML table inside id=drag (table array is initialized in init() function)
		for (i = 0; i < tables.length; i++) {
			// initialize row_offset array
			row_offset = [];
			// set table style position (to exclude "page scroll" offset from calculation if needed) 
			position = get_style(tables[i], 'position');
			// if table doesn't have style position:fixed then table container should be tested
			if (position !== 'fixed') {
				position = get_style(tables[i].parentNode, 'position');
			}
			// backward loop has better perfomance
			for (j = tables[i].rows.length - 1; j >= 0; j--) {
				row_offset[j] = box_offset(tables[i].rows[j], position);
			}
			// save table informations (table offset and row offsets)
			tables[i].offset = box_offset(tables[i], position);
			tables[i].row_offset = row_offset;
		}
		// calculate box offset for the div id=drag
		div_box = box_offset(div_drag);
		// update scrollable container areas if needed
		for (i = 0; i < scrollable_container.length; i++) {
			// set container box style position (to exclude page scroll offset from calculation if needed) 
			position = get_style(scrollable_container[i].div, 'position');
			// get DIV container offset with or without "page scroll" and excluded scroll position of the content
			cb = box_offset(scrollable_container[i].div, position, false);
			// prepare scrollable container areas
			scrollable_container[i].offset = cb;
			scrollable_container[i].midstX = (cb[1] + cb[3]) / 2;
			scrollable_container[i].midstY = (cb[0] + cb[2]) / 2;
		}
	};



	// function returns scroll positions in array
	getScrollPosition = function () {
		// define local scroll position variables
		var scrollX, scrollY;
		// Netscape compliant
		if (typeof(window.pageYOffset) === 'number') {
			scrollX = window.pageXOffset;
			scrollY = window.pageYOffset;
		}
		// DOM compliant
		else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			scrollX = document.body.scrollLeft;
			scrollY = document.body.scrollTop;
		}
		// IE6 standards compliant mode
		else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			scrollX = document.documentElement.scrollLeft;
			scrollY = document.documentElement.scrollTop;
		}
		// needed for IE6 (when vertical scroll bar was on the top)
		else {
			scrollX = scrollY = 0;
		}
		// return scroll positions
		return [ scrollX, scrollY ];
	};



	// horizontal auto scroll function
	// input parameter is scroll object - "so" (window or DIV element)
	autoscrollX = function (so) {
		var pos,			// left style position
			old,			// old window scroll position (needed for window scrolling)
			scrollPosition,	// define current scroll position
			maxsp,			// maximum scroll position
			edgeCrossed,	// crossed edge for window and scrollable container
			X = pointer.x,	// define pointer X position
			Y = pointer.y;	// define pointer Y position
		// if mouseup then stop handling "current cell"
		if (edge.flag.x > 0) {
			// calculate cell (autoscroll is working)
			calculate_cells();
			// set current table row and table cell
			set_trc();
			// set current table, row and cell if mouse pointer is inside DIV id="drag"
			if (X < div_box[1] && X > div_box[3] && Y < div_box[2] && Y > div_box[0]) {
				cell_changed();
			}
		}
		// save scroll object to the global variable for the first call from handler_onmousemove
		// recursive calls will not enter this code and reference to the scroll_object will be preserved
		if (typeof(so) === 'object') {
			scroll_object = so;
		}
		// window autoscroll (define current, old and maximum scroll position)
		if (scroll_object === window) {
			scrollPosition = old = getScrollPosition()[0];
			maxsp = scroll_width - window_width;
			edgeCrossed = edge.page.x;
		}
		// scrollable container (define current and maximum scroll position)
		else {
			scrollPosition = scroll_object.scrollLeft;
			maxsp = scroll_object.scrollWidth - scroll_object.clientWidth;
			edgeCrossed = edge.div.x;
		}
		// if scrolling is possible
		if (edge.flag.x > 0 && ((edgeCrossed < 0 && scrollPosition > 0) || (edgeCrossed > 0 && scrollPosition < maxsp))) {
			// if object is window
			if (scroll_object === window) {
				// scroll window
				window.scrollBy(edgeCrossed, 0);
				// get new window scroll position (after scrolling)
				// because at page top or bottom edgeY can be bigger then the rest of scrolling area
				// it will be nice to know how much was window scrolled after scrollBy command 
				scrollPosition = getScrollPosition()[0];
				// get current object top style
				pos = parseInt(obj.style.left, 10);
				if (isNaN(pos)) {
					pos = 0;
				}
			}
			// or scrollable container
			else {
				scroll_object.scrollLeft += edgeCrossed;
			}
			// recursive autoscroll call 
			setTimeout(REDIPS.drag.autoscrollX, REDIPS.drag.speed);
		}
		// autoscroll is ended: element is out of the page edge or maximum position is reached (left or right)
		else {
			// return onscroll event handler (to window or div element)
			REDIPS.event.add(scroll_object, 'scroll', calculate_cells);
			// reset auto scroll flag X
			edge.flag.x = 0;
			// reset current cell position
			currentCell = [0, 0, 0, 0];
		}
	};


	
	// vertical auto scroll function
	// input parameter is scroll object - "so" (window or DIV element)
	autoscrollY = function (so) {
		var pos,			// top style position
			old,			// old window scroll position (needed for window scrolling)
			scrollPosition,	// define current scroll position
			maxsp,			// maximum scroll position
			edgeCrossed,	// crossed edge for window and scrollable container
			X = pointer.x,	// define pointer X position
			Y = pointer.y;	// define pointer Y position
		// if mouseup then stop handling "current cell"
		if (edge.flag.y > 0) {
			// calculate cell (autoscroll is working)
			calculate_cells();
			// set current table row and table cell
			set_trc();
			// set current table, row and cell if mouse pointer is inside DIV id="drag"
			if (X < div_box[1] && X > div_box[3] && Y < div_box[2] && Y > div_box[0]) {
				cell_changed();
			}
		}
		// save scroll object to the global variable for the first call from handler_onmousemove
		// recursive calls will not enter this code and reference to the scroll_object will be preserved
		if (typeof(so) === 'object') {
			scroll_object = so;
		}
		// window autoscroll (define current, old and maximum scroll position)
		if (scroll_object === window) {
			scrollPosition = old = getScrollPosition()[1];
			maxsp = scroll_height - window_height;
			edgeCrossed = edge.page.y;
		}
		// scrollable container (define current and maximum scroll position)
		else {
			scrollPosition = scroll_object.scrollTop;
			maxsp = scroll_object.scrollHeight - scroll_object.clientHeight;
			edgeCrossed = edge.div.y;
		}
		// if scrolling is possible
		if (edge.flag.y > 0 && ((edgeCrossed < 0 && scrollPosition > 0) || (edgeCrossed > 0 && scrollPosition < maxsp))) {
			// if object is window
			if (scroll_object === window) {
				// scroll window
				window.scrollBy(0, edgeCrossed);
				// get new window scroll position (after scrolling)
				// because at page top or bottom edgeY can be bigger then the rest of scrolling area
				// it will be nice to know how much was window scrolled after scrollBy command 
				scrollPosition = getScrollPosition()[1];
				// get current object top style
				pos = parseInt(obj.style.top, 10);
				if (isNaN(pos)) {
					pos = 0;
				}
			}
			// or scrollable container
			else {
				scroll_object.scrollTop += edgeCrossed;
			}
			// recursive autoscroll call 
			setTimeout(REDIPS.drag.autoscrollY, REDIPS.drag.speed);
		}
		// autoscroll is ended: element is out of the page edge or maximum position is reached (top or bottom)
		else {
			// return onscroll event handler (to window or div element)
			REDIPS.event.add(scroll_object, 'scroll', calculate_cells);
			// reset auto scroll flag Y
			edge.flag.y = 0;
			// reset current cell position
			currentCell = [0, 0, 0, 0];
		}
	};
	


	// clone object
	clone_object = function () {
		var obj_new = obj.cloneNode(true),	// clone object 
			offset,							// offset of the original object
			offset_dragged;					// offset of the new object (cloned)
		// append cloned element to the DIV id="obj_new"
		document.getElementById('obj_new').appendChild(obj_new);
		// get IE (all versions) to allow dragging outside the window (?!)
		// this was needed here also -  despite setCaputure in onmousedown
		if (obj_new.setCapture) {
			obj_new.setCapture();
		}
		// set high z-index
		obj_new.style.zIndex = 999;
		// set position style to "fixed"
		obj_new.style.position = 'fixed';
		// define offset for original and cloned element
		offset = box_offset(obj);
		offset_dragged = box_offset(obj_new);
		// calculate top and left offset of the new object
		obj_new.style.top   = (offset[0] - offset_dragged[0]) + 'px';
		obj_new.style.left  = (offset[3] - offset_dragged[3]) + 'px';
		// set onmousedown/ondblclick event handler for the new object
		obj_new.onmousedown = handler_onmousedown;
		obj_new.ondblclick = handler_ondblclick;
		// remove clone from the class name of the new object
		obj_new.className = obj_new.className.replace('clone', '');
		// if counter is undefined, set 0
		if (cloned_id[obj.id] === undefined) {
			cloned_id[obj.id] = 0;
		}
		// set id for cloned element (append id of "clone" element - tracking the origin)
		// id is separated with "c" ("_" is already used to compound id, table, row and column)  
		obj_new.id = obj.id + 'c' + cloned_id[obj.id];
		// increment cloned_id for cloned element
		cloned_id[obj.id] += 1;
		// I assumed that custom properties will be automatically cloned - but not(?!)
		obj_new.redips_container = obj.redips_container;
		obj_new.redips_enabled = obj.redips_enabled;
		// remember previous object (original element)
		REDIPS.drag.obj_old = obj_old = obj;
		// set reference to the cloned object	
		REDIPS.drag.obj = obj = obj_new;
	};



	// after cloning object, take care about climit1_X or climit2_X classnames
	// function is called from handler_onmouseup
	// obj_old is reference to the clone object not cloned
	clone_limit = function () {
		// declare local variables 
		var match_arr,	// match array
			limit_type,	// limit type (1 - clone becomes "normal" drag element atlast; 2 - clone element stays immovable)
			limit,		// limit number
			classes;	// class names of clone element
		// set classes of clone object
		classes = obj_old.className;
		// match climit class name		
		match_arr = classes.match(/climit(\d)_(\d+)/);
		// if class name contains climit option
		if (match_arr !== null) {
			// prepare limit_type (1 or 2) and limit
			limit_type = parseInt(match_arr[1], 10); 
			limit = parseInt(match_arr[2], 10);
			// decrease limit number and cut out "climit" class
			limit -= 1;
			classes = classes.replace(/climit\d_\d+/g, '');
			// test if limit drop to zero
			if (limit <= 0) {
				// no more cloning, cut "clone" from class names
				classes = classes.replace('clone', '');
				// if limit type is 2 then clone object becomes immovable
				if (limit_type === 2) {
					// cut "drag" class
					classes = classes.replace('drag', '');
					// remove onmousedown event handler
					obj_old.onmousedown = null;
					// set cursor style to auto
					obj_old.style.cursor = 'auto';
					// call myhandler_clonedend2 handler
					REDIPS.drag.myhandler_clonedend2(); 
				}
				else {
					// call myhandler_clonedend1 handler
					REDIPS.drag.myhandler_clonedend1();
				}
			}
			// return "climit" class but with decreased limit_number
			else {
				classes = classes + ' climit' + limit_type + '_' + limit;
			}
			// normalize spaces and return classes to the clone object 
			classes = classes.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
			obj_old.className = classes;
		}
	};



	// function returns true or false if element needs to have control
	// true - click on element will not start dragging (element has its own control)
	// false - click on element will start dragging
	elementControl = function (evt) {
		// declare elementControl flag, source tag name and element classes
		var flag = false,
			srcName,
			classes,						// class names of DIV element;
			regex_nodrag = /\bnodrag\b/i;	// regular expression to search "nodrag" class name 
		// set source tag name and classes for IE and FF
		if (evt.srcElement) {
			srcName = evt.srcElement.nodeName;
			classes = evt.srcElement.className;
		}
		else {
			srcName = evt.target.nodeName;
			classes = evt.target.className;
		}
		// set flag (true or false) for clicked elements
		switch (srcName) {
		case 'A':
		case 'INPUT':
		case 'SELECT':
		case 'OPTION':
		case 'TEXTAREA':
			flag = true;
			break;
		// none of form elements
		default:
			// if element has "nodrag" class name then dragging will be skipped 
			if (regex_nodrag.test(classes)) {
				flag = true;
			}
			else {
				flag = false;
			}
		}
		// return flag flag
		return flag;
	};


	
	// delete DIV object
	trash_delete = function () {
		var div_text = 'element',	// div content (inner text)
			border;					// border color (green or blue)
		// find the border color of DIV element (t1 - green, t2 - blue, t3 - orange)
		if (obj.className.indexOf('t1') > 0) {
			border = 'green';
		}
		else if (obj.className.indexOf('t2') > 0) {
			border = 'blue';
		}
		else {
			border = 'orange';
		}
		// set div text (cross browser)
		if (obj.getElementsByTagName('INPUT').length || obj.getElementsByTagName('SELECT').length) {
			div_text = 'form element';
		}
		else if (obj.innerText || obj.textContent) {
			div_text = '"' + (obj.innerText || obj.textContent) + '"';
		}
		// ask if user is sure
		if (confirm('Delete ' + div_text + ' (' + border + ') from\n table ' + table_source + ', row ' + row_source + ' and column ' + cell_source + '?')) {
			// yes, user is sure only call myhandler_deleted function
			REDIPS.drag.myhandler_deleted();
			// if object is cloned, update climit1_X or climit2_X classname
			if (cloned_flag === 1) {
				clone_limit();
			}
		}
		// user is unsure - do undelete
		else {
			// undelete ordinary movable element
			if (cloned_flag !== 1) {
				// append removed object to the source table cell
				tables[table_source].rows[row_source].cells[cell_source].appendChild(obj);
				// and recalculate table cells because undelete can change row dimensions 
				calculate_cells();
			}
			// call undeleted handler
			REDIPS.drag.myhandler_undeleted();	
		}
	};



	/**
	 * Method attaches/detaches onmousedown, ondblclick events and attaches onscroll event for DIV elements.
	 * First parameter can be (string)"init", (boolean)true or (boolean)false.
	 * If first parameter is (string)"init" then DIV elements will be enabled and onscroll attached to the DIV class="scroll".
	 * If first parameter is (boolean)true or (boolean)false and second parameter isn't defined then DIV elements in current container will be enabled/disabled.
	 * @param {String/Boolean} enable_flag Enable/disable element (or element container like table, dragging container ...).
	 * @param {String/HTMLElement} [div_id] Element id (or dragging area) to enable/disable. Parameter is optional and defines DIV object or DIV id of element to enable/disable.
	 * @param {String} [type] Definition if div_id is element or element container. Parameter is optional and defines enable/disable for elements in container (div_id in this context is id of element container).
	 */
	enable_drag = function (enable_flag, div_id, type) {
		// define local variables
		var i, j, k,		// local variables used in loop
			divs = [],		// collection of div elements contained in tables or one div element
			tbls = [],		// collection of tables inside scrollable container
			borderStyle,	// border style (solid or dotted)
			opacity,		// (integer) set opacity for enabled / disabled elements
			cursor,			// cursor style (move or auto)
			overflow,		// css value of overflow property
			autoscroll,		// boolean - if scrollable container will have autoscroll option (default is true)
			enabled,		// enabled property (true or false) 
			cb,				// box offset for container box (cb)
			handler1,		// onmousedown or null event handler
			handler2,		// ondblclick or null event handler
			position,		// if table container has position:fixed then "page scroll" offset should not be added
			regex_drag = /\bdrag\b/i,	// regular expression to search "drag" class name
			regex_noautoscroll = /\bnoautoscroll\b/i;	// regular expression to search "noautoscroll" class name
		// set opacity for disabled elements from public property "opacity_disabled" 
		opacity = REDIPS.drag.opacity_disabled;
		// define onmousedown/ondblclick handlers and styles
		if (enable_flag === true || enable_flag === 'init') {
			handler1 = handler_onmousedown;
			handler2 = handler_ondblclick;
			borderStyle = REDIPS.drag.border;
			cursor = 'move';
			enabled = true;
		}
		// else remove event handlers
		else {
			handler1 = handler2 = null;
			borderStyle = REDIPS.drag.border_disabled;
			cursor = 'auto';
			enabled = false;
		}
		// collect DIV elements inside current drag area (drag elements and scrollable containers)
		// e.g. enable_drag(true)
		if (div_id === undefined) {
			divs = div_drag.getElementsByTagName('div');
		}
		// collect div elements inside container
		// e.g. enable_drag(true, 'drag1', 'container')
		else if (typeof(div_id) === 'string' && type === 'container') {
			divs = document.getElementById(div_id).getElementsByTagName('div');
		}
		// "type" parameter is not "container" and "div_id" is string - assuming div_id is id of one element to enable/disable
		// e.g. enable_drag(true, 'drag1')
		else if (typeof(div_id) === 'string') {
			divs[0] = document.getElementById(div_id);
		}
		// prepare array with one div element
		// e.g. enable_drag(true, el)
		else {
			divs[0] = div_id;
		}
		// attach onmousedown event handler only to DIV elements that have "drag" in class name
		// allow other div elements inside <div id="drag" ...
		for (i = 0, j = 0; i < divs.length; i++) { 
			if (regex_drag.test(divs[i].className)) {
				// DIV elements should have only onmousedown/ondblclick attached (using traditional event registration model)
				// I had problems with using advanced event registration model regarding text selection and dragging text selection
				divs[i].onmousedown = handler1;
				divs[i].ondblclick = handler2;
				divs[i].style.borderStyle = borderStyle;
				divs[i].style.cursor = cursor;
				// add enabled property to the DIV element (true or false)
				divs[i].redips_enabled = enabled;
				// add reference to the DIV container in initialization process
				// this property should not be changed in later element enable/disable
				if (enable_flag === 'init') {
					divs[i].redips_container = div_drag;
				}
				// remove opacity mask
				else if (enable_flag === true && typeof(opacity) === 'number') {
					divs[i].style.opacity = '';
					divs[i].style.filter = '';						
				}
				// set opacity for disabled elements
				else if (enable_flag === false && typeof(opacity) === 'number') {
					divs[i].style.opacity = opacity / 100;
					divs[i].style.filter = 'alpha(opacity=' + opacity + ')';					
				}
			}
			// attach onscroll event to the DIV element in init phase only if DIV element has overwflow other than default value 'visible'
			// and that means scrollable DIV container
			else if (enable_flag === 'init') {
				// ask for overflow style
				overflow = get_style(divs[i], 'overflow');
				// if DIV is scrollable
				if (overflow !== 'visible') {
					// define onscroll event handler for scrollable container
					REDIPS.event.add(divs[i], 'scroll', calculate_cells);
					// set container box style position (to exclude page scroll offset from calculation if needed) 
					position = get_style(divs[i], 'position');
					// get DIV container offset with or without "page scroll" and excluded scroll position of the content
					cb = box_offset(divs[i], position, false);
					// search for noautoscroll option
					if (regex_noautoscroll.test(divs[i].className)) {
						autoscroll = false;
					}
					else {
						autoscroll = true;
					}
					// prepare scrollable container areas
					scrollable_container[j] = {
						div			: divs[i],				// reference to the scrollable container
						offset		: cb,					// box offset of the scrollable container
						midstX		: (cb[1] + cb[3]) / 2,	// middle X
						midstY		: (cb[0] + cb[2]) / 2,	// middle Y
						autoscroll	: autoscroll			// autoscroll enabled or disabled (true or false)
					};
					// search for tables inside scrollable container
					tbls = divs[i].getElementsByTagName('table');
					// loop goes through found tables inside scrollable area 
					for (k = 0; k < tbls.length; k++) {
						// add a reference to the corresponding scrollable area
						tbls[k].sca = scrollable_container[j];
					}
					// increase scrollable container counter
					j++;
				}
			}
		}
	};



	// method returns style value of requested object and style name
	// http://www.quirksmode.org/dom/getstyles.html
	get_style = function (el, style_name) {
		var val; // value of requested object and property
		if (el && el.currentStyle) {
			val = el.currentStyle[style_name];
		}
		else if (el && window.getComputedStyle) {
			val = document.defaultView.getComputedStyle(el, null).getPropertyValue(style_name);
		}
		return val;
	};



	// scan table content
	// table ordinal defines table to scan (so it could be first, second, third table ...)
	// if input parameter is not defined, function will prepare parameters for all tables
	save_content = function (tbl) {
		var query = '',		// define query parameter
			tbl_start,		// table loop starts from tbl_start parameter
			tbl_end,		// table loop ends on tbl_end parameter
			tbl_rows,		// number of table rows
			cells,			// number of cells in the current row
			tbl_cell,		// reference to the table cell		
			t, r, c, d;		// variables used in for loops
		// sort "tables" array to the original order
		tables.sort(function (a, b) {
			return a.redips_idx - b.redips_idx;
		});
		// if input parameter is undefined, then method will return content from all tables
		if (tbl === undefined) {
			tbl_start = 0;
			tbl_end = tables.length - 1;
		}
		// if input parameter is out of range then method will return content from first table
		else if (tbl < 0 || tbl > tables.length - 1) {
			tbl_start = tbl_end = 0;
		}
		// else return content from specified table
		else {
			tbl_start = tbl_end = tbl;
		}
		// iterate through tables
		for (t = tbl_start; t <= tbl_end; t++) {
			// define number of table rows
			tbl_rows = tables[t].rows.length;
		
			// iterate through each table row
			for (r = 0; r < tbl_rows; r++) {
				// set the number of cells in the current row
				cells = tables[t].rows[r].cells.length;
				// iterate through each table cell
				for (c = 0; c < cells; c++) {
					// set reference to the table cell
					tbl_cell = tables[t].rows[r].cells[c];
					// if cells isn't empty (no matter is it allowed or denied table cell) 
					if (tbl_cell.childNodes.length > 0) {
						// cell can contain many DIV elements
						for (d = 0; d < tbl_cell.childNodes.length; d++) {
							// childNodes should be DIVs, not \n childs
							if (tbl_cell.childNodes[d].nodeName === 'DIV') { // and yes, it should be uppercase
								query += 'p[]=' + tbl_cell.childNodes[d].id + '_' + t + '_' + r + '_' + c + '&';
							}
						}
					}
				}
			}
		}
		// cut last '&' from query string
		query = query.substring(0, query.length - 1);
		// sort "tables" array according to redips_sort (tables with higher redips_sort parameter will go to the array top)
		// otherwise nested tables will not work after saving content
		tables.sort(function (a, b) {
			return b.redips_sort - a.redips_sort;
		});
		// return prepared parameters (if tables are empty, returned value could be empty too) 
		return query;
	};



	// relocate all objects from source cell to the destination table cell
	// if input parameter is not defined, function will prepare parameters for the first table
	relocate = function (from, to) {
		var i, // local variable
			childnodes_length; // number of child nodes 
		// test if "from" cell is equal to "to" cell then do nothing
		if (from === to) {
			return;
		} 
		// define childnodes length before loop (not in loop because NodeList objects in the DOM are live)
		childnodes_length = from.childNodes.length;
		// loop through all child nodes
		for (i = 0; i < childnodes_length; i++) {
			to.appendChild(from.childNodes[0]); // '0', not 'i' because NodeList objects in the DOM are live
		}	
	};



	// method will prepare parameters for object animation to the destination table, row and cell
	// ip (input parameter) is object
	// input parameter "target" is array: [ tableIndex, rowIndex, cellIndex ]
	// if "target" parameter is undefined then current location will be used
	// method returns references to obj and obj_old elements
	move_object = function (ip) {
		var p = {'direction': 1},	// param object (with default direction)
			x1, y1,	w1, h1,			// coordinates and width/height of object to animate
			x2, y2,	w2, h2,			// coordinates and width/height of target cell
			row, col,				// row and cell indexes
			dx, dy,					// delta x and delta y
			pos, i,					// local variables needed for calculation coordinates and settings the first point
			target;
		// set callback function - it will be called after animation is finished
		p.callback = ip.callback;
		// define obj and obj_old (reference of the object to animate - DIV element or row handler)
		// ip.id - input parameter obj_id
		if (typeof(ip.id) === 'string') {
			p.obj = p.obj_old = document.getElementById(ip.id);
		}
		// test if animation mode is "row" (mode, source and target properties should be defined)
		if (ip.mode === 'row') {
			p.mode = 'row';
			// find table index for source table (source[0] contains original table index)
			i = get_table_index(ip.source[0]);
			// define source row index from input parameter object
			row = ip.source[1];
			// define source row
			p.obj_old = tables[i].rows[row];
			// set reference to the mini table - cloned from source row (TABLE element)
			p.obj = row_clone(p.obj_old);
		}
		// test if element is row handler
		else if (p.obj.className.indexOf('row') > -1) {
			p.mode = 'row';
			// loop up until TR element is found
			while (p.obj && p.obj.nodeName !== 'TR') {
				p.obj = p.obj.parentNode;
		    }
			// remember reference to the source row (TR element)
			p.obj_old = p.obj;
			// set reference to the mini table - cloned from source row (TABLE element)
			p.obj = row_clone(p.obj_old);
		}
		// animation mode is "cell"
		else {
			p.mode = 'cell';
		}
		// set high z-index
		p.obj.style.zIndex = 999;
		// if clicked element doesn't belong to the current container then context should be changed
		if (div_drag !== p.obj.redips_container) {
			div_drag = p.obj.redips_container;
			init_tables();
		}
		// set width, height and coordinates for source position of object
		pos = box_offset(p.obj);
		w1 = pos[1] - pos[3];
		h1 = pos[2] - pos[0];
		x1 = pos[3];
		y1 = pos[0];
		// if target parameted is undefined then use current position in table 
		if (ip.target === undefined) {
			ip.target = get_position();
		}
		// set target table, row and cell indexes (needed for moving table row)
		// table index is index from array not original table index
		p.target = ip.target;
		// find table index because tables array is sorted on every element click (target[0] contains original table index)
		i = get_table_index(ip.target[0]);
		// set index for row and cell (target input parameter is array)
		row = ip.target[1];
		col = ip.target[2];
		// set reference to the target cell
		p.target_cell = tables[i].rows[row].cells[col];
		// set width, height and coordinates of target cell
		if (p.mode === 'cell') {
			pos = box_offset(p.target_cell);
			w2 = pos[1] - pos[3];
			h2 = pos[2] - pos[0];
			// target coordinates are cell center including object dimensions
			x2 = pos[3] + (w2 - w1) / 2;
			y2 = pos[0] + (h2 - h1) / 2;
		}
		// set width, height and coordinates of target row
		else {
			pos = box_offset(tables[i].rows[row]);
			w2 = pos[1] - pos[3];
			h2 = pos[2] - pos[0];
			x2 = pos[3];
			y2 = pos[0];
		}
		// calculate delta x and delta y
		dx = x2 - x1;
		dy = y2 - y1;
		// set style to fixed to allow dragging DIV object
		p.obj.style.position = 'fixed';
		// if line is more horizontal
		if (Math.abs(dx) > Math.abs(dy)) {
			// set path type
			p.type = 'horizontal';
			// set slope (m) and y-intercept (b)
			// y = m * x + b
			p.m = dy / dx;
			p.b = y1 - p.m * x1;
			// parameters needed for delay calculation (based on parabola)
			p.k1 = (x1 + x2) / (x1 - x2);
			p.k2 = 2 / (x1 - x2);
			// define animation direction
			if (x1 > x2) {
				p.direction = -1;
			}
			// set first and last point
			i = x1;
			p.last = x2;
		}
		// line is more vertical
		else {
			// set path type
			p.type = 'vertical';
			// set slope (m) and y-intercept (b)
			// y = m * x + b
			p.m = dx / dy;
			p.b = x1 - p.m * y1;
			// parameters needed for delay calculation (based on parabola)
			p.k1 = (y1 + y2) / (y1 - y2);
			p.k2 = 2 / (y1 - y2);
			// define animation direction
			if (y1 > y2) {
				p.direction = -1;
			}
			// set first and last point
			i = y1;
			p.last = y2;
		}
		// start animation
		animation(i, p);
		// return reference of obj and obj_old elements
		// "cell" mode
		// obj - dragged element
		// obj_old - dragged element
		// "row" mode
		// obj - table_mini
		// obj_old - source row
		return [p.obj, p.obj_old];
	};



	// object animation
	// input parameters are first (current) point and 'p' object with following properties: 
	// obj: object to animate
	// target_cell: target table cell
	// last: last point
	// m:, b:  slope and y-intercept (needed for y = m * x + b)
	// k1:, k2:  needed for calculation 1 -> 0 -> 1 parameter (regarding current position)
	// direction: animation direction
	// type: line type (horizontal or vertical)
	animation = function (i, p) {
		// calculate parameter k (k goes 1 -> 0 -> 1 for start and end step)
		var k = (p.k1 - p.k2 * i) * (p.k1 - p.k2 * i),
			f;
		// calculate step and function of step (y = m * x + b)
		i = i + REDIPS.drag.animation_step * (4 - k * 3) * p.direction;
		f = p.m * i + p.b;
		// set element position
		if (p.type === 'horizontal') {
			p.obj.style.left = i + 'px';
			p.obj.style.top  = f + 'px';			
		}
		else {
			p.obj.style.left = f + 'px';
			p.obj.style.top  = i + 'px';
		}
		// if line is not finished then make recursive call
		if ((i < p.last && p.direction > 0) || ((i > p.last) && p.direction < 0)) {
			// recursive call for next step
			setTimeout(function () {
				animation(i, p);
			}, REDIPS.drag.animation_pause * k);
		}
		// animation is finished
		else {
			// return z-index and position style to 'static' (this is default element position) 
			p.obj.style.zIndex = -1;
			p.obj.style.position = 'static';
			// if moved element is cell then append element to the target cell
			if (p.mode === 'cell') { 
				p.target_cell.appendChild(p.obj);
			}
			// else element is row
			else {
				row_drop(p.target[0], p.target[1], p.obj);
			}
			// execute callback function if callback is defined
			if (typeof(p.callback) === 'function') {
				p.callback();
			}
		}
	};



	// method returns position as array with members tableIndex, rowIndex and cellIndex
	// input parameter is optional and can be: element id/reference, cell id/reference
	// if input parameter is undefined then function will return array with current and source positions
	get_position = function (ip) {
		var toi,		// table original index (because tables are sorted on every element click)
			toi_source,	// table original index (source table)
			ci, ri, ti,	// cellIndex, rowIndex and table index (needed for case if input parameter exists)
			el,			// element reference
			tbl,		// table reference
			arr = [];	// array to return
		// if input parameter is is undefined, then return current location and source location (array will contain 6 elements)
		if (ip === undefined) {
			// table original index (because tables are sorted on every element click)
			if (table < tables.length) {
				toi = tables[table].redips_idx;
			}
			// if any level of old position is undefined, then use source location
			else if (table_old === null || row_old === null || cell_old === null) {
				toi = tables[table_source].redips_idx;
			}
			// or use the previous location
			else {
				toi = tables[table_old].redips_idx;
			}
			// table source original index
			toi_source = tables[table_source].redips_idx;
			// prepare array to return (row, cell and row_source, cell_source are global variables)
			arr = [toi, row, cell, toi_source, row_source, cell_source];
		}
		// input parameter is defined (id or reference of table cell or any child of table cell) 
		else {
			// if input parameter is string (this should be element id), then set element reference
			if (typeof(ip) === 'string') {
				el = document.getElementById(ip);
			}
			// else, input parameter is reference
			else {
				el = ip;
			}
			// loop up until TD element (because "ip" could be the child element of table cell - DIV drag)
			while (el && el.nodeName !== 'TD') {
				el = el.parentNode;
		    }
			// node should be table cell
			if (el && el.nodeName === 'TD') {
				// define cellIndex and rowIndex 
				ci = el.cellIndex;
				ri = el.parentNode.rowIndex;
				// prepare start node for table search
				tbl = el.parentNode;
				// find table
				while (tbl && tbl.nodeName !== 'TABLE') {
					tbl = tbl.parentNode;
			    }
				// define table index
				ti = tbl.redips_idx;
				// prepare array with tableIndex, rowIndex and cellIndex (3 elements)
				arr = [ti, ri, ci];
			}
		}
		// return result array
		return arr;
	};
	

	/**
	 * Find table index - because tables array is sorted on every element click.
	 * @param {Integer} idx Table index of initial table order.
	 * @return {Integer} Returns current index from tables array.
	 */
	get_table_index = function (idx) {
		var i;
		for (i = 0; i < tables.length; i++) {
			if (tables[i].redips_idx === idx) {
				break;
			}
		}
		return i;
	};


	// function sets opacity to table row
	// input parameter is id (of row handler) or reference to element (source row or mini table), opacity level and optionally a color
	// el is reference to the table row or reference to the cloned mini table (when row is moved)
	row_opacity = function (el, opacity, color) {
		var	td,		// table cells
			i, j;	// loop variables
		// if input parameter is string (this should be element id), then set element reference
		if (typeof(el) === 'string') {
			el = document.getElementById(el);
			// el could be reference of the DIV class="drag row" (row handler)
			while (el && el.nodeName !== 'TABLE') {
				el = el.parentNode;
		    }
		}
		// if el is TR, then set background color to each cell (if needed) and apply opacity
		if (el.nodeName === 'TR') {
			// collect table cell from the row
			td = el.getElementsByTagName('td');
			// set opacity for DIV element
			for (i = 0; i < td.length; i++) {
				// set background color to table cell if needed
				td[i].style.backgroundColor = color ? color : '';
				// loop through child nodes of every table cell
				for (j = 0; j < td[i].childNodes.length; j++) {
					// apply styles only to Element nodes (not text nodes, attributes ...)
					// http://code.stephenmorley.org/javascript/dom-nodetype-constants/
					if (td[i].childNodes[j].nodeType === 1) {
						td[i].childNodes[j].style.opacity = opacity / 100;
						td[i].childNodes[j].style.filter = 'alpha(opacity=' + opacity + ')';
						//td[i].childNodes[j].style.visibility = 'hidden';
					}
				}
			}
		}
		// when row is moved then REDIPS.drag will create mini table with one row
		// all browsers (IE8, Opera11, FF3.6, Chrome10) can set opacity to the table
		else {
			el.style.opacity = opacity / 100; // set opacity for FF, Chrome, Opera
			el.style.filter = 'alpha(opacity=' + opacity + ')';  // set opacity for IE		
		}
	};


	//
	// public properties and methods
	//

	return {
		// public properties
		obj					: obj,				// (object) moved object
		obj_old				: obj_old,			// (object) previously moved object (before clicked or cloned)
		mode				: mode,				// (string) drag mode: "cell" or "row" (default is cell)
		source_cell			: source_cell,		// (object) source table cell (defined in onmousedown)
		previous_cell		: previous_cell,	// (object) previous table cell (defined in onmousemove)
		current_cell		: current_cell,		// (object) current table cell (defined in onmousemove)
		target_cell			: target_cell,		// (object) target table cell (defined in onmouseup)
		hover_color			: hover_color,		// (string) hover color
		bound				: bound,			// (integer) bound width for autoscroll
		speed				: speed,			// (integer) scroll speed in milliseconds
		only				: only,				// (object) table cells marked with "only" can accept defined DIV elements
		mark				: mark,				// (object) table cells marked with "mark" can be allowed or denied (with exceptions)
		border				: border,			// (string) border style for enabled element
		border_disabled		: border_disabled,	// (string) border style for disabled element
		opacity_disabled	: opacity_disabled,	// (integer) set opacity for disabled elements
		trash				: trash,			// (string) cell class name where draggable element will be destroyed		
		trash_ask			: trash_ask,		// (boolean) confirm object deletion (ask a question "Are you sure?" before delete)
		drop_option			: drop_option,		// (string) drop_option has three options: multiple, single and switch
		delete_cloned		: delete_cloned,	// (boolean) delete cloned div if the cloned div is dragged outside of any table
		cloned_id			: cloned_id,		// (array) needed for increment ID of cloned elements
		clone_shiftKey		: clone_shiftKey,	// (boolean) if true, elements could be cloned with pressed SHIFT key
		animation_pause		: animation_pause,	// animation pause (lower values mean the animation plays faster)
		animation_step		: animation_step,	// animation step (minimum is 1)

		// public methods
		init				: init,
		enable_drag			: enable_drag,
		save_content		: save_content,
		relocate			: relocate,			// method relocates objects from source cell to the target cell (source and target cells are input parameters)
		move_object			: move_object,		// method moves object to the destination table, row and cell
		get_position		: get_position,		// method returns position in format: tableIndex, rowIndex and cellIndex (input parameter is optional)
		row_opacity			: row_opacity,		// method sets opacity to table row (el, opacity, color)
		getScrollPosition	: getScrollPosition,// method returns scroll positions in array [ scrollX, scrollY ]
		get_style			: get_style,		// method returns style value of requested object and style name
		
		// autoscroll should be public because of setTimeout recursive call in autoscroll
		autoscrollX			: autoscrollX,
		autoscrollY			: autoscrollY,
		
		// needed for setting onmousedown/ondblclick event in myhandler actions  
		handler_onmousedown	: handler_onmousedown,
		handler_ondblclick	: handler_ondblclick,

		/*
		 * Action handlers
		 * Each handler sees REDIPS.drag.obj, REDIPS.drag.obj_old, REDIPS.drag.target_cell ... references
		 * Note: for the first dragging, REDIPS.drag.obj_old === REDIPS.drag.obj because REDIPS.drag.obj_old does not exist yet
		 */
		myhandler_clicked				: function () {},
		myhandler_dblclicked			: function () {},
		myhandler_moved					: function () {},
		myhandler_notmoved				: function () {},
		myhandler_dropped				: function () {},	// after element is dropped to the table
		myhandler_dropped_before		: function () {},	// before element is dropped to the table
		myhandler_switched				: function () {},
		myhandler_changed				: function () {},
		myhandler_cloned				: function () {},
		myhandler_clonedend1			: function () {},
		myhandler_clonedend2			: function () {},
		myhandler_notcloned				: function () {},
		myhandler_deleted				: function () {},
		myhandler_undeleted				: function () {},
		// row handlers
		myhandler_row_clicked			: function () {},
		myhandler_row_moved				: function () {},
		myhandler_row_notmoved			: function () {},
		myhandler_row_dropped			: function () {},
		myhandler_row_dropped_source	: function () {},	// row dropped to the source location
		myhandler_row_changed			: function () {}
		
	}; // end of public (return statement)	
	
}());




// if REDIPS.event isn't already defined (from other REDIPS file) 
if (!REDIPS.event) {
	REDIPS.event = (function () {
		var add,	// add event listener
			remove;	// remove event listener
		
		// http://msdn.microsoft.com/en-us/scriptjunkie/ff728624
		// http://www.javascriptrules.com/2009/07/22/cross-browser-event-listener-with-design-patterns/

		// add event listener
		add = function (obj, eventName, handler) {
			if (obj.addEventListener) {
				obj.addEventListener(eventName, handler, false);
			}
			else if (obj.attachEvent) {
				obj.attachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = handler;
			}
		};
	
		// remove event listener
		remove = function (obj, eventName, handler) {
			if (obj.removeEventListener) {
				obj.removeEventListener(eventName, handler, false);
			}
			else if (obj.detachEvent) {
				obj.detachEvent('on' + eventName, handler);
			}
			else {
				obj['on' + eventName] = null;
			}
		};
	
		return {
			add		: add,
			remove	: remove
		}; // end of public (return statement)	
		
	}());
}