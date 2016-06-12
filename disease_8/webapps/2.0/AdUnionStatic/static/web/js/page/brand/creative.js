var upflieFn=function(ini){
	ini=ini||{};
	var imgIdArray={
			'upIdeas_0':'IMG0_ID'
		,	'upIdeas_1':'IMG1_ID'
		,	'upIdeas_2':'IMG2_ID'
		,	'upIdeas_3':'IMG3_ID'
		,	'upIdeas_4':'IMG4_ID'
		,	'upIdeas_5':'IMG5_ID'
		}
	,	imgDom=$G('.'+imgIdArray[ini.upid])
	,	dom=$G('#'+ini.upid+'_src')
	;
	return $G.upflie({
		success:function(file, serverData){
			var JSON=$G.parseJSON(serverData)
			,	isUpTrue=window.wm.msg(JSON.CODE,true)
			;
			if(ini.upid=='upIdeas_0' && JSON.CREATIVE_IMG_SIZE!='170X140'){
				$G('#'+ini.upid+'_msg').html('<span class="step1_rg1 step1_rg2 red"><img src="/static/ads_c_2.0/web/images/false.png" width="16" height="16" class="img_false"/>图片格式不正确！</span>');
				return;
			}else if(ini.upid=='upIdeas_0' && JSON.CREATIVE_IMG_SIZE=='170X140'){
				$G('#'+ini.upid+'_msg').html('<span class="step1_rg1 step1_rg2 green"><img src="/static/ads_c_2.0/web/images/true.png" width="16" height="16" class="img_false"/>图片已上传！</span>');
			}
			if(ini.upid!='upIdeas_0' && JSON.CREATIVE_IMG_SIZE!='120X90'){
				$G('#'+ini.upid+'_msg').html('<span class="step1_rg1 step1_rg2 red"><img src="/static/ads_c_2.0/web/images/false.png" width="16" height="16" class="img_false"/>图片格式不正确！</span>');
				return;
			}else if(ini.upid!='upIdeas_0' && JSON.CREATIVE_IMG_SIZE=='120X90'){
				$G('#'+ini.upid+'_msg').html('<span class="step1_rg1 step1_rg2 green"><img src="/static/ads_c_2.0/web/images/true.png" width="16" height="16" class="img_false"/>图片已上传！</span>');
			}
			$G('.'+ini.upid+'_src',demo[0])[0].src=dom[0].value=window.wm.path.pic.url+JSON.CREATIVE_FILE_PATH;
			imgDom[0].value=JSON.CREATIVE_IMG_ID;
			
		}
	,	file_queue_error_handler:function(file, errorCode, message){
			var msg=message;
			if(errorCode=='-100') msg='当前还可以上传'+message+'张图片';
			else if(errorCode=='-110') msg='您上传的图片大小，不能超过55KB';
			else alert(errorCode+'='+message);
			window.msg.call(dom[0],{msg:msg});
		}
	,	upload_start_handler:function(file){
			return true;
		}
	,	queued_handler:function(){}
	,	file_dialog_complete_handler:function(numberSelected, numberQueued){
		
			this.startUpload();
		}
	,	upid:ini.upid
	,	pic_w:39
	,	pic_h:24
	,	types:"*.jpg;*.gif;*.swf"
	,	pic:'/static/ads_c_2.0/web/images/btn_shangc_small.jpg'
	,	url:ini.url
	})
}
;
var upflie0=upflieFn({upid:'upIdeas_0',url:window.wm.path.up});
var upflie1=upflieFn({upid:'upIdeas_1',url:window.wm.path.up});
var upflie2=upflieFn({upid:'upIdeas_2',url:window.wm.path.up});
var upflie3=upflieFn({upid:'upIdeas_3',url:window.wm.path.up});
var upflie4=upflieFn({upid:'upIdeas_4',url:window.wm.path.up});
var upflie5=upflieFn({upid:'upIdeas_5',url:window.wm.path.up});

var model=function(d,isTrue){
	var m={
			path:'SET_BRAND_CREATIVE'
		,	TITLE:''								//标题
		,	DESCRIPTION:''							//描述
		,	DESTINATION_URL:''							//访问URL
		,	DISPLAY_URL:''							//显示URL
		,	TELEPHONE:''								//电话
		,	WEB_SITE:''							//官方网址
		,	WEB_IM:''							//WEBIM
		,	GUAHAO_URL:''						//挂号
		,	IMG0_ID:''					
		,	IMG0_URL:''						
		,	IMG1_ID:''					
		,	IMG1_URL:''
		,	IMG2_ID:''					
		,	IMG2_URL:''
		,	IMG3_ID:''					
		,	IMG3_URL:''
		,	IMG4_ID:''					
		,	IMG4_URL:''
		,	IMG5_ID:''					
		,	IMG5_URL:''		
		,	ACCOUNT_ID:window.wm.data['user']['ACCOUNT_ID']  
		}
	,	updateCode='TITLE,DESCRIPTION,DESTINATION_URL,DISPLAY_URL,TELEPHONE,WEB_SITE,WEB_IM,GUAHAO_URL,IMG0_ID,IMG0_URL,IMG1_ID,IMG1_URL,IMG2_ID,IMG2_URL,IMG3_ID,IMG3_URL,IMG4_ID,IMG4_URL,IMG5_ID,IMG5_URL'.split(',')
	;
	
	if(!d['CREATIVE_STATE']||d['CREATIVE_STATE']==4){
		m['path']='ADD_BRAND_CREATIVE';
		
	}else if(isTrue){
		var json=brandListData[d['BRAND_ID']]
		;
		if(json){
			$G.Each(function(){
				var key=this+'';
				if(d[key]==json[key] && key!='WEB_IM' && key!='GUAHAO_URL'){
					delete d[key];
				}
			},updateCode);
			m['path']='SET_BRAND_CREATIVE';
			var stepVal=1
			,	updateType=''
			;
			$G.Each(function(){
				if(!$G.isNaN(d[this+'']) || this=='WEB_IM' || this=='GUAHAO_URL'){
					updateType=Number(updateType||0)+Number(stepVal);
				}
				stepVal=stepVal*2;
			},updateCode);
			m.UPDATE_TYPE=updateType;
		}
	}
	
	$G.Each(function(i,k){
		m[k]=this+'';
	},d);
	return m;
};
//数据提交
var set_creative=$G('#set_creative')
,	addCreative=$G('#addCreative')
,	BRAND_ID=$G('.BRAND_ID',addCreative[0])
;
window.subAjax('#addCreative',{
	sub:'.sub'
,	path:'SET_BRAND_CREATIVE'
,	findDom:addCreative[0]
,	ckdata:function(data){
		data['CREATIVE_STATE']=$G(".CREATIVE_STATE",$G('#addCreative')[0]).val();
		data['BRAND_CREATIVE_ID']=$G(".BRAND_CREATIVE_ID",$G('#addCreative')[0]).val();
		for(var i=0,n=6;i<n;i++){
			if(data['IMG'+i+'_ID']=='0'){
				delete  data['IMG'+i+'_ID'];
			}
			if(data['CREATIVE_STATE']==4){
				if(!data['IMG'+i+'_ID']){
					window.msg.call($G('#upIdeas_'+i+'_src',addCreative[0])[0],{msg:'图片不能为空'});
					return;
				}
			}
		}
		
		if(data['WEB_IM']=='不设置默认取账户中设置的咨询链接'){
			data['WEB_IM']='';
		}
		if(data['GUAHAO_URL']=='不设置默认取账户中设置的预约挂号链接'){
			data['GUAHAO_URL']='';
		}
		
		for (var a in data) {
			if (a == "DESTINATION_URL" || a == "WEB_SITE" || a == "IMG0_URL" || a == "IMG1_URL" ||
					a == "IMG2_URL" || a == "IMG3_URL" || a == "IMG4_URL" || a == "IMG5_URL") {
				
				if (data[a].length <= 0 && a != "DESTINATION_URL" && a != "WEB_SITE" ) {
					data[a] = data["DESTINATION_URL"];
				}
				
				if (!ckDoman(data[a])) {
					alert("链接不符合标准需与主域名相符合！");
					return false;
				}
				
				if (!(/[a-zA-z]+:\/\/[^\\s]*/.test(data[a]))) {
					alert("网址请符合规范，如：http://www.example.com/");
					return false;
				}
			}
		}
		return model(data,true);
	}
,	callback:function(JSON){
		if(window.wm.msg(JSON.CODE,false)){
			window.brandCreative.close();
			 window.location = "/brand/index.shtml";
		}
	}
});

var demo=$G('#demo');
$G('input textarea',addCreative[0]).change(function(){
	var name=this.name
	,	id=this.id
	;
	if(name=='TITLE'){
		$G('.'+name,demo[0]).html(this.value);
	}else if(name=='DESCRIPTION'){
		$G('.'+name,demo[0]).html(this.value+'<a name="DESTINATION_URL" href="'+$G('.DESTINATION_URL',demo[0]).val()+'" target="_blank">更多</a>');
	}else if(name=='DESTINATION_URL'){
		$G('.'+name+' .TITLE .WEB_SITE .TELEPHONE',demo[0])[0].href='http://'+(this.value.replace(/(http:\/\/)/ig,""));
	}else if(name=='WEB_IM' || name=='GUAHAO_URL'){
		$G('.'+name,demo[0])[0].href='http://'+(this.value.replace(/(http:\/\/)/ig,""));
	}else if(name=='TELEPHONE'){
		$G('.'+name,demo[0])[0].href='http://'+(this.value.replace(/(http:\/\/)/ig,""));
	}else if(name=='WEB_SITE'){
		$G('.'+name,demo[0])[0].href='http://'+(this.value.replace(/(http:\/\/)/ig,""));
	}else if(id=='upIdeas_0_src' || id=='upIdeas_1_src' || id=='upIdeas_2_src' || id=='upIdeas_3_src' || id=='upIdeas_4_src' || id=='upIdeas_5_src'){
		$G('.'+id,demo[0])[0].src=this.value;
	}else if(name=='IMG0_URL' || name=='IMG1_URL' || name=='IMG2_URL' || name=='IMG3_URL' || name=='IMG4_URL' || name=='IMG5_URL'){
		$G('.'+name,demo[0])[0].href='http://'+(this.value.replace(/(http:\/\/)/ig,""));
	}
});
var demoFn=function(JSON){
	if(!JSON.CREATIVE_STATE)return;
	$G('.TITLE',demo[0]).html(JSON.TITLE);
	$G('.TITLE',demo[0])[0].href= 'http://'+JSON.DESTINATION_URL.replace(/(http:\/\/)/ig,"");
	$G('.DESCRIPTION',demo[0]).html(JSON.DESCRIPTION+'<a name="DESTINATION_URL" href="'+JSON.DESTINATION_URL+'" target="_blank">更多</a>');
	$G('.WEB_IM',demo[0])[0].href='http://'+(JSON.WEB_IM.replace(/(http:\/\/)/ig,""));
	// 挂号链接 没有的话就隐藏
	//if(JSON.GUAHAO_URL.length){$G('.GUAHAO_URL',demo[0])[0].href='http://'+(JSON.GUAHAO_URL.replace(/(http:\/\/)/ig,""));}
	//else{$G('.GUAHAO_URL',demo[0]).none();}
	// 在线咨询 没有的话就隐藏
	if(JSON.WEB_IM.length){$G('.WEB_IM',demo[0])[0].href='http://'+(JSON.WEB_IM.replace(/(http:\/\/)/ig,""));}
	else{$G('.WEB_IM',demo[0]).none();}
	
	$G('.WEB_SITE',demo[0]).html('http://'+(JSON.WEB_SITE.replace(/(http:\/\/)/ig,"")));
	$G('.DESTINATION_URL .TITLE .WEB_SITE',demo[0])[0].href='http://'+(JSON.DESTINATION_URL.replace(/(http:\/\/)/ig,""));
	$G('.TELEPHONE',demo[0]).html(JSON.TELEPHONE);
	
	// 补充 web_site 的url
	$G('.WEB_SITE',demo[0])[0].href = 'http://'+(JSON.DESTINATION_URL.replace(/(http:\/\/)/ig,""));
	
	for(var i=0,n=6;i<n;i++){
		$G('.upIdeas_'+JSON.BRAND_CREATIVE[i]['SEQUENCE']+'_src',demo[0])[0].src=window.wm.path.pic.url+JSON.BRAND_CREATIVE[i]['IMG_PATH'];
		$G('.IMG'+JSON.BRAND_CREATIVE[i]['SEQUENCE']+'_URL',demo[0])[0].href='http://'+(JSON.BRAND_CREATIVE[i]['IMG_URL'].replace(/(http:\/\/)/ig,""));
	}
};
$G('#brand_btn1').click(function(){
	if(!BRAND_ID[0].value)return;
	window.ajax({
		path:'GET_BRAND_CREATIVE'
	,	data:{
			BRAND_ID:BRAND_ID[0].value
		,	MOD_STATUS:2
		}
	,	calback:function(JSON){
			demoFn(JSON);
		}
	});
});

// 主域名校验
function ckDoman(value) {
	var companyDoman = window.wm.data['user']['DOMAIN'], domanUrlArray = companyDoman.split(","), isRetUrn = false, domanUrlData = $G.findDoman(value);
	for (var m = 0, n = domanUrlArray.length; m < n; m++) {
		var companySite = $G.findDoman(domanUrlArray[m]), companyUrl = companySite.url, companyType = companySite.type;
		if (domanUrlData.url == companyUrl && domanUrlData.type == companyType) {
			isRetUrn = true;
			break;
		}
	}
	return isRetUrn;
}