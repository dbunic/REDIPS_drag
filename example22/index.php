<?php include('mylib.php') ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
	<head>
		<meta name="author" content="Darko Bunic"/>
		<meta name="description" content="Drag and drop table content with JavaScript"/>
		<meta name="viewport" content="width=device-width, user-scalable=no"/><!-- "position: fixed" fix for Android 2.2+ -->
		<link rel="stylesheet" href="style.css" type="text/css" media="screen"/>
		<script type="text/javascript" src="../header.js"></script>
		<script type="text/javascript" src="../redips-drag-min.js"></script>
		<script type="text/javascript" src="script.js"></script>
		<title>Example 22: Drag and form details</title>
	</head>
	<body>
		
		<!-- tables inside this DIV could have draggable content -->
		<div id="redips-drag">
			<!-- left container -->
			<div id="left-container">
				<!-- this block will become sticky (with a little JavaScript help)-->
				<div id="left">
					<table id="table1">
						<colgroup>
							<col width="150"/>
							<col width="150"/>
							<col width="150"/>
						</colgroup>
						
						<!-- function will display rows ($person Array is used in mylib.php) -->
						<?php display_rows() ?>

					</table>
					<div class="instructions">
						Example shows how to save form data using AJAX.
						After element from the left table is moved to the dropzone, it will be expanded with displayed form elements.
						If expanded DIV element is returned back to the left table, nothing will happen (DIV element will be returned to the initial form).
						On the other hand, form data can be changed and saved.
						JavaScript will call PHP script and try to save form values.
						In this demo, PHP script will "fake saving" and return "OK" string so client logic will think that server job is done correctly.
						In this case, client side will update innerHTML of DIV element and new name will be displayed when DIV element will be returned to it's place on the left table.
						<br/>
						<br/>
						But, when the updated DIV element will be dragged to the dropzone again, old name will be displayed.
						That's not a BUG, because nothing is actually saved in previous step.
						<br/>
						<br/>
						If you will use this demo, you will need to change mylib.php, db_ajax.php and db_save.php.
					</div>
				</div>
			</div><!-- left container -->
			
			<!-- right container -->
			<div id="right">
				<table cellspacing="0" cellpadding="0">
					<colgroup><col width="400"/></colgroup>
					<tr class="maintd"><td></td></tr>
				</table>
			</div>
		</div>
	</body>
</html>