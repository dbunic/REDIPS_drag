<?php 

// test if input parameter is set
if (isset($_GET['id'])){
	$id = $_GET['id'];
}
// otherwise set 0 for input value
else {
	$id = 0;
}

// "Lorem ipsum" string
$lorem_ipsum = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor '
			 . 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud '
			 . 'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute '
			 . 'irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla '
			 . 'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia '
			 . 'deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur '
			 . 'adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

// calculate string length from DIV id (use only first two digits and multiply with 10)
// this is only for demo purpose to show text length variation in DIV boxes - don't think too much about it
$len = substr(preg_replace('/[^\d]+/i', '', $id), 0, 2) * 10;

// prepare substring from "Lorem ipsum" string
$rnd_text = substr($lorem_ipsum, 0, strrpos(substr($lorem_ipsum, 0, $len), ' ')) . ' ...';

?>
<div class="content">
<h3>Question - <?php print($id) ?></h3>
<img src="flower.png" width="100"/>
<?php print($rnd_text)?>
<div class="clear"></div>
</div>