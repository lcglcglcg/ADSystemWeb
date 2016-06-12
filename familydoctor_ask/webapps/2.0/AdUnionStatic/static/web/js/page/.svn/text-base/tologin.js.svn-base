window.loginCheck=function(){
	window.cklogin=function(){};
};
window.ajax({
	path:'DELIVERY_CENTER_LOGIN'
,	data:{
		KEY:$G.getid('key')
	}
,	calback:function(JSON){
		if(!window.wm.msg(JSON.CODE,false))
			return;
		window.document.location=window.wm.path.index.index;
	}
});