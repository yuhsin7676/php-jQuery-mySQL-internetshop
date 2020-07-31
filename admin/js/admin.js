var colorData;

$(document).ready(function(){
	document.oncontextmenu = function (){return false};
	$("#opengoods").on('mousedown',openGoods);
	$("#openimages").on('mousedown',openImages);
	$("#openenter").on('mousedown',openEnter);
	$("#logout").on('mousedown',logout);
})

// Frontend - функции

function changeColorMenu(elem){
	$(".select-menu").css({"color":"", "background-color":""});
	$(elem).css({"color":"#FFF", "background-color":"#109D61"});
}

function openGoods(){
	changeColorMenu("#opengoods");
	$.get(
		"templates/manageGoods.php",
		{
		},
		function(data){
			$("#content").html(data);
			checkCatalogs();
			$(".catalog").on('mousedown', function(data){
				showGoods(data);
			});
		}
	)
}

function openImages(){
	changeColorMenu("#openimages");
	$.get(
		"templates/manageImage.php",
		{		
		},
		function(data){
			$("#content").html(data);
			$('#labelFile').on('mousedown',function(){
				$('#choose_file').trigger('click')
			});
			$("#upload").on("mousedown",addImage);
			$(".image").on("contextmenu",openImageMenu);
		}
	)
}

function openEnter(){
	changeColorMenu("#openenter");
	$.get(
		"templates/manageEnter.php",
		{		
		},
		function(data){
			$("#content").html(data);
		}
	)
}

// Backend - функции

function showGoods(data){
	if (data != 0){
		catalogData = data;
		data = JSON.parse(data);
	}
	var out = "<div id = 'backpanel'><div id = 'back'>Назад</div></div>";
	if (data != 0){
		for (var id in data){
			out += "<div class = 'good' data-id ='" + id + "' >" + data[id].name + "</div>";
		}
	}
	out += "<div class = 'new_good' data-id ='0' >+</div>";
	out += "<div id = 'inputs_catalog'>";
	out += "<p>Название каталога</p>";
	out += "<input type='text' id = 'yname_catalog'>";
	out += "<p>Описание каталога</p>";
	out += "<textarea id = 'ydescription_catalog'></textarea>";
	out += "<p>Картинка каталога</p>";
	out += "<input type='text' id = 'yimg_catalog'>";
	out += "<input type='hidden' id = 'yid_catalog'>";
	out += "<div style='height:50px'></div>";
	out += "<button class = 'add_catalog-to-db'>Изменить</button>";
	out += "<button class = 'delete_catalog-from-db'>Удалить каталог</button>";
	out += "</div>";
	$("#content").html(out);
	$("#content .good").on('mousedown', selectGoods);
	$("#content #back").on('mousedown', openGoods);
	$(".add_catalog-to-db").on('mousedown',saveCatalogToDb);
	$(".delete_catalog-from-db").on('mousedown', deleteCatalogFromDb);
	$(".new_good").on('mousedown',saveToDb);
}

function selectGoods(){
	var id = $(this).attr("data-id");
	$.post(
		"core.php",
		{
			"action" : "selectOneGoods",
			"yid" : id
		},
		function(data){
			data = JSON.parse(data);
			var name = $("#yname_catalog").val();
			var img = $("#yimg_catalog").val();
			var desc = $("#ydescription_catalog").val();
			var id = $("#yid_catalog").val();
			var out = "<div id = 'backpanel'><div id = 'back'>Назад</div></div>";
			out += "<div id = 'inputs_good'>";
			out += "<p>Имя: <input type='text' id = 'yname'></p>";
			out += "<p>Цена: <input type='text' id = 'yprice'></p>";
			out += "<p>Описание: <textarea id = 'ydescription'></textarea></p>";
			out += "<p>Изображение: <input type='text' id = 'yimg'></p>";
			out += "<p>Цвета: <br>";
			out += "<div id = 'color-list'></div>";
			out += "<input type='hidden' id = 'ycolor'>";
			out += "<input type='hidden' id = 'ycatalog'>";
			out += "<input type='hidden' id = 'yid'>";
			out += "<button class = 'add-to-db'>Изменить</button>";
			out += "<button id = 'delete-from-db' data-catalog = '" + name + "' data-id = '" + id + "' data-img = '" + img + "' data-desc = '" + desc + "'>Удалить товар</button>";
			out += "</div>";
			$("#content").html(out);
			$("#content #back").on('mousedown', function (){
				loadGoods(id, name, desc, img);
			});
			$("#yname").val(data.name);
			$("#yprice").val(data.price);
			$("#ydescription").val(data.description);
			$("#yimg").val(data.img);
			$("#ycolor").val(data.color);
			$("#yid").val(data.id);
			$("#ycatalog").val(data.catalog);
			reloadColor();
			$(".add-to-db").on('mousedown',saveToDb);
			$("#delete-from-db").on('mousedown',deleteFromDb);
		}
	);
}

function saveCatalogToDb(){
	var catalog = $("#yid_catalog").val();
	var action;
	console.log(catalog);
	if (catalog != "" && catalog != undefined){
		action = "updateCatalog";
		console.log(1);
	}
	else{
		action = "newCatalog";
		console.log(0);
	}
	$.post(
		"core.php",
		{
			"action" : action,
			"yname" : $("#yname_catalog").val(),
			"ydescription" : $("#ydescription_catalog").val(),
			"yimg" : $("#yimg_catalog").val(),
			"ycatalog" : catalog
		},
		function(data){
			if( data == 1 ){
				if (action == "newCatalog"){
					openGoods();
				}
			}
			else{
				console.log(data);
			}
		}
	)
}

function saveToDb(){
	var id = $("#yid").val();
	var action; 
	if (id != "" && id != undefined){
		action = "updateGoods";
	}
	else{
		action = "newGoods";
	}
	$.post(
		"core.php",
		{
			"action" : action,
			"yid" : id,
			"yname" : $("#yname").val(),
			"yprice" : $("#yprice").val(),
			"ydescription" : $("#ydescription").val(),
			"yimg" : $("#yimg").val(),
			"ycolor" : $("#ycolor").val(),
			"ycatalog" : $("#ycatalog").val(),
			"yid_catalog" : $("#yid_catalog").val()
		},
		function(data){
			if( data == 1 ){
				if (action == "newGoods"){
					var name = $("#yname_catalog").val();
					var	desc = $("#ydescription_catalog").val();
					var	img = $("#yimg_catalog").val();
					var	catalog = $("#yid_catalog").val();
					loadGoods(catalog, name, desc, img);
				}
			}
			else{
				console.log(data);
			}
		}
	)
}

function deleteCatalogFromDb(){
	var catalog = $("#yid_catalog").val();
	if (catalog != ""){
		$.post(
			"core.php",
			{
				"action" : "deleteCatalog",
				"ycatalog" : catalog
			},
			function(data){
				if( data == 1 ){
					openGoods();
					checkCatalogs();
				}
				else{
					console.log(data);
				}
			}
		)
	}
	else{
		alert("Каталог новый!");
	}
}

function deleteFromDb(){
	var id = $("#yid").val();
	var name_cat = $("#delete-from-db").attr("data-catalog");
	var img_cat = $("#delete-from-db").attr("data-img");
	var desc_cat = $("#delete-from-db").attr("data-desc");
	var id_cat = $("#delete-from-db").attr("data-id");
	if (id != ""){
		$.post(
			"core.php",
			{
				"action" : "deleteGoods",
				"yid" : id
			},
			function(data){
				if( data == 1 ){
					loadGoods(id_cat, name_cat, desc_cat, img_cat)
				}
				else{
					console.log(data);
				}
			}
		)
	}
	else{
		alert("Товар новый!");
	}
}

function addColor(){
	var colorArray = JSON.parse($("#ycolor").val());
	colorArray.push("#FF0000");
	colorArray = JSON.stringify(colorArray);
	$("#ycolor").val(colorArray);
	reloadColor();
}

function deleteColor(){
	var id = $(this).attr("data-id");
	var colorArray = JSON.parse($("#ycolor").val());
	colorArray.splice(id,1);
	colorArray = JSON.stringify(colorArray);
	$("#ycolor").val(colorArray);
	reloadColor();
}

function reloadColor(){
	var colorArray = JSON.parse($("#ycolor").val());
	var colors = "";
	for(var i = 0; i < colorArray.length; i++){
		colors += "<div class='color' style='background-color:" + colorArray[i] + "' data-color='" + colorArray[i] + "' data-id='" + i + "'></div>";
	};
	colors += "<div class='add-color'>+</div>";
	$("#color-list").html(colors);
	$(".add-color").on('mousedown',addColor);
	$(".color").on('contextmenu',openColorMenu);
}

function openColorMenu(){
	var id = $(this).attr("data-id");
	var color = $(this).attr("data-color");
	var x = event.clientX;
	var y = event.clientY;
	var out = "<div class = 'swim' id='color-menu' style='top:" + y + "px; left:" + x + "px;'>";
	out += "<div class = 'swimpoint' id='change-color' data-color='" + color + "' data-id='" + id + "'>Изменить</div>";
	out += "<div class = 'swimpoint' id='delete-color' data-color='" + color + "' data-id='" + id + "'>Удалить</div>";
	out += "</div>";
	$("body").append(out);
	$("#change-color").on("mousedown",openPalette);
	$("#delete-color").on("mousedown",deleteColor);
	$(document).on("mousedown",closeColorMenu);
}

function closeColorMenu(){
	$("#color-menu").remove();
}

function openPalette(){
	var id = $(this).attr("data-id");
	var color = $(this).attr("data-color");
	var x = event.clientX;
	var y = event.clientY;
	var out = "<div class = 'swim' id='color-palette' style='top:" + y + "px; left:" + x + "px;'>";
	out += "<input type='text' id='choose-color' value='" + color + "'>";
	out += "<button id='close-palette' data-id='" + id + "'>Изменить и закрыть</button>";
	out += "</div>";
	$("body").append(out);
	$("#close-palette").on("mousedown",closePalette);
}

function closePalette(){
	var id = $(this).attr("data-id");
	var color = $("#choose-color").val();
	var colorArray = JSON.parse($("#ycolor").val());
	colorArray[id] = color;
	colorArray = JSON.stringify(colorArray);
	$("#ycolor").val(colorArray);
	reloadColor();
	$("#color-palette").remove();
}

function openImageMenu(){
	var img = $(this).attr("data-img");
	var x = event.clientX;
	var y = event.clientY;
	var out = "<div class = 'swim' id='img-menu' style='top:" + y + "px; left:" + x + "px;'>";
	out += "<div class = 'swimpoint' id='change-img' data-img='" + img + "'>Переименовать</div>";
	out += "<div class = 'swimpoint' id='delete-img' data-img='" + img + "'>Удалить</div>";
	out += "</div>";
	$("body").append(out);
	$("#change-img").on("mousedown",openText);
	$("#delete-img").on("mousedown",deleteImage);
	$(document).on("mousedown",closeImageMenu);
}

function closeImageMenu(){
	$("#img-menu").remove();
}

function addImage(){
	var files = $("#choose_file").prop('files');
	var data = new FormData();
	$.each(files, function(key, value){
		data.append( key, value );
	});
	data.append( 'yfile', 1 );
	data.append( 'action', "addImage" );
	
	$.ajax({
		url : "core.php",
		type : "POST",
		data : data,
		"action" : "addImage",
		processData: false,
        contentType: false,
		success: function(data){
			if(data == 1){
				openImages();
				console.log(data);
			}
			else{
				console.log(data);
			}
		}
	})
}

function deleteImage(){
	var img = $(this).attr("data-img");
	$.post(
		"core.php",
		{
			"action" : "deleteImage",
			"yimg" : img
		},
		function(data){
			if(data == 1){
				openImages();
			}
			else{
				console.log(data);
			}
		}
	)
}

function openText(){
	var img = $(this).attr("data-img");
	var x = event.clientX;
	var y = event.clientY;
	var out = "<div class = 'swim' id='image-text' style='top:" + y + "px; left:" + x + "px;'>";
	out += "<input type='text' id='choose-text' value='" + img + "'>";
	out += "<button id='close-text' data-img='" + img + "'>Изменить и закрыть</button>";
	out += "</div>";
	$("body").append(out);
	$("#close-text").on("mousedown",closeText);
}

function closeText(){
	var img = $(this).attr("data-img");
	var new_img = $("#choose-text").val();
	$.post(
		"core.php",
		{
			"action" : "changeImage",
			"yimg" : img,
			"ynew_img" : new_img,
		},
		function(data){
			if(data == 1){
				openImages();
			}
			else{
				console.log(data);
			}
		}
	)
	$("#image-text").remove();
}

function logout(){
	$.post(
		"core.php",
		{
			"action" : "logout"
		},
		function (data){
			document.location.href = "admin.php";
		}
	);
}

function checkCatalogs(){
	$.post(
		"core.php",
		{
			"action" : "checkCatalogs",
		},
		function(data){
			data = JSON.parse(data);
			var out = "<div style='width:100%; height:50px'></div>";
			for (var i = 0; i < data.length; i++){
				out += "<div class = 'catalog' data-catalog='" + data[i].id + "' data-img='" + data[i].image + "' data-desc='" + data[i].description + "' data-name='" + data[i].name + "'>" + data[i].name + "</div>";
			}
			out += "<div class = 'new_catalog' data-catalog=''>+</div>";
			$("#content").html(out);
			$(".catalog").on("mousedown",function(){
				var id = $(this).attr("data-catalog");
				var name = $(this).attr("data-name");
				var desc = $(this).attr("data-desc");
				var img = $(this).attr("data-img");
				loadGoods(id, name, desc, img);
			});
			$(".new_catalog").on('mousedown',saveCatalogToDb);
		}
	)
}

function loadGoods(id, name, desc, img){
	if(id != ""){
		$.post(
			"core.php",
			{
				"action" : "loadGoods",
				"ycatalog" : id
			},
			function(data){
				showGoods(data);
				$("#yname_catalog").val(name);
				$("#ydescription_catalog").val(desc);
				$("#yimg_catalog").val(img);
				$("#yid_catalog").val(id);
			}
		)
	}
	else{
		$("#yname_catalog").val("");
		$("#ydescription_catalog").val("");
		$("#yimg_catalog").val("");
		$("#yid_catalog").val("");
	}
}

function changeLogin(){
	$.post(
		"core.php",
		{
			"action" : "changeLogin",
			"ylogin" : $("#ylogin").val(),
			"ypassword" : $("#ypassword").val()
		},
		function(data){
			if( data == 1 ){
				logout();
			}
			else{
				console.log(data);
			}
		}
	)
}