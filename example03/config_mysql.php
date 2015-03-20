<?php 

// old mysql extension (it has been deprecated as of PHP 5.5.0 and will be removed in the future)

// define database host (99% chance you won't need to change this value)
$db_host = 'localhost';

// define database name, user name and password
$db_name = 'enter_database_name';
$db_user = 'enter_user_name';
$db_pwd  = 'enter_user_password';

// reset record set to null ($rs is used in timetable function)
$rs = null;

// open database connection and select database
$db_conn = mysql_connect($db_host, $db_user, $db_pwd);
mysql_select_db($db_name, $db_conn);


// function executes SQL statement and returns result set as Array
function sqlQuery($sql) {
	global $db_conn;
	// execute query	
	$db_result = mysql_query($sql, $db_conn);
	// if db_result is null then trigger error
	if ($db_result === null) {
		trigger_error(mysql_errno() . ": " . mysql_error() . "\n");
		exit();
	}
	// prepare result array
	$resultSet = Array();
	// if resulted array isn't true and that is in case of select statement then open loop
	// (insert / delete / update statement will return true on success) 
	if ($db_result !== true) {
		// loop through fetched rows and prepare result set
		while ($row = mysql_fetch_array($db_result, MYSQL_NUM)) {
			// first column of the fetched row $row[0] is used for array key
			// it could be more elements in one table cell
			$resultSet[$row[0]][] = $row;
		}
	}
	// return result set
	return $resultSet;
}


// commit transaction
function sqlCommit() {
	global $db_conn;
	mysql_query('commit', $db_conn);
	mysql_close($db_conn);
}


// print subjects
function subjects() {
	// returned array is compound of nested arrays
	$subjects = sqlQuery('select sub_id, sub_name from redips_subject order by sub_name');
	// print_r($subjects);
	foreach ($subjects as $subject) {
		$id   = $subject[0][0];
		$name = $subject[0][1];
		print "<tr><td class=\"dark\"><div id=\"$id\" class=\"redips-drag redips-clone $id\">$name</div><input id=\"b_$id\" class=\"$id\"type=\"button\" value=\"\" onclick=\"report('$id')\" title=\"Show only $name\"/></td></tr>\n";
	}
}


// create timetable row
function timetable($hour, $row) {
	global $rs;
	// if $rs is null than query database (this should be only first time)
	if ($rs === null) {
		// first column of the query is used as key in returned array
		$rs = sqlQuery("select concat(t.tbl_row,'_',t.tbl_col) as pos, t.tbl_id, t.sub_id, s.sub_name
						from redips_timetable t, redips_subject s
						where t.sub_id = s.sub_id");
	}
	print '<tr>';
	print '<td class="mark dark">' . $hour . '</td>';
	// column loop starts from 1 because column 0 is for hours
	for ($col=1; $col <= 5; $col++) {
		// create table cell
		print '<td>';
		// prepare position key in the same way as the array key looks
		$pos = $row . '_' . $col;
		// if content for the current position exists
		if (array_key_exists($pos, $rs)) {
			// prepare elements for defined position (it could be more than one element per table cell)
			$elements = $rs[$pos];
			// open loop for each element in table cell
			for ($i=0; $i < count($elements); $i++) {
				// id of DIV element will start with sub_id and followed with 'b' (because cloned elements on the page have 'c') and with tbl_id
				// this way content from the database will not be in collision with new content dragged from the left table and each id stays unique
				$id = $elements[$i][2] . 'b' . $elements[$i][1];
				$name = $elements[$i][3];
				$class = substr($id, 0, 2); // class name is only first 2 letters from ID
				print "<div id=\"$id\" class=\"drag $class\">$name</div>";
			}
		}
		// close table cell
		print '</td>';
	}
	print "</tr>\n";
}

?>