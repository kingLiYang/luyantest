const config = require("../../../config/common/config"),
    websiteConfig = require("../../../config/common/website"),
    client = require("needle"),
    _ = require("underscore"),
    redisClient = require("../db/redis"),
    es = require("../db/es");
const fileUrlHost = config.elasticsearch.fileUrlHost;
const filterTitleReg = /[\t\r\n\f]+/;
const hasHostReg = /\S+\/{2}\S+/;
exports.getCMS = function(req, res, channelId, relateSubChannels, page, rows, sort, order,  next){
    console.log("common logic.getCMS start");
    return new Promise((resolve, reject) => {
        if(config.isStartRedis) {//REDIS模式
            redisClient.get(config.redis.key + '_' + channelId + '_' + page + '_' + rows, function (err, data) {
                if (err || _.isEmpty(data)) {
                    //若缓存中没有数据 或缓存已过期 则去获取数据
                    getData(req, res, channelId, relateSubChannels, page, rows, sort, order)
                        .then(body => {
                            resolve(body)
                        }).catch(err => {
                        reject(err)
                    });
                } else {
                    resolve(JSON.parse(data));
                }
            })
        }else{//非REDIS模式
            getData(req, res, channelId, relateSubChannels, page, rows, sort, order)
                .then(body => {
                    resolve(body)
                }).catch(err => {
                reject(err)
            });
        }
    });
};
const getData = function(req, res, channelId, relateSubChannels, page, rows, sort, order, next){
    return new Promise((resolve, reject) => {
        if(config.isStartEs){//es查询
            getDataByES(req, res, channelId, relateSubChannels, page, rows, sort, order)
                .then(body => {
                    resolve(body)
                }).catch(err => {
                reject(err)
            });
        }else{//接口获取
            getDataByRequest(req, res, channelId, relateSubChannels, page, rows, sort, order)
                .then(body => {
                    resolve(body)
                }).catch(err => {
                reject(err)
            });
        }
    })
};
//通过请求接口获取数据
const getDataByRequest = function(req, res, channelId, relateSubChannels, page, rows, sort, order, next){
    return new Promise((resolve, reject) => {
        var finalSort = sort || "publishedTime";
        var finalOrder = order || "desc";
        var url = config.getCMSUrl + "?channelId="+channelId+"&relateSubChannels="+relateSubChannels+"&rows="+rows+"&page="+page+"&sort="+finalSort+"&order="+finalOrder;
        client.get(url, function(err, resp, body){
            if(err){
                reject(err);
            }
            body.results = toDoRequestList(body.results || [])
            if(config.isStartRedis){//是否启动redis查询/存储
                try{//将查询出的数据存到redis
                    redisClient.setex(config.redis.key + '_' + channelId + '_' + page + '_' + rows, config.redis.ttl, JSON.stringify({data:body}));
                    resolve({data:body});
                }catch(e){
                    reject(e);
                }
            }else{
                resolve({data:body});
            }

        });
    })
}
//通过直接查询ES获取数据
const getDataByES = (req, res, channelId, relateSubChannels, page, rows, sort, order, next) => {
    return new Promise((resolve, reject) => {
        console.log("common logic.getDataByES start");
        let body_channel = {
            size: 1,
            from: 0,
            "_source": ["channelId","channelName"],//筛选返回的field
            "query": {
                "match":{"channelId": channelId}
            }
        };
        es.search(config.elasticsearch.channelIndex, body_channel)
            .then(channel => {
                if(channel.hits.total == 0){
                    resolve({data:{total: 0, page:1, rows: 10, results: []}, channelName: ''});
                    return false;
                }
                let channelSource = channel.hits.hits[0]._source;
                let channelName = channelSource.channelName;
                let channelId = channelSource.channelId;
                let body, oQuery = {}, sortArr = [];
                if(relateSubChannels == true || relateSubChannels == "true"){  // 查询当前栏目及所有子栏目稿件
                    oQuery = {
                        "bool": {
                            "must": [
                                { "term": { "channel.channelId": channelId } },
                                { "term": { "status": "4" } }
                            ]
                        }
                    };
                }else{  //  只查询当前栏目稿件
                    oQuery = {
                        "bool": {
                            "must": [
                                { "term": { "channelId": channelId } },
                                { "term": { "status": "4" } }]
                        }
                    };
                }
                // 排序
                if (sort) {
                    sortArr = [{ [sort] : { "order" : order || "desc" } }]
                } else {
                    sortArr = [{ "isSticky": { "order": "desc" }},
                        { "seqNum": { "order": "desc" } },
                        { "sortedTime": { "order": "desc" } }]
                }
                body = {
                    "size": rows,
                    "from": (page-1)*rows,
                    "_source": ["channelId","channelName","channelLevels","title","url","publishedTime", "websiteId", "manuscriptId", "content", "resList", "memo", "domainMetaList"],  //  筛选返回的field
                    "query": oQuery,
                    "sort": sortArr,
                };
                es.search(config.elasticsearch.index, body)
                    .then(oResult => {
                        var data = {
                            page: page,
                            rows: rows,
                            channelId: channelId,
                            total: oResult.hits.total,
                            relateSubChannels: relateSubChannels,
                            results: toDoEsSearchList(oResult)
                        };
                        if(config.isStartRedis){//是否启动redis查询/存储
                            try{//将查询出的数据存到redis
                                redisClient.setex(config.redis.key + '_' + channelId + '_' + page + '_' + rows, config.redis.ttl, JSON.stringify({data:data, channelName:channelName}));
                                resolve({data:data, channelName:channelName});
                            }catch(e){
                                reject(e);
                            }
                        }else{
                            resolve({data:data, channelName:channelName});
                        }
                    }).catch(err => {
                    reject(err)
                })
            })
            .catch(err => {
                reject(err)
            });
    });
}
// es查询数据处理
function toDoEsSearchList (oResult) {
    var dataList = [];
    if (oResult.hits.total > 0) {
        let resultDataList = oResult.hits.hits
        let websiteUrl = fileUrlHost || ''
        if (!websiteUrl) {  // 未统一配置域名
            if (resultDataList.length) {
                let websiteId = resultDataList[0]._source.websiteId
                for (let attr in websiteConfig) {
                    if (attr === websiteId) {
                        websiteUrl = websiteConfig[attr];
                        break;
                    }
                }
            }
        }
        for (let item of resultDataList) {
            let _source = item._source
            _source.title = _source.title.replace(filterTitleReg, '')
            if (!hasHostReg.test(_source.url)) {    // 未拼接域名
                _source.url = websiteUrl + _source.url;
            }
            _source.publishedTimeStr = getDateTime(_source.publishedTime+28800000);
            // 处理图片路径
            let resList = _source.resList || [];
            for (let res of resList) {
                if (res.type === 'PICTURE') {
                    if (!hasHostReg.test(res.filePath)) {  // 未拼接域名
                        res.filePath = websiteUrl + res.filePath;
                    }
                }
            }
            _source.resList = resList;
            dataList.push(_source)
        }
    }
    return dataList;
}
// 直接请求接口数据处理
function toDoRequestList (resultDataList) {
    let websiteUrl = fileUrlHost || '' // 站点域名
    if (!websiteUrl) {
        if (resultDataList.length) {
            let websiteId = resultDataList[0].websiteId
            for (let attr in websiteConfig) {
                if (attr === websiteId) {
                    websiteUrl = websiteConfig[attr];
                    break;
                }
            }
        }
    }
    for (let item of resultDataList) {
        item.title = item.title && item.title.replace(filterTitleReg, '')
        if (!hasHostReg.test(item.url)) {    // 未拼接域名
            item.url = websiteUrl + item.url;
        }
        // 处理图片路径
        let resList = item.resList || [];
        for (let res of resList) {
            if (res.type === 'PICTURE') {
                if (!hasHostReg.test(res.filePath)) {  // 未拼接域名
                    res.filePath = websiteUrl + res.filePath;
                }
            }
        }
        item.resList = resList;
    }
    return resultDataList;
}
function getDateTime (timestamp) {  // 时间戳转成日期字符串
    var oDate = new Date (timestamp)
    var year = oDate.getFullYear()
    var month = oDate.getMonth() + 1
    var date = oDate.getDate()
    var hours = oDate.getHours()
    var minutes = oDate.getMinutes()
    var seconds = oDate.getSeconds()
    return year + '-' + addZero(month) + '-' + addZero(date) + ' ' + addZero(hours) + ':' + addZero(minutes) + ':' + addZero(seconds)
}
function addZero (target) {  // 数字前补0  target:需要补0的数字 num: 补成几位数
    var str = target + ''
    var iLen = str.length
    if (iLen >= 2) {
        return str
    }
    for (var i = 0; i < 2 - iLen; i++) {
        str = '0' + str
    }
    return str
}