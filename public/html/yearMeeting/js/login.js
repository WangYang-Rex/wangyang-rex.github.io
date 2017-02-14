$(document).ready(function(){
	showWindowHeight();
	$('.submit_div').on('click',function(){
		$('.mask').css('display','block');
		setTimeout("$('.mask').css('display','none');",2000);
	})
});
function showWindowHeight(){
	console.log("window height :"+$(window).height()); //浏览器时下窗口可视区域高度 
	console.log("document height :"+$(document).height()); //浏览器时下窗口文档的高度 
	console.log("document.body height :"+$(document.body).height());//浏览器时下窗口文档body的高度 

	var window_height = $(window).height();
	$('.app').css("height",window_height+'px');
}

