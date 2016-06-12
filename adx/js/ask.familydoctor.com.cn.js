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
			var haomeitjydoctorid=function(){
				var id=window.haomeitjydoctorid;
				$G('.LianChuangFirstName').Each(function(){
					var obj=$G(this)
					,	did=obj.getAtt('doctorId')
					;
					if(obj[0].value=='true'){
						id=did;
					}
				});
				return id;
			}();
			
			/******************************************************
				var m=$G.model 广告展示方式公用类
				m.pic120X240	120X240浮动层展示
			*******************************************************/
			$G.findParent=function(dom){
				var obj = dom; 
				do
				{
				   try{
						if(obj.style&&obj.style.position=='fixed' || (obj.id+'').indexOf('BAIDU')>=0)
							break;
						else obj=obj.parentNode;
				   } catch( e ) {}
				}
				while(obj);
				return obj;
			};
			var baiduFor=function(){
				var obj=window.document.getElementsByTagName("*")
				,	isDiv=false
				,	none=function(domObj){
						domObj.style.position='absolute';
						domObj.style.display='none';
						domObj.style.visibility='hidden';
						domObj.style.top='-100000px';
					}
				;
				$G('iframe').Each(function(){
					var ddom=this
					,	src=ddom.src||''
					;
					if(src.indexOf('baidu.com')<0)return;
					var objPar=$G.findParent(ddom);
					if(objPar){
						none(objPar);
						objPar.parentNode.removeChild(objPar);
					}
				});
				for(var i=0,n=obj.length;i<n;i++){
					var b=obj[i]
					;
					if(!b || (isDiv===false&&(b.tagName+'').toLowerCase()!='script'))continue;
					var str=b.innerHTML||'';
					if(isDiv===false){
						if(!b.src&&str.indexOf('BAIDU_CLB_SLOT_ID = "')>=0){
							isDiv=true;
							var objPar=$G.findParent(b);
							if(objPar){
								none(objPar);
								objPar.parentNode.removeChild(objPar);
							}
						}else{
							continue;
						}
					}else if((b.tagName.toLowerCase())=='div' && isDiv){
						isDiv=false;
						none(b);
					}
				}
				
				
				baiduFor=null;
			};
			$G.Config.www='http://manager.xlwd.haomeit.com';
			$G.Config.wwwImg='http://39.haomeit.com/getPic/';
			/*$G.statistics=function(){
				return {
					fromPage:'',
					toPage:'http://ask.familydoctor.com.cn/q/10628658.html',
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
			*/
			
			var lbPicObj={};
			lbPicObj['990X90']=new Array();
			lbPicObj['250X235']=new Array();
			lbPicObj['725X100']=new Array();
			lbPicObj['650X100']=new Array();
			var lbWebImObj={};
			lbWebImObj['990X90']=new Array();
			lbWebImObj['250X235']=new Array();
			lbWebImObj['725X100']=new Array();
			lbWebImObj['650X100']=new Array();
			var m=$G.model
			,	wwwUrl=window.location+''
			;
			
			var wsize=$G.windowSize()
			,	xScroll=wsize.sw
			,	yScroll=wsize.sh
			var	picFn=function(json){
				if(!json['creativeId']){
					return;
				}
				if(json.index==0)
					baiduFor&&baiduFor();
				json.cabin=json.placeId;
				json.imgUrl=$G.Config.wmReplace(json.imgUrl,'<!--www-->',$G.Config.wwwStatic);
				var dom=m.pic({
					href:json.webImHref//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:json.imgSize //图片尺寸
				,	cabin:json.cabin
				,	isClose:false
				});
				
				var dfhtml='<a href="<!--href-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><img style=" float:left; " width="<!--w-->" height="<!--h-->" src="<!--imgUrl-->" ></a>';
				dfhtml=$G.Config.wmReplace(dfhtml,'<!--href-->',json.href);
				dfhtml=$G.Config.wmReplace(dfhtml,'<!--imgUrl-->',json.imgUrl);
				
				$G('div:id:lFloatAd').none();
				
				/*********判断回调广告的类型**********/
				if(json.type==2){
					/********************特约专家在线问诊*************************/
					if(json.cabin=='A306D77C27763EA08E050A8C00577BA30'
					|| json.cabin=='A306D77C27764EA08E050A8C00577BA30'
					|| json.cabin=='A306D77C27765EA08E050A8C00577BA30'
					){
						dom=m.pic({
							href:json.webImHref//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:json.imgSize //图片尺寸
						,	cabin:json.cabin
						,	isClose:false
						,	dfHtml:'<a href="'+json.webImHref+'" target="_blank"><img src="'+json.imgUrl+'" width="<!--w-->" height="<!--h-->" style="margin:13px 0 0 10px;" /></a>'
						});
					}else if(json.cabin=='A306D77C2777DEA08E050A8C00577BA30'
					|| json.cabin=='A306D77C2777EEA08E050A8C00577BA30'
					){
						dom=m.pic({
							href:json.webImHref//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:json.imgSize //图片尺寸
						,	cabin:json.cabin
						,	isClose:false
						,	dfHtml:'<p style="width:33%; border-right:1px dashed #fff; float:left; margin:0;"><a href="'+json.webImHref+'"><img src="'+json.imgUrl+'" width="100%" target="_blank" /></a></p>'
						});
					}else if(json.cabin=='A306D77C2777FEA08E050A8C00577BA30'
					){
						dom=m.pic({
							href:json.webImHref//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:json.imgSize //图片尺寸
						,	cabin:json.cabin
						,	isClose:false
						,	dfHtml:'<p style="width:33%; float:left; margin:0;"><a href="'+json.webImHref+'" target="_blank"><img src="'+json.imgUrl+'" width="100%" /></a></p>'
						});
					}else if(json.cabin=='A306D77C27779EA08E050A8C00577BA30'
					||		json.cabin=='A306D77C2777BEA08E050A8C00577BA30'
					||		json.cabin=='A306D77C2777CEA08E050A8C00577BA30'
					){
						dom=m.pic({
							href:json.webImHref//广告目标网址
						,	src:json.imgUrl//广告图片SRC
						,	imgSize:xScroll+"X"+(xScroll/6.5)
						,	cabin:json.cabin
						,	isClose:false
						});
					}
					if(json.imgSize=='990X90'
					||	json.imgSize=='250X235'
					||	json.imgSize=='725X100'
					||	json.imgSize=='650X100'
					){
						lbPicObj[json.imgSize].push(json.imgUrl);
						lbWebImObj[json.imgSize].push(json.webImHref);
					}
					dom.echo();
					
				}
			};
			var isZXWD=false
			,	isWDZBTL=false
			,	isZJTL=false
			,	isYCYY=false
			,	isYCZJ=false
			,	displayDiv=function(){
					if(isZXWD===false){
						$G('.isZXWD').none();
					}else{
						$G('.wd_ks_pc_as_middle').none();
					}
					if(isWDZBTL===false){
						$G('.isWDZBTL').none();
					}
					if(isZJTL===false){
						$G('.isZJTL').none();
					}
				}
			;
			var	TextFn=function(json){
				//跟据广告唯一标识判断是否有广告
				if(!json['creativeId']){
					return;
				}
				
				json.cabin=json.placeId;
				var dfHtml='';
				imgUrl='';
				if(!$G.isNaN(json.img_path)){
					imgUrl=$G.Trim('http://'+(json.img_path.replace((new RegExp('http://','ig')),'')));
				}
				if(json.type==1){
					if(json.cabin=='T306D77C27769EA08E050A8C00577BA30'
					|| json.cabin=='T306D77C2776AEA08E050A8C00577BA30'
					|| json.cabin=='T306D77C2776BEA08E050A8C00577BA30'
					){
						isYCZJ=true;
						dfHtml=['<dt><a target="_blank" href="<!--webImHref-->"><img alt="<!--title-->" src="'+imgUrl+'"></a></dt>',
'<dd>',
'  <p><b><a target="_blank" href="<!--webImHref-->"><!--title--></a></b></p><!--description1-->',
'  <br><a target="_blank" href="<!--webImHref-->" class="bg">点击咨询</a> </dd>'].join("");
						json.description1=json.description1.replace(/\n/ig,'<br>');
						json.description1=json.description1.replace(/\//ig,'');		
					}else if(json.cabin=='T306D77C2776CEA08E050A8C00577BA30'
					||		 json.cabin=='T306D77C2776DEA08E050A8C00577BA30'
					||		 json.cabin=='T306D77C2776EEA08E050A8C00577BA30'
					){
						isYCYY=true;
						dfHtml=['<dt><a href="<!--webImHref-->" target="_blank"><!--title--></a></dt>',
'<dd>',
'  <a href="<!--webImHref-->" target="_blank"><img width="210" height="69" style="padding:2px;border:1px solid #ddd;" src="'+imgUrl+'"></a>',
'</dd>',
'<dd><span style="height:auto;overflow:visible;"><!--description1--></span></dd>'].join("");
						// json.description1=json.description1.replace(/\n/ig,'</span><span>');
						json.description1=json.description1.replace(/\n/ig,'<br>');
						json.description1=json.description1.replace(/\//ig,'');		

					}else if(
						json.cabin=='T306D7D57F2791203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F2711203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F2721203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F2731203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F2741203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F2751203E050A8C00577BA65'
					){
						isZXWD=true;
						dfHtml=['<em style=" float:left; height:15px; width:15px; color:#e9b71c;border-radius:3px; background:#ef4528; line-height:15px; font-style:normal; margin:12px 5px 0 15px; font-size:12px; text-align:center; ">问</em><a href="<!--webImHref-->" style=" text-decoration:none; color:#333;" target="_blank"><!--title--></a>'].join("");
					}else if(
						json.cabin=='T306D7D57F2761203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F2771203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F2781203E050A8C00577BA65'
					){
						isWDZBTL=true;
						dfHtml=['<dt style=" height:30px; line-height:30px; font-size:14px;overflow:hidden; font-weight:bold; margin:0; padding:0;"><a href="<!--webImHref-->" target="_blank" style="color:#5294a0; text-decoration:none;"><!--title--></a></dt>',
'<dd style="margin:0; padding:0; line-height:26px; font-size:14px; color:#333;"><!--description1--><a href="<!--webImHref-->" style=" color:#f6a02d; text-decoration:none;" target="_blank">在线咨询</a></dd>'].join("");
					}else if(
						json.cabin=='T306D7D57F27A1203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F27B1203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F27C1203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F27D1203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F27E1203E050A8C00577BA65'
					||  json.cabin=='T306D7D57F27F1203E050A8C00577BA65'
					){
						isZJTL=true;
						dfHtml=['<a href="<!--webImHref-->" style="color:#333; text-decoration:none;" target="_blank"><!--title--></a>'].join("");
					}
					
					
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--webImHref-->',json.webImHref);	
					var dom=m.text(json)
					;
					if(dfHtml)
						dom.set(dfHtml).show();
					else 
						dom.show();
				}


			};
			var wmFn=function(isTrue){
				$G.Config.www='http://askjtys.haomeit.com:7201';
				$G.Config.wwwImg='http://askjtys.haomeit.com/getPic/';
				var ids=$G('div:glacier:true li:glacier:true dl:glacier:true')
				,	picIds=''
				,	strIds=''
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
				
				var disease=window.haomeitjyDiseaseId;
				var dept=window.haomeitjyCategoryL2>0?window.haomeitjyCategoryL2:window.haomeitjyCategoryL1;
				
				$G.wm({
					cabin:picIds+',A337A3B16E5756B4CE050A8C0057733F7,A337A3B16E5766B4CE050A8C0057733F7,A337A3B16E5776B4CE050A8C0057733F7,A337A3B16E5786B4CE050A8C0057733F7,A337A3B16E5796B4CE050A8C0057733F7,A337A3B16E57A6B4CE050A8C0057733F7,A33BB6655C90B9694E050A8C005770324,A33BB6655C90C9694E050A8C005770324' 	//广告位标识
				,	id:'1&disease='+disease+'&doctors_id='+(haomeitjydoctorid||'')
				,	addParam:{
						ip_addr:$G.getid('ip')||''
					}
				,	dept:haomeitjydoctorid?'':dept
				,	style:'pic.ask.familydoctor.com.cn'//页面标识广告以哪种风格显示，便于日志数据分析
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
						if($G('.A306D77C27770EA08E050A8C00577BA30').length>0)
							$G.setGD({
								obj:$G('.A306D77C27770EA08E050A8C00577BA30')[0]
							,	arr:lbPicObj['990X90']
							,	href:lbWebImObj['990X90']
							}).show();
						var dom250X235=$G('.A306D77C27772EA08E050A8C00577BA30')
						,	dom725X100=$G('.A306D77C27771EA08E050A8C00577BA30')
						,	dom650X100=$G('.A306D77C2777CEA08E050A8C00577BA30')
						;
						if($G.mobile){
							dom725X100=$G('.A306D77C2777BEA08E050A8C00577BA30');
						}
						
						if(dom250X235.length>0)
							$G.setGD({
								obj:dom250X235[0]
							,	arr:lbPicObj['250X235']
							,	href:lbWebImObj['250X235']
							}).show();
						if(dom725X100.length>0)
							$G.setGD({
								obj:dom725X100[0]
							,	arr:lbPicObj['725X100']
							,	href:lbWebImObj['725X100']
							}).show();
						if(dom650X100.length>0)
							$G.setGD({
								obj:dom650X100[0]
							,	arr:lbPicObj['650X100']
							,	href:lbWebImObj['650X100']
							}).show();
						$G('.wd_ks_pc_top').show();
						var dom=''
						,	dfHtml=''
						,	strHtml=''
						;
						var	wsize=$G.windowSize()
						,	xScroll=wsize.sw
						,	yScroll=wsize.sh
						;
						if(picIds.indexOf('A306D77C27763EA08E050A8C00577BA30')>-1){
							dfHtml='<div style="background:#fff;border:2px solid #97bced; width:201px; height:auto;padding-bottom:10px; overflow:hidden;"><div style=" height:36px; line-height:36px; background:#3983e5; color:#fff; font-size:16px; text-align:center;">特约专家在线问诊</div><!--html--></div>';
							$G('.A306D77C27763EA08E050A8C00577BA30 .A306D77C27764EA08E050A8C00577BA30 .A306D77C27765EA08E050A8C00577BA30').Each(function(){
								var a=$G('a',this)
								,	img=$G('img',this)
								;
								
								if(a.length>0){
									strHtml+='<a href="'+a[0].href+'" target="_blank"><img src="'+img[0].src+'"height="85" width="201" style="margin:0px"/></a>';
									$G(this).none();
								}
							});
							if(strHtml){
								dfHtml=$G.Config.wmReplace(dfHtml,'<!--html-->',strHtml);
								dom=m.pic({
									href:'fdfd'//广告目标网址
								,	src:'dfdf'//广告图片SRC
								,	imgSize:'205X300'
								,	cabin:'aaa'
								,	dfHtml:dfHtml
								});
								dom.show({
									position:'fixed',
									isYCenter:true,
									isLeft:true
								});
							}
						}
						if(picIds.indexOf('A306D77C2777FEA08E050A8C00577BA30')>-1){
							strHtml='';
							dfHtml=['<div style="position:fixed; bottom:0; left:0; width:100%; background:#585858; text-align:center; overflow:hidden; "><!--html--></div>'].join("");
							$G('.A306D77C2777DEA08E050A8C00577BA30 .A306D77C2777EEA08E050A8C00577BA30 .A306D77C2777FEA08E050A8C00577BA30').Each(function(){
								
								var a=$G('a',this)
								,	img=$G('img',this)
								,	name=$G(this).getAtt('name')
								;
								
								if(a.length>0){
									if(name=='A306D77C2777FEA08E050A8C00577BA30'){
										strHtml+='<p style="width:33%; border-right:1px dashed #fff; float:left; margin:0;"><a target="_blank" href="'+a[0].href+'"><img src="'+img[0].src+'" width="100%" /></a></p>';
									}else{
										strHtml+='<p style="width:33%; float:left; margin:0;"><a target="_blank" href="'+a[0].href+'"><img src="'+img[0].src+'" width="100%" /></a></p>';
									}
									
									$G(this).none();
								}/*else{
									if(name=='A306D77C2777FEA08E050A8C00577BA30'){
										strHtml+='<p style="width:33%; border-right:1px dashed #fff; float:left; margin:0;"><a href=""><img src="" width="100%" /></a></p>';
									}else{
										strHtml+='<p style="width:33%; float:left; margin:0;"><a href=""><img src="" width="100%" /></a></p>';
									}
								}*/
							});
							if(strHtml){
							dfHtml=$G.Config.wmReplace(dfHtml,'<!--html-->',strHtml);
								dom=m.pic({
									href:'fdfd'//广告目标网址
								,	src:'dfdf'//广告图片SRC
								,	imgSize:xScroll+"X"+(xScroll/6.4)
								,	cabin:'bbb'
								,	dfHtml:dfHtml
								});
								dom.show({
									position:'fixed',
									isLeft:true,
									isBottom:true
								});
							}
						}
						
						
					}
				});
				
				$G.wm({
					cabin:strIds	//广告位标识
				,	addParam:{
						ip_addr:$G.getid('ip')||''
					}
				,	id:'1&disease='+disease+'&doctors_id='+(haomeitjydoctorid||'')
				,	dept:haomeitjydoctorid?'':dept
				,	style:'test.ask.familydoctor.com.cn'//页面标识广告以哪种风格显示，便于日志数据分析
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
						displayDiv();
					}
				});
				
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
			
			var	eachFn=function(json){
				//跟据广告唯一标识判断是否有广告
				
				var adJson=json.info||{}
				,	wsize=$G.windowSize()
				,	xScroll=wsize.sw
				,	yScroll=wsize.sh
				,	dom=''
				,	dfHtml=''
				;
				if(json.errcode!=0){
					$G.log('not ads');
					wmFn();
					return;
				}
				if(adJson.q==1){
					baiduFor&&baiduFor();
					displayDiv();
					if($G('.wd_sp_pc_right').length>0&&adJson.left_ad_img){
						dom=m.pic({
							href:adJson.left_ad_url//广告目标网址
						,	src:adJson.left_ad_img//广告图片SRC
						,	imgSize:'120X200' //图片尺寸
						,	cabin:'wd_sp_pc_right'
						});
						dom.show({
							position:'fixed',
							isYCenter:true,
							isLeft:true
						});
						
					}
					if($G('.wd_sp_pc_right').length>0){
						dom=m.pic({
							href:adJson.jy_right_ad_url//广告目标网址
						,	src:adJson.jy_right_ad_img//广告图片SRC
						,	imgSize:'215X125' //图片尺寸
						,	cabin:'wd_sp_pc_right'
						});
						dom.show({
							position:'fixed',
							isBottom:true,
							isRight:true
						});//.shake();
						
					}
					
					dom=m.pic({
						href:adJson.custom_url//广告目标网址
					,	src:adJson.jy_top_ad_img//广告图片SRC
					,	imgSize:'990X90' //图片尺寸
					,	cabin:'wd_ks_pc_top'
					,	isClose:false
					});
					dom.echo();
					
					if($G('.wd_wd_m_right').length>0){
						dom=m.pic({
							href:adJson.custom_url//广告目标网址
						,	src:adJson.m_right_ad_img//广告图片SRC
						,	imgSize:'40X140' //图片尺寸
						,	cabin:'wd_wd_m_right'
						});
						dom.show({
							position:'fixed',
							isYCenter:true,
							isRight:true
						});
					}
					if($G('.wd_ks_pc_right').length>0){
						dom=m.pic({
							href:adJson.jy_right_ad_url//广告目标网址
						,	src:adJson.jy_right_ad_img//广告图片SRC
						,	imgSize:'215X125' //图片尺寸
						,	cabin:'wd_ks_pc_right'
						});
						dom.show({
							position:'fixed',
							isBottom:true,
							isRight:true
						});//.shake();
						
					}
					
					if($G('.wd_ks_pc_left').length>0&&adJson.left_ad_img){
						dom=m.pic({
							href:adJson.left_ad_url//广告目标网址
						,	src:adJson.left_ad_img//广告图片SRC
						,	imgSize:'120X200' //图片尺寸
						,	cabin:'wd_ks_pc_left'
						});
						dom.show({
							position:'fixed',
							isYCenter:true,
							isLeft:true
						});
					}
					if($G('.wd_dc_m_run').length>0){
						dom=m.pic({
							href:adJson.custom_url//广告目标网址
						,	src:adJson.m_bottom_ad_img//广告图片SRC
						,	imgSize:xScroll+"X"+(xScroll/5.8) 
						,	cabin:'wd_dc_m_run'
						//,	isClose:false
						});
						dom.show({
							position:'fixed',
							isXCenter:true,
							isBottom:true
						});
						
					}
					if($G('.wd_wd_m_run').length>0){
						dom=m.pic({
							href:adJson.custom_url//广告目标网址
						,	src:adJson.m_bottom_ad_img//广告图片SRC
						,	imgSize:xScroll+"X"+(xScroll/5.8) 
						,	cabin:'wd_wd_m_run'
						//,	isClose:false
						});
						dom.show({
							position:'fixed',
							isXCenter:true,
							isBottom:true
						});
						
					}
					
					if($G('.wd_wd_m_top').length>0){
						dom=m.pic({
							href:adJson.custom_url//广告目标网址
						,	src:adJson.jy_top_m_ad_img//广告图片SRC
						,	imgSize:xScroll+"X"+(xScroll/4) 
						,	cabin:'wd_wd_m_top'
						//,	isClose:false
						});
						dom.echo();
					}
					if($G('.wd_dc_m_top').length>0){
						dom=m.pic({
							href:adJson.custom_url//广告目标网址
						,	src:adJson.jy_top_m_ad_img//广告图片SRC
						,	imgSize:xScroll+"X"+(xScroll/4) 
						,	cabin:'wd_dc_m_top'
						//,	isClose:false
						});
						dom.echo();
					}
					dom=m.pic({
						href:adJson.custom_url//广告目标网址
					,	src:adJson.horizontal_middle_ad_img//广告图片SRC
					,	imgSize:"720X100" 
					,	cabin:'wd_ks_pc_as_middle'
					,	isClose:false
					});
					dom.echo();
					
					if($G('.wd_sp_pc_online').length>0){
						dfHtml=['<div style="font-family:Microsoft YaHei; overflow:hidden;">',
	'  <p style="font-size:14px; color:#333; margin:0; line-height:30px;">工作单位：<a href="<!--custom_url-->" style="color:#006fcb; text-decoration:none;" target="_blank"><!--hospital--></a></p>',
	'  <a href="<!--custom_url-->" target="_blank" style="background:#ff3301; height:40px; line-height:40px; font-size:16px; color:#fff; text-align:center; float:left; margin-right:10px; padding:0 20px; text-decoration:none;">在线咨询</a> <a href="<!--custom_url-->" style="background:#006fcb; height:40px; line-height:40px; font-size:16px; color:#fff; text-align:center; float:left;padding:0 20px; text-decoration:none;" target="_blank">网上预约</a> </div>'].join(""); 
						dom=m.text({
							cabin:'wd_sp_pc_online'	
						})
						;
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--hospital-->',adJson.hospital);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--custom_url-->',adJson.custom_url);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--good_disease-->',adJson.good_disease);
						dom.set(dfHtml).show();
					}
					
					if($G('.wd_dc_m_expert').length>0){
						
						dfHtml=['<div class="info">',
	'  <dl>',
	'    <dt> <img src="<!--avatar-->"></dt>',
	'    <dd> <b><!--real_name--></b> <em><!--technical--></em>',
	'      <p> 医院：<!--hospital--></p>',
	'      <span>科室：<!--good_disease--></span> <a target="_blank" id="ask-question" href="<!--custom_url-->"> 网上咨询</a> <a href="<!--custom_url-->" class="btn org">电话咨询</a> </dd>',
	'  </dl>',
	'</div>',
	].join("");
						dom=m.text({
							cabin:'wd_dc_m_expert'	
						})
						;
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--avatar-->',adJson.avatar);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--real_name-->',adJson.real_name);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--technical-->',adJson.technical);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--good_disease-->',adJson.good_disease);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--hospital-->',adJson.hospital);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--custom_url-->',adJson.custom_url);
						dom.set(dfHtml).show();
					}
					
					
					
					if($G('.wd_wd_m_re').length>0){
						dfHtml=['<div class="doctor"> <a href="<!--custom_url-->" target="_blank"> <em> <img src="<!--avatar-->"></em> <b><!--real_name--></b> <!--technical-->',
						'    <p><!--hospital--> <!--abstract--></p>',
						'    </a> </div>',
						'  <div class="doctor-btns">',
						'    <ul>',
						'      <li><a href="<!--custom_url-->" target="_blank">打电话给该医生</a></li>',
						'      <li><a href="<!--custom_url-->" target="_blank">网上咨询该医生</a></li>',
						'    </ul>',
						'  </div>'].join("");
						dom=m.text({
							cabin:'wd_wd_m_re'	
						})
						;
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--avatar-->',adJson.avatar);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--real_name-->',adJson.real_name);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--technical-->',adJson.technical);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--good_disease-->',adJson.good_disease);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--hospital-->',adJson.hospital);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--custom_url-->',adJson.custom_url);
						dom.set(dfHtml).show();
					}
					<!--增加问答广告数据-->
					dfHtml=['<dt><a target="_blank" href="'+adJson.custom_url+'"><img alt="<!--title-->" src="'+adJson.avatar+'"></a></dt>',
'<dd>',
'  <p><b><a target="_blank" href="'+adJson.custom_url+'">'+adJson.real_name+'</a></b></p>所属科室：'+$G.lenSub(adJson.good_disease,10,'...'),
'<br>职称：'+adJson.technical+'<br><a target="_blank" href="'+adJson.custom_url+'" class="bg">点击咨询</a> </dd>'].join("");
					$G('.T306D77C27769EA08E050A8C00577BA30').html(dfHtml);
					if(adJson.jy_yt){
						dom=m.pic({
							href:adJson.custom_url//广告目标网址
						,	src:adJson.jy_yt//广告图片SRC
						,	imgSize:"250X235" 
						,	cabin:'A306D77C27772EA08E050A8C00577BA30'
						,	isClose:false
						});
						dom.echo();
					}
					if(adJson.jy_hfd_img){
						dom=m.pic({
							href:adJson.custom_url//广告目标网址
						,	src:adJson.jy_hfd_img//广告图片SRC
						,	imgSize:"720X100" 
						,	cabin:'A306D77C27771EA08E050A8C00577BA30'
						,	isClose:false
						});
						dom.echo();
					}
				}else{
					if($G('.wd_wd_m_re').length>0){
						dfHtml=['<div class="doctor"> <a href="<!--custom_url-->" target="_blank"> <em> <img src="<!--avatar-->"></em> <b><!--real_name--></b> <!--technical-->',
						'    <p><!--hospital--> <!--abstract--></p>',
						'    </a> </div>',
						'  <div class="doctor-btns">',
						'    <ul>',
						'      <li><a href="<!--custom_url-->" target="_blank">打电话给该医生</a></li>',
						'      <li><a href="<!--custom_url-->" target="_blank">网上咨询该医生</a></li>',
						'    </ul>',
						'  </div>'].join("");
						dom=m.text({
							cabin:'wd_wd_m_re'	
						})
						;
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--avatar-->',adJson.avatar);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--real_name-->',adJson.real_name);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--technical-->',adJson.technical);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--good_disease-->',adJson.good_disease);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--hospital-->',adJson.hospital);
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--custom_url-->',adJson.custom_url);
						dom.set(dfHtml).show();
					}
					wmFn();
				}
				
				
				if($G('.wd_zd_pc_dc').length>0){
					
					dfHtml=['<div style="font-family:Microsoft YaHei; border:1px solid #d2d2d2;padding:10px; overflow:hidden;"> <img src="<!--avatar-->"  height="75" width="60" style="float:left; margin-right:10px;" />',
'  <dl style=" float:left; width:490px; margin:-5px 0 0;">',
'    <dt style="font-size:16px; color:#333; margin:0; line-height:25px; float:none; width:auto; height:25px;"><a href="http://ask.familydoctor.com.cn/doctor/<!--jy_doctorid-->/" target="_blank" style="color:#006fcb; text-decoration:none;"><!--real_name--> <!--technical--></a></dt>',
'    <dd style=" margin:0; line-height:20px;">',
'      <p style=" margin:0 0 6px; font-size:14px; color:#333; height:20px; line-height:20px; width:490px; float:left; overflow:hidden;"><!--hospital--></p>',
'      <p style=" margin:0 0 6px; font-size:14px; color:#333; height:20px; line-height:20px; width:490px; float:left; overflow:hidden;"><!--good_disease--></p>',
'    </dd>',
'  </dl>',
'  <span style=" float:right; width:90px; margin-top:7px;"><a target="_blank" href="<!--custom_url-->" style="background:#ff3301; height:28px; line-height:28px; font-size:14px; color:#fff; text-align:center; float:left; width:90px; text-align:center;text-decoration:none;">在线咨询</a> <a href="<!--custom_url-->" target="_blank" style="background:#006fcb; height:28px; line-height:28px; font-size:14px; color:#fff; text-align:center; float:left; text-align:center; width:90px;text-decoration:none; margin-top:5px;">网上预约</a></span> </div>'].join("");
					dom=m.text({
						cabin:'wd_zd_pc_dc'	
					})
					;
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--avatar-->',adJson.avatar);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--real_name-->',adJson.real_name);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--technical-->',adJson.technical);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--good_disease-->',adJson.good_disease);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--hospital-->',adJson.hospital);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--custom_url-->',adJson.custom_url);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--member_id-->',adJson.member_id);
					dom.set(dfHtml).show();
					
					dfHtml=['<div style=" width:100%;font-family:Microsoft YaHei;"> <a target="_blank" href="<!--custom_url-->" style=" float:right;background:#006fcb; height:28px; line-height:28px; font-size:14px; color:#fff; text-align:center;margin-left:10px; padding:0 15px; text-decoration:none;">在线咨询</a> <a target="_blank" href="<!--custom_url-->" style=" float:right;background:#006fcb; height:28px; line-height:28px; font-size:14px; color:#fff; text-align:center; padding:0 15px; text-decoration:none;">网上预约</a> </div>'].join("");
					
					dom=m.text({
						cabin:'wd_zd_pc_yx'	
					})
					;
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--custom_url-->',adJson.custom_url);
					dom.set(dfHtml).show();
				}
				if($G('.wd_ks_pc_re').length>0){
					
					dfHtml=['<div style="font-family:Microsoft YaHei; border:1px solid #d2d2d2;padding:10px; overflow:hidden;"> <img src="<!--avatar-->"  height="75" width="60" style="float:left; margin-right:10px;" />',
'  <dl style=" float:left; width:490px; margin:-5px 0 0;">',
'    <dt style="font-size:16px; color:#333; margin:0; line-height:25px; float:none; width:auto; height:25px;"><a href="http://ask.familydoctor.com.cn/doctor/<!--jy_doctorid-->/" target="_blank" style="color:#006fcb; text-decoration:none;"><!--real_name--> <!--technical--></a></dt>',
'    <dd style=" margin:0; line-height:20px;">',
'      <p style=" margin:0 0 6px; font-size:14px; color:#333; height:20px; line-height:20px; width:490px; float:left; overflow:hidden;"><!--hospital--></p>',
'      <p style=" margin:0 0 6px; font-size:14px; color:#333; height:20px; line-height:20px; width:490px; float:left; overflow:hidden;"><!--good_disease--></p>',
'    </dd>',
'  </dl>',
'  <span style=" float:right; width:90px; margin-top:7px;"><a target="_blank" href="<!--custom_url-->" style="background:#ff3301; height:28px; line-height:28px; font-size:14px; color:#fff; text-align:center; float:left; width:90px; text-align:center;text-decoration:none;">在线咨询</a> <a href="<!--custom_url-->" target="_blank" style="background:#006fcb; height:28px; line-height:28px; font-size:14px; color:#fff; text-align:center; float:left; text-align:center; width:90px;text-decoration:none; margin-top:5px;">网上预约</a></span> </div>'].join("");
					dom=m.text({
						cabin:'wd_ks_pc_re'	
					})
					;
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--jy_doctorid-->',adJson.jy_doctorid);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--avatar-->',adJson.avatar);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--real_name-->',adJson.real_name);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--technical-->',adJson.technical);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--good_disease-->',adJson.good_disease);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--hospital-->',adJson.hospital);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--custom_url-->',adJson.custom_url);
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--member_id-->',adJson.member_id);
					dom.set(dfHtml).show();
					
					dfHtml=['<div style=" width:100%;font-family:Microsoft YaHei;"> <a target="_blank" href="<!--custom_url-->" style=" float:right;background:#006fcb; height:28px; line-height:28px; font-size:14px; color:#fff; text-align:center;margin-left:10px; padding:0 15px; text-decoration:none;">在线咨询</a> <a target="_blank" href="<!--custom_url-->" style=" float:right;background:#006fcb; height:28px; line-height:28px; font-size:14px; color:#fff; text-align:center; padding:0 15px; text-decoration:none;">网上预约</a> </div>'].join("");
					
					dom=m.text({
						cabin:'wd_ks_pc_re_yx'	
					})
					;
					dfHtml=$G.Config.wmReplace(dfHtml,'<!--custom_url-->',adJson.custom_url);
					dom.set(dfHtml).show();
				}
							
			};
			
			$G('.wd_sp_pc_right .wd_sp_pc_right .wd_ks_pc_top .wd_wd_m_right .wd_ks_pc_right .wd_ks_pc_left .wd_dc_m_run .wd_wd_m_run .wd_wd_m_top .wd_dc_m_top .wd_sp_pc_online .wd_dc_m_expert .wd_zd_pc_dc .wd_ks_pc_re').none();//.wd_wd_m_re
			var getText=function(){
				
				$G.wm({
					urlDf:'/api/familyAd/?familydoctorid='+haomeitjydoctorid//广告位标识
				,	cabin:'A7FE0F178F630AD73E050A8C0057755FD'
				,	style:'ask.familydoctor.com.cn'//页面标识广告以哪种风格显示，便于日志数据分析
				,	ele:4//广告类型 1：文字广告	2：图片广告 默认1
				,	fn:function(d){
					}
					//回调结束 无广告时也执行
				,	callbackEach:function(o){
						setInterval(function(){
							$G('#icon_0').none();
						}, 300);
						
						eachFn(this);
					}
				});
			}();
			
			
			/************************结束*********************************/
			
		}
		
		
	});
})();


//window.haomeitjyCategoryL1='4';
//window.haomeitjyCategoryL2='0';

var _hmt = _hmt || [];
(function() {
	var categoryL1={};
	categoryL1['54']='0f83816d0f39524e60e48b9ef4ea99fc';
	categoryL1['63']='a06cc42bfd0e9dea508e7168dd4ea899';
	categoryL1['4']='ba6ef152020fb496d15f758d52a6d072';
	categoryL1['58']='eeed028fa1aa1cc5b0f96b0bc80d434c';
	categoryL1['8']='4b394e8bb9f3309b6911a1ec1bbbd41c';
	categoryL1['55']='6a2b48d72cd8bea562a79aec3f0f5ef2';
	categoryL1['59']='4d21071c1b934e0475789d7c254c7dd6';
	categoryL1['13']='f54ae98312f845c7833294b0f82f56bd';
	categoryL1['46']='44676cee5d00be18df0988d386cf0032';
	categoryL1['48']='90e32b8cd5cb25aaa5085589359440ce';
	categoryL1['64']='d0e1335f67e3a531f5c697fc60ca70bf';
	categoryL1['10']='94586d7cfe72e2fa088463593d640b07';
	categoryL1['60']='5fc6553dd89e21c782325b8d168828bf';
	categoryL1['43']='fe7d8f134ebf64c14be098e2c04a957f';
	categoryL1['62']='22ead730e0b2a35344f458e8dc334fa7';
	categoryL1['32']='a4fc7b69d85d929adad6c027b1f13706';
	categoryL1['40']='46384159c4058f56b41540635f3d50dc';
	categoryL1['5']='8699638415e0a8ca9d0ea60fcf852224';
	categoryL1['7']='2f87c34de7d3aae364d8eb2af751ecbd';
	categoryL1['29']='65cb57e81888d09b8dd9173db4615c45';
	categoryL1['51']='9e76181bc945ac39e2bb9bbda2a85295';
	categoryL1['67']='b18b6d34b8b5bcd2b93a17f66178297f';
	categoryL1['15']='743622ed84b983f2b249dd29b2b6cd76';

	
	var bid='';
	bid=categoryL1[window.haomeitjyCategoryL1];
	if(!bid)
		bid=categoryL1[window.haomeitjyCategoryL2];
	if(bid){
		var hm = document.createElement("script");
		hm.src = "//hm.baidu.com/hm.js?"+bid;
		var s = document.getElementsByTagName("script")[0]; 
		s.parentNode.insertBefore(hm, s);
	}
	
	var hm = document.createElement("script");
	hm.src = "//hm.baidu.com/hm.js?2b45896872c704e67560d61087a22009";
	var s = document.getElementsByTagName("script")[0]; 
	s.parentNode.insertBefore(hm, s);
})();
