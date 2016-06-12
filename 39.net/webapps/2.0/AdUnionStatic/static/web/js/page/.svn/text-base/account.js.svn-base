window.headerEnd(function(){
	var userInfo={}
	,	questionList={}
	,	region=null
	,	regionTime=function(fn){
			(function () {
				try {
					if(region)
						fn&&fn();
					else setTimeout(arguments.callee, 0);
				}catch (err) {}    
			})();
		}
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
	,	configINI=function(){
			$G('input',$G('div:account_cont')[0]).Each(function(){
				if($G.isNaN(this.name))return;
				this.value=userInfo[this.name]||'';
				this.readOnly=true;
			});
			if(region && region.set){
				regionTime(region.set(userInfo['PROVINCE_ID'],userInfo['CITY_ID']));
				window.selDom.readOnly(true);
			}
		}
	;
	window.ajax({
		obj:$G('#chartdiv')[0]
	,	path:'GET_USER_INFO'
	,	calback:function(JSON){
			$G('.USER_LOGIN_NAME .COMPANY_NAME .COMPANY_SITE .INDUSTRY .API_TOKEN',$G('#accountMsg')[0]).Each(function(){
				this.innerHTML=JSON[$G(this).getAtt('name')];
				userInfo=JSON;
				configINI();
			});
			$G('.USER_LOGIN_NAME .LATE_LOGIN_TIME .LATE_LOGIN_IP .LATE_LOGIN_ADDRESS',$G('#conta2')[0]).Each(function(){
				this.innerHTML=JSON[$G(this).getAtt('name')];
			});
		}
	});
	$G('#titlea1 #titlea2').click(function(){
		var cobj=$G('#conta1 #conta2')
		,	i=(this.id.replace(/titlea/,''))-1
		;
		cobj.Each(function(){
			this.style.display='none';
		});
		$G('#titlea1 #titlea2').Each(function(){
			this.className='';
		});
		cobj[i].style.display='';
		if(i==0)window.selDom.readOnly(true);
		else window.selDom.readOnly(false);
		this.className='a_curr';
	});
	var user_save=$G('#user_save')
	,	userSaveOnClick=function(bl){
			$G('input ',$G('div:account_cont')[0]).Each(function(){
				this.readOnly=bl===true?true:false;
			});
			if(bl===true){
				user_save[0].style.display='none';
				window.selDom.readOnly(true);
			}else{
				user_save[0].style.display='';
				window.selDom.readOnly(false);
			}
		}
	;
	$G('#user_edit').click(userSaveOnClick);
	$G('.clear',user_save[0]).click(function(){
		configINI();
		userSaveOnClick(true);
	});
	window.subAjax('div:account_cont',{
		path:'SET_USER_INFO'
	,	sub:'#userSaveSub'
	,	ckdata:function(data){
			userSaveOnClick(true);
			return data;
		}
	,	callback:function(json){
			$G.Each(function(i,k){
				userInfo[k]=this+'';
			},this.postdata);
		}
	});
	
	/******************************************修改密码-弹出********************************************/
	var updatePwdAlt=function(){
		var update_pwd=$G('#update_pwd');
		var update_pwdAlert=window.alertDiv({
			findObj:'#update_pwd'
		,	closeObj:'.close_bnt'
		,	position:'absolute'
		,	move:$G('div:update_title',update_pwd[0])
		});
		return {
			show:function(){
					update_pwdAlert.show();
				}
		,	close:update_pwdAlert.close
		};
	}();
	/******************************************修改密码-密保问题按钮********************************************/
	$G('#protectQuestionEditPassWord')[0].onclick=function(){
		updatePwdAlt.close();
		$G('#pwd_tt_name1').html('密保问题>修改密码');
		pwdUpdateStep_1_Alt.passwordTipDisplayNone();
		$G('.passwordEditTip0 .passwordEditTip1',pwdUpdateStep_1_Alt.obj).Each(function(i){
			this.style.display='';
		});
		pwdUpdateStep_1_Alt.show();
	};
	/***********************************修改密码-修改密码-弹出***********************************************/
	var pwdUpdateStep2Alt=function(){
		var pwd_update_step2=$G('#pwd_update_step2')
		,	PROTECT_QUESTION=$G('.PROTECT_QUESTION',pwd_update_step2[0])
		,	PROTECT_ANSWER=$G('.PROTECT_ANSWER',pwd_update_step2[0])
		,	pwd_update_step2Alert=window.alertDiv({
				findObj:'#pwd_update_step2'
			,	closeObj:'.close_bnt'
			,	position:'absolute'
			,	move:$G('div:update_title',pwd_update_step2[0])
			})
		;
		return {
			show:function(json){
					$G('input',pwd_update_step2[0]).val('');
					//PROTECT_QUESTION[0].value=json.PROTECT_QUESTION;
					//PROTECT_ANSWER[0].value=json.PROTECT_ANSWER;
					pwd_update_step2Alert.show();
				}
		,	close:pwd_update_step2Alert.close
		,	obj:pwd_update_step2[0]
		};
	}();
	/***********************************修改密码-密保验证-提交****************************************/
	window.subAjax('#pwd_update_step1',{
		path:'USER_PASS_PROTECT_AUTHEN'
	,	sub:'#ToVerify'
	,	ckdata:function(data){
			var quest=$G('.PROTECT_QUESTION',pwdUpdateStep_1_Alt.obj)
			,	protectAnswer=data['PROTECT_ANSWER']
			;
			if($G.isNaN(quest[0].value) || quest[0].value=='0'){
				window.msg.call($G('.protectQuestion_msg',pwdUpdateStep_1_Alt.obj)[0],{msg:'请选择密保问题'});
				return false;
			}
			if($G.len(protectAnswer)>20){
				window.msg.call($G('.PROTECT_ANSWER',pwdUpdateStep_1_Alt.obj)[0],{msg:'密保答案不能超过10个汉字'});
				return false;
			}
			data['PROTECT_QUESTION']=quest.getseltext()['PROTECT_QUESTION'];
			return data;
		}
	,	callback:function(JSON){
			if(window.wm.msg(JSON.CODE,false)){
				pwdUpdateStep_1_Alt.close();
				if($G('#pwd_tt_name1')[0].innerHTML=='修改密保问题'){
					$G('#update_account_w_title').html('修改密保问题');
					updateAccountPwdAlt.show(this.postdata);
				}else
					pwdUpdateStep2Alt.show(this.postdata);
				return;
			}
		}
	});
	/************************************修改密码-修改账户密码-提交*****************************************************/
	window.subAjax('#pwd_update_step2',{
		path:'SET_USER_PASS'
	,	sub:'.pwdEditSub'
	,	ckdata:function(data){
			data['PASS_OLD']=hex_md5(data['PASS_OLD']).toLowerCase();
			delete data['PASS_NEW_CK'];
			return data;
		}
	,	callback:function(JSON){
			if(window.wm.msg(JSON.CODE,false)){
				window.altBox.show({
					msg:'密码修改成功！请点击确定返回！'
				});
				pwdUpdateStep2Alt.close();
				return;
			}
		}
	});
	/************************************修改密码-密保问题-弹出********************************************/
	var pwdUpdateStep_1_Alt=function(){
		var pwd_update_step1=$G('#pwd_update_step1');
		var pwd_update_step1Alert=window.alertDiv({
			findObj:'#pwd_update_step1'
		,	closeObj:'.close_bnt'
		,	position:'absolute'
		,	move:$G('div:update_title',pwd_update_step1[0])
		});
		return {
			show:function(){
					pwd_update_step1Alert.show('','',function(){
						$G('.PROTECT_ANSWER',pwd_update_step1[0]).Each(function(){
							this.value='';
						});
						$G('select',pwd_update_step1[0]).setseltext(questionList['PROTECT_QUESTION'+function(){
							var k=Math.round(Math.random()*10)%3;
							if(k<1)k=1;
							else if(k>3)k=3;
							return k;
						}()]);
						window.selDom.resall();
						var objs=window.selDom.getObjs;
						for(var i=0,n=objs.length;i<n;i++){
							if(objs[i].name=='PROTECT_QUESTION'){
								window.selDom.res(objs[i],function(opObj){
									if(
										opObj.text==questionList['PROTECT_QUESTION1']
									||	opObj.text==questionList['PROTECT_QUESTION2']
									||	opObj.text==questionList['PROTECT_QUESTION3']
									){
										return true;
									}else return false;
								});
							}
						}
					});
				}
		,	close:pwd_update_step1Alert.close
		,	passwordTipDisplayNone:function(){
				$G('.passwordEditTip0 .passwordEditTip1 .passwordEditTip2',pwd_update_step1[0]).Each(function(i){
					this.style.display='none';
				});
			}
		,	obj:pwd_update_step1[0]
		};
	}();
	/***********************************密保问题-修改密保-弹出********************************************************/
	var updateAccountPwdAlt=function(){
		var update_account_pwd=$G('#update_account_pwd')
		,	PROTECT_QUESTION=$G('.PROTECT_QUESTION',update_account_pwd[0])
		,	PROTECT_ANSWER=$G('.PROTECT_ANSWER',update_account_pwd[0])
		,	update_account_pwdAlert=window.alertDiv({
				findObj:'#update_account_pwd'
			,	closeObj:'.close_bnt'
			,	position:'absolute'
			,	move:$G('div:update_title',update_account_pwd[0])
			})
		;
		return {
			show:function(json){
					json=json||{};
					$G('input',update_account_pwd[0]).val('');
					PROTECT_QUESTION[0].value=json.PROTECT_QUESTION||null;
					PROTECT_ANSWER[0].value=json.PROTECT_ANSWER||null;
					update_account_pwdAlert.show();
					$G('select',update_account_pwd[0]).setseltext('请选择密保问题');
					window.selDom.resall();
				}
		,	close:update_account_pwdAlert.close
		,	obj:update_account_pwd[0]
		};
	}();
	/***********************************密保问题-修改密保-提交********************************************************/
	window.subAjax('#update_account_pwd',{
			path:'SET_USER_PASS_PROTECT'
		,	sub:'#update_account_pwd_sub'
		,	ckdata:function(data){
				var quest=$G('.PROTECT_QUESTION1 .PROTECT_QUESTION2 .PROTECT_QUESTION3',updateAccountPwdAlt.obj)
				,	answer=$G('input:u_input_01',updateAccountPwdAlt.obj)
				;
				if($G.isNaN(quest[0].value) || quest[0].value==='请选择密保问题'){
					window.msg.call($G('#protectQuestion1_msg')[0],{msg:'请选择密保问题1'});
					return false;
				}else if($G.isNaN(quest[1].value) || quest[1].value==='请选择密保问题'){
					window.msg.call($G('#protectQuestion2_msg')[0],{msg:'请选择密保问题2'});
					return false;
				}else if($G.isNaN(quest[2].value) || quest[2].value==='请选择密保问题'){
					window.msg.call($G('#protectQuestion3_msg')[0],{msg:'请选择密保问题3'});
					return false;
				}
				if($G.len(answer[0].value)>20){
					window.msg.call(answer[0],{msg:'密保问题1的答案不得超过20个字符'});
					return false;
				}else if($G.len(answer[1].value)>20){
					window.msg.call(answer[1],{msg:'密保问题2的答案不得超过20个字符'});
					return false;
				}else if($G.len(answer[2].value)>20){
					window.msg.call(answer[2],{msg:'密保问题3的答案不得超过20个字符'});
					return false;
				}
				if(quest[0].value==quest[1].value){
					window.msg.call($G('#protectQuestion2_msg')[0],{msg:'密保问题1与密保问题2不能相同'});
					return false;
				}else if(quest[0].value==quest[2].value){
					window.msg.call($G('#protectQuestion3_msg')[0],{msg:'密保问题1与密保问题3不能相同'});
					return false;
				}else if(quest[1].value==quest[2].value){
					window.msg.call($G('#protectQuestion3_msg')[0],{msg:'密保问题2与密保问题3不能相同'});
					return false;
				}
				var test=quest.getseltext();
				data['PROTECT_QUESTION1']=test['PROTECT_QUESTION1'];
				data['PROTECT_QUESTION2']=test['PROTECT_QUESTION2'];
				data['PROTECT_QUESTION3']=test['PROTECT_QUESTION3'];
				return data;
			}
		,	callback:function(JSON){
				if(window.wm.msg(JSON.CODE,false)){
					updateAccountPwdAlt.close();
					window.altBox.show({
						msg:'密保问题设置成功！请点击确定返回！'
					,	okfn:function(){
							window.document.location=window.document.location;
						}
					});
				}
			}
		});
	
	window.ajax({
		obj:$G('#chartdiv')[0]
	,	path:'GET_USER_PASS_PROTECT'
	,	calback:function(JSON){
			questionList=JSON;
			$G('#editUserPass_0 #editUserPass_1 #protectQuestion_0 #protectQuestion_1').Each(function(i){
				if(!$G.isNaN(questionList.PROTECT_QUESTION1)
					&& !$G.isNaN(questionList.PROTECT_QUESTION2)
					&& !$G.isNaN(questionList.PROTECT_QUESTION3)
				){
					if(i%2){
						this.style.display='';
					}else{
						this.style.display='none';
					}
					if(this.id=='editUserPass_1'){
						this.onclick=function(){
							//updatePwdAlt.show();
							pwdUpdateStep2Alt.show();
						};
						
					}else if(this.id=='protectQuestion_1'){
						this.onclick=function(){
							pwdUpdateStep2Alt.show();
							return;
							$G('#pwd_tt_name1',pwdUpdateStep_1_Alt.obj).html('修改密保问题');
							pwdUpdateStep_1_Alt.passwordTipDisplayNone();
							$G('.passwordEditTip0 .passwordEditTip1',pwdUpdateStep_1_Alt.obj).Each(function(i){
								this.style.display='';
							});
							pwdUpdateStep_1_Alt.show();
						};
						
					}
				}else{
					if(i%2){
						this.style.display='none';
					}else{
						this.style.display='';
					}
					if(this.id=='editUserPass_0'){
						this.onclick=function(){
							pwdUpdateStep2Alt.show();
							return;
							updateAccountPwdAlt.show();
							$G('#update_account_w_title').html('修改密码-设置密保问题');
						};
					}else if(this.id=='protectQuestion_0'){
						this.onclick=function(){
							updateAccountPwdAlt.show();
							$G('#update_account_w_title').html('设置密保问题');
						};
					}
				}
			});
		}
	});
	
});