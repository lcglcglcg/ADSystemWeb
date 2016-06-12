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
		
		if(window.wmPic){
			/*************图片广告	开始*******************/
			/***男科120X240默认广告内容***/
			var nankeHTML = function(){
					var nanke='<div style="display: block;width:120px; height:240px;"><a target="_blank" href="http://jk.haomeit.com/renliu/?51etong.com" style="cursor: pointer;text-align: center;text-decoration: none;"><img width="120" height="240" src="<!--www-->/51etong.com/web/images/fuke.gif" style="border:none;"></a></div>';
					return nanke;
				}
			/***妇科120X240默认广告内容***/
			,	fukeHTML=function(){
					var fuke='<div style="display: block;width:120px; height:240px;"><a target="_blank" href="http://jk.haomeit.com/qianliexian/?51etong.com" style="cursor: pointer;text-align: center;text-decoration: none;"><img width="120" height="240" src="<!--www-->/51etong.com/web/images/nanke.gif" style="border:none;"></a></div>';
					return fuke;
				}
				/***
					个性化展示图片广告处理方法
					JSON为封闭后的广告数据，可跟据自己的思路，对广告展显进行个性化处理
				***/
			,	picFn=function(json){
					//跟据广告唯一标识判断是否有广告
					if(!json['creativeId']){
						if(json.index==0){
							//如果排名第一的广告位为空，则展示默认男科广告数据
							json['dfHtml']=nankeHTML();
						}else{
							//如果排名第二的广告位为空，则展示默认男科广告数据
							json['dfHtml']=fukeHTML();
						}
					}
					/*********判断回调广告的类型**********/
					if(json.type==2){
						/***********实例化120X240广告层******************/
						var dom=m.pic({
							href:json.imgUrl_Url//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	dfHtml:json['dfHtml']//广告默认数据，不为空时展示
						,	imgSize:json.imgSize //图片尺寸
						});
						if(json.index==0){
							dom.show('',1).shake();//执行显示 默认靠左20PX Y轴居中显示
						}else if(json.index==1){
							/***************靠右显示的广告********************/
							dom.show({
								position:'fixed',
								isRight:true,
								isYCenter:true,
								xLenPx:20
							},2).shake();
						}
					}
				}
			;
			$G.wm({
				cabin:'TI2JV1EH40BR19,TI2OIHJ940BS28' 	//广告位标识
			,	style:'pic.www.51etong.com'//页面标识广告以哪种风格显示，便于日志数据分析
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
					if(n<1){//判断广告个数 如果为0表示 无广告
						//调用默认1广告
						picFn({index:0,type:2});
						//调用默认2广告
						picFn({index:1,type:2});
					}
				}
			});
			/*************图片广告	结束*******************/
		}
		
		if(window.wmTest){
			/*************文字广告	开始*******************/
			var textFn=function(json){
					//跟据广告唯一标识判断是否有广告
					if(!json['creativeId'] || !json['cabin']){
						return ;
					}
					/*********判断回调广告的类型**********/
					if(json.type==1){
						/***********实例化120X240广告层******************/
						var dom=m.text(json);
						dom.long();
					}
				}
			;
			$G.wm({
				cabin:'TL23QGP040BS2H,TL2OV71040BS2M,TL291GRE40BS20' 	//广告位标识
			,	style:'test.www.51etong.com'//页面标识广告以哪种风格显示，便于日志数据分析
			,	fn:function(d){
					/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
					/*	
						cabin:广告标识
						type:广告类型
						index:索引
					*/
					var isAdxShow=function(){
							var fn=false;
							if(window.adxShow){
								if($G.isFun(window.adxShow)){
									return window.adxShow;
								}
							}
							return fn;
						}()
					,	list=new Array()
					;
					this.eachFn=function(json){
						if(isAdxShow===false){
							textFn(json);
						}else{
							list.push({
								uesrUrl:json.userPic
							,	webIM:json.webIM_Url
							,	json:json
							});
							if(json.index==2){
								isAdxShow(list,'text');
							}
						}
						
					};
				}
			});
			/*************文字广告	结束*******************/
		}
	};
	/******************************************************************
	公共类初始化结束后执行方法	结束
	*******************************************************************/
	
	//执行无限加载公共类 必须在回调方法之下，请注意执行顺序
	getjs({url:'http://static.adx.haomeit.com/js/Glacier.js'});
	//执行无限加载百度统计 必须在回调方法之下，请注意执行顺序
	/*var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
	getjs({url:_bdhmProtocol + "hm.baidu.com/h.js%3F293e5e98d8644340715a0d862e7d1711"});*/
})();