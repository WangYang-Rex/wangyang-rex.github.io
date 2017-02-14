$(document).ready(function(){
	init_music();
});
function init_music(){
	/*$(".icon-music").on('click',function(){
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
	})*/
	$(document).on('touchstart',function(){
		//$('.u-globalAudio').removeClass('z-pause').addClass('z-play');
		var music = document.getElementById("header_audio");
		music.play();
	})
}


