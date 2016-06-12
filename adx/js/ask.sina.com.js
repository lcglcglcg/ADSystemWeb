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
	/*window.wmConfig=function(){
		
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
			/***
				个性化展示图片广告处理方法
				JSON为封闭后的广告数据，可跟据自己的思路，对广告展显进行个性化处理
			***/
			var	picFn=function(json){
					//跟据广告唯一标识判断是否有广告
					
					
					//$G.log(JSON.stringify(json));
					//$G.log(jss['creativeId']);
					if(!json['creativeId']){
						return;
					}
					/*********判断回调广告的类型**********/
					if(json.type==2){
						/***********实例化120X240广告层******************/
						var dom=m.pic({
							href:json.webIM_Url//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:json.imgSize //图片尺寸
						,	cabin:json.cabin
						});
						dom.echo();
						if(json.imgSize=='120X240'){
							var dom=m.pic({
								href:json.webIM_Url//广告目标网址
							,	src:json.imgUrl//广告图片SRC
							,	imgSize:json.imgSize //图片尺寸
							,	cabin:'TI2H6EFD3MVC18'
							});
							dom.echo();
						}
					}
				}
			;
			var picFnM=function(json){
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
						var dom=m.pic({
							href:json.webIM_Url//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:"100%Xauto" //图片尺寸
						,	cabin:'TI2MP2V34MVC19'
						});
						dom.echo();
						/*if(json.index==0){
							dom.echo();
						}else{
							dom.show({
								position:'fixed',
								isLeft:true,
								isBottom:true
							});
						}*/
					}
				}
			;
			var sinaFn=function(cid){
				$G.wm({
					cabin:cid 	//广告位标识
				,	trust:3690
				,	dept:1003000000
				,	style:$G.mobile?'ask.m.sina.com':'ask.sina.com'//页面标识广告以哪种风格显示，便于日志数据分析
				,	ele:2//广告类型 1：文字广告	2：图片广告 默认1
				,	fn:function(d){
						/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
						/*	
							cabin:广告标识
							type:广告类型
							index:索引
						*/
						this.eachFn=$G.mobile?picFnM:picFn;
					}
					//回调结束 无广告时也执行
				,	callbackEach:function(n){
						/*if(n<3)$("#_picdiv_3").hide();
						if(n<2)$("#_picdiv_2").hide();
						if(n<1)$("#_picdiv_1").hide();
						$G('.HAOMEITList_CPC').Each(function(){
							if(n>0){
								this.style.display='';
							}else
								this.style.display='none';
						});*/
					}
				});
			};
			var cid='TI269KON4MVCP2,TI2K36K14MVC15,TI2L10D64MVC1B';
			if($G.mobile){
				//TI2L10D64MVC1B
				sinaFn('TI2D974Q4MVC1A');
			}else{
				sinaFn('TI269KON4MVCP2');
				sinaFn('TI2K36K14MVC15');
				sinaFn('TI2L10D64MVC1B');
			}
			
			
		}
	});
	
})();