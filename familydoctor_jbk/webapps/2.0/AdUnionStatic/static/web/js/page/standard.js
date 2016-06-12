window.headerEnd(function(){
	var contk1=$G('#contk1')
	/********************精准定向*********************************/
	var meitidingxiang=$G('.meitidingxiang',contk1[0])
	,	meitidingxiang_ds=$G('.meitidingxiang_ds',contk1[0])
	;
	meitidingxiang.Each(function(i){
		$G(this).setAtt('value',i);
	}).click(function(){
		meitidingxiang.style({'class':''});
		$G(this).style({'class':'rg_hover'});
		meitidingxiang_ds.Each(function(){
			this.style.display='none';
		});
		var v=$G(this).getAtt('value')||0;
		if(v>0)//临时，禁用媒体选择
			meitidingxiang_ds[v].style.display='';
	});
	
	/********************媒体定向*********************************/
	var meitidingxiang_type=$G('.meitidingxiang_type',contk1[0])
	,	meitidingxiang_type_ds=$G('.meitidingxiang_type_ds',contk1[0])
	;
	meitidingxiang_type.Each(function(i){
		$G(this).setAtt('value',i);
	}).click(function(){
		meitidingxiang_type.style({'class':''});
		$G(this).style({'class':'rg_hover'});
		var k=$G(this).getAtt('value')
		;
		if(k==1)
			meitidingxiang_type_ds[0].style.display='';
		else
			meitidingxiang_type_ds[0].style.display='none';
	});
	
	
	/**********************时间单位*******************************/
	var reportDate=$G('.reportDate',contk1[0])
	;
	reportDate.Each(function(i){
		$G(this).setAtt('value',(i+1));
	}).click(function(){
		reportDate.style({'class':''});
		$G(this).style({'class':'rg_hover'});
	});
	
	/********************投放地域*********************************/
	var di_quanbu=$G('.di_quanbu',contk1[0])
	,	RegionList=$G('#RegionList')
	;
	di_quanbu.Each(function(i){
		$G(this).setAtt('value',i);
	}).click(function(){
		di_quanbu.style({'class':''});
		$G(this).style({'class':'rg_hover'});
		var k=$G(this).getAtt('value')
		;
		if(k==1)
			RegionList[0].style.display='';
		else
			RegionList[0].style.display='none';
	});
	
	/**************************定制报告**定制报告成功！您所定制的报告将在10分钟内生成，并将在报告下载列表中提供下载。'***********************************/

	var isSub=false
	,	subCreateStandard=function(){
		var json={}
		,	rids=window.region.getRegion()
		//,	channel=window.getChannel()||'all'
		,	reportName=$G('.reportName')
		,	meitidingxiang_input=$G('.meitidingxiang_input',contk1[0])
		,	meitidingxiang_value=meitidingxiang_input.checked(true)
		,	channelType=1 //精准定向 1媒体定向
		;
		$G.Each(function(){
			json[this.replace('.','').replace('#','')]=window.findSet($G((this+''),contk1[0])).v;
		},'.reportType .di_quanbu .meitidingxiang .meitidingxiang_type .reportDate'.split(" "));
		
		/*if(json.di_quanbu==1){
			if($G.isNaN(rids)){
				window.msg.call($G('.di_quanbu',contk1[0])[0],{msg:'选择投放区域'});
				return;
			}
			
		}else{
			rids='ALL';
		}*/
		/*if(json.meitidingxiang_type==1){
			if($G.isNaN(channel)){
				window.msg.call($G('.meitidingxiang_type',contk1[0])[1],{msg:'媒体定向不能为空'});
				return;
			}
			
		}*/
		if($G.isNaN(reportName[0].value)){
			window.msg.call(reportName[0],{msg:'报告名称不能为空'});
			return;
		}
		
		if(json.meitidingxiang==1){
			if(meitidingxiang_value.length<1){
				window.msg.call($G('.meitidingxiang',contk1[0])[1],{msg:'行为定向不能为空'});
				return;
			}
			channelType=0;
			for(var i=0,n=meitidingxiang_value.length;i<n;i++){
				if(meitidingxiang_value[i]==1) channelType=channelType+2;
				else if(meitidingxiang_value[i]==2) channelType=channelType+4;
				else if(meitidingxiang_value[i]==3)	channelType=channelType+8;
			}
		}
		
		var t=$G('.findtime',contk1[0]).getAtt('subValue').split('至');
		if(json.reportDate!=1)json.reportDate--;
		var data={
				REPORT_NAME:reportName[0].value
			,	REPORT_TYPE:(Number(json.reportType)+1)
			,	TIME_TYPE:json.reportDate
			,	REPORT_SPECIES:window.ideaType==1?6:1
			,	TIME_START:t[0]
			,	TIME_END:t[1]
			}
		;
		//标准报告
		window.ajax({
			type:"post"
		,	data:data
		,	path:'REPORT_STANDARD_CREATE'
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
	
	
	$G('a',$G('#standard_btn1')[0]).click(function(){
		var findTime=$G('.findtime',contk1[0]);
		if($G.isNaN(findTime.val()+'')){
			window.msg.call(findTime[0],{
				msg:'请选择时间范围'
				});
			return;
		}
		if((this.innerHTML+'').indexOf('定制报告')>=0){
			var Obj={
				findtime:findTime
			,	type:$G('.reportType',contk1[0])
			};
			window.reportSub=subCreateStandard;
			window.ding_report.show.call(Obj);
		}else{
			alert('查看报告');
		}
	});	
});