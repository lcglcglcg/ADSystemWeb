window.$G=window.$G||{wm:function(){},Version:0};
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?fa56fc6f34d490f5363e6534eb6a5353";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
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
			$G('.keywords .Keywords').Each(function(){
				$G(this).setAtt('content','&nbsp;');
			});
			$G.statistics=function(){
				return {
					fromPage:'',
					toPage:$G.getid('url'),
					toPageTitle:'',
					//userAgent:navigator.userAgent,
					platform:'',
					browser:'',
					bVersion:'',
					ufcolor:'',
					screensize:'',
					language:'',
					timeZone:''
					};
			};
			
			var m=$G.model
			,	s=window.haomeit39netids||''
			;

			$G.Config.www='http://39.haomeit.com:7001';
			$G.Config.www='http://211.155.85.171:8001';
			$G.Config.wwwImg='http://39.haomeit.com/getPic/';
			var wwwUrl=window.location+'';
			var isDoc=wwwUrl.indexOf('/doctors/')<0?true:false;
			var dpDefHtml={};
			dpDefHtml['TI2D2GHA4T4HL1']={
				img:'<img src="http://static.adx.haomeit.com/static/images/yyk39/db/1.jpg" style=" float:left; " />'
			,	im:'http://kefu.kuaishang.cn/bs/im.htm?cas=34921___882373&fi=60423&sText=39jypc'
			};
			dpDefHtml['TI2D2GHA4T4HL2']={
				img:'<img src="http://static.adx.haomeit.com/static/images/yyk39/db/2.jpg" style=" float:left; " />'
			,	im:'http://dht.zoosnet.net/LR/Chatpre.aspx?id=DHT38499557&lng=cn&r=39JianKang&p=39JianKang'
			};
			dpDefHtml['TI2D2GHA4T4HL3']={
				img:'<img src="http://static.adx.haomeit.com/static/images/yyk39/db/3.jpg" style=" float:left; " />'
			,	im:'http://lkt.zoosnet.net/LR/Chatpre.aspx?id=LKT28293327&lng=cn&e=39jiankw&r=39jiankw&p=39jiankw'
			};
			dpDefHtml['TI2D2GHA4T4HL4']={
				img:'<img width="100%" src="http://static.adx.haomeit.com/static/images/yyk39/db/11.jpg" style=" float:left; " />'
			,	im:'http://kefu.kuaishang.cn/bs/im.htm?cas=34921___882373&fi=60423&sText=39jypc'
			};
			dpDefHtml['TI2D2GHA4T4HL5']={
				img:'<img width="100%" src="http://static.adx.haomeit.com/static/images/yyk39/db/12.jpg" style=" float:left; " />'
			,	im:'http://dht.zoosnet.net/LR/Chatpre.aspx?id=DHT38499557&lng=cn&r=39JianKang&p=39JianKang'
			};
			dpDefHtml['TI2D2GHA4T4HL6']={
				img:'<img width="100%" src="http://static.adx.haomeit.com/static/images/yyk39/db/13.jpg" style=" float:left; " />'
			,	im:'http://lkt.zoosnet.net/LR/Chatpre.aspx?id=LKT28293327&lng=cn&e=39jiankw&r=39jiankw&p=39jiankw'
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
				if(!json['creativeId']){
					return;
				}
				json.cabin=json.placeId;
				/*********判断回调广告的类型**********/
				if(json.type==2){
					/***********实例化120X240广告层******************/
					var dom=m.pic({
						href:json.imgUrl_Url//广告目标网址
					,	src:json.imgUrl//广告图片SRC
					,	imgSize:json.imgSize //图片尺寸
					,	cabin:json.cabin
					});
					
					if(json.placeId=='TI2D2GHA4T4HL1'||json.placeId=='TI2D2GHA4T4HL2'||json.placeId=='TI2D2GHA4T4HL3'
					|| json.placeId=='TI2D2GHA4T4HL4'||json.placeId=='TI2D2GHA4T4HL5'||json.placeId=='TI2D2GHA4T4HL6'
					){
						var dfhtml='<a href="<!--webImHref-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><img  width="<!--w-->" height="<!--h-->" src="<!--imgUrl-->" ></a>';
						if($G.mobile)dfhtml='<a href="<!--webImHref-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><img  style=" float:left; " width="100%" src="<!--imgUrl-->" ></a>';
						dfhtml=$G.Config.wmReplace(dfhtml,'<!--webImHref-->',json.webImHref);
						dom.echo(dfhtml);
						dpDefHtml[json.placeId]=false;
					}else{
						var dfhtml='<a href="<!--href-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><img  style=" float:left; " width="<!--w-->" height="<!--h-->" src="<!--imgUrl-->" ></a>';
						dfhtml=$G.Config.wmReplace(dfhtml,'<!--href-->',json.href);
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
								$G.log(json.cabin);
								if(obj.length>0){
									return true;
								}else
									return false;
							});
						});
					}
				}
			};
			
			var getPic=function(){
				var cbstr='TI1R0BC3569V1V,TI2LMSRN569V2A,TI2OJ65M4AGD2H';
				if(isDoc===false)cbstr='TI27RLLL569V1U,TI2OO2CB569V24,TI29QOPP4AGD2K';
				var wwwUrl=window.location+'';
				if(wwwUrl.indexOf('.html')<0){
					var dpHtml=''
					,	div=document.createElement('div')
					;
					if($G.mobile){
						cbstr+=',TI2D2GHA4T4HL4,TI2D2GHA4T4HL5,TI2D2GHA4T4HL6';
						dpHtml=['<a name="colse" style="position:absolute; right:0px; top:0px; z-index:999; border:none;"><img src="http://static.adx.haomeit.com/static/images/close.jpg" width="12" height="12" /></a><p name="TI2D2GHA4T4HL4" style="width:33%; border-right:1px dashed #fff; float:left; margin:0;"></p>',
						'<p name="TI2D2GHA4T4HL5" style="width:33%; border-right:1px dashed #fff; float:left; margin:0;"></p>',
						'<p name="TI2D2GHA4T4HL6" style="width:33%; float:left; margin:0;"></p>',
						].join("");
						
						div.style.cssText="position:fixed; bottom:0; left:0; width:100%; background:#585858; text-align:center; overflow:hidden;";
					}else{
						cbstr+=',TI2D2GHA4T4HL1,TI2D2GHA4T4HL2,TI2D2GHA4T4HL3';
						dpHtml=['<div style="width:1200px; margin:0 auto;"><a name="colse" style="position:absolute; right:0px; top:0px; z-index:999; border:none;"><img src="http://static.adx.haomeit.com/static/images/close.jpg" width="12" height="12" /></a>',
		'  <p name="TI2D2GHA4T4HL1" style="float:left; width:399px; height:74px; margin:0; border-right:1px dashed #fff; overflow:hidden;"></p>',
		'<p name="TI2D2GHA4T4HL2" style="float:left; width:399px; height:74px; margin:0; border-right:1px dashed #fff; overflow:hidden;"></p>',
		'<p name="TI2D2GHA4T4HL3" style="float:left; width:399px; height:74px; margin:0;"></p>',
		'  </div>'].join("");
						div.style.cssText="height:74px; width:100%; background:#585858; text-align:center;font-family:Microsoft YaHei; overflow:hidden;";
					}
					
					div.innerHTML=dpHtml;
					document.body.appendChild(div);
					if($G.mobile){
						$G('.colse',div).click(function(){
							div.style.display='none';
						});
					}else{
						var altDiv=$G(div);
						altDiv.WinAlt({
							position:'fixed',
							isXCenter:true,
							isBottom:true
						});
						$G('.colse',div).click(function(){
							altDiv.none();
						});
					}
				}
				
				$G.wm({
					cabin:cbstr 	//广告位标识
				,	style:'pic.yyk.39.net'//页面标识广告以哪种风格显示，便于日志数据分析
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
						$G('.TI2D2GHA4T4HL1 .TI2D2GHA4T4HL2 .TI2D2GHA4T4HL3 .TI2D2GHA4T4HL4 .TI2D2GHA4T4HL5 .TI2D2GHA4T4HL6').Each(function(){
							var obj=$G(this);
							var name=obj.getAtt('name');
							if(dpDefHtml[name]===false){
							}else
								this.innerHTML='<a href="'+dpDefHtml[name].im+'" style="border:none; text-decoration:none; cursor:pointer;" target="_blank">'+dpDefHtml[name].img+'</a>';
						});
					}
				});
			};
			getPic();
			
			var	TextFn=function(json){
				//跟据广告唯一标识判断是否有广告
				if(!json['creativeId']){
					return;
				}
				
				var dfHtml='';
				var imgUrl='http://static.adx.haomeit.com/yyk39/<!--creativeId-->.jpg';
				/*********判断回调广告的类型*mobile_destination_url*mobile_display_url********/
				
				json.cabin=json.placeId;
				json.displayUrl=$G.Trim('http://'+(json.displayUrl.replace((new RegExp('http://','ig')),'')));
				if(!$G.isNaN(json.img_path)){
					imgUrl=$G.Trim('http://'+(json.img_path.replace((new RegExp('http://','ig')),'')));
				}
				if(json.type==1){
					//文字广告
						
					if(isDoc===false){
						dfHtml=['<li><A title=<!--title--> href="<!--href-->"><IMG class=ys-img alt=<!--title--> src="'+imgUrl+'"> </A>',
						'  <DIV class=ys-msg>',
						'    <DIV><A title="" href="<!--href-->"><!--title--></A> </DIV>',
						'    <P><!--description1--></P>',
						'  </DIV>',
						'  <TABLE>',
						'    <TBODY>',
						'      <TR>',
						'        <TD><SPAN style="DISPLAY: none" id=experiences_271654 jQuery17206292369560938519="39"></SPAN><SPAN id=likes_271654><I class=i4><!--bz-->次</I>被赞</SPAN></TD>',
						'      </TR>',
						'    </TBODY>',
						'  </TABLE>',
						'  <DIV class=as><A class=a1 title=专家主页 href="<!--href-->" jQuery17206292369560938519="50">专家主页</A></DIV>',
						'</li>'].join("");
					}else{
						dfHtml=['<div style="overflow:hidden; width:720px; height:156px;font-family:Microsoft YaHei;"><a href="<!--displayUrl-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><img src="'+imgUrl+'" height="105" width="140" style="float:left; margin:5px 13px 0;" /></a>',
	'  <dl style=" float:right; width:545px;margin-top:10px;">',
	'    <dt style="height:29px; overflow:hidden;"><a href="<!--displayUrl-->" style="font-size:16px; color:#333; text-decoration:none; margin-right:5px;"><!--title--></a><span style=" margin:3px 3px; 0 0;"><img src="<!--www-->images/yyk39/yue.jpg" height="14" width="14" /></span><span style=" margin:3px 3px; 0 0;"><img src="<!--www-->images/yyk39/zhuan.jpg" height="14" width="14" /></span><span style=" margin:3px 3px; 0 0;"><img src="<!--www-->images/yyk39/lv.jpg" height="14" width="14" /></span></dt>',
	'    <dd style=" margin:0;">',
	'      <div style="float:left; width:290px; font-size:12px; line-height:25px; color:#999999; margin-top:10px;">',
	'        <p style=" margin:0;"><!--description1--></p>',
	'      </div>',
	'      <div style="float:left; width:150px; font-size:12px; color:#999999; line-height:25px; margin-top:10px;"> <span style="display:block;"><em style="font-style:normal; color:#ed9446; padding-right:3px;"><!--yy--></em>成功预约</span> <span style="display:block;"><em style="font-style:normal; color:#89b783; padding-right:3px;"><!--bz--></em>被赞</span> </div>',
	'      <div style="float:right; width:80px; font-size:12px; padding-right:20px;"> <a href="<!--href-->" style="display:block; width:80px; height:28px; line-height:28px; text-align:center; color:#1e9eb9; background:#e7f6f9; text-decoration:none; margin-bottom:10px;">推荐专家</a> <a href="<!--webImHref-->" style="display:block; width:80px; height:28px; line-height:28px; text-align:center; color:#ff7800; background:#fff6ef; text-decoration:none;">预约挂号</a> </div>',
	'    </dd>',
	'  </dl>',
	'</div>'].join("");
					}
					if($G.mobile){
						dfHtml='<a href="<!--href-->"> <span> <img src="'+imgUrl+'"></span> <b><!--title--></b> </a> ';
					}	
					if(isDoc===false){
						json.title=json.title.replace(/医生/ig,'');
						json.description1=json.description1.replace(/\n/ig,'</P>');
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--bz-->',$G.getRandom((10-json.num)*10,100));
					}else{
						json.description1=json.description1.replace(/\n/ig,'<br>');
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--bz-->',$G.getRandom((10-json.num)*100000,1000000));
					}
					
					json.description1=json.description1.replace(/\//ig,'');
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--yy-->',$G.getRandom((10-json.num)*100000,1000000));
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--num-->',json.num);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--href-->',json.href);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--creativeId-->',json.creativeId);
					
					var dom=m.text(json)
					;
					dom.set(dfHtml).show();
				}
			};
			var getText=function(){
				var cbstr='TL2UO28O4U3S23,TL2KT00S4U3S2U,TL2QK8714U3S2F';//TL1TA7MN32KN2B,
				
				$G.wm({
					cabin:cbstr	//广告位标识
				,	style:'test.yyk.39.net'//页面标识广告以哪种风格显示，便于日志数据分析
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
						
					}
				});
			};
			getText();
			
			
			var	PpFn=function(json){
				//跟据广告唯一标识判断是否有广告
				if(!json['creativeId']){
					return;
				}
				var dfHtml='';
				var imgUrl='http://static.adx.haomeit.com/yyk39/<!--creativeId-->.jpg';
				if(!$G.isNaN(json.img_path)){
					imgUrl=$G.Trim('http://'+(json.img_path.replace((new RegExp('http://','ig')),'')));
				}
				json.displayUrl=$G.Trim('http://'+(json.displayUrl.replace((new RegExp('http://','ig')),'')));
				/*********判断回调广告的类型**********/
				
				json.cabin=json.placeId;
				if(json.type==3){
					//品牌广告displayUrl
					dfHtml=['<a href="<!--href-->" style="font-size:14px; color:#999; text-decoration:none;"><div style=" border:1px solid #eaeaea; width:688px; height:158px; padding:0 20px;font-family:Microsoft YaHei; overflow:hidden;"> <span style="height:30px; line-height:30px; display:block; margin-top:10px;"><em style="font-style:normal;font-size:16px; color:#333; float:left; margin-right:10px;"><!--title--></em><em style="font-style:normal; background:#2095fe; color:#fff; width:36px; height:16px; text-align:center; line-height:16px; text-decoration:none; margin-top:8px; font-size:12px; float:left;">官网</em></span> <img src="'+imgUrl+'" height="87" width="126" style="float:left; margin:10px 18px 0 0;" />',
					'  <dl style="float:left; width:540px; margin:0; font-size:12px; line-height:25px;">',
					'    <dd style="margin:0;color:#999;"><!--description1--></dd>',
					'	 <dd style="margin:0;color:#999;">网站：<em style="font-style:none;color:#006600; text-decoration:none;"><!--displayUrl--></em><em  style="font-style:none;float:right;"><img src="<!--www-->images/yyk39/zixun.jpg" height="31" width="118" /></em></dd>',
					'  </dl>',
					'</div></a>'].join("");
					
					if($G.mobile){
						dfHtml=['<div style="border:1px solid #e0e0e0; padding:10px 15px; overflow:hidden;position:relative;font-family:Microsoft YaHei;"><a href="<!--href-->" style="font-size:14px; color:#000; text-decoration:none;"> <img src="'+imgUrl+'" style="float:left; width: 30%; margin-right:15px; margin-top:3px;height: 120px;">',
'  <dl style="font-size:12px;line-height:20px; padding:0; margin:0;">',
'    <dt style="height:25px; line-height:25px; overflow:hidden;color:#1386A5; font-size:16px; text-decoration:none;"><!--title--></dt>',
'    <dd style="margin:0; color:#767676; font-size:13px;"><!--description1--></dd>',
'    <dd style="margin:0; color:#767676;"><a href="<!--href-->" style="float:right; "><img src="<!--www-->images/yyk39/wapzixun.jpg" height="17" width="65"></a></dd>',
'  </dl>',
'  </a></div>'].join("");
						dfHtml=['<div style="border:1px solid #e0e0e0; padding:10px 15px; overflow:hidden;position:relative;font-family:Microsoft YaHei;"><a href="<!--href-->" style="font-size:14px; color:#000; text-decoration:none;">',
						'  <p style="  margin:0; width:120px; float:left;"> <img src="'+imgUrl+'" style="width:120px; height: 85px;"><img src="<!--www-->images/yyk39/120-22.jpg" height="22" width="120"></p>',
						'  <dl style="font-size:12px;line-height:20px; padding:0; margin:0; position:absolute; left:150px;">',
						'    <dt style="height:25px; line-height:25px; overflow:hidden;color:#1386A5; font-size:14px; text-decoration:none;"><!--title--></dt>',
						'    <dd style="margin:0; color:#767676; font-size:12px;"><!--description1--></dd>',
						'  </dl>',
						'  </a></div>',
						].join("");
						var dpnlist=json.description1.split(/\n/);
						delete dpnlist[0];
						json.description1=dpnlist.join("<br>");
						json.description1=json.description1.replace('<br>','');
					}else{
						json.description1=json.description1.replace(/\n/ig,'<br>');
					}
					
					
					json.description1=json.description1.replace(/\//ig,'');
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--yy-->',$G.getRandom((10-json.num)*100000,1000000));
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--num-->',json.num);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--href-->',json.href);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--creativeId-->',json.creativeId);
					
					var dom=m.text(json)
					;
					dom.set(dfHtml).show();
				}
			};
			var getPP=function(){
				var cbstr='TL1TA7MN32KN2B';
				
				$G.wm({
					cabin:cbstr	//广告位标识
				,	style:'pp.yyk.39.net'//页面标识广告以哪种风格显示，便于日志数据分析
				,	ele:3//广告类型 1：文字广告	2：图片广告 默认1
				,	device:$G.mobile?1:0
				,	fn:function(d){
						/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
						/*	
							cabin:广告标识
							type:广告类型
							index:索引
						*/
						this.eachFn=PpFn;
					}
					//回调结束 无广告时也执行
				,	callbackEach:function(n){
						
					}
				});
			};
			getPP();
			
		}
		
		
	});
})();
