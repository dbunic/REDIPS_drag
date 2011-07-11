/*
Copyright (c) 2008-2011, www.redips.net All rights reserved.
Code licensed under the BSD License: http://www.redips.net/license/
http://www.redips.net/javascript/drag-and-drop-table-content/
Version 4.3.3
Jul 11, 2011.
*/

/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false */

/* reveal module-pattern */

/* enable strict mode */
"use strict";

// create REDIPS namespace (if is not already defined in another REDIPS package)
var REDIPS = REDIPS || {};


/**
 * @namespace
 * @description REDIPS.drag is a JavaScript drag and drop library focused on dragging table content and table rows.
 * @name REDIPS.drag
 * @author Darko Bunic
 * @see
 * <a href="http://www.redips.net/javascript/drag-and-drop-table-row/">http://www.redips.net/javascript/drag-and-drop-table-row/</a>
 * <a href="http://www.redips.net/javascript/drag-and-drop-table-content/">http://www.redips.net/javascript/drag-and-drop-table-content/</a>
 * @version 4.3.3
 */
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
		add_events,					// method adds omousedown and ondblclick event listeners to the DIV element
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
		form_elements,				// set form values in cloned row (to prevent reset values of form elements)
	
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
		trash_cname = 'trash',			// (string) cell class name where draggable element will be destroyed
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


	/**
	 * Drag container initialization. It should be called at least once (it is possible to call a method multiple times).
	 * Every page should have at least one drag container.
	 * If REDIPS.drag.init() is called without input parameter, library will search for drag container with id="drag".
	 * Only tables inside drag container will be scaned. It is possible to have several drag containers totaly separated (elements from one container will not be visible to other drag containers). 
	 * @param {String} [dc] Drag container Id (default id "drag").
	 * @example
	 * // init drag container (with default id="drag")
	 * REDIPS.drag.init();
	 *  
	 * // init drag container with id="drag1"
	 * REDIPS.drag.init('drag1');
	 * @public
	 * @function
	 * @name REDIPS.drag#init
	 */
	init = function (dc) {
		// define local variables
		var self = this,		// assign reference to current object to "self"
			i,					// used in local for loops
			imgs,				// collect images inside div=drag
			redips_clone;		// reference to the DIV element needed for cloned elements 

		// if drag container is undefined, then set reference to the DIV element with id="drag"
		if (dc === undefined) {
			dc = 'drag';
		}
		// set reference to the drag container
		div_drag = document.getElementById(dc);
		// append DIV id="redips_clone" if DIV doesn't exist (needed for cloning DIV elements)
		// if automatic creation isn't precise enough, user can manually create and place element with id="redips_clone" to prevent window expanding
		// (then this code will be skipped)
		if (!document.getElementById('redips_clone')) {
			redips_clone = document.createElement('div');
			redips_clone.id = 'redips_clone';
			redips_clone.style.width = redips_clone.style.height = '1px';
			div_drag.appendChild(redips_clone);
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
		// collect images inside drag container
		imgs = div_drag.getElementsByTagName('img');
		// disable onmousemove event for images to prevent default action of onmousemove event (needed for IE to enable dragging on image)
		for (i = 0; i < imgs.length; i++) {
			REDIPS.event.add(imgs[i], 'mousemove', img_onmousemove);
		}
		// attach onscroll event to the window (needed for recalculating table cells positions)
		REDIPS.event.add(window, 'scroll', calculate_cells);
	};


	/**
	 * Needed to set "false" for onmousemove event on images. This way, images from DIV element will not be enabled for dragging by default.
	 * img_onmousemove is attached as handler to all images inside drag container.
	 * Multiple calling of REDIPS.drag.init() will not attach the same event handler to the images.
	 * @private
	 * @memberOf REDIPS.drag#
	 * @see <a href="#init">init</a>
	 */
	img_onmousemove = function () {
		return false;
	};


	/**
	 * Tables initialization. Method searches for all tables inside drag container and prepares "tables" array.
	 * "tables" array is one of the main parts of REDIPS.drag library.
	 * @private
	 * @memberOf REDIPS.drag#
	 */
	init_tables = function () {
		var	i, j, k,			// loop variables
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
		for (i = 0, j = 0; i < tables_nodeList.length; i++) {
			// skip table if table belongs to the "redips_clone" container
			// this is possible for cloned rows - if init_tables() is called after row_clone()
			if (tables_nodeList[i].parentNode.id === 'redips_clone') {
				continue;
			}
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
			tables[j] = tables_nodeList[i];
			// set redips_container to the table (needed in case when row is cloned)
			tables[j].redips_container = div_drag;
			// set nested level (needed for sorting in "tables" array)
			// level === 0 - means that this is "ground" table ("ground" table may contain nested tables)
			tables[j].redips_nestedLevel = level;
			// set original table index (needed for sorting "tables" array to the original order in save_content() function)
			tables[j].redips_idx = j;
			// prepare td nodeList of current table
			td = tables[j].getElementsByTagName('td');
			// loop through nodeList and search for rowspaned cells
			for (k = 0, rowspan = false; k < td.length; k++) {
				// if only one rowspaned cell is found set flag to "true" and break loop
				if (td[k].rowSpan > 1) {
					rowspan = true;
					break;
				}
			}
			// set redips_rowspan flag - needed in set_trc()
			tables[j].redips_rowspan = rowspan;
			// increment j counter
			j++;
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


	/**
	 * onmousedown event handler.
	 * This event handler is attached to every DIV element in drag container (please see "enable_drag").
	 * @param {Event} e Event information.
	 * @see <a href="#enable_drag">enable_drag</a>
	 * @see <a href="#add">handler_ondblclick</a>
	 * @see <a href="#add_events">add_events</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * ondblclick handler event handler.
	 * This event handler is attached to every DIV element in drag container (please see "enable_drag").
	 * @param {Event} e Event information.
	 * @see <a href="#enable_drag">enable_drag</a>
	 * @see <a href="#handler_onmousedown">handler_onmousedown</a>
	 * @see <a href="#add_events">add_events</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
	handler_ondblclick = function (e) {
		// call custom event handler
		REDIPS.drag.myhandler_dblclicked();
	};

 
	/**
	 * Method sets current table group in "tables" array to the array top ("tables" array is sorted).
	 * The purpose is to enable tables nesting and to improve perfomance. Tables closer to the top of the array will be scanned before other tables in array.
	 * This method is called from "handler_onmousedown" on every DIV element click.
	 * DIV element belongs to the table and this table group ("ground" table + its nested tables) should go to the array top.
	 * @param {HTMLElement} obj Clicked DIV element (table of the clicked DIV element will be sorted to the array top).
	 * @see <a href="#handler_onmousedown">handler_onmousedown</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Methods returns reference to the table row or clones table row.
	 * If called from handler_onmousedown:
	 * <ul>
	 * <li>input parameter is DIV class="row"</li>
	 * <li>method will return reference of the current row</li>
	 * </ul>
	 * If called from handler_onmousemove:
	 * <ul>
	 * <li>input parameter is TR (current row) - previously returned with this function</li>
	 * <li>method will clone current row and return reference of the cloned row</li>
	 * </ul>
	 * @param {HTMLElement} el DIV class="row" or TR (current row)
	 * @return {HTMLElement} Returns reference of the current row or clone current row and return reference of the cloned row.
	 * @see <a href="#handler_onmousedown">handler_onmousedown</a>
	 * @see <a href="#handler_onmousemove">handler_onmousemove</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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
			// set form values in cloned row (to prevent reset values of form elements)
			form_elements(row_obj, table_mini.rows[0]);
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
			// append cloned mini table to the DIV id="redips_clone"
			document.getElementById('redips_clone').appendChild(table_mini);
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


	/**
	 * Method drops table row to the target row. Source row is deleted and cloned row is inserted at the new position.
	 * @param {Integer} r_table Table index.
	 * @param {Integer} r_row Row index.
	 * @param {HTMLElement} [table_mini] Reference to the mini table (table that contains only one row). This actually clone of source row.
	 * @see <a href="#row_clone">row_clone</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Method sets form values after cloning table row. Method is called from row_clone.
	 * cloneNode() should take care about form values when performing deep cloning - but some browsers have a problem.
	 * This method will fix checkboxes, selected indexes and so on when dragging table row (values in form elements will be preserved).
	 * @param {HTMLElement} source Source table row.
	 * @param {HTMLElement} cloned Cloned table row. Table row is cloned in a moment of dragging.
	 * @see <a href="#row_clone">row_clone</a>
	 * @private
	 * @memberOf REDIPS.drag# 
	 */
	form_elements = function (source, cloned) {
		// local variables
		var i, j, k, type,
			src = [],	// collection of form elements from source row
			cld = [];	// collection of form elements from cloned row
		// collect form elements from source row
		src[0] = source.getElementsByTagName('input');
		src[1] = source.getElementsByTagName('textarea');
		src[2] = source.getElementsByTagName('select');
		// collect form elements from cloned row
		cld[0] = cloned.getElementsByTagName('input');
		cld[1] = cloned.getElementsByTagName('textarea');
		cld[2] = cloned.getElementsByTagName('select');
		// loop through found form elements in source row
		for (i = 0; i < src.length; i++) {
			for (j = 0; j < src[i].length; j++) {
				// define element type
				type = src[i][j].type;
				switch (type) {
				case 'text':
				case 'textarea':
				case 'password':
					cld[i][j].value = src[i][j].value;
					break;
				case 'radio':
				case 'checkbox':
					cld[i][j].checked = src[i][j].checked;
					break;
				case 'select-one':
					cld[i][j].selectedIndex = src[i][j].selectedIndex;
					break;
				case 'select-multiple':
					for (k = 0; k < src[i][j].options.length; k++) {
						cld[i][j].options[k].selected = src[i][j].options[k].selected;
					}
					break;
				} // end switch
			} // end for j
		} // end for i
	};


	/**
	 * onmouseup event handler.
	 * handler_onmouseup is attached to the DIV element in a moment when DIV element is clicked (this happens in handler_onmousedown).
	 * This event handler detaches onmousemove and onmouseup event handlers.
	 * @param {Event} e Event information.
	 * @see <a href="#handler_onmousedown">handler_onmousedown</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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
		// this could happen if "clone" element is placed inside forbidden table cell
		if (cloned_flag === 1 && (table === null || row === null || cell === null)) {
			obj.parentNode.removeChild(obj);
			// decrease cloned_id counter
			cloned_id[obj_old.id] -= 1;
			REDIPS.drag.myhandler_notcloned();
		}
		// if DIV element was clicked and left button was released, but element is placed inside unmovable table cell
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
			// delete cloned element if dropped on the start position
			else if (cloned_flag === 1 && table_source === table && row_source === row && cell_source === cell) {
				obj.parentNode.removeChild(obj);
				// decrease cloned_id counter
				cloned_id[obj_old.id] -= 1;
				REDIPS.drag.myhandler_notcloned();
			}
			// delete cloned element if dropped outside current table and delete_cloned flag is true
			else if (cloned_flag === 1 && REDIPS.drag.delete_cloned === true &&
					(X < target_table.offset[3] || X > target_table.offset[1] || Y < target_table.offset[0] || Y > target_table.offset[2])) {
				obj.parentNode.removeChild(obj);
				// decrease cloned_id counter
				cloned_id[obj_old.id] -= 1;
				REDIPS.drag.myhandler_notcloned();
			}
			// remove object if destination cell has "trash" in class name
			else if (target_cell.className.indexOf(REDIPS.drag.trash_cname) > -1) {
				// remove child from DOM (node still exists in memory)
				obj.parentNode.removeChild(obj);
				// if parameter trash_ask is "true", confirm deletion (function trash_delete is at bottom of this script)
				if (REDIPS.drag.trash_ask) {
					setTimeout(function () {
						// Are you sure?
						if (confirm('Are you sure you want to delete?')) {
							// yes, call myhandler_deleted event handler
							REDIPS.drag.myhandler_deleted();
							// if object is cloned, update climit1_X or climit2_X classname
							if (cloned_flag === 1) {
								clone_limit();
							}
						}
						// no, do undelete
						else {
							// undelete DIV element
							if (cloned_flag !== 1) {
								// append removed object to the source table cell
								tables[table_source].rows[row_source].cells[cell_source].appendChild(obj);
								// and recalculate table cells because undelete can change row dimensions 
								calculate_cells();
							}
							// call undeleted event handler
							REDIPS.drag.myhandler_undeleted();	
						}
					}, 20);
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
				// if destination element exists, then elements are switched
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


	/**
	 * onmousemove event handler.
	 * handler_onmousemove is attached to document level in a moment when DIV element is clicked (this happens in handler_onmousedown).
	 * handler_onmouseup detaches onmousemove and onmouseup event handlers.
	 * @param {Event} e Event information.
	 * @see <a href="#handler_onmousedown">handler_onmousedown</a>
	 * @see <a href="#handler_onmouseup">handler_onmouseup</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Method adds omousedown and ondblclick event listeners to the DIV element.
	 * This will be the most useful in cases of cloning (or creating) DIV elements outside the REDIPS.drag library.
	 * Every DIV element should have attached omousedown and ondblclick event listener.  
	 * @param {HTMLElement|String} div DIV element or Id of DIV element.
	 * @public
	 * @function
	 * @name REDIPS.drag#add_events
	 */
	add_events = function (div) {
		// if input parameter is Id (string) then prepare reference to the element
		if (typeof(div) === 'string') {
			div = document.getElementById(div);
		}
		// set onmousedown/ondblclick event on cloned object
		div.onmousedown = handler_onmousedown;
		div.ondblclick = handler_ondblclick;
	};


	/**
	 * This method is called (from handler_onmousemove, autoscrollX, autoscrollY) in case of change of current table cell.
	 * When change happens, then return background color to old position, highlight new position, calculate cell boundaries and call myhandler_changed.
	 * @see <a href="#handler_onmousemove">handler_onmousemove</a>
	 * @see <a href="#autoscrollX">autoscrollX</a>
	 * @see <a href="#autoscrollY">autoscrollY</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * In initialization phase, this method is attached as onresize event handler for window.
	 * It also calculates window width and window height. Result is saved in variables window_width and window_height visible inside REDIPS.drag private scope.
	 * @see <a href="#init">init</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Method sets current table, row and cell.
	 * Current cell position is based on position of mouse pointer and calculated grid of tables inside drag container.
	 * Method contains built logic for dropping rules like marked/forbidden table cells.
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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
				if (cell_current.className.indexOf(REDIPS.drag.trash_cname) === -1) {
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


	/**
	 * Method sets background color for the current table cell and remembers previous position and background color.
	 * It is called from handler_onmousemove and cell_changed.
	 * @see <a href="#handler_onmousemove">handler_onmousemove</a>
	 * @see <a href="#cell_changed">cell_changed</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Method sets table cell(s) background color.
	 * If color has only one value and REDIPS.drag works in "row" mode, then apply this color to all table cells
	 * @param {Integer} t Table index.
	 * @param {Integer} r Row index.
	 * @param {Integer} c Cell index.
	 * @param {Array} color Array of colors.
	 * @see <a href="#get_bgcolor">get_bgcolor</a>
	 * @see <a href="#set_position">set_position</a>
	 * @see <a href="#cell_changed">cell_changed</a>
	 * @see <a href="#handler_onmouseup">handler_onmouseup</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Method s returns background color as array for the input parameters table index, row index  and cell index.
	 * @param {Integer} t Table index.
	 * @param {Integer} r Row index.
	 * @param {Integer} c Cell index.
	 * @return {Array} Array of colors (for the row or table cell).
	 * @see <a href="#set_bgcolor">set_bgcolor</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Method returns array of element bounds (offset) top, right, bottom and left (needed for table grid calculation).
	 * @param {HTMLElement} box HTMLElement for box metrics.
	 * @param {String} [position] HTMLElement "position" style. Elements with style "fixed" will not have included page scroll offset.
	 * @param {Boolean} [box_scroll] If set to "false" then element scroll offset will not be included in calculation (default is "true").
	 * @return {Array} Box offset array: [ top, right, bottom, left ]
	 * @example
	 * // calculate box offset for the div id="drag"
	 * divbox = box_offset(div_drag);
	 * @example
	 * // include scroll position in offset
	 * offset = box_offset(row_obj, 'fixed');
	 * @example
	 * // get DIV offset with or without "page scroll" and excluded element scroll offset
	 * cb = box_offset(div, position, false);
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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

 
	/** 
	 * Method is called in every possible case when position or size of table grid could change like: page scrolling, element dropped to the table cell, element start dragging and so on.
	 * It calculates table row offsets (table grid) and saves to the "tables" array.
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Method returns current page scroll position as array.
	 * @return {Array} Returns array with two members [ scrollX, scrollY ].
	 * @public
	 * @function
	 * @name REDIPS.drag#getScrollPosition
	 */
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


	/**
	 * Horizontal auto scroll method.
	 * @param {HTMLElement} so Window or DIV element (so - scroll object).
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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
			setTimeout(autoscrollX, REDIPS.drag.speed);
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


	/**
	 * Vertical auto scroll method.
	 * @param {HTMLElement} so Window or DIV element (so - scroll object).
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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
			setTimeout(autoscrollY, REDIPS.drag.speed);
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
	

	/**
	 * Clone current DIV element.
	 * If class name of DIV element contains "clone" or "clone_shiftKey" is set to true, then current DIV element will be cloned (and attached to the hidden "redips_clone" element).
	 * This method is called from handler_onmousemove.
	 * @see <a href="#handler_onmousemove">handler_onmousemove</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
	clone_object = function () {
		var obj_new = obj.cloneNode(true),	// clone object 
			offset,							// offset of the original object
			offset_dragged;					// offset of the new object (cloned)
		// append cloned element to the DIV id="redips_clone"
		document.getElementById('redips_clone').appendChild(obj_new);
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


	/**
	 * After element is cloned, this method will update climit1_X or climit2_X class names (X defines number of elements to clone).
	 * Method is called from handler_onmouseup method.
	 * <ul>
	 * <li>climit1_X - after cloning X elements, last element will be normal drag-able element</li>
	 * <li>climit2_X - after cloning X elements, last element will stay unmovable</li>
	 * </ul>
	 * @see <a href="#handler_onmouseup">handler_onmouseup</a>
	 * @private
	 * @memberOf REDIPS.drag#
	 */
	clone_limit = function () {
		// declare local variables 
		var match_arr,	// match array
			limit_type,	// limit type (1 - clone becomes "normal" drag element atlast; 2 - clone element stays immovable)
			limit,		// limit number
			classes;	// class names of clone element
		// set classes variable for clone object (obj_old is reference to the clone object not cloned)
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


	/**
	 * Method returns true or false if element needs to have control.
	 * Elements like A, INPUT, SELECT, OPTION, TEXTAREA should have its own control (method returns "true").
	 * If element contains "nodrag" class name then dragging will be skipped (see example11 "Drag handle on titlebar").
	 * <ul>
	 * <li>true - click on element will not start dragging (element has its own control)</li>
	 * <li>false - click on element will start dragging</li>
	 * </ul>
	 * @param {Event} evt Event information.
	 * @return {Boolean} Returns true or false if element needs to have control.
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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
		// return true/false flag
		return flag;
	};


	/**
	 * Method attaches / detaches onmousedown, ondblclick events to DIV elements and attaches onscroll event to the scrollable containers in initialization phase.
	 * If class attribute of DIV container contains "noautoscroll" class name then autoscroll option will be disabled.
	 * @param {String|Boolean} enable_flag Enable / disable element (or element container like table, dragging container ...).
	 * @param {String|HTMLElement} [div_id] Element id (or dragging area) to enable / disable. Parameter defines DIV object or DIV id of element(s) to enable / disable.
	 * @param {String} [type] Type definition for the second parameter div_id - element or container.
	 * @example
	 * // enables element with id="el_id"
	 * enable_drag(true, 'el_id');
	 *  
	 * // disables all elements in drag1 container 
	 * enable_drag(false, 'drag1', 'container')
	 * @public
	 * @function
	 * @name REDIPS.drag#enable_drag
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


	/**
	 * Method returns style value for requested HTML element and style name.
	 * @param {HTMLElement} el Requested HTML element.
	 * @param {String} style_name Asked style name.
	 * @return {String} Returns style value.
	 * @see <a href="http://www.quirksmode.org/dom/getstyles.html">http://www.quirksmode.org/dom/getstyles.html</a>
	 * @public
	 * @function
	 * @name REDIPS.drag#get_style
	 */
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


	/**
	 * Method scans table(s) content and prepares query string for submitting to the server.
	 * Input parameter defines table index to scan or if not defined then all tables will be scanned.
	 * @param {Integer} [tbl] Table index. If not defined then all tables will be scanned.
	 * @example
	 * query string will be in format:
	 * 'p[]='+id+'_'+t+'_'+r+'_'+c+'&p[]='+id+'_'+t+'_'+r+'_'+c + ...
	 * id - element id
	 * t  - table index
	 * r  - row index
	 * c  - cell index
	 * @public
	 * @function
	 * @name REDIPS.drag#save_content
	 */
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


	/**
	 * Method relocates all child nodes from source table cell to the target table cell.
	 * @param {HTMLElement} from Source table cell.
	 * @param {HTMLElement} to Target table cell.
	 * @public
	 * @function
	 * @name REDIPS.drag#relocate
	 */
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


	/**
	 * Method will calculate parameters and start animation (DIV element to the destination table cell).
	 * If "target" property is not defined then current location will be used. Here is properties definition of input parameter:
	 * <ul>
	 * <li>{String} id - reference of element to animate - DIV element or row handler (div class="drag row")</li>
	 * <li>{String} mode - animation mode (if mode="row" then source and target properties should be defined)</li>
	 * <li>{Array} source - source position (table index and row index)</li>
	 * <li>{Array} target - target position (table, row and cell index (optional for "row" mode)</li>
	 * <li>{Function} callback - callback function executed after animation is finished</li>
	 * </ul>
	 * Method returns array containing reference of two object. In "cell" mode returned objects are:
	 * <ul>
	 * <li>Array[0] - dragged element</li>
	 * <li>Array[1] - dragged element</li>
	 * </ul>
	 * In "row" mode returned objects are:
	 * <ul>
	 * <li>Array[0] - table_mini</li>
	 * <li>Array[1] - source row</li>
	 * </ul>
	 * @param {Object} ip Object with properties: id, mode, source, target and callback.
	 * @return {Array} Returns reference of two elements in array. In "cell" mode both elements are dragged element, while in "row" mode first element is table_mini and second element is source row.
	 * @example
	 * // move element with id="a1" to the current location and after
	 * // animation is finished display alert "Finished"  
	 * rd.move_object({
	 *     id: 'a1',
	 *     callback: function () {
	 *         alert('Finished');
	 *     }
	 * });
	 *  
	 * // move element with id="a2" to the first table, second row and third cell
	 * rd.move_object({
	 *     id: 'a2',
	 *     target: [0, 1, 2]
	 * });
	 *  
	 * // move first row and after animation is finished call "enable_button" function
	 * // "move_object" returns Array with references of table_mini and source row
	 * row = rd.move_object({
	 *           mode: 'row',            // animation mode - row
	 *           source: [0, 0],         // source position (table index and row index)
	 *           target: [0, 6],         // target position
	 *           callback: enable_button // function to call after animation is over
	 *        });
	 * @public
	 * @function
	 * @name REDIPS.drag#move_object
	 */
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


	/**
	 * Element (DIV or table row) animation.
	 * After "move_object" calculates parameters, animation is started by calling "animate" method.
	 * Each other animation step is done by recursive calls until element reaches last point.
	 * Input parameters are first (current) point and 'p' object with following properties:
	 * <ul>
	 * <li>obj - object to animate</li>
	 * <li>target_cell - target table cell</li>
	 * <li>last - last point</li>
	 * <li>m, b - slope and y-intercept (needed for y = m * x + b)</li>
	 * <li>k1, k2 - constants needed for calculation 1 -> 0 -> 1 parameter (regarding current position)</li>
	 * <li>direction - animation direction (1 or -1)</li>
	 * <li>type - line type (horizontal or vertical)</li>
	 * </ul>
	 * @param {Integer} i First (and lately current) point
	 * @param {Object} p Object with properties: obj, target_cell, last, m, b, k1, k2, direction and type
	 * @private
	 * @memberOf REDIPS.drag#
	 */
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


	/**
	 * Method returns position as array with members tableIndex, rowIndex and cellIndex (array length is 3).
	 * If input parameter is not defined then method will return array with current and source positions (array length will be 6).
	 * @param {String|HTMLElement} [ip] DIV element id / reference or table cell id / reference.
	 * @return {Array} Returns array with members tableIndex, rowIndex and cellIndex.
	 * @public
	 * @function
	 * @name REDIPS.drag#get_position
	 */
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
	 * @private
	 * @memberOf REDIPS.drag#
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


	/**
	 * Method sets opacity to table row.
	 * Input parameter "el" is reference to the table row or reference to the cloned mini table (when row is moved).
	 * @param {HTMLElement|String} el Id of row handler (div class="drag row") or reference to element (source row or mini table).
	 * @param {Integer} opacity Opacity level (from 0 to 100).
	 * @param {String} [color] Background color.
	 * @public
	 * @function
	 * @name REDIPS.drag#row_opacity
	 */
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



	return {
		/* public properties */
		/**
		 * Currently moved DIV element.
		 * @type HTMLElement
		 * @name REDIPS.drag#obj
		 */
		obj	: obj,
		/**
		 * Previously moved DIV element (before clicked or cloned).
		 * @type HTMLElement
		 * @name REDIPS.drag#obj_old
		 */
		obj_old	: obj_old,
		/**
		 * Dragging mode "cell" or "row" (readonly).
		 * This is readonly property defined in a moment when DIV element or row handler is clicked.
		 * @type String
		 * @name REDIPS.drag#mode
		 */
		mode : mode,
		/**
		 * Reference to source table cell.
		 * @type HTMLElement
		 * @see <a href="#previous_cell">previous_cell</a>
		 * @see <a href="#current_cell">current_cell</a> 
		 * @name REDIPS.drag#source_cell
		 */
		source_cell : source_cell,
		/**
		 * Reference to previous table cell.
		 * @type HTMLElement
		 * @see <a href="#source_cell">source_cell</a>
		 * @see <a href="#current_cell">current_cell</a> 
		 * @name REDIPS.drag#previous_cell
		 */
		previous_cell : previous_cell,
		/**
		 * Reference to current table cell.
		 * @type HTMLElement
		 * @see <a href="#source_cell">source_cell</a>
		 * @see <a href="#previous_cell">previous_cell</a> 
		 * @name REDIPS.drag#current_cell
		 */	
		current_cell : current_cell,
		/**
		 * Reference to target table cell.
		 * Target table cell is defined in a moment of dropping element to the table cell.
		 * @type HTMLElement
		 * @see <a href="#source_cell">source_cell</a>
		 * @see <a href="#current_cell">current_cell</a>
		 * @see <a href="#previous_cell">previous_cell</a>  
		 * @name REDIPS.drag#target_cell
		 */
		target_cell : target_cell,
		/**
		 * Hover color for current table cell.
		 * Color could be changed inside event handlers (e.g. each table could have different hover color or some cells could have special hover colors).
		 * @type String
		 * @name REDIPS.drag#hover_color
		 * @example
		 * // set "#9BB3DA" as hover color
		 * REDIPS.drag.hover_color('#9BB3DA');
		 *  
		 * // or set "Lime" as hover color
		 * REDIPS.drag.hover_color('Lime');
		 * @default #E7AB83
		 */
		hover_color	: hover_color,
		/**
		 * Bound size for triggering page autoscroll or autoscroll of scrollable DIV container.
		 * @type Integer
		 * @name REDIPS.drag#bound
		 * @default 25 (px)
		 */
		bound : bound,
		/**
		 * Autoscroll pause in milliseconds.
		 * @type Integer
		 * @name REDIPS.drag#speed
		 * @default 20 (milliseconds)
		 */
		speed : speed,
		/**
		 * Table cells marked with "only" class name can accept only defined DIV elements.
		 * Object contains:
		 * <ul>
		 * <li>{Array} div - defined DIV elements can be dropped only to the table cells marked with class name "only" (DIV id -> class name)</li>
		 * <li>{String} cname - class name of marked cells (default is "only")</li>
		 * <li>{String} other - allow / deny dropping DIV elements to other table cells (default is "deny")</li>
		 * </ul>
		 * @example
		 * // only element with Id "a1" can be dropped to the cell with class name "only last"
		 * REDIPS.drag.only.div.a1 = 'last';
		 *  
		 * // DIV elements mentioned in REDIPS.drag.only.div cannot be dropped to other cells
		 * REDIPS.drag.only.other = 'deny';
		 * @type Object
		 * @name REDIPS.drag#only
		 * @see <a href="#mark">mark</a>
		 */
		only : only,
		/**
		 * Table cells marked with "mark" class name can be allowed or forbidden for accessing (with exceptions) - default is "deny".
		 * This is useful to define table cells forbidden for every DIV element with exceptions (or contrary, define table cells allowed for all DIV elements except some).
		 * Object contains:
		 * <ul>
		 * <li>{String} action - allow / deny table cell (default is "deny")</li>
		 * <li>{String} cname - class name of marked cells (default is "mark")</li>
		 * <li>{Array} exception - defined DIV elements can be dropped to the table cells marked with class "mark" (DIV id -> class name)</li>
		 * </ul>
		 * @example
		 * // only element with Id "d8" can be dropped to the cell with class name "mark smile"
		 * REDIPS.drag.mark.exception.d8 = 'smile';
		 * @type Object
		 * @see <a href="#only">only</a>
		 * @name REDIPS.drag#mark
		 */
		mark : mark,
		/**
		 * Border style for enabled element.
		 * @type String
		 * @name REDIPS.drag#border
		 * @default solid
		 */
		border : border,
		/**
		 * Border style for disabled element.
		 * @type String
		 * @name REDIPS.drag#border_disabled
		 * @default dotted
		 */
		border_disabled	: border_disabled,
		/**
		 * Opacity level for disabled elements.
		 * @type Integer
		 * @name REDIPS.drag#opacity_disabled
		 */
		opacity_disabled : opacity_disabled,
		/**
		 * Table cell class name where DIV elements will be deleted.
		 * @type String
		 * @name REDIPS.drag#trash_cname
		 * @default trash
		 */
		trash_cname : trash_cname,
		/**
		 * Confirm object deletion.
		 * If set to"true" popup with question: "Are you sure you want to delete?" will appear.
		 * @type Boolean
		 * @name REDIPS.drag#trash_ask
		 * @default true
		 */
		trash_ask : trash_ask,
		/**
		 * Property defines working types of REDIPS.drag library: multiple, single, switch, switching and overwrite.
		 * @type String
		 * @name REDIPS.drag#drop_option
		 * @default multiple
		 * @example
		 * // enabled dropping to already taken table cells
		 * REDIPS.drag.drop_option('multiple');
		 *  
		 * // enabled dropping to empty table cells
		 * REDIPS.drag.drop_option('single'); 
		 *  
		 * // switch content
		 * REDIPS.drag.drop_option('switch');
		 *  
		 * // switching content continuously
		 * REDIPS.drag.drop_option('switching');
		 *  
		 * // overwrite content in table cell
		 * REDIPS.drag.drop_option('overwrite');
		 */
		drop_option	: drop_option,
		/**
		 * Delete cloned DIV element if dropped outside of any table.
		 * If property is set to "false" then cloned DIV element will be dropped to the last possible table cell.
		 * @type Boolean
		 * @name REDIPS.drag#delete_cloned
		 * @default true
		 */
		delete_cloned : delete_cloned,
		/**
		 * Needed for increment Id of cloned elements.
		 * Property is exposed as public to allow setting unique Id of cloned elements. Mostly this will not be needed and REDIPS.drag will take care about cloned Id.
		 * Cloned elements will have Id in format "originalId""c""clonedCounter" (where "c" is separator between element Id and cloning counter).
		 * Double quotes are not part of Id.
		 * @example 'd1c0' is Id of first cloned element (Id of original element is 'd1')
		 * @type Array
		 * @name REDIPS.drag#cloned_id
		 */
		cloned_id : cloned_id,
		/**
		 * If set to "true", all DIV elements on tables could be cloned with pressed SHIFT key. 
		 * Just press SHIFT key and try to drag element. Instead of moving current element, DIV element will be cloned and ready for dragging.
		 * @type Boolean
		 * @name REDIPS.drag#clone_shiftKey
		 * @default false
		 */
		clone_shiftKey : clone_shiftKey,
		/**
		 * Animation pause (lower values means the animation will go faster).
		 * @type Integer
		 * @name REDIPS.drag#animation_pause
		 * @default 40 (milliseconds)
		 */
		animation_pause : animation_pause,
		/**
		 * Animation step (minimum is 1).
		 * Property defines number of pixels in each step.
		 * Higher values means bigger step (faster animation) but with less smoothness.
		 * @type Integer
		 * @name REDIPS.drag#animation_step
		 * @default 2 px
		 */
		animation_step : animation_step, 

		/* public methods (documentation is in main code) */
		init : init,
		enable_drag : enable_drag,
		add_events : add_events,
		save_content : save_content,
		relocate : relocate,
		move_object : move_object,
		get_position : get_position,
		row_opacity : row_opacity,
		getScrollPosition : getScrollPosition,
		get_style : get_style,

		/* Element Event Handlers */
		/**
		 * Event handler invoked if a mouse button is pressed down while the mouse pointer is over DIV element.
		 * @name REDIPS.drag#myhandler_clicked
		 * @function
		 * @event
		 */
		myhandler_clicked : function () {},
		/**
		 * Event handler invoked if a mouse button is clicked twice while the mouse pointer is over DIV element.
		 * @name REDIPS.drag#myhandler_dblclicked
		 * @function
		 * @event
		 */
		myhandler_dblclicked : function () {},
		/**
		 * Event handler invoked if element is moved from home position.
		 * @name REDIPS.drag#myhandler_moved
		 * @function
		 * @event
		 */
		myhandler_moved : function () {},
		/**
		 * Event handler invoked if a mouse button is pressed down and released while the mouse pointer is over DIV element (element was not actually moved).
		 * @name REDIPS.drag#myhandler_notmoved
		 * @function
		 * @event
		 */
		myhandler_notmoved : function () {},
		/**
		 * Event handler invoked if element is dropped to the table cell.
		 * @name REDIPS.drag#myhandler_dropped
		 * @function
		 * @event
		 */		
		myhandler_dropped : function () {},
		/**
		 * Event handler invoked if mouse button is released and before element is dropped to the table cell.
		 * @name REDIPS.drag#myhandler_dropped_before
		 * @function
		 * @event
		 */	
		myhandler_dropped_before : function () {},
		/**
		 * Event handler invoked if DIV elements are switched (drop_option is set to "switch").
		 * @name REDIPS.drag#myhandler_switched
		 * @see <a href="#drop_option">drop_option</a>
		 * @function
		 * @event
		 */	
		myhandler_switched : function () {},
		/**
		 *Event handler invoked on every change of current (highlighted) table cell.
		 * @name REDIPS.drag#myhandler_changed
		 * @function
		 * @event
		 */	
		myhandler_changed : function () {},
		/**
		 * Event handler invoked if DIV element is cloned.
		 * @name REDIPS.drag#myhandler_cloned
		 * @function
		 * @event
		 */	
		myhandler_cloned : function () {},
		/**
		 * Event handler invoked if last element is cloned (type 1).
		 * Element has defined "climit1_X" class name where X defines number of elements to clone. Last element can be dragged.
		 * @name REDIPS.drag#myhandler_clonedend1
		 * @function
		 * @event
		 */	
		myhandler_clonedend1 : function () {},
		/**
		 * Event handler invoked if last element is cloned (type 2).
		 * Element has defined "climit2_X" class name where X defines number of elements to clone. Last element can't be dragged and stays static.
		 * @name REDIPS.drag#myhandler_clonedend2
		 * @function
		 * @event
		 */	
		myhandler_clonedend2 : function () {},
		/**
		 * Event handler invoked if cloned element is dropped on start position or cloned element is dropped outside current table with "delete_cloned" property set to true.
		 * This event handler could be also invoked if "clone" type element is placed inside forbidden table cell.
		 * @see <a href="#delete_cloned">delete_cloned</a>
		 * @name REDIPS.drag#myhandler_notcloned
		 * @function
		 * @event
		 */	
		myhandler_notcloned : function () {},
		/**
		 * Event handler invoked if element is deleted (dropped to the "trash" table cell).
		 * @name REDIPS.drag#myhandler_deleted
		 * @function
		 * @event
		 */	
		myhandler_deleted : function () {},
		/**
		 * Event handler invoked if element is undeleted.
		 * After element is dropped to the "trash" table cell and "trash_ask" property is set to true then popup with question: "Are you sure you want to delete?" will appear.
		 * Clicking on "Cancel" will undelete element and call this event handler.
		 * @see <a href="#trash_ask">trask_ask</a>
		 * @name REDIPS.drag#myhandler_undeleted 
		 * @function
		 * @event
		 */	
		myhandler_undeleted	: function () {},
		
		/* Row Event Handlers */
		/**
		 * Event handler invoked if a mouse button is pressed down while the mouse pointer is over row handler (div class="drag row").
		 * @name REDIPS.drag#myhandler_row_clicked
		 * @function
		 * @event
		 */
		myhandler_row_clicked : function () {},
		/**
		 * Event handler invoked if row is moved from home position.
		 * @name REDIPS.drag#myhandler_row_moved
		 * @function
		 * @event
		 */
		myhandler_row_moved : function () {},
		/**
		 * Event handler invoked if a mouse button is pressed down and released while the mouse pointer is over row handler (row was not actually moved).
		 * @name REDIPS.drag#myhandler_row_notmoved
		 * @function
		 * @event
		 */
		myhandler_row_notmoved : function () {},
		/**
		 * Event handler invoked after row is dropped to the table cell.
		 * @name REDIPS.drag#myhandler_row_dropped
		 * @function
		 * @event
		 */
		myhandler_row_dropped : function () {},
		/**
		 * Event handler invoked if row is moved around and dropped to the home position.
		 * @name REDIPS.drag#myhandler_row_dropped_source
		 * @function
		 * @event
		 */
		myhandler_row_dropped_source : function () {},
		/**
		 * Event handler invoked on every change of current (highlighted) table row.
		 * @name REDIPS.drag#myhandler_row_changed
		 * @function
		 * @event
		 */
		myhandler_row_changed : function () {}

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