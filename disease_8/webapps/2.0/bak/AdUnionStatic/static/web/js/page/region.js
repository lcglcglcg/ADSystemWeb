window.headerEnd(function(){
	window.region=function(){
		var jsonParentId={}
		,	jsonRegionId={}
		,	regCode={}
		,	regionAll=$G('.regionAll')
		,	regOnClick_1=function(){
				var regObj_1=$G('.region_1_inp')
				,	isChecked=false
				,	cn=regObj_1.checked(true).length
				;
				if(regObj_1.length==cn){
					isChecked=true;
				}
				if(cn==0)
					regionAll[0].checked=false;
				else regionAll[0].checked=true;
			}
		,	regOnClick_2=function(obj,isNext){
				var cv=obj.checked
				,	pObj=obj.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
				,	objList=$G('input:input_valign',pObj)
				,	isChecked=false
				,	cn=objList.checked(true).length
				,	n=objList.length
				;
				if(objList[0].checked)cn--;
				if(cv && n==cn){
					isChecked=true;
				}
				if(cn==0 || cv){
					objList[0].checked=cv;
				}
				if(!isNext){
					$G('input',$G('div:block1',obj.parentNode.parentNode.parentNode.parentNode)[0]).Each(function(){
						this.checked=cv;
					});
					regionCount(obj.parentNode.parentNode.parentNode.parentNode,cv);
				}
				regOnClick_1();
			}
		,	regOnClick_3=function(obj){
				var cv=obj.checked
				,	pObj=obj.parentNode.parentNode.parentNode.parentNode.parentNode
				,	objList=$G('input',pObj)
				,	isChecked=false
				,	n=objList.length
				,	obj2=$G('input:input_valign',pObj.parentNode)
				;
				if(cv){
					if(n==objList.checked(cv).length){
						isChecked=true;
					}
				}
				var cn=objList.checked(true).length
				;
				if(cn==0 || cv)
					obj2[0].checked=cv;
				regionCount(pObj.parentNode,cv,cn);
				regOnClick_2(obj2[0],true);
			}
		,	regionCount=function(obj,v,sv){
				$G('div:block1',obj).Each(function(){
					var ov=$G('input',this)
					,	n=ov.length
					,	cn=sv||ov.checked(true).length||(v?n:0)
					,	pObj=$G('input:input_valign',this.parentNode)
					;
					if(cn==0 || cn==n){
						pObj.setAtt('notsubname','1');
						$G('span:zongshu',this.parentNode)[0].style.display='none';
					}else{
						pObj.setAtt('notsubname','0');
						$G('span:zongshu',this.parentNode).html(cn+'/'+n);
						$G('span:zongshu',this.parentNode)[0].style.display='';
					}
				});
			}
		,	setRegion=function(setVal){
				clearRegion();
				if($G.isNaN(setVal))return;
				var selector=''
				,	parentId={}
				,	val=setVal.split(",")
				;
				$G.Each(function(){
					if($G.isNaN(this))return;
					selector+=' input:subname:'+this;
					parentId[jsonRegionId[this+''].parentId]=true;
				},val);
				$G.Each(function(i,k){
					if(k!=0)
						selector+=' input:subname:'+k;
				},parentId);
				$G(selector,$G('#RegionList')[0]).Each(function(){
					this.checked=true;
				});
				$G('.regionAll').Each(function(){
					this.checked=$G('input:subname:subname').Each(function(){
						var chdList=$G('input',this.parentNode.parentNode.parentNode)
						,	n=chdList.checked(true).length
						,	checked=n>0?true:false
						;
						this.checked=checked;
						regionCount(this.parentNode.parentNode.parentNode,true);
					}).checked(true).length>0?true:false;
				});
				$G('.otherRegion').Each(function(){
					this.checked=$G('.otherRegionVal').checked(true).length>0?true:false;
				});
				$G('input:input_valign',$G('#RegionListEach')[0]).Each(function(){
					var pObj=this.parentNode.parentNode.parentNode.parentNode
					,	chlist=$G('input',$G('div:block1',pObj)[0])
					,	chn=chlist.checked(true).length
					;
					if($G('div:block1',pObj).length!=1 || !this.checked)return;
					if(chn<1){
						chlist.Each(function(){
							this.checked=true;
						});
					}
				});
				
			}
		,	getRegionSelect=function(){
				var r_1_obj=$G('input',$G('#RegionList')[0])
				,	cn=r_1_obj.checked(true).length
				,	n=r_1_obj.length
				,	codes=new Array()
				;
				r_1_obj.Each(function(){
					if(!this.checked)return;
					var gobj=$G(this)
					,	num=gobj.getAtt('subname')
					,	isSub=gobj.getAtt('notsubname')
					,	regleve=gobj.getAtt('regleve')
					;
					if($G.isNumber(num) && ((regleve==2&&isSub!='0')||regleve!=2)){
						codes.push(num);
					}
				});
				return codes.join(',');
			}
		,	getRegion=function(C){
				if(C){
					return getRegionSelect();
				}
				var r_1_obj=$G('input',$G('#RegionList')[0])
				,	cn=r_1_obj.checked(true).length
				,	n=r_1_obj.length
				,	ids=new Array()
				,	codes=new Array()
				,	PidOld={}
				;
				if(cn==n){
					codes.push('ALL');
				}else{
					r_1_obj.Each(function(){
						if(!this.checked)return;
						var gobj=$G(this)
						,	num=gobj.getAtt('subname')
						,	isSub=gobj.getAtt('notsubname')
						;
						if($G.isNumber(num) && isSub!='0'){
							var tRid=jsonRegionId[num].parentId
							;
							if(tRid!=0){
								if(PidOld[tRid]) return;
							}else{
								PidOld[num]=true;
							}
							ids.push(num);
						}
					});
					for(var i=0,n=ids.length;i<n;i++){
						codes.push(jsonRegionId[ids[i]].regionId);
					}
				}
				
				return codes.join(',');
			}
		,	clearRegion=function(){
				$G('input',$G('#RegionList')[0]).Each(function(){
					this.checked=false;
				});
			}
		;
		regionAll.click(function(obj){
			var obj=this
			,	cv=obj.checked
			,	pObj=$G('#RegionListEach')[0]
			;
			$G('input',$G('#RegionListEach')[0]).Each(function(){
				this.checked=cv;
			});
			regionCount(pObj,cv);
		});
		$G('.otherRegion').click(function(){
			$G('.otherRegionVal')[0].checked=this.checked;
		});
		$G('.otherRegionVal').click(function(){
			$G('.otherRegion')[0].checked=this.checked;
		})
		
		window.ajax({
			path:'GET_REGION_CODE'
		,	calback:function(JSON){
				/*****************定义变量**************************/
				var jsonRegion={}
				,	deleteList={}
				,	region=[]
				,	region_2={}
				,	RegionListEach=$G('#RegionListEach')
				,	html='<ol class="row1" style="padding-left:20px;">\
							  <li class="li_w95">\
								<label><input regLeve="1" giveup name="region_1_inp" type="checkbox" subname="subname" value="{region}" class="input_valign" />\
								<span class="gray" >{region}</span></label></li>\
								{region2List}\
							</ol>'
				,	html2='<li class="li_w95">\
							<div class="li_div" name="regionMouse">\
							  <div name="li_city_border1" class="li_city_border1_0" >\
								<div class="hover_ceng_title" style="width:96px;">\
								  <label><input regLeve="2" giveup type="checkbox" subname="{subname}" value="{region2}" class="input_valign"/>\
								  <span>{region2}</span></label><span class="zongshu">0/0</span></div>\
							  </div>\
							  {region3Obj}\
							</div>\
						  </li>'
				,	html3='<li>\
							  <label><input regLeve="3" giveup type="checkbox" subname="{subname}" value="{region3}"/>\
							  {region3}</label></li>'
				,	htmlList='<div class="block1" style="display:none;width:{width}px;">\
								  <div class="hover_ceng">\
									<ul>\
										{region3List}			\
									</ul>\
								  </div>\
								</div>'
				;
				/*****************初始化数据**************************/
				region=[
					'华北地区'
				,	'东北地区'
				,	'华东地区'
				,	'华中地区'
				,	'华南地区'
				,	'西南地区'
				,	'西北地区'
				,	'港澳台'
				];
				region_2['华北地区']=[
					'北京'
				,	'天津'
				,	'河北'
				,	'内蒙古'
				,	'山西'
				];
				region_2['东北地区']=[
					'黑龙江'
				,	'吉林'
				,	'辽宁'
				];
				region_2['华东地区']=[
					'上海'
				,	'安徽'
				,	'福建'
				,	'江苏'
				,	'江西'
				,	'山东'
				,	'浙江'
				];
				region_2['华中地区']=[
					'河南'
				,	'湖北'
				,	'湖南'
				];
				region_2['华南地区']=[
					'广东'
				,	'广西'
				,	'海南'
				];
				region_2['西南地区']=[
					'重庆'
				,	'贵州'
				,	'四川'
				,	'西藏'
				,	'云南'
				];
				region_2['西北地区']=[
					'甘肃'
				,	'宁夏'
				,	'青海'
				,	'陕西'
				,	'新疆'
				];
				region_2['港澳台']=[
					'香港'
				,	'澳门'
				,	'台湾'
				];
				
				/*****************数据分组**************************/
				$G.Each(function(i,k){
					var t=this+''
					,	division=5
					,	d=function(){
							var code=t+''
							,	rD={
									parentId:''
								,	regionId:''
								,	nameCN:k
								}
							;
							rD.parentId=code.substring(0,division)+'00000';
							if(code.substring(division)=='00000')rD.parentId='0000000000';
							
							rD.regionId=code;
							return rD;
						}()
					;
					if(!$G.isArray(jsonParentId[d.parentId]))jsonParentId[d.parentId]=new Array();
					jsonParentId[d.parentId].push(d);
					jsonRegionId[d.regionId]=d;
					jsonRegion[d.nameCN]=d;
					regCode[t]=k;
					if(
						d.nameCN=='北京'
					||	d.nameCN=='上海'
					||	d.nameCN=='天津'
					||	d.nameCN=='重庆'
					){
						deleteList[d.regionId]=d;
					}
				},JSON);
				$G.Each(function(){
					delete jsonParentId[this.regionId];
				},deleteList);
				
				/******************数据加载*********************************/
				var str='';
				for(var i=0,n=region.length;i<n;i++){
					/******************输出省级区域*************************/
					var region_1_fn=function(a){
						var s='';
						for(var k=0,l=a.length;k<l;k++){
							if(k%5==0 && k>0)s+='<li class="li_w95">&nbsp;</li>';
							s+=html2.replace(/{region2}/ig,a[k]).replace(/{subname}/ig,jsonRegion[a[k]].regionId);
							s=s.replace(/{region3Obj}/,region_2_fn(jsonRegion[a[k]]));
						}					
						return s;
					}
					/******************输出市级区域*************************/
					var region_2_fn=function(a){
							if(window.wm.data['user']['PLACE_REGION']==2)
								return htmlList.replace(/{region3List}/,'').replace(/{width}/,30);
							var s=''
							,	getList=jsonParentId[a.regionId]||new Array()
							,	lengthIni=6
							,	nameCnLength=0
							;
							for(var k=0,l=getList.length;k<l;k++){
								nameCnLength=$G.len(getList[k].nameCN);
								if(nameCnLength>lengthIni)lengthIni=nameCnLength;
								s+=html3.replace(/{region3}/ig,getList[k].nameCN).replace(/{subname}/ig,getList[k].regionId);;
							}
							return htmlList.replace(/{region3List}/,s).replace(/{width}/,(30+lengthIni*16));
						}
					;
					str+=html.replace(/{region}/ig,region[i]);
					str=str.replace(/{region2List}/ig,region_1_fn(region_2[region[i]]));
				}
				RegionListEach.html(str);
				
				/***********************************************************/
				$G('.regionMouse',RegionListEach[0]).bd({on:'mouseover',callback:function(){
					var obj=this;
					var pobj=$G('div:block1',obj)
					,	input=$G('input',pobj[0])
					;
					if(input.length<1)return;
					pobj[0].style.display='';
					$G('.li_city_border1',obj).style({'class':'li_city_border1'});
				}}).bd({on:'mouseout',callback:function(){
					var obj=this;
					$G('div:block1',obj)[0].style.display='none';
					$G('.li_city_border1',obj).style({'class':'li_city_border1_0'});
				}});
				/***********************************************************/
				$G('.region_1_inp',RegionListEach[0]).click(function(){
					var obj=this
					,	cv=obj.checked
					,	pObj=obj.parentNode.parentNode.parentNode
					;
					$G('input',pObj).Each(function(){
						this.checked=cv;
					});
					regionCount(pObj,cv);
				});
				
				$G('input',RegionListEach[0]).click(function(){
					var	obj=$G(this)
					,	j=jsonRegionId[obj.getAtt('subname')]
					,	txt=$G.isNaN(j);
					if(txt){
						regOnClick_1();
					}else if(j.parentId=='0000000000'){
						regOnClick_2(this);
					}else{
						regOnClick_3(this);
					}
				});
				
				regionCount($G('#RegionListEach')[0],false);
			}
		});
		return {
			setRegion:setRegion
		,	getRegion:getRegion
		,	code:regCode
		,	clear:clearRegion
		};
	}();
});