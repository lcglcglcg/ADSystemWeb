(function(){	
	/**************************************推广时段********************************/
	var scheduleTypeDiv=$G('#scheduleTypeDiv');
	var timeToolDiv=$G('div:time_img_t',scheduleTypeDiv[0])
	,	toolStr=''
	,	tmptoolStr=''
	,	timeClass='timeBg2'
	;
	for(var i=1;i<25;i++){
		tmptoolStr+='<span>&nbsp;</span>';
		if(i%4==0){
			toolStr+="<p>"+tmptoolStr+"</p>";
			tmptoolStr='';
		}
	}
	timeToolDiv.html(toolStr);
	var timeTool=$G('span',timeToolDiv[0])
	,	str=''
	,	tstr=''
	,	timeDay=['周一','周二','周三','周四','周五','周六','周日']
	,	time_img_i=$G('div:time_img_i')
	;
	for(var i=1;i<169;i++){
		var k=i%24;
		tstr+='<span>'+(k==0?23:(k-1))+'</span>';
		if(i%6==0){
			tstr+='</li>';
			if(k>0)tstr+='<li>';
		}
		if(k==0){
			str+='<ul><li class="time_input"><input checked="checked" type="checkbox" /></li><li class="time_day">'+timeDay[(i/24/1)-1]+'</li><li>'+tstr+'</ul>';
			tstr='';
		}
	}
	time_img_i.html(str);
	timeTool.Each(function(i){
		$G(this).setAtt('value',i);
	}).click(function(){
		var obj=$G(this)
		,	c=obj.getAtt('class')
		,	v=obj.getAtt('value')
		,	kc=timeClass
		;
		if($G.isNaN(c)){
			obj.setAtt('class','timeBg1');
		}else{
			obj.setAtt('class','');
			kc='';
		}
		$G('span',time_img_i[0]).Each(function(){
			var t=$G(this)
			;
			if(this.innerHTML==v)t.setAtt('class',kc);
		});
		$G('ul',time_img_i[0]).Each(function(i){
			if($G(('span:'+timeClass),this).length>0){
				$G('input',this)[0].checked=false;
			}else{
				$G('input',this)[0].checked=true;
			}
		});
	});
	$G('input',time_img_i[0]).click(function(){
		var chk=this.checked
		,	clas=chk?'':timeClass;
		;
		$G('span',this.parentNode.parentNode).Each(function(){
			$G(this).setAtt('class',clas);
		});
		if(!chk)timeTool.style({'class':'timeBg1'});
		else{
			var stArray={};
			$G('ul',time_img_i[0]).Each(function(i){
				$G.Each(function(){
					stArray[this]=true;
				},$G(('span:'+timeClass),this).html());
			});
			timeTool.Each(function(){
				var obj=$G(this)
				,	v=obj.getAtt('value')
				;
				if(stArray[v]===true){
					$G(this).style({'class':'timeBg1'});
				}else{
					$G(this).style({'class':''});
				}
			});
		}
	});
	
	var timeSpanList=$G('span',time_img_i[0])
	,	spanOnClick=function(){
			var obj=$G(this)
			,	c=obj.getAtt('class')
			,	ht=this.innerHTML
			;
			$G(this).setAtt('class',($G.isNaN(c)?timeClass:''));
			var isTrue=false;
			if(!$G.isNaN(c)){
				timeSpanList.Each(function(){
					if(this.innerHTML==ht&&!$G.isNaN($G(this).getAtt('class'))){
						isTrue=true;
					}
				});
			}else{
				isTrue=true;
			}
			timeTool.Each(function(){
				var t1Obj=$G(this);
				if(ht==t1Obj.getAtt('value'))t1Obj.setAtt('class',(isTrue?'timeBg1':''));
			});
			isTrue=false;
			$G('span',this.parentNode.parentNode).Each(function(){
				if(!$G.isNaN($G(this).getAtt('class')))isTrue=true;
			});
			$G('input',this.parentNode.parentNode).Each(function(){
				this.checked=isTrue?false:true;
			});
		}
	;
	timeSpanList.click(spanOnClick);
	var timeCZToolFn=function(ifFn){
		$G('ul',time_img_i[0]).Each(function(i){
			if(ifFn(i)){
				$G('input',this)[0].checked=true;
				$G('span',this).style({'class':''});
			}else{
				$G('input',this)[0].checked=false;
				$G('span',this).style({'class':timeClass});
			}
		});
		timeTool.style({'class':'timeBg1'});
	};
	$G('a',$G('#timeCZTool')[0]).click(function(){
		if(this.innerHTML.indexOf('全部时间')>=0){
			timeSpanList.style({'class':''});
			$G('input',time_img_i[0]).Each(function(){
				this.checked=true;
			});
			timeTool.style({'class':''});
		}else if(this.innerHTML.indexOf('工作日')>=0){
			timeCZToolFn(function(i){
				if(i<5)return true;
				else return false;
			});
		}else if(this.innerHTML.indexOf('周末')>=0){
			timeCZToolFn(function(i){
				if(i<5)return false;
				else return true;
			});
		}
	});
	window.getTimeNumber=function(){
		var id=new Array();
		timeSpanList.Each(function(){
			var obj=$G(this)
			,	c=obj.getAtt('class')
			;
			if($G.isNaN(c))id.push(1);
			else id.push(0);
		});
		var s=id.join('');
		if(s.indexOf('0')<0){
			s='111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
		}
		return s;
	};
	window.setTimeNumber=function(ids){
		timeSpanList.Each(function(i){
			var obj=$G(this)
			;
			obj.setAtt('class','');
			if($G.isNaN(ids)){
				$G('input',scheduleTypeDiv[0]).Each(function(){
					this.checked=true;
				});
				timeTool.Each(function(){
					var obj=$G(this);
					obj.setAtt('class','');
				});
				return;
			}
			if(ids[i]==0){
				spanOnClick.call(this);
			}
		});
	};
})();