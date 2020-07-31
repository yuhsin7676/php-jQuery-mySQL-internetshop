<?php 
session_start();

require "templates/header.php";

if ($_SESSION["yadmin"] == "login"){
	require "templates/manage.php";
}
else{
	require "enter.php";
}

require "templates/footer.php";

?>