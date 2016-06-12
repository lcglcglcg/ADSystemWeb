// JavaScript Document

// 复选框checkbox 层级别
	function chedb(obj){
		if(obj.checked==true){
			document.getElementById("chediv1").style.display="block"
			}
			else{
				document.getElementById("chediv1").style.display="none";
				}
		}
//公用的radio显示子Div的方式
	function radio_common(obj){
		var groupName=$(obj).attr("name");
		$('input[name='+groupName+']').each(function(){
			var value =this.value;
	 		if ($(obj).val() == value){
				if($("#" + groupName + value).length > 0){
					$("#" + groupName + value).show();
				}
			}
			else{
				if($("#" + groupName + value).length > 0){
					$("#" + groupName + value).hide();
				}	
			}

		});
		
	}

// select 层级别
	function changeToggle(selectorId,pre){
		$("#"+ selectorId +"option").each(function(){
			var value=$(this).val();
			if($("#"+selectorId).val()==value)
				{$("#"+ pre + value).show;}
			else
				{$("#"+ pre + value).hide;}
		});
		}


// 控制ul的背景-鼠标经过显示
function ol_show(m,ol_hoverid,hover_color){
	document.getElementById(ol_hoverid+m).className="ol_hover_bg";
}

// 控制ul的背景-鼠标离开隐蔽
function ol_hidden(n,ol_hoverid){
	document.getElementById(ol_hoverid+n).className="";
}


// 控制ul的背景，鼠标滑过有向右导入箭头
  function stepBg(i,res_chid){
	 document.getElementById(res_chid+i).className="res_ch"; 
  }
  function stepNoBg(j,res_chid){
	 document.getElementById(res_chid+j).className=""; 
  } 

// 控制ul的背景，鼠标滑过有删除的叉号
  function steprg_Bg(i,resrg_chid){
	 document.getElementById(resrg_chid+i).className="resrg_ch"; 
  }
  function steprg_NoBg(j,resrg_chid){
	 document.getElementById(resrg_chid+j).className=""; 
  } 


// 控制ul的背景，鼠标滑过有删除的叉号-----------树形结构图
  function stepshu_Bg(i,resshu_chid,shu_btnid){
	 document.getElementById(shu_btnid+i).style.display="block"; 
  }
  function stepshu_NoBg(j,resshu_chid,shu_btnid){
	 document.getElementById(shu_btnid+j).style.display=""; 
  } 


  function idBghover(i,key_chid){

	 document.getElementById("quanxuan"+i).style.display="block"; 
  }
  function idNoBghover(i,key_chid){

	 document.getElementById("quanxuan"+i).style.display="none"; 
  } 
// 控制树形结构图
	function toggle(handler, content, gatherStyle, spreadStyle) {
		if (document.getElementById(content).style.display == "none") {
			document.getElementById(content).style.display = "";
			document.getElementById(handler).className = spreadStyle;
		} else {
			document.getElementById(content).style.display = "none";
			document.getElementById(handler).className = gatherStyle;
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


