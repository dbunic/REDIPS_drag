<html>
<head>
	<title>www.redips.net - Reading multiple parameters from URL</title>
	<style>body{font-family:Verdana,Arial,Helvetica,sans-serif;}</style>
</head>
<body>
<b>Accepted parameters:</b>
<br>
<?php
// accept parameters (p is array)
$arr = $_REQUEST['p'];
// open loop through each array element
foreach ($arr as $p){
	// detach values from each parameter
	list($id, $tbl, $row, $col) = explode('_', $p);
	// instead of print, you can store accepted parameteres to the database
	print "Id=$id Tbl=$tbl Col=$col Row=$row<br>";
}
?>
</body>
</html>