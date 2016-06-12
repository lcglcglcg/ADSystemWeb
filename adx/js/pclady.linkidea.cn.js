var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js%3Fd8d354c04d6f6a8fccb32ec4b20f3bc7' type='text/javascript'%3E%3C/script%3E"));
(function(){
	/******************************************************************
	无阻加载JS	开始
	*******************************************************************/
	var getscript=function(s){
		var script,
				head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
		return {
				send: function( ) {
					script = document.createElement( "script" );
					script.async = "async";
					if ( s.scriptCharset ) {
						script.charset = s.scriptCharset;
					}
					
					script.onload = script.onerror = script.onreadystatechange = function( _, isAbort) {
						if (!script.readyState || /loaded|complete/.test( script.readyState ) ) {
							script.onload = script.onreadystatechange = null;
							if ( head && script.parentNode ) {
								head.removeChild( script );
							}
							script = undefined;
							try{
								if ( isAbort ) {
									s.callback  && s.callback( 200, "abort" );
								}else
									s.callback  && s.callback();
							} catch (e) {s.callback  && s.callback();}
						}
					};
					if(s.cache)
						s.url = s.url + ( /\?/.test( s.url ) ? "&" : "?" ) + "notcache=" + new Date().getTime();
					script.src = s.url;
					head.insertBefore( script, head.firstChild );
				},
				abort: function() {
					if ( script ) {
						script.onload( 0, 1 );
					}
				}
			};
	};
	var getjs=function(o){
		o=o||{};
		var stime=function(a,b){
			if(b=='abort'){
			}else{
				clearTimeout(st);
			}
			o.callback && o.callback(a,b);
		},	scp=getscript({
			 url:o.url,
			 callback:stime,
			 scriptCharset:o.charset,
			 cache:o.cache
			 })
		,	st=setTimeout(scp.abort,(o.time||15))
		;
		scp.send();
		
	};
	/******************************************************************
	无阻加载JS	结束
	*******************************************************************/
	window.loadIng=function(){
		$G('#loading')[0].style.display='none';
		if($G.mobile){
			$G('#mobile')[0].style.display='';
		}else{
			$G('#pc')[0].style.display='';
		}
	};
	/******************************************************************
	公共类初始化结束后执行方法	开始
	*******************************************************************/
	window.wmConfig=function(){
		
		/******************************************************
			var m=$G.model 广告展示方式公用类
			m.pic120X240	120X240浮动层展示
		*******************************************************/
		var m=$G.model  
		,	NewLine = '\n'
		;
		
		
		/*******************************
		code提示码说明
			001:'广告位标识无效'
		,	002:'param参数无效'
		,	003:'广告展现逻辑无效'
		,	004:'无人投放广告'
		,	005:'重复调用'
		*******************************/
		/*************图片广告	开始*******************/
		/***
			个性化展示图片广告处理方法
			JSON为封闭后的广告数据，可跟据自己的思路，对广告展显进行个性化处理
		***/
		var isBilling=function(){
			if(top.window.location != window.location){
				return true;
			}
			var s=$G.statistics();
			if($G.isNaN(s.fromPage))return true;
			return false;
		}();
		var	picFn=function(json){
				json=json||{};
				//跟据广告唯一标识判断是否有广告
				if(!json['creativeId']){
					json.href=json.displayUrl_Url='http://58guahao.haomeit.com/url.aspx?dirname='+function(){
							var surl=((window.document.location+'').replace('http://'+window.document.location.hostname,'')).replace(/\//ig,'')
							,	surl=surl.split("?")
							,	surl=function(){
									if(surl.length>0){
										surl=surl[0];
									}
									return surl.split("#");
								}()
							;
							if(surl.length>0){
								surl=surl[0];
							}
							return surl;
						}()
					;
				}
				/*********判断回调广告的类型**********/
				var hPageFrm=$G.mobile?$G('#mPageFrm')[0]:$G('#hPageFrm')[0]
				,	url=isBilling?json.href:json.displayUrl_Url
				;
				$G('#mobileWebUrl')[0].href=isBilling?json.webImHref:json.webIM_Url;
				if($G.mobile)
					window.document.location=url;
				else{
					hPageFrm.onload=function(){
						window.loadIng();
					};
					hPageFrm.src=url;
				}
				var wsize=$G.windowSize();
				hPageFrm.style.height=wsize.sh+'px';
			}
		;
		$G.wm({
			cabin:'TL2M3J1O3EFF27' 	//广告位标识
		,	style:'text.pclady.linkidea.cn'//页面标识广告以哪种风格显示，便于日志数据分析
		//,	ele:2//广告类型 1：文字广告	2：图片广告 默认1
		,	dept:1013000000
		,	trust:3690
		,	fn:function(d){
				/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
				/*	
					cabin:广告标识
					type:广告类型
					index:索引
				*/
				this.eachFn=picFn;
			}
			//回调结束 无广告时也执行
		,	callbackEach:function(n){
				if(n<1){//判断广告个数 如果为0表示 无广告
					//调用默认1广告
					picFn();
				}
				
				var left_hid=$G('#left_hid')
				,	left_dis=$G('#left_dis')
				,	change_width=document.getElementById("change_width")
				;
				
				$G('.left').click(function(){
					if(left_hid[0].style.display=='none'){
						left_hid[0].style.display='';
						left_dis[0].style.display='none';
						change_width.className="c_right_new";
						
					}else{
						left_hid[0].style.display='none';
						left_dis[0].style.display='';
						change_width.className="c_right";
					}
				});
				window.setTimeout(window.loadIng,3000);
			}
		});
		/*************图片广告	结束*******************/
	};
	/******************************************************************
	公共类初始化结束后执行方法	结束
	*******************************************************************/
	//执行无限加载公共类 必须在回调方法之下，请注意执行顺序
	getjs({url:'http://static.adx.haomeit.com/js/Glacier.js'});
	//执行无限加载百度统计 必须在回调方法之下，请注意执行顺序
	/*var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
	getjs({url:_bdhmProtocol + "hm.baidu.com/h.js%3Fd8d354c04d6f6a8fccb32ec4b20f3bc7"});*/
})();