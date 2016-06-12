var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?e6c5919eb5e949442e153a907e828f3c";
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
	
	//执行无限加载公共类 必须在回调方法之下，请注意执行顺序
	getjs({
		url:'http://static.adx.haomeit.com/js/Glacier.js'
	,	callback:function(){
			/******************************************************
				var m=$G.model 广告展示方式公用类
				m.pic120X240	120X240浮动层展示
				
			level{
				1       一级丙等
				2       一级乙等
				3       一级甲等
				4       二级丙等
				5       二级乙等
				6       二级甲等
				7       三级丙等
				8       三级乙等
				9       三级甲等
				11      一级
				12      二级
				13      三级
			}
			*******************************************************/
			var dpDefHtml=new Array;
			dpDefHtml.push('<img src="http://static.adx.haomeit.com/static/images/yyk39/db/1.jpg" height="60" style=" float:left; " />');
			dpDefHtml.push('<img src="http://static.adx.haomeit.com/static/images/yyk39/db/2.jpg" height="60"  style=" float:left; " />');
			dpDefHtml.push('<img src="http://static.adx.haomeit.com/static/images/yyk39/db/3.jpg" height="60"  style=" float:left; " />');
			
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
						$G.log(domObj.id);
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
			var data={};
			
			$G.Config.www='http://jtysyyk.haomeit.com:7301';
			$G.Config.wwwImg='http://jtysyyk.haomeit.com/getPic/';
			var m=$G.model
			,	wwwUrl=$G.getid('url')||window.location+''
			,	ids=$G('.glacier')
			,	picIds=''
			,	strIds='T310E607866285790E050A8C005779A29,T310E607866295790E050A8C005779A29,T310E6078662A5790E050A8C005779A29,T310AF5BEBB7A78FCE050A8C005775FCA,T310AF5BEBB7B78FCE050A8C005775FCA,T310AF5BEBB7C78FCE050A8C005775FCA,T310AF5BEBB7D78FCE050A8C005775FCA,T310AF5BEBB7E78FCE050A8C005775FCA,T310AF5BEBB7F78FCE050A8C005775FCA,T310AF5BEBB8078FCE050A8C005775FCA,T310AF5BEBB8178FCE050A8C005775FCA,T310AF5BEBB8278FCE050A8C005775FCA,T310AF5BEBB8378FCE050A8C005775FCA'
			,	region=window.haomeitjyRegion||''
			,	level=''
			,	dept=''
			,	disease=''
			,	isZhuanke=0
			,	special=''
			,	wsize=$G.windowSize()
			,	xScroll=wsize.sw
			,	yScroll=wsize.sh
			,	leftList=new Array()
			;
			strIds='';
			ids.Each(function(){
				var obj=$G(this)
				,	name=obj.getAtt('glacier')
				,	isLong=(name+'').substr(0,1)
				;
				obj.setAtt('name',name);
				strIds+=','+name;
			});
			strIds=strIds.replace(',','');
			
			if(wwwUrl.indexOf('/area_')>-1){//http://yyk.familydoctor.com.cn/area_2_0_9_0_1.html
				var obj=wwwUrl.match(/_\d*/ig);
				dept=(obj[1]+'').replace(/_/ig,'');
				region=(obj[0]+'').replace(/_/ig,'');
				level=(obj[3]+'').replace(/_/ig,'');
				strIds='T310E607866285790E050A8C005779A29,T310E607866295790E050A8C005779A29,T310E6078662A5790E050A8C005779A29';
			}else if(wwwUrl.indexOf('/addarea_')>-1){
				var obj=wwwUrl.match(/_\d*/ig);
				dept=(obj[1]+'').replace(/_/ig,'');
				region=(obj[0]+'').replace(/_/ig,'');
				level=(obj[3]+'').replace(/_/ig,'');
			}else if(
				wwwUrl.indexOf('/category_')>-1//http://yyk.familydoctor.com.cn/category_4_2_7_0_1.html
			){
				var obj=wwwUrl.match(/_\d*/ig);
				dept=(obj[0]+'').replace(/_/ig,'');
				region=(obj[1]+'').replace(/_/ig,'');
				level=(obj[2]+'').replace(/_/ig,'');
				isZhuanke=(obj[3]+'').replace(/_/ig,'');
			}else if(wwwUrl.indexOf('/special_')>-1){//http://yyk.familydoctor.com.cn/special_5_2_6_0_1.html
				var obj=wwwUrl.match(/_\d*/ig);
				special=(obj[0]+'').replace(/_/ig,'');
				region=(obj[1]+'').replace(/_/ig,'');
				isZhuanke=(obj[3]+'').replace(/_/ig,'');
			}else if(wwwUrl.indexOf('/diseases_')>-1){//http://yyk.familydoctor.com.cn/diseases_4_5_4_d_1.html
				var obj=wwwUrl.match(/_\d*/ig);
				disease=(obj[0]+'').replace(/_/ig,'');
				region=(obj[1]+'').replace(/_/ig,'');
			}else if(wwwUrl.indexOf('/disease_')>-1){//http://yyk.familydoctor.com.cn/disease_9296_4_0_1_1.html
				var obj=wwwUrl.match(/_\d*/ig);
				disease=(obj[0]+'').replace(/_/ig,'');
				region=(obj[1]+'').replace(/_/ig,'');
				isZhuanke=(obj[3]+'').replace(/_/ig,'');
			}else if(wwwUrl.indexOf('/search')>-1){//http://yyk.familydoctor.com.cn/search?area=2&categoryId=4&level=8&page=1
				dept=$G.getid('categoryId');
				level=$G.getid('level');
				isZhuanke=$G.getid('order')||0;
				region=$G.getid('area');
				/*dept=$G.getQuery.call(wwwUrl,'categoryId');
				level=$G.getQuery.call(wwwUrl,'level');*/
				
			}else if(wwwUrl.indexOf('/reserve_')>-1){//http://yyk.familydoctor.com.cn/reserve_1_2_8_0_1.html
				var obj=wwwUrl.match(/_\d*/ig);
				dept=(obj[0]+'').replace(/_/ig,'');
				region=(obj[1]+'').replace(/_/ig,'');
				level=(obj[2]+'').replace(/_/ig,'');
				isZhuanke=(obj[3]+'').replace(/_/ig,'');
			}
								
			var htmlList=['<h3 class="summary"> <a target="_blank" href="<!--DISPLAY_URL-->"><!--CREATIVE_NAME--></a></h3>',
'  <div class="level"> <em><!--CREATIVE_APPEND_NAME-->&nbsp;&nbsp;推广</em></div>',
'  <div style="top:10px;" class="photo"> <a target="_blank" href="<!--DISPLAY_URL-->"><img width="135" height="100" src="<!--HOSPITAL_IMG-->"></a></div>',
'  <ul class="attribute">',
'    <li class="tel"><a target="_blank" href="<!--DISPLAY_URL-->">电话：<span><!--TEL--></span></a></li>',
'    <li style="width: 100%;height: 58px;overflow: hidden;"><!--CREATIVE_DESCRIPTION--></li>',
'    <li class="contrast"><a target="_blank" href="<!--MAP_URL-->">医院地址地图</a><a target="_blank" href="<!--TIME_URL-->">专家出诊时间</a><a target="_blank" href="<!--COMMENT_URL-->">网友评价</a><a class="zxyy" target="_blank" href="<!--ADVISORY_URL-->">在线预约</a> </li>',
'  </ul>'].join("");
			if(window.haomeitjyRegion){
				htmlList=['<div class="imgText_img"> <a target="_blank" href="<!--DISPLAY_URL-->"> <img width="90" height="70" alt="<!--CREATIVE_NAME-->" src="<!--HOSPITAL_IMG-->"></a> </div>',
'<div class="text">',
'  <h4><a target="_blank" title="<!--CREATIVE_NAME-->" href="<!--DISPLAY_URL-->"><!--CREATIVE_NAME--></a></h4>',
'  <p>医院电话：<!--TEL--></p>',
'</div>'].join("");
			}
			if($G.mobile){
				htmlList=['<dl>',
'  <dt><a href="<!--MOBILE_URL-->"> <img src="<!--HOSPITAL_IMG-->"></a></dt>',
'  <dd>',
'    <h3><a href="<!--MOBILE_URL-->"><!--CREATIVE_NAME--></a></h3>',
'    <p> <img src="http://img.familydoctor.com.cn/css/mobile/ku/yyk-new/images/tell.png"><!--TEL--><br>',
'      <a style="display: inline-block;width:90px;height:30px;line-height:30px;" class="comment-btn" href="<!--ADVISORY_URL-->">在线咨询</a></p>',
'  </dd>',
'</dl><dl><p> <a href="<!--MOBILE_URL-->"><!--CREATIVE_DESCRIPTION--></p>',
'</dl>'].join("");
			}
			var	TextFn=function(json){
				//跟据广告唯一标识判断是否有广告
				if(!json['creative_id']){
					return;
				}
				/*if((isZhuanke==0&&json.index<3)||(isZhuanke==1&&json.index>2&&json.index<6)){
					leftList.push(json);
				}*/
				if(json.index<3){
					leftList.push(json);
				}
				json['cabin']=json['placeId'];
				if(json.type==1 && region>0){
					json.display_url=$G.Trim('http://'+(json.display_url.replace((new RegExp('http://','ig')),'')));
					if(json.index==0)
						baiduFor&&baiduFor();
					var dfHtml=htmlList;
					$G.Each(function(i,k){
						dfHtml=$G.Config.wmReplace(dfHtml,'<!--'+k+'-->',this+'');
					},json);
					
					var dom=m.text(json)
					;
					dom.set(dfHtml).show();
					var showDom=$G('.'+json['cabin']);
					showDom[0].style.position='';
					showDom[0].style.display='';
					showDom[0].style.visibility='';
					showDom[0].style.top='';
					//$G.log(json['cabin']);
					//delete data[json['cabin']];
				}
			};
			$G.wm({
				cabin:strIds	//广告位标识
			,	addParam:{
					region:region||''
				,	level:level||''
				,	disease:disease||''
				,	special:special||''
				,	ip_addr:$G.getid('ip')||''
				}
			,	dept:dept
			,	style:'test.yyk.familydoctor.com.cn'//页面标识广告以哪种风格显示，便于日志数据分析
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
			,	callbackEach:function(n,jsonList){
					/*if(isZhuanke==1){
						var l=jsonList.data.length;
						var k=0;
						$G.Each(function(i,v){
							if(i<3||l>10)return;
							if(k<3&&i>=l){
								var name=this+''
								,	json=jsonList.data[k]||false
								;
								k++;
								if(json===false){
									k=3;
									return;
								}
								json['cabin']=json['placeId']=json['creative_id']=name;
								json['index']=i;
								json['type']=1;
								TextFn(json);
							}
						},(strIds.split(',')));
					}*/
					var strHtml=''
					,	html=''
					,	strRigthHtml=''
					,	rigthHtml=''
					;
					if(!window.haomeitjyRegion&&leftList.length>0){
						setInterval(function(){
							$G('iframe').none();
						}, 300);
						if($G.mobile){
							strHtml=['<div style="position:fixed; bottom:0; left:0; width:100%;font-family:Microsoft YaHei; text-align:center; overflow:hidden;background:#585858;height:60px;"><!--html--></div>'].join("");
							html=['<p style="width:33%; float:left; margin:0; height:60px;"><a target="_blank" href="<!--MOBILE_URL-->" style="text-decoration:none;"><em style=" font-size:16px; color:#fff; height:30px; line-height:30px; text-align:center; text-decoration:none; font-style:normal; width:100%; display:block; overflow:hidden;"><!--CREATIVE_NAME--></em></a><a target="_blank" href="<!--ADVISORY_URL-->" style="text-decoration:none;"><span style="display:block; width:90px; margin:0 auto; background:#3f9fcf; padding:3px 0; font-size:14px; color:#fff;border-radius:5px; ">在线咨询</span></a></p>'].join("");
						}else{
							strHtml=['<div class="fDoctorBox" style=" border-bottom:2px solid #3983e5;width:auto; height:auto; overflow:hidden; font-size:12px;background-color:#3983e5;  font-family:微软雅黑; ">',
	'  <div class="title show" style="width:200px; height:36px; overflow:hidden; background-color:#3983e5; position:relative;">',
	'    <h3 style="color:#FFF; margin:0; height:36px; line-height:36px; margin-left:40px; font-size:14px;">特约专家在线问诊</h3>',
	'    <span class="hot" style="position:absolute;left:0;top:0;width:36px;height:36px;background:url(http://img.familydoctor.com.cn/images/dianxianzaixianyisheng/hot_bg.png) no-repeat;text-indent:-9999px;">hot</span> </div><!--html--></div>'].join("");
							html=['<div class="doctor" style="width:auto; height:auto; overflow:hidden; padding:10px 7px 10px 7px; background-color:#fff; border-left:2px solid #3983e5; border-right:2px solid #3983e5;"> <a target="_blank" href="<!--advisory_url-->" style="text-decoration:none; color:#4c4c4c;">',
	'  <dl style="margin:0;">',
	'    <dt style="width:auto; height:65px; overflow:hidden; float:left;"><img alt="<!--DOCTORS_NAME-->" src="<!--DOCTORS_IMG-->" style="width:50px; height:65px;"></dt>',
	'    <dd style="margin-left:60px; width:126px; _width:122px; height:65px;"> <span style="display:block; width:126px; _width:122px; height:20px; overflow:hidden;line-height:20px; color:#4c4c4c; margin-top:2px;"><em class="freeZX" style="display:block; width:60px; height:20px; float:right; background:url(http://img.familydoctor.com.cn/images/dianxianzaixianyisheng/btns.png) no-repeat 0 0; font-style:normal;"></em><em style=" font-style:normal;" class="DCName"><!--DOCTORS_NAME--></em></span> <span style="display:block; width:126px; _width:122px; height:20px; overflow:hidden;line-height:20px; color:#4c4c4c; margin-top:2px;"><!--DOCTORS_DESCRIPTION--></span> <span style="display:block; width:126px; _width:122px; height:20px; overflow:hidden;line-height:20px; color:#4c4c4c; margin-top:2px;"><em style=" font-style:normal;color:#808080; font-weight:normal;" class="yiyuan"><!--CREATIVE_NAME--></em></span> </dd>',
	'  </dl>',
	'  </a> </div>'].join("");
							
							strRigthHtml=['<div class="fDoctorBox" style=" border-bottom:2px solid #3983e5;width:auto; height:auto; overflow:hidden; font-size:12px;background-color:#3983e5;  font-family:微软雅黑; ">',
	'  <div class="title show" style="width:200px; height:36px; overflow:hidden; background-color:#3983e5; position:relative;">',
	'    <h3 style="color:#FFF; margin:0; height:36px; line-height:36px; margin-left:40px; font-size:14px;">推荐医院</h3>',
	'    <span class="hot" style="position:absolute;left:0;top:0;width:36px;height:36px;background:url(http://img.familydoctor.com.cn/images/dianxianzaixianyisheng/hot_bg.png) no-repeat;text-indent:-9999px;">hot</span> </div><!--html--></div>'].join("");
							rigthHtml=['<div style="width:auto; height:auto; overflow:hidden; padding:10px 7px 10px 7px; background-color:#fff; border-left:2px solid #3983e5; border-right:2px solid #3983e5;" class="doctor">',
'  <dl style="margin:0;">',
'    <dt style="width:auto; height:65px; overflow:hidden; float:left;"><a style="text-decoration:none; color:#4c4c4c;" href="<!--advisory_url-->" target="_blank"><img style="width:90px; height:60px;" src="<!--HOSPITAL_IMG-->" alt="<!--CREATIVE_NAME-->"></a></dt>',
'    <dd style="margin-left:100px; width:86px; _width:82px; height:65px;"> <a style="text-decoration:none; color:#4c4c4c;" href="<!--ADVISORY_URL-->" target="_blank"><span style="display:block; width:86px; _width:82px; height:20px; overflow:hidden;line-height:20px; color:#4c4c4c; margin-top:2px;"><em class="DCName" style=" font-style:normal;"><!--CREATIVE_NAME--></em></span> <span style="display:block; width:86px; _width:82px; height:20px; overflow:hidden;line-height:20px; color:#4c4c4c; margin-top:2px;"><!--TEL--></span> <span style="display:block; width:86px; _width:82px; height:20px; overflow:hidden;line-height:20px; color:#4c4c4c; margin-top:2px;"><em style="display:block; width:60px; height:20px; float:right; background:url(http://static.adx.haomeit.com/static/jiatingyisheng.com/btnss.png) no-repeat 0 0; font-style:normal;" class="freeZX"></em></span> </a></dd>',
'  </dl>',
'</div>',
].join("");
							;
							
						}
						var htmlList=''
						,	htmlRigthList=''
						;
						$G.Each(function(){
							var dfHtml=html;
							var dfRigthHtml=rigthHtml;
							$G.Each(function(i,k){
								dfHtml=$G.Config.wmReplace(dfHtml,'<!--'+k+'-->',this+'');
								dfRigthHtml=$G.Config.wmReplace(dfRigthHtml,'<!--'+k+'-->',this+'');
							},this)
							htmlList+=dfHtml;
							htmlRigthList+=dfRigthHtml;
						},leftList)
						
						if($G.mobile&&leftList.length<3){
							var herfWebIm=leftList[leftList.length-1];
							for(var i=leftList.length;i<3;i++){
								var dfHtml=html;
								dfHtml='<p style="width:33%; float:left; margin:0; height:60px;"><a target="_blank" href="'+herfWebIm.advisory_url+'" style="text-decoration:none;">'+dpDefHtml[i]+'</a></p>';
								htmlList+=dfHtml;
							}
							
						}
						//strHtml=$G.Config.wmReplace(strHtml,'<!--html-->',htmlList);
						
						if($G.mobile){
							dom=m.pic({
								href:'fdfd'//广告目标网址
							,	src:'dfdf'//广告图片SRC
							,	imgSize:xScroll+'X60'
							,	cabin:'aaa'
							,	dfHtml:$G.Config.wmReplace(strHtml,'<!--html-->',htmlList)+''
							});
							dom.show({
								position:'fixed',
								isBottom:true,
								isLeft:true
							});
						}else if(window.haomeitPublicHospitals!=true){
							dom=m.pic({
								href:'fdfd'//广告目标网址
							,	src:'dfdf'//广告图片SRC
							,	imgSize:'204X300'
							,	cabin:'aaa'
							,	dfHtml:$G.Config.wmReplace(strHtml,'<!--html-->',htmlList)+''
							});
							dom.show({
								position:'fixed',
								isYCenter:true,
								isLeft:true
							});
							
							
							dom=m.pic({
								href:'fdfd'//广告目标网址
							,	src:'dfdf'//广告图片SRC
							,	imgSize:'204X300'
							,	cabin:'aaa'
							,	dfHtml:$G.Config.wmReplace(strRigthHtml,'<!--html-->',htmlRigthList)+''
							});
							dom.show({
								position:'fixed',
								isYCenter:true,
								isRight:true
							});
						}
					}
				}
			});
			
			/************************结束*********************************/
			
		}
		
		
	});
})();
