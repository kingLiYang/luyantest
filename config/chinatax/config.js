module.exports = {
    "port": 3000,  // 服务启动监听端口号
    "getCMSUrl": "http://192.168.1.211:8090/app-search-es/searchController/searchJson.action",  // Java层数据请求接口地址
    "redis":{  // redis 配置
        "host": "192.168.1.211",  // host
        "port": "6379",  // 端口号
        "secret": "cloudTplWebapp",  // 密码 
        "prefix": "",
        "ttl": 60,  // 过期时间
        "key":"CMS_CD"  // 数据存储key名称
    },
    "elasticsearch":{  // elasticsearch 配置
        "host": "http://192.168.1.211:9200/",  // es库host
        "index": "cms_index",  // 稿件索引库
        "channelIndex": "cms_channel_index",  // 栏目索引库
        "fileUrlHost": "http://192.168.1.211:8888"  // 稿件host（若为空，则读取同目录website.js里的站点id进行host匹配）
	},
    "isStartEs": true,  // 是否启用es查询
    "isStartRedis": true  // 是否启用redis缓存模式
};