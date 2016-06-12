(function(){
	window.questionArray = {
			'0':'请选择密保问题'
		,	'2':'您父亲的全名?'
		,	'3':'您母亲的全名?'
		,	'4':'您配偶的全名?'
		,	'5':'您父亲的生日?'
		,	'6':'您母亲的生日?'
		,	'7':'您初中最好朋友的生日?'
		,	'8':'您初中最好朋友的全名?'
		,	'9':'您就读的小学的全名?'
		,	'10':'您就读的初中的全名?'
		,	'11':'您身份证的最后八位?'
	};
	var protectQuestion=$G('select:eachlist:question')
	;
	$G.Each(function(){
		protectQuestion.addsel(this,this);
	},window.questionArray);
	window.selDom&&window.selDom.resall();
})();