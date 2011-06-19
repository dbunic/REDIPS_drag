REDIPS.drag 4.2.1
============

## What's REDIPS.drag?

REDIPS.drag is a JavaScript drag and drop library focused on dragging table content and table rows. Here are minimal steps to enable content dragging or row dragging in HTML table:

* put **&lt;script type="text/javascript" src="redips-drag-min.js">&lt;/script>** to the head section
* initialize REDIPS.drag library: **&lt;body onload="REDIPS.drag.init()">**
* place table(s) inside **&lt;div id="drag">** to enable content dragging
* place **&lt;div class="drag">Hello World&lt;/div>** to the table cell

## Features

* dragging table content/row
* dropping modes: multiple, single, switch, switching and overwrite
* using custom event handlers
* autoscroll
* content cloning
* support for scrollable DIV containers
* sticky tables and DIV containers
* unlimit nested tables support
* dropping rules (like allowed and forbidden table cells)
* animation (move object to the destination cell)

## Public methods

* REDIPS.drag.init() - initialization
* REDIPS.drag.enable_drag - enable / disable one or all DIV elements in tables
* REDIPS.drag.save_content - scans table content and prepare URL needed for saving
* REDIPS.drag.move_object - moves object from source cell to the target cell (source and target cells are input parameters)
* REDIPS.drag.row_opacity - sets opacity to table row (el, opacity, color)
* REDIPS.drag.getScrollPosition - returns scroll positions in array [ scrollX, scrollY ]
* REDIPS.drag.get_style() - returns style value of requested object and style name

## Demos

Live demo shows REDIPS.drag library in action: 

* [http://www.redips.net/javascript/drag-and-drop-table-content/](http://www.redips.net/javascript/drag-and-drop-table-content/)
* [http://www.redips.net/javascript/drag-and-drop-table-row/](http://www.redips.net/javascript/drag-and-drop-table-row/)

## YouTube

Screencast of several examples contained in REDIPS.drag package:

* [Drag and drop table content with JavaScript](http://www.youtube.com/watch?v=8LtMk4DwLzA)
* [Drag and drop table rows with JavaScript](http://www.youtube.com/watch?v=5YuS6S0bFTU)
* [Drag and drop table content with JavaScript - School timetable](http://www.youtube.com/watch?v=ToJk1End4C4)
