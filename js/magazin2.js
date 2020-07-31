var cart; // Корзина
var goods = {};
var catalogs = {};

$('document').ready(function(){
	checkCatalogs();
	$('.send-email').on('mousedown', sendEmail);
	$('#close-cart').on('mousedown', closeCart);
});

// Пользовательские функции

function checkCatalogs(){
	$.post(
		"admin/core.php",
		{
			"action" : "checkCatalogs",
		},
		function(data){
			data = JSON.parse(data);
			catalogs = data;
			var out = '';
			for (var i = 0; i < data.length; i++){
				out += "<p class = 'select-catalog' data-catalog='" + data[i].id + "' data-img='" + data[i].image + "' data-desc='" + data[i].description + "'>" + data[i].name + "</p>";
			}
			$("#catalogs").html(out);
			$('.select-catalog').on('mousedown', loadGoods);
			$('.select-catalog:first').trigger('mousedown');
		}
	)
}

function loadGoods(){
	// загрузка товаров на страницу
	
	catalog = $(this).attr("data-catalog");
	img = $(this).attr("data-img");
	desc = $(this).attr("data-desc");
	$.post(
		"admin/core.php",
		{
			"action" : "loadGoods",
			"ycatalog" : catalog
		},
		function(data){
			data = JSON.parse(data);
			goods = data;
			var out = '';
			var outlist = '';
			for (var key in data){
				outlist += "<p class = 'select-good' data-art='" + key + "'>" + data[key]["name"] + "</p>";
			}
			out += "<img src='images/" + img + "'>";
			out += "<p class = 'text'>" + desc + "</p>";
			$("#catalog-description").html(out);
			$("#goodList").html(outlist);
			$('.select-good').on('mousedown', selectGoods);
			$('.select-good:first').trigger('mousedown');
		}
	)
}

function addToCart(){
	// добавка товара в корзину
	
	var articul = $(this).attr("data-art");
	var color = $(".colorchoose:first").val();
	cart = [articul,color];
	openCart();
}

function sendEmail(){
	var ename = $('#ename').val();
	var email = $('#email').val();
	var ephone = $('#ephone').val();
	var esize = $('#esize').val();
	if(ename!='' && email!='' && ephone!='' && esize!=''){
		if (!$.isEmptyObject(cart)){
			$.post(
				"admin/core.php",
				{
					"action" : "sendMail",
					"ename" : ename,
					"email" : email,
					"ephone" : ephone,
					"esize" : esize,
					"cart" : JSON.stringify(cart)
				},
				function(data){
					if (data == 1){
						alert("Заказ отправлен!");
					}
					else{
						alert("Повторите заказ!");
					}
				}
			);
		}
		else{
			alert("Корзина пуста!");
		}
	}
	else{
		alert("Заполните поля!");
	}
}

function openCart(){
	$('#ycart').css('display', 'block');
}

function closeCart(){
	$('#ycart').css('display', 'none');
}

function selectGoods(){
	var key = $(this).attr("data-art");
	var out = '';
	out += "<div class='single-goods' style = 'display:block;'>";
	out += "<h3>" + goods[key]["name"] + "</h3>";
	out += "<p class='desc-good'>" + goods[key]["description"] + "</p>";
	out += "<p>Цена:" + goods[key]["price"] + "</p>";
	out += "<img src='images/" + goods[key]["img"] + "'>";
	out += "<button class='add-to-card' data-art='" + key + "'>Купить</button>";
	var colors = JSON.parse(goods[key]["color"]);
	var outcolor = '';
	for (var i = 0; i < colors.length; i++){
		outcolor += "<div class='color' style = 'background-color:" + colors[i] + "' data-color='" + colors[i] + "'>";
		outcolor += "<div class='colorpanel'></div>";
		outcolor += "</div>";
	}
	outcolor += "<input type='hidden' class='colorchoose'>";
	$("#goods").html(out);
	$("#colorList").html(outcolor);
	$(".colorchoose").val(colors[0]);
	$(".color:first").on("mousedown",selectColor);
	$("button.add-to-card").on("mousedown",addToCart);
}

function selectColor(){
	var color = $(this).attr("data-color");
	$(".color").attr('class', 'color');
	$(this).attr('class', 'color choosed');
	$(".colorchoose").val(color);
}