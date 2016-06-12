(function(){
	var findDiv=$G('#main')
	$G('#loginExit').click(function(){
		window.gconfirm({
			msg:'您确定要退出管理系统吗？'
		,	notCheck:true
		,	fn:function(isTrue){
				if(isTrue){
					window.ajax({
						path:'USER_LOGOUT'
					,	calback:function(json){
							window.wm.toLogin();
						}
					});
				}
			}
		});
		
	});
	if((document.location+'').indexOf('.shtml')<=0){
		$G($G('a',$G('div:topnav',findDiv[0])[0])[0]).style({'class':'on'});
	}else{
		$G('div:subnav',findDiv[0]).style({'style':'display:none;'});
		$G('a',$G('div:topnav',findDiv[0])[0]).Each(function(){
			var urlArray=function(isPath){
					var n1=this.url.replace(/.shtml/,'')
					,	n2=n1.split('/')
					,	type=n2[3]||''
					,	typeNext=n2[4]||''
					,	test=type
					;
					if(type=='promotion') test=type+typeNext;
					if(isPath && (type=='promotion' || type=='report')){
						if(typeNext=='pic')window.ideaType=1;
					}
					return test;
				}
			,	htmlName=urlArray.call({url:(this.href+'')})
			,	domanName=urlArray.call({url:(document.location+'')},true)
			;
			if(domanName==htmlName){
				$G(this).style({'class':'on'});
				var	gCList=$G('#subnav'+domanName,findDiv[0])
				;
				if(gCList.length>0){
					gCList[0].style.display='';
					$G('li',gCList[0]).Each(function(){
						var obj=this
						,	a=$G('a',obj)
						;
						if((document.location+'')==a[0].href){
							$G(this).style({'class':'sub_libg'});
							a.style({'class':'subnav_curr1'});
						}else{
							$G(this).style({'class':''});
							a.style({'class':''});
						}
					});
				}
			}else $G(this).style({'class':''});
			
		});
	}
})();