var elasticsearch = require('elasticsearch');
var config = require("../../../config/common/config");

var esClient = new elasticsearch.Client({
    host: config.elasticsearch.host,
    log: 'error'
});

exports.search = function (index, body) {
    return new Promise((resolve, reject) => {
        esClient.search({index: index, body: body})
        .then(result => {
        resolve(result)
    }).catch(err => {
        reject(err)
    });
})
};