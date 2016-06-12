// 判断，不是自己的域名 manager.wm.haomeit.com 的时候  隐藏掉 广告审核、充值管理、DSP管理

// 判断58 隐藏广告审核
var tempDomain = window.location.href,
	isHide = (tempDomain.indexOf("disease8.haomeit.com") < 0 && tempDomain.indexOf("jtys.haomeit.com") < 0);

window.headerEnd(function(){
	var jsonUser=window.wm.data['user'];
	$G('li',$G('div:header')[0]).Each(function(i){
		if(i==0){
			this.innerHTML='欢迎您，'+jsonUser['ACCOUNT_NAME']+'，今天是'+$G.formatdate(new Date(),'YYYY年MM月dd日');
		}else if(i==1){
			
		}else if(i==2){
			this.onclick=function(){
				window.gconfirm({
					msg:'您确定要退出管理系统吗？'
				,	notCheck:true
				,	fn:function(isTrue){
						if(isTrue){
							window.ajax({
								path:'LOGOUT'
							,	calback:function(json){
									window.wm.toLogin();
								}
							});
						}
					}
				});
			};
		}
	});
	window.checkPass=function(o,fn){
		o=o||{};
		if(o['CREATIVE_STATUS']!=2){
			o['CREATIVE_REFUSE_REASON']='';
		}
		window.ajax({
			path:'SET_CREATIVE_BATCH'
		,	data:o
		,	calback:function(json){
				fn&&fn(json);
			}
		});
	};
	window.checkReset=function(o,fn){
		o=o||{};
		window.ajax({
			path:'DESTINATION_URL_CHECK'
		,	data:o
		,	calback:function(json){
				fn&&fn(json);
			}
		});
	};
	window.setState=function(o,fn){
		o=o||{};
		window.ajax({
			path:'BATCH_OPERATION'
		,	data:o
		,	calback:function(json){
				fn&&fn(json);
			}
		});
	};
	var nav=$G('div:nav')
	,	li=$G('.list',nav[0])
	;
	window.userDemo=function(){
		var account_view=$G('#account_view')
		,	adiv=window.alertDiv({
				findObj:'#account_view'
			,	position:'absolute'
			,	move:$G('div:account_title',account_view[0])
			})
		,	page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		;
		return {
			show:function(id){
				var data=function(){
					return window.wm.setDataListManager({
						"FIND_NAME":""
					,	"FIND_NAME_TYPE":"1"
					,	"STATUS":"100"
					,	"SORT_COLUMN":"5"
					,	"SORT_TYPE":"2"
					,	"FIND_TYPE":"8"
					,	"TIME_START":""
					,	"TIME_END":""
					,	"BALANCE_TYPE":"1"
					,	"PAGE_INDEX":"1"
					,	"PAGE_COUNT":"1"
					,	"ACCOUNT_ID":id
					}
					,window,pageArray);
				}();
				data['FIND_TYPE']=8;
				window.ajax({
					path:'GET_MANAGER_ACCOUNT_LIST'
				,	type:'post'
				,	data:data
				,	calback:function(JSON){
						if(window.wm.msg(JSON.CODE,false) && JSON.LIST.length>0){
							var json=JSON.LIST[0];
							$G.Each(function(i,k){
								var obj=$G('.'+k,account_view[0])
								;
								if(obj.length>0){
									obj.val(this+'');
									obj[0].readOnly=true;
								}
							},json);
							var keyList=json.GUAHAO_TOKEN.split('||')
							;
							if(keyList.length>1){
								$G('.GUAHAO_TOKEN',account_view[0])[0].value=keyList[0]||'';
								$G('.GUAHAO_TOKEN_TO',account_view[0])[0].value=keyList[1]||'';
							}
							if(!$G.isNaN(json.HOSPITAL_IMG))json.HOSPITAL_IMG='/'+json.ACCOUNT_ID+'.JPG';
							$G('img',account_view[0])[0].src=window.wm.path.imagesHttp+'/HospitalImgFile'+json.HOSPITAL_IMG+'?'+new Date().getTime();
							adiv.show();
						}
					}
				});
				
			}
		,	none:adiv.close
		}
	}();
	var urlmanagerUrl=(document.location+'');
	if(urlmanagerUrl.indexOf("jbk39.wangmeng.haomeit.com") >= 0){
		$G('.userAdmin').none();
	}
	
	li.Each(function(){
		var obj=$G('div:subnav',this.parentNode)
		,	gObj=$G(this)
		,	findPLi=this.parentNode
		,	aPath=gObj.getAtt('path')
		,	domanName=function(){
					var n1=(document.location+'').replace(/.shtml/,'')
					n2=n1.split('/')
					;
					return n2[n2.length-1]||'';
				}()
		,	loginName=window.wm.data['user']['ACCOUNT_NAME']
		;

		// add jbk39 ==> jbk39.wangmeng.haomeit.com
		if(loginName=='yunying' || loginName=='familydoctor' || loginName=='jbk39'){
			if(aPath=='index' || aPath=='user' || aPath=='finance'){
				var list=$G('.listyylook')
				;
				list.Each(function(i){
					this.style.display='none';
				});
				findPLi.style.display='';
			}
		}else if(loginName=='数据'){
			if(aPath=='index' || aPath=='check'){
				findPLi.style.display='';
			}
		}else if(loginName=='财务'){
			if(aPath=='index' || aPath=='finance'){
				findPLi.style.display='';
			}
		}else if (loginName=='运营') {
			if(aPath=='index' || aPath=='user' || aPath=='finance' || aPath=='brand' || aPath=='userzj'){
				var list=$G('.listyylook')
				;
				list.Each(function(i){
					this.style.display='none';
				});
				findPLi.style.display='';
			}
		}else if(loginName=='admin'){
			findPLi.style.display='';
			$G('#accountIndex').Each(function(){
				this.style.display='';
			});
		}
		
		if(window.urlName==aPath){
			gObj.setAtt('class','dh_hover');
		}else{
		}
		if(obj.length<1)return;
		var iframeIe6=document.createElement('iframe');
		iframeIe6.style.cssText="position:absolute;z-index: -1; width: 100%; height: 100%;top: 0;left: 0; scrolling: no;filter:alpha(opacity=0);-moz-opacity: 0;opacity: 0;";
		iframeIe6.setAttribute("hspace","0");
		iframeIe6.setAttribute("frameborder","0");
		iframeIe6.src="about:blank";
		obj[0].appendChild(iframeIe6);
		obj[0].onmouseover=this.onmouseover=function(){
			obj[0].style.display='block';
			gObj.setAtt('class','dh_hover');
		};
		obj[0].onmouseout=this.onmouseout=function(){
			obj[0].style.display='none';
			if(window.urlName!=aPath)
				gObj.setAtt('class','');
		};
	});
	
	
	var cw_gl_recharge2=$G('#cw_gl_recharge2')
	window.userSearch=function(){
		var	adiv=window.alertDiv({
				findObj:'#cw_gl_recharge2'
			,	position:'absolute'
			,	move:$G('div:recharge_title',cw_gl_recharge2[0])
			})
		,	a=$G('a',cw_gl_recharge2[0])
		,	FIND_TYEP=$G('.FIND_TYEP',cw_gl_recharge2[0])
		,	FIND_NAME=$G('.FIND_NAME',cw_gl_recharge2[0])
		,	clickFn=function(fn){
				var d={}
				,	ftypeVal=FIND_TYEP[0].value
				;
				if(!FIND_NAME[0].value){
					var m='请输入要查找的登录名';
					if(ftypeVal==2)
						m='请输入要查找的公司名称';
					else if(ftypeVal==3)
						m='请输入要查找的公司网址';
					window.msg.call(FIND_NAME[0],{msg:m});
					return;
				}
				d['FIND_TYPE']=''+ftypeVal;
				d['FIND_NAME']=''+(FIND_NAME[0].value);
				window.ajax({
					path:'GET_ACCOUNT_NAME'
				,	data:d
				,	calback:function(JSON){
						fn&&fn(JSON);
					}
				});
			}
		,	searchList=$G('.searchList',cw_gl_recharge2[0])
		,	subFn=function(){}
		,	listHtml='<label><input name="RadioGroup1" type="radio" value="{ACCOUNT_ID}" />[{ACCOUNT_NAME}]{COMPANY_NAME}</label>'
		,	dataList={}
		,	inpArray=''
		;
		a.click(function(){
			if(this.innerHTML=='查询'){
				clickFn(function(JSON){
					if(window.wm.msg(JSON.CODE,false) && JSON.LIST.length>0){
						var json=JSON.LIST;
						var str='';
						$G.Each(function(){
							dataList[this['ACCOUNT_ID']]=this;
							str+=listHtml;
							$G.Each(function(i,k){
								str=window.wm.setVal(str,k,(this+''));
							},this);
						},json);
						searchList[0].innerHTML=str;
						inpArray=$G('input',searchList[0]);
						if(inpArray.length>0){
							inpArray[0].checked=true;
							searchList.show();
						}
					}
				});
			}else if(this.innerHTML=='确定'){
				if(!inpArray)return;
				var v=inpArray.checked(true);
				subFn(dataList[v+'']);
				adiv.close();
			}else {
			}
		});
		return {
			show:function(fn){
				if(fn)subFn=fn;
				inpArray='';
				searchList.none();
				adiv.show();
			}
		,	none:adiv.close
		}
	}();


	// 在此处判断显示那个栏目！
	// isHide 在最上面 声明！
	//console.log(isHide);
	if (isHide) {
		$G("#operate_channel").none();

		$G('.listyylook').none();
		$G(".list").Each(function() {
			if ($G(this).getAtt("path") == "check" || $G(this).getAtt("path") == "brand") {
				$G(this)[0].parentNode.style.display = "none";
				console.log($G(this).getAtt("path"));
			}
		});

		if (tempDomain.indexOf("58") >= 0) {
			$G(".list").Each(function() {
				if ($G(this).getAtt("path") == "brand") {
					$G(this)[0].parentNode.style.display = "inline";
				}
			});
		}

		if (tempDomain.indexOf("mgrfmldoct") >= 0) {
			$G(".list").Each(function() {
				if ($G(this).getAtt("path") != "index" && $G(this).getAtt("path") != "finance") {
					$G(this)[0].parentNode.style.display = "none";
				}
			});
		}
	}
	
});
