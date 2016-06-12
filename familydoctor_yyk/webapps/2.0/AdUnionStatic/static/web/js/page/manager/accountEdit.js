$G(function(){
	window.user=function(){
		var findDom=$G('#account_edit')
		,	industry=$G('.industry',findDom[0])
		,	model={
					COMPANY_NAME  :""
				,	COMPANY_SITE  :""
				,	INDUSTRY      :""
				,	PROVINCE_ID   :""
				,	CITY_ID       :""
				,	ADDRESS       :""
				,	POSTCODE      :""
				,	CONTACT       :""
				,	TELEPHONE     :""
				,	FAX           :""
				,	MOBILE        :""
				,	EMAIL         :""
				,	WEBIM         :""
				,	GUAHAO_TOKEN  :""
				,	HOSPITAL_IMG  :""
				,	LOGIN_PASSWORD:""
				,	REGION_NAME_CN:""
				,	STATUS		  :""
				,	SALES		  :""
				,	CUSTOMER_SERVICE		  :""
				,	PLACE_REGION  :""
				,	DOCTORS_ID:""
			}
		,	modelAdd={
						INDUSTRY		      :''
					,	FAX			          :''
					,	WEBIM			        :''
					,	GUAHAO_TOKEN		  :''
					,	HOSPITAL_IMG		  :''
					,	SALES		  :""
					,	CUSTOMER_SERVICE		  :""
			}
		,	region=null
		,	regionFn=function(){
				if(region){return false;}
				window.ajax({
					path:'GET_REGION_CODE'
				,	calback:function(JSON){
						region=window.region({
							obj:$G('#szqydisplay')[0]
						,	data:JSON
						,	provinceId:'#accountParent'
						,	cityId:'#accountRegion'
						});
					}
				});
			}()
		,	subFunction=function(){}
		,	isPass=true
		,	ini=function(o){
				o=o||{};
				if(o.type=='edit'){
					$G('.userNew').Each(function(){
						this.style.display='none';
					});
					$G('.userEdit').Each(function(){
						this.style.display='';
					});
					$G('.pass1 .pass2').val('111111');
					isPass=false;
					$G('.apiToken .LOGIN_NAME',findDom[0]).setAtt('disabled',true);
				}else{
					$G('.userNew').Each(function(){
						this.style.display='';
					});
					$G('.userEdit').Each(function(){
						this.style.display='none';
					});
					isPass=true;
					$G('.API_TOKEN',findDom[0]).setAtt('disabled',true);
					$G('.LOGIN_NAME',findDom[0])[0].disabled=false;
				}
				if(o.fn)subFunction=o.fn;
			}
		,	reset=function(){
				$G('input',findDom[0]).Each(function(){
					if(this.name!='PLACE_REGION_SUB')
						this.value='';
				});
				$G('#guahaoKey',findDom[0])[0].value='';
				region&&region.set(1,100);
				industry.setselvalue('--请选择--');
				$G('.companySite',findDom[0]).val('http://');
				window.selDom&&window.selDom.resall();
				setToken();

				
			}
		,	webim=function(){
				var dom=$G('.WEBIM',findDom[0])
				,	v=dom[0].value
				;
				if($G.isHttpUrl(v) || window.wm.ckType.len(v,20,1024)){
					window.msg.call(dom[0],{msg:'以http开头的有效url地址，输入长度需大于等于20个字符且不超过1024个字符长度。'});
					return false;
				}else this.href=v;
			}
		,	guahaoToken=function(){
				var dom=$G('.GUAHAO_TOKEN',findDom[0])
				,	v=dom[0].value
				;
				if($G.isNaN(v)){
					window.msg.call(dom[0],{msg:'挂号网标识不能为空。'});
					return false;
				}else
					this.href='http://www.guahao.com/hospital/'+v;
			}
		,	guahaoKey=function(){
				var dom=$G('#guahaoKey',findDom[0])
				,	v=dom[0].value
				;
				if($G.isNaN(v)){
					window.msg.call(dom[0],{msg:'挂号网科室标识不能为空。'});
					return false;
				}else
					this.href='http://www.guahao.com/department/'+v;
			}
		,	getToken=function(fn){
				return;
				window.ajax({
					url:window.config.mUrl.account.getApiToken
				,	calback:function(json){
						fn&&fn(json);
					}
				});
			}
		,	setToken=function(){
				getToken(function(json){
					$G('.API_TOKEN',findDom[0]).val(json.apiToken);
				});
			}
		,	upflie=function(){
				return $G.upflie({
					success:function(file, serverData){
						var JSON=$G.parseJSON(serverData)
						if(window.wm.msg(JSON.CODE,false)){
							$G('.HOSPITAL_IMG',findDom[0]).val(JSON.FILE_PATH);
						}
					}
				,	file_size_limit:"102400 B"
				,	file_dialog_complete_handler:function(numberSelected, numberQueued){
						upflie.startUpload();
					}
				,	file_queue_error_handler:function(file, errorCode, message){
						var msg=message;
						if(errorCode=='-110') msg='提示图片过大，请重新上传,最大只能上传10KB';
						else alert(errorCode+'='+message);
						window.msg.call($G('.HOSPITAL_IMG',findDom[0])[0],{msg:msg});
					}
				,	upload_start_handler:function(file){
						return true;
					}
				,	file_post_name:'hospitalImgFile'
				,	upid:'hospitalImgFile'
				,	pic_w:48
				,	pic_h:19
				,	types:"*.jpg"
				,	pic:'/static/ads_m_1.0/web/images/shangc.gif'
				,	url:window.wm.path.up
				})
			}()
		,	sub=function(){
				var calbackFn=function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							subFunction();
							window.altBox.show({
								title:'提示信息'
							,	msg:'保存成功！'
							});
						}
					};
				return window.subAjax('#account_edit',{
					path:'ADD_MANAGER_ACCOUNT'
				,	sub:'.submit'
				,	findDom:findDom[0]
				,	ckdata:function(data){
						var ckLoginPassword=data['pass1']||null
						,	industry=data['INDUSTRY']
						;
						if(isPass){
							var ckPass={};
							ckPass[ckLoginPassword+'']=0;
							ckPass[data['pass2']+'']=1;
							if(ckPass[ckLoginPassword]<1){
								window.msg.call($G('.pass1',findDom[0])[0],{msg:'确认密码与登录密码不一致，请重新输入'});
								return;
							}
							data['LOGIN_PASSWORD']=ckLoginPassword;
						}else {
							delete data['LOGIN_NAME'];
							/*var apiTokenState=$G('.apiTokenState',findDom[0])
							,	checked=apiTokenState.checked(true)
							;
							if(checked.length>0){
								data['apiTokenState']=1;
							}else{
								data['apiTokenState']=2;
							}*/
						}
						delete data['pass1'];
						delete data['pass2'];
						
						if(industry=='--请选择--'){
							delete data['INDUSTRY'];
							//window.msg.call($G('.industry',findDom[0])[0],{msg:'请选择您的所属行业'});
							//return;
						}
						
						if(data['PROVINCE_ID']){
							data['PROVINCE_ID']=region.regionList[data['PROVINCE_ID']].regionId;
						}

						if(data['CITY_ID']){
							data['CITY_ID']=region.regionList[data['CITY_ID']].regionId;
						}
						var guahaoKey=$G('#guahaoKey',findDom[0])
						;

						

						if(guahaoKey[0].value){
							if(!data['GUAHAO_TOKEN']){
								window.msg.call($G('.GUAHAO_TOKEN',findDom[0])[0],{msg:'挂号网医院ID不能为空'});
								return;
							}
							data['GUAHAO_TOKEN']=data['GUAHAO_TOKEN']+'||'+guahaoKey[0].value;
						}
						data['REGION_NAME_CN']=region.regionList[data['PROVINCE_ID']].nameCN+' '+region.regionList[data['CITY_ID']].nameCN;
						
						data['PLACE_REGION']=($G('.PLACE_REGION_SUB').checked(true))[0];
						var d={
							'UPDATE_TYPE':0
						};
						if($G.isNaN(data['ACCOUNT_ID'])){
							d=window.wm.subDataManager(modelAdd,modelAdd,data);
							d['path']='ADD_MANAGER_ACCOUNT';
						}else{
							d=window.wm.subDataManager(window.account.dataList[data['ACCOUNT_ID']],model,data);
							d['path']='SET_MANAGER_ACCOUNT_INFO';
						}
						
						var inps = $G(".DOCTORS_ID");
						if(inps.length>0)
						d["DOCTORS_ID"]=inps[0].value;
						return d;
					}
				,	callback:calbackFn
				});
			}()
		,	safe=function(){
				var	account_safe_set=$G('#account_safe_set')
				,	adiv=window.alertDiv({
						findObj:'#account_safe_set'
					,	position:'absolute'
					,	move:$G('div:account_title',account_safe_set[0])
					})
				,	int=$G('input',account_safe_set[0])
				,	li=$G('.li',account_safe_set[0])
				,	onA=$G('a',account_safe_set[0])
				,	pass=$G('.LOGIN_PASSWORD',account_safe_set[0])
				,	accountId=$G('.ACCOUNT_ID',account_safe_set[0])
				,	calbackFn=function(JSON){
							if(window.wm.msg(JSON.CODE,false)){
								adiv.close();
								window.altBox.show({
									title:'提示信息'
								,	msg:'保存成功！'
								});
							}
						}
				;
				int.Each(function(i){
					if(i>1){
						this.disabled=true;
					}
				});
				onA.click(function(ag,et){
					if(et.innerHTML!='保存')return;
					if(!$G.isPass(pass[0].value)){
						window.msg.call(pass[0],{msg:'请勿使用除字母、数字、下划线、英文句点外的其他字符!'});
						return;
					}else if(window.wm.ckType.len(pass[0].value,6,16)){
						window.msg.call(pass[0],{msg:'最小6个字符长度，最大16个字符长度'});
						return;
					}
					var data=function(data){
						var accountID=$G('.ACCOUNT_ID',account_safe_set[0])[0].value
						,	password=$G('.LOGIN_PASSWORD',account_safe_set[0])[0].value
						,	d=window.wm.subDataManager(window.account.dataList[accountID],model,{
								'ACCOUNT_ID':accountID
							,	'LOGIN_PASSWORD':password
							})
						;
						if(d['UPDATE_TYPE']==0){
							calbackFn({CODE:0});
							return false;
						}else
							return d;
					}();
					if(!data)return;
					window.ajax({
						path:'SET_MANAGER_ACCOUNT_INFO'
					,	type:'post'
					,	data:data
					,	calback:calbackFn
					});
				});
				return {
					show:function(json){
						adiv.show();
						pass[0].value='';
						int.Each(function(i){
							if(i<2)return;
							var obj=$G(this)
							,	name=obj.getAtt('name')
							;
							if(name!='PLACE_REGION_SUB')
								this.value=json[name]||'';
						});
						li.Each(function(i,k){
							var obj=$G(this)
							,	id=obj.getAtt('id')
							;
							this.innerHTML=json[id]||'';
						});
					}
				,	none:adiv.close
				}
			}()
		;
		$G.Each(function(){
			industry.addsel(this,this);
		},window.mapIndustry);
		region&&region.set(1,100);
		window.selDom&&window.selDom.resall();
		return {
			region:function(){
				return region;
			}
		,	ini:ini
		,	reset:reset
		,	webim:webim
		,	guahaoToken:guahaoToken
		,	guahaoKey:guahaoKey
		,	setToken:setToken
		,	getToken:getToken
		,	safe:safe
		,	sub:sub
		};
	}();
	
});