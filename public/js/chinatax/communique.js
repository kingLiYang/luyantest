var channelCodes = $('.BreadcrumbNav').attr('changeCode');
var pageSize = 20, codeId, pageNum, current=1;
function changeCode(type){
	if(channelCodes == 200201){
		return 
	}
	var channelCode = channelCodes.replace(/(\d)(?=(?:\d{2})$)/,'$1,');
	var channelCodeArr = channelCode.split(',');
	var channelCodeMonth = channelCodeArr[1];
	var channelCodeYear = channelCodeArr[0];
	if(type == 1){   //上一期
		channelCodeMonth++;
		if(channelCodeMonth > 12){
			channelCodeYear++;
			channelCodeMonth = 1;
		}
		channelCodes = channelCodeMonth>=10?channelCodeYear.toString()+channelCodeMonth :channelCodeYear.toString() + 0 +channelCodeMonth
	}else if(type == 2){   //下一期
		channelCodeMonth--;
		if(channelCodeMonth === 0){
			channelCodeYear--;
			channelCodeMonth = 12;
		}
		channelCodes = channelCodeMonth>=10?channelCodeYear.toString()+channelCodeMonth :channelCodeYear.toString() + 0 +channelCodeMonth
	}else{   //返回原来页面
		channelCodes = $('.BreadcrumbNav').attr('changeCode')
		$(".bulletin_btn_hide").hide()
		$(".bulletin_btn_hide").siblings('a').show()
		$(".gb").show()
	}
	getData(1)
}
getData(1)
$(function(){
	$("#page_div").bindEvent({
		pageNum: pageNum,
		current: current,
		backfun: function(e) {
			getData(e.current);
		}
	});
})
function getData(page){
	$.ajax({//获取稿件
		async: true,
		type: 'post',
		url: '/getCommuniqueChange',
		data: JSON.stringify({
			channelCode: channelCodes || '',
			page: page,
			size: pageSize,
		}),
		contentType: 'application/json'
	}).done(function (res) {
		if(res.code == 200){
			if(rightList == [] || res.results.channelName ==""){
				alert("没有数据了！")
				channelCodes = $('.BreadcrumbNav').attr('changeCode')
			}else{
				var rightList = res.results.data.results
				var data = res.results.data
				if(res.results.channelName){
					var channelName = res.results.channelName 
					$(".codeChannelName").html(channelName)
				}
				if(JSON.stringify(rightList) == '[]'){
					$("#gb_list").html("");
					$("#page_div").hide();
					return;
				}else{
					$("#page_div").show()
					var str = "",rowsSize,pageS
					for(var i=0 ; i < rightList.length; i++){
						str += '<li><a href="'+rightList[i].url+'" target="_blank">'+rightList[i].title+'</a></li>'
					}
					$("#gb_list").html(str);
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
			}
		}
	})
};
//检索
function searchGbContent(index){
	if(index == 1){
		$(".bulletin_btn_hide").show()
		$(".bulletin_btn_hide").siblings('a').hide()
		$(".codeChannelName").html("税务总局公报")
		$(".gb").hide()
		let type = $("#searchinfo").val() || ''
		let searchContent = $("#searchText").val() || ''
		let channelId = $('.BreadcrumbNav').attr('channelid') || ''
		if(searchContent){
			getSearchPage(1, type, searchContent,channelId)
		}else{
			$(".prompt").show()
			setTimeout(function(){
				$(".prompt").hide()
			}, 2000)
		}
		$("#searchText").val("")
	}else{
		$("#searchText").val("")
	}
}
function getSearchPage(page,type, searchContent,channelId){
	$.ajax({
		async: true,
		type: 'post',
		url: '/getSearch',
		data: JSON.stringify({
			type: type,
			searchContent: searchContent,
			channelId: channelId,
			page: page,
			size: pageSize,
		}),
		contentType: 'application/json'
	}).done(function (res) {
		if(res.code == 200){
			var rightList = res.data.results;
			var data = res.data
			if(JSON.stringify(rightList) == '[]'){
				$("#gb_list").html("");
				$("#page_div").hide();
				return;
			}else{
				$("#page_div").show()
				var str = "",rowsSize,pageS
				for(var i=0 ; i < rightList.length; i++){
					str += '<li><a href="'+rightList[i].url+'" target="_blank">'+rightList[i].title+'</a><span>'+rightList[i].publishedTimeStr+'</span></li>'
				}
				$("#gb_list").html(str);
				if(Math.ceil(data.total/pageSize)>0){
					current = page
					pageNum = Math.ceil(data.total/pageSize)
					$("#page_div").createPage({
						pageNum: pageNum,
						current: current,
						backfun: function (e) {
							getSearchPage(e.current,type, searchContent,channelId);
						}
					});
				}else{
					$("#page_div").hide()
				}
			}
		}
	})
}