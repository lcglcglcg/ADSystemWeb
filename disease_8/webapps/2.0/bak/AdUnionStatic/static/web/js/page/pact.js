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