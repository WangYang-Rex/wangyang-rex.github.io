$(document).ready(function(){
	showWindowHeight();
	//pageTouchStart_AddeventListener();
	document.addEventListener("touchmove",function(e){
		e.preventDefault();
		e.stopPropagation();
	},false);
	init_music();
	init_mask();
	var _is_play = 0;
	$('html').bind('touchstart',function(){
		if(_is_play == 0){
			var music = document.getElementById("header_audio");
			music.play();
			_is_play = 1;
			$('html').unbind('touchstart');
		}
	});
	$(".vote_btn").on('click',function(){
		$('.popdiv').css('transform','translateX(0%)').css('-webkit-transform','translateX(0%)');
	})
	$(".popbtn_gray").on('click',function(){
		$('.popdiv').css('transform','translateX(300%)').css('-webkit-transform','translateX(300%)');
	})
});
function showWindowHeight(){
	console.log("window height :"+$(window).height()); //浏览器时下窗口可视区域高度 
	console.log("document height :"+$(document).height()); //浏览器时下窗口文档的高度 
	console.log("document.body height :"+$(document.body).height());//浏览器时下窗口文档body的高度 

	var window_height = $(window).height();
	//$('.app').css("height",window_height+'px');
	//$('.page').css("height",window_height+'px');
	$('.page2').css("height",window_height+'px');
	$('.page3').css("-webkit-transform","translateY("+window_height+"px)").css("transform","translateY("+window_height+"px)");

	var pic_height = parseInt($(".pic").css('height'))-10;
	$(".pic").css('width',pic_height+'px');

	var window_width = $(window).width();
	var popdiv_left = ((window_width - 380)/2/window_width)*100;
	$('.popdiv').css("left",popdiv_left+"%");
}
function pageTouchStart_AddeventListener(){
	$(".app_content").bind('touchstart',function(e){
		if(($(".z_move").attr('index') != undefined)){
			return false;
		}else{
		console.log("touchstart !");
		if (e.targetTouches.length == 1) { 
			var o = this;
			console.log("onefinger !");
			var touch_start = event.targetTouches[0]; 
			console.log("touch.pageY : "+touch_start.pageY);
			var touchstart_pageY = touch_start.pageY;
			var statue = 0;//是否拖动 0不拖 1拖
			var direction = 0;//拖动方向 0下 1上 
			var window_height = $(window).height();
			$(".app_content").bind("touchmove",function(e){
				if (e.targetTouches.length == 1) { 
					var touch_move = event.targetTouches[0];
					console.log("touchmove : "+touch_move.pageY);
					var touchmove_pageY = touch_move.pageY;
					var dy = touchmove_pageY - touchstart_pageY;
					var is_move = 0;//表示有没有开始拖动 0没有开始 1已经开始
					if(statue == 0){
						if(dy>10 || dy<-10){
							statue = 1;
							console.log("开始拖动");
							var _index = parseInt($(".z_current").attr('index'));
							console.log("index:"+ _index );
							if(dy>10){
								direction = 0;
								$('.page').each(function(){
									if((_index-1)==$(this).attr('index')){
										$(this).addClass('z_move');
										$(this).css("-webkit-transform","translateY(-"+window_height+"px)").css("transform","translateY(-"+window_height+"px)");
										is_move = 1;
									}
								})
							}
							else if(dy<-10){
								direction = 1;
								$('.page').each(function(){
									if((_index+1)==$(this).attr('index')){
										$(this).addClass('z_move');
										$(this).css("-webkit-transform","translateY("+window_height+"px)").css("transform","translateY("+window_height+"px)");
										is_move = 1;
									}
								})
							}
						}
					}
					else{
						if(direction == 0){
						var aa = -window_height + dy;
						}
						else{
							var aa = window_height + dy;
						}
						$(".z_move").css("transform","translateY("+aa+"px)").css("-webkit-transform","translateY("+aa+"px)");
						
					}
				}
			});
			$(".app_content").bind("touchend",function(e){
				console.log("touchend !");
				$(".app_content").unbind("touchmove");
				if($(".z_move").attr('index') != undefined){
					//$(".app_content").unbind('touchstart');
					setTimeout('set_currentPage()', 400);
					$(".z_move").css("transform","translateY(0px)").css("-webkit-transform","translateY(0px)");
				}
				$(".app_content").unbind("touchend");
			});
		} 
	}
	})
}
function set_currentPage(){
	$(".page").removeClass("z_current");
	$(".z_move").addClass('z_current').removeClass('z_move');
}
function init_music(){
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
	var _mask_show_num = 0;
	$(".mask-circle-1").on('click',function(){
		$(this).css("display",'none');
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * 0 +'px")', 100);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * 0 +'px")', 200);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * 0 +'px")', 300);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * 0 +'px")', 400);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -1 +'px")', 500);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -1 +'px")', 600);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -1 +'px")', 700);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -1 +'px")', 800);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -0 +'px '+ window_height * -2 +'px")', 900);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -1 +'px '+ window_height * -2 +'px")', 1000);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -2 +'px '+ window_height * -2 +'px")', 1100);
		setTimeout('$(".touch-1").css("-webkit-mask","'+ 640 * -3 +'px '+ window_height * -2 +'px")', 1200);
		_mask_show_num ++;
		if(_mask_show_num ==3){
			setTimeout('show_touch4()', 1300);
		}
	})
	$(".mask-circle-2").on('click',function(){
		$(this).css("display",'none');
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
	setTimeout('$(".page3").css("-webkit-transform","translateY(0px)").css("transform","translateY(0px)")', 100);
	setTimeout('set_currentPage()', 2000);
}
function showpage_vote(){
	$('.vote').css('transform','translateX(0%)').css('-webkit-transform','translateX(0%)');
}
function move(){
	/*$(".mea").bind('mousedown',function(e){
			target.hideBgdiv();
			var o = this;
			var e = e ? e : window.event;
			if(!window.event) {e.preventDefault();}
			var tX=o.offsetLeft,
				dx=e.clientX;
			document.onmousemove=function(e){
				var e = e ? e : window.event;
				var len=tX+e.clientX-dx;
				if(len>=-5 && len<= target.config.processbarwidth){
					o.style.left=len+"px";
					if(len>0){
						target.myVideo.currentTime = target.myVideo.duration * len / target.config.processbarwidth;
					}
				}
			}
			document.onmouseup=function(){
				document.onmousemove=null;
				document.onmouseup=null;
			}
	})*/
}