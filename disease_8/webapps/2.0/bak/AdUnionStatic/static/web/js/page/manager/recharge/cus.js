(function(){
	var urlLen=(window.location+'').indexOf('manager.wangmeng.haomeit.com');
	if(urlLen>=0 && urlLen<8){
		$G('.mediaShow').none();
	}
	window.setList=$G('#setList');
	window.lookRecharge=function(rid){
		window.ajax({
			path:'REPORT_STATUS'
		,	data:{
				REPORT_ID:rid
			}
		,	calback:function(JSON){
				if(window.wm.msg(JSON.CODE,false)){
					if(JSON.STATUS==2){
						window.setList.html('<a href="'+window.wm.path.report.url+JSON.PATH+'" target="_blank">数据生成完毕，请点击进行下载</a>');
					}else if(JSON.STATUS==3){
						window.setList.html('数据生成失败，请重新生成或联系管理员');
					}else if(JSON.STATUS==1){
						$G.setTimeout(function(){
							window.lookRecharge(rid);
						},3);
					}
				}
				
			}
		});
	};
	window.rechargeCus=function(){
		var findDom=$G('div:main')
		,	dataList={}
		;
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	list=window.subAjax('div:conditions',{
					path:'REPORT_ACCOUNT'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:window.setList[0]
				,	ckdata:function(data){
						var FIND_TYPE=1
						;
						data['TIME_START']='';
						data['TIME_END']='';
						if(data['MEDIA_ID']){
							FIND_TYPE=FIND_TYPE+2;
						}
						if(data['findTime']){
							var t=$G('.findtime',findDom[0]).getAtt('subValue').split('至');
							FIND_TYPE=FIND_TYPE+1;
							data['TIME_START']=t[0];
							data['TIME_END']=t[1];
						}
						data['FIND_TYPE']=FIND_TYPE;
						data['MEDIA_TYPE']=1;
						if($G.isNaN(data['MEDIA_ID']) || data['MEDIA_ID']==0)
							data['MEDIA_TYPE']=2;
						delete data['findTime'];
						if(data['DATE_TYPE'].length<1)data['DATE_TYPE']=2;
						else data['DATE_TYPE']=1;
						return data;
					}
				,	callback:function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							window.wm.loading.show({obj:window.setList[0]});
							window.lookRecharge(JSON.REPORT_ID);
						}
					}
		});
		
	};
	var MEDIA_ID=$G('.MEDIA_ID')
	,	notDoName={
			'8wow8.net':true,
			'mgkj.net':true,
			'yzmm522.com':true,
			'rihanw.com':true,
			'xmm622.info':true,
			'xmz22.info':true,
			'jqw123.info':true,
			'sege432.com':true,
			'xxss99.com':true,
			'hhlu520.com':true,
			'tsqr2.com':true,
			'4sxdy.com':true,
			'yyinmm.com':true
		}
	;
	var MEDIA_ID=$G('.MEDIA_ID');
	window.ajax({
		path:'GET_MEDIA_DOMAIN_LIST'
	,	calback:function(JSON){
			if(window.wm.msg(JSON.CODE,false)){
				var list=JSON.LIST
				,	n=list.length
				;
				if(n>0){
					MEDIA_ID.addsel('全部',0);
					$G.Each(function(i,k){
						var obj=k[i]
						,	k=obj['MEDIA_ID']||''
						,	v=obj['MEDIA_DOMAIN']||''
						;
						//$G.log(v+'='+notDoName[v]);
						if(!$G.isNaN(v) && !notDoName[v])
							MEDIA_ID.addsel(v,k);
					},list);
					window.selDom&&window.selDom.resall();
					window.rechargeCus();
				}
			}
			
		}
	});
	
	
})();