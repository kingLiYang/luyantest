// chinatax项目  路由
var bodyParser = require('body-parser'),
    _ = require('underscore');
var controllers = require('../app/chinatax/controllers');
/*
 * 路由设置
 * method：请求方式
 * urls：请求地址(数组)
 * dataType：请求数据类型
 * fn:请求对应处理函数
 */
module.exports = (app) => {
    var rules = [
            {
                method: "get;post",
                urls: [
                    "/chinatax/search/*"
                ],
                dataType: "json",
                fn: controllers.index
            }, {
                method: "get;post",
                urls: [
                    "/chinatax/esUpperLower/*"
                ],
                dataType: "json",
                fn: controllers.esUpperLower
            },{//栏目页
				method: "get;post",
				urls: [
					"/chinatax/manuscriptList/*"
				],
				dataType: "json",
				fn: controllers.manuscriptList
			},{//图片页
				method: "get;post",
				urls: [
					"/chinatax/imageList/*"
				],
				dataType: "json",
				fn: controllers.imageList
			},{//信息公开基本目录页
				method: "get;post",
				urls: [
					"/chinatax/baseDirectory/*"
				],
				dataType: "json",
				fn: controllers.baseDirectory
			},{//列表查询
				method: "post",
				urls: [
				    "/getFileListByCodeId"
				],
				dataType: "json",
				fn: controllers.getFileListByCodeId
			},{//获取栏目树
			    method: "get",
			    urls: [
			        "/getChannelList"
			    ],
			    dataType: "json",
			    fn: controllers.getChannelList
			}, {//搜索
			    method: "post",
			    urls: [
			        "/getSearch"
			    ],
			    dataType: "json",
			    fn: controllers.getSearch
			}, {//公报上下期
			    method: "post",
			    urls: [
			        "/getCommuniqueChange"
			    ],
			    dataType: "json",
			    fn: controllers.getCommuniqueChange
			},{//公报
			    method: "get;post",
			    urls: [
			        "/chinatax/communique/*"
			    ],
			    dataType: "json",
			    fn: controllers.communique
			},{
                method: "get;post",
                urls: [
                    "/chinatax/test/*"
                ],
                dataType: "json",
                fn: controllers.test
            }
        ],
        methods,
        urls,
        dataType,
        processFn,
        layout;
    // app.use(bodyParser.urlencoded({extended: true}));
    _.each(rules, (rule) => {
        methods = rule.method.split(";");
        urls = rule.urls;
        if (rule.dataType == "text") {
            dataType = bodyParser.raw();
        } else {
            dataType = bodyParser.json();
        }
        processFn = rule.fn;
        _.each(methods, (method) => {
            if (method === 'get' && processFn) {
                _.each(urls, (url) => {
                    app.get(url, dataType, processFn);
                })
            } else if (method === 'post' && processFn) {
                _.each(urls, (url) => {
                    app.post(url, dataType, processFn);
                })
            } else if (method === 'put' && processFn) {
                _.each(urls, (url) => {
                    app.put(url, dataType, processFn);
                })
            } else if (method === 'delete' && processFn) {
                _.each(urls, (url) => {
                    app.delete(url, dataType, processFn);
                })
            }
        })
    });
};
