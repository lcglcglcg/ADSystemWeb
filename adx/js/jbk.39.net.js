window.$G=window.$G||{wm:function(){},Version:0};
(function(){
	/******************************************************************
	无阻加载JS	开始
	*******************************************************************/
	var getscript=function(s){
			var script
			,	head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
			return {
					send: function( ) {
						script = document.createElement( "script" );
						script.async = "async";
						script.charset = s.scriptCharset||'UTF-8';
						if(script.readyState){
							script.onreadystatechange = function() {
								if (/loaded|complete/.test(script.readyState)) {
									script = script.onreadystatechange = null;
									try{
										if ( head && script.parentNode ) {
											head.removeChild( script );
										}
									} catch (e) {}
									s.callback  && s.callback();
								}
							};
						}else{
							script.onload = function(){
								script.onload = null;
								s.callback  && s.callback();
							}; 
						}
						
						if(s.cache)
							s.url = s.url + ( /\?/.test( s.url ) ? "&" : "?" ) + "notcache=" + new Date().getTime();
						script.src = s.url;
						head.insertBefore( script, head.firstChild );
					},
					abort: function() {
						if ( script ) {
							if(script.readyState){
								script.onreadystatechange=null;
							}else{
								script.onload=null;
							}
						}
					}
				};
		}
	,	getjs=function(o){
			o=o||{};
			var stime=function(){
				st&&clearTimeout(st);
				o.callback && o.callback();
			},	scp=getscript({
				 url:o.url,
				 callback:stime,
				 scriptCharset:o.charset,
				 cache:o.cache
				 })
			,	st=setTimeout(scp.abort,(o.time||15*1000))
			;
			
			scp.send();
		
	};
	/******************************************************************
	无阻加载JS	结束
	*******************************************************************/
	
	
	/******************************************************************
	公共类初始化结束后执行方法	开始
	*******************************************************************/
	/*var fn=function(){
	};
	if(window.wmConfig)fn=window.wmConfig;
	window.wmConfig=function(){
		fn&&fn();
	};*/
	/******************************************************************
	公共类初始化结束后执行方法	结束
	*******************************************************************/
	//执行无限加载公共类 必须在回调方法之下，请注意执行顺序
	getjs({
		url:'http://static.adx.haomeit.com/js/Glacier.js'
	,	callback:function(){
			/******************************************************
				var m=$G.model 广告展示方式公用类
				m.pic120X240	120X240浮动层展示
			*******************************************************/
			var m=$G.model
			;
			
			
			/*******************************
			code提示码说明
				001:'广告位标识无效'
			,	002:'param参数无效'
			,	003:'广告展现逻辑无效'
			,	004:'无人投放广告'
			,	005:'重复调用'
			*******************************/
			/***
				个性化展示图片广告处理方法
				JSON为封闭后的广告数据，可跟据自己的思路，对广告展显进行个性化处理
			***/
			var	picFn=function(json){
					//跟据广告唯一标识判断是否有广告
					if(!json['creativeId']){
						return;
					}
					/*********判断回调广告的类型**********/
					if(json.type==2){
						/***********实例化120X240广告层******************/
						var dom=m.pic({
							href:json.imgUrl_Url//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:json.imgSize //图片尺寸
						,	cabin:json.cabin
						});
						//dom.echo();
						
						dom.show({
							position:'fixed',
							isLeft:true,
							isYCenter:true
						});
					}
				}
			;
			
			var getPic=function(){
				$G.wm({
					cabin:'TI2R1K4C4KLN2B' 	//广告位标识
				,	style:'pic.jbk.39.net'//页面标识广告以哪种风格显示，便于日志数据分析
				,	ele:2//广告类型 1：文字广告	2：图片广告 默认1
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
				,	callbackEach:function(n){}
				});
			};
			
			var textFn=function(json){
					//跟据广告唯一标识判断是否有广告
					if(!json['creativeId'] || !json['cabin']){
						return ;
					}
					/*********判断回调广告的类型**********/
					if(json.type==1){
						var dom=m.text(json);
						dom.show();
					}
			};
			var getText=function(){
				$G.wm({
					cabin:'TS2MJD5J4KLOGL,TS1SM97E4KLOLD,TS1U67LF4KLO36,TS28L0S54KLO41,TS2OBRD04KLOJ6,TS2SQCND4KLOK4,TS2639864KLOT8' 	//广告位标识
				,	style:'jbk.text.39.net'//页面标识广告以哪种风格显示，便于日志数据分析
				,	fn:function(d){
						/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
						/*	
							cabin:广告标识
							type:广告类型
							index:索引
						*/
						this.eachFn=textFn;
					}
				,	callbackEach:function(n){
					}
				});
			};
			/*************M版广告	开始*******************/
			
			var mFn=function(json){
				//$G.log(JSON.stringify(json));
				//跟据广告唯一标识判断是否有广告
				if(!json['creativeId']){
					return;
				}
				/*********判断回调广告的类型**********/
				if(json.type==2){
					/***********实例化120X240广告层******************/
					var dom=m.pic({
						href:json.webIM_Url//广告目标网址
					,	src:json.imgUrl//广告图片SRC
					,	imgSize:"100%Xauto" //图片尺寸
					,	cabin:json.cabin
					});
					dom.echo();
					
					var dom=$G('.'+json.cabin)
					,	a=$G('a',dom[0])
					;
					a.setAtt('class','flexbox');
					a.setAtt('style','padding:0;border:none; text-decoration:none; cursor:pointer;');

					/*var dom=m.pic({
						href:json.webIM_Url//广告目标网址
					,	src:json.imgUrl//广告图片SRC
					,	imgSize:"100%Xauto" //图片尺寸
					,	cabin:'TI292KT44KLOD2'
					});
					dom.echo();
					
					var dom=$G('.TI292KT44KLOD2')
					,	a=$G('a',dom[0])
					;
					a.setAtt('class','flexbox');
					a.setAtt('style','padding:0;border:none; text-decoration:none; cursor:pointer;');

					if(json.index==0){
						dom.echo();
					}else{
						dom.show({
							position:'fixed',
							isLeft:true,
							isBottom:true
						});
					}*/
				}
			};
			
			var getMpic=function(){
				$G.wm({
					cabin:'TI2CB95J4KLO5K,TI292KT44KLOD2' 	//广告位标识
				,	style:'jm.bk.39.net'//页面标识广告以哪种风格显示，便于日志数据分析
				,	ele:2//广告类型 1：文字广告	2：图片广告 默认1
				//,	dept:1003000000
				//,	trust:3690
				,	fn:function(d){
						/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
						/*	
							cabin:广告标识
							type:广告类型
							index:索引
						*/
						this.eachFn=mFn;
					}
					//回调结束 无广告时也执行
				,	callbackEach:function(n){}
				});
			};
			/*************M版广告	结束*******************/
			
			if($G.mobile){
				getMpic();
			}else{
				getText();
				getPic();
			}
		}
		
		
	});
})();