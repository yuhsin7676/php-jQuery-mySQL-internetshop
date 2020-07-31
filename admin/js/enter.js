$("#enter").on('click',enterInAdmin);

function enterInAdmin(){
	$.post(
		"core.php",
		{
			"action" : "login",
			"ylogin" : $("#ylogin").val(),
			"ypassword" : $("#ypassword").val()
		},
		function (data){
			document.location.href = "admin.php";
		}
	)
}