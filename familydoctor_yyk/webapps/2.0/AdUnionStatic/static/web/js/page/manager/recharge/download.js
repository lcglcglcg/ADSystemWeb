(function(){
	window.rechargeCus=function(){
		var findDom=$G('div:main')
		,	dataList={}
		;
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	list=window.subAjax('div:conditions',{
					path:'REPORT_MEDIA'
				,	sub:'#subList'
				,	findDom:findDom[0]
				,	obj:$G('#setList')[0]
				,	ckdata:function(data){
						var FIND_TYPE=0
						;
						data['TIME_START']='';
						data['TIME_END']='';
						if(data['MEDIA_ID']){
							FIND_TYPE=FIND_TYPE+1;
						}
						if(data['ACCOUNT_NAME']){
							FIND_TYPE=FIND_TYPE+2;
						}
						if(data['findTime']){
							var t=$G('.findtime',findDom[0]).getAtt('subValue').split('至');
							FIND_TYPE=FIND_TYPE+3;
							data['TIME_START']=t[0];
							data['TIME_END']=t[1];
						}
						data['FIND_TYPE']=FIND_TYPE;
						delete data['findTime'];
						return data;
					}
				,	callback:function(JSON){
							
					}
		});
		
	}();
	
})();