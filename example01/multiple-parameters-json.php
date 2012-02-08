<html>
<head>
	<title>www.redips.net - Reading multiple parameters from URL</title>
	<style>body{font-family:Verdana,Arial,Helvetica,sans-serif;}</style>
</head>
<body>
	<b>Query string</b>
	<br/>
	<?php print(urldecode($_SERVER['QUERY_STRING'])) ?>
	<br/>
	<br/>
	<b>Accepted parameters:</b>
	<br/>
	<?php
		// accept parameters (p is array)
		$p = $_REQUEST['p'];
		// decode JSON object (it shouldn't be decoded as associative array)
		$arr = json_decode($p);
		// open loop through each array element
		foreach ($arr as $p){
			// prepare parameters
			$id = $p[0];
			$col = $p[1];
			$row = $p[2];
			// instead of print, you can store accepted parameteres to the database
			print "Id=$id Row=$row Cell=$col<br>";
		}
	?>
</body>
</html>