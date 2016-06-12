(function(){
	window.tree=function(){
		return {
			right:function(){
				document.getElementById("change_width").className="c_right_new";
				document.getElementById("left_hid").style.display="";
				document.getElementById("lf_nav").style.display=document.getElementById("left_dis").style.display="none";
			}
		,	left:function(){
				document.getElementById("change_width").className="c_right";
				document.getElementById("left_hid").style.display="none";
				document.getElementById("lf_nav").style.display=document.getElementById("left_dis").style.display="";
			}
		};
	}();
	window.leftTree=function(){
		var res=function(){}
		,	listPlan={}
		,	listUnit={}
		,	planListJson={}
		,	listUnitByPlan={}
		,	ListOpenIds={}
		,	selectPlan=''
		,	selectUnit=''
		,	show=function(o){
				o=o||{};
				window.ajax({
					path:'GET_SPERAD_LIST'
				,	data:{
						DISPLAY_STATUS:window.ideaType
					}
				,	calback:function(JSON){
						var ps=''
						,	leftTreeList=$G('#leftTreeList')
						;
						if(!window.wm.msg(JSON.CODE,false)){
							leftTreeList[0].innerHTML=ps;
							return;
						}
						if($G.isNaN(JSON.CAMPAIGN_LIST)){
						}else{
							$G.Each(function(){
								ps+=planHtml;
								var planJson={
									campaignId:this.CAMPAIGN_ID
								,	campaignName:this.CAMPAIGN_NAME
								,	campaignState:this.CAMPAIGN_STATUS
								};
								if(planJson.campaignState!='1'){
									ps=ps.replace(/{planNamePic}/,listPic[0]);
								}else{
									ps=ps.replace(/{planNamePic}/,listPic[2]);
								}
								ps=ps.replace(/{planNamePic}/,'').replace(/{planState}/,planJson.campaignState).replace(/{planName}/,planJson.campaignName);
								
								listPlan[planJson.campaignId]=planJson;
								
								var us='';
								if($G.isNaN(this.GROUP_LIST)){
									ps=ps.replace(/{untiList}/,'').replace(/{UnitCount}/,'0');
								}else{
									$G.Each(function(){
										var unitJson={
												adgroupId:this.GROUP_ID
											,	adgroupName:this.GROUP_NAME
											,	adgroupState:this.GROUP_STATUS
											}
										,	tmpUs=untiHtml;
										;
										if(unitJson.adgroupState=='2'){
											tmpUs=tmpUs.replace(/{unitNameImg}/,listPic[4]);
										}else{
											tmpUs=tmpUs.replace(/{unitNameImg}/,listPic[5]);
										}
										us+=tmpUs.replace(/{unitName}/,unitJson.adgroupName).replace(/{unitId}/ig,unitJson.adgroupId);
										listUnit[this.adgroupId]=unitJson;
										if(!planListJson[planJson.campaignId])planListJson[planJson.campaignId]=new Array();
										planListJson[planJson.campaignId].push(unitJson);
										listUnitByPlan[this.adgroupId]=planJson;
									},this.GROUP_LIST);
									ps=ps.replace(/{untiList}/,us).replace(/{UnitCount}/,this.GROUP_LIST.length);
								}
								ps=ps.replace(/{planId}/ig,planJson.campaignId);
								
							},JSON.CAMPAIGN_LIST);
						}
						leftTreeList.html(ps);
						clearSelect(o);
						(function () {
							try {
								if(window.copyIdea)
									window.copyIdea.setCopyList(listPlan);
								else setTimeout(arguments.callee, 0);
							}catch (err) {}    
						})();
						
					}
				});
			}
		,	selectCssName='HaveBg'
		,	listPic=[
						'<img src="/static/ads_c_2.0/web/images/p/li6_new.gif" />'//关闭文件侠
					,	'<img src="/static/ads_c_2.0/web/images/p/li2_new.gif" />'//打开文件侠
					,	'<img src="/static/ads_c_2.0/web/images/p/li7_new.gif" />'//暂停关闭文件侠
					,	'<img src="/static/ads_c_2.0/web/images/p/li4_new.gif" />'//暂停打闭文件侠
					,	'<img src="/static/ads_c_2.0/web/images/p/li5_new.gif" />'//暂停单元
					,	'<img src="/static/ads_c_2.0/web/images/p/li8_new.gif" />'//有效单元
			]
		,	planHtml=' <div class="ul">\
						<div class="ul_li_img" name="cssPlan" id="planId_{planId}" ><a><span id="fliePic{planId}" onclick="window.leftTree.planListOpen(\'{planId}\',\'{planState}\',this);">{planNamePic}</span><span name="leftTreePlanText" class="nav_name" treePlan="{planId}" onclick="window.leftTree.planOnClick(\'{planId}\',this);">{planName}<s class="red">({UnitCount})</s></span></a></div>\
						<ul class="ul_con" id="planUnitlist{planId}" style="display:none;" >{untiList}</ul>\
					  </div>'
		,	untiHtml='<li name="cssUnit" id="unitId_{unitId}" treeUnit="{unitId}" class="ul_li_new ul_li" onclick="window.leftTree.unitOnClick(this,\'{planId}\');"><a>{unitNameImg}<span class="nav_name">{unitName}</span></a></li>'
		,	str=''
		,	planListOpen=function(id,state,obj){				
				var planUnitlist=$G('#planUnitlist'+id)
				,	fliePic=$G('#fliePic'+id)
				;
				obj=obj||fliePic[0];
				state=state||listPlan[id].campaignState;
				if($G.isNaN(planUnitlist[0].style.display)){
					ListOpenIds[id]=false;
					planUnitlist[0].style.display='none';
					if(state!='1')
						obj.innerHTML=listPic[0];
					else
						obj.innerHTML=listPic[2];
				}else{
					ListOpenIds[id]=true;
					planUnitlist[0].style.display='';
					if(state!='1')
						obj.innerHTML=listPic[1];
					else obj.innerHTML=listPic[3];
				}
			}
		,	planListOpenBlack=function(id){
				var planUnitlist=$G('#planUnitlist'+id)
				,	obj=$G('#fliePic'+id)[0]
				,	state=listPlan[id].campaignState
				;
				if(planUnitlist.length<1)return;
				planUnitlist[0].style.display='';
				if(state!='1')
					obj.innerHTML=listPic[1];
				else obj.innerHTML=listPic[3];
			}
		,	planListOpenBlackAll=function(){
				for(var openK in ListOpenIds){
					if(ListOpenIds[openK]){
						planListOpenBlack(openK);
					}
				}
			}
		,	clearSelect=function(o,display){
				o=o||{};
				o.planId=o.planId||selectPlan;
				o.unitId=o.unitId||selectUnit;
				selectPlan=o.planId||'';
				selectUnit=o.unitId||'';
				var setCssObj='';
				$G('.cssPlan',$G('#leftTreeList')[0]).Each(function(){
					var pObj=$G(this)
					,	id=this.id.replace(/planId_/ig,'')
					;
					if(display)
						this.parentNode.style.display='';
					if($G.isNaN(o.unitId) && !$G.isNaN(o.planId) && o.planId==id){
						pObj.setAtt('class','ul_li_img '+selectCssName);
						setCssObj=$G('#planId_'+o.planId);
						window.plan.showMenu.call(toolEditMenu(1),o.planId);
					}else{
						pObj.setAtt('class','ul_li_img');
					}
				});
				$G('.cssUnit',$G('#leftTreeList')[0]).Each(function(){
					var uObj=$G(this)
					,	id=this.id.replace(/unitId_/ig,'')
					;
					if(display)
						this.style.display='';
					if(!$G.isNaN(o.unitId) && o.unitId==id){
						uObj.setAtt('class',uObj.getAtt('class').replace(selectCssName,'')+' '+selectCssName);
						var json=listPlan[o.planId]
						,	unitList=$G('#planUnitlist'+o.planId)
						;
						unitList[0].style.display='none';
						planListOpen(o.planId,json.campaignState,$G('span',$G('.cssPlan',uObj[0].parentNode.parentNode)[0])[0]);
						setCssObj=$G('#unitId_'+o.unitId);
						window.units.showMenu.call(toolEditMenu(2),o.unitId);
					}else{
						var ucss=(uObj.getAtt('class')+'').replace((new RegExp(selectCssName,'ig')),'')+'';
						uObj.setAtt('class',$G.TrimTest(ucss));
					}
					
				});
				setCssObj&&setCssObj.setAtt('class',setCssObj.getAtt('class')+' '+selectCssName);
				planListOpenBlackAll();
			}
		,	toolEditMenu=function(k){
				var obj='';
				$G('.toolEditMenu').Each(function(i){
					if(i==k){
						obj=this;
						this.style.display='';
					}else{
						this.style.display='none';
					}
				});
				return obj;
			}
		,	rightToolMenu=function(k){
				var obj=''
				,	rightToolList=$G('.rightToolList')
				;
				rightToolList.Each(function(i){
					if(i>=k){
						if(i==k)obj=this;
						this.parentNode.style.display='';
					}else{
						this.parentNode.style.display='none';
					}
					if(window.ideaType==2 && i==3){
						obj=k==i?$G('.rightToolList')[3]:obj;
						$G('.rightToolList')[i].parentNode.style.display='none';
						this.parentNode.style.display='none';
					}else if(window.ideaType==1 && (i==4||i==5)){
						this.parentNode.style.display='none';
					}
				});
				return obj;
			}
		,	findEcho=$G('.findEcho')
		,	planOnClick=function(id,obj){
				selectUnit='';
				clearSelect({planId:id});
				window.rightToolListOnClick.call(rightToolMenu(1),{planId:id});
				var json=listPlan[id]
				,	planUnitlist=$G('#planUnitlist'+id)
				;
				planUnitlist[0].style.display='none';
				planListOpen(id,json.campaignState,$G('#fliePic'+id)[0]);
			}
		,	unitOnClick=function(obj,pid){
				ListOpenIds[pid]=true;
				var unitId=obj.id.replace(/unitId_/ig,'');
				clearSelect({planId:pid,unitId:unitId});
				/*rightToolMenu(2);
				window.rightToolListOnClick.call(rightToolMenu(2),{planId:pid,unitId:unitId});*/
			}
		,	userOnClick=function(){
				toolEditMenu(0);
				selectPlan=''
				selectUnit='';
				clearSelect();
				window.rightToolListOnClick.call(rightToolMenu(0));
			}
		,	findOnClick=function(){
				var leftTreeFind=$G('#leftTreeFind')
				,	findValue=leftTreeFind[0].value
				,	findI=0
				;
				clearSelect({},true);
				if($G.isNaN(findValue)){
					findEcho[0].style.display='none';
					return;
				}else if(window.wm.ckType.len(findValue,0,30)){
					window.msg.call(leftTreeFind[0],{msg:'输入字符过长，请缩短搜索内容!'});
					return;
				}
				$G('.cssPlan').Each(function(){
					var plan=$G('.leftTreePlanText',this)
					,	pid=this.id.replace(/planId_/ig,'')
					,	isTrue=false
					,	unitList=$G('#planUnitlist'+pid)
					;
					if(plan[0].innerHTML.indexOf(findValue)<0){
						isTrue=true;
					}else
						findI++;
					$G('span',unitList[0]).Each(function(){
						if(this.innerHTML.indexOf(findValue)<0){
							this.parentNode.parentNode.style.display='none';
						}else{
							isTrue=false;
							findI++;
						}
					});
					if(isTrue){
						this.parentNode.style.display='none';
					}else{
						var objCss=$G(this)
						,	json=listPlan[pid]
						,	span=$G('span',this)[0]
						;
						unitList[0].style.display='none';
						planListOpen(pid,json.campaignState,span);
					}
				});
				
				var s=$G('s',findEcho[0])
				,	a=$G('a',findEcho[0])
				;
				s.html('共有结果'+findI+'条');
				a[0].onclick=function(){
					findEcho[0].style.display='none';
					leftTreeFind[0].value='';
					clearSelect({},true);
				};
				findEcho[0].style.display='';
				
			}
		;
		return {
			show:show
		,	res:res
		,	listPlan:listPlan
		,	listUnit:listUnit
		,	planListJson:planListJson
		,	listUnitByPlan:listUnitByPlan
		,	planListOpen:planListOpen
		,	planOnClick:planOnClick
		,	unitOnClick:unitOnClick
		,	clearSelect:clearSelect
		,	userOnClick:userOnClick
		,	findOnClick:findOnClick
		,	selectPlan:function(){
				return selectPlan;
			}
		,	selectUnit:function(){
				return selectUnit;
			}
		,	rightToolMenu:rightToolMenu
		};
	}();
	window.leftTree.show();
})();