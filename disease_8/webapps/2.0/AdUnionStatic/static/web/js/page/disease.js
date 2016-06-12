window.disease=function(){
	var get=function(fn){
			window.ajax({
				path:'GET_DISEASE_CODE'
			,	type:"get"
			,	calback:fn
			});
		}
	,	jsonList={
			'leve1':{}
		,	'leve2':{}
		,	'leve3':{}
		}
	,	getCodeLeve=function(code,name){
			var code_1=code.substring(0,4)+'000000'
			,	code_2=code.substring(0,7)+'000'
			,	code_3=code
			,	idList=[code_1,code_2,code_3]
			,	leve=3
			,	setList=function(){
					if(!name)return;
					if(leve==1)
						jsonList['leve'+leve][code]=name;
					else{
						var pCode=idList[leve-2];
						if(!jsonList['leve'+leve][pCode])jsonList['leve'+leve][pCode]=new Array();
						jsonList['leve'+leve][pCode].push({code:code,name:name});
					}
				}
			;
			if(code_1==code){
				leve=1;
			}else if(code_2==code){
				leve=2;
			}
			setList();
			return {
				id:idList
			,	ls:leve
			};
		}
	,	diseaseList=$G('#diseaseList')
	,	selectList={}
	,	diseaseSelectCount=$G('.diseaseSelectCount')
	,	diseaseLeveEach_1=$G('.diseaseLeveEach_1',diseaseList[0])
	,	diseaseLeve_1=$G('.diseaseLeve_1',diseaseList[0])
	,	diseaseSelectAll=$G('.diseaseSelectAll',diseaseList[0])
	,	diseaseSelectDifferent=$G('.diseaseSelectDifferent',diseaseList[0])
	,	checkbokCss={
			0:'checkboxOn'
		,	1:'checkboxOff'
		,	2:'checkboxcurr'
		}
	,	level_1_html='<li><a class="d_level1">\
							<span class="d_input">\
							<input name="titleCheckbox" type="checkbox" id="checkbox{code}" type="checkbox" value="{code}" >\
							<label name="categoryId0" id="label{code}" class="'+checkbokCss[2]+'" for="checkbox{code}" ></label></span>\
							<span class="word1"><b name="title" >{title}</b></span> <span class="span_line"></span> </a> \
								<ul id="{code}"></ul> \
					  </li>'
	,	level_2_html='\<li><a class="d_level2"> <span id="openlist_{code}" class="gather" onclick="window.disease.getlist.call(this,\'{code}\');" ></span>\
						<span class="d_input"><input name="titleCheckbox" id="checkbox{code}" type="checkbox" value="{code}" class="depart_input1" /><label name="categoryId1" id="label{code}" class="'+checkbokCss[2]+'" for="checkbox{code}" ></label></span>\
						<span class="word1"><b name="title">{title}</b></span></a> \
						<ul id="{code}" style="display:none;"></ul>\
						</li>'
	,	level_3_html='<li><a class="d_level3"> <span id="openlist_{code}" class="gather" onclick="window.disease.openList.call(this,\'{code}\');" ></span>\
					  <span class="d_input"><input name="titleCheckbox" id="checkbox{code}" type="checkbox" value="{code}" class="depart_input1" /><label name="categoryId2" id="label{code}" class="'+checkbokCss[2]+'" for="checkbox{code}" ></label></span>\
					  <span class="word1" name="title">{title}</span></a> \
					  <ul id="{code}" style="display:none;"></ul>\
					</li>'
	,	level_4_html='<li><a class="d_level4"> <span id="openlist_{code}" class="gather" onclick="window.disease.openList.call(this,\'{code}\');" ></span>\
						<span class="d_input"><input name="titleCheckbox" id="checkbox{code}" type="checkbox" value="{code}" class="depart_input1" /><label name="categoryId3" id="label{code}" class="'+checkbokCss[2]+'" for="checkbox{code}" ></label></span>\
						<span class="word1" name="title">{title}</span></a>\
						<ul id="{code}" style="display:none;"></ul>\
					  </li>'
	,	level_5_html='<li> <a class="d_level5">\
						<span class="d_input"><input name="titleCheckbox" id="checkbox{code}" type="checkbox" value="{code}" class="depart_input1"/><label name="categoryId4" id="label{code}" class="'+checkbokCss[2]+'" for="checkbox{code}" ></label></span>\
						<span class="word1" name="title">{title}</span> </a>\
					  </li>'
	,	getLevelHtml={
			'1':level_1_html
		,	'2':level_2_html
		,	'3':level_3_html
		,	'4':level_4_html
		,	'5':level_5_html
		}
	;
	var	echoHtml=function(id){
			var label=$G('label',this.parentNode)
			,	labelCss=label.getAtt('class')
			;
			if(labelCss==checkbokCss[0]){
				var listLabel=$G('label',$G('#'+id)[0])
				;
				listLabel.setAtt('class',checkbokCss[0]);
				showCount();
			}
			var selectCkFn=function(list){
				if($G.isNaN(list))return;
				$G.Each(function(){
					var selectStr=this+''
					,	Obj=$G('#label'+selectStr)
					,	styleCss=checkbokCss[1]
					;
					if(Obj.length<1)return;
					selectCkFn(selectList[selectStr]);
					Obj.setAtt('class',styleCss);
					ckParentCheckbok(selectStr);
				},list);
				delete selectList[id];
			};
			selectCkFn(selectList[id]);
			
		}
	,	getlist=function(id){
			openList.call(this,id,true);
		}
	,	openList=function(id,leve2){
			var obj=$G('#'+id,diseaseList[0])
			;
			if(obj[0].style.display==''){
				obj[0].style.display='none';
				$G(this).setAtt('class','gather');
			}else{
				obj[0].style.display='';
				$G(this).setAtt('class','spread');
			}
		}
	,	showCount=function(){
			var i=0;
			diseaseSelectCount[0].innerHTML=i;
		}
	,	ckParentCheckbok=function(id){
			var pids=getCodeLeve(id.replace(/label/,''))
			,	ls=pids.ls
			;
			for(var i=ls;i>0;i--){
				var tpd=$G('#'+pids.id[i-2])
				,	tpdLabel=$G('.categoryId'+(i-1),tpd[0])
				,	chd=checkbokCss[2]
				,	sY=0
				,	sN=0
				,	sH=0
				;
				tpdLabel.Each(function(){
					if($G(this).getAtt('class')==checkbokCss[0]){
						sY++;
					}else if($G(this).getAtt('class')==checkbokCss[1]){
						sH++;
					}else if($G(this).getAtt('class')==checkbokCss[2]){
						sN++;
					}
				});
				if(sH>0)chd=checkbokCss[1];
				else if(sN==0&&sY>0)chd=checkbokCss[0];
				else if(sN>0&&sY>0)chd=checkbokCss[1];
				var pGObj=$G('#label'+pids.id[i-2],diseaseList[0]);
				pGObj.setAtt('class',chd);
			}
		}
	,	labelClick=function(){
			var obj=$G(this)
			,	id=this.id
			,	cssName=obj.getAtt('class')
			,	listObj=$G('label',obj[0].parentNode.parentNode.parentNode)
			;
			if(cssName==checkbokCss[0]){
				obj.setAtt('class',checkbokCss[2]);
				listObj.setAtt('class',checkbokCss[2]);
			}else{
				obj.setAtt('class',checkbokCss[0]);
				listObj.setAtt('class',checkbokCss[0]);
			}
			ckParentCheckbok(id);
			delete selectList[id.replace(/label/,'')];
			/*var categoryLeve_1_Class=$G('.categoryId0').getAtt('class')
			;
			
			if(categoryLeve_1_Class==checkbokCss[0]){
				diseaseSelectAll[0].style.display='none';
				diseaseSelectDifferent[0].style.display='';
			}else{
				diseaseSelectAll[0].style.display='';
				diseaseSelectDifferent[0].style.display='none';
			}*/
			showCount();
		}
	,	selectChange=function(fnd){
			var value=this.value
			,	text=$G(this).getseltext()['diseaseLeve_1']
			;
			if(value=='0'){
				diseaseLeveEach_1[0].innerHTML='';
				return;
			}
			selectList={};
			showCount();
			var	html_1=level_1_html
			,	addLeveFn=function(data,setHTMl){
					var _html=''
					;
					if($G.isNaN(data))return;
					for(var i=0,n=data.length;i<n;i++){
						var thtml=setHTMl
						,	code=data[i].code
						,	title=data[i].name
						;
						thtml=thtml.replace(/{code}/ig,code).replace(/{title}/ig,title);
						_html+=thtml;
					}
					this.html(_html);
					return data;
				}
			,	setFn=function(list,l){
					var jsonNext=jsonList['leve'+l];
					if(!jsonNext || !list)return;
					for(var i=0,n=list.length;i<n;i++){
						var code=list[i].code
						;
						setFn(addLeveFn.call($G('#'+code,diseaseList[0]),jsonNext[code],getLevelHtml[l]),(l+1));
					}
				}
			;
			html_1=html_1.replace(/{code}/ig,value).replace(/{title}/,text);
			diseaseLeveEach_1.html(html_1);
			setFn(addLeveFn.call($G('#'+value,diseaseList[0]),jsonList['leve2'][value],level_2_html),3);
			fnd&&fnd();
		}
	;
	diseaseList.click(function(arg,et){
		var	obj=$G(et)
		,	cssName=obj.getAtt('class')
		,	name=obj.getAtt('name')
		,	pObj=''
		;
		if(name=='titleCheckbox' || cssName=='word1'){
			pObj=$G('label',et.parentNode);
		}else if(name=='title'){
			pObj=$G('label',et.parentNode.parentNode);
		}
		if(pObj!=''){
			labelClick.call(pObj[0]);
		}
	});
	get(function(JSON){
		diseaseLeve_1.delallsel();
		diseaseLeve_1.addsel('选择或输入定向科室','0');
		$G.Each(function(i,t){
			var id=this+''
			,	leve=getCodeLeve(t,id).ls
			;
			if(leve==1)
				diseaseLeve_1.addsel(id,t);
		},JSON);
		window.selDom&&window.selDom.resall();
		diseaseLeve_1[0].onchange=selectChange;
	});
	
	$G('.diseaseSelectAll .diseaseSelectDifferent .diseaseSelectClear',diseaseList[0]).click(function(){
		var labelList=$G('label',diseaseLeveEach_1[0])
		,	type=this.name
		;
		if(type=='diseaseSelectClear'){
			labelList.setAtt('class',checkbokCss[2]);
		}else if(type=='diseaseSelectAll'){
			labelList.setAtt('class',checkbokCss[0]);
			//diseaseSelectAll[0].style.display='none';
			//diseaseSelectDifferent[0].style.display='';
		}else {
			labelList.Each(function(){
				var thisTabel=$G(this)
				,	css=thisTabel.getAtt('class')==checkbokCss[0]?checkbokCss[2]:checkbokCss[0]
				;
				thisTabel.setAtt('class',css);
			});
			//diseaseSelectAll[0].style.display='';
			//diseaseSelectDifferent[0].style.display='none';
		}
	});
	
	
	return {
		getlist:getlist
	,	openList:openList
	,	getid:function(){
			if(diseaseLeve_1.getselvalue()['diseaseLeve_1']=='0')return '';
			var id=new Array()
			,	dgIds={}
			,	leveObj=$G('.categoryId0')
			,	leveCss=leveObj.getAtt('class')
			,	selectCkFn=function(list){
					$G.Each(function(){
						var Obj=selectList[this+'']
						;
						if(Obj && Obj.length>0){
							selectCkFn(Obj);
						}else{
							dgIds[this+'']=true;
						}
					},list);
				}
			,	fn=function(k,i){
					k=k.replace(/label/,'');
					var categoryIdList=$G('.categoryId'+i,$G('#'+k)[0])
					;
					if(categoryIdList.length<1){
						selectCkFn(selectList[k]);
						return;
					}
					$G('.categoryId'+i,$G('#'+k)[0]).Each(function(){
						var obj=$G(this)
						,	css=obj.getAtt('class')
						;
						if(css==checkbokCss[0])id.push(this.id);
						else if(css==checkbokCss[1]) fn(this.id,i+1);
					});
				}
			;
			if(leveCss==checkbokCss[0])id.push(leveObj[0].id);
			else if(leveCss==checkbokCss[1])fn(leveObj[0].id,1);
			id.push(leveObj[0].id);
			for(var m in dgIds){
				id.push(m);
			}
			return id?id.join(',').replace(/label/ig,''):'';
		}
	,	setid:function(id){
			if($G.isNaN(id)){
				$G('label',diseaseList[0]).setAtt('class',checkbokCss[2]);
				diseaseLeveEach_1[0].innerHTML='';
				diseaseLeve_1.setselvalue('0');
				window.selDom.resall();
				return;
			}
			id=$G.Trim(id||'');
			var pid=id.substr(0,4)+'000000';
			diseaseLeve_1.setselvalue(pid);
			window.selDom.resall();
			selectChange.call(diseaseLeve_1[0],function(){
				var selectListTmp={}
				,	leveIds={}
				;
				
				$G.Each(function(){
					var selectId=this+'';
					var leveList=getCodeLeve(selectId);
					for(var i=0;i<leveList.ls;i++){
						var tmpId=leveList.id[i]
						;
						if(!leveIds[tmpId])
							leveIds[tmpId]=selectId==tmpId?true:false;
						//$G.log('selectId:'+selectId+' |tmpId:'+tmpId+' |leveIds:'+leveIds[tmpId]);
					}
					selectListTmp[selectId]=true;
				},id.split(","));
				//处理顶级是否被选种
				
				$G('#label'+id.replace(/,/ig,' #label')).setAtt('class',checkbokCss[0]);
				return;
				var selectPidGOBJ=$G('#label'+pid)
				;
				if(leveIds[pid]){
					labelClick.call(selectPidGOBJ[0]);
				}else{
					selectPidGOBJ.setAtt('class',checkbokCss[1]);
					for(var k in leveIds){
						var styleCss=leveIds[k]?checkbokCss[0]:checkbokCss[1]
						;
						$G('#label'+k).setAtt('class',styleCss);
						if(leveIds[k]){
							echoHtml.call($G('#openlist_'+k,diseaseList[0])[0],k);
						}
					}
				}
				selectList=selectListTmp;
				
			});
		}
	};
}();