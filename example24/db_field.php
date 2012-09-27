<?php
// include configuration
include('config.php');

// script accepts field type id and returns complete HTML 

// test if input parameter is set
if (isset($_GET['id'])){
	$id = $_GET['id'];
}
// otherwise set 0 for input value
else {
	$id = 0;
}

// no cache
header('Pragma: no-cache');
// HTTP/1.1
header('Cache-Control: no-cache, must-revalidate');
// date in the past
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

// include form component (it will be wrapped in DIV container)
include(component($id));

?>