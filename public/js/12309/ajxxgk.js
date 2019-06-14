$(function(){
    $.ajax({//获取重要信息稿件列表
        async: true,
        type: 'get',
        url: '/getImpFileByLevel',
        contentType: 'application/json'
    }).done(function (res) {
        if(res.code == 200){
            var level_1 = res.results.level_1, level_2 = res.results.level_2, level_3 = res.results.level_3;
            var temp_1 = '', temp_2 = '', temp_3 = '';
            for(var i = 0; i < level_1.length; i++){
                temp_1 += '<li><a target="_blank" href="' + level_1[i].url
                    + '"><b class="lanmu" url="/12309' + level_1[i].channelWebPath.replace("zdajxx", "index.shtml")
                    +"?channelLevels="+level_1[i].channelLevels
                    + '">[' + level_1[i].channel[level_1[i].channel.length-2].displayName
                    + ']</b>'+ level_1[i].title
                    + '</a></li>'
            }
            for(var i = 0; i < level_2.length; i++){
                temp_2 += '<li><a target="_blank" href="' + level_2[i].url
                    + '"><b class="lanmu" url="/12309' + level_2[i].channelWebPath.replace("zdajxx", "index.shtml")
                    +"?channelLevels="+level_2[i].channelLevels
                    + '">[' + level_2[i].channel[level_2[i].channel.length-2].displayName
                    + ']</b>' + level_2[i].title
                    + '</a></li>'
            }
            for(var i = 0; i < level_3.length; i++){
                temp_3 += '<li><a target="_blank" href="' + level_3[i].url
                    + '"><b class="lanmu" url="/12309' + level_3[i].channelWebPath.replace("zdajxx", "index.shtml")
                    +"?channelLevels="+level_3[i].channelLevels
                    + '">[' + level_3[i].channel[level_3[i].channel.length-2].displayName
                    + ']</b>' + level_3[i].title
                    + '</a></li>'
            }
            $("#imp_1").html(temp_1);
            $("#imp_2").html(temp_2);
            $("#imp_3").html(temp_3);
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
    $.ajax({//获取法律文书稿件列表
        async: true,
        type: 'get',
        url: '/getLawFileByLevel',
        contentType: 'application/json'
    }).done(function (res) {
        if(res.code == 200){
            var file_1 = res.results.file_1, file_2 = res.results.file_2, file_3 = res.results.file_3,
                file_4 = res.results.file_4, file_5 = res.results.file_5;
            var temp_1 = '', temp_2 = '', temp_3 = '', temp_4 = '', temp_5 = '';
            for(var i = 0; i < file_1.length; i++){
                temp_1 += '<li><a target="_blank" href="' + file_1[i].url
                    + '"><b class="lanmu" url="/12309' + file_1[i].channelWebPath.replace("zjxflws", "index.shtml")
                    +"?channelLevels="+file_1[i].channelLevels
                    + '">[' + file_1[i].channel[file_1[i].channel.length-2].displayName
                    + ']</b>' + file_1[i].title
                    + '</a><span class="ph">'+ file_1[i].domainMetaList[1].resultList[0].value
                    +'</span><span class="date">'
                    + (new Date(file_1[i].createdTime).toLocaleString().replace(/:\d{1,2}$/,' ').split(" ")[0]).replace("/", "-").replace("/", "-")
                    +'</span></li>'
            }
            for(var i = 0; i < file_2.length; i++){
                temp_2 += '<li><a target="_blank" href="' + file_2[i].url
                    + '"><b class="lanmu" url="/12309' + file_2[i].channelWebPath.replace("zjxflws", "index.shtml")
                    +"?channelLevels="+file_2[i].channelLevels
                    + '">[' + file_2[i].channel[file_2[i].channel.length-2].displayName
                    + ']</b>' + file_2[i].title
                    + '</a><span class="ph">'+ file_2[i].domainMetaList[1].resultList[0].value
                    +'</span><span class="date">'
                    + (new Date(file_2[i].createdTime).toLocaleString().replace(/:\d{1,2}$/,' ').split(" ")[0]).replace("/", "-").replace("/", "-")
                    +'</span></li>'
            }
            for(var i = 0; i < file_3.length; i++){
                temp_3 += '<li><a target="_blank" href="' + file_3[i].url
                    + '"><b class="lanmu" url="/12309' + file_3[i].channelWebPath.replace("zjxflws", "index.shtml")
                    +"?channelLevels="+file_3[i].channelLevels
                    + '">[' + file_3[i].channel[file_3[i].channel.length-2].displayName
                    + ']</b>' + file_3[i].title
                    + '</a><span class="ph">'+ file_3[i].domainMetaList[1].resultList[0].value
                    +'</span><span class="date">'
                    + (new Date(file_3[i].createdTime).toLocaleString().replace(/:\d{1,2}$/,' ').split(" ")[0]).replace("/", "-").replace("/", "-")
                    +'</span></li>'
            }
            for(var i = 0; i < file_4.length; i++){
                temp_4 += '<li><a target="_blank" href="' + file_4[i].url
                    + '"><b class="lanmu" url="/12309' + file_4[i].channelWebPath.replace("zjxflws", "index.shtml")
                    +"?channelLevels="+file_4[i].channelLevels
                    + '">[' + file_4[i].channel[file_4[i].channel.length-2].displayName
                    + ']</b>' + file_4[i].title
                    + '</a><span class="ph">'+ file_4[i].domainMetaList[1].resultList[0].value
                    +'</span><span class="date">'
                    + (new Date(file_4[i].createdTime).toLocaleString().replace(/:\d{1,2}$/,' ').split(" ")[0]).replace("/", "-").replace("/", "-")
                    +'</span></li>'
            }
            for(var i = 0; i < file_5.length; i++){
                temp_5 += '<li><a target="_blank" href="' + file_5[i].url
                    + '"><b class="lanmu" url="/12309' + file_5[i].channelWebPath.replace("zjxflws", "index.shtml")
                    +"?channelLevels="+file_5[i].channelLevels
                    + '">[' + file_5[i].channel[file_5[i].channel.length-2].displayName
                    + ']</b>' + file_5[i].title
                    + '</a><span class="ph">'+ file_5[i].domainMetaList[1].resultList[0].value
                    +'</span><span class="date">'
                    + (new Date(file_5[i].createdTime).toLocaleString().replace(/:\d{1,2}$/,' ').split(" ")[0]).replace("/", "-").replace("/", "-")
                    +'</span></li>'
            }
            $("#law_1").html(temp_1);
            $("#law_2").html(temp_2);
            $("#law_3").html(temp_3);
            $("#law_4").html(temp_4);
            $("#law_5").html(temp_5);
        }else{

        }
    });
    $.ajax({//获取稿件数量
        async: true,
        type: 'get',
        url: '/getFileNum',
        contentType: 'application/json'
    }).done(function (res) {
        if(res.code == 200){
            $("#impTotalNum").html(res.results.impTotalNum);
            $("#impTodayNum").html(res.results.impTodayNum);
            $("#lawTotalNum").html(res.results.lawTotalNum);
            $("#lawTodayNum").html(res.results.lawTodayNum);
        }else{

        }
    });
    $("#region>li>a").click(function(){
        if(this.getAttribute("value") == "gj"){
            window.open("/12309/" + this.getAttribute("value") + "/index.shtml")
        }else{
            window.open("/12309/gj/" + this.getAttribute("value") + "/index.shtml")
        }
    });
});
function renderTo(page){
    window.open("/12309/" + page + "/index.shtml")
}