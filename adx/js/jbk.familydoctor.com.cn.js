var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?a52afdc0e4650bfbe585e84145e9118e";
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
	var loadFn=function(fn,where){
		var cfn=function(){
				if(where()){
					clearInterval(t);
					fn&&fn();
				}
			}
		,	t = setInterval(cfn, 0)
		;
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
			
			
			$G.Config.www='http://jtys.haomeit.com:7101';
			$G.Config.wwwImg='http://jtys.haomeit.com/getPic/';
			var m=$G.model
			,	wwwUrl=(window.location+'').toLowerCase()
			,	isDoc=wwwUrl.indexOf('/doctors/')<0?true:false
			,	ids=$G('div:glacier:true')
			,	picIds=''
			,	strIds=''
			,	getParamId=function(){
					var str=wwwUrl.match(/info\d*/ig);
					if($G.isArray(str)===false){
						str=wwwUrl.match(/zz\d*/ig);
					}
					if($G.isArray(str)===false){
						str=wwwUrl.match(/jbk\/\d*/ig);
						if($G.isArray(str)===false){
						}else{
							str[0]=str[0].replace('jbk/','info');
						}
					}
					if($G.isArray(str)===false){
						str=(wwwUrl.match(/category_\d*/ig)[0]);
					}
					if($G.isArray(str))str=str[0];
					return str;
				}()
			;
			
			ids.Each(function(){
				var obj=$G(this)
				,	name=obj.getAtt('name')
				,	isLong=(name+'').substr(0,1)
				;
				//this.innerHTML='';
				//广告位标识
				if(isLong=='T'){
					strIds+=','+name;
				}else{
					picIds+=','+name;
				}
			});
			strIds=strIds.replace(',','');
			picIds=picIds.replace(',','');
			
			var codeBaiduId={};
			codeBaiduId['A2FE0F178F62FAD73E050A8C0057755FD']='#slideoutu1806838_0';
			codeBaiduId['A2FE0F178F630AD73E050A8C0057755FD']='#BAIDU_DSPUI_FLOWBAR';
			codeBaiduId['A2FE0F178F634AD73E050A8C0057755FD']='iframe';
			var displayBaidu=function(code){
				try{
					if(!codeBaiduId[code])return;
					if(codeBaiduId[code]=='iframe'){
						loadFn(function(){
								$G.log('OK');
							},function(){
							var ifrDom=$G(codeBaiduId[code])
							,	isTrue=false
							;
							ifrDom.Each(function(){
								if((this.src+'').indexOf('entry.baidu.com')<0){
								}else{
									isTrue=true;
									this.style.display='none';
									this.style.visibility='hidden';
									this.parentNode.removeChild(this)
								}
							});
							return isTrue;
						});
						
					}else{
						$G(codeBaiduId[code]).Each(function(){
							this.style.display='none';
							this.style.visibility='hidden';
						});
					}
				}catch(e){
					return;
				}
			};
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
				if(!json['creativeId']){// A2FE0F178F62FAD73E050A8C0057755FD   json.pdb_deliv.deliv_des._html.content
					return;				//A2FE0F178F630AD73E050A8C0057755FD	  
				}
				json.cabin=json.placeId;
				json.imgUrl=$G.Config.wmReplace(json.imgUrl,'<!--www-->',$G.Config.wwwStatic);
				var dom=m.pic({
					href:json.href//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:json.imgSize //图片尺寸
				,	cabin:json.cabin
				});
				/*********判断回调广告的类型**********/
				if(json.type==2){
					displayBaidu(json.cabin);
					if(json.cabin=='A2FE0F178F633AD73E050A8C0057755FD'
					|| json.cabin=='A2FE0F178F634AD73E050A8C0057755FD'){
						var	wsize=$G.windowSize()
						,	xScroll=wsize.sw
						,	yScroll=wsize.sh
						,	size=xScroll+"X"+(xScroll/4)
						;
						if(json.cabin=='A2FE0F178F634AD73E050A8C0057755FD'){
							size=xScroll+"X"+(xScroll/5.8);
						}
						dom=m.pic({
							href:json.href//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:size
						,	cabin:json.cabin
						});
					}
					
					var dfhtml='<a href="<!--href-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><img style=" float:left; " width="<!--w-->" height="<!--h-->" src="<!--imgUrl-->" ></a>';
					dfhtml=$G.Config.wmReplace(dfhtml,'<!--href-->',json.href);
					
					if(json.cabin=='A2FE0F178F62CAD73E050A8C0057755FD'){
						dom.show({
							position:'fixed',
							isYCenter:true,
							isLeft:true
						});
					}else if(json.cabin=='A2FE0F178F62FAD73E050A8C0057755FD'){
						dom.show({
							position:'fixed',
							isYCenter:true,
							isRight:true
						});
					}else if(json.cabin=='A2FE0F178F630AD73E050A8C0057755FD'){
						dom.show({
							position:'fixed',
							isXCenter:true,
							isBottom:true
						});
					}else if(json.cabin=='A2FE0F178F632AD73E050A8C0057755FD'){
						dom.show({
							position:'fixed',
							isYCenter:true,
							isRight:true
						});
					}else if(json.cabin=='A2FE0F178F634AD73E050A8C0057755FD'){
						dom.show({
							position:'fixed',
							isXCenter:true,
							isBottom:true
						});
					}else
						dom.echo(dfhtml,function(o,s){
							loadFn(function(){
								try{
									var obj=$G('.'+json.cabin)
									;
									obj.html(s);
									obj.show();
								}catch(e){
								}
								
							},function(){
								var obj=$G('.'+json.cabin)
								;
								$G.log('查找广告位标识:'+json.cabin);
								if(obj.length>0){
									return true;
								}else
									return false;
							});
						});
				}
			};
			
			var getPic=function(){
				$G.wm({
					cabin:picIds 	//广告位标识
				,	id:getParamId
				,	addParam:{
						ip_addr:$G.getid('ip')||''
				}
				,	style:'pic.jbk.familydoctor.com.cn'//页面标识广告以哪种风格显示，便于日志数据分析
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
				,	callbackEach:function(n,arr){
						$G('#icon_0').none();
					}
				});
			}();
			
			var	TextFn=function(json){
				//跟据广告唯一标识判断是否有广告
				if(!json['creativeId']){
					return;
				}
				
				var dfHtml='';
				imgUrl='<!--www-->images/jbk.familydoctor.com.cn/TL2FE0F178F631AD73E050A8C0057755FD.jpg'
				
				if(json.type==1){
					if(!$G.isNaN(json.img_path)){
						imgUrl=$G.Trim('http://'+(json.img_path.replace((new RegExp('http://','ig')),'')));
					}
					dfHtml=['<div style="border:1px solid #d2d2d2; width:668px; height:168px; padding:10px 10px 0; overflow:hidden;"> <a href="" style="float:left;"><img src="'+imgUrl+'" height="158" width="158" /></a>',
					'  <dl style="width:495px; float:right; margin:0;">',
					'    <dt style="height:30px; line-height:30px; width:495px; margin:0; overflow:hidden;"><a href="<!--href-->" style=" font-size:16px; color:#333;text-decoration:none;"><!--title--></a></dt>',
					'    <dd style="font-size:14px; color:#999; line-height:26px; margin:10px 0 0;"> ',
					'      <p style="margin:0;"><!--description1--><a href="<!--href-->" style="color:#9C3">[详细]</a></p>',
					'    </dd>',
					'  </dl>',
					'</div>'].join("");
					json.description1=json.description1.replace(/\n/ig,'<br>');
					json.description1=json.description1.replace(/\//ig,'');
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--href-->',json.href);
					
					var dom=m.text(json)
					;
					dom.set(dfHtml).show();
				}
			};
			var getText=function(){
				$G.wm({
					cabin:strIds	//广告位标识
				,	id:getParamId
				,	addParam:{
						ip_addr:$G.getid('ip')||''
				}
				,	style:'test.jbk.familydoctor.com.cn'//页面标识广告以哪种风格显示，便于日志数据分析
				,	ele:1//广告类型 1：文字广告	2：图片广告 默认1
				,	device:$G.mobile?1:0
				,	fn:function(d){
						/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
						/*	
							cabin:广告标识
							type:广告类型
							index:索引
						*/
						this.eachFn=TextFn;
					}
					//回调结束 无广告时也执行
				,	callbackEach:function(n){
						/*if(n<1)
						$G.Each(function(){
							TextFn({
								cabin:this+''
							,	"region": "1001500000"
							,	"displayUrl": "www.baidu.com"
							,	"num": "1"
							,	"placeId":this+''
							,	"title": "title"
							,	"webIM": "http:\/\/dht.zoosnet.net\/LR\/Chatpre.aspx?id=DHT55760565&e=39yyk&r=39yyk&p=39yyk"
							,	"creativeId": "182722"
							,	"description1": "description1"
							,	"destinationUrl": "http:\/\/www.baidu.com"
							,	"mobile_destination_url": "http:\/\/wapwww.baidu.com"
							,	"mobile_display_url": "wapwww.baidu.com"
							,	"img_path": "pimg.39.net\/\/PictureLib\/A\/f4\/c3\/20160214\/m\/621248.jpg"
							,	"act": "7751"
							,	type:1
							});
						},strIds.split(','));*/
					}
				});
			}();
			
			/************************结束*********************************/
			
		}
		
		
	});
})();
