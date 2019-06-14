var config = require("../../../config/12309/config");
var redis = require("redis"),
    redisClient = redis.createClient(config.redis.port, config.redis.host, {auth_pass:config.redis.secret});

redisClient.on("error", function(error) {
    console.log(error);
});
redisClient.on("connect", function(){
    console.log("connect redis");
})
module.exports = redisClient;
