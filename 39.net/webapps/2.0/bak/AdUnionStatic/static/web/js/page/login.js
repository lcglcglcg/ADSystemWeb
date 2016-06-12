window.loginCheck=function(){
	window.cklogin(function(JSON){
		window.isHead=true;
		if(JSON.CODE=='1000')window.document.location=window.wm.path.index.index;
	});
};
window.headerEnd(function(){
	$G('#idAlertTitle')[0].style.background= 'url()';
	var login=window.subAjax('div:box_bg',{
		sub:'#submit'
	,	path:'USER_LOGIN'
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
				
				$G('.VAR_CODE')[0].value='';
				imgres();
				if(JSON.CODE=='1002'){
					obj=$G('.PASSWORD')[0];
				}else if(JSON.CODE=='1003'){
					obj=$G('.VAR_CODE')[0];
				}else if(JSON.CODE=='1020'){
					alert(msg);
					return;
				}
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
	
	
	var picFor=function(){
		var bgPic=$G('a',$G('#bgPic')[0])
		,	box_bg=$G('#box_bg')
		,	picI=0
		,	picN=bgPic.length
		,	bgPicFn=function(){
				clearInterval(intervalid);
				var	objA=$G(this)
				,	value=objA.getAtt('value')
				;
				picI=objA.getAtt('picIndex');
				box_bg.setAtt('class',value);
				bgPic.setAtt('class','');
				objA.setAtt('class','current');
			}
		,	intervalid=''
		,	start=function(){
				intervalid=setInterval(function(){
					var k=Number(picI)+1
					;
					if(k>=picN)k=0;
					bgPicFn.call(bgPic[k]);
				}, 3000);
			}
		;
		bgPic.Each(function(i){
			$G(this).setAtt('picIndex',i);
			if(i==0)$G(this).setAtt('class','current');
		}).bd({on:'mousemove',callback:bgPicFn}).bd({on:'mouseout',callback:function(){
				start();
		}});
		/*bgPic.click(function(){
			bgPicFn.call(this);
			clearInterval(intervalid);
			var	objA=$G(this)
			;
			objA.setAtt('class','current');
		});*/
		return {
			start:start
		};
	}();
	picFor.start();
});
