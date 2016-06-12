/*
* Name		: Glacier 1.0
* Author	: wangzheng
* QQ		: 113666386
* Date		: 20150303
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
						if(!Glacier.fn.isNaN(findTag)){
							findTag=Glacier.fn.getAttStr(findTag);
							var tmpTag=(obj.getAttribute(findTag)+'').toLowerCase();
							if(Glacier.fn.isNaN(tmpTag)) continue;
							if(Glacier.Trim(tmpTag)==findVal){
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
		o.sw=Glacier.mobile?Math.max(windowobj.clientWidth):windowobj.clientWidth;//,screen.width
		o.sh=Glacier.mobile?Math.max(windowobj.clientHeight):windowobj.clientHeight;//,screen.height
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
	Glacier.fn._Zindex=99999999999;
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
		o.obj.style.position='relative';
		if(o.position) ieDiv.style.position=o.position;
		o.obj.parentObj=o.obj.parentNode;
		ieDiv.appendChild(o.obj);
		ieDiv.initX=_obj_init.x-winsize.scrollLeft;
		ieDiv.initY=_obj_init.y-winsize.scrollTop;
		if(o.position=='fixed'){
			var ssw=winsize.sw-_obj_init.w,ssh=winsize.sh-_obj_init.h;
			_obj_init.x=ssw>ieDiv.initX?ieDiv.initX:ssw;
			_obj_init.y=ssh>ieDiv.initY?ieDiv.initY:ssh;
			if(Glacier.isIE6 || (!Glacier.compatMode && Glacier.isIE)){
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
		ieDiv.setAttribute('glacier','1');
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
		
		//Glacier.log(w+'|'+h +'==='+ L+'|' + T);
			
		//Glacier.log(_obj.style.position+'\r\ntop:'+_obj.style.top+'\r\nleft:'+_obj.style.left);
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
		Glacier.mobile=check(/mobile|android/) || false;
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
		/*o.w = parseInt(o.style.width||o.offsetWidth||o.clientWidth);
		o.h = parseInt(o.style.height||o.offsetHeight||o.clientHeight);*/
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
	Glacier.fn.setGD=function(o){
		var curIndex = 0
        ,	timeInterval = 5000
		,	arr=o.arr
		,	href=o.href
		,	img=$G('img',o.obj)
		,	a=$G('a',o.obj)
		,	fn=function(){
				if(img.length<1)return;
				var objImg = img[0]; 
				var objA = a[0];
				if (curIndex == arr.length-1) { 
					curIndex = 0; 
				} else { 
					curIndex += 1; 
				  } 
				objImg.src = arr[curIndex];
				objA.href = href[curIndex];
			}
		,	t=null
		;
		return {
			show:function(){
				if(arr.length>0)
					t = setInterval(fn, timeInterval);
			}
		,	close:function(){
				t&&clearInterval(t);
			}
		};
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
(function(){
	$G.wFn={};
	$G.Config={
		code:{
			001:'001'
		,	002:'002'
		,	003:'003'
		,	004:'004'
		,	005:'005'
		/*,	001:'广告位标识无效'
		,	002:'param参数无效'
		,	003:'广告展现逻辑无效'
		,	004:'无人投放广告'
		,	005:'重复调用'*/
		}
	,	param:function(statistics,uuid){
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
			/*var urlLoca=window.location.hostname+'';
			;
			if(urlLoca.indexOf('58.com')<0){
			}else
			statistics.toPage='http://bj.58.com/bpy/';*/
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
	,	wwwStatic:'http://static.adx.haomeit.com/static/'
	,	wwwImg:'http://images.adx.haomeit.com'
	,	wwwGHW:'http://58.guahao.com'
	,	url:function(param){
			var tUrl=$G.Config.www;
			if(this.ele==4){
				param['refer']='';
				tUrl+=this.urlDf+'&'+$G.param(param);
			}else if(this.ele==3){
				tUrl+='/brand?'+$G.param(param)+'&cabin='+(this.cabin||'');
			}else{
				tUrl+='/pass?'+$G.param(param)+'&cabin='+(this.cabin||'');
			}
			if(!$G.isNaN(this.param))
				tUrl=tUrl+'&'+$G.param(this.param);
			return tUrl;
		}
	,	wmReplace:function(s,k,v){
			var reg=new RegExp(k.replace(/\?/ig,'\\?'),'ig')
			;
			return s.replace(reg,v);
		}
	,	rpcTxt:function(s){
			var sl='独家,国家级产品,填补国内空白,全网销量第一,全球首发,全国首家,全网首发,世界领先,极品,顶尖,终极,王牌,销量冠军,NO.1,Top1,极致,永久,王牌,掌门人,领袖品牌,独一无二,绝无仅有,前无古人,史无前例,万能,根治,安全预防,安全无副作用,药到病除,无效退款,保险公司保险,药之王,家级新药,国家级,世界级,最,精确,顶级,绝对,独家,首家,独家,第一品牌,金牌,名牌,优秀,最先,顶级,首,第一,唯一'.split(",");
			for(var i=0,n=sl.length;i<n;i++){
				var reg=new RegExp(sl[i].replace(/\?/ig,'\\?'),'ig');
				s=s.replace(reg,'');
			}
			return s;
		}
	,	oldCabin:($G && $G.Config && $G.Config.oldCabin)?$G.Config.oldCabin:{}
	,	ini:function(statistics){
			var uuid=$G.uuidFast().replace(/-/ig,'')
			,	param=$G.Config.param.call(this,statistics,uuid)
			,	wmObj=this
			;
			$G.wFn['window.set'+uuid]={
				wmObj		:wmObj
			,	echo 		:function(){
									var f=new wmObj.fn()
									;
									return f.eachFn||function(){};
							}()
			,	param		:param
			,	url			:$G.Config.url.call(wmObj,param)
			};
			return uuid;
		}
	};
	
	var put=function(k,w){
			var msg=$G.Config.code[k]
			;
			//$G.log('time:'+$G.formatdate(new Date(),'yyyy-mm-dd hh:ii:ss')+'  提示:'+msg);
			w.wmObj&&w.wmObj.fn&&w.wmObj.fn({code:k,msg:msg});
		}
	;
	$G.wmGet=function(d,statistics){
		d=d||{};
		var uuid=$G.Config.ini.call(d,statistics)
		,	w=$G.wFn['window.set'+uuid]
		,	unboundNotUid=',316,'
		,	trust={
				'3690':3690
			,	'5321':5321
			,	'7086':7086
			,	'8891':8891
			}
		,	clickLink={//广告被点击位置CODE码，移动片在原有CODE上加50
				'title':1				//创意标题
			,	'webIM':2				//咨询
			,	'append_0':3			//附加创意标题1
			,	'append_1':4			//附加创意标题2
			,	'append_2':5			//附加创意标题3
			,	'append_3':6			//附加创意标题4
			,	'append_4':7			//附加创意标题5
			,	'description1':8		//创意描述
			,	'displayUrl':9			//显示网址
			,	'hospUrl':10			//挂号网址
			,	'userPic':11			//医院图片
			,	'img_0':12				//固定图片1
			,	'img_1':13				//固定图片2
			,	'img_2':14				//固定图片3
			,	'img_3':15				//固定图片4
			,	'img_4':16				//固定图片5
			,	'img_5':17				//固定图片5
			,	'companySite':18		//官网地址
			,	'description':19		//固定描述
			,	'imgUrl':100			//图片广告
			}
		,	isLink={//是否是链接
				'webIM':true				//咨询
			,	'destinationUrl':true		//附加创意标题1
			,	'hospUrl':true				//挂号网址
			,	'companySite':true			//官网地址
			}

		,	urlKey=function(name){
				return $G.getQuery.call(this,name)||'';
			}
		;
		if($G.mobile){
			$G.Each(function(i,val){
				clickLink[val]=Number(this+'')+50;
			},clickLink);
		}
		if(d.ele==3){
			$G.Each(function(i,val){
				clickLink[val]=Number(this+'')+500;
			},clickLink);
		}
		if($G.Config.oldCabin[d.cabin]){
			put(005,w);
			return ;
		}
		$G.Config.oldCabin[d.cabin]=true;
		if($G.isNaN(d.cabin)){
			put(001,w);
			return ;
		}else if($G.isNaN(d.param)){
			put(002,w);
			return ;
		}else if($G.isNaN(d.param.trust) || $G.isNaN(trust[d.param.trust])){
			put(003,w);
			return ;
		}
		window['set'+uuid]=function(o){
			if($G.isNaN(o.data)){
				o.data=new Array();
			}
			try{
				w.wmObj.callback&&w.wmObj.callback.call(o,o.data.length);
			}catch(e){};
			var endCFN=function(setArray){
				try{
					w.wmObj.callbackEach&&w.wmObj.callbackEach.call(o,o.data.length,setArray);
				}catch(e){};
			};
			if(o.data.length<1){
				put(004,w);
				endCFN({data:{length:0}},new Array());
				return ;
			}
			var targetUrl=o.targetUrl
			,	unbound=o.unbound//剩余流量，非剩余流量的没有这个属性
			,	setArray=new Array()
			,	toKen=function(){
					var s1=targetUrl.split('click=');
					if(s1.length>0){
						s1=s1[1];
					}
					return s1;
				}()
			,	cabinList=w.wmObj.cabin.split(",")
			,	linkUrl=function(creative,key,val){
					return isLink[key]?targetUrl+'&url='+function(){
						var url='http://'+creative.destinationUrl;
						if(key=='webIM'){
							url=creative.webIM||'';
						}else if(key=='hospUrl'){
							url=creative.hospUrl||'';
						}else if(key=='companySite'){
							url=creative.companySite;
						}
						//url=url+toKen;
						return $G.Trim(encodeURIComponent('http://'+(url.replace((new RegExp('http://','ig')),''))));
					}()+'&creative='+creative.creativeId:val;
				}
			;
			for(var i=0,n=cabinList.length;i<n;i++){
				var getJson=''
				,	addJson={}
				;
				if(w.wmObj.ele!=3){
					getJson=o.data[i]||'';
				}else{
					getJson=(o.data).length>0?o.data[0]:o.data;
				}
				if(getJson){
					if(w.wmObj.ele!=3&&$G.isNaN(getJson.append)){
						getJson.append=new Array();
					}
					if(w.wmObj.ele!=3&&$G.isNaN(getJson.plugins)){
						getJson.plugins=new Array();
					}
					
					$G.Each(function(aaa,key){
						addJson['href']=getJson['destinationUrl'];
						addJson['act']=getJson['act']||'';
						if(unbound&&(addJson['act']+'').indexOf(unboundNotUid)>=0){
							return;
						}
						if(w.wmObj.param.device==1){
							if(getJson['mobile_destination_url'])
								getJson['destinationUrl']=addJson['href']=getJson['mobile_destination_url'];
							if(getJson['mobile_display_url'])
								getJson['displayUrl']=getJson['mobile_display_url'];
						}
						var val=this
						,	destinationUrl=linkUrl(getJson,'destinationUrl',addJson['href']);
						;
						if(this===window)val='';
						if(key=='append' && this.length>0){//附加创意
							var liList=new Array()
							;
							$G.Each(function(appendI){
								var appendObj=this;
								var addAppendJson={};
								appendObj['creativeId']=getJson.creativeId;
								$G.Each(function(m,ak){
									var str=this+'';
									if(ak=='destinationUrl'){
										str=linkUrl(appendObj,ak,this+'')+'&link='+clickLink['append_'+appendI];
									}
									addAppendJson[ak]=str;
								},this);
								liList.push(addAppendJson);
							},this);
							addJson['append']=liList;
							val='';
						}else if(key=='plugins'){//挂号网数据
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
								if(hospitalKey) val=$G.Config.wwwGHW+'/department/'+hospitalKey;
								else val=$G.Config.wwwGHW+'/hospital/'+hospitalToken;
								addJson['hospHref']=val;
								getJson['hospUrl']=val;
							}else{
								val='';
							}

							key='hospUrl';
						}else if(key=='act'){
							key='userPic';
							val=$G.Config.wwwImg+'/HospitalImgFile/'+val+'.JPG?notcache='+(new Date().getTime());
						}else if(key=='filePath'){
							key='imgUrl';
							val=$G.Config.wwwImg+getJson.filePath;
						}else if(key=='webIM'){
							var repFn=function(url,name){
									var s=urlKey.call(url,name)
									,	u=url
									;
									if(s){
										s=name+'='+s;
										u=$G.Config.wmReplace(url,s,s+'_haomeitid_'+toKen);
									}else{
										u = u + ( /\?/.test( url ) ? "&" : "?" );
										u+=name+'='+'_haomeitid_'+toKen;
									}
									return u;
								}
							,	imUrl=val.toLowerCase()
							,	isSwt=imUrl.indexOf("/lr/")<0?false:true
							;
							if(isSwt){
								val=repFn(val,'p');
								val=repFn(val,'r');
								val=repFn(val,'e');
							}
							addJson['webImHref']=val;
							getJson[key]=val;
						}else if(key=='imgs' && this.length>0){
							var liList=new Array()
							;
							$G.Each(function(imgI){
								var imgObj=this;
								var imgJson={};
								imgObj['creativeId']=getJson['creativeId'];
								imgObj['destinationUrl']=imgObj.url;
								$G.Each(function(m,ak){
									var str=this+'';
									if(ak=='url'){
										str=linkUrl(imgObj,'destinationUrl',str)+'&link='+clickLink['img_'+imgI];
									}else if(ak=='imgPath'){
										str=$G.Config.wwwImg+str;
									}
									imgJson[ak]=str;
								},this);
								liList.push(imgJson);
							},this);
							addJson['imgs']=liList;
							val='';
						}else if(key=='companySite'){
							addJson['companySiteStr']=val+'';
						}
						
						
						/*************************数据处理***************************/
						if(!$G.isNaN(val)){
							addJson[key]=linkUrl(getJson,key,val+'');
							if(clickLink[key]>0){
								addJson[key+'_Url']=(isLink[key]?addJson[key]:destinationUrl)+'&link='+clickLink[key];
							}
						}
					},getJson);
					addJson['unbound']=unbound;
					setArray.push(addJson);
				}
				addJson['type']=w.wmObj.ele;
				var index=getJson['num']?(getJson['num']-1):i;
				addJson['index']=index;
				addJson['cabin']=cabinList[index];
				if(addJson['title']){
					addJson['title']=$G.Config.rpcTxt(addJson['title']);
				};
				if(addJson['description1']){
					addJson['description1']=$G.Config.rpcTxt(addJson['description1']);
				};
				
				w.echo(addJson);
			}
			endCFN(o,setArray);
		};
		$G.getjs({
			url:w.url,
			charset:'utf-8'
		});
	};
	$G.wm=function(o){
		o=o||{};
		var param={
			/**************************************/
			/****广告处理回调方法****/
			/**************************************/
			fn:o.fn||function(d){
				d=d||{code:0};
				if(d.code!=0){
					//alert(d.msg);
				}
				this.eachFn=function(json,type,s){
					//$G.log('广告位标识:'+json.cabin+' 广告类型:'+json.type+' 索引:'+json.index+' 广告标识:'+json['creativeId']);
					/****以下为JSON属性遍历跟据实际显示结果自行编码*******/
					var str='';
					$G.Each(function(i,key){
						str+=this+'='+i;
					},json);
				};
				
			}
			/*********************回调开始*********************************/
		,	callback:o.callback||function(){
					//$G.log('回调开始');
			}
			/*********************回调结束*********************************/
		,	callbackEach:o.callbackEach||function(){
					//$G.log('回调结束');
			}
		,	cabin:o.cabin||''
		,	ele:o.ele||1					//广告类型 1：文字广告	2：图片广告 3:固定广告 默认1
		,	param:{
				/**************************************/
				/*****广告展现逻辑***/
				/****3690:以科室方案进行物料检索****/
				/****5321:只根据title进行物料检索****/
				/****7086:根据URL和title进行物料检索****/
				/****8891:是否排除区域，排除的区域显示默认广告****/
				/**************************************/
				trust:o.trust||7086
			,	device:o.device||0//是否为移动设备
			,	dept:o.dept||''			//trust:3690 时检索科室分类的范围 科室CODE:1006000000
			,	ur:o.ur||''			//媒体URL所在的区域 区域CODE:1000100000
			,	style:o.style||'style20141130'		//页面标识广告以哪种风格显示，便于日志数据分析
			,	id:o.id||''		//家庭医生   ID
			}
		};
		if(o.addParam){
			$G.Each(function(i,v){
				param.param[v]=this+'';
			},o.addParam)
		}
		if(o.urlDf)
			param['urlDf']=o.urlDf;
			
		var urlLoca=window.location.hostname+'';
		;
		//if(urlLoca.indexOf('58.com')<0)
			$G.wmGet(param);
	};
	
	$G.eff=function(w){
		var obj=w[0];
		this.shake=function(){
			var fn=function(){
				var a = ['top', 'left']
				,	b = 0
				,	u = window.setInterval(function() {
							obj.style[a[b % 2]] = (b++) % 4 < 2 ? 0 : 4 + "px";
							if (b > 25) {
								clearInterval(u);
								b = 0
							}
					}, 32)
				;
			};
			window.setInterval(fn, 2000);
		};
		this.closeTime=function(n){
			window.setTimeout(function(){
				w.display().show();
			}, n*1000);
		};
		return this;
	};
	/************************************
	层定位参数
	position:int.position||'fixed',
	isTop:int.isTop||false,
	isBottom:int.isBottom||false,
	isLeft:int.position||false,
	isRight:int.isRight||false,
	isXCenter:int.isXCenter||false,
	isYCenter:int.isYCenter||false,
	xLenPx:int.xLenPx||20,
	yLenPx:int.yLenPx||20
	**************************************/
	$G.model=function(){
		var NewLine = '\n'
		,	uuid=$G.uuidFast().replace(/-/ig,'')
		,	setDom=function(str,o){
				var uuid=$G.uuidFast().replace(/-/ig,'')
				,	eff={}
				,	close=function(){
						eff.closeDiv();
						w.display().none();
					}
				;
				str=$G.Config.wmReplace(str,'<!--name-->',uuid);
				var div=document.createElement('div');
				div.innerHTML=str;
				div.style.top='-9999px';
				div.style.position='absolute';
				document.body.appendChild(div);
				var w=$G('.'+uuid);
				$G('.'+uuid+'_colse').click(close);
				return {
					show:function(int,time){
						int=int||{
							position:'fixed',
							isLeft:true,
							isYCenter:true,
							xLenPx:20
						};
						w.WinAlt(int);
						eff=new $G.eff(w);
						eff.closeDiv=function(){
							if(time){
								eff.closeTime(time);
							}
						};
						$G('.'+o.cabin).none();
						return eff;
					}
				,	echo:function(dfHtml,cbFn){
						var s=setHtml(o,dfHtml,'<a href="<!--hrefUrl-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><img  width="<!--w-->" height="<!--h-->" src="<!--imgUrl-->" ></a>')
						,	domSetHtml=$G('.'+o.cabin)
						;
						if(domSetHtml.length<1)cbFn&&cbFn(o,s);
						domSetHtml.html(s);
						domSetHtml.show();
					}
				,	none:close
				,	eff:eff
				,	obj:w[0]
				};
			}
		,	setStyle=function(sty){
				if(document.all){
					var sheet=document.createStyleSheet();
					$G.Each(function(i,key){
						sheet.addRule(key,this+'',i); 
					},sty);
				}else{
					var styles=document.createElement('style')
					,	css=''
					;
					$G.Each(function(i,key){
						css+=key+'{'+this+'}'; 
					},sty);
					styles.innerHTML=css;
					document.body.appendChild(styles);
				}
			}
		,	setHtml=function(o,s){
				o.imgSize=o.imgSize||'120X240';
				var size=o.imgSize.split('X')
				,	dom=function(){
						var w=0
						,	h=0
						;
						if(size && size.length>1){
							w=size[0];
							h=size[1];
						}
						o.fn&&o.fn(w);
						return {
							w:w
						,	h:h
						};
					}()
				;
				var dfHtml=o.dfHtml||'<a href="<!--hrefUrl-->" style="text-decoration:none; cursor:pointer;" target="_blank"><img src="<!--imgUrl-->" width="<!--w-->" height="<!--h-->" style="FILTER: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=<!--imgUrl-->)" /></a> '
				,	dfCloseHtml=o.isClose===false?'':'<a name="<!--name-->_colse" style=" position:absolute; right:0px; top:0px; z-index:999; border:none;"><img src="<!--www-->images/close.jpg" width="12" height="12" /></a>'
				;
					
				s=s||'<div name="<!--name-->" style="width:'+dom.w+'px; height:'+dom.h+'px; overflow:hidden; position:relative;"><!--close--><!--text--></div>';
				s=$G.Config.wmReplace(s,'<!--w-->',dom.w);
				s=$G.Config.wmReplace(s,'<!--h-->',dom.h);
				s=$G.Config.wmReplace(s,'<!--close-->',dfCloseHtml);
				dfHtml=$G.Config.wmReplace(dfHtml,'<!--w-->',dom.w);
				dfHtml=$G.Config.wmReplace(dfHtml,'<!--h-->',dom.h);
				s=$G.Config.wmReplace(s,'<!--text-->',dfHtml);
				if(!o.dfHtml){
					s=$G.Config.wmReplace(s,'<!--hrefUrl-->',o.href);
					s=$G.Config.wmReplace(s,'<!--imgUrl-->',o.src);
				}
				s=$G.Config.wmReplace(s,'<!--www-->',$G.Config.wwwStatic);
				return s;
			}
		;
		return {
			setStyle:setStyle
		,	pic:function(o){
				o=o||{};
				var s=setHtml(o);
				s=$G.Config.wmReplace(s,'<!--www-->',$G.Config.wwwStatic);
				return setDom(s,o);
			}

		,	pp:function(json){
				var str = '';
				str+='<div style="border:1px solid #dbdde1;height:auto; overflow:hidden; padding:2px 10px 3px 16px;font-family:宋体;">'+NewLine;
				str+='  <div style="height:115px; position:relative;font-size:12px; line-height:20px; color:#4c4c4c;"> <a href="<!--web_im-->" target="_blank" style="text-decoration:none; cursor:pointer;"><img src="<!--img1-->" width="140" height="100" style="float:left; padding:1px;border:1px solid #dbdde1; margin-top:2px;" /></a>'+NewLine;
				str+='    <dl style="float:right; width:520px; margin:0;">'+NewLine;
				str+='      <dt style=" text-align:center; font-size:20px; height:28px; line-height:28px; overflow:hidden;"><a href="<!--web_im-->" target="_blank" style="color:#1155cc; text-decoration:none;"><!--title--></a></dt>'+NewLine;

				str+='      <dd style="margin:0; height:40px; overflow:hidden; word-wrap:break-word; position:relative;"><a href="<!--description_Url-->" class="text_overflow" target="_blank" style="color:#4c4c4c; text-decoration:none; cursor:pointer;"><!--description--></a><a href="<!--description_Url-->" target="_blank" style=" text-decoration:none;color:#1155cc;cursor:pointer;">...更多</a></dd>'+NewLine;
				str+='      <dd style="margin:0; height:20px; overflow:hidden; word-wrap:break-word;">电话：<span style=" color:#006600;"><!--tel--></span></dd>'+NewLine;
				str+='      <dd style="margin:0; height:20px; overflow:hidden; word-wrap:break-word;">官网：<a href="<!--DESTINATION_URL-->" target="_blank" style=" color:#006600; text-decoration:none;"><!--display_url--></a></dd>'+NewLine;
				str+='    </dl>'+NewLine;
				str+='    <a href="<!--web_im-->" target="_blank" style="text-decoration:none; position:absolute; top:85px; right:110px;"><img src="<!--www-->58.com/web/images/58-ad03.gif" width="89" height="23"/></a> <a href="<!--web_im-->" target="_blank" style="text-decoration:none; position:absolute; top:85px; right:15px;"><img src="<!--www-->58.com/web/images/58-ad04.gif" width="89" height="23"/></a> </div>'+NewLine;
				str+='  <div style="height:82px;"> <a href="<!--web_im-->" target="_blank" style="text-decoration:none; cursor:pointer;"><img src="<!--img2-->" width="120" height="80" style="float:left; padding:1px;border:1px solid #dbdde1;margin-right:14px; " /></a> <a href="<!--web_im-->" target="_blank" style="text-decoration:none; cursor:pointer;"><img src="<!--img3-->" width="120" height="80" style="float:left; padding:1px;border:1px solid #dbdde1;margin-right:14px; " /></a> <a href="<!--web_im-->" target="_blank" style="text-decoration:none; cursor:pointer;"><img src="<!--img4-->" width="120" height="80" style="float:left; padding:1px;border:1px solid #dbdde1;margin-right:14px; " /></a> <a href="<!--web_im-->" target="_blank" style="text-decoration:none; cursor:pointer;"><img src="<!--img5-->" width="120" height="80" style="float:left; padding:1px;border:1px solid #dbdde1;margin-right:14px;" /></a> <a href="<!--web_im-->" target="_blank" style="text-decoration:none; cursor:pointer;"><img src="<!--img6-->" width="120" height="80" style="float:left; padding:1px;border:1px solid #dbdde1;" /></a> </div>'+NewLine;
				str+='</div>'+NewLine;
				
				if($G.mobile){
					var css={};
					css['.c-box']='background: #fff;margin: 0 auto; padding: 5px;';
					css['.c-box .c-title']='font-size: 18px; color: #1155cc; margin-bottom:5px;';
					css['.c-box .c-title span']='color: red;';
					css['.c-box .c-title em']='font-size: 14px; font-style: normal; color: #fff; background: #1155cc;';
					css['.c-cont:after,.c-btn:after']='content:""; display: block; line-height: 0; clear: both; visibility: hidden;';
					css['.c-cont img.c-img-lf']='float: left; margin-top: 5px;';
					css['.c-cont ul']='color: #000; padding: 7px 0 7px 7px; line-height: 20px; height: 82px; overflow: hidden;';
					css['.c-cont ul li:nth-child(1)']='overflow:hidden; text-overflow:ellipsis; display: -webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;';
					css['.c-cont ul li:nth-child(2)']='font-size: 12px; color:#c2ccd1;';
					css['.c-cont ul li:nth-child(2) span']='color: #000;';
					css['.c-cont ul li:nth-child(3)']='margin-top: 5px;';
					css['.c-cont ul li:nth-child(3) span']='display: block; float: left;overflow: hidden;';
					css['.c-cont ul li:nth-child(3) span.start-bg']='margin-top:3px; margin-right:2px;width: 68px; height: 13px;  background: url("img/start.png") no-repeat 0 -13px;';
					css['.c-cont ul li:nth-child(3) span.start-bg span']='xwidth: 68px; height: 13px;  background: url("img/start.png") no-repeat;';
					css['.c-cont ul li:nth-child(3) span.c-font']='color:#949494; font-size: 12px;';
					css['.c-btn button']='width: 48%;border:1px solid #c2ccd1; text-align: center; padding: 10px 0; background: none;';
					css['.c-btn button:nth-child(1)']='float: left;';
					css['.c-btn button:nth-child(2)']='float: right; margin-right: 0;';
					setStyle(css);
					
					str=['<div class="c-box"><a href="<!--web_im-->" target="_blank" style="text-decoration:none; cursor:pointer;">',
'        <div class="c-title"><!--title--></div>',
'        <div class="c-cont">',
'            <img src="<!--img1-->" width="82" height="82" class="c-img-lf">',
'            <ul style="margin: 0; padding: 10;">',
'                <li style="list-style: none;"><!--description--></li>',
'                <li style="list-style: none; display:none;"><span>资深律师</span> | <span>资深律师</span> | <span>资深律师</span> | <span>资深律师</span></li>',
'                <li style="list-style: none; display:none;"><span class="start-bg"><span style="width: 10%"></span></span><span class="c-font">238条评论 |</span><span class="c-font">&nbsp;已成交1.9万单</span></li>',
'            </ul>',
'        </div>',
'        <div class="c-btn">',
'            <button>在线咨询</button>',
'            <button>在线预约</button>',
'        </div>',
'        </a>',
'    </div>'].join("");

				}
				if(!json['hospUrl_Url']){
					json['hospUrl_Url']=json['webIM_Url'];
				}
				
				if(json['imgs'] && json['imgs'].length>0){
					for(var i=0,n=json['imgs'].length;i<n;i++){
						var imgJson=json['imgs'][i]
						,	ls=imgJson.sequence
						;

						/*if(imgJson.isFocusImg==1){
							ls=0;
						}*/
						str=$G.Config.wmReplace(str,'<!--imgHref'+ls+'-->',imgJson.url);
						str=$G.Config.wmReplace(str,'<!--imgUrl'+ls+'-->',imgJson.imgPath);
					}
				}
				if(json['webIM']){
					str=$G.Config.wmReplace(str,'<!--webIMDisplay-->','');
				}else{
					str=$G.Config.wmReplace(str,'<!--webIMDisplay-->','none');
				}
				
				$G.Each(function(i,k){
					str=$G.Config.wmReplace(str,'<!--'+k+'-->',this+'');
				},json);
				
				str=$G.Config.wmReplace(str,'<!--www-->',$G.Config.wwwStatic);
				var echoDom=$G('.'+json.cabin)
				;
				if(echoDom.length>0){
					echoDom[0].innerHTML=str;
					echoDom.show();
				}

			}
		,	text:function(json){
				var styFn=function(n){
						if(n>0)return;
						var css={};
						css['a.tcolor'+uuid]='color:#1155cc;text-decoration:none;';
						css['a.tcolor'+uuid+':hover']='color:#fe7d05; text-decoration:underline;';
						setStyle(css);
					}
				,	replaceData=function(str){
						if(json['append'] && json['append'].length>0){
							for(var i=0,n=json['append'].length;i<n;i++){
								$G.Each(function(a,k){
									str=$G.Config.wmReplace(str,'<!--'+k+i+'-->',this+'');
								},(json['append'][i]));
							}
							str=$G.Config.wmReplace(str,'<!--appendSeparate-->','|');
							str=$G.Config.wmReplace(str,'<!--appendDisplay-->','');
							str=$G.Config.wmReplace(str,'<!--displayUrlDisplay-->','none');
						}else{
							str=$G.Config.wmReplace(str,'<!--displayUrlDisplay-->','');
							str=$G.Config.wmReplace(str,'<!--appendDisplay-->','none');
						}
						$G.Each(function(i,k){

							str=$G.Config.wmReplace(str,'<!--'+k+'-->',this+'');
						},json);
						if(json['hospUrl']){
							str=$G.Config.wmReplace(str,'<!--guaHaoDisplay-->','');
						}else{
							str=$G.Config.wmReplace(str,'<!--guaHaoDisplay-->','none');
						}
						if(json['webIM']){
							str=$G.Config.wmReplace(str,'<!--webIMDisplay-->','');
						}else{
							str=$G.Config.wmReplace(str,'<!--webIMDisplay-->','none');
						}
						str=$G.Config.wmReplace(str,'<!--www-->',$G.Config.wwwStatic);
						str=$G.Config.wmReplace(str,'<!--wwwImg-->',$G.Config.wwwImg);
						str=$G.Config.wmReplace(str,'<!--uuid-->',uuid);
						return str;
					}
				,	each=function(str){
						var echoDom=$G('.'+json.cabin)
						;
						if(echoDom.length>0){
							echoDom[0].innerHTML=str;
							echoDom.show();
						}
						return echoDom;
					}
				;
				return {
					long:function(isMobile,type){
						styFn(json.index);
						var str = '';
						str+='<div style="overflow:hidden;clear:both; min-width:675px;font-family:Arial,simsun,sans-serif,宋体;">'+NewLine;
						str+='  <div style="float:left; margin-right:15px;">'+NewLine;
						str+='    <div style="width:80px; height:60px; overflow:hidden; position:relative; display:table-cell; vertical-align:middle; text-align:center;"> <a target="_blank" href="<!--userPic_Url-->" style="border:none; text-decoration:none; cursor:pointer;"> <i style="*display:inline-block;*height:100%;*vertical-align:middle;"></i> <img src="<!--userPic-->" onerror="this.src=\'<!--www-->images/default-ad.jpg\'" width="80" height="60" style="border:none;*vertical-align:middle;"> </a> </div>'+NewLine;
						str+='  </div>'+NewLine;
						str+='  <div style="float:left; height:60px;">'+NewLine;
						str+='    <div style=" height:22px;width:456px;"> <span style="display:block; float:left; padding-right:5px;font-size:14px;height:22px; max-width:456px;overflow:hidden;"> <i style="float:left; font-style:normal; max-width:340px;height:22px;line-height:21px;overflow:hidden;"> <a target="_blank" href="<!--title_Url-->" class="tcolor<!--uuid-->" target="_blank"><!--title--></a></i><i style="display:none;width:16px; height:18px;float:left;background: url(<!--www-->images/58-ad03.jpg) no-repeat right 2px; margin-left:13px;"></i> <i style="display:<!--guaHaoDisplay-->;width:16px; height:18px;float:left;background: url(<!--www-->images/58-ad02.gif) no-repeat right 2px; margin-left:13px;"></i> </span> <span style="display:<!--guaHaoDisplay-->;float:left;height:19px; line-height:19px;color:#666666;padding-left:13px; margin-left:15px;background: url(<!--www-->images/cy_ico_04.png) no-repeat scroll left center;"> <a target="_blank" href="<!--hospUrl_Url-->" style="display:block;height:19px; line-height:19px; color: #666666;font-size:12px; text-decoration:underline;" target="_blank"> 挂号</a> </span> </div>'+NewLine;
						str+='    <div style="clear:both;overflow:hidden;"> <a target="_blank" href="<!--description1_Url-->" style=" clear:both; display:block;width:456px;color:#585858;font-size: 12px; text-decoration:none;height:22px; line-height:22px;float:left;overflow:hidden;word-wrap: break-word;word-break: break-all;" ><!--description1--></a> </div>'+NewLine;
						str+='    <div style="clear:both;overflow:hidden;"> <span style="display:<!--appendDisplay-->;float:left; font-size:12px; line-height:19px;max-width:400px; overflow:hidden;"> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl0-->"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title0--></a></i> <!--appendSeparate--> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl1-->"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title1--></a></i> <!--appendSeparate--> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl2-->"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title2--></a></i> <!--appendSeparate--> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl3-->"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title3--></a></i> <!--appendSeparate--> <i style=" font-style:normal;"><a target="_blank" href="<!--destinationUrl4-->"  class="tcolor<!--uuid-->" style="text-decoration:underline;"><!--title4--></a></i> </span> <span style="clear:both;display:<!--displayUrlDisplay-->;float:left;font-size:12px;line-height:18px;width:456px;overflow: hidden; word-break: break-all; word-wrap: break-word; margin-right:10px;"> <i style=" font-style:normal;"> <a target="_blank" href="<!--displayUrl_Url-->" style="text-decoration:none;color:#006600;" target="_blank"><!--displayUrl--></a> </i> </span> </div>'+NewLine;
						str+='  </div>'+NewLine;
						str+='  <div style="display:<!--webIMDisplay-->;float:right; padding-top:20px;"><a target="_blank" href="<!--webIM_Url-->" style="display:block; width: 92px; height:20px; float:right; cursor:pointer;"><img src="<!--www-->images/58-ad01.gif" width="89" height="23" /></a> </div>'+NewLine;
						str+='</div>'+NewLine;
						
						if(isMobile){
							var MbStr = '';
							MbStr+='<div style="overflow:hidden;font: normal 100% Helvetica, Arial, sans-serif; line-height:100%; position:relative;">'+NewLine;
							MbStr+='  <div style="float:left; height:64px;overflow: hidden; margin-right:78px;">'+NewLine;
							MbStr+='    <div style="height:22px; line-height:22px; font-size: 1.125em;font-weight:bold;overflow: hidden;"><a href="<!--title_Url-->" style="color:#000; text-decoration:none; cursor:pointer;" target="_blank"><!--title--></a></div>'+NewLine;
							MbStr+='    <div style="height:22px; line-height:22px;font-size: 0.75em; color:#101211;overflow: hidden;"><a href="<!--description1_Url-->" style="color:#101211; text-decoration:none; cursor:pointer;" target="_blank"><!--description1--></a></div>'+NewLine;
							MbStr+='    <div style=" display:inline-block;height:20px;line-height:20px;font-size: 0.8em;color:#5da7c4;overflow: hidden;padding-right:25px; background:url({www}web_pic.jpg) no-repeat center right;"><a href="<!--displayUrl_Url-->" style="color:#5da7c4;text-decoration:none; cursor:pointer;" target="_blank"><!--displayUrl--></a></div>'+NewLine;
							MbStr+='  </div>'+NewLine;
							MbStr+='  <div style="display:{webimDisplay};float:right; position:absolute; right:0;">'+NewLine;
							MbStr+='    <div style="width:68px; height:64px; margin-left:2px;position:relative; display:table-cell; vertical-align:middle; text-align:center;"><a href="<!--webIM_Url-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><span style="*position:absolute;top:50%;"> <img src="<!--www-->58.com/web/images/cy_ico_07.png" width="54" height="54" style=" border:none;*position:relative; top:-50%;left:-50%;"/> </span></a></div>'+NewLine;
							MbStr+='  </div>'+NewLine;
							MbStr+='</div>'+NewLine;
							
							if(type=='myanhao'){
								str=['<div style="overflow:hidden;font: normal 100% Helvetica, Arial, sans-serif; width:100%;  background:#fff; line-height:100%; position:relative; margin-bottom:15px;">',
'  <div style="float:left; height:75px; overflow:hidden; margin-right:10px;">',
'    <div style="height:45px; line-height:45px; width:100%; border-bottom:solid 1px #dedede; font-size: 1.125em;font-weight:bold;overflow: hidden;">',
'      <div style="text-align:center; display:block; float:left; width:30px; margin-right:5px; color:#fff; background:#f25c17; border-radius:5px; height:25px; line-height:23px; margin-top:10px; font-weight:normal; font-size:0.7em;">推荐</div>',
'      <a href="<!--title_Url-->" style="color:#4c4c4d; float:left; display:block; height:45px;  text-decoration:none;cursor:pointer; width:75%;"  target="_blank"><!--title--></a></div>',
'    <div style="height:25px; line-height:25px; display:block;font-size:0.9em; background:#fff; color:#101211;overflow: hidden;"><a href="<!--description1_Url-->" style="color:#101211;   text-decoration:none; cursor:pointer;" target="_blank"><!--description1--></a></div>',
'    <div style=" display:inline-block;height:20px;line-height:20px;font-size: 0.8em;color:#5da7c4;overflow: hidden;padding-right:25px; background:url({www}web_pic.jpg) no-repeat center right;"><a href="<!--displayUrl_Url-->" style="color:#5da7c4;text-decoration:none; cursor:pointer;" target="_blank"> </a></div>',
'  </div>',
'  <div style="display:{webimDisplay};float:right; position:absolute; right:0;">',
'    <div style="width:0%; height:64px; margin-left:2px;position:relative; display:table-cell; vertical-align:middle; text-align:center;"><a href="<!--webIM_Url-->" style="border:none; text-decoration:none; cursor:pointer;" target="_blank"><span style="*position:absolute;top:50%;">',
'      <div style="width:60px; margin-bottom:20px;"><img src="<!--www-->58.com/web/images/sfsfsf_03.jpg" style="width:100%;"></div>',
'      </span></a></div>',
'  </div>',
'</div>',
].join("");
							}else{
								str=MbStr;
							}
						}
						each(replaceData(str));
					}
				,	short:function(){
							var str = '';
							str+='<div style="color:#333333;word-break: break-all; word-wrap: break-word;overflow:hidden;font-family:Arial,simsun,sans-serif,宋体;"> <span style="display: block;height: 22px;overflow: hidden;" > <a target="_blank" href="<!--title_Url-->" class="tcolor<!--uuid-->" style="font-size:14px;height:22px;line-height:21px; text-decoration:underline;" target="_blank"><!--title--></a> </span>'+NewLine;
							str+='  <div style="display:block; max-height:40px;overflow: hidden; word-break: break-all; word-wrap: break-word;"> <a target="_blank" href="<!--description1_Url-->" style="color:#333333;text-decoration:none;font-size: 12px;line-height:19px;" target="_blank"><!--description1--></a> </div>'+NewLine;
							str+='  <div style="width:100%;"> <a target="_blank" href="<!--displayUrl_Url-->" style="display:block;float:left;margin-right:5px;  max-width:90%; height:20px;font-size:12px;line-height:18px;color:#006600;text-decoration:none;overflow: hidden; word-break: break-all; word-wrap: break-word; " target="_blank"><!--displayUrl--></a> <span style="display: inline-block; float:left; width:17px;overflow: hidden; word-break: break-all; word-wrap: break-word; "> <img src="<!--www-->images/cy_ico_01.png" width="16" height="16" style="float:left; margin-top:3px;"/></span> </div>'+NewLine;
							str+='</div>'+NewLine;
							$G.Each(function(i,k){
								str=$G.Config.wmReplace(str,'<!--'+k+'-->',this+'');
							},json);
							str=$G.Config.wmReplace(str,'<!--www-->',$G.Config.wwwStatic);
							each(replaceData(str));
					}
				,	mobile:function(type){
						this.long(true,type);
					}
				,	set:function(str){
						if(str){
							return {
								html:replaceData(str)
							,	show:function(html){
									return each(html||this.html);
								}
							};
						}
					}
				,	show:function(){
						var isLong=(json.cabin+'').substr(1,1)
						;
						//广告位标识
						if(isLong=='L'){
							this.long();
						}else{
							this.short();
						}
					}
				};
			}
		};
	}();
	window.wmConfig&&window.wmConfig();
})();

window.ywtConfig = {
	isNotInvitewindows:true
	//飘窗参数
	,	M_bayWindow				:	{			
			F_pictureBW		:	{//浮动图片参数设置
									enableBaywindow			:	0,//是否启用显示飘窗1：启用，0不启用
									enableBaywindowSecond	:	0,//启用显示飘窗加载完几秒显示飘窗
									autoCirculation			:	0,//是否启用循环显示飘窗1：启用，0不启用
									circulationBaywindow	:	30,//启用循环显示飘窗加载完几秒显示一次
									floatImageAddress		:	'您好，来自{0}的朋友，客服在线！',//客服在线提示
									offFloatImageAddress	:	'您好，来自{0}的朋友，客服不在线！',//客服离线提示
									'':''
								},
			F_pictureW		:	{//固定图片参数设置
									fixedImageAddress		:	'您好，来自{0}的朋友，客服在线！',//客服在线提示
									offFixedImageAddress	:	'您好，来自{0}的朋友，客服不在线！',//客服离线提示
									'':''
								},
			F_deptShow		:	{//部门列表
									autoFloatDept			:	0,//是否启用显示飘窗1：启用，0不启用
									FloatDept				:	0,//启用显示飘窗加载完几秒显示飘窗
									autoCirculationDept		:	0,//是否启用循环显示飘窗1：启用，0不启用
									circulationDept			:	30,//启用循环显示飘窗加载完几秒显示一次
									onlineFloatDept			:	'您好！来自{0}的朋友！客服在线！',//客服在线提示
									offFloatDept			:	'您好！来自{0}的朋友！客服不在线！',//客服离线提示
									'':''
								},					
			F_customerShow	:	{//客服列表
									autoFloatCust			:	0,//是否启用显示飘窗1：启用，0不启用
									FloatCust				:	0,//启用显示飘窗加载完几秒显示飘窗
									autoCirculationCust		:	0,//是否启用循环显示飘窗1：启用，0不启用
									circulationCust			:	30,//启用循环显示飘窗加载完几秒显示一次
									onlineFloatCust			:	'您好！来自{0}的朋友！客服在线！',//客服在线提示
									offFloatCust			:	'您好！来自{0}的朋友！客服不在线！',//客服离线提示
									'':''
								},
			'':''
	}
}
;

if(!window.isGlacierLoad&&1==2){
	window.isGlacierLoad=true;
	
	var statics=$G.statistics();
	var baiduId = "8125948";
	var url = "http://cm.pos.baidu.com/pixel?dspid=" + baiduId + "&ext_data=";
	var param = "refer=" + encodeURIComponent(statics.fromPage) + "&title=" + encodeURIComponent(window.document.title||'') + "&screen=" + statics.screensize + "&language=" + statics.language + "&timezone=" + statics.timeZone + "&purl=" + encodeURIComponent(window.location);
	var bodys = document.body || document.getElementsByTagName("body")[0] || document.documentElement;
	var img = document.createElement("img");
	img.src = url + encodeURIComponent(param);
	bodys.appendChild(img);
	img.style.top='-10000px';
	
	/*var onlineUrl='http://online2.15talk.haomeit.com';
	$G.getjs({url:onlineUrl+'/wm/template/getInfoes.action?companyNO=ZJQHKAVEHJOI'
	,	callback:function(){
			$G.getjs({url:onlineUrl+'/static/web/js/library/Glacier.js'});
		}
	});*/
}

/*
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
var sohuLoadTime=(new Date().getTime());
var sohuLastTime=null;
$G.getjs({url:'http://pv.sohu.com/cityjson?ie=utf-8'});
loadFn(function(){
	$G.log('sohu:'+returnCitySN['cname']);
},function(){
	if((typeof returnCitySN)=='object'){
		sohuLastTime=(new Date().getTime())-sohuLoadTime;
		$G.log(sohuLastTime);
		return true;
	}else
		return false;
});
var sinaLoadTime=(new Date().getTime());
var sinaLastTime=null;
$G.getjs({url:'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js'});
loadFn(function(){
	$G.log('sina:'+remote_ip_info['isp']);
},function(){
	if((typeof remote_ip_info)=='object'){
		sinaLastTime=(new Date().getTime())-sinaLoadTime;
		$G.log(sinaLastTime);
		return true;
	}else
		return false;
});
loadFn(function(){
	var p='sina='+sinaLastTime+'&sohu='+sohuLastTime;
	$G.getjs({url:'http://static.adx.haomeit.com/pixel.png?p='+p});
},function(){
	return sinaLastTime && sohuLastTime;
});*/