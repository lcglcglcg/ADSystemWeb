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

