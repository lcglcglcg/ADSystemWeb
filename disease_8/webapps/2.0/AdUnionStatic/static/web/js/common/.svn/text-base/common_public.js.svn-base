(function(){
	window.ideaType=2;
	window.msg=function(o){
		var obj=this
		,	msg=o.msg
		,	l=o.l
		,	i=0
		,	title=o.title
		,	m=$G.tip({
				maxlen:l
			,	minlen:l
			})
		,	click=function(){
				m.close.call(obj);
				$G.RemoveAttachEvent(document, "click",click);
			}
		;
		m.msg({
			obj:obj
		,	title:title
		,	count:msg
		});
		setTimeout(function(){
			click();
		},3*1000);
		//msgClickFn=click;
		$G.AttachEvent(document,"click",function(){
			if(i>0)
				click();
			i++;
		});
	};
	
	window.alertDiv=function(o){
		o=o||{};
		var div=$G(o.findObj)
		,	show=function(fn,none,fnend,isNoneClose){
				fn&&fn();
				div.WinAlt({
					position:o.position||'fixed',
					isCenter:o.isCenter||true,
					lock:o.lock||true,
					lock_back:o.lock_back||'#BBBBBB',
					lock_opa:o.lock_opa||30
				,	callBack:o.callBack
				});
				if(o.move)div.Move({moveobj:o.move});
				if(none)nonefn=function(json){
					none.call(this,json,div);
					if(!isNoneClose)
						div.display().none();
				};
				fnend&&fnend();
			}
		,	nonefn=function(){
				div.display().none();
			}
		;
		$G((o.closeObj||'.close'),div[0]).click(function(){
			nonefn.call(this);
		});
		return {
			obj:div[0]
		,	show:show
		,	none:function(json){
				nonefn(json);
			}
		,	close:function(){
				div.display().none();
			}
		};
	};
	window.gconfirm=function(o){
		o=o||{};
		
		var msgConfirm=$G('#msgConfirm')
		,	fn=o.fn
		,	msgConfirmMsg=$G('#msgConfirmMsg',msgConfirm[0])
		;
		$G('#msgConfirmTitle',msgConfirm[0]).html((o.title||'确认提示信息'));
		$G('.confirmClose',msgConfirm[0]).html((o.NText||'取消'));
		msgConfirmMsg.html(o.msg);
		var textLen=$G.len(o.msg)*($G.lenfont(msgConfirmMsg[0])/2);
		msgConfirm[0].style.width=(textLen+95)+'px';
		msgConfirm.WinAlt({
			position:'fixed',
			isCenter:true,
			lock:true,
			lock_back:'#BBBBBB',
			lock_opa:30
		}).Move({moveobj:$G('div:msg_title',msgConfirm[0])});
		$G('.confirmOK',msgConfirm[0]).Each(function(){
			this.onclick=function(){
				msgConfirm.display().none();
				fn&&fn(true);
			}
		}).html((o.YText||'确定'));
		$G('.close .confirmClose',msgConfirm[0]).Each(function(){
			this.onclick=function(){
				msgConfirm.display().none();
				fn&&fn(false);
			}
		});
	};
	window.returnBox=function(){
		var returnBox=$G('#returnBox')
		,	returnBoxMsg=$G('.returnBoxMsg',returnBox[0])
		;
		return {
			show:function(o){
				o=o||{};
				returnBoxMsg.html(o.msg);
				$G('.returnBoxTitle',returnBox[0]).html(o.title);
				var textLen=$G.len(o.msg)*($G.lenfont(returnBoxMsg[0])/2)
				,	returnOk=$G('.returnOK',returnBox[0])
				;
				returnBox[0].style.width=(textLen+95)+'px';
				returnBox.WinAlt({
					position:'fixed',
					isCenter:true,
					lock:true,
					lock_back:'#BBBBBB',
					lock_opa:30
				}).Move({moveobj:$G('div:msg_title',returnBox[0])});
				returnOk[0].onclick=o.fn||function(){};
			}
		,	close:function(){
				returnBox.display().none();
			}
		};		
	}();
	window.getTimes=function(name,obj){
		obj=obj||window;
		var putTime=$G('.'+name,obj).getAtt('subValue')
		;
		if(!$G.isNaN(putTime)){
			return putTime.split('至');
		}
		return new Array();
	};
	window.altBox=function(){
		var idAlert=$G('#idAlert')
		,	idAlertMsg=$G('#idAlertMsg',idAlert[0])
		,	idAlertTitle=$G('#idAlertTitle',idAlert[0])
		,	idAlertOK=$G('#idAlertOK')
		,	alertObj=window.alertDiv({
				findObj:'#idAlert'
			,	closeObj:'.close_bnt'
			,	lock_back:'#BBBBBB'
			,	move:$G('div:msg_title',idAlert[0])
			})
		;
		return {
			show:function(o){
				o=o||{};
				idAlertTitle[0].innerHTML=o.title||'提示信息';
				idAlertMsg[0].innerHTML=o.msg;
				var textLen=$G.len(o.msg)*($G.lenfont(idAlertMsg[0])/2);
				idAlert[0].style.width=(textLen+95)+'px';
				alertObj.show();
				idAlertOK[0].onclick=o.okfn||function(){
					alertObj.close();
				};
			}
		,	close:alertObj.close
		};
	}();
	
	window.wm={
		url:'/action/'
	,	data:{}
	,	path:{
			login:{
				index:'/login.shtml'
			}
		,	index:{
				index:'/index.shtml'
			}
		,	pic:{
				url:'/getPic'
			}
		,	report:{
				url:'/reportdownload'
			}
		,	up:'/uploadImg'
		,	imagesHttp:'http://images.adx.haomeit.com'
		}
	,	toLogin:function(){
			window.document.location=window.wm.path.login.index;
		}
	,	loading:function(){
			var loadIng=$G('#loading')
			,	loadHtml='<div class="loading"><img src="/static/ads_c_2.0/web/images/index_loading1.gif" width="30" height="30" /><div class="loading_text">{提示信息}</div></div>'
			;
			return {
				show:function(o){
					if($G.isNaN(o.obj)){
						loadIng[0].innerHTML='';
						loadIng.WinAlt({isCenter:true,lock:true,lock_back:'#ffffff',lock_opa:100});
					}else{
						o.obj.innerHTML=loadHtml.replace(/{提示信息}/,(o.loadmsg||'数据加载中,请稍后...'));
					}
				}
			,	none:function(o){
					loadIng && loadIng.display().none();
					if(!$G.isNaN(o.obj)){
						o.obj.innerHTML='';
					}
				}
			};
		}()
	,	setVal:function(str,k,v){
			return str.replace((new RegExp('{'+k+'}','ig')),v);
		}
	,	setDataList:function(data,searchText,title,findDom,page){
			searchText='FIND_NAME';
			if(data[searchText]==title)
				data[searchText]='';
			if(page['CAMPAIGN_ID'])data['CAMPAIGN_ID']=page['CAMPAIGN_ID'];
			if(page['GROUP_ID'])data['GROUP_ID']=page['GROUP_ID'];
			var	findCode='FIND_NAME,FIND_STATUS,CAMPAIGN_ID,GROUP_ID'.split(',')
			,	findType=$G('.FIND_TYPE',findDom).checked(true)
			;
			if(findType.length>0 && $G.isNaN(data[searchText])){
				window.msg.call($G('.'+searchText,findDom)[0],{msg:title});
				return false;
			}else{
				var stepVal=2
				,	FIND_TYPE=1
				;
				$G.Each(function(){
					if(!$G.isNaN(data[this+''])){
						FIND_TYPE=Number(FIND_TYPE||0)+Number(stepVal);
					}
					stepVal=stepVal*2;
				},findCode);
				data['FIND_TYPE']=FIND_TYPE;
			}
			if(findType.length>0)data['FIND_NAME_TYPE']=1;
			else data['FIND_NAME_TYPE']=2;
			$G.Each(function(i,k){
				data[k]=this+'';
			},page);
			
			data['DISPLAY_STATUS']=window.ideaType;
			delete data['click'];
			delete data['orderSetId'];
			delete data['orderSetCssName'];
			return data;
		}
	,	subDataManager:function(data,model,subdata){
			var stepVal=1
			,	updateType=0
			;
			$G.Each(function(i,key){
				if(subdata[key]!==undefined&&data[key]!=subdata[key]){
					updateType=updateType+stepVal;
					//$G.log(stepVal+'|'+updateType+'|'+key+'='+data[key]+':'+subdata[key]);
				}else{
					subdata[key]='';
				}
				if(subdata[key]===undefined){
					subdata[key]=this+'';
				}
				stepVal=stepVal*2;
			},model);
			if(data===model){
				subdata.INSERT_TYPE=updateType;
			}else{
				subdata.UPDATE_TYPE=updateType;
			}
			return subdata;
		}
	,	setDataListManager:function(data,findDom,page){
			if($G.isNaN(data['FIND_TYPE'])){
				data['FIND_TYPE']=100;
			}
			if($G.isNaN(data['FIND_NAME_COL'])){
				data['FIND_NAME_COL']=100;
			}else if($G.isNaN(data['FIND_NAME'])){
				data['FIND_NAME_COL']=100;
				//window.msg.call($G('.FIND_NAME',findDom)[0],{msg:($G('.FIND_TYPE',findDom).getseltext())['FIND_TYPE']+'不能为空'});
				//return false;
			}
			var BALANCE_TYPE=$G('.BALANCE_TYPE',findDom).checked(true);
			;
			if($G.isNaN(BALANCE_TYPE+''))data['BALANCE_TYPE']=1;
			else data['BALANCE_TYPE']=2;
			$G.Each(function(i,k){
				if($G.isNaN(data[k]))
					data[k]=this+'';
			},page);
			delete data['click'];
			return data;
		}
	
	,	msg:function(code,alt){
			var ret=code=='0'?true:false
			,	msgTest=window.code[code]
			;
			try{
				//$G.log(msgTest);
				!ret&&alt&&window.msg.call(this,{msg:msgTest});
				!ret&&alt===false&&window.altBox.show({
					msg:msgTest
				});
			}catch(e){$G.log(code+'|'+e);}
			return ret;
		}
	,	msgFun:function(type,code){
			if(code<2)return;
			if(('|'+type+'|').indexOf('CAMPAIGNBUDGET')>=0)type='CAMPAIGNBUDGET';
			if(('|'+type+'|').indexOf('UNITPRICE')>=0)type='UNITPRICE';
			var msgTest={
					'TEXT':{
						2:'内容不能为空'
					,	3:'内容长度错误'
					,	4:'内容长度错误'
					,	5:'内容格式错误'
					}
				,	'LOGIN':{
						2:'用户名不能为空'
					,	3:'最小4个字符(等同2个汉字)长度，最大16个字符(等同8个汉字)长度'
					,	4:'最小4个字符(等同2个汉字)长度，最大16个字符(等同8个汉字)长度'
					,	5:'请勿使用除字母(大小写等价)、数字、下划线、中文外的其他字符'
					}
				,	'PASSWORD':{
						2:'密码不能为空'
					,	3:'最小6个字符长度，最大16个字符长度'
					,	4:'最小6个字符长度，最大16个字符长度'
					,	5:'请勿使用除字母、数字、下划线、英文句号外的其他字符'
					,	6:'确认密码与密码不一致，请重新输入'
					}
				,	'ADDRESS':{
						2:'通信地址不能为空'
					,	3:'通信地址只能输入最小20个字符(等同10个汉字)长度，最大100个字符(等同50个汉字)长度。'
					,	4:'通信地址只能输入最小20个字符(等同10个汉字)长度，最大100个字符(等同50个汉字)长度。'
					,	5:'通信地址只能由字母、数字、减号、#、中文组成。'
					}
				,	'COMPANYNAME':{
						2:'公司名称不能为空'
					,	3:'最小6个字符(等同3个汉字)长度，最大100个字符(等同50个汉字)长度'
					,	4:'最小6个字符(等同3个汉字)长度，最大100个字符(等同50个汉字)长度'
					,	5:'公司名称不能为空、请勿使用除字母、数字、减号、#、中文外的其他字符'
					}
				,	'ZIPCODE':{
						2:'邮编不能为空'
					,	3:'请输入国内6位数字邮编'
					,	4:'请输入国内6位数字邮编'
					,	5:'请正确输入6位数字的邮编'
					}
				,	'TEL':{
						2:'固定电话不能为空'
					,	3:''
					,	4:''
					,	5:'请正确输入固定电话，例如：010-12345678，010-12345678转99'
					}
				,	'FAX':{
						2:'传真不能为空'
					,	3:''
					,	4:''
					,	5:'请正确输入传真号，例如：010-12345678，010-12345678转99'
					}
				,	'MOBILE':{
						2:'移动电话不能为空'
					,	3:'最小6个字符长度，最大100个字符长度'
					,	4:'最小6个字符长度，最大100个字符长度'
					,	5:'请输入正确的移动电话'
					}
				,	'CONTACT':{
						2:'联系人不能为空'
					,	3:'最小4个字符(等同2个汉字)长度，最大16个字符(等同8个汉字)长度'
					,	4:'最小4个字符(等同2个汉字)长度，最大16个字符(等同8个汉字)长度'
					,	5:'请勿使用除字母、中文外的其他字符'
					}
				,	'EMAIL':{
						2:'电子邮件不能为空'
					,	3:'最小6个字符(等同3个汉字)长度，最大100个字符(等同50个汉字)长度'
					,	4:'最小6个字符(等同3个汉字)长度，最大100个字符(等同50个汉字)长度'
					,	5:'请使用正确的邮箱地址'
					}
				,	'WEBIM':{
						2:'WEBIM地址不能为空'
					,	3:'输入长度需大于等于20个字符且不超过1024个字符长度。'
					,	4:'输入长度需大于等于20个字符且不超过1024个字符长度。'
					,	5:'WEBIM请输入以http开头的有效url地址'
					}
				,	'URL':{
						2:'URL地址不能为空'
					,	3:'输入长度需大于等于20个字符且不超过1024个字符长度。'
					,	4:'输入长度需大于等于20个字符且不超过1024个字符长度。'
					,	5:'URL请输入以http开头的有效url地址'
					}
				,	'PLANNAME':{
						2:'请输入推广计划名称'
					,	3:'计划名称最小1个字符长度，最大30个字符长度'
					,	4:'计划名称最小1个字符长度，最大30个字符长度'
					,	5:'推广计划名称支持的字符为：字母、数字、汉字、中划线和下划线'
					}
				,	'UNITNAME':{
						2:'请输入推广组名称'
					,	3:'推广组名称最小1个字符长度，最大30个字符长度'
					,	4:'推广组名称最小1个字符长度，最大30个字符长度'
					,	5:'推广组名称支持的字符为：字母、数字、汉字、中划线和下划线'
					}
				,	'PICNAME':{
						2:'请输入图片广告名称'
					,	3:'图片创意标题不能为空,并大于等于1个字符，小于等于40个字符'
					,	4:'图片创意标题不能为空,并大于等于1个字符，小于等于40个字符'
					,	5:'图片创意标题不能为空,并大于等于1个字符，小于等于40个字符'
					}
				,	'DOMANDESTINATIONURL':{
						2:'请输入访问URL地址'
					,	3:'最多1017个字节'
					,	4:'最多1017个字节'
					,	5:'您的输入不能包含以下非法字符：“<”、“>”'
					}
				,	'DISPLAYURL':{
						2:'请输入显示URL地址'
					,	3:'不得超过35个字节'
					,	4:'不得超过35个字节'
					,	5:'您的输入不能包含以下非法字符：“<”，“>”，“{”，“}”，“,”，“"”，“\'”'
					}
				,	'CAMPAIGNBUDGET':{
						2:'请输入每日预算'
					,	3:'每日预算应该是￥50到￥100000之间的整数'
					,	4:'每日预算应该是￥50到￥100000之间的整数'
					,	5:'每日预算必须是整数'
					}
				,	'UNITPRICE':{
						2:'请输入组出价'
					,	3:'出价应该大于等于￥0.05'
					,	4:'出价应该小于等于￥999.99'
					,	5:'出价应该大于等于￥0.05小于等于￥999.99之间的数字'
					}
				,	'APPENDNAME':{
						2:'请输入子链名称'
					,	3:'最多可输入16个字符'
					,	4:'最多可输入16个字符'
					,	5:'输入的内容错误'
					}
				,	'APPENDURL':{
						2:'请输入子链URL'
					,	3:'不得超过1024个字节'
					,	4:'不得超过1024个字节'
					,	5:'只允许输入GBK字符，不允许输入的字符有：“<”，“>”'
					}
				}
			,	msg=msgTest[type][code]
			;
			//$G.log('验证信息:'+msg+'|'+code+'='+type+'|V:'+this.value+'|name:'+this.name);
			if($G.isNaN(msg))return;
			window.msg.call(this,{msg:msg});
		}
	,	dataIni:function(d,type){
			d["PACKET_TYPE"]=type;
			return {
				"server":'{'+$G.tojson(d)+'}'
			};
		}
	,	postDataIni:function(d,type){
			d["PACKET_TYPE"]=type;
			delete d['path'];
			return {
				"server":'{'+$G.formatparam({
										param		:	d
									,	separate	:	","
									,	traditional	:	''
									,	Handle		:	function(key,value){
											return '"'+key+'":"'+(value+'').replace(/\\/ig,'').replace(/"/ig,'\\"')+'"';
										}
								})+'}'
			};
		}
	,	ckCode:function(){
			return window.wm.url+'?'+$G.param(window.wm.dataIni({},'GET_CAPTCHA'))+'&notcache='+new Date().getTime();
		}
	,	ckType:function(){
			return {
				planName:function(v){
					return /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(v);
				}
			,	unitName:function(v){
					return /^[A-Za-z0-9_\-\u4e00-\u9fa5]+$/.test(v);
				}
			,	COMPANY_NAME:function(v){
					return /^[(\u4e00-\u9fa5_a-zA-Z0-9,.#)]+$/.test(v);
				}
			,	CONTACT:function(v){
					return /^[\u4e00-\u9fa5a-zA-Z]+$/.test(v);
				}
			,	WEBIM:function(v){
					return !$G.isHttpUrl(v);
				}
			,	FAX:$G.isZipcode
			,	domanDestinationUrl:function(v){
					return !(/(<|>)/.test(v));
				}
			,	displayUrl:function(v){
					return !(/(<|>|{|}|,|\"|\')/).test(v);
				}
			,	campaignBudget:function(v){
					var	maxlength=this.getAttribute('maxlength')//数据约数最大长度
					,	minlength=this.getAttribute('minlength')//数据约数最小长度
					;
					if(!$G.isNaN(minlength) && parseFloat(v)<parseFloat(minlength)){
						return true;
					}else if(!$G.isNaN(maxlength) && parseFloat(v)>parseFloat(maxlength)){
						return true;
					}
					return !window.wm.ckType.decimal(v);
				}
			,	decimal:function(str){
					if((str+'').indexOf('.')>=0){
						if(/^\d+.\d{1,2}$/.test(str))
							return false;
						else return true;
					}
					return false;
				}
			,	len:function(s,minL,maxL){
					var l=$G.len(s);
					if(l<minL || l>maxL)
						return true;
					return false;
				}
			}
			;
		}()
	,	cookie:$G.jscookie({day:1})
	};
	
	window.ajax=function(o){
		o=o||{};
		o.data=o.data||{};
		$G.ajax({
			type:o.type||'get',
			url:window.wm.url,
			data:window.wm.postDataIni(o.data,o.path),
			dataType:o.dataType||'json',
			beforeSend:function(){
				window.wm.loading.show(o);
			},
			error:function (XMLHttpRequest, textStatus, errorThrown) {
				window.wm.loading.none(o);
			},
			success:function(JSON){
				window.wm.loading.none(o);
				JSON = JSON||{};
				if(JSON.CODE=='1001' && !o.notCheck){
					window.returnBox.show({
						title:'提示信息'
					,	msg:window.code[JSON.CODE]
					,	fn:function(){
							window.wm.toLogin();
						}
					});
				}else
					o.calback&&o.calback(JSON);
			}
		});
	};
	window.subAjax=function(obj,o){
		o=o||{};
		o.adddata=o.adddata||{};
		return new $G(obj).cksub({
				sub:o.sub
			,	ck:window.wm.ckType
			,	findDom:o.findDom
			,	msgFun:window.wm.msgFun
			,	url:window.wm.url
			,	dataType:o.dataType||'json'
			,	adddata:o.adddata
			,	ckdata:function(data,subMit){
					var d=data
					,	path=o.path||''
					;
					if(o.ckdata){
						if(this.name||this.id){
							//window.pageIni();
						}
						d=o.ckdata.call(this,data,function(psd){
							if(!$G.isNaN(psd['path']))path=psd['path'];
							subMit(window.wm.postDataIni(psd,path));
						})||false;
					}
					if(d===false)return false;
					if(!$G.isNaN(d['path']))path=d['path'];
					return window.wm.postDataIni(d,path);
				}
			,	beforeSend:function(){
					window.wm.loading.show(o);
				}
			,	error:function (XMLHttpRequest, textStatus, errorThrown) {
					window.wm.loading.none(o);
				}
			,	callback:function(JSON){
					window.wm.loading.none(o);
					JSON = JSON||{};
					this.postdata=$G.Stringtojson(this.postdata['server']);
					if(JSON.CODE=='1001'){
						window.returnBox.show({
							title:'提示信息'
						,	msg:window.code[JSON.CODE]
						,	fn:function(){
								window.wm.toLogin();
							}
						});
					}else
						o.callback&&o.callback.call(this,JSON);
				}
			});
	};
	
	
	window.isLoad=false;
	window.isLogin=false;
	window.isHead=false;
	window.headerEnd=function(fn){
		(function () {
				try {
					if(window.isHead && window.isLoad && window.isLogin)
						fn&&fn();
					else setTimeout(arguments.callee, 0);
				}catch (err) {}    
			})();
	};
	window.cklogin=function(fn,isAlt){
		if(isAlt){
			window.isLogin=true;
			var JSON={};
			JSON['CODE']='1000';
			if(fn)fn(JSON);
		}else{
			window.ajax({
				path:'USER_LOGIN_CHECK'
			,	notCheck:true
			,	calback:function(JSON){
					window.isLogin=true;
					JSON = JSON||{};
					if(isAlt){
						if(JSON.CODE!='1000'){
							window.returnBox.show({
								title:'提示信息'
							,	msg:window.code[JSON.CODE]
							,	fn:function(){
									window.wm.toLogin();
								}
							});
							return;
						}
					}
					if(fn)fn(JSON);
				}
			});
		}
	};
	window.loginCheck=function(){
		window.cklogin(function(){
			window.ajax({
					path:'GET_TITLE_INFO'
				,	calback:function(JSON){
						window.isHead=true;
						var value=JSON.GUAHAO_TOKEN||''
						,	valueList=function(){
								var valueKey=''
								;
								if(value){
									var list=value.split('||')
									;
									if(list.length>1){
										value=list[0];
										valueKey=list[1];
									}
								}
								return {
									guahaoToken:value
								,	guahaoKey:valueKey
								};
							}()
						;
						JSON.guahaoToken=valueList.guahaoToken;
						JSON.guahaoKey=valueList.guahaoKey;
						window.wm.data['user']=JSON;
						$G('.COMPANY_NAME .USER_LOGIN_NAME',$G('#main')[0]).Each(function(){
							this.innerHTML=JSON[$G(this).getAtt('name')];
						});
					}
				});
			}
		,	true
		);
	};
	
	window.page=function(){
		var getPage=function(pageArray){
				pageArray=pageArray||{};
				pageArray['PAGE_INDEX']=1;
				pageArray['PAGE_COUNT']=20;
				pageArray['SORT_TYPE']=1;
				pageArray['SORT_COLUMN']=1;
				return pageArray;
			}
		,	setup=function(count,n,pageObj,findObj){
				var pageConfig=getPage()
				,	page=Number(pageObj.PAGE_INDEX||pageConfig.PAGE_INDEX)
				,	findObj=findObj||$G('.pagelist')[0]
				,	pagelist=$G('.pagelist',findObj)
				,	pageEach=$G('.pageEach',findObj)
				,	pageGo=$G('.pageGo',findObj)
				,	pagesize=pageObj.PAGE_COUNT||pageConfig.PAGE_COUNT
				,	pagecount=count%pagesize==0?count/pagesize:parseInt((Number(count)+Number((pagesize-Number(count%pagesize))))/pagesize)
				,	uuid=$G.uuidFast().replace(/-/ig,'')
				;
				if($G.isNaN(findObj))return;
				if(pagelist.length<1)pagelist=findObj;
				if(pagecount>1)pagelist.style.display='';
				else pagelist.style.display='none';
				var html='<li class="li_mar10 page_lf">显示<span class="red">'+(pagesize*page-pagesize+1)+'-'+(pagesize*page-pagesize+n)+'</span>条 共'+count+'条 '+page+'/'+pagecount+'页</li><li class="page_lf">';
				html+='<a name="home'+uuid+'">首页</a> ';
				html+='<a name="on'+uuid+'">上一页</a> ';
				html+='<a name="next'+uuid+'">下一页</a> ';
				html+='<a name="end'+uuid+'">末页</a></li>';
				var listCountFn=function(obj){
						pageObj.PAGE_INDEX=1;
						pageObj.PAGE_COUNT=obj.value;
						pageObj.click(pageObj);
					}
				,	listCountName='window.pageListCount'+uuid
				;
				eval(listCountName+'='+listCountFn);
				$G('select',findObj).setAtt('onchange',listCountName+'(this);');
				pageEach.html(html);
				$G('a',pageEach[0]).click(function(){
					var obj=$G(this)
					,	name=obj.getAtt('name')
					,	p=1
					;
					if(name=='on'+uuid){
						p=(page>1?(page-1):1);
					}else if(name=='next'+uuid){
						p=(page<pagecount?(page+1):pagecount);
					}else if(name=='end'+uuid){
						p=pagecount;
					}
					pageObj.PAGE_INDEX=p;
					pageObj.click(pageObj);
				});
				var pgInput=$G('input',findObj);
				pgInput.Each(function(){
					this.onchange=function(){
						var p=this.value;
						pageGo[0].onclick=function(){};
						if($G.isNumber(p)){
							if(p<=pagecount){
								pageGo[0].onclick=function(){
									pageObj.PAGE_INDEX=p;
									pageObj.click(pageObj);
								};
							}else{
								window.altBox.show({
									msg:'页数错误，请输入小于'+(pagecount+1)+'的页码'
								});
							}
						}else{
							window.altBox.show({
								msg:'页数错误，请输入正确的页码'
							});
						}
					};
					$G('li',this.parentNode).Each(function(){
						this.onclick=function(){
							pageObj.PAGE_COUNT=($G('select',findObj).getselvalue())[0];
							pageObj.PAGE_INDEX=1;
							pageObj.click(pageObj);
						};
					});
				});
			}
		;
		return {
			getPage:getPage
		,	setup:setup
		};
	};
	window.getGuaHao=function(fn){
		var token=window.wm.data['user']['guahaoToken'];
		if($G.isNaN(token)){
			fn&&fn();
			return;
		}
		var jsCookie=window.wm.cookie.get('GUAHAO'+token)
		,	cookieGH="hospitalId hospType2 starScore"
		;
		if(!$G.isNaN(jsCookie)){
			window.wm.data['user']['guahao']={};
			$G.Each(function(){
				window.wm.data['user']['guahao'][this+""]=window.wm.cookie.get(this+token);
			},cookieGH.split(" "));
			fn&&fn(window.wm.data['user']['guahao']);
			return;
		}
		if($G.isNaN(window.wm.data['user'])){
			console.log('未经网络正确受权');
			return;
		}
		window.getGHJson=function(o){
			if(!o){
				fn&&fn();
				return;
			}
			var json=o||{data:[]};
			var token=window.wm.data['user']['guahaoToken'];
			if(json.data.length>0){
				window.wm.cookie.set('GUAHAO'+token,'true');
				if(json.data[0].hospitalId=='0ff26372-929b-4041-b7b7-145d317aee07'){
					json.data[0].hospType2='三级专科医院管理';
				}else if((','+json.data[0].hospType1+',').indexOf(",私立医院,")>=0){
					json.data[0].hospType2='对外专科';
				}
				$G.Each(function(){
					window.wm.cookie.set(this+token,json.data[0][this+""]);
				},cookieGH.split(" "));
				
				window.wm.data['user']['guahao']=json.data[0];
			}
			fn&&fn(window.wm.data['user']['guahao']);
		};
		$G.getjs({
			url:"http://www.guahao.com/hospital/jsonp/hospitalsdata?hospitalIds="+token+"&callbackFn=window.getGHJson",
			callback:function(){},
			charset:'utf-8',
			cache:false
		});
	};	
	/**
	* 图表FLASH输出
	*
	*/
	window.getFlash=function(o){
		var html=$G.mkflash(function(o){
			o=o||{};
			o.w=o.w||'100%';
			o.h=o.h||'350';
			o.param='<param name="scaleMode" value="noScale"><param name="scale" value="noScale"><param name="wMode" value="opaque"><param name="quality" value="best">';
			o.data=o.data||{
				lang				:'EN'
			,	debugMode			:'0'
			,	scaleMode			:'noScale'
			,	animation			:'undefined'
			,	DOMId				:o.DOMId||'ChartId'
			,	registerWithJS		:'1'
			,	chartWidth			:o.w
			,	chartHeight			:o.h
			,	InvalidXMLText		:o.InvalidXMLText||'Invalid data.;'
			,	dataXML				:o.xmlText
			,	stallLoad			:'true'
			,	dataXML				:'undefined'
			,	dataURL				:o.dataURL||'/static/web/xml/MSLine1_day.xml'
			};
			o.src=o.src||'/static/web/flash/MSLine.swf';
			return o.fn(o);
		});
		this.innerHTML=html;
		return html;
	};
	window.mkCharts=function(o,type){
		o=o||{};
		var chartObj = new FusionCharts( '/static/web/flash/'+o.swf ,"ChartIda", o.w, o.h, o.n1, o.n2)
		;
		if(type)
			chartObj.setJSONData(o.dataset);
		else
			chartObj.setDataXML(o.dataset);
		chartObj.render(o.id);
	};
	window.region=function(o){
		o=o||{};
		var	parentList={}
		,	regionList={}
		,	divTemp=$G.ie6DivForIframe()
		,	szqydisplay=o.obj
		,	regionDataIni=function(JSON){
				var accountParent=$G(o.provinceId||'.provinceId',o.obj)
				,	accountRegion=$G(o.cityId||'.cityId',o.obj)
				;
				$G.Each(function(i,k){
					var t=this+''
					,	division=5
					,	d=function(){
							var code=t+''
							,	rD={
									parentId:''
								,	regionId:''
								,	nameCN:k
								}
							;
							rD.parentId=code.substring(0,division)+'00000';
							if(code.substring(division)=='00000')rD.parentId='0000000000';
							rD.regionId=code;
							return rD;
						}()
					;
					if(!$G.isArray(parentList[d.parentId]))parentList[d.parentId]=new Array();
					parentList[d.parentId].push(d);
					regionList[d.regionId]=d;
				},JSON);
				
				var parentIds=parentList['0000000000']
				,	l=parentIds.length
				,	regionFn=function(rfn){
						var regionIds=parentList[this.value]||''
						,	s=regionIds?regionIds.length:0
						;
						accountRegion.delallsel();
						for(var t=0;t<s;t++){
							var tmpJson=regionIds[t];
							accountRegion.addsel(tmpJson.nameCN,tmpJson.regionId);
						}
						rfn&&rfn();
						window.selDom&&window.selDom.resall();
					}
				;
				accountParent.delallsel();
				for(var k=0;k<l;k++){
					var tmpJson=parentIds[k];
					accountParent.addsel(tmpJson.nameCN,tmpJson.regionId);
				}
				accountParent[0].onchange=regionFn;
				window.selDom&&window.selDom.resall();
				divTemp.style.display='none';
				return {
					set:function(pcode,rcode){
						try{
							divTemp.style.display='';
							if($G.isNaN(pcode))return;
							if(pcode<1000000000)pcode=1000100000;
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
	})();
$G(function(){
	window.loginCheck();
	window.selDom=$G.select({
		optwidth:'auto'
	,	width:'list'
	});
	$G.tip({minlen:160}).open();
	var page=$G('.pagelist')
	,	selectPage=$G('select',page[0])
	;
	selectPage.setselvalue('20');
	window.selDom&&window.selDom.resall();
	window.isLoad=true;
});