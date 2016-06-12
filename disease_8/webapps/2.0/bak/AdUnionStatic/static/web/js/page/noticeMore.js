(function(){
	window.notice=function(){
		/***************************公告弹内容*********************************************/
		var	findNoticeName='.DATE .TITLE .CONTENT'
		,	notice=function(){
				var noticeObj=$G('#notice')
				,	noticeAlt=window.alertDiv({
						findObj:'#notice'
					,	position:'fixed'
					,	closeObj:'.close_bnt'
					,	move:$G('div:notice_title',noticeObj[0])
					})
				;
				return {
					show:function(json,fn){
						$G(findNoticeName,noticeObj[0]).Each(function(){
							this.innerHTML=json[$G(this).getAtt('name')];
						});
						noticeAlt.show();
					}
				,	close:noticeAlt.close
				};
			}()
			/************************公告列表************************************************/
		,	page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	beginHtml=''
		,	html=''
		,	endHtml=''
		,	setValFn=function(){}
		,	ListByNew=$G('#getListByNew')
		,	getListByNewList={}
		,	list=window.subAjax('.noticeFrom',{
					path:'GET_ANNOUNCEMENT'
				,	sub:'#searchSub'
				,	obj:ListByNew[0]
				,	ckdata:function(data){
						if(data['TITLE']=='搜索 公告标题')
							data['TITLE']='';
						$G.Each(function(i,k){
							data[k]=this+'';
						},pageArray);
						delete data['click'];
						data['FIND_NAME']=data['TITLE']||'';
						if($G.isNaN(data['FIND_NAME']))
							data['FIND_TYPE']=1;
						else
							data['FIND_TYPE']=2;
						delete data['TITLE'];
						delete data['SORT_TYPE'];
						delete data['SORT_COLUMN'];
						
						return data;
					}
				,	callback:function(JSON){
						JSON.INFO=JSON.INFO||{
							PAGE_INDEX:1
						,	CAMPAIGN_COUNT:0
						};
						JSON.LIST=JSON.LIST||{};
						if(!window.wm.msg(JSON.CODE,false)){
							return;
						}
						var str=''
						;
						try{
							var n=JSON.LIST.length
							;
							for(var i=0;i<n;i++){
								var hStr=html
								,	v=JSON.LIST[i]
								;
								getListByNewList[i]=v;
								$G.Each(function(ii,val,json){
									var value=setValFn(val,this);
									hStr=window.wm.setVal(hStr,val,value);
								},v);
								hStr=window.wm.setVal(hStr,'i',i);
								str+=hStr;
							}
							page.setup(JSON.INFO.COUNT,n,pageArray);
						}catch(e){}
						ListByNew.html(beginHtml+str+endHtml);
						/**********************查看公告**********************************/
						$G('.look',ListByNew[0]).click(function(){
							notice.show(getListByNewList[$G(this).getAtt('value')]);
						});
					}
				})
		;
				
		$G('.TITLE').click(function(){
			if(this.value=='搜索 公告标题'){
				this.value='';
			}
		}).bd({on:'blur',callback:function(){
			if($G.isNaN(this.value)){
				this.value='搜索 公告标题';
			}
		}});
		return {
			config:function(type,pa){
				pageArray['click']=function(pageObj){
					pageArray=pageObj;
					list.sub();
				};
				if(type==1){
					beginHtml='<ul class="t_line"><li class="w670 f_bold">公告标题</li><li class="w260 f_bold">发布时间</li></ul>';
					html='<ul><li class="w670 f_center" ><a name="look" value="{i}">{TITLE}</a></li><li class="w260 f_center">{DATE}</li></ul>';
					endHtml='';
					setValFn=function(k,v){
						if(k=='DATE')
							v=$G.formatdate(new Date(Date.parse(v.replace(/-/ig,'/'))),'YYYY-MM-dd');
						return v;
					};
				}else{
					beginHtml='';
					html='<li><a name="look" value="{i}">{TITLE}</a><span class="time">{DATE}</span></li>';
					endHtml='<li class="li_last"><a class="more" target="_blank" href="/news/index.shtml">更多>></a></li>';
				}
				if(!pa)return;
				$G.Each(function(i,k){
					pageArray[k]=this+'';
				},pa);
			}
		,	list:function(obj){
				obj=obj||{};
				pageArray['PAGE_INDEX']=obj.p||pageIni.PAGE_INDEX;
				list.sub();
			}
		};
	}();
})();
window.notice.config(1);
$G(function(){
	window.notice.list();
});