<?php
// include config with database definition
include('../config_mysqli.php');

// input parameter is element to delete (suppress errors by adding a @ sign) 
$p = @$_REQUEST['p'];

// explode input parameteres: id, row and column
list($sub_id, $row, $col) = explode('_', $p);

// discard clone id part from the sub_id
$sub_id = substr($sub_id, 0, 2);

// if row and col are numeric then delete from database (but only one row - limit 1)
if (is_numeric($row) && is_numeric($col)) {
	// delete element from database (only one row)
	sqlQuery("delete from redips_timetable where sub_id='$sub_id' and tbl_row=$row and tbl_col=$col limit 1");
	// commit transaction (sqlCommit is function from config.php)
	sqlCommit();
}

// no cache
header('Pragma: no-cache');
// HTTP/1.1
header('Cache-Control: no-cache, must-revalidate');
// date in the past
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

?>