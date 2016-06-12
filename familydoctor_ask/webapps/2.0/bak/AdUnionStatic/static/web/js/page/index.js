window.notice.config(2,{PAGE_COUNT:8});
window.headerEnd(function(){
	var accountEach=$G('div:i_account')
	;
	/**************************账户信息****************************************/
	$G('.USER_LOGIN_NAME .INVEST .CONSUMPTION .BALANCE',accountEach[0]).Each(function(){
		this.innerHTML=window.wm.data['user'][$G(this).getAtt('name')];
	});
	$G('.BALANCE').html(window.wm.data['user']['BALANCE']);
	$G('.TheLatestTrend').val('最近7天 '+$G.formatdate(new Date(),'YYYY-MM-dd',7)+' 至 '+$G.formatdate(new Date(),'YYYY-MM-dd',1));
	window.statTrend=function(){
		var listData={}
		,	getTxt={
				'CLICK':'点击次数'
			,	'CTR':'点击率'
			,	'CPC':'平均点击价格'
			,	'IMPRESSION':'点击率'
			,	'CPM':'展现次数'
			,	'COST':'总消费'
			}
		,	setAllData=function(JSON){
				var d={};
				d['COST']			="<?xml version='1.0' encoding='utf-8'?><chart caption='' pieRadius='70' piefillAlpha='80' pieBorderThickness='2' hoverFillColor='c6e5ff' pieBorderColor='FFFFFF' useHoverColor='1' bordercolor='ffffff' bgcolor='ffffff' baseFontSize='12' basefontColor='272627' outCnvBaseFontSize='11'><category label='消费合计&#xA;￥{ALLCOST}'  Color='ffffff' toolText='消费金额合计&#xA;￥{ALLCOST}'><category value='{TEXTCOST}' Color='3984d8' toolText='文字推广消费金额&#xA;￥{TEXTCOST}'></category><category value='{IMGCOST}' Color='f99900' toolText='图片推广消费金额&#xA;￥{IMGCOST}'></category></category><styles><definition><style name='myHTMLFont' type='font' isHTML='1' /></definition><application><apply toObject='TOOLTIP' styles='myHTMLFont' /></application></styles></chart>";
				d['CLICK']			="<?xml version='1.0' encoding='utf-8'?><chart caption='' pieRadius='70' piefillAlpha='80' pieBorderThickness='2' hoverFillColor='c6e5ff' pieBorderColor='FFFFFF' useHoverColor='1' bordercolor='ffffff' bgcolor='ffffff' baseFontSize='12' basefontColor='272627' outCnvBaseFontSize='11'><category label='点击合计&#xA;{ALLCLICK}'  Color='ffffff' toolText='点击次数合计&#xA;{ALLCLICK}'><category value='{TEXTCLICK}' Color='3984d8' toolText='文字推广点击次数&#xA;{TEXTCLICK}'></category><category value='{IMGCLICK}' Color='f99900' toolText='图片推广点击次数&#xA;{IMGCLICK}' ></category></category><styles><definition><style name='myHTMLFont' type='font' isHTML='1' /></definition><application><apply toObject='TOOLTIP' styles='myHTMLFont' /></application></styles></chart>";
				d['IMPRESSION']		="<?xml version='1.0' encoding='utf-8'?><chart caption='' pieRadius='70' piefillAlpha='80' pieBorderThickness='2' hoverFillColor='c6e5ff' pieBorderColor='FFFFFF' useHoverColor='1' bordercolor='ffffff' bgcolor='ffffff' baseFontSize='12' basefontColor='272627' outCnvBaseFontSize='11'><category label='展现合计&#xA;{ALLIMPRESSION}'  Color='ffffff' toolText='展现次数合计&#xA;{ALLIMPRESSION}'><category value='{TEXTIMPRESSION}' Color='3984d8' toolText='文字推广展现次数&#xA;{TEXTIMPRESSION}'></category><category value='{IMGIMPRESSION}' Color='f99900' toolText='图片推广展现次数&#xA;{IMGIMPRESSION}' ></category></category><styles><definition><style name='myHTMLFont' type='font' isHTML='1' /></definition><application><apply toObject='TOOLTIP' styles='myHTMLFont' /></application></styles></chart>";
				var nulld={};
				nulld['COST']		="<?xml version='1.0' encoding='utf-8'?><chart caption='' pieRadius='70' piefillAlpha='80' pieBorderThickness='2' hoverFillColor='c6e5ff' pieBorderColor='FFFFFF' useHoverColor='1' bordercolor='ffffff' bgcolor='ffffff' baseFontSize='12' basefontColor='272627' outCnvBaseFontSize='11'><category label='无消费'  Color='ffffff' toolText='消费金额合计&#xA;￥{ALLCOST}'></category><styles><definition><style name='myHTMLFont' type='font' isHTML='1' /></definition><application><apply toObject='TOOLTIP' styles='myHTMLFont' /></application></styles></chart>";
				nulld['CLICK']		="<?xml version='1.0' encoding='utf-8'?><chart caption='' pieRadius='70' piefillAlpha='80' pieBorderThickness='2' hoverFillColor='c6e5ff' pieBorderColor='FFFFFF' useHoverColor='1' bordercolor='ffffff' bgcolor='ffffff' baseFontSize='12' basefontColor='272627' outCnvBaseFontSize='11'><category label='无点击'  Color='ffffff' toolText='点击次数合计&#xA;{ALLCLICK}'></category><styles><definition><style name='myHTMLFont' type='font' isHTML='1' /></definition><application><apply toObject='TOOLTIP' styles='myHTMLFont' /></application></styles></chart>";
				nulld['IMPRESSION']	="<?xml version='1.0' encoding='utf-8'?><chart caption='' pieRadius='70' piefillAlpha='80' pieBorderThickness='2' hoverFillColor='c6e5ff' pieBorderColor='FFFFFF' useHoverColor='1' bordercolor='ffffff' bgcolor='ffffff' baseFontSize='12' basefontColor='272627' outCnvBaseFontSize='11'><category label='无展现'  Color='ffffff' toolText='展现次数合计&#xA;{ALLIMPRESSION}'></category><styles><definition><style name='myHTMLFont' type='font' isHTML='1' /></definition><application><apply toObject='TOOLTIP' styles='myHTMLFont' /></application></styles></chart>";
				
				$G.Each(function(i,k){
					var v=this+'';
					if(v=='0.00' || v=='0'){
						d[k]=null;
					}
					if(k=='CTR')d[k]=d[k]+'%';
				},JSON.ALL);
				$G.Each(function(i,k){
					var res=k;
					if(k=='TEXT' || k=='IMG'){
						$G.Each(function(p,ks){
							$G('#'+k+ks).html(this+'');
						},JSON[k]);
					}
					$G.Each(function(l,key){
						var v=this+'';
						if(v=='0.00')v='0';
						if(!d[key])d[key]=nulld[key];
						d[key]=window.wm.setVal(d[key],(res+key),v);
					},JSON[k]);
				},JSON);
				$G.Each(function(i,k){
					window.mkCharts({
						id:k
					,	dataset:d[k]
					,	swf:'MultiLevelPie.swf'
					,	w:150
					,	h:150
					,	n1:0
					,	n2:0
					});
				},d);
				
			}
		,	setData=function(JSON,TYPE){
				var model='<?xml version="1.0" encoding="utf-8"?><chart caption=""  alternateHGridAlpha="10" numVDivLines="5" divLineAlpha="30" labelPadding ="10" yAxisValuesPadding ="10" showValues="1" rotateValues="0" valuePosition="auto" showBorder="0" bgcolor="ffffff" legendBorderColor="ffffff" legendShadow="0" anchorRadius="5" canvasPadding="20" canvasRightMargin="10" legendPadding="10" useEllipsesWhenOverflow="1" DivLineColor="bcbcbc" canvasBorderThickness="1" outCnvBaseFontSize="12" BaseFontSize="12" lineThickness="2" formatNumber="0" formatNumberScale="0"><categories>{categories}</categories><dataset seriesName="{name}" color="59c7ff">{dataset}</dataset> </chart>'
				,	categoryModel='<category label="{data}" />'
				,	setMode='<set value="{value}"  />'
				,	category=''
				,	set=''
				,	d=JSON.LIST
				,	list={}
				;
				if(TYPE=='CTR'){
					model=model.replace('<chart', '<chart numberSuffix="%" ');
				}
				$G.Each(function(){
					list[this['DATE']]=this;
				},d);
				for(var i=7;i>0;i--){
					var t=$G.formatdate(new Date(Date.parse((JSON.TIME||'').replace(/-/ig,'/'))),'YYYY-MM-dd',i);
					category=window.wm.setVal(category+categoryModel,'data',t);
					var v='0';
					if(!$G.isNaN(list[t])){
						v=list[t][TYPE];
					}
					set=window.wm.setVal(set+setMode,'value',v);
				}
				var xml=window.wm.setVal(model,'categories',category);
				xml=window.wm.setVal(xml,'dataset',set);
				xml=window.wm.setVal(xml,'name',getTxt[TYPE]);
				$G.Each(function(i,k){
					window.mkCharts({
						id:'chartdiv4'
					,	dataset:xml
					,	swf:'MSLine.swf'
					,	w:'100%'
					,	h:338
					,	n1:0
					,	n2:1
					});
				},d);
			}
		,	getData=function(path,d,fn){
				window.ajax({
					path:path
				,	data:d
				,	calback:function(JSON){
						if(window.wm.msg(JSON.CODE,false)){
							if(!$G.isNaN(JSON.ALL) && !$G.isNaN(JSON.ALL)){
								$G('#IMG_BUDGET').html('每日预算￥'+JSON.ALL['IMG_BUDGET']);
								$G('#TEXT_BUDGET').html('每日预算￥'+JSON.ALL['TEXT_BUDGET']);
								delete JSON.ALL['IMG_BUDGET'];
								delete JSON.ALL['TEXT_BUDGET'];
							}
							fn&&fn(JSON);
						}
						
					}
				});
			}
		,	getAll=function(obj){
				var j=listData['All'+obj.value];
				if($G.isNaN(j))
					getData('GET_STAT_TREND'
						,	{
								DATE_TYPE:obj.value
							}
						,	function(json){
								delete json['CODE'];
								listData['All'+obj.value]=json;
								setAllData(json);
							}
					);
				else
					setAllData(j);
			}
		,	getText=function(type){
				var j=listData['TEXT'];
				if($G.isNaN(j))
					getData('GET_STAT_TREND_TEXT'
						,	{}
						,	function(json){
								delete json['CODE'];
								listData['TEXT']=json;
								setData(json,type);
							}
					);
				else
					setData(j,type);
			}
		,	getImg=function(type){
				var j=listData['IMG'];
				if($G.isNaN(j))
					getData('GET_STAT_TREND_IMG'
						,	{}
						,	function(json){
								delete json['CODE'];
								listData['IMG']=json;
								setData(json,type);
							}
					);
				else
					setData(j,type);
			}
		,	get=getText
		;
		getAll({value:1});
		
		var contc_all=$G('#contc_all')
		,	contc1=$G('#contc1')
		,	selectTool=$G('.selectTool')
		,	selectDom=$G('select',contc1[0])
		;
		selectTool.click(function(){
			selectTool.setAtt('class',' ');
			$G(this).setAtt('class','u_curr');
			if(this.innerHTML=='全部'){
				contc_all.show();
				contc1.none();
			}else{
				if(this.innerHTML=='文字推广'){
					get=getText;
				}else if(this.innerHTML=='图片推广'){
					get=getImg;
				}
				contc_all.none();
				contc1.show();
				var type='CLICK';
				window.selectFn({value:type});
				selectDom.setselvalue(type);
				checkedInput(type);
				window.selDom&&window.selDom.resall();
			}
		});
		var div_1_1=$G('#div_1_1')
		,	div_1_2=$G('#div_1_2')
		;
		var input=$G('input',$G('#div_1')[0])
		,	checkedInput=function(type){
				input.Each(function(){
					if(this.value==type)
						this.checked=true;
				});
			}
		;
		input.click(function(){
			get(this.value);
		});
		
		window.selectFn=function(obj){
			var v=obj.value;
			if(v=='CLICK'){
				div_1_1.show();
				div_1_2.none();
				checkedInput(v);
			}else if(v=='IMPRESSION'){
				div_1_2.show();
				div_1_1.none();
				checkedInput(v);
			}else{
				div_1_1.none();
				div_1_2.none();
			}
			get(v);
		};
		
		return {
			getAll:getAll
		};
		
	}();
	
});