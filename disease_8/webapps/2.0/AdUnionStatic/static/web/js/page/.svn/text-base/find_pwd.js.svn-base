window.cklogin=function(){
	$G.ajax({
		type:'get',
		url:window.config.url.login.status,
		dataType:'json',
		beforeSend:function(){},
		error:function (XMLHttpRequest, textStatus, errorThrown) {},
		success:function(json){
			if(json&&json.code=='0002'){
					window.document.location=window.config.url.index.index;
			}
		}
	});
};
$G(
function(){
	var industry=$G('.industry')
	;
	$G.Each(function(){
		industry.addsel(this,this);
	},window.mapIndustry);
	industry.setselvalue('--请选择--');
	
	window.selDom&&window.selDom.resall();
	var imgcode=$G('.resVercode .resVercodeA')
	,	imgList=$G('.resVercode')
	,	imgres=function(n){
			var v=($G(this).getAtt('value'))
			,	fn=function(){
					this.src=window.config.url.vercode.img+new Date().getTime();
				}
			;
			if($G.isNaN(v))v=n||'';
			if($G.isNaN(v)){
				imgList.Each(function(){
					fn.call(this);
				});
			}else{
				fn.call(imgList[v]);
			}
		}
	;
	imgres('0');
	imgcode.click(imgres);
	var altBoxOk=$G('#idAlertOK')
	;
	var getQuestionSub=window.subAjax('#get_question',{
			sub:'a:find_btn'
		,	url:window.config.url.register.getProtectQuestion
		,	dataType:'json'
		,	ckdata:function(data){
				data['vercode']=data['vercode'].toUpperCase();
				return data;
			}
		,	callback:function(json){
				if(window.ckmsg(json.code,'find',true)){
					getGuestion.none();
					pwdQuestion.show();
					$G('#questionTest').html(json.protectQuestion);
					$G('.protectQuestion').val(json.protectQuestion);
					$G('.loginName').val(json.loginName);
					imgres('1');
				}else{
					if(json.code=='1006'){
						window.altBox({
							title:'提示信息'
						,	msg:'验证码输入错误'
						});
					}else if(json.code=='0026'){
						window.altBox({
							title:'提示信息'
						,	msg:'您的账户已经被锁定，请联系客服'
						});
					}else
						$G('#right_code').show();
					imgres('0');
				}
			}
		})
	,	getGuestion=$G('#get_question')
	,	pwdQuestion=$G('#pwd_question')
	,	pwdQuestionSub=window.subAjax('#pwd_question',{
			sub:'.submit'
		,	url:window.config.url.register.setPwdByProtectQuestion
		,	dataType:'json'
		,	ckdata:function(data){
				data['vercode']=data['vercode'].toUpperCase();
				delete data['Confirmpassword'];
				return data;
			}
		,	callback:function(json){
				altBoxOk[0].onclick=function(){};
				if(window.ckmsg(json.code,'find',true)){
					altBoxOk[0].onclick=function(){
						window.toLogin();
					};
					window.altBox({
						title:'提示信息'
					,	msg:'密码修改成功'
					});
				}else{
					var msg='密保答案回答错误，您还有'+json.num+'次机会';
					if(json.code=='0024'){
						if(json.num<1){
							msg='密保答案输入错误次数已超过3次，账户已锁定，24小时后将自动解锁'
						}
						window.altBox({
							title:'提示信息'
						,	msg:msg
						});
					}else if(json.code=='0027'){
						msg='密保答案输入错误次数已超过3次，账户已锁定，24小时后将自动解锁';
					}else if(json.code=='0026'){
						msg='您的账户已经被锁定，请联系客服';
					}else if(json.code=='1006'){
						msg='验证码输入错误';
					}
					window.altBox({
						title:'提示信息'
					,	msg:msg
					});
					imgres('1');
				}
			}
		})
	;
	
}
);