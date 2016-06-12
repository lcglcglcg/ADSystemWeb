(function(){
	window.picIdea=function(){
		var c_foot=$G('div:c_foot')
		,	listPicIdeasEach=$G('#listPicIdeasEach')
		,	findDom=$G('#contb3')
		,	picIdeaListData={}
		,	upflie=''
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
						path:'SET_IMG_CREATIVE'
					,	CREATIVE_ID:''								//创意ID
					,	CREATIVE_IMG_ID:''
					,	CAMPAIGN_NAME:''							//计划名称
					,	GROUP_NAME:''								//组名称
					,	CREATIVE_STATUS:''							//1有效 2暂停
					,	CREATIVE_NAME:''							//创意NAME
					,	CREATIVE_DESTINATION_URL:''					//访问URL
					,	CREATIVE_DISPLAY_URL:''						//显示URL
					,	ACCOUNT_ID:window.wm.data['user']['ACCOUNT_ID']  
					}
				,	updateCode='CREATIVE_STATUS,CREATIVE_NAME,CREATIVE_DESTINATION_URL,CREATIVE_DISPLAY_URL,CREATIVE_IMG_ID'.split(',')
				;
				
				if($G.isNaN(d['CREATIVE_ID'])){
					m['path']='ADD_IMG_CREATIVE';
					delete m['CREATIVE_STATUS'];
					delete m['CREATIVE_ID'];
					delete d['CREATIVE_ID'];
					delete m['UPDATE_TYPE'];
					/*if(!$G.isNaN(d['CREATIVE_IMG_ID'])){
						d['CREATIVE_IMG_ID']='['+d['CREATIVE_IMG_ID']+']';
					}*/
				}else if(isTrue){
					var json=picIdeaListData[d['CREATIVE_ID']]
					;
					if(json){
						$G.Each(function(){
							var key=this+'';
							$G.log(key+'|'+d[key]+'='+json[key]);
							if('CREATIVE_STATUS'!=key && d[key]==json[key]){
								delete d[key];
							}
						},updateCode);
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
			//创建/修改 计划
		,	ideaAction=function(){
				var idea=$G('#step_three')
				,	cy_show=$G('div:cy_show',idea[0])
					//提交验证
				,	subFunction=function(){}
				,	subIdea=window.subAjax('#step_three',{
							ckdata:function(data){
								$G('.ckMsg',idea[0]).none();
								var CREATIVE_IMG_ID=data['CREATIVE_IMG_ID'];
								if($G.isNaN(CREATIVE_IMG_ID)){
									window.altBox.show({
										title:'图片创意错误提示信息'
									,	msg:'未上传图片'
									});
									return;
								}
								var destinationUrl=$G('.CREATIVE_DESTINATION_URL',idea[0])
								,	displayUrl=$G('.CREATIVE_DISPLAY_URL',idea[0])
								,	destinationUrlLen=$G.len(destinationUrl[0].value)
								,	displayUrlLen=$G.len(displayUrl[0].value)
								,	destinationUrlMsgHand_1=$G('#picDestinationUrlMsgHand_1')
								,	displayUrlMsgHand_1=$G('#picDisplayUrlMsgHand_1')
								,	destinationUrlMsgHand_2=$G('#picDestinationUrlMsgHand_2')
								,	displayUrlMsgHand_2=$G('#picDisplayUrlMsgHand_2')
								,	companyDoman=window.wm.data['user']['DOMAIN']
								,	domanUrlArray=companyDoman.split(",")
								,	ckDoman=function(value){
										var isRetUrn=false
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
										var domanDestinationUrl=ckDoman(destinationUrl[0].value);
										if(!domanDestinationUrl){
											destinationUrlMsgHand_2[0].innerHTML=destinationUrlMsgHand_2[0].innerHTML.replace(/(www)/,companyDoman);
											destinationUrlMsgHand_2[0].style.display='';
											return false;
										}else if(!window.wm.ckType.domanDestinationUrl(destinationUrl[0].value)){
											destinationUrlMsgHand_1[0].style.display='';
											return false;
										}
										var domanDisplayUrl=ckDoman(displayUrl[0].value);
										if(!domanDisplayUrl){
											displayUrlMsgHand_2[0].innerHTML=displayUrlMsgHand_2[0].innerHTML.replace(/(www)/,companyDoman);
											displayUrlMsgHand_2[0].style.display='';
											return false;
										}else if(!window.wm.ckType.displayUrl(displayUrl[0].value)){
											displayUrlMsgHand_1[0].style.display='';
											return false;
										}
										return true;
									}
								;
								
								if(destinationUrlLen>1017){
									alert('访问URL超长');
									return false;
								}
								if(displayUrlLen>35){
									alert('显示URL超长');
									return false;
								}
								if(!ckUrl()){
									return false;
								}
								
								var mod=model(data,true);
								mod['CREATIVE_DESTINATION_URL']='http://'+(mod['CREATIVE_DESTINATION_URL'].replace(/(http:\/\/)/g,""));
								return mod;
							}
						,	sub:'.subPicIdeaSave .subPicIdeaSaveAnd'
						,	callback:function(JSON){
								if(window.wm.msg(JSON.CODE,false)){
									tmpPic.clear();
									$G('.CREATIVE_DESTINATION_URL .CREATIVE_DISPLAY_URL',idea[0]).Each(function(){
										this.value='';
									});
									subFunction(JSON,this.postdata);
									if(this.subObj.name=='subPicIdeaSave'){
										ideaAlt.close();
									}
									list.sub();
								}
							}
					})
					//创建/修改 计划 层
				,	ideaAlt=window.alertDiv({
						findObj:'#step_three'
					,	closeObj:'.close'
					,	position:'absolute'
					,	move:$G('div:scommon_title',idea[0])
					})
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
						$G('.CAMPAIGN_ID .GROUP_ID .CREATIVE_NAME .CREATIVE_DESTINATION_URL .CREATIVE_DISPLAY_URL .CREATIVE_ID .CREATIVE_IMG_ID',idea[0]).Each(function(){
							var gObj=$G(this)
							,	name=gObj.getAtt('name')
							;
							this.value=JSON[name]||'';
						});
						if(type!='add'&&JSON)
							tmpPic.set(JSON);
					}
				,	isUPloads=true
				,	tmpPic=function(){
						var uploadCount=$G('.uploadIdeasCount',idea[0])
						,	ideasTmpPicList=$G('.ideasTmpPicList',idea[0])
						,	uploadIdeasClear=$G('.uploadIdeasClear',idea[0])
						,	uploadIdeaPicDemo=$G('.uploadIdeaPicDemo',idea[0])
						,	creativeImgIds=$G('.CREATIVE_IMG_ID',idea[0])
						,	n=18
						,	demoKey=''
						,	list={}
						,	errList=new Array()
						,	creativeIdsArray=new Array()
						;
						var _htmlLi='<li id="{ideaId}" ideasLi="li"><span class="zu_cont_lf"><div class="key_div"><span ideasListId="{ideaId}">{ideaName}</span><a class="key_btn1" ideasLi="edit" id="{ideaId}"></a></div></span>\
									<span class="zu_cont_rg">{ideasPicSize}</span><a class="delete" ideasLi="del" id="{ideaId}"></a></li>'
						,	_add=function(json){
								var str=_htmlLi;
								str=str.replace(/{ideaName}/,json.FILE_NAME).replace(/{ideasPicSize}/,json.CREATIVE_IMG_SIZE).replace(/{ideaId}/ig,json.CREATIVE_IMG_ID);
								if(isUPloads)
									ideasTmpPicList[0].innerHTML+=str;
								else{
									_clearDemo();
									ideasTmpPicList[0].innerHTML=str;
								}
							}
						,	_set=function(json){
								var str=_htmlLi;
								str=str.replace(/{ideaName}/,json.FILE_NAME).replace(/{ideasPicSize}/,json.CREATIVE_IMG_SIZE).replace(/{ideaId}/ig,json.CREATIVE_IMG_ID);
								ideasTmpPicList[0].innerHTML=str;
								list={};
								list[json.CREATIVE_IMG_ID]=json;
							}
						,	_clearDemo=function(){
								var spanImgDiv=$G('span',uploadIdeaPicDemo[0])
								,	addImgDiv=$G('div',uploadIdeaPicDemo[0])
								,	aImgDiv=$G('a',uploadIdeaPicDemo[0])
								;
								addImgDiv[0].innerHTML='';
								spanImgDiv[0].style.display='none';
								aImgDiv[0].onclick=function(){};
								uploadCount.html('已上传0张，还可以上传'+n+'张。');
							}
						,	_edit=function(k){
								var json=list[k]
								,	creativeName=$G('.CREATIVE_NAME',uploadIdeasTitleEdit.obj[0])
								;
								uploadIdeasTitleEdit.show(function(){
									$G('.CREATIVE_IMG_ID',uploadIdeasTitleEdit.obj[0]).val(k);
									$G('.CREATIVE_ID',uploadIdeasTitleEdit.obj[0]).val(json.CREATIVE_ID);
									creativeName.val(json.FILE_NAME);
								},'',function(d){
									if(window.wm.msg.call(creativeName[0],d.CODE)){
										var postdata=this.postdata;
										list[k].FILE_NAME=postdata['CREATIVE_NAME'];
										$G('.CREATIVE_NAME',idea[0]).val(postdata['CREATIVE_NAME']);
										$G('span:ideasListId:'+k,ideasTmpPicList[0]).html(postdata['CREATIVE_NAME']);
										uploadIdeasTitleEdit.none();
									}
									
								}
								);
							}
						,	_clear=function(){
								ideasTmpPicList[0].innerHTML='';
								list={};
								creativeIdsArray=new Array();
								errList=new Array();
								_clearDemo();
								try{
									var stats=upflie.getStats();
									upflie.cancelUpload();
									upflie.setFileQueueLimit(n);
									stats.files_queued=0;
									stats.successful_uploads=0;
									stats.upload_cancelled=0;
									_count(stats);
								}catch(e){}
							}
						,	_del=function(key){
								var obj=$G('#'+key,ideasTmpPicList[0])[0]
								;
								obj.parentNode.removeChild(obj);
								delete list[key];
								var stats=upflie.getStats();
								stats.successful_uploads=stats.successful_uploads-1;
								if(demoKey==key){
									_clearDemo();
								}
								_count(stats);
							}
						,	_count=function(stats){
								stats=stats||upflie.getStats()
								,	selectCount=_n()
								;
								if(isUPloads){
									creativeImgIds[0].value=(creativeIdsArray.length<1?'':creativeIdsArray.join(','));
									uploadCount.html('已上传'+selectCount+'张，还可以上传'+(n-selectCount)+'张。');
									upflie.setFileQueueLimit((n-selectCount));
								}else{
									uploadCount.html('已上传'+selectCount+'张，还可以上传1张。');
									creativeImgIds[0].value=(creativeIdsArray.length<1?'':creativeIdsArray.join(','));
									upflie.setFileQueueLimit(1);
								}
								stats.successful_uploads=selectCount;
								upflie.setStats(stats);
							}
						,	_n=function(){
								var i=0;
								creativeIdsArray=new Array();
								for(var k in list){
									i++;
									creativeIdsArray.push(k);
								}
								return i;
							}
						,	_demo=function(k,jsonData){
								var img=$G.dom({
									type:'img'
									})
								,	json=jsonData||list[k]
								,	addImgDiv=$G('div',uploadIdeaPicDemo[0])
								,	spanImgDiv=$G('span',uploadIdeaPicDemo[0])
								,	aImgDiv=$G('a',uploadIdeaPicDemo[0])
								,	altDivWHFn=function(){
										var pw=(json.CREATIVE_IMG_SIZE.split('X'))[0]
										;
										demoPreviewObj[0].style.width=(Number(pw||200)+20)+'px';
										if(demoPreviewObj[0].o&&demoPreviewObj[0].o.obj&&demoPreviewObj[0].o.obj.gobj){
											demoPreviewObj[0].o.obj.gobj.style.width=demoPreviewObj[0].style.width;
										}
									}
								,	altDivFn=function(){
										uploadIdeasDemoPreview.show(function(){
											var imgPreview=$G('img',uploadIdeasDemoPreview.obj[0])
											,	xia_line=$G('p:xia_line',uploadIdeasDemoPreview.obj[0])
											,	m_guige=$G('p:m_guige',uploadIdeasDemoPreview.obj[0])
											,	m_web=$G('p:m_web',uploadIdeasDemoPreview.obj[0])
											,	displayUrl=$G('.CREATIVE_DISPLAY_URL',idea[0])[0].value||''
											;
											imgPreview[0].src=img.dom.src;
											xia_line.html(json.FILE_NAME);
											m_guige.html(json.CREATIVE_IMG_SIZE+' | '+(json.CREATIVE_IMG_SIZE_IMGLENGTH/1000)+'KB');
											m_web.html('<span class="lf">'+displayUrl+'</span><a class="download" href="'+img.dom.src+'" target="_blank" ></a>');
										});
									}
								;
								img.dom.src=json.CREATIVE_FILE_PATH+'?'+ new Date().getTime();
								var demoPreviewObj=$G('#uploadIdeasDemoPreview')
								;
								if(jsonData){
									altDivWHFn();
									altDivFn();
									return;
								}
								demoKey=k;
								img.dom.onload=function(){
									altDivWHFn();
									aImgDiv[0].onclick=altDivFn;
									spanImgDiv[0].style.display='';
									
								};
								addImgDiv[0].innerHTML='';
								img.add(addImgDiv[0]);
							}
						;
						uploadIdeasClear.click(_clear);
						ideasTmpPicList.bd({on:'mousemove',callback:function(arg,et){
							var type=et.type?et.type.toLowerCase():"";
							if(type!='ul'){
								var li=$G(et).findParent({key:'ideasLi',value:'li'})||et
								,	obj=$G(li)
								;
								if(obj.getAtt('ideasLi')=='li'){
									$G('li',ideasTmpPicList[0]).Each(function(){
										$G(this).setAtt('class','');
									});
									obj.setAtt('class','key_ch');
								}
							}
						}}).bd({on:'mouseout',callback:function(arg,et){
							setTimeout(function(){
								if($G(et).getAtt('ideasLi')=='li')
									$G(et).setAtt('class','');
							},0);
						}}).click(function(arg,et){
							var type=et.type?et.type.toLowerCase():"";
							if(type!='UL'){
								var li=$G(et).findParent({key:'ideasLi',value:'li'})||et
								,	obj=$G(li)
								,	gEt=$G(et)
								;
								if(gEt.getAtt('ideasLi')=='edit')
									_edit(gEt.getAtt('id'));
								else if(gEt.getAtt('ideasLi')=='del')
									_del(gEt.getAtt('id'));
								else if(obj.getAtt('ideasLi')=='li'){
									_demo(obj.getAtt('id'));
								}
							}
							
						});
						return {
							n:n
						,	setn:function(N){
								n=N;
							}
						,	msg:$G('#upIdeasMsg')[0]
						,	add:_add
						,	set:_set
						,	count:_count
						,	clear:_clear
						,	del:_del
						,	edit:_edit
						,	demo:_demo
						,	clearDemo:_clearDemo
						,	getN:_n
						,	setList:function(k,v){
								if(!isUPloads)
									list={};
								list[k]=v;
								
							}
						,	getList:function(k){
								return list[k];
							}
						,	setErrList:function(v){
								errList.push(v);
							}
						,	getErrList:function(){
								return errList;
							}
						,	clearErrList:function(){
								errList=new Array();
							}
						,	getErrN:function(){
								return errList.length;
							}
						};
					}();
					var upflieCount=0;
					var upflieFn=function(ini){
						ini=ini||{};
						return $G.upflie({
							success:function(file, serverData){
								var stats=this.getStats()
								,	isTrue=stats.files_queued>0?true:false
								;
								var JSON=$G.parseJSON(serverData)
								,	isUpTrue=window.wm.msg(JSON.CODE,true)
								;
								JSON.CREATIVE_FILE_PATH=window.wm.path.pic.url+JSON.CREATIVE_FILE_PATH;
								//JSON.CREATIVE_IMG_ID_TMP=JSON.CREATIVE_IMG_ID;
								if(!isUPloads)
									isIdeasTemp=false;
								if(isUpTrue){
									tmpPic.add.call(file,JSON);
									JSON.file=file;
									tmpPic.setList(JSON.CREATIVE_IMG_ID,JSON);
									tmpPic.count(stats);
									upflieCount++;
								}else{
									tmpPic.setErrList([window.code[JSON.CODE],file]);
								}
								
								if(isTrue)
									this.startUpload();
								else{
									uploadPicMsg.show(function(){
										var msg=$G('.msg',uploadPicMsg.obj[0])
										,	errListObj=$G('.errList',uploadPicMsg.obj[0])
										,	oN=tmpPic.getN()
										,	eN=tmpPic.getErrN()
										,	errList=tmpPic.getErrList()
										,	errHtml='<ul><li class="lf_li" title="{fileName}">{fileName}</li><li class="rg_li" title="{fileMsg}">{fileMsg}</li></ul>'
										;
										msg.html('成功上传图片'+upflieCount+'张，失败'+eN+'张。');
										if(eN>0){
											var strErrHtml='';
											for(var i=0,n=errList.length;i<n;i++){
												var errArr=errList[i];
												strErrHtml+=errHtml.replace(/{fileName}/ig,errArr[1].name).replace(/{fileMsg}/ig,errArr[0]);
											}
											errListObj[0].innerHTML=strErrHtml;
											errListObj[0].style.display='';
										}else{
											errListObj[0].style.display='none';
										}
										tmpPic.clearErrList();
										upflieCount=0;
									});
								}
							}
						,	swfupload_loaded_handler:function(){
								if(isUPloads){
									upflie.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILES);
								}else{
									upflie.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILE);
								}
								upflie.setFileQueueLimit(tmpPic.n);
							}
						,	file_dialog_start_handler:function(){
								var stats=this.getStats();
								tmpPic.count(stats);
							}
						,	file_dialog_complete_handler:function(numberSelected, numberQueued){
								upflie.startUpload();
							}
						,	upload_start_handler:function(file){
								upflie.setPostParams({
									GROUP_ID:$G('.GROUP_ID',idea[0])[0].value
								});
								return true;
							}
						,	file_queue_error_handler:function(file, errorCode, message){
								var msg=message;
								if(errorCode=='-100') msg='当前还可以上传'+message+'张图片';
								else if(errorCode=='-110') msg='您上传的图片大小，不能超过55KB';
								else alert(errorCode+'='+message);
								window.msg.call(tmpPic.msg,{msg:msg});
							}
						,	queued_handler:function(){}
						,	upid:ini.upid
						,	pic_w:62
						,	pic_h:24
						,	file_upload_limit:tmpPic.n
						,	types:"*.jpg;*.gif;*.swf"
						,	pic:'/static/ads_c_2.0/web/images/btn_shangc.jpg'
						,	url:ini.url||ideaUrl.news.upload
						})
					}
				;
				upflie=upflieFn({upid:'upIdeas',url:window.wm.path.up});
				return {
					show:function(json,fn,editfn){
						var closeMsg='您确定要中止修改创意操作吗？'
						,	subIdeaSaveAnd=$G('.subIdeaSaveAnd',idea[0])
						;
						json=json||{};
						json=model(json);
						if(json && $G.isNaN(json.CREATIVE_ID)){
							closeMsg='您确定要中止新建创意操作吗？';
							isUPloads=true;
							$G('.newMap',idea[0]).none();
							domShow('add',json);
							tmpPic.clear();
							subIdeaSaveAnd.show();
						}else{
							isUPloads=false;
							domShow('edit',json);
							subIdeaSaveAnd.none();
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
					}
				,	close:ideaAlt.close
				,	tmpPic:tmpPic
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
					'ID_TYPE':5
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
		/************上传图片信息提示**************/
		,	uploadPicMsg=function(){
				var obj=$G('#step3_losing')
				,	uploadPicMsgfn=window.alertDiv({
						findObj:'#step3_losing'
					,	closeObj:'.close'
					,	move:$G('div:lose_title',obj[0])
					})
				;
				return {
					obj:obj
				,	show:function(fnB,fnE){
						uploadPicMsgfn.show(fnB,fnE);
					}
				,	none:uploadPicMsgfn.none
				}
			}()
			/************修改创意标题**************/
		,	uploadIdeasTitleEdit=function(){
				var uploadIdeasTitleEditfn=window.alertDiv({
						findObj:'#uploadIdeasTitleEdit'
					,	closeObj:'.close'
					})
				,	obj=$G('#uploadIdeasTitleEdit')
				,	ajaxFn=function(){}
				,	subPicIdeasTitle=window.subAjax('#uploadIdeasTitleEdit',{
						path:'SET_UPLOAD_IMG_INFO'
					,	sub:'.subPicIdeasTitle'
					,	findDom:obj[0]
					,	ckdata:function(data){
							if(!$G.isNaN(data['CREATIVE_ID'])){
								ajaxFn.call({postdata:{'CREATIVE_NAME':data['CREATIVE_NAME']}},{CODE:'0'});
								return false;
								//return model(data,true);;
							}
							return data;
						}
					,	callback:function(json){
							ajaxFn.call(this,json);
						}
					})
				;
				return {
					obj:obj
				,	show:function(fnB,fnE,aFn){
						if(aFn)ajaxFn=aFn;
						uploadIdeasTitleEditfn.show(fnB,fnE);
					}
				,	none:uploadIdeasTitleEditfn.none
				}
			}()
		/************创意图片浏览**************/
		,	uploadIdeasDemoPreview=function(){
				var uploadIdeasDemoPreviewfn=window.alertDiv({
						findObj:'#uploadIdeasDemoPreview'
					,	closeObj:'.close'
					,	position:'absolute'
					,	move:$G('div:check_title',$G('#uploadIdeasDemoPreview')[0])
					})
				,	obj=$G('#uploadIdeasDemoPreview')
				;
				return {
					obj:obj
				,	show:function(fnB,fnE,fnC){
						uploadIdeasDemoPreviewfn.show(fnB,fnE,fnC);
					}
				,	none:uploadIdeasDemoPreviewfn.none
				}
			}()
		;
		
		/***********************获取创意列表************************************/
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	listPicIdeasHtmlTitle=$G('#listPicIdeasHtmlTitle')
		,	listPicIdeasHtmlList=$G('#listPicIdeasHtmlList')
		,	listPicIdeasHtmlEnd=$G('#listPicIdeasHtmlEnd')
		,	list=window.subAjax('#contb3',{
					path:'GET_IMG_CREATIVE'
				,	sub:'.subIdeasList .subListGl'
				,	findDom:findDom[0]
				,	obj:listPicIdeasEach[0]
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
								if(!$G.isNaN(postdata['GROUP_ID'])){
									listPicIdeasEach[0].innerHTML=html;
									$G('a',listPicIdeasEach[0])[0].onclick=function(){
										var data=window.leftTree.listUnitByPlan[postdata['GROUP_ID']];
										add.call(data,postdata['GROUP_ID']);
									}
								}else{
									html='<table width="100%"><tr><td colspan="12"><div class="warn">没有符合条件的数据</div></td></tr></table>';
									listPicIdeasEach[0].innerHTML=html;
								}
								return false;
							}
							for(var i=0;i<n;i++){
								var	v=JSON.LIST[i]
								,	hStr=listPicIdeasHtmlList[0].innerHTML
								;
								v.CREATIVE_FILE_PATH=window.wm.path.pic.url+v.CREATIVE_FILE_PATH;
								v.CREATIVE_DESTINATION_URL=v.CREATIVE_DESTINATION_URL.replace(/(http:\/\/)/g,"");
								v.FILE_NAME=v.CREATIVE_NAME;
								v.CREATIVE_IMG_ID=v.CREATIVE_ID;
								picIdeaListData[v.CREATIVE_ID]=v;
								$G.Each(function(i,val,json){
									var value=this;
									if(val=='CREATIVE_STATUS'){
										var vs=state[value];
										value=vs[0];
										if(value=='不宜推广'){
											value+='<i><img src="/static/ads_c_2.0/web/images/bulb_dim.png" width="16" height="16" msgWidth="300" msgTitle="'+value+'：" title="目前创意处于离线中，因为您提交的URL地址无法访问，请检查创意的URL地址，在确认能打开后重新提交" /></i>';
										}else if(value=='审核拒绝'){
											value+='<i><img src="/static/ads_c_2.0/web/images/bulb_dim.png" width="16" height="16" msgWidth="300" msgTitle="'+value+'：" title="'+json.CREATIVE_REFUSE_REASON+'" /></i>';
										}
										/***************************
										20150116DSP审核
										****************************/
										var dspStatus=v.CREATIVE_DSP_STATE;
										if(dspStatus==0){
											value='<img src="/static/ads_c_2.0/web/images/u392.png" width="15" height="15" class="zhuangt_img"/>'+value;
										}else if(dspStatus==2){
											value='<img src="/static/ads_c_2.0/web/images/u394.png" width="15" height="15" class="zhuangt_img"  title="'+(v.CREATIVE_DSP_REFUSE_REASON||'')+'" />'+value;
										}
										hStr=window.wm.setVal(hStr,val,value);
										hStr=window.wm.setVal(hStr,'creativeStateCss',vs[1]);
										if(vs[0]=='暂停'){
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
							page.setup(JSON.INFO.CREATIVE_COUNT,n,pageArray);
							var endStr=listPicIdeasHtmlEnd[0].innerHTML;
							$G.Each(function(){
								var countValue=JSON.INFO[this+'']||0;
								endStr=window.wm.setVal(endStr,this+'',countValue);
							},'CREATIVE_COUNT CREATIVE_ENABLED CREATIVE_IMPRESSION CREATIVE_CLICK CREATIVE_CTR CREATIVE_CPC CREATIVE_COST CREATIVE_CPM'.split(" "));
							var html='<table width="100%">'+(listPicIdeasHtmlTitle[0].innerHTML).toString()+str+endStr.toString()+'</table>';
							listPicIdeasEach[0].innerHTML=html;
						}catch(e){alert('testIdea:'+e);}
						
						/****************************左则树联动***********************************/
						var ideasleftTreeList=$G('#leftTreeList');
						$G('.treePlanClick',listPicIdeasEach[0]).click(function(){
							var tpv=$G(this).getAtt('value')
							,	ideaObjJson=picIdeaListData[tpv]
							,	treePlanObj=$G('span:treePlan:'+ideaObjJson.CAMPAIGN_ID,ideasleftTreeList[0])
							;
							window.leftTree.planOnClick((ideaObjJson.CAMPAIGN_ID||''),treePlanObj[0]);
						});
						
						$G('.treeUnitClick',listPicIdeasEach[0]).click(function(){
							var tuv=$G(this).getAtt('value')
							,	ideaObjJson=picIdeaListData[tuv]
							,	treeUnitObj=$G('li:treeUnit:'+ideaObjJson.GROUP_ID,ideasleftTreeList[0])
							;
							window.leftTree.unitOnClick(treeUnitObj[0],(ideaObjJson.CAMPAIGN_ID||''));
						});
						/************************创意DEMO*************************************/
						$G('.ideaDemo',listPicIdeasEach[0]).click(function(){
							ideaAction.tmpPic.demo(0,picIdeaListData[$G(this).getAtt('value')]);
						});
						/****************************编辑创意***********************************/
						$G('.edit',listPicIdeasEach[0]).click(function(){
							edit.call(this,picIdeaListData[$G(this).getAtt('value')]);
						});
						/****************************启用/暂停***********************************/
						$G('.pause',listPicIdeasEach[0]).click(function(){
							ideaPause.call(this,picIdeaListData[$G(this).getAtt('value')]);
						});
						
						$G('.listIdeasTd',listPicIdeasEach[0]).bd({on:'mousemove',callback:function(){
							$G('.listTestIdeaTr',listPicIdeasEach[0]).Each(function(){
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
						
						$G('.listIdeasTool',listPicIdeasEach[0]).Each(function(i){
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
				$G('.listPicIdeasCheckId',listPicIdeasEach[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.listPicIdeasCheckId',listPicIdeasEach[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.listPicIdeasCheckAll',listPicIdeasEach[0])[0].checked=true;
				else $G('.listPicIdeasCheckAll',listPicIdeasEach[0])[0].checked=false;
			}
		;
		var findSelId=function(){
			var selObjList=$G('.listPicIdeasCheckId',listPicIdeasEach[0])
			,	cv=selObjList.checked(true)
			,	cn=cv.length
			;
			return {
				objlist:selObjList
			,	vlist:cv
			,	n:cn
			};
		};
		$G('#picIdeasToolsDelAll').click(function(){
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
		$G('#picIdeasToolsSotpAll').click(function(){
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
		$G('#picIdeasToolsStartAll').click(function(){
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
		,	findSelId:findSelId
		};
	}();
	
})();