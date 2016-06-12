var regionType=$G('.REGION_TYPE')
,	regionSelectDiv=$G('#regionSelectDiv')
;
regionType.click(function(){
	var v=this.value;
	if(v==1){
		regionSelectDiv.show();
	}else if(v==2){
		regionSelectDiv.none();
	}
});


var addBrandPrice=$G('.addBrandPrice')
,	subFunction=function(d){
		window.ajax({
			path:'ADD_BRAND'
		,	data:d
		,	calback:function(JSON){
				subFun=function(d){
					subFun=function(){};
					subFunction(d);
				};
				if(window.wm.msg(JSON.CODE,false)){
					alert('订单添加成功');
					window.document.location='/brand/index.shtml';
				}else{
				}
			}
		});
	}
,	subFun=function(d){
		subFun=function(){};
		subFunction(d);
	}
;
$G('.addBrandSub').click(function(){
	if(!$G.isNumber(addBrandPrice[0].value) || !window.wm.ckType.campaignBudget.call(addBrandPrice[0],addBrandPrice[0].value)){
		window.msg.call(addBrandPrice[0],{msg:'广告消费必须大于0'});
		return;
	}
	
	var d={};
	d['PRICE']=addBrandPrice[0].value;
	d['REGION_TYPE']=(regionType.checked(true))+'';
	if(!d['REGION_TYPE']||d['REGION_TYPE']==2){
		d['REGION_SERIALIZE']=window.region.getRegion(true);
		if(!d['REGION_SERIALIZE']){
			window.msg.call($G('.addBrandSub')[0],{msg:'请选择要投放的区域'});
			return;
		}
	}
	d['DEPT_SERIALIZE']=window.keshi.getid();
	if(!d['DEPT_SERIALIZE']){
		window.msg.call($G('.addBrandSub')[0],{msg:'请选择要投放的科室'});
		return;
	}
	d['SHOW_TIME_START']='';
	d['SHOW_TIME_END']='';
	var t=window.getTimes('time',$G('#addBrandTime')[0]);
	if(t.length>0){
		d['SHOW_TIME_START']=t[0];
		d['SHOW_TIME_END']=t[1];
	}
	subFun(d);
});
$G('.addBrandRes').click(function(){
	addBrandFn.clear();
});

var addBrandFn=window.top.addBrandFn;

$G('.close').click(function(){
	addBrandFn.none();
});
window.headerEnd(function(){
	window.keshi.setAll();
});
var addBrandClear=function(){
	window.keshi.clear();
	window.region.clear();
	addBrandPrice[0].value='';
};