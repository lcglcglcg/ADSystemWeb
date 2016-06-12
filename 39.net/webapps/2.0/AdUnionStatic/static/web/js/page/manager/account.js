window.headerEnd(function(){
	window.account=function(){
		var findDom=$G('div:main')
		,	userList=$G('#userList')
		,	toolDom=$G('a',$G('div:s_bottom',findDom[0])[0])
		,	account_edit=$G('#account_edit')
		,	getState=function(k){
				var state={
					'1':['已开通','green']
				,	'2':['已冻结','brown']
				};
				return state[k];
			}
		,	lockState=function(id,fn){
				window.ajax({
					load:true
				,	url:window.config.mUrl.account.updateLockState
				,	type:'post'
				,	data:{
						accountIds:id
					,	lockState:0
					}
				,	calback:function(json){
						fn&&fn(json);
					}
				});
			}
		,	dataList={}
		,	account=function(){
				var	adiv=window.alertDiv({
						findObj:'#account_edit'
					,	position:'absolute'
					,	move:$G('div:account_title',account_edit[0])
					})
				,	button=$G('a',account_edit[0])
				;
				button.click(function(a,et){
					var obj=$G(this)
					,	fn=obj.getAtt('onfn')
					;
					if(fn=='token'){
						window.user.setToken();
					}else if(fn=='rest'){
						window.user.reset.call(this);
					}else if(fn=='webim'){
						window.user.webim.call(this);
					}else if(fn=='guahaoToken'){
						window.user.guahaoToken.call(this);
					}else if(fn=='guahaoKey'){
						window.user.guahaoKey.call(this);
					}else if(fn=='save'){
						//window.user.sub();
					}
				});
				return {
					show:function(fn){
						fn&&fn();
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	edit=function(json){
				account.show(function(){
					$G('input',account_edit[0]).Each(function(){
						if(this.name){
							if(this.name=='GUAHAO_TOKEN'){
								var value=json[this.name]||''
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
								$G('#guahaoKey',account_edit[0])[0].value=valueList.guahaoKey;
								this.value=valueList.guahaoToken;
							}else if(this.name=='PLACE_REGION_SUB'){
								$G('.PLACE_REGION_SUB').setChecked(json['PLACE_REGION']);
							}else if (this.name == "JOIN_DSP") {
								var inps = document.getElementById("dspInps").getElementsByTagName("input");

								inps[parseInt(json["JOIN_DSP"])].checked = "checked";
							}else
								this.value=json[this.name];
						}
						
					});
					window.user.ini({type:'edit',fn:function(){
						list.sub();
						account.none();
					}});
					$G('.apiTokenState',account_edit[0]).Each(function(){
						this.checked=(json.apiTokenState==1?true:false);
					});
					$G('.INDUSTRY',account_edit[0]).setselvalue(json.INDUSTRY);
					window.user.region().set(json.PROVINCE_ID,json.CITY_ID);
					window.selDom&&window.selDom.resall();
				});
			}
		,	create=function(){
				account.show(function(){
					window.user.ini({type:'news',fn:function(){
						list.sub();
						account.none();
					}});
					window.user.reset();
				});
			}
		,	state=function(ids,type,fn){
				var data={};
				data['ID_TYPE']=1;
				data['ID']=ids;
				if(type==0){
					data['BATCH_TYPE']=2;
					data['STATUS']='';
				}else{
					data['BATCH_TYPE']=1;
					data['STATUS']=type;
				}
				window.setState(data,function(){
					list.sub();
					fn&&fn();
				});
			}
		,	selectAll=function(){
				var c=this.checked;
				$G('.userCheckbox',userList[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.userCheckbox',userList[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.userCheckboxAll',userList[0])[0].checked=true;
				else $G('.userCheckboxAll',userList[0])[0].checked=false;
			}
		,	findSelId=function(){
				var selObjList=$G('.userCheckbox',userList[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			};
		;
		toolDom.click(function(ag,et){
			var s=findSelId();
			if(et.innerHTML=='新增'){
				create();
			}else if(et.innerHTML=='冻结'){
				if(s.n<1){
					window.altBox.show({
						title:'确认提示信息'
					,	msg:'请在列表中选中账户后再进行冻结操作'
					});
				}else{
					window.gconfirm({
						msg:'冻结账户，将导致账户不能登录！您确定要冻结选中的账号吗？'
					,	title:'确认提示信息'
					,	fn:function(isTrue){
							if(isTrue){
								state(s.vlist.join(','),2);
							}
						}
					});
				}
			}else if(et.innerHTML=='解冻'){
				if(s.n<1){
					window.altBox.show({
						title:'确认提示信息'
					,	msg:'请在列表中选中账户后再进行解冻操作'
					});
				}else{
					window.gconfirm({
						msg:'解冻账户，账户即可进行正常登录投放，您确定要将选中的账号解冻吗？'
					,	title:'确认提示信息'
					,	fn:function(isTrue){
							if(isTrue){
								state(s.vlist.join(','),1);
							}
						}
					});
				}
			}else if(et.innerHTML=='删除'){
				if(s.n<1){
					window.altBox.show({
						title:'确认提示信息'
					,	msg:'请在列表中选中账户后再进行删除操作'
					});
				}else{
					window.gconfirm({
						msg:'有消费、有余额的账户将不会被删除！您确定要删除选中的账号吗？'
					,	title:'确认提示信息'
					,	fn:function(isTrue){
							if(isTrue){
								state(s.vlist.join(','),0);
							}
						}
					});
				}
			}
		});
		
		/***********************获取列表************************************/
		var userListLi=$G('#userListLi')
		,	userListLiMenu=$G('#userListLiMenu')
		,	userListLiFoot=$G('#userListLiFoot')
		,	page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	toolHtml1='<s class="sw34">--</s><a id="w60" name="ini" value="{ACCOUNT_ID}" style="{toolCss}" >安全设置</a><a href="/tologin.shtml?accountId={ACCOUNT_ID}" target="_blank">管理</a>'
		,	toolHtml2='<a name="edit" value="{ACCOUNT_ID}" style="{toolCss};{editDisplay};{toolCssLite};" >修改</a><a id="w60" name="ini" value="{ACCOUNT_ID}" style="{toolCss};{toolCssLite};" >安全设置</a><a href="/tologin.shtml?accountId={ACCOUNT_ID}" target="_blank">管理</a>'
		,	list=window.subAjax('div:conditions',{
					path:'GET_MANAGER_ACCOUNT_LIST'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:userList[0]
				,	ckdata:function(data){
						data['FIND_TYPE']=0;
						if(!$G.isNaN(data['FIND_NAME'])){
							data['FIND_TYPE']+=1;
						}
						if(!$G.isNaN(data['STATUS'])){
							data['FIND_TYPE']+=4;
						}
						var findtimeValue=$G('.findtime',findDom[0]).getAtt('subValue')
						;
						data['TIME_START']='';
						data['TIME_END']='';
						if(!$G.isNaN(findtimeValue)){
							var t=findtimeValue.split('至')
							;
							if(t.length>0){
								data['TIME_START']=t[0];
								data['TIME_END']=t[1];
								data['FIND_TYPE']+=2;
							}
						}
						
						delete data['findtime'];
						if($G.isNaN(this.id))data['FIND_TYPE']='';
						var d=window.wm.setDataListManager(data,findDom[0],pageArray);
						d['ACCOUNT_ID']='';
						return d;
					}
				,	callback:function(JSON){
						var str=''
						,	postdata=this.postdata
						;
						JSON.INFO=JSON.INFO||{
											PAGE_INDEX:1
										,	CAMPAIGN_COUNT:0
										};
						JSON.LIST=JSON.LIST||{};
						if(!window.wm.msg(JSON.CODE,false))
							return;
						var	n=JSON.LIST.length
						,	setVal=function(str,k,v){
								var reg=new RegExp('{'+k+'}','ig')
								;
								return str.replace(reg,v);
							}
						;
						if(n<1){
							userList[0].innerHTML=$G('#userListLiErr').html();
							return false;
						}
						for(var i=0;i<n;i++){
							var	v=JSON.LIST[i]
							,	hStr=userListLi[0].innerHTML
							;
							dataList[v.ACCOUNT_ID]=v;
							if(v.STATUS==2){
								hStr=setVal(hStr,'tools',toolHtml1);
							}else{
								hStr=setVal(hStr,'tools',toolHtml2);
							}
							$G.Each(function(i,val,json){
								var value=this+'';
								if(val=='STATUS'){
									var stateArray=getState(value);
									value=stateArray[0];
									hStr=setVal(hStr,'stateCss',stateArray[1]);
									/*if(json.lockState==1){
										value+='<a name="lockState" value="'+json.accountId+'" style="display:inline-block;padding-left:2px; position:relative;"><img src="/static/ads_m_1.0/web/images/lock.png" width="11" height="15" alt="点击解锁" style=" position:relative; top:2px;"/></a>'
									}*/
								}
								hStr=setVal(hStr,val,value);
							},v);
							if(window.wm.data['user']['ACCOUNT_NAME']=='运营' || isHide){

								if (isHide) {	// 不是自己的运营，全部隐藏。  是自己的运营，留下管理。
									hStr=setVal(hStr,'toolCss','display: none');
								} else {
									hStr=setVal(hStr,'toolCssLite','display: none');
								}

							}
							
							str+=hStr;
						}
						page.setup(JSON.INFO.COUNT,n,pageArray);
						userList[0].innerHTML=userListLiMenu[0].innerHTML+str+userListLiFoot[0].innerHTML;

                        // 判断 如果不是自己域名 test、wm 就隐藏 “操作” 的表头
                        if (isHide) {
                            var liEles = $G("ul", $G("#userList")[0])[0].getElementsByTagName("li");
                            liEles[liEles.length - 1].style.display = "none";
                            console.log($G("ul", $G("#userList")[0])[0]);
                        }

						$G('.lockState').click(function(){
							var Gobj=$G(this)
							,	vAId=Gobj.getAtt('value')
							;
							window.gconfirm({
								msg:'您确定要解锁选定的账户吗？'
							,	title:'确认提示信息'
							,	fn:function(isTrue){
									if(isTrue){
										lockState(vAId,function(){
											Gobj.none();
											window.altBox.show({
												title:'提示信息'
											,	msg:'解锁成功！'
											});
										});
									}
								}
							});
						});
						$G('ul',userList[0]).click(function(a,et){
							var obj=$G(et)
							,	name=obj.getAtt('name')
							,	value=obj.getAtt('value')
							;
							if($G.isNaN(name))return;
							
							if(et.name=='demo'){
								window.userDemo.show(dataList[value].ACCOUNT_ID);
							}else if(et.name=='edit'){
								edit(dataList[value]);
							}else if(et.name=='ini'){
								window.user.safe.show(dataList[value]);
							}
						});
					}
				});
		;
		pageArray['click']=function(pageObj){
			pageArray=pageObj;
			list.sub();
		};
		list.sub();
		return {
			list:function(p){
				pageArray['PAGE_INDEX']=obj.p||pageIni.PAGE_INDEX;
				list.sub();
			}
		,	dataList:dataList
		,	edit:edit
		,	create:create
		,	selectAll:selectAll
		,	selectId:selectId
		};
	}();
	
});