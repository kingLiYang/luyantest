var config = require("../../../config/common/config");
var redis = require("redis"),
    redisClient = redis.createClient(config.redis.port, config.redis.host, {auth_pass:config.redis.secret});

redisClient.on("error", function(error) {
    console.log(error);
});
redisClient.on("connect", function(){
    console.log("common connect redis");
})
module.exports = redisClient;