/* 索引号 syh  cf338ec5c6514860a95b5838d1562147
发文字号 fwzh 48cdd256dbfa4efa9d65cd903e8c4bce 
发文单位 fwdw  f024e61ec78c460b8e91d9fb080d399b
废止日期 fzrq deb2360ed8e1446f8215cb06173fad48
内设机构 jigou f3f5c95b7ec64e12b36bfc55ddda5f75
离退休干部办公室：07be7e74ddbe48dd814a2817f05b772b
机关党委：5e50ecce9140488984e5312f51435d0b
人事司：fb5a5ffdb3a344d68bdfd5033acfd343
督察内审司：8566eccdf1ec4a5a854d4d447568e43f
财务管理司：a9122050ee0a4088aa2016195817437f
稽查局：b35e273c6c3149dc834031a07c4bc165
大企业税收管理司：0aa5324e08b4437b8e7c3ad303f1a52f
征管和科技发展司：f352e641ff0c4b858268cb63c634771a
纳税服务司：776017b1a7384c2b9181f5511694d002
收入规划核算司：6352da0a304e406d8168fb2ac6111608
国际税务司：2e4494e9e97a43a0b242c12d46573f1b
财产和行为税司：6664637cf2644ae7a3824923ccdfc307
所得税司：61b55e8f9ea6426b885352542f48c4c9
货物和劳务税司：e087f32208fd4907a42c3c584f075a67
政策法规司：60f2383cc3ff4cabaac344fab798668f
办公厅：239286f40379472cbc7e553d7eb5f3c5
其他机构 qtjg  009bd45942a84f7a8d98e58f36f3bc0f
体裁 ticai  b219f8c7de314b9fb7837186168991c3
意见：575bf362841d48a292d0362f840f1c94
批复：1dcc1518ac1245f9b2b7ff27a2baaa85
通知：4e6406ab076341fe8ffc5e4cfabe5a63
通告：1a60ba2ee7c046d9816590e183f6fd53
公告：e7773e8a054f4dac9c7cb40fcb87ecd1
决定：99a714d48fbb400a93e826ebd4f35843 */

var organ = [
	{data:"办公厅",code:"239286f40379472cbc7e553d7eb5f3c5"},
	{data:"政策法规司",code:"60f2383cc3ff4cabaac344fab798668f"},
	{data:"货物和劳务税司",code:"e087f32208fd4907a42c3c584f075a67"},
	{data:"所得税司",code:"61b55e8f9ea6426b885352542f48c4c9"},
	{data:"财产和行为税司",code:"6664637cf2644ae7a3824923ccdfc307"},
	{data:"国际税务司",code:"2e4494e9e97a43a0b242c12d46573f1b"},
	{data:"收入规划核算司",code:"6352da0a304e406d8168fb2ac6111608"},
	{data:"纳税服务司",code:"776017b1a7384c2b9181f5511694d002"},
	{data:"征管和科技发展司",code:"f352e641ff0c4b858268cb63c634771a"},
	{data:"大企业税收管理司",code:"0aa5324e08b4437b8e7c3ad303f1a52f"},
	{data:"稽查局",code:"b35e273c6c3149dc834031a07c4bc165"},
	{data:"财务管理司",code:"a9122050ee0a4088aa2016195817437f"},
	{data:"督察内审司",code:"8566eccdf1ec4a5a854d4d447568e43f"},
	{data:"人事司",code:"fb5a5ffdb3a344d68bdfd5033acfd343"},
	{data:"机关党委",code:"5e50ecce9140488984e5312f51435d0b"},
	{data:"离退休干部办公室",code:"07be7e74ddbe48dd814a2817f05b772b"},
	]
var theme = [
	{data:"决定",code:"99a714d48fbb400a93e826ebd4f35843"},
	{data:"公告",code:"e7773e8a054f4dac9c7cb40fcb87ecd1"},
	{data:"通告",code:"1a60ba2ee7c046d9816590e183f6fd53"},
	{data:"通知",code:"4e6406ab076341fe8ffc5e4cfabe5a63"},
	{data:"批复",code:"1dcc1518ac1245f9b2b7ff27a2baaa85"},
]
//税务总局的左侧分类渲染
function organhtml(){
	let organcatContent = document.getElementById("organcatContent")
	let str = '<li channelid="f3f5c95b7ec64e12b36bfc55ddda5f75"><i class="icon minus" onclick="minus(this)"></i><i class="icon folderopen"></i><a href="javascript:;">内设机构</a></li>'
	for (var i = 0; i < organ.length; i++) {
		str+='<li channelid='+organ[i].code+'><i class="icon line"></i><i class="icon join"></i><i class="icon folderopen"></i><a href="javascript:;">'+organ[i].data+'</a></li>'
	}
	let str2 = '<li channelid="009bd45942a84f7a8d98e58f36f3bc0f"><i class="icon joinbottom"></i><i class="icon folderopen"></i><a href="javascript:;">其他单位</a></li>'
	organcatContent.innerHTML = str+str2
}
function themehtml(){
	let themecatContent = document.getElementById("themecatContent")
	let str = ''
	for (var i = 0; i < theme.length; i++) {
		str+='<li channelid='+theme[i].code+'><i class="icon join"></i><i class="icon folderopen"></i><a href="javascript:;">'+theme[i].data+'</a></li>'
	}
	let str2 = '<li channelid = "575bf362841d48a292d0362f840f1c94"><i class="icon joinbottom"></i><i class="icon folderopen"></i><a href="javascript:;">意见</a></li>'
	themecatContent.innerHTML = str+str2
}
//高级检索体裁和机构分类的渲染
function organhtmlMask(){
	let organcatContentMask = document.getElementById("organcatContentMask")
	let str = '<li channelid="f3f5c95b7ec64e12b36bfc55ddda5f75"><i class="icon minus" onclick="minus(this)"></i><input name="selectValue" value="nsjg" type="radio"><i class="icon folderopen"></i><a href="javascript:;">内设机构</a></li>'
	for (var i = 0; i < organ.length; i++) {
		str+='<li channelid="'+organ[i].code+'"><i class="icon join"></i><input name="selectValue" type="radio"><i class="icon folderopen"></i><a href="javascript:;">'+organ[i].data+'</a></li>'
	}	
	let str2 = '<li><i class="icon joinbottom"></i><input name="selectValue" value="qtdw" type="radio"><i class="icon folderopen"></i><a href="javascript:;">其他单位</a></li>'
	organcatContentMask.innerHTML = str + str2
}
function themehtmlMask(){
	let themecatContentMask = document.getElementById("themecatContentMask")
	let str = ''
	for (var i = 0; i < theme.length; i++) {
		str+='<li channelid="'+theme[i].code+'"><i class="icon join"></i><input name="selectValue" type="radio"><i class="icon folderopen"></i><a href="javascript:;">'+theme[i].data+'</a></li>'
	}
	let str2 = '<li><i class="icon joinbottom"></i><input name="selectValue" value="yj" type="radio"><i class="icon folderopen"></i><a href="javascript:;">意见</a></li>'
	themecatContentMask.innerHTML = str + str2
}
var channelId = $(".BreadcrumbNav").attr('channelid')  //信息公开
var pageSize = 20, codeId, pageNum, current=1;
getData(1)
// 左边栏目树（体裁&机构）
$(".bz_title").click(function(){
	$(this).siblings('span').removeClass('active')
	$(this).addClass('active'); 
	if($(this).text() === "主题"){
		$("#svobjcatContent").addClass('show_list').siblings().removeClass('show_list')
		$("#list_title").html("主题分类") 
		$(".activeList").removeClass('activeList')
		channelId = $(this).attr('channelid')
		codeId = ''
		getData(1)
	}else if($(this).text() === "机构"){
		$(".activeList").removeClass('activeList')
		organhtml()
		codeId = $(this).attr('channelid')
		channelId = '';
		getData(1)
		$("#list_title").html("机构分类")
		$("#organcatContent").addClass('show_list').siblings().removeClass('show_list')
		$("#organcatContent>li>a").click(function(){
		 	$(this).addClass('activeList');
		 	$(this).parent().siblings('li').children('a').removeClass('activeList')
			codeId = $(this).parent().attr("channelid");
			channelId = '';
			getData(1)
		});
	}else{
		$(".activeList").removeClass('activeList')
		themehtml()
		codeId = $(this).attr('channelid')
		channelId = '';
		getData(1)
		$("#list_title").html("体裁分类")
		$("#themecatContent").addClass('show_list').siblings().removeClass('show_list')
		$("#themecatContent>li>a").click(function(){
			$(this).addClass('activeList'); 
			$(this).parent().siblings('li').children('a').removeClass('activeList')
			codeId = $(this).parent().attr("channelid");
			channelId = '';
			getData(1)
		});
	}
})
//显示隐藏高级搜索的遮罩层
$(".searchBase").click(function(){
	$(".mask").show()
})
$("#maskClose").click(function(){
	$(".mask").hide()
	$(".calendar").hide()
	$(".maskLiDiv").each(function(i,e){
		e.innerHTML = ' '
	})
	$(".maskLiDivInput").each(function(i,e){
		e.value = ''
	})
	$(".seachBfzw").val('')
	$(".maskLiDivYd").each(function(i,e){
		e.innerHTML = ' '
	})
	$(".maskLiDivInputYd").each(function(i,e){
		e.value = ''
	})
	$(".seachBfzwYd").val('')
})
//高级检索 分类的选择
function maskOption(index,that){
	$(".maskO").show()
	if(index == "1" || index === "1"){   //高级检索主题
		$("#svobjcatContentMask").show().siblings('ul').hide()
		let regionCode = $('.BreadcrumbNav').attr('channelcode')
		$.ajax({//获取栏目列表
		    async: true,
		    type: 'get',
		    url: '/getChannelList?regionCode=' + regionCode,
		    contentType: 'application/json'
		}).done(function (res) {
			if(res.code == 200){
				var channelList = res.results.channelList;
				let temp_1 = ''
				for(var i = 0; i < channelList.length; i++){
					var first = channelList[i].first,children = channelList[i].children;
					var temp_child = '', item = first._source;
					for(var j = 0; j < children.length; j++){
						var item_child = children[j]._source;
						temp_child += '<dt channelId="' + item_child.channelId + '><i class="icon line"></i><i class="icon line"></i><i class="icon join"></i><input name="selectValue" type="radio"><i class="icon folderopen"></i><a href="javascript:;">'+ item_child.channelName +'</a></dt>'
					}
					if(temp_child){
						temp_1 += '<li channelId="' + item.channelId + '"><i class="icon plus" onclick="minusSvobjcatMask(this)"></i><input name="selectValue" type="radio"><i class="icon folderopen"></i><a href="javascript:;">'+ item.channelName +'</a><dl class="activeHide">'+ temp_child +'</dl> </li>'
					}else{
						temp_1 += '<li channelId="' + item.channelId + '"><i class="icon join"></i><input name="selectValue" type="radio"><i class="icon folderopen"></i><a href="javascript:;">'+ item.channelName +'</a></li>'
					}
				}
				$("#svobjcatContentMask").html(temp_1)
				$('#svobjcatContentMask li:last-child i:first-child').addClass('joinbottom')
				$('#svobjcatContentMask dl dt:last-child i:nth-child(2)').addClass('joinbottom')
			}
			$("#svobjcatContentMask input[name='selectValue']").click(function(){
				let _channelid = $(this).parent().attr("channelid")
				$("#maskOption1").html($(this).next().next().html()).attr("channelid",_channelid)
				$("#maskLiDivYd1").html($(this).next().next().html()).attr("channelid",_channelid)
			})
			
		})
	}else if(index == "2" || index === "2"){   //高级检索机构分类
		organhtmlMask()
		$(".organcatContent").show().siblings('ul').hide()
		$(".organcatContent input[name='selectValue']").click(function(){
			let _channelid = $(this).parent().attr("channelid")
			$("#maskOption2").html($(this).next().next().html()).attr("channelid",_channelid)
			$("#maskLiDivYd2").html($(this).next().next().html()).attr("channelid",_channelid)
		})
	}else{   //高级检索体裁分类
		themehtmlMask()
		$(".themecatContent").show().siblings('ul').hide()
		$(".themecatContent input[name='selectValue']").click(function(){
			let _channelid = $(this).parent().attr("channelid")
			$("#maskOption3").html($(this).next().next().html()).attr("channelid",_channelid)
			$("#maskLiDivYd3").html($(this).next().next().html()).attr("channelid",_channelid)
		})
	}
}
//日期位置定位
function maskLiDivS(index){
	event.stopPropagation()
	if(!SUPPORT_ONLY_TOUCH){    //电脑端
		if(index == "1" || index === "1"){
			$(".calendar").show().css({
				top: '51%',left: '29%'
			})	
		}else if(index == "2" || index === "2"){
			$(".calendar").show().css({
				top: '51%',left: '58%'
			})	
		}else if(index == "3" || index === "3"){
			$(".calendar").show().css({
				top: '61%',left: '29%'
			})	
		}else{
			$(".calendar").show().css({
				top: '61%',left: '58%'
			})	
		}	
	}else{      //PC端
		if(index == "1" || index === "1"){
			$(".calendar").show().css({
				top: '45%',left: '5%'
			})	
		}else if(index == "2" || index === "2"){
			$(".calendar").show().css({
				top: '50%',left: '5%'
			})	
		}else if(index == "3" || index === "3"){
			$(".calendar").show().css({
				top: '55%',left: '5%'
			})	
		}else{
			$(".calendar").show().css({
				top: '60%',left: '5%'
			})	
		}	
	}
	
}
$(".closeCalendar").click(function(){
	$(".calendar").hide()       //日期
})
$(".closeOption").click(function(){
	$(".maskO").hide()       //分类box
})
//高级搜索确定搜索 和 重置
function searchSure(index){
	if(index == "1"){//高级搜索
		var title,option1,option2,option3,textNumber,time1,time2,time3,time4,content
		title = $("#searchTitle").val() || $("#maskTitle").val()//稿件名
		option1 = $("#maskOption1").attr("channelid") || $("#maskLiDivYd1").attr("channelid")//主题分类
		option2 = $("#maskOption2").attr("channelid") || $("#maskLiDivYd2").attr("channelid")//机构分类
		option3 = $("#maskOption3").attr("channelid") || $("#maskLiDivYd3").attr("channelid")//体裁分类
		textNumber = $(".textNumber").val() || $("#maskTexNum").val() //发文字号
		time1 = $("#maskLiDivS1").html() || $("#maskLiDivS5").html()   //发布
		time2 = $("#maskLiDivS2").html() || $("#maskLiDivS6").html()
		time3 = $("#maskLiDivS3").html() || $("#maskLiDivS7").html()   //废止
		time4 = $("#maskLiDivS4").html() || $("#maskLiDivS8").html()
		content = $(".seachBfzw").val() || $("#maskContent").val()
		
	}else{//重置
		$(".maskLiDiv").each(function(i,e){
			e.innerHTML = ' '
		})
		$(".maskLiDivInput").each(function(i,e){
			e.value = ''
		})
		$(".seachBfzw").val('')
		$(".maskLiDivYd").each(function(i,e){
			e.innerHTML = ' '
		})
		$(".maskLiDivInputYd").each(function(i,e){
			e.value = ''
		})
		$(".seachBfzwYd").val('')
	}
}
//收起栏目树
var plusImg = true,svoPlusImg = true
function minus(that){
	var siblingss = []; //用来存放其他的兄弟节点
        var elseLi = that.parentNode.parentNode.children;
        for (var i = 0; i < elseLi.length-1; i++) {
            if (elseLi[i] !== that.parentNode) {//判断是否是ele节点，是否与触发事件的节点相同
                siblingss.push(elseLi[i]);
            }
        }
	if(plusImg){
		plusImg = false
		that.style.backgroundImage = "url(../../images/chinatax/base/plus.gif)"
		for (var i = 0; i < siblingss.length; i++) {
		    siblingss[i].classList.add("activeHide")
		}
	}else{
		plusImg = true
		that.style.backgroundImage = "url(../../images/chinatax/base/minus.gif)"
		for (var i = 0; i < siblingss.length; i++) {
		    siblingss[i].classList.remove("activeHide")
		}
	}
}
function minusSvobjcat(that){
	if(svoPlusImg){
		svoPlusImg = false
		that.style.backgroundImage = "url(../../images/chinatax/base/minus.gif)"
		that.parentNode.children[3].classList.remove("activeHide")
	}else{
		svoPlusImg = true
		that.style.backgroundImage = "url(../../images/chinatax/base/plus.gif)"
		that.parentNode.children[3].classList.add("activeHide")
	}
}
function minusSvobjcatMask(that){
	if(svoPlusImg){
		svoPlusImg = false
		that.style.backgroundImage = "url(../../images/chinatax/base/minus.gif)"
		that.parentNode.children[4].classList.remove("activeHide")
	}else{
		svoPlusImg = true
		that.style.backgroundImage = "url(../../images/chinatax/base/plus.gif)"
		that.parentNode.children[4].classList.add("activeHide")
	}
}
//检索
$("#search").click(function(){
	let searchContent = $("#searchContent").val()
	let type = $("#selector").val()
	let _channelId = $(".activeList").parent().attr('channelid')
	let channelId
	if(!_channelId){
		channelId = $(".BreadcrumbNav").attr('channelid')  
	}else{
		channelId = _channelId
	}
	if(searchContent){
 		getSearch(1,type,searchContent,channelId)
	}else{
		$(".prompt").show()
		setTimeout(function(){
		    $(".prompt").hide()
		}, 2000)
	}
	$("#searchContent").val("")
})
$(function(){
	$("#page_div").bindEvent({
	    pageNum: pageNum,
	    current: current,
	    backfun: function(e) {
	        getData(e.current);
	    }
	});
})
//元数据id栏目稿件列表
function getData(page,isInput){
    $.ajax({
        async: true,
        type: 'post',
        url: '/getFileListByCodeId',
        data: JSON.stringify({
            codeId: codeId || '',
			channelId: channelId || '',
			keySYH: 'syh',
			keyFWZH: 'fwzh',
			keyTc: 'ticai',
			page: page,
			size: pageSize,
		}),
        contentType: 'application/json'
    }).done(function (res) {
		if(res.code == 200){
			var data = res.results.data
			var rightList = res.results.data.results;
			if(JSON.stringify(rightList) == '[]'){
			    $("#codeId_list").html("暂无数据");
			    $("#page_div").html("");
			    return;
			}else{
				var str = "",rowsSize,pageS
				for(var i=0 ; i < rightList.length; i++){
					let keyIndexSYH = rightList[i].keyIndexSYH ? rightList[i].keyIndexSYH : ""
					let keyIndexFWZH = rightList[i].keyIndexFWZH ? rightList[i].keyIndexFWZH : ""
					let keyIndexTC = rightList[i].keyIndexTC ? rightList[i].keyIndexTC : ""
					str +='<li><div class="right_l rightNum">'+(i+1)+
						'</div><div class="right_l rightTitle"><a class="titleChange" href="'+rightList[i].url+
						'" target="_blank">'+rightList[i].title+
						'</a><div class="show_title"><ul><li><div>索引号:<span>'+keyIndexSYH+'</span></div><div>主题分类:<span>'+rightList[i].channelName+'</span></div></li><li><div>体裁分类:<span>'+keyIndexTC+'</span></div><div>发布日期:<span>'+
						rightList[i].publishedTimeStr.trim().substring(0,10)+
						'</span></div></li><li><div>名称:<span>'+rightList[i].title+
						'</span></div></li><li><div>文号:<span>'+keyIndexFWZH+'</span></div></li></ul></div></div><div class="right_l rightTime">'+
						rightList[i].publishedTimeStr.trim().substring(0,10)+
						'</div><div class="right_l rightTxt">'+keyIndexFWZH+'</div></li>'
				}
				$("#codeId_list").html(str);
				$("#page_div").show();
				if(Math.ceil(data.total/pageSize)>0){
				    current = page
				    pageNum = Math.ceil(data.total/pageSize)
					$("#page_div").createPage({
						pageNum: pageNum,
						current: current,
						backfun: function (e) {
							getData(e.current);
						}
					});
				}else{
				    $("#page_div").hide()
				}
			}
			mouse()
		}
	})
}
//搜索稿件列表
function getSearch(page,type,searchContent,channelId){
    $.ajax({
        async: true,
        type: 'post',
        url: '/getSearch',
        data: JSON.stringify({
            type: type,
            searchContent: searchContent,
            channelId: channelId || '',
			keySYH: 'syh',
			keyFWZH: 'fwzh',
			keyTc:'ticai',
            page: page,
            size: pageSize,
		}),
        contentType: 'application/json'
    }).done(function (res) {
		if(res.code == 200){
			var data = res.data
			var rightList = res.data.results;
			if(JSON.stringify(rightList) == '[]'){
			    $("#codeId_list").html("暂无数据");
			    $("#page_div").hide("");
			    return;
			}else{
				$("#page_div").show()
				var str = "",rowsSize,pageS
				for(var i=0 ; i < rightList.length; i++){
					let keyIndexSYH = rightList[i].keyIndexSYH ? rightList[i].keyIndexSYH : ""
					let keyIndexFWZH = rightList[i].keyIndexFWZH ? rightList[i].keyIndexFWZH : ""
					let keyIndexTC = rightList[i].keyIndexTC ? rightList[i].keyIndexTC : ""
					str +='<li><div class="right_l rightNum">'+(i+1)+
						'</div><div class="right_l rightTitle"><a class="titleChange" href="'+rightList[i].url+
						'" target="_blank">'+rightList[i].title+
						'</a><div class="show_title"><ul><li><div>索引号:<span>'+keyIndexSYH+'</span></div><div>主题分类:<span>'+rightList[i].channelName+'</span></div></li><li><div>体裁分类:<span>'+keyIndexTC+'</span></div><div>发布日期:<span>'+
						rightList[i].publishedTimeStr.trim().substring(0,10)+
						'</span></div></li><li><div>名称:<span>'+rightList[i].title+
						'</span></div></li><li><div>文号:<span>'+keyIndexFWZH+'</span></div></li></ul></div></div><div class="right_l rightTime">'+
						rightList[i].publishedTimeStr.trim().substring(0,10)+
						'</div><div class="right_l rightTxt">'+keyIndexFWZH+'</div></li>'
				}
				$("#codeId_list").html(str);
				if(Math.ceil(data.total/pageSize)>0){
				    current = page
				    pageNum = Math.ceil(data.total/pageSize)
					$("#page_div").createPage({
						pageNum: pageNum,
						current: current,
						backfun: function (e) {
							getSearch(e.current,type,searchContent,channelId);
						}
					});
				}else{
				    $("#page_div").hide()
				}
			}
			mouse()
		}
	})
}
   
//获取栏目树 
getChannelList()
function getChannelList(){
	let regionCode = $('.BreadcrumbNav').attr('channelcode')
	$.ajax({
	    async: true,
	    type: 'get',
	    url: '/getChannelList?regionCode=' + regionCode,
	    contentType: 'application/json'
	}).done(function (res) {
		if(res.code == 200){
			$("#svobjcatContent").html("")
			var channelList = res.results.channelList;
			let temp_1 = ''
			for(var i = 0; i < channelList.length; i++){
				var first = channelList[i].first,children = channelList[i].children;
				var temp_child = '', item = first._source;
				for(var j = 0; j < children.length; j++){
					var item_child = children[j]._source;
					temp_child += '<dt channelId="' + item_child.channelId + '><i class="icon line"></i><i class="icon line"></i><i class="icon join"></i><i class="icon folderopen"></i><a href="javascript:;" target="_self">'+ item_child.channelName +'</a></dt>'
				}
				if(temp_child){
					temp_1 += '<li channelId="' + item.channelId + '"><i class="icon plus" onclick="minusSvobjcat(this)"></i><i class="icon folderopen"></i><a href="javascript:;" target="_self">'+ item.channelName +'</a><dl class="activeHide">'+ temp_child +'</dl> </li>'
				}else{
					temp_1 += '<li channelId="' + item.channelId + '"><i class="icon join"></i><i class="icon folderopen"></i><a href="javascript:;" target="_self">'+ item.channelName +'</a></li>'
				}
			}
			$("#svobjcatContent").html(temp_1)
			$('#svobjcatContent li:last-child i:first-child').addClass('joinbottom')
			$('#svobjcatContent dl dt:last-child i:nth-child(2)').addClass('joinbottom')
		}
		//点击主题栏目树子栏目之间的切换
		$("#svobjcatContent li > a").click(function(){
			$(this).addClass('activeList'); 
			$(this).parent().siblings('li').children('a').removeClass('activeList') // 同级其他的li a
			$(this).parent().siblings('li').children('dl').children('dt').children('a').removeClass('activeList')  // 下级dt a
			$(this).siblings('dl').children('dt').children('a').removeClass('activeList') //同级里的li a
			channelId = $(this).parent().attr("channelid");
			codeId = ''
			getData(1)
		})
		$("#svobjcatContent dt > a").click(function(){
			$(this).addClass('activeList'); 
			$(this).parent().parent().parent().siblings('li').children('a').removeClass('activeList')  // 上级li a
			$(this).parent().siblings('dt').children('a').removeClass('activeList') // 同级dt a
			$(this).parent().parent().parent().children('a').removeClass('activeList')   //上级里的li a
			channelId = $(this).parent().attr("channelid");
			codeId = ''
			getData(1)
		})
	})
}
//鼠标移入显示
mouse()
var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
function mouse(){
	if(!SUPPORT_ONLY_TOUCH){
		$(".titleChange").mouseover(function(){
			$(this).siblings('div').show()
		})
		$(".titleChange").mouseout(function(){
			$(this).siblings('div').hide()
		})
	}else{
	}
}