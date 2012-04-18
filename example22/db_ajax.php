<?php 
// include PHP functions from mylib.php
include('mylib.php');

// test if input parameter is set
if (isset($_GET['id'])){
	$id = $_GET['id'];
}
// otherwise set 0 for input value
else {
	$id = 0;
}

// get person's details
$person = get_detail($id);

// get first name, last name and email
$fname = $person[0];
$lname = $person[1];
$email = $person[2];

?>
<!-- form with displayed details -->
<form id="myform" class="myform" method="post" action="db_save.php">
	<h1>Person id <?php print($id) ?></h1>

	<label for="name">First Name</label>
	<br/>
	<input type="text" id="fname" name="fname" value="<?php print $fname?>" class="text" />
	<br/>

	<label for="name">Last Name</label>
	<br/>
	<input type="text" id="lname" name="lname" value="<?php print $lname?>" class="text" />
	<br/>

	<label for="email">Email</label>
	<br/>
	<input type="text" name="email" value="<?php print $email?>" class="text" />
	<br/>
	<input type="button" value="Save" class="button" onclick="redips.save(this)" title="Save form"/><span id="message"></span>
</form>
