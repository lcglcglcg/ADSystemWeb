/*
* Name		: Glacier 1.0 -wangmeng
* Author	: wangzheng
* QQ		: 113666386
* Date		: 2014-01-09 18:00
* desc		: JS公用类
*/
(function(){
	/*
	* $G类
	* selector参数 selector=function时，为页面初始化后调用此方法
	*			  selector=String时，
					1、#为查找ID
					2、.为查找名称
					3、li:open为查找DOM（LI）对象class名称为open的对象
					4、li:gjson:names为查找DOM（LI）对象gjson属性的值为names的对象
					5、LI为直接输入对象类型查找
	* dom,当selector为方法时，dom如果不为空，则为页面DOM加载完毕后运行，如果为空，则为页面初始化后运行
	*	  当selector为字符时，dom为被查找对象的范围，如果为空，范围则为全部
	*/
	var Glacier=(!window.$G || window.$G.Version<1.0)?function(selector,dom){
		this.selector=selector;
		if(window==this) return new Glacier(selector,dom);
		if (Glacier.isFun(selector)){
			if(!dom)
				this.Loaded(selector);
			else
				this.LoadedDom(selector);
			return new Glacier();
		}
		if(!Glacier.isObj(dom)) dom=window.document;
		if(selector && (typeof selector=="object") && selector.nodeType==1){
			this[0]=selector;
			this.length=1;
			return this;
		}
		var listDoms=[],domsTag=[],doms,name=new Array();
		if(typeof selector=="string"){
			var str = (" "+selector+" ".replace(/\s{2}/," ")).match(Glacier.fn.Exp.GlacierExpr);
			str=str||[];
			for(var i=0,n=str.length;i<n;i++){
				var s=str[i];
				if(s.indexOf(".")>=0){
					name.push([s.replace(/^\s*\.|\s/ig,"")]);
				}else if(s.indexOf("#")>=0){
					var obj=window.document.getElementById(s.replace(/^\s*#|\s/ig,""));
					obj && listDoms.push(obj);
				}else{
					var re=/[a-zA-Z:]/g,tag=s.replace(/\s/ig,"");
					if(re.test(tag)){
					}else
						continue;
					re.lastIndex=0;//lastIndex属性，返回匹配内容的最后一个索引位置，也就是下一个匹配的开始位置，注意字符串索引从0开始
					
					var tagarray=tag.split(":")
					,	findStr=tagarray[0]
					,	findTag=''
					,	findVal=''
					;
					if(tagarray.length>2){
						findTag=(tagarray[1]+'').toLowerCase();
						findVal=tagarray[2];
					}else if(tagarray.length>1){
						findTag='class';
						findVal=(tagarray[1]+'').toLowerCase();
					}
					doms=dom.getElementsByTagName(findStr);
					for(var iobj=0,div_n=doms.length;iobj<div_n;iobj++){
						var obj=doms[iobj];
						if(!Glacier.isNaN(findTag)){
							var tmpTag=(obj.getAttribute(findTag)+'').toLowerCase();
							if(Glacier.isNaN(tmpTag)) continue;
							if(tmpTag==findVal){
								obj && listDoms.push(obj);
							}
						}else{
							obj && listDoms.push(obj);
						}
						
					}
				}				
			}
		}
		if(name.length>0){
			var isTag=(Glacier.isIE || dom!=window.document);
			try{
				if(isTag)doms=dom.getElementsByTagName("*");
			}catch(e){
				//alert(dom+'|'+selector+'='+e);
				return;
			}
			
			for(var i=0,countName=name.length;i<countName;i++){
				if(!Glacier.isIE && dom==window.document) doms=dom.getElementsByName(name[i]);
				var tag=(name[i]+'').toLowerCase();
				for(var iobj=0,n=doms.length;iobj<n;iobj++){
					var obj=doms[iobj];
					if(isTag && obj){
						try{
							if(!obj.getAttribute('name')) continue;
							if((obj.getAttribute('name').toLowerCase())!=tag){
								domsTag.push(obj);
								continue;
							}
						}catch(e){continue};
					}
					obj && listDoms.push(obj);
				}
				doms=domsTag;
				domsTag=[];
			}
		}
		this.InitObj(listDoms);
	}:"",
	Version 				=			1.0,
	toString				=			Object.prototype.toString,
	Timeout					=			window.setTimeout,
	class2type				=			{};
	if(!Glacier)return;
	Glacier.fn=Glacier.prototype;
	Glacier.fn.Version=Version;
	/***************************************************以上 为定义变量**********************************************************/
	/*
	* 公用正则
	*/
	Glacier.fn.Exp={
		GlacierExpr:/[\.|#|\w-]+[:#\.\w-]*\s+/g,
		rlocalProtocol:'',
		CHARS : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
	};
	/*
	* 快捷遍历
	*/
	Glacier.fn.Each=function(fun,obj){
		if(Glacier.fn.isNaN(obj)) obj=this;
		if(!Glacier.fn.isArray(obj) && !Glacier.fn.isNumber(obj.length)){
			var n=0;
			for(var i in obj){
				if(!obj.hasOwnProperty(i))continue;
				fun.call(obj[i],n,i,obj);
				n++;
			}
			return;
		}
		for(var i=0,l=obj.length; i<l; i++)
			fun.call(obj[i],i,obj);
		return this;
	};
	/*
	* 元素检索后对象整理
	*/
	Glacier.fn.InitObj=function(doms){
		var arr=[];
		if(doms && doms[0]!="null"){
			for(var i=0,n=doms.length;i<n;i++){
				var obj=doms[i];
				if(obj && (typeof obj=="object") && obj.nodeType==1)
					arr[i]=obj;
			}
		}
		return this.SetArray(arr);
	};
	
	/*
	* 将检索后的结果，添加到G中
	*/
	Glacier.fn.SetArray=function(arr){
		this.length=0;
		[].push.apply(this,arr);
		return this;
	};
	Glacier.fn.getAtt=function(key){
		var getAttribute=new Array();
		this.Each(function(){
			if(this && this.getAttribute){
				var v=this.getAttribute(key);
				getAttribute.push(v ? v:'');
			}
		});
		return getAttribute.length==1?getAttribute[0]:getAttribute;
	};
	Glacier.fn.Loaded=function(selector){
		Glacier.AttachEvent(window,'load',selector);
	};
	Glacier.fn.bd=function(o){
		if(Glacier.isNaN(o.on) || Glacier.isNaN(o.callback)) return;
		var arg=arguments;
		this.Each(function(i){
			var gb=Glacier.closure({obj:this,callBack:o.callback,arg:arg});
			if(o.on.indexOf('click')==0 && this.style) this.style.cursor='pointer';
			if(!this.gbak_fn)this.gbak_fn=[];
			this.gbak_fn[o.callback]=gb;
			Glacier.AttachEvent(this,o.on,gb);
		});
		return this;
	};
	Glacier.fn.click=function(fn){
		this.bd.call(this,{on:'click',callback:fn},arguments);
		return this;
	};
	Glacier.fn.change=function(fn){
		this.bd.call(this,{on:'change',callback:fn},arguments);
		return this;
	};
	Glacier.fn._Zindex=999999;
	Glacier.fn.getQuery=function(name){
		var reg=new RegExp(String("(^|&|\\?)"+name+"=([^&]*)(&|$)")),r;
		if(r=this.toString().match(reg))
			return unescape(r[2]);
		return null;
	};
	Glacier.fn.getid=function(name){
		return Glacier.getQuery.call(document.location,name);
	};
	Glacier.fn.isNaN=function(obj){
		return obj=="undefined" || obj==undefined || obj=="" || obj=="null" || obj == null;
	};
	/**
	* 返回中英文字符长度
	*/
	Glacier.fn.len=function(str)
	{
		return (str||'').toString().replace(/[^\x00-\xff]/g, "**").length;
	};
	/**
	* 去除全部空格
	*/
	Glacier.fn.Trim=function(obj){
		return obj.toString().replace(/\s/g,'');
	};
	Glacier.fn.isNumber=function(i){
		return (/^[0-9]+((\.?[0-9]+)|([0-9]*))$/.test(i))?true:false;
	};
	Glacier.fn.type=function( obj ) {
		return obj == null ?String( obj ) : class2type[ toString.call(obj) ] || "object";
	},
	Glacier.fn.isObj=function(obj){
		return Glacier.type(obj) === "object";
	};
	Glacier.fn.isFun=function(obj){
		return Glacier.type(obj) === "function";
	};
	Glacier.fn.isArray=function(obj){
		return Glacier.fn.type(obj) === "array";
	};
	Glacier.fn.buildParams=function( prefix, obj, add, traditional ) {
		if ( Glacier.isArray( obj ) ) {
			for(var i=0,n=obj.length;i<n;i++){
				if ( traditional || /\[\]$/.test( prefix ) ) {
					add( prefix, obj[i] );
				} else {
					Glacier.buildParams( prefix + "[" + ( typeof obj[i] === "object" ? i : "" ) + "]", obj[i], add ,traditional );
				}
			}
		} else if ( !traditional && obj != null && typeof obj === "object") {
			for ( var name in obj ) {
				try{
				if(!obj.hasOwnProperty(name))continue;
				Glacier.buildParams( prefix + "[" + name + "]", obj[ name ], add ,traditional );
				} catch( e ) {continue;}
			}
		} else {
			add( prefix, obj );
		}
	};
	Glacier.fn.formatparam=function(o){
		o=o||{};
		var s = []
		,	add = function( key, value ) {
				value = Glacier.isFun( value ) ? value() : value;
				s[ s.length ] = o.Handle(key,value);
			}
		;
		if(!Glacier.isNaN(o.param)){
			if ( Glacier.isArray( o.param )) {
				Glacier.Each( function() {
					add( this.name, this.value );
				},o.param);
	
			} else {
				for ( var prefix in o.param ) {
					if(!o.param.hasOwnProperty(prefix))continue;
					Glacier.buildParams( prefix, o.param[ prefix ], add , o.traditional);
				}
			}
		}
		return s.join( o.separate );
	};
	Glacier.fn.param=function(param,traditional){
		return Glacier.formatparam({
				param		:	param
			,	separate	:	"&"
			,	traditional	:	traditional
			,	Handle		:	function(key,value){
					return encodeURIComponent( key ) + "=" + encodeURIComponent( value );
				}
		}).replace( /%20/g , "+" );
	};
	Glacier.fn.closure=function(o){
		return function(event){
			if(Glacier.isNaN(o)) return;
			var e=(event || window.event);
			var ev=(e  ||  arguments.callee.caller.arguments[ 0 ]);
		    var et=ev.srcElement || ev.target;
			o.callBack.call(o.obj,o.arg,et,e);
		}
	};
	Glacier.fn.AttachEvent=function(obj,fn,gb,useCapture){
		if(obj.addEventListener)
			obj.addEventListener(fn,gb,(useCapture||false));
		else if(obj.attachEvent)
			obj.attachEvent("on"+fn,gb);
		else
			obj["on"+fn]=gb;
	};
	Glacier.fn.setTimeout=function(fn,time){
		var tmpfn=fn;
		time=Glacier.isNumber(time)?time:0;
		if(Glacier.isFun(fn)){
		  var argu = Array.prototype.slice.call(arguments,2);
		  tmpfn = function(){
			  try{
				fn.apply(null, argu);
			  }catch(e){}
		  };
		}
		if(parseInt(time)==0) time=0.001;
		return Timeout(tmpfn,(time*1000));
	};
	Glacier.fn.getscript=function(s){
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
								if ( !Glacier.isNaN(isAbort) ) {
									s.callback  && s.callback( 200, "abort" );
								}else
									s.callback  && s.callback();
							} catch (e) {s.callback  && s.callback();}
						}
					};
					if(Glacier.isIE9)script.onerror='';
					if(!Glacier.isNaN(s.cache))
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
	Glacier.fn.getjs=function(o){
		o=o||{};
		var stime=function(a,b){
			if(b=='abort'){
			}else{
				clearTimeout(st);
			}
			o.callback && o.callback(a,b);
		},	scp=Glacier.getscript({
			 url:o.url,
			 callback:stime,
			 scriptCharset:o.charset,
			 cache:o.cache
			 })
		,	st=Glacier.setTimeout(scp.abort,(o.time||15))
		;
		
		scp.send();
		
	};
	Glacier.fn.Browser=function(){
		var ua=navigator.userAgent.toLowerCase()
		,	check = function(reg){
				var str=ua.match(reg);
				if(str){
					Glacier.getBrowser=brow[reg];
					Glacier.getBrowserVersion=str[1];
				}
				return str;
			}
		,	brow={}
		;
		brow[/msie ([\d.]+)/]='ie';
		brow[/firefox\/([\d.]+)/]='firefox';
		brow[/chrome\/([\d.]+)/]='chrome';
		brow[/opera.([\d.]+)/]='opera';
		brow[/version\/([\d.]+).*safari/]='safari';
		brow[/maxthon\/([\d.]+)/]='maxthon';
		brow[/mobile/]='mobile';
		
		Glacier.isIE=check(/msie ([\d.]+)/) || false;
		if(!Glacier.fn.isNaN(Glacier.isIE) && Glacier.isIE.length>1){
			Glacier.isIE6=Glacier.isIE[1]=="6.0"?Glacier.isIE[1]:false;
			Glacier.isIE7=Glacier.isIE[1]=="7.0"?Glacier.isIE[1]:false;
			Glacier.isIE8=Glacier.isIE[1]=="8.0"?Glacier.isIE[1]:false;
			Glacier.isIE9=Glacier.isIE[1]=="9.0"?Glacier.isIE[1]:false;
			Glacier.isIE10=Glacier.isIE[1]=="10.0"?Glacier.isIE[1]:false;
		}else{
			Glacier.isIE6=false;
			Glacier.isIE7=false;
			Glacier.isIE8=false;
			Glacier.isIE9=false;
		}
		Glacier.firefox=check(/firefox\/([\d.]+)/) || false;
		Glacier.chrome=check(/chrome\/([\d.]+)/) || false;
		Glacier.opera=check(/opera.([\d.]+)/) || false;
		Glacier.safari=check(/version\/([\d.]+).*safari/) || false;
		Glacier.maxthon=check(/maxthon\/([\d.]+)/) || false;
		Glacier.compatMode=document.compatMode=="CSS1Compat"?true:false;
		Glacier.mobile=check(/mobile/) || false;;
	}();
	Glacier.fn.Zindex=function(){
		return this.fn._Zindex++;
	};
	Glacier.fn.statistics=function(){
		var ref=function(){
			try{
				if(document.referrer) return document.referrer+'';
				else if(window.opener) return window.opener.location+'';
			}catch(e){}
			return '';
		}();
		if(Glacier.isNaN(ref))ref='';
		return {
			fromPage:ref,
			toPage:window.location+'',
			toPageTitle:window.document.title || this.toPage,
			//userAgent:navigator.userAgent,
			platform:navigator.platform+'',
			browser:Glacier.getBrowser,
			bVersion:Glacier.getBrowserVersion,
			ufcolor:(navigator.appName=="Netscape"?ufcolor=screen.pixelDepth:ufcolor=screen.colorDepth)+'',
			screensize:screen.width+'.'+screen.height,
			language:(navigator.language?navigator.language:navigator.browserLanguage)+'',
			timeZone:((new Date().getTimezoneOffset()/60)*(-1))+''
			};
	};
	Glacier.fn.uuidFast=function(){
		 var chars=Glacier.fn.Exp.CHARS, uuid = new Array(36), rnd=0, r;
		 for (var i = 0; i < 36; i++) {
			 if (i==8 || i==13 ||  i==18 || i==23) {
				 uuid[i] = '-';
			} else if (i==14) {
				uuid[i] = '4';
			} else {
				if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
				r = rnd & 0xf;
				rnd = rnd >> 4;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
		return uuid.join('');   
	};
	Glacier.fn.windowSize=function(){
		var o = {x:0,y:0},windowobj=Glacier.compatMode?document.documentElement:document.body; 
		o.w=Glacier.mobile?Math.max(windowobj.scrollWidth,windowobj.clientWidth,screen.width):Math.max(windowobj.scrollWidth,windowobj.clientWidth);
		o.h=Glacier.mobile?Math.max(windowobj.scrollHeight,windowobj.clientHeight,screen.height):Math.max(windowobj.scrollHeight,windowobj.clientHeight);
		o.sw=Glacier.mobile?Math.max(windowobj.clientWidth,screen.width):windowobj.clientWidth;
		o.sh=Glacier.mobile?Math.max(windowobj.clientHeight,screen.height):windowobj.clientHeight;
		o.scrollTop=windowobj.scrollTop || window.pageYOffset || document.body.scrollTop;
		o.scrollLeft=windowobj.scrollLeft || window.pageXOffset || document.body.scrollLeft;
		return o;
	};
	/*
	* 控制台输出
	*/
	Glacier.fn.log=function(msg){
		Glacier.firefox&&console.log(msg);
	};
	Glacier.fn.Each.call(Glacier.fn,function(i,fnname){
		Glacier[fnname]=Glacier.prototype[fnname];
	});	
	Glacier.Each(
		function(i){
			class2type[ "[object " + this + "]" ] = this.toLowerCase();
		}
		,"Boolean Number String Function Array Date RegExp Object".split(" ")
	);
	window.$G=Glacier;
})();
window.wmTop=$G.getid('t')||1
;
var hmCode='';
if($G.mobile){
	hmCode='%3F6162ccd21237727165fc4c7221af7f60';
	$G('#mobile')[0].style.display='';
}else{
	$G('#pc')[0].style.display='';
	var url=window.document.location.hostname;
	if(url=='sh.lexunhudong.com')
		hmCode='%3Fbec2a083963e8e2c8d582ed23878e9b6';
	else if(url=='hlj.lexunhudong.com')
		hmCode='%3F9c20a14816401dff849240f34214ad87';
	else if(url=='sc.lexunhudong.com')
		hmCode='%3F87ed06a680746c2e76d5b5568251a222';
	else if(url=='gd.lexunhudong.com')
		hmCode='%3F560754640528b543296989756ab31c2a';
	else if(url=='shanxi.lexunhudong.com')
		hmCode='%3F0e1d38aa109cae8d93ad3f8a0846f6a6';
	else if(url=='zj.isojk.com')
		hmCode='%3Ff6b1cd67ac91ebd5b1fe115d2f8f898d';
	else if(url=='cq.isojk.com')
		hmCode='%3F4d6567777f5aab8d0b3d0d0ca474c43e';
	else if(url=='js.isojk.com')
		hmCode='%3F027f2034750b18e7e19ac8e33133ebf2';
	else if(url=='sd.95china.com')
		hmCode='%3F52953b10bc711ad5506264698a99e16a';
	else if(url=='hn.95china.com')
		hmCode='%3Feefb21eea1390ad894f795a82eeff092';
	else if(url=='jl.95china.com')
		hmCode='%3F969518718e181dd15b4f083bec1f98e1';
	else if(url=='yn.95china.com')
		hmCode='%3F5ecfea9482f28a47e737c560eb9f6ade';
	else if(url=='sd.51a-i.com')
		hmCode='%3Fe3e67a2c6f21f06dace060a2a96429a1';
	else if(url=='bj.58jiankang.cn')
		hmCode='%3F9e92e3d895db84ed08b4b5c5d82b18e2';
	else if(url=='tj.99wen.cn')
		hmCode='%3F6bfb6841eec92a0a6ea754531e6087b0';
	else if(url=='sh.58jiankang.cn')
		hmCode='%3F4da28a2d2dd9cbe1c793133184a671c9';
	else if(url=='shanxi.luanchao120.com')
		hmCode='%3F9f92f24528c6f4fadd413e785a90e0fd';
	else if(url=='henan.sgyangwei.com')
		hmCode='%3Fce5dbb4f06de3f37a73adcb006a47b29';
	else if(url=='hubei.zigong360.com')
		hmCode='%3F8a2b38b9db30db47a7741468dfd87e36';
		
}
var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");
document.write(unescape("%3Cscript src='" + _bdhmProtocol + "hm.baidu.com/h.js"+hmCode+"' type='text/javascript'%3E%3C/script%3E"));
(function(){
	window.getRandom=function(min,max){
		return Math.floor(min+Math.random()*(max-min));
	};
	$G.wm=function(){
		var uuid=$G.uuidFast().replace(/-/ig,'')
		,	statistics=this.statistics||$G.statistics()
		,	param={
				ele:this.ele||'1'							// 1: 文字广告，0：图片广告，目前同一批次展示广告仅支持单一模式
			//,	default_url:this.default_url||''			// 默认展示广告，暂时没用
			,	refer:statistics.fromPage
			,	title:encodeURIComponent(statistics.toPageTitle)
			,	url:statistics.toPage
			,	cb:'window.set'+uuid
			}
		,	isBilling=function(){
				if(top.window.location != window.location){
					return true;
				}
				var referUrl=document.location+''
				,	referUrlLen=referUrl.indexOf('?58es')
				,	m=$G.getid('money')||0
				;
				if(m==1)return false;
				if(referUrlLen<0)referUrlLen=referUrl.indexOf('#jc8');
				if($G.isNaN(param.refer) && referUrlLen<0)return true;
				return false;
			}()
		,	wmObj=null
		,	www='http://show.adx.haomeit.com'
		,	www_static='http://static.adx.haomeit.com/images'
		,	ghWww='http://58.guahao.com'
		,	url=www+'/pass?'+function(){
				var device='';
				if($G.mobile){
					device='device=1';
				}
				return device;
			}()+'&style='+function(){
				var styles='lexunhudong.com';
				if($G.mobile){
					styles='m.lexunhudong.com';
				}
				return styles;
			}()+'&'+$G.param(param)+'&cabin='+(this.cabin||'')// 广告位标识
		,	clickLink={
				'title':1
			,	'webIM':2
			,	'append_0':3
			,	'append_1':4
			,	'append_2':5
			,	'append_3':6
			,	'append_4':7
			,	'description1':8
			,	'displayUrl':9
			,	'hospUrl':10
			,	'userPic':11
			}
		,	leftHtml='<div class="hos_logo"><a target="_blank" href="<!--destinationUrl-->&link=11" ><img src="<!--uesrUrl-->" onerror="this.src=\'{www}jk.haomeit.com/web/images/default-ad.jpg\'" width="80" height="60" /></a></div>\
<div class="hos_name"><a target="_blank" href="<!--destinationUrl-->&link=1"><!--title--></a></div>\
<div class="hos_ico"><span class="ico1"></span><span class="ico2"><a style="display:<!--guaHaoDisplay-->;" target="_blank" href="<!--hospUrl-->&link=10">挂号</a></span></div>\
<div class="hos_zixun"><a target="_blank" href="<!--webIM-->&link=2"><img src="{www}jk.haomeit.com/web/images/media-07.jpg" width="130" height="121" /><br />\
  <u>免费在线挂号</u></a></div>\
<div class="hos_content">\
  <div class="hos_title">好媒体健康提示您：</div>\
  <div class="hos_word">为了保护您的健康，如发现身体有不适症状，可以通过本页免费咨询通道，与医院在线专家一对一免费交流沟通病情，也可以在线预约挂号！</div>\
</div>'.replace(/{www}/ig,www_static+'/')
		,	showFn=function(o){
				o=o||{};
				wmObj=this;
				
				if($G.isNaN(o.data)){
					o.data=new Array();
				}
				try{
					wmObj.callback&&wmObj.callback.call(o,o.data.length);
				}catch(e){};
				var dataLengthFn=function(){
					var hPageFrm=$G.mobile?$G('#mPageFrm')[0]:$G('#hPageFrm')[0]
					,	frmUrl='http://58guahao.haomeit.com/url.aspx?dirname='+function(){
							var surl=((window.document.location+'').replace('http://'+window.document.location.hostname,'')).replace(/\//ig,'')
							,	surl=surl.split("?")
							,	surl=function(){
									if(surl.length>0){
										surl=surl[0];
									}
									return surl.split("#");
								}()
							;
							if(surl.length>0){
								surl=surl[0];
							}
							return surl;
						}()
					;
					if($G.mobile)
						window.document.location=frmUrl;
					else
						hPageFrm.src=frmUrl;
					var wsize=$G.windowSize();
					hPageFrm.style.height=wsize.sh+'px';
					return;
				}
				if(o.data.length<1){
					dataLengthFn();return;
				}
				var webIMurl='';
				var wmList=$G('.'+wmObj.cabin.replace(/,/ig,' .'))
				,	targetUrl=o.targetUrl
				,	toKen=function(){
						var s1=targetUrl.split('click?click=');
						if(s1.length>0){
							s1=s1[1];
						}
						return '#'+s1;
					}()
				,	linkUrl=function(creative,key){
						var linkWebUrl=targetUrl+'&url=';
						if(isBilling)linkWebUrl='';
						return linkWebUrl+function(){
								creative.mobile_destination_url=creative.mobile_destination_url||creative.destinationUrl;
								var url='http://'+$G.mobile?creative.mobile_destination_url:creative.destinationUrl;
								if(key=='webIM'){
									url=creative.webIM||'';
									webIMurl=url;
								}else if(key=='hospUrl'){
									url=creative.hospUrl||'';
								}
								//url=url+toKen;
								if(!url||url=='http://'){
									return '';
								}
								if(isBilling){
									url=$G.Trim(('http://'+(url.replace((new RegExp('http://','ig')),''))));
									url += ( /\?/.test( url ) ? "&" : "?" )+'creative='+creative.creativeId;
								}else url=$G.Trim(encodeURIComponent('http://'+(url.replace((new RegExp('http://','ig')),''))))+'&creative='+creative.creativeId;
								return url;
							}();
					}
				,	wrParam=function(key,val){
						var creative=this
						;
						val=val||'';
						if(
								key=='webIM'
							||	key=='hospUrl'
							||	key=='destinationUrl'
							||	key=='destinationUrl0'
							||	key=='destinationUrl1'
							||	key=='destinationUrl2'
							||	key=='destinationUrl3'
							||	key=='destinationUrl4'
						)
							val=linkUrl(creative,key);
						return {
							key:new RegExp('<!--'+key+'-->','ig')
						,	val:val
						};
					}
				;
				var name='TL1PQ2V2576O2R'
				,	getJson=function(){
						var getRID=$G.getid('rid')
						,	retJson=new Array()
						;
						$G.Each(function(i){
							if(this.region==getRID){
								retJson.push(o.data[i]);
							}
						},o.data);
						var n=retJson.length
						;
						if(n<window.wmTop)window.wmTop=n;
						return retJson[window.wmTop-1]||''
					}()
				,	isType=name.substr(0,1)
				,	isL=name.substr(1,1)
				,	wmHtml=(isL=='L'?leftHtml:regitHtml)
				;
				if($G.isNaN(getJson)){
					dataLengthFn();
					return;
				}
				if(isL=='L'&&$G.isNaN(getJson.append)){
					getJson.append=new Array();
				}
				if(isL=='L'&&$G.isNaN(getJson.plugins)){
					getJson.plugins=new Array();
				}
				$G.Each(function(aaa,k){
					var reg=''
					,	val=this
					;
					if(isL=='L'){//长广告变量替换
						if(k=='append'){//附加创意
							if(this.length>0 && !$G.isNaN(this[0].title)){
								val='';
								var liList=new Array()
								;
								$G.Each(function(appendI){
									var appendObj=this;
									appendObj['creativeId']=getJson.creativeId;
									$G.Each(function(m,ak){
										var reVal=wrParam.call(appendObj,ak+appendI,this);
										wmHtml=wmHtml.replace(reVal.key,reVal.val);
									},this);
									if(appendI>0)
										wmHtml=wmHtml.replace('<!--appendSeparate-->','|');
								},this);
								wmHtml=wmHtml.replace((new RegExp('<!--appendSeparate-->','ig')),'');
								var reVal=wrParam.call(getJson,'appendDisplay','block');
								wmHtml=wmHtml.replace(reVal.key,reVal.val);
								var reVal=wrParam.call(getJson,'displayUrlDisplay','none');
								wmHtml=wmHtml.replace(reVal.key,reVal.val);
							}else{//长广告显示URL
								var reVal=wrParam.call(getJson,'displayUrlDisplay','block');
								wmHtml=wmHtml.replace(reVal.key,reVal.val);
								var reVal=wrParam.call(getJson,'appendDisplay','none');
								wmHtml=wmHtml.replace(reVal.key,reVal.val);
							}
						}else if(k=='plugins'){//挂号网数据
							if(this.length>0 && !$G.isNaN(this[0].token)){
								var hospitalVal=this[0].token||''
								,	hospitalValList=function(){
										var valueKey=''
										;
										if(hospitalVal){
											var list=hospitalVal.split('||')
											;
											if(list.length>1){
												hospitalVal=list[0];
												valueKey=list[1];
											}
										}
										return {
											guahaoToken:hospitalVal
										,	guahaoKey:valueKey
										};
									}()
								,	hospitalToken=hospitalValList.guahaoToken
								,	hospitalKey=hospitalValList.guahaoKey
								;
								if(hospitalKey) val=ghWww+'/department/'+hospitalKey;
								else val=ghWww+'/hospital/'+hospitalToken;
								getJson.hospUrl=val;
								reg=wrParam.call(getJson,'hospUrl',val);
								var reVal=wrParam.call(getJson,'guaHaoDisplay','block');
								wmHtml=wmHtml.replace(reVal.key,reVal.val);
							}else{
								var reVal=wrParam.call(getJson,'guaHaoDisplay','none');
								wmHtml=wmHtml.replace(reVal.key,reVal.val);
							}
						}else if(!$G.isNaN(val)){
							
						}
						if(k=='webIM'){//在线咨询
							if($G.isNaN(getJson.webIM)){
								var reVal=wrParam.call(getJson,'webIMDisplay','none');
								wmHtml=wmHtml.replace(reVal.key,reVal.val);
							}else{
								var reVal=wrParam.call(getJson,'webIMDisplay','block');
								wmHtml=wmHtml.replace(reVal.key,reVal.val);
							}
						}
					}else{//短广告变量替换
						
					}
					if(k=='description1'){
						var dLeng=$G.len(val)
						,	lengReg=wrParam.call(getJson,'userPicHeight',80)
						;
						if(dLeng<76)lengReg.val=60;
						wmHtml=wmHtml.replace(lengReg.key,lengReg.val);
					}
					if(k=='act'){
						reg=wrParam.call(getJson,'uesrUrl','http://images.adx.haomeit.com/HospitalImgFile/'+val+'.JPG?notcache='+(new Date().getTime()));
					}
					if(!reg){
						reg=wrParam.call(getJson,k,val);
					}
					if(!$G.isNaN(val))
						wmHtml=wmHtml.replace(reg.key,reg.val);
				},getJson);
				var uuidReg=wrParam.call(getJson,'uuid',uuid)
				,	domInnerHTML=wmHtml.replace(uuidReg.key,uuidReg.val)
				,	WMDOM=$G('.'+name)[0]
				;
				WMDOM.innerHTML=domInnerHTML;
				WMDOM.style.display='';
				var a=$G('a',$G('div:hos_name')[0])[0]
				,	hPageFrm=$G.mobile?$G('#mPageFrm')[0]:$G('#hPageFrm')[0]
				;
				$G('#mobileWebUrl')[0].href=webIMurl;
				if($G.mobile)
					window.document.location=a.href;
				else
					hPageFrm.src=a.href;
				var wsize=$G.windowSize();
				hPageFrm.style.height=wsize.sh+'px';
				try{
					wmObj.callbackEach&&wmObj.callbackEach.call(o,o.data.length);
				}catch(e){};
			}
		;
		if($G.isNaN(this.cabin)){
			return ;
		}
		eval('window.set'+uuid+'='+showFn);		
		$G.getjs({
			url:url,
			callback:function(){},
			charset:'utf-8'
		});
	};
})();
(function(){
	var left_hid=$G('#left_hid')
	,	left_dis=$G('#left_dis')
	,	change_width=document.getElementById("change_width")
	;
	
	$G('.left').click(function(){
		if(left_hid[0].style.display=='none'){
			left_hid[0].style.display='';
			left_dis[0].style.display='none';
			change_width.className="c_right_new";
			
		}else{
			left_hid[0].style.display='none';
			left_dis[0].style.display='';
			change_width.className="c_right";
		}
	});
	
	//广告位标识：标识顺序就是排名顺序，TL为长广告位标识，TS为短广告标识
	this.cabin='TL2S25G64LR21S,TL2A8OQ04LR21H,TL2HFOC14LR21D,TL1R6P3F4LR21U,TL2RL8954LR21F,TL294C344LR21C,TL211FF84LR21D,TL224MB14LR21D,TL2TO2FT4LR222,TL25Q5PP4LR21F';
	//广告显示后回调方法 n 为当前广告总数
	this.callback=function(n){
		//广告JSON数据
		var list=this.data;
	};
	//开始显示广告
	$G.wm.call(this);
})();