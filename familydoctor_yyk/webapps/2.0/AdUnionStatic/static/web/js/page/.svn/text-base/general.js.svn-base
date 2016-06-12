window.headerEnd(function(){
	var general=function(){
		var contk2=$G('#contk2')
		,	reportType=$G('.reportType',contk2[0])
		,	reportType_display=$G('.reportType_display',contk2[0])
		,	regionUnit=$G('.regionUnit',contk2[0])
		,	mediaUnit=$G('.mediaUnit',contk2[0])
		,	departmentType=$G('.departmentType',contk2[0])
		,	diseaseType=$G('.diseaseType',contk2[0])
		,	reportDate=$G('.reportDate',contk2[0])
		,	findTime=$G('.findtime',contk2[0])
		;
		/*************报告类型方法****************/
		reportType.Each(function(i){
			$G(this).setAtt('value',i+5);
		}).click(function(){
			var obj=$G(this)
			reportType.style({'class':''});
			obj.style({'class':'rg_hover'});
			reportType_display.Each(function(){
				this.style.display='none';
			});
			var v=obj.getAtt('value')||0;
			if(v>0)v=v-5;
			if(v<3)
				reportType_display[v].style.display='';
		});
		/*************地域单元****************/
		regionUnit.Each(function(i){
			$G(this).setAtt('value',i+1);
		}).click(function(){
			regionUnit.style({'class':''});
			$G(this).style({'class':'rg_hover'});
		});
		/*************媒体单元****************/
		mediaUnit.Each(function(i){
			$G(this).setAtt('value',i+1);
		}).click(function(){
			mediaUnit.style({'class':''});
			$G(this).style({'class':'rg_hover'});
		});
		/*************科室粒度****************/
		departmentType.Each(function(i){
			$G(this).setAtt('value',i+1);
		}).click(function(){
			departmentType.style({'class':''});
			$G(this).style({'class':'rg_hover'});
		});
		/*************病种粒度****************/
		diseaseType.Each(function(i){
			$G(this).setAtt('value',i+1);
		}).click(function(){
			diseaseType.style({'class':''});
			$G(this).style({'class':'rg_hover'});
		});
		
		/*************时间单位****************/
		reportDate.Each(function(i){
			$G(this).setAtt('value',(i+1));
		}).click(function(){
			reportDate.style({'class':''});
			$G(this).style({'class':'rg_hover'});
		});
		/**************************定制报告**定制报告成功！您所定制的报告将在10分钟内生成，并将在报告下载列表中提供下载。'***********************************/

		var isSub=false
		,	subCreateGeneral=function(){
			var json={}
			,	reportName=$G('.reportName')
			;
			$G.Each(function(){
				json[this.replace('.','').replace('#','')]=window.findSet($G((this+''),contk2[0])).v;
			},'.reportType .regionUnit .mediaUnit .departmentType .diseaseType .timeType .reportDate'.split(" "));
			
			var t=$G('.findtime',contk2[0]).getAtt('subValue').split('至');
			if(json.reportDate!=1)json.reportDate--;
			var data={
					REPORT_NAME:reportName[0].value
				,	REPORT_TYPE:json.regionUnit
				,	REPORT_SPECIES:window.ideaType==1?6:1
				,	TIME_TYPE:json.reportDate
				,	TIME_START:t[0]
				,	TIME_END:t[1]
				}
			;
			//综合报告
			window.ajax({
				type:"post"
			,	data:data
			,	path:'REPORT_COMPLEX_CREATE'
			,	error:function(){
					isSub=false;
					window.ding_report.none();
				}
			,	calback:function(JSON){
					isSub=false;
					if(!window.wm.msg(JSON.CODE,false))
						return;
					var msg='定制报告成功！您所定制的报告将在10分钟内生成，并将在报告下载列表中提供下载。';
					window.altBox.show({
						title:'提示信息'
					,	msg:msg
					});
					window.ding_report.none();
				}
			});
		};
		$G('a',$G('#complex_btn4')[0]).click(function(){
			var findTime=$G('.findtime',contk2[0]);
			if($G.isNaN(findTime.val()+'')){
				window.msg.call(findTime[0],{
					msg:'请选择时间范围'
					});
				return;
			}
			if((this.innerHTML+'').indexOf('定制报告')>=0){
				var Obj={
					findtime:findTime
				,	type:$G('.reportType',contk2[0])
				};
				window.reportSub=subCreateGeneral;
				window.ding_report.show.call(Obj);
			}else{
				alert('查看报告');
			}
		});
		
		
	}();
});