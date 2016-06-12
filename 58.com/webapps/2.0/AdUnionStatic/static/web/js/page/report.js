window.headerEnd(function(){
	$G('#titlek1 #titlek2 #titlek3').click(function(){
		var cobj=$G('#contk1 #contk2 #contk3')
		,	i=(this.id.replace(/titlek/,''))-1
		;
		cobj.Each(function(){
			this.style.display='none';
		});
		$G('#titlek1 #titlek2 #titlek3').Each(function(){
			this.className='';
		});
		cobj[i].style.display='';
		this.className='re_curr';
		if(i==2)window.reportDownloadList.list();
	});
	
	/**********************报告类型*******************************/
	var reportType=$G('.reportType')
	;
	reportType.Each(function(i){
		$G(this).setAtt('value',i);
	}).click(function(){
		reportType.style({'class':''});
		$G(this).style({'class':'rg_hover'});
	});
	
	
	/*************************取选定值********************************/
	window.findSet=function(list){
		var v=1
		,	name=''
		;
		list.Each(function(){
			var Gobj=$G(this)
			,	c=Gobj.getAtt('class')
			;
			if(c=='rg_hover'){
				name=this.innerHTML;
				v=Gobj.getAtt('value');
			}
		});
		return {
			v:v
		,	name:name
		};
	};
	/**********************报告提交*******************************/
	
	window.ding_report=function(){
		var ding_reportfn=window.alertDiv({
				findObj:'#ding_report'
			,	closeObj:'.close_bnt'
			,	move:$G('div:account_title',ding_report[0])
			})
		,	obj=$G('#ding_report')
		;
		var subObj=$G('.sub_bnt',obj[0])
		;
		subObj.click(function(){
			window.reportSub.call(this);
		});
		return {
			obj:obj
		,	show:function(fnB,fnE){
				var findTime=this.findtime
				,	type=this.type
				;
				ding_reportfn.show(function(){
					var json=window.wm.data['user']
					,	time=($G.Trim(findTime.val()+'')).replace(/今天/,'').replace(/昨天/,'').replace(/最近七天/,'').replace(/上周/,'').replace(/本月/,'').replace(/上月/,'').replace(/上季度/,'').split("至")
					,	bt=time[0]
					,	et=time[1]
					;
					$G('.reportName').val(json['USER_LOGIN_NAME']+'-'+window.findSet(type).name+'-'+bt.replace(/-/ig,'')+'-'+et.replace(/-/ig,''));
					
					fnB&&fnB.call(this);
				},fnE);
			}
		,	none:ding_reportfn.none
		}
	}();
	
	
});