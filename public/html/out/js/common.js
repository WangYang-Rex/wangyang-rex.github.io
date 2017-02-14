//显示提示
function toast(msg){
	var html =  '<div id="toast" style="display: none;">'+
					'<div class="weui_mask_transparent"></div>'+
					'<div class="rc-toast" style="background: rgba(0, 0, 0, 0.8);border-radius: 5px;color: white;padding: 0 .8rem;height: 2rem;line-height: 2rem;font-size: 0.68rem;width: auto;position: fixed;left: 50%;top: 50%;transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);">'+msg+'</div>'+
				    // '<div class="weui_toast">'+
				    //     '<i class="weui_icon_toast"></i>'+
				    //     '<p class="weui_toast_content_new">'+ (msg?msg:'') +'</p>'+
				    // '</div>'+
				'</div>';
	//var html = '<div class="rc-toast" style="background: rgba(0, 0, 0, 0.8);border-radius: 1rem;color: white;padding: 0 .8rem;height: 2rem;line-height: 2rem;font-size: 0.6rem;width: auto;position: fixed;left: 50%;top: 50%;transform: translate(-50%,-50%);-webkit-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);">'+msg+'</div>'
	$('body').append(html);
	$('#toast').show();
    setTimeout(function () {
        // $('#toast').hide();
        clearShow()
    }, 2000);
}
//显示loading
function showLoading(){
	var html =  '<div id="loadingToast" class="weui_loading_toast" style="display: none;">'+
				    '<div class="weui_mask_transparent"></div>'+
				    '<div class="weui_toast">'+
				        '<div class="weui_loading">'+
				            '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'+
				            '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
				        '</div>'+
				        '<p class="weui_toast_content">数据加载中</p>'+
				    '</div>'+
				'</div>';
	$('body').append(html);
	$('#loadingToast').show();
    setTimeout(function () {
        // $('#loadingToast').hide();
        clearShow()
    }, 2000);
}
//清楚弹窗
function clearShow(){
	$('#toast').hide().remove();
	$('#loadingToast').hide().remove();
}
//验证手机号
function validatemobile(mobile) 
   { 
       if(mobile.length==0) 
       { 
          // alert('请输入手机号码！'); 
          // document.form1.mobile.focus(); 
          return false; 
       }     
       if(mobile.length!=11) 
       { 
           // alert('请输入有效的手机号码！'); 
           // document.form1.mobile.focus(); 
           return false; 
       } 
        
       var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
       if(!myreg.test(mobile)) 
       { 
           // alert('请输入有效的手机号码！'); 
           // document.form1.mobile.focus(); 
           return false; 
       } 
       return true;
   } 

   	//置顶
   	function toTop(){
   		$(window).scrollTop(0)
   	}