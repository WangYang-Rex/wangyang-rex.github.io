$(document).ready(function(){
	showWindowHeight();
	init_music();
	init_mask();

});
function showWindowHeight(){
	console.log("window height :"+$(window).height()); //浏览器时下窗口可视区域高度 
	console.log("document height :"+$(document).height()); //浏览器时下窗口文档的高度 
	console.log("document.body height :"+$(document.body).height());//浏览器时下窗口文档body的高度 

	var window_height = $(window).height();
	//alert("屏幕宽度为："+window_height);
	if(window_height<= 1008){
		$('.app').css("min-height",'1008px');
	}
	else{
		$('.app').css("min-height",window_height+'px');
	}
	$('.page2').css("height",window_height+'px');
	$('.page3').css("-webkit-transform","translateY("+window_height+"px)").css("transform","translateY("+window_height+"px)");

	/*var pic_height = parseInt($(".pic").css('height'))-10;
	$(".pic").css('width',pic_height+'px');*/

	var window_width = $(window).width();
	var popdiv_left = ((window_width - 380)/2/window_width)*100;
	$('.popdiv').css("left",popdiv_left+"%");

	$(".vote_btn").on('click',function(){
		$('.popdiv').css('display','block');
	})
	$(".popbtn_gray").on('click',function(){
		$('.popdiv').css('display','none');
	})
}
function init_music(){
	$('html').one('touchstart',function(){
		var music = document.getElementById("header_audio");
		music.play();
		//$('html').unbind('touchstart');
	});
	$(".icon-music").on('click',function(){
		if($('.u-globalAudio').hasClass('z-pause')){
			$('.u-globalAudio').removeClass('z-pause').addClass('z-play');
			$('.u-globalAudio span').addClass('z-show').text("开启");
			var music = document.getElementById("header_audio");
			if(music.paused){
				music.play();
			}
			setTimeout('$(".u-globalAudio span").removeClass("z-show")', 1000);
		}
		else{
			$('.u-globalAudio').removeClass('z-play').addClass('z-pause');
			$('.u-globalAudio span').addClass('z-show').text("关闭");
			var music = document.getElementById("header_audio");
			if(music.played){
				music.pause();
			}
			setTimeout('$(".u-globalAudio span").removeClass("z-show")', 1000);
		}
	})
}
function init_mask(){
	var window_height = $(window).height();
	if(window_height<1008){
		window_height = 1008;
	}
	var _mask_show_num = 0;
	$(".mask-circle-1").on('click',function(){
		$(this).css("display",'none');
		/*setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -0)-40) +'px '+ ((window_height * 0)-140) +'px")', 100);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -1)-40) +'px '+ ((window_height * 0)-140) +'px")', 200);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -2)-40) +'px '+ ((window_height * 0)-140) +'px")', 300);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -3)-40) +'px '+ ((window_height * 0)-140) +'px")', 400);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -0)-40) +'px '+ ((window_height * -1)-140) +'px")', 500);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -1)-40) +'px '+ ((window_height * -1)-140) +'px")', 600);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -2)-40) +'px '+ ((window_height * -1)-140) +'px")', 700);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -3)-40) +'px '+ ((window_height * -1)-140) +'px")', 800);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -0)-40) +'px '+ ((window_height * -2)-140) +'px")', 900);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -1)-40) +'px '+ ((window_height * -2)-140) +'px")', 1000);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -2)-40) +'px '+ ((window_height * -2)-140) +'px")', 1100);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -3)-40) +'px '+ ((window_height * -2)-140) +'px")', 1200);*/
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -0)-40) +'px '+ ((window_height * 0)-140) +'px")', 100);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -1)-40) +'px '+ ((window_height * 0)-140) +'px")', 200);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -2)-40) +'px '+ ((window_height * 0)-140) +'px")', 300);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -3)-40) +'px '+ ((window_height * 0)-140) +'px")', 400);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -0)-40) +'px '+ ((window_height * -1)-140) +'px")', 500);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -1)-40) +'px '+ ((window_height * -1)-140) +'px")', 600);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -2)-40) +'px '+ ((window_height * -1)-140) +'px")', 700);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -3)-40) +'px '+ ((window_height * -1)-140) +'px")', 800);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -0)-40) +'px '+ ((window_height * -2)-140) +'px")', 900);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -1)-40) +'px '+ ((window_height * -2)-140) +'px")', 1000);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -2)-40) +'px '+ ((window_height * -2)-140) +'px")', 1100);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ ((640 * -3)-40) +'px '+ ((window_height * -2)-140) +'px")', 1200);
		_mask_show_num ++;
		if(_mask_show_num ==3){
			setTimeout('show_touch4()', 1300);
		}
	})
	$(".mask-circle-2").on('click',function(){
		$(this).css("display",'none');
		/*setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * 0 +'px")', 100);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * 0 +'px")', 200);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * 0 +'px")', 300);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * 0 +'px")', 400);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -1 +'px")', 500);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -1 +'px")', 600);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -1 +'px")', 700);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -1 +'px")', 800);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -2 +'px")', 900);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -2 +'px")', 1000);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -2 +'px")', 1100);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -2 +'px")', 1200);*/
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * 0 +'px")', 100);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * 0 +'px")', 200);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * 0 +'px")', 300);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * 0 +'px")', 400);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -1 +'px")', 500);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -1 +'px")', 600);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -1 +'px")', 700);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -1 +'px")', 800);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -2 +'px")', 900);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -2 +'px")', 1000);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -2 +'px")', 1100);
		setTimeout('$(".touch-2").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -2 +'px")', 1200);
		_mask_show_num ++;
		if(_mask_show_num ==3){
			setTimeout('show_touch4()', 1300);
		}
	})
	$(".mask-circle-3").on('click',function(){
		$(this).css("display",'none');
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * 0 +'px")', 100);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * 0 +'px")', 200);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * 0 +'px")', 300);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * 0 +'px")', 400);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -1 +'px")', 500);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -1 +'px")', 600);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -1 +'px")', 700);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -1 +'px")', 800);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -2 +'px")', 900);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -2 +'px")', 1000);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -2 +'px")', 1100);
		setTimeout('$(".touch-3").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -2 +'px")', 1200);
		_mask_show_num ++;
		if(_mask_show_num ==3){
			setTimeout('show_touch4()', 1300);
		}
	})
}
function show_touch4(){
	var window_height = $(window).height();
	if(window_height<1008){
		window_height = 1008;
	}
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * 0 +'px")', 100);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * 0 +'px")', 200);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * 0 +'px")', 300);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * 0 +'px")', 400);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -1 +'px")', 500);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -1 +'px")', 600);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -1 +'px")', 700);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -1 +'px")', 800);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -2 +'px")', 900);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -2 +'px")', 1000);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -2 +'px")', 1100);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -2 +'px")', 1200);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -3 +'px")', 1300);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -3 +'px")', 1400);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -3 +'px")', 1500);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -3 +'px")', 1600);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -4 +'px")', 1700);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -4 +'px")', 1800);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -4 +'px")', 1900);
	setTimeout('$(".touch-4").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -4 +'px")', 2000);
	/*setTimeout('showpage_vote()', 2100);*/
	setTimeout('showpage3()', 2100);
}
function showpage3(){
	$('.page3').addClass('z_move');
	setTimeout('$(".page3").css("-webkit-transform","translateY(0px)").css("transform","translateY(0px)")', 300);
	setTimeout('set_currentPage()', 100);
}
function set_currentPage(){
	$(".page2").removeClass("z_current");
	$(".z_move").addClass('z_current').removeClass('z_move');
}