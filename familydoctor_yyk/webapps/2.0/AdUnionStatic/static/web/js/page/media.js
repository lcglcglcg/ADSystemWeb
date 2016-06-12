(function(){
	return;
	window.mediaMap={};
	window.channeMap={};
	window.media_onMouseOver=function(obj){
		var block2=$G('div:block2',obj)
		,	li_web_border=$G('.li_web_border',obj)
		;
		block2[0].style.display='';
		li_web_border.style({'class':'li_web_border1'});
	};
	window.media_onmouseout=function(obj){
		$G('div:block2',obj)[0].style.display='none';
		$G('.li_web_border',obj).style({'class':''});
	};
	window.mediaOnClick_0=function(){
		var sl=$G('input',$G('.mediaList')[0]).checked(true).length
		;
		if(sl>0)$G('.allMedia',$G('.meitidingxiang_type_ds')[0])[0].checked=true;
		else $G('.allMedia',$G('.meitidingxiang_type_ds')[0])[0].checked=false;
	};
	window.mediaOnClick_1=function(obj){
		var	isChecked=obj.checked
		;
		$G('input',$G('div:block2',obj.parentNode.parentNode.parentNode.parentNode)[0]).Each(function(){
			this.checked=isChecked;
		});
		window.channelCount(obj.parentNode.parentNode.parentNode.parentNode);
	};
	window.mediaOnClick_2=function(obj){
		window.channelCount(obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
	};
	window.channelCount=function(obj,v,sv){
		$G('div:block2',obj).Each(function(){
			var ov=$G('input',this)
			,	n=ov.length
			,	cn=sv||ov.checked(true).length||(v?n:0)
			,	pObj=$G('input:input_valign',this.parentNode)
			;
			pObj[0].checked=cn>0?true:false;
			if(cn==0 || cn==n){
				$G('span:zongshu',this.parentNode)[0].style.display='none';
			}else{
				$G('span:zongshu',this.parentNode).html(cn+'/'+n);
				$G('span:zongshu',this.parentNode)[0].style.display='';
			}
		});
		window.mediaOnClick_0();
	};
	var html='<ol class="row1" style="padding-left:20px;">\
				{media_1_List}\
			   </ol>'
	,	html_1='<li class="li_w144" style="width:144px;" onMouseOver="window.media_onMouseOver(this);"  onmouseout="window.media_onmouseout(this);">\
				  <div class="li_div">\
					<div name="li_web_border">\
					  <div class="hover_ceng_title" >\
						<label><input giveup type="checkbox" mediaParent={mediaParent} value="{media_1_value}" class="input_valign" />\
						<span>{media_1}</span></label><span class="zongshu"></span></div>\
					</div>\
					{media_2_Div}\
				  </div>\
				</li>'
	,	html_2_Div='<div class="block2" style="display:none;width:{width}px;">\
					  <div class="hover_ceng">\
						<ul>\
						  {media_2_list}\
						</ul>\
					  </div>\
					</div>'
	,	html_2_Obj='<li><label><input giveup mediaParent={mediaParent} value="{media_2_value}" type="checkbox" />{media_2}</label></li>'
	,	addMedia=function(json){
			for(var i=0,n=json.length;i<n;i++){
				var obj=json[i]
				;
				if($G.isNaN(window.mediaMap[obj.mediaId]))window.mediaMap[obj.mediaId]=new Array();
				if(obj.PChannelId!=obj.channelId && obj.PChannelId!='0'){
					window.mediaMap[obj.mediaId].push(obj);
					window.channeMap[obj.channelId]=obj;
				}
			}
			var media=window.mediaMap
			,	str=''
			,	row=''
			,	addChanne=function(j){
					var s=''
					,	lengthIni=0
					;
					for(var i=0,n=j.length;i<n;i++){
						var tj=j[i];
						var nameCnLength=$G.len(tj.channelName);
						if(nameCnLength>lengthIni)lengthIni=nameCnLength;
						s+=html_2_Obj.replace(/{media_2_title}/,tj.channelName).replace(/{media_2}/,tj.channelName).replace(/{media_2_value}/ig,tj.channelId).replace(/{mediaParent}/,1);
					}
					return html_2_Div.replace(/{media_2_list}/,s).replace(/{width}/,(160+lengthIni*6));
				}
			,	yn=1
			;
			for(var k in media){
				if(yn%5==0){
					str+=html.replace(/{media_1_List}/,row);
					row='';
					yn=1;
				}
				var tm=media[k];
				if(tm)
					row+=html_1.replace(/{mediaParent}/,0).replace(/{media_1_value}/ig,tm[0].mediaId).replace(/{media_1}/,$G.lenSub(tm[0].mediaName,11)).replace(/{media_1_title}/,tm[0].mediaName).replace(/{media_2_Div}/,addChanne(tm));
				yn++;
			}
			if(!$G.isNaN(row))str+=html.replace(/{media_1_List}/,row);
			var mediaList=$G('.mediaList')
			;
			mediaList.html(str);
			$G('input',mediaList[0]).click(function(){
				var tObj=$G(this)
				,	mediaParent=tObj.getAtt('mediaParent')
				;
				if(mediaParent=='0'){
					window.mediaOnClick_1(this);
				}else{
					window.mediaOnClick_2(this);
				}
			});
		}
	;
	$G('.allMedia',$G('.meitidingxiang_type_ds')[0]).click(function(){
		var isChecked=this.checked;
		$G('input',$G('.mediaList')[0]).Each(function(){
			this.checked=isChecked;
		});
		$G('span:zongshu',$G('.mediaList')[0]).Each(function(){
			this.style.display='none';
		});
	});
	window.ajax({
		load:true
	,	url:window.config.url.channel.list+'?query.rank=2&query.biddingModel='+window.biddingModel
	,	calback:function(json){
			if($G.isNaN(json))return;
			addMedia(json);
			//window.setChannel('67,85,59,60,61,62,63,64,65,66,124,125,126,127,128,129,130,131,132,133,134,77,136,137,83,138,84');
		}
	});
	window.setChannel=function(val){
		$G('input',$G('.mediaList')[0]).Each(function(){
			this.checked=false;
		});
		var parentId={}
		,	selector=''
		;
		val=$G.Trim(val||'');
		if(val){
			$G.Each(function(){
				selector+=' input:value:'+this;
				var objMedia='';
				try{
					objMedia=window.mediaMap[window.channeMap[this].mediaId];
				}catch(e){
					return;
				}
				if(!$G.isNaN(objMedia) && objMedia.length>0){
					parentId[objMedia[0].mediaId]=true;
				}
			},val.split(","));
		}
		var n=$G(selector,$G('.mediaList')[0]).Each(function(){
			this.checked=true;
		}).length;
		if(n>0)$G('.allMedia',$G('.meitidingxiang_type_ds')[0])[0].checked=true;
		else $G('.allMedia',$G('.meitidingxiang_type_ds')[0])[0].checked=false;
		
		$G('input:input_valign',$G('.mediaList')[0]).Each(function(){
			if(parentId[this.value])
				this.checked=true;
		})
		window.channelCount($G('.mediaList')[0]);
	};
	window.getChannel=function(){
		var obj=$G('input:mediaParent:1',$G('.mediaList')[0])
		,	n=obj.length
		,	cn=obj.checked(true)
		;
		if(n==cn)return 'ALL';
		return cn?cn.join(","):'';
	};
	
})();