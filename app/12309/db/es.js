var elasticsearch = require('elasticsearch');
var config = require("../../../config/12309/config");

var esClient = new elasticsearch.Client({
    host: config.elasticsearch.host,
    log: 'error'
});

exports.search = async function (index, body) {
    return await esClient.search({index: index, body: body});
};