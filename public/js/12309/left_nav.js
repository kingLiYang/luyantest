$(function(){
	var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
	var SUPPORT_TOUCH = ('ontouchstart' in window);
	var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
	if (SUPPORT_ONLY_TOUCH) {
		$(".sidebar_ej li dl a").each(function(){
			if($(this).html()==""){
			$(this).parent().parent().hide();
			}
		});
		$(document).on("click touchstart", ".column .sidebar_ej li", function(){
			var Index = $(this).index();
			$(this).addClass("active").siblings().removeClass('on');
		})
		$(".column .sidebar_ej li dl dt").click(function(){
			var Index = $(this).index();
			$(this).addClass("on").siblings().removeClass('on');
		})
	} else {
		$(".sidebar_ej li dl a").each(function(){
			if($(this).html()==""){
			$(this).parent().parent().hide();
			}
		});
		$(document).on("mouseover", ".column .sidebar_ej li", function(){
		// $(".column .sidebar_ej li").mouseover(function(){
			var Index = $(this).index();
			$(this).addClass("active");
		})
		$(document).on("mouseout", ".column .sidebar_ej li", function(){
		// $(".column .sidebar_ej li").mouseout(function(){
			var Index = $(this).index();
			$(this).removeClass("active");
		})
		
		$(".column .sidebar_ej li dl dt").click(function(){
			var Index = $(this).index();
			$(this).addClass("on").siblings().removeClass('on');
			
		})
	}
});