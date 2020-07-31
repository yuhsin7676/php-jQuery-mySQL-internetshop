<?php

$action = $_POST['action'];

require_once 'function.php';

switch ($action){
	case 'init':
		init();
		break;
	case 'checkCatalogs':
		checkCatalogs();
		break;
	case 'selectOneGoods':
		selectOneGoods();
		break;
	case 'updateGoods':
		updateGoods();
		break;
	case 'newGoods':
		newGoods();
		break;
	case 'deleteGoods':
		deleteGoods();
		break;
	case 'loadGoods':
		loadGoods();
		break;
	case 'updateCatalog':
		updateCatalog();
		break;
	case 'newCatalog':
		newCatalog();
		break;
	case 'deleteCatalog':
		deleteCatalog();
		break;
	case 'login':
		login();
		break;
	case 'logout':
		logout();
		break;
	case 'sendMail':
		sendMail();
		break;
	case 'changeLogin':
		changeLogin();
		break;
	case 'addImage':
		addImage();
		break;
	case 'changeImage':
		changeImage();
		break;
	case 'deleteImage':
		deleteImage();
		break;
}

?>