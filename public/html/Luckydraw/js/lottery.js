$(document).ready(function(){
	getAward();	

});

function redClick(){
	$('#red').unbind("click");
	$('#red').css("pointer-events","none");
	getNumber();
	
}
var _num = 0;	
function getNumber(){
	
	var userId;
	if($("#userId").val() != "" && $("#userId").val() != null){
		userId = $("#userId").val();
	}else{
		userId = $("#userIdHidden").val();
	}
	$.ajax({
		url : '/activity/activity/drawLottery.json',
		dataType : 'json',
		type : "post",
		data:{
			token:$("#token").val(),
			userId:userId,
			phone : $("#phoneHidden").val()
		},
        success:function(data){
        	var lottery=data.generalResult.result;
        	
        	//alert(lottery.id);
        	if(data == null){
        	}
        	if(data.generalResult.returnCode== 0){
        		var count=12;
        		var num = parseInt($("#run").attr("value"));
        		
        		var _tag = lottery.index;
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
        		
        		
        		//setInterval('$("#red").css("pointer-events","auto")', 2000);
        		setTimeout("showMsg('"+lottery.name+"')", (count+15)*80);
           }else if(data.generalResult.returnCode=="2"){
        	   layer.alert("登陆超时，请重新登陆",0);
        	   $("#red").css("pointer-events","auto");
           } else{
        	   layer.alert(data.generalResult.result,0); 
        	   $("#red").css("pointer-events","auto");
           }
        	
        	$("#run").attr("value",num);
        	$('#red').bind("click",function(){
   			   redClick();
  	 		}); 
        	$("#red").css("pointer-events","auto");
        	
		},
		error :function(data){
			layer.alert("登陆超时，请重新登陆",0);
		}
	});
	
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

	$.ajax({
		url : '/activity/activity/getLottery.json',
		dataType : 'json',
		type : "post",
        success:function(data){
        	if(data.generalResult.returnCode== "0"){
        		var lotteryList=data.generalResult.result;
        		var html = [];
        		$("#showLottery").empty();
        		
        		if(lotteryList.length>=10){
        		html.push('<div class="row">');
        		html.push('<div id="cj0" class="award-grade piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[0].imagePath+')" ><div class="award-text-coupon">'+lotteryList[0].name+'</div></div>');
        		html.push('<div id="cj1" class="award-coupon piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[1].imagePath+')"><div class="award-text">'+lotteryList[1].name+'</div></div>');
        		html.push('<div id="cj2" class="award-grade piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[2].imagePath+')"><div class="award-text">'+lotteryList[2].name+'</div></div>');
        		html.push('<div id="cj3" class="award-coupon piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[3].imagePath+')"><div class="award-text-coupon">'+lotteryList[3].name+'</div></div>');
        		html.push('</div>');
        		html.push('<div class="row">');
        		html.push('<div id="cj11" class="award-coupon piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[11].imagePath+')"><div class="award-text">'+lotteryList[11].name+'</div></div>');
        		html.push('<div  class="award-grade piece full-size" ><div class="award-text">'+lotteryList[0].name+'</div></div>');
        		html.push('<div  class="award-coupon piece full-size" ><div class="award-text">'+lotteryList[0].name+'</div></div>');
        		html.push('<div id="cj4" class="award-grade piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[4].imagePath+')"><div class="award-text">'+lotteryList[4].name+'</div></div>');
        		html.push('</div>');
        		html.push('<div class="row">');
        		html.push('<div id="cj10" class="award-grade piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[10].imagePath+')"><div class="award-text">'+lotteryList[10].name+'</div></div>');
        		html.push('<div  class="award-coupon piece full-size" ><div class="award-text">'+lotteryList[0].name+'</div></div>');
        		html.push('<div  class="award-grade piece full-size" ><div class="award-text">'+lotteryList[0].name+'</div></div>');
        		html.push('<div id="cj5" class="award-coupon piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[5].imagePath+')"><div class="award-text">'+lotteryList[5].name+'</div></div>');
        		html.push('</div>');
        		html.push('<div class="row">');
        		html.push('<div id="cj9" class="award-coupon piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[9].imagePath+')"><div class="award-text-coupon">'+lotteryList[9].name+'</div></div>');
        		html.push('<div id="cj8" class="award-grade piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[8].imagePath+')"><div class="award-text">'+lotteryList[8].name+'</div></div>');
        		html.push('<div id="cj7" class="award-coupon piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[7].imagePath+')"><div class="award-text">'+lotteryList[7].name+'</div></div>');
        		html.push('<div id="cj6" class="award-grade piece full-size" style="background-image:url(/resources/image/lottery/'+lotteryList[6].imagePath+')"><div class="award-text-coupon">'+lotteryList[6].name+'</div></div>');
        		html.push('</div>');
        		
        		html.push('<div id="red" class="red" ><div class="award-text-center">我要抽奖</div></div>');
        		
        		html.push('<div id="run" class="run" value="0"></div>');
        		
        		html.push('<div class="one-chance"><span>每次用车评价后可获得一次抽奖机会</span></div>');
        		}
        	   $("#showLottery").html(html.join(""));
        	   $('#red').bind("click",function(){
        		   redClick();
        	   	}); 
        
        	  
           }else{
        	   alert(data.generalResult.result); 
           }
		}
	});

}


