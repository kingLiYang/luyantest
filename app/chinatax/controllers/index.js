const urlparse = require('url'),
    _ = require('underscore'),
    logic = require("../logics/index");
const pagePath = 'chinatax/';
const specialCharactersReg = /[`~!@#$\^&*()+=<>?:'"{},;'\[\]·~！￥…（）《》？：“”【】、；‘’，。]/;
const intReg = /^[0-9]*[1-9][0-9]*$/;
exports.index = function(req, res){
    console.log("chinatax search start");
    var queryParams = getQueryParams(req);
    var locationUrl = queryParams.urlPathname + "?_isAgg="+queryParams.relateSubChannels+"&_pageSize="+queryParams.rows+"&_template="+queryParams.template+"&_channelName="+queryParams.channelName+"&page=";
    if (!(verifyParams(res, queryParams))) {  // 校验不通过
        return;
    }
    logic.getCMS(req, res, queryParams.channelId, queryParams.relateSubChannels, queryParams.page, queryParams.rows, queryParams.sort, queryParams.order)
        .then(data => {
        var renderData = data.data ? data.data : data;
        var renderDataList = renderData.results || [];
        var renderChannelName = '';
        if (data.channelName) {
            renderChannelName = data.channelName
        } else if (renderDataList.length) {
            renderChannelName = renderDataList[0].channelName || ''
        } else {
            renderChannelName = queryParams.channelName || ''
        }
        res.render(pagePath + queryParams.template, {data: renderData, locationUrl: locationUrl, channelName: renderChannelName});
        }).catch(err => {
            res.send("内部服务器错误")
        })
};
exports.test = function(req, res){
    res.render(pagePath + "test",);
    return;
};
//调用ES请求数据接口转换成页面展示数据
exports.esUpperLower=function(req, res){
    var queryParams = getQueryParams(req);
    if (!(verifyParams(res, queryParams))) {  // 校验不通过
        return;
    }
    logic.getCMS(req, res, queryParams.channelId, queryParams.relateSubChannels, queryParams.page, queryParams.rows, queryParams.sort, queryParams.order)
        .then(data => {
            //设置允许跨域的域名，*代表允许任意域名跨域
            res.header("Access-Control-Allow-Origin","*");
            //允许的header类型
            res.header("Access-Control-Allow-Headers","content-type");
            //跨域允许的请求方式
            res.header("Access-Control-Allow-Methods","POST,GET");
            var renderData = data.data ? data.data : data;
            var renderDataList = renderData.results || [];
            var str = "";
            if(renderDataList.length){
                for(var index in renderDataList){ // index为索引0,1...
                    var item = renderDataList[index];
                    var res1 = item.url;
                    var contentStrUrlIndex = findIndexOf(res1,'/',2);
                    var contentStrUrl = res1.substring(contentStrUrlIndex);
                    str += item.manuscriptId + "@@@@@" + item.title + "@@@@@"+ contentStrUrl+ "#####";
                }
                str += ";";
            }
            res.send({"data": str});
        }).catch(err => {
            res.send({data:"", error: "内部服务器错误"});
        })
};
//公报
exports.communique = (req,res)=>{
	console.log("controller.communique");
	const query = req.query || req.body;
	const url = urlparse.parse(req.url);
	const urlPathname = url.pathname;
	channelCode = urlPathname.split("/")[3];
	var queryParams = getQueryParams(req);
	logic.getCommunique(req, res, channelCode, queryParams.channelId)
	.then(data => {
		const channelName = data.channelName || ''
		const channelId = data.channelId || ''
		res.render(pagePath + 'communique', {channelId:channelId,channelName: channelName});
	})
}
//公报上下页
exports.getCommuniqueChange = async(req,res)=>{
	console.log("controller.getCommuniqueChange");
	const conditions = {
		channelCode: req.body.channelCode,
		page: Number(req.body.page) || 1,
		size: Number(req.body.size) || 20
	};
	const query = req.query || req.body;
	const url = urlparse.parse(req.url);
	const urlPathname = url.pathname;
	channelCode = urlPathname.split("/")[3];
	var queryParams = getQueryParams(req);
	var locationUrl = queryParams.urlPathname + "?_isAgg="+queryParams.relateSubChannels+"&_pageSize="+queryParams.rows+"&_template="+queryParams.template+"&_channelName="+queryParams.channelName+"&page=";
	 try{
	    let List = await logic.getCommuniqueChange(req, res, conditions,channelCode);
	    res.send({code: 200, results: List});
	}catch(err){
	    console.error("controller.getCommuniqueChange err: " + err);
	    res.send({code: 500, err: err});
	}
}
exports.manuscriptList= (req, res) => {
	const query = req.query || req.body;
	const url = urlparse.parse(req.url);
	const urlPathname = url.pathname;
	channelCode = urlPathname.split("/")[3];
	var queryParams = getQueryParams(req);
	var locationUrl = queryParams.urlPathname + "?_isAgg="+queryParams.relateSubChannels+"&_pageSize="+queryParams.rows+"&_template="+queryParams.template+"&_channelName="+queryParams.channelName+"&page=";
	logic.getMListBychannelCode(req, res, channelCode, queryParams.page, queryParams.rows)
	.then(data => {
		const channelName = data.channelName || ''
		const renderData = data.data || '';
		res.render(pagePath + 'manuscript_list', {channelName: channelName,data: renderData, locationUrl: locationUrl});
	})
}
exports.imageList= (req, res) => {
	const query = req.query || req.body;
	const url = urlparse.parse(req.url);
	const urlPathname = url.pathname;
	channelCode = urlPathname.split("/")[3];
	var queryParams = getQueryParams(req);
	var locationUrl = queryParams.urlPathname+ "?_isAgg="+queryParams.relateSubChannels+"&_pageSize="+queryParams.imgRows+"&_template="+queryParams.template+"&_channelName="+queryParams.channelName+"&page="; 
	logic.getIListBychannelCode(req, res, channelCode,queryParams.page, queryParams.imgRows)
	.then(data => {
		const channelName = data.channelName || ''
		const renderData = data.data || '';
		res.render(pagePath + 'img_list', {channelName: channelName,data: renderData,locationUrl:locationUrl});
	})
}
//栏目稿件列表 
exports.getFileListByCodeId = async(req, res) => {
    console.log("controller.getFileListByCodeId");
    const conditions = {
        codeId: req.body.codeId,
		channelId: req.body.channelId,
		keySYH: req.body.keySYH,
		keyFWZH: req.body.keyFWZH,
		keyTC: req.body.keyTC,
		page: Number(req.body.page) || 1,
		size: Number(req.body.size) || 20
    };
    try{
        let List = await logic.getFileListByCodeId(conditions);
        res.send({code: 200, results: List});
    }catch(err){
        console.error("controller.getFileListByCodeId err: " + err);
        res.send({code: 500, err: err});
    }
};
//国家税前总局
exports.baseDirectory= (req, res) => {
	const query = req.query || req.body;
	const url = urlparse.parse(req.url);
	const urlPathname = url.pathname;
	channelCode = urlPathname.split("/")[3];
	var queryParams = getQueryParams(req);
	logic.getBaseDirectory(req, res, channelCode, queryParams.channelId)
	.then(data => {
		const channelName = data.channelName || ''
		const channelId = data.channelId || ''
		res.render(pagePath + 'baseDirectory', {channelId: channelId,channelName: channelName});
	})
}
//搜索
exports.getSearch = (req, res) => {
	const conditions = {
		channelId: req.body.channelId,
		type:req.body.type,
		searchContent:req.body.searchContent,
		keySYH: req.body.keySYH,
		keyFWZH: req.body.keyFWZH,
		keyTC: req.body.keyTC,
		page: Number(req.body.page) || 1,
		size: Number(req.body.size) || 20
	};
	logic.getSearch(conditions)
	.then(data => {
		const renderData = data.data || '';
		res.send({code: 200, data: renderData});
	})
}

//栏目树
exports.getChannelList = async(req, res,) => {
	console.log("controller.getChannelList")
	const regionCode = req.query.regionCode;
	try{
	    let results = await logic.getChannelList(regionCode);
	    res.send({code: 200, results: results});
	}catch(err){
	    console.error("controller.getChannelList err: " + err);
	    res.send({code: 500, err: err});
	}
}

function findIndexOf (strUrl, cha, num) {
    var x = strUrl.indexOf(cha);
    for (var i = 0; i < num; i++) {
        x = strUrl.indexOf(cha, x + 1);
    }
    return x;
}
function getQueryParams (req) {
    var query = req.query || req.body;
    var url = urlparse.parse(req.url);
    var urlPathname = url.pathname;
    return {
        urlPathname: urlPathname,
        channelId: urlPathname.split("/")[3],
        page: parseInt(query.page) || 1,
        rows: parseInt(query._pageSize) || 20,
        imgRows: parseInt(query._pageSize) || 9,
        template: query._template || "index",
        channelName: query._channelName || "",
        relateSubChannels: query._isAgg || false,
        sort: query.sort || "",
        order: query.order || ""
    }
}
function verifyParams (res, queryParams) {
    if(!queryParams.channelId){
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end("缺少参数channelId！");
        return;
    }
    if(!intReg.test(queryParams.page)){
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end("参数page不合法！");
        return;
    }
    if(!intReg.test(queryParams.rows)){
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end("参数_pageSize不合法！");
        return;
    }
    if(specialCharactersReg.test(queryParams.template)){
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end("参数_template不合法！");
        return;
    }
    if(specialCharactersReg.test(queryParams.relateSubChannels)){
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end("参数_isAgg不合法！");
        return;
    }
    if(specialCharactersReg.test(queryParams.sort)){
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end("参数sort不合法！");
        return;
    }
    if(specialCharactersReg.test(queryParams.order)){
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end("参数order不合法！");
        return;
    }
    return true;
}