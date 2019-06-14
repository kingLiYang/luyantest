const config = require("../../../config/12309/config"),
    region = require("../../../config/12309/region"),
    esDAO = require("../db/es");
const regionCodeList = ["110000","120000","130000","140000","150000","210000","220000","230000","310000","320000","330000","340000","350000","360000","370000","410000","420000","430000","440000","450000","460000","500000","510000","520000","530000","540000","610000","620000","630000","640000","650000","660000"];

//第一页重要稿件列表
exports.getLevelFileList = async(level) => {
    console.log("logic.getLevelFileList level: " + level);
	let newTime = new Date().getTime();
    var body;
    if (level == 1 || level == "1") {
		var mustArr= [
						{"term": {"channelName": "重要案件信息"}},
						{"term": {"status": "4"}},
						{"term": {"channel.channelLevel": 5}},
						{"terms": {"channel.channelCode": regionCodeList}}
					];
		mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime-86400000*365}}});
		var mustArrs= [
						{"term": {"channelName": "重要案件信息"}},
						{"term": {"status": "4"}},
						{"term": {"channel.channelLevel": 3}}
					];
		mustArrs.push({"range": {"createdTime": {"lt": newTime , "gte": newTime-86400000*365}}});
        body = {
            "size": 6,
            "from": 0,
            "query": {
                "bool": {
                    "should":[
                        {
                            "bool": {
                                "must": mustArr,
                                "must_not": [
                                    {"term": {"channel.channelLevel": 6}}
                                ]
                            }
                        },
                        {
                            "bool": {
                                "must": mustArrs,
                                "must_not": [
                                    {"term": {"channel.channelLevel": 5}}
                                ]
                            }
                        }
                    ]
                }
            },
            "sort" : {"createdTime" : { "order" : "desc" }}
        };
    } else if (level == 2 || level == "2") {
		var mustArr = [
                        {"term": {"channelName": "重要案件信息"}},
                        {"term": {"channel.channelLevel": 5}},
                        {"term": {"status": "4"}}
                    ];
		mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime-86400000*365}}});
        body = {
            "size": 6,
            "from": 0,
            "query": {
                "bool": {
                    "must":mustArr,
                    "must_not": [
                        {"term": {"channel.channelLevel": 6}},
                        {"terms": {"channel.channelCode": regionCodeList}}
                    ]
                }
            },
            "sort" : {"createdTime" : { "order" : "desc" }}
        };
    } else if (level == 3 || level == "3") {
		var mustArr = [
                        {"term": {"channelName": "重要案件信息"}},
                        {"term": {"channel.channelLevel": 6}},
                        {"term": {"status": "4"}}
                    ];
		mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime-86400000*365}}});
        body = {
            "size": 6,
            "from": 0,
            "query": {
                "bool": {
                    "must": mustArr,
                    "must_not": [
                        {"term": {"channel.channelLevel": 7}}
                    ]
                }
            },
            "sort" : {"createdTime" : { "order" : "desc" }}
        };
    }

    try {
        let dataList = [];
        const urlHost = config.elasticsearch.urlHost;
        let results = await esDAO.search(config.elasticsearch.index, body);
        if (results.hits.hits.length > 0) {
            for (var i = 0; i < results.hits.hits.length; i++) {
                results.hits.hits[i]._source.url = urlHost + results.hits.hits[i]._source.url;
                dataList.push(results.hits.hits[i]._source)
            }
        }
        return dataList;
    } catch (err) {
        console.error("logic.getLevelFileList err: " + err);
        throw new Error(err)
    }
};
//第一页法律稿件列表
exports.getLawFileList = async(codeId) => {
    console.log("logic.getLawFileList codeId: " + codeId);
	let newTime = new Date().getTime();
	var mustArr = [
                    {"match": {"domainMetaList.resultList.codeId": codeId}},
                    {"match": {"domainMetaList.resultList.key": "flwsgk"}},
                    {"term": {"status": "4"}}
                ];
	mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime-86400000*365}}})
    let body = {
        "size": 6,
        "from": 0,
        "query": {
            "bool": {
                "must": mustArr
            }
        },
        "sort": {"createdTime": {"order": "desc"}}
    };
    try {
        let dataList = [];
        const urlHost = config.elasticsearch.urlHost;
        let results = await esDAO.search(config.elasticsearch.index, body);
        if (results.hits.hits.length > 0) {
            for (var i = 0; i < results.hits.hits.length; i++) {
                results.hits.hits[i]._source.url = urlHost + results.hits.hits[i]._source.url;
                dataList.push(results.hits.hits[i]._source)
            }
        }
        return dataList;
    } catch (err) {
        console.error("logic.getLawFileList err: " + err);
        throw new Error(err)
    }
};
//第一页获取稿件数量
exports.getFileNum = async(key, date) => {
    let mustArr = [
        {"match": {"channelName": key}},
        {"term": {"status": "4"}}
    ];
    if(date=="today"){
        let timeStr = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        mustArr.push({"range": {"createdTime": {"lt": timeStr + 86400000, "gte": timeStr}}})
    }else{
		let newTime = new Date().getTime();
        mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime-86400000*365}}})
	}
    let body = {
        "size": 1,
        "from": 0,
        "query": {
            "bool": {
                "must": mustArr
            }
        },
        "sort" : { "createdTime" : { "order" : "desc" } }
    };
    try {
        let results = await esDAO.search(config.elasticsearch.index, body);
        return results.hits.total;
    } catch (err) {
        console.error("logic.getFileNum err: " + err);
        throw new Error(err)
    }
};
//第二页获取栏目列表(最高检页面)
exports.getGJChannelList = async() => {
    console.log("logic.getGJChannelList");
    const regionIDList = ["bj", "tj", "heb", "sxa", "nmg", "ln", "jl", "hlj", "sh",
        "js", "zj", "ah", "fj", "jx", "sd", "hen", "hub", "hun", "gd", "gx", "han", "cq", "sc",
        "gz", "yn", "xz", "sxb", "gs", "qh", "nx", "xj", "jsbt"];
    try {
        let results = [];
        for(let regionID of regionIDList){
            let regionInfo = region[regionID];
            //第一步 获取该地区本级栏目
            let channelLevels, parentId, firstChannel = [], secondChannelList = [];
            let channelBody = {
                "query": {"bool": {"must": [{"term": {"channelCode": regionInfo.code}},{"term": {"status": "3"}}]}},
                "collapse": {"field": "channelCode"}
            };
            let channel = await esDAO.search(config.elasticsearch.channelIndex, channelBody);
            if(channel.hits.total > 0){
                firstChannel = channel.hits.hits[0];
                // channelLevels = channel.hits.hits[0]._source.channelLevels + "/" + channel.hits.hits[0]._source.channelId;
                parentId = channel.hits.hits[0]._source.channelId;
                //第二步 获取一级子栏目
                let body = {
                    "size": 1000,
                    "from": 0,
                    "query": {
                        "bool": {
                            "must": [{"term": {"parentId": parentId}},{"term": {"status": "3"}}],
                            "must_not": [{"term": {"channelName": "重要案件信息"}},
                                {"term": {"channelName": "法律文书公开"}}]
                        }
                    },
                    "sort" : { "seqNum" : { "order" : "asc" } }
                };
                let secondChannelResults = await esDAO.search(config.elasticsearch.channelIndex, body);
                if(secondChannelResults.hits.total > 0){
                    secondChannelList = secondChannelResults.hits.hits;
                }
            }
            results.push({
                parent:{id: regionID, name: regionInfo.name, channelWebPath: regionInfo.channelWebPath},
                children: secondChannelList
                // children: [firstChannel].concat(secondChannelList)
            })
        }
        return results;
    } catch (err) {
        console.error("logic.getChannelList err: " + err);
        throw new Error(err)
    }
};
//第二页获取栏目列表(地区页面)
exports.getChannelList = async(regionID) => {
    console.log("logic.getChannelList regionID: " + regionID);
    try {
        let channelLevels, parentId, parentChannel;
        let code = region[regionID || "gj"].code;
        let channelBody = {
            "query": {"bool": {"must": [{"term": {"channelCode": code}},{"term": {"status": "3"}}]}},
            "collapse": {"field": "channelCode"}
        };
        //第一步 获取该地区本级栏目
        let channel = await esDAO.search(config.elasticsearch.channelIndex, channelBody);
        if(channel.hits.total < 1){
            return {parentChannel: {}, channelList: []};
        }
        parentChannel = channel.hits.hits[0];
        // channelLevels = channel.hits.hits[0]._source.channelLevels + "/" + channel.hits.hits[0]._source.channelId;
        parentId = channel.hits.hits[0]._source.channelId;
        let body = {
            "size": 1000,
            "from": 0,
            "query": {
                "bool": {
                    "must": [{"term": {"parentId": parentId}},{"term": {"status": "3"}}],
                    "must_not": [{"term": {"channelName": "重要案件信息"}},
                        {"term": {"channelName": "法律文书公开"}}]
                }
            },
            // "collapse": {"field": "channelCode"}
            "sort" : { "seqNum" : { "order" : "asc" } }
        };
        //第二步 获取一级子栏目
        let firstChannelResults = await esDAO.search(config.elasticsearch.channelIndex, body);
        if(firstChannelResults.hits.total < 1){
            return {parentChannel: parentChannel, channelList: []};
        }
        let firstChannelList = firstChannelResults.hits.hits;
        let channelList = [];
        //第三步 获取一级子栏目的二级子栏目
        for(let i = 0; i < firstChannelList.length; i++){
            let childrenLevels = firstChannelList[i]._source.channelLevels + "/" + firstChannelList[i]._source.channelId;
            let childrenParentId = firstChannelList[i]._source.channelId;
            let body = {
                "size": 1000,
                "from": 0,
                "query": {
                    "bool": {
                        "must": [{"term": {"parentId": childrenParentId}},{"term": {"status": "3"}}],
                        "must_not": [{"term": {"channelName": "重要案件信息"}},
                            {"term": {"channelName": "法律文书公开"}}]
                    }
                },
                // "collapse": {"field": "channelCode"}
                "sort" : { "seqNum" : { "order" : "asc" } }
            };
            let childrenResults = await esDAO.search(config.elasticsearch.channelIndex, body);
            let children = [];
            if(childrenResults.hits.total > 0){
                children = childrenResults.hits.hits;
            }
            channelList.push({first: firstChannelList[i], children: children})
        }
        return {parentChannel: parentChannel, channelList: channelList}
    } catch (err) {
        console.error("logic.getChannelList err: " + err);
        throw new Error(err)
    }
};
//第二页获取稿件列表
exports.getRegionFile = async(conditions) => {
    console.log("logic.getRegionFile channelWebPath: " + conditions.channelWebPath);
    let newTime=new Date().getTime();
    try {
        let channelLevels, body;
        if(!conditions.channelLevels){
			if(conditions.channelWebPath.split("/").length < 4){
                let _channelWebPath = conditions.channelWebPath + "/*";
				var mustArr =  [{"wildcard": {"channelWebPath": _channelWebPath}},
                                // "must": [{"match": {"channelLevels": channelLevels}},
                                // "must": [{"match": {"channel.channelCode": channelCode}},
                                {"term": {"channelName": conditions.fileType}},
                                {"term": {"status": "4"}}];
				mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime- 86400000*365}}})
                body = {
                    "size": 6,
                    "from": 0,
                    "query": {
                        "bool": {
                            "must": mustArr
                        }
                    },
                    "sort" : { "createdTime" : { "order" : "desc" } }
                };
            }else{
                let _channelWebPath
                if(conditions.fileType == "重要案件信息"){
                    _channelWebPath = conditions.channelWebPath + "/zdajxx";
                }else{
                    _channelWebPath = conditions.channelWebPath + "/zjxflws";
                }
				var mustArr = [{"term": {"channelWebPath": _channelWebPath}},
                                {"term": {"channelName": conditions.fileType}},
                                {"term": {"status": "4"}}];
				mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime- 86400000*365}}})
                body = {
                    "size": 6,
                    "from": 0,
                    "query": {
                        "bool": {
                            "must": mustArr
                        }
                    },
                    "sort" : { "createdTime" : { "order" : "desc" } }
                };
            }			
        }else{
            channelLevels = conditions.channelLevels;
			var mustArr = [{"term": {"channelLevels": channelLevels}},
                            {"term": {"channelName": conditions.fileType}},
                            {"term": {"status": "4"}}];
			mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime- 86400000*365}}})
            body = {
                "size": 6,
                "from": 0,
                "query": {
                    "bool": {
                        "must": mustArr
                    }
                },
                "sort" : { "createdTime" : { "order" : "desc" } }
            };
        }
        let dataList = [];
        const urlHost = config.elasticsearch.urlHost;
        let results = await esDAO.search(config.elasticsearch.index, body);
        if (results.hits.hits.length > 0) {
            for (var i = 0; i < results.hits.hits.length; i++) {
                results.hits.hits[i]._source.url = urlHost + results.hits.hits[i]._source.url;
                dataList.push(results.hits.hits[i]._source)
            }
        }
        return dataList;
    } catch (err) {
        console.error("logic.getRegionFile err: " + err);
        throw new Error(err)
    }
};
//第三页获取重要稿件列表
exports.getFileListByPage = async(conditions) => {
    console.log("logic.getFileListByPage page: " + conditions.page);
    var mustArr = [{"term": {"channelName": conditions.fileType}},
        {"term": {"status": "4"}}];
    if(conditions.codeId){
        mustArr.push({"match": {"domainMetaList.resultList.codeId": conditions.codeId}});
        if(conditions.fileType == "重要案件信息"){
            mustArr.push({"match": {"domainMetaList.resultList.key": "zyajxx"}})
        }else{
            mustArr.push({"match": {"domainMetaList.resultList.key": "flwsgk"}})
        }
    }
    let body;
    try {
        if(conditions.channelLevels){
            mustArr.push({"match": {"channelLevels": conditions.channelLevels}});
        }else{
            if(conditions.channelWebPath){
                if(conditions.channelWebPath.split("/").length < 4){
                    let _channelCode = region[conditions.channelWebPath.split("/")[2]||"gj"].code;
                    mustArr.push({"match": {"channel.channelCode": _channelCode}});
                }else{
                    let channelBody = {
                        "size": 1,
                        "from": 0,
                        "query": {
                            "bool": {
                                "must": [
                                    {"term": {"webPath": conditions.channelWebPath}}
                                ]
                            }
                        }
                    };
                    let channel = await esDAO.search(config.elasticsearch.channelIndex, channelBody);
                    if (channel.hits.total < 1) {
                        return {};
                    }
                    let channelLevels = channel.hits.hits[0]._source.channelLevels + "/" + channel.hits.hits[0]._source.channelId;
                    mustArr.push({"match": {"channelLevels": channelLevels}});
                }

            }
            // else if(conditions.regionID){
            //     let code = region[conditions.regionID].code;
            //     let channelBody = {
            //         "size": 1,
            //         "from": 0,
            //         "query": {
            //             "bool": {
            //                 "must": [
            //                     {"match": {"channelCode": code}}
            //                 ]
            //             }
            //         }
            //     };
            //     let channel = await esDAO.search(config.elasticsearch.channelIndex, channelBody);
            //     if (channel.hits.total < 1) {
            //         return {};
            //     }
            //     let channelLevels = channel.hits.hits[0]._source.channelLevels + "/" + channel.hits.hits[0]._source.channelId;
            //     mustArr.push({"match": {"channelLevels": channelLevels}});
            // }
        }
		let newTime=new Date().getTime();
		mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime- 86400000*365}}})
        body = {
            "size": conditions.size,
            "from": (conditions.page - 1)*conditions.size,
            "query": {
                "bool": {
                    "must": mustArr
                }
            },
            "sort" : { "createdTime" : { "order" : "desc" } }
        };
        let dataList = [];
        const urlHost = config.elasticsearch.urlHost;
        let results = await esDAO.search(config.elasticsearch.index, body);
        if (results.hits.hits.length > 0) {
            for (var i = 0; i < results.hits.hits.length; i++) {
                results.hits.hits[i]._source.url = urlHost + results.hits.hits[i]._source.url;
                dataList.push(results.hits.hits[i]._source)
            }
        }
        results.hits.hits = dataList;
        return results;
    } catch (err) {
        console.error("logic.getFileListByPage err: " + err);
        throw new Error(err)
    }
};
//获取重要案件信息和法律文书前6条稿件列表
exports.getFileList = async(channelName) => {
    console.log("logic.getFileList channelName: " + channelName);
    let newTime=new Date().getTime();
	var mustArr = [
                    {"term": {"channelName": channelName}},
                    {"term": {"status": "4"}}
                ];
	mustArr.push({"range": {"createdTime": {"lt": newTime , "gte": newTime- 86400000*365}}})
    let body = {
        "size": 6,
        "from": 0,
        "query": {
            "bool": {
                "must": mustArr
            }
        },
        "sort": {"createdTime": {"order": "desc"}}
    };
    try {
        let dataList = [];
        const urlHost = config.elasticsearch.urlHost;
        let results = await esDAO.search(config.elasticsearch.index, body), fileType = "";
        if(channelName == "重要案件信息"){
            fileType = "zdajxx"
        }else{
            fileType = "zjxflws"
        }
        if (results.hits.hits.length > 0) {
            for (var i = 0; i < results.hits.hits.length; i++) {
                let  item = {};
                let info = results.hits.hits[i]._source;
                item.url = urlHost + info.url;
                item.title = info.title;
                item.lmsuburl = "/12309" + info.channelWebPath.replace(fileType, "index.shtml");
                item.lmsubtitle = info.channel[info.channel.length-2].displayName;
                dataList.push(item)
            }
        }
        return dataList;
    } catch (err) {
        console.error("logic.getFileList err: " + err);
        throw new Error(err)
    }
}
exports.getLocalList = async (channelWebPath) => {
    try {
        let pathArr = channelWebPath.split("/");
        let results = [];
        if(pathArr.length < 3){
            results.push({name: region[pathArr[1]].name, path: "/gj"})
        }else if(pathArr.length < 4){
            results.push({name: region[pathArr[2]].name, path: "/gj/"+pathArr[2]})
        }else{
            results.push({name: region[pathArr[2]].name, path: "/gj/"+pathArr[2]})
            let body = {"query": {"term": {"webPath": channelWebPath}}};
            let last = await esDAO.search(config.elasticsearch.channelIndex, body);
            if (pathArr.length > 4) {
                let _webPath = "/" + pathArr[1] + "/" + pathArr[2] + "/" + pathArr[3];
                let body = {"query": {"term": {"webPath": _webPath}}};
                let first = await esDAO.search(config.elasticsearch.channelIndex, body);
                results.push({name: first.hits.hits[0]._source.channelName, path: _webPath})
            }
            results.push({name: last.hits.hits[0]._source.channelName, path: channelWebPath})
        }
        return results;
    }catch (err) {
        console.error("logic.getLocalList err: " + err);
        throw new Error(err)
    }
};