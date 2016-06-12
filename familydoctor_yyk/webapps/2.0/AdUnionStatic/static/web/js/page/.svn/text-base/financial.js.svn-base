window.headerEnd(function(){
	var accountArr=$G('.INVEST .CONSUMPTION .BALANCE',$G('div:conditions')[0])
	,	userCreateTime=$G.formatdate(new Date(Date.parse((window.wm.data['user']['CREATE_TIME']||'').replace(/-/ig,'/'))),'YYYY-MM-dd',1)
	;
	$G('.calendar').setAtt('mindate',userCreateTime);
	accountArr.Each(function(){
		var name=$G(this).getAtt('name')
		,	v=window.wm.data['user'][name]
		;
		this.innerHTML=v +' 元';
	});
	
	$G('#titleh1 #titleh2').click(function(){
		var cobj=$G('#conth1 #conth2')
		,	i=(this.id.replace(/titleh/,''))-1
		;
		cobj.Each(function(){
			this.style.display='none';
		});
		$G('#titleh1 #titleh2').Each(function(){
			this.className='';
		});
		cobj[i].style.display='';
		this.className='cw_curr';
	});
	
	$G('#conth1')[0].style.display='none';
	var getListRechargeList={}
	;
	var financialList=function(){
		var	beginHtml='<ul class="t_line">\
                <li class="w140 f_bold">流水号</li>\
                <li class="w100 f_bold">充值金额(￥)</li>\
                <li class="w80 f_bold">付款方式</li>\
                <li class="w300 f_bold">凭证</li>\
                <li class="w100 f_bold">投资总额(￥)</li>\
                <li class="w100 f_bold">账面余额(￥)</li>\
                <li class="w150 f_bold">加款时间</li>\
           </ul>'
		,	html='<ul id="ul_hover1">\
                <li class="w140 f_center">{SWIFT_NUMBER}</li>\
                <li class="w100 f_center">{MONEY}</li>\
                <li class="w80 f_center">{PAYMENT_TYPE}</li>\
                <li class="w300 f_center">{pingzheng}</li>\
                <li class="w100 f_center">{INVEST}</li>\
                <li class="w100 f_center">{BALANCE}</li>\
                <li class="w150 f_center">{CREATE_TIME}</li>\
           </ul>'
		;
		var page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	findDom=$G('#financialSearchDiv')
		,	list=window.subAjax('#financialSearchDiv',{
				path:'GET_MONEY_RECHARGE'
			,	sub:'#financialSearchSub'
			,	ckdata:function(data){
					var SORT_TYPE=data['SORT_TYPE'];
					var SORT_COLUMN=data['SORT_COLUMN'];
					var FIND_NAME_TYPE=data['FIND_NAME_TYPE'];
					var d=window.wm.setDataList(data,'FIND_NAME','请输入要查找的内容',findDom[0],pageArray);
					d['SORT_TYPE']=SORT_TYPE;
					d['SORT_COLUMN']=SORT_COLUMN;
					d['FIND_NAME_TYPE']=FIND_NAME_TYPE;
					d['FIND_TYPE']=0;
					if(!$G.isNaN(d['FIND_NAME'])){
						d['FIND_TYPE']+=1;
					}
					var findtimeValue=$G('.findTime',findDom[0]).getAtt('subValue')
					;
					d['TIME_START']='';
					d['TIME_END']='';
					if(!$G.isNaN(findtimeValue)){
						var t=findtimeValue.split('至')
						;
						if(t.length>0){
							d['TIME_START']=t[0];
							d['TIME_END']=t[1];
							d['FIND_TYPE']+=2;
						}
					}
					if(d['FIND_TYPE']==0)d['FIND_TYPE']=100;
					delete d['findTime'];
					return d;
				}
			,	callback:function(JSON){
					var str='';
					JSON.INFO=JSON.INFO||{
											PAGE_INDEX:1
										,	CAMPAIGN_COUNT:0
										};
					JSON.LIST=JSON.LIST||{};
					
					if(!window.wm.msg(JSON.CODE,false))
						return;
					var	n=JSON.LIST.length
					;
					if(n>0){
						for(var i=0;i<n;i++){
							var t_str=html
							,	v=JSON.LIST[i]
							;
							getListRechargeList[v.SWIFT_NUMBER]=v;
							$G.Each(function(i,k){
								var reg=new RegExp('{'+k+'}','ig')
								,	val=this
								;
								if(k=='PAYMENT_TYPE'){
									var pingzheng=val=='3'?'--':'<a href="'+window.wm.path.pic.url+'/'+v.ACCOUNTING_DOCUMENT_FILE+'" target="_blank" >'+v.ACCOUNTING_DOCUMENT_NUMBER+'</a>'
									;
									t_str=t_str.replace((new RegExp('{pingzheng}','ig')),pingzheng);
									if(val=='1'){
										val='支票';
									}else if(val=='2'){
										val='汇款';
									}else if(val=='3'){
										val='现金';
									}
								}else if(
									k=='MONEY'
								||	k=='INVEST'
								||	k=='BALANCE'
								){
									val=$G.FormatNumber(val);
								}
								t_str=t_str.replace(reg,val);
								
							},v);
							str+=t_str;
						}
					}
					page.setup(JSON.INFO.GROUP_COUNT,n,pageArray);
					$G('div:content_list_lf').html(beginHtml+str);
					
				}
			});
		return list;
		}()
	;
	window.getList=function(p){
		pageArray['PAGE_INDEX']=obj.p||pageIni.PAGE_INDEX;
		financialList.sub();
	};
	financialList.sub();
	
	var chart=function(serverTime){
		var dateTime=new Date(Date.parse((serverTime||'').replace(/-/ig,'/')))
		,	monthTime=dateTime.getMonth()+1
		,	dayTime=dateTime.getDate()
		,	yearTime=dateTime.getFullYear()
		,	month=function(json){
				//json={"2013-12-20":"41.0","2013-12-09":"20.0","2013-12-18":"115.0","2013-12-17":"60.0","2013-12-02":"60.0","2013-11-29":"10.0","2013-11-28":"225.0"};
				var category=new Array()
				,	data1={
						"seriesName":'本月'
					,	"renderAs":'Area'
					,	"plotBorderColor":'f4a610'
					,	"color":'f4eb5c'
					,	"data":''
					}
				,	data2={
						"seriesName":'上月'
					,	"renderAs":'Area'
					,	"plotBorderColor":'ffb6b3'
					,	"color":'ffd4d2'
					,	"data":''
					}
				,	addDay=function(j){
						var ds=new Array()
						;
						for(var i=1,l=j.length;i<l;i++){
							//if(parseInt(i)%2==1){
								ds.push({
									"value" : j[i]||0
								});
							//}
						}
						return ds;
					}
				;
				var sd={}
				;
				sd.length=13;
				for(var i=1;i<32;i++){
					//if(i%2==1){
						category.push({
							"label" : i<10?'0'+i:i
						});
					//}
				}
				for(var i=0,l=sd.length;i<l;i++){
					sd[i]=new Array();
				}
				for(var k in json){
					var jsonData=new Date(k)
					,	jsonVal=json[k]
					,	month=jsonData.getMonth()+1
					,	day=jsonData.getDate()
					;
					if(sd[parseInt(month)].length==0)sd[parseInt(month)].length=32;
					sd[parseInt(month)][parseInt(day)]=jsonVal;
				}
				
				data1['data']=addDay(sd[monthTime]);
				if(monthTime<2)monthTime=13;
				data2['data']=addDay(sd[monthTime-1]);
				for(var i=0,n=data1['data'].length;i<n;i++){
					if(i>=dayTime)delete data1['data'][i];
				}
				
				var chartsData={dataset:[data1,data2]};
				chartsData["chart"]={
					palette:1
				,	caption:"当月消费统计"
				,	plotSpacePercent:20
				,	showValues:0
				,	numVDivLines:14
				,	DivLineColor:"a6a6a6"
				,	bgcolor:"ffffff"
				,	drawAnchors:1
				,	canvasBorderColor:"d4d4d4"
				,	outCnvBaseFontColor:"a6a6a6"
				,	numDivLines:4
				,	chartRightMargin:30
				,	numberPrefix:"￥"
				,	formatNumberScale:0
				,	divLineAlpha:30
				,	alternateHGridAlpha:20
				,	setAdaptiveYMin:1
				,	showLabels:1
				,	showBorder:0
				,	rotateValues:0
				,	labelDisplay:"NONE"
				,	valuePosition:"ABOVE"
				,	labelStep:2
				,	showYAxisValues:1
				,	rotateYAxisName:0
				,	showAlternateHGridColor:0
				};
				chartsData["categories"]=[ {
					"category" : category
				}];
				
				window.mkCharts({
					id:'chartdiv'
				,	dataset:chartsData
				,	swf:'MSLine.swf'
				,	w:489
				,	h:400
				,	n1:0
				,	n2:0
				},'json');
			}
		,	year=function(json){
				//json={"2012-10":"296.0","2012-11":"235.0"};
				var category=new Array()
				,	data1={
						"seriesName":'今年'
					,	"renderAs":'Area'
					,	"plotBorderColor":'f4a610'
					,	"color":'f4eb5c'
					,	"data":''
					}
				,	data2={
						"seriesName":'去年'
					,	"renderAs":'Area'
					,	"plotBorderColor":'ffb6b3'
					,	"color":'ffd4d2'
					,	"data":''
					}
				,	addDay=function(j){
						var ds=new Array()
						;
						for(var i=0,l=j.length;i<l;i++){
							ds.push({
										"value" : j[i]||0
									});
						}
						return ds;
					}
				;
				var sd={}
				;
				for(var i=1;i<13;i++){
					category.push({
						"label" : i<10?'0'+i:i
					});
				}
				for(var k in json){
					var jsonData=new Date(k)
					,	jsonVal=json[k]
					,	month=jsonData.getMonth()
					,	year=jsonData.getFullYear()
					;
					if(!sd[parseInt(year)])sd[parseInt(year)]=new Array();
					sd[parseInt(year)][parseInt(month)]=jsonVal;
				}
				/*for(var i=0;i<n;i++){
					if(!sd[parseInt(json[i].year)])sd[parseInt(json[i].year)]=new Array();
					sd[parseInt(json[i].year)][parseInt(json[i].month)-1]=json[i].yearConsume;
				}*/
				var xlA=new Array();
				for(var k in sd){
					if(xlA.length==0)xlA.push(k);
					else if(parseInt(k)<xlA[0]){
						var tx=xlA[0];
						xlA[1]=k;
						xlA[0]=tx;
					}else{
						xlA[1]=k;
					}
				}

				var yearIng=sd[yearTime];
				
				data1['data']=yearIng?addDay(yearIng):'';
				for(var i=0,l=xlA.length;i<l;i++){
					if(xlA[i]!=yearTime){
						data2['data']=addDay(sd[xlA[i]]);
					}
				}
				var chartsData={dataset:[data1,data2]};
				chartsData["chart"]={
					palette:'1'
				,	caption:'当年消费统计'
				,	plotSpacePercent:'20'
				,	showValues:'0'
				,	numVDivLines:'10'
				,	DivLineColor:'a6a6a6'
				,	bgcolor:'ffffff'
				,	drawAnchors:'1'
				,	canvasBorderColor:'d4d4d4'
				,	outCnvBaseFontColor:'a6a6a6'
				,	numDivLines:'4'
				,	chartRightMargin:'30'
				,	numberPrefix:'￥'
				,	formatNumberScale:'0'
				,	divLineAlpha:'30'
				,	alternateHGridAlpha:'20'
				,	setAdaptiveYMin:'1'
				,	showLabels:'1'
				,	showBorder:'0'
				,	rotateValues:'0'
				,	labelDisplay:'NONE'
				,	valuePosition:'ABOVE'
				,	showYAxisValues:'1'
				,	rotateYAxisName:'0'
				,	showAlternateHGridColor:'0'
				};
				chartsData["categories"]=[ {
					"category" : category
				}];
				
				window.mkCharts({
					id:'chartdiv1'
				,	dataset:chartsData
				,	swf:'MSLine.swf'
				,	w:489
				,	h:400
				,	n1:0
				,	n2:0
				},'json');
			}
		;
		return {
			year:year
		,	month:month
		};
	};
	window.ajax({
		obj:$G('#chartdiv')[0]
	,	path:'GET_MONEY_TREND'
	,	calback:function(json){
			json=json||[];
			var chartShow=chart(json.TIME);
			chartShow.year(json.YEAR);
			chartShow.month(json.MONTH);
		}
	});
	
});