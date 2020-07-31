<?php

$images = scandir ("../../images");
for($i = 2; $i < count($images); $i++){
	echo "<div class = 'image' data-img = '".$images[$i]."'><img src = '../images/".$images[$i]."'><p align='center'>".$images[$i]."</p></div>";
};
echo "<div id = 'image_inputs'>";
echo "<label for='file' id='labelFile'>";
echo 	"<div align='center'>Выбрать файл</div>";
echo 	"<input type='file' id='choose_file'>";
echo "</label>";
echo "<button id='upload'>Загрузить</button>";
echo "</div>";

?>