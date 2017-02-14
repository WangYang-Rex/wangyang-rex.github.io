 $(function(){
	var _deg = 0;
    $(".start").on("click",function(){
		//$(".cj-bg").addClass("open");
		_deg = _deg + 920;
		$(".cj-bg").css("-webkit-transform","rotate("+_deg+"deg)");
		$(".cj-bg").css("-moz-transform","rotate("+_deg+"deg)");
		$(".cj-bg").css("-o-transform","rotate("+_deg+"deg)");
		$(".cj-bg").css("transform","rotate("+_deg+"deg)");
	})   
});

    