window.headerEnd(function(){
	var contf1=$G('#contf1')
	;
	$G('.balance',contf1[0]).html(window.wm.data['user']['BALANCE']);
	window.rightToolPlanMsg=function(){
		var campaignBalance=$G('.campaignBalance',contf1[0])
		,	effectiveCampaignCount=$G('.effectiveCampaignCount',contf1[0])
		;
		return {
			setPlanBudSum:function(balanceVal){
				campaignBalance.html(balanceVal);
			}
		,	setPlanCount:function(balanceVal){
				effectiveCampaignCount.html(balanceVal);
			}
		};
	}();
	
	var	rightToolList=$G('.rightToolList')
	,	pagelist=$G('.pagelist')
	;
	window.rightToolListOnClick=function(json){
			pagelist.none();
			rightToolList.style({'class':''});
			var obj=$G(this)
			,	value=obj.getAtt('value')
			,	fn=obj.getAtt('forfn');
			;
			
			$G.Each(function(){
				var contb=$G('#'+this);
				if(contb.length<1)return;
				if(('contb'+value)==this)$G('#'+this)[0].style.display='';
				else $G('#'+this)[0].style.display='none';
			},'contb1 contb2 contb3 contb4 contb5 contb6'.split(' '));
			
			obj.setAtt('class','u_curr');
			if(!$G.isNaN(fn)){
				fn=eval(fn);
				if(!json)json={};
				json.planId=window.leftTree.selectPlan();
				json.unitId=window.leftTree.selectUnit();
				fn(json);
			}
		}
	;
	rightToolList.click(window.rightToolListOnClick);
	rightToolList.Each(function(i){
		var obj=$G(this)
		,	v=obj.getAtt('value')
		;
		if(window.ideaType==2 && v==3){
			this.parentNode.style.visibility="hidden";
		}else if(window.ideaType==1 && (v==4 || v==5)){
			this.parentNode.style.visibility="hidden";
		}else this.parentNode.style.display='';
	});
	var rtli=0;
	if($G.getid('unit'))rtli=1;
	if(rtli==1)window.rightToolListOnClick.call(rightToolList[0]);
	window.rightToolListOnClick.call(rightToolList[rtli]);
	
	//	顶部信息 状态修改
	window.setTopState=function(){
			var topTateEditfn=window.alertDiv({
					findObj:'#stateEdit'
				,	closeObj:'.close'
				})
			;
			$G('.sub',topTateEditfn.obj).click(function(){
				topTateEditfn.none(true);
			});
			return {
				show:topTateEditfn.show
			,	close:topTateEditfn.close
			,	obj:topTateEditfn.obj
			};
		}()
	;
	//启用/暂停 计划
	window.pause=function(postData,fn){
		window.ajax({
			path:'BATCH_OPERATION'
		,	type:'post'
		,	data:postData
		,	calback:function(JSON){
				if(window.wm.msg(JSON.CODE,false)){
					window.altBox.show({
						title:'提示信息'
					,	msg:'数据'+function(){
							var t=postData['STATUS']==2?'暂停':'启动';
							if(postData['BATCH_TYPE']==2)
								t='删除'
							return t;
						}()+'成功！'
					});
					fn&&fn();
				}
			}
		});
	};
	var fn=function(pObj){
		$G('.newMap',pObj).show();
	};
	$G('.addPlan').click(function(){
		window.plan.add(function(planJson){
			window.units.add(planJson.CAMPAIGN_ID,function(unitJson){
				if(window.ideaType==2)
					window.testIdea.add(unitJson.GROUP_ID,null,fn);
				else
					window.picIdea.add(unitJson.GROUP_ID,null,fn);
			}
			,	fn
			,	planJson
			);
		});
	});
	
	window.copyIdea=function(){
		var ideasCopy=$G('.ideasCopy')
		,	ideasPaste=$G('.ideasPaste')
		,	setCopyList=function(){}
		,	addListPU=function(){
				var idAlert=$G('#c_paste')
				,	selectDoms=$G('select',idAlert[0])
				,	planListDom=$G(selectDoms[0])
				,	unitListDom=$G(selectDoms[1])
				,	alertObj=window.alertDiv({
						findObj:'#c_paste'
					,	closeObj:'.close_bnt'
					,	lock_back:'#BBBBBB'
					,	move:$G('div:notice_title',idAlert[0])
					})
				,	setUnitList=function(id){
						unitListDom.delallsel();
						$G.Each(function(){
							unitListDom.addsel(this.adgroupName,this.adgroupId);
						},window.leftTree.planListJson[id]);
						if(window.leftTree.selectUnit()){
							unitListDom.setselvalue(window.leftTree.selectUnit());
						}
						window.selDom&&window.selDom.resall();
					}
				;
				setCopyList=function(listPlan){
					planListDom.delallsel();
					$G.Each(function(i,k){
						var pid=this+'';
						planListDom.addsel(this.campaignName,k);
						if(i==0){
							setUnitList(k);
						}
					},listPlan);
					window.selDom&&window.selDom.resall();
				};
				var listCountFn=function(obj){
						setUnitList(obj.value);
					}
				,	listCountName='window.copyIdeas'+($G.uuidFast().replace(/-/ig,''))
				;
				eval(listCountName+'='+listCountFn);
				planListDom.setAtt('onchange',listCountName+'(this);');
				var ideasleftTreeList=$G('#leftTreeList');
				var subIds=''
				,	subFrom=window.subAjax('#c_paste',{
						path:'COPY_CREATIVE'
					,	sub:'.ideasPaste'
					,	findDom:idAlert[0]
					,	ckdata:function(data){
							data['CREATIVE_TYPE']=window.ideaType;
							data['ID']=subIds;
							if(!data['CAMPAIGN_ID']){
								window.msg.call(planListDom[0],{msg:'请选择有效推广计划'});
								return ;
							}
							if(!data['GROUP_ID']){
								window.msg.call(unitListDom[0],{msg:'请选择有效推广组'});
								return ;
							}
							return data;
						}
					,	callback:function(){
							var planId=this.postdata['CAMPAIGN_ID']
							,	unitId=this.postdata['GROUP_ID']
							,	treeUnitObj=$G('li:treeUnit:'+unitId,ideasleftTreeList[0])
							;
							window.leftTree.unitOnClick(treeUnitObj[0],planId);
							addListPU.close();
						}
					});
				return {
					show:function(o){
						o=o||{};
						if(window.leftTree.selectPlan()){
							planListDom.setselvalue(window.leftTree.selectPlan());
							setUnitList(window.leftTree.selectPlan());
						}
						window.selDom&&window.selDom.resall();
						alertObj.show(null,function(){
							
						});
					}
				,	setId:function(ids){
						subIds=ids;
					}
				,	close:function(){
						alertObj.close();
					}
				};
			}()
		;
		ideasCopy.click(function(){
			var s='';
			if(window.ideaType==2){
				s=window.testIdea.findSelId();
			}else{
				s=window.picIdea.findSelId();
			}
			if(s.n<1){
				window.altBox.show({
					title:'提示信息'
				,	msg:'请在列表中选中创意后再进行复制'
				});
			}else{
				addListPU.setId(s.vlist.join(','));
				addListPU.show();
			}
			
		});
		return {
			setCopyList:setCopyList
		};
	}();
});