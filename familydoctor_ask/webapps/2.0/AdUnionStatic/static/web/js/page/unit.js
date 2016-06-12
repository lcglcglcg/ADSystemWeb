(function(){
	window.units=function(){
		var c_foot=$G('div:c_foot')
		,	listUnitEach=$G('#listUnitEach')
		,	findDom=$G('#contb2')
		,	unitListData={}
		,	isDisplay=function(){
				return findDom[0].style.display=='none';
			}
		,	state={
				'1':['有效','green']
			,	'2':['计划处于暂停时段','orange']
			,	'3':['计划每日预算不足','orange']
			,	'4':['计划未开始','orange']
			,	'5':['计划已暂停','orange']
			,	'6':['计划已下线','red']
			,	'7':['出价过低','red']
			,	'8':['暂停','orange']
			}
		,	model=function(d,isTrue){
				var m={
						path:'SET_GROUP'
					,	GROUP_ID:''									//组ID
					,	CAMPAIGN_ID:''								//计划ID
					,	CAMPAIGN_NAME:''							//计划名称
					,	GROUP_NAME:''								//组名称
					,	GROUP_STATUS:''								//1有效 2处于暂停时段 3每日预算不足 4未开始 5计划暂停 6已下线 7出价过低 8组暂停
					,	GROUP_CPC_PRICE:''							//CPC出价
					,	GROUP_CPM_PRICE:''							//CPM出价
					,	GROUP_TARGETING_TYPE:''						//1浏览定向 2搜索定向
					,	GROUP_DISEASE:''							//TARGETING_TYPE = 1 生效 科室病种CODE
					,	GROUP_KEYWORD:''							//TARGETING_TYPE = 2 生效 关键词
					,	DISPLAY_STATUS:window.ideaType
					,	ACCOUNT_ID:window.wm.data['user']['ACCOUNT_ID']  
					}
				,	updateCode='GROUP_STATUS,GROUP_CPC_PRICE,GROUP_TARGETING_TYPE,GROUP_NAME,GROUP_CPM_PRICE'.split(',')
				;
				
				if($G.isNaN(d['GROUP_ID'])){
					m['path']='ADD_GROUP';
					delete m['GROUP_STATUS'];
					delete m['GROUP_ID'];
					delete d['GROUP_ID'];
					delete m['UPDATE_TYPE'];
					var untiPriceType=0;
					if(d['GROUP_CPM_PRICE']) untiPriceType=untiPriceType+1;
					if(d['GROUP_CPC_PRICE']) untiPriceType=untiPriceType+2;
					d['GROUP_PRICE_TYPE']=untiPriceType;
				}else if(isTrue){
					var json=unitListData[d['GROUP_ID']]
					;
					if(d['GROUP_CPC_PRICE']<=0){
						d['GROUP_CPC_PRICE']='null';
					}
					if(d['GROUP_CPM_PRICE']<=0){
						d['GROUP_CPM_PRICE']='null';
					}
					$G.Each(function(){
						var key=this+'';
						if(key!='GROUP_TARGETING_TYPE' && key!='CAMPAIGN_ID' && d[key]==json[key]){
							delete d[key];
						}
					},updateCode);
					m['path']='SET_GROUP';
					var stepVal=1
					,	updateType=''
					;
					$G.Each(function(){
						if(d[this+'']){
							updateType=Number(updateType||0)+Number(stepVal);
						}
						stepVal=stepVal*2;
					},updateCode);
					m.UPDATE_TYPE=updateType;
				}
				
				$G.Each(function(i,k){
					m[k]=this+'';
				},d);
				return m;
			}
			//获取单条单元数据
		,	getUnitById=function(id,fn){
				window.ajax({
					path:'GET_GROUP_UNIQUE'
				,	type:'post'
				,	data:{GROUP_ID:id}
				,	calback:function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							fn&&fn(JSON);
						}
					}
				});
			}
			//创建/修改 计划
		,	unitAction=function(){
				//提交验证
				var units=$G('#step_second')
				,	unitNameCk=$G('.unitNameCk')
				,	subFunction=function(){}
				,	planId=''
				,	groupTargetingType=$G('.GROUP_TARGETING_TYPE')
				,	GROUP_TARGETING_TYPE_List=$G('.GROUP_TARGETING_TYPE_List')
				,	targetingTypeClick=function(){
						var v=this.value
						;
						groupTargetingType.Each(function(i){
							var n=i+1
							,	obj=$G('#'+this.name+''+n)
							;
							if(v==n)obj.show();
							else obj.none();
						});
					}
				,	subUnit=window.subAjax('#step_second',{
							ckdata:function(data,subMit){
								var GROUP_TARGETING_TYPE=data['GROUP_TARGETING_TYPE']
								,	unitType=$G('.GROUP_TARGETING_TYPE')
								;
								if(GROUP_TARGETING_TYPE==1){
									categoryIds=window.disease.getid();
									if($G.isNaN(categoryIds)){
										window.msg.call(unitType[0],{msg:'请至少选择一个科室或病种'});
										return;
									}
									data['GROUP_DISEASE']=categoryIds;
								}else if(GROUP_TARGETING_TYPE==2 && $G('#GROUP_TARGETING_TYPE2')[0].style.display!='none'){
									var keywords=window.keyword.get();
									if($G.isNaN(keywords)){
										window.msg.call(unitType[1],{msg:'您未添加任何关键词，推广组将无法投放，请添加关键词。'});
										return;
									}
									data['GROUP_KEYWORD']=keywords;
								}
								if(window.ideaType==1){
									if($G.isNaN(data['GROUP_CPC_PRICE']) && $G.isNaN(data['GROUP_CPM_PRICE'])){
										window.msg.call($G('.GROUP_CPC_PRICE',units[0])[0],{msg:'至少选择一种类型的组出价'});
										return false;
									}
									if(!$G.isNaN(data['GROUP_CPC_PRICE'])&&data['GROUP_CPC_PRICE']<=0.5){
										window.gconfirm({
											msg:'推广组CPC出价过低，可能会导致该推广组下广告无展现机会，请确认是否继续？'
										,	fn:function(isTrue){
												if(isTrue){
													subMit(model(data,true));
												}
											}
										});
										return false;
									}
									if(!$G.isNaN(data['GROUP_CPM_PRICE'])&&data['GROUP_CPM_PRICE']<10){
										window.gconfirm({
											msg:'推广组CPM出价过低，可能会导致该推广组下广告无展现机会，请确认是否继续？'
										,	fn:function(isTrue){
												if(isTrue){
													subMit(model(data,true));
												}
											}
										});
										return false;
									}
								}else{
									if($G.isNaN(data['GROUP_CPC_PRICE'])){
										window.msg.call($G('.GROUP_CPC_PRICE',units[0])[0],{msg:'请输入组出价'});
										return false;
									}else if(data['GROUP_CPC_PRICE']<=0.5){
										window.gconfirm({
											msg:'推广组出价过低，可能会导致该推广组下广告无展现机会，请确认是否继续？'
										,	fn:function(isTrue){
												if(isTrue){
													subMit(model(data,true));
												}
											}
										});
										return false;
									}
								}
								
								delete data['GROUP_PRICE'];
								data['CAMPAIGN_ID']=planId;
								return model(data,true);
							}
						,	sub:'.subUnitSave'
						,	callback:function(JSON){
								if(window.wm.msg(JSON.CODE,false)){
									subFunction(JSON,this.postdata);
									unitAlt.close();
									window.leftTree.show();
									pageArray.planId=this.postdata.CAMPAIGN_ID;
									subList(pageArray);
								}
							}
					})
					//创建/修改 计划 层
				,	unitAlt=window.alertDiv({
						findObj:'#step_second'
					,	closeObj:'.close_bnt'
					,	position:'absolute'
					,	move:$G('div:scommon_title',units[0])
					})
				,	domShow=function(type,JSON){
						GROUP_TARGETING_TYPE_List.none();
						groupTargetingType.show();
						var test={
								'edit':{
									'subUnitSave':'<span>保存</span>'
								,	'altUnitTitle':'修改推广组'
								}
							,	'add':{
									'subUnitSave':'<span>保存并继续</span>'
								,	'altUnitTitle':'新建推广组'
								}
							}
						,	html=test[type]
						,	none=type=='add'?'':'none'
						;
						unitNameCk.none();
						groupTargetingType[0].checked=true;
						targetingTypeClick.call(groupTargetingType[0]);
						$G('.subUnitSave .altUnitTitle .altUnitDaoHang',units[0]).Each(function(){
							var gObj=$G(this)
							,	name=gObj.getAtt('name')
							;
							gObj.html(html[name]);
							if(name=='altUnitDaoHang'){
								gObj[0].style.display=none;
							}
						});
						if(JSON['GROUP_CPC_PRICE']=='0.00')JSON['GROUP_CPC_PRICE']='';
						if(JSON['GROUP_CPM_PRICE']=='0.00')JSON['GROUP_CPM_PRICE']='';
						$G('.CAMPAIGN_ID .GROUP_ID .GROUP_NAME .GROUP_CPC_PRICE .GROUP_CPM_PRICE',units[0]).Each(function(){
							var gObj=$G(this)
							,	name=gObj.getAtt('name')
							;
							if(name=='GROUP_NAME'){
								gObj.setAtt('planId',(JSON['CAMPAIGN_ID']||''));
								gObj.setAtt('unitId',(JSON['GROUP_ID']||'0'));
							}
							
							this.value=JSON[name]||'';
						});
						if($G.isNaN(JSON.GROUP_TARGETING_TYPE)){
							groupTargetingType.Each(function(){
								this.style.display='';
								this.parentNode.style.display='';
							});
							window.disease.setid();
							groupTargetingType.Each(function(){
								this.onclick=targetingTypeClick;
							});
						}else{
							groupTargetingType.Each(function(){
								this.onclick=function(){};
							});
							groupTargetingType.Each(function(){
								this.style.display='none';
								this.parentNode.style.display='none';
							});
							groupTargetingType.Each(function(i){
								var gObj=$G(this)
								,	val=gObj.getAtt('value')
								;
								if(JSON.GROUP_TARGETING_TYPE==val){
									this.checked=true;
									if(val==1){
										groupTargetingType[1].style.display='';
										groupTargetingType[0].parentNode.style.display='';
										window.disease.setid(JSON.GROUP_DISEASE);
										targetingTypeClick.call(groupTargetingType[0]);
									}else{
										if(type=='edit'){
											GROUP_TARGETING_TYPE_List.none();
											groupTargetingType[0].style.display='';
											groupTargetingType[1].parentNode.style.display='';
										}else{
											window.ajax({
												path:'GET_GROUP_KEYWORD'
											,	type:"get"
											,	data:{
													GROUP_ID:JSON.GROUP_ID
												}
											,	calback:function(JsonKey){
													if(window.wm.msg(JsonKey.CODE,false)){
														window.keyword.set(JsonKey.KEYWORDS);
													}
													targetingTypeClick.call(groupTargetingType[1]);
												}
											});
										}
									}
								}
								
							});
						}
					}	
				;
				
				return {
					show:function(json,fn,editfn){
						$G('.diseaseLeveDisp').none();
						var closeMsg='您确定要中止修改推广组操作吗？'
						;
						json=json||{};
						json=model(json);
						window.keyword.reset();
						if(json && $G.isNaN(json.GROUP_ID)){
							closeMsg='您确定要中止新建推广组操作吗？';
							$G('.newMap',units[0]).none();
							domShow('add',json);
						}else{
							domShow('edit',json);
						}
						if(fn)subFunction=fn;
						planId=json.CAMPAIGN_ID;
						editfn&&editfn(units[0]);
						unitAlt.show(
						''
						,	function(){
								window.gconfirm({
									msg:closeMsg
								,	fn:function(isTrue){
										if(isTrue){
											unitAlt.close();
										}
									}
								});
							}
						,	''
						,	true
						);
					}
				,	close:unitAlt.close
				};
				
			}()
		/**********************修改组名称**********************************/
		,	nameEdit=function(){
				//弹出层
				var unitNameEdit=$G('#unitNameEdit')
				,	GROUP_NAME=$G('.GROUP_NAME',unitNameEdit[0])
				,	groupId=''
				,	planId=''
				,	unitNameCk=$G('.unitNameCk',unitNameEdit[0])
				,	unitNameEditAlt=window.alertDiv({
							findObj:'#unitNameEdit'
						,	closeObj:'.close'
						,	lock_back:'#BBBBBB'
					})
				;
				//数据提交
				window.subAjax('#unitNameEdit',{
					sub:'.sub'
				,	findDom:unitNameEdit[0]
				,	ckdata:function(data){
						data['CAMPAIGN_ID']=planId;
						data['GROUP_ID']=groupId;
						return model(data,true);
					}
				,	callback:function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							unitNameEditAlt.close();
							list.sub();
							window.leftTree.show();
						}
					}
				});
				return {
					show:function(json){
						unitNameCk.none();
						groupId=json.GROUP_ID;
						planId=json.CAMPAIGN_ID;
						GROUP_NAME[0].value=json.GROUP_NAME;
						GROUP_NAME.setAtt('planId',json.CAMPAIGN_ID);
						GROUP_NAME.setAtt('unitId',groupId);
						unitNameEditAlt.show();
					}
				,	close:unitNameEditAlt.close
				};
			}()
		/***********************修改组出价************************************/
		,	priceEdit=function(){
				var unitCpcEditfn=window.alertDiv({
						findObj:'#unitCpcEdit'
					,	closeObj:'.close'
					})
				,	subFunction=function(){}
				,	cbFn=function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							subFunction(JSON,this.postdata);
							unitCpcEditfn.close();
							list.sub();
							window.leftTree.show();
						}
					}
				,	groupId=''
				,	subType='GROUP_CPC_PRICE'
				,	unitCpcEdit=window.subAjax('#unitCpcEdit',{
						path:'SET_GROUP'
					,	sub:'.sub'
					,	findDom:unitCpcEditfn.obj
					,	ckdata:function(data,subMit){
							data['GROUP_ID']=groupId;
							data[subType]=data['GROUP_PRICE'];
							if(window.ideaType==1){
								if(subType=='GROUP_CPC_PRICE' &&data['GROUP_PRICE']<=0.5){
									window.gconfirm({
										msg:'推广组CPC出价过低，可能会导致该推广组下广告无展现机会，请确认是否继续？'
									,	fn:function(isTrue){
											if(isTrue){
												subMit(model(data,true));
											}
										}
									});
									return false;
								}
								if(subType=='GROUP_CPM_PRICE' &&data['GROUP_PRICE']<10){
									window.gconfirm({
										msg:'推广组CPM出价过低，可能会导致该推广组下广告无展现机会，请确认是否继续？'
									,	fn:function(isTrue){
											if(isTrue){
												subMit(model(data,true));
											}
										}
									});
									return false;
								}
							}else{
								if($G.isNaN(data['GROUP_PRICE'])){
									window.msg.call($G('.GROUP_PRICE',unitCpcEditfn.obj)[0],{msg:'请输入组出价'});
									return false;
								}else if(data['GROUP_PRICE']<=0.5){
									window.gconfirm({
										msg:'推广组出价过低，可能会导致该推广组下广告无展现机会，请确认是否继续？'
									,	fn:function(isTrue){
											if(isTrue){
												subMit(model(data,true));
											}
										}
									});
									return false;
								}
							}
							
							delete data['GROUP_PRICE'];
							var GROUP_CPC_PRICE=data['GROUP_CPC_PRICE'];
							var GROUP_CPM_PRICE=data['GROUP_CPM_PRICE'];
							var d=model(data,true);
							if(d['UPDATE_TYPE'])
								return model(data,true);
							else
								unitCpcEditfn.close();
						}
					,	callback:cbFn
					})
				;
				return {
					show:function(json,type,fn){
						groupId=json.GROUP_ID;
						subType=type;
						$G('span:cpc',unitCpcEditfn.obj).html(type=='GROUP_CPM_PRICE'?'CPM￥':'CPC￥');
						var GROUP_PRICE=$G('.GROUP_PRICE',unitCpcEditfn.obj);
						GROUP_PRICE.val(json[type]);
						if(window.ideaType==1)
							GROUP_PRICE.setAtt('minlength',0);
						if(fn)subFunction=fn;
						unitCpcEditfn.show();
					}
				,	close:unitCpcEditfn.close
				,	sub:unitCpcEdit.sub
				};
			}()
			//启用/暂停 计划
		,	pause=function(id,t,v,fn,isList){
				var m={
					'ID_TYPE':2
				,	'ID':id
				,	'BATCH_TYPE':t
				,	'STATUS':v
				};
				window.pause(m,function(){
					if(!isList)list.sub();
					window.leftTree.show();
					fn&&fn();
				});
			}
			/*********************计暂停/启用 效果***********************************/
		,	unitPause=function(JSON){
				var obj=this
				,	css=$G(obj).getAtt('class')
				,	isPause=function(){
						return css=='start_img';
					}()
				,	msg=isPause?'您确定暂停推广计划{unitName}吗!':'您确定启动推广计划{unitName}吗!'
				;
				
				window.gconfirm({
					msg:msg.replace(/{unitName}/,'【'+JSON.GROUP_NAME+'】')
				,	fn:function(isTrue){
						if(isTrue){
							pause(JSON.GROUP_ID,1,(isPause?2:1));
						}
					}
				});
			}
			//删除单元
		,	remove=function(ids){
				pause(ids,2,'');
			}
			//远程验证计划名称是否重复
		,	ckName=function(){
				var unitNameCk=$G('.unitNameCk');
				$G('input:ckname:units').change(function(){
					var obj=this
					,	pid=$G(obj).getAtt('planId')||''
					,	uid=$G(obj).getAtt('unitId')||'0'
					,	d={
							'GROUP_NAME':obj.value
						,	'GROUP_ID_TYPE':1
						,	'CAMPAIGN_ID':pid
						,	DISPLAY_STATUS:window.ideaType
						}
					;
					if(!obj.value || !window.wm.ckType.unitName(obj.value))return;
					if(uid=='0'){
						uid='';
						d['GROUP_ID_TYPE']=2;
					}
					d['GROUP_ID']=uid;
					window.ajax({
						path:'GROUP_NAME_CHECK'
					,	type:'post'
					,	data:d
					,	calback:function(JSON){
							if(!window.wm.msg.call(obj,JSON.CODE,true)){
								unitNameCk.show();
							}
							unitNameCk.none();
						}
					});
				});
			}()
		,	add=function(pid,fn,endfn,planJson){
				unitAction.show({CAMPAIGN_ID:pid},fn,function(){
					endfn&&endfn();
					//$G('.diseaseLeveDisp')[0].style.display='';
				});
			}
		,	edit=function(json,fn){
				json=json||{};
				if($G.isNaN(json.GROUP_ID))return;
				unitAction.show(json,fn);
			}
		;
		
		
		/***********************获取组列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	listUnitHtmlTitle=$G('#listUnitHtmlTitle_'+window.ideaType)
		,	listUnitHtmlList=$G('#listUnitHtmlList_'+window.ideaType)
		,	listUnitHtmlEnd=$G('#listUnitHtmlEnd_'+window.ideaType)
		,	list=window.subAjax('#contb2',{
					path:'GET_GROUP'
				,	sub:'.subUnitList .subListGl'
				,	findDom:findDom[0]
				,	obj:listUnitEach[0]
				,	ckdata:function(data){
						if(isDisplay())return;
						var d=window.wm.setDataList(data,'GROUP_NAME','请输入组名称',findDom[0],pageArray);
						return d;
					}
				,	callback:function(JSON){
						if(c_foot.length>0)c_foot[0].style.display='';
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
						//try{
							var	n=JSON.LIST.length
							;
							if(n<1){
								var html='<table width="100%"><tr><td colspan="12"><div class="warn">当前推广组列表为空，推广计划无法正常投放，请<a>添加推广组</a></div></td></tr></table>';
								if($G.isNaN(postdata['CAMPAIGN_ID'])){
									html='<table width="100%"><tr><td colspan="12"><div class="warn">没有符合条件的数据</div></td></tr></table>';
									listUnitEach[0].innerHTML=html;
									return false;
								}
								listUnitEach[0].innerHTML=html;
								$G('a',listUnitEach[0])[0].onclick=function(){
									add(postdata['CAMPAIGN_ID']);
								}
								return false;
							}
							for(var i=0;i<n;i++){
								var	v=JSON.LIST[i]
								,	hStr=listUnitHtmlList[0].innerHTML
								;
								if(Number(v.GROUP_CPM_PRICE||0)<=0)v.GROUP_CPM_PRICE='0.00';
								unitListData[v.GROUP_ID]=v;
								$G.Each(function(ii,val,json){
									var value=this;
									if(val=='GROUP_STATUS'){
										var vs=state[value];
										value=vs[0];
										hStr=window.wm.setVal(hStr,val,vs[0]);
										hStr=window.wm.setVal(hStr,'adgroupStateCss',vs[1]);
										if(value=='暂停'){
											value='stop_img';
										}else{
											value='start_img';
										}
										val='stateCss';
									}
									hStr=window.wm.setVal(hStr,val,value);
								},v);
								str+=hStr;
							}
							page.setup(JSON.INFO.GROUP_COUNT,n,pageArray);
							var endStr=listUnitHtmlEnd[0].innerHTML;
							$G.Each(function(){
								var countValue=JSON.INFO[this+'']||0;
								endStr=window.wm.setVal(endStr,this+'',countValue);
							},'GROUP_COUNT GROUP_ENABLED GROUP_IMPRESSION GROUP_CLICK GROUP_CTR GROUP_CPC GROUP_COST GROUP_CPM'.split(" "));
							var html='<table width="100%">'+(listUnitHtmlTitle[0].innerHTML).toString()+str+endStr.toString()+'</table>';
							listUnitEach[0].innerHTML=html;
						//}catch(e){alert('unit:'+e);}
	
						/****************************左则树联动***********************************/
						var leftTreeList=$G('#leftTreeList');
						$G('.treePlanClick',listUnitEach[0]).click(function(){
							var tpv=$G(this).getAtt('value')
							,	unitObjJson=unitListData[tpv]
							,	treePlanObj=$G('span:treePlan:'+unitObjJson.CAMPAIGN_ID,leftTreeList[0])
							;
							window.leftTree.planOnClick(unitObjJson.CAMPAIGN_ID,treePlanObj[0]);
						});
						$G('.treeUnitClick',listUnitEach[0]).click(function(){
							var tuv=$G(this).getAtt('value')
							,	unitObjJson=unitListData[tuv]
							,	treeUnitObj=$G('li:treeUnit:'+unitObjJson.GROUP_ID,leftTreeList[0])
							;
							window.leftTree.unitOnClick(treeUnitObj[0],(unitObjJson.CAMPAIGN_ID||''));
						});
						/****************************修改组名称***********************************/
						$G('.editname',listUnitEach[0]).click(function(){
							var val=$G(this).getAtt('value')
							;
							nameEdit.show(unitListData[val]);
						});
						/****************************修改CPC组出价***********************************/
						$G('.priceCPC',listUnitEach[0]).click(function(){
							var val=$G(this).getAtt('value')
							;
							priceEdit.show(unitListData[val],'GROUP_CPC_PRICE');
						});
						/****************************修改CPM组出价***********************************/
						$G('.priceCPM',listUnitEach[0]).click(function(){
							var val=$G(this).getAtt('value')
							;
							priceEdit.show(unitListData[val],'GROUP_CPM_PRICE');
						});
						/****************************启用/暂停***********************************/
						$G('.pause',listUnitEach[0]).click(function(){
							var val=$G(this).getAtt('value')
							;
							unitPause.call(this,unitListData[val]);
						});
						/****************************编辑计划***********************************/
						$G('.edit',listUnitEach[0]).click(function(){
							var val=$G(this).getAtt('value')
							;
							edit.call(this,unitListData[val]);
						});
						
						$G('.listUnitTd',listUnitEach[0]).bd({on:'mousemove',callback:function(){
							$G('.listUnitTr',listUnitEach[0]).Each(function(){
								$G(this).setAtt('class','');
							});
							$G(this.parentNode).setAtt('class','key_ch');
						}}).bd({on:'mouseout',callback:function(arg,et){
							var tdObj=this;
							setTimeout(function(){
								if(et===tdObj){
									$G(tdObj.parentNode).setAtt('class','');
								}
							},0);
						}});
						
						$G('.listUnitTool',$G('#listUnitEach')[0]).Each(function(i){
							var obj=$G(this)
							,	css=(obj.getAtt('class')+'').replace(/ thbg_curr/,'')
							,	id=obj.getAtt('value')
							;
							if(pageArray['orderSetId']==id){
								var aObj=$G('span',this)
								,	cssName=pageArray['orderSetCssName']
								;
								if(cssName=='bottom_curr'||!cssName){
									pageArray['sorts']='asc';
									aObj.setAtt('class','top_curr');
								}else{
									pageArray['sorts']='desc';
									aObj.setAtt('class','bottom_curr');
								}
								css+=' thbg_curr';
							}
							obj.setAtt('class',css);
						});
						window.helpPicUnit&&window.helpPicUnit();
					}
				})
				/***********************获得单元完毕************************/
		,	showMenu=function(id){
				if($G.isNaN(id))return;
				var data=unitListData[id]
				,	mObj=this
				,	setJson=function(json){
						data=json.adgroup;
						setMenuFn.call(mObj,data);
						unitListData[id]=json.adgroup;
					}
				,	setMenuFn=function(JSON){
						var absTt=$G('div:abs_tt',this)
						,	p=$G('p',this)
						,	stateArray=state[JSON.GROUP_STATUS]
						,	newUnits=$G('a',$G('div:addpromotion',this)[0])
						,	rightToolList=$G('.rightToolList')
						,	targetingType=function(){
								var mstr='浏览定向'
								,	rtObj=window.ideaType==1?3:4
								;
								if(JSON.GROUP_TARGETING_TYPE=='1'){
									newUnits[0].style.display='none';
									mstr='浏览定向';
								}else if(JSON.GROUP_TARGETING_TYPE=='2'){
									newUnits[0].style.display='';
									rtObj=2;
									mstr='搜索定向';
								}
								window.rightToolListOnClick.call(rightToolList[rtObj],{planId:JSON.CAMPAIGN_ID,unitId:JSON.GROUP_ID});
								window.leftTree.rightToolMenu(2);
								if(JSON.GROUP_TARGETING_TYPE=='1'){
									rightToolList[2].parentNode.style.display='none';
								}else{
									rightToolList[2].parentNode.style.display='';
								}
								return mstr;
							}()
						;
						
						absTt.html('<a onclick="window.leftTree.userOnClick();">推广账户</a> > <a name="leftTreeCampaign">'+JSON.CAMPAIGN_NAME+'</a> > 推广组<a href="http://15talk.haomeit.com/download.shtml" target="_blank" class="new_right">医务通在线咨询系统，永久免费使用，去下载看看！</a>');
						
						var ideasleftTreeList=$G('#leftTreeList');
						$G('.leftTreeCampaign',absTt[0]).click(function(){
							var treePlanObj=$G('span:treePlan:'+JSON.CAMPAIGN_ID,ideasleftTreeList[0])
							;
							window.leftTree.planOnClick(JSON.CAMPAIGN_ID,treePlanObj[0]);
						});
						p.Each(function(i){
							if(i==0)this.innerHTML='名称：'+JSON.GROUP_NAME+' <a name="adgroupName">修改全部设置</a>';
							else if(i==1)this.innerHTML='状态：<span class="'+stateArray[1]+'">'+stateArray[0]+'</span><a name="adgroupState">修改</a>';
							else if(i==2){
								if(window.ideaType==2)
									this.innerHTML='组出价：￥'+JSON.GROUP_CPC_PRICE+'/cpc <a name="cpcPrice">修改</a>';
								else
									this.innerHTML='CPC出价：￥'+(JSON.GROUP_CPC_PRICE||'0.00')+'/cpc <a name="cpcPrice">修改</a>'+'CPM出价：￥'+(JSON.GROUP_CPM_PRICE||'0.00')+'/cpm <a name="cpmPrice">修改</a>';
							}
							else if(i==3)this.innerHTML='精准定向：'+targetingType;
						});
						newUnits.click(function(){
							if(this.name=='keywordAdd'){
								window.keyWd.add.call(data,id);
							}else{
								if(window.ideaType==2)
									window.testIdea.add.call(data,id);
								else if(window.ideaType==1)
									window.picIdea.add.call(data,id);
							}
						});
						
						$G('a',$G('ul',this)[0]).click(function(){
							if(this.name=='adgroupName'){
								edit(JSON,function(code,j){
									$G.Each(function(i,k){
										var jv=this+'';
										if(!$G.isNaN(jv)){
											data[k]=jv;
										}
									},j);
									setMenuFn.call(mObj,data);
								});
							}else if(this.name=='adgroupState'){
								window.setTopState.show(
									function(){
										$G('select',window.setTopState.obj).setseltext(state[JSON.GROUP_STATUS][0]);
										window.selDom.resall();
									}
								,	function(isSubTrue){
										if(!isSubTrue)return;
										var value=($G('select',window.setTopState.obj).getselvalue())[0]
										;
										if(value>0){
											pause(id,1,value,function(){
												JSON.GROUP_STATUS=value;
												setJson({adgroup:JSON});
											},true);
										}else if(value==0){
											remove(id);
											window.leftTree.userOnClick();
										}
										
									}
								);
							}else if(this.name=='cpcPrice'){
								priceEdit.show(JSON,'GROUP_CPC_PRICE',function(code,j){
									JSON.GROUP_CPC_PRICE=$G.isNaN(j.GROUP_CPC_PRICE)?'0.00':j.GROUP_CPC_PRICE;
									setJson({adgroup:JSON});
								});
							}else if(this.name=='cpmPrice'){
								priceEdit.show(JSON,'GROUP_CPM_PRICE',function(code,j){
									JSON.GROUP_CPM_PRICE=$G.isNaN(j.GROUP_CPM_PRICE)?'0.00':j.GROUP_CPM_PRICE;
									setJson({adgroup:JSON});
								});
							}
						});
					}
				;
				if($G.isNaN(data)){
					getUnitById(id,function(json){
						setJson({adgroup:json});
					});
				}else{
					setMenuFn.call(this,data);
				}
				
			}
			
		;
		
		var orderBy=function(type){
			var setObj=$G(this)
			,	setId=setObj.getAtt('value')
			,	cObj=$G('span',this)
			,	cssName=cObj.getAtt('class')
			;
			pageArray['SORT_TYPE']=2;
			pageArray['SORT_COLUMN']=(Number(setId)+1);
			if(cssName=='bottom_curr'||!cssName){
				pageArray['SORT_TYPE']=1;
			}
			pageArray['orderSetId']=setId;
			pageArray['orderSetCssName']=cssName;
			
			list.sub();
		};
		
		var selectAll=function(){
				var c=this.checked;
				$G('.listUnitCheckId',$G('#listUnitEach')[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.listUnitCheckId',$G('#listUnitEach')[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listUnitCheckAll',$G('#listUnitEach')[0])[0].checked=true;
				else $G('.listUnitCheckAll',$G('#listUnitEach')[0])[0].checked=false;
			}
		;
		(function(){
			var findSelId=function(){
				var selObjList=$G('.listUnitCheckId',$G('#listUnitEach')[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			};
			$G('#unitToolsDelAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中推广组后再进行删除操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要删除选中的推广组吗？'
					,	fn:function(isTrue){
							if(isTrue){
								remove(s.vlist.join(','));
							}
						}
					});
				}
			});
			$G('#unitToolsSotpAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中推广组后再进行暂停操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要暂停选中的推广组吗？'
					,	fn:function(isTrue){
							if(isTrue){
								pause(s.vlist.join(','),1,2);
							}
						}
					});
				}
			});
			$G('#unitToolsStartAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中推广组后再进行启动操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要启用选中的推广组吗？'
					,	fn:function(isTrue){
							if(isTrue){
								pause(s.vlist.join(','),1,1);
							}
						}
					});
				}
			});
			$G('#unitToolsEditPriceAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中推广组后再进行批量修改操作'
					});
				}else{
					var sec=s['vlist'].join(" .unitPricesShow");
					var unitPricesShow=$G('.unitPricesShow'+sec)
					,	unitPricesNone=$G(('.unitPricesNone'+sec).replace(/unitPricesShow/ig,'unitPricesNone'))
					,	unitPricesInput=$G(('.unitPricesInput'+sec).replace(/unitPricesShow/ig,'unitPricesInput'))
					,	unitToolsEditPrice=$G('.unitToolsEditPrice')
					,	unitToolsEditPriceOpen=$G('.unitToolsEditPriceOpen')
					,	unitPricesInputAll=$G('.unitPricesInputAll')
					,	unitPricesCpmShow=$G(('.unitPricesCpmShow'+sec).replace(/unitPricesShow/ig,'unitPricesCpmShow'))
					,	unitPricesCpmNone=$G(('.unitPricesCpmNone'+sec).replace(/unitPricesShow/ig,'unitPricesCpmNone'))
					,	unitPricesCpmInput=$G(('.unitPricesCpmInput'+sec).replace(/unitPricesShow/ig,'unitPricesCpmInput'))
					;
					if(window.ideaType==1){
						$G('.unitPricesInputDisplay').show();
						unitPricesCpmShow.show();
						unitPricesCpmNone.none();
						$G('.unitPricesCpmInputAll')[0].onchange=function(){
							unitPricesCpmInput.val(this.value);
						};
					}
					unitPricesShow.show();
					unitToolsEditPriceOpen.show();
					unitPricesNone.none();
					unitToolsEditPrice.none();
					$G('#unitToolsEditPriceClear')[0].onclick=function(){
						unitPricesShow.none();
						unitToolsEditPriceOpen.none();
						unitPricesCpmShow.none();
						
						unitPricesNone.show();
						unitToolsEditPrice.show();
						unitPricesCpmNone.show();
						unitPricesInputAll[0].value='';
						if(window.ideaType==1){
							$G('.unitPricesCpmInputAll')[0].value='';
						}
					};
					
					unitPricesInput.Each(function(){
						var dom=$G(this)
						,	val=dom.getAtt('val')
						;
						this.value=($G('#unitcpcPrice'+val)[0].innerHTML).replace(/￥/ig,'');
					});
					if(window.ideaType==1){
							unitPricesCpmInput.Each(function(){
								var dom=$G(this)
								,	val=dom.getAtt('val')
								;
								this.value=($G('#unitcpmPrice'+val)[0].innerHTML).replace(/￥/ig,'');
							});
					}
					$G('#unitToolsEditPriceSave')[0].onclick=function(){
						var isSub=true
						,	vals=new Array()
						,	cpmVals=new Array()
						;
						
						if(window.ideaType==1){
							unitPricesInput.Each(function(i){
								var cpcVal=this.value
								,	cpmVal=unitPricesCpmInput[i].value
								,	cmVal=Number(cpcVal)+Number(cpmVal)
								;
								if(!Number(cmVal) || cmVal<1){
									isSub=false;
									window.msg.call(this,{msg:'您的出价必须大于0，或CPC和CPM必须有一个不为空'});
								}else{
									vals.push(cpcVal);
									cpmVals.push(cpmVal);
								}
							});
						}else{
							unitPricesInput.Each(function(){
								var val=this.value
								;
								if(!Number(val) || val<1){
									isSub=false;
									window.msg.call(this,{msg:'您的出价必须大于0，不允许清空或设置为0'});
								}else{
									vals.push(val);
								}
							});
						}
						if(isSub===false){
							return;
						}
						var m={
							'ID_TYPE':3
						,	'ID':s.vlist.join(',')
						,	'BATCH_TYPE':3
						,	'GROUP_PRICE_TYPE':1
						,	'GROUP_CPC_PRICE':vals.join(',')
						};
						if(window.ideaType==1){
							m['GROUP_CPM_PRICE']=cpmVals.join(',');
							m['GROUP_PRICE_TYPE']=3;
						}
						window.ajax({
							path:'BATCH_OPERATION'
						,	type:'post'
						,	data:m
						,	calback:function(JSON){
								if(window.wm.msg(JSON.CODE,false)){
									window.altBox.show({
										title:'提示信息'
									,	msg:'批量操作成功！'
									});
									$G('#unitToolsEditPriceClear')[0].onclick();
									list.sub();
								}
							}
						});
					};
					
					unitPricesInputAll[0].onchange=function(){
						unitPricesInput.val(this.value);
					};
				}
			});
			
			
		})();
		/******************数据报告日期范围提交****************************/
		$G('.DATE_TYPE',findDom[0])[0].onchange=function(){
			list.sub();
		};
		/******************查询名称效果************************************/
		$G('.FIND_NAME',findDom[0]).click(function(){
			if(this.value=='请输入组名称'){
				this.value='';
			}
		}).change(function(){
			if(this.value==''){
				this.value='请输入组名称';
			}
		});
		$G('#unitCpMPriceValue').Each(function(){
			if(window.ideaType==1){
				this.style.display='';
			}
		});
		$G('.cpmPriceMsg').Each(function(){
			var msg='这里指单次展现出价';
			if(window.ideaType==2){
				this.innerHTML=msg;
			}
		});
		$G('.cpcPriceMsg').Each(function(){
			var msg='组出价：';
			if(window.ideaType==2){
				this.innerHTML=msg;
			}
		});
		
		$G('#diseaseList')[0].style.display='';
		$G('#keywordsList')[0].style.display='';
		
		var findWhere=function(){
			var FIND_STATUS=$G('.FIND_STATUS',findDom[0])
			,	FIND_NAME=$G('.FIND_NAME',findDom[0])
			,	FIND_TYPE=$G('.FIND_TYPE',findDom[0])
			,	DATE_TYPE=$G('.DATE_TYPE',findDom[0])
			;
			pageArray['PAGE_INDEX']=1;
			pageArray['CAMPAIGN_ID']='';
			pageArray['click']=function(pageObj){
				pageArray=pageObj;
				list.sub();
			};
			pageArray['SORT_TYPE']=2;
			pageArray['SORT_COLUMN']=5;
			return {
				clear:function(){
					FIND_STATUS.setseltext('全部状态');
					FIND_NAME.val('请输入组名称');
					FIND_TYPE[0].checked=false;
					DATE_TYPE.setselvalue(1);
					window.selDom&&window.selDom.resall();
				}
			};
		}();
		var subList=function(obj){
			obj=obj||{};
			findWhere.clear();
			pageArray['PAGE_INDEX']=obj.p||pageIni.PAGE_INDEX;
			pageArray['CAMPAIGN_ID']=obj.planId||'';
			list.sub();
		};
		return {
			list:subList
		,	add:add
		,	showMenu:showMenu
		,	orderBy:orderBy
		,	selectAll:selectAll
		,	selectId:selectId
		};
	}();
	
})();