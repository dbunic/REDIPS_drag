<?php
// include config with database definition
include('config_mysqli.php');

// start transaction
sqlQuery('start transaction');

// delete all
sqlQuery('delete from redips_timetable');

// accept parameters - p is array (suppress errors by adding "@" sign)
$arr = @$_REQUEST['p'];

// if input array exists (in all cases except deleting last element)
if (is_array($arr)) {
	// open loop through each array element
	foreach ($arr as $p) {
		// detach values from combined parameters
		// $tbl parameter is ignored because saving goes only from table 1
		list($sub_id, $row, $col) = explode('_', $p);
		// discard clone id part from the sub_id
		$sub_id = substr($sub_id, 0, 2);
		// insert to the database
		sqlQuery("insert into redips_timetable (sub_id, tbl_row, tbl_col) values ('$sub_id', $row, $col)");
	}
}

// commit transaction (sqlCommit is function from config.php)
sqlCommit();

// redirection to the index.php
header('location: index.php');
?>