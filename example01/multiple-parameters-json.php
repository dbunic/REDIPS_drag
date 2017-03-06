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
		// accept JSON parameter (and Un-quote string if needed)
		$p = stripslashes($_REQUEST['p']);
		// decode JSON object (it shouldn't be decoded as associative array)
		$arr = json_decode($p);
		// open loop through each array element
		foreach ($arr as $p){
			// set id, row index and cell index
			$id = $p[0];
			$row = $p[1];
			$cell = $p[2];
			$class = $p[3];
			$text = $p[4];
			// instead of print, you can store accepted parameteres to the database
			print "Id=$id Row=$row Cell=$cell Class=$class Text=$text<br>";
		}
	?>
</body>
</html>