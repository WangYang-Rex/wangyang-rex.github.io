$(document).ready(function(){
	getAward();	

});

function redClick(){
	//$('#red').unbind("click");
	//$('#red').css("pointer-events","none");
	getNumber();
	
}
var _num = 0;	
function getNumber(){
	
	var count=12;
    var num = parseInt($("#run").attr("value"));
        		
    var _tag = Math.floor(Math.random()*10+1);
    if(_tag < num){
        count = count + _tag - num;
    }
    else
    {
        count =  _tag - num;
    }
        		
    var _clientWidth = document.body.clientWidth;
    for(var j=1;j<=12;j=j+1)
    {
		num = num + 1;
        if(num>11)
        {
        	num=0;
        }
        //setInterval(changeRun(num), 1000);
        if(_clientWidth<600)
        	changeRun_1(num);
        else
        	changeRun(num);
        			
    }
    for(var i=0;i<count;i=i+1)
    {
        num = num + 1;
        if(num>11)
        {
        	num=0;
        }
        //setInterval(changeRun(num), 1000*i);
        if(_clientWidth<600)
        	changeRun_1(num);
        else
        	changeRun(num);
    }
	$("#run").attr("value",num);
}
function showMsg(name){
	alert("恭喜您获得"+name+"!");
	$("#red").css("pointer-events","auto");
}
function changeRun(index){
	var _speed = 80;
	if(index>=12)
		index = index-12;
	if(index == 0){
		$("#run").animate({top:"1px",left:"-13px"},_speed);
	}
	else if(index == 1){
		$("#run").animate({top:"1px",left:"113px"},_speed);
	}
	else if(index == 2){
		$("#run").animate({top:"1px",left:"238px"},_speed);
	}
	else if(index == 3){
		$("#run").animate({top:"1px",left:"364px"},_speed);
	}
	else if(index == 4){
		$("#run").animate({top:"107px",left:"364px"},_speed);
	}
	else if(index == 5){
		$("#run").animate({top:"210px",left:"364px"},_speed);
	}
	else if(index == 6){
		$("#run").animate({top:"314px",left:"364px"},_speed);
	}
	else if(index == 7){
		$("#run").animate({top:"314px",left:"238px"},_speed);
	}
	else if(index == 8){
		$("#run").animate({top:"314px",left:"113px"},_speed);
	}
	else if(index == 9){
		$("#run").animate({top:"314px",left:"-13px"},_speed);
	}
	else if(index == 10){
		$("#run").animate({top:"210px",left:"-13px"},_speed);
	}
	else if(index == 11){
		$("#run").animate({top:"107px",left:"-13px"},_speed);
	}
}
function changeRun_1(index){
	var _speed = 80;
	if(index>=12)
		index = index-12;
	if(index == 0){
		$("#run").animate({top:"2px",left:"-14px"},_speed);
	}
	else if(index == 1){
		$("#run").animate({top:"2px",left:"55px"},_speed);
	}
	else if(index == 2){
		$("#run").animate({top:"2px",left:"123px"},_speed);
	}
	else if(index == 3){
		$("#run").animate({top:"2px",left:"191px"},_speed);
	}
	else if(index == 4){
		$("#run").animate({top:"66px",left:"191px"},_speed);
	}
	else if(index == 5){
		$("#run").animate({top:"130px",left:"191px"},_speed);
	}
	else if(index == 6){
		$("#run").animate({top:"194px",left:"191px"},_speed);
	}
	else if(index == 7){
		$("#run").animate({top:"194px",left:"123px"},_speed);
	}
	else if(index == 8){
		$("#run").animate({top:"194px",left:"55px"},_speed);
	}
	else if(index == 9){
		$("#run").animate({top:"194px",left:"-14px"},_speed);
	}
	else if(index == 10){
		$("#run").animate({top:"130px",left:"-14px"},_speed);
	}
	else if(index == 11){
		$("#run").animate({top:"66px",left:"-14px"},_speed);
	}
}
function getAward(){
	var html = [];
    $("#showLottery").empty();
        		

        html.push('<div class="row">');
        html.push('<div id="cj0" class="award-grade piece full-size" style="background-image:url(./img/1.png)" ><div class="award-text-coupon">奖项1</div></div>');
        html.push('<div id="cj1" class="award-coupon piece full-size" style="background-image:url(./img/2.png)"><div class="award-text">奖项2</div></div>');
        html.push('<div id="cj2" class="award-grade piece full-size" style="background-image:url(./img/3.png)"><div class="award-text">奖项3</div></div>');
        html.push('<div id="cj3" class="award-coupon piece full-size" style="background-image:url(./img/4.png)"><div class="award-text-coupon">奖项4</div></div>');
        html.push('</div>');
        html.push('<div class="row">');
        html.push('<div id="cj11" class="award-coupon piece full-size" style="background-image:url(./img/12.png)"><div class="award-text">奖项12</div></div>');
        html.push('<div  class="award-grade piece full-size" ><div class="award-text"></div></div>');
        html.push('<div  class="award-coupon piece full-size" ><div class="award-text"></div></div>');
        html.push('<div id="cj4" class="award-grade piece full-size" style="background-image:url(./img/5.png)"><div class="award-text">奖项5</div></div>');
        html.push('</div>');
        html.push('<div class="row">');
        html.push('<div id="cj10" class="award-grade piece full-size" style="background-image:url(./img/11.png)"><div class="award-text">奖项11</div></div>');
        html.push('<div  class="award-coupon piece full-size" ><div class="award-text"></div></div>');
        html.push('<div  class="award-grade piece full-size" ><div class="award-text"></div></div>');
        html.push('<div id="cj5" class="award-coupon piece full-size" style="background-image:url(./img/6.png)"><div class="award-text">奖项6</div></div>');
        html.push('</div>');
        html.push('<div class="row">');
        html.push('<div id="cj9" class="award-coupon piece full-size" style="background-image:url(./img/10.png)"><div class="award-text-coupon">奖项10</div></div>');
        html.push('<div id="cj8" class="award-grade piece full-size" style="background-image:url(./img/9.png)"><div class="award-text">奖项9</div></div>');
        html.push('<div id="cj7" class="award-coupon piece full-size" style="background-image:url(./img/8.png)"><div class="award-text">奖项8</div></div>');
        html.push('<div id="cj6" class="award-grade piece full-size" style="background-image:url(./img/7.png)"><div class="award-text-coupon">奖项7</div></div>');
        html.push('</div>');
        		
        html.push('<div id="red" class="red" ><div class="award-text-center">我要抽奖</div></div>');
        		
        html.push('<div id="run" class="run" value="0"></div>');
        		
        html.push('<div class="one-chance"><span>每次用车评价后可获得一次抽奖机会</span></div>');
	$("#showLottery").html(html.join(""));
    $('#red').bind("click",function(){
        redClick();
    }); 

}


