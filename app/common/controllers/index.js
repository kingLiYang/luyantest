const urlparse = require('url'),
    _ = require('underscore'),
    logic = require("../logics/index");
const pagePath = 'common/';
const specialCharactersReg = /[`~!@#$\^&*()+=<>?:'"{},;'\[\]·~！￥…（）《》？：“”【】、；‘’，。]/;
const intReg = /^[0-9]*[1-9][0-9]*$/;
exports.index = function(req, res){
    console.log("common search start");
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
    res.render(pagePath + "test","");
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
//根据稿件id调取es接口查找上下篇数据
exports.getUpperLowerByManuscriptId = function(req, res){
    var queryParams = getQueryParams(req);
    if (!(verifyParams(res, queryParams))) {  // 校验不通过
        return;
    }
    logic.getCMS(req, res, queryParams.channelId, queryParams.relateSubChannels, 1, 1000000000, queryParams.sort, queryParams.order)
        .then(data => {
        //设置允许跨域的域名，*代表允许任意域名跨域
        res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","POST,GET");
    var manuscriptId = queryParams.manuscriptId
    var renderData = data.data ? data.data : data;
    var renderDataList = renderData.results || [];
    var prevIndex = -1;
    var NextIndex = 0;
    var prevNextData = { prev: null, next: null }
    var iLen = renderDataList.length
    for (let i = 0; i < iLen; i++) {
        var item = renderDataList[i];
        if (manuscriptId === item.manuscriptId) {
            prevIndex = i - 1;
            NextIndex = i + 1;
            if (renderDataList.length > 1) {
                if (prevIndex >= 0) {
                    let tManuscript = renderDataList[prevIndex];
                    let resUrl = tManuscript.url;
                    prevNextData.prev = {
                        manuscriptId: tManuscript.manuscriptId,
                        title: tManuscript.title,
                        contentStrUrl: resUrl.substring(findIndexOf(resUrl,'/',2))
                    }
                }
                if (NextIndex >= 1 && NextIndex < iLen) {
                    let tManuscript = renderDataList[NextIndex];
                    let resUrl = tManuscript.url;
                    prevNextData.next = {
                        manuscriptId: tManuscript.manuscriptId,
                        title: tManuscript.title,
                        contentStrUrl: resUrl.substring(findIndexOf(resUrl,'/',2))
                    }
                }
            }
            break;
        }
    }
    res.send({"data": prevNextData});
}).catch(err => {
        res.send("内部服务器错误");
})
};
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
        rows: parseInt(query._pageSize) ||  20,
        template: query._template || "index",
        channelName: query._channelName || "",
        relateSubChannels: query._isAgg || false,
        sort: query.sort || "",
        order: query.order || "",
        manuscriptId: query.manuscriptId || ''
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