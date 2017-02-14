// JavaScript Document
$(function(){
	$(".tab li").on("click",function(){
		var index = $(this).index();
		$(this).addClass("cur").siblings().removeClass("cur");
		$(".content li").removeClass("cur").eq(index).addClass("cur");
		$("input[name=PageType]").val(index+1);
		MathPrice();
	});
	$("label.radio").on("click",function(){
		var self = $(this),hidden = self.siblings("input[type=hidden]");
		var val = $(this).find("input").val();
		hidden.val(val);
		self.addClass("cur").siblings().removeClass("cur");
		MathPrice();
	});
	$("input[type=number]").on("change",function(){
		var val = $(this).val();
		$(this).val(parseInt(val));
		if(val<1){$(this).val(1)}
		if(val>50){$(this).val(50)}
		MathPrice();
	});
	
	MathPrice();
	$(".submit").on("click",function(){
		var parent  = $(this).parents("li");
		var user = parent.find("input[name=contacts]").val(),
			phone= parent.find("input[name=phone]").val(),
			email= parent.find("input[name=qq]").val();
		if(user==""){ alert("请输入您的称呼"); return;}
		if(phone==""){ alert("请输入您的手机号码"); return;}
		if(!/^1[34578]\d{9}$/g.test(phone)){ alert("手机号码格式错误"); return;}
		if(email==""){ alert("请输入您的QQ号码"); return;}
		if(!/^[1-9]\d{5,9}$/g.test(email)){ alert("请填写正确格式的QQ号"); return; }
		$(this).parents("form").submit();
	})
})
function MathPrice(){
	var parent = $(".content li.cur"),
		pType = $("input[name=PageType]").val(),
		webtype = parent.find("input[name=webtype]").val(),
		pCount  = parent.find("input[name=pageCount]").val(),
		cycle  = parent.find("input[name=developmentCycle]").val(),
		deposit = parent.find("input[name=deposit]").val();
	var totalPrice = 0;
	var discount = (deposit == 1 ? 0.9 : 1);
	//PC
	if(pType==1){
		var nuitPrice = webtype==1 ? 200 : 180, overDay = cycle > 20 ? 20 : 0;
		var custom = parent.find("input[name=custom]").val() ==1 ? 200 : 0;
		totalPrice = Math.round((nuitPrice * pCount + overDay*(cycle-20) +custom)*discount/10)*10;
	}else{
		//var start = 600 ,step = 300,overCount = pCount > 4 ? Math.ceil((pCount-4)/5) : 0;
		var start = 700 ,step = 70, overCount = pCount > 5 ? (pCount-5) : 0;
		totalPrice = Math.round((start + overCount*step)*discount/10)*10;
	}
	$("em.price b").html(totalPrice);
}