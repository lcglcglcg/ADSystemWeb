window.headerEnd(function(){
	window.brand=function(){
		var findDom=$G('div:main')
		,	DataList=$G('#brandList')
		,	toolDom=$G('a',$G('div:s_bottom',findDom[0])[0])
		,	account_edit=$G('#account_edit')
		,	bakRegionData = ""
		,	getState=function(k){
				var state={
					'1':['投放中','green','查看创意']
				,	'2':['已结束','gray','查看创意']
				,	'3':['待投放','orange','查看创意']
				,	'4':['申请中',' ','订单审核']
				,	'5':['已过期','gray','--']
				,	'6':['申请拒绝','red','查看原因']
				};
				return state[k];
			}
		,	dataList={}
		;
		
		/***********************查询功能开始************************************/
		/***********************投放科室************************************/
		var putKeshi=$G('#putKeshi')
		,	putKeshiFn=function(){
				var adiv=$G('#select_keshi')
				,	show=function(){
						adiv.WinAlt({
							position:'absolute',
							lock_back:'#BBBBBB',
							fixedDom:putKeshi[0],
							lock_opa:30
						});
					}
				;
				$G('#touf_kes').none();
				$G('.close',adiv[0]).click(function(){
					adiv.display().none();
				});
				return {
					show:function(){
						show();
					},
					hide: function() {
						adiv.display().none();
					}
				}
			}()
		;
		putKeshi.click(function(){
			putKeshiFn.show();
			putRegionFn.hide();
		});
		window.keshi.setAll();
		/***********************投放区域************************************/
		var putRegion=$G('#putRegion')
		,	putRegionFn=function(){
				var adiv=$G('#RegionList')
				,	show=function(){
						adiv.WinAlt({
							position:'absolute',
							lock_back:'#BBBBBB',
							fixedDom:putRegion[0],
							lock_opa:30
						}).Move({moveobj:$G('ol:region_title')});
					}
				;
				
				$G('.close',adiv[0]).click(function(){
					adiv.display().none();
				});
				return {
					show:function(){
						$("#RegionList input[type = 'checkbox']").removeAttr("disabled");
						show();
					},
					hide: function() {
						adiv.display().none();
					}
				}
			}()
		;
		putRegion.click(function(){
			window.region.setRegion(bakRegionData);
			putRegionFn.show();
			putKeshiFn.hide();
		});
		/***********************查询功能结束************************************/
		/***********************查看投放科室************************************/
		var view_keshi=$G('#view_keshi')
		,	viewKeshi=function(){
				var adiv=view_keshi
				,	show=function(){
						adiv.WinAlt({
							position:'absolute',
							lock_back:'#BBBBBB',
							fixedDom:putKeshi[0],
							lock_opa:30
						});
					}
				;
				$G('.close',adiv[0]).click(function(){
					adiv.display().none();
				});
				return {
					show:function(){
						show();
					},
					hide: function() {
						adiv.display().none();
					}
				}
			}()
		;
		/***********************获取列表************************************/
		var listLi=$G('#listLi')
		,	listLiMenu=$G('#ListLiMenu')
		,	listLiFoot=$G('#listLiFoot')
		,	listLiErr=$G('#listLiErr')
		,	page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	getTimeFn=function(name){
				var putTime=$G('.'+name,findDom[0]).getAtt('subValue')
				;
				if(!$G.isNaN(putTime)){
					return putTime.split('至');
				}
				return new Array();
			}
		,	list=window.subAjax('div:conditions',{
					path:'GET_BRAND'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:DataList[0]
				,	ckdata : function(data) {
			
					var t=getTimeFn('putTime');
					if(t.length>0){
						data['SHOW_TIME_TYPE']=2;
						data['SHOW_TIME_START']=t[0];
						data['SHOW_TIME_END']=t[1];
					}else{
						data['SHOW_TIME_TYPE']=1;
					}
					delete data['putTime'];
					
					data['CREATE_TIME_START']='';
					data['CREATE_TIME_END']='';
					var t=getTimeFn('createTime');
					if(t.length>0){
						data['CREATE_TIME_START']=t[0];
						data['CREATE_TIME_END']=t[1];
						data['CREATE_TIME_TYPE']=2;
					} else {
						data['CREATE_TIME_TYPE']=1;
					}
					delete data['createTime'];
			
					data['REGION_TYPE'] = 1;
					
					var regionCode = window.region.getRegion(true);
					bakRegionData = regionCode;
					if (regionCode) {
						data['REGION_TYPE'] = 2;
						data['REGION_SERIALIZE'] = regionCode;
					}
			
					data['DEPT_TYPE'] = 1;
					var keshiCode = window.keshi.getid();
					if (keshiCode) {
						data['DEPT_TYPE'] = 2;
						data['DEPT_SERIALIZE'] = keshiCode;
					}
					
					var d = window.wm.setDataListManager(data, findDom[0], pageArray);
					return d;
				}
				,	callback:function(JSON){
						var str=''
						,	postdata=this.postdata
						,	regData=window.region.code
						,	ksData=window.keshi.code
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
							DataList[0].innerHTML=listLiErr.html();
							return false;
						}

                        // 临时变量 为了记下 STATUS 然后判断是否有创意参与是否赋值
                        var tempStatus = "";

						for(var i=0;i<n;i++){
							var	v=JSON.LIST[i]
							,	hStr=listLi[0].innerHTML
							;
							dataList[v.BRAND_ID]=v;
							$G.Each(function(i,val,json){
								var value=this+'';
								if(val=='STATUS'){
                                    tempStatus = getState(value);

									//var stateArray=getState(value);
									//value=stateArray[0];
									//hStr=setVal(hStr,'stateCss',stateArray[1]);
									//hStr=setVal(hStr,'tool',stateArray[2]);
								}else if(val=='DEPT_SERIALIZE'){
									var v=value.split(',');
									hStr=setVal(hStr,'DEPT_NAME',ksData[v[0]]);
								}else if(val=='REGION_SERIALIZE'){
									var regHtml='';
									if(json.REGION_TYPE==0){
										regHtml='全部区域';
									}else {
										var v=value.split(',')
										,	regHtml='<a class="p_a_style1" value="'+json.REGION_SERIALIZE+'" name="region">'+regData[v[0]]+'</a>'
										;
									}
									hStr=window.wm.setVal(hStr,'REGION_SERIALIZE_NAME',regHtml);
								}else if (val == "BRAND_CREATIVE_STATUS") {
									if (value == 1) {
										hStr=setVal(hStr,'stateCss',"");
										hStr=setVal(hStr,'tool',"-");
									} else {

                                        var stateArray=tempStatus;

                                        value=stateArray[0];
                                        hStr=setVal(hStr,'stateCss',stateArray[1]);
                                        hStr=setVal(hStr,'tool',stateArray[2]);
                                    }
								}
								hStr=setVal(hStr,val,value);
							},v);
							
							str+=hStr;
						}
						page.setup(JSON.INFO.COUNT,n,pageArray);
						DataList[0].innerHTML=listLiMenu[0].innerHTML+str+listLiFoot[0].innerHTML;
						
						$G('.dept',DataList[0]).click(function(){
							var v=$G(this).getAtt('value');
							viewKeshi.show();
							window.viewkeshi.show(v);
						});
						$G('.region',DataList[0]).click(function(){
							var v=$G(this).getAtt('value');
							putRegionFn.show();
							
							$("#RegionList input[type = 'checkbox']").attr("disabled", "true");
							window.region.setRegion(v);
						});
						$G('.tool',DataList[0]).click(function(a,et){
							var obj=$G(et)
							,	value=obj.getAtt('value')
							,	html=this.innerHTML
							;
							if(html=='订单审核'){
								this.target = "_blank";
								this.href='/brand/add.html?id='+value;
							}else if(html=='查看原因'){
								viewReason(value);
							}else if(html=='查看创意'){
								viewBrand(value);
							}
						});
					}
				});
		;
		pageArray['click']=function(pageObj){
			pageArray=pageObj;
			list.sub();
		};
		var timer = setInterval(function() {
			if (region.isLoad()) {
				list.sub();
				clearInterval(timer);
			}
		},10);
		return {
			list:function(p){
				pageArray['PAGE_INDEX']=obj.p||pageIni.PAGE_INDEX;
				list.sub();
			}
		,	dataList:dataList
		,	selectAll:selectAll
		,	selectId:selectId
		};
	}();
	
});
