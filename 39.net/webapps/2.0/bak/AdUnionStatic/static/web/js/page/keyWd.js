(function(){
	window.keyWd=function(){
		var c_foot=$G('div:c_foot')
		,	listKeyWdEach=$G('#listKeyWdEach')
		,	findDom=$G('#contb6')
		,	keyWdListData={}
		,	model=function(d){
				var m={
						path:'GET_GROUP_KEYWORD'
					,	GROUP_KEYWORD_ID:''								//关键词ID
					,	GROUP_KEYWORD:''								//关键词名称
					,	GROUP_ID:''
					,	CAMPAIGN_ID:''
					,	DISPLAY_STATUS:window.ideaType
					}
				;
				if($G.isNaN(d['GROUP_KEYWORD_ID'])){
					m['path']='ADD_GROUP_KEYWORD';
					delete m['GROUP_KEYWORD_ID'];
				}
				$G.Each(function(i,k){
					m[k]=this+'';
				},d);
				return m;
			}
			//启用/暂停 计划
		,	pause=function(id,type,fn){
				var postData={};
				postData['GROUP_KEYWORD_ID']=id;
				window.ajax({
					path:'DEL_GROUP_KEYWORD'
				,	type:'post'
				,	data:postData
				,	calback:function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							window.altBox.show({
								title:'提示信息'
							,	msg:'数据删除成功！'
							});
							fn&&fn();
						}
					}
				});
			}
			//创建/修改 计划
		,	keyWdAction=function(){
				var addKeyword=$G('#add_keyword')
				,	setJson={}
				,	reset=function(){
						window.keyWdAdd.reset();
					}
					//提交
				,	subKeyWd=window.subAjax('#add_keyword',{
							ckdata:function(data){
								data['GROUP_ID']=setJson.GROUP_ID;
								var d=model(data)
								;
								d['GROUP_KEYWORD']=window.keyWdAdd.get()||'';
								if(!d['GROUP_KEYWORD']){
									window.altBox.show({
										title:'提示信息'
									,	msg:'关键司不能为空'
									});
									return;
								}
								delete d['FIND_TYPE'];
								return d;
							}
						,	sub:'.subKeyWdSave'
						,	callback:function(JSON){
								if(window.wm.msg(JSON.CODE,false)){
									reset();
									keyWdAlt.close();
									list.sub();
								}
							}
					})
					//创建/修改 计划 层
				,	keyWdAlt=window.alertDiv({
						findObj:'#add_keyword'
					,	closeObj:'.close_bnt'
					,	position:'absolute'
					,	move:$G('div:scommon_title',addKeyword[0])
					})
				;
				return {
					show:function(json){
						var startFn=function(){
							setJson=json=json||{};
							keyWdAlt.show(
							''
							,	function(){
									window.gconfirm({
										msg:'您确定要中止添加关键词操作吗？'
									,	fn:function(isTrue){
											if(isTrue){
												keyWdAlt.close();
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
				,	close:keyWdAlt.close
				,	reset:reset
				};
				
			}()
		,	add=function(uid){
				keyWdAction.show({GROUP_ID:uid});
			}
			//删除计划
		,	remove=function(ids){
				pause(ids,2,list.sub);
			}
		;
		
		/***********************获取创意列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	listKeyWdHtmlTitle=$G('#listKeyWdHtmlTitle_'+window.ideaType)
		,	listKeyWdHtmlList=$G('#listKeyWdHtmlList_'+window.ideaType)
		,	listKeyWdHtmlEnd=$G('#listKeyWdHtmlEnd')
		,	list=window.subAjax('#contb6',{
					path:'GET_GROUP_KEYWORD'
				,	sub:'.subKeyWdList .getKeyWd'
				,	findDom:findDom[0]
				,	obj:listKeyWdEach[0]
				,	ckdata:function(data){
						var d=window.wm.setDataList(data,'FIND_NAME','请输入关键词名称',findDom[0],pageArray);
						if(d['FIND_NAME'])d['FIND_TYPE']=2;
						else d['FIND_TYPE']=100;
						
						//报表下载
						if(this.name=='getKeyWd'){
							this.target='_blank';
							var pd=window.wm.postDataIni(d,'GET_REPORT_GROUP_KEYWORD');
							this.href=window.wm.url+'?server='+pd['server'];
							return false;
						}
						
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
						var	n=JSON.LIST.length
						;
						if(n<1){
							var html='<table width="100%"><tr><td colspan="12"><div class="warn">当前关键词列表为空，推广组无法正常投放，请<a>添加关键词</a></div></td></tr></table>';
							if(!$G.isNaN(postdata['query.adgroupId'])){
								listKeyWdEach[0].innerHTML=html;
								$G('a',listKeyWdEach[0])[0].onclick=function(){
									var data=window.leftTree.listUnitByPlan[postdata['query.adgroupId']];
									news.call(data,postdata['query.adgroupId']);
								}
							}else{
								html='<table width="100%"><tr><td colspan="12"><div class="warn">没有符合条件的数据</div></td></tr></table>';
								listKeyWdEach[0].innerHTML=html;
							}
							return false;
						}
						for(var i=0;i<n;i++){
							var	v=JSON.LIST[i]
							,	hStr=listKeyWdHtmlList[0].innerHTML
							;
							keyWdListData[v.GROUP_KEYWORD_ID]=v;
							$G.Each(function(i,val,json){
								var value=this;
								hStr=window.wm.setVal(hStr,val,value);
							},v);
							str+=hStr;
						}
						page.setup(JSON.INFO.COUNT,n,pageArray);
						var endStr=listKeyWdHtmlEnd[0].innerHTML;
						$G.Each(function(){
							var countValue=JSON.INFO[this+'']||0;
							endStr=window.wm.setVal(endStr,this+'',countValue);
						},'COUNT'.split(" "));
						var html='<table width="100%">'+(listKeyWdHtmlTitle[0].innerHTML).toString()+str+endStr.toString()+'</table>';
						listKeyWdEach[0].innerHTML=html;
					
						
						/****************************左则树联动***********************************/
						var leftTreeList=$G('#leftTreeList');
						$G('.treePlanClick',listKeyWdEach[0]).click(function(){
							var tpv=$G(this).getAtt('value')
							,	jsonData=keyWdListData[tpv]
							,	treePlanObj=$G('span:treePlan:'+jsonData.CAMPAIGN_ID,leftTreeList[0])
							;
							window.leftTree.planOnClick((jsonData.CAMPAIGN_ID||''),treePlanObj[0]);
						});
						
						$G('.treeUnitClick',listKeyWdEach[0]).click(function(){
							var tuv=$G(this).getAtt('value')
							,	jsonData=keyWdListData[tuv]
							,	treeUnitObj=$G('li:treeUnit:'+jsonData.GROUP_ID,leftTreeList[0])
							;
							window.leftTree.unitOnClick(treeUnitObj[0],(jsonData.CAMPAIGN_ID||''));
						});
						
						/****************************删除***********************************/
						$G('.del',listKeyWdEach[0]).click(function(){
							var tuv=$G(this).getAtt('value')
							,	jsonData=keyWdListData[tuv]
							;
							window.gconfirm({
								msg:'您确定要删除'+jsonData.GROUP_KEYWORD+'这个关键词？'
							,	fn:function(isTrue){
									if(isTrue){
										remove(tuv);
									}
								}
							});
							
						});
						
						$G('.listKeyWdTd',listKeyWdEach[0]).bd({on:'mousemove',callback:function(){
							$G('.listKeyWdTr',listKeyWdEach[0]).Each(function(){
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
						
						$G('.listKeyWdTool',listKeyWdEach[0]).Each(function(i){
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
				$G('.listKeyWdCheckId',listKeyWdEach[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.listKeyWdCheckId',listKeyWdEach[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listKeyWdCheckAll',listKeyWdEach[0])[0].checked=true;
				else $G('.listKeyWdCheckAll',listKeyWdEach[0])[0].checked=false;
			}
		;
		(function(){
			var findSelId=function(){
				var selObjList=$G('.listKeyWdCheckId',listKeyWdEach[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			};
			$G('#KeyWdToolsDelAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中关键词后再进行删除操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要删除选中的关键词吗？'
					,	fn:function(isTrue){
							if(isTrue){
								remove(s.vlist.join(','));
							}
						}
					});
				}
			});
			
		})();
		
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
			if(this.value=='请输入关键词名称'){
				this.value='';
			}
		}).change(function(){
			if(this.value==''){
				this.value='请输入关键词名称';
			}
		});
		var findWhere=function(){
			var FIND_NAME=$G('.FIND_NAME',findDom[0])
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
					FIND_NAME.val('请输入关键词名称');
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
		};
	}();
	
})();