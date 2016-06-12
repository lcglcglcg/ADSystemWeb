(function(){
	window.checkAppend=function(){
		var findDom=$G('div:main')
		,	listCheckAppendTitle=$G('#listCheckAppendTitle')
		,	listCheckAppendList=$G('#listCheckAppendList')
		,	listCheckAppendErr=$G('#listCheckAppendErr')
		,	checkAppendList=$G('#checkAppendList')
		,	dataList={}
		,	state={
				'1':['有效','green']
			,	'2':['不宜推广','red']
			,	'4':['审核中','']
			,	'5':['审核拒绝','red']
			}
		,	getAccount=function(id){
				window.userDemo.show(id);
			}
			//审核
		,	setCreativeState=function(appendIds,creativeState,refuseReason,fn){
				var data={
					CREATIVE_TYPE:2
				,	CREATIVE_STATUS:creativeState
				,	CREATIVE_ID_ARRAY:appendIds
				,	CREATIVE_REFUSE_REASON:refuseReason||''
				};
				window.checkPass(data,fn);
			}
			//重新验证
		,	resetCheckFn=function(appendId,fn){
				var data={
					CREATIVE_TYPE:2
				,	CREATIVE_ID:appendId
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
		,	addAddress=function(){
				var	add_address=$G('#add_address')
				,	adiv=window.alertDiv({
						findObj:'#add_address'
					,	position:'absolute'
					,	move:$G('div:check_title_box',add_address[0])
					})
				;
				return {
					show:function(fn){
						fn&&fn.call(add_address[0],adiv);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	appendPreview=function(){
				var	add_preview=$G('#add_preview')
				,	adiv=window.alertDiv({
						findObj:'#add_preview'
					,	position:'absolute'
					,	move:$G('div:check_title_box',add_preview[0])
					})
				;
				
				return {
					show:function(jsonIdea,k,fn){
						var check_title=$G('b',$G('div:check_title',add_preview[0])[0])
						,	wordBtn=$G('.addBtn',add_preview[0])
						;
						wordBtn.Each(function(i){
							if(k==i)
								this.style.display='';
							else
								this.style.display='none';
						});
						check_title.html(this.innerHTML);
						var appendList=$G(".appendList",add_preview[0]);
						appendList[0].style.display="";
						appendList.html(window.appendIdea.getContent(jsonIdea.CREATIVE_CONTENT,'<i style=" font-style:normal;color:#261CDC; text-decoration:underline;" >{title}</i>'));
						
						fn&&fn.call(add_preview[0],adiv,wordBtn);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	selectAll=function(){
				var c=this.checked;
				$G('.listCheckAppendCheckbox',checkAppendList[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(k){
				var obj='';
				if(k==1){
					obj=$G('#pic_'+this.value,checkAppendList[0]);
					
				}else{
					obj=$G('#pic_'+this.value+'_tmp',checkAppendList[0]);
					
				}
				if(obj){
					var checkboxObj=$G('input',obj[0])
					;
					checkboxObj[0].checked=this.checked;
				}
				var c=this.checked
				,	list=$G('.listCheckAppendCheckbox',checkAppendList[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listCheckAppendCheckboxAll',checkAppendList[0])[0].checked=true;
				else $G('.listCheckAppendCheckboxAll',checkAppendList[0])[0].checked=false;
			}
		,	findSelId=function(){
				var selObjList=$G('.listCheckAppendCheckbox',checkAppendList[0])
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
		/***********************获取附加创意列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	list=window.subAjax('div:conditions',{
					path:'GET_APPEND_CREATIVE'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:checkAppendList[0]
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
								checkAppendList[0].innerHTML=listCheckAppendErr.html();
								return false;
							}
							for(var i=0;i<n;i++){
								var	v=JSON.LIST[i]
								,	hStr=listCheckAppendList[0].innerHTML
								;
								dataList[v.CREATIVE_ID]=v;
								$G.Each(function(i,val,json){
									var value=this
									,	toolTest='查看创意'
									;
									if(val=='CREATIVE_STATE'){
										var vs=state[value];
										hStr=window.wm.setVal(hStr,'stateCss',vs[1]);
										if(value==4){
											toolTest='审核创意';
										}else if(value==5){
											toolTest='查看原因';
										}
										value=vs[0];
										hStr=window.wm.setVal(hStr,'toolTest',toolTest);
									}else if(val=='CREATIVE_CONTENT'){
										value=window.appendIdea.getContent(value,'<s>{title}</s>');
									}
									hStr=window.wm.setVal(hStr,val,value);
								},v);
								str+=hStr;
							}
							page.setup(JSON.INFO.CREATIVE_COUNT,n,pageArray);
							var html='<table width="100%">'+(listCheckAppendTitle[0].innerHTML).toString()+str+'</table>';
							checkAppendList[0].innerHTML=html;
						}catch(e){alert('appendIdea:'+e);}
						
						$G('a',checkAppendList[0]).click(function(){
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
										appendPreview.show.call(this,json,3,function(alertDom){
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
												addAddress.show(function(){
													var ul=$G('ul',$G('div:address_main')[0])
													,	contentHtml=function(value){
															var contentList=value.split('\r\n')
															,	isHtml='<li>{title}：</li>'
															,	isUrl='<li class="li_b_border"><a href="{url}" target="_blank">{url}</a></li>'
															,	str=new Array()
															;
															for(var i=0,n=contentList.length;i<n;i++){
																var zlHtml=contentList[i].split('\n')
																,	title=zlHtml[0]
																,	url=$G.Trim(zlHtml[1])
																;
																str.push(isHtml.replace(/{title}/ig,title)+isUrl.replace(/{url}/ig,url));
															}
															return str.join(' ');
														}(json.CREATIVE_CONTENT)
													;
													
													ul[0].innerHTML=contentHtml;
												});
											}else if(name=='resetCheck'){
												resetCheckFn(json.CREATIVE_ID,function(resJson){
													if(!resJson)resJson={code:'1230'};
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
							if(name=='tools'){
								var json=dataList[value]
								;
								if(json.CREATIVE_STATE==4){
									appendPreview.show.call(this,dataList[value],0,function(alertDom){
										viewPicFn.call(this,alertDom,dataList[value]);
									});
								}else if(json.CREATIVE_STATE==2){
									appendPreview.show.call(this,dataList[value],2,function(alertDom){
										viewPicFn.call(this,alertDom,dataList[value]);
									});
								}else if(json.CREATIVE_STATE==5){
									viewRefuse.show(function(alertDom){
										viewErr.call(this,alertDom,json);
									});
								}else{
									appendPreview.show.call(this,dataList[value],1,function(alertDom){
										viewPicFn.call(this,alertDom,dataList[value]);
									});
								}						
							}else if(name=='loginName'){
								getAccount(value);
							}
						});
						$G('.listAppendTd',checkAppendList[0]).bd({on:'mousemove',callback:function(){
							$G('.listAppendTr',checkAppendList[0]).Each(function(){
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