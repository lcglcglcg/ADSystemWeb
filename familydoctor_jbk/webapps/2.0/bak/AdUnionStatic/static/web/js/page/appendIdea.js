(function(){
	window.appendIdea=function(){
		var c_foot=$G('div:c_foot')
		,	listAppendIdeasEach=$G('#listAppendIdeasEach')
		,	findDom=$G('#contb5')
		,	appendIdeaListData={}
		,	state={
				'1':['有效','green']
			,	'2':['不宜推广','orange']
			,	'3':['暂停','orange']
			,	'4':['审核中','orange']
			,	'5':['审核拒绝','red']
			}
		,	model=function(d,isTrue){
				var m={
						path:'SET_CREATIVE_APPEND'
					,	APPEND_ID:''								//附加创意ID
					,	APPEND_STATUS:''							//1有效 2暂停
					,	APPEND_CONTENT:''							//内容
					}
				,	updateCode='APPEND_STATUS,APPEND_CONTENT'.split(',')
				;
				
				if($G.isNaN(d['APPEND_ID'])){
					m['path']='ADD_CREATIVE_APPEND';
					delete m['APPEND_STATUS'];
					delete m['APPEND_ID'];
					delete d['APPEND_ID'];
					delete m['UPDATE_TYPE'];
				}else if(isTrue){
					var json=appendIdeaListData[d['APPEND_ID']]
					;
					if(json){
						$G.Each(function(){
							var key=this+'';
							if(d[key]==json[key]){
								delete d[key];
							}
						},updateCode);
						m['path']='SET_CREATIVE_APPEND';
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
		,	getContent=function(value,isHtml,htmlJoin){
				value=value||'';
				var contentList=value.split('\r\n')
				,	titleList=new Array()
				;
				for(var i=0,n=contentList.length;i<n;i++){
					var zlHtml=contentList[i].split('\n')
					,	title=zlHtml[0]
					;
					titleList.push(isHtml?isHtml.replace(/{title}/ig,title):'<s>'+title+'</s>');
				}
				return titleList.join((htmlJoin||'&nbsp;|&nbsp;'));
			}
			//获取单条单元数据
		,	getIdeasById=function(id,fn){
				window.ajax({
					path:'GET_CREATIVE_APPEND_UNIQUE'
				,	type:'post'
				,	data:{CREATIVE_APPEND_ID:id}
				,	calback:function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							fn&&fn(JSON);
						}
					}
				});
			}
			//创建/修改 计划
		,	appendAction=function(){
				var append=$G('#step4_new')
					//提交验证
				,	subFunction=''
				,	subAppend=window.subAjax('#step4_new',{
							ckdata:function(data){
								var appendMsg=$G('.appendMsg',append[0])
								,	errorMsg=$G('div:error',append[0])
								,	titleAllLen=0
								,	appendTitleLength=0
								,	appendUrlLength=0
								,	errUrlValList=new Array()
								,	ckReturn=true
								,	ckDoman=function(value){
										var companyDoman=window.wm.data['user']['DOMAIN']
										,	domanUrlArray=companyDoman.split(",")
										,	isRetUrn=false
										,	domanUrlData=$G.findDoman(value)
										;
										for(var m=0,n=domanUrlArray.length;m<n;m++){
											var companySite=$G.findDoman(domanUrlArray[m])
											,	companyUrl=companySite.url
											,	companyType=companySite.type
											;
											if(domanUrlData.url==companyUrl && domanUrlData.type==companyType){
												isRetUrn=true;
												break;
											}
										}
										return isRetUrn;
									}
								,	ckUrl=function(){
										if(!this.value)return;
										var ckGetUrl=ckDoman(this.value.replace(/(http:\/\/)/g,""));
										if(!ckGetUrl){
											//$G('#'+this.id+'_msg_2')[0].style.display='';
											errUrlValList.push(this.value);
											ckReturn=false;
										}else if(!window.wm.ckType.displayUrl(this.value)){
											//errUrlValList.push(this.value);
											window.msg.call(this,{msg:'您的输入不能包含以下非法字符：“<”、“>”'});
											ckReturn=false;
										}
									}
								,	ckTitleLen=function(){
										if(!this.value)return;
										appendTitleLength++;
										var titleLen=$G.len(this.value);
										if(titleLen>16){
											$G('#'+this.id+'_msg')[0].style.display='';
											ckReturn=false;
										}
										titleAllLen=titleAllLen+titleLen;
									}
								,	ckUrlLen=function(){
										if(!this.value)return;
										appendUrlLength++;
										var titleLen=$G.len(this.value);
										if(titleLen>1024){
											$G('#'+this.id+'_msg')[0].style.display='';
											ckReturn=false;
										}
									}
								;
								
								appendMsg.Each(function(){
									this.style.display='none';
								});
								
								appendTitle.Each(function(){
									ckTitleLen.call(this);
								});
								if(!ckReturn){
									return false;
								}else if(titleAllLen>56){
									errorMsg.html($G('span:gray',append[0])[0].innerHTML);
									return false;
								}
								appendUrl.Each(function(i){
									ckUrlLen.call(this);
									ckUrl.call(this);
								});
								if(!ckReturn){
									if(errUrlValList.length>0){
										errorMsg.html('您输入的('+errUrlValList.join('、')+')的主域名必须与您的注册网站域名一致('+window.wm.data['user']['DOMAIN']+')');
									}
									return false;
								}
								if(appendTitleLength!=appendUrlLength){
									errorMsg.html('请将数据填写完整后在提交');
									return false;
								}
								if(appendTitleLength<3){
									errorMsg.html('一个附加创意中最多可设置5个子链，最少三个子链');
									return false;
								}
								errorMsg[0].innerHTML='';
								var pam=new Array();
								appendTitle.Each(function(i){
									if(this.value){
										pam.push(this.value+'\n'+'http://'+(appendUrl[i].value.replace(/(http:\/\/)/g,"")));
									}
								});
								data['APPEND_CONTENT']=pam.join('\r\n');
								
								delete data['appendTitle'];
								delete data['appendUrl'];
								var m=model(data,true);
								m['CREATIVE_APPEND_ID']=m['APPEND_ID']||'';
								delete m['APPEND_ID'];
								if(!$G.isNaN(m['CREATIVE_APPEND_ID']) && $G.isNaN(m['UPDATE_TYPE'])){
									appendAlt.close();
									return false;
								}
								return m;
							}
						,	sub:'#appendSubmit'
						,	callback:function(JSON){
								if(window.wm.msg(JSON.CODE,false)){
									if(subFunction)subFunction(JSON,this.postdata);
									else{
										appendAlt.close();
										list.sub();
									}
								}
							}
					})
					//创建/修改 计划 层
				,	appendAlt=window.alertDiv({
						findObj:'#step4_new'
					,	closeObj:'.close'
					,	position:'absolute'
					,	move:$G('div:scommon_title',append[0])
					})
				,	domShow=function(type,JSON){
						var test={
								'edit':{
									'altAppendDaoHang':'修改'
								}
							,	'add':{
									'altAppendDaoHang':'新建'
								}
							}
						,	html=test[type]
						,	none=type=='add'?'':'none'
						;
						$G('.altAppendDaoHang',append[0]).html(html['altAppendDaoHang']);
						$G('div:error',append[0]).Each(function(){
							this.innerHTML='';
						});
						reset();
						$G('.APPEND_ID',append[0])[0].value=(JSON.APPEND_ID||'');
						if($G.isNaN(JSON.APPEND_CONTENT)){
							return;
						}
						var contentList=JSON.APPEND_CONTENT.split('\r\n')
						;
						for(var i=0,n=contentList.length;i<n;i++){
							var zlHtml=contentList[i].split('\n')
							,	title=zlHtml[0]
							,	url=zlHtml[1]
							;
							appendTitle[i].value=title;
							appendUrl[i].value=url;
							$G(appendTitle[i]).setAtt('bakVal',title);
							$G(appendUrl[i]).setAtt('bakVal',url);
							demoShow();
						}
					}	
				;
				
				/*******************title输入长度时时限制**************************/
				var demoList=new Array()
				,	appendTitle=$G('.appendTitle',append[0])
				,	appendUrl=$G('.appendUrl',append[0])
				,	demoValUrl=$G('.appendList',append[0])
				,	demoShow=function(){
						demoList=new Array();
						appendTitle.Each(function(){
							if(this.value){
								demoList.push('<i style="font-style:normal;color:#261CDC; text-decoration:underline;">'+this.value+'</i>');
							}
						});
						if(demoList.length>0)
							demoValUrl.html(demoList.join('&nbsp;|&nbsp;'));
						else
							demoValUrl[0].innerHTML='';
						return demoList.join('&nbsp;|&nbsp;');
					}
				,	reset=function(){
						appendTitle.Each(function(i){
							this.value='';
							appendUrl[i].value='';
						});
						
						appendTitle.setAtt('bakVal',' ');
						appendUrl.setAtt('bakVal',' ');
						demoValUrl[0].innerHTML='<i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览1</i> | <i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览2</i> | <i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览3</i> | <i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览4</i> | <i style="font-style:normal;color:#261CDC; text-decoration:underline;">子链预览5</i>';
						
						$G('div:error',append[0]).Each(function(){
							this.innerHTML='';
						});
					}
				;
				
				appendTitle.bd({on:'keyup',callback:function(){
					var valueLen=$G.len(this.value)
					,	obj=$G(this)
					,	objMsg=$G('#'+this.id+'_msg')
					;
					objMsg[0].style.display='none';
					if(valueLen>16){
						this.value=obj.getAtt('bakVal');
						objMsg[0].style.display='';
					}else{
						obj.setAtt('bakVal',this.value);
						demoShow();
					}
				}});
				/*******************URL输入长度时时限制**************************/
				appendUrl.bd({on:'keyup',callback:function(){
					var valueLen=$G.len(this.value)
					,	obj=$G(this)
					,	objMsg=$G('#'+this.id+'_msg')
					;
					objMsg[0].style.display='none';
					if(valueLen>1024){
						this.value=obj.getAtt('bakVal');
						objMsg[0].style.display='';
					}else{
						obj.setAtt('bakVal',this.value);
					}
				}});
				$G('#appendIdeasAdd').click(function(){
					add();
				});
				$G('#appendClear').click(reset);
				
				return {
					show:function(json,fn){
						var closeMsg='您确定要中止修改附加创意操作吗？'
						;
						json=json||{};
						json=model(json);
						if(json && $G.isNaN(json.APPEND_ID)){
							closeMsg='您确定要中止新建附加创意操作吗？';
							domShow('add',json);
						}else{
							domShow('edit',json);
						}
						if(fn)subFunction=function(){
							fn(appendAlt);
						};
						else
							subFunction='';
						appendAlt.show(
						''
						,	function(){
								window.gconfirm({
									msg:closeMsg
								,	fn:function(isTrue){
										if(isTrue){
											appendAlt.close();
										}
									}
								});
							}
						,	''
						,	true
						);
					}
				,	close:appendAlt.close
				};
				
			}()
		,	add=function(fn){
				appendAction.show({},fn);
			}
		,	edit=function(json,fn){
				json=json||{};
				if($G.isNaN(json.APPEND_ID))return;
				appendAction.show(json,fn);
			}
			//启用/暂停 计划
		,	pause=function(id,t,v,fn){
				var m={
					'ID_TYPE':4
				,	'ID':id
				,	'BATCH_TYPE':t
				,	'STATUS':v
				};
				window.pause(m,function(){
					list.sub();
					fn&&fn();
				});
			}
			//删除附加创意
		,	remove=function(ids){
				pause(ids,2,'');
			}
		;
		
		
		/***********************获取附加创意列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	listAppendIdeasHtmlTitle=$G('#listAppendIdeasHtmlTitle')
		,	listAppendIdeasHtmlList=$G('#listAppendIdeasHtmlList')
		,	list=window.subAjax('#contb5',{
					path:'GET_CREATIVE_APPEND'
				,	sub:'.subAppendIdeasList'
				,	findDom:findDom[0]
				,	obj:listAppendIdeasEach[0]
				,	ckdata:function(data){
						var d=window.wm.setDataList(data,'APPEND_NAME','请输入子链名称',findDom[0],pageArray);
						return d;
					}
				,	callback:function(JSON){
						c_foot[0].style.display='none';
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
								var html='<table width="100%"><tr><td colspan="12"><div class="warn">当前列表为空，请<a>添加附加创意</a></div></td></tr></table>';
								if($G.isNaN(postdata['query.adgroupId'])){
									html='<table width="100%"><tr><td colspan="12"><div class="warn">没有符合条件的数据</div></td></tr></table>';
									listAppendIdeasEach[0].innerHTML=html;
									return false;
								}
								listAppendIdeasEach[0].innerHTML=html;
								$G('a',listAppendIdeasEach[0])[0].onclick=function(){
									news();
								}
								return false;
							}
							for(var i=0;i<n;i++){
								var	v=JSON.LIST[i]
								,	hStr=listAppendIdeasHtmlList[0].innerHTML
								;
								appendIdeaListData[v.APPEND_ID]=v;
								$G.Each(function(i,val,json){
									var value=this;
									if(val=='APPEND_STATUS'){
										var vs=state[value];
										value=vs[0];
										if(value=='不宜推广'){
											value+='<i><img src="/static/ads_c_2.0/web/images/bulb_dim.png" width="16" height="16" msgWidth="300" msgTitle="'+value+'：" title="目前创意处于离线中，因为您提交的URL地址无法访问，请检查创意的URL地址，在确认能打开后重新提交" /></i>';
										}else if(value=='审核拒绝'){
											value+='<i><img src="/static/ads_c_2.0/web/images/bulb_dim.png" width="16" height="16" msgWidth="300" msgTitle="'+value+'：" title="'+json.APPEND_REFUSE_REASON+'" /></i>';
										}
										hStr=window.wm.setVal(hStr,val,value);
										hStr=window.wm.setVal(hStr,'stateCss',vs[1]);
										if(value=='暂停'){
											value='stop_img';
										}else{
											value='start_img';
										}
										val='stateCss';
									}else if(val=='APPEND_CONTENT'){
										value=getContent(value);
									}
									hStr=window.wm.setVal(hStr,val,value);
								},v);
								str+=hStr;
							}
							var html='<table width="100%">'+(listAppendIdeasHtmlTitle[0].innerHTML).toString()+str+'</table>';
							listAppendIdeasEach[0].innerHTML=html;
						}catch(e){alert('appendIdea:'+e);}
						
						/****************************编辑创意***********************************/
						$G('.edit',listAppendIdeasEach[0]).click(function(){
							edit.call(this,appendIdeaListData[$G(this).getAtt('value')]);
						});
						/****************************启用/暂停***********************************/
						$G('.pause',listAppendIdeasEach[0]).click(function(){
							appendPause.call(this,appendIdeaListData[$G(this).getAtt('value')]);
						});
						
						$G('.listAppendIdeaTd',listAppendIdeasEach[0]).bd({on:'mousemove',callback:function(){
							$G('.listAppendIdeaTr',listAppendIdeasEach[0]).Each(function(){
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
						
						$G('.listAppendIdeaTool',listAppendIdeasEach[0]).Each(function(i){
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
				$G('.listAppendIdeaCheckId',listAppendIdeasEach[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.listAppendIdeaCheckId',listAppendIdeasEach[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listAppendIdeaCheckAll',listAppendIdeasEach[0])[0].checked=true;
				else $G('.listAppendIdeaCheckAll',listAppendIdeasEach[0])[0].checked=false;
			}
		;
		(function(){
			var findSelId=function(){
				var selObjList=$G('.listAppendIdeaCheckId',listAppendIdeasEach[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			};
			$G('#appendIdeasToolsDelAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中附加创意后再进行删除操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要删除选中的附加创意吗？'
					,	fn:function(isTrue){
							if(isTrue){
								remove(s.vlist.join(','));
							}
						}
					});
				}
			});
			$G('#appendIdeasToolsSotpAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中附加创意后再进行暂停操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要暂停选中的附加创意吗？'
					,	fn:function(isTrue){
							if(isTrue){
								pause(s.vlist.join(','),1,2);
							}
						}
					});
				}
			});
			$G('#appendIdeasToolsStartAll').click(function(){
				var s=findSelId();
				if(s.n<1){
					window.altBox.show({
						title:'提示信息'
					,	msg:'请在列表中选中附加创意后再进行启动操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要启用选中的附加创意吗？'
					,	fn:function(isTrue){
							if(isTrue){
								pause(s.vlist.join(','),1,1);
							}
						}
					});
				}
			});
		})();
		
		$G('.FIND_NAME',findDom[0]).click(function(){
			if(this.value=='请输入子链名称'){
				this.value='';
			}
		}).change(function(){
			if(this.value==''){
				this.value='请输入子链名称';
			}
		});
		
		var findWhere=function(){
			var FIND_STATUS=$G('.FIND_STATUS',findDom[0])
			,	FIND_NAME=$G('.FIND_NAME',findDom[0])
			;
			pageArray['click']=function(pageObj){
				pageArray=pageObj;
				list.sub();
			};
			pageArray['SORT_TYPE']=1;
			pageArray['SORT_COLUMN']=2;
			return {
				clear:function(){
					FIND_STATUS.setseltext('全部状态');
					FIND_NAME.val('请输入子链名称');
					window.selDom&&window.selDom.resall();
				}
			};
		}();
		return {
			list:function(obj){
				obj=obj||{};
				findWhere.clear();
				list.sub();
			}
		,	orderBy:orderBy
		,	selectAll:selectAll
		,	selectId:selectId
		,	getList:list
		,	getState:state
		,	getContent:getContent
		,	add:add
		,	getIdeasById:getIdeasById
		};
	}();
	
})();