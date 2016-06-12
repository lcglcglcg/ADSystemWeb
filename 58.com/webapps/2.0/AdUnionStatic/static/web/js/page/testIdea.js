(function(){
	window.testIdea=function(){
		var c_foot=$G('div:c_foot')
		,	listTestIdeasEach=$G('#listTestIdeasEach')
		,	findDom=$G('#contb4')
		,	add_preview=$G('#add_preview')
		,	testIdeaListData={}
		,	state={
				'1':['有效','green']
			,	'2':['不宜推广','orange']
			,	'3':['暂停','orange']
			,	'4':['审核中','orange']
			,	'5':['审核拒绝','red']
			,	'6':['已删除','red']
			}
		,	model=function(d,isTrue){
				var m={
						path:'SET_CREATIVE'
					,	CREATIVE_ID:''								//创意ID
					,	CAMPAIGN_ID:''
					,	CAMPAIGN_NAME:''							//计划名称
					,	GROUP_ID:''
					,	GROUP_NAME:''								//组名称
					,	CREATIVE_STATUS:''							//1有效 2暂停
					,	CREATIVE_NAME:''							//创意NAME
					,	CREATIVE_DESCRIPTION:''						//描述
					,	CREATIVE_DESTINATION_URL:''					//访问URL
					,	CREATIVE_DISPLAY_URL:''						//显示URL
					,	CREATIVE_APPEND_ID:''						//附加创意ID
					,	MOBILE_DESTINATION_URL:''					//移动访问URL
					,	MOBILE_DISPLAY_URL:''						//移动显示URL
					,	ACCOUNT_ID:window.wm.data['user']['ACCOUNT_ID']  
					}
				,	updateCode='CREATIVE_STATUS,CREATIVE_NAME,CREATIVE_DESCRIPTION,CREATIVE_DESTINATION_URL,CREATIVE_DISPLAY_URL,CREATIVE_APPEND_ID,MOBILE_DESTINATION_URL,MOBILE_DISPLAY_URL'.split(',')
				;
				
				if($G.isNaN(d['CREATIVE_ID'])){
					m['path']='ADD_CREATIVE';
					delete m['CREATIVE_STATUS'];
					delete m['CREATIVE_ID'];
					delete d['CREATIVE_ID'];
					delete m['UPDATE_TYPE'];
				}else if(isTrue){
					var json=testIdeaListData[d['CREATIVE_ID']]
					;
					if(json){
						$G.Each(function(){
							var key=this+'';
							if(key!='CAMPAIGN_ID' && key!='GROUP_ID' && d[key]==json[key]){
								delete d[key];
							}
						},updateCode);
						m['path']='SET_CREATIVE';
						var stepVal=1
						,	updateType=''
						;
						$G.Each(function(){
							if(!$G.isNaN(d[this+''])){
								updateType=Number(updateType||0)+Number(stepVal);
							}
							stepVal=stepVal*2;
						},updateCode);
						m.UPDATE_TYPE=updateType;
					}
				}
				
				$G.Each(function(i,k){
					m[k]=this+'';
				},d);
				return m;
			}
			/************************控制咨询、挂号***********************************/
			,	guaHaoIni=function(hgJson,isNone){
					if(!hgJson)hgJson={};
					var headerJson=window.wm.data['user']
					,	webimObj=$G('.webim',this)
					,	guahaoTokenObj=$G('.guahaoToken',this)
					,	ghVal=function(sv){
							var sval=0;
							if($G.isNaN(sv)){
							}else if(sv<2.5){
								sval=20;
							}else if(sv>=2.5 && sv<3.5){
								sval=30;
							}else if(sv>=3.5 && sv<4.5){
								sval=40;
							}else if(sv>=4.5 && sv<5.5){
								sval=50;
							}else if(sv>=5.5 && sv<6.5){
								sval=60;
							}else if(sv>=6.5 && sv<7.5){
								sval=70;
							}else if(sv>=7.5 && sv<8.5){
								sval=80;
							}else if(sv>=8.5 && sv<9.5){
								sval=90;
							}else if(sv>=9.5){
								sval=100;
							}
							return sval;
						}(hgJson.starScore||'')
					;
					
					webimObj.Each(function(){
						if($G.isNaN(headerJson.WEBIM)){
							if(isNone)
								this.style.display='none';
						}else{
							this.style.display='';
						}
					});
					guahaoTokenObj.Each(function(){
						if($G.isNaN(headerJson.guahaoToken)){
							if(isNone)
								this.style.display='none';
						}else{
							this.style.display='';
							var Gobj=$G(this)
							,	keygh=Gobj.getAtt('keygh')
							;
							if($G.hasProp(this,'keygh') && !$G.isNaN(keygh)){
								this.innerHTML=hgJson[keygh];
							}
							this.innerHTML=(this.innerHTML+'').replace(/{starScore}/ig,ghVal);
						}
						
					});
			}
		,	selectAppend={}
		,	appendIdeaListData={}
		,	cyDisplay=function(){}
			//创建/修改 计划
		,	ideaAction=function(){
				var idea=$G('#step3_test')
				,	addNewMobile_list=$G('#addNewMobile_list')
				,	addNewMobile=$G('#addNewMobile')
				,	mobileInput=$G('.MOBILE_DESTINATION_URL .MOBILE_DISPLAY_URL',idea[0])
				,	reset=function(){
						$G('.CREATIVE_NAME .CREATIVE_DESCRIPTION .CREATIVE_DESTINATION_URL .CREATIVE_DISPLAY_URL').Each(function(){
							this.value='';
						});
						var json={};
						json['testTitle']='这里显示您的推广标题';
						json['testDescription1']='这里显示您的创意描述';
						json['testDisplayUrl']='wangmeng.haomeit.com';
						json['appendList']='<i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览1</i> | <i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览2</i> | <i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览3</i> | <i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览4</i> | <i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览5</i>';
						$G('.testTitle .testDescription1 .testDisplayUrl .appendList',idea[0]).Each(function(){
							var name=$G(this).getAtt('name')
							;
							this.innerHTML=json[name]||'';
						});
						addNewMobile_list.none();
						addNewMobile.setAtt('class','tianjia');
						mobileInput.Each(function(){
							this.value='';
						});
					}
					//提交验证
				,	subFunction=function(){}
				,	appendId=''
				,	appendDispUrl=''
				,	subIdea=window.subAjax('#step3_test',{
							ckdata:function(data){
								$G('.ckMsg',idea[0]).none();
								
								var mod=model(data,true);
								if(mod['WEB_IM'])
									mod['WEB_IM']='http://'+(mod['WEB_IM'].replace(/(http:\/\/)/ig,""));
								if(mod['DISPLAY_URL'])
									mod['DISPLAY_URL']='http://'+(mod['DISPLAY_URL'].replace(/(http:\/\/)/ig,""));
								if(mod['DESTINATION_URL'])
									mod['DESTINATION_URL']='http://'+(mod['DESTINATION_URL'].replace(/(http:\/\/)/ig,""));
								if(mod['IMG0_URL'])
									mod['IMG0_URL']='http://'+(mod['IMG0_URL'].replace(/(http:\/\/)/ig,""));
								if(mod['IMG1_URL'])
									mod['IMG1_URL']='http://'+(mod['IMG1_URL'].replace(/(http:\/\/)/ig,""));
								if(mod['IMG2_URL'])
									mod['IMG2_URL']='http://'+(mod['IMG2_URL'].replace(/(http:\/\/)/ig,""));
								if(mod['IMG3_URL'])
									mod['IMG3_URL']='http://'+(mod['IMG3_URL'].replace(/(http:\/\/)/ig,""));
								if(mod['IMG4_URL'])
									mod['IMG4_URL']='http://'+(mod['IMG4_URL'].replace(/(http:\/\/)/ig,""));
								if(mod['IMG5_URL'])
									mod['IMG5_URL']='http://'+(mod['IMG5_URL'].replace(/(http:\/\/)/ig,""));
								if(mod['IMG6_URL'])
									mod['IMG6_URL']='http://'+(mod['IMG6_URL'].replace(/(http:\/\/)/ig,""));
								return mod;
							}
						,	sub:'.subIdeaSave .subIdeaSaveGoTo'
						,	callback:function(JSON){
								if(window.wm.msg(JSON.CODE,false)){
									reset();
									subFunction(JSON,this.postdata);
									if(this.subObj.name=='subIdeaSave'){
										ideaAlt.close();
									}
									list.sub();
								}
							}
					})
					//创建/修改 计划 层
				,	ideaAlt=window.alertDiv({
						findObj:'#step3_test'
					,	closeObj:'.close'
					,	position:'absolute'
					,	move:$G('div:scommon_title',idea[0])
					})
				,	appendList=$G('.appendList',idea[0])
				,	domShow=function(type,JSON){
						var test={
								'edit':{
									'altIdeaTitle':'修改创意'
								}
							,	'add':{
									'altIdeaTitle':'新建创意'
								}
							}
						,	html=test[type]
						,	none=type=='add'?'':'none'
						;
						$G('.altIdeaTitle .altIdeaDaoHang',idea[0]).Each(function(){
							var gObj=$G(this)
							,	name=gObj.getAtt('name')
							;
							gObj.html(html[name]);
							if(name=='altIdeaDaoHang')
								gObj[0].style.display=none;
						});
						$G('.CREATIVE_ID .CAMPAIGN_ID .GROUP_ID .CREATIVE_NAME .CREATIVE_DESCRIPTION .CREATIVE_DESTINATION_URL .CREATIVE_DISPLAY_URL .MOBILE_DESTINATION_URL .MOBILE_DISPLAY_URL',idea[0]).Each(function(){
							var gObj=$G(this)
							,	name=gObj.getAtt('name')
							;
							this.value=JSON[name]||'';
						});
						$G('.TYPE',idea[0]).Each(function(){
							var obj=this;
							if(this.value==JSON.TYPE)this.checked=true;
						});
						if(type=='add')return;
						$G('.testTitle .testDescription1 .testDisplayUrl',idea[0]).Each(function(){
							var name=$G(this).getAtt('name')
							,	key='CREATIVE_NAME'
							,	jsonK=function(){
									if(name=='testDescription1')key='CREATIVE_DESCRIPTION';
									if(name=='testDisplayUrl')key='CREATIVE_DISPLAY_URL';
								}()
							;
							if(JSON[key])
								this.innerHTML=JSON[key];
						});
						appendDispUrl='<i class="zi_link_address"><a target="_blank">'+JSON.CREATIVE_DISPLAY_URL+'</a></i>';
						if(JSON.MOBILE_DISPLAY_URL || (JSON.MOBILE_DESTINATION_URL+'').replace(/(http:\/\/)/g,"")){
							addNewMobile_list.show();
							addNewMobile.setAtt('class','tianjia_j');
						}else{
							addNewMobile_list.none();
							addNewMobile.setAtt('class','tianjia');
							mobileInput.Each(function(){
								this.value='';
							});
						}
					}	
				;
				cyDisplay=function(value){
					if($G.isNaN(value)){
						if(appendDispUrl)appendList.html(appendDispUrl);
						return;
					}
					var appendJson=appendIdeaListData[value]
					,	setValue=appendJson?window.appendIdea.getContent(appendJson.APPEND_CONTENT,'<i style="font-style:normal;color:#261CDC; text-decoration:underline;">{title}</i>'):''
					;
					appendList.html(setValue);
				}
				return {
					show:function(json,fn,editfn){
						var startFn=function(){
							var closeMsg='您确定要中止修改创意操作吗？'
							,	subIdeaSaveGoTo=$G('.subIdeaSaveGoTo',idea[0])
							;
							json=json||{};
							json=model(json);
							if(json && $G.isNaN(json.CREATIVE_ID)){
								closeMsg='您确定要中止新建创意操作吗？';
								domShow('add',json);
								$G('.newMap',idea[0]).none();
								
								subIdeaSaveGoTo.show();
								reset();
							}else{
								domShow('edit',json);
								subIdeaSaveGoTo.none();
							}
							if(fn)subFunction=fn;
							editfn&&editfn(idea[0]);
							ideaAlt.show(
							''
							,	function(){
									window.gconfirm({
										msg:closeMsg
									,	fn:function(isTrue){
											if(isTrue){
												ideaAlt.close();
											}
										}
									});
								}
							,	''
							,	true
							);
						}()
						;
						
					}
				,	close:ideaAlt.close
				,	reset:reset
				};
				
			}()
		,	add=function(uid,fn,endfn){
				ideaAction.show({GROUP_ID:uid},fn,endfn);
			}
		,	edit=function(json,fn){
				json=json||{};
				if($G.isNaN(json.CREATIVE_ID))return;
				ideaAction.show(json,fn);
			}
			//启用/暂停 计划
		,	pause=function(id,t,v,fn){
				var m={
					'ID_TYPE':3
				,	'ID':id
				,	'BATCH_TYPE':t
				,	'STATUS':v
				};
				window.pause(m,function(){
					list.sub();
					fn&&fn();
				});
			}
			/*********************计暂停/启用 效果***********************************/
		,	ideaPause=function(JSON){
				var obj=this
				,	css=$G(obj).getAtt('class')
				,	isPause=function(){
						return css=='start_img';
					}()
				,	msg=isPause?'您确定暂停创意{ideasName}吗!':'您确定启动创意{ideasName}吗!'
				;
				
				window.gconfirm({
					msg:msg.replace(/{ideasName}/,'【'+JSON.CREATIVE_NAME+'】')
				,	fn:function(isTrue){
						if(isTrue){
							pause(JSON.CREATIVE_ID,1,(isPause?2:1));
						}
					}
				});
			}
			//删除计划
		,	remove=function(ids){
				pause(ids,2,'');
			}
		;
		
		/***********************获取创意列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	listTestIdeasHtmlTitle=$G('#listTestIdeasHtmlTitle')
		,	listTestIdeasHtmlList=$G('#listTestIdeasHtmlList')
		,	listTestIdeasHtmlEnd=$G('#listTestIdeasHtmlEnd')
		,	list=window.subAjax('#contb4',{
					path:'GET_CREATIVE'
				,	sub:'.subIdeasList .subListGl'
				,	findDom:findDom[0]
				,	obj:listTestIdeasEach[0]
				,	ckdata:function(data){
						var d=window.wm.setDataList(data,'CREATIVE_NAME','请输入创意标题',findDom[0],pageArray);
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
						try{
							var	n=JSON.LIST.length
							;
							if(n<1){
								var html='<table width="100%"><tr><td colspan="12"><div class="warn">当前创意列表为空，推广组无法正常投放，请<a>添加创意</a></div></td></tr></table>';
								if(!$G.isNaN(postdata['query.adgroupId'])){
									listTestIdeasEach[0].innerHTML=html;
									$G('a',listTestIdeasEach[0])[0].onclick=function(){
										var data=window.leftTree.listUnitByPlan[postdata['query.adgroupId']];
										news.call(data,postdata['query.adgroupId']);
									}
								}else{
									html='<table width="100%"><tr><td colspan="12"><div class="warn">没有符合条件的数据</div></td></tr></table>';
									listTestIdeasEach[0].innerHTML=html;
								}
								return false;
							}
							for(var i=0;i<n;i++){
								var	v=JSON.LIST[i]
								,	hStr=listTestIdeasHtmlList[0].innerHTML
								;
								
								testIdeaListData[v.CREATIVE_ID]=v;
								$G.Each(function(i,val,json){
									var value=this;
									hStr=window.wm.setVal(hStr,val,value);
								},v);
								str+=hStr;
							}
							page.setup(JSON.INFO.CREATIVE_COUNT,n,pageArray);
							var html='<table width="100%">'+(listTestIdeasHtmlTitle[0].innerHTML).toString()+str+'</table>';
							listTestIdeasEach[0].innerHTML=html;
						}catch(e){alert('testIdea:'+e);}
						
						/****************************左则树联动***********************************/
						var ideasleftTreeList=$G('#leftTreeList');
						$G('.treePlanClick',listTestIdeasEach[0]).click(function(){
							var tpv=$G(this).getAtt('value')
							,	ideaObjJson=testIdeaListData[tpv]
							,	treePlanObj=$G('span:treePlan:'+ideaObjJson.CAMPAIGN_ID,ideasleftTreeList[0])
							;
							window.leftTree.planOnClick((ideaObjJson.CAMPAIGN_ID||''),treePlanObj[0]);
						});
						
						$G('.treeUnitClick',listTestIdeasEach[0]).click(function(){
							var tuv=$G(this).getAtt('value')
							,	ideaObjJson=testIdeaListData[tuv]
							,	treeUnitObj=$G('li:treeUnit:'+ideaObjJson.GROUP_ID,ideasleftTreeList[0])
							;
							window.leftTree.unitOnClick(treeUnitObj[0],(ideaObjJson.CAMPAIGN_ID||''));
						});
						
						/****************************编辑创意***********************************/
						$G('.edit',listTestIdeasEach[0]).click(function(){
							edit.call(this,testIdeaListData[$G(this).getAtt('value')]);
						});
						/****************************启用/暂停***********************************/
						$G('.pause',listTestIdeasEach[0]).click(function(){
							ideaPause.call(this,testIdeaListData[$G(this).getAtt('value')]);
						});
						
						$G('.listTestIdeaTd',listTestIdeasEach[0]).bd({on:'mousemove',callback:function(){
							$G('.listTestIdeaTr',listTestIdeasEach[0]).Each(function(){
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
						
						$G('.listTestIdeasTool',listTestIdeasEach[0]).Each(function(i){
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
					}
				});
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
				$G('.listTestIdeasCheckId',listTestIdeasEach[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.listTestIdeasCheckId',listTestIdeasEach[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listTestIdeasCheckAll',listTestIdeasEach[0])[0].checked=true;
				else $G('.listTestIdeasCheckAll',listTestIdeasEach[0])[0].checked=false;
			}
		;
		var findSelId=function(){
			var selObjList=$G('.listTestIdeasCheckId',listTestIdeasEach[0])
			,	cv=selObjList.checked(true)
			,	cn=cv.length
			;
			return {
				objlist:selObjList
			,	vlist:cv
			,	n:cn
			};
		};
		$G('#testIdeasToolsDelAll').click(function(){
			var s=findSelId();
			if(s.n<1){
				window.altBox.show({
					title:'提示信息'
				,	msg:'请在列表中选中创意后再进行删除操作'
				});
			}else{
				window.gconfirm({
					msg:'您确定要删除选中的创意吗？'
				,	fn:function(isTrue){
						if(isTrue){
							remove(s.vlist.join(','));
						}
					}
				});
			}
		});
		$G('#testIdeasToolsSotpAll').click(function(){
			var s=findSelId();
			if(s.n<1){
				window.altBox.show({
					title:'提示信息'
				,	msg:'请在列表中选中创意后再进行暂停操作'
				});
			}else{
				window.gconfirm({
					msg:'您确定要暂停选中的创意吗？'
				,	fn:function(isTrue){
						if(isTrue){
							pause(s.vlist.join(','),1,2);
						}
					}
				});
			}
		});
		$G('#testIdeasToolsStartAll').click(function(){
			var s=findSelId();
			if(s.n<1){
				window.altBox.show({
					title:'提示信息'
				,	msg:'请在列表中选中创意后再进行启动操作'
				});
			}else{
				window.gconfirm({
					msg:'您确定要启用选中的创意吗？'
				,	fn:function(isTrue){
						if(isTrue){
							pause(s.vlist.join(','),1,1);
						}
					}
				});
			}
		});
		
		var addNewMobile_list=$G('#addNewMobile_list');
		$G('#addNewMobile').click(function(){
			var obj=$G(this)
			,	c=obj.getAtt('class')
			;
			if(c=='tianjia'){
				obj.setAtt('class','tianjia_j');
				addNewMobile_list.show();
			}else{
				obj.setAtt('class','tianjia');
				addNewMobile_list.none();
			}
		});
		/******************数据报告日期范围提交****************************/
		$G('.DATE_TYPE',findDom[0])[0].onchange=function(){
			list.sub();
		};
		/******************查询名称效果************************************/
		$G('.FIND_NAME',findDom[0]).click(function(){
			if(this.value=='请输入创意标题'){
				this.value='';
			}
		}).change(function(){
			if(this.value==''){
				this.value='请输入创意标题';
			}
		});
		var findWhere=function(){
			var FIND_STATUS=$G('.FIND_STATUS',findDom[0])
			,	FIND_NAME=$G('.FIND_NAME',findDom[0])
			,	FIND_TYPE=$G('.FIND_TYPE',findDom[0])
			,	DATE_TYPE=$G('.DATE_TYPE',findDom[0])
			;
			pageArray['PAGE_INDEX']=1;
			pageArray['CAMPAIGN_ID']='';
			pageArray['GROUP_ID']='';
			pageArray['click']=function(pageObj){
				pageArray=pageObj;
				list.sub();
			};
			pageArray['SORT_TYPE']=2;
			pageArray['SORT_COLUMN']=6;
			return {
				clear:function(){
					FIND_STATUS.setseltext('全部状态');
					FIND_NAME.val('请输入创意标题');
					FIND_TYPE[0].checked=false;
					DATE_TYPE.setselvalue(1);
					window.selDom&&window.selDom.resall();
				}
			};
		}();
		
		
		return {
			list:function(obj){
				obj=obj||{};
				findWhere.clear();
				pageArray['PAGE_INDEX']=obj.p||pageIni.PAGE_INDEX;
				pageArray['CAMPAIGN_ID']=obj.planId||'';
				pageArray['GROUP_ID']=obj.unitId||'';
				list.sub();
			}
		,	add:add
		,	orderBy:orderBy
		,	selectAll:selectAll
		,	selectId:selectId
		,	cyDisplay:cyDisplay
		,	findSelId:findSelId
		};
	}();
	
})();