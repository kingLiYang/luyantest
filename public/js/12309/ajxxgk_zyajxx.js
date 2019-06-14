// $(function(){
    var pageSize = 15, codeId, pageNum, current=1;
    getData(1);
    function getData(page, isInput){
        if(isInput){
            page = $("#pagination-input").val();
        }
        $.ajax({
            async: true,
            type: 'post',
            url: '/getFileListByPage',
            data: JSON.stringify({
                codeId: codeId || '',
                page: page,
                size: pageSize,
                fileType: "重要案件信息",
                channelWebPath: channelWebPath,
                channelLevels: channelLevels
            }),
            contentType: 'application/json'
        }).done(function (res) {
            if(res.code == 200){
                if(JSON.stringify(res.results) == '{}'){
                    $("#impFile").html("暂无数据");
                    $("#page_div").hide();
                    return;
                }
                var impFileList = res.results.hits.hits;
				console.log(impFileList)
                var temp_1 = '';
                for(var i = 0; i < impFileList.length; i++){
                    temp_1 += '<li><a target="_blank" href="' + impFileList[i].url
                        + '"><b class="lanmu" url="/12309' + (impFileList[i].channelWebPath||"").replace("zdajxx", "index.shtml")
                        +"?channelLevels="+impFileList[i].channelLevels
                        + '">[' + impFileList[i].channel[impFileList[i].channel.length-2].displayName
                        + ']</b>' + impFileList[i].title
                        + '</a><span class="date">'
                        + (new Date(impFileList[i].createdTime).toLocaleString().replace(/:\d{1,2}$/,' ').split(" ")[0]).replace("/", "-").replace("/", "-")
                        + '</span></li>'
                }
                $("#impFile").html(temp_1);
                $("#page_div").show();
                // createPageHTML("page_div", Math.ceil(res.results.hits.total/pageSize), page, "a", 1, 1)
                if(Math.ceil(res.results.hits.total/pageSize)>0){
                current = page
                pageNum = Math.ceil(res.results.hits.total/pageSize)
                    // if(page==1){
                        $("#page_div").createPage({
                            pageNum: pageNum,
                            current: current,
                            backfun: function(e) {
                                getData(e.current);
                            }
                        });
                    // }
                }else{
                    $("#page_div").hide()
                }
            }else{

            }
        });
    }

$(function(){
    $("#page_div").bindEvent({
        pageNum: pageNum,
        current: current,
        backfun: function(e) {
            getData(e.current);
        }
    });
    if(channelWebPath){
        $.ajax({//获取页面位置信息
            async: true,
            type: 'get',
            url: '/getLocalList?channelWebPath=' + channelWebPath,
            contentType: 'application/json'
        }).done(function (res) {
            if(res.code == 200){
                // $("#regionName").text(res.results + " > 重要案件信息")
                var temp = '';
                for(var i=0; i< res.results.length; i++){
                    temp += "<a href='/12309"+res.results[i].path+"/index.shtml'>"+res.results[i].name+" > </a>"
                }
                temp += "<a href='javascript:;'>重要案件信息</a>";
                $("#regionName").html(temp)
            }
        })
    }
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
    $(document).on("click", "#region>li>a", function(){
        if(this.getAttribute("value") == "gj"){
            window.open("/12309/" + this.getAttribute("value") + "/index.shtml")
        }else{
            window.open("/12309/gj/" + this.getAttribute("value") + "/index.shtml")
        }
    });
    $("#fileType>li").click(function(){
        $("#fileType>li").removeClass('active');
        $(this).addClass("active");
        codeId = $(this).attr("codeId");
        getData(1);
    });
});

// })