<?php

$servername = "127.0.0.1";
$username = "root";
$password = "root";
$dbname = "magazin2";

function connect(){
	global $servername, $username, $password, $dbname;
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	if(!$conn){
		die("Connection failed: " . mysqli_connect_error());
	}
	mysqli_set_charset($conn, "utf8");
	return $conn;
};

function init(){
	$conn = connect();
	$sql = "SELECT id, name FROM goods";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0){
		$out = array();
		while($row = mysqli_fetch_assoc($result)){
			$out[$row["id"]] = $row;
		};
		echo json_encode($out);
	}
	else{
		echo "0";
	}
	
	mysqli_close($conn);
};

function selectOneGoods(){
	$conn = connect();
	$id = $_POST["yid"];
	$sql = "SELECT * FROM goods WHERE id = ".$id;
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0){
		$row = mysqli_fetch_assoc($result);
		echo json_encode($row);
	}
	else{
		echo 0;
	}
	
	mysqli_close($conn);
};

function updateGoods(){
	$conn = connect();
	$id = $_POST["yid"];
	$name = $_POST["yname"];
	$price = $_POST["yprice"];
	$description = $_POST["ydescription"];
	$img = $_POST["yimg"];
	$color = $_POST["ycolor"];
	$catalog = $_POST["ycatalog"];
	
	$sql = "UPDATE goods SET name = '{$name}', price = {$price}, description = '{$description}', img = '{$img}', color = '{$color}', catalog = '{$catalog}' WHERE id = {$id}";
	$result = mysqli_query($conn, $sql);
	
	if ($result){
		echo "1";
	}
	else{
		echo "Error updating record: " . mysqli_error($conn);
	}
	
	mysqli_close($conn);
};

function newGoods(){
	$conn = connect();
	$name = $_POST["yname"];
	$price = $_POST["yprice"];
	$description = $_POST["ydescription"];
	$img = $_POST["yimg"];
	$color = $_POST["ycolor"];
	$catalog = $_POST["yid_catalog"];

	if($name == ""){
		$name = "Новый товар";
	}
	if($price == ""){
		$price = 777;
	}
	if($description == ""){
		$description = "Описание";
	}
	if($img == ""){
		$img = "default.jpg";
	}
	if($color == ""){
		$color = "[\"#888888\"]";
	}

	$sql = "INSERT INTO goods (name, price, description, img, color, catalog) VALUES ('{$name}',{$price},'{$description}','{$img}','{$color}',{$catalog})";
	$result = mysqli_query($conn, $sql);
	
	if ($result){
		echo "1";
	}
	else{
		echo "Error updating record: " . mysqli_error($conn);
	}
	
	mysqli_close($conn);
};

function deleteGoods(){
	$conn = connect();
	$id = $_POST["yid"];

	$sql = "DELETE FROM goods WHERE id = '{$id}'";
	$result = mysqli_query($conn, $sql);
	
	if ($result){
		echo "1";
	}
	else{
		echo "Error updating record: " . mysqli_error($conn);
	}
	
	mysqli_close($conn);
};

function checkCatalogs(){
	$conn = connect();

	$sql = "SELECT * FROM catalogs";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0){
		$out = array();
		while($row = mysqli_fetch_assoc($result)){
			if (!in_array($row["id"], $out)){
				$out[] = $row;
			};
		};
		echo json_encode($out);
	}
	else{
	}
	
	mysqli_close($conn);
}

function loadGoods(){
	$conn = connect();
	$catalog = $_POST["ycatalog"];
	$sql = "SELECT * FROM goods WHERE catalog = '{$catalog}'";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0){
		$out = array();
		while($row = mysqli_fetch_assoc($result)){
			$out[$row["id"]] = $row;
		};
		echo json_encode($out);
	}
	else{
		echo 0;
	}
	
	mysqli_close($conn);
}

function login(){
	$conn = connect();
	$login = $_POST["ylogin"];
	$password = $_POST["ypassword"];
	
	$sql = "SELECT * FROM enter WHERE user = 1 AND username = '{$login}' AND password = '{$password}'";
	$result = mysqli_query($conn, $sql);
	session_start();
	
	//
	
	if(isset($_POST["ylogin"]) && isset($_POST["ypassword"])){
		$_SESSION["ylogin"] = $_POST["ylogin"];
		$_SESSION["ypassword"] = $_POST["ypassword"];
	}
	
	//
	
	if (mysqli_num_rows($result) > 0){
		$_SESSION["yadmin"] = "login";
	}
	else{
		unset($_SESSION["ylogin"],$_SESSION["ypassword"]);
		session_destroy();
	}
	mysqli_close($conn);
	
	//
	
	header ("Location: admin.php");
	
}

function logout(){
	session_start();
	unset($_SESSION["ylogin"],$_SESSION["ypassword"],$_SESSION["yadmin"]);
	session_destroy();
}

function sendMail(){
	$out = array();
	
	// Письмо
	$message = '';
	$message .= '<h1>Заказ в магазине</h1>';
	$message .= '<p>Телефон: '.$_POST['ephone'].'</p>';
	$message .= '<p>Почта: '.$_POST['email'].'</p>';
	$message .= '<p>Клиент: '.$_POST['ename'].'</p>';
	$message .= '<p>Количество: '.$_POST['esize'].'</p>';
	$cart = $_POST['cart'];
	$cart = json_decode($cart);
	$size = $_POST['esize'];
	
	$conn = connect();
	$sql = "SELECT price, name FROM goods WHERE id = {$cart[0]}";
	$result = mysqli_query($conn, $sql);
	
	if (mysqli_num_rows($result) > 0){
		while($row = mysqli_fetch_assoc($result)){
			global $out;
			$out = $row;
		};
	}
	
	$sum = 0;
	$message .= $out["name"]." --- ";
	$message .= "Цвет:".$cart[1]." --- ";
	$message .= $size." --- ";
	$message .= $size*$out["price"];
	$message .= "<br>";
	$sum = $sum + $size*$out["price"];
	$message .= "Всего: ".$sum;

	$to = "yushin7677@gmail.com".",";
	$to .= $_POST['email'];
	$spectext = '<!DOCTYPE HTML><html>
	<head><title>Заказ</title></head>
	<body>';
	$headers = "MIME-Version: 1.0\r\n";
	$headers .= "Content-type: text/html; charset=utf-8\r\n";

	// Отправка письма
	$n = mail($to, "Заказ в магазине", $spectext.$message."</body></html>", $headers);

	if($n){
		echo 1;
	}
	else {
		echo 0;
	};

	mysqli_close($conn);
}

function updateCatalog(){
	$conn = connect();
	$name = $_POST["yname"];
	$description = $_POST["ydescription"];
	$img = $_POST["yimg"];
	$catalog = $_POST["ycatalog"];
	
	$sql = "UPDATE catalogs SET name = '{$name}', description = '{$description}', image = '{$img}' WHERE id = {$catalog}";
	$result = mysqli_query($conn, $sql);
	
	if ($result){
		echo "1";
	}
	else{
		echo "Error updating record: " . mysqli_error($conn);
	}
	
	mysqli_close($conn);
}

function newCatalog(){
	$conn = connect();
	$name = $_POST["yname"];
	$description = $_POST["ydescription"];
	$img = $_POST["yimg"];
	
	if ($name == ""){
		$name = "new catalog";	
	}
	if ($img == ""){
		$img = "default.jpg";	
	}
	
	$sql = "INSERT INTO catalogs (name, description, image) VALUES ('{$name}', 'Введите текст!', '{$img}')";
	$result = mysqli_query($conn, $sql);
	
	if ($result){
		echo "1";
	}
	else{
		echo "Error updating record: " . mysqli_error($conn);
	}
	
	mysqli_close($conn);
}

function deleteCatalog(){
	$conn = connect();
	$catalog = $_POST["ycatalog"];

	$sql = "DELETE FROM goods WHERE catalog = '{$catalog}'";
	$result = mysqli_query($conn, $sql);
	
	if (!$result){
		echo "Error delete catalog: " . mysqli_error($conn);
	}
	
	$sql = "DELETE FROM catalogs WHERE id = '{$catalog}'";
	$result	= mysqli_query($conn, $sql);
	
	if ($result){
		echo "1";
	}
	else{
		echo "Error delete catalog: " . mysqli_error($conn);
	}
	
	mysqli_close($conn);
};

function changeLogin(){
	$conn = connect();
	$login = $_POST["ylogin"];
	$password = $_POST["ypassword"];
	
	$sql = "UPDATE enter SET username = '{$login}', password = '{$password}' WHERE user = 1";
	$result	= mysqli_query($conn, $sql);
	
	if ($result){
		echo "1";
	}
	else{
		echo "Error change login: " . mysqli_error($conn);
	}
	
	mysqli_close($conn);
};

function addImage(){
	if (isset($_POST['yfile'])) {
		$uploaddir = "../images";
		$files = $_FILES;
		
		foreach( $files as $file ){
			$file_name = $file['name'];
			move_uploaded_file( $file['tmp_name'], "{$uploaddir}/{$file_name}" );
		}
		
		echo "1";
	}
	else{
		echo "0";
	}
}

function changeImage(){
	$img = $_POST["yimg"];
	$new_img = $_POST["ynew_img"];
	$result = rename ( "../images/{$img}", "../images/{$new_img}" );
	if($result){
		echo 1;
	}
	else{
		echo 0;
	}
}

function deleteImage(){
	$img = $_POST["yimg"];
	$result = unlink ( "../images/{$img}" );
	if($result){
		echo 1;
	}
	else{
		echo 0;
	}
}
?>