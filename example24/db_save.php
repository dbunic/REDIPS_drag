<?php

// accept JSON parameter (and Un-quote string if needed)
$p = stripslashes($_REQUEST['json']);
// decode JSON object
$arr = json_decode($p);
// for demo purpose only return accepted JSON data
print 'PHP ';
print_r($arr);

?>