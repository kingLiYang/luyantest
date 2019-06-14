const urlParse = require('url'),
    _ = require("underscore"),
    region = require('../../../config/12309/region'),
    codeTable = require('../../../config/12309/codeTable'),
    logic = require('../logics/index');

//页面跳转
exports.renderTo = async(req, res) => {
    const url = urlParse.parse(req.url).pathname,
        queryArr = req.query;
    let last = url.split("/")[url.split("/").length-2], renderName, regionID, channelWebPath;
    if(last == "ajxxgk"){//首页
        renderName = "12309/ajxxgk";
    }else if(last == "zjxflws"){//法律文书公开列表页
        channelWebPath = url.replace("/12309", "").replace("/zjxflws/index.shtml", "");
        renderName = "12309/ajxxgk_flwsgk";
    }else if(last == "zdajxx"){//重要案件信息列表页
        channelWebPath = url.replace("/12309", "").replace("/zdajxx/index.shtml", "");
        renderName = "12309/ajxxgk_zyajxx";
    }else{
        channelWebPath = url.replace("/12309", "").replace("/index.shtml", "");
        regionID = channelWebPath.split("/")[2] || channelWebPath.split("/")[1];
        renderName = "12309/ajxxgk_ejy";
    }
    console.log("render to page: " + renderName);
    let regionName = '';
    if(region[regionID]){
        regionName = region[regionID].name
    }
    res.render(renderName, _.extend({region: regionID, regionName: regionName, channelWebPath: channelWebPath}, queryArr))
};
//第一页获取重要案件信息前5条
exports.getImpFileByLevel = async(req, res) => {
    console.log("controller.getImpFileByLevel");
    try{
        let level_1 = await logic.getLevelFileList(1);
        let level_2 = await logic.getLevelFileList(2);
        let level_3 = await logic.getLevelFileList(3);
        let results = {
            level_1: level_1, level_2: level_2, level_3: level_3
        };
        res.send({code: 200, results: results});
    }catch(err){
        console.error("controller.getImpFileByLevel err: " + err);
        res.send({code: 500, err: err});
    }
};
//第一页获取法律文书公开前5条
exports.getLawFileByLevel = async(req, res) => {
    console.log("controller.getLawFileByLevel");
    try{
        let file_1 = await logic.getLawFileList(codeTable.law.qss);//起诉书
        let file_2 = await logic.getLawFileList(codeTable.law.kss);//抗诉书
        let file_3 = await logic.getLawFileList(codeTable.law.bqsjds);//不起诉决定书
        let file_4 = await logic.getLawFileList(codeTable.law.xsssfcjds);//刑事申诉复查决定书
        let file_5 = await logic.getLawFileList(codeTable.law.qtflws);//其他法律文书
        let results = {
            file_1: file_1, file_2: file_2, file_3: file_3, file_4: file_4, file_5: file_5
        };
        res.send({code: 200, results: results});
    }catch(err){
        console.error("controller.getLawFileByLevel err: " + err);
        res.send({code: 500, err: err});
    }
};
//第一页获取稿件数量
exports.getFileNum = async(req, res) => {
    console.log("controller.getFileNum");
    try{
        let impTotalNum = await logic.getFileNum("重要案件信息","newTime");
        let lawTotalNum = await logic.getFileNum("法律文书公开","newTime");
        let impTodayNum = await logic.getFileNum("重要案件信息", "today");
        let lawTodayNum = await logic.getFileNum("法律文书公开", "today");
        let results = {
            impTotalNum: impTotalNum,
            lawTotalNum: lawTotalNum,
            impTodayNum: impTodayNum,
            lawTodayNum: lawTodayNum
        };
        res.send({code: 200, results: results});
    }catch(err){
        console.error("controller.getFileNum err: " + err);
        res.send({code: 500, err: err});
    }
};
//第二页获取地区检察院栏目列表(最高检页面)
exports.getGJChannelList = async(req, res) => {
    console.log("controller.getGJChannelList");
    try{
        let results = await logic.getGJChannelList();
        res.send({code: 200, results: results});
    }catch(err){
        console.error("controller.getGJChannelList err: " + err);
        res.send({code: 500, err: err});
    }
};
//第二页获取地区检察院栏目列表(地区页面)
exports.getChannelList = async(req, res) => {
    const regionID = req.query.regionID;
    console.log("controller.getChannelList region: " + regionID);
    try{
        let results = await logic.getChannelList(regionID);
        res.send({code: 200, results: results});
    }catch(err){
        console.error("controller.getChannelList err: " + err);
        res.send({code: 500, err: err});
    }
};
//第二页获取地区稿件列表
exports.getRegionFile = async(req, res) => {
    const channelWebPath = req.query.channelWebPath, channelLevels = req.query.channelLevels;
    console.log("controller.getRegionFile region: " + channelLevels);
    try{
        let impFileList = await logic.getRegionFile({channelWebPath: channelWebPath, channelLevels: channelLevels, fileType: "重要案件信息"});
        let lawFileList = await logic.getRegionFile({channelWebPath: channelWebPath, channelLevels: channelLevels, fileType: "法律文书公开"});
        res.send({code: 200, results: {impFileList: impFileList, lawFileList: lawFileList}});
    }catch(err){
        console.error("controller.getRegionFile err: " + err);
        res.send({code: 500, err: err});
    }
};
//获取重要案件信息列表
exports.getFileListByPage = async(req, res) => {
    const conditions = {
        fileType: req.body.fileType,
        codeId: req.body.codeId,
        regionID: req.body.regionID,
        channelWebPath: req.body.channelWebPath,
        channelLevels: req.body.channelLevels,
        page: Number(req.body.page) || 1,
        size: Number(req.body.size) || 15
    };
    console.log("controller.getFileListByPage page: " + conditions.page);
    try{
        let impFileList = await logic.getFileListByPage(conditions);
        res.send({code: 200, results: impFileList});
    }catch(err){
        console.error("controller.getFileListByPage err: " + err);
        res.send({code: 500, err: err});
    }
};
//获取重要案件信息和法律文书前6条稿件列表
exports.getFileList = async(req, res) => {
    console.log("controller.getFileList");
    try{
        let ajFileList = await logic.getFileList("重要案件信息");
        let wsFileList = await logic.getFileList("法律文书公开");
        res.send({anxxkg:{zyajxxfb: ajFileList, flwsfb: wsFileList}});
    }catch(err){
        console.error("controller.getFileList err: " + err);
        res.send({code: 500, err: err});
    }
};
//获取页面位置信息
exports.getLocalList = async(req, res) => {
    const channelWebPath = req.query.channelWebPath;
    console.log("controller.getLocalList channelWebPath: " + channelWebPath);
    try{
        let results = await logic.getLocalList(channelWebPath);
        res.send({code: 200, results: results});
    }catch(err){
        console.error("controller.getLocalList err: " + err);
        res.send({code: 500, err: err});
    }
};