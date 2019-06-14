// 12309项目  路由
var bodyParser = require('body-parser'),
    _ = require('underscore');
var controllers = require('../app/12309/controllers');
/*
 * 路由设置
 * method：请求方式
 * urls：请求地址(数组)
 * dataType：请求数据类型
 * fn:请求对应处理函数
 */
module.exports = (app) => {
    var rules = [
            {//页面跳转
                method: "get",
                urls: [
                    "/12309/*"
                ],
                dataType: "json",
                fn: controllers.renderTo
            }, {//第一页获取重要案件信息前5条
                method: "get",
                urls: [
                    "/getImpFileByLevel"
                ],
                dataType: "json",
                fn: controllers.getImpFileByLevel
            }, {//第一页获取法律文书公开前5条
                method: "get",
                urls: [
                    "/getLawFileByLevel"
                ],
                dataType: "json",
                fn: controllers.getLawFileByLevel
            }, {//第一页获取稿件数量
                method: "get",
                urls: [
                    "/getFileNum"
                ],
                dataType: "json",
                fn: controllers.getFileNum
            }, {//获取地区检察院栏目列表(最高检页面)
                method: "get",
                urls: [
                    "/getGJChannelList"
                ],
                dataType: "json",
                fn: controllers.getGJChannelList
            }, {//获取地区检察院栏目列表(地区页面)
                method: "get",
                urls: [
                    "/getChannelList"
                ],
                dataType: "json",
                fn: controllers.getChannelList
            }, {//获取地区稿件列表
                method: "get",
                urls: [
                    "/getRegionFile"
                ],
                dataType: "json",
                fn: controllers.getRegionFile
            }, {//获取重要案件信息列表
                method: "post",
                urls: [
                    "/getFileListByPage"
                ],
                dataType: "json",
                fn: controllers.getFileListByPage
            }, {//获取重要案件和法律文书前6条稿件列表
                method: "get",
                urls: [
                    "/getFileList"
                ],
                dataType: "json",
                fn: controllers.getFileList
            },{//获取页面位置信息
                method: "get",
                urls: [
                    "/getLocalList"
                ],
                dataType: "json",
                fn: controllers.getLocalList
            },
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
