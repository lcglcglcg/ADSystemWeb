document.writeln("<script src=\'\/static\/public\/web\/js\/Glacier.js\' type=\'text\/javascript\' language=\'javascript\' charset=\'utf-8\'><\/script>");
window.subAjax=function(findDom,subDom){
	return new $G(findDom).cksub({
			sub:subDom
		,	ck:{
				login:function(v){
					return ((/^[A-Za-z0-9_\u4e00-\u9fa5]+$/.test($G.TrimTest(v))));
				}
			,	pass:function(v){
					return ((/^[A-Za-z0-9_\.]+$/.test($G.TrimTest(v))));
				}
			}
		,	url:''
		,	dataType:'html'
		,	ckdata:function(data){
				return ;
			}
		,	error:function (XMLHttpRequest, textStatus, errorThrown) {}
		,	callback:function(){}
	});
};
window.region=function(o){
	o=o||{};
	var	parentList={}
	,	regionList={}
	,	codeList={}
	,	divTemp=$G.ie6DivForIframe()
	,	szqydisplay=o.obj
	,	regionDataIni=function(json){
			var accountParent=$G(o.provinceId||'.provinceId',o.obj)
			,	accountRegion=$G(o.cityId||'.cityId',o.obj)
			;
			for(var i=0,n=json.length;i<n;i++){
				var obj=json[i]
				;
				if(!$G.isArray(parentList[obj.parentId]))parentList[obj.parentId]=new Array();
				parentList[obj.parentId].push(obj);
				codeList[obj.code]=obj;
				regionList[obj.regionId]=obj;
				
			}
			var parentIds=parentList['0']
			,	l=parentIds.length
			,	regionFn=function(rfn){
					var regionIds=parentList[this.value]
					,	s=regionIds?regionIds.length:0
					;
					accountRegion.delallsel();
					for(var t=0;t<s;t++){
						var tmpJson=regionIds[t];
						accountRegion.addsel(tmpJson.nameCn,tmpJson.regionId);
					}
					rfn&&rfn();
					window.selDom&&window.selDom.resall();
				}
			;
			accountParent.delallsel();
			for(var k=0;k<l;k++){
				var tmpJson=parentIds[k];
				accountParent.addsel(tmpJson.nameCn,tmpJson.regionId);
			}
			accountParent[0].onchange=regionFn;
			window.selDom&&window.selDom.resall();
			divTemp.style.display='none';
			return {
				set:function(pcode,rcode){
					try{
						divTemp.style.display='';
						if($G.isNaN(pcode) || $G.isNaN(rcode))return;
						var pid=pcode
						,	rid=rcode
						;
						accountParent.setselvalue(pid);
						regionFn.call({value:pid},function(){
							accountRegion.setselvalue(rid);
						});
						divTemp.style.display='none';
					}catch(e){alert('window.region:'+e);}
				}
			,	regionList:regionList
			};
		}(o.data);
	;
	divTemp.style.position='relative';
	divTemp.style.zIndex=100000;
	divTemp.style.top='-30px';
	szqydisplay.appendChild(divTemp);
	return regionDataIni;
};
window.selDom=null;
/**
* 创建一个UE对像封装
*/
var $UE={
	md5Id:"1ec773227ebf08b6ef33766c3d3eee55",
	obj:[],
	tip:{open:function(){},close:function(){}},
	loadingDefault:function(){
		window.selDom=$G.select({
			
			optwidth:'auto'
		,	width:'list',
		cssDiv3:"background:url(/static/public/web/images/selectBg.gif) no-repeat scroll right top;border:1px solid #88ACCF;height: 18px;overflow: hidden;padding:0 20px 0 5px;"
		});
		$UE.tip.open();
	},
	// 绑定事件
	AttachEvent:function(target,eventName,handler,argsObject){
		var eventHandler=handler;
		if(argsObject)
		{
			eventHander=function(e)
			{
				handler.call(argsObject, e);
			}
		}
		if(navigator.appName.indexOf("Explorer")>-1 ? true : false)//IE
			target.attachEvent("on"+eventName,eventHander);
		else//FF
			target.addEventListener(eventName,eventHander,false);
	},
	/*
	 * 打开一个弹出层，默认居中锁屏弹出，弹出层可移动
	 * id：打开层的ID
	 * isLock：是否可以锁屏
	 * isMove：是否可以移动
	 * lock_color：锁屏颜色 默认#BBBBBB
	 * lock_opa：锁屏颜色透明度 默认30
	 */
	open:function(id,isLock,isMove,lock_color,lock_opa){
		if(typeof(isLock)=="undefined")isLock=true;
		if(typeof(isMove)=="undefined")isMove=true;
		if(typeof(lock_color)=="undefined")lock_color="#BBBBBB";
		if(typeof(lock_opa)=="undefined")lock_opa="30";

		this.obj[id]=$G("#"+id);
		this.obj[id].WinAlt({
			position:'absolute',
			isCenter:true,
			lock:isLock,
			lock_back:lock_color,
			lock_opa:lock_opa
		});
		if(isMove) this.obj[id].Move({ismovewindow:true});		//{ismovewindow:true,position:'absolute'}
	},
	/*
	 * 打开一个弹出层，按照指定坐标位置锁屏弹出，弹出层可移动
	 * id：打开层的ID
	 * xLenPx:横坐标
	 * yLenPx:纵坐标
	 * isLock：是否可以锁屏
	 * isMove：是否可以移动
	 * lock_color：锁屏颜色 默认#BBBBBB
	 * lock_opa：锁屏颜色透明度 默认30
	 */
	openXY:function(id,xLenPx,yLenPx,isLock,isMove,lock_color,lock_opa){
		var isCenter = false;
		if(typeof(xLenPx)=="undefined" && typeof(yLenPx)=="undefined")isCenter = true;
		else if(typeof(xLenPx)=="undefined")xLenPx=this.obj[idForClick][0].offsetLeft+width;
		else if(typeof(yLenPx)=="undefined")yLenPx=0;
		
		if(typeof(isLock)=="undefined")isLock=true;
		if(typeof(isMove)=="undefined")isMove=true;
		if(typeof(lock_color)=="undefined")lock_color="#BBBBBB";
		if(typeof(lock_opa)=="undefined")lock_opa="30";

		this.obj[id]=$G("#"+id);
		this.obj[id].WinAlt({
			isLeft:true,
			isTop:true,
			isCenter:isCenter,
			xLenPx:x,
			yLenPx:y,
			lock:isLock,
			lock_back:lock_color,
			lock_opa:lock_opa
		});
		//if(isMove) this.obj[id].Move();
	},
	/*
	 * 在对应元素下方打开一个弹出层，默认在正下方打开
	 * idForClick：触发打开层的元素ID
	 * idForInfo：打开层的ID
	 * width：距离打开层左下角的宽度 默认为0
	 * height：距离打开层左下角的高度 默认为0
	 */
	openInfo:function(idForClick,idForInfo,width,height){
		this.obj[idForClick]=$G("#"+idForClick);
		this.obj[idForInfo]=$G("#"+idForInfo);

		if(typeof(width)=="undefined")width=0;
		if(typeof(height)=="undefined")height=0;

		var x=this.obj[idForClick][0].offsetLeft+width;
		var y=this.obj[idForClick][0].offsetTop+this.obj[idForClick][0].offsetHeight+height;

		this.obj[idForInfo].WinAlt({
			isLeft:true,
			isTop:true,
			xLenPx:x,
			yLenPx:y,
			lock:false
		});
	},
	
	/*
	 * 打开一个弹出提示框层，默认居中锁屏弹出，弹出层不可移动
	 * id：打开层的ID
	 * idForMsg：显示提示信息位置的元素ID
	 * Msg：要显示的消息
	 */
	openMsg:function(id,idForMsg,msg){
		this.obj[id]=$G("#"+id);
		this.obj[id].html(msg);
		this.obj[id].WinAlt({
			position:'fixed',
			isCenter:true,
			lock:true,
			lock_back:'#BBBBBB',
			lock_opa:'30'
		});
	},
	close:function(id){
		this.obj[id].display().none();
	},
	
	/*
	 * 打开一个弹出提示框层，默认居中锁屏弹出，弹出层不可移动
	 * id：打开层的ID
	 * idForMsg：显示提示信息位置的元素ID
	 * Msg：要显示的消息
	 */
	openMsgDaily:function(id,ids,vs){
		this.obj[id]=$G("#"+id);
		$G(ids,this.obj[id][0]).Each(function(i){
			this.innerHTML=vs[i];
		});
		this.obj[id].WinAlt({
			position:'fixed',
			isCenter:true,
			lock:true,
			lock_back:'#BBBBBB',
			lock_opa:'30'
		});
	},
	close:function(id){
		this.obj[id].display().none();
	},
	
	/*
	 * 打开确定提示框
	 * id：提示信息层的id
	 * idTitle：提示信息标题id
	 * titleContent:标题的内容
	 * idMsg：提示信息内容id
	 * msgContent：提示信息内容
	 * idOk：确认按钮id
	 * idClose：关闭按钮id
	 * okCallback: 确认按钮执行事件
	 * closeCallback: 确认按钮执行事件
	 */
	alert0:function(o){
		var msgContent=o.msgContent;
		var id = o.id;
		var idTitle = o.idTitle;
		var titleContent = o.titleContent;
		var idMsg = o.idMsg;
		var idOk = o.idOK;
		var idClose = o.idClose;
		var okCallback = o.okCallback;
		var closeCallback = o.closeCallback;

		if(typeof(id)=="undefined")id="idAlert";
		if(typeof(idTitle)=="undefined")idTitle="idAlertTitle";
		if(typeof(titleContent)=="undefined")titleContent="提示信息";
		if(typeof(idMsg)=="undefined")idMsg="idAlertMsg";
		if(typeof(msgContent)=="undefined")msgContent="";
		if(typeof(idOk)=="undefined")idOk="idAlertOK";
		if(typeof(idClose)=="undefined")idClose="idAlertClose";
		if(typeof(okCallback)=="undefined")okCallback="";
		if(typeof(closeCallback)=="undefined")closeCallback="";
		
		this.obj[id]=$G("#"+id);
		var objTitle=$G("#"+idTitle);
		var objMsg=$G("#"+idMsg);
		var objClose=$G("#"+idClose);
		var objOK=$G("#"+idOk);
		
		var msgLen = $G.len(msgContent);
		
		this.obj[id][0].style.width='220px';
		if(msgLen>20){
			var addWidth = (msgLen - 20)*6;
			this.obj[id][0].style.width=(220 + addWidth) + 'px';
		}

		objTitle.html(titleContent);
		objMsg.html(msgContent);
		
		objOK[0].onclick = function(){
			$UE.close(id);
			eval(okCallback);
		}

		objClose[0].onclick = function(){
			$UE.close(id);
			eval(closeCallback);
		}
		
		this.obj[id].WinAlt({
			position:'fixed',
			isCenter:true,
			lock:true,
			lock_back:'#BBBBBB',
			lock_opa:'30'
		});
	},
	/*
	 * 打开确定提示框
	 * id：提示信息层的id
	 * okCallback: 确认按钮执行事件
	 */
	alert:function(msgContent,okCallback){
		$UE.alert0({
			msgContent:msgContent,
			okCallback:okCallback
		});
	},
	/*
	 * 打开确定提示框
	 * id：提示信息层的id
	 * idTitle：提示信息标题id
	 * titleContent:标题的内容
	 * idMsg：提示信息内容id
	 * msgContent：提示信息内容
	 * idClose：关闭按钮id
	 * idOk：确认按钮id
	 * idCancel：取消按钮id
	 * closeCallback:关闭按钮回调方法
	 * okCallback:确定按钮回调方法
	 * cancelCallback:取消按钮回调方法
	 */
	confirm0:function(o){
		var msgContent = o.msgContent;
		var id= o.id ;
		var idTitle= o.idTitle ;
		var titleContent= o.titleContent ;
		var idMsg = o.idMsg;
		var idClose = o.idClose;
		var idOk = o.idOk;
		var idCancel = o.idCancel;
		var closeCallback = o.closeCallback;
		var okCallback = o.okCallback;
		var cancelCallback = o.cancelCallback;

		if(typeof(id)=="undefined")id="idConfirm";
		if(typeof(idTitle)=="undefined")idTitle="idConfirmTitle";
		if(typeof(titleContent)=="undefined")titleContent="确认提示信息";
		if(typeof(idMsg)=="undefined")idMsg="idConfirmMsg";
		if(typeof(msgContent)=="undefined")msgContent="";
		if(typeof(idClose)=="undefined")idClose="idConfirmClose";
		if(typeof(idOk)=="undefined")idOk="idConfirmOK";
		if(typeof(idCancel)=="undefined")idCancel="idConfirmCancel";
		if(typeof(closeCallback)=="undefined")closeCallback="";
		if(typeof(okCallback)=="undefined")okCallback="";
		if(typeof(cancelCallback)=="undefined")cancelCallback="";
		
		this.obj[id]=$G("#"+id);
		var objTitle=$G("#"+idTitle);
		var objMsg=$G("#"+idMsg);
		var objClose=$G("#"+idClose);
		var objOK=$G("#"+idOk);
		var objCancel=$G("#"+idCancel);

		var msgLen = $G.len(msgContent);
		if(msgLen>20){
			var addWidth = (msgLen - 20)*6;
			this.obj[id][0].style.width=(220 + addWidth) + 'px';
		}
		
		objTitle.html(titleContent);
		objMsg.html(msgContent);
		
		objClose[0].onclick = function(){
			$UE.close(id);
			eval(closeCallback);
		}
		
		objOK[0].onclick = function(){
			$UE.close(id);
			eval(okCallback);
		}
		
		objCancel[0].onclick = function(){
			$UE.close(id);
			eval(cancelCallback);
		}
		
		this.obj[id].WinAlt({
			position:'fixed',
			isCenter:true,
			lock:true,
			lock_back:'#BBBBBB',
			lock_opa:'30'
		});
	},	
	/*
	 * 打开确定提示框
	 * id：提示信息层的id
	 * okMessage:确定后提示信息
	 * okCallback:确定按钮回调方法
	 */
	confirm:function(msgContent,okMessage,okCallback){
		if(typeof(okCallback)=="undefined")okCallback='';
		if(typeof(okMessage)!="undefined" && okMessage!="" && okMessage!="null" )okCallback='$UE.alert(\''+okMessage+'\');'+okCallback+';';
		else okCallback=okCallback+';';
		$UE.confirm0({
			msgContent:msgContent,
			okCallback:okCallback
		});
	},	
	/*
	 * 打开一个url地址
	 * url：url地址
	 * isNew：新窗口打开 默认 false
	 */
	openUrl0:function(o){
	  var url = o.url;
	  var isNew = o.isNew;   if(typeof(url)=="undefined")return;
	  if(typeof(isNew)=="undefined")isNew=false;
	  
	  if(isNew){
	  }else{
	   window.location.href=url;
	  }
	 },
	 /*
	 * 打开一个url地址
	 * url：url地址
	 * isNew：新窗口打开 默认 false
	 */
	openUrl:function(url,isNew){
	  $UE.openUrl0({
	  	url:url,
		isNew:isNew
	  });
	 },
	/*
	* 隐藏或显示指定元素(多个元素Id用英文逗号分隔)
	* id：元素ID
	* value：隐藏或是显示的样式值
	*/ 
	display:function(id,value){
		if(typeof(id)=="undefined") return;
		if(typeof(value)=="undefined") value="block";    
		
		var idArray=id.split(',');
		for(var i=0;i<idArray.length;i++){
			var tempObj=document.getElementById(idArray[i]);
			if(typeof(tempObj)!=null) tempObj.style.display=value;
		}
	},
	/*
	* 批量隐藏或显示指定前缀的元素
	* preStr:前缀字符串
	* count：带的前缀字符的元素个数
	* value：隐藏或是显示是当前索引元素的样式值, 默认 值为"block"
	*/ 
	display2:function(preStr,count,value){
		if(typeof(preStr)=="undefined") return;
		if(typeof(count)=="undefined") return;
		if(typeof(value)=="undefined") value="block"; 

		for(var i=1;i<=count;i++){
			var tempObj=document.getElementById(preStr+i);
			if(typeof(tempObj)!=null)tempObj.style.display=value;
		}
	},	
	/*
	* 批量隐藏或显示指定前缀的元素+隐藏或显示指定索引的元素
	* preStr:前缀字符串
	* count：带的前缀字符的元素个数
	* index：当前元素索引
	* value：隐藏或是显示是当前索引元素的样式值, 默认 值为“block”
	*/ 
	display3:function(preStr,count,index,value){
		if(typeof(preStr)=="undefined") return;
		if(typeof(count)=="undefined") return;
		if(typeof(index)=="undefined") return;
		if(typeof(value)=="undefined") value="block"; 
		var otherStyle = 'none'
		if(value=='none')otherStyle="block";
		else otherStyle="none";

		for(var i=1;i<=count;i++){
			var tempObj=document.getElementById(preStr+i);
			if(typeof(tempObj)!=null){
				if(i==index)tempObj.style.display=value;
				else tempObj.style.display=otherStyle;
			}
		}
	},
	/*
	* 给指定元素设置样式名称(多个元素Id用英文逗号分隔)
	* id：元素ID
	* className：样式名称
	*/
	setClass:function(id,className){
		if(typeof(id)=="undefined") return;    
		
		var idArray=id.split(',');
		for(var i=0;i<idArray.length;i++){
			var tempObj=document.getElementById(idArray[i]);
			if(typeof(tempObj)!=null && typeof(className)!="undefined") tempObj.className=className;
		}
	},
	/*
	* 批量给指定前缀元素设置样式名称
	* preStr:前缀字符串
	* count：带的前缀字符的元素个数
	* className：样式名称 默认为空
	*/
	setClass2:function(preStr,count,className){
		if(typeof(preStr)=="undefined") return;
		if(typeof(count)=="undefined") return;
		if(typeof(className)=="undefined") className="";   

		for(var i=1;i<=count;i++){
			var tempObj=document.getElementById(preStr+i);
			if(typeof(tempObj)!=null)tempObj.className=className;
		}
	},
	/*
	* 批量给指定前缀元素设置样式名+指定索引的元素设置样式
	* preStr:前缀字符串
	* count：带的前缀字符的元素个数
	* className1：样式名称 默认为空
	* index：当前元素索引
	* className2：样式名称 默认为空
	*/
	setClass3:function(preStr,count,className1,index,className2){
		if(typeof(preStr)=="undefined") return;
		if(typeof(count)=="undefined") return;
		if(typeof(index)=="undefined") return;
		if(typeof(className1)=="undefined") className1="";   
		if(typeof(className2)=="undefined") className2="";   

		for(var i=1;i<=count;i++){
			var tempObj=document.getElementById(preStr+i);
			if(typeof(tempObj)!=null){
				if(i!=index) tempObj.className=className1;
				else tempObj.className=className2;
			}
		}
	},
	/*
	 * 单选框值选中时触发回调事件
	 * id：单选框ID
	 * callback：回调方法
	 */
	radioChoosedDo:function(o){
		var id = o.id;
		var callback = o.callback;

		if(typeof(callback)=="undefined")callback="";
		if(document.getElementById(id).checked) eval(callback);
	},
	/*
	 * 单选框值选中时打开新页面
	 * id：单选框ID
	 * url：新页面url地址
	 */
	radioChoosedOpen:function(id,url){
		$UE.radioChoosedDo({
			id:id,
			callback:'window.location.href=\''+url+'\''
		});
	},
	/*
	 * 下拉框值选中时触发回调事件
	 * id：单选框ID
	 * callbackMap：选项值对应的回调方法 {value1:callback1,value2:callback2} 
	 */
	selectChoosedDo:function(o){
		var id = o.id;
		var doMap = o.callbackMap;

		var selectValue = document.getElementById(id).value;
		for(var k in doMap){
			if(k=selectValue){
				var callback = doMap[k];
				if(typeof(callback)=="undefined")callback="";
				eval(callback);
			}
		}
	},
	/*
	 * 设置元素innerHTML
	 * id：元素ID
	 * value：设置值
	 */
	setValue:function(id,value){
		document.getElementById(id).innerHTML=value;
	},
	/*
	 * 获得页面URL路径中的参数对应的值
	 * parameterName：url路径中的参数名称
	 */
	getURLValue:function(parameterName){
		return $G.getid(parameterName);
	}
};

$UE.AttachEvent(window,'load',$UE.loadingDefault,window);