var haomeitUl='http://wangmeng.haomeit.com';
window.cklogin=function(){};

$G(function(){
	var login=$G.cksub({
		sub:'#submit'
	,	cache:true
	,	url:haomeitUl+window.config.url.login.ck
	,	dataType:'json'
	,	ckdata:function(data){
			var loginName=$G('.loginName')
			,	loginLen=$G.len(loginName[0].value)
			,	loginPassword=$G('.loginPasswordMd5')
			,	loginPasswordLen=$G.len(loginPassword[0].value)
			;
			if(loginLen<4 || loginLen>16){
				window.msg.call(loginName[0],{title:'账号信息提示',msg:'最小4个字符长度，最大16个字符长度(1个汉字等于2个字符)'});
				return;
			}else if(window.ckPost.loginName(loginName[0].value)){
				window.msg.call(loginName[0],{title:'账号信息提示',msg:'请勿使用除字母(大小写等价)、数字、下划线、中文外的其他字符!'});
				return;
			}
			if(loginPasswordLen<6 || loginPasswordLen>16){
				window.msg.call(loginPassword[0],{title:'密码信息提示',msg:'最小6个字符长度，最大16个字符长度'});
				return;
			}else if(window.ckPost.loginPass(loginPassword[0].value)){
				window.msg.call(loginPassword[0],{title:'密码信息提示',msg:'请勿使用除字母、数字、下划线、英文句点外的其他字符!'});
				return;
			}
			data['loginPasswordMd5']=hex_md5(data['loginPasswordMd5']).toLowerCase();
			data['vercode']=data['vercode'].toUpperCase();
			window.document.location=haomeitUl+'/netlogin.shtml?'+$G.param(data);
			return data;
		}
	,	callback:function(json){
			if($G.isNaN(json))return;
			var type='login'
			,	code=json.code
			;
			if(json.code=='0011')json.code='0001';
			if(window.ckmsg(json.code,type,true))
				window.document.location=haomeitUl+window.config.url.index.index;
			else{
				if(code=='0001')
					window.msg.call($G('.loginName')[0],{msg:window.msgTextType[type][code]});
				else
					window.msg.call($G('.vercode')[0],{msg:window.msgText[code]});
				imgres();
			}
		}
	})
	,	imgcode=$G('.resVercode')
	,	imgres=function(){
			imgcode[0].src=haomeitUl+window.config.url.vercode.img+new Date().getTime();
		}
	;
	imgres();
	imgcode.click(imgres);
	document.onkeydown=function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];            
		if(e && e.keyCode==13){
			login.sub();
		}
	};
});