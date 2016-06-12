$(function() {
	// 绑定预览按钮
	$("#brandList").on("click", ".new_img", function() {
		var id = $(this).parent().parent().attr("id").slice(2);	// 获取 BRAND_ID
		
		window.ajax({
			path: "GET_BRAND_CREATIVE",
			data: {
				"MOD_STATUS": 1,
				"BRAND_ID": id
			},
			calback: function(JSON) {
				JSON.CODE = parseInt(JSON.CODE);
				if (JSON.CODE) {	// 	处理没有创意的情况
					window.wm.msg(JSON.CODE,false)
					return false;
				}
				
				// 此处声明变量的原因：1.可能以后需要校验 2.或许可以有更好的填充方式
				var TITLE = JSON.TITLE,
					BRAND_ID = JSON.BRAND_ID,
					DESCRIPTION = JSON.DESCRIPTION,
					DESTINATION_URL = JSON.DESTINATION_URL,
					TELEPHONE = JSON.TELEPHONE,
					WEB_SITE = JSON.WEB_SITE,
					BRAND_CREATIVE = JSON.BRAND_CREATIVE,
					WEB_IM = JSON.WEB_IM,
					GUAHAO_URL = JSON.GUAHAO_URL;
				
				// 下面开始填充数据（如果有可用的模板引擎，能方便许多）
				$("#view_create dt").html("<a href=" + DESTINATION_URL + " target='_blank'>" + TITLE + "</a>");
				$("#view_create dd").eq(0).html('创意描述：' + DESCRIPTION + '...<a target="_blank" href="'+ DESTINATION_URL +'">更多</a>');
				$("#view_create dd").eq(1).html('电话：' + '<span>' + TELEPHONE + '</span>');
				$("#view_create dd").eq(2).html('官网：<a target="_blank" href="' + WEB_SITE + '">' + WEB_SITE + '</a>');
				
				if (WEB_IM.length) {
					$("#new_fd .online_zx").show();
					$("#new_fd .online_zx").attr("href", WEB_IM);
				} else {
					$("#new_fd .online_zx").hide();
				}
				
				if (GUAHAO_URL.length) {
					$("#new_fd .appointment_gh").show();
					var val = null,
						GHHead = "http://58.guahao.com";
					// 挂号链接的转换
					if (GUAHAO_URL.indexOf("|") > 0)
					GUAHAO_URL = GUAHAO_URL.substring(GUAHAO_URL.indexOf("|") + 2, GUAHAO_URL.length);
					
					if(GUAHAO_URL) val= GHHead+'/department/'+GUAHAO_URL;
					else val= GHHead+'/hospital/'+GUAHAO_URL;

					$("#new_fd .appointment_gh").attr("href", val);
				} else {
					$("#new_fd .appointment_gh").hide();
				}
				
				$("#new_fd .set_cont_top .set_cont_top_img1").attr("src", window.wm.path.pic.url + BRAND_CREATIVE[0].IMG_PATH)
						.parent().attr("href", window.wm.path.pic.url + BRAND_CREATIVE[0].IMG_URL);
				
				$("#new_fd .set_cont_bottom img").each(function(i) {
					$(this).attr("src", window.wm.path.pic.url + BRAND_CREATIVE[(i + 1)].IMG_PATH)
							.parent().attr("href", window.wm.path.pic.url + BRAND_CREATIVE[(i + 1)].IMG_URL);
				});
				
				previewAlert.show();
			}
		});
		
	});
	
	// 声明预览弹出框
	previewAlert = function() {
		var preview = $G('#new_fd'), adiv = window.alertDiv({
			findObj : '#new_fd',
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
	// 绑定其中的关闭按钮
	$("#new_fd .scommon_title a").click(function() {
		previewAlert.none();
	});

});