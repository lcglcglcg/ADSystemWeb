window.headerEnd(function(){
	window.rechargeSearch=function(){
		var findDom=$G('div:main')
		,	listData=$G('#listData')
		,	dataList={}
		,	getAccountId=$G.getid('uid')||''
		,	getTypeState=function(){
				var ay={}
				,	key=["","ACCOUNTING_DOCUMENT_NUMBER","ACCOUNTING_DOCUMENT_NUMBER","ACCOUNTING_DOCUMENT_REMARK"]
				,	text=["","支票","汇款","现金"]
				;
				for(var i=1;i<4;i++){
					ay[i]={key:key[i],text:text[i]};
				}
				return ay;
			}()
		;
		if(getAccountId){
			var findTypeDom=$G('.FIND_NAME_TYPE')
			;
			findTypeDom.setselvalue(4);
			for(var i=0;i<3;i++){
				findTypeDom.delselvalue(i+1);
			}
			window.selDom&&window.selDom.resall();
		}
		/***********************获取创意列表************************************/
		var liMenu=$G('#liMenu')
		,	liData=$G('#liData')
		,	liFoot=$G('#liFoot')
		,	page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	list=window.subAjax('#findSearch',{
					path:'GET_MONEY_LIST'
				,	sub:'#subList #exportReport'
				,	findDom:findDom[0]
				,	obj:listData[0]
				,	ckdata:function(data){
						data['FIND_TYPE']=0;
						if(!data['MONEY_TYPE'])data['MONEY_TYPE']=100;
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
						data['ACCOUNT_ID']=getAccountId;
						if(!$G.isNaN(data['ACCOUNT_ID'])){
							if(data['FIND_TYPE']==100)
								data['FIND_TYPE']=8;
							else
								data['FIND_TYPE']+=8;
						}
						var d=window.wm.setDataListManager(data,findDom[0],pageArray);
						//报表下载
						if(this.id=='exportReport'){
							if($G.isNaN(findtimeValue)){
								window.msg.call($G('.findtime',findDom[0])[0],{msg:'请选择时间范围'});
								this.href='javascript:void(0);';
								this.target='';
								return false;
							}
							this.target='_blank';
							
							var pd=window.wm.postDataIni(data,'CREATE_REPORT_MONEY_RECHARGE');
							this.href=window.wm.url+'?server='+pd['server'];
							return false;
						}
						d['STATUS']='';
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
							dataList[v.SWIFT_NUMBER]=v;
							$G.Each(function(i,val,json){
								var value=this+'';
								if( val=='BALANCE'
								||	val=='INVEST'
								){
									value=$G.FormatNumber(value);
								}else if(val=='PAYMENT_TYPE'){
									var typeState=getTypeState[value];
									hStr=setVal(hStr,'paymentTypeText',typeState['text']);
									hStr=setVal(hStr,'paymentTypeValue',json[typeState['key']]);
									this.onclick=function(){
									};
								}
								hStr=setVal(hStr,val,value);
							},v);
							str+=hStr;
						}
						page.setup(JSON.INFO.COUNT,n,pageArray);
						listData[0].innerHTML=liMenu[0].innerHTML+str;
						$G('a',listData[0]).Each(function(){
							var aDom=$G(this)
							,	value=aDom.getAtt('value')
							,	onFn=aDom.getAtt('onFn')
							;
							var vJson=dataList[value];
							if(onFn<3){
								this.onclick=function(){
									if(vJson)
										this.href=window.wm.path.pic.url+'/'+vJson.ACCOUNTING_DOCUMENT_FILE;
								};
							}else{
								this.onclick=function(){
									if(vJson)
										view.v2(function(imgAlert){
											$G('div:write_pingzheng',imgAlert[0]).html(vJson.ACCOUNTING_DOCUMENT_REMARK);
										});
								};
							}
						});
					}
				})
		,	view=function(){
				var recharge_view=$G('#recharge_view')
				,	recharge_view2=$G('#recharge_view2')
				,	v1=window.alertDiv({
							findObj:'#recharge_view'
						,	position:'absolute'
						,	move:$G('div:d_title',recharge_view[0])
					})
				,	v2=window.alertDiv({
							findObj:'#recharge_view2'
						,	position:'absolute'
						,	move:$G('div:title',recharge_view2[0])
					})
				;
				return {
					v1:function(fn){
						$G('img',recharge_view[0])[0].src='';
						recharge_view[0].style.width='0px';
						recharge_view[0].style.height='0px';
						fn&&fn.call(v1,recharge_view);
						v1.show();
					}
				,	v2:function(fn){
						fn&&fn.call(v2,recharge_view2);
						v2.show();
					}
				};
			}()
		;
		listData.click(function(ag,et){
			var obj=$G(et)
			,	name=obj.getAtt('name')
			,	value=obj.getAtt('value')
			;
			if(name=='demo'){
				window.top.userDemo.show(value);
			}
		});
		if(!$G.isNaN(getAccountId)){
			window.top.setTitle(getAccountId,$G('#detailedTitle')[0]);
			$G('.closeMain').click(function(){
				listData[0].innerHTML='';
				window.top.closeSearch();
			});
			pageArray['PAGE_COUNT']=10;
		}
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
		};
	}();
	
});