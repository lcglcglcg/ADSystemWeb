$(document).ready(function() {
	var search = window.location.search,
		baseServer = "http://test.manager.wangmeng.haomeit.com/action/?";
	
	// 获取到从?开始后的字符后，判断是否是修改的页面
	if (search != null && search != undefined && $.trim(search) != "") {
		
		search = search.slice(4);	// 获取到id的值
		
		// 开始调整页面，使其成为修改页面
		$("#userIni").hide();	// 隐藏设置账户功能
		$("#allAddBrand").text("审核通过");	// 修改操作按钮
		$("#allAddBrand").attr("type", "1");	// 修改操作按钮
		$("#cancelBrand").parent().show();	// 修改操作按钮
	}
});
