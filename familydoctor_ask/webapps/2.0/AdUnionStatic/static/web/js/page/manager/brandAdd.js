window.headerEnd(function(){
	window.brandAdd=function(){
		/***********************投放科室************************************/
		var putKeshi=$G('#putKeshi')
		,	putKeshiFn=function(){
				var adiv=$G('#select_keshi')
				,	show=function(){
						adiv.WinAlt({
							position:'absolute',
							lock_back:'#BBBBBB',
							fixedDom:putKeshi[0],
							lock_opa:30
						});
					}
				;
				$G('#touf_kes').none();
				$G('.close',adiv[0]).click(function(){
					adiv.display().none();
				});
				return {
					show:show
				}
			}()
		;
		putKeshi.click(function(){
			putKeshiFn.show();
		});
		$G('div:ke_check_new').show();
		//window.keshi.setAll();
		/***********************投放区域************************************/
		var putRegion=$G('#putRegion')
		,	putRegionFn=function(){
				var adiv=$G('#RegionList')
				,	show=function(){
						adiv.WinAlt({
							position:'absolute',
							lock_back:'#BBBBBB',
							fixedDom:putRegion[0],
							lock_opa:30
						}).Move({moveobj:$G('ol:region_title')});
					}
				;
				
				$G('.close',adiv[0]).click(function(){
					adiv.display().none();
				});
				return {
					show:show
				}
			}()
		;
		putRegion.click(function(){
			putRegionFn.show();
		});
		
		/*********查询可投放档期************/
		
		/***********************获取列表************************************/
		var listLi=$G('#listLi')
		,	listLiMenu=$G('#ListLiMenu')
		,	listLiFoot=$G('#listLiFoot')
		,	listLiErr=$G('#listLiErr')
		,	DataList=$G('#brandList')
		,	findDom=$G('#conditionsBrand')
		,	page=window.page()
		,	pageIni=page.getPage()
		,	pageArray=page.getPage()
		,	brandList={}
		,	selectBrandList={}
		,	titlej2=$G('#titlej2')
		,	setVal=function(str,k,v){
				var reg=new RegExp('{'+k+'}','ig')
				;
				return str.replace(reg,v);
			}
		,	getTimeFn=function(name){
				var putTime=$G('.'+name,findDom[0]).getAtt('subValue')
				;
				if(!$G.isNaN(putTime)){
					return putTime.split('至');
				}
				return new Array();
			}
		,	list=window.subAjax('#conditionsBrand',{
					path:'FIND_BRAND_SCHEDULE'
				,	sub:'a:brand_ad_a'
				,	findDom:findDom[0]
				,	obj:DataList[0]
				,	ckdata:function(data){
						data['SHOW_TIME_START']='';
						data['SHOW_TIME_END']='';
						var t=getTimeFn('time');
						if(t.length>0){
							data['SHOW_TIME_START']=t[0];
							data['SHOW_TIME_END']=t[1];
						}
						delete data['time'];
						data['DEPT_TYPE']=1;
						data['REGION_TYPE']=1;
						var regionCode=window.region.getRegion(true);
						if(regionCode){
							data['REGION_TYPE']=2;
							data['REGION_SERIALIZE']=regionCode;
						}
						
						var keshiCode=window.keshi.getid();
						if(keshiCode){
							data['DEPT_TYPE']=2;
							data['DEPT_SERIALIZE']=keshiCode;
						}/*else{
							window.msg.call($G('#putKeshi')[0],{msg:'请选择科室'});
							return;
						}*/
						var d=window.wm.setDataListManager(data,findDom[0],pageArray);
						return d;
					}
				,	callback:function(JSON){
						view_keput.show();
						var str=''
						,	postdata=this.postdata
						,	regData=window.region.code
						,	ksData=window.keshi.code
						;
						JSON.INFO=JSON.INFO||{
											PAGE_INDEX:1
										,	CAMPAIGN_COUNT:0
										};
						JSON.LIST=JSON.LIST||{};
						if(!window.wm.msg(JSON.CODE,false))
							return;
						var	n=JSON.LIST.length
						;
						if(n<1){
							DataList[0].innerHTML=listLiErr.html();
							return false;
						}
						for(var i=0;i<n;i++){
							var	v=JSON.LIST[i]
							,	hStr=listLi[0].innerHTML
							;
							$G.Each(function(i,val,json){
								var value=this+'';
								if(val=='REGION_SERIALIZE'){
									var regCode=regData[value]
									,	regParCode=function(){
											var pCodeName=value.substring(0,5)+'00000'
											,	pid=regData[pCodeName]
											;
											if(pid==value){
												regCode='--';
											}
											return pid;
										}()
									;
									//hStr=setVal(hStr,val,regCode);
									value=regCode;
									hStr=setVal(hStr,'REGION_PARNT_CODE',regParCode);
								}else if(val=='STATUS'){
									var startStr='冲突'
									,	startCss='red'
									,	toolstr='--',
										startCss2="green",
										isDisable = "disabled";
										
									if(value==2){
										startStr='可投放';
										startCss='green';
										toolstr='添加';
										startCss2="blue";
										isDisable = "";
									}
									
									//hStr=setVal(hStr,val,startStr);
									value=startStr;
									hStr=setVal(hStr,'toolStr',toolstr);
									hStr=setVal(hStr,'STATUSCss',startCss);
									hStr=setVal(hStr,'STATUSCss2',startCss2);
									hStr=setVal(hStr,'isDisable',isDisable);
								}else if(val=='DEPT_SERIALIZE'){
									var ksCode=ksData[value]
									,	ksParCode=function(){
											var pCodeName=value.substring(0,5)+'00000'
											,	pid=ksData[pCodeName]
											;
											if(pid==value){
												regCode='--';
											}
											return pid;
										}()
									;
									//hStr=setVal(hStr,val,ksCode);
									value=ksCode;
									hStr=setVal(hStr,'DEPT_PARNT_CODE',ksParCode);
								}
								hStr=setVal(hStr,val,value);
							},v);
							var id='code_'+(v.REGION_SERIALIZE+v.DEPT_SERIALIZE);
							brandList[id]=v;
							hStr=setVal(hStr,'regKs_ID',id);
							str+=hStr;
						}
						page.setup(JSON.INFO.COUNT,n,pageArray);
						DataList[0].innerHTML=listLiMenu[0].innerHTML+str+listLiFoot[0].innerHTML;
						$G('a:tool:add',DataList[0]).click(function(){
							var obj=$G(this)
							,	value=obj.getAtt('value')
							,	html=this.innerHTML
							,	classTemp = ""
							;
							if(html=='--'){
								return;
							}else if(html=='添加'){
								selectBrandList[value]=brandList[value];
								this.innerHTML='删除';
								
								classTemp = this.parentNode.getAttribute("class").replace(/blue/g, "");
								
								this.parentNode.setAttribute("class", classTemp + " red");
							}else if(html=='删除'){
								this.innerHTML='添加';
								
								classTemp = this.parentNode.getAttribute("class").replace(/red/g, "");
								
								this.parentNode.setAttribute("class", classTemp + " blue");
								
								delete selectBrandList[value];
							}
							var i=0;
							for(var k in selectBrandList){
								i++;
							}
							if(i>0){
								titlej2.html('已选择(<i class="red">'+i+'</i>)');
							}else{
								titlej2.html('已选择');
							}
						});
					}
				})
		,	selectAll=function(){
				var c=this.checked;
				$G('.checkbox',DataList[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.checkbox',DataList[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.checkboxAll',DataList[0])[0].checked=true;
				else $G('.checkboxAll',DataList[0])[0].checked=false;
			}
		,	findSelId=function(){
				var selObjList=$G('.checkbox',DataList[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			}
		;
		pageArray['click']=function(pageObj){
			pageArray=pageObj;
			list.sub();
		};
		var brand_ad_a=$G('a:brand_ad_a')
		,	view_keput=$G('#view_keput')
		,	add_check=$G('#add_check')
		,	add_keput=$G('#add_keput')
		,	titlej1=$G('#titlej1')
		,	s_bottom=$G('div:s_bottom')
		;
		$G('#resAdds').click(function(){
			window.document.location=window.document.location;
		});
		titlej1.click(function(){
			add_keput.show();
			titlej1.setAtt('class','add_brand_btn_curr');
			add_check.none();
			titlej2.setAtt('class',' ');
			s_bottom.show();
		});
		
		var selectToolsFn=function(){
			if(this.innerHTML!='已选择'){
				add_keput.none();
				titlej1.setAtt('class','  ');
				add_check.show();
				titlej2.setAtt('class','add_brand_btn_curr');
				s_bottom.none();
				view_keput.show();
				var i=0;
				for(var k in selectBrandList){
					i++;
				}
				if(i>0){
					titlej2.html('已选择(<i class="red">'+i+'</i>)');
				}else{
					titlej2.html('已选择');
				}
				window.brandSelect.show();
			}
		};
		titlej2.click(selectToolsFn);
		$G('#selectAdds').click(function(){
			var s=findSelId();
			if(s.n<1){
				window.altBox.show({
					title:'确认提示信息'
				,	msg:'请在列表中选中数据后再进行添加操作'
				});
			}else{
				window.gconfirm({
					msg:'您确定要添加选中的数据吗？'
				,	title:'确认提示信息'
				,	fn:function(isTrue){
						if(isTrue){
							for(var i=0,n=s.vlist.length;i<n;i++){
								selectBrandList[s.vlist[i]]=brandList[s.vlist[i]];
							}
							var i=0;
							for(var k in selectBrandList){
								i++;
							}
							if(i>0){
								titlej2.html('已选择(<i class="red">'+i+'</i>)');
							}else{
								titlej2.html('已选择');
							}
							$G('a:value:'+s.vlist.join(' a:value:')).Each(function(){
								this.innerHTML='删除';
								classTemp = this.parentNode.getAttribute("class").replace(/blue/g, "");
								
								this.parentNode.setAttribute("class", classTemp + " red");
							});
						}
					}
				});
			}
		});
		return {
			selectAll:selectAll
		,	selectId:selectId
		,	selectBrandList:selectBrandList
		,	selectToolsFn:selectToolsFn
		,	list:function(fn){
				list.sub(fn);
			}
		};
	}();
	window.brandSelect=function(){
		var postdata=this.postdata
		,	regData=window.region.code
		,	ksData=window.keshi.code
		,	listLi=$G('#listLiSelect')
		,	listLiMenu=$G('#ListLiSelectMenu')
		,	DataList=$G('#brandSelectList')
		,	titlej2=$G('#titlej2')
		,	setVal=function(str,k,v){
				var reg=new RegExp('{'+k+'}','ig')
				;
				return str.replace(reg,v);
			}
		;
		
		var timer = setInterval(function() {
			if (!regData) {
				regData = window.region.code;
			} else if (!ksData) {
				ksData=window.keshi.code;
			} else {
				clearInterval(timer);
			}
		}, 100);
		
		var show=function(){
			var list=window.brandAdd.selectBrandList;
			var str='';
			DataList[0].innerHTML='';
			for(var k in list){
				var	v=list[k]
				,	hStr=listLi[0].innerHTML
				;
				$G.Each(function(i,val,json){
					var value=this+'';
					if(val=='REGION_SERIALIZE'){
						var regCode=regData[value]
						,	regParCode=function(){
								var pCodeName=value.substring(0,5)+'00000'
								,	pid=regData[pCodeName]
								;
								if(pid==value){
									regCode='--';
								}
								return pid;
							}()
						;
						//hStr=setVal(hStr,val,regCode);
						value=regCode;
						hStr=setVal(hStr,'REGION_PARNT_CODE',regParCode);
					}else if(val=='STATUS'){
						var startStr='冲突'
						,	startCss='red'
						,	toolstr='--'
						,	startCss2="green"
						;
						if(value==2){
							startStr='可投放';
							startCss='green';
							toolstr='添加';
							startCss2="blue";
						}
						//hStr=setVal(hStr,val,startStr);
						value=startStr;
						hStr=setVal(hStr,'toolStr',toolstr);
						hStr=setVal(hStr,'STATUSCss',startCss);
						hStr=setVal(hStr,'STATUSCss2',startCss2);
					}else if(val=='DEPT_SERIALIZE'){
						var ksCode=ksData[value]
						,	ksParCode=function(){
								var pCodeName=value.substring(0,5)+'00000'
								,	pid=ksData[pCodeName]
								;
								if(pid==value){
									regCode='--';
								}
								return pid;
							}()
						;
						//hStr=setVal(hStr,val,ksCode);
						value=ksCode;
						hStr=setVal(hStr,'DEPT_PARNT_CODE',ksParCode);
					}
					hStr=setVal(hStr,val,value);
				},v);
				var id='code_'+(v.REGION_SERIALIZE+v.DEPT_SERIALIZE);
				brandList[id]=v;
				hStr=setVal(hStr,'regKs_ID',id);
				str+=hStr;
			}
			DataList[0].innerHTML=listLiMenu[0].innerHTML+str;
			$G('a',DataList[0]).click(function(){
				var obj=$G(this)
				,	value=obj.getAtt('value')
				,	html=this.innerHTML
				;
				delete window.brandAdd.selectBrandList[value];
				show();
				var i=0;
				for(var k in window.brandAdd.selectBrandList){
					i++;
				}
				if(i>0){
					titlej2.html('已选择(<i class="red">'+i+'</i>)');
				}else{
					titlej2.html('已选择');
				}
			});
		};
		var selectAll=function(){
				var c=this.checked;
				$G('.checkbox',DataList[0]).Each(function(){
					this.checked=c;
				});
			}
		,	selectId=function(id){
				var c=this.checked
				,	list=$G('.checkSelectbox',DataList[0])
				,	n=list.length
				,	cn=list.checked(true).length
				;
				if(n==cn)$G('.checkboxSelectAll',DataList[0])[0].checked=true;
				else $G('.checkboxSelectAll',DataList[0])[0].checked=false;
			}
		,	findSelId=function(){
				var selObjList=$G('.checkSelectbox',DataList[0])
				,	cv=selObjList.checked(true)
				,	cn=cv.length
				;
				return {
					objlist:selObjList
				,	vlist:cv
				,	n:cn
				};
			}
		$G('#allDelSelect').click(function(ag,et){
			var s=findSelId();
			if(s.n<1){
				window.altBox.show({
					title:'确认提示信息'
				,	msg:'请在列表中选中数据后再进行删除操作'
				});
			}else{
				window.gconfirm({
					msg:'您确定要删除选中的数据吗？'
				,	title:'确认提示信息'
				,	fn:function(isTrue){
						if(isTrue){
							for(var i=0,n=s.vlist.length;i<n;i++){
								delete window.brandAdd.selectBrandList[s.vlist[i]];
							}
							show();
							var i=0;
							for(var k in window.brandAdd.selectBrandList){
								i++;
							}
							if(i>0){
								titlej2.html('已选择(<i class="red">'+i+'</i>)');
							}else{
								titlej2.html('已选择');
							}
						}
					}
				});
			}
		});
		
		
		userBrand=$G('.userBrand');
		$G('#userIni').click(function(){
			window.userSearch.show(function(json){
				userBrand.setAtt('uid',json.ACCOUNT_ID);
				userBrand.val('['+json.ACCOUNT_NAME+']'+json.COMPANY_NAME);
			});
		});
		var priceBrand=$G('.priceBrand')
		,	subFunction=function(d){
				window.ajax({
					path:d["PACKET_TYPE"]	// 此处修改
				,	type: "post"
				,	data:d
				,	calback:function(JSON){
						subFun=function(d){
							subFun=function(){};
							subFunction(d);
						};
						if(window.wm.msg(JSON.CODE,false)){
							if (d["PACKET_TYPE"] == "ADD_BRAND") {
								alert('订单添加成功');
								window.document.location='/brand/add.html';
							} else {
								alert('审核操作成功');
								window.document.location='/brand/';
							}
							
						}
					}
				});
			},	
			subFun = function(d) {
				subFun = function() {
				};
				subFunction(d);
			};

		// 获取到订单id
		var id = $G.getid('id');
		
		// 确定，审核通过、审核不通过、按钮的设置
		var btnClick = function(text) {
			
			// if (!$G.isNumber(priceBrand[0].value) || !window.wm.ckType.campaignBudget.call(priceBrand[0],priceBrand[0].value)) {
			if (!$G.isNumber(priceBrand[0].value) || !(parseInt(priceBrand[0].value) > 0)) {
				window.msg.call(priceBrand[0], {msg:'广告消费必须大于0'});
				return false;;
			}
			var uid = userBrand.getAtt('uid');
			
			if (!uid) {
				window.msg.call(userBrand[0], {
					msg : '请选择投放客户'
				});
				return false;
			}

			var list = window.brandAdd.selectBrandList,
				i = 0,
				rD = {},
				cD = {};
			
			$G.Each(function() {
				var j = this;
				rD[j.REGION_SERIALIZE] = i;
				cD[j.DEPT_SERIALIZE] = i;
				i++;
			}, list); 

			var rn=0,
				cn=0,
				rCode=new Array(),
				cCode=new Array();
			
			for (var k in rD) {
				rn++;
				rCode.push(k);
			}

			for (var k in cD) {
				cn++;
				cCode.push(k);
			}
			if (rn * cn != i) {
				window.msg.call(this, {
					msg : '您所选择的投放条件所产生的订单不唯一或不完整，请重新选择'
				});
				return;
			}

			
			var d = {};
			
			// 此处设置提交时的类型
			d["PACKET_TYPE"] = "BRAND_INSPECTION";
			d["BRAND_ID"] = id;
			
			if (this.id == "allAddBrand") {
				if (this.type == 0) {
					d["PACKET_TYPE"] = "ADD_BRAND";
				} else {
					d["STATUS"]  = 1;
				}
			} else {
				d["STATUS"]  = 2;
				d["REFUSE_REASON"] = text;
			}
			
			d['ACCOUNT_ID'] = uid;
			d['PRICE'] = priceBrand[0].value;
			d['REGION_TYPE'] = 2;
			d['DEPT_TYPE'] = 2;
			d['REGION_SERIALIZE'] = rCode.join(',');
			d['DEPT_SERIALIZE'] = cCode.join(',');
			d['SHOW_TIME_START'] = '';
			d['SHOW_TIME_END'] = '';
			var t = $G('.time', $G('div:main')[0]).getAtt('subValue');

			if (!$G.isNaN(t)) {
				t = t.split('至');
			} else
				t = new Array();

			if (t.length > 0) {
				d['SHOW_TIME_START'] = t[0];
				d['SHOW_TIME_END'] = t[1];
			}
			subFun(d); 
		}
		$G('#allAddBrand').click(btnClick);
		
		// 审核不通过时的弹出框
		viewPic = function() {
			var preview = $G('#view_refuse2'),
				adiv = window.alertDiv({
					findObj : '#view_refuse2',
					position : 'absolute',
					move : $G('div:title', preview[0])
				});
			return {
				show : function(fn) {
					fn && fn.call(preview[0], adiv);
					adiv.show();
				},
				none : adiv.close
			}
		}();
		// 审核不通过
		$G("#cancelBrand").click(function() {
			viewPic.show();
		});
		//审核不通过的弹出框中确认和取消操作
		$G(".save", "#cancelBrand").click(function() {
			var text = $("#view_refuse2 textarea").val().trim();
			
			if (text.length < 1 || text.length > 60) {
				alert("内容长度不符合限制！");
				return;
			}
			btnClick(text);
		});
		
		$G(".close", "#cancelBrand").click(function() {
			$G("textarea", "#cancelBrand").val("");
			viewPic.none();
		});
		
		
		
		/*****************************修改*********************************/
		if (id) {
			window.ajax({
				path : 'GET_BRAND_UNIQUE',
				type : "post",
				data : {
					BRAND_ID : id
				},
				type: "post",
				calback : function(JSON) {
					if (window.wm.msg(JSON.CODE, false)) {
						userBrand.setAtt('uid',JSON.ACCOUNT_ID);
						
						// 设置价格
						$("#brandSub [name = 'priceBrand']").val(JSON.PRICE);
						
						//设置用户名
						$("#brandSub [name = 'userBrand']").val(JSON.ACCOUNT_NAME);
						
						// 设置时间
						$("#conditionsBrand [name='time']").val(JSON.SHOW_TIME_START + " 至 " + JSON.SHOW_TIME_END);
						$("#conditionsBrand [name='time']").attr("subvalue", JSON.SHOW_TIME_START + " 至 " + JSON.SHOW_TIME_END);
						
						// 设置区域
						// if (JSON.REGION_TYPE == 1) {
							// // 选中所有
							// $G('#RegionList input').Each(function(){
								// this.checked=true;
							// });
						// } else {
							// window.region.setRegion(JSON.REGION_SERIALIZE);
						// }
						
						// 设置科室
						//window.keshi.setid(JSON.DEPT_SERIALIZE);
						
						window.ajax({
							path : 'FIND_BRAND_SCHEDULE',
							type : "post",
							data : {
								DEPT_TYPE : 2
							,	DEPT_SERIALIZE:JSON.DEPT_SERIALIZE
							,	REGION_TYPE:(parseInt(JSON.REGION_TYPE) + 1)
							,	REGION_SERIALIZE:JSON.REGION_SERIALIZE
							,	SHOW_TIME_START:JSON.SHOW_TIME_START
							,	SHOW_TIME_END:JSON.SHOW_TIME_END
							,	PAGE_INDEX:1
							,	PAGE_COUNT:2000
							,	SORT_TYPE:1
							,	SORT_COLUMN:1
							},
							calback : function(jsonData) {
								var jsonList=jsonData.LIST
								;
								if(jsonList.length<1)return;
								$G.Each(function(i,k){
									var	deptC=this['DEPT_SERIALIZE']
									,	regC=this['REGION_SERIALIZE']
									;
									window.brandAdd.selectBrandList['code_' + (regC + deptC)] = {
										DEPT_SERIALIZE : deptC,
										REGION_SERIALIZE : regC,
										STATUS : this['STATUS']
									};
								},jsonList);
								window.brandAdd.selectToolsFn();
							}
						});
						
						/*var regCode = JSON.REGION_TYPE == 1 ? (new Array()) : (JSON.REGION_SERIALIZE + '').split(','), deptCode = (JSON.DEPT_SERIALIZE + '').split(',');
						$G.Each(function() {
							var regC = this + '';

							$G.Each(function() {
								var deptC = this + '';
								$G.log('code_' + (regC + deptC));
								window.brandAdd.selectBrandList['code_' + (regC + deptC)] = {
									DEPT_SERIALIZE : deptC,
									REGION_SERIALIZE : regC,
									STATUS : 2
								};
							}, deptCode);
						}, regCode);
						*/

					}
				}
			});
		}

		return {
			selectAll:selectAll
		,	selectId:selectId
		,	show:show
		};
	}();
});


$(document).ready(function() {
	
	// 全选按钮的修复
	$("#brandSelectList").on("click", "[name = 'checkboxSelectAll']", function() {
		if ($(this).prop("checked")) {
			console.log($(this).attr("disabled"));
			if (!($(this).attr("disabled") == "true")) {
				$("#brandSelectList [name = 'checkSelectbox']").prop("checked", true);
			}
		} else {
			$("#brandSelectList [name = 'checkSelectbox']").prop("checked", false);
		}
	});
	
	// 全选按钮的修复
	$("#brandList").on("click", "[type = 'checkbox']", function() {
		var mark = $(this).prop("checked");
		if ($(this).attr("name") == "checkboxAll") {
			$("#brandList input[type = 'checkbox']").each(function() {
				console.log($(this).attr("disabled"));
				if ($(this).attr("disabled")) {
					$(this).prop("checked", false);
				} else {
					$(this).prop("checked", mark);
				}
			});
		} else {
			if (!mark) {
				$("#brandList input[name = 'checkboxAll']").prop("checked", mark);
			} else {
				$("#brandList input[name = 'checkboxAll']").prop("checked", true);
				$("#brandList [name = 'checkbox']").each(function() {
					if (!$(this).prop("checked")) {
						$("#brandList input[name = 'checkboxAll']").prop("checked", false);
					}
				});
			}
		}
		
	});
	
	var clickCT=$G('#clickCT')
	,	clickKT=$G('#clickKT')
	;
	clickCT.click(function(){
		$G('input',$G('#add_check')[0]).Each(function() {
			var cd=$G(this).getAtt("cd");
			if('冲突'==cd) this.checked=true;
			
		});
	});
	clickKT.click(function(){
		$G('input',$G('#add_check')[0]).Each(function() {
			var cd=$G(this).getAtt("cd");
			if('冲突'!=cd) this.checked=true;
			
		});
	});
});