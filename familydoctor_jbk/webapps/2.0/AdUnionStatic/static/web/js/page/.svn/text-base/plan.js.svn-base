(function(){
	window.subPlanCallBack=function(){};
	window.plan=function(){
		var c_foot=$G('div:c_foot')
		,	listPlanEach=$G('#listPlanEach')
		,	findDom=$G('#contb1')
		,	planListData={}
		,	isDisplay=function(){
				return findDom[0].style.display=='none';
			}
		,	listPlanEachCount=function(m){
				$G('.validCampaignCountSpan',listPlanEach[0]).html(m);
			}
		,	listPlanEachBudget=function(m){
				$G('.validCampaignBudgetSumSpan',listPlanEach[0]).html(m);
			}
		,	model=function(d,isTrue){
				var m={
						path:'SET_CAMPAIGN'
					,	CAMPAIGN_NAME:''											//计划名称
					,	CAMPAIGN_ID:''												//计划ID
					,	UPDATE_TYPE:''												//1-STATUS 2-BUDGET 4-REGION 8-SCHEDULE 16-TIME 32-CAMPAIGN_NAME
					,	CAMPAIGN_STATUS:''											//1有效 2暂停
					,	CAMPAIGN_BUDGET:''											//预算
					,	REGION_TYPE:''												//1全区域 2自定义区域
					,	REGION_SERIALIZE:''											//多个区域逗号间隔 REGION_TYPE = 2 生效
					,	SCHEDULE_TYPE:''											//1全时段 2自定义时段
					,	SCHEDULE_SERIALIZE:''										//168位序列表 SCHEDULE_TYPE = 2 生效
					,	TIME_TYPE:''												//1不限结束日期 2指定结束日期 4指定开始日期
					,	BEGIN_TIME:''									 			//开始日期
					,	END_TIME:''													//结束日期
					,	DISPLAY_STATUS:window.ideaType
					}
				,	updateCode='CAMPAIGN_STATUS,CAMPAIGN_BUDGET,REGION_TYPE,SCHEDULE_TYPE,TIME_TYPE,CAMPAIGN_NAME'.split(',')
				;
				
				if($G.isNaN(d['CAMPAIGN_ID'])){
					m['path']='ADD_CAMPAIGN';
					delete m['CAMPAIGN_STATUS'];
					delete m['CAMPAIGN_ID'];
					delete d['CAMPAIGN_ID'];
					delete m['UPDATE_TYPE'];
				}else if(isTrue){
					var json=planListData[d['CAMPAIGN_ID']]
					;
					$G.Each(function(){
						var key=this+'';
						if(key!='REGION_TYPE' && key!='SCHEDULE_TYPE' && key!='TIME_TYPE' && key!='CAMPAIGN_STATUS' && d[key]==json[key]){
							delete d[key];
						}
					},updateCode);
					m['path']='SET_CAMPAIGN';
					var stepVal=1
					,	updateType=''
					,	timeCodeType=0
					;
					$G.Each(function(){
						if(!$G.isNaN(d[this+''])){
							updateType=Number(updateType||0)+Number(stepVal);
						}
						stepVal=stepVal*2;
					},updateCode);
					m.UPDATE_TYPE=updateType;
					
					stepVal=d['TIME_TYPE']||1;
					if(!$G.isNaN(d['BEGIN_TIME'])){
						stepVal=Number(stepVal||0)+4;
					}
					d.TIME_TYPE=stepVal;
				}
				
				$G.Each(function(i,k){
					m[k]=this+'';
				},d);
				return m;
			}
		,	state={
				'1':['有效','green']
			,	'2':['处于暂停时段','orange']
			,	'3':['每日预算不足','orange']
			,	'4':['未开始','orange']
			,	'5':['暂停','orange']
			,	'6':['已下线','red']
			}
			//获取单条计划数据
		,	getPlanById=function(id,fn){
				window.ajax({
					path:'GET_CAMPAIGN_UNIQUE'
				,	type:'post'
				,	data:{CAMPAIGN_ID:id}
				,	calback:function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							fn&&fn(JSON);
						}
					}
				});
			}
			//启用/暂停 计划
		,	pause=function(id,t,v,fn,isList){
				var m={
					'ID_TYPE':1
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
		,	planPause=function(JSON){
				var obj=this
				,	css=$G(obj).getAtt('class')
				,	isPause=function(){
						return css=='start_img';
					}()
				,	msg=isPause?'您确定暂停推广计划{planName}吗!':'您确定启动推广计划{planName}吗!'
				;
				
				window.gconfirm({
					msg:msg.replace(/{planName}/,'【'+JSON.CAMPAIGN_NAME+'】')
				,	fn:function(isTrue){
						if(isTrue){
							pause(JSON.CAMPAIGN_ID,1,(isPause?2:1));
						}
					}
				});
			}
			//删除计划
		,	remove=function(ids){
				pause(ids,2,'');
			}
			//远程验证计划名称是否重复
		,	ckName=function(){
				var planNameCk=$G('.planNameCk');
				$G('input:ckname:plan').change(function(){
					var obj=this;
					if(!obj.value || !window.wm.ckType.planName(obj.value))return;
					window.ajax({
						path:'CAMPAIGN_NAME_CHECK'
					,	type:'post'
					,	data:{
							CAMPAIGN_NAME:obj.value
						,	DISPLAY_STATUS:window.ideaType
						}
					,	calback:function(JSON){
							if(!window.wm.msg.call(obj,JSON.CODE,true)){
								planNameCk.show();
							}
							planNameCk.none();
						}
					});
				});
			}()
			/**********************修改计划名称**********************************/
		,	nameEdit=function(){
				//弹出层
				var planNameEdit=$G('#planNameEdit')
				,	campaignName=$G('.CAMPAIGN_NAME',planNameEdit[0])
				,	campaignId=''
				,	planNameCk=$G('.planNameCk',planNameEdit[0])
				,	planNameEditAlt=window.alertDiv({
							findObj:'#planNameEdit'
						,	closeObj:'.close'
						,	lock_back:'#BBBBBB'
					})
				;
				//数据提交
				window.subAjax('#planNameEdit',{
					sub:'.sub'
				,	findDom:planNameEdit[0]
				,	ckdata:function(data){
						data['CAMPAIGN_ID']=campaignId;
						return model(data,true);
					}
				,	callback:function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							planNameEditAlt.close();
							list.sub();
							window.leftTree.show();
						}
					}
				});
				return {
					show:function(json){
						planNameCk.none();
						campaignId=json.CAMPAIGN_ID;
						campaignName[0].value=json.CAMPAIGN_NAME;
						planNameEditAlt.show();
					}
				,	close:planNameEditAlt.close
				};
			}()
			/***********************每日预算************************************/
		,	budgetEdit=function(){
				var planBudgetEditfn=window.alertDiv({
						findObj:'#planBudgetEdit'
					,	closeObj:'.close'
					})
				,	subFunction=function(){}
				,	campaignId=''
				,	subBudget=window.subAjax('#planBudgetEdit',{
						path:'SET_CAMPAIGN_BUDGET'
					,	sub:'.subBudget'
					,	findDom:planBudgetEditfn.obj
					,	ckdata:function(data){
							data['CAMPAIGN_ID']=campaignId;
							var d=model(data,true);
							if($G.isNaN(d['CAMPAIGN_BUDGET'])){
								planBudgetEditfn.close();
								return false;
							}
							return d;
						}
					,	callback:function(JSON){
							if(window.wm.msg(JSON.CODE,false)){
								subFunction(JSON,this.postdata);
								planBudgetEditfn.close();
								list.sub();
								window.leftTree.show();
							}
						}
					})
				;
				return {
					show:function(json,fn){
						campaignId=json.CAMPAIGN_ID;
						$G('.CAMPAIGN_BUDGET',planBudgetEditfn.obj).val(json.CAMPAIGN_BUDGET);
						if(fn)subFunction=fn;
						planBudgetEditfn.show();
					}
				,	close:planBudgetEditfn.close
				,	sub:subBudget.sub
				};
			}()
			//创建/修改 计划
		,	planAction=function(){
				//提交验证
				var plan=$G('#step_first')
				,	planNameCk=$G('.planNameCk')
				,	subFunction=function(){}
				,	subPlan=window.subAjax('#step_first',{
							ckdata:function(data){
								data['REGION_TYPE']=data['REGION_TYPE']+'';
								data['TIME_TYPE']=data['TIME_TYPE']+'';
								data['SCHEDULE_TYPE']=data['SCHEDULE_TYPE']+'';
								
								if(data['REGION_TYPE']==2){
									data['REGION_SERIALIZE']=window.region.getRegion();
									if($G.isNaN(data['REGION_SERIALIZE'])){
										window.msg.call($G('.REGION_TYPE')[1],{msg:'请至少选择一个投放地域'});
										return;
									}else if(data['REGION_SERIALIZE']=='ALL'){
										data['REGION_TYPE']=1;
									}
								}
								if(data['TIME_TYPE']==2){
									var beginTime=Date.parse(data['BEGIN_TIME'].replace(/-/ig,'/'))
									,	endTime=Date.parse(data['END_TIME'].replace(/-/ig,'/'))
									;
									if(beginTime>endTime){
										window.msg.call($G('.END_TIME',plan[0])[0],{msg:'投放日程：结束日期不能早于开始日期'});
										return;
									}
								}
								
								if(data['SCHEDULE_TYPE']==2){
									data['SCHEDULE_SERIALIZE']=window.getTimeNumber();
									if(data['SCHEDULE_SERIALIZE']=='ALL'){
										data['SCHEDULE_TYPE']=1;
									}else if(data['SCHEDULE_SERIALIZE'].indexOf('1')<0){
										window.msg.call($G('.SCHEDULE_TYPE')[1],{msg:'投放时间不能为空'});
										return;
									}
								}
								
								return model(data,true);
							}
						,	sub:'.subAddPlan'
						,	callback:function(JSON){
								if(window.wm.msg(JSON.CODE,false)){
									subFunction(JSON,this.postdata);
									planAlt.close();
									window.leftTree.show();
									list.sub();
								}
							}
					})
					//创建/修改 计划 层
				,	planAlt=window.alertDiv({
						findObj:'#step_first'
					,	closeObj:'.close_bnt'
					,	position:'absolute'
					,	move:$G('div:scommon_title',plan[0])
					})
				,	domShow=function(type,JSON){
						var test={
								'edit':{
									'subAddPlan':'<span>保存</span>'
								,	'altPlanTitle':'修改计划'
								}
							,	'add':{
									'subAddPlan':'<span>保存并继续</span>'
								,	'altPlanTitle':'新建计划'
								}
							}
						,	html=test[type]
						,	none=type=='add'?'':'none'
						;
						planNameCk.none();
						$G('.subAddPlan .altPlanTitle .altPlanDaoHang',plan[0]).Each(function(){
							var gObj=$G(this)
							,	name=gObj.getAtt('name')
							;
							gObj.html(html[name]);
							if(name=='altPlanDaoHang')
								gObj[0].style.display=none;
						});
						$G('.CAMPAIGN_ID .CAMPAIGN_NAME .CAMPAIGN_BUDGET .END_TIME .BEGIN_TIME',plan[0]).Each(function(){
							var gObj=$G(this)
							,	name=gObj.getAtt('name')
							;
							if(name!='BEGIN_TIME' && name!='END_TIME' && JSON[name])
								this.value=JSON[name];
							else if(!$G.isNaN(JSON[name])){
								this.value=$G.formatdate(new Date(Date.parse(JSON[name].replace(/-/ig,'/'))),'YYYY-MM-dd');
							}else if(name!='END_TIME' && name!='BEGIN_TIME')
								this.value='';
							else if(name=='END_TIME')
								this.value=$G.formatdate(new Date(),'YYYY-MM-dd');
						});
						window.region.setRegion(JSON.REGION_SERIALIZE);
						$G('.REGION_TYPE',plan[0]).Each(function(i){
							if(JSON.REGION_TYPE==(i+1)){
								this.checked=true;
							}
						});
						$G('#RadioGroup1a2',plan[0])[0].style.display=JSON.REGION_TYPE<2?'none':'';
						
						if(JSON.TIME_TYPE==1){
							$G('.TIME_TYPE',plan[0])[0].checked=true;
							$G('#tFangEndTimeDiv',plan[0])[0].style.display='none';
						}else{
							$G('.TIME_TYPE',plan[0])[1].checked=true;
							$G('#tFangEndTimeDiv',plan[0])[0].style.display='';
							putDate.show();
						}
						if(JSON.SCHEDULE_TYPE==2){
							window.setTimeNumber(JSON.SCHEDULE_SERIALIZE);
							$G('.SCHEDULE_TYPE',plan[0])[1].checked=true;
							$G('#scheduleTypeDiv',plan[0])[0].style.display='';
							putDate.show();
						}else{
							window.setTimeNumber();
							$G('.SCHEDULE_TYPE',plan[0])[0].checked=true;
							$G('#scheduleTypeDiv',plan[0])[0].style.display='none';
						}
						if(JSON.CAMPAIGN_STATUS==4 || type=='add')
							$G('.calendar',putDate.tfTime[0])[0].style.display='';
						else if(JSON.CAMPAIGN_ID)
							$G('.calendar',putDate.tfTime[0])[0].style.display='none';
					}	
				;
				
				//投放日程（高级）
				var	putDate=function(){
						var put=$G('#idSetDate1')
						,	tfTime=$G('#tfang_time')
						,	show=function(){
								put.setAtt('class','jian');
								tfTime[0].style.display='';
							}
						,	close=function(){
								put.setAtt('class','jia');
								tfTime[0].style.display='none';
							}
						,	putDateClick=function(){
								var c=put.getAtt('class')
								;
								if(c=='jia'){
									put.setAtt('class','jian');
									tfTime[0].style.display='';
								}else{
									put.setAtt('class','jia');
									tfTime[0].style.display='none';
								}
							}
						;
						put.click(putDateClick);
						return {
							click:putDateClick
						,	close:close
						,	show:show
						,	tfTime:tfTime
						}
					}()
				;
				$G('#RegionList',plan[0])[0].style.display='';
				return {
					show:function(json,fn){
						var planCloseMsg='您确定要中止修改推广计划操作吗？'
						;
						json=json||{};
						json=model(json);
						$G('.campaignName',plan[0]).disabled=false;
						putDate.close();
						if(json && $G.isNaN(json.CAMPAIGN_ID)){
							planCloseMsg='您确定要中止新建推广计划操作吗？';
							json['REGION_TYPE']=1;
							json['SCHEDULE_TYPE']=1;
							json['TIME_TYPE']=1;
							domShow('add',json);
						}else{
							domShow('edit',json);
						}
						if(fn)subFunction=fn;
						planAlt.show(
						''
						,	function(){
								window.gconfirm({
									msg:planCloseMsg
								,	fn:function(isTrue){
										if(isTrue){
											planAlt.close();
										}
									}
								});
							}
						,	''
						,	true
						);
					}
				,	close:planAlt.close
				,	putDate:putDate
				};
				
			}()
		,	add=function(fn){
				planAction.show({},fn);
			}
		,	edit=function(json,fn){
				json=json||{};
				if($G.isNaN(json.CAMPAIGN_ID))return;
				planAction.show(json,fn);
			}
		;
		
		/***********************获取计划列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	listPlanHtmlTitle=$G('#listPlanHtmlTitle')
		,	listPlanHtmlList=$G('#listPlanHtmlList')
		,	listPlanHtmlEnd=$G('#listPlanHtmlEnd')
		,	list=window.subAjax('#contb1',{
				path:'GET_CAMPAIGN'
			,	sub:'.subPlanList .subListGl'
			,	findDom:findDom[0]
			,	obj:listPlanEach[0]
			,	ckdata:function(data){
					if(isDisplay())return;
					return window.wm.setDataList(data,'CAMPAIGN_NAME','请输入计划名称',findDom[0],pageArray);
				}
			,	callback:function(JSON){
					if(c_foot.length>0)c_foot[0].style.display='';
					var str='';
					JSON.INFO=JSON.INFO||{
											PAGE_INDEX:1
										,	CAMPAIGN_COUNT:0
										};
					JSON.LIST=JSON.LIST||{};
					
					if(!window.wm.msg(JSON.CODE,false))
						return;
					
					try{
						var	n=JSON.LIST.length
						;
						if(n<1){
							var html='<table width="100%"><tr><td colspan="12"><div class="warn">没有符合条件的数据</div></td></tr></table>';
							listPlanEach[0].innerHTML=html;
							return false;
						}
						for(var i=0;i<n;i++){
							var	v=JSON.LIST[i]
							,	hStr=listPlanHtmlList[0].innerHTML
							;
							planListData[v.CAMPAIGN_ID]=v;
							$G.Each(function(i,val,json){
								var value=this;
								if(val=='CAMPAIGN_STATUS'){
									var vs=state[value];
									value=vs[0];
									hStr=window.wm.setVal(hStr,val,vs[0]);
									hStr=window.wm.setVal(hStr,'campaignStateCss',vs[1]);
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
						page.setup(JSON.INFO.CAMPAIGN_COUNT,n,pageArray);
						var endStr=listPlanHtmlEnd[0].innerHTML;
						$G.Each(function(){
							var countValue=JSON.INFO[this+'']||0;
							endStr=window.wm.setVal(endStr,this+'',countValue);
						},'CAMPAIGN_COUNT CAMPAIGN_ENABLED CAMPAIGN_BUDGET CAMPAIGN_IMPRESSION CAMPAIGN_CLICK CAMPAIGN_CTR CAMPAIGN_CPC CAMPAIGN_COST CAMPAIGN_CPM'.split(" "));
						window.rightToolPlanMsg.setPlanBudSum(JSON.INFO.CAMPAIGN_BUDGET);
						window.rightToolPlanMsg.setPlanCount(JSON.INFO.CAMPAIGN_ENABLED);
						var html='<table width="100%">'+(listPlanHtmlTitle[0].innerHTML).toString()+str+endStr.toString()+'</table>';
						listPlanEach[0].innerHTML=html;
					}catch(e){alert('plan:'+e);}
					
					/****************************左则树联动***********************************/
					$G('.treePlanClick',listPlanEach[0]).click(function(){
						var tpv=$G(this).getAtt('value')
						,	treePlanObj=$G('span:treePlan:'+tpv,$G('#leftTreeList')[0])
						;
						window.leftTree.planOnClick(tpv,treePlanObj[0]);
					});
					/****************************修改计划名称***********************************/
					$G('.editname',listPlanEach[0]).click(function(){
						var val=$G(this).getAtt('value')
						;
						nameEdit.show(planListData[val]);
					});
					/****************************修改每日预算***********************************/
					$G('.budget',listPlanEach[0]).click(function(){
						var val=$G(this).getAtt('value')
						;
						budgetEdit.show(planListData[val]);
					});
					/****************************启用/暂停***********************************/
					$G('.pause',listPlanEach[0]).click(function(){
						var val=$G(this).getAtt('value')
						;
						planPause.call(this,planListData[val]);
					});
					/****************************编辑计划***********************************/
					$G('.edit',listPlanEach[0]).click(function(){
						var val=$G(this).getAtt('value')
						;
						edit.call(this,planListData[val]);
					});
					
					$G('.listPlanTd',listPlanEach[0]).bd({on:'mousemove',callback:function(){
						$G('.listPlanTr',listPlanEach[0]).Each(function(){
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
					$G('.listPlanTool',$G('#listPlanEach')[0]).Each(function(i){
						var obj=$G(this)
						,	css=(obj.getAtt('class')+'').replace(/ thbg_curr/,'')
						,	id=obj.getAtt('value')
						;
						if(pageArray['orderSetId']==id){
							var aObj=$G('span',this)
							,	cssName=pageArray['orderSetCssName']
							;
							if(cssName=='bottom_curr'||!cssName){
								pageArray['SORT_TYPE']=1;
								aObj.setAtt('class','top_curr');
							}else{
								pageArray['SORT_TYPE']=2;
								aObj.setAtt('class','bottom_curr');
							}
							css+=' thbg_curr';
						}
						obj.setAtt('class',css);
					});
				}
			});
		
		$G('.REGION_TYPE').click(function(){
			var obj=$G('#RadioGroup1a2');
			if(this.value==1)obj[0].style.display='none';
			else obj[0].style.display='';
		});
		
		var tFangEndTimeDiv=$G('#tFangEndTimeDiv');
		$G('.TIME_TYPE').click(function(){
			if(this.value==2)tFangEndTimeDiv[0].style.display='';
			else tFangEndTimeDiv[0].style.display='none';
		});
		var scheduleTypeDiv=$G('#scheduleTypeDiv');
		$G('.SCHEDULE_TYPE').click(function(){
			if(this.value==2)scheduleTypeDiv[0].style.display='';
			else scheduleTypeDiv[0].style.display='none';
		});
		
		/******************数据报告日期范围提交****************************/
		$G('.DATE_TYPE',findDom[0])[0].onchange=function(){
			list.sub();
		};
		/******************查询 计划名称效果************************************/
		$G('.FIND_NAME',findDom[0]).click(function(){
			if(this.value=='请输入计划名称'){
				this.value='';
			}
		}).change(function(){
			if(this.value==''){
				this.value='请输入计划名称';
			}
		});
		
		var selectAll=function(){
				var c=this.checked;
				$G('.listPlanCheckId',$G('#listPlanEach')[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.listPlanCheckId',$G('#listPlanEach')[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listPlanCheckAll',$G('#listPlanEach')[0])[0].checked=true;
				else $G('.listPlanCheckAll',$G('#listPlanEach')[0])[0].checked=false;
			}
		;
		(function(){
			var findSelId=function(){
				var selObjList=$G('.listPlanCheckId',$G('#listPlanEach')[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			};
			$G('#planToolsDelAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中推广计划后再进行删除操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要删除选中的推广计划吗？'
					,	fn:function(isTrue){
							if(isTrue){
								remove(s.vlist.join(','));
							}
						}
					});
				}
			});
			$G('#planToolsSotpAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中推广计划后再进行暂停操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要暂停选中的推广计划吗？'
					,	fn:function(isTrue){
							if(isTrue){
								pause(s.vlist.join(','),1,2);
							}
						}
					});
				}
			});
			$G('#planToolsStartAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中推广计划后再进行启动操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要启用选中的推广计划吗？'
					,	fn:function(isTrue){
							if(isTrue){
								pause(s.vlist.join(','),1,1);
							}
						}
					});
				}
			});
		})();
		
		
		var showMenu=function(id){
			if($G.isNaN(id))return;
			var data=planListData[id]
			,	mObj=this
			,	setJson=function(json){
					data=json.campaign;
					planListData[id]=json.campaign;
					setMenuFn.call(mObj,data);
				}
			,	setMenuFn=function(JSON){
					var absTt=$G('div:abs_tt',this)
					,	p=$G('p',this)
					,	stateArray=state[JSON.CAMPAIGN_STATUS]
					;
					absTt.html('<a onclick="window.leftTree.userOnClick();">推广账户</a> > 推广计划<a href="http://15talk.haomeit.com/download.shtml" target="_blank" class="new_right">医务通在线咨询系统，永久免费使用，去下载看看！</a>');
					p.Each(function(i){
						if(i==0)this.innerHTML='名称：'+JSON.CAMPAIGN_NAME+' <a name="campaignName">修改全部设置</a>';
						else if(i==1)this.innerHTML='状态：<span class="'+stateArray[1]+'">'+stateArray[0]+'</span><a name="campaignState">修改</a>';
						else if(i==2)this.innerHTML='每日预算：￥'+JSON.CAMPAIGN_BUDGET+'<a name="campaignBudget">修改</a>';
						else if(i==3)this.innerHTML='投放地域：'+(JSON.REGION_TYPE==1?'全部地域':'部分地域');
						else if(i==4)this.innerHTML='投放时段：'+(JSON.SCHEDULE_TYPE==1?'全时段':'指定时间段');
					});
					var newUnits=$G('a',$G('div:addpromotion',this)[0])
					,	ula=$G('a',$G('ul',this)[0])
					;
					newUnits[0].onclick=function(){
						window.units.add(id);
					};
					ula.click(function(){
						if(this.name=='campaignName'){
							edit(JSON,function(code,j){
								$G.Each(function(i,k){
									var jv=this+'';
									if(!$G.isNaN(jv)){
										if(k=='TIME_TYPE'){
											if(jv>3){
												jv=jv-4;
											}
										}
										if(jv==1){
											data['END_TIME']='';
										}
										data[k]=jv;
									}
								},j);
								setMenuFn.call(mObj,data);
							});
						}else if(this.name=='campaignState'){
							window.setTopState.show(
								function(){
									$G('select',window.setTopState.obj).setseltext(state[JSON.CAMPAIGN_STATUS][0]);
									window.selDom.resall();
								}
							,	function(isSubTrue){
									if(!isSubTrue)return;
									var value=($G('select',window.setTopState.obj).getselvalue())[0]
									;
									if(value>0){
										pause(id,1,value,function(){
											JSON.CAMPAIGN_STATUS=value;
											setJson({campaign:JSON});
										},true);
									}else if(value==0){
										remove(id);
										window.leftTree.userOnClick();
									}
									
								}
							);
						}else if(this.name=='campaignBudget'){
							budgetEdit.show(JSON,function(code,j){
								JSON.CAMPAIGN_BUDGET=j.CAMPAIGN_BUDGET;
								setJson({campaign:JSON});
							});
						}
					});
				}
			;
			if($G.isNaN(data)){
				getPlanById(id,function(json){
					setJson({campaign:json});
				});
			}else{
				setMenuFn.call(this,data);
			}
		};
		
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
		var findWhere=function(){
			var FIND_STATUS=$G('.FIND_STATUS',findDom[0])
			,	FIND_NAME=$G('.FIND_NAME',findDom[0])
			,	FIND_TYPE=$G('.FIND_TYPE',findDom[0])
			,	DATE_TYPE=$G('.DATE_TYPE',findDom[0])
			;
			pageArray['click']=function(pageObj){
				pageArray=pageObj;
				list.sub();
			};
			pageArray['SORT_TYPE']=2;
			pageArray['SORT_COLUMN']=4;
			return {
				clear:function(){
					FIND_STATUS.setseltext('全部状态');
					FIND_NAME.val('请输入计划名称');
					FIND_TYPE[0].checked=false;
					DATE_TYPE.setselvalue(1);
					window.selDom&&window.selDom.resall();
				}
			};
		}();
		return {
			add:add
		,	sub:function(){
				subPlan.sub();
			}
		,	list:function(obj){
				obj=obj||{};
				findWhere.clear();
				pageArray['PAGE_INDEX']=obj.p||pageIni.PAGE_INDEX;
				list.sub();
			}
		,	orderBy:orderBy
		,	selectAll:selectAll
		,	selectId:selectId
		,	showMenu:showMenu
		};
	}();
	
	
})();