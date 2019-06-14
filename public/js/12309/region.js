$(function(){
    var regionList = [
        {id: "gj", code: "100000", name: "最高人民检察院", channelWebPath: "/gj"},
        {id: "bj", code: "110000c", name: "北京", channelWebPath: "/gj/bj"},
        {id: "tj", code: "120000c", name: "天津", channelWebPath: "/gj/tj"},
        {id: "heb", code: "130000c", name: "河北", channelWebPath: "/gj/heb"},
        {id: "sxa", code: "140000c", name: "山西", channelWebPath: "/gj/sxa"},
        {id: "nmg", code: "150000c", name: "内蒙古", channelWebPath: "/gj/nmg"},
        {id: "ln", code: "210000c", name: "辽宁", channelWebPath: "/gj/ln"},
        {id: "jl", code: "220000c", name: "吉林", channelWebPath: "/gj/jl"},
        {id: "hlj", code: "230000c", name: "黑龙江", channelWebPath: "/gj/hlj"},
        {id: "sh", code: "310000c", name: "上海", channelWebPath: "/gj/sh"},
        {id: "js", code: "320000c", name: "江苏", channelWebPath: "/gj/js"},
        {id: "zj", code: "330000c", name: "浙江", channelWebPath: "/gj/zj"},
        {id: "ah", code: "340000c", name: "安徽", channelWebPath: "/gj/ah"},
        {id: "fj", code: "350000c", name: "福建", channelWebPath: "/gj/fj"},
        {id: "jx", code: "360000c", name: "江西", channelWebPath: "/gj/jx"},
        {id: "sd", code: "370000c", name: "山东", channelWebPath: "/gj/sd"},
        {id: "hen", code: "410000c", name: "河南", channelWebPath: "/gj/hen"},
        {id: "hub", code: "420000c", name: "湖北", channelWebPath: "/gj/hub"},
        {id: "hun", code: "430000c", name: "湖南", channelWebPath: "/gj/hun"},
        {id: "gd", code: "440000c", name: "广东", channelWebPath: "/gj/gd"},
        {id: "gx", code: "450000c", name: "广西", channelWebPath: "/gj/gx"},
        {id: "han", code: "460000c", name: "海南", channelWebPath: "/gj/han"},
        {id: "cq", code: "500000c", name: "重庆", channelWebPath: "/gj/cq"},
        {id: "sc", code: "510000c", name: "四川", channelWebPath: "/gj/sc"},
        {id: "gz", code: "520000c", name: "贵州", channelWebPath: "/gj/gz"},
        {id: "yn", code: "530000c", name: "云南", channelWebPath: "/gj/yn"},
        {id: "xz", code: "540000c", name: "西藏", channelWebPath: "/gj/xz"},
        {id: "sxb", code: "61000c0", name: "陕西", channelWebPath: "/gj/sxb"},
        {id: "gs", code: "620000c", name: "甘肃", channelWebPath: "/gj/gs"},
        {id: "qh", code: "630000c", name: "青海", channelWebPath: "/gj/qh"},
        {id: "nx", code: "640000c", name: "宁夏", channelWebPath: "/gj/nx"},
        {id: "xj", code: "650000c", name: "新疆", channelWebPath: "/gj/xj"},
        {id: "jsbt", code: "660000c", name: "兵团", channelWebPath: "/gj/jsbt"}
    ];
    var temp = '';
    for(var i=0; i<regionList.length; i++){
        temp += ' <li id="'+regionList[i].id+'"><a href="javascript:;" value="'+regionList[i].id+'">'+regionList[i].name+'</a></li>'
    }
    $("#region").html(temp);
    var path = window.location.href.split("/12309")[1].replace("/zjxflws", "").replace("/zdajxx", "");
    if(path){
        var onId = path == "/gj/index.shtml" ? "gj" : path.split("/")[2];
        $("#" + onId).addClass("on");
        var textShow =  $("#" + onId).text();
        if(textShow.length > 0){
            $("#localName").html(textShow);
            if(textShow.length > 4){
                $("#localName").attr("class", "title_1 spanClass_1")
            }else{
                $("#localName").attr("class", "title spanClass")
            }
        }
    }
});
