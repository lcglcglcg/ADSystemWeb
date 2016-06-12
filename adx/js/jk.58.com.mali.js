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
						var h=['<p style="text-align:right;height:14px;line-height:14px;padding:5px;margin:0;"><a name="jiankang58WinClose" style="height:14px;width:14px;overflow: hidden;display: inline-block;*zoom:1;*display: inline;margin:0;padding:0;outline:0;border:0;"></a></p>',
'  <p style="text-align:right;height:66px;line-height:66px;padding:121px 47px 0 0;margin:0;"><a href="<!--webIM_Url-->" target="_blank" style="height:66px;width:188px;display:inline-block;*zoom:1;*display: inline;margin:0;padding:0;outline:0;border:0;"></a></p>'].join("")
						,	int={
								position:'fixed',
								isCenter:true
							}
						,	div=document.createElement('div')
						;
						
						$G.Each(function(i,k){
							h=$G.Config.wmReplace(h,'<!--'+k+'-->',this+'');
						},json);
						div.style.cssText='width:400px;height:240px;overflow:hidden;background: url(http://static.adx.haomeit.com/images/popup.png) no-repeat center;z-index:99999999;padding:0;';
						div.innerHTML=h;
						document.body.appendChild(div);
						var domDiv=$G(div);
						domDiv.WinAlt(int);
						$G('.jiankang58WinClose',div).click(function(){
							domDiv.display().none();
							setTimeout(function(){
								domDiv.WinAlt(int);
							},10*1000);
						});
					}
				}
			;
			$G.wm({
				cabin:'TL1PQ2V2576O2R' 	//广告位标识
			,	style:'jk.58.com.20150914'//页面标识广告以哪种风格显示，便于日志数据分析
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
			
		}
	});
})();