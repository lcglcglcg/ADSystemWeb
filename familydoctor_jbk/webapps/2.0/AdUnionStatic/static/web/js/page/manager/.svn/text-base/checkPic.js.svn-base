(function(){
	window.checkPic=function(){
		var findDom=$G('div:main')
		,	listCheckPicTitle=$G('#listCheckPicTitle')
		,	listCheckPicList=$G('#listCheckPicList')
		,	listCheckPicErr=$G('#listCheckPicErr')
		,	checkPicList=$G('#checkPicList')
		,	listCheckPicTempList=$G('#listCheckPicTempList')
		,	findStatusDsp=$G('.DSP_STATUS')
		,	dataList={}
		,	dataTempList={}
		,	state={
				'1':['有效','green']
			,	'2':['不宜推广','red']
			,	'4':['审核中','']
			,	'5':['审核拒绝','red']
			}
		,	dspState={
				'0':['DSP审核通过','green']
			,	'1':['DSP审核中','orange']
			,	'2':['DSP审核拒绝','red']
			,	'3':['初审中','']
			}
		,	getAccount=function(id){
				window.userDemo.show(id);
			}
			//审核
		,	setCreativeState=function(creativeIds,CREATIVE_STATE,refuseReason,fn){
				var data={
					CREATIVE_TYPE:3
				,	CREATIVE_STATUS:CREATIVE_STATE
				,	CREATIVE_ID_ARRAY:creativeIds
				,	CREATIVE_REFUSE_REASON:refuseReason||''
				};
				window.checkPass(data,fn);
			}
			//重新验证
		,	resetCheckFn=function(creativeId,CREATIVE_DESTINATION_URL,fn){
				var data={
					CREATIVE_TYPE:3
				,	CREATIVE_ID:creativeId
				};
				window.checkReset(data,fn);
			}
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
		,	viewPic=function(){
				var	preview=$G('#preview')
				,	adiv=window.alertDiv({
						findObj:'#preview'
					,	position:'absolute'
					,	move:$G('div:check_title',preview[0])
					})
				;
				return {
					show:function(fn){
						fn&&fn.call(preview[0],adiv);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	lookViewPic=function(){
				var	no_view_creative=$G('#no_view_creative')
				,	adiv=window.alertDiv({
						findObj:'#no_view_creative'
					,	position:'absolute'
					,	move:$G('div:check_title_box',no_view_creative[0])
					})
				;
				return {
					show:function(fn){
						fn&&fn.call(no_view_creative[0],adiv);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	checkViewPic=function(){
				var	check_creative=$G('#check_creative')
				,	adiv=window.alertDiv({
						findObj:'#check_creative'
					,	position:'absolute'
					,	move:$G('div:check_title_box',check_creative[0])
					})
				;
				return {
					show:function(k,fn){
						var check_title=$G('b',$G('div:check_title',check_creative[0])[0])
						,	wordBtn=$G('.wordBtn',check_creative[0])
						;
						wordBtn.Each(function(i){
							if(k==i)
								this.style.display='';
							else
								this.style.display='none';
						});
						//alert(this.innerHTML);
						//check_title.html(this.innerHTML);
						
						fn&&fn.call(check_creative[0],adiv);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	selectAll=function(){
				var c=this.checked;
				$G('.listCheckPicCheckbox .listCheckPicTmpCheckbox',checkPicList[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(k){
				var obj='';
				if(k==1){
					obj=$G('#pic_'+this.value,checkPicList[0]);
					
				}else{
					obj=$G('#pic_'+this.value+'_tmp',checkPicList[0]);
					
				}
				if(obj){
					var checkboxObj=$G('input',obj[0])
					;
					checkboxObj[0].checked=this.checked;
				}
				var c=this.checked
				,	list=$G('.listCheckPicCheckbox',checkPicList[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listCheckPicCheckboxAll',checkPicList[0])[0].checked=true;
				else $G('.listCheckPicCheckboxAll',checkPicList[0])[0].checked=false;
			}
		,	findSelId=function(){
				var selObjList=$G('.listCheckPicCheckbox',checkPicList[0])
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
					path:'GET_IMG_CREATIVE'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:checkPicList[0]
				,	ckdata:function(data){
						if($G.isNaN(this.id))data['FIND_TYPE']='';
						var d=window.wm.setDataListManager(data,findDom[0],pageArray);
						return d;
					}
				,	callback:function(JSON){
						var str=''
						,	postdata=this.postdata
						,	pathList={}
						,	pathTmpList={}
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
								checkPicList[0].innerHTML=listCheckPicErr.html();
								return false;
							}
							for(var i=0;i<n;i++){
								var	v=JSON.LIST[i]
								,	hStr=listCheckPicList[0].innerHTML
								;
								v.CREATIVE_FILE_PATH=window.wm.path.pic.url+v.CREATIVE_FILE_PATH;
								dataList[v.CREATIVE_ID]=v;
								$G.Each(function(i,val,json){
									var value=this
									,	toolTest='查看创意'
									;
									if(val=='CREATIVE_STATE'){
										var vs=state[value]
										,	errToolsTest=''
										;
										hStr=window.wm.setVal(hStr,'creativeStateCss',vs[1]);
										if(value==4){
											toolTest='审核创意';
										}else if(value==5){
											errToolsTest='查看原因';
										}
										var stateV=vs[0];
										hStr=window.wm.setVal(hStr,'toolTest',toolTest);
										
										/********************DSP状态****************************/
										var DState=v['CREATIVE_DSP_STATE']
										,	vds=dspState[DState]
										,	stateStr=vds[0]
										,	stateCss=vds[1]
										;
										if(!errToolsTest&&DState==2){
											errToolsTest='查看原因';
										}
										
										hStr=window.wm.setVal(hStr,'errToolsTest',errToolsTest);
										hStr=window.wm.setVal(hStr,'CREATIVE_DSP_STATE',stateStr);
										hStr=window.wm.setVal(hStr,'creativeDspStateCss',stateCss);
										value=stateV;
									}
									hStr=window.wm.setVal(hStr,val,value);
								},v);
								str+=hStr;
							}
							page.setup(JSON.INFO.CREATIVE_COUNT,n,pageArray);
							var html='<table width="100%">'+(listCheckPicTitle[0].innerHTML).toString()+str+'</table>';
							checkPicList[0].innerHTML=html;
						}catch(e){alert('picIdea:'+e);}
						
						$G('a',checkPicList[0]).click(function(){
							var obj=$G(this)
							,	value=obj.getAtt('value')
							,	name=obj.getAtt('name')
							,	viewErr=function(errAlert,json,path){
									var li=$G('li',this)
									,	a=$G('a',this)
									,	wm_cont=$G('div:wm_cont',this)
									,	dsp_cont=$G('div:dsp_cont',this)
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
									if(json.CREATIVE_DSP_STATE==2){
										dsp_cont.show();
									}else{
										dsp_cont.none();
									}
									if(json.CREATIVE_STATE==5){
										wm_cont.show();
									}else{
										wm_cont.none();
									}
									a[0].onclick=function(){
										errAlert.none();
										checkViewPic.show.call(this,1,function(alertDom){
											viewPicFn.call(this,alertDom,json,path);
										});
									};
								}
							,	viewPicFn=function(alertDom,json,path){
									var alertObj=this
									,	img=$G('img',this)
									,	creativeName=$G('p:xia_line',this)
									,	creativeSize=$G('p:m_guige',this)
									,	displayUrl=$G('span:lf p:m_web',this)
									,	download=$G('a:download',this)
									,	aClick=$G('a',this)
									;
									if(download.length>0)
										download[0].href=json.CREATIVE_FILE_PATH;
									creativeName.html(json.CREATIVE_NAME);
									creativeSize.html(json.CREATIVE_IMG_SIZE+' | '+function(){
										var sl=json.CREATIVE_IMG_SIZE_IMGLENGTH
										;
										if(sl){
											return sl/1000;
										}else return 0;
									}()+'KB');
									displayUrl.html(json.CREATIVE_DISPLAY_URL);
									if(json.CREATIVE_IMG_SIZE){
										var sizeImg=json.CREATIVE_IMG_SIZE.split('X')
										,	w=sizeImg[0]
										,	h=sizeImg[1]
										;
										this.style.width=(Number(w)+20)+'px';
									}
									if(img.length>0){
										img[0].src=json.CREATIVE_FILE_PATH;
										img[0].onload=function(){
											alertObj.parentNode.style.width=(Number(w)+20)+'px';
											alertObj.parentNode.style.height=(Number(h)+130)+'px';
											if(alertObj.parentNode.o&&alertObj.parentNode.o.obj&&alertObj.parentNode.o.obj.gobj){
												alertObj.parentNode.o.obj.gobj.style.width=alertObj.parentNode.style.width;
											}
											alertDom.show();
										};
									}
									aClick.Each(function(){
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
							if(name=='viewPic'){
								viewPic.show(function(alertDom){
									viewPicFn.call(this,alertDom,dataList[value],pathList[value]);
								});
							}else if(name=='viewPicTmp'){
								viewPic.show(function(alertDom){
									viewPicFn.call(this,alertDom,dataTempList[value],pathTmpList[value]);
								});
							}else if(name=='errTools'){
								var json=dataList[value]
								;
								viewRefuse.show(function(alertDom){
									viewErr.call(this,alertDom,dataList[value],pathList[value]);
								});
							}else if(name=='tools'){
								var json=dataList[value]
								;
								if(json.CREATIVE_STATE==4){
									checkViewPic.show.call(this,0,function(alertDom){
										viewPicFn.call(this,alertDom,dataList[value],pathList[value]);
									});
								}else if(json.CREATIVE_STATE==2){
									checkViewPic.show.call(this,2,function(alertDom){
										viewPicFn.call(this,alertDom,dataList[value],pathList[value]);
									});
								}else if(json.CREATIVE_STATE==5){
									checkViewPic.show.call(this,1,function(alertDom){
										viewPicFn.call(this,alertDom,dataList[value],pathList[value]);
									});
									/*viewRefuse.show(function(alertDom){
										viewErr.call(this,alertDom,dataList[value],pathList[value]);
									});*/
								}else{
									checkViewPic.show.call(this,3,function(alertDom){
										viewPicFn.call(this,alertDom,dataList[value],pathList[value]);
									});
								}								
							}else if(name=='toolTmps'){
								var json=dataTempList[value];
								if(json.CREATIVE_STATE==4){
									checkViewPic.show.call(this,0,function(alertDom){
										viewPicFn.call(this,alertDom,dataTempList[value],pathTmpList[value]);
									});
								}else if(json.CREATIVE_STATE==5){
									viewRefuse.show(function(alertDom){
										viewErr.call(this,alertDom,dataTempList[value],pathTmpList[value]);
									});
								}else{
									lookViewPic.show(function(alertDom){
										viewPicFn.call(this,alertDom,dataTempList[value],pathTmpList[value]);
									});
								}
							}else if(name=='loginName'){
								getAccount(value);
							}
						});
						
						$G('.listPicTd',checkPicList[0]).bd({on:'mousemove',callback:function(){
							$G('.listPicTr',checkPicList[0]).Each(function(){
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
		
		
		window.forDsp=function(obj){
			return;
			findStatusDsp.delallsel();
			var v=obj.value
			;
			if(v==4 || v==2 || v==5){
				findStatusDsp.addsel('初审中','');
			}else if(v==1){
				findStatusDsp.addsel('审核中','2');
				findStatusDsp.addsel('审核拒绝','3');
				findStatusDsp.addsel('审核通过','1');
			}else{
				findStatusDsp.addsel('全部','100');
				findStatusDsp.addsel('初审中','');
				//findStatusDsp.addsel('初审拒绝','0');
				findStatusDsp.addsel('审核中','2');
				findStatusDsp.addsel('审核拒绝','3');
				findStatusDsp.addsel('审核通过','1');
			}
			window.selDom&&window.selDom.resall();
		};
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