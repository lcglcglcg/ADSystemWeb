(function(){
	//document.writeln('<link rel="stylesheet" type="text/css" href="http://static.adx.haomeit.com/static/anhao.cn/web/css/anhao.css"/>');
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
	window.wmConfig_=function(){
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
		/***男科120X240默认广告内容***/
		var nankeHTML = function(){
				var nanke='<div style="width:120px; height:240px; overflow:hidden; font-family:微软雅黑; font-size:18px;"> <a href="http://jk.haomeit.com/niupixuan/?anhao.cn" style=" display:block;height:240px; width:60px; float:left; background:#4675ad;color:#fff; text-decoration:none; cursor:pointer;" target="_blank"><i style=" display:block;width:20px; margin:0 auto; line-height:22px; text-align:center; font-style:normal; padding-top:35px; cursor:pointer;">牛皮癣会传染吗</i></a><div style="width:59px; float:right; height:240px;"> <a href="http://jk.haomeit.com/xunmazhen/?anhao.cn" style="display:block; width:59px; height:120px; margin-bottom:1px; background:#349ca5;color:#fff; text-decoration:none; cursor:pointer;" target="_blank"><i style=" display:block;width:20px; margin:0 auto; font-size:13px;line-height:16px; text-align:center; font-style:normal; padding-top:2px; cursor:pointer;">荨麻疹能根治吗</i></a> <a href="http://jk.haomeit.com/dx/?anhao.cn" style="display:block; width:59px; height:119px; background:#57a535;color:#fff; text-decoration:none; cursor:pointer;" target="_blank"><i style=" display:block;width:20px; margin:0 auto;font-size:13px;line-height:16px; text-align:center; font-style:normal; padding-top:8px; cursor:pointer;">癫痫能治愈吗</i></a> </div></div>';
				return nanke;
			}
		/***妇科120X240默认广告内容***/
		,	fukeHTML=function(){
				var fuke='<div style="width:120px; height:240px; overflow:hidden; font-family:微软雅黑; font-size:21px;"> <a href="http://jk.haomeit.com/xiaoernt/?anhao.cn" style=" display:block;height:240px; width:60px; float:left; background:#a843a3;color:#fff; text-decoration:none;" target="_blank"><i style=" display:block;width:20px; margin:0 auto; line-height:22px; text-align:center; font-size:18px; font-style:normal; padding-top:45px; cursor:pointer;">脑瘫能治好吗</i></a><div style="width:59px; float:right; height:240px;"> <a href="http://jk.haomeit.com/guitouyan/?anhao.cn" style="display:block; width:59px; height:120px; margin-bottom:1px; background:#e25a8c;color:#fff; text-decoration:none;" target="_blank"><i style=" display:block;width:20px; margin:0 auto;font-size:13px;line-height:16px; text-align:center; font-style:normal; padding-top:8px; cursor:pointer;">龟头炎怎么治</i></a> <a href="http://jk.haomeit.com/meidu/?anhao.cn" style="display:block; width:59px; height:119px; background:#f87ac1;color:#fff; text-decoration:none;" target="_blank"><i style=" display:block;width:20px; margin:0 auto; font-size:13px;line-height:16px;text-align:center; font-style:normal; padding-top:8px; cursor:pointer;">梅毒能治愈吗</i></a> </div></div>';
				return fuke;
			}
		,	strHTML=function(){
				var style=document.createElement('style')
				,	uuid=$G.uuidFast().replace(/-/ig,'')
				,	css={}
				;
				css['a.m'+uuid]='color:#FFF;text-align: center;text-decoration: none;cursor:pointer;';
				css['a.m'+uuid+':hover']='background:#fff; color:#000;text-align: center;text-decoration: none;cursor:pointer;';
				m.setStyle(css);
				return '<div style="display:block;width:250px; height:250px; background:#fff;"> <span style=" display:block;background: #4792ff;height: 29px;width: 124px;position:absolute; top:0; left:0;"> <a class="m'+uuid+'" href="http://jk.haomeit.com/renliu/?anhao.cn" target="_blank" style=" display:block; width:120px; height:25px;line-height: 25px; text-align:center;margin:2px;font-size: 13px;">意外怀孕怎么办？</a> </span> <span style=" display:block;background: #4792ff;height: 29px;width: 124px;position:absolute; top:0; left:125px;"> <a class="m'+uuid+'" href="http://jk.haomeit.com/yangwei/?anhao.cn" target="_blank" style=" display:block; width:120px; height:25px;line-height: 25px; text-align:center;margin:2px;font-size: 15px;">男人阳痿怎么办？</a> </span> <span style=" display:block;background: #ad68d7;height:52px;width:249px;position:absolute;top:30px; left:0;"> <a class="m'+uuid+'" href="http://jk.haomeit.com/fukeyiy/?anhao.cn" name="style3" target="_blank" style=" display:block; width:245px; height:48px;line-height: 48px; text-align:center;margin:2px;font-size: 22px;">最好的妇科医院在哪儿？</a> </span> <span style=" display:block;background: #71cdc9;height: 51px;width: 124px;position:absolute;top:83px; left:0;"> <a class="m'+uuid+'" href="http://jk.haomeit.com/tongjing/?anhao.cn" name="style4" target="_blank" style=" display:block; width:120px; height:47px;line-height: 47px; text-align:center;margin:2px;font-size: 15px;">女性痛经怎么办？</a> </span> <span style=" display:block;background: #4792ff;height: 25px;width: 124px;position:absolute; top:83px; left:125px;"> <a class="m'+uuid+'" href="http://http://jk.haomeit.com/zaoxie/?anhao.cn" target="_blank" style=" display:block; width:120px; height:21px;line-height: 21px; text-align:center;margin:2px;font-size: 16px;">早泄怎么办？</a> </span> <span style=" display:block;background: #4792ff;height: 25px;width: 124px;position:absolute;top:109px; left:125px;"> <a class="m'+uuid+'" href="http://jk.haomeit.com/yunyu/?anhao.cn" target="_blank" style=" display:block; width:120px; height:21px;line-height: 21px; text-align:center;margin:2px;font-size: 15px;">不孕不育怎么办？</a> </span> <span style=" display:block;background: #ad68d7;height: 52px;width:249px;position:absolute;top:135px; left:0;"> <a class="m'+uuid+'" href="http://jk.haomeit.com/nanke/?anhao.cn" name="style3" target="_blank" style=" display:block; width:245px; height:48px;line-height: 48px; text-align:center;margin:2px;font-size: 22px;">最好的男科医院是哪家？</a> </span> <span style=" display:block;background: #71cdc9;height: 60px;width: 124px;position:absolute;top:188px; left:0;"> <a class="m'+uuid+'" href="http://jk.haomeit.com/qianliexian/?anhao.cn" name="style2" target="_blank" style=" display:block; width:120px; height:56px;line-height:56px; text-align:center;margin:2px;font-size: 15px;">前列腺炎怎么治？</a> </span> <span style=" display:block;background: #71cdc9;height: 60px;width: 124px;position:absolute; top:188px; left:125px;"> <a class="m'+uuid+'" href="http://jk.haomeit.com/baopigc/?anhao.cn" name="style2" target="_blank" style=" display:block; width:120px; height:56px;line-height:56px; text-align:center;margin:2px;font-size: 15px;">包皮过长怎么办？</a> </span> </div>';
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
					}else if(json.index==1){
						//如果排名第二的广告位为空，则展示默认男科广告数据
						json['dfHtml']=fukeHTML();
					}else if(json.index==2){
						//如果排名第二的广告位为空，则展示默认男科广告数据
						json['dfHtml']=strHTML();
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
						dom.show();//执行显示 默认靠左20PX Y轴居中显示
					}else if(json.index==1){
						/***************靠右显示的广告********************/
						dom.show({
							position:'fixed',
							isRight:true,
							isYCenter:true,
							xLenPx:20
						});
					}else if(json.index==2){
						return;
						dom.show({
							position:'fixed',
							isBottom:true,
							isRight:true,
							xLenPx:20
						}).shake();
					}
				}
			}
		;
		$G.wm({
			cabin:'TI1QVG9K4TQJ2T,TI2MK8T24TQJ3A,TI2JOVAT4TQJ3A' 	//广告位标识
		,	style:'pic.jbk.anhao.cn'//页面标识广告以哪种风格显示，便于日志数据分析
		,	ele:2//广告类型 1：文字广告	2：图片广告 默认1
		,	fn:function(d){
				/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
				/*	
					cabin:广告标识
					type:广告类型
					index:索引
				*/
				var dfList={};
				this.eachFn=function(json){
					if(json.num==2 && !json['creativeId'] && dfList[1]){
						json=dfList[1];
						json.num=2;
						json.index=1;
					}
					dfList[json.num]=json;
					picFn(json);
				};
			}
			//回调结束 无广告时也执行
		,	callbackEach:function(n){
				if(n<1){//判断广告个数 如果为0表示 无广告
					//调用默认1广告
					picFn({index:0,type:2});
					//调用默认2广告
					picFn({index:1,type:2});
					//调用默认3广告
					picFn({index:2,type:2,imgSize:'250X250'});
				}
			}
		});
		/*************图片广告	结束*******************/
		//return;
		/*************文字广告	开始*******************/
		var textFn=function(json){
				//跟据广告唯一标识判断是否有广告
				if(!json['creativeId'] || !json['cabin']){
					return ;
				}
				/*********判断回调广告的类型**********/
				if(json.type==1){
					
					var dom=m.text(json);
					dom.long();
				}
			}
		;
		$G.wm({
			cabin:'TL2CO1JE3BJT1P,TL2EI9N83BJT21,TL2F2LB03BJT2G' 	//广告位标识
		,	style:'test.jbk.anhao.cn'//页面标识广告以哪种风格显示，便于日志数据分析
		,	fn:function(d){
				/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
				/*	
					cabin:广告标识
					type:广告类型
					index:索引
				*/
				this.eachFn=textFn;
			}
		});
		/*************文字广告	结束*******************/
	};
	/******************************************************************
	公共类初始化结束后执行方法	结束
	*******************************************************************/
	
	//执行无限加载公共类 必须在回调方法之下，请注意执行顺序
	//getjs({url:'http://static.adx.haomeit.com/js/Glacier.js'});
	//执行无限加载百度统计 必须在回调方法之下，请注意执行顺序
	/*var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
	getjs({url:_bdhmProtocol + "hm.baidu.com/h.js%3F0efa1803af4e9f10b667c8fb450c4040"});*/
})();