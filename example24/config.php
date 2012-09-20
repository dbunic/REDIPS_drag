<?php 

// define "component" directory name
$component_dir = 'component';

// define connection between DIV id and file inside "field" directory
$field = Array();
$field['te1'] = 'text.html';
$field['co1'] = 'contact.html';
$field['ca1'] = 'category.html';
$field['da1'] = 'date_picker.html';
$field['li1'] = 'link.html';
$field['im1'] = 'image.html';
$field['vs1'] = 'video_sharing.html';
$field['go1'] = 'google_map.html';
$field['qu1'] = 'question.html';
$field['nu1'] = 'number.html';
$field['mo1'] = 'money.html';
$field['du1'] = 'duration.html';
$field['ps1'] = 'progress_slider.html';
$field['ca2'] = 'calculation.html';
$field['ap1'] = 'app_reference.html';


// function returns complete path for the requested DIV id
function component($id) {
	global $component_dir;
	global $field;
	// test if sent id exists
	if (!array_key_exists($id, $field)) {
		$path = "$component_dir/unknown.html";
	}
	else {
		// set path to the form component
		$path = $component_dir . '/' . $field[$id];
		// if field doesn't exist then unknown.html
		if (!file_exists($path)) {
			$path = "$component_dir/unknown.html";
		}
	}
	// return path
	return $path;
}

?>