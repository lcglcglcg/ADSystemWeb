var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?a2c28512d952975ffe338f26a0bb353d";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
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
			,	NewLine = '\n'
			,	wsize=$G.windowSize()
			,	xScroll=wsize.sw
			,	yScroll=wsize.sh
			;
			$G.Config.www='http://58.haomeit.com:7401';
			$G.Config.wwwImg='http://58.haomeit.com/getPic/';
			
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
			var rightframe=$G('#rightframe');
			if(rightframe.length>0&&1==2){
				rightframe=rightframe[0];
				var div=document.createElement('div');
				$G(div).setAtt('name','A3460DE12725FF417E050A8C0057751F2');
				rightframe.insertBefore(div,rightframe.firstChild);
				var div=document.createElement('div');
				$G(div).setAtt('name','A3460DE12725FF417E050A8C0057751F3');
				rightframe.appendChild(div);x
			}
			$G('.HAOMEITList_1').setAtt('name','A3460DE12725FF417E050A8C0057751F1');
			var	picFn=function(json){
					//跟据广告唯一标识判断是否有广告
					if(!json['creativeId']){
						return;
					}
					/*********判断回调广告的类型**********/
					if(!$G.mobile&&json.imgSize=='250X250'){
						/***********实例化120X240广告层******************/
						var dom=m.pic({
							href:json.webImHref+''//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:json.imgSize //图片尺寸
						,	cabin:json.placeId
						,	isClose:false
						});
						dom.echo();
					}else if(!$G.mobile&&json.imgSize=='120X200'){
						var dom=m.pic({
							href:json.webImHref+''//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:json.imgSize //图片尺寸
						,	cabin:'aaa'
						});
						dom.show({
							position:'fixed',
							isBottom:true,
							isLeft:true
						});
					}else if($G.mobile && json.imgSize=='640X100'){
						var dom=m.pic({
							href:json.webImHref+''//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:xScroll+"X"+(xScroll/6.4)
						,	cabin:'aaa'
						});
						dom.show({
							position:'fixed',
							isBottom:true,
							isLeft:true
						});
					}
				}
			;
			
			$G.wm({
				cabin:'A3460DE12725FF417E050A8C0057751F1,A3460DE12725FF417E050A8C0057751F2,A3460DE12725FF417E050A8C0057751F3,A3460DE12725FF417E050A8C0057751F4,A3460DE12725FF417E050A8C0057751F6' 	//广告位标识
			,	addParam:{
					disease_uri:window.haomeit_disease_code||''
				,	ip_addr:$G.getid('ip')||''
				}
			,	style:'pic.58.com'//页面标识广告以哪种风格显示，便于日志数据分析
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
			,	callbackEach:function(n){
	
					if(n<3)$("#_picdiv_3").hide();
					if(n<2)$("#_picdiv_2").hide();
					if(n<1)$("#_picdiv_1").hide();
					$G('.HAOMEITList_CPC').Each(function(){
						if(n>0){
							this.style.display='';
						}else
							this.style.display='none';
					});
				}
			});
			/*************图片广告	结束*******************/
			
			
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
			var	ppFn=function(json){
					//跟据广告唯一标识判断是否有广告
					if(!json['creative_id']){
						return;
					}
					/*********判断回调广告的类型**********/
					if(json.type==3){
						/***********实例化120X240广告层******************/
						json['cabin']='HAOMEITList';
						if($G.mobile){
							if($G('.TL2JD368366G3B').length>0)
								json['cabin']='TL2JD368366G3B';
							else if($G('.TS2GGGIIF40620').length>0){
								$G('#top_google').none();
								json['cabin']='TS2GGGIIF40620';
							}else if($G('div:msg_boxnobg').length>0){
								$G('div:msg_boxnobg').setAtt('name','TS2GGGIIF40620');
								json['cabin']='TS2GGGIIF40620';
							}
						}
						var dom=m.pp(json);
					}
				}
			;
			//
			$G.wm({
				cabin:'A3460DE12725FF417E050A8C0057751F5' 	//广告位标识
			,	addParam:{
					disease_uri:window.haomeit_disease_code||''
				,	ip_addr:$G.getid('ip')||''
				}
			,	style:'pp.58.com'//页面标识广告以哪种风格显示，便于日志数据分析
			,	ele:3//广告类型 1：文字广告	2：图片广告 3:固定广告 默认1
			,	fn:function(d){
					/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
					/*	
						cabin:广告标识
						type:广告类型
						index:索引
					*/
					this.eachFn=ppFn;
				}
				//回调结束 无广告时也执行
			,	callbackEach:function(n){
					
				}
			});
			/*************品牌广告	结束*******************/
		}
	});
})();