window.$G=window.$G||{wm:function(){},Version:0};
(function(){
	/******************************************************************
	无阻加载JS	开始
	*******************************************************************/
	var getscript=function(s){
			var script
			,	head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
			return {
					send: function( ) {
						script = document.createElement( "script" );
						script.async = "async";
						script.charset = s.scriptCharset||'UTF-8';
						if(script.readyState){
							script.onreadystatechange = function() {
								if (/loaded|complete/.test(script.readyState)) {
									script = script.onreadystatechange = null;
									try{
										if ( head && script.parentNode ) {
											head.removeChild( script );
										}
									} catch (e) {}
									s.callback  && s.callback();
								}
							};
						}else{
							script.onload = function(){
								script.onload = null;
								s.callback  && s.callback();
							}; 
						}
						
						if(s.cache)
							s.url = s.url + ( /\?/.test( s.url ) ? "&" : "?" ) + "notcache=" + new Date().getTime();
						script.src = s.url;
						head.insertBefore( script, head.firstChild );
					},
					abort: function() {
						if ( script ) {
							if(script.readyState){
								script.onreadystatechange=null;
							}else{
								script.onload=null;
							}
						}
					}
				};
		}
	,	getjs=function(o){
			o=o||{};
			var stime=function(){
				st&&clearTimeout(st);
				o.callback && o.callback();
			},	scp=getscript({
				 url:o.url,
				 callback:stime,
				 scriptCharset:o.charset,
				 cache:o.cache
				 })
			,	st=setTimeout(scp.abort,(o.time||15*1000))
			;
			
			scp.send();
		
	};
	var loadFn=function(fn,where){
		var cfn=function(){
				if(where()){
					clearInterval(t);
					fn&&fn();
				}
			}
		,	t = setInterval(cfn, 0)
		;
	};
	/******************************************************************
	无阻加载JS	结束
	*******************************************************************/
	
	var d={};    //1 右下	2 
	
	d['TI2TJ4DFBFTV1R']=0;
	
	d['TI230NQCGFUI1N']=1;
	d['TI2V8DV2BJSO15']=1;
	d['TI23OT103Q9J1I']=1;
	d['TI2SLEPPEBHD1M']=1;
	d['TI2IDPV86FUH1P']=1;
	d['TI1VDO9G5TGD1D']=1;
	d['TI20772K8G3D14']=1;
	d['TI2V94BDEOB01D']=1;
	d['TI2B33Q5KBR71N']=1;
	d['TI2D1BCJA8CT1H']=1;
	d['TI2G78L14VMS38']=1;
	d['TI1VR1SSIT671O']=1;
	d['TI27LOUI94I116']=1;
	d['TI245DIVH8NC1N']=1;
	d['TI21L1B4DL2F17']=1;
	d['TI2GOR33CK671G']=1;
	d['TI2N7AH4IOVK17']=1;
	d['TI2MQK88JJKD1A']=1;
	d['TI2D46LH8PQK1F']=1;
	d['TI2OJLO5CUQD1C']=1;

	d['TI1TJOIUDQBB1C']=2;
	
	d['TI27DKV0AHDE1G']=3;
	
	d['TI2LE8HGHQ511M']=8;
	d['TI1RP2I8EBRN1P']=8;
	d['TI2IP3UV3Q9J18']=8;
	d['TI2QP2MV3Q9J16']=8;
	d['TI1QB2SPK6PS1Q']=8;
	d['TI2SR6Q0G61U16']=8;
	d['TI1T94Q076N01Q']=8;
	d['TI2HG9MEKPPT15']=8;
	d['TI2R153T6S361G']=8;

	d['TI1VQ79R77V11E']=9;
	d['TI2U82D83Q9JD0']=9;
	d['TI273CVR3Q9J1A']=9;
	d['TI1QGBJ09M2P1G']=9;
	d['TI2GHHB6BS7L1C']=9;
	d['TI2KRDMMDVG519']=9;
	d['TI22RB4DJ4UE18']=9;
	d['TI20LNT98R7B17']=9;
	d['TI2GC9QEFQRT1I']=9;
	d['TI1U3CFN97201N']=9;

	d['TI20BMN5GQ6M1H']=4;
	d['TI22B6VQCM0E1J']=4;
	d['TI2DABRECN6B1J']=4;
	d['TI2KPK2GEDMP1D']=4;
	d['TI23AFAGAPSA1S']=4;
	d['TI29BLV7KCOH19']=4;
	d['TI1R468QBT311I']=4;
	d['TI1UO9D4A6SF1M']=4;
	d['TI1SFFB84VMS35']=4;
	

	d['TI2MIIOTCKLB1D']=5;
	d['TI2E382EHNO31N']=5;
	d['TI21HJG23Q9J1I']=5;
	d['TI1VTI6L3Q9J18']=5;
	d['TI1VJP5JKVM91A']=5;
	d['TI1UT551A5G91E']=5;
	d['TI27E4IQ8B801E']=5;
	d['TI2JGTHPCGVS1S']=5;
	d['TI1QR471CK0A1B']=5;
	d['TI2UGR59B6461B']=5;
	d['TI2KTJ9NEBL916']=5;
	d['TI22T3SIEKBA18']=5;
	d['TI2UVIVMFR2C1M']=5;
	d['TI1PR4MCGKQ816']=5;
	d['TI1RIJ516L1I1M']=5;
	d['TI23HEGDH4IO1B']=5;
	d['TI1R29F2GADR1C']=5;
	d['TI2I8A3IJPNQ1B']=5;
	d['TI2SNUP74VMS31']=5;
	d['TI2AJ89J4VMS35']=5;
	d['TI21G70U6HMS1B']=5;

	d['TI2FM80QEPJ31E']=6;
	d['TI2OQQ50CUG31Q']=6;
	d['TI2CPGI93Q9J92']=6;
	d['TI2CDLKV3Q9J1F']=6;
	d['TI20G8ROFBD31D']=6;
	d['TI2O5LVRDP181O']=6;
	d['TI2ST7NIKC741A']=6;
	d['TI2H72NQDD171C']=6;
	d['TI2O4NBH7PGB15']=6;
	d['TI2IA7A98D4N1B']=6;
	d['TI1U0QM0DBGA15']=6;
	d['TI2IOC9EJHV41A']=6;
	d['TI26299I4VMS2T']=6;
	d['TI23O4G74VMS38']=6;
	d['TI26299I4VMS2T']=6;
	d['TI2E1OUEG2LU1E']=6;
	d['TI2SO5HRHENU1I']=6;
	d['TI2CKA0DH7V41L']=6;
	d['TI2IGVJSB1FT1R']=6;
	d['TI2I0001FKHK16']=6;
	d['TI29HD5HK3AK1Q']=6;
	d['TI2IBGOQGCK81A']=6;
	d['TI1SELP8AEGB1T']=6;

	d['TI2NH3SCJMJF1Q']=7;
	d['TI26BF46C18A1S']=7;
	d['TI21GT9C3Q9J1E']=7;
	d['TI2DLMHO3Q9J6O']=7;
	d['TI2T1V84COON1O']=7;
	d['TI2RAE8H7SMR1A']=7;
	d['TI2U4GF3900I1A']=7;
	d['TI1RHM8CB4GP1J']=7;
	d['TI1TGFUIFGCA1C']=7;
	d['TI2U4NBJJH5E1L']=7;
	d['TI287QAGCFCJ1D']=7;
	d['TI2RQ7KUBOA318']=7;
	d['TI2JBAS99REB19']=7;
	d['TI29VGTDB41V16']=7;
	d['TI214T7RFQUK1S']=7;
	d['TI2OVFQ0E47V1O']=7;
	d['TI24QU93J9IQ1F']=7;
	d['TI2KCNSQE07I1K']=7;
	d['TI22S3AU4VMS38']=7;
	d['TI204RHR4VMS34']=7;
	d['TI1PEGGJ97J71R']=7;
	

	d['TI2HTUS8HFIR1A']=8;
	d['TI1ULPF28VHH19']=10;

	var s=window.haomeit39netids||'';
	var idsConfig=function(){
		var wwwUrl=window.location+'';
		var domIds=$G('.'+s.replace(/,/g,' .'));
		if(wwwUrl.indexOf('sj.39.net/cjjb/dx/')>=0 || wwwUrl.indexOf('m.39.net/sj/cjjb/dx/')>=0){
			var oldNewIds=[];
			oldNewIds['TI2IMQJSEPFM1G']='TI2ICSM43Q9J19';
			oldNewIds['TI2C14KFC0HF18']='TI22JPCJ3Q9J4V';
			oldNewIds['TI2L45U56QOB1N']='TI2JP9RD3Q9JTV';
			oldNewIds['TI2LQTOGD1SE1M']='TI2HTM083Q9J15';
			oldNewIds['TI2I2I5K9Q4M1R']='TI2240GD3Q9J19';
			oldNewIds['TI2V8DV2BJSO15']='TI23OT103Q9J1I';
			oldNewIds['TI1RP2I8EBRN1P']='TI2IP3UV3Q9J18';
			oldNewIds['TI1VQ79R77V11E']='TI2U82D83Q9JD0';
			oldNewIds['TI2OQQ50CUG31Q']='TI2CPGI93Q9J92';
			
			oldNewIds['TI2E382EHNO31N']='TI21HJG23Q9J1I';
			oldNewIds['TI26BF46C18A1S']='TI21GT9C3Q9J1E';
			
			
			var newsIds=new Array;
			domIds.Each(function(i,k){
				var obj=$G(this)
				,	name=obj.getAtt('name')
				;
				if(oldNewIds[name]){
					obj.setAtt('name',oldNewIds[name])
					name=oldNewIds[name];
				}
				newsIds.push(name);
			});
			s=newsIds.join(",");
		}else if(wwwUrl.indexOf('ask.39.net')>=0){
			if(wwwUrl.indexOf('/browse/372850061')>=0){
				var oldNewIds=[];
				oldNewIds['TI1PM2LKCBUR1K']='TI26T9KB4VMS30';	
				oldNewIds['TI208UL4K2RD1A']='TI2966SO4VMS36';	
				oldNewIds['TI2QA640HRRH1E']='TI2625884VMS2Q';	
				oldNewIds['TI20BMN5GQ6M1H']='TI1SFFB84VMS35';	
				oldNewIds['TI26N9004UT920']='TI1V62NF4VMS2U';	
				oldNewIds['TI2IOC9EJHV41A']='TI26299I4VMS2T';	
				oldNewIds['TI2I8A3IJPNQ1B']='TI2AJ89J4VMS35';	
				oldNewIds['TI2KCNSQE07I1K']='TI204RHR4VMS34';
				oldNewIds['TI2D1BCJA8CT1H']='TI2G78L14VMS38';
				var newsIds=new Array;
				domIds.Each(function(i,k){
					var obj=$G(this)
					,	name=obj.getAtt('name')
					;
					if(oldNewIds[name]){
						obj.setAtt('name',oldNewIds[name])
						name=oldNewIds[name];
					}
					newsIds.push(name);
				});
				s=newsIds.join(",");
			}else if(wwwUrl.indexOf('/question/')>=0 || wwwUrl.indexOf('/topic.aspx')>=0){
				var isDxSpan=$G('div:wrap1ask-sub section:sub');
				if(isDxSpan.length<1)return;
				var isDxHtml=isDxSpan[0].innerHTML;
				isDxHtml=isDxHtml.replace('小儿癫痫','');
				if(isDxHtml.indexOf('癫痫')>=0){
					var oldNewIds=[];
					oldNewIds['TI1PM2LKCBUR1K']='TI2FUBMT4VMS37';
					oldNewIds['TI2EQ44JEPF91Q']='TI2Q6U6B4VMS3E';
					oldNewIds['TI24JDNSCMUE1C']='TI1PE8CR4VMS36';
					oldNewIds['TI2GJAR3AO4D1P']='TI2CP6FE4VMS2Q';
					oldNewIds['TI2QA640HRRH1E']='TI20ILSI4VMS2S';
					oldNewIds['TI2OI46PDIK01L']='TI2CN3SQ4VMS2S';
					oldNewIds['TI2D1BCJA8CT1H']='TI2G78L14VMS38';
					oldNewIds['TI2IOC9EJHV41A']='TI26299I4VMS2T';
					oldNewIds['TI2I8A3IJPNQ1B']='TI2SNUP74VMS31';
					oldNewIds['TI2KCNSQE07I1K']='TI22S3AU4VMS38';
					oldNewIds['TI2JEKE8F7CV1O']='TI27PLBT4VMS3A';
					oldNewIds['TI20BMN5GQ6M1H']='TI1SFFB84VMS35';
					
					var newsIds=new Array;
					domIds.Each(function(i,k){
						var obj=$G(this)
						,	name=obj.getAtt('name')
						;
						if(oldNewIds[name]){
							obj.setAtt('name',oldNewIds[name])
							name=oldNewIds[name];
						}
						newsIds.push(name);
					});
					s=newsIds.join(",");
				}
			}
		}else{
			var isDxSpan=$G('span:art_location section:m-sub');
			if(isDxSpan.length<1)return;
			var isDxHtml=isDxSpan[0].innerHTML;
			isDxHtml=isDxHtml.replace('小儿癫痫','');
			if(isDxHtml.indexOf('癫痫')>=0){
				var oldNewIds=[];
				oldNewIds['TI2H7JKHJTUF1L']='TI2OIJ893Q9J19';
				oldNewIds['TI29EUNO5VF415']='TI2LKERS3Q9J1J';
				oldNewIds['TI2V8DV2BJSO15']='TI23OT103Q9J1I';
				oldNewIds['TI2H6SDCHQ5Q16']='TI2RLBH73Q9J1D';
				oldNewIds['TI1VQ79R77V11E']='TI273CVR3Q9J1A';
				oldNewIds['TI1RP2I8EBRN1P']='TI2QP2MV3Q9J16';
				oldNewIds['TI2OQQ50CUG31Q']='TI2CDLKV3Q9J1F';
				oldNewIds['TI1TBKKRA09T1P']='TI2HOVT23Q9JO5';
				oldNewIds['TI26KB7AKNBO17']='TI2HOVT23Q9JO5';
				oldNewIds['TI1QGBJ09M2P1G']='TI2SP2A03Q9JVH';
				
				oldNewIds['TI2E382EHNO31N']='TI1VTI6L3Q9J18';
				oldNewIds['TI26BF46C18A1S']='TI2DLMHO3Q9J6O'; 
				oldNewIds['TI2QTUQN7N2615']='TI28KVC83Q9J1E'; 
				oldNewIds['TI2RI5TFCB871F']='TI2SAMGE3Q9J1M';

				var newsIds=new Array;
				domIds.Each(function(i,k){
					var obj=$G(this)
					,	name=obj.getAtt('name')
					;
					if(oldNewIds[name]){
						obj.setAtt('name',oldNewIds[name])
						name=oldNewIds[name];
					}
					newsIds.push(name);
				});
				s=newsIds.join(",");
			}
		}
		
	};
	
	var nameList={};
	
	var show=function(json){
		var name=json.cabin
		,	g=$G('.'+name)
		,	isIni=false
		;
		if(json['unbound']==1){return;
		}
		if(!json['creativeId']){
			json['imgUrl']='http://static.adx.haomeit.com/39/'+name+'.jpg';
			json['webIM_Url']='http://phw.twos.net.cn/LR/Chatpre.aspx?id=phw28129993&lng=cn&r=lc(2bu)_xzt&p=lc(2bu)_xzt';
			isIni=true;
			$G.log('null:'+name);
		}else{
			$G.log(name+'|'+json.imgSize);
		}
		//$G.log(name+'|'+json['imgUrl']);
		var wsize=$G.windowSize();
		var xScroll=wsize.sw;
		var yScroll=wsize.sh;
		
		var m=$G.model;
		
		if(nameList[name]==true){
			return;
		}
		
		nameList[name]=true;
		if(d[name]==0){
			if(isIni===false){
				var gdom=m.pic({
					href:json.webImHref//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:"210X120" //图片尺寸
				,	cabin:name
				});
				gdom.show({
					position:'fixed',
					isRight:true,
					isBottom:true,
					yLenPx:'50'
				});
			}
		}else if(d[name]==1){
			if(isIni===false){
				var gdom=m.pic({
					href:json.webImHref//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:"200X110" //图片尺寸
				,	cabin:name
				});
				gdom.show({
					position:'fixed',
					isRight:true,
					isBottom:true,
					yLenPx:'50'
				});
			}
		}else if(d[name]==2){
			if(isIni===false){
				var gdom=m.pic({
					href:json.webImHref//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:"150X230" //图片尺寸
				,	cabin:name
				});
				gdom.show({
					position:'fixed',
					isRight:true,
					isTop:true
				});
			}
		}else if(d[name]==3){
			var gdom=m.pic({
				href:json.webImHref//广告目标网址
			,	src:json.imgUrl//广告图片SRC
			,	imgSize:"150X230" //图片尺寸
			,	cabin:name
			});
			gdom.show({
				position:'fixed',
				isRight:true,
				isYCenter:true
			});
		}else if(d[name]==4){
			var gdom=m.pic({
				href:json.webImHref//广告目标网址
			,	src:json.imgUrl//广告图片SRC
			,	imgSize:"200X196" //图片尺寸
			,	cabin:name
			});
			gdom.show({
				position:'fixed',
				isLeft:true,
				isTop:true
			});
		}else if(d[name]==5){
			var gdom=m.pic({
				href:json.webImHref//广告目标网址
			,	src:json.imgUrl//广告图片SRC
			,	imgSize:"40X140" //图片尺寸
			,	cabin:name
			});
			gdom.show({
				position:'fixed',
				isRight:true,
				isYCenter:true
			});
		}else if(d[name]==6){
			if(isIni===false){
				var gdom=m.pic({
					href:json.webImHref//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:xScroll+"X50"//图片尺寸
				,	cabin:name
	
				});
				gdom.show({
					position:'fixed',
					isBottom:true,
					isLeft:true
				});
			}
		}else if(d[name]==7){
			var pw=xScroll;
			var ph=xScroll/6.4;
			var gdom=m.pic({
				href:json.webImHref//广告目标网址
			,	src:json.imgUrl//广告图片SRC
			,	imgSize:pw+"X"+ph //图片尺寸
			,	cabin:name
			});
			gdom.show({
				position:'fixed',
				isBottom:true,
				isLeft:true
			});
		}else if(d[name]==8){
			if(isIni===false){
				var gdom=m.pic({
					href:json.webImHref//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:"110X240" //图片尺寸
				,	cabin:name
				});
				gdom.show({
					position:'fixed',
					isRight:true,
					isYCenter:true
				});
			}
		}else if(d[name]==10){
			if(isIni===false){
				var gdom=m.pic({
					href:json.webImHref//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:"110X240" //图片尺寸
				,	cabin:name
				});
				gdom.show({
					position:'fixed',
					isLeft:true,
					isYCenter:true
				});
			}
		}else if(d[name]==9){
			if(isIni===false){
				var gdom=m.pic({
					href:json.webImHref//广告目标网址
				,	src:json.imgUrl//广告图片SRC
				,	imgSize:"150X230" //图片尺寸
				,	cabin:name
				});
				gdom.show({
					position:'fixed',
					isLeft:true,
					isYCenter:true
				});
			}
		}else{
			var dom=m.pic({
				href:json.webImHref//广告目标网址
			,	src:json.imgUrl//广告图片SRC
			,	imgSize:"100%X100%" //图片尺寸
			,	cabin:name
			});
			dom.echo();
		}


	};
	
	
	if(s){
		var getWmFn=function(code){
			var trust=7086
			,	dept=''
			;
			var wwwUrl=window.location+''
			,	mk=''
			;
			if(wwwUrl.indexOf('ask.39.net')>=0){
				var isDxSpan=$G('div:ask-sub div:wrap1ask-sub p:ellipsis-thisxLocation');
				if(isDxSpan.length>0){
					var isDxHtml='';
					isDxSpan.Each(function(){
						isDxHtml+=this.innerHTML;
					});
					trust=3690;
					if(isDxHtml.indexOf('血管瘤')>=0){
						dept='1001000000';
					}else if(isDxHtml.indexOf('胎记')>=0){
						dept='1002000000';
					}else if(isDxHtml.indexOf('甲状腺')>=0){
						dept='1003000000';
					}else if(isDxHtml.indexOf('整形')>=0){
						dept='1004000000';
					}else if(isDxHtml.indexOf('植发')>=0){
						dept='1005000000';
					}else if(isDxHtml.indexOf('股骨头坏死')>=0){
						dept='1006000000';
					}else if(isDxHtml.indexOf('脑瘫')>=0){
						dept='1007000000';
					}else if(isDxHtml.indexOf('小儿癫痫')>=0){
						dept='1008000000';
					}else if(isDxHtml.indexOf('癫痫')>=0){
						dept='1009000000';
					}
					
				}
				
			}else if(wwwUrl.indexOf('zx.39.net')>=0 || wwwUrl.indexOf('m.39.net/zx/')>=0){
				trust=3690;
				dept='1004000000';
			}else if(wwwUrl.indexOf('/taiji/')>=0){
				trust=3690;
				dept='1002000000';
			}else //if(wwwUrl.indexOf('jbk.39.net/')<0)
			{
				var metaKey=$G('.keywords .Keywords')
				,	v=''
				;
				metaKey.Each(function(){
					v+=$G(this).getAtt('content');
				});
				v+=window.document.title+'';
				if(v.indexOf('羊癫疯')>=0){
					trust=3690;
					dept='1009000000';
					return;
				}else if(v.indexOf('小儿癫痫')>=0){
					trust=3690;
					dept='1008000000';
					return;
				}else if(v.indexOf('脱发')>=0 || v.indexOf('植发')>=0 || v.indexOf('斑秃')>=0){
					trust=3690;
					dept='1005000000';
					return;
				}else if(v.indexOf('整形')>=0){
					trust=3690;
					dept='1004000000';
				}else if(v.indexOf('胎记')>=0){
					trust=3690;
					dept='1002000000';
				}else if(v.indexOf('血管瘤')>=0){
					trust=3690;
					dept='1001000000';
				}else if(v.indexOf('痉挛型双瘫')>=0||v.indexOf('脑瘫')>=0||v.indexOf('型腿')>=0||v.indexOf('肌张')>=0||v.indexOf('智力低下')>=0||v.indexOf('障碍')>=0||v.indexOf('足内')>=0||v.indexOf('剪刀')>=0){
					trust=3690;
					dept='1007000000';
					return;
				}else if(v.indexOf('甲')>=0){
					trust=3690;
					dept='1003000000';
					return;
				}
				mk=v;
				metaKey.setAtt('content',' ');
			}
			$G.statistics=function(){
				var ref=function(){
					try{
						if(document.referrer) return document.referrer+'';
						else if(window.opener) return window.opener.location+'';
					}catch(e){}
					return '';
				}();
				if($G.isNaN(ref))ref='';
				
				return {
					fromPage:ref,
					toPage:window.location+'',
					toPageTitle:encodeURIComponent(mk||window.document.title+''),
					//userAgent:navigator.userAgent,
					platform:navigator.platform+'',
					browser:$G.getBrowser,
					bVersion:$G.getBrowserVersion,
					ufcolor:(navigator.appName=="Netscape"?ufcolor=screen.pixelDepth:ufcolor=screen.colorDepth)+'',
					screensize:screen.width+'.'+screen.height,
					language:(navigator.language?navigator.language:navigator.browserLanguage)+'',
					timeZone:((new Date().getTimezoneOffset()/60)*(-1))+''
					};
			};
			
			idsConfig();
			
			$G.wm({
				cabin:s 	//广告位标识
			,	trust:trust
			,	addParam:{
					disease_code:dept||''
				,	ip_addr:$G.getid('ip')||''
				}
			,	ele:2//广告类型 1：文字广告	2：图片广告 默认1
			,	style:'pic.39.net'//页面标识广告以哪种风格显示，便于日志数据分析
			,	fn:function(d){
					/****以下为封闭好后的广告JSON对象数据.		注：每一条广告数据，执行一次此方法****/
					/*	
						cabin:广告标识
						type:广告类型
						index:索引
					*/
					this.eachFn=show;
				}
			,	callbackEach:function(n){
					
				}
			});
			
		};
		getjs({
			url:'http://static.adx.haomeit.com/js/Glacier.js'
		,	callback:function(){
					$G.Config.www='http://disease8.haomeit.com:7501';
					$G.Config.wwwImg='http://disease8.haomeit.com/getPic/';
					getWmFn();
				}
			});
		
	}
})();


var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?59884482175b616940240932ce046eb4";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
