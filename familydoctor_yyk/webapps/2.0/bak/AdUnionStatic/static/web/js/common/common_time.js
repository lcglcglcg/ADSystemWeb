document.writeln('<div name=\"oneTime\"  style="display:none;width:200px; height:226px; border:1px solid #CCC; padding:10px; background:#FFF; font-size:12px; font-family:宋体;">');
document.writeln('  <div style="width:200px; height:180px;" name="oneTimeHtml" ></div>');
document.writeln('  <div name="oneTimeSub" style="height:26px; padding:10px 0; line-height:27px;border-top:1px solid #CCC;"> <a style="display:block; width:82px; height:26px; float:left; text-align:center; margin-right:20px; background:#5c81d1; color:#fff; text-decoration:none;">清空</a><a style="display:block;height:26px; float:left;background:#fff; color:#435072; text-decoration:none;">取消</a> </div>');
document.writeln('</div>');

document.writeln("<div name=\"twoTime\" style=\"background:#FFF;display:none;border: 1px solid #CCCED4; font-size: 13px; width:420px; padding:12px;\">");
document.writeln("  <div style=\"height: 20px;line-height: 20px;\" name=\"twoTimeQList\"><span style=\"color:#0033CC;cursor: pointer;\">今天</span> | <span style=\"color: #000000;cursor: pointer;\">昨天</span> | <span style=\"color: #0033CC;cursor: default;\">最近7天</span> | <span style=\"color: #0033CC;cursor: pointer;\">上周</span> | <span style=\"color: #0033CC;cursor: pointer;\">本月</span> | <span style=\"color: #0033CC;cursor: pointer;\">上个月</span> | <span style=\"color:#0033CC;cursor: pointer;\">上个季度</span> | <span style=\"color:#0033CC;cursor: pointer;\">默认</span>");
document.writeln("    <div style=\" cursor:pointer; float:right; width:10px;height: 9px; no-repeat scroll -47px -20px;right: 12px;top: 12px;\"></div>");
document.writeln("  </div>");
document.writeln("  <div style=\" width:100%;margin-right: 10px;\">");
document.writeln("    <div style=\"float: left;height: 18px;padding: 2px 0; margin-left:10px;\"> <b style=\" padding-right: 5px;\" >开始日期</b> <span name=\"twoTimeShow\"></span> </div>");
document.writeln("    <div style=\"float: right;height: 18px;padding: 2px 0; margin-right:10px;\"> <b style=\" padding-right: 5px;\">结束日期</b> <span name=\"twoTimeShow\"></span> </div>");
document.writeln("    <div style=\"border: 1px solid #CCCED4;clear:both;width:402px; height:180px; margin:3px auto;\" name=\"twoTimeHtml\"></div>");
document.writeln("  </div>");
document.writeln("  <div name=\"twoTimeSub\" style=\"clear:both; height:24px;line-height:24px; padding-top:6px;\"> <a style=\"display:block; float:left; width:80px; text-decoration:none; text-align:center;background:#5b81d0; border:1px solid #2f52b7;color:#FFF;\">确定</a> <a style=\" display:block; float:left; width:80px; text-decoration:none; color:#4668ab; text-align:center;\">取消</a> </div>");
document.writeln("</div>");
$G(function(){
	window.insetTimeCallBack=function(v){
		if($G.isNaN(v))return;
		var t=v.split('/')
		,	t1=$G.formatdate(new Date(Date.parse(t[0].replace(/-/ig,'/'))),'YYYY-MM-dd')
		,	t2=$G.formatdate(new Date(Date.parse(t[1].replace(/-/ig,'/'))),'YYYY-MM-dd')
		;
		return t1+' 至 '+t2;
	};
	var gtime=$G.time({
			wholemonth:true
		,	two:true
		,	fnname:'window.insetTime'
		,	fnone:'window.insetTimeOne'
		,	fntwo:'window.insetTimeTwo'
		,	fnload:'window.insetTimeLoad'
		,	innerObj:$G('.twoTimeHtml')
		,	altObj:$G('.twoTime')
		,	timeObj:$G('.twoTime')
	});
	var oneTime={};
	window.gtime=gtime;
	var twoTimeObj=$G('.twoTimeQList')
	,	twoTimeSpan=$G('span',twoTimeObj[0])
	,	twoTimeShow=$G('.twoTimeShow')
	;
	var getMonthDays=function(year,month){ 
			//本月第一天 1-31  
			var relativeDate=new Date(year,month,1); 
			//获得当前月份0-11  
			var relativeMonth=relativeDate.getMonth(); 
			//获得当前年份4位年  
			var relativeYear=relativeDate.getFullYear(); 
			//当为12月的时候年份需要加1  
			//月份需要更新为0 也就是下一年的第一个月  
			if(relativeMonth==11){ 
				relativeYear++; 
				relativeMonth=0; 
			}else{ 
				//否则只是月份增加,以便求的下一月的第一天  
				relativeMonth++; 
			} 
			//一天的毫秒数  
			var millisecond=1000*60*60*24; 
			//下月的第一天  
			var nextMonthDayOne=new Date(relativeYear,relativeMonth,1); 
			//返回得到上月的最后一天,也就是本月总天数  
			return new Date(nextMonthDayOne.getTime()-millisecond).getDate(); 
		}
	,	getPriorMonthFirstDay=function(year,month){
			if(month==0){
				month=11;//月份为上年的最后月份
				year--;//年份减1
				return new Date(year,month,1);
			}
			//否则,只减去月份
			month--;
			return new Date(year,month,1);
		}
	,	getPriorSeasonFirstDay=function(year,month){
		  var quarterMonthStart=0;
		  var spring=0; //春
		  var summer=3; //夏
		  var fall=6;   //秋
		  var winter=9;//冬
		  //月份从0-11
		  switch(month){//季度的其实月份
			  case spring:
			   //如果是第一季度则应该到去年的冬季
				 year--;
				 month=winter;
			   break;
			  case summer:
			   month=spring;
			   break;
			  case fall:
			   month=summer;
			   break;
			  case winter:
			   month=fall;
			   break;
		  };
		  return new Date(year,month,1);
		}
	,	getQuarterSeasonStartMonth=function(month){ 
			var quarterMonthStart=0; 
			var spring=0; //春  
			var summer=3; //夏  
			var fall=6;   //秋  
			var winter=9;//冬  
			//月份从0-11  
			if(month<3){ 
			return spring; 
			} 
			
			if(month<6){ 
			return summer; 
			} 
			
			if(month<9){ 
			return fall; 
			} 
			
			return winter; 
	   }; 
	;
	
	window.insetTwoTimeSub=function(){};
	window.clearTime=function(){};
	window.insetTwoTimeSubTrue=true;
	var dateFn={
		setFlash:function(t1,t2){
			twoTimeShow[0].innerHTML=t2;
			twoTimeShow[1].innerHTML=t1;
			window.insetTwoTimeSubTrue=true;
			try{
				gtime.obj().setData&&gtime.obj().setData(t2,t1);
			}catch(e){
			}
		}
	,	day:function(){
			var t=$G.formatdate(new Date(),'YYYY-MM-dd');
			this.setFlash(t,t);
			return t;
		}
	,	yesterday:function(){
			var t=$G.formatdate(new Date(),'YYYY-MM-dd',1);
			this.setFlash(t,t);
			return t;
		}
	,	latelySevenDays:function(lastvalue){
			//lastvalue=lastvalue||1;
			lastvalue=1;
			var t1=$G.formatdate(new Date(),'YYYY-MM-dd',lastvalue);
			var t2=$G.formatdate(new Date(Date.parse(t1.replace(/-/ig,'/'))),'YYYY-MM-dd',(7-lastvalue));
			this.setFlash(t1,t2);
		}
	,	OnThePeripheral:function(){
			var currentDate=new Date(); 
			//返回date是一周中的某一天  
			var week=currentDate.getDay(); 
			//返回date是一个月中的某一天  
			var month=currentDate.getDate(); 
			//一天的毫秒数  
			var millisecond=1000*60*60*24; 
			//减去的天数  
			var minusDay=week!=0?week-1:6; 
			//获得当前周的第一天  
			var currentWeekDayOne=new Date(currentDate.getTime()-(millisecond*minusDay));
			var priorWeekLastDay=new Date(currentWeekDayOne.getTime()-millisecond);
			this.setFlash($G.formatdate(priorWeekLastDay,'YYYY-MM-dd'),$G.formatdate(priorWeekLastDay,'YYYY-MM-dd',6));
		}
	,	ThisMonth:function(lastvalue){
			//lastvalue=lastvalue||0;
			lastvalue=1;
			var currentDate=new Date(); 
			//获得当前月份0-11  
			var currentMonth=currentDate.getMonth(); 
			//获得当前年份4位年  
			var currentYear=currentDate.getFullYear();
			var firstDay=new Date(currentYear,currentMonth,1);
			this.setFlash($G.formatdate(new Date(),'YYYY-MM-dd',lastvalue),$G.formatdate(firstDay,'YYYY-MM-dd'));
		}
	,	lastMonth:function(){
			var currentDate=new Date(); 
			//获得当前月份0-11  
			var currentMonth=currentDate.getMonth(); 
			//获得当前年份4位年  
			var currentYear=currentDate.getFullYear(); 
			//获得上一个月的第一天  
			priorMonthFirstDay=getPriorMonthFirstDay(currentYear,currentMonth);
			//获得上一月的最后一天  
			var priorMonthLastDay=new Date(priorMonthFirstDay.getFullYear(),priorMonthFirstDay.getMonth(),getMonthDays(priorMonthFirstDay.getFullYear(), priorMonthFirstDay.getMonth())); 
			this.setFlash($G.formatdate(priorMonthLastDay,'YYYY-MM-dd'),$G.formatdate(priorMonthFirstDay,'YYYY-MM-dd'));
		}
	,	LastQuarter:function(){
			var currentDate=new Date(); 
			//获得当前月份0-11  
			var currentMonthIng=currentDate.getMonth(); 
			//获得当前年份4位年  
			var currentYear=currentDate.getFullYear(); 
			//本季度的开始月份
			var currentMonth=getQuarterSeasonStartMonth(currentMonthIng);
			//上季度的第一天
			var priorSeasonFirstDay=getPriorSeasonFirstDay(currentYear, currentMonth);
			//上季度的最后一天  
			var priorSeasonLastDay=new Date(priorSeasonFirstDay.getFullYear(),priorSeasonFirstDay.getMonth()+2,getMonthDays(priorSeasonFirstDay.getFullYear(), priorSeasonFirstDay.getMonth()+2)); 
			this.setFlash($G.formatdate(priorSeasonLastDay,'YYYY-MM-dd'),$G.formatdate(priorSeasonFirstDay,'YYYY-MM-dd'));
		}
	};
	twoTimeSpan.click(function(){
		twoTimeSpan.Each(function(){
			this.style.cssText='color: #0033CC;cursor: pointer;';
			$G(this).setAtt('selectobj',0);
			
		});
		this.style.cssText='color: #000000;cursor: default;';
		$G(this).setAtt('selectobj',1);
		var lastday=$G(this).getAtt('lastday');
		if(this.innerHTML=='今天'){
			dateFn.day();
		}else if(this.innerHTML=='昨天'){
			dateFn.yesterday();
		}else if(this.innerHTML=='最近7天'){
			dateFn.latelySevenDays(lastday);
		}else if(this.innerHTML=='上周'){
			dateFn.OnThePeripheral();
		}else if(this.innerHTML=='本月'){
			dateFn.ThisMonth(lastday);
		}else if(this.innerHTML=='上个月'){
			dateFn.lastMonth();
		}else if(this.innerHTML=='上个季度'){
			dateFn.LastQuarter();
		}else if(this.innerHTML=='默认'){
			window.insetTimeDefault();
		}
		window.insetTwoTimeSub=window.insetTwoTimeSubTemp;
		
	});
	$G('a',$G('.twoTimeSub')[0]).click(function(){
		if((this.innerHTML+'').indexOf('确定')>=0){
			window.insetTwoTimeSub();
		}else
			gtime.none();
	});
	$G('a',$G('.oneTimeSub')[0]).click(function(){
		if((this.innerHTML+'').indexOf('清空')>=0){
			window.clearTime();
		}else
			oneTime.none();
	});
	window.insetTimeLoad=function(){};
	window.insetTime=function(){};
	window.insetTimeOne=function(){};
	window.insetTimeTwo=function(){};
	window.insetTimeDefault=function(){};
	window.insetTimeEdit=function(obj){
		var vObj=$G($G('input',obj.parentNode)[0])
		,	t=(twoTimeShow.html()).join(' 至 ')
		;
		vObj[0].value=function(){
			var name='昨天';
			twoTimeSpan.Each(function(){
				if($G(this).getAtt('selectobj')=='1')name=this.innerHTML;
			});
			return name;			
		}()+' '+t;
		vObj.setAtt('subValue',$G.Trim(t));
	};
	window.timeIni=function(s){
		$G(s).click(function(){
			var gObj=$G(this)
			,	setvalue=gObj.getAttribute('setvalue')||''
			,	istimeone=gObj.getAttribute('istimeone')
			,	two=istimeone=="true"?false:true
			,	maxdate=gObj.getAttribute('maxdate')||''
			,	mindate=gObj.getAttribute('mindate')||''
			,	formindate=gObj.getAttribute('formindate')||''
			;
			if(mindate=='day')mindate=$G.formatdate(new Date(),'YYYY-MM-dd');
			if(maxdate=='yesterday')maxdate=$G.formatdate(new Date(),'YYYY-MM-dd');
			var obj=this;
			if(two){
				gtime=$G.time({
						wholemonth:true
					,	two:true
					,	fnname:'window.insetTime'
					,	fnone:'window.insetTimeOne'
					,	fntwo:'window.insetTimeTwo'
					,	fnload:'window.insetTimeLoad'
					,	innerObj:$G('.twoTimeHtml')
					,	mindate:mindate
					,	maxdate:maxdate
					,	altObj:$G('.twoTime')
					,	timeObj:$G('.twoTime')
				});
				window.insetTimeDefault=function(){
					var vObj=$G($G('input',obj.parentNode)[0])
					,	inpVal=vObj.getAtt('bakvalue')||''
					;
					vObj[0].value=inpVal;
					vObj.setAtt('subValue',inpVal);
					gtime.none();
				};
				window.insetTwoTimeSub=window.insetTwoTimeSubTemp=function(){
					window.insetTimeEdit(obj);
					gtime.none();
				};
				window.insetTime=function(o){
					window.insetTwoTimeSubTrue=false;
					eval("var j="+o+";");
					if(j.code>0){
						window.insetTwoTimeSub=function(){
							alert('选择的开始时间要小于等于结束时间');
						}
						return ;
					}
					window.insetTwoTimeSub=function(){
						var vObj=$G('input',obj.parentNode);
						vObj[0].value=window.insetTimeCallBack(j.val);
						if(window.insetTwoTimeSubTrue)window.insetTimeEdit(obj);
						else vObj.setAtt('subValue',$G.Trim(vObj[0].value));
						gtime.none();
					};
				};
				window.insetTimeLoad=function(o){
					twoTimeSpan.Each(function(i){
						if(i>0){
							this.style.cssText='color: #0033CC;cursor: pointer;';
							$G(this).setAtt('selectobj',0);
						}else{
							$G(this).setAtt('selectobj',1);
							this.style.cssText='color: #000000;cursor: default;';
						}
						
					});
					if(setvalue=='day')dateFn.day();
					else dateFn.yesterday();
					//dateFn.setFlash(twoTimeShow[0].innerHTML,twoTimeShow[1].innerHTML,true);
				};
				window.insetTimeOne=function(o){
					twoTimeSpan.Each(function(i){
						this.style.cssText='color: #0033CC;cursor: pointer;';
						$G(this).setAtt('selectobj',0);
					});
					eval("var j="+o+";");
					twoTimeShow[0].innerHTML=$G.formatdate(new Date(Date.parse(j.val.replace(/-/ig,'/'))),'YYYY-MM-dd');
				};
				window.insetTimeTwo=function(o){
					twoTimeSpan.Each(function(i){
						this.style.cssText='color: #0033CC;cursor: pointer;';
						$G(this).setAtt('selectobj',0);
					});
					eval("var j="+o+";");
					twoTimeShow[1].innerHTML=$G.formatdate(new Date(Date.parse(j.val.replace(/-/ig,'/'))),'YYYY-MM-dd');
				};
				gtime.show({obj:this});
				if(setvalue=='day')dateFn.day();
				else dateFn.yesterday();
			}else{
				window.insetTime=function(o){
					eval("var j="+o+";");
					$G('input',obj.parentNode)[0].value=$G.formatdate(new Date(Date.parse(j.val.replace(/-/ig,'/'))),'YYYY-MM-dd');
					if(formindate){
						var fominObj=$G(formindate);
						fominObj.setAtt('mindate',$G.formatdate(new Date(Date.parse(j.val.replace(/-/ig,'/'))),'YYYY-MM-dd',1));
						//$G('input',fominObj[0].parentNode)[0].value=$G.formatdate(new Date(Date.parse(j.val.replace(/-/ig,'/'))),'YYYY-MM-dd');
					}
					oneTime.none();
				};
				window.clearTime=function(){
					$G('input',obj.parentNode)[0].value='';
				};
				oneTime=gObj.time({altObj:$G('.oneTime'),innerObj:$G('.oneTimeHtml'),maxdate:maxdate,mindate:mindate,wholemonth:false,two:two,fnname:'insetTime'});
				
				oneTime.show();
			}
			
		}).Each(function(){
			var gObj=$G(this)
			,	istimeone=gObj.getAttribute('istimeone')
			,	obj=$G($G('input',this.parentNode)[0])
			,	mindate=gObj.getAttribute('mindate')||''
			,	notValue=gObj.getAttribute('notValue')||''
			,	setvalue=gObj.getAttribute('setvalue')||''
			,	setlastvalue=gObj.getAttribute('setlastvalue')||0
			,	k=0
			,	eachIniFn=function(k){
					twoTimeSpan.Each(function(i){
						$G(this).setAtt('lastday',setlastvalue);
						if(k!=i){
							this.style.cssText='color: #0033CC;cursor: pointer;';
							$G(this).setAtt('selectobj',0);
						}else{
							$G(this).setAtt('selectobj',1);
							this.style.cssText='color: #000000;cursor: default;';
						}
					});
					window.insetTimeEdit(this);
				}
			;
			if(setvalue){
				if(setvalue=='day'){
					dateFn.day();
					k=0;
				}else if(setvalue=='yesterday'){
					dateFn.yesterday();
					k=1;
				}else if(setvalue=='latelySevenDays'){
					dateFn.latelySevenDays(setlastvalue);
					k=2;
				}else if(setvalue=='OnThePeripheral'){
					dateFn.OnThePeripheral();
					k=3;
				}else if(setvalue=='ThisMonth'){
					dateFn.ThisMonth(setlastvalue);
					k=4;
				}else if(setvalue=='lastMonth'){
					dateFn.lastMonth();
					k=5;
				}else if(setvalue=='LastQuarter'){
					dateFn.LastQuarter();
					k=6;
				}else if(setvalue=='NULL'){
					return;
				}
				eachIniFn.call(this,k);
			}else if(notValue){
			}else if(istimeone!='true'){
				dateFn.yesterday();
				eachIniFn.call(this,k);
			}else{
				obj.val(mindate=='day'?$G.formatdate(new Date(),'YYYY-MM-dd',1):mindate);
			}
			obj.setAtt('bakvalue',obj[0].value);
			obj.setAtt('readonly',true);
		});
	};
	window.timeIni('.calendar');
});