const config = require("../../../config/chinatax/config"),
    websiteConfig = require("../../../config/chinatax/website"),
    client = require("needle"),
    _ = require("underscore"),
    redisClient = require("../db/redis"),
    es = require("../db/es");
const fileUrlHost = config.elasticsearch.fileUrlHost;
const filterTitleReg = /[\t\r\n\f]+/;
const hasHostReg = /\S+\/{2}\S+/;
//公报
exports.getCommunique = async (req, res, channelCode,channelId)=>{
	console.log("chinatax logic.getCommunique start");
	return new Promise((resolve, reject) => {
		let body_channel = {
			size: 1,
			from: 0,
			"_source": ["channelCode", "channelName","channelId"],//筛选返回的field
			"query": {
				"match":{"channelCode": channelCode}
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
			resolve({channelName:channelName,channelId:channelId});  //返回的是数据
		}).catch(err => {
			reject(err)
		})
	})
}
//公报上下期
exports.getCommuniqueChange = async (req, res, conditions, channelCode)=>{
	console.log("chinatax logic.getCommuniqueChange start");
	return new Promise((resolve, reject) => {
		let body_channel = {
			size: 1,
			from: 0,
			"_source": ["channelCode", "channelName","channelId"],//筛选返回的field
			"query": {
				"match":{"channelCode": conditions.channelCode}
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
			let body = {
			    "size": conditions.size,
			    "from": (conditions.page-1)*conditions.size,
			    "_source": ["channelCode", "channelName","title","url","publishedTime"],  //  筛选返回的field
			    "query": {
					"bool": {
						"must": [
							{ "term": { "channelId": channelId } },
							{ "term": { "status": "4" } }]
					}
				},
			};
			es.search(config.elasticsearch.index, body) 
				.then(oResult => {
					var data = {
						page: conditions.page,
						rows: conditions.size,
						channelCode: channelCode,
						total: oResult.hits.total,
						results: toDoEsSearchList(oResult),
					};
					resolve({data:data, channelName:channelName});  //返回的是数据
				}).catch(err => {
				reject(err)
			})
		})
	})
}
//根据栏目代号获取稿件列表
exports.getMListBychannelCode = async(req, res, channelCode, page, rows) => {
	 return new Promise((resolve, reject) => {
	    console.log("chinatax logic.getMListBychannelCode start");
	    let body_channel = {
			size: 1,
			from: 0,
			"_source": ["channelCode", "channelName","channelId"],//筛选返回的field
			"query": {
				"match":{"channelCode": channelCode}
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
			let body = {
			    "size": rows,
			    "from": (page-1)*rows,
			    "_source": ["channelCode", "channelName","title","url","publishedTime"],  //  筛选返回的field
			    "query": {
					"bool": {
						"must": [
							{ "term": { "channelId": channelId } },
							{ "term": { "status": "4" } }]
					}
				},
				"sort" : { "createdTime" : { "order" : "desc" } }
			};
			es.search(config.elasticsearch.index, body) 
				.then(oResult => {
					var data = {
						page: page,
						rows: rows,
						channelCode: channelCode,
						total: oResult.hits.total,
						results: toDoEsSearchList(oResult),
					};
					resolve({data:data, channelName:channelName});  //返回的是数据
				}).catch(err => {
				reject(err)
			})
		})
	});
}
//根据栏目代号获取图片列表
exports.getIListBychannelCode = async(req, res, channelCode, page, rows) => {
	return new Promise((resolve, reject) => {
		console.log("chinatax logic.getIListBychannelCode start");
		let body_channel = {
			size: 1,
			from: 0,
			"_source": ["channelCode", "channelName","channelId"],//筛选返回的field
			"query": {
				"match":{"channelCode": channelCode}
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
			let body = {
			    "size": rows,
			    "from": (page-1)*rows,
			    "_source": ["channelCode", "channelName","title","url","publishedTime","resList"],  //  筛选返回的field
			    "query": {
					"bool": {
						"must": [
							{ "term": { "channelId": channelId } },
							{ "term": { "status": "4" } }]
					}
				},
				"sort" : { "createdTime" : { "order" : "desc" } }
			};
			es.search(config.elasticsearch.index, body)
				.then(oResult => {
					var data = {
						page: page,
						rows: rows,
						channelCode: channelCode,
						total: oResult.hits.total,
						results: toDoEsSearchList(oResult),
					};
					resolve({data:data, channelName:channelName});
				}).catch(err => {
				reject(err)
			})
		})
	})
}
//国家税前总局
exports.getBaseDirectory = async(req, res, channelCode, channelId) => {
	return new Promise((resolve, reject) => {
	    console.log("common logic.getBaseDirectory start");
		let body_channel = {
			size: 1,
			from: 0,
			"_source": ["channelId","channelName","channelCode"],//筛选返回的field
			"query": {
				"match":{"channelCode": channelCode}
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
			resolve({channelName:channelName,channelId: channelId});
		})
		.catch(err => {
			reject(err)
		});
	});
}
//栏目稿件列表
exports.getFileListByCodeId = async(conditions) => {
	console.log("logic.getFileListByCodeId")
	return new Promise((resolve, reject) => {
		var mustArr = [{"term": {"channelId": conditions.channelId}},
			{"term": {"status": "4"}}];
		if(conditions.codeId){
			mustArr.push({"match": {"codeId": conditions.codeId}});
		}
		let body = {
			"size": conditions.size,
			"from": (conditions.page-1)*conditions.size,
			"_source": ["channelCode", "channelName","title","url","publishedTime"],  //  筛选返回的field
			"query": {
				"bool": {
					"must": mustArr
				}
			},
			"sort" : { "createdTime" : { "order" : "desc" } }
		};
		es.search(config.elasticsearch.index, body)
		.then(oResult =>{
			var data = {
				page: conditions.page,
				rows: conditions.size,
				channelId: conditions.channelId,
				total: oResult.hits.total,
				results: toDoEsSearchList(oResult),
			};
			let list = data.results
			let metaKeySYH = conditions.keySYH
			let metaKeyFWZH = conditions.keyFWZH
			let meteKeyTC = conditions.keyTC
			for (let item of list) {
				let domainMetaList = item.domainMetaList || []
				for (let domainMeta of domainMetaList) {
					let metaList = domainMeta.resultList || []
					for (let metaData of metaList) {
						let tMetaDataKey = metaData.key
						if (metaKeySYH === tMetaDataKey) {
							item.keyIndexSYH = metaData.value ;
						}
						if (metaKeyFWZH === tMetaDataKey) {
							item.keyIndexFWZH = metaData.value ;
						}
						if (metaKeyTC === tMetaDataKey) {
							item.keyIndexTC = metaData.value ;
						}
					}
				}
			}
			resolve({data:data});
		}).catch (err => {
			console.error("logic.getFileListByCodeId err: " + err);
			reject(err)
		})
	})
}
//获取栏目树
exports.getChannelList = async(regionCode) =>{
	console.log("logic.getChannelList");
	try{
		let channelBody = {
			"query": {
				"bool": {
					"must": [{
						"term": {"channelCode": regionCode}},
						{"term": {"status": "3"}}],
					},
				},
			"collapse": {"field": "channelCode"}
		}
		let channel = await es.search(config.elasticsearch.channelIndex, channelBody)
		if(channel.hits.total == 0){
			return({parentChannel: {}, channelList: []});
			return false;
		}
		let parentChannel = channel.hits.hits[0];
		let parentId = parentChannel._source.channelId;
		let body = {
			"size": 1000,
			"from": 0,
			"query": {
				"bool": {
					"must": [{"term": {"parentId": parentId}},{"term": {"status": "3"}}],
				}
			},
			"sort" : { "seqNum" : { "order" : "asc" } }
		};
		let firstChannelResults = await es.search(config.elasticsearch.channelIndex, body)
		if(firstChannelResults.hits.total == 0){
			return({parentChannel: parentChannel, channelList: []});
		}
		let firstChannelList = firstChannelResults.hits.hits
		let channelList = [];
		for(let i = 0; i < firstChannelList.length; i++){
			let childrenParentId = firstChannelList[i]._source.channelId;
			let body = {
			    "size": 1000,
			    "from": 0,
			    "query": {
			        "bool": {
			            "must": [{"term": {"parentId": childrenParentId}},{"term": {"status": "3"}}],
			        }
			    },
			    "sort" : { "seqNum" : { "order" : "asc" } }
			};
			let childrenResults = await es.search(config.elasticsearch.channelIndex, body)
			let children = [];
			if(childrenResults.hits.total > 0){
				children = childrenResults.hits.hits;
			}
			channelList.push({first: firstChannelList[i], children: children})
		}
		return {parentChannel: parentChannel, channelList: channelList}
	}catch(err){
		console.error("logic.getChannelList err: " + err);
		throw new Error(err)
	}
	
}

//搜索
exports.getSearch = async(conditions) =>{
	console.log("logic.getSearch");
	return new Promise((resolve, reject) => {
		var mustArr = [
		    			{ "term": { "channelId": conditions.channelId } },
		    			{ "term": { "status": "4" } },
					]
		if(conditions.type == 'title'){
			mustArr.push({"term":{"title": conditions.searchContent}})
		}else{
			mustArr.push({"term":{"content":conditions.searchContent}})
		}
		let body = {
		    "size": conditions.size,
		    "from": (conditions.page-1)*conditions.size,
			"_source": ["channelCode","title","url","publishedTime","channelName"],  //  筛选返回的field
		    "query": {
		    	"bool": {
		    		"must": mustArr
		    	}
		    },
		    "sort" : { "createdTime" : { "order" : "desc" } }
		};
		es.search(config.elasticsearch.index, body) 
			.then(oResult => {
				var data = {
					page: conditions.page,
					rows: conditions.size,
					total: oResult.hits.total,
					results: toDoEsSearchList(oResult),
				};
				resolve({data:data});  //返回的是数据
			}).catch(err => {
			reject(err)
		})
	})
}
exports.getCMS = function(req, res, channelId, relateSubChannels, page, rows, sort, order,  next){
    console.log("chinatax logic.getCMS start");
    return new Promise((resolve, reject) => {
        if(config.isStartRedis) {//REDIS模式
            redisClient.get(config.redis.key + '_' + channelId + '_' + page, function (err, data) {
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
                    redisClient.setex(config.redis.key + '_' + channelId + '_' + page, config.redis.ttl, JSON.stringify({data:body}));
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
                                redisClient.setex(config.redis.key + '_' + channelId + '_' + page, config.redis.ttl, JSON.stringify({data:data, channelName:channelName}));
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