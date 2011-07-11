REDIPS.drag 4.3.3
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
* animation (move element/row to the destination cell/row)

## Public methods

* REDIPS.drag.init() - drag container initialization
* REDIPS.drag.enable_drag - enables / disables one or all DIV elements in tables
* REDIPS.drag.add_events -  adds omousedown and ondblclick event listeners to the DIV element
* REDIPS.drag.save_content - scans table content and prepare URL needed for saving
* REDIPS.drag.relocate - relocates all child nodes from source table cell to the target table cell
* REDIPS.drag.move_object - method will calculate parameters and start animation (DIV element to the destination table cell)
* REDIPS.drag.row_opacity - sets opacity to table row (el, opacity, color)
* REDIPS.drag.getScrollPosition - returns scroll positions as array [ scrollX, scrollY ]
* REDIPS.drag.get_style() - returns style value of requested object and style name

## Documentation

A reference documentation with a list of public properties and methods contained in REDIPS.drag library.

* [http://www.redips.net/javascript/redips-drag-documentation/](http://www.redips.net/javascript/redips-drag-documentation/)

## Demos

Live demo shows REDIPS.drag library in action: 

* [http://www.redips.net/javascript/drag-and-drop-table-content/](http://www.redips.net/javascript/drag-and-drop-table-content/)
* [http://www.redips.net/javascript/drag-and-drop-table-row/](http://www.redips.net/javascript/drag-and-drop-table-row/)

## YouTube

Screencast of several examples contained in REDIPS.drag package:

* [Drag and drop table content with JavaScript](http://www.youtube.com/watch?v=8LtMk4DwLzA)
* [Drag and drop table rows with JavaScript](http://www.youtube.com/watch?v=5YuS6S0bFTU)
* [Drag and drop table content with JavaScript - School timetable](http://www.youtube.com/watch?v=ToJk1End4C4)
