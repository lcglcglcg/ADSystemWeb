$G(function(){
var picFor=function(finddom,findobj,type){
	var bgPic=$G('a',findobj)
	,	box_bg=$G(finddom)
	,	picI=0
	,	picN=bgPic.length
	,	bgPicFn=function(){
			var	objA=$G(this)
			,	value=objA.getAtt('value')
			;
			picI=objA.getAtt('picIndex');
			
			box_bg.setAtt('class',value);
			bgPic.setAtt('class','');
			objA.setAtt('class','jtyy_current');
		}
	,	intervalid=''
	,	start=function(){
			intervalid=setInterval(function(){
				var k=Number(picI)+1
				;
				if(k>=picN)k=0;
				bgPicFn.call(bgPic[k]);
			}, 5000);
		}
	;
	if(type=='img'){
		bgPicFn=function(){
			var	objA=$G(this)
			,	value=objA.getAtt('value')
			,	url=objA.getAtt('forurl')
			;
			picI=objA.getAtt('picIndex');
			box_bg[0].src=value;
			box_bg[0].parentNode.href=url;
			bgPic.setAtt('class',' ');
			objA.setAtt('class','jtyy_current');
		};
	}
	bgPic.Each(function(i){
		$G(this).setAtt('picIndex',i);
		if(i==0)$G(this).setAtt('class','jtyy_current');
	}).bd({on:'mousemove',callback:bgPicFn});
	bgPic.click(function(){
		clearInterval(intervalid);
		start();
		var	objA=$G(this)
		;
		objA.setAtt('class','jtyy_current');
		bgPicFn.call(this);
	});
	return {
		start:start
	};
}
;
var bgPic=$G('.bgPic');
$G('.box_bg').Each(function(i){
	var t=$G(this).getAtt('src');
	var picFn=picFor(this,bgPic[i],(t?'img':'class'));
	picFn.start();	
});
	})
