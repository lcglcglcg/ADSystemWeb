window.keywordFn=function(o){
	var keywordsList=$G('#'+o.id)[0]
	,	keywordConut=$G('.keywordConut',keywordsList)
	,	textarea=$G('textarea',keywordsList)
	,	keywordListDiv=$G('.keywordListDiv',keywordsList)
	,	listArray={}
	,	setUpData=function(data){
			if(data.length>0){
				var rTm=textarea[0].value?'\n':'';
				textarea[0].value+=rTm+data.join('\n');
			}
		}
	,	htmlNum='<div class="rg_num" >\
					<div>\
					  <div class="rg_level"><span class="rg_level_tt1">{keyword}</span><a onclick="window.delKeywordList(this,\''+o.id+'\');" class="delete" style="display:none;"></a></div>\
					</div>\
				  </div>'
	,	cklist=function(){
			var v=this.value.replace(/[\r|\n]{2,}/ig,"\r\n")
			,	ckv=function(list){
					var str=''
					,	repv=0
					,	code=0
					,	i=1
					,	errI=0
					,	smap={}
					,	subList=new Array()
					,	selectN=keywordConut[0].innerHTML||0
					;
					if(list.length<(1001-Number(selectN))){
						for(var n=list.length;i<=n;i++){
							var ol=$G.TrimTest(list[i-1]+'').replace(/[\r|\n]/ig,"");
							if($G.len(ol)>40 || $G.isNaN(ol)){
								str=ol;
								code=1;
								errI++;
								//break;
							}else if(smap[ol]>0){
								str=ol;
								code=2;
								errI++;
								repv=smap[ol];
								//break;
							}else if(listArray[ol]){
								str=ol;
								code=3;
								errI++;
								repv=smap[ol];
								//break;
							}else{
								smap[ol]=i;
								subList.push(ol);
							}
						}
					}else{
						code=1000;
					}
					return {
						i:i
					,	er:str
					,	rep:repv
					,	code:code
					,	errI:errI
					,	list:subList
					};
				}
			;
			if($G.isNaN(v))return false;
			var vl=v.split("\n")
			,	er=ckv(vl)
			,	ckMsg='添加成功'
			;
			if(er.code==1000){
				ckMsg='关键词个数最多不超过1000个'
			}if(er.errI>0){
				ckMsg=(er.list.length>0?'添加成功！':'添加不成功！')+'忽略'+er.errI+'个不合法的关键词！';
			}
			
			window.altBox.show({
				title:'提示信息'
			,	msg:ckMsg
			});
			return er.list;
			/*if(er.code>0){
				var msg='';
				if(er.code<1000){
					msg=er.rep>0?'您的第'+er.i+'行关键词与第'+er.rep+'关键词重复.':'您的第'+er.i+'行关键词输入错误，请您输入1到40个字符长度的关键词.';
					msg+='错误关键词：'+er.er;
				}else{
					msg='关键词个数最多不超过1000个';
				}
				document.location.hash='keywordMsg';
				window.msg.call($G('div:lf_zhushi',keywordsList)[0],{msg:msg});
				return false;
			}else return vl;*/
		}
	,	add=function(list){
			var i=0
			,	str=''
			,	rs=new Array()
			,	s=''
			;
			textarea[0].value='\n'+textarea[0].value+'\n';
			for(var n=list.length;i<n;i++){
				s=list[i].replace(new RegExp("[\r|\n]", "g"),'');
				if(!listArray[s]){
					listArray[s]=true;
					str+=htmlNum.replace(/{keyword}/ig,s);
					textarea[0].value=textarea[0].value.replace(new RegExp("([\r|\n])"+s+"([\r|\n])", "g"),'\n\n');
				}else{
					rs.push(s);
				}
			}
			textarea[0].value=textarea[0].value.replace(/(^[\r|\n]*)|([\r|\n]*$)/ig,'').replace(/([\r|\n]){2,}/ig,'\n');
			keywordListDiv[0].innerHTML+=str;
			
			$G('div:rg_num',keywordListDiv[0]).bd({on:'mouseover',callback:function(){
				$G('a:delete',this)[0].style.display='';
				
			}}).bd({on:'mouseout',callback:function(){
				$G('a:delete',this)[0].style.display='none';
			}});
			$G('a:delete',keywordListDiv[0]).bd({on:'mouseover',callback:function(){
				this.style.display='';
				
			}}).bd({on:'mouseout',callback:function(){
				this.style.display='none';
			}});
			
			var ci=0;
			for(var k in listArray){
				ci++;
			}
			keywordConut[0].innerHTML=ci;
			
			return rs;
		}
	;
	
	var reset=function(){
		keywordListDiv[0].innerHTML='';
		listArray={};
		keywordConut[0].innerHTML='0';
	};
	//textarea.change(cklist);
	$G('.delWrite .delSelect .addWriteAll',keywordsList).click(function(){
		var obj=$G(this)
		,	name=this.name
		;
		if(name=='delWrite'){
			textarea[0].value='';
		}else if(name=='delSelect'){
			reset();
		}else if(name=='addWriteAll'){
			var vl=cklist.call(textarea[0]);
			if(vl!==false){
				add(vl);
			}
		}
	});
	
	/*$G('.addWriteAll').click(function(){
		
	});*/
	
	window.delKeywordList=function(delObj,id){
		var obj=delObj.parentNode
		,	keywordConut=$G('.keywordConut',$G('#'+id)[0])
		;
		obj.style.display='none';
		delete listArray[$G('span:rg_level_tt1',obj)[0].innerHTML];
		var n=keywordConut[0].innerHTML;
		keywordConut[0].innerHTML=(Number(n)-1);
	};
	var get=function(){
		var v=new Array();
		for(var k in listArray){
			v.push(k);
		}
		if(v.length>1000){
			window.msg.call($G('div:lf_zhushi',keywordsList)[0],{msg:'关键词个数最多不超过1000个'});
			v=new Array();
		}
		return v.join(',');
	};
	var upKeyword_MSG=$G('.upKeyword_MSG',keywordsList);
	var upflie=$G.upflie({
		success:function(file, serverData){
			var data=$G.parseJSON(serverData);
			if(data.length>0)setUpData(data);
			else window.ckmsg.call(upKeyword_MSG[0],data.code,'keywords');
		}
	,	file_dialog_start_handler:function(){
		}
	,	upload_start_handler:function(file){
			var type=file.type;
			type=type.replace(/./,'')||'';
			upflie.setPostParams({
				fileFormat:type
			});
		}
	,	file_dialog_complete_handler:function(numberSelected, numberQueued){
			upflie.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILE);
			upflie.startUpload();
		}
	,	file_queue_error_handler:function(file, errorCode, message){
			window.ckmsg.call(upKeyword_MSG[0],errorCode,'keywords');
		}
	,	queued_handler:function(){}
	,	file_post_name:'file'
	,	upid:o.upKeyword
	,	types:"*.txt;*.csv"
	,	pic:'/static/ads_c_2.0/web/images/btn_daoru.jpg'
	,	url:'/upload/?server=%7B%22PACKET_TYPE%22%3A%22UPLOAD%22%7D&notcache=1390376964199'
	});
	
	return {
		set:function(ids){
			textarea[0].value='';
			if(ids)
				add(ids.split(","));
			else{
				listArray={};
				keywordListDiv[0].innerHTML='';
				keywordConut[0].innerHTML='0';
			}
		}
	,	get:get
	,	reset:reset
	,	setUpData:setUpData
	}
};
window.headerEnd(
function(){
	var d={};
	d['id']='keywordsList';
	d['upKeyword']='upKeyword';
	window.keyword=window.keywordFn(d);
	
	var d={};
	d['id']='add_keyword';
	d['upKeyword']='upAddKeyword';
	window.keyWdAdd=window.keywordFn(d);
});