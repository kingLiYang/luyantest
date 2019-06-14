(function($){
    var _pageinit;
    var zp = {
        init:function(obj,pageinit){
            return (function(){
                zp.addhtml(obj,pageinit);
                // zp.bindEvent(obj,pageinit);
            }());
        },
        addhtml:function(obj,pageinit){
            return (function(){
                obj.empty();
                /*上一页*/
                if (pageinit.current > 1) {
                    obj.append('<a href="javascript:;" class="prebtn">上一页</a>');
                } else{
                    obj.remove('.prevPage');
                    obj.append('<span class="disabled">上一页</span>');
                }
                // 中间页（12309项目调整参数）
                if (pageinit.current >3 && pageinit.pageNum > 3) {
                    obj.append('<a href="javascript:;" class="zxfPagenum">'+1+'</a>');
                    obj.append('<span>...</span>');
                }
                if (pageinit.current >2 && pageinit.current <= pageinit.pageNum-3) {
                    var start  = pageinit.current - 1,end = pageinit.current + 1;
                }else if(pageinit.current >2 && pageinit.current > pageinit.pageNum-3){
                    var start  = pageinit.pageNum - 2,end = pageinit.pageNum;
                }else{
                    var start = 1,end = 3;
                }
                /*
                 // 中间页（原分页参数）
                if (pageinit.current >4 && pageinit.pageNum > 4) {
                    obj.append('<a href="javascript:;" class="zxfPagenum">'+1+'</a>');
                    obj.append('<span>...</span>');
                }
                if (pageinit.current >4 && pageinit.current <= pageinit.pageNum-5) {
                    var start  = pageinit.current - 2,end = pageinit.current + 1;
                }else if(pageinit.current >4 && pageinit.current > pageinit.pageNum-5){
                    var start  = pageinit.pageNum - 4,end = pageinit.pageNum;
                }else{
                    var start = 1,end = 9;
                }
                 */
                for (;start <= end;start++) {
                    if (start <= pageinit.pageNum && start >=1) {
                        if (start == pageinit.current) {
                            obj.append('<span class="current">'+ start +'</span>');
                        } else if(start == pageinit.current+1){
                            obj.append('<a href="javascript:;" class="zxfPagenum nextpage">'+ start +'</a>');
                        }else{
                            obj.append('<a href="javascript:;" class="zxfPagenum">'+ start +'</a>');
                        }
                    }
                }
                if (end < pageinit.pageNum) {
                    obj.append('<span>...</span>');
                    obj.append('<a href="javascript:;" class="zxfPagenum">'+pageinit.pageNum+'</a>');
                }
                /*下一页*/
                if (pageinit.current >= pageinit.pageNum) {
                    obj.remove('.nextbtn');
                    obj.append('<span class="disabled">下一页</span>');
                } else{
                    obj.append('<a href="javascript:;" class="nextbtn">下一页</a>');
                }
                /*尾部*/
                obj.append('<span>'+'共'+'<b>'+pageinit.pageNum+'</b>'+'页，'+'</span>');
                obj.append('<span>'+'到第'+'<input type="number" class="zxfinput" value="'+ (Number(pageinit.pageNum)==Number(pageinit.current)?pageinit.current:Number(pageinit.current+1)) + '"/>'+'页'+'</span>');
                obj.append('<span class="zxfokbtn">'+'确定'+'</span>');
            }());
        },
        bindEvent:function(obj){
            return (function(){
                obj.on("click","a.prebtn",function(){
                    var cur = parseInt(obj.children("span.current").text());
                    var current = $.extend(_pageinit, {"current":cur-1});
                    zp.addhtml(obj,current);
                    if (typeof(_pageinit.backfun)=="function") {
                        _pageinit.backfun(current);
                    }
                });
                obj.on("click","a.zxfPagenum",function(){
                    var cur = parseInt($(this).text());
                    var current = $.extend(_pageinit, {"current":cur});
                    zp.addhtml(obj,current);
                    if (typeof(_pageinit.backfun)=="function") {
                        _pageinit.backfun(current);
                    }
                });
                obj.on("click","a.nextbtn",function(){
                    var cur = parseInt(obj.children("span.current").text());
                    var current = $.extend(_pageinit, {"current":cur+1});
                    zp.addhtml(obj,current);
                    if (typeof(_pageinit.backfun)=="function") {
                        _pageinit.backfun(current);
                    }
                });
                obj.on("click","span.zxfokbtn",function(){
                    var cur = parseInt($("input.zxfinput").val());
                    var current = $.extend(_pageinit, {"current":cur});
                    zp.addhtml(obj,{"current":cur,"pageNum":_pageinit.pageNum});
                    if (typeof(_pageinit.backfun)=="function") {
                        _pageinit.backfun(current);
                    }
                });
            }());
        }
    }
    $.fn.createPage = function(options){
        _pageinit = options;
        var pageinit = $.extend({
            pageNum : 20,
            current : 1,
            backfun : function(){}
        },options);
        zp.init(this,pageinit);
    }
    $.fn.bindEvent = function(options){
        var pageinit = $.extend({
            backfun : function(){}
        },_pageinit);
        zp.bindEvent(this,pageinit);
    }
}(jQuery));
