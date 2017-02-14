

$(function() {
    $("#page1").find("[name='lists']").children().click(function() {
        $("#bg").removeClass("ui-bg-moon-tip").addClass("ui-bg-moon");
        $("#bg").children().remove();
        $("#bg2").hide();
        $("#page1").addClass("animated flipOutY");
        $("#page2").addClass("animated flipInY").show();
        getPosition();

        setTimeout(function() {
            $("#page3").fadeIn();
            $("#page3").siblings(".ui-page").fadeOut();
        }, 3600);
    });

    $("#page3").click(function(event) {
        event.preventDefault();
        $("#bg").removeClass("ui-bg-moon").addClass("ui-bg-moon-tip");
        $("#page4").siblings(".ui-page").hide();
        $("#bg4").show();
        $("#page4").show();
    });


    $("#sharebtn").click(function(event) {
        event.preventDefault();
        $("#share").show();
    });
    $("#share").click(function(event) {
        event.preventDefault();
        $(this).hide();
    });


    shareFriend({
        callback: function() {
            $("#share").each(function() {
                $(this).hide();
            });
        }
    });
});



function getPosition() {
    var distance = Math.ceil(Math.random() * 900 + 100);
    js_param.url.publicUrl = '';
    var lists = [
        {
            "shop": "饭店",
            "position": "厨师",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-cs.png"
        }, {
            "shop": "酒吧",
            "position": "摇滚歌手",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-yggs.png"
        },
        {
            "shop": "大厦",
            "position": "保安",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-baoan.png"
        },
        {
            "shop": "隐蔽型航天基地",
            "position": "航天员",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-lbhty.png"
        },
        {
            "shop": "仓库",
            "position": "搬运工",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-byg.png"
        },
        {
            "shop": "消防局",
            "position": "消防员",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-xfy.png"
        },
        {
            "shop": "诊所",
            "position": "妇科医生",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-fkys.png"
        },
        {
            "shop": "公安局",
            "position": "警察",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-jc.png"
        },
        {
            "shop": "开发区",
            "position": "拆迁员",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-cqy.png"
        },
        {
            "shop": "园林",
            "position": "种植员",
            "imgurl": js_param.url.publicUrl + "./images/position/bg-position-zzy.png"
        }
    ];
    var num = Math.ceil(Math.random() * lists.length) - 1;
    var divEl = "";
    divEl += '<div ';
    divEl += 'style="background-image:url(' + lists[num]["imgurl"] + ')"';
    divEl += '></div>';
    $("#distance").text(distance);
    $("#shop").text(lists[num]["shop"]);
    $("#position").text(lists[num]["position"]);
    $("#bg4").find("[name='positionImg']").html(divEl);
}