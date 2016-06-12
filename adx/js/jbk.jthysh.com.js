/*
* Name		: Glacier 1.0 -wangmeng
* Author	: wangzheng
* QQ		: 113666386
* Date		: 2014-04-29 23:00
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
	Glacier.fn.setAtt=function(key,val){
		this.Each(function(){
			key = Glacier.isIE6 || Glacier.isIE7?Glacier.fn.getAttStr(key):key;
			this.setAttribute(key,val);
		});
		return this;
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
//console.log('加载：'+ (new Date().getTime()));
(function(){
	$G.wm=function(){
		var uuid=$G.uuidFast().replace(/-/ig,'')
		,	statistics=this.statistics||$G.statistics()
		,	wmObj=this
		,	mk=function(){
				var metaKey=$G('.keywords')
				,	v=''
				;
				metaKey.Each(function(){
					v+=$G(this).getAtt('content');
				});
				return v;
			}()
		,	param={
				ele:this.ele||'1'							// 1: 文字广告，0：图片广告，目前同一批次展示广告仅支持单一模式
			//,	default_url:this.default_url||''			// 默认展示广告，暂时没用
			,	refer:statistics.fromPage
			,	title:encodeURIComponent(wmObj.title||statistics.toPageTitle||'')
			,	url:statistics.toPage
			,	mk:encodeURIComponent(wmObj.mk||mk||'')
			,	cb:'window.set'+uuid
			,	trust:7086
			}
		,	www='http://show.adx.haomeit.com'
		,	www_static='http://static.adx.haomeit.com/images'
		,	ghWww='http://58.guahao.com'
		,	url=function(){
				var tUrl=www+'/pass?'+$G.param(param)+'&cabin='+(wmObj.cabin||'');
				if(!$G.isNaN(wmObj.param))
					tUrl=tUrl+'&'+$G.param(wmObj.param);
				$G.log('请求参数:'+decodeURIComponent(decodeURIComponent(tUrl)));
				return tUrl;
			}()
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
		,	leftHtml='<div style="overflow:hidden;clear:both; min-width:675px;font-family:Arial,simsun,sans-serif,宋体;">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              \
  <div style="float:left; margin-right:15px;">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   \
    <div style="width:80px; height:60px; overflow:hidden; position:relative; display:table-cell; vertical-align:middle; text-align:center;"> <a target="_blank" href="<!--destinationUrl-->&link=11" style="border:none; text-decoration:none; cursor:pointer;"> <i style="*display:inline-block;*height:100%;*vertical-align:middle;"></i> <img src="<!--uesrUrl-->" onerror="this.src=\'{www}default-ad.jpg\'" width="80" height="60" style="border:none;*vertical-align:middle;"> </a> </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 \
  </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         \
  <div style="float:left; height:60px;">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         \
    <div style=" height:22px;width:456px;"> <span style="display:block; float:left; padding-right:5px;font-size:14px;height:22px; max-width:456px;overflow:hidden;"> <i style="float:left; font-style:normal; max-width:340px;height:22px;line-height:21px;overflow:hidden;"> <a target="_blank" href="<!--destinationUrl-->&link=1" class="tcolor<!--uuid-->" target="_blank"><!--title--></a></i><i style="width:16px; height:18px;float:left;background: url({www}58-ad03.jpg) no-repeat right 2px; margin-left:13px;"></i> <i style="display:<!--guaHaoDisplay-->;width:16px; height:18px;float:left;background: url({www}58-ad02.gif) no-repeat right 2px; margin-left:13px;"></i> </span> <span style="display:<!--guaHaoDisplay-->;float:left;height:19px; line-height:19px;color:#666666;padding-left:13px; margin-left:15px;background: url({www}cy_ico_04.png) no-repeat scroll left center;"> <a target="_blank" href="<!--hospUrl-->&link=10" style="display:block;height:19px; line-height:19px; color: #666666;font-size:12px; text-decoration:underline;" target="_blank"> 挂号</a> </span> </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                \
    <div style="clear:both;overflow:hidden;"> <a target="_blank" href="<!--destinationUrl-->&link=8" style=" clear:both; display:block;width:456px;color:#585858;font-size: 12px; text-decoration:none;height:22px; line-height:22px;float:left;overflow:hidden;word-wrap: break-word;word-break: break-all;" ><!--description1--></a> </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    \
    <div style="clear:both;overflow:hidden;"> <span style="display:<!--appendDisplay-->;float:left; font-size:12px; line-height:19px;max-width:400px; overflow:hidden;"> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl0-->&link=3"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title0--></a></i> <!--appendSeparate--> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl1-->&link=4"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title1--></a></i> <!--appendSeparate--> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl2-->&link=5"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title2--></a></i> <!--appendSeparate--> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl3-->&link=6"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title3--></a></i> <!--appendSeparate--> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl4-->&link=7"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title4--></a></i> </span> <span style="clear:both;display:<!--displayUrlDisplay-->;float:left;font-size:12px;line-height:18px;width:456px;overflow: hidden; word-break: break-all; word-wrap: break-word; margin-right:10px;"> <i style=" font-style:normal;"> <a target="_blank" href="<!--destinationUrl-->&link=9" style="text-decoration:none;color:#006600;" target="_blank"><!--displayUrl--></a> </i> </span> </div>\
  </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          \
  <div style="display:<!--webIMDisplay-->;float:right; padding-top:20px;"><a target="_blank" href="<!--webIM-->&link=2" style="display:block; width: 92px; height:20px; float:right; cursor:pointer;"><img src="{www}58-ad01.gif" width="89" height="23" /></a> </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            \
</div>'.replace(/{www}/ig,www_static+'/')
		,	regitHtml='	\
<div style="color:#333333;word-break: break-all; word-wrap: break-word;overflow:hidden;font-family:Arial,simsun,sans-serif,宋体;"> <span style="display: block;height: 22px;overflow: hidden;" > <a target="_blank" href="<!--destinationUrl-->&link=1" class="tcolor<!--uuid-->" style="font-size:14px;height:22px;line-height:21px; text-decoration:underline;" target="_blank"><!--title--></a> </span>\
  <div style="display:block; max-height:40px;overflow: hidden; word-break: break-all; word-wrap: break-word;"> <a target="_blank" href="<!--destinationUrl-->&link=8" style="color:#333333;text-decoration:none;font-size: 12px;line-height:19px;" target="_blank"><!--description1--></a> </div>\
  <div style="width:100%;"> <a target="_blank" href="<!--destinationUrl-->&link=9" style="display:block;float:left;margin-right:5px;  max-width:90%; height:20px;font-size:12px;line-height:18px;color:#006600;text-decoration:none;overflow: hidden; word-break: break-all; word-wrap: break-word; " target="_blank"><!--displayUrl--></a> <span style="display: inline-block; float:left; width:17px;overflow: hidden; word-break: break-all; word-wrap: break-word; "> <img src="{www}cy_ico_01.png" width="16" height="16" style=" float:left; margin-top:3px;"/> </span> </div>\
</div>'.replace(/{www}/ig,www_static+'/')
		,	showFn=function(o){
				$G.log('回调：'+(new Date().getTime()));
				o=o||{};
				
				if($G.isNaN(o.data)){
					o.data=new Array();
				}
				try{
					wmObj.callback&&wmObj.callback.call(o,o.data.length);
				}catch(e){};
				if(o.data.length<1){
					$G.log('无有效广告');
					return;
				}
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
						return targetUrl+'&url='+function(){
								var url='http://'+creative.destinationUrl;
								if(key=='webIM'){
									url=creative.webIM||'';
								}else if(key=='hospUrl'){
									url=creative.hospUrl||'';
								}
								//url=url+toKen;
								return $G.Trim(encodeURIComponent('http://'+(url.replace((new RegExp('http://','ig')),''))));
							}()+'&creative='+creative.creativeId;
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
				$G.Each(function(i){
					var name=this+''
					,	getJson=o.data[i]||''
					,	isType=name.substr(0,1)
					,	isL=name.substr(1,1)
					,	wmHtml=(isL=='L'?leftHtml:regitHtml)
					;
					if($G.isNaN(getJson)){
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
					,	domInnerHTML=wmHtml.replace(uuidReg.key,uuidReg.val);
					;
					wmList.Each(function(){
						var obj=$G(this)
						,	domName=obj.getAtt('name')
						;
						if(domName==name){
							this.innerHTML=domInnerHTML;
							this.style.display='';
						}
					});
				},wmObj.cabin.split(","));
				try{
					wmObj.callbackEach&&wmObj.callbackEach.call(o,o.data.length);
				}catch(e){};
			}
		;
		$G.log('定义变量：'+(new Date().getTime()));
		if($G.isNaN(wmObj.cabin)){
			$G.log('广告位标识无效');
			return ;
		}
		eval('window.set'+uuid+'='+showFn);
		$G.log('定义自定义回调方法：'+(new Date().getTime()));
		//if(!wmObj.title)
		//	document.writeln("<style>a.tcolor"+uuid+"{ color:#1155cc;text-decoration:none; }a.tcolor"+uuid+":hover{ color:#fe7d05; text-decoration:underline;}</style>");
		
		$G.getjs({
			url:url,
			callback:function(){},
			charset:'utf-8'
		});
		$G.log('执行检索：'+(new Date().getTime()));
	};
})();
(function(){
	//广告位标识：标识顺序就是排名顺序，TL为长广告位标识，TS为短广告标识
	this.cabin='TL249T783VLI2K,TL2RV8253VLI2D,TL2E6TG03VLI2K';
	//广告显示后回调方法 n 为当前广告总数
	this.callback=function(n){
		//广告JSON数据
		var list=this.data;
		/*//左侧是否显示 名称跟据页面标识可自己换.代表name #代表ID
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
		});*/
	};
	//开始显示广告
	//$G.wm.call(this);
})();