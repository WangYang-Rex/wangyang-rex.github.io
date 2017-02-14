function shareFriend(ops) {
    ops = $.extend({
        callback: ""//回调函数
    }, ops);

    var data = {
        appid: "",
        imgurl: ops.imgurl,
        url: ops.url || window.location.href,
        title: ops.title || '大家一起附近找工作吧',
        desc: ops.desc || '找附近工作，告别“十人居一房”“百人挤公交”“万人赴招会”的悲苦生活，乐享“家与公司一条街，别人加班我逛街”的惬意人生。'
    };
    var testHtml = "";
    if (ops.desc) {
        for (var key in data) {
            testHtml += "<div>" + key + ":" + data[key] + "</div>";
        }
        $("body").html(testHtml);
    }


    var shareTitle = data.title;
    if (data.desc) {
        shareTitle += "\r\n" + data.desc;
    }
    var shareData = {
        appid: data.appid,
        img_url: data.imgurl,
        img_width: "120",
        img_height: "120",
        link: data.url,
        desc: data.desc,
        title: data.title
    };
    var shareData2 = {
        appid: data.appid,
        img_url: data.imgurl,
        img_width: "120",
        img_height: "120",
        link: data.url,
        desc: shareTitle,
        title: shareTitle
    };
    var shareCallback = function(code) {
        if (ops.callback && typeof(ops.callback)) {
            ops.callback();
        }
    };

    var onBridgeReady = function() {
        WeixinJSBridge.call('showOptionMenu');
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke('sendAppMessage', shareData, function(res) {
                if (res.err_msg == 'send_app_msg:confirm'
                        || res.err_msg == 'send_app_msg:ok') {
                    shareCallback(data.code);
                } else {
                }
            });
        });
        // 分享到朋友圈;
        WeixinJSBridge.on('menu:share:timeline', function(argv) {
            WeixinJSBridge.invoke('shareTimeline', shareData2, function(res) {
                if (res.err_msg == 'share_timeline:ok') {
                    shareCallback(data.code);
                } else {
                }
            });
        });
    };

    if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
}