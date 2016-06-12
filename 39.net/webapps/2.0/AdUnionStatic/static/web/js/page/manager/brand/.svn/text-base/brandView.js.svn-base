/*
 * 查看拒绝原因和创意
 * */

//查看拒绝原因的弹出层
var viewRefuse = function() {
	var preview = $G('#brand_view_refuse'), adiv = window.alertDiv({
		findObj : '#brand_view_refuse',
		position : 'absolute',
		move : $G('div:title', preview[0])
	});
	return {
		show : function(fn) {
			fn && fn.call(preview[0], adiv);
			adiv.show();
		},
		none : adiv.close
	}
}();

//查看创意的弹出层
var viewCreative = function() {
	var preview = $G('#order_view_creative'), adiv = window.alertDiv({
		findObj : '#order_view_creative',
		position : 'absolute',
		move : $G('div:title', preview[0])
	});
	return {
		show : function(fn) {
			fn && fn.call(preview[0], adiv);
			adiv.show();
		},
		none : adiv.close
	}
}();

function viewReason(brandId) {// 查看原因
	
	var aElement = $("#brandList a[value='" + brandId + "']"),
		reason = aElement.attr("reason"),
		decider = aElement.attr("decider"),
		updateTime = aElement.attr("updateTime");
		
	// 依次是拒绝理由，审核人，审核时间
	$("#brand_view_refuse ul").eq(0).find("li").eq(1).html(reason);
	$("#brand_view_refuse ul").eq(1).find("li").eq(1).html(decider);
	$("#brand_view_refuse ul").eq(2).find("li").eq(1).html(updateTime);
	
	viewRefuse.show();
}

function viewBrand(brandId) {// 查看创意
	var order_view = $("#order_view_creative"),
		focus = order_view.find("img[name = 'focus']"),
		title = order_view.find("a[name = 'title']"),
		description = order_view.find("dd[name = 'description']"),
		phone = order_view.find("span[name = 'phone']"),
		url = order_view.find("a[name = 'url']"),
		imgs = order_view.find("div[name = 'imgs']"),
		web_im = order_view.find("a[name = 'WEB_IM']");
		
	window.ajax({
		path: "GET_BRAND_CREATIVE",
		data: {
			BRAND_ID_TYPE: 2,
			BRAND_ID: brandId,
			STATUS: 100,
			SORT_TYPE: 1,
			SORT_COLUMN: 1,
			PAGE_COUNT: 20,
			PAGE_INDEX: 1
		},
		calback: function(JSON) {
			
			if(!window.wm.msg(JSON.CODE,false)) return ;
			
			if (!JSON.LIST.length) {
				alert("创意未设置！");
				return false;
			}
			
			JSON.LIST = JSON.LIST[0];
			
			title.text(JSON.LIST.TITLE).attr("href", JSON.LIST.DESTINATION_URL);
			description.html(JSON.LIST.DESCRIPTION + '...<a target="_blank" href = "' + JSON.LIST.DESTINATION_URL + '">更多</a>');
			phone.text(JSON.LIST.TELEPHONE);
			url.text(JSON.LIST.WEB_SITE).attr("href", JSON.LIST.WEB_SITE);
			
			if ($.trim(JSON.LIST.WEB_IM).length) {
				web_im.show();
				web_im.attr("href", JSON.LIST.WEB_IM);
			} else {
				web_im.hide();
			}
			
			focus.attr("src", "/getPic" + JSON.LIST.BRAND_CREATIVE[0].IMG_PATH).parent().attr("href", JSON.LIST.BRAND_CREATIVE[0].IMG_URL);
			
			imgs.find("a").each(function(i) {
				$(this).attr("href", JSON.LIST.BRAND_CREATIVE[(i + 1)].IMG_URL);
				$(this).find("img").attr("src", "/getPic" + JSON.LIST.BRAND_CREATIVE[(i + 1)].IMG_PATH);
			});
	
			viewCreative.show();
			}
	});
	
};

	// 两个关闭按钮的事件
$(function() {
	$("#idBtn_close").click(function() {
		viewRefuse.none();
	});
	$("#order_view_creative input[name='close_bnt']").click(function() {
		viewCreative.none();
	});
});