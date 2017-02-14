;(function () {
  var SERVER_Path = {
    'choiceitem_getList': '/mock_ajax/choiceitem_get.njson',
    //
    // 'request_search_third_cat':'/mock_ajax/request_search_third_cat.njson',
    // 'request_search_area': '/mock_ajax/request_search_area.njson',
    // 'upload_order_pics': '/mock_ajax/upload_order_pics.njson',
    // 'add_new_order': '/mock_ajax/add_new_order.njson',

    'request_search_third_cat':'/customer/searchThirdCat',
    'request_search_area': '/customer/searchArea',
    'upload_order_pics': '/customer/uploadOrderPics',
    'add_new_order': '/customer/addNewOrder',
  };
  window.SERVER_Path = SERVER_Path;
})();

function WAjax(apiName, params, cb){
    showLoading()
    $.ajax({
        url: SERVER_Path[apiName],
        method: 'post',
		dataType: 'json',
        data: params,
        success: function(json){
            clearShow()
        	if(json.result == 100){
        		cb && cb(json);
        	} else if(json.result == 701) {
                location.href='/view/index.html';
            } else {
        		toast(json.message);
        	}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            clearShow()
            toast(XMLHttpRequest+" "+textStatus+" "+errorThrown);
        }
    })
}