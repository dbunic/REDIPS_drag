<?php 
// accept input parameter as Array
// query string is send in form as: p[]=i00 & p[]=i01 & p[]=i05 ... (of course, without spaces)
$param = $_POST['p'];

// demo: print AJAX string
print 'AJAX: ';

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

// if everything went OK, then return string 'OK'
//print 'OK';
?>