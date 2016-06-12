var apply_ad = function() {
	var preview = $G('#apply_ad_new'), adiv = window.alertDiv({
		findObj : '#apply_ad_new',
		position : 'absolute',
		move : $G('div:scommon_title', preview[0])
	});
	return {
		show : function(fn) {
			fn && fn.call(preview[0], adiv);
			adiv.show();
		},
		none : adiv.close
	}
}();


$G("#addBrandBak").click(function() {
	$G("#addIframe")[0].setAttribute("src", "/brand/apply_ad.shtml");
	apply_ad.show();
});
