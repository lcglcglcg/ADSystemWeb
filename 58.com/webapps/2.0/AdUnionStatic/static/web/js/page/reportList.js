window.headerEnd(function(){
	window.reportDownloadList=function(){
		var titleHtml='<table width="100%"><tr class="table_title">\
						<th class="re_table_wa">报告名称</th>\
						<th class="re_table_wa">报告类型</th>\
						<th class="re_table_wa">日期范围</th>\
						<th class="re_table_wa">创建时间</th>\
						<th class="re_table_wb">状态</th>\
						<th class="re_table_wb">操作</th>\
					  </tr>'
		,	listHTML='<tr>\
						<td>{REPORT_NAME}</td>\
						<td class="re_table_wa"><span class="figure">{reportTypeName}</span></td>\
						<td class="re_table_wa"><span class="figure">{RANGE_TIME}</span></td>\
						<td class="re_table_wa"><span class="figure">{CREATE_TIME}</span></td>\
						<td class="re_table_wb"><span class="figure">{generateStateName}</span></td>\
						<td class="re_table_wb"><span class="figure">{editList}</span></td>\
					  </tr>'
		,	listObj=$G('div:re_table_list',$G('#contk3')[0])
		,	reportTypeName={
				'0':'未知报告'
			,	'1':'账户报告'
			,	'2':'推广计划报告'
			,	'3':'推广组报告'
			,	'4':'创意报告'
			,	'5':'地域报告'
			,	'6':'媒体报告'
			,	'7':'定向浏览报告'
			,	'8':'定向词报告'
			}
		,	generateStateName={
				'1':'生成中'
			,	'3':'生成失败'
			,	'2':'生成完成'
			}
		,	generateStateTool={
				'1':'<span>下载</span>|<span>删除</span>'
			,	'3':'<span>下载</span>|<span>删除</span>'
			,	'2':'<a href="{DOWNLOAD_URL}">下载</a>|<a id="{REPORT_ID}" name="deleteReport" >删除</a>'
			}
    	,	list=function(){
				window.ajax({
					type:"get"
				,	data:{
						REPORT_BELONG:window.ideaType
					}
				,	path:'GET_REPORT_LIST'
				,	calback:function(JSON){
						if(!window.wm.msg(JSON.CODE,false))
							return;
						if($G.isNaN(JSON.LIST)){
							listObj[0].innerHTML=titleHtml+'</table>';
							return;
						}
						var n=JSON.LIST.length
						,	str=''
						;
						for(var i=0;i<n;i++){
							var html=listHTML
							,	obj=JSON.LIST[i]
							;
							html=html.replace(/{reportTypeName}/ig,reportTypeName[obj.REPORT_TYPE]);
							html=html.replace(/{generateStateName}/ig,generateStateName[obj.STATUS]);
							html=html.replace(/{editList}/ig,generateStateTool[obj.STATUS]);
							html=html.replace(/{DOWNLOAD_URL}/ig,window.wm.path.report.url+obj.PATH);
							
							$G.Each(function(ii,val){
								var value=this;
								html=window.wm.setVal(html,val,value);
							},obj);
							str+=html;
						}
						listObj[0].innerHTML=titleHtml+str+'</table>';
					}
				});
		}
		;
		listObj.click(function(e1,e2,e3){
			if(e2.name=='deleteReport'){
				window.gconfirm({
						msg:'您确定要删除此报告吗？'
				,	fn:function(isTrue){
						if(isTrue){
							window.ajax({
								type:"get"
							,	path:'DET_REPORT'
							,	data:{
									REPORT_ID:e2.id
								}
							,	calback:function(JSON){
									if(!window.wm.msg(JSON.CODE,false))
										return;
									window.altBox.show({
										title:'提示信息'
									,	msg:'报告删除成功！'
									});
									list();
								}
							});
						}
					}
				});
				
			}
		});
		return {
			list:list
		};
	}();
	
});