<?php

$route = $_GET['route'];

if( $route!="adminer" ){
	require "templates/header.php";
	switch ($route){
		case "":
			require "templates/cart.php";
			require "templates/main.php";
			break;
		case "main":
			require "templates/cart.php";
			require "templates/main.php";
			break;
		case "about":
			require "templates/about.php";
			break;
	}
	require "templates/footer.php";
}
else{
	header("Location: admin/admin.php");
}

?>