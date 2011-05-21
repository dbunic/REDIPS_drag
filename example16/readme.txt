Example shows how to preview each item in hoverbox before dropping to the table. In a moment when mouse is over a DIV element in left table, AJAX request will be sent to the PHP page. get-content.php is a very simple PHP page and it can be easily replaced with other server side technology (you will need to change "content_url" parameter in script.js also).

Example16 has two CSS files: screen and print. Expand few tables, drop content in it and open "print preview". Each table should be displayed on a separate page.

Actually, table in the right container is composed of two tables attached side by side. This allows to place content of different sizes in each column. Say 3 small elements to the left column and 2 large elements on the right. 

In a case of placing expanded DIV element to the left table, it will be returned to the original state.

When element is dragged from left table, application will work in "single mode" - element could be placed only to the free table cells. After element is dropped, it will be automatically expanded and content will be displayed. Dragging elements in right table will work in "switch" mode - to enable simple content arranging (before printing).

Elements in right table can be cloned with shiftKey. Original element can be returned to the left table while cloned elements will be deleted when dropping to the left table.

Demo shows different hover colors for original and cloned elements.