<html>
<head>
	<title>www.redips.net - Reading multiple parameters from URL</title>
	<style>body{font-family:Verdana,Arial,Helvetica,sans-serif;}</style>
</head>
<body>
	<b>Query string</b>
	<br/>
	<?php print($_SERVER['QUERY_STRING']) ?>
	<br/>
	<br/>
	<b>Accepted parameters:</b>
	<br/>
	<?php
		// accept parameters (p is array)
		$arr = $_REQUEST['p'];
		// open loop through each array element
		foreach ($arr as $p){
			// detach values from each parameter
			list($id, $row, $cell, $class, $text) = explode('_', $p);
			// instead of print, you can store accepted parameteres to the database
			print "Id=$id Row=$row Cell=$cell Class=$class Text=$text<br>";
		}
	?>
</body>
</html>