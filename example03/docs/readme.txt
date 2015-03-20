Darko Bunic
http://www.redips.net/javascript/drag-and-drop-example-3/
Mar, 2015.

This example shows how to arrange timetable and save table content to the MySQL database.
Database communication is written inside config_mysqli.php which is included in index.php and db_save.php

Demo contains mysqli and old mysql PHP MySQL API. It is recommended to use mysqli extension because old mysql extension has been deprecated as of PHP 5.5.0 and will be removed in the future.

Inside ajax directory is AJAX variant of this demo without features like printing subjects or spreading
school objects across week.

Before start using this demo you should:
1) create two tables: redips_subject and redips_timetable (see database.sql)
2) define database name, user name and password in config_mysqli.php

After these steps are finished, empty timetable should appear and you can start drag school subjects.

If you replace script.js with docs/script.js (from this directory) then it will not be possible to have two same school subjects (lessons) in a column.
See checkColumn() function and where is called.


Happy dragging and dropping!