<?php 

// define person array (needed for demo)
$person = Array();

$person['p00'] = 'Darlene Jonas';
$person['p01'] = 'Tonya Stclair';
$person['p02'] = 'Chris Fordham';

$person['p03'] = 'Glenn Tetreault';
$person['p04'] = 'Christopher Wolford';
$person['p05'] = 'Jonathan Savage';

$person['p06'] = 'Travis Liles';
$person['p07'] = 'Keith Hubbell';
$person['p08'] = 'Christopher Hamann';

$person['p09'] = 'Virginia Quade';
$person['p10'] = 'Irma Gregg';
$person['p11'] = 'Johnny Foss';

$person['p12'] = 'Pam Farwell';
$person['p13'] = 'Lydia Berkley';
$person['p14'] = 'Michelle Mowry';

$person['p15'] = 'Larry Womble';
$person['p16'] = 'Russell Schumann';
$person['p17'] = 'Kimberly Browne';

$person['p18'] = 'Timothy Laboy';
$person['p19'] = 'Paula Rivera';
$person['p20'] = 'Maryann Austin';

$person['p21'] = 'Dora Copeland';
$person['p22'] = 'Dolores Tyson';
$person['p23'] = 'Evelyn Sutton';

$person['p24'] = 'Ernest High';
$person['p25'] = 'Marvin Hoppe';
$person['p26'] = 'Sharon Olander';

$person['p27'] = 'Harriet Wilde';
$person['p28'] = 'Raymond Rickert';
$person['p29'] = 'Chris Nalley';



// function displays rows in index.php
function display_rows() {
	// use global variable $person
	global $person;
	// set td and counter
	$td = '';
	$counter = 0;
	// open loop
	foreach ($person as $id => $name) {
		$td .= "<td><div id=\"$id\" class=\"redips-drag\">$name</div></td>";
		$counter++;
		// if 3 td cells are concatenated then display whole row
		if (($counter % 3) == 0) {
			print "<tr>$td</tr>";
			$td = '';
		}
	}
}


// funcion returns persons details (from $person array)
// this is only for a demo (in real case, all data should be fetched from the database)
function get_detail($id) {
	// use global variable $person
	global $person;
	// set first name and last name
	list($fname, $lname) = explode(' ', $person[$id]);
	// set email address for demo
	$email = strtolower($fname) . '.' . strtolower($lname) . '@example.com';
	// return result array
	return Array($fname, $lname, $email);
}


?>