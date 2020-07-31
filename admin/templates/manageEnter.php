<?php

session_start();

$login = $_SESSION["ylogin"];
$password = $_SESSION["ypassword"];
echo "<div id = 'enter_inputs'>";
echo "<h2> Текущие данные: </h2>";
echo "<p> Логин: <input type = 'text' id = 'ylogin' value = '{$login}'></p>";
echo "<p> Пароль: <input type = 'text' id = 'ypassword' value = '{$password}'></p>";
echo "<button id = 'enter'>Изменить логин и пароль</button>";
echo "</div>";
echo '<script>$("#enter").on("mousedown",changeLogin)</script>';

?>