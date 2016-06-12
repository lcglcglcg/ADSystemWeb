window.keshiFn=function(keshiId){
	keshiId=keshiId||'select_keshi';
	var keshiClass=window.keshiClass||'word1';
	var isLoad=false
	,	leve_1_list={}
	,	keShiCode={}
	,	keShiLeve2={}
	,	get=function(fn){
			window.ajax({
				path:'GET_DISEASE_CODE'
			,	type:"get"
			,	calback:function(j){
					fn(j);
					isLoad=true;
				}
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
	,	diseaseList=$G('#'+keshiId)
	,	selectList={}
	,	diseaseLeveEach_1=$G('.diseaseLeveEach_1',diseaseList[0])
	,	diseaseLeve_1=$G('.diseaseLeve_1',diseaseList[0])
	,	diseaseSelectAll=$G('.diseaseSelectAll',diseaseList[0])
	,	diseaseSelectDifferent=$G('.diseaseSelectDifferent',diseaseList[0])
	,	checkbokCss={
			0:'checkboxOn'
		,	1:'checkboxOff'
		,	2:'checkboxcurr'
		}
	,	level_1_html='<li><a class="d_level1"> <span id="openlist_{code}" onclick="window.keshi.getlist.call(this,\'{code}\');" class="gather"></span> <span class="d_input"><input name="titleCheckbox" type="checkbox" id="checkbox{code}" type="checkbox" value="{code}" ><label name="categoryId0" id="label{code}" class="'+checkbokCss[2]+'" for="checkbox{code}" ></label></span> <span class="'+keshiClass+'"><b name="title">{title}</b></span> <span class="span_line"></span></a><ul id="{code}" style="display:none;"></ul></li>'
	,	level_2_html='<li><a class="d_level2_new"> <span class="d_input" ><input name="titleCheckbox" id="checkbox{code}" type="checkbox" value="{code}" class="depart_input1" /><label name="categoryId1" id="label{code}" class="'+checkbokCss[2]+'" for="checkbox{code}" ></label></span> <span class="'+(keshiClass=='word1'?'word1_02':'word3_01')+'"><b name="title">{title}</b></span> </a><ul id="{code}" style="display:none;"></ul></li>'
	,	getLevelHtml={
			'1':level_1_html
		,	'2':level_2_html
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
			,	listObj=$G('label',obj[0].parentNode.parentNode)
			;
			if(cssName==checkbokCss[0]){
				obj.setAtt('class',checkbokCss[2]);
				listObj.setAtt('class',checkbokCss[2]);
			}else{
				obj.setAtt('class',checkbokCss[0]);
				listObj.setAtt('class',checkbokCss[0]);
			}
			delete selectList[id.replace(/label/,'')];
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
					if(l>2)return;
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
			//$G.log(html_1);
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
		if(name=='titleCheckbox' || cssName==keshiClass){
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
			,	codeObj=getCodeLeve(t,id)
			,	leve=codeObj.ls
			;
			if(leve==1){
				leve_1_list[id]=t;
				diseaseLeve_1.addsel(id,t);
			}
			if(leve>2){
				if(!keShiLeve2[codeObj.id[1]])keShiLeve2[codeObj.id[1]]=new Array();
				keShiLeve2[codeObj.id[1]].push(t);
				//$G.log(codeObj.id[1]+':'+t);
			}
			keShiCode[t]=id;
			//$G.log(t+':'+id);
		},JSON);
		//初始化显示科室对象
		if(window.viewkeshiFn)window.viewkeshi=window.viewkeshiFn(keShiCode);
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
		isLoad = true;
	});
	
	
	return {
		getlist:getlist
	,	openList:openList
	,	code:keShiCode
	,	clear:function(){
			$G('label',diseaseList[0]).setAtt('class',checkbokCss[2]);
		}
	,	getid:function(){
			var id=new Array()
			,	label=$G('label',diseaseLeveEach_1[0])
			;
			label.Each(function(){
				var leveCss=$G(this).getAtt('class')
				,	code=this.id.replace(/label/,'')
				,	name=$G(this).getAtt('name')
				;
				
				if(leveCss==checkbokCss[0]){
					id.push(code);
					if(name=='categoryId1'){
						var leveCodeList=keShiLeve2[code]||new Array()
						;
						for(var i=0,n=leveCodeList.length;i<n;i++){
							id.push(leveCodeList[i]);
							//$G.log(leveCodeList[i]);
						}
					}
				}
			});
			return id?id.join(',').replace(/label/ig,''):'';
		}
	,	setAll:function(){
			if(isLoad){
				var addLeveFn=function(data,setHTMl){
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
				var strHtml='';
				for(var m in leve_1_list){
					strHtml+=level_1_html.replace(/{code}/ig,leve_1_list[m]).replace(/{title}/,m);
				}
				diseaseLeveEach_1[0].innerHTML=strHtml;
				for(var m in leve_1_list){
					var value=leve_1_list[m];
					setFn(addLeveFn.call($G('#'+value,diseaseList[0]),jsonList['leve2'][value],level_2_html),1);
				}
			}
		}
	,	setid:function(id){
			if(isLoad===false){
				setTimeout(arguments.callee, 0);
				return;
			}
			$G('label',diseaseList[0]).setAtt('class',checkbokCss[2]);
			id=$G.Trim(id||'');
			$G('#label'+id.replace(/,/ig," #label")).Each(function(){
				$G(this).setAtt('class',checkbokCss[0]);
			});
		}
	};
};
window.keshi=window.keshiFn();