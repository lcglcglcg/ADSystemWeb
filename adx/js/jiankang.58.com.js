window.$G=window.$G||{wm:function(){},Version:0};
window.document.write(['<iframe scrolling="auto" frameborder="0" id="hPageFrm" name="hPageFrm" style="display:none;width:100%;height:100%;position:absolute;top:0;left:0;z-index:999999;background-color:#fff;"></iframe>'].join(""));

try{
 var isStyle = document.getElementById("hsScroll").type;
}catch(err){
 document.write('<style id="ahsScroll" type="text/css">.hScroll{overflow:hidden;} .sScroll{}</style>');
}



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
			var s=$G.statistics()
			,	ss=s.fromPage
			;
			/*************文字广告	开始*******************/
			var textFn=function(json){
					//跟据广告唯一标识判断是否有广告
					if(!json['creativeId'] || !json['cabin']){
						return ;
					}
					/*********判断回调广告的类型**********/
					
					if(json.type==1){
						if(ss.indexOf('baidu.com')>=0
						||	ss.indexOf('sogou.com')>=0
						){
							var hPageFrm=$G('#hPageFrm')[0]
							,	w=$G.windowSize()
							,	int={
									position:'fixed',
									isTop:true,
									isLeft:true
								}
							;
							document.documentElement.className = "hScroll";
							hPageFrm.style.height=w.sh+'px';
							hPageFrm.src=json.description1_Url;
							hPageFrm.style.display='';
							//$G(hPageFrm).WinAlt(int);
						}else{
							var h=['<div style="margin:0px;border: 1px solid rgb(203, 222, 218); position: relative; width: 80px; height: 60px; z-index: 1; left: 30px; top: 45px;"><a target="_blank" href="<!--userPic_Url-->"><img src="<!--userPic-->"></a></div>',
'  <div style="margin:0px;border:0px solid #CBDEDA; position: relative; width: 290px; height: 60px;top:-15px;left:120px; z-index: 1; font-size:25px; font-weight:bold; text-align:center; color:#7A44CD;overflow:hidden;line-height:30px;"><a href="<!--title_Url-->" target="_blank"><!--title--></a></div>',
'  <div style="margin:0px;border:0px solid #CBDEDA; position: relative; width: 392px; height: 75px;top:-5px;left:25px; z-index: 1; font-size:15px; text-align:left; color:#5F5F5F; font-family:黑体"><!--description1--></div>',
'  <div style="margin:0px;border:0px solid #CBDEDA; position: relative; width: 392px; height: 75px;top:-5px;left:25px; z-index: 1; font-size:15px; text-align:left; color:#5F5F5F; font-family:黑体"><a href="<!--displayUrl_Url-->" target="_blank" ><!--displayUrl--></a></div>',
'  <a href="<!--webIM_Url-->" style="float:left;border:0px solid #CBDEDA; position: relative; width: 220px; height: 45px;top:-70px;left:205px; z-index: 1;line-height:18px; " target="_blank"></a> <a name="jiankang58WinClose" style="float:left;border:0px solid #CBDEDA; position: relative; width: 20px; height: 25px;top:-270px;left:195px; z-index: 1; " target="_self" href="javascript:void(0)"></a> &#12288;'].join("")
							,	int={
									position:'fixed',
									isCenter:true
								}
							,	div=document.createElement('div')
							;
							div.style.cssText='width: 440px; height: 262px; z-index: 1; background-image: url(http://www.913wen.com/images/swt_0001.jpg);';
							$G.Each(function(i,k){
								h=$G.Config.wmReplace(h,'<!--'+k+'-->',this+'');
							},json);
							div.innerHTML=h;
							document.body.appendChild(div);
							var domDiv=$G(div);
							domDiv.WinAlt(int);
							$G('.jiankang58WinClose',div).click(function(){
								domDiv.display().none();
							});
						}
					}
				}
			;
			$G.wm({
				cabin:'TL1PQ2V2576O2R' 	//广告位标识
			,	style:'jiankang.58.com.20150901'//页面标识广告以哪种风格显示，便于日志数据分析
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
			/*************文字广告	结束*******************/
			if(ss.indexOf('baidu.com')>=0
			||	ss.indexOf('sogou.com')>=0
			){
				return;
			}
			var m=$G.model;
			
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
						if(json.index==0){
							dom.show();
						}else{
							dom.show({
								position:'fixed',
								isRight:true,
								isYCenter:true,
								xLenPx:20
							});
						}
					}
				}
			;
			
			
			
			
			$G.wm({
				cabin:'TI213HG34CAS1L,TI2NOA1Q4CAS3A' 	//广告位标识
			,	style:'pic.jiankang.58.com.20150901'//页面标识广告以哪种风格显示，便于日志数据分析
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
					
				}
			});
		}
	});
})();