window.headerEnd(function(){
	window.announcement=function(){
		var findDom=$G('div:main')
		,	toolDom=$G('a',$G('div:s_bottom',findDom[0])[0])
		,	getState=function(k){
				var state={
					'1':['待发布','']
				,	'2':['发布成功','green']
				,	'0':['发布失败','red']
				,	'3':['发布过期','brown']
				};
				return state[k];
			}
		,	dataList={}
		,	demo=function(){
				var ggao_tan=$G('#ggao_tan')
				,	adiv=window.alertDiv({
						findObj:'#ggao_tan'
					,	position:'absolute'
					,	move:$G('div:gz_alter_title',ggao_tan[0])
					})
				;
				return {
					show:function(json){
						$G.Each(function(i,k){
							var v=this;
							if(k=='SEND_TIME'){
								v=$G.formatdate(new Date(Date.parse(v.replace(/-/ig,'/'))),'YYYY-MM-dd');
								k='sendData';
							}
							$G('.'+k,ggao_tan[0]).html(v);
						},json);
						adiv.show();
					}
				,	none:adiv.close
				}
			}()
		,	announcement=function(){
				var	announcement_alter=$G('#announcement_alter')
				;
				var CONTENT=''
				,	ANNOUNCEMENT_TITLE=''
				,	button=window.subAjax('#announcement_alter',{
						path:'ADD_MANAGER_ANNOUNCEMENT'
					,	sub:'.submit'
					,	findDom:announcement_alter[0]
					,	ckdata:function(data){
							if($G.isNaN(data['ANNOUNCEMENT_ID'])){
								data['path']='ADD_MANAGER_ANNOUNCEMENT';
							}else{
								data['path']='SET_MANAGER_ANNOUNCEMENT';
								data['UPDATE_TYPE']=11;
							}
							CONTENT=data['CONTENT'];
							ANNOUNCEMENT_TITLE=data['ANNOUNCEMENT_TITLE'];
							return data;
						}
					,	callback:function(JSON){
							if(!window.wm.msg(JSON.CODE,false))
								return;
							list.sub();
							adiv.close();
							window.altBox.show({
								title:'确认提示信息'
							,	msg:'公告创建成功'
							,	okfn:function(){
									window.altBox.close();
									demo.show({
										SEND_TIME:$G.formatdate((new Date()),'yyyy-mm-dd hh:ii:ss')
									,	CONTENT:CONTENT
									,	ANNOUNCEMENT_TITLE:ANNOUNCEMENT_TITLE
									,	ANNOUNCEMENT_ID:''
									});
								}
							});
						}
					})
				;
				var	adiv=window.alertDiv({
						findObj:'#announcement_alter'
					,	position:'absolute'
					,	move:$G('div:gz_alter_title',announcement_alter[0])
					})
				,	resetBut=$G('.reset',announcement_alter[0])
				,	g_announcementId=$G('.ANNOUNCEMENT_ID',announcement_alter[0])
				,	g_sendTime=$G('.SEND_TIME',announcement_alter[0])
				,	g_announcementTitle=$G('.ANNOUNCEMENT_TITLE',announcement_alter[0])
				,	g_content=$G('.CONTENT',announcement_alter[0])
				,	sendTime=$G('.SEND_TIME',announcement_alter[0])
				,	reset=function(){
						$G('input textarea',announcement_alter[0]).Each(function(i){
							if(i>1)
								this.value='';
						});
						sendTime.val($G.formatdate(new Date(),'YYYY-MM-dd'));
					}
				;
				resetBut.click(reset);
				return {
					show:function(fn){
						reset();
						fn&&fn();
						adiv.show();
					}
				,	obj:announcement_alter[0]
				,	none:adiv.close
				}
			}()
		,	edit=function(id){
				announcement.show(function(){
					var json=dataList[id]
					;
					$G('.edit',announcement.obj).Each(function(){
						this.style.display='';
					});
					$G('.news',announcement.obj).Each(function(){
						this.style.display='none';
					});
					$G('input textarea',announcement.obj).Each(function(i){
						if(i<1)return;
						var obj=$G(this)
						,	name=obj.getAtt('name')
						,	value=json[name]
						;
						if(name=='SEND_TIME'){
							value=$G.formatdate(new Date(Date.parse(value.replace(/-/ig,'/'))),'YYYY-MM-dd');
						}
						obj.val(value);
					});
				});
			}
		,	create=function(){
				announcement.show(function(){
					$G('.edit',announcement.obj).Each(function(){
						this.style.display='none';
					});
					$G('.news',announcement.obj).Each(function(){
						this.style.display='';
					});
				});
			}
		,	send=function(ids,fn){
				window.ajax({
					load:true
				,	url:window.config.mUrl.announcement.setSendState
				,	type:'post'
				,	data:{
						ids:ids	
					,	sendState:1
					}
				,	calback:function(json){
						list.sub();
						fn&&fn(json);
					}
				});
			}
		,	state=function(ids,fn){
				var data={};
				data['ID_TYPE']=2;
				data['ID']=ids;
				data['STATUS']='';
				data['BATCH_TYPE']=2;
				window.setState(data,function(){
					list.sub();
					fn&&fn();
				});
			}
		,	selectAll=function(){
				var c=this.checked;
				$G('.announcementCheckbox',listData[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.announcementCheckbox',listData[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.announcementCheckboxAll',listData[0])[0].checked=true;
				else $G('.announcementCheckboxAll',listData[0])[0].checked=false;
			}
		,	findSelId=function(){
				var selObjList=$G('.announcementCheckbox',listData[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			};
		;
		toolDom.click(function(ag,et){
			var s=findSelId();
			if(et.innerHTML=='新增'){
				create();
			}else if(et.innerHTML=='删除'){
				if(s.n<1){
					window.altBox({
						title:'确认提示信息'
					,	msg:'请在列表中选中公告后再进行删除操作'
					});
				}else{
					window.gconfirm({
						msg:'您确定要删除选中的公告吗？'
					,	title:'确认提示信息'
					,	fn:function(isTrue){
							if(isTrue){
								state(s.vlist.join(','));
							}
						}
					});
				}
			}
		});
		
		/***********************获取列表************************************/
		var liMenu=$G('#liMenu')
		,	liData=$G('#liData')
		,	liFoot=$G('#liFoot')
		,	listData=$G('#listData')
		,	page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	list=window.subAjax('div:conditions',{
					path:'GET_MANAGER_ANNOUNCEMENT'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:listData[0]
				,	ckdata:function(data){
						data['FIND_TYPE']=4;
						if(!$G.isNaN(data['FIND_NAME'])){
							data['FIND_TYPE']+=1;
						}
						var findtimeValue=$G('.findtime',findDom[0]).getAtt('subValue')
						;
						data['TIME_START']='';
						data['TIME_END']='';
						if(!$G.isNaN(findtimeValue)){
							var t=findtimeValue.split('至')
							;
							if(t.length>0){
								data['TIME_START']=t[0];
								data['TIME_END']=t[1];
								data['FIND_TYPE']+=2;
							}
						}
						
						delete data['findtime'];
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
						var	n=JSON.LIST.length
						,	setVal=function(str,k,v){
								var reg=new RegExp('{'+k+'}','ig')
								;
								return str.replace(reg,v);
							}
						;
						if(n<1){
							listData[0].innerHTML=$G('#liErr').html();
							return false;
						}
						for(var i=0;i<n;i++){
							var	v=JSON.LIST[i]
							,	hStr=liData[0].innerHTML
							;
							dataList[v.ANNOUNCEMENT_ID]=v;
							$G.Each(function(i,val,json){
								var value=this;
								if(val=='SEND_STATE'){
									if(value==1){
										hStr=setVal(hStr,'tools','<a name="edit" value="'+json.ANNOUNCEMENT_ID+'">修改</a>');
									}else if(value==0){
										hStr=setVal(hStr,'tools','<a name="send" value="'+json.ANNOUNCEMENT_ID+'">发布</a>');
									}else {
										hStr=setVal(hStr,'tools','--');
									}
									var stateArray=getState(value);
									value=stateArray[0];
									hStr=setVal(hStr,'stateCss',stateArray[1]);
									
								}else if(val=='SEND_TIME'){
									hStr=setVal(hStr,'sendData',$G.formatdate(new Date(Date.parse(value.replace(/-/ig,'/'))),'YYYY-MM-dd'));
								}
								hStr=setVal(hStr,val,value);
							},v);
							str+=hStr;
						}
						page.setup(JSON.INFO.COUNT,n,pageArray);
						listData[0].innerHTML=liMenu[0].innerHTML+str+liFoot[0].innerHTML;
					}
				});
		;
		pageArray['click']=function(pageObj){
			pageArray=pageObj;
			list.sub();
		};
		list.sub();
		listData.click(function(ag,et){
			var obj=$G(et)
			,	name=obj.getAtt('name')
			,	value=obj.getAtt('value')
			;
			if(name=='title'){
				demo.show(dataList[value]);
			}else if(name=='edit'){
				edit(value);
			}else if(name=='send'){
				send(value,function(){
					window.altBox.show({
						msg:'发布成功'
					});
				});
			}
		});
		return {
			list:function(p){
				window.listpageinf['cpage']=p||1;
				list.sub();
			}
		,	edit:edit
		,	create:create
		,	selectAll:selectAll
		,	selectId:selectId
		};
	}();
	
});