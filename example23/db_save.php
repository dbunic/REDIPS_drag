<?php 
// accept input parameter as Array
// query string is send in form as: p[]=i00 & p[]=i01 & p[]=i05 ... (of course, without spaces)
$param = $_POST['p'];

// demo: print AJAX string
print 'AJAX saved: ';

// demo: loop to display all p[] values
foreach ($param as $key => $val) {
	if ($key > 0) {
		print ', ';
	}
	print $val;
}

// save to database
// ..
// ..

// return string 'OK' if everything was OK ('OK' string can be tested in AJAX callback function)
//print 'OK';
?>