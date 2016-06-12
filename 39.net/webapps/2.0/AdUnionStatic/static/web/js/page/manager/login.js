window.loginCheck=function(){
	window.cklogin(function(JSON){
		window.isHead=true;
		if(JSON.CODE=='1000')window.document.location=window.wm.path.index.index;
	});
};
window.headerEnd(function(){
	var login=window.subAjax('div:l_box',{
		sub:'#submit'
	,	path:'LOGIN'
	,	dataType:'json'
	,	ckdata:function(data){
			data['PASSWORD']=hex_md5(data['PASSWORD']).toLowerCase();
			data['VAR_CODE']=data['VAR_CODE'].toUpperCase();
			return data;
		}
	,	callback:function(JSON){
			if(JSON.CODE=='0'){
				window.document.location=window.wm.path.index.index;
			}else{
				var msg=window.code[JSON.CODE]
				,	obj=this.subObj
				;
				if(JSON.CODE=='1002'){
					obj=$G('.PASSWORD')[0];
				}else if(JSON.CODE=='1003'){
					obj=$G('.VAR_CODE')[0];
				}
				$G('.VAR_CODE')[0].value='';
				imgres();
				window.msg.call(obj,{msg:msg});
			}
		}
	});
	
	var imgcode=$G('.resVercode')
	,	imgres=function(){
			imgcode[0].src=window.wm.ckCode();
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
