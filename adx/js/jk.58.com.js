window.$G=window.$G||{wm:function(){},Version:0};
window.document.write(['<iframe scrolling="auto" frameborder="0" id="hPageFrm" name="hPageFrm" style="width:100%;display:none;"></iframe>'].join(""));

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
							$G(hPageFrm).WinAlt(int);
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
			
			var dxShow=function(cn,o){
				o=o||{};
				var d={};
				d['陕西']={
					'img1':'http://xakj.913wen.com/images/qqq111.gif'//中间
				,	'webim':'http://dlt.zoosnet.net/LR/Chatpre.aspx?id=DLT87827839&lng=cn&e=lc-hmt-85&r=lc-hmt-85&p=lc-hmt-85'
				};
				d['云南']={
					'img1':'http://xakj.913wen.com/images/kmdx/qqq111.gif'
				,	'webim':'http://dat.zoosnet.net/LR/Chatpre.aspx?id=DAT50342982&lng=cn&e=lc-hmt-dx-85&r=lc-hmt-dx-85&p=lc-hmt-dx-85'
				};
				d['黑龙江']={
					'img1':'http://xakj.913wen.com/images/heilj/qqq111.gif'
				,	'webim':'http://dgt.zoosnet.net/LR/Chatpre.aspx?id=DGT82181361&lng=cn&e=lc-hmt-85&r=lc-hmt-85&p=lc-hmt-85'
				};
				d['广东']={
					'img1':'http://gzxj.haomeit.com/templets/default/images/qqq111.gif'
				,	'webim':'http://det.zoosnet.net/LR/Chatpre.aspx?id=DET27952501&e=lc_gzdx(2bu)+w&r=lc_gzdx(2bu)+w&p=lc_gzdx(2bu)+w'
				};
				d['上海']={
					'img1':'http://js.ufstone.net/images/qqq111.gif'
				,	'webim':'http://phw.twos.net.cn/LR/Chatpre.aspx?id=phw28129993&lng=cn&r=lc(2bu)+w&p=lc(2bu)+w&e=lc(2bu)+w'
				};
				d['北京']={
					'img1':'http://js.ufstone.net/images/qqq111.gif'
				,	'webim':''
				};
				d['其他']={
					'img1':'http://js.ufstone.net/images/qqq111.gif'
				,	'webim':'http://phw.twos.net.cn/LR/Chatpre.aspx?id=phw28129993&lng=cn&r=lc(2bu)+w&p=lc(2bu)+w&e=lc(2bu)+w'
				};
				var html=['<!--左弹窗-->',
		
				'<!--中间弹窗-->',
				'  <div id="<!--uuid-->_3" style="width: 495px; _width:650px; height:330px; _height:430px; overflow:hidden; position:relative; z-index: 900;">',
				'<div style="position:absolute; top:0px; _top:100px; left:0px; _left:140px; z-index:903;"> <a href="<!--webim-->" target="_blank"><img border="0" src="<!--img1-->"></a> </div>',
				'    <div style="position:absolute; top:0px; _top:100px; left:410px; _left:612px; z-index:904;"> <a name="close" href="javascript:;"><img src="http://www.dxjk120.com/images/closebtn.gif" border="0"></a> </div>',
				'  </div>',
			
				'<!--底部QQ弹窗-->',
				'<div id="<!--uuid-->_5" style="width:218px;">',
				'  <div style="width: 214px; height: 124px;"> <img src="http://js.ufstone.net/images/www58dx_tc.jpg" border="0" usemap="#winMap" id="win" style="position: relative; border: 0px; z-index: 100; top: 0px; left: 0px;">',
				'    <map name="winMap" id="winMap">',
				'      <area name="close" rea shape="rect" coords="177,3,215,21" href="javascript:;">',
				'      <area target="_blank" rea shape="rect" coords="4,31,210,115" href="<!--webim-->">',
				'    </map>',
				'  </div>',
				'</div>'].join("");
				var div=document.createElement('div')
				,	uuid=$G.uuidFast().replace(/-/ig,'')
				;
				html=$G.Config.wmReplace(html,'<!--uuid-->',uuid);
				$G.Each(function(i,k){
					html=$G.Config.wmReplace(html,'<!--'+k+'-->',this+'');
				},d[cn]);
				div.innerHTML=html;
				document.body.appendChild(div);
				
				var int1={
						position:'fixed',
						isTop:true,
						isLeft:true
					}
				,	int2={
						position:'fixed',
						isTop:true,
						isRight:true
					}
				,	int3={
						position:'fixed',
						isCenter:true
					}
				,	int4={
						position:'fixed',
						isBottom:true,
						isLeft:true
					}
				,	int5={
						position:'fixed',
						isBottom:true,
						isRight:true
					}
				;
				
				var domDiv1=$G('#'+uuid+'_1',div);
				domDiv1.WinAlt(int1);
				$G('.close',domDiv1[0]).click(function(){
					domDiv1.display().none();
				});
				var domDiv2=$G('#'+uuid+'_2',div);
				domDiv2.WinAlt(int2);
				$G('.close',domDiv2[0]).click(function(){
					domDiv2.display().none();
				});
				var domDiv3=$G('#'+uuid+'_3',div);
				domDiv3.WinAlt(int3);
				$G('.close',domDiv3[0]).click(function(){
					domDiv3.display().none();
					var stime = setInterval(function(){
							domDiv3.display().block();
							clearTimeout(stime);
					},10000);
				});
				var domDiv4=$G('#'+uuid+'_4',div);
				domDiv4.WinAlt(int4);
				$G('.close',domDiv4[0]).click(function(){
					domDiv4.display().none();
				});
				var domDiv5=$G('#'+uuid+'_5',div);
				domDiv5.WinAlt(int5);
				$G('.close',domDiv5[0]).click(function(){
					domDiv5.display().none();
				});
				var eff=new $G.eff(domDiv5);
				eff.shake();
			};
			var dxFn=function(){
				$G.getjs({url:'http://pv.sohu.com/cityjson?ie=utf-8'});
				loadFn(function(){
					try{
						var cname=returnCitySN['cname']||'';
						if(cname){
							if(cname.indexOf("陕西")>-1){
								dxShow('陕西');
							}else if(cname.indexOf("甘肃")>-1){
								dxShow('陕西');
							}else if(cname.indexOf("宁夏")>-1){
								dxShow('陕西');
							}else if(cname.indexOf("青海")>-1){
								dxShow('陕西');
							}else if(cname.indexOf("广东")>-1){
								dxShow('广东');
							}else if(cname.indexOf("广西")>-1){
								dxShow('广东');
							}else if(cname.indexOf("黑龙江")>-1){
								dxShow('黑龙江');
							}else if(cname.indexOf("云南")>-1){
								dxShow('云南');
							}else if(cname.indexOf("贵州")>-1){
								dxShow('云南');
							}else if(cname.indexOf("上海")>-1){
								dxShow('上海');
							}else if(cname.indexOf("海南")>-1){
								dxShow('上海');
							}else if(cname.indexOf("福建")>-1){
								dxShow('上海');
							}else if(cname.indexOf("北京")>-1){
								dxShow('北京');
							}else{
								dxShow('其他');
							}
						}
					}catch(e){
					}
					
				},function(){
					if((typeof returnCitySN)=='object'){
						return true;
					}else
						return false;
				});
			};
			
			var dxMShow=function(cn,o){
				o=o||{};
				var d={};
				d['西安']={
				'img1':'http://js.ufstone.net/images/www58dx_tc.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
				,	'webim':'http://dlt.zoosnet.net/LR/Chatpre.aspx?id=DLT87827839&lng=cn&e=lc-hmt-85&r=lc-hmt-85&p=lc-hmt-85'
				};
				d['云南']={
					'img1':'http://js.ufstone.net/images/www58dx_tc.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
		
				,	'webim':'http://dat.zoosnet.net/LR/Chatpre.aspx?id=DAT50342982&lng=cn&e=lc-hmt-dx-85&r=lc-hmt-dx-85&p=lc-hmt-dx-85'
				};
				d['黑龙江']={
					'img1':'http://js.ufstone.net/images/www58dx_tc.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
		
				,	'webim':'http://dgt.zoosnet.net/LR/Chatpre.aspx?id=DGT82181361&lng=cn&e=lc-hmt-85&r=lc-hmt-85&p=lc-hmt-85'
				};
				d['广东']={
					'img1':'http://js.ufstone.net/images/www58dx_tc.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
		
				,	'webim':'http://det.zoosnet.net/LR/Chatpre.aspx?id=DET27952501&e=lc_gzdx(2bu)+w&r=lc_gzdx(2bu)+w&p=lc_gzdx(2bu)+w'
				};
				d['上海']={
					'img1':'http://js.ufstone.net/images/www58dx_tc.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
		
				,	'webim':'http://phw.twos.net.cn/LR/Chatpre.aspx?id=phw28129993&lng=cn&r=lc(2bu)+w&p=lc(2bu)+w&e=lc(2bu)+w'
				};
				d['北京']={
					'img1':'http://js.ufstone.net/images/www58dx_tc.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
		
				,	'webim':''
				};
				d['其他']={
					'img1':'http://js.ufstone.net/images/www58dx_tc.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
		
				,	'webim':'http://phw.twos.net.cn/LR/Chatpre.aspx?id=phw28129993&lng=cn&r=lc(2bu)+w&p=lc(2bu)+w&e=lc(2bu)+w'
				};
				var html=['<!--左弹窗-->',
				'<div id="<!--uuid-->_1" style="left: 2px; position: absolute; top: 200px; width: 165px; height: 440px;"> <a target="_blank"  href="<!--webim-->"> <img src="<!--img3-->" width="50" height="150"> </a> </div>',
				
				'<!--中间弹窗-->',
				'  <div id="<!--uuid-->_3" style="width: 240px; _width:240px; height:120px; _height:120px; overflow:hidden; position:relative; z-index: 900;">',
				'<div style="position:absolute; top:0px; _top:100px; left:0px; _left:140px; z-index:903;"> <a href="<!--webim-->" target="_blank"><img border="0" src="<!--img1-->"></a> </div>',
				'    <div style="position:absolute; top:0px; _top:100px; left:190px; _left:612px; z-index:904;"> <a name="close" href="javascript:;"><img src="http://www.dxjk120.com/images/closebtn.gif" border="0"></a> </div>',
				'  </div>',
			
		
				'    <map name="winMap" id="winMap">',
				'      <a name="close" rea shape="rect" coords="177,3,215,21" href="javascript:;">',
				'      <a target="_blank" rea shape="rect" coords="4,31,210,115" href="<!--webim-->">',
				'    </map>',
				'  </div>',
				'</div>'].join("");
				var div=document.createElement('div')
				,	uuid=$G.uuidFast().replace(/-/ig,'')
				;
				html=$G.Config.wmReplace(html,'<!--uuid-->',uuid);
				$G.Each(function(i,k){
					html=$G.Config.wmReplace(html,'<!--'+k+'-->',this+'');
				},d[cn]);
				div.innerHTML=html;
				document.body.appendChild(div);
				
				var int1={
						position:'fixed',
						isTop:true,
						isLeft:true
					}
				,	int2={
						position:'fixed',
						isTop:true,
						isRight:true
					}
				,	int3={
						position:'fixed',
						isCenter:true
					}
				,	int4={
						position:'fixed',
						isBottom:true,
						isLeft:true
					}
				,	int5={
						position:'fixed',
						isBottom:true,
						isRight:true
					}
				;
				var domDiv1=$G('#'+uuid+'_1',div);
				domDiv1.WinAlt(int1);
				$G('.close',domDiv1[0]).click(function(){
					domDiv1.display().none();
				});
				/*var domDiv2=$G('#'+uuid+'_2',div);
				domDiv2.WinAlt(int2);
				$G('.close',domDiv2[0]).click(function(){
					domDiv2.display().none();
				});*/
				var domDiv3=$G('#'+uuid+'_3',div);
				domDiv3.WinAlt(int5);
				$G('.close',domDiv3[0]).click(function(){
					domDiv3.display().none();
					var stime = setInterval(function(){
							domDiv3.display().block();
							clearTimeout(stime);
					},10000);
				});
				var eff=new $G.eff(domDiv3);
				eff.shake();
				/*var domDiv4=$G('#'+uuid+'_4',div);
				domDiv4.WinAlt(int4);
				$G('.close',domDiv4[0]).click(function(){
					domDiv4.display().none();
				});
				var domDiv5=$G('#'+uuid+'_5',div);
				var dd5Dom=domDiv5.WinAlt(int5);
				$G('.close',domDiv5[0]).click(function(){
					domDiv5.display().none();
				});
				var eff=new $G.eff($G('#'+uuid+'_5',div));
				eff.shake();*/
			};
			var dxMFn=function(){
				$G.getjs({url:'http://pv.sohu.com/cityjson?ie=utf-8'});
				loadFn(function(){
					try{
						var cname=returnCitySN['cname']||'';
						if(cname){
							if(cname.indexOf("陕西")>-1){
								dxMShow('陕西');
							}else if(cname.indexOf("甘肃")>-1){
								dxMShow('陕西');
							}else if(cname.indexOf("宁夏")>-1){
								dxMShow('陕西');
							}else if(cname.indexOf("青海")>-1){
								dxMShow('陕西');
							}else if(cname.indexOf("广东")>-1){
								dxMShow('广东');
							}else if(cname.indexOf("广西")>-1){
								dxMShow('广东');
							}else if(cname.indexOf("黑龙江")>-1){
								dxMShow('黑龙江');
							}else if(cname.indexOf("云南")>-1){
								dxMShow('云南');
							}else if(cname.indexOf("贵州")>-1){
								dxMShow('云南');
							}else if(cname.indexOf("上海")>-1){
								dxMShow('上海');
							}else if(cname.indexOf("海南")>-1){
								dxMShow('上海');
							}else if(cname.indexOf("福建")>-1){
								dxMShow('上海');
							}else if(cname.indexOf("北京")>-1){
								dxMShow('北京');
							}else{
								dxMShow('其他');
							}
						}
					}catch(e){
					}
					
				},function(){
					if((typeof returnCitySN)=='object'){
						return true;
					}else
						return false;
				});
			};
			
			
			var xbShow=function(cn,o){
				o=o||{};
				var d={};
				d['陕西']={
					'img1':'http://js.ufstone.net/images/xbswt.gif'//中间
				,	'webim':'http://lzt.zoossoft.net/LR/chatwin.aspx?id=LZT36568760&lng=cn&p=mmc2015&e=mmc2015&r=mmc2015'
				};
				d['其他']={
					'img1':'http://js.ufstone.net/images/xbswt.gif'
				,	'webim':'http://lzt.zoossoft.net/LR/chatwin.aspx?id=LZT36568760&lng=cn&p=mmc2015&e=mmc2015&r=mmc2015'
				};
				var html=['<!--左弹窗-->',
		
				'<!--中间弹窗-->',
				'  <div id="<!--uuid-->_3" style="width: 495px; _width:650px; height:330px; _height:430px; overflow:hidden; position:relative; z-index: 900;">',
				'<div style="position:absolute; top:0px; _top:100px; left:0px; _left:140px; z-index:903;"> <a href="<!--webim-->" target="_blank"><img border="0" src="<!--img1-->"></a> </div>',
				'    <div style="position:absolute; top:0px; _top:100px; left:410px; _left:612px; z-index:904;"> <a name="close" href="javascript:;"><img src="http://www.dxjk120.com/images/closebtn.gif" border="0"></a> </div>',
				'  </div>',
			
				'<!--底部QQ弹窗-->',
				'<div id="<!--uuid-->_5" style="width:218px;">',
				'  <div style="width: 214px; height: 124px;"> <img src="http://js.ufstone.net/images/xb214.jpg" border="0" usemap="#winMap" id="win" style="position: relative; border: 0px; z-index: 100; top: 0px; left: 0px;">',
				'    <map name="winMap" id="winMap">',
				'      <area name="close" rea shape="rect" coords="177,3,215,21" href="javascript:;">',
				'      <area target="_blank" rea shape="rect" coords="4,31,210,115" href="<!--webim-->">',
				'    </map>',
				'  </div>',
				'</div>'].join("");
				var div=document.createElement('div')
				,	uuid=$G.uuidFast().replace(/-/ig,'')
				;
				html=$G.Config.wmReplace(html,'<!--uuid-->',uuid);
				$G.Each(function(i,k){
					html=$G.Config.wmReplace(html,'<!--'+k+'-->',this+'');
				},d[cn]);
				div.innerHTML=html;
				document.body.appendChild(div);
				
				var int1={
						position:'fixed',
						isTop:true,
						isLeft:true
					}
				,	int2={
						position:'fixed',
						isTop:true,
						isRight:true
					}
				,	int3={
						position:'fixed',
						isCenter:true
					}
				,	int4={
						position:'fixed',
						isBottom:true,
						isLeft:true
					}
				,	int5={
						position:'fixed',
						isBottom:true,
						isRight:true
					}
				;
				
				var domDiv1=$G('#'+uuid+'_1',div);
				domDiv1.WinAlt(int1);
				$G('.close',domDiv1[0]).click(function(){
					domDiv1.display().none();
				});
				var domDiv2=$G('#'+uuid+'_2',div);
				domDiv2.WinAlt(int2);
				$G('.close',domDiv2[0]).click(function(){
					domDiv2.display().none();
				});
				var domDiv3=$G('#'+uuid+'_3',div);
				domDiv3.WinAlt(int3);
				$G('.close',domDiv3[0]).click(function(){
					domDiv3.display().none();
					var stime = setInterval(function(){
							domDiv3.display().block();
							clearTimeout(stime);
					},10000);
				});
				var domDiv4=$G('#'+uuid+'_4',div);
				domDiv4.WinAlt(int4);
				$G('.close',domDiv4[0]).click(function(){
					domDiv4.display().none();
				});
				var domDiv5=$G('#'+uuid+'_5',div);
				domDiv5.WinAlt(int5);
				$G('.close',domDiv5[0]).click(function(){
					domDiv5.display().none();
				});
				var eff=new $G.eff(domDiv5);
				eff.shake();
			};
			var xbFn=function(){
				$G.getjs({url:'http://pv.sohu.com/cityjson?ie=utf-8'});
				loadFn(function(){
					try{
						var cname=returnCitySN['cname']||'';
						if(cname){
							if(cname.indexOf("陕西")>-1){
								xbShow('陕西');
							}else{
								xbShow('其他');
							}
						}
					}catch(e){
					}
					
				},function(){
					if((typeof returnCitySN)=='object'){
						return true;
					}else
						return false;
				});
			};
			
			var sbMShow=function(cn,o){
				o=o||{};
				var d={};
				d['陕西']={
				'img1':'http://js.ufstone.net/images/xb214.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
				,	'webim':'http://lzt.zoossoft.net/LR/chatwin.aspx?id=LZT36568760&lng=cn&p=mmc2015&e=mmc2015&r=mmc2015'
				};
				d['其他']={
					'img1':'http://js.ufstone.net/images/xb214.jpg'//中间
				,	'img3':'http://xakj.913wen.com/images/swt1.gif'//左	
		
				,	'webim':'http://lzt.zoossoft.net/LR/chatwin.aspx?id=LZT36568760&lng=cn&p=mmc2015&e=mmc2015&r=mmc2015'
				};
				var html=['<!--左弹窗-->',
				'<div id="<!--uuid-->_1" style="left: 2px; position: absolute; top: 200px; width: 165px; height: 440px;"> <a target="_blank"  href="<!--webim-->"> <img src="<!--img3-->" width="50" height="150"> </a> </div>',
				
				'<!--中间弹窗-->',
				'  <div id="<!--uuid-->_3" style="width: 240px; _width:240px; height:120px; _height:120px; overflow:hidden; position:relative; z-index: 900;">',
				'<div style="position:absolute; top:0px; _top:100px; left:0px; _left:140px; z-index:903;"> <a href="<!--webim-->" target="_blank"><img border="0" src="<!--img1-->"></a> </div>',
				'    <div style="position:absolute; top:0px; _top:100px; left:190px; _left:612px; z-index:904;"> <a name="close" href="javascript:;"><img src="http://www.dxjk120.com/images/closebtn.gif" border="0"></a> </div>',
				'  </div>',
			
		
				'    <map name="winMap" id="winMap">',
				'      <a name="close" rea shape="rect" coords="177,3,215,21" href="javascript:;">',
				'      <a target="_blank" rea shape="rect" coords="4,31,210,115" href="<!--webim-->">',
				'    </map>',
				'  </div>',
				'</div>'].join("");
				var div=document.createElement('div')
				,	uuid=$G.uuidFast().replace(/-/ig,'')
				;
				html=$G.Config.wmReplace(html,'<!--uuid-->',uuid);
				$G.Each(function(i,k){
					html=$G.Config.wmReplace(html,'<!--'+k+'-->',this+'');
				},d[cn]);
				div.innerHTML=html;
				document.body.appendChild(div);
				
				var int1={
						position:'fixed',
						isTop:true,
						isLeft:true
					}
				,	int2={
						position:'fixed',
						isTop:true,
						isRight:true
					}
				,	int3={
						position:'fixed',
						isCenter:true
					}
				,	int4={
						position:'fixed',
						isBottom:true,
						isLeft:true
					}
				,	int5={
						position:'fixed',
						isBottom:true,
						isRight:true
					}
				;
		
			};
			var xbMFn=function(){
				$G.getjs({url:'http://pv.sohu.com/cityjson?ie=utf-8'});
				loadFn(function(){
					try{
						var cname=returnCitySN['cname']||'';
						if(cname){
							if(cname.indexOf("陕西")>-1){
								sbMShow('陕西');
							}else{
								sbMShow('其他');
							}
						}
					}catch(e){
					}
					
				},function(){
					if((typeof returnCitySN)=='object'){
						return true;
					}else
						return false;
				});
			};
			
			$G.wm({
				cabin:'TL1PQ2V2576O2R' 	//广告位标识
			,	style:'jk.58.com.20150901'//页面标识广告以哪种风格显示，便于日志数据分析
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
					var metaKey=$G('.keywords .Keywords')
					,	v=''
					;
					metaKey.Each(function(){
						v+=$G(this).getAtt('content');
					});
					if(v.indexOf('癫痫')>=0){
						if($G.mobile){
							dxMFn();
						}else{
							dxFn();
						}
					}else if(v.indexOf('尖锐湿疣')>=0||v.indexOf('性病')>=0||v.indexOf('疱疹')>=0){
						/*if($G.mobile){
							xbMFn();
						}else{
							xbFn();
						}*/
					}
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
						if(json.index==0&&1==2){
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
				cabin:'TI213HG34CAS1L' 	//广告位标识
			,	style:'pic.jk.58.com.20150901'//页面标识广告以哪种风格显示，便于日志数据分析
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