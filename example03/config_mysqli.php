<?php 

// mysqli extension

// define database host (99% chance you won't need to change this value)
$db_host = 'localhost';

// define database name, user name and password
$db_name = 'enter_database_name';
$db_user = 'enter_user_name';
$db_pwd  = 'enter_user_password';

// reset record set to null ($rs is used in timetable function)
$rs = null;

// connect to database
$mysqli = new mysqli($db_host, $db_user, $db_pwd, $db_name);
if ($mysqli->connect_errno) {
	print "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

// function executes SQL statement and returns result set as Array
// $key defines column number to be set as array key (needed for fetch from redips_timetable $rs[1_2) -> Array (... ) 
function sqlQuery($sql, $key = NULL) {
	global $mysqli;
	// execute query	
	$db_result = $mysqli->query($sql);
	// if db_result is null then trigger error
	if (!$db_result) {
		print "SQL failed: (" . $mysqli->errno . ") " . $mysqli->error;
		exit();
	}
	// prepare result array
	$resultSet = Array();
	// if resulted array isn't true and that is in case of select statement then open loop
	// (insert / delete / update statement will return true on success) 
	if ($db_result !== true) {
		// loop through fetched rows and prepare result set
		while ($row = $db_result->fetch_row()) {
			// if array key is defined
			if ($key !== NULL) {
				$resultSet[$row[$key]] = $row;
			}
			// array key is not needed
			else {
				$resultSet[] = $row;
			}
		}
	}
	// return result set
	return $resultSet;
}


// commit transaction
function sqlCommit() {
	global $mysqli;
	// commit transaction
	if (!$mysqli->commit()) {
		print("Transaction commit failed\n");
		exit();
	}
	// close database connection
	$mysqli->close();
}


// print subjects
function subjects() {
	// returned array is compound of nested arrays
	$subjects = sqlQuery('select sub_id, sub_name from redips_subject order by sub_name');
	// print_r($subjects);
	foreach ($subjects as $subject) {
		$id   = $subject[0];
		$name = $subject[1];
		print "<tr><td class=\"dark\"><div id=\"$id\" class=\"redips-drag redips-clone $id\">$name</div><input id=\"b_$id\" class=\"$id\"type=\"button\" value=\"\" onclick=\"redips.report('$id')\" title=\"Show only $name\"/></td></tr>\n";
	}
}


// create timetable row
function timetable($hour, $row) {
	global $rs;
	// if $rs is null then query database (this should be executed only once - first time)
	if ($rs === null) {
		// first column of the query is used as key in returned array
		$rs = sqlQuery("select concat(t.tbl_row,'_',t.tbl_col) as pos, t.tbl_id, t.sub_id, s.sub_name
						from redips_timetable t, redips_subject s
						where t.sub_id = s.sub_id", 0);
	}
	print '<tr>';
	print '<td class="mark dark">' . $hour . '</td>';
	// column loop starts from 1 because column 0 is for hours
	for ($col = 1; $col <= 5; $col++) {
		// create table cell
		print '<td>';
		// prepare position key in the same way as the array key looks
		$pos = $row . '_' . $col;
		// if content for the current table cell exists
		if (array_key_exists($pos, $rs)) {
			// prepare elements for defined position (it can be more than one element per table cell)
			$elements = $rs[$pos];
			// id of DIV element will start with sub_id and followed with 'b' (because cloned elements on the page have 'c') and with tbl_id
			// this way content from the database will not be in collision with new content dragged from the left table and each id stays unique
			$id = $elements[2] . 'b' . $elements[1];
			$name = $elements[3];
			$class = substr($id, 0, 2); // class name is only first 2 letters from ID
			print "<div id=\"$id\" class=\"redips-drag $class\">$name</div>";

		}
		// close table cell
		print '</td>';
	}
	print "</tr>\n";
}

?>