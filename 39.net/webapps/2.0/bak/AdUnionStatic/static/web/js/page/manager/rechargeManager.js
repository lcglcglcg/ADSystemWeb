window.headerEnd(function(){
	window.rechargeManager=function(){
		var findDom=$G('div:main')
		,	getState=function(k){
				var state={
					'1':['已开通','green']
				,	'2':['已冻结','brown']
				};
				return state[k];
			}
		,	listData=$G('#listData')
		,	dataList={}
		;
		/***********************获取创意列表************************************/
		var liMenu=$G('#liMenu')
		,	liData=$G('#liData')
		,	liFoot=$G('#liFoot')
		,	page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	list=window.subAjax('div:conditions',{
					path:'GET_MONEY_OPERATION'
				,	sub:'#subList #exportReport'
				,	findDom:findDom[0]
				,	obj:listData[0]
				,	ckdata:function(data){
						data['FIND_TYPE']=0;
						if(!$G.isNaN(data['FIND_NAME'])){
							data['FIND_TYPE']+=1;
						}
						if(!$G.isNaN(data['STATUS'])){
							data['FIND_TYPE']+=4;
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
						var d=window.wm.setDataListManager(data,findDom[0],pageArray);
						if(d['find_type_none'].length>0){
							if(d['FIND_TYPE']==100)
								d['FIND_TYPE']=16;
							else
								d['FIND_TYPE']+=16;
						}
						delete d['find_type_none'];
						//报表下载
						if(this.id=='exportReport'){
							if($G.isNaN(findtimeValue)){
								window.msg.call($G('.findTime',findDom[0])[0],{msg:'请选择时间范围'});
								this.href='javascript:void(0);';
								this.target='';
								return false;
							}
							this.target='_blank';
							var pd=window.wm.postDataIni(data,'CREATE_REPORT_MONEY_OPERATION');
							this.href=window.wm.url+'?server='+pd['server'];
							return false;
						}
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
							dataList[v.ACCOUNT_ID]=v;
							$G.Each(function(i,val,json){
								var value=this+'';
								if( val=='BALANCE'
								||	val=='INVEST'
								){
									value=$G.FormatNumber(value);
								}else if(val=='ROW_STATE'){
									var stateArray=getState(value);
									value=stateArray[0];
									hStr=setVal(hStr,'stateCss',stateArray[1]);
									/*if(json.lockState==1){
										value+='<a name="lockState" value="'+json.accountId+'" style="display:inline-block;padding-left:2px; position:relative;"><img src="/static/ads_m_1.0/web/images/lock.png" width="11" height="15" alt="点击解锁" style=" position:relative; top:2px;"/></a>'
									}*/
								}
								hStr=setVal(hStr,val,value);
							},v);
							str+=hStr;
						}
						page.setup(JSON.INFO.COUNT,n,pageArray);
						var footHtml=liFoot[0].innerHTML;
						$G.Each(function(i){
							var key=this+''
							,	value=JSON.INFO[key]
							;
							value=$G.FormatNumber(value);
							footHtml=setVal(footHtml,key,value);
						},'INVEST BALANCE CONSUMPTION'.split(" "));
						listData[0].innerHTML=liMenu[0].innerHTML+str+footHtml;
						
					}
				});
		;
		pageArray['click']=function(pageObj){
			pageArray=pageObj;
			list.sub();
		};
		list.sub();
		
		var recharge_alert=function(){
				var	recharge_alert=$G('#recharge_alert')
				,	PAYMENT_TYPE=$G('.PAYMENT_TYPE',recharge_alert[0])
				,	adiv=window.alertDiv({
						findObj:'#recharge_alert'
					,	position:'absolute'
					,	move:$G('div:recharge_title',recharge_alert[0])
					})
				,	rechargeChange=function(){
						var payment_1=$G('.payment_1',recharge_alert[0])
						,	payment_2=$G('.payment_2',recharge_alert[0])
						;
						if(this.value<3){
							payment_1.Each(function(){
								this.style.display='none';
							});
							payment_2.Each(function(){
								this.style.display='';
							});
						}else{
							payment_1.Each(function(){
								this.style.display='';
							});
							payment_2.Each(function(){
								this.style.display='none';
							});
						}
						
					}
				,	sub=function(){
						return window.subAjax('#recharge_alert',{
							path:'ADD_MONEY_OPERATION'
						,	sub:'.submit'
						,	findDom:recharge_alert[0]
						,	ckdata:function(data){
								var paymentType=data['PAYMENT_TYPE']
								,	accountingDocumentNumber=data['ACCOUNTING_DOCUMENT_NUMBER']//凭证号
								,	accountingDocumentNumberObj=$G('.ACCOUNTING_DOCUMENT_NUMBER',recharge_alert[0])
								,	accountingDocumentFile=data['ACCOUNTING_DOCUMENT_FILE']//凭证文件
								,	accountingDocumentFileObj=$G('.ACCOUNTING_DOCUMENT_FILE',recharge_alert[0])
								,	accountingDocumentRemark=data['ACCOUNTING_DOCUMENT_REMARK']//凭证备注
								,	accountingDocumentRemarkObj=$G('.ACCOUNTING_DOCUMENT_REMARK',recharge_alert[0])
								,	money=data['MONEY']
								,	moneyObj=$G('.MONEY',recharge_alert[0])
								;
								var findMoneyLen=money.indexOf('.');
								if(findMoneyLen>0&&(money.length-findMoneyLen)>3){
									window.msg.call(moneyObj[0],{title:'提示信息',msg:'充值金额只能由整数、小数和负数组成，小数点后不超过2位'});
									return;
								}
								if(parseFloat(money)<1){
									window.msg.call(moneyObj[0],{title:'提示信息',msg:'充值金额必须大于1'});
									return;
								}
								if(paymentType<3){
									if($G.isNaN(accountingDocumentNumber)){
										window.msg.call(accountingDocumentNumberObj[0],{msg:'请输入凭证号'});
										return;
									}else if(window.wm.ckType.len(accountingDocumentNumber,6,30)){
										window.msg.call(accountingDocumentNumberObj[0],{msg:'凭证号最小6个字符长度，最大30个字符长度'});
										return;
									}
									if($G.isNaN(accountingDocumentFile)){
										window.msg.call(accountingDocumentFileObj[0],{msg:'请输入凭证文件'});
										return;
									}
								}else{
									if($G.isNaN(accountingDocumentRemark)){
										window.msg.call(accountingDocumentRemarkObj[0],{msg:'请输入凭证备注'});
										return;
									}else if(window.wm.ckType.len(accountingDocumentRemark,4,300)){
										window.msg.call(accountingDocumentRemarkObj[0],{msg:'最小4个字符(等同2个汉字)长度，最大300个字符(等同150个汉字)长度'});
										return;
									}
								}
								return data;
							}
						,	callback:function(JSON){
								if(window.wm.msg(JSON.CODE,false)){
									window.gconfirm({
										msg:'您要充值的金额为 '+JSON.MONEY+' 元，确认无误后，点击“确认”继续充值，点击“取消”撤销充值!'
									,	fn:function(isTrue){
											if(!isTrue){
												adiv.close();
												return ;
											}
											var key=JSON.KEY;
											window.ajax({
												path:'ADD_MONEY_OPERATION_CONFIRM'
											,	type:'post'
											,	data:{
													KEY:key
												}
											,	calback:function(json){
													adiv.close();
													list.sub();
													window.altBox.show({
														title:'提示信息'
													,	msg:'充值成功！'
													});
												}
											});
										}
									});
								}
							}
						});
					}()
				,	accountingDocumentFile=function(file, serverData){
						var JSON=$G.parseJSON(serverData);
						if(window.wm.msg(JSON.CODE,false)){
							$G('.ACCOUNTING_DOCUMENT_FILE',recharge_alert[0]).val(JSON.FILE_PATH);
						}
					}
				,	upflie=function(){
						return $G.upflie({
							success:function(file, serverData){
								accountingDocumentFile(file, serverData);
							}
						,	file_size_limit:"2048000 B"
						,	file_dialog_complete_handler:function(numberSelected, numberQueued){
								upflie.startUpload();
							}
						,	file_queue_error_handler:function(file, errorCode, message){
								var msg=message;
								if(errorCode=='-110') msg='提示图片过大，请重新上传,最大只能上传2MB';
							}
						,	upload_start_handler:function(file){
								return true;
							}
						,	upid:'rechargeAlertUp'
						,	pic_w:48
						,	pic_h:19
						,	types:"*.jpg;*.gif;*.png"
						,	pic:'/static/ads_m_1.0/web/images/shangc.gif'
						,	url:window.wm.path.up
						})
					}()
				;
				return {
					show:function(fn){
						fn&&fn();
						PAYMENT_TYPE.setselvalue('0');
						window.selDom&&window.selDom.resall();
						rechargeChange.call({value:1});
						adiv.show();
					}
				,	rechargeChange:rechargeChange
				,	none:adiv.close
				,	obj:recharge_alert[0]
				};
			}()
		;
		window.setTitle=function(aid,findDom){
			$G('s',findDom).Each(function(){
				var name=$G(this).getAtt('name')
				,	d=dataList[aid]
				;
				if(!$G.isNaN(name)){
					this.innerHTML=d[name];
				}
			});
		};
		var recharge_detailed=function(){
				var	divDom=$G('#recharge_detailed')
				,	adiv=window.alertDiv({
						findObj:'#recharge_detailed'
					,	position:'absolute'
					,	move:$G('div:detailed_title',divDom[0])
					})
				,	searchList=$G('.searchList',divDom[0])
				;
				window.closeSearch=adiv.close;
				return {
					show:function(fn,json){
						fn&&fn();
						searchList[0].src='/finance/search/main.html?uid='+json.ACCOUNT_ID;
						adiv.show();
					}
				,	obj:divDom[0]
				,	none:adiv.close
				};
		}();
		listData.click(function(ag,et){
			var obj=$G(et)
			,	name=obj.getAtt('name')
			,	value=obj.getAtt('value')
			;
			if(name=='demo'){
				window.userDemo.show(value);
			}else if(name=='recharge'){
				recharge_alert.show(function(){
					var fd=$G('div:ms_rg',recharge_alert.obj);
					$G('li span',fd[0]).Each(function(){
						var name=$G(this).getAtt('name')
						,	d=dataList[value]
						;
						if(!$G.isNaN(name)){
							this.innerHTML=d[name];
						}
					});
					$G('input',fd[0]).val(value);
					$G('.MONEY .ACCOUNTING_DOCUMENT_REMARK .ACCOUNTING_DOCUMENT_NUMBER .ACCOUNTING_DOCUMENT_FILE',recharge_alert.obj).Each(function(){
						this.value='';
					});
				});
			}else if(name=='rechargeInfo'){
				recharge_detailed.show(function(){
					
				},{ACCOUNT_ID:value});
			}
		});
		return {
			list:function(p){
				pageArray['PAGE_INDEX']=obj.p||pageIni.PAGE_INDEX;
				list.sub();
			}
		,	rechargeChange:recharge_alert.rechargeChange
		};
	}();
});