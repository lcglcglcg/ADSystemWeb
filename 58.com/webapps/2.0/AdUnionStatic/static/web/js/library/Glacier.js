/*
* Name		: Glacier 2.0
* Author	: wangzheng
* QQ		: 113666386
* Date		: 20150318
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
	var Glacier=(!window.$G || window.$G.Version<2.0)?function(selector,dom){
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
	Version 				=			2.0,
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
	Glacier.fn.checked=function(isChecked){
		if(Glacier.fn.isNaN(isChecked)){
			return this.val();
		}
		var v=new Array()
		;
		this.Each(function(){
			if(this.checked==isChecked)
				v.push(this.value);
		});
		return v;
	};
	Glacier.fn.setChecked=function(v){
		var setVal=v;
		if(Glacier.isString(v)){
			setVal=v.split(",");
		}
		if(Glacier.fn.isNaN(setVal))return this;
		this.Each(function(){
			var obj=this
			,	val=obj.value
			;
			Glacier.Each(function(){
				if(val==(this+'')){
					obj.checked=true;
				}
			},setVal);
		});
		return this;
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
	Glacier.fn.val=function(newVal){
		var values=new Array();
		this.Each(function(){
			if(Glacier.fn.isNaN(newVal) && newVal!=='')
				values.push(this.value ? this.value:'');
			else
				this.value=newVal;
		});
		return (Glacier.fn.isNaN(newVal))?values:this;
	};
	Glacier.fn.test=function(newTest){
		var tests=new Array();
		this.Each(function(){
			if(Glacier.fn.isNaN(newTest) && newTest!=='')
				tests.push(Glacier.isIE?(this.innerText ?this.innerText:''):(this.textContent ?this.textContent:(this.value?this.value:'')));
			else
				Glacier.isIE?(this.innerText=newTest):(this.textContent=newTest);
		});
		return (Glacier.fn.isNaN(newTest))?tests:this;
	};
	Glacier.fn.style=function(c,type){
		var tmpdomtpe={};
		this.Each(function(){
			var tmpcss={}
			,	tmphtml=this.style.cssText?this.style.cssText+';'+c.style:c.style
			;
			for (k in c){
				if(!c.hasOwnProperty(k))continue;
				var tpk=Glacier.dom.TYPENAME[k]||k;
				if(!Glacier.fn.isNaN(tmphtml) && tpk=='style' && type=='update'){
					Glacier.Each(
						function(){
							var stycss=this.split(":");
							if(!Glacier.fn.isNaN(stycss[0]))
								tmpcss[Glacier.Trim(stycss[0])]=stycss[1];
							
						}
						, tmphtml.split(";")
					);
					
				}
			}
			tmpdomtpe[tpk]=Glacier.arraytoString(tmpcss)||c[k];
			Glacier.copyobject(this,tmpdomtpe,'dom');
		});
	};
	/**
	* 获取SELECT被选种的值或文本
	o{obj,isTrue,isValueTrue,type}
	**/
	Glacier.fn.getValueOrText=function(o){
		var v=new Array()
			,type=o.type||',';
			var obj=o.obj||this;
			if(obj.multiple){
				for(var i=0,n=obj.options.length;i<n;i++){
					if(obj.options[i].selected || o.isValueTrue){
						var e=obj.options[i];
						var vl="";
						if(o.isTrue) vl=e.value;
						else vl=e.text;
						v.push(vl);
					}
				}
			}else{
				if(obj.selectedIndex<0){}
				else
					v.push(o.isTrue?obj.value:obj.options[obj.selectedIndex].text);
			}
			return v.join(type);
	};
	/**
	* 跟据传进来的值或内容，设置被选种的值
	o{obj,value,isTrue,type}
	**/
	Glacier.fn.setValueOrText=function(o){
		var type=o.type||','
			,v=o.value.toString().split(type);
			var map={};
			for(var iv=0,nv=v.length;iv<nv;iv++){
				map[v[iv]]="true";
			}
			if(Glacier.fn.isNaN(o.value))map='';
			var obj=o.obj||this;
			for(var i=0,n=obj.options.length;i<n;i++){
				var e=obj.options[i];
				if(o.isTrue){
					if(map[e.value] || map==e.value)
						e.selected=true;
					else
						e.selected=false;
				}else{
					if(map[e.text] || map==e.text)
						e.selected=true;
					else
						e.selected=false;
				}
			}
	};
	/**
	* 跟据传进来的值或内容，删除值
	o{obj,value,isTrue,type}
	**/
	Glacier.fn.delValueOrText=function(o){
		var type=o.type||','
		,	v=o.value.toString().split(type)
		,	map={}
		,	fn=o.fn||function(i){
				this.remove(i);
			}
		;
			for(var iv=0,nv=v.length;iv<nv;iv++){
				map[v[iv]]="true";
			}
			if(Glacier.fn.isNaN(o.value))map='';
			var delv=new Array();
			var obj=o.obj||this;
			for(var i=0;i<obj.options.length;i++){
				var e=obj.options[i];
				if(o.isTrue){
					if(map[e.value] || map==e.value){
						fn.call(obj,i);
						i=i-1;
					}
				}else{
					if(map[e.text] || map==e.text){
						fn.call(obj,i);
						i=i-1;
					}
				}
			}
	};
	/**
	* 跟据传进来的值或内容，修改值
	o{obj,value,isTrue,type}
	**/
	Glacier.fn.editValueOrText=function(o){
		var type=o.type||','
		,	v=o.value.toString().split(type)
		,	map={}
		,	fn=o.fn||function(i){
				
			}
		;
			for(var iv=0,nv=v.length;iv<nv;iv++){
				map[v[iv]]="true";
			}
			if(Glacier.fn.isNaN(o.value))map='';
			var delv=new Array();
			var obj=o.obj||this;
			for(var i=0,n=obj.options.length;i<n;i++){
				var e=obj.options[i];
				if(o.isTrue){
					if(map[e.value] || map==e.value){
						fn.call(obj,i);
					}
				}else{
					if(map[e.text] || map==e.text){
						fn.call(obj,i);
					}
				}
			}
	};
	/**
	* 获取SELECT被选种的值
	**/
	Glacier.fn.getselvalue=function(){
		var arr={};
		this.Each(function(i){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				var str=Glacier.getValueOrText({
								  obj:this,
								  isTrue:true
								 });
				var k=this.id||this.name||i;
				arr[k]=str;
			}
		});
		return arr;
	};
	/**
	* 获取SELECT被选种的文本
	**/
	Glacier.fn.getseltext=function(){
		var arr={};
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				var str=Glacier.getValueOrText({
								  obj:this,
								  isTrue:false
								 });
				var k=this.id||this.name||i;
				arr[k]=str;
			}
		});
		return arr;
	};
	/**
	* 获取SELECT所有值
	**/
	Glacier.fn.getallselvalue=function(){
		var arr={};
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				var str=Glacier.getValueOrText({
								  obj:this,
								  isTrue:true,
								  isValueTrue:true
								 });
				var k=this.id||this.name||i;
				arr[k]=str;
			}
		});
		return arr;
	};
	/**
	* 获取SELECT所有文本
	**/
	Glacier.fn.getallseltext=function(){
		var arr={};
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				var str=Glacier.getValueOrText({
								  obj:this,
								  isTrue:false,
								  isValueTrue:true
								 });
				var k=this.id||this.name||i;
				arr[k]=str;
			}
		});
		return arr;
	};
	/**
	* 跟据传入的VALUE设置相对应值的选种
	**/
	Glacier.fn.setselvalue=function(value){
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				Glacier.setValueOrText({
								  obj:this,
								  value:value,
								  isTrue:true
								 });
			}
		});
		return this;
	};
	/**
	* 跟据传入的Text设置相对应值的选种
	**/
	Glacier.fn.setseltext=function(value){
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				Glacier.setValueOrText({
								  obj:this,
								  value:value,
								  isTrue:false
								 });
			}
		});
		return this;
	};
	/**
	* 跟据传入的VALUE修改option
	**/
	Glacier.fn.editselbyvalue=function(value,fn){
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				Glacier.editValueOrText({
								  obj:this,
								  value:value,
								  isTrue:true,
								  fn:fn
								 });
			}
		});
		return this;
	};
	/**
	* 跟据传入的TEST修改option
	**/
	Glacier.fn.editselbytest=function(value,fn){
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				Glacier.editValueOrText({
								  obj:this,
								  value:value,
								  isTrue:false,
								  fn:fn
								 });
			}
		});
		return this;
	};
	/**
	* 跟据传入的VALUE删除相对应值
	**/
	Glacier.fn.delselvalue=function(value){
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				Glacier.delValueOrText({
								  obj:this,
								  value:value,
								  isTrue:true
								 });
			}
		});
		return this;
	};
	/**
	* 跟据传入的Text删除相对应值
	**/
	Glacier.fn.deldeltext=function(value){
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				Glacier.delValueOrText({
								  obj:this,
								  value:value,
								  isTrue:false
								 });
			}
		});
		return this;
	};
	/**
	* 删除所有值
	**/
	Glacier.fn.delallsel=function(){
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				this.length=0;
			}
		});
		return this;
	};
	/**
	* 跟据传入的Text,value增加options数据
	**/
	Glacier.fn.addsel=function(text,value){
		this.Each(function(){
			var type=this.type?this.type.toLowerCase():"";
			if(type.indexOf('select')>=0){
				this.options.add(new Option(text,value));
			}
		});
		return this;
	};
	Glacier.fn.windowSize=function(){
		var o = {x:0,y:0},windowobj=Glacier.compatMode?document.documentElement:document.body; 
		/*o.w=Glacier.mobile?Math.max(windowobj.scrollWidth,windowobj.clientWidth,screen.width):Math.max(windowobj.scrollWidth,windowobj.clientWidth);
		o.h=Glacier.mobile?Math.max(windowobj.scrollHeight,windowobj.clientHeight,screen.height):Math.max(windowobj.scrollHeight,windowobj.clientHeight);*/
		o.w=Glacier.mobile?Math.max(windowobj.scrollWidth,windowobj.clientWidth):Math.max(windowobj.scrollWidth,windowobj.clientWidth);
		o.h=Glacier.mobile?Math.max(windowobj.scrollHeight,windowobj.clientHeight):Math.max(windowobj.scrollHeight,windowobj.clientHeight);
		/*o.sw=Glacier.mobile?Math.max(windowobj.clientWidth,screen.width):windowobj.clientWidth;
		o.sh=Glacier.mobile?Math.max(windowobj.clientHeight,screen.height):windowobj.clientHeight;*/
		o.sw=Glacier.mobile?Math.max(windowobj.clientWidth):windowobj.clientWidth;
		o.sh=Glacier.mobile?Math.max(windowobj.clientHeight):windowobj.clientHeight;
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
	Glacier.fn.setStyle=function(){
		if(document.all){
			var sheet=document.createStyleSheet();
			Glacier.Each(function(i,key){
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
	};
	Glacier.fn._Zindex=999999;
	Glacier.fn.touch=function(fun){
		var hasTouch = 'ontouchstart' in window
		,	eventList=[]
		,	animation=function(obj,dirnTmp,dirn){
				if(!obj)return;
				var startY = 0 // 初始位置  
				,	lastY = 0 // 上一次位置
				/** 
				 * 用于缓动的变量 
				 */  
				,	lastMoveTime = 0  
				,	lastMoveStart = 0  
				,	stopInertiaMove = false
				,	fn={}
				;
				fn['touchstart']=function(e){
					if(!hasTouch){
						e=Glacier.getMouseCoords(e);
					}else{
						e.y=e.touches[0].pageY;
					}
					lastY = startY = e.y;
					/** 
					 * 缓动代码 
					 */  
					lastMoveStart = lastY;  
					lastMoveTime = e.timeStamp || Date.now();  
					stopInertiaMove = true;
					fun&&fun('start');
				};
				fn['touchmove']=function(e){
					//e.preventDefault();
					if(!hasTouch){
						e=Glacier.getMouseCoords(e);
					}else{
						e.y=e.touches[0].pageY;
					}
					var nowY=e.y
					;
					var moveY = nowY - lastY;
					fun&&fun('move',{
						y:nowY
					,	e:e
					,	moveY:moveY
					,	timeStamp:e.timeStamp||Date.now()
					});
					lastY = nowY;
					/** 
					 * 缓动代码 
					 */  
					var nowTime = e.timeStamp || Date.now();  
					stopInertiaMove = true;
					if(nowTime - lastMoveTime > 300) {  
						lastMoveTime = nowTime;  
						lastMoveStart = nowY;  
					}
				};
				fn['touchend']=function(e){
						if(!hasTouch){
							e=Glacier.getMouseCoords(e);
						}else{
							e.y=e.touches[0].pageY;
						}
						var nowY = e.y;  
						var moveY = nowY - lastY;
						fun&&fun('end',{
							y:nowY
						,	e:e
						,	moveY:moveY
						,	timeStamp:e.timeStamp||Date.now()
						});
						lastY = nowY;
						/** 
						* 缓动代码 
						*/  
						var nowTime = e.timeStamp || Date.now(); 
						//最后一段时间手指划动速度  
						var v = (nowY - lastMoveStart) / (nowTime - lastMoveTime);
						stopInertiaMove = false;
						(function(v, startTime) {  
							var dir = v > 0 ? -1 : 1; //加速度方向  
							var deceleration = dir*0.0006;  
							// 速度消减至0所需时间  
							var duration = v / deceleration;
							//最终移动多少
							var dist = v * duration / 2;  
							function inertiaMove() {  
								if(stopInertiaMove) return;  
								var nowTime = e.timeStamp || Date.now();  
								var t = nowTime-startTime;  
								var nowV = v + t*deceleration;  
								// 速度方向变化表示速度达到0了  
								if(dir*nowV < 0) {  
									return;  
								}  
								var moveY = (v + nowV)/2 * t;
								fun&&fun('endIng',{
									moveY:moveY
								});
								setTimeout(inertiaMove, 10);  
							}
							inertiaMove();  
						})(v, nowTime);
				};
				
				obj.addEventListener(eventList['touchstart'],fn['touchstart'],false);
				obj.addEventListener(eventList['touchmove'],fn['touchmove'],false);
				obj.addEventListener(eventList['touchend'],fn['touchend'],false);
		};
		
        eventList['touchstart'] = hasTouch ? 'touchstart' : 'mousedown';
        eventList['touchmove'] = hasTouch ? 'touchmove' : 'mousemove';
        eventList['touchend'] = hasTouch ? 'touchend' : 'mouseup';
        eventList['touchcancel'] = hasTouch ? 'touchcancel' : 'mouseup';
		
		this.Each(function(){
			animation(this);
		});
		return this;
	};
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
		//o.obj.style.top="-10000px";
		//o.obj.style.left="-10000px";
		var _obj_init=Glacier.Obj(o.obj),winsize=Glacier.windowSize(),ieDiv=o.obj.gobj||document.createElement('div'),ieDivCss="position:absolute;width:"+_obj_init.w+"px; height:"+_obj_init.h+"px;";//border:1px solid red;
		ieDiv.ieDivCss=ieDiv.ieDivcss_bak=ieDiv.style.cssText=ieDivCss;
		//$G.log(o.obj.id+'|'+_obj_init.w);
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
		if(!o.obj.gobj)
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
			if(o.obj.gobj){
				o.obj.gobj.style.visibility="";
				o.obj.gobj.style.display="";
			}
			Glacier.fn.Gdiv(o);
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
		var _fixedDom=o.fixedDom || false;					//弹出层定位到的DOM对象
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
		if(_fixedDom){
			var fDObj=Glacier.Obj(_fixedDom);
			var x=fDObj.x+fDObj.w;
			var y=fDObj.y+fDObj.h;
			if((x+w)>(wobj.sw+wobj.scrollLeft))x=wobj.sw+wobj.scrollLeft-w;
			if((y+h)>(wobj.sh+wobj.scrollTop))y=wobj.sh+wobj.scrollTop-h;
			L=x-_xLenPx;
			T=y-_yLenPx;
		}else if(_isCenter){
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
	/**
	* 去除全部script
	*/
	Glacier.fn.dellscript=function(str){
		str=str+'';
		var reg =/\<script[^>]*?>.*?\<\/script\>/ig;
		return str.replace(reg,"");
	};
	Glacier.fn.delHtml=function(str){
		return (str+'').replace(/<[^>]+>/ig,"");
	};
	Glacier.fn.isLogin=function(str){
		return ((/^[A-Za-z0-9_\u4e00-\u9fa5]+$/.test(str)));
	};
	Glacier.fn.isPass=function(str){
		return ((/^[A-Za-z0-9_\.]+$/.test(str)));
	};
	/**
	* 验证是否是URL
	*/
	Glacier.fn.isUrl=function(str)
	{
		return (new RegExp("^(http|https|ftp)\\:\\/\\/[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$")).test(str);
	};
	Glacier.fn.isHttpUrl=function(str)
	{
		return Glacier.isUrl('http://'+str);
	};
	/**
	* 验证是否是邮编
	*/
	Glacier.fn.isZipcode=function(str)
	{
		return /^[0-9][0-9]{5}$/.test(str);
	};
	/**
	* 验证普通电话、传真号码：可以“+”开头，除数字外，可含有“-” 
	*/
	Glacier.fn.isTel=function(str)
	{
		return (/^(([0\+]\d{2,4}-)?(0\d{2,3})-)(\d{7,8})(-(\d{1,}))?$/.test(str));
	};
	/**
	* 验证移动电话（手机）
	*/
	Glacier.fn.isMobile=function(str) { 
		return (/^0?1[0-9][0-9][0-9]{8}$/.test(str)); 
		//return (/^0?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/.test(str)); 
	};
	/*************
	请勿使用除中文、字母、数字、减号、#、英文句号、英文逗号、空格外的其他字符
	*************/
	Glacier.fn.isCompanyName=function(str)
	{
		return (/^[(\u4e00-\u9fa5_a-zA-Z0-9,.#)]+$/.test(str));
	};
	/*************
	通信地址只能由字母、数字、减号、#、中文组成。
	*************/
	Glacier.fn.isAddress=function(str)
	{
		return (/^[A-Za-z0-9\-#\u4e00-\u9fa5]+$/.test(str));
	};
	/**
	* 联系人不能为空、请勿使用除字母、中文外的其他字符
	*/
	Glacier.fn.isContact=function(str)
	{
		return (/^[\u4e00-\u9fa5a-zA-Z]+$/.test(str));
	};
	/**
	* 验证邮箱
	* 例：xxx@xxx.xxx
	*/
	Glacier.fn.isMail=function(str)
	{
		return (/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(str));
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
		format=format||'yyyy-mm-dd hh:ii:ss';
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
		var setCssText=function(el, strCss){
			function endsWith(str, suffix) {
				var l = str.length - suffix.length;
				return l >= 0 && str.indexOf(suffix, l) == l;
			}
			var sty = el.style,
				cssText = sty.cssText;
			if(!endsWith(cssText, ';')){
				cssText += ';';
			}
			sty.cssText = cssText + strCss;
		};
		for (property in source) {
		   if(!source.hasOwnProperty(property))continue;
		   if(type=='dom'){
			   if (property == "style") {
				   	try{
						//$G.log($G(destination).getAtt('name')+':'+source[property]);
						setCssText(destination,source[property]);
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
				obj&&obj.appendChild(this.dom);
				return this||'';
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
	Glacier.fn.Stringtojson=function(a){
		return Glacier.parseJSON(a);
	};
	Glacier.fn.closure=function(o){
		return function(event){
			if(Glacier.fn.isNaN(o)) return;
			var e=(event || window.event);
			var ev=(e  ||  arguments.callee.caller.arguments[ 0 ]);
		    var et=ev.srcElement || ev.target;//用于冒泡事件对像判断
			o.callBack.call(o.obj,o.arg,et,e);
		}
	};
	Glacier.fn.Browser=function(){
		var ua=navigator.userAgent.toLowerCase()
		,	check = function(reg){
				var str=ua.match(reg);
				if(str){
					Glacier.getBrowser=brow[reg];
					Glacier.getBrowserVersion=str[(str.length-1)];
				}
				return str;
			}
		,	brow={}
		;
		brow[/(msie\s|trident.*rv:)([\w.]+)/]='ie';
		brow[/firefox\/([\d.]+)/]='firefox';
		brow[/chrome\/([\d.]+)/]='chrome';
		brow[/opera.([\d.]+)/]='opera';
		brow[/version\/([\d.]+).*safari/]='safari';
		brow[/maxthon\/([\d.]+)/]='maxthon';
		brow[/mobile|android/]='mobile';
		Glacier.isIE=check(/(msie\s|trident.*rv:)([\w.]+)/) || false;
		if(!Glacier.fn.isNaN(Glacier.isIE) && Glacier.isIE.length>1){
			var tmIe=Glacier.isIE[(Glacier.isIE.length-1)];
			Glacier.isIE6=tmIe=="6.0"?tmIe:false;
			Glacier.isIE7=tmIe=="7.0"?tmIe:false;
			Glacier.isIE8=tmIe=="8.0"?tmIe:false;
			Glacier.isIE9=tmIe=="9.0"?tmIe:false;
			Glacier.isIE10=tmIe=="10.0"?tmIe:false;
			Glacier.isIE11=tmIe=="11.0"?tmIe:false;
			Glacier.isIE12=tmIe=="12.0"?tmIe:false;
		}else{
			Glacier.isIE6=false;
			Glacier.isIE7=false;
			Glacier.isIE8=false;
			Glacier.isIE9=false;
			Glacier.isIE10=false;
			Glacier.isIE11=false;
			Glacier.isIE12=false;
		}
		if(Glacier.getBrowser=='ie')Glacier.isIE=true;
		Glacier.firefox=check(/firefox\/([\d.]+)/) || false;
		Glacier.chrome=check(/chrome\/([\d.]+)/) || false;
		Glacier.opera=check(/opera.([\d.]+)/) || false;
		Glacier.safari=check(/version\/([\d.]+).*safari/) || false;
		Glacier.maxthon=check(/maxthon\/([\d.]+)/) || false;
		Glacier.compatMode=document.compatMode=="CSS1Compat"?true:false;
		Glacier.mobile=check(/mobile|android/) || false;
		Glacier.isUc=check(/ucbrowser/) || false;
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
	Glacier.fn.onWindowResize=function(){
		//事件队列   
		var queue = [],  
			indexOf = Array.prototype.indexOf || function(){  
				var i = 0, length = this.length;   
				for( ; i < length; i++ ){   
					if(this[i] === arguments[0]){  
						return i;  
					}  
				}  
				return -1;  
			};  
		var isResizing = {}, //标记可视区域尺寸状态， 用于消除 lte ie8 / chrome 中 window.onresize 事件多次执行的 bug   
		lazy = true, //懒执行标记   
		listener = function(e){ //事件监听器   
			var h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight,   
			w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;   
			if( h === isResizing.h && w === isResizing.w){   
				return;   
			}else{  
				e = e || window.event;   
				var i = 0, len = queue.length;   
				for( ; i < len; i++){   
					queue[i].call(this, e);   
				}   
				isResizing.h = h,   
				isResizing.w = w;   
			}   
		};   
		return {  
			init: function(){  
				if(lazy){ //懒执行   
					if(window.addEventListener){   
						window.addEventListener('resize', listener, false);   
					}else{   
						window.attachEvent('onresize', listener);   
					}   
					lazy = false;   
				}  
			},  

			add: function(fn){  
				if(typeof fn === 'function'){  
					this.init();  
					queue.push(fn);   
				}else{ }   
				return this;   
			},   
			remove: function(fn){  
				if(typeof fn === 'undefined'){   
					queue = [];   
				}else if(typeof fn === 'function'){   
					var i = indexOf.call(queue, fn);   
					if(i > -1){   
						queue.splice(i, 1);   
					}   
				}   
				return this;   
			},  
			insert: function(index,fn){  
				if(typeof fn === 'function'){  
					this.init();  
					var len=queue.length;  
					if(index>=len){  
						queue[index]=fn;  
					}else{  
						for(var i=len-1;i>=index;i--){  
							queue[i+1]=queue[i];  
						}  
						queue[index]=fn;  
					}  
				}else{ }   
				return this;   
			},  
			trigger: function(){  
				var len=queue.length;  
				for(var i=0;i<len;i++){  
					queue[i]();  
				}  
			}  
		};
	}.call(this); 
	Glacier.fn.Zindex=function(){
		return this.fn._Zindex++;
	};
	Glacier.fn.getStyle=function(o){
		o=o||{};
		if(!o.obj)
			o.obj=this[0];
		var obj = o.obj
		,	value=eval('obj.style.'+o.type+'||""')
		;
		try{
			if(!value&&!Glacier.fn.isNaN(Glacier(obj).getAtt('class')))
				value=obj.currentStyle?obj.currentStyle[o.type]:document.defaultView.getComputedStyle(obj,null)[o.type];
		} catch( e ) {}
		return {
			obj:obj
		,	type:o.type
		,	value:value
		};
	};
	Glacier.fn.findStyle=function(o){
		o=o||{};
		if(!o.obj)
			o.obj=this[0];
		var obj = o.obj
		,	btrue=false
		,	isGet=Glacier.fn.isNaN(o.value)
		; 
		if(Glacier.fn.isNaN(o.where))isGet=false;
		do
		{
		   try{
			   	if(obj.parentNode==document.body || !obj.parentNode){
			   		break;
				}else{
					if(isGet){
						btrue=Glacier(obj).getStyle({type:o.type});
						if(!btrue.value||btrue.value==o.where)btrue=false;
					}else
						btrue=Glacier(obj).getStyle({type:o.type}).value==o.value;
					if(btrue===false)
						obj=obj.parentNode;
					else break;
				}
		   } catch( e ) {}
		}
		while(obj);
		return {
			obj:obj
		,	isfind:btrue
		};
	};
	Glacier.fn.findParent=function(o){
		o=o||{};
		if(!o.obj)
			o.obj=this[0];
		var obj = o.obj; 
		do
		{
		   try{
				if(Glacier(obj).getAtt(o.key)==o.value)
			   		break;
				else obj=obj.parentNode;
		   } catch( e ) {}
		}
		while(obj);
		return obj;
	};
	Glacier.fn.findDoman=function(url,type){
		var urlExtension=[".com.cn",".edu.cn", ".net.cn", ".org.cn", ".co.jp", ".gov.cn", ".co.uk", ".ac.cn", ".edu", ".tv", ".info", ".com", ".ac", ".ag", ".am", ".at", ".be", ".biz", ".bz", ".cc", ".cn", ".com", ".de", ".es", ".eu", ".fm", ".gs", ".hk", ".in", ".info", ".io", ".it", ".jp", ".la", ".md", ".ms", ".name", ".net", ".nl", ".nu", ".org", ".pl", ".ru", ".sc", ".se", ".sg", ".sh", ".tc", ".tk", ".tv", ".tw", ".us", ".co", ".uk", ".vc", ".vg", ".ws", ".il", ".li", ".nz"]
		,	l=''
		,	type=(type||'').toLowerCase()
		,	Lurl=function(){
				if(!url)return '';
				url=(url||'').toLowerCase();
				if(url.indexOf("://")>-1){
					url=(url.split("://"))[1];
				}
				if(url.indexOf("/")>-1){
					url=(url.split("/"))[0];
				}
				return url;
			}()
		;
		if(type)l=Lurl.indexOf(type);
		else
			for(var i=0,n=urlExtension.length;i<n;i++){
				l=Lurl.lastIndexOf(urlExtension[i]);
				if(l>-1 && (Lurl.replace(urlExtension[i],'')).length==l){
					type=urlExtension[i];
					break;
				}
			}
		
		var u=Lurl.substr(0,l)
		,	jurl=url.replace(u+type,'')
		,	strJurl=function(){
				if(jurl){
					var tjurl=jurl.substr(0,1)
					;
					if(tjurl.replace(/#|\?|\//,''))
						return tjurl;
				}
				return '';
			}()
		,	ua=u.split(".")
		,	urldoman=ua[(ua.length-1)]+strJurl||url
		;
		return {
			url:urldoman
		,	type:type
		};
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
		if(!o.w && o.style.width){
			o.w=(o.style.width+'').replace(/px/,'');
		}
		if(!o.h && o.style.height){
			o.h=(o.style.height+'').replace(/px/,'');
		}
		return o;
	};
	Glacier.fn.getPrevioussibling=function(obj,o){
		o=o||{};
		var x=obj.previousSibling
		,	ck=function(x){
				var isTrue=(x.nodeType!=1);
				if(!isTrue) return false;
				if(o.name && !obj.getAttribute('name')!=o.name)
					return false;
				if(o.id && !obj.getAttribute('id')!=o.id)
					return false;
				return true;
			}
		;
		while (ck(x))
		{
			x=x.previousSibling;
		}
		return x;
	};
	Glacier.fn.getParent=function(obj,tagName){
		try{
			if(obj.tagName.toLowerCase()==tagName.toLowerCase()){
				return(obj);
			}else{
				return(Glacier.getParent(obj.parentNode,tagName));
			}
		} catch( e ) {return obj;}
	};
	Glacier.fn.ie6alt=function(){
		var o=this.o;
		if(o.obj.gobj.isMove) return;
		o.obj.gobj=this;
		Glacier.fn.WinAltObj(o);
	};
	/***********************************AJAX的实现开始**************************************************/
	Glacier.fn.ajaxErr=function(XMLHttpRequest, textStatus, errorThrown){
		
	};
	Glacier.fn.ajaxSettings={
		url: '',
		isLocal: '',
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		dataType: "text",
		async: true,
		cache : false,
		timeout: 0,
		scriptCharset : 'utf-8',
		username : '',
		password : '',
		headers: {"X-Requested-With": "XMLHttpRequest"},
		beforeSend : function(){},
		error : Glacier.fn.ajaxErr
	};
	Glacier.fn.createStandardXHR=function(){
		try {
			return new window.XMLHttpRequest();
		} catch( e ) {}
	};
	Glacier.fn.createActiveXHR=function() {
		try {
			return new window.ActiveXObject( "Microsoft.XMLHTTP" );
		} catch( e ) {}
	};
	Glacier.fn.globalEval=function(data){
			if ( data && /\S/.test( data ) ) {
				( window.execScript || function( data ) {
					window[ "eval" ].call( window, data );
				} )( data );
			}
	};
	Glacier.fn.stringToXml=function(xml){
		var obj = {};
		if (xml.nodeType == 1){
			if (xml.attributes.length > 0){
				for (var j = 0; j < xml.attributes.length; j++) {
					var attribute = xml.attributes.item(j);
					obj[attribute.nodeName] = attribute.nodeValue;
				}
			}
		} else if (xml.nodeType == 3) {
			obj = xml.nodeValue;
		}
		if (xml.hasChildNodes()) {
			for (var i = 0; i < xml.childNodes.length; i++) {
				var item = xml.childNodes.item(i);
				var nodeName = item.nodeName;
				if (typeof (obj[nodeName]) == "undefined") {
					obj[nodeName] = xmlToJson(item);
				} else {
					if (!$G.isArray(obj[nodeName])) {
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}
		return obj;
	};
	Glacier.fn.parseXML=function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) {
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else {
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		return xml;
	};
	Glacier.fn.parseHTML=function( data ) {
		return data;
	};
	Glacier.fn.parseJSON=function( data ) {
		try{
			if ( typeof data !== "string" || !data ) {
				return null;
			}
			data = Glacier.TrimTest( data );
			if ( window.JSON && window.JSON.parse ) {
				return window.JSON.parse( data );
			}
			if ( /^[\],:{}\s]*$/.test( data.replace( /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@" )
				.replace( /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]" )
				.replace( /(?:^|:|,)(?:\s*\[)+/g, "")) ) {
				return (new Function( "return " + data ))();
			}
		}catch(e){
		}
	};
	Glacier.fn.parseSCRIPT=function( data ) {
		Glacier.globalEval(data);
		return '';
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
					//Glacier.fn.log('send:'+s.url);
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
	Glacier.fn.readyState = function(o) {
		var readystate=o.xhr.readyState;
		if (readystate == 4) {	
			var status=o.xhr.status;
			if ( o.xhr.status === 1223 ) status = 204;
			if (status >= 200 && status < 300 || status == 304) {
				dataTypeFn={
					"XML"		:	Glacier.parseXML,
					"JSON"		:	Glacier.parseJSON,
					"TEXT"		:	window.String,
					"HTML"		:	Glacier.parseHTML,
					"SCRIPT"	:	Glacier.parseSCRIPT
				};
				//Glacier.fn.log('server:'+o.xhr.responseText);
				o.success.call(o.xhr, dataTypeFn[o.dataType.toUpperCase()](o.xhr.responseText));
			} else {
				o.error.call(o.xhr);
			}
		} else if(readystate == 1){
			o.beforeSend && o.beforeSend.call(o.xhr);
		}
	};
	Glacier.fn.ajax=function(url,o){
		if ( typeof url === "object" ) {
			o = url;
			url=o.url;
		}
		o = o || {};
		if(Glacier.fn.isNaN(o.success)) return;
				
		o.xhr=window.ActiveXObject ?function(){
			return !Glacier.fn.ajaxSettings.isLocal && Glacier.createStandardXHR() || Glacier.createActiveXHR();
		}():Glacier.createStandardXHR();

		o.type = o.type || this.fn.ajaxSettings.type;
		o.timeout = o.timeout || this.fn.ajaxSettings.timeout;
		o.dataType = o.dataType || this.fn.ajaxSettings.dataType;
		o.beforeSend = o.beforeSend || this.fn.ajaxSettings.beforeSend;
		o.error = o.error || this.fn.ajaxSettings.error;
		o.async = o.async || this.fn.ajaxSettings.async;
		o.cache = o.cache || this.fn.ajaxSettings.cache;
		o.headers = o.headers || this.fn.ajaxSettings.headers;
		
		o.url=Glacier.filterUrl(url);
		if(o.async && (o.async==true || o.async=='true')) o.async=true;
		else o.async=false;
		o.data=(typeof o.data !== "string"?Glacier.param(o.data,o.traditional):o.data);
		if ( o.data && o.type.toUpperCase()==="GET")
			o.url += ( /\?/.test( o.url ) ? "&" : "?" ) + o.data;
		
		try {
			if(o.async){
				o.xhr.onreadystatechange = function() {
					Glacier.readyState(o);
				};
			}
			if(o.timeout>0){
				o.timeoutTimer = setTimeout( function(){
						o.xhr.abort();
						clearTimeout( o.timeoutTimer );
					}, o.timeout );
			}
			if (!o.cache) {
				var ntcvl=Glacier.getQuery.call(o.url,'notcache');
				if(Glacier.fn.isNaN(ntcvl))
					o.url += ( /\?/.test( o.url ) ? "&" : "?" ) + "notcache=" + new Date().getTime();
				else{
					o.url=o.url.replace(ntcvl,(new Date().getTime()))
				}
			}
			o.xhr.open(o.type, o.url, o.async, o.username, o.password);
			if (o.type.toUpperCase() == "POST") {



				o.xhr.setRequestHeader("Content-Type",
					(o.headers["Content-Type"] || this.fn.ajaxSettings.contentType));
			}
			for (i in o.headers) {
				if(!o.headers.hasOwnProperty(i))continue;
				if (o.headers.hasOwnProperty(i)) {
					o.xhr.setRequestHeader(i, o.headers[i]);
				}
			}
			//Glacier.fn.log('send:'+o.data);
			o.xhr.send(o.data);
			//if(!o.async)o.success(Glacier.ajax.contents(o),o);
		} catch (e) {}
		return o.xhr;
	};
	Glacier.fn.gethtml=function(url,success){
		if(Glacier.length<1)return;
		var obj=this;
		Glacier.ajax(url,{success:function(html){
			var gethtml=success?success(html):html;
			try{
				obj.html(gethtml);
				obj.val(gethtml);
			} catch (e) {}
		}});
		return this;
	};
	Glacier.fn.postdata=function(url,success){
		if(Glacier.length<1)return;
		var obj=this
		,	data={}
		;
		this.Each(function(){
			var n=this.getAttribute('name')
			,	v=this.value||this.innerHTML
			;
			if(!Glacier.fn.isNaN(n)){
				data[n]=v;
			}
		});
		Glacier.post(url,data,function(html){
			var gethtml=success?success(html):html;
			try{
				obj.html(gethtml);
				obj.val(gethtml);
			} catch (e) {}
		});
		return this;
	};
	Glacier.fn.get=function(url,success){
		return Glacier.ajax(url,{success:success});
	};
	Glacier.fn.post=function(url,data,success){
		return Glacier.ajax(url,{type:"POST",data:data,success:success});
	};
	/*
	*	用于G查找或G()查找DOM范围
	*
	*
	*
	*/
	Glacier.fn.findDom=function(o){
		o = o || {};
		o.gname=o.gname||'';
		var	subObj=new Array()
		,	addSubObj=function(obj){
				for(var k=0,n=obj.length;k<n;k++){
					subObj.push(obj[k]);
				}
			}
		,	findDom=new Array()
		;
		if(Glacier.fn.isNaN(o.gname) && Glacier.fn.isNaN(this.selector)){
			addSubObj(Glacier(o.selector));
		}else{
			Glacier(o.gname+' '+this.selector).Each(function(){
				findDom.push(this);
				addSubObj(Glacier(o.selector,this));				
			});
		}
		return {
			subObj:subObj
		,	findDom:findDom	
			};
	};
	/**
	*	数据提交模拟HTML5 验证
	*	gname		:要提交数据范围
	*	sub			:提交事件绑定
	*	url			:AJAX URL
	*	traditional	:AJAX 是否阻止参数序列化
	*	data		:提交手动追加参数
	*	callback	:提交成功后的回调方法
	*	err			:参数验证不通过回调用方法
	*
		$G('#div_2_2').cksub({
			gname:' #div_2_1 #div_2_3'
		,	sub:'#submitajax2'
		,	url:'/'
		,	traditional: true
		,	data:'box=false'
		,	callback:function(o){
				alert($G.param(this.postdata));
			}
		});
	*/
	Glacier.fn.cksub=function(o){
		o = o || {};
		o.selector=o.selector||'input textarea select';
		var findG=Glacier.findDom.call(this,o)
		,	findDom=findG.findDom
		,	subObj=findG.subObj
		,	altMsg=function(msg){
				var obj=this
				,	m=Glacier.tip()
				,	i=0
				,	click=function(){
						m.close.call(obj);
						Glacier.RemoveAttachEvent(document, "click",click);
					}
				;
				m.msg({
					obj:obj
				,	title:'错误提示'
				,	count:msg
				});
				
				setTimeout(function(){
					click();
				},3*1000);
				$G.AttachEvent(document,"click",function(){
					if(i>0)
						click();
					i++;
				});
			}
		;
		if(Glacier.fn.isNaN(subObj))return;
		Glacier.Each(function(){
			var autofocus=Glacier.hasProp(this,'autofocus')//是否默认获取焦点
			,	msgDefault=this.getAttribute('gmsgfordefault')//默认显示提示信息
			,	msgforTrue=this.getAttribute('gmsgfortrue')
			,	msgforFalse=this.getAttribute('gmsgforfalse')
			,	gmsgfornull=this.getAttribute('gmsgfornull')//数据为空时的提示
			,	gmsgforlength=this.getAttribute('gmsgforlength')//数据长度不正确提示信息
			,	msgforunit=this.getAttribute('gmsgforunit')//与关联数据不一致
			;
			var selectorMsg='';
			if(!Glacier.fn.isNaN(msgforTrue)){
				selectorMsg+=' '+msgforTrue;
			}
			if(!Glacier.fn.isNaN(msgforFalse)){
				selectorMsg+=' '+msgforFalse;
			}
			if(!Glacier.fn.isNaN(gmsgfornull)){
				selectorMsg+=' '+gmsgfornull;
			}
			if(!Glacier.fn.isNaN(gmsgforlength)){
				selectorMsg+=' '+gmsgforlength;
			}
			if(!Glacier.fn.isNaN(msgforunit)){
				selectorMsg+=' '+msgforunit;
			}
			var msgList=Glacier(selectorMsg)
			;
			if(!Glacier.fn.isNaN(msgDefault)){
				var gmsgDefault=Glacier(msgDefault)
				;
				Glacier(this).change(function(){
					gmsgDefault.Each(function(){
						this.style.display='none';
					});
				}).click(function(){
					var objTrue=Glacier(msgforTrue)
					;
					if(objTrue.length>0 && objTrue[0].style.display!=''){
						gmsgDefault.Each(function(){
							this.style.display='';
						});
						msgList.Each(function(){
							this.style.display='none';
						});
					}
				});
				
			}
			if(autofocus){
				this.focus();
			}
		},subObj);
		/*****************************分析提交数据**************************************/
		if(!o.ck) o.ck={};
		var subData={}
		,	postLen=0
		,	regExps=function(){
				var expList={
							"TEXT"			:	function(str){return Glacier.fn.isNaN(str)?false:true;}
						,	"PASSWORD"		:	Glacier.fn.isPass
						,	"LOGIN"			:	Glacier.fn.isLogin
						,	"EMAIL"			:	Glacier.fn.isMail
						,	"NUMBER"		:	Glacier.fn.isNumber
						,	"TEL"			:	Glacier.fn.isTel
						,	"MOBILE"		:	Glacier.fn.isMobile
						,	"URL"			:	Glacier.fn.isUrl
						,	"HTTPURL"		:	Glacier.fn.isHttpUrl
						,	"ZIPCODE"		:	Glacier.fn.isZipcode
						,	"COMPANYNAME"	:	Glacier.fn.isCompanyName
						,	"CONTACT"		:	Glacier.fn.isContact
						,	"ADDRESS"		:	Glacier.fn.isAddress
					}
				;
				Glacier.Each(function(i,f){
					expList[(f+'').toUpperCase()]=o.ck[f];
				},o.ck);
				return expList;
			}()
		,	inputBox=function(){
				var cssI=0
				,	obj=this
				,	type=this.type?this.type.toLowerCase():""
				,	red=function(){
						//obj.style.background='transparent';
						obj.style.border='1px solid red';
					}
				,	yellow=function(){
						//obj.style.background='transparent';
						obj.style.border='1px solid yellow';
					}
				,	fn=function(){
						if(cssI%2==0){
							yellow();
						}else{
							red();
						}
						cssI++;
						if(cssI<=6)
							setTimeout(fn,200);
						else{
							red();
						}
					}
				,	clear=function(){
						if(type.indexOf('select')>=0)return;
						obj.style.cssText=obj.getAttribute('cssBakText');
					}
				;
				if(type.indexOf('select')<0 && obj.style.cssText && !Glacier.hasProp(obj,'cssBakText')){
					obj.setAttribute('cssBakText',obj.style.cssText);
				}
				if(!Glacier.hasProp(obj,'cssBakText'))obj.setAttribute('cssBakText','null');
				return {
					start:function(){fn();return true;}
				,	clear:clear
				}
			}
		,	msg=function(obj,code){
				var ret=inputBox.call(obj)
				,	type=(obj.getAttribute('type')||'TEXT').toUpperCase()
				,	placeholder=obj.getAttribute('gplaceholder')
				,	msgfor=obj.getAttribute('gmsgfor')
				,	msgforunit=obj.getAttribute('gmsgforunit')//与关联数据不一致
				,	msgfun=Glacier.hasProp(obj,'gmsgfun')	//自定义错误提示
				,	msgDefault=obj.getAttribute('gmsgfordefault')//默认显示提示信息
				,	msgforTrue=obj.getAttribute('gmsgfortrue')
				,	msgforFalse=obj.getAttribute('gmsgforfalse')
				,	msgfornull=obj.getAttribute('gmsgfornull')//数据为空时的提示
				,	msgforlength=obj.getAttribute('gmsgforlength')//数据长度不正确提示信息
				,	title=obj.title
				;
				if(msgfun){
					o.msgFun&&o.msgFun.call(obj,type,code);
					return {
						start:function(){return true;}
					,	clear:function(){}
					};
				}else if(!Glacier.fn.isNaN(msgfor)){
					ret.start=function(){
						Glacier(msgfor).Each(function(){
							this.style.display='';
						});
						return true;
					};
					ret.clear=function(){
						Glacier(msgfor).Each(function(){
							this.style.display='none';
						});
					};
				}else if(!Glacier.fn.isNaN(placeholder) || !Glacier.fn.isNaN(title)){
					ret.start=function(){
						altMsg.call(obj,placeholder||title);
						return true;
					};
				}else if(Glacier.fn.isNaN(regExps[type])){
					ret.start=function(){
						altMsg.call(obj,obj.name+'未设置');
						return true;
					};
				}
				
				var selectorMsg='';
				
				if(!Glacier.fn.isNaN(msgDefault)){
					selectorMsg+=' '+msgDefault;
				}
				if(!Glacier.fn.isNaN(msgforTrue)){
					selectorMsg+=' '+msgforTrue;
				}
				if(!Glacier.fn.isNaN(msgforFalse)){
					selectorMsg+=' '+msgforFalse;
				}
				if(!Glacier.fn.isNaN(msgfornull)){
					selectorMsg+=' '+msgfornull;
				}
				if(!Glacier.fn.isNaN(msgforlength)){
					selectorMsg+=' '+msgforlength;
				}
				if(!Glacier.fn.isNaN(msgforunit)){
					selectorMsg+=' '+msgforunit;
				}
				var msgList=Glacier(selectorMsg)
				;
				msgList.Each(function(){
					this.style.display='none';
				});
				
				if(code==1 && !Glacier.fn.isNaN(msgforTrue)){
					ret.clear=function(){
						Glacier(msgforTrue).Each(function(){
							this.style.display='';
						});
					};
				}else if(code==2 && !Glacier.fn.isNaN(msgfornull)){
					ret.start=function(){
						Glacier(msgfornull).Each(function(){
							this.style.display='';
						});
						Glacier(msgforTrue).Each(function(){
							this.style.display='none';
						});
						return true;
					};
					ret.clear=function(){
						Glacier(msgfornull).Each(function(){
							this.style.display='none';
						});
						Glacier(msgforTrue).Each(function(){
							this.style.display='';
						});
					};
				}else if((code==3 || code==4) && !Glacier.fn.isNaN(msgforlength)){
					ret.start=function(){
						Glacier(msgforlength).Each(function(){
							this.style.display='';
						});
						Glacier(msgforTrue).Each(function(){
							this.style.display='none';
						});
						return true;
					};
					ret.clear=function(){
						Glacier(msgforlength).Each(function(){
							this.style.display='none';
						});
						Glacier(msgforTrue).Each(function(){
							this.style.display='';
						});
					};
				}else if(code==5 && (!Glacier.fn.isNaN(msgforTrue) || !Glacier.fn.isNaN(msgforFalse))){
					ret.start=function(){
						Glacier(msgforFalse).Each(function(){
							this.style.display='';
						});
						Glacier(msgforTrue).Each(function(){
							this.style.display='none';
						});
						return true;
					};
					ret.clear=function(){
						Glacier(msgforFalse).Each(function(){
							this.style.display='none';
						});
						Glacier(msgforTrue).Each(function(){
							this.style.display='';
						});
					};
				}else if(code==6  && !Glacier.fn.isNaN(msgforunit)){
					ret.start=function(){
						Glacier(msgforunit).Each(function(){
							this.style.display='';
						});
						Glacier(msgforTrue).Each(function(){
							this.style.display='none';
						});
						return true;
					};
					ret.clear=function(){
						Glacier(msgforunit).Each(function(){
							this.style.display='none';
						});
						Glacier(msgforTrue).Each(function(){
							this.style.display='';
						});
					};
				}
				return ret;
			}
		/*
		*	数据验证公用方法
		*	return
			0:不需要提交
			1:验证通过
			2:内容为空
			3:数据长度过短
			4:数据长度过长
			5:数据格式不正确
			6:数据不一致		
		*
		*/
		,	ckReturn={
				giveup:0
			,	pass:1
			,	notVal:2
			,	minLen:3
			,	maxLen:4
			,	regErr:5
			,	unitErr:6
			}
		,	ckfn=function(){
				var required=Glacier.hasProp(this,'grequired')//是否开启VALUE验证
				,	type=(this.getAttribute('type')||'TEXT').toUpperCase()
				,	name=this.getAttribute('name')
				,	value=Glacier.TrimTest(this.value)//去除前后二端空格
				,	pattern=this.getAttribute('gpattern')//自定义正则
				,	unitval=this.getAttribute('unitval')//关系数据验证一致性
				,	giveup=Glacier.hasProp(this,'giveup')//放弃提交
				,	maxlength=this.getAttribute('maxlength')//数据约数最大长度
				,	minlength=this.getAttribute('minlength')//数据约数最小长度
				,	objDom=this
				;
				this.value=value||'';
				/****************不需要验证的TYPE************************/
				if (giveup || type == 'SUBMIT' || type == 'RESET' || type == 'FILE' || type == 'IMAGE'){
					return ckReturn.giveup;
				}
				/****************验证是否有提交NAME**********************/
				if(Glacier.fn.isNaN(name))return ckReturn.giveup;
				/****************是否需要验证**********************/
				if(type=='CHECKBOX' || type=='RADIO'){
					if(!Glacier.isArray(subData[name])){
						var checkboxValue=new Array()
						;


						if(!Glacier.fn.isNaN(findDom)){
							Glacier.Each(function(){
								var obj=Glacier('.'+name,this)
								,	obj_v=obj.checked(true)
								;
								if(obj_v.length>0){
									if(type=='CHECKBOX')
										checkboxValue=ArrayConcat(checkboxValue,obj_v);
									else
										checkboxValue=obj_v;
								}
							},findDom);
						}
						if(checkboxValue.length<1 && !Glacier.fn.isNaN(required))
							return ckReturn.notVal;
						subData[name]=checkboxValue;
					}
					return ckReturn.pass;
				}else if(value){
					var l=$G.len(value)
					,	isNumber=(('|'+type+'|').indexOf('NUMBER')>=0)
					;
					if(!isNumber && !Glacier.fn.isNaN(minlength) && l<Number(minlength)){
						return ckReturn.minLen;
					}else if(!isNumber && !Glacier.fn.isNaN(maxlength) && l>Number(maxlength)){
						return ckReturn.maxLen;
					}else if(!Glacier.fn.isNaN(pattern)){
						var rexp=new RegExp('^'+pattern+'$',"i");
						var isT = rexp.test(value);
						if(!isT) return ckReturn.regErr;
					}else{
						type=type.split("|");
						var isreturn=true
						,	ckType=function(ty){
								for(var ti=0,tn=ty.length;ti<tn;ti++){
									var regFn=regExps[ty[ti]]
									;
									if(Glacier.isFun(regFn)){
										if(!regFn.call(objDom,value)){
											isreturn=false;
											break;
										}
									}else{
										if(!regExps['TEXT'].call(objDom,value)){
											isreturn=false;
											break;
										}
									}
								}
							}(type)
						;
						if(!isreturn)return ckReturn.regErr;
						if(isNumber){
							if(!Glacier.fn.isNaN(minlength) && parseFloat(value)<parseFloat(minlength)){
								return ckReturn.minLen;
							}else if(!Glacier.fn.isNaN(maxlength) && parseFloat(value)>parseFloat(maxlength)){
								return ckReturn.maxLen;
							}
						}
					}
				}else if(required){
					return ckReturn.notVal;
				}
				if(!Glacier.fn.isNaN(unitval)){
					var unitlist=Glacier(unitval)
					,	isFalse=false
					;
					unitlist.Each(function(){
						if(this.value==value)isFalse=true;
					});
					if(!isFalse)
						return ckReturn.unitErr;
				}
				subData[name]=value;
				return ckReturn.pass;	
			}
		,	changefn=function(){
				Glacier.Each(function(i){
					var type=(this.getAttribute('type')||'TEXT').toUpperCase();
					type=type.split("|");
					var isreturn=false
					,	ckType=function(ty){
							for(var ti=0,tn=ty.length;ti<tn;ti++){
								if(!Glacier.fn.isNaN(regExps[ty[ti]])){
									isreturn=true;
									break;
								}
							}
							
						}(type)
					;
					if(!isreturn)return;
					
					var change=function(){
						var required=Glacier.hasProp(this,'grequired')//是否开启VALUE验证
						;
						if(!required && !this.value)return;
						var ckRetType=ckfn.call(this);
						Glacier.isFun(o.msg)?o.msg.call(this,ckRetType):function(obj){
							var msgAlt=msg(obj,ckRetType);
							if(ckRetType>1){
								msgAlt.start();
							}else{
								msgAlt.clear();
							}
						}(this);
					};
					var oblListBd=Glacier(this);
					oblListBd.bd({on:"blur",callback:change}).bd({on:"change",callback:change});
					
				},subObj);
			}()
		,	subfn=function(subCallBack){
				postLen=0;
				var callBackSubObj=this;
				subData={};
				for(var k in subObj){
					if(!subObj.hasOwnProperty(k))continue;
					var dom=subObj[k]
					,	ckRetType=ckfn.call(dom)
					;
					if(Glacier.isFun(o.msg)){
						o.msg.call(dom,ckRetType)
					}else{
						var msgAlt=msg(dom,ckRetType);
						if(ckRetType>1){
							var gonomsg=msgAlt.start();
							dom.focus();
							if(gonomsg){
								break;
							}
						}else{
							msgAlt.clear();
						}
						postLen++;
					}
				}
		
				if(postLen==subObj.length){
					var subFrom=function(pD){
						var datatmp=Glacier.param(pD,o.traditional);
						var adddata=function(setPD,data){
							var param='';
							if(setPD) param='&';
							if(data)
								return setPD+param+(typeof data !== "string"?Glacier.param(data,o.traditional):data);
							else return '';
						};
						if(Glacier.isFun(o.urlfn))o.url=o.urlfn();
						o.data=adddata(datatmp,o.adddata) || datatmp;
						o.type=o.type||'post';
						o.success=function(getG){
							this.postdata=pD;
							this.subObj=callBackSubObj;
							if(Glacier.isFun(subCallBack))
								subCallBack.call(this,getG);
							else
								o.callback.call(this,getG);
						};
						Glacier.ajax(o);
					};
					if(o.ckdata){
						subData=o.ckdata.call(this,subData,subFrom);
					}
					if(!subData){
						subData={};
						return subObj;
					}
					subFrom(subData);
					return subObj;
				}else{
					o.err&&o.err(subObj);
				}
			}
		;
		if(!Glacier.fn.isNaN(o.sub)){
			if(Glacier.fn.isNaN(o.findDom))
				Glacier(o.sub).click(subfn);
			else
				Glacier(o.sub,Glacier(o.findDom)[0]).click(subfn);
		}
		return {
			sub:subfn
		,	o:o
		}
	};
	/**
	* bdDom 					要绑定的对象
	* type 						选择的元素范围，默认为input textarea select
	* o.bdDom:window.document   表单内容取值范围
	* o.ischecked				当ischecked=true时，集合对象中的所有radio、checkbox、select将不会被赋值，而是设置 默认为false
	* o.bdtype				    表单内容绑定标准 默认NAME
	* o.json				    表单要附值的JSON数据
	* o.i						限定要提交表单元素索引
	* o.notname					限定不要提交表单元素name
	* o.notid					限定不要提交表单元素id
	* o.callbck					执行附值前回调的方法
	**/
	Glacier.fn.bdJsonByDom=function(o){
		o = o || {};
		o.type=o.type||'input textarea select';
		o.bdtype=o.bdtype||'name';
		if(Glacier.fn.isNaN(o.json)){
			alert('请提供要绑定的JSON数据');
			return false;
		}
		var bdDom = o.bdDom = o.bdDom || window.document
		,	index_i = o.i?((','+o.i).toString()+','):false
		,	index_name=o.notname?((','+o.notname).toString()+','):false
		,	index_id=o.notid?((','+o.notid).toString()+','):false
		,	bdDom_n=0
		,	domList=new Array()
		,	jsonList=new Array()
		;
		if(o.bdDom && (typeof o.bdDom!="object") && o.bdDom.nodeType==1){
			return;
		}else{
			bdDom=Glacier(o.bdDom);
			bdDom_n=bdDom.length;
		}
		
		for(var i=0;i<bdDom_n;i++){
			var tmp_domList=Glacier(o.type,bdDom[i]);
			for(var k=0,n=tmp_domList.length;k<n;k++){
				var obj=tmp_domList[k];
				if(o.bdtype=='id' && Glacier.fn.isNaN(obj.id)){
					continue;
				}else if(o.bdtype=='name' && Glacier.fn.isNaN(obj.name)){
					continue;
				}
				domList.push(obj);

			}
		}
		if(o.bdtype=='index'){
			for(var a in o.json){
				if(!o.json.hasOwnProperty(a))continue;
				jsonList.push(o.json[a]);
			}
		}
		for(var k=0,n=domList.length;k<n;k++){
			var obj=domList[k]
			,	g_obj=Glacier(obj)
			,	type=obj.type?obj.type.toLowerCase():""
			,	tagName=obj.tagName?obj.tagName.toLowerCase():""
			,	objname=(obj.name||'')
			,	objid=(obj.id||'')
			,	getName=function(){
					return objname;
				}
			,	getId=function(){
					return objid;
				}
			,	getI=function(){
					return k;
				}
			,	bdVal={
						"input"					:	function(){obj.value=this.val},
						"select"				:	function(){g_obj.addsel((this.text||this.val),this.val)},
						"textarea"				:	function(){g_obj.test(this.val)},
						""						:	""
					}




			,	checkedType={
						"radio"					:	function(){
														if(obj.value==this.val)
															obj.checked=true;
														else
															obj.checked=false;
													},
						"checkbox"				:	function(){
														if(((','+this.val).toString().split(',')+',').indexOf((','+obj.value).toString()+',')>=0)
															obj.checked=true;
														else
															obj.checked=false;
													},
						"select-one"			:	function(){
														g_obj.setselvalue(this.val);
													},
						"select-multiple"		:	function(){
														g_obj.setselvalue(this.val);
													},


						""						:	""
					}
			,	jsonVal={
						"name"			:	o.json[getName()],
						"id"			:	o.json[getId()],
						"index"			:	jsonList[getI()],
						""				:	""
					}
			,	json=jsonVal[o.bdtype]
			,	fn_cb_this={
						obj:obj,
						isNext:true,
						type:type,
						tagName:tagName,
						i:k,
						json:o.json,
						val:json
					}
			;
			if(index_i && index_i.indexOf((','+k).toString()+',')<0)continue;
			if(index_name && index_name.indexOf((','+objname).toString()+',')>=0)continue;
			if(index_id && index_id.indexOf((','+objid).toString()+',')>=0)continue;
			o.callbak && o.callbak.call(fn_cb_this,o.json);
			if(!fn_cb_this.isNext)continue;
			var tmp_fn=bdVal[tagName] || function(){g_obj.html(this.val)};
			if(o.ischecked) tmp_fn=checkedType[type]||tmp_fn;
			if(!Glacier.isNumber(fn_cb_this.val) && Glacier.fn.isNaN(fn_cb_this.val)) fn_cb_this.val='';
			tmp_fn.call(fn_cb_this);
		}
		
		return ;
	};
	/***********************************AJAX的实现结束**************************************************/
	/***********************************js cookie的开始**************************************************/
	Glacier.fn.jscookie=function(c){
		c = c || {};
		var cookieDomain  =  c.domain || window.document.domain,
			cookieDays    =  c.day || 30,//此 cookie 将被保存 30 天
			cookieDir	  =  c.path || "/";//Cookie路径
		return {
			type:'script',
			obj:this,
			set:function(cookieName,cookieValue){
				var expires = new Date(); //new Date("December 31, 9998");
				expires.setTime(expires.getTime() + cookieDays*24*60*60*1000);
				this.setCookie(cookieName,cookieValue,expires);
			},
			setCookie:function(cookieName,cookieValue,timeExpires){
				document.cookie = escape(cookieName||'')+"="+escape(cookieValue||'')+" ;domain="+cookieDomain+" ;path="+cookieDir+" ;expires=" + timeExpires.toGMTString();
			},
			get:function(cookieName){
				var cookieValue = document.cookie.match(new RegExp("(^| )"+escape(cookieName)+"=([^;]*)(;|$)"));
				if(cookieValue != null)
					return unescape(cookieValue[2]);
				return null;
			},
			del:function(cookieName){
				var cookieValue=this.get(cookieName);
				var expires = new Date();
				expires.setTime(expires.getTime() - 1);
				this.setCookie(cookieName,cookieValue,expires);
			},
			delAll:function(){
				var expires = new Date();
				expires.setTime(expires.getTime() - 1);
				var cookieString = document.cookie.split('; ');
				for(var i=0,n=cookieString.length;i<n;i++){
					var tmp=cookieString[i].split("=");
					this.setCookie(tmp[0].toString().replace(/\s/g,''),tmp[1].toString().replace(/\s/g,''),expires);
				}
			},
			iscookies:function(cookieName){
				return this.get(cookieName)?true:false;
			}
		}
	};
	/***********************************js cookie的结束**************************************************/
	/***********************************flash cookie的开始**************************************************/
	Glacier.fn.thisMovie=function(movieName){
		if(Glacier.isIE)
			return window[movieName];
		else
			return document[movieName];
	};
	Glacier.fn.flashcookie=function(o){
		o = o || {};
		var cookieObj	  =  ''
		,	span=Glacier.dom({type:'span'})
		//,	src			  =  o.src || "/cookie.swf"//flashCookie.swf路径
		,	name		  =  o.name || ""
		,	day			  =  o.day  || ""
		,	callback	  =  o.callback || function(){}
		,	flashID	      = 'flashcookie'+span.dom.id
		,	flashCo=''
		,	isCallback	  =  false
		;
			this.CookiesInit=function(fck){
				isCallback=true;
				Glacier.CookiesInit=function(){
					flashCo=Glacier.thisMovie(flashID);
					if(!Glacier.fn.isNaN(name))
						callback && callback.call(obj,'',2);
				};
				var obj={
							type		:	'flash',
							id			:	flashID,
							obj			:	function(){
												return flashCo;
											},
							set			:	function(cookieName,cookieValue){
								//Glacier.fn.log('setFlash:'+cookieName+'|'+cookieValue);
								this.obj().setCookies(escape(cookieName),escape(cookieValue));
							},
							get			:	function(cookieName){
								return unescape(this.obj().getCookies(escape(cookieName)))||'';
							},
							del			:	function(cookieName){
								this.obj().delCookies(escape(cookieName));
							},
							uuid		:	function(cookieName){
								return this.obj().getOnlyID(cookieName);
							},
							delAll		:	function(){
								this.obj().cls();
							},
							iscookies	:	function(cookieName){
								return this.obj().isCookies(escape(cookieName))||'';
							}
						}
				;
				if(Glacier.fn.isNaN(name)){
					callback && callback.call(obj,fck.fcookie,1);
				}
				
			};
			span.add();
			span.dom.innerHTML=Glacier.getFlash.cookies({
				id:flashID
			,	src:o.src
			,	data:{
					name:name
				,	key:'QQ113666386'
				}
			}).html;
			setTimeout(function(){
				if(!isCallback)callback && callback.call(this,'',2);
			},2000);
	};
	/***********************************flash cookie的结束**************************************************/
	/**************************************** cookie的开始**************************************************/
	Glacier.fn.cookiesetup={'isSetup':false,'js':'','flash':''};
	Glacier.fn.cookie=function(o){
		o = o || {};
		var jscookie=Glacier.jscookie(o)
		,ck_callbak=''
		,ck_cookieName=''
		,fn=function(s){
			try{
				if(!Glacier.fn.isNaN(o.name))
					s=Glacier.cookiesetup['flash'].get(ck_cookieName)||'';
				if(!Glacier.fn.isNaN(s))jscookie.set(ck_cookieName,s);
			}catch(e){}
			ck_callbak && ck_callbak.call(this,s);
		};
		
		return {
			ckget:function(cookieName,callbak){
				if(Glacier.fn.isNaN(callbak)) return;
				ck_callbak=callbak;
				ck_cookieName=cookieName;
				var jsgetvalue=jscookie.get(cookieName);
				//Glacier.fn.log('jsgetvalue:'+jsgetvalue);
				if(Glacier.fn.isNaN(jsgetvalue)){
					o.callbak=fn;
					Glacier.cookieinit(o,cookieName);
				}else fn(jsgetvalue);
			},
			set:function(cookieName,cookieValue){
				if(jscookie)
					jscookie.set(cookieName,cookieValue);
				//Glacier.fn.log('cookiesetup:'+Glacier.cookiesetup['flash']);
				if(Glacier.cookiesetup['flash'])
					Glacier.cookiesetup['flash'].set(cookieName,cookieValue);				
				return cookieValue;
			},
			get:function(cookieName){
				return jscookie.get(cookieName) || Glacier.cookiesetup['flash'].get(cookieName);
			},
			del:function(cookieName){
				if(jscookie)
					jscookie.del(cookieName);
				if(Glacier.cookiesetup['flash'])
					Glacier.cookiesetup['flash'].del(cookieName);
			},
			delAll:function(){
				if(jscookie)
					jscookie.delAll();







				if(Glacier.cookiesetup['flash'])
					Glacier.cookiesetup['flash'].delAll();
			},
			iscookies:function(cookieName){
				return jscookie.iscookies(cookieName) || Glacier.cookiesetup['flash'].iscookies(cookieName);
			}
		}
		
	};
	Glacier.fn.cookieinit=function(o){
		o = o || {};
		var fn=function(fCookieVal,k){
			if((k==1 && Glacier.fn.isNaN(fCookieVal)))
				return;
			if(Glacier.cookiesetup['isSetup']) return;
			if(!Glacier.fn.isNaN(this)) Glacier.cookiesetup['flash']=this;
			Glacier.cookiesetup['isSetup']=true;
			o.callbak && o.callbak(fCookieVal);
		};
		this.flashcookie({name:o.name,src:o.src,callback:fn});
	};
	
	/**************************************** cookie的结束**************************************************/
	/***********************************select 自定义样式    开始**************************************************/
	/**
	*	cssSelected	="color:#19555F;background:#DBE2F7;"
	*	cssDiv1		="display:inline;cursor:pointer;text-align:left;line-height: 18px;font-size:12px;color:#000;"
	*	cssDiv2		="background:#FFF;";
	*	cssDiv3		="background:url(/static/images/selectBg.gif) no-repeat scroll right top;border:1px solid #88ACCF;height: 18px;overflow: hidden;padding:0 20px 0 2%;width: 98%;"
	*	cssUl1		="background:#FFF; border: 1px solid #88ACCF;height: auto;list-style:none;margin: 0; padding:0 0 1px;"
	*	isalt		是否开启节点提示
	*	width		auto|list|parent|100  数据为统一宽度
	*	optwidth	auto|parent|100  数据为统一宽度
	*	write		true|false	false 是否开启可输入功能

	*	wchange		开启可输入功能后的回调方法
	*	gtext		默认显示内容
	*	openlist	当write:true 下拉列表框 类型:方法
	*	return{
			res   	参数dom对象 进行单个SELECT对象元素LI重置
			resall	无参数 res方法的复数形式
		}
	**/
	Glacier.fn.select=function(o){
		o = o || {};
		o.cssSelected=o.cssSelected||"color:#19555F;background:#DBE2F7;";
		o.cssDiv1=o.cssDiv1||"display:inline;cursor:pointer;text-align:left;line-height: 18px;font-size:12px;color:#000;";
		o.cssDiv2=o.cssDiv2||"background:#FFF;";
		o.cssDiv3=o.cssDiv3||"background:url(/static/web/images/selectBg.gif) no-repeat scroll right top;border:1px solid #88ACCF;height: 18px;overflow: hidden;padding:0 20px 0 5px;";
		o.cssUl1=o.cssUl1||"background:#FFF; border: 1px solid #88ACCF;list-style:none;height:auto;margin: 0; padding:0 0 1px;";
		o.cssSetLi=o.cssSetLi||'padding:0 0 0 5px;overflow: hidden;word-break: break-all;height:24px;line-height: 22px;';
		
		var	getWidth=function(findObj){
				return parseInt(Glacier.getStyle({
					obj:findObj
				,	type:'width'	
				}).value||0);
			}
		,	getParentWidth=function(findObj){
				var pw=Glacier.findStyle({
					obj:findObj
				,	type:'width'
				,	where:'0px'
				}).isfind;
				if(pw && pw.value)pw=pw.value;
				return parseInt(pw||0);
			}
		,	getListWidth=function(findObj){
				return mkLi.call(findObj,findObj,true)||0;
			}
		,	getWidthIni=function(){
				return 25;
			}
		;
		var subObj=new Array()
		,	selectOld={}
		,	addSubObj=function(obj){
				for(var k=0,n=obj.length;k<n;k++){
					subObj.push(obj[k]);
				}
			}
		,	subSelector='select'
		,	c=o.cssSelected
		,	tmpSelectLiDom={}
		,	fixedOptWidth=Glacier.isNumber(o.optwidth)
		,	fixedWidth=Glacier.isNumber(o.width)
		,	mkLi=function(l,isW,ck){
				if(Glacier.fn.isNaN(l.options)){
					return;
				}
				var m='<div title="" values="{VALUE}" style="{style};'+o.cssSetLi+'" selected="false">{TEXT}</div>'
				,	s=''
				,	selected=''
				,	optw=0
				;
				for(var i=0,n=l.options.length;i<n;i++){
					var opt=l.options[i]
					,	tm=m
					;
					if(isW || o.optwidth=='auto'){
						var txtLen=Glacier.len(opt.text)
						,	textLen=(txtLen*(Glacier.lenfont(this)/2))+(txtLen/2)
						;
						if(textLen>optw)optw=textLen;
						if(isW){
							continue;
						}
					}
					
					if(opt.selected){
						tm=tm.replace(/{style}/,c).replace(/selected="false"/,'selected="true"');
						selected=opt.text;
					}
					tm=tm.replace(/title=""/,o.isalt?'title="'+opt.text+'"':'');
					if(!ck||ck(opt))
						s+=tm.replace(/{VALUE}/,opt.value+'').replace(/{TEXT}/,opt.text).replace(/{style}/,'');
					
					
				}
				if(isW){
					return optw;
				}
				optw=optw+23;
				if(fixedOptWidth){
					this.style.width=o.optwidth+'px';
				}else if(o.optwidth=='auto'){
					this.style.width=optw+'px';
				}
				
				return {
					li:s
				,	selected:selected
				,	width:optw
					};
			}
		,	inpChange=function(){}
		,	change=function(div,gbj){
				Glacier('input',div[1])[0].value=gbj.getValueOrText({
					obj:gbj[0]
				,	isTrue:false
				});
				gbj[0].onchange && gbj[0].onchange();
			}
		;
		if(Glacier.fn.isNaN(o.gname) && Glacier.fn.isNaN(this.selector)){
			addSubObj(Glacier(subSelector));
		}else{
			Glacier(o.gname+' '+this.selector).Each(function(){
				var type=this.type?this.type.toLowerCase():"";
				if(type.indexOf('select')>=0){
					subObj.push(this);
				}else
					addSubObj(Glacier(subSelector,this));				
			});
		}
		
		var mkDiv=function(obj){
				var parentObj=obj.parentNode
				,	div=Glacier.dom({type:'div'})
				,	selectGObj=$G(obj)
				,	text=Glacier.hasProp(this,'gtext')?selectGObj.getAtt('gtext'):''
				,	wrt=' readonly="readonly" '
				,	width=fixedWidth?(o.width||0):getWidth(obj)
				;
				if(width>0){
					
				}else if(o.width=='parent'){
					var width=getParentWidth(parentObj);
				}else if(o.width=='list'){
					width=getListWidth(obj);
					width=width+25;
				}else{
					if(width<1){
						var autoWidthFnList=[
							[getParentWidth,parentObj]
						,	[getListWidth,obj]
						,	[getWidthIni,obj]
						];
						Glacier.Each(function(i,k){
							if(width<1){
								width=this[0](this[1]);
							}
						},autoWidthFnList);
					}
				}
				
				if(o.write||Glacier.hasProp(obj,'write'))wrt='';
				div.setstyle({style:o.cssDiv1});
				div.dom.innerHTML='\
					<div style="'+o.cssDiv2+'width:'+width+'px;">\
					<div style="'+o.cssDiv3+'">'+'<input type="text" '+wrt+' value="'+text+'" style="color:#000;padding-left:0px;padding-right:0px;margin:0px;left:0px;height:18px;border:none;width:'+(width-26)+'px;" /></div>\
					<div style="'+o.cssUl1+'display:none;position: absolute;z-index:'+Glacier.Zindex()+';width:'+(width-2)+'px;"></div></div>\
				';
				div.dom.title=obj.title;
				parentObj.insertBefore(div.dom,obj);
				return div.dom;
			}
		,	bodyDom=new Array()
		,	pushSelDom=function(obj,ck){
				if(Glacier.fn.isNaN(obj.type)||obj.type.indexOf('select')<0){
					return;
				}
				if(!Glacier.isObj(obj))return;
				var uuid=obj.getAttribute('guuid');
				if(Glacier.fn.isNaN(uuid))return;
				var marry=tmpSelectLiDom[uuid];
				if(Glacier.fn.isNaN(marry))return;
				var div=marry[0]
				,	gbj=marry[1]
				,	uiIframe='<iframe frameborder="0" style="position: absolute; z-index: -1; width: 100%; height: 100%; top: 0px; left: 0px; opacity: 0;" hspace="0" src="about:blank"></iframe>'
				;
				var getMkli=mkLi.call(div[2],obj,'',ck)
				,	inimkliselected=getMkli.selected||$G(obj).getAtt('gtext')
				;
				if(!ck)Glacier('input',div[1])[0].value=inimkliselected;
				//div[2].innerHTML='aaa';
				var objWidth=getWidth(div[0]);
				if(objWidth>getMkli.width)
					div[2].style.width=(objWidth-1)+'px';
				div[2].innerHTML=uiIframe+getMkli.li;
				var divLi=Glacier("div",div[2])
				;				
				divLi.Each(function(){
					this.onmouseover=function(){
						this.style.cssText=c+o.cssSetLi;
					};
					this.onmouseout=function(){
						if(this.getAttribute('selected')!='true')
							this.style.cssText=o.cssSetLi;
					};
					this.onclick=function(){
						gbj.setselvalue(this.getAttribute('values'));
						divLi.Each(function(){
							this.setAttribute('selected','false');
							this.style.cssText=o.cssSetLi;
						});
						this.style.cssText=c+o.cssSetLi;
						this.setAttribute('selected','true');
						change.call(obj,div,gbj);
						if(!Glacier.isIE)return;
						ulClick.call(div[0]);
						
					};
				});
			}
		,	selectClear=function(){
				Glacier.Each(function(){
					if(this.style.display!='none')
						this.style.display='none';
				},bodyDom);

			}

		,	resall=function(){
				Glacier.Each(function(){
					pushSelDom(this);
				}
				,subObj);
			}
		;
		if(subObj.length<1)return;
		var ulClick=function(e){
				if (!e) e = window.event;
				var divlist=Glacier("div",this)[1]
				;
				if(Glacier.fn.isNaN(divlist.style.display))
					divlist.style.display='none';
				else{
					selectClear();
					divlist.style.display='';
				}
				if (!e)return;
				if (window.event) {
					e.cancelBubble=true;
				} else {
					//e.preventDefault();
					e.stopPropagation();
				} 
				
			}
		;
		var selectDivList=new Array()
		,	addSelect=function(list){
				if(list.length<1)return;
				Glacier.Each(function(){
					if(this.type && this.type.toLowerCase()!='select-one')return;
					
					this.style.display='';
					this.style.visibility='';
					this.style.position='absolute';
					this.style.top='-10000px';
					this.style.left='-10000px';
					
					var obj=Glacier.Obj(this)
					,	objing=Glacier(this)
					,	selDom=mkDiv(this)
					,	GselDiv=Glacier("div",selDom)
					,	onchange=function(){
							change.call(objing[0],GselDiv,objing);
						}
					;
					if(Glacier.fn.isNaN(selDom)){
						return ;
					}
					selectDivList.push(selDom);
					bodyDom.push(GselDiv[2]);
					var uuid=Glacier.uuidFast().replace(/-/ig,'');
					this.setAttribute('guuid',uuid);
					selectOld[uuid]=true;
					var	wobj=Glacier.windowSize()
					,	selectMaxHeight=(wobj.sh/2)-20
					;
					GselDiv[2].style.maxHeight=selectMaxHeight+'px';
					GselDiv[2].style.overflowY='auto';
					tmpSelectLiDom[uuid]=[GselDiv,objing];
					var input=Glacier('input',GselDiv[0])
					,	gchange=objing.getAtt('gchange')
					,	gkeyup=objing.getAtt('gkeyup')
					,	gkeydown=objing.getAtt('gkeydown')
					,	findlist=Glacier.hasProp(this,'findlist')
					;
					
					if(!$G.isNaN(gchange)){
						input.change(function(){
							gchange&&eval(gchange);
						});

					}
					if(!$G.isNaN(gkeyup)){
						input.bd({on:'keyup',callback:function(){
							gkeyup&&eval(gkeyup);
						}});
					}
					if(!$G.isNaN(gkeydown)){
						input.bd({on:'keydown',callback:function(){
							gkeydown&&eval(gkeydown);
						}});
					}

					if(findlist){
						input.bd({on:'keyup',callback:function(){
							var inputValue=this.value||''
							,	oi=0
							;
							GselDiv[2].style.display='';
							pushSelDom(objing[0],function(opObj){
								if(!inputValue)return true;
								if(oi>10 || opObj.text.indexOf(inputValue)<0){
									return false;
								}
								oi++;
								return true;
							});
						}});
					}
					pushSelDom(this);
					GselDiv[0].onclick=ulClick;
					Glacier.AttachEvent(this,"change",onchange);
					
				},list);
			}
		;
		addSelect(subObj);
		Glacier.AttachEvent(document,"click",selectClear);
		
		return {
				res:pushSelDom
			,	resall:resall
			,	getObjs:subObj
			,	setObj:function(obj){
					var Gobj=Glacier(obj)
					,	guuid=Gobj.getAtt('guuid');
					if(selectOld[guuid]){
						resall();
						return;
					}
					subObj.push(obj[0]);
					addSelect(Gobj);
				}
			,	setObjs:function(listObj){
					var addObjList=new Array()
					,	setFn=function(){
							var guuid=Glacier(this).getAtt('guuid');
							if(!selectOld[guuid]){
								addObjList.push(this);
								subObj.push(this);
							}
						}
					;
					Glacier(listObj).Each(function(){
						var type=this.type?this.type.toLowerCase():"";
						if(type.indexOf('select')>=0){
							setFn.call(this);
						}else{
							Glacier(subSelector,this).Each(setFn);
						}
						
					});
					if(addObjList.length>0)
						addSelect(addObjList);
					resall();
				}
			,	readOnly:function(isShow){
					Glacier.Each(function(){
						if(isShow)
							Glacier('div',this)[0].onclick=function(){};
						else
							Glacier('div',this)[0].onclick=ulClick;
					}
					,selectDivList);
				}
			};
	};
	/***********************************select 自定义样式    结束**************************************************/
	/***********************************鼠标提示    开始**************************************************/
	/**
	*	css	弹出层边框样式
	*	maxlen	弹出层最长宽度
	*	minlen	弹出层最小宽度
	*	direction	弹出层方向首选方案
	*	notatl	元素对像属性，表示跳过不处理弹出效果
	*	tip.msg({
					obj:obj				要弹出提示层对像
				,	title:'错误提示'		弹出层TITLE值
				,	count:msg			弹出层内容（跟据css样式的字体大小算长度）
				});
	*
	*
	*/
	Glacier.fn.tip=function(o){
		o = o || {};
		var mkdiv=function(){
				var div = document.createElement("div")
				,	lr=['right','left']
				,	tb=['top','top','bottom','bottom']
				;
				div.style.cssText=o.css || "font-size:12px; line-height:22px; width:300px; border:1px solid #eee496;";
				div.style.position="absolute";
				div.style.zIndex=9999+Number(Glacier.Zindex());
				div.style.left="-1000px";
				div.style.top="-1000px";
	  			var strJ='';
	  			for(var i=1;i<5;i++){
					strJ+='<div msgXY="msg" style="display:none;position:absolute; '+lr[i%2]+':20px; '+tb[i-1]+':-'+(i<3?13:14)+'px;height:14px;width:13px;">';
					if(i<3)m=0;
					else m=12;
					for(var k=0;k<13;k++){
						strJ+='<div style=" width:'+(Math.abs(k-m))+'px; height:1px; border-left:1px solid #eee496;border-right:1px solid #eee496;background:#ffffe6; float:'+lr[i%2]+'; clear:both;"></div>';
					}
					strJ+='</div>';
				}
				div.innerHTML='<div style="background:#f9e875; padding-left:10px;overflow:hidden; height:22px; text-align:left;">提示信息</div>\
	  <div style="background:#ffffe6;padding:5px 5px 5px 10px;">&nbsp;</div>'+strJ;
				document.body.appendChild(div);
				return div;
			}()
		,	div=function(){
				var divArray=Glacier('div',mkdiv)
				;
				divArray[1].innerHTML=o.title||'';
				return {
					msg:mkdiv
				,	title:divArray[0]
				,	count:divArray[1]
				,	n:Glacier('div:msgXY:msg',mkdiv)
				};
			}()
		,	start=function(o,et,oEvent){
				var tip=et.title||et.alt
				;
				if(Glacier.hasProp(et,'notatl') || Glacier.fn.isNaN(tip)) return;
				et.setAttribute('tip',tip);
				msg.call(et,'',tip);


			}
		,	stop=function(o,et,oEvent){
				div.msg.style.display="none";
				div.msg.style.left="-1000px";
				div.msg.style.top="-1000px";
				try{
					et.title=et.alt=(et.getAttribute('tip'))||et.title||et.alt||'';
				}catch(e){}
			}
		,	msg=function(title,count){
				if(Glacier.fn.isNaN(count))return;
				div.title.innerHTML=title||this.getAttribute('msgtitle')||'提示信息';
				div.count.innerHTML=count;
				var lenWidth=(Glacier.len(count))*(parseInt(div.msg.style.fontSize)/2)+20;
				if(lenWidth>o.maxlen)lenWidth=o.maxlen;
				if(lenWidth<o.minlen)lenWidth=o.minlen;
				div.msg.style.width=lenWidth+'px';
				div.msg.style.display='';
				this.setAttribute('tip',(this.title||this.alt||''));
				this.title=this.alt="";
				var thisObj=this
				,	obj=Glacier.Obj(thisObj)
				,	type=Glacier(this).getAtt('type')
				;
				if(!type){
					obj=Glacier.Obj(thisObj.parentNode);
				}
				
				var findIni=function(){
						for(var mi=0;mi<div.n.length;mi++)
							div.n[mi].style.display='none';
						var tipobj=Glacier.Obj(div.msg)
						,	_x=obj.x
						,	_y=obj.y
						,	_k=0
						,	wsize=Glacier.windowSize()
						,	bw=wsize.scrollLeft
						,	bh=wsize.scrollTop
						,	ckL=bw+wsize.sw
						,	ckT=bh+wsize.sh
						;
						var position=Glacier.findStyle({
							obj:thisObj
						,	type:'position'
						,	value:'fixed'
						});
						var ini=new Array()
						,	objBw=bw
						,	objBh=bh
						;
						objBh=objBw=0;
						if(!position.isfind){
							div.msg.style.position='absolute';
						}else{
							div.msg.style.position='fixed';
						}
						ini.push({x:_x,y:_y,k:0});
						//左下角坐标
						ini.push({
							x:objBw+_x+(obj.w/2)-20
						,	y:objBh+_y-obj.h-tipobj.h+9
						,	k:2
						});
						//右下角坐标
						ini.push({
							x:objBw+_x+(obj.w/2)-tipobj.w+20
						,	y:objBh+_y-obj.h-tipobj.h+9
						,	k:3
						});
						//右上角坐标
						ini.push({
							x:objBw+_x+(obj.w/2)-tipobj.w+20
						,	y:objBh+_y+obj.h+13
						,	k:1
						});
						//左上角坐标
						ini.push({

							x:objBw+_x+(obj.w/2)-20
						,	y:objBh+_y+obj.h+13
						,	k:0
						});
						ini[0]=ini[(o.direction||1)];
						_x=ini[0].x;
						_y=ini[0].y;
						_k=ini[0].k;
						for(var i=0;i<6;i++){
							if(i>=5){
								if(_y<(bh+13)){
									_y=bh;
									_k=1;
								}
								if(_x<bw){
									_x=bw;
									_k=_k==1?0:2;
								}
								if(tipobj.w>(ckL-_x)){
									div.msg.style.width=(ckL-_x-5)+'px';
									tipobj=Glacier.Obj(div.msg);

									ini.length=1;
									findIni();
									return;
								}
								break;
							}
							var m=ini[i]
							,	l=ckL-m.x//判断l(显示MSG对象X轴坐标+MSG对像宽是否出屏)
							,	t=ckT-m.y//判断t(显示MSG最底Y轴坐标+MSG对像高是否出屏)
							;
							//当l和t大于MSG对像宽和高时，为满足当前方案
							if(m.x>=bw && m.y>=(bh+13) && l>=tipobj.w && t>=tipobj.h){
								_x=m.x;
								_y=m.y;
								_k=m.k;
								break;
							}
						}
						div.n[_k].style.display='';
						div.msg.style.zIndex=9999+Number(Glacier.Zindex());
						div.msg.style.left=(_x)+"px";
						div.msg.style.top=(_y)+"px";
					}
				;
				findIni();
				
			}
		;
		return {
			mouseover:''
		,	ouseout:''
		,	open:function(){
					this.mouseover=Glacier.closure({obj:this,callBack:start});
					this.ouseout=Glacier.closure({obj:this,callBack:stop});
					
					Glacier.AttachEvent(document,"mouseover",this.mouseover);
					Glacier.AttachEvent(document,"mouseout",this.ouseout);
				}
		,	msg:function(arr){
				arr=arr||{};
				if(!Glacier.isObj(arr.obj))return;
				msg.call(arr.obj,arr.title,arr.count);
			}
		,	close:function(){
				stop('',this);
			}
		,	clear:function(){
					Glacier.RemoveAttachEvent(document, "mouseover",this.mouseover);
					Glacier.RemoveAttachEvent(document, "mouseout",this.ouseout);
					div.msg.parentNode.removeChild(div.msg);
				}
			};
	};
	/***********************************鼠标提示    结束**************************************************/
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
			toPageTitle:encodeURIComponent(window.document.title || (window.location+'')),
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
	Glacier.fn.setInterval=function(fn,time){
		time = parseInt(time)<=0?0.001:time;
		var clsInterval		=	''
		,	tmpfn			=	fn
		,	tmpstop			=	false
		,	i				=	0
		,	n				=	0
		,	nfn				=	function(){
									if(n>0 && i>n) tmpstop=true;
								}
		,	retfn			=	{
										start	:	function(){
														clearInterval(clsInterval);
														clsInterval=tmpfn?Interval(tmpfn,(time*1000)):'';
														return retfn;
													},
										stop	:	function(o){
														o = o || {n:1};
														if(o.n)
															n=Glacier.isNumber(o.n)?parseInt(o.n):1;
														if(o.time){
															var callfn=function(){
																						this.obj.stop();
																					}
															,	t=Glacier.isNumber(o.time)?o.time:1
															;
															
															Glacier.setInterval(callfn,t).start();
														}
														return retfn;
													}
									}
		;
		time=Glacier.isNumber(time)?parseInt(time):0;
		if(Glacier.isFun(fn)){
			  var argu = Array.prototype.slice.call(arguments,2);
			  tmpfn = function(){
				  try{
					fn.apply({obj:retfn,i:i}, argu);
					i++; nfn();
					tmpstop && clearInterval(clsInterval);
				  }catch(e){
					  tmpfn='';
					  clearInterval(clsInterval);
				  }
			  };
		}
		
		return retfn;
	};
	Glacier.fn.animation=function(o){
		o 					=		o || {};
		if(Glacier.fn.isNaN(o.obj)) return;
		var obj_init			=	Glacier.Obj(o.obj)
		,	obj					=	o.obj
		,	init				=	{
										obj				:	obj,
										len				:	1,
										speed			:	0,
										callbck			:	function(s,fn,callbak){
															if(!s || !s.x) return;
															var n=s.x.length;
															n--;
															if(n<0){
																callbak && callbak(fn);
																return;
															}
															fn.obj.style.left=(fn.obj.x+s.x[n])+'px';
															fn.obj.style.top =(fn.obj.y+s.y[n])+'px';
															s.x.length=s.y.length=n;
															Glacier.setTimeout(fn.callbck,fn.speed,s,fn,callbak);
										},
										sline			:	function(p){
																p				=		p		||		{};
																p.callbak		=		p.callbak	||		'';
																p.x				=		p.x;
																p.y				=		p.y;
																p.obj			=		p.obj	||		'';
																var x			=		p.x-this.obj.x
																,	y			=		p.y-this.obj.y
																,	init		=		straightline(x,y,this.len)

																;
																this.callbck(init,this,p.callbak);
															
															
										},
										shake			:	function(p){
																p				=		p			||		{};
																p.callbak		=		p.callbak	||		'';
																p.l				=		p.l			||		6;
																p.n				=		p.n			||		3;
																p.isx			=		p.isx				;
																var init		=		vibration(p,this)
																;
																this.speed=0.02;
																this.callbck(init,this,p.callbak);
										},
									'':''}
		,	straightline			=	function(x,y,l){
											var _x=Math.abs(x)
											,	_y=Math.abs(y)
											,	arrayX=new Array()
											,	arrayY=new Array()
											,	L=l>0?l:1
											,	n=0
											;
											if(_x>_y){
												n=_x/L;
												
											}else{
												n=_y/L;
											}
											
											var	x_l=x/n
											,	y_l=y/n
											;
											for(var i=0;i<n;i++){
												arrayX.push(x_l*(n-i));
												arrayY.push(y_l*(n-i));
											}
											return {
												x:arrayX,
												y:arrayY,
											'':''};
		}
		,	vibration				=	function(p,obj){
											var obj_init = Glacier.Obj(obj.obj);
											obj.obj.x=obj_init.x;
											obj.obj.y=obj_init.y;
											var arrayX=new Array()
											,	arrayY=new Array();
											for(var i=0,nc=(p.n*2);i<nc;i++){
												if(p.isx){
													arrayX.push(0);
													arrayY.push(p.l/(nc-i));
													arrayX.push(0);
													arrayY.push(-(p.l/(nc-i)));
												}else{
													arrayX.push(p.l/(nc-i));
													arrayY.push(0);
													arrayX.push(-(p.l/(nc-i)));
													arrayY.push(0);
												}
											}
											arrayX.push(0);
											arrayY.push(0);
											return {
												x:arrayX,

												y:arrayY,
											'':''};
		}
		;
		obj.x=obj_init.x;
		obj.y=obj_init.y;
		obj.w=obj_init.w;
		obj.h=obj_init.h;
		return init;
		
	};
	Glacier.fn.getColor=function(o){
		o 					=		o || {};
		o.obj = Glacier.isString(o.obj)?Glacier('#'+o.obj)[0]:o.obj;
		if(!Glacier.isObj(o.obj)) return;
		o.h = [];
		o.h[0] = "FF";
		o.h[1] = "CC";
		o.h[2] = "99";

		o.h[3] = "66";
		o.h[4] = "33";
		o.h[5] = "00";
		o.on=o.on||'click';
		function init(){
			o.showobj=Glacier('#'+o.id).length>0?Glacier('#'+o.id)[0]:'';
			if((!Glacier.fn.isNaN(o.id) && !Glacier.isObj(Glacier('#'+o.id)[0])) || Glacier.fn.isNaN(o.id)){
				var wsize=Glacier.windowSize();
				var lockdiv=Glacier.dom({type:'div'});
				lockdiv.setstyle({style:"display:none;width:"+wsize.w+"px;height:"+wsize.h+"px;z-index:"+Glacier.Zindex()+";position:absolute;top: 0px;left: 0px;height:100%;width:100%;background:#ffffff;filter:alpha(opacity=0);-moz-opacity: 0;opacity: 0;"});
				lockdiv.add();
				
				var div=Glacier.dom({type:'div',id:(o.id||'')});
				div.setstyle({style:"display:none;z-index:"+Glacier.Zindex()+";position:absolute;width:235px; padding:0 0 1px 0; background:#fff; overflow:hidden; margin-bottom:30px;"});
				div.add();
				o.showobj=div.dom;
				o.showobj.lockobj=lockdiv.dom;
				
				Glacier(lockdiv.dom).bd({on:'click',callback:function(){
					if(!o.on_obj){
						o.on_obj={};
						o.on_obj.showobj=div.dom;
						o.on_obj.showobj.lockobj=lockdiv.dom;
					}
					hide(o.on_obj.showobj);
				}});
			}
		}
		init();
		if(!o.showobj) return;
		var	show=function(obj){
					obj.style.display = "";
					obj.lockobj.style.display='';
					obj.innerHTML = "";
				}
		,	hide=function(obj){
					obj.style.display = "none";
					obj.lockobj.style.display='none';
				}
		,	getRank=function(){// 组合出216种不同的颜色参数
				for(var r=0; r<6; r++){
					var _ul=Glacier.dom({type:'ul'});
					_ul.setstyle({style:'width:78px; float:left; display:inline; background:#fff; overflow:hidden; margin: 0px; padding: 0px;'});
					for(var g=0; g<6; g++){
						for(var b=0; b<6; b++){
							getCube(o.h[r], o.h[g], o.h[b], _ul.dom);
						};
					};
					_ul.add(o.showobj);
				};
			}
		,	getCube=function(R, G, B, _ul){// 创建颜色小方块
				var _li = Glacier.dom({type:'li'});
				var _a = Glacier.dom({type:'a'});
				_li.setstyle({title:("#"+ R + G + B),style:'float:left; display:inline; width:12px; height:12px; margin:1px 0 0 1px; background:#808080;'});
				_a.setstyle({style:'background:#'+(R + G + B)+';display:block; margin:1px 0 0 1px; width:11px; height:11px; overflow:hidden;'});
				_a.add(_li.dom);
				_li.add(_ul);
				Glacier(_li.dom).bd({on:'click',callback:function(){
					hide(_ul.parentNode);
					o.callback.call(this,R + G + B,o.on_obj)
				}});
			}
		;
		var tmpobj=Glacier(o.obj);
		tmpobj[0].showobj=o.showobj;
		tmpobj.bd({on:o.on,callback:function(){
			o.on_obj=this;
			var obj=Glacier.Obj(o.on_obj)
			,	_x=obj.x
			,	_y=obj.y+obj.h
			,	wsize=Glacier.windowSize()
			,	p_w=235
			,	p_h=165
			;
			if((wsize.sh-_y)<p_h) _y=wsize.sh-p_h;
			if((wsize.sw-_x)<p_w) _x=wsize.sw-p_w;
			if(_y<1)_y=0;
			if(_x<1)_x=0;
			this.showobj.style.top=_y+'px';
			this.showobj.style.left=_x+'px';
			show(this.showobj);
         	getRank();
		}});
	};
	Glacier.fn.setupGetColor=function(o){
		o 					=		o || {};
		o.isOne=o.isOne?Glacier.uuidFast().replace(/-/ig,''):'';
		Glacier.Each(
			function(i){
				Glacier.getColor({
					 id:o.isOne,
					 obj:this.toString(),
					 on:o.on,
					 callback:o.callback
				 });
			}
			,o.ids.split(",")
		);
	};
	Glacier.fn.Dropshadow=function(o){
		o 					=		o || {};
		var css_filter=new Array()
		,	css_textShadow=new Array()
		,	RGB=this.RGB
		;
		Glacier.Each(
			function(i){
				if(Glacier.fn.isNaN(RGB)) RGB=this[2];
				css_filter.push('Dropshadow(offx='+this[0]+',offy='+this[1]+',color='+RGB+')');
				css_textShadow.push(RGB+' '+this[0]+'px '+this[1]+'px 0 ');
			}
			,o
		);
		return 'filter:'+css_filter.join(' ')+';text-shadow:'+css_textShadow.join(',')+';';
	};
	Glacier.fn.domload=function(o){
		o = o || {};
		var obj=Glacier(o.obj)[0]
		,	list=Glacier((o.find || 'img object iframe'),obj)
		,	n=list.length
		,	ckn=1
		,	onfn=function(cbing,cb){
				ckn>0&&ckn++;
				if(Glacier.isFun(cbing)) cbing.call(this,ckn,n,n<ckn);
				if(n<ckn){
					ckn=n=-1;
					ckn--;
					this.onerror=this.onload='';
					cb && cb.call(obj);
				}
			}
		,	fn=function(i){
				var domObj=list[i];
				try{
					if(domObj.readyState=='complete' || domObj.complete){
						onfn.call(domObj,o.callbaking,o.callbak);
					}else{
						domObj.onload=function(){
							onfn.call(domObj,o.callbaking,o.callbak);
						};
						domObj.onerror=function(){
							onfn.call(domObj,o.callbakErring,o.callbak);
						}
					}
				}catch(e){
					onfn.call(domObj,o.callbaking,o.callbak);
				}
			}
		,	start=function(){
				if(n==0){
					o.callbak && o.callbak();
				}
				for(var i=0;i<n;i++)fn(i);
			}()
		;
		
	};
	Glacier.fn.autoimg=function(maxWidth,maxHeight,objImg){
		var img = new Image();
		img.src = objImg.src;
		var hRatio;
		var wRatio;
		var Ratio = 1;
		var w = img.width;
		var h = img.height;
		wRatio = maxWidth / w;
		hRatio = maxHeight / h;
		if (maxWidth ==0 && maxHeight==0){
		Ratio = 1;

		}else if (maxWidth==0){//
		if (hRatio<1) Ratio = hRatio;
		}else if (maxHeight==0){
		if (wRatio<1) Ratio = wRatio;
		}else if (wRatio<1 || hRatio<1){
		Ratio = (wRatio<=hRatio?wRatio:hRatio);
		}
		if (Ratio<1){
		w = w * Ratio;
		h = h * Ratio;
		}
		objImg.height = h;
		objImg.width = w;
		return objImg;
	};
	Glacier.fn.loadscroll=function(o){
		o=o||{};
		if(Glacier.fn.isNaN(o.obj)) return;
		var obj=o.obj
		,	mouseScroll=Glacier.isIE?'mousewheel':'DOMMouseScroll'
		,	loadh=o.loadh||10
		,	p=1
		,	objIni={}
		,	isOne=false
		,	ckLoad=function(){
				window.document.title=obj.scrollHeight+'='+obj.scrollTop+'|'+((obj.scrollHeight-obj.scrollTop-objIni.h)<loadh);
				return (obj.scrollHeight-obj.scrollTop-objIni.h)<loadh;
			}
		,	bdOn=function(){
				if(!ckLoad())
					isOne=true;
				Glacier.AttachEvent(obj,"scroll",fn);
				Glacier.AttachEvent(obj,mouseScroll,fn);
			}
		,	delBdOn=function(){
				Glacier.RemoveAttachEvent(obj,"scroll",fn);
				Glacier.RemoveAttachEvent(obj,mouseScroll,fn);
			}
		,	fn=function(){
				if(ckLoad() && isOne){
					isOne=false;
					delBdOn();
					o.callback && o.callback(p);
				}
			}
		,	start=function(){
				p=1;
				objIni=Glacier.Obj(obj);
				Glacier.AttachEvent(obj,"mouseover",bdOn);
				Glacier.AttachEvent(obj,"mouseout",delBdOn);
			}
		,	go=function(){
				var th=obj.scrollHeight-objIni.h;
				if(th<loadh)
					loadh=th;
				if(ckLoad())
					obj.scrollTop=obj.scrollHeight-loadh-objIni.h-1;
				p++;
				bdOn();
			}
		,	stop=function(){
				delBdOn();
				Glacier.RemoveAttachEvent(obj,"mouseover",bdOn);
				Glacier.RemoveAttachEvent(obj,"mouseout",delBdOn);
			}
		;
		
		return {
				start	:	start,
				go		:	go,
				stop	:	stop,
				''		:	''
			};
	};
	Glacier.fn.png=function(obj){
		if(!Glacier.isIE6)return obj;
		obj=obj||window.document;
		Glacier.Each(
				function(i){
					var bg = this.currentStyle.backgroundImage;
					if (bg && bg.match(/.PNG|.png/i) != null){
						var mypng = bg.substring(5,bg.length-2);
						this.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+mypng+"',enabled=true, sizingMethod=scale)";
						this.style.backgroundImage = "url('')";
						this.style.background = "none";
					}
				}
				,obj.getElementsByTagName('*')
		);
		Glacier.Each(function(i){
					var src = (this.src||'').toUpperCase();
					if (src.substring(src.length-3, src.length) == "PNG")
					{
						var imgID = (this.id) ? "id='" + this.id + "' " : "";
						var imgClass = (this.className) ? "class='" + this.className + "' " : "";
						var imgTitle = (this.title) ? "title='" + this.title + "' " : "title='" + this.alt + "' ";

						var imgStyle = "display:inline-block;" + this.style.cssText;
						if (this.align == "left") imgStyle = "float:left;" + imgStyle;
						if (this.align == "right") imgStyle = "float:right;" + imgStyle;
						if (this.parentElement.href) imgStyle = "cursor:hand;" + imgStyle;
						this.outerHTML='<span '+imgID + imgClass + imgTitle+' style=\"" + "width:'+this.width+'px; height:'+this.height+'px;'+imgStyle+';filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+this.src+', sizingMethod=\'scale\')"></span>';
					}
				}
				,Glacier('img',obj)
		);
		return obj;
	};
	Glacier.fn.mkflash=function(cabfn){
		var fn=function(o){
				var objID=o.id||Glacier.uuidFast().replace(/-/ig,'')
				,	str='<OBJECT id="'+objID+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+(o.w||0)+'" height="'+(o.h||0)+'" ><PARAM NAME="movie" VALUE="'+o.src+'">';
				if(!Glacier.isIE) str='<object width="'+(o.w||0)+'" height="'+(o.h||0)+'" data="'+o.src+'" id="'+objID+'" type="application/x-shockwave-flash">';
				o.data=(typeof o.data !== "string"?function(){
						return Glacier.formatparam({
								param		:	o.data
							,	separate	:	"&amp;"
							,	Handle		:	function(key,value){
									return value?key + "=" + value:'';
								}
						}).replace( /%20/g , "+" );
					}():o.data);
				if(!Glacier.fn.isNaN(o.param)){
					str+=o.param;
				}
				str+='<param value="'+o.data+'" name="flashvars">';
				str+='<param value="always" name="allowScriptAccess">';
				str+='<param value="true" name="allowfullscreen"></object>';
				return {
					html:str
				,	id:objID
				};
			}
		,	path='/static/web/flash/'
		;
		if(cabfn) return cabfn.call(this,{fn:fn,path:path});
	};
	Glacier.fn.getFlash=function(){
		var fn=function(){}
		,	path=''
		,	flashID=''
		;
		Glacier.fn.mkflash(function(o){
			o=o||{};
			fn=o.fn;
			path=o.path;
		});
		return {
			time:function(ini){
				ini = ini||{};
				var o={};
				o.w=ini.two?402:200;
				o.h=180;
				o.data={
					isTwos	:ini.two
				,	time1	:ini.time1
				,	time2	:ini.time2
				,	mindate	:ini.mindate
				,	maxdate	:ini.maxdate
				,	fn		:ini.fnname
				,	fn1		:ini.fnone
				,	fn2		:ini.fntwo
				,	fnload	:ini.fnload
				,	wholemonth:ini.wholemonth
				};
				o.src=(ini.path||path)+'time.swf';
				return fn(o);
			}
		,	cookies:function(o){
				o=o||{};
				o.src=(o.src||path+'cookie.swf');
				return fn(o);
			}
		};
	}();
	Glacier.fn.time=function(o){
		o=o||{};
		var fn=function(html){return html;}
		,	G_Obj=o.timeObj||this
		,	objIni=''
		,	flashDiv=o.innerObj||Glacier.dom({type:'div'})
		,	GDiv=o.altObj||Glacier(flashDiv.dom)
		,	w=o.two?402:200
		,	h=180
		,	x=0
		,	y=0
		,	isTrue=false
		,	xyIni=function(obj){
				objIni=Glacier.Obj(obj);
				var wsize=Glacier.windowSize();
				x=objIni.x+objIni.w;
				y=objIni.y+objIni.h;
				if((x+w)>(wsize.sw+wsize.scrollLeft))x=wsize.sw+wsize.scrollLeft-w;
				if((y+h)>(wsize.sh+wsize.scrollTop))y=wsize.sh+wsize.scrollTop-h;
				isTrue=true;
			}
		;
		if(Glacier.fn.isNaN(o.obj)){
			o.obj=G_Obj[0];
			fn=function(flashMap){
				Glacier.insert.call(G_Obj,{fn:o.innerObj?function(){
					flashDiv[0].innerHTML=flashMap.html;
					xyIni(G_Obj[0]);
				}:function(){
					flashDiv.setstyle({style:'display:none;width:'+w+'px;height:'+h+'px;'});
					flashDiv.add();
					Glacier.domload({
						obj:flashDiv.dom
					,	callbak:function(){
							xyIni(G_Obj[0]);
						}
					});
					flashDiv.dom.innerHTML=flashMap.html;
				}});



				return {
						show:function(k){
							k=k||{};
							if(!isTrue)return false;
							k.obj && xyIni(k.obj);
							GDiv.WinAlt({
								lock:true
							,	lock_back:'#fff'
							,	lock_opa:1
							,	zIndex:99999999
							,	lockfn:o.lockfn||function(){GDiv.display().none();}
							,	xLenPx:k.x||o.x||x
							,	yLenPx:k.y||o.y||y
							});
						}
					,	none:function(){
							GDiv.display().none();
						}
					,	obj:function(){
							if(!isTrue)return false;
							return Glacier.thisMovie(flashMap.id);
						}
					};
			};
		}
		return fn(Glacier.getFlash.time(o));
	};
	Glacier.fn.insert=function(o){
		var insobj=this;
		o = o || {};
		if(o.obj){
			insobj[0]=o.obj;
		}
		Glacier.Each(function(){
			if(o.fn){
				o.fn.call(this);
			}else{
				if('input'==(this.nodeName.toLowerCase())){
					this.value=o.str;
				}else{
					this.innerHTML=o.str;
				}
			}
		}
		,insobj);
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
