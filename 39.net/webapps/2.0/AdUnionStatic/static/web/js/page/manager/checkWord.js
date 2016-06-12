(function(){
	window.checkWord=function(){
		var findDom=$G('div:main')
		,	listCheckWordTitle=$G('#listCheckWordTitle')
		,	listCheckWordList=$G('#listCheckWordList')
		,	listCheckWordErr=$G('#listCheckWordErr')
		,	checkWordList=$G('#checkWordList')
		,	dataList={}
		,	state={
				'1':['审核通过','green']
			,	'2':['不宜推广','red']
			,	'3':['暂停','orange']
			,	'4':['待审核','']
			,	'5':['审核拒绝','red']
			}
		,	getAccount=function(id){
				window.userDemo.show(id);
			}
			//审核
		,	setCreativeState=function(creativeIds,creativeState,refuseReason,fn){
				var data={
					CREATIVE_TYPE:1
				,	CREATIVE_STATUS:creativeState
				,	CREATIVE_ID_ARRAY:creativeIds
				,	CREATIVE_REFUSE_REASON:refuseReason||''
				};
				window.checkPass(data,fn);
			}
			//重新验证
		,	resetCheckFn=function(creativeId,CREATIVE_DESTINATION_URL,fn){
				var data={
					CREATIVE_TYPE:1
				,	CREATIVE_ID:creativeId
				};
				window.checkReset(data,fn);
			}
		,	viewRefuse=function(){
				var	view_refuse=$G('#view_refuse')
				,	adiv=window.alertDiv({
						findObj:'#view_refuse'
					,	position:'absolute'
					,	move:$G('div:title',view_refuse[0])
					})
				;
				return {
					show:function(fn){
						fn&&fn.call(view_refuse[0],adiv);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	checkRefuse=function(){
				var	view_refuse2=$G('#view_refuse2')
				,	adiv=window.alertDiv({
						findObj:'#view_refuse2'
					,	position:'absolute'
					,	move:$G('div:title',view_refuse2[0])
					})
				;
				return {
					show:function(fn){
						$G('textarea',view_refuse2[0])[0].value='';
						fn&&fn.call(view_refuse2[0],adiv);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	viewAddress=function(){
				var	view_address=$G('#view_address')
				,	adiv=window.alertDiv({
						findObj:'#view_address'
					,	position:'absolute'
					,	move:$G('div:check_title_box',view_address[0])
					})
				;
				return {
					show:function(fn){
						fn&&fn.call(view_address[0],adiv);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	wordPreview=function(){
				var	word_preview=$G('#word_preview')
				,	adiv=window.alertDiv({
						findObj:'#word_preview'
					,	position:'absolute'
					,	move:$G('div:check_title_box',word_preview[0])
					})
				;
				
				return {
					show:function(jsonIdea,k,fn){
						var check_title=$G('b',$G('div:check_title',word_preview[0])[0])
						,	wordBtn=$G('.wordBtn',word_preview[0])
						;
						wordBtn.Each(function(i){
							if(k==i)
								this.style.display='';
							else
								this.style.display='none';
						});
						check_title.html(this.innerHTML);
						$G('.testTitle .testDescription1 .testDisplayUrl',word_preview[0]).Each(function(){
							var name=$G(this).getAtt('name')
							,	key='CREATIVE_NAME'
							;
							if(name=='testDescription1')key='CREATIVE_DESCRIPTION';
							if(name=='testDisplayUrl')key='CREATIVE_DISPLAY_URL';
							this.innerHTML=jsonIdea[key]||'';
						});
						var appendList=$G(".appendList",word_preview[0]);
						if(jsonIdea.CREATIVE_APPEND_TYPE==1){
							appendList.html('<i class="zi_link_address"><a>'+jsonIdea.CREATIVE_DISPLAY_URL+'</a></i>');
						}else{
							window.appendIdea.getIdeasById(jsonIdea.CREATIVE_APPEND_ID,function(appendJson){
								appendList.html(window.appendIdea.getContent(appendJson.CREATIVE_CONTENT,'<i style=" font-style:normal;color:#261CDC; text-decoration:underline;" >{title}</i>'));
							});
						}
						
						fn&&fn.call(word_preview[0],adiv,wordBtn);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	selectAll=function(){
				var c=this.checked;
				$G('.listCheckWordCheckbox',checkWordList[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(k){
				var obj='';
				if(k==1){
					obj=$G('#pic_'+this.value,checkWordList[0]);
					
				}else{
					obj=$G('#pic_'+this.value+'_tmp',checkWordList[0]);
					
				}
				if(obj){
					var checkboxObj=$G('input',obj[0])
					;
					checkboxObj[0].checked=this.checked;
				}
				var c=this.checked
				,	list=$G('.listCheckWordCheckbox',checkWordList[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listCheckWordCheckboxAll',checkWordList[0])[0].checked=true;
				else $G('.listCheckWordCheckboxAll',checkWordList[0])[0].checked=false;
			}
		,	findSelId=function(){
				var selObjList=$G('.listCheckWordCheckbox',checkWordList[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			}
		;
		$G('.tools',findDom[0]).click(function(){
			var obj=this
			,	name=obj.name
			,	ids=findSelId()
			;
			if(obj.innerHTML=='批量通过'){
				if(ids.n<1){
					window.altBox.show({
						title:'确认提示信息'
					,	msg:'请在列表中选中创意后再进行批量通过操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要将选中创意批量通过吗？'
					,	title:'确认提示信息'
					,	fn:function(isTrue){
							if(isTrue){
								setCreativeState(ids.vlist.join(','),1,'',function(){
									list.sub();
								});
							}
						}
					});
				}
			}else if(obj.innerHTML=='批量拒绝'){
				if(ids.n<1){
					window.altBox.show({
						title:'确认提示信息'
					,	msg:'请在列表中选中创意后再进行批量拒绝操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要将选中创意批量拒绝吗？'
					,	title:'确认提示信息'
					,	fn:function(isTrue){
							if(isTrue){
								checkRefuse.show(function(checkRefuseAlert){
									var aSub=$G('a',this)
									,	checkRefuseObj=this
									;
									aSub[0].onclick=function(){
										var textareaValue=$G('textarea',checkRefuseObj).val()||'';
										textareaValue=textareaValue[0];
										if($G.isNaN(textareaValue)){
											window.altBox.show({
												title:'提示信息'
											,	msg:'请输入审核拒绝原因！'
											});
											return;
										}
										setCreativeState(ids.vlist.join(','),2,textareaValue,function(checkRefuseJson){
											if(checkRefuseJson.code=='1212'){
												window.altBox.show({
													title:'提示信息'
												,	msg:'请输入审核拒绝原因！'
												});
												return;
											}else{
												list.sub();
												checkRefuseAlert.none();
											}
										});
									};
								});
							}
						}
					});
				}
			}
		});
		/***********************获取创意列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	list=window.subAjax('div:conditions',{
					path:'GET_TEXT_CREATIVE'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:checkWordList[0]
				,	ckdata:function(data){
						if($G.isNaN(this.id))data['FIND_TYPE']='';
						var d=window.wm.setDataListManager(data,findDom[0],pageArray);
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
						try{
							var	n=JSON.LIST.length
							;
							if(n<1){
								checkWordList[0].innerHTML=listCheckWordErr.html();
								return false;
							}
							for(var i=0;i<n;i++){
								var	v=JSON.LIST[i]
								,	hStr=listCheckWordList[0].innerHTML
								;
								dataList[v.CREATIVE_ID]=v;
								$G.Each(function(i,val,json){
									var value=this;
									if(val=='CREATIVE_STATE'){
										var vs=state[value]
										,	toolTest='查看创意'
										;
										hStr=window.wm.setVal(hStr,'creativeStateCss',vs[1]);
										if(value==4){
											toolTest='审核创意';
										}else if(value==5){
											toolTest='查看原因';
										}
										value=vs[0];
										hStr=window.wm.setVal(hStr,'toolTest',toolTest);
									}
									hStr=window.wm.setVal(hStr,val,value);
								},v);
								str+=hStr;
							}
							page.setup(JSON.INFO.CREATIVE_COUNT,n,pageArray);
							var html='<table width="100%">'+(listCheckWordTitle[0].innerHTML).toString()+str+'</table>';
							checkWordList[0].innerHTML=html;
						}catch(e){alert('checkWord:'+e);}
						
						$G('a',checkWordList[0]).click(function(){
							var obj=$G(this)
							,	value=obj.getAtt('value')
							,	name=obj.getAtt('name')
							,	viewErr=function(errAlert,json){
									var li=$G('li',this)
									,	a=$G('a',this)
									;
									if(json.auditorId=="0" && name=='auditorName'){
										json.auditorName='系统自动审核';
									}
									li.Each(function(){
										var obj=$G(this)
										,	name=obj.getAtt('name')
										;
										if($G.isNaN(name))return;
										this.innerHTML=json[name];
									});
									a[0].onclick=function(){
										errAlert.none();
										wordPreview.show.call(this,json,1,function(alertDom){
											viewPicFn.call(this,alertDom,json);
										});
									};
								}
							,	viewPicFn=function(alertDom,json){
									var alertObj=this
									;
									$G('a',this).Each(function(){
										var obj=$G(this)
										,	name=obj.getAtt('name')
										;
										this.onclick=function(){
											if(name=='lookCheck'){
												viewAddress.show(function(){
													var imgObj=$G('a',this)
													;
													imgObj.html(json.CREATIVE_DESTINATION_URL);
													imgObj[0].href=json.CREATIVE_DESTINATION_URL;
												});
											}else if(name=='resetCheck'){
												resetCheckFn(json.CREATIVE_ID,json.CREATIVE_DESTINATION_URL,function(resJson){
													if(resJson.code=='1230'){
														window.altBox.show({
															title:'提示信息'
														,	msg:'访问URL不宜推广！'
														});
													}else{
														list.sub();
														window.altBox.show({
															title:'提示信息'
														,	msg:'验证成功！'
														});
													}
												});
											}else if(name=='checkPass'){
												setCreativeState(json.CREATIVE_ID,1,'',function(){
													list.sub();
													alertDom.none();
												});
											}else if(name=='refusePass'){
												alertDom.none();
												checkRefuse.show(function(checkRefuseAlert){
													var aSub=$G('a',this)
													,	checkRefuseObj=this
													;
													aSub[0].onclick=function(){
														var textareaValue=$G('textarea',checkRefuseObj).val()||'';
														textareaValue=textareaValue[0];
														if($G.isNaN(textareaValue)){
															window.altBox.show({
																title:'提示信息'
															,	msg:'请输入审核拒绝原因！'
															});
															return;
														}
														setCreativeState(json.CREATIVE_ID,2,textareaValue,function(checkRefuseJson){
															if(checkRefuseJson.code=='1212'){
																window.altBox.show({
																	title:'提示信息'
																,	msg:'请输入审核拒绝原因！'
																});
																return;
															}else{
																list.sub();
																checkRefuseAlert.none();
															}
														});
													};
												});
											}
										};
									});
								}
							;
							if(name=='viewWord'){
								wordPreview.show.call(this,dataList[value],5);
							}else if(name=='tools'){
								var json=dataList[value]
								;
								if(json.CREATIVE_STATE==4){
									wordPreview.show.call(this,json,0,function(alertDom){
										viewPicFn.call(this,alertDom,json);
									});
								}else if(json.CREATIVE_STATE==2){
									wordPreview.show.call(this,json,2,function(alertDom){
										viewPicFn.call(this,alertDom,json);
									});
								}else if(json.CREATIVE_STATE==5){
									viewRefuse.show(function(alertDom){
										viewErr.call(this,alertDom,json);
									});
								}else{
									wordPreview.show.call(this,json,3,function(alertDom){
										viewPicFn.call(this,alertDom,json);
									});
								}						
							}else if(name=='loginName'){
								getAccount(value);
							}
						});
						
						$G('.listWordTd',checkWordList[0]).bd({on:'mousemove',callback:function(){
							$G('.listWordTr',checkWordList[0]).Each(function(){
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
		,	selectAll:selectAll
		,	selectId:selectId
		};
	}();
	
})();