$(function(){
    $("#regionName_1").text(regionName);
    if(regionName.length > 4){
        $("#regionName_1").attr("class", "title_1 spanClass_1")
    }else{
        $("#regionName_1").attr("class", "title spanClass")
    }
    $("#title").text(regionName + " - 人民检察院案件信息公开网");
    $.ajax({//获取页面位置信息
        async: true,
        type: 'get',
        url: '/getLocalList?channelWebPath=' + channelWebPath,
        contentType: 'application/json'
    }).done(function (res) {
        if(res.code == 200){
            var temp = '';
            for(var i=0; i< res.results.length; i++){
                if(i == res.results.length-1){
                    temp += "<a href='/12309"+res.results[i].path+"/index.shtml'>"+res.results[i].name+"</a>"
                }else{
                    temp += "<a href='/12309"+res.results[i].path+"/index.shtml'>"+res.results[i].name+" > </a>"
                }
            }
            $("#regionName").html(temp)
        }else{
            $("#regionName").text(regionName)
        }
    })
    $.ajax({//获取稿件
        async: true,
        type: 'get',
        url: '/getRegionFile?channelWebPath=' + channelWebPath + "&channelLevels=" + channelLevels,
        contentType: 'application/json'
    }).done(function (res) {
        if(res.code == 200){
            var impFileList = res.results.impFileList, lawFileList = res.results.lawFileList;
            var temp_1 = '', temp_2 = '';
            for(var i = 0; i < impFileList.length; i++){
                temp_1 += '<li><a target="_blank" href="' + impFileList[i].url
                    + '"><b class="lanmu" url="/12309' + impFileList[i].channelWebPath.replace("zdajxx", "index.shtml")
                    +"?channelLevels="+impFileList[i].channelLevels
                    + '">[' + impFileList[i].channel[impFileList[i].channel.length-2].displayName
                    + ']</b>' + impFileList[i].title
                    + '</a></li>'
            }
            for(var i = 0; i < lawFileList.length; i++){
                temp_2 += '<li><a target="_blank" href="' + lawFileList[i].url
                    + '"><b class="lanmu" url="/12309' + lawFileList[i].channelWebPath.replace("zjxflws", "index.shtml")
                    +"?channelLevels="+lawFileList[i].channelLevels
                    + '">[' + lawFileList[i].channel[lawFileList[i].channel.length-2].displayName
                    + ']</b>' + lawFileList[i].title
                    + '</a></li>'
            }
            $("#impFile").html(temp_1);
            $("#lawFile").html(temp_2);
        }else{

        }
    });
    $(document).on("click", ".lanmu", function(e){
        var evt = e || window.event; //获取event对象
        if (evt.preventDefault) {
            evt.preventDefault(); //非IE浏览器
        } else {
            evt.returnValue = false; //在早期的IE版本中
        }
        event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true); //阻止事件冒泡
        window.open($(this).attr("url"))
    })
    if(regionID == 'gj'){
        $.ajax({//获取栏目列表
            async: true,
            type: 'get',
            url: '/getGJChannelList',
            contentType: 'application/json'
        }).done(function (res) {
            if(res.code == 200){
                $("#channelDiv").html("");
                var channelList = res.results;
                var temp_1 = '';
                for(var i = 0; i < channelList.length; i++){
                    var parent = channelList[i].parent,
                        children = channelList[i].children;
                    var temp_child = '';
                    for(var j = 0; j < children.length; j++){
                        // if(children[j].length > 0){
                            var item_child = children[j]._source;
                            if(item_child){
                                if(item_child.hasOwnProperty("channelId")){
                                    temp_child += '<dt channelId="' + item_child.channelId + '" channelLevels="'+ item_child.webPath
                                        +'" channelWebPath="' + item_child.webPath + '"><a>'+ item_child.channelName +'</a></dt>'
                                }
                            }
                        // }
                    }
                    if(temp_child){
                        temp_1 += '<li id="' + parent.id + '" channelWebPath="' + parent.channelWebPath +  '"><span>'
                            + parent.name +'</span><dl> '+ temp_child +'</dl> </li>'
                    }else{
                        temp_1 += '<li id="' + parent.id + '" channelWebPath="' + parent.channelWebPath +  '"><span>'
                            + parent.name +'</span></li>'
                    }
                }
                $("#channelDiv").html(temp_1);
            }else{

            }
        });
    }else{
        $.ajax({//获取栏目列表
            async: true,
            type: 'get',
            url: '/getChannelList?regionID=' + regionID,
            contentType: 'application/json'
        }).done(function (res) {
            if(res.code == 200){
                $("#channelDiv").html("");
                var parentChannel = res.results.parentChannel._source
				var channelList = res.results.channelList;
                // var temp_1 = '<li channelId="' + parentChannel.channelId + '" channelLevels="' + parentChannel.channelLevels
                //     + '" channelWebPath="' + parentChannel.webPath + '"><span>' + parentChannel.channelName + '</span></li>';
                var temp_1 = '';
                for(var i = 0; i < channelList.length; i++){
                    var first = channelList[i].first,
                        children = channelList[i].children;
                    var temp_child = '', item = first._source;
                    for(var j = 0; j < children.length; j++){
                        var item_child = children[j]._source;
                        temp_child += '<dt channelId="' + item_child.channelId + '" channelLevels="'+ item_child.channelLevels
                            +'" channelWebPath="' + item_child.webPath + '"><a>'+ item_child.channelName +'</a></dt>'
                    }
                    if(temp_child){
                        temp_1 += '<li channelId="' + item.channelId + '" channelLevels="'+ item.channelLevels
                            +'" channelWebPath="' + item.webPath + '"><span>'+ item.channelName +'</span><dl> '+ temp_child +'</dl> </li>'
                    }else{
                        temp_1 += '<li channelId="' + item.channelId + '" channelLevels="'+ item.channelLevels
                            +'" channelWebPath="' + item.webPath + '"><span>'+ item.channelName +'</span></li>'
                    }

                }
                $("#channelDiv").html(temp_1);
            }else{

            }
        });
    }
    $(document).on("click", "#region>li>a", function(){
    // $("#region>li>a").click(function(){
        if(this.getAttribute("value") == "gj"){
            window.open("/12309/" + this.getAttribute("value") + "/index.shtml")
        }else{
            window.open("/12309/gj/" + this.getAttribute("value") + "/index.shtml")
        }
    });
//判断移动端手机端
	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
	if (SUPPORT_ONLY_TOUCH) {
		$(document).on("click", "#channelDiv>li>dl>dt", function(event){
		    event.stopPropagation();
			$(this).toggleClass("on").siblings().removeClass('on');
		    var channelLevels = $(this).attr("channelLevels") + "/" + $(this).attr("channelId"),
		        channelWebPath = $(this).attr("channelWebPath");
		    window.location.href = "/12309" + channelWebPath + "/index.shtml?channelLevels=" + channelLevels
		})
	} else {
		$(document).on("mouseover", "#channelDiv>li>dl>dt", function(){
		    $(this).addClass("on");
		});
		$(document).on("mouseout", "#channelDiv>li>dl>dt", function(){
		    $(this).removeClass("on");
		});
		$(document).on("click", "#channelDiv>li", function(){
		    if($(this).attr("id")){
		        var channelWebPath = $(this).attr("channelWebPath");
		        window.location.href = "/12309" + channelWebPath + "/index.shtml"
		    }else{
		        var channelLevels = $(this).attr("channelLevels") + "/" + $(this).attr("channelId"),
		            channelWebPath = $(this).attr("channelWebPath");
		        window.location.href = "/12309" + channelWebPath + "/index.shtml?channelLevels=" + channelLevels
		    }
		})
		$(document).on("click", "#channelDiv>li>dl>dt", function(event){
		    event.stopPropagation();
		    var channelLevels = $(this).attr("channelLevels") + "/" + $(this).attr("channelId"),
		        channelWebPath = $(this).attr("channelWebPath");
		    window.location.href = "/12309" + channelWebPath + "/index.shtml?channelLevels=" + channelLevels
		})
	}
    $("#renderToImp,#renderToLaw").click(function(){
        var pageName = $(this).attr("id") == "renderToImp" ? "zdajxx" : "zjxflws";
        // console.log(window.location.host+window.location.pathname)
        window.open(window.location.href.replace("index.shtml", (pageName +"/index.shtml")));
    })
})