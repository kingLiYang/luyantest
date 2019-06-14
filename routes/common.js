// common项目  路由
var bodyParser = require('body-parser'),
    _ = require('underscore');
var controllers = require('../app/common/controllers');
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
                    "/common/search/*"
                ],
                dataType: "json",
                fn: controllers.index
            }, {
                method: "get;post",
                urls: [
                    "/common/esUpperLower/*"
                ],
                dataType: "json",
                fn: controllers.esUpperLower
            }, {
                method: "get;post",
                urls: [
                    "/common/getUpperLowerByManuscriptId/*"
                ],
                dataType: "json",
                fn: controllers.getUpperLowerByManuscriptId
            }, {
                method: "get;post",
                urls: [
                    "/common/test/*"
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
