window.viewkeshiFn=function(code){
	var keshiId='view_keshi';
	var keshiClass=window.keshiClass||'word1';
	var leve_1_list={}
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
	,	level_1_html='<li><a class="d_level1"> <span id="view_openlist_{code}" onclick="window.viewkeshi.getlist.call(this,\'{code}\');" class="spread"></span> <span class="d_input"><input name="titleCheckbox" type="checkbox" id="view_checkbox{code}" type="checkbox" value="{code}" ><label name="categoryId0" id="view_label{code}" class="'+checkbokCss[2]+'" for="view_checkbox{code}" ></label></span> <span class="'+keshiClass+'"><b name="title">{title}</b></span> <span class="span_line"></span></a><ul id="view_list_{code}" style="display:;"></ul></li>'
	,	level_2_html='<li><a class="d_level2_new"> <span class="d_input" ><input name="titleCheckbox" id="view_checkbox{code}" type="checkbox" value="{code}" class="depart_input1" /><label name="categoryId1" id="view_label{code}" class="'+checkbokCss[2]+'" for="view_checkbox{code}" ></label></span> <span class="'+(keshiClass=='word1'?'word1_02':'word3_01')+'"><b name="title">{title}</b></span> </a><ul id="view_List_{code}" style="display:none;"></ul></li>'
	,	getLevelHtml={
			'1':level_1_html
		,	'2':level_2_html
		}
	;
	var	getlist=function(id){
			openList.call(this,id,true);
		}
	,	openList=function(id,leve2){
			var obj=$G('#view_list_'+id,diseaseList[0])
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
			var pids=getCodeLeve(id.replace(/view_label/,''))
			,	ls=pids.ls
			;
			for(var i=ls;i>0;i--){
				var tpd=$G('#view_list_'+pids.id[i-2])
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
				var pGObj=$G('#view_label'+pids.id[i-2],diseaseList[0]);
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
			delete selectList[id.replace(/view_label/,'')];
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
			//labelClick.call(pObj[0]);
		}
	});
	
	return {
		getlist:getlist
	,	openList:openList
	,	clear:function(){
			$G('label',diseaseList[0]).setAtt('class',checkbokCss[2]);
		}
	,	show:function(ids){
			if(!ids)return;
			var codeList=ids.split(",");
			diseaseLeveEach_1[0].innerHTML='加载中...';
			var listCode={};
			leve_1_list={};
			jsonList={
				'leve1':{}
			,	'leve2':{}
			,	'leve3':{}
			}
			$G.Each(function(i,t){
				var id=this+''
				,	codeObj=getCodeLeve(id,code[id])
				,	leve=codeObj.ls
				;
				if(leve>2)return;
				if(leve==1){
					leve_1_list[code[id]]=id;
				}else if(leve==2){
					listCode[codeObj.id[0]]=code[codeObj.id[0]];
					leve_1_list[code[codeObj.id[0]]]=codeObj.id[0]
				}
				listCode[id]=code[id];
			},codeList);
			
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
						setFn(addLeveFn.call($G('#view_list_'+code,diseaseList[0]),jsonNext[code],getLevelHtml[l]),(l+1));
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
				setFn(addLeveFn.call($G('#view_list_'+value,diseaseList[0]),jsonList['leve2'][value],level_2_html),1);
			}
			$G('label',diseaseList[0]).setAtt('class',checkbokCss[1]);
			ids=$G.Trim(ids||'');
			$G('#view_label'+ids.replace(/,/ig," #view_label")).Each(function(){
				$G(this).setAtt('class',checkbokCss[0]);
			});
		}
	};
};