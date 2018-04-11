$(function(){
	var _status = 0;
	var _num = 0;
	$('.fg').each(function(){
		_num ++;
		$(this).attr('num',_num);
	})


	$('.fg').on('click',function(){
		if($(this).attr('aa') != 1){
			if(_status == 0){
				$(this).html('<div class="qz1"></div>').attr('aa',1).attr('type','0');
				_status = 1;
			} else {
				$(this).html('<div class="qz2"></div>').attr('aa',1).attr('type','1');
				_status = 0;
			}
			isend();
		}
	})
	function isend(){
		$('.fg').each(function(){
			if($(this).attr('aa') == "1"){
				var _type = $(this).attr('type');
				var _num = parseInt($(this).attr('num'));
				//竖着
				var end = true;
				for(var i = 1; i<5; i++){
					if($('.fg[num='+(_num+13*i)+']').attr('type') != _type){
						end = false;
						i=5;
					}
				}
				if(end){
					alert('游戏结束');
					$('.fg').off('click');
					return;
				}
				//横着
				var end = true;
				for(var i = 1; i<5; i++){
					if($('.fg[num='+(_num+i)+']').attr('type') != _type){
						end = false;
						i=5;
					}
				}
				if(end){
					alert('游戏结束');
					$('.fg').off('click');
					return;
				}
				//斜着
				var end = true;
				for(var i = 1; i<5; i++){
					_num = _num+14;
					if($('.fg[num='+_num+']').attr('type') != _type){
						end = false;
						i=5;
					}
				}
				if(end){
					alert('游戏结束');
					$('.fg').off('click');
					return;
				}
				//斜着
				var end = true;
				var _num = parseInt($(this).attr('num'));
				for(var i = 1; i<5; i++){
					_num = _num- 12;
				
					if($('.fg[num='+_num+']').attr('type') != _type){
						end = false;
						i=5;
					}
				}
				if(end){
					alert('游戏结束');
					$('.fg').off('click');
					return;
				}
			}
		})
	}
})
