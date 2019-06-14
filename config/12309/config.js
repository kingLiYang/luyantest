module.exports = {
    "port": 3000,
    "redis":{//redis配置
        "host": "192.168.1.211",//host
        "port": "6379",//port
        "secret": "cloudTplWebapp",//密码
        "prefix": "",
        "ttl": 60,//过期时间
        "key":"CMS_3"//数据存储key名称
    },
    "elasticsearch":{//elasticsearch配置
        "host": "http://192.168.1.211:9200/",//host
        "index": "cms_index",//稿件索引库
        "channelIndex": "cms_channel_index",//栏目索引库
        "urlHost": "http://192.168.1.211:8888"
    }
};