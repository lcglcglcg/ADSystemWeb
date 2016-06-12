// JavaScript Document
//投放页面左边导航的伸缩
var pageName="";
	function right()
	 {
		 document.getElementById("change_width").className="c_right_new";
		 document.getElementById("left_hid").style.display="";
		 document.getElementById("left_dis").style.display="none";
		 document.getElementById("lf_nav").style.display="none";
	 }
	 function left()
	 {
		 document.getElementById("change_width").className="c_right";
		 document.getElementById("left_hid").style.display="none";
		 document.getElementById("left_dis").style.display="";
		 document.getElementById("lf_nav").style.display="";
	 }
	
//选项卡
	function clickqie(x,titleid,contid,color,t){
		for(n=1;n<=t;n++){
			if(x==n){
		document.getElementById(titleid+n).className=color;
		document.getElementById(contid+n).style.display="block";
				}else{
		document.getElementById(titleid+n).className="";
		document.getElementById(contid+n).style.display="none";
}
		}
		}

//媒体选择频道选项卡
	function over_qie(x,steptitleid,stepcontid,color){
		document.getElementById(steptitleid+x).className=color;
		document.getElementById(stepcontid+x).style.display="block";
	}
	function out_qie(y,steptitleid,stepcontid,color){
		document.getElementById(steptitleid+y).className="";
		document.getElementById(stepcontid+y).style.display="none";
		}

//同一按钮点击隐藏和显示div
	function div_show_hidden(str){
		var obj=document.getElementById(str);
		obj.style.dispaly=(boj.style.display == 'none')?'':'none';
		}



/* 当前页导航显示*/			
	function nav_hover(n,t){
		if(t>1){
		curr_page=t;
		}
		document.getElementById('nav1').className="";
		document.getElementById('nav'+n).className="on";
		}


/* 小灯泡开始*/			
	function arrow_hover(){
		document.getElementById('idDiv_buyi').style.display="block";
		}
	function arrow_no_hover(){
		document.getElementById('idDiv_buyi').style.display="none";
		}
/* 小灯泡结束*/	

/* 定向搜索行为小灯泡开始*/			
	function arrow_hover1(){
		document.getElementById('idDiv_buy1').style.display="block";
		}
	function arrow_no_hover1(){
		document.getElementById('idDiv_buy1').style.display="none";
		}
/* 定向搜索行为小灯泡结束*/	

		
// 控制ul的背景-鼠标经过显示
function ul_show(m,ul_hoverid){
	document.getElementById(ul_hoverid+m).className="hover_bg";
}
function ul_hidden(m,ul_hoverid){
	document.getElementById(ul_hoverid+m).className="";
}

// 新建创意
function createCY(){
	if(pageName=='admin_cpc'){
		$UE.open('click_step3');
		$UE.setValue('c_step3_name','新建创意');
		$UE.display('new_btn3','block');
		$UE.display('new_u_btn3','none');
	}
	else if (pageName=='admin_cpm'){
		$UE.open('step_three');
		$UE.setValue('step3_name','新建创意');
		$UE.display('step_addtitle3','block');
	}
}

// 点击和展现的精准定向
function createDX(){
	if(pageName=='admin_cpc'){
		$UE.open('step_second');
		$UE.setValue('step2_name','新建推广组');
		$UE.display('step_addtitle2','block');
		$UE.display('new_bnt2','block');
		$UE.display('update_bnt2','none');
		$UE.display('step2_dingx1','block');
		$UE.display('step2_dingx2','none');
		$UE.display('step2_dingx3','none');
		
		$UE.display('click_dingx','block');
		$UE.display('show_dingx','none');

		$UE.display('zu_pay1','block');
		$UE.display('zu_pay2','none');

		$UE.display('zu_pay_pipei','none');
		
		$UE.display('contf3','none');
		$UE.display('contf4','none');
	}
	else if (pageName=='admin_cpm'){
		$UE.open('step_second');
		$UE.setValue('step2_name','新建推广组');
		$UE.display('step_addtitle2','block');
		$UE.display('new_bnt2','block');
		$UE.display('update_bnt2','none');
		$UE.display('step2_dingx1','block');
		$UE.display('step2_dingx2','none');
		$UE.display('step2_dingx3','none');
		
		$UE.display('click_dingx','block');
		$UE.display('show_dingx','none');

		$UE.display('zu_pay2','block');
		$UE.display('zu_pay1','none');

		$UE.display('zu_pay_pipei','none');

		$UE.display('contf3','none');
		$UE.display('contf4','none');
	}
}


// 兼容IE FF的ByName方法
var getElementsByName = function(tag, name){
    var returns = document.getElementsByName(name);
    if(returns.length > 0) return returns;
    returns = new Array();
    var e = document.getElementsByTagName(tag);
    for(var i = 0; i < e.length; i++){
        if(e[i].getAttribute("name") == name){
            returns[returns.length] = e[i];
        }
    }
    return returns;
}

// 设置显示CPC或CPM
function changeViewCPType(){
	var cpTypeArray = getElementsByName('span','cpType');

	for(var i = 0; i < cpTypeArray.length; i++){
		var tempObj = cpTypeArray[i];
		if(pageName=='admin_cpc') tempObj.innerHTML = '单次点击';
		else tempObj.innerHTML = '单次展现';
	}
}

