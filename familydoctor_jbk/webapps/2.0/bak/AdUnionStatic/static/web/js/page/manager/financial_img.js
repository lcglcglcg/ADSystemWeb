window.cklogin=function(){};
$G(function(){
	$G('img').Each(function(){
		this.src=window.config.mUrl.recharge.downLoadFile+window.location.search;
	});
});