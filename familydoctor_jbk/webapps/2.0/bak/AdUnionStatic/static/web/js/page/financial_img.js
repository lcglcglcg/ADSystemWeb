window.cklogin=function(){};
$G(function(){
	$G('img').Each(function(){
		this.src=window.config.url.recharge.downLoadFile+window.location.search+'&aKey='+window.aKey;
	});
});