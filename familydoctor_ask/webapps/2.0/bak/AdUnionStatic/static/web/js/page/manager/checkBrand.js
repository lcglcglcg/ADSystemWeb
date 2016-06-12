(function(){
	window.checkBrand=function(){
		var findDom=$G('div:main')
		,	listCheckBrandTitle=$G('#listCheckBrandTitle')
		,	listCheckBrandList=$G('#listCheckBrandList')
		,	checkBrandList=$G('#checkBrandList')
		,	dataList={}
		,	dataTempList={}
		,	state={
				'0':['待审核','']
			,	'2':['审核拒绝','red']
			,	'1':['审核通过','green']
			,	'3':['不宜推广','orange']
			}
		,	getAccount=function(id){
				window.userDemo.show(id);
			}
			//审核
		,	setCreativeState=function(creativeIds,CREATIVE_STATE,refuseReason,fn){
				var data={
					STATUS:CREATIVE_STATE
				,	BRAND_ID:creativeIds
				,	REFUSE_REASON:refuseReason||''
				};
				window.ajax({
					path:'SET_BRAND_CREATIVE'
				,	data:data
				,	calback:function(json){
						fn&&fn(json);
					}
				});
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
		,	checkView=function(){
				var	check_creative=$G('#order_view_creative')
				,	adiv=window.alertDiv({
						findObj:'#order_view_creative'
					,	position:'absolute'
					,	move:$G('div:detailed_title',check_creative[0])
					})
				;
				return {
					show:function(k,fn){
						var check_title=$G('b',$G('div:detailed_title',check_creative[0])[0])
						,	wordBtn=$G('.wordBtn',check_creative[0])
						;
						wordBtn.Each(function(i){
							if(k==i)
								this.style.display='';
							else
								this.style.display='none';
						});
						var html='查看创意';
						if(k==0){
							html='审核创意';
						}
						//alert(this.innerHTML);
						check_title.html(html);
						
						fn&&fn.call(check_creative[0],adiv);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	selectAll=function(){
				var c=this.checked;
				$G('.listCheckBrandCheckbox',checkBrandList[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(k){
				var obj='';
				if(k==1){
					obj=$G('#brand_'+this.value,checkBrandList[0]);
					
				}else{
					obj=$G('#brand_'+this.value+'_tmp',checkBrandList[0]);
					
				}
				if(obj){
					var checkboxObj=$G('input',obj[0])
					;
					checkboxObj[0].checked=this.checked;
				}
				var c=this.checked
				,	list=$G('.listCheckBrandCheckbox',checkBrandList[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listCheckBrandCheckboxAll',checkBrandList[0])[0].checked=true;
				else $G('.listCheckBrandCheckboxAll',checkBrandList[0])[0].checked=false;
			}
		,	findSelId=function(){
				var selObjList=$G('.listCheckBrandCheckbox',checkBrandList[0])
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
					,	msg:'请在列表中选中品牌创意后再进行批量通过操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要将选中品牌创意批量通过吗？'
					,	title:'确认提示信息'
					,	fn:function(isTrue){
							if(isTrue){
								setCreativeState(ids.vlist.join(','),2,'',function(){
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
					,	msg:'请在列表中选中品牌创意后再进行批量拒绝操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要将选中品牌创意批量拒绝吗？'
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
										setCreativeState(ids.vlist.join(','),3,textareaValue,function(checkRefuseJson){
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
		
		var	viewPicFn=function(alertDom,json){
			var alertObj=this
			,	aClick=$G('a',this)
			,	TITLE=$G('.TITLE',alertObj)
			,	DESCRIPTION=$G('.DESCRIPTION',alertObj)
			,	TELEPHONE=$G('.TELEPHONE',alertObj)
			,	WEB_SITE=$G('.WEB_SITE',alertObj)
			,	WEB_IM=$G('.WEB_IM',alertObj)
			;
			alertDom.show();
			var imgList=json.BRAND_CREATIVE
			;
			TITLE.html(json.TITLE);
			DESCRIPTION.html(json.DESCRIPTION+'<a href="'+json.DESTINATION_URL+'" target="_blank">更多</a>');
			TELEPHONE.html(json.TELEPHONE);
			WEB_SITE.html(json.WEB_SITE);
			WEB_SITE[0].href=json.WEB_SITE;
			var SEQUENCE_URL=$G('.SEQUENCE_URL',alertObj)
			,	SEQUENCE_SRC=$G('.SEQUENCE_SRC',alertObj)
			;
			for(var i=0,n=imgList.length;i<n;i++){
				var imgObj=imgList[i]
				,	imgSrc=window.wm.path.pic.url+imgObj.IMG_PATH
				,	imgUrl=imgObj.IMG_URL
				,	index=imgObj.SEQUENCE
				;
				SEQUENCE_URL[index].href=imgUrl;
				SEQUENCE_SRC[index].src=imgSrc;
			}
			aClick.Each(function(){
				var obj=$G(this)
				,	name=obj.getAtt('name')
				;
				this.onclick=function(){
					if(name=='checkPass'){
						setCreativeState(json.BRAND_ID,2,'',function(){
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
								setCreativeState(json.BRAND_ID,3,textareaValue,function(checkRefuseJson){
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
		},
		viewErr = function(errAlert, json, path) {
			
			var refuse_reason = json.REFUSE_REASON,
				auditor_name = json.AUDITOR_NAME,
				auditor_update_time = json.AUDITOR_UPDATE_TIME;
			
			if ($G.isNaN(refuse_reason) || $G.Trim(refuse_reason) == "") refuse_reason = "理由为空！";
			if ($G.isNaN(auditor_name) || $G.Trim(auditor_name) == "") auditor_name = "审核人为空！";
			if ($G.isNaN(auditor_update_time) || $G.Trim(auditor_update_time) == "") auditor_update_time = "审核时间为空！";
			
			$G(".CREATIVE_REFUSE_REASON", "#view_refuse").html(refuse_reason);
			$G(".AUDITOR_NAME", "#view_refuse").html(auditor_name);
			$G(".AUDITOR_UPDATE_TIME", "#view_refuse").html(auditor_update_time);
			
		};
		
		/***********************获取创意列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	list=window.subAjax('div:conditions',{
					path:'GET_BRAND_CREATIVE'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:checkBrandList[0]
				,	ckdata:function(data){
						if($G.isNaN(this.id) || !data['FIND_NAME'])data['FIND_TYPE']='';
						data['BRAND_ID_TYPE']=1;
						data['BRAND_ID']='';
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
								checkBrandList[0].innerHTML=listCheckPicErr.html();
								return false;
							}
							for(var i=0;i<n;i++){
								var	v=JSON.LIST[i]
								,	hStr=listCheckBrandList[0].innerHTML
								;
								//v.CREATIVE_FILE_PATH=window.wm.path.pic.url+v.CREATIVE_FILE_PATH;
								dataList[v.BRAND_ID]=v;
								$G.Each(function(i,val,json){
									var value=this
									,	toolTest='查看创意'
									;
									if(val=='CREATIVE_STATE'){
										var vs=state[value]
										,	errToolsTest=''
										;
										hStr=window.wm.setVal(hStr,'creativeStateCss',vs[1]);
										if(value==0){
											toolTest='审核创意';
										}else if(value==2){
											errToolsTest='查看原因';
										}
										var stateV=vs[0];
										hStr=window.wm.setVal(hStr,'toolTest',toolTest);
										hStr=window.wm.setVal(hStr,'errToolsTest',errToolsTest);
										value=stateV;
									}
									hStr=window.wm.setVal(hStr,val,value);
								},v);
								var imgList=v.BRAND_CREATIVE;
								for(var j=0,len=imgList.length;j<len;j++){
									var imgObj=imgList[i]
									,	imgSrc=window.wm.path.pic.url+imgObj.IMG_PATH
									,	imgUrl=imgObj.IMG_URL
									,	index=imgObj.SEQUENCE
									;
									hStr=window.wm.setVal(hStr,'SEQUENCE_'+index+'_URL',imgUrl);
									hStr=window.wm.setVal(hStr,'SEQUENCE_'+index+'_SRC',imgSrc);
								}
								str+=hStr;
							}
							page.setup(JSON.INFO.CREATIVE_COUNT,n,pageArray);
							var html='<table width="100%">'+(listCheckBrandTitle[0].innerHTML).toString()+str+'</table>';
							checkBrandList[0].innerHTML=html;
						}catch(e){$G.log('brandIdea:'+e);}
						
						$G('.loginName',checkBrandList[0]).click(function(){
							var obj=$G(this)
							,	value=obj.getAtt('value')
							,	name=obj.getAtt('name')
							;
							getAccount(value);
						});
						$G('.tools',checkBrandList[0]).click(function(){
							var obj=$G(this)
							,	value=obj.getAtt('value')
							,	name=obj.getAtt('name')
							;
							var json=dataList[value]
							;
							if(json.CREATIVE_STATE==0){
								checkView.show.call(this,0,function(alertDom){
									viewPicFn.call(this,alertDom,dataList[value],pathList[value]);
								});
							}else if(json.CREATIVE_STATE==1){
								checkView.show.call(this,1,function(alertDom){
									viewPicFn.call(this,alertDom,dataList[value],pathList[value]);
								});
							}else if(json.CREATIVE_STATE==2){
								checkView.show.call(this,2,function(alertDom){
									viewPicFn.call(this,alertDom,dataList[value],pathList[value]);
								});
							}
							
						});
						$G('.errTools',checkBrandList[0]).click(function(){
							var obj=$G(this)
							,	value=obj.getAtt('value')
							,	name=obj.getAtt('name')
							;
							var json=dataList[value]
							;
							viewRefuse.show(function(alertDom){
								viewErr.call(this,alertDom,dataList[value],pathList[value]);
							});
							
						});
						$G('.listBrandTd',checkBrandList[0]).bd({on:'mousemove',callback:function(){
							$G('.listBrandTr',checkBrandList[0]).Each(function(){
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