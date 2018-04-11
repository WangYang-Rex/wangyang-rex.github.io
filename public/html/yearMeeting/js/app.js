$(document).ready(function(){
	showWindowHeight();
	pageTouchStart_AddeventListener();
	document.addEventListener("touchmove",function(e){
		e.preventDefault();
		e.stopPropagation();
	},false);
	init_music();
	init_mask();
	//setTimeout(init_write_height,500);
	var _is_play = 0;
	$('html').bind('touchstart',function(){
		if(_is_play == 0){
			var music = document.getElementById("header_audio");
			music.play();
			_is_play = 1;
			$('html').unbind('touchstart');
		}
	});
	/*$('.page4_input').on('click',function(){
		location.href = 'login.html';
	})*/
	/*$('.page3_map1_div').on('click',function(){
		location.href = 'http://apis.map.qq.com/uri/v1/marker?marker=coord:30.289510,120.197620;title:杭州瑞京国际大酒店;addr:浙江省杭州市江干区秋涛北路&coord_type=2&referer=卓健微信';
	})*/
	//http://apis.map.qq.com/uri/v1/marker?marker=coord:30.289510,120.197620;
	
});
function showWindowHeight(){
	console.log("window height :"+$(window).height()); //浏览器时下窗口可视区域高度 
	console.log("document height :"+$(document).height()); //浏览器时下窗口文档的高度 
	console.log("document.body height :"+$(document.body).height());//浏览器时下窗口文档body的高度 

	var window_height = $(window).height();
	$('.app').css("height",window_height+'px');
	$('.page').css("height",window_height+'px');
	$('.next-bg img').css('margin-top','-'+(window_height/2)+'px');
}
function pageTouchStart_AddeventListener(){
	$(".app_content").bind('touchstart',function(e){
		if($(".z_move").attr('index') == '1'){
			$('.section1_bottom_text_text').html('');
			console.log('清零');
		}
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
									if(_index==1){
										_index = 5;
									}
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
									if(_index==4){
										_index = 0;
									}
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
					$('.section1_bottom_text_text').html('');
					
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
	//pageTouchStart_AddeventListener();
	var _aaaaaaa = $(".z_current").attr('index');
	if(_aaaaaaa == 1){
		setTimeout('startWrite()', 1600);
	}
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
var timer,timer_tick=0;
function handler(){
	timer_tick++;
	if(timer_tick>6){
		clearInterval(timer);
		var window_height = $(window).height(); 
		$('.prev-bg').css('-webkit-transform','translateY(-'+(window_height/2 +10)+'px)').css('transform','translateY(-'+(window_height/2 +10)+'px)');
		$('.next-bg').css('-webkit-transform','translateY('+(window_height/2 +10)+'px)').css('transform','translateY('+(window_height/2 +10)+'px)');
		$('.mask').addClass('mask_hide');
		setTimeout("$('.page1').addClass('z_current')",300);
		setTimeout("$('.mask').hide()",900);
		//setTimeout(init_write_height,500);
		init_write_height();
		timer_tick=0;
	}else{
		
	}
	console.log("timer_tick:"+timer_tick);
}
function init_write_height(){
	var _img_height = $('.page1_bottom_bg ').height();
	$('.section1_bottom_text').css('height',(_img_height*280/425)+'px');
	setTimeout(startWrite,1900);
}
function init_mask(){
	$(".finger-touch").bind('touchstart',function(e){
		timer_tick=0;
		$('.finger-touch-bright').addClass('bright');
		timer = setInterval( handler , 100);
	});
	$(".finger-touch").bind('touchend',function(e){
		timer_tick=0;
		$('.finger-touch-bright').removeClass('bright');
		//clear_mask();
	});
}
function clear_mask(){
	if(timer_tick>=1){
		var window_height = $(window).height(); 
		$('.prev-bg').css('-webkit-transform','translateY(-'+(window_height/2 +10)+'px)').css('transform','translateY(-'+(window_height/2 +10)+'px)');
		$('.next-bg').css('-webkit-transform','translateY('+(window_height/2 +10)+'px)').css('transform','translateY('+(window_height/2 +10)+'px)');
		$('.mask').addClass('mask_hide');
		setTimeout("$('.page1').addClass('z_current')",300);
		setTimeout("$('.mask').hide()",900);
	}
	else{
		$('.finger-touch-bright').removeClass('bright');
	}
	timer_tick=0;
}

/*打字效果 start*/
var words = "有一帮13的人愿意跟着这位13的老板，他们愉快地做着13的事，只为13亿人民架起健康桥梁，PASSION|BRAVE|CREATIVITY。只属于我们这代13格调的卓健人，2015新卓健-2015新起点，2015我们致力成为行业的BELLWETHER_";
			var charIndex = -1;
			var stringLength = words.length;
			var inputText="";
			function startWrite(){
				$('.section1_bottom_text_cursor').addClass('section1_bottom_text_cursor_ani');
				$('.section1_bottom_text_text').html('');
				charIndex = -1;
				inputText="";
				stringLength = words.length;
				writeContent();
			}
			function writeContent(){
				if(($(".z_move").attr('index') != undefined)){
					$('.section1_bottom_text_text').html('');
					return false;
				}
				charIndex++;
				var theChar = words[charIndex];
				if(charIndex<stringLength){
					if(theChar=='，'){
						inputText = inputText  +　'<br/>';
						if(charIndex<=stringLength){
				            setTimeout('writeContent()',400);
				        }
					}
					else if(theChar=='-'){
						inputText = inputText +　',';
						if(charIndex<=stringLength){
				            setTimeout('writeContent()',80);
				        }
					}
					else if(theChar=='|'){
						inputText = inputText +　'、';
						if(charIndex<=stringLength){
				            setTimeout('writeContent()',80);
				        }
					}
					else if(theChar=='!'){
						inputText = inputText +　'<span class="section1_bottom_text_text_puple">';
						if(charIndex<=stringLength){
				            setTimeout('writeContent()',80);
				        }
					}
					else if(theChar=='。'){
						inputText = inputText + '<br/>';
						if(charIndex<=stringLength){
				            setTimeout('writeContent()',400);
				        }
					}
					else if(theChar=='_'){
						inputText = inputText + '<br/><span class="section1_bottom_text_puple"></span>';
						$('.section1_bottom_text_text').html(inputText);
						if(charIndex<=stringLength){
				            setTimeout('writeContent2_start()',80);
				        }
						
						//$('.section1_bottom_text_cursor').removeClass('section1_bottom_text_cursor_ani');
					}
					else{
						inputText = inputText + theChar;
						if(charIndex<=stringLength){
				            setTimeout('writeContent()',80);
				        }
					}
					$('.section1_bottom_text_text').html(inputText);
				}
			}
			function writeContent2_start(){
				charIndex = -1;
				stringLength = words2.length;
				inputText="";
				writeContent2();
			}
			var words2 = "HAPPY|NEW|YEAR_";
			function writeContent2(){
				if(($(".z_move").attr('index') != undefined)){
					$('.section1_bottom_text_text').html('');
					return false;
				}
				charIndex++;
				var theChar = words2[charIndex];
				if(charIndex<stringLength){
					if(theChar=='_'){
						$('.section1_bottom_text_cursor').removeClass('section1_bottom_text_cursor_ani');
					}
					else if(theChar=='|'){
						inputText = inputText +　'  ';
						if(charIndex<=stringLength){
				            setTimeout('$(".section1_bottom_text_puple").text(inputText)',80);
				            setTimeout('writeContent2()',80);
				        }
					}
					else{
						inputText = inputText + theChar;
						if(charIndex<=stringLength){
				            setTimeout('$(".section1_bottom_text_puple").text(inputText)',80);
				            setTimeout('writeContent2()',80);
				        }
					}
				}
			}
/*打字效果 end*/

