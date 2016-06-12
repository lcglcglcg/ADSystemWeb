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
	var region=window.region({
			obj:$G('#szqydisplay')[0]
		,	provinceId:'.provinceId'
		,	cityId:'.cityId'
		,	data:window.regionArray
		})
	,	industry=$G('.industry')
	,	subList=$G('#nosubmit #submit')
	;
	$G.Each(function(){
		industry.addsel(this,this);
	},window.mapIndustry);
	industry.setselvalue('--请选择--');
	region.set(1,100);
	window.selDom&&window.selDom.resall();
	var imgcode=$G('.resVercode')
	,	imgres=function(){
			imgcode[0].src=window.config.url.vercode.img+new Date().getTime();
		}
	;
	imgres();
	imgcode.click(imgres);
	
	$G('#readLook').click(function(){
		var c=this.checked;
		subList.Each(function(){
			if(c){
				if(this.id=='nosubmit')
					this.style.display='none';
				else
					this.style.display='';
			}else{
				if(this.id=='nosubmit')
					this.style.display='';
				else
					this.style.display='none';
			}
		});
	});
	var loginname_ckname=$G('.loginname_ckname')
	;
	$G('.loginName').change(function(){
		var v=this.value;
		if(window.ckPost.len(v,4,16)){
			return;
		}
		window.ajax({
			load:true
		,	url:window.config.url.register.checkUserByName
		,	type:'post'
		,	data:{
				loginName:v
			}
		,	calback:function(json){
				if(!window.ckmsg(json.code,'register',true)){//
					$G('.loginname_true .loginname_default .loginname_length .loginname_null .loginname_false').Each(function(){
						this.style.display='none';
					});
					loginname_ckname.Each(function(){
						this.style.display='';
					});
				}else{
					loginname_ckname.Each(function(){
						this.style.display='none';
					});
				}
			}
		});
	});
	
	var altBoxOk=$G('#idAlertOK')
	;
	var register=window.subAjax('div:main',{
		sub:'#submit'
	,	url:window.config.url.register.create
	,	dataType:'json'
	,	ckdata:function(data){
			loginname_ckname.Each(function(){
				this.style.display='none';
			});
			var pass=data['loginPassword']
			,	ckpass=data['loginPasswordConfirmation']
			;
			if(pass!=ckpass){
				window.msg.call($G('.loginPasswordConfirmation')[0],{msg:'确认密码与登录密码不一致，请重新输入'});
				return;
			}
			data['vercode']=data['vercode'].toUpperCase();
			delete data['loginPasswordConfirmation'];
			return data;
		}
	,	callback:function(json){
			if(window.ckmsg(json.code,'register',true)){
				altBoxOk[0].onclick=function(){
					window.toLogin();
				};
				window.altBox({
					title:'提示信息'
				,	msg:'注册成功'
				});
			}else{
				altBoxOk[0].onclick=function(){};
				if(json.code=='0009'){
					$G('.loginname_true .loginname_default .loginname_length .loginname_null .loginname_false').Each(function(){
						this.style.display='none';
					});
					loginname_ckname.Each(function(){
						this.style.display='';
						this.focus();
					});
				}else if(json.code=='1006'){
					window.msg.call($G('#submit')[0],{msg:'验证码输入错误'});
				}else
					window.msg.call($G('#submit')[0],{msg:window.msgText[json.code]});
				imgres();
			}
		}
	});
	
	
}
);