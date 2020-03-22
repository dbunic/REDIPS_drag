REDIPS.drag 5.3.0
============

## What is REDIPS.drag?

REDIPS.drag is a JavaScript drag and drop library focused on dragging table content and table rows. Here are minimal steps to enable content dragging or row dragging in HTML table:

* put **&lt;script type="text/javascript" src="redips-drag-min.js">&lt;/script>** to the head section
* initialize REDIPS.drag library: **&lt;body onload="REDIPS.drag.init()">**
* place table(s) inside **&lt;div id="redips-drag">** to enable content dragging
* place **&lt;div class="redips-drag">Hello World&lt;/div>** to the table cell

## Features

* dragging table content/row
* dropping modes: multiple, single, switch, switching, overwrite and shift
* 4 shift modes (horizontal1, horizontal2, vertical1 and vertical2)
* multiple drop options can drop to cell top or bottom
* using custom event handlers
* autoscroll
* content cloning
* support for scrollable DIV containers
* sticky tables and DIV containers
* unlimit nested tables support
* dropping rules (like allowed and forbidden table cells)
* animation (move element/row to the destination cell/row)
* "noautoscoll" option for drag containers
* "redips-nolayout" option for tables (table in DIV element can be dragged as any other content)
* takes care about rows with style display='none'
* support for dynamical creation of table layout (inner table inside DIV element can be moved and accept other DIV elements)
* works in touch devices (tested on Android 2.3.3)

## Public methods

* REDIPS.drag.init() - drag container initialization
* REDIPS.drag.initTables() - tables layout initialization
* REDIPS.drag.ajaxCall() - create AJAX call and handle response in callback function
* REDIPS.drag.clearTable() - deletes all DIV elements with "redips-drag" class name from table
* REDIPS.drag.cloneObject() - clones DIV element and returns reference of the cloned element
* REDIPS.drag.deleteObject() - method deletes DIV element (input parameter is DIV reference or element id)
* REDIPS.drag.emptyCell() - test if table cell contains DIV elements or remove elements from TD
* REDIPS.drag.enableDrag() - enables / disables one or all DIV elements in tables
* REDIPS.drag.enableTable() - enables / disables tables selected by class name
* REDIPS.drag.findCell() - returns data for first or last table cell (cell reference, row index and column index)
* REDIPS.drag.findParent() - returns reference of required parent element
* REDIPS.drag.getPosition() - returns DIV element position as array (tableIndex, rowIndex and cellIndex)
* REDIPS.drag.getScrollPosition() - returns scroll positions as array [ scrollX, scrollY ]
* REDIPS.drag.getStyle() - returns style value of requested object and style name
* REDIPS.drag.loadContent() - method loads content and inserts to the HTML table
* REDIPS.drag.moveObject() - method will calculate parameters and start animation (DIV element to the destination table cell)
* REDIPS.drag.relocate() - relocates all child nodes from source table cell to the target table cell
* REDIPS.drag.rowEmpty() - marks selected row as empty (tbl_id, row_idx, [color])
* REDIPS.drag.rowOpacity() - sets opacity to table row (el, opacity, color)
* REDIPS.drag.saveContent() - scans table and prepares table content as JSON object or query string
* REDIPS.drag.shiftCells() - method shifts table content horizontally or vertically (REDIPS.drag.shift_option defines the way of how content will be shifted)

## Documentation

A reference documentation with a list of public properties and methods contained in REDIPS.drag library.

* [REDIPS.drag documentation](http://www.redips.net/javascript/redips-drag-documentation/)
* [REDIPS.drag documentation - Appendix A](http://www.redips.net/javascript/redips-drag-documentation-appendix-a/)

## Demos

Live demo shows REDIPS.drag library in action: 

* [Drag and drop table content plus animation](http://www.redips.net/javascript/drag-and-drop-table-content-animation/)
* [JavaScript drag and drop plus content shift](http://www.redips.net/javascript/drag-and-drop-content-shift/)
* [Drag and Drop table rows](http://www.redips.net/javascript/drag-and-drop-table-row/)
* [Drag and drop table content](http://www.redips.net/javascript/drag-and-drop-table-content/)
* [jsFiddle examples](https://jsfiddle.net/user/dbunic/fiddles/)

## YouTube

Screencast of several examples contained in REDIPS.drag package:

* [Drag and drop table content with JavaScript](http://www.youtube.com/watch?v=8LtMk4DwLzA)
* [Drag and drop table rows with JavaScript](http://www.youtube.com/watch?v=5YuS6S0bFTU)
* [Drag and drop table content with JavaScript - School timetable](http://www.youtube.com/watch?v=ToJk1End4C4)

