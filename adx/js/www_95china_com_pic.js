/*
* Name		: Glacier 1.0
* Author	: wangzheng
* QQ		: 113666386
* Date		: 20140618
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
	var Glacier=(!window.$G || window.$G.Version<1.1)?function(selector,dom){
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
						if(!Glacier.fn.isNaN(findTag)){
							findTag=Glacier.fn.getAttStr(findTag);
							var tmpTag=(obj.getAttribute(findTag)+'').toLowerCase();
							if(Glacier.fn.isNaN(tmpTag)) continue;
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
	Version 				=			1.1,
	toString				=			Object.prototype.toString,
	ArrayConcat				=			Array.concat||function(array_1,array_2){
											var arr=new Array();
											Glacier.Each(function(){
												arr.push(this);
											},array_1);
											Glacier.Each(function(){
												arr.push(this);
											},array_2);
											return arr;
										},
	Timeout					=			window.setTimeout,
	Interval				=			window.setInterval,
	hasOwn					=			Object.prototype.hasOwnProperty,
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
	/*
	* 控制台输出
	*/
	Glacier.fn.log=function(msg){
		Glacier.firefox&&console.log(msg);
	};
	/*
	* 获取对象中的第一个元素
	*/
	Glacier.fn.getfirst=function(){
		return this[0];
	};
	/*
	* 获取对象中的最后一个元素
	*/
	Glacier.fn.getlast=function(){
		return this[this.length-1];
	};
	/*
	* 获取对像的ID
	*/
	Glacier.fn.id=function(){
		var ids=new Array();
		this.Each(function(){
			ids.push(this.id ? this.id:'');
		});
		return ids.length==1?ids[0]:ids;
	};
	Glacier.fn.getAttribute=function(key){
		var getAttribute=new Array();
		this.Each(function(){
			if(this && this.getAttribute){
				var v=this.getAttribute(Glacier.fn.getAttStr(key));
				getAttribute.push(v ? v:'');
			}
		});
		return getAttribute.length==1?getAttribute[0]:getAttribute;
	};
	Glacier.fn.setAttribute=function(key,val){
		this.Each(function(){
			key = Glacier.isIE6 || Glacier.isIE7?Glacier.fn.getAttStr(key):key;
			this.setAttribute(key,val);
		});
		return this;
	};
	Glacier.fn.getAtt=function(key){
		return Glacier.fn.getAttribute.call(this,key);
	};
	Glacier.fn.setAtt=function(key,val){
		return Glacier.fn.setAttribute.call(this,key,val);
	};
	Glacier.fn.hasProp=function(obj,prop){
		obj=obj||this[0]||'';
		if (typeof prop !== "string" || !obj.getAttribute) return undefined;
		var hasProp = false;
		if (document.querySelector) {
			var attrProp = obj.getAttribute(prop);
			if (attrProp !== null && attrProp !== undefined && attrProp !== false) {
				hasProp = true;
			}
		} else{// if(!Glacier.compatMode)
			// IE6, IE7
			var outer = (obj.outerHTML||obj.parentNode.innerHTML),part = outer.slice(0, outer.search(/\/?['"]?>(?![^<]*<['"])/));
			hasProp = new RegExp("\\s" + prop + "\\b", "i").test(part);
		}
		return hasProp;
	};
	Glacier.fn.html=function(newHtml){
		var htmls=new Array();
		this.Each(function(){
			if(Glacier.fn.isNaN(newHtml) && newHtml!=='')
				htmls.push(this.innerHTML ? this.innerHTML:'');
			else{
				this.innerHTML=newHtml;
				/*if(Glacier.isIE)this.innerHTML=newHtml;
				else{
					var newObj=this.cloneNode(false);
					newObj.innerHTML=newHtml;
					this.parentNode.replaceChild(newObj,this);
				}
				*/
			}
		});
		return (Glacier.fn.isNaN(newHtml))?htmls:this;
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
	Glacier.fn.Loaded=function(selector){
		Glacier.AttachEvent(window,'load',selector);
	};
	Glacier.fn.LoadedDom=function(f){
		var ie = !!(window.attachEvent && !window.opera);    
	    var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525);    
		//var fn = [];    
		//var run = function () {
			//for (var i = 0; i < fn.length; i++) fn[i]();
		//};
		var d = document;
		if (!ie && !wk && d.addEventListener)    
			return d.addEventListener('DOMContentLoaded', f, false);
		//Glacier.fn.Loaded.call(this,f);    
		/*if (fn.push(f) > 1) return;*/
		if (ie)
			(function () {
				try { d.documentElement.doScroll('left'); f(); }    
				catch (err) { setTimeout(arguments.callee, 0); }    
			})();    
		else if (wk)    
			var t = setInterval(function () {
			if (/^(loaded|complete)$/.test(d.readyState))    
			clearInterval(t), f();    
		}, 0); 
	};
	Glacier.fn.bd=function(o){
		if(Glacier.fn.isNaN(o.on) || Glacier.fn.isNaN(o.callback)) return;
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
	Glacier.fn.delbd=function(o){
		if(Glacier.fn.isNaN(o.on) || Glacier.fn.isNaN(o.callback)) return;
		this.Each(function(){
			var gb=this.gbak_fn[o.callback];
			Glacier.RemoveAttachEvent(this,o.on,gb);
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
	Glacier.fn.MoveStart=function(obj,et,oEvent){
		this.style.zIndex=Glacier.Zindex();
		this.isMove=true;
		this.intervalid&&clearInterval(this.intervalid);
		var obj=Glacier.Obj(this),wsize=Glacier.windowSize();
		this._sw=obj.w;
		this._sh=obj.h;
		this._ww=wsize.sw;
		this._wh=wsize.sh;
		this._wl=wsize.scrollLeft;
		this._wt=wsize.scrollTop;
		this._x=oEvent.clientX-obj.x;
		this._y=oEvent.clientY-obj.y;
		if(Glacier.isIE)obj.setCapture();
		Glacier.AttachEvent(document, "mousemove", obj.mousemove);
		Glacier.AttachEvent(document, "mouseup", obj.mouseup);
		oEvent.preventDefault?oEvent.preventDefault():oEvent.returnValue = false;
	};
	Glacier.fn.MoveYesWindowIng=function(obj,et,oEvent){
		var L=oEvent.clientX-this._x;
		var T=oEvent.clientY-this._y;
		this.style.left=L+"px";
		this.style.top=T+"px";
		if(!Glacier.fn.isNaN(this.isMoveWindowReset)){
			this.isWindowReset=false;
		}		
	};
	Glacier.fn.MoveNotWindowIng=function(obj,et,oEvent){
		var bw=0,bh=0;
		if((!Glacier.compatMode && Glacier.isIE) || Glacier.isIE6){
			bw=this._wl;
			bh=this._wt;
		}
		var L=oEvent.clientX-this._x,ckL=bw+this._ww-this._sw;
		var T=oEvent.clientY-this._y,ckT=bh+this._wh-this._sh;
		if(L>ckL) L=ckL;
		if(T>ckT) T=ckT;
		if(L<(bw+0)) L=bw+0;
		if(T<(bh+0)) T=bh+0;
		this.style.left=L+"px";
		this.style.top=T+"px";
		if(!Glacier.fn.isNaN(this.isMoveWindowReset)){
			this.isWindowReset=false;
		}		
	};
	Glacier.fn.MoveStop=function(){
		Glacier.RemoveAttachEvent(document, "mousemove", this.mousemove);
		Glacier.RemoveAttachEvent(document, "mouseup", this.mouseup);
		if(Glacier.isIE)this.releaseCapture();
		this.initX=parseInt(this.style.left)-this._wl;
		this.initY=parseInt(this.style.top)-this._wt;
		this.isMove=false;
	};
	/*
	* Glacier的移动事件
	* moveobj:移动对象
	* ismovewindow : false 是否可以移出窗外
	* position:窗体是否悬浮absolute  fixed|absolute
	*/
	Glacier.fn.Move=function(o){
		if(!o) o={n:''};
		this.Each(function(i,op){
			if((typeof o.n)=="number" && i!=o.n || !this) return;			
			var obj=this,objMove=obj;
			o.obj=obj;
			obj.move_o=o;
			if(!this.gobj)
				Glacier.fn.Gdiv(o);
			var _obj=o.obj.gobj,moveing=op.MoveYesWindowIng;
			_obj.mousedown=Glacier.closure({obj:_obj,callBack:op.MoveStart});
			if(o.ismovewindow)moveing=op.MoveNotWindowIng;
			_obj.mousemove=Glacier.closure({obj:_obj,callBack:moveing});
			_obj.mouseup=Glacier.closure({obj:_obj,callBack:op.MoveStop});
			if(o.moveobj && o.moveobj[i] && !Glacier.fn.isNaN(o.moveobj[i])) objMove=o.moveobj[i];
			objMove.style.cursor="move";
			Glacier.AttachEvent(objMove,"mousedown",_obj.mousedown);
		});
		return this;
	};
	Glacier.fn.getMouseCoords=function(e) {
		return {
			x: Glacier.isIE ? e.clientX + Math.max(document.body.scrollLeft, document.documentElement.scrollLeft) : e.pageX,
			y: Glacier.isIE ? e.clientY + Math.max(document.body.scrollTop, document.documentElement.scrollTop) : e.pageY
		};
	};
	Glacier.fn.MoveSize=function(o){
		if(!o) o={obj:'',sizeObj:''};
		if(!o.obj)o.obj=this;
		if(!o.sizeObj) o.sizeObj=o.obj;
		if(!o.obj) return;
		if(Glacier.isString(o.obj)) o.obj=Glacier('#'+o.obj)[0];
		if(Glacier.isString(o.sizeObj)) o.sizeObj=Glacier('#'+o.sizeObj)[0];
		var sobj=o.sizeObj
		,	obj=o.obj
		,	minW = o.minw||1
		,	minH = o.minh||1
		,	wX = sobj.offsetWidth - sobj.offsetWidth
		,	wH = sobj.offsetHeight - sobj.offsetHeight
		,	isLeft	=	o.isleft||true
		,	isRight	=	o.isRight||true
		,	isTop	=	o.isTop||true
		,	isBottom	=	o.isBottom||true
		;
		obj.style.zIndex = o.zindex||Glacier.Zindex();
		obj.onmousedown = function(e) {
			var d = document;
			if (!e) e = window.event;
			var x = e.layerX ? e.layerX: e.offsetX,
			y = e.layerY ? e.layerY: e.offsetY;
			var MCD = Glacier.getMouseCoords(e);
				sobj.startX = MCD.x;
				sobj.startY = MCD.y;
				sobj.startW = sobj.offsetWidth;
				sobj.startH = sobj.offsetHeight;
				
			
			if(o.callbak_mousedown)o.callbak_mousedown(this,e);
			
			if (obj.setCapture)
			 obj.setCapture();
			else if (window.captureEvents)
			 window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			d.onmousemove = function(e) {
				if (!e) e = window.event;
				var mus = Glacier.getMouseCoords(e);
				var newW = (sobj.startW + (mus.x - sobj.startX));
				var newH = (sobj.startH + (mus.y - sobj.startY));
				newW = newW < minW ? minW: newW;
				newH = newH < minH ? minH: newH;
				var mw=(newW - wX);
				var mh=(newH - wH);
				sobj.style.width = mw + "px";
				sobj.style.height = mh + "px";
				if(o.callbak)o.callbak(sobj,e,mw,mh);
			};
			d.onmouseup = function() {
				if (obj.releaseCapture)
				 obj.releaseCapture();
				else if (window.captureEvents)
				 window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
				d.onmousemove = null;
				d.onmouseup = null;
				if(o.callbak_mouseup)o.callbak_mouseup(sobj);
			};
		};
	};
	/*
	* 去除Glacier的移动事件
	*/
	Glacier.fn.RemoveMove=function(){
		this.Each(function(i){
			if(Glacier.fn.isNaN(this.move_o)) return;
			if((typeof this.move_o.n)=="number" && i!=this.move_omove_o.n || !this) return;
			var objMove=this;
			if(this.move_o.moveobj && !Glacier.fn.isNaN(this.move_o.moveobj[i])) objMove=this.move_o.moveobj[i];
			objMove.style.cursor="";
			if(!Glacier.fn.isNaN(this.gobj.mousedown))
				Glacier.RemoveAttachEvent(objMove, "mousedown",this.gobj.mousedown);
		});
		return this;
	};
	/*
	* IE6中，增加遮挡select等的IFRMAE
	*/
	Glacier.fn.ie6DivForIframe=function(){
		var iframeIe6=document.createElement('iframe');
		iframeIe6.style.cssText="position:absolute; z-index: -1; width: 100%; height: 100%;top: 0;left: 0; scrolling: no;filter:alpha(opacity=0);-moz-opacity: 0;opacity: 0;";
		iframeIe6.setAttribute("hspace","0");
		iframeIe6.setAttribute("frameborder","0");
		iframeIe6.src="about:blank";
		return iframeIe6;
	};
	/*
	* IE6中，层悬浮时，屏不抖动
	*/
	Glacier.fn.ie6More=function(){
		if(Glacier.isIE6){
			var imgSrc = document.body.currentStyle.backgroundImage;
			imgSrc = imgSrc.slice(5,imgSrc.length-2);
			if(!imgSrc){
				document.body.style.backgroundAttachment="fixed";
				document.body.style.backgroundImage="url(nothing)";
			}
		}
	};
	/*
	* 锁屏时的全屏背景层
	*/
	Glacier.fn.AltDiv=function(o){
		if(!o) o={};
		var lockDiv="";
		if(o.lock){
			var lockOpa=(o.lock_opa || 75);
			lockDiv=Glacier.dom({type:'div'});
			var wsize=Glacier.windowSize();
			lockDiv.setstyle({style:"z-index:"+Glacier.Zindex()+";position:absolute;top: 0px;left: 0px;height:"+wsize.h+"px;width:"+wsize.w+"px;background:"+(o.lock_back || "#000")+";filter:alpha(opacity="+lockOpa+");-moz-opacity: 0."+lockOpa+";opacity: 0."+lockOpa+";"});
			lockDiv.add();
			if(o.lockfn){
				lockDiv.dom.onclick=o.lockfn;
			}
			if(Glacier.isIE6) lockDiv.dom.appendChild(this.ie6DivForIframe());
			this.AttachEvent(window,'load',function(){
			var wsize=Glacier.windowSize();
			document.getElementById(lockDiv.dom.id).style.width=wsize.w+"px";
			document.getElementById(lockDiv.dom.id).style.height=wsize.h+"px";
		  });
		}
		return lockDiv.dom;
	};
	/*
	* 对象尺寸调整为全屏状态
	*/
	Glacier.fn.AltDivInit=function(o){
		if(o){
			var wsize=Glacier.windowSize();
			o.style.width=wsize.w+"px";
			o.style.height=wsize.h+"px";
		}
	};
	/**
		给要操作的层加上一个隐形的DIV框架，DIV取被操作对像的TOP、LEFT、WIDTH、HEIGHT，确保对实现功能的同时不对被操作对像进行修改
	**/
	Glacier.fn.Gdiv=function(o){
		o.obj.style.visibility="";
		o.obj.style.display="";
		var _obj_init=Glacier.Obj(o.obj),winsize=Glacier.windowSize(),ieDiv=document.createElement('div'),ieDivCss="position:absolute;width:"+_obj_init.w+"px; height:"+_obj_init.h+"px;";//border:1px solid red;
		ieDiv.ieDivCss=ieDiv.ieDivcss_bak=ieDiv.style.cssText=ieDivCss;
		o.obj.style.position='static';
		if(o.position) ieDiv.style.position=o.position;
		o.obj.parentObj=o.obj.parentNode;
		ieDiv.appendChild(o.obj);
		ieDiv.initX=_obj_init.x-winsize.scrollLeft;
		ieDiv.initY=_obj_init.y-winsize.scrollTop;
		if(o.position=='fixed'){
			var ssw=winsize.sw-_obj_init.w,ssh=winsize.sh-_obj_init.h;
			_obj_init.x=ssw>ieDiv.initX?ieDiv.initX:ssw;
			_obj_init.y=ssh>ieDiv.initY?ieDiv.initY:ssh;
			if(Glacier.isIE6 || (!Glacier.compatMode && Glacier.isIE) || Glacier.mobile){
				ieDiv.style.position='absolute';
				_obj_init.x=ssw>ieDiv.initX?ieDiv.initX:ssw;
				_obj_init.y=ssh>ieDiv.initY?ieDiv.initY:ssh;
				ieDiv.initX=_obj_init.x;
				ieDiv.initY=_obj_init.y;
				ieDiv.intervalidgo=function(){
					ieDiv.intervalid=setInterval(function(){
						if(ieDiv.style.display!='none' && !ieDiv.isMove){
							var wsize=Glacier.windowSize();
							ieDiv.style.left=(ieDiv.initX+wsize.scrollLeft)+'px';
							ieDiv.style.top=(ieDiv.initY+wsize.scrollTop)+'px';
							if(!Glacier.mobile) clearInterval(ieDiv.intervalid);
						}
					}, 1000)
				};
				if(Glacier.mobile)
					ieDiv.intervalidgo();
			}
		}
		ieDiv.style.left=_obj_init.x+'px';
		ieDiv.style.top=_obj_init.y+'px';
		if(Glacier.isIE6){
			Glacier.fn.ie6More();
			ieDiv.style.position='absolute';
			ieDiv.appendChild(Glacier.fn.ie6DivForIframe());
		}
		
		if(o.index)ieDiv.style.zIndex=o.index;
		document.body.appendChild(ieDiv);
		o.obj.gobj=ieDiv;
	};
	Glacier.fn.WinAlt=function(o){
		if(!o) o={};
		var lockDiv=''
		,	os=new Array()
		;
		if(o.lock && !this.lockObj){
			var lockDivId='';
			this.Each(function(){
				if(!lockDivId)lockDivId=Glacier(this).getAtt('lockId');
			});
			if(lockDivId)lockDiv=Glacier('#'+lockDivId);
			if(lockDiv.length>0)lockDiv=lockDiv[0];
			if(!lockDiv){
				lockDiv=this.AltDiv(o);
				this.setAtt('lockId',lockDiv.id);
			}
		}else if(this.lockObj){
			lockDiv=this.lockObj;
		}
		if(o.lock){
			lockDiv.style.zIndex=Glacier.Zindex();
			Glacier.fn.log(lockDiv.style.zIndex);
		}
		if(lockDiv){
			lockDiv.style.display='';
			this.lockObj=lockDiv;
		}
		this.Each(function(i,op){
			if((typeof o.index)=="number" && i!=o.index || !this) return;
			o.obj=this;
			this.style.visibility="";
			this.style.display="";
			if(!o.obj.gobj)
				Glacier.fn.Gdiv(o);
			o.obj.gobj.style.visibility="";
			o.obj.gobj.style.display="";
			o.obj.o=o;
			op.WinAltObj(o);
			os.push({obj:o.obj,o:o});
		});
		this.altScroll=function(){
			Glacier.Each(function(){
								var obj=this.obj,i=0,objo=this.o;

								if(!obj.gobj) return;
								obj.gobj.style.visibility="";
								if(o.position=='fixed' && obj.gobj.ieDivCss && (Glacier.isIE6 || (!Glacier.compatMode && Glacier.isIE))){
									obj.gobj.intervalidgo();
								}
							  },os);
			
		};
		this.altResize=function(){
			Glacier.Each(function(){
										var obj=this.obj,objo=this.o;
										if(!obj.gobj) return;
										objo.obj=obj;
										obj.gobj.style.visibility="";
										objo.isCallBack=true;
										if(obj.gobj.isWindowReset)
											Glacier.fn.WinAltObj(objo,true);
										Glacier.fn.AltDivInit(lockDiv);
								  },os);
			
		};
		Glacier.AttachEvent(window,"scroll",this.altScroll);
		Glacier.AttachEvent(window,"resize",this.altResize);
		this.AltDivInit(lockDiv);
		return this;
	};
	Glacier.fn.WinAltObj=function(o,notZindex){
		if(!o || !o.obj || !o.obj.gobj) return;
		/**参数与默认值**/
		
		var _obj=o.obj.gobj;
		if(!_obj.style.width || !_obj.style.height) return;
		var _isTop=o.isTop || false; 							//顶
		var _isBottom=o.isBottom || false;						//底
		var _isLeft=o.isLeft || false;							//左
		var _isRight=o.isRight || false;						//右
		var _isCenter=o.isCenter || false;						//居中
		var _isXCenter=o.isXCenter || false;					//X轴居中
		var _isYCenter=o.isYCenter || false;					//Y轴居中
		var _yLenPx=parseInt(o.yLenPx || "0");					//距Y轴边距
		var _xLenPx=parseInt(o.xLenPx || "0");					//距X轴边距
		var _zIndex=o.zIndex || Glacier.Zindex();					//对象图层轴上位置
		var _lock=o.lock || false;								//是否锁定浏览器
		var _callBack=o.callBack || function(){};				//是否回调方法
		_obj.isWindowReset=o.isWindowReset!=undefined?o.isWindowReset:true;			    	//是否在窗体发生变化时，调整层的相对位置
		_obj.isMoveWindowReset=o.isMoveWindowReset!=undefined?o.isMoveWindowReset:true;		//是否在窗体发生变化时，已拖动的层，位置是否还原初始值
		
		/**设置**/
		if(!notZindex){
			if(o.top || o.lock)
				_obj.style.zIndex=_zIndex;
			else {
				_obj.style.zIndex=o.zIndex||(Glacier.Zindex()-333333);
			}
		}
		var T=0,L=0;
		//var w = parseInt(_obj.offsetWidth||_obj.clientWidth);
		//var h = parseInt(_obj.offsetHeight||_obj.clientHeight);
		var show_obj_ini=Glacier.Obj(_obj);
		var w = show_obj_ini.w
		,	h = show_obj_ini.h
		;
		if(o.isCallBack)_callBack=function(){};

		/**************兼容性设置*******************/
		var wobj=Glacier.windowSize();
		if(_obj.style.position=='fixed'){
			wobj.scrollTop=0;
			wobj.scrollLeft=0;
		}
		
		if(_isCenter){
			L=wobj.scrollLeft+(wobj.sw/2)-(w/2);
			T=wobj.scrollTop+(wobj.sh/2)-(h/2);
			if(T<0) T=0;
			if(L<0) L=0;
		}else{
			if(_isYCenter){
				T=wobj.scrollTop+(wobj.sh/2)-(h/2);
				if(T<0) T=0;
			}else{
				T=_yLenPx;
				if(!_isTop && _isBottom)
					T=wobj.scrollTop+wobj.sh-parseInt(_obj.style.height.replace('px',''))-_yLenPx;
			}
			if(_isXCenter){
				L=wobj.scrollLeft+(wobj.sw/2)-(w/2);
				if(L<0) L=0;
			}else{
				L=_xLenPx;
				if(!_isLeft && _isRight)
					L=wobj.scrollLeft+wobj.sw-parseInt(_obj.style.width.replace('px',''))-_xLenPx;
			}
		}
		_obj.style.top=T+"px";
		_obj.style.left=L+"px";
		_obj.initX=L-wobj.scrollLeft;
		_obj.initY=T-wobj.scrollTop;
		//alert(_obj.style.position+'\r\ntop:'+_obj.style.top+'\r\nleft:'+_obj.style.left);
		_callBack.call(this,o);
	};
	Glacier.fn.none=function(o){
		this.Each(function(){
			this.style.display='none';
		});
	};
	Glacier.fn.show=function(o){
		this.Each(function(){
			this.style.display='';
		});
	};
	Glacier.fn.display=function(o){
		o=o||{};
		index=o.i;
		var list=this;
		var value=function(v){
			list.Each(function(i,op){
				if(i==0 && ((typeof index)!="number" || index==-1) && this.o && this.o.lock && op.lockObj){
					op.lockObj.style.display=(v=='dell'?'none':v);
				}
				if((typeof index)=="number" && i!=index || !this || !this.gobj) return;
				if(v=="dell"){
					var trueObj=this.gobj.firstChild;
					if(Glacier.fn.isNaN(trueObj)) return;
					var g_objDom=Glacier(trueObj);
					g_objDom.style({style:'display:none;'},'update');
					trueObj.parentObj.appendChild(trueObj);
					trueObj.style.cursor="";
					if(!Glacier.fn.isNaN(this.gobj.parentNode))this.gobj.parentNode.removeChild(this.gobj);
					if(!Glacier.fn.isNaN(op.lockObj) && !Glacier.fn.isNaN(op.lockObj.parentNode))op.lockObj.parentNode.removeChild(op.lockObj);
					trueObj.gobj='';
					trueObj.move_o='';
					trueObj.o='';
					op.lockObj='';
				}else{
					this.style.display=v;
					this.gobj.style.display=v;
				}
				o.fn && o.fn();
			});
		};
		var lockDisplay=function(v){
			list.Each(function(i,op){
				op.lockObj&&function(){op.lockObj.style.display=(v=='dell'?'none':v)}();
			});
		};
		this.none=function(){value("none");};
		this.block=function(){value("block");};
		this.show=function(){value("");};
		this.dell=function(){value("dell");};
		this.lock=function(){
			return {
						none:function(){
								lockDisplay("none");
								value("none");
							}
					,	block:function(){
								lockDisplay("block");
								value("block");
							}
					,	show:function(){
								lockDisplay("");
								value("");
							}
					,	dell:function(){
								lockDisplay("dell");
								value("dell");
							}
				};
		};
		return this;
	};
	
	//*****************************************************插件*******************************************************//
	Glacier.fn.getQuery=function(name){
		var reg=new RegExp(String("(^|&|\\?)"+name+"=([^&]*)(&|$)")),r;
		if(r=this.toString().match(reg))
			return unescape(r[2]);
		return null;
	};
	Glacier.fn.getid=function(name){
		return Glacier.getQuery.call(document.location,name);
	};
	Glacier.fn.getRandom=function(min,max){
		return Math.floor(min+Math.random()*(max-min));
	};
	Glacier.fn.isNaN=function(obj){
		return obj=="undefined" || obj==undefined || obj=="" || obj=="null" || obj == null;
	};
	Glacier.fn.isNumber=function(i){
		return (/^[0-9]+((\.?[0-9]+)|([0-9]*))$/.test(i))?true:false;
	};
	/**
	* 去除全部空格
	*/
	Glacier.fn.Trim=function(obj){
		return obj.toString().replace(/\s/g,'');
	};
	/**
	* 去除双空格将所有的一个以上的空格替换成一个空格
	*/
	Glacier.fn.TrimOne=function(obj){
		return obj.toString().replace(/\s{2,}/g," ");
	};
	/**
	* 去除前后二端空格
	*/
	Glacier.fn.TrimTest=function(obj){
		return obj.toString().replace(/(^\s*)|(\s*$)/g,'');
	};
	/**
	* 去除左空格
	*/
	Glacier.fn.TrimLeft=function(obj){
		return obj.toString().replace(/(^\s*)/g,'');
	};
	/**
	* 去除右空格
	*/
	Glacier.fn.TrimRight=function(obj){
		return obj.toString().replace(/(\s*$)/g,'');
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
	Glacier.fn.isWindow=function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	};
	Glacier.fn.isArray=function(obj){
		return Glacier.fn.type(obj) === "array";
	};
	Glacier.fn.isString=function(obj){
		return typeof obj=="string"||false;
	};
	Glacier.fn.isBoolean=function(obj){
		return Glacier.type(obj) === "boolean";
	};
	/**
	* 查找字符串位置
	*/
	Glacier.fn.findstring=function(str,fstr)
	{
		return str.indexOf(fstr||'');
	};
	/**
	* 返回中英文字符长度
	*/
	Glacier.fn.len=function(str)
	{
		return (str||'').toString().replace(/[^\x00-\xff]/g, "**").length;
	};
	/**
	*	取当前对象字体大小
	*
	*/
	Glacier.fn.lenfont=function(findObj){
		var l=function(){
				var style = document.body.currentStyle || document.defaultView.getComputedStyle(document.body, '');
				return style.fontSize;
			}()
		,	fObj=findObj||this
		,	findFontSize=function(){
				var obj=this
				,	size=0
				;
				do
				{
				   try{
					   if(!obj)return;
					   if(!obj.style || !obj.style.fontSize)obj = obj.parentNode;
					   else size=obj.style.fontSize;
					   if(!Glacier.isNumber(size)){
							l=size;
							obj = null;
					   }
						
						
				   } catch( e ) {console.log(e);obj = null;}
				}
				while(obj);
				return parseInt(l||size);
			}
		;
		return findFontSize.call(fObj);
	};
	/**
	*	保留小数点后二位
	*
	*/
	Glacier.fn.toDecimal2=function(x){
		var f = parseFloat(x);  
		if (isNaN(f)) {  
			return false;  
		}  
		var f = Math.round(x*100)/100;  
		var s = f.toString();  
		var rs = s.indexOf('.');  
		if (rs < 0) {  
			rs = s.length;  
			s += '.';  
		}  
		while (s.length <= rs + 2) {  
			s += '0';  
		}  
		return s;
	};
	/**
	* 格式化金额
	*/
	Glacier.fn.formatMoney=function(s,n){
		n = n > 0 && n <= 20 ? n : 2;
		s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
		var l = s.split(".")[0].split("").reverse(),  
		r = s.split(".")[1];  
		t = "";  
		for(i = 0; i < l.length; i ++ )  
		{  
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
		}  
		return (t.split("").reverse().join("")).replace(/(^,)/g,'').replace(/(^-,)/g,'-') + "." + r; 
	};
	/**
	* 金额格式化为数值
	*/
	Glacier.fn.resetMoney=function(s){
		return parseFloat(s.replace(/[^\d\.-]/g, ""));
	};
	/**
	* 显示数字
	*/
	Glacier.fn.FormatNumber=function(s,l){
		var n=(s+'').length
		,	m=''
		,	moneyLen=function(money){
				var tm='';
				for(var i=0,l=money.length;i<l;i++){
					tm+=money[i];
					if(i%3==0)tm+=',';
				}
				if(l>0){
					tm+='.';
					for(var i=0;i<l;i++)tm+='0';
				}
				return tm;
			}
		;
		if(n>20){
			var slist=(s+'').split(".")
			,	sl_1=slist[0].length
			;
			m=slist[0];
			if((s+'').indexOf('.')>=0){
				var m_2='';
				if(slist[1].length>20)
					m_2=moneyLen(slist[0]);
				else
					m_2=Glacier.formatMoney('0.'+slist[1].substr(0,5),l);
					
				var mm=m_2.split(".")
				,	mm_1=m_2[0]
				,	mm_2=(m_2.replace(/\d\./,''))
				;
				m=(parseFloat(m)+parseFloat(mm_1));
			}
			if(sl_1>20) m=moneyLen(slist[0]);
			else  m=Glacier.formatMoney(slist[0],l);
			m=(m+'').replace(/\.00/,'.'+mm_2);
		}else{
			m=Glacier.formatMoney(s,l);
		}
		return m;
	};
	/**
	*format = 'yyyy-mm-dd hh:ii:ss'
	*/
	Glacier.fn.formatdate=function(date,format,d){
		date=Date.parse(date);
		date=date-((d||0)*86400000);
		date=new Date(date);
		var o = {
			"M+|m+" : date.getMonth()+1,
			"D+|d+" : date.getDate(),
			"H+|h+" : date.getHours(),
			"I+|i+" : date.getMinutes(),
			"S+|s+" : date.getSeconds(),
			"q+" : Math.floor((date.getMonth()+3)/3),
			"S" : date.getMilliseconds()
		};
		if(/(y+|Y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
		}
		
		for(var k in o) {
			if(new RegExp("("+ k +")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
			}
		}
		return format;
	};
	/**
	* 截取中英文字符长度
	*/
	Glacier.fn.lenSub=function(str,n,endStr)
	{
	  var r = /[^\x00-\xff]/g;
	  if(Glacier.fn.isNaN(str))return str;
	  if(str.replace(r, "mm").length <= n) return str;
	  var m = Math.floor(n/2);
	  for(var i=m,ni=str.length; i<ni; i++)
	  {
		if(str.substr(0, i).replace(r, "mm").length>=n)
		{
		  return str.substr(0, i)+(endStr?endStr:'');
		}
	  }
	  return str;
	};
	Glacier.fn.filterUrl=function(url){
		var ajaxLocParts,ajaxLocation,
		rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/;
		try {
			ajaxLocation = location.href;
		} catch( e ) {
			ajaxLocation = document.createElement( "a" );
			ajaxLocation.href = "";
			ajaxLocation = ajaxLocation.href;
		}
		ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
		Glacier.fn.ajaxSettings.isLocal=(/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/.test( ajaxLocParts[ 1 ] ));
		return ( ( url?url:ajaxLocation ) + "" ).replace( /#.*$/, "" ).replace( /^\/\//, ajaxLocParts[ 1 ] + "//" );
	};
	Glacier.fn.copyobject=function(destination, source,type) {
		for (property in source) {
		   if(!source.hasOwnProperty(property))continue;
		   if(type=='dom'){
			   if (property == "style") {
				   	try{
					destination.style.cssText = source[property];
					} catch( e ) {}
				} else {
					var key = Glacier.isIE6 || Glacier.isIE7?Glacier.fn.getAttStr(property):property;
					destination.setAttribute(Glacier.fn.getAttStr(key), source[property]);
				}
		   }else
				destination[property] = source[property];
		}
		return destination;
	};
	Glacier.fn.dom=function(o){
		o=o||{};
		var type		=	o.type
		,	attributes	=	o.att	||{}
		,	domtype		=	o.dom	||{}
		,	name		=	o.name||Glacier.uuidFast().replace(/-/ig,'')
		,	id			=	o.id||Glacier.uuidFast().replace(/-/ig,'')
		;
		if(!Glacier.isString(type) || !type){
			attributes=type;
			type='div';
		}
		var div					=		document.createElement(type)
		,	tmpdomtpe			=		{}
		,	retdom				=		function(){return Glacier.copyobject(div,attributes,'dom');}
		;
		div.id=id;
		div.setAttribute('name',name);
		for (k in domtype){
			if(!domtype.hasOwnProperty(k))continue;
			var tpk=this.dom.TYPENAME[k]||k;
			tmpdomtpe[tpk]=domtype[k];
		}
		div=Glacier.copyobject(div,tmpdomtpe);
		return {
			dom:div,
			add:function(obj){
				obj=obj||document.body;
				obj.appendChild(this.dom);
				return this;
			},
			remove:function(){
				var delDom=Glacier('#'+(this.dom||div).id)
				;
				if(delDom.length>0)
					delDom[0].parentNode.removeChild(delDom[0]);
				return this;
			},
			setclass:function(name){
				this.dom.className=name;
			},
			setstyle:function(attributes){
				Glacier.copyobject(this.dom,attributes,'dom');
			},
			del:function(){
				//this.dom='';
				this.remove();
			},
			'':''};
	};
	Glacier.fn.dom.TYPENAME={
			"html"			:	"innerHTML"	,
			"val"			:	"value"	,
			"test"			:	Glacier.isIE?"innerText":"textContent",
			"classname"		:	"className",
	"":""};
	Glacier.fn.dom.ATTRIBUTES={
			"acceptcharset"			:	"acceptCharset"			,
			"accesskey"				:	"accessKey"				,
			"allowtransparency"		:	"allowTransparency"		,
			"bgcolor"				:	"bgColor"				,
			"cellpadding"			:	"cellSpacing"			,
			"cellspacing"			:	"cellPadding"			,
			"class"					:	"className"				,
			"colspan"				:	"colSpan"				,
			"checked"				:	"defaultChecked"		,
			"selected"				:	"defaultSelected"		,
			"for"					:	"htmlFor"				,
			"frameborder"			:	"frameBorder"			,
			"hspace"				:	"hSpace"				,
			"longdesc"				:	"longDesc"				,
			"maxlength"				:	"maxLength"				,
			"marginwidth"			:	"marginWidth"			,
			"marginheight"			:	"marginHeight"			,
			"noresize"				:	"noResize"				,
			"noshade"				:	"noShade"				,
			"readonly"				:	"readOnly"				,
			"rowspan"				:	"rowSpan"				,
			"tabindex"				:	"tabIndex"				,
			"valign"				:	"vAlign"				,
			"vspace"				:	"vSpace"				,
	"":""};
	Glacier.fn.getAttStr=function(key){
		var name=Glacier.isIE6 || Glacier.isIE7?Glacier.dom.ATTRIBUTES[key.toLowerCase()]:key;
		return name||key;
	};
	Glacier.fn.isPlainObject=function( obj ) {
		if ( !obj || Glacier.type(obj) !== "object" || obj.nodeType || Glacier.isWindow( obj ) ) {
			return false;
		}

		try {
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}
		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
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
		if(!Glacier.fn.isNaN(o.param)){
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
	Glacier.fn.arraytoString=function(param,traditional){
		return Glacier.formatparam({
				param		:	param
			,	separate	:	";"
			,	traditional	:	traditional
			,	Handle		:	function(key,value){
					return key + ":" +  value;
				}
		});
	};
	Glacier.fn.tojson=function(param,traditional){
		return Glacier.formatparam({
				param		:	param
			,	separate	:	","
			,	traditional	:	traditional
			,	Handle		:	function(key,value){
					return '"'+encodeURIComponent( key )+'":"'+encodeURIComponent( value )+'"';
				}
		});
	};
	Glacier.fn.closure=function(o){
		return function(event){
			if(Glacier.fn.isNaN(o)) return;
			var e=(event || window.event);
			var ev=(e  ||  arguments.callee.caller.arguments[ 0 ]);
		    var et=ev.srcElement || ev.target;
			o.callBack.call(o.obj,o.arg,et,e);
		}
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
		brow[/mobile|android/]='mobile';
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
		Glacier.mobile=check(/mobile|android/) || false;;
	}();
	Glacier.fn.AttachEvent=function(obj,fn,gb,useCapture){
		if(obj.addEventListener)
			obj.addEventListener(fn,gb,(useCapture||false));
		else if(obj.attachEvent)
			obj.attachEvent("on"+fn,gb);
		else
			obj["on"+fn]=gb;
	};
	Glacier.fn.RemoveAttachEvent=function(obj,fn,gb,useCapture){
		if(obj.removeEventListener){
			obj.removeEventListener(fn,gb,(useCapture||false));
		} else if(obj.detachEvent){
			obj.detachEvent("on"+fn,gb);
		} else{ 
			obj["on"+fn]=null;



		}
	};
	Glacier.fn.Zindex=function(){
		return this.fn._Zindex++;
	};
	Glacier.fn.Obj=function(obj){
		var o=obj;
		if(!obj)
			o=obj=this[0];
		var pt = {x:0,y:0}; 
		do
		{
		   try{
		   pt.x += obj.offsetLeft;
		   pt.y += obj.offsetTop;
		   obj = obj.offsetParent;
		   } catch( e ) {}
		}
		while(obj);
		o.x=pt.x;
		o.y=pt.y;
		o.w = parseInt(o.offsetWidth||o.clientWidth);
		o.h = parseInt(o.offsetHeight||o.clientHeight);

		return o;
	};
	Glacier.fn.ie6alt=function(){
		var o=this.o;
		if(o.obj.gobj.isMove) return;
		o.obj.gobj=this;
		Glacier.fn.WinAltObj(o);
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
								if ( !Glacier.fn.isNaN(isAbort) ) {
									s.callback  && s.callback( 200, "abort" );
								}else
									s.callback  && s.callback();
							} catch (e) {s.callback  && s.callback();}
						}
					};
					if(Glacier.isIE9)script.onerror='';
					if(!Glacier.fn.isNaN(s.cache))
						s.url = s.url + ( /\?/.test( s.url ) ? "&" : "?" ) + "notcache=" + new Date().getTime();
					script.src = s.url;
					Glacier.fn.log('send:'+s.url);
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
	Glacier.fn.statistics=function(){
		var ref=function(){
			try{
				if(document.referrer) return document.referrer+'';
				else if(window.opener) return window.opener.location+'';
			}catch(e){}
			return '';
		}();
		if(Glacier.fn.isNaN(ref))ref='';
		return {
			fromPage:ref,
			toPage:window.location+'',
			toPageTitle:encodeURIComponent(window.document.title) || this.toPage,
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
	Glacier.fn.uuid=function(len, radix){
		var chars = Glacier.fn.Exp.CHARS, uuid = [], i;
		radix = radix || chars.length;
		if(len){
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
		}else{
			var r;
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';
			for(i=0;i<36;i++){
				if(!uuid[i]){
					r = 0 | Math.random()*16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
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
	Glacier.fn.uuidCompact=function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
																				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
																				return v.toString(16);
																				});
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
	//上下版本自定义方法兼容
	if(!Glacier.fn.isNaN(window.$G))
		for(var key in window.$G) {
			if(Glacier.fn.isNaN(Glacier[key])&&!Glacier.fn.isBoolean(Glacier[key])&&!Glacier.fn.isNaN(window.$G[key])){
				Glacier[key]=window.$G[key];
			}
		}
	window.$G=Glacier;
})();
document.writeln('<link rel="stylesheet" type="text/css" href="http://static.adx.haomeit.com/static/95china.com/web/css/95china.css"/>');
(function(){
	$G.w={};
	$G.Config={
		param:function(statistics,uuid){
			var mk=function(){
				var metaKey=$G('.keywords .Keywords')
				,	v=''
				;
				metaKey.Each(function(){
					v+=$G(this).getAtt('content');
				});
				return v;
			}();
			statistics=statistics||$G.statistics();
			return {
				ele:this.ele||'1'							// 1: 文字广告，0：图片广告，目前同一批次展示广告仅支持单一模式
			//,	default_url:this.default_url||''			// 默认展示广告，暂时没用
			,	refer:statistics.fromPage
			,	title:statistics.toPageTitle
			,	url:statistics.toPage
			,	mk:encodeURIComponent(mk||'')
			,	cb:'window.set'+uuid
			};
		}
	,	www:'http://show.adx.haomeit.com'
	,	www_static:'http://static.adx.haomeit.com/images'
	,	wwwImg:'http://images.adx.haomeit.com'
	,	url:function(param){
			var tUrl=$G.Config.www+'/pass?'+$G.param(param)+'&cabin='+(this.cabin||'');
			if(!$G.isNaN(this.param))
				tUrl=tUrl+'&'+$G.param(this.param);
			return tUrl;
		}
	,	isBilling:function(){
			return false;
		}()
	,	htmlStr:function(){
		return '<div name="{name}" class="china_img" style="width:120px; height:240px;">\
				<a name="{name}_colse" class="close_link"><img src="{www}close_03.jpg" width="12" height="12" /></a>\
				<a href="{hrefUrl}" class="img_link" target="_blank"><img src="{filePath}" width="120" height="240" /></a>\
			</div>'.replace(/{www}/ig,$G.Config.www_static+'/');
		}
	,	ini:function(selector){
			var uuid=$G.uuidFast().replace(/-/ig,'')
			,	param=$G.Config.param.call(this,'',uuid)
			,	wmObj=this
			;
			
			$G.w['window.set'+uuid]={
				echoObj		:$G(selector)
			,	wmObj		:wmObj
			,	param		:param
			,	url			:$G.Config.url.call(wmObj,param)
			};
			return uuid;
		}
	};
	$G.wmImg=function(selector){
		this.ele=2;
		var uuid=$G.Config.ini.call(this,selector)
		,	w=$G.w['window.set'+uuid]
		;
		var showFn=function(o){
				o=o||{};
				var wmObj=w.wmObj;
				var different=$G.Config.different;
				var isBilling=$G.Config.isBilling;
				
				var wwwImg=$G.Config.wwwImg;
				var url=w.url;
				var dfData=function(){
					var array=new Array();
					array.push({imgSize:'120X240',webIM:'http://online.15talk.haomeit.com/online/pages/web/totalk.jsp?LeXun=KSFNWPPSYPUH',destinationUrl:'http://www.95china.com/nanke/?95china',filePath:'http://static.adx.haomeit.com/images/jbk_99_com_cn/nanke.jpg'});
					array.push({imgSize:'120X240',webIM:'http://online.15talk.haomeit.com/online/pages/web/totalk.jsp?LeXun=KSFNWPPSYPUH',destinationUrl:'http://www.95china.com/fukeyiy/?95china',filePath:'http://static.adx.haomeit.com/images/jbk_99_com_cn/fukeyiy.jpg'});
					return array;
				}();
				if($G.isNaN(o.data)){
					o.data=[{targetUrl:'http://www.95china.com/nanke/?95china'}];
				}
				if(o.data.length<1){
					o.data=dfData;
				}else{
					var dom120=new Array();
					$G.Each(function(){
						if(this.imgSize=='120X240'){
							dom120.push(this);
						}
					},o.data);
					if(dom120.length<1){
						o.data.push(dfData[0]);
						o.data.push(dfData[1]);
					}else if(dom120.length<2){
						o.data.push(dom120[0]);
					}
				}
				try{
					$G.log(o.data.length);
					wmObj.callback&&wmObj.callback.call(o,o.data.length);
				}catch(e){};
				var wrParam=function(key,val){
				return {
						key:new RegExp('{'+key+'}','ig')
					,	val:val
					};
				};
				var pcI=0
				,	domNameList=wmObj.cabin.split(",")
				;
				$G.Each(function(i){
					var j=o.data[i]
					,	hrefUrl=o.targetUrl
					,	wIm=''
					,	name=$G.uuidFast().replace(/-/ig,'')
					,	htmlStr='<a href="{url}" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><img onerror="" width="{width}" height="{height}" src="{filePath}" ></a>'
					,	regExpFn=function(s,k,v){
							var reg=new RegExp('{'+k+'}','ig')
							;
							return s.replace(reg,v);
						}
					;
					if($G.isNaN(j))return;
					if(j.num>2){
						var url=o.targetUrl+'&link=100&url='+function(){
							var url='http://'+j.destinationUrl;
							return $G.Trim(encodeURIComponent('http://'+(url.replace((new RegExp('http://','ig')),''))));
						}()+'&creative='+j.creativeId
						;
						htmlStr=regExpFn(htmlStr,'url',url);
						delete j['displayUrl'];
						delete j['creativeId'];
						delete j['creativeName'];
						delete j['destinationUrl'];
						delete j['act'];
						if(j['filePath'].indexOf('http://')<0)
							j['filePath']=wwwImg+j['filePath'];
						$G.Each(function(m,k){
							var val=this
							,	key=k
							;
							if(key=='imgSize'){
								var wh=val.split("X")
								;
								key='width';
								val=wh[0]||0;
								htmlStr=regExpFn(htmlStr,key,val);
								key='height';
								val=wh[1]||0;
							}
							htmlStr=regExpFn(htmlStr,key,val);
						},j);
						var obj=$G('.'+domNameList[j.num-1]);
						if(obj.length>0){
							obj[0].innerHTML=htmlStr;
							obj[0].style.display='';
						}
					}else{
						htmlStr=$G.Config.htmlStr();
						if($G.isNaN(j.filePath)){
							j=dfData[pcI];
						}else{
							if(j['filePath'].indexOf('http://')<0)
								j.filePath=wwwImg+j.filePath;
						}
						wIm=$G.isNaN(j.webIM)?'':j.webIM;
						if(j.creativeId){
							hrefUrl+='&link=100&url='+function(){
								var url='http://'+j.destinationUrl;
								return $G.Trim(encodeURIComponent('http://'+(url.replace((new RegExp('http://','ig')),''))));
							}()+'&creative='+j.creativeId;
							if(wIm){
								wIm=o.targetUrl+'&link=2&url='+function(){
									var url='http://'+j.webIM;
									return $G.Trim(encodeURIComponent('http://'+(url.replace((new RegExp('http://','ig')),''))));
								}()+'&creative='+j.creativeId;
							}
						}else{
							hrefUrl=j.destinationUrl;
							wIm=j.webIM;
						}
						var reg=wrParam('filePath',j.filePath);
						htmlStr=htmlStr.replace(reg.key,reg.val);
						var reg=wrParam('hrefUrl',hrefUrl);
						htmlStr=htmlStr.replace(reg.key,reg.val);
						var reg=wrParam('webIM',wIm);
						htmlStr=htmlStr.replace(reg.key,reg.val);
						var reg=wrParam('name',name);
						htmlStr=htmlStr.replace(reg.key,reg.val);
						var div=document.createElement('div');
						div.innerHTML=htmlStr;
						document.body.appendChild(div);
						var WinAltDom=$G('.'+name);
						if(pcI==0){
							WinAltDom.WinAlt({
								position:'fixed',
								isLeft:true,
								isYCenter:true,
								xLenPx:20
							});
						}else{
							WinAltDom.WinAlt({
								position:'fixed',
								isRight:true,
								isYCenter:true,
								xLenPx:20
							});
						}
						$G('.'+name+'_colse').click(function(){
							WinAltDom.display().none();
						});
						pcI++;
					}
				},domNameList);
				try{
					wmObj.callbackEach&&wmObj.callbackEach.call(o,o.data.length);
				}catch(e){};
			}
		;
		if($G.isNaN(w.wmObj.cabin)){
			$G.log('广告位标识无效');
			return ;
		}
		window['set'+uuid]=showFn;
		$G.getjs({
			url:w.url,
			callback:function(){},
			charset:'utf-8'
		});
	};
})();
(function(){
	var param={
		cabin:'TI223RRJ4LN21A,TI2SJFEP4LN21F,TI2BHFUG4LN21C'
	,	param:{
			style:'www_95china_com_pic'
		}
	,	callback:function(n){
		
		}
	};
	$G.wmImg.call(param);
})();