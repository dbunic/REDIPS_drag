<?php
// include config with database definition
include('../config_mysqli.php');

// input parameter is element to delete (suppress errors by adding a @ sign) 
$p = @$_REQUEST['p'];

// explode input parameters:
// 0 - $sub_id - subject id
// 1 - $tbl1   - target table index
// 2 - $row1   - target row
// 3 - $col1   - target column
// 4 - $tbl0   - source table index
// 5 - $row0   - source row
// 6 - $col0   - source column
list($sub_id, $tbl1, $row1, $col1, $tbl0, $row0, $col0) = explode('_', $p);

// discard clone id part from the sub_id
$sub_id = substr($sub_id, 0, 2);

// if source table is 0 (element is dragged from "subject" table and dropped to the "timetable") then it should be inserted to the table
if ($tbl0 == 0) {
	sqlQuery("insert into redips_timetable (sub_id, tbl_row, tbl_col) values ('$sub_id', $row1, $col1)");
}
// else, element is moved to the new location
else {
	sqlQuery("update redips_timetable set tbl_row=$row1, tbl_col=$col1 where sub_id='$sub_id' and tbl_row=$row0 and tbl_col=$col0");
}

// commit transaction (sqlCommit is function from config.php)
sqlCommit();

// no cache
header('Pragma: no-cache');
// HTTP/1.1
header('Cache-Control: no-cache, must-revalidate');
// date in the past
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

?>