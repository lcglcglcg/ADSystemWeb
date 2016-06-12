(function(){
	window.appendIdea=function(){
		var getContent=function(value,isHtml,htmlJoin){
				var contentList=value.split('\r\n')
				,	titleList=new Array()
				;
				for(var i=0,n=contentList.length;i<n;i++){
					var zlHtml=contentList[i].split('\n')
					,	title=zlHtml[0]
					;
					titleList.push(isHtml?isHtml.replace(/{title}/ig,title):'<s>'+title+'</s>');
				}
				return titleList.join((htmlJoin||'&nbsp;|&nbsp;'));
			}
		,	getIdeasById=function(id,fn){
				window.ajax({
					path:'GET_APPEND_CREATIVE_UNIQUE'
				,	data:{
						CREATIVE_ID:id
					}
				,	calback:function(JSON){
						fn&&fn(JSON);
					}
				});
			}
		;
		
		return {
			getContent:getContent
		,	getIdeasById:getIdeasById
		};
	}();
	
})();