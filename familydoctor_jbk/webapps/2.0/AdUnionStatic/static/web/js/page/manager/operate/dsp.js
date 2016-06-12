/**
 * Created by Fei on 2015/5/14.
 */
$(function() {
    var itemCount = -1,  // 总条数
        pageIndex,  // 当前页
        isFirstLoad = true,
        sortMark = 2;
    /***********************投放科室***********************************/
    var putKeshi = $G('#putKeshi'),
        putKeshiFn = function() {
            var adiv = $G('#select_keshi'),
                show = function() {
                    adiv.WinAlt({
                        position: 'absolute',
                        lock_back: '#BBBBBB',
                        fixedDom: putKeshi[0],
                        lock_opa: 30
                    });
                };

            $G('#touf_kes').none();
            $G('.close', adiv[0]).click(function() {
                adiv.display().none();
            });

            return {
                show: function() {
                    show();
                },
                hide: function() {
                    adiv.display().none();
                }
            }
        }();
    putKeshi.click(function() {
        putKeshiFn.show();
        putRegionFn.hide();
    });
    window.keshi.setAll();
    /**********************投放区域************************************/
    var putRegion = $G('#putRegion')
        , putRegionFn = function() {
            var adiv = $G('#RegionList')
                , show = function() {
                    adiv.WinAlt({
                        position: 'absolute',
                        lock_back: '#BBBBBB',
                        fixedDom: putRegion[0],
                        lock_opa: 30
                    }).Move({moveobj: $G('ol:region_title')});
                }
                ;

            $G('.close', adiv[0]).click(function() {
                adiv.display().none();
            });
            return {
                show: function() {
                    $("#RegionList input[type = 'checkbox']").removeAttr("disabled");
                    show();
                },
                hide: function() {
                    adiv.display().none();
                }
            }
        }()
        ;
    putRegion.click(function() {
        putRegionFn.show();
        putKeshiFn.hide();
    });

    /******************************** 查询功能 *************************************/
    var source = $("#operateList").html(),  // 编译模板
        template = Handlebars.compile(source);

    $("#checkInfo").click(function() {

        var data = {},
            formEle = $("#formElements"),
            cpc = formEle.find("input[name='cpc']"),
            accountName = formEle.find("input[name='accountName']"),
            budgetStart = formEle.find("input[name='budgetStart']"),
            budgetEnd = formEle.find("input[name='budgetEnd']"),
            order = formEle.find("select[name='order']"),
            regionCode = window.region.getRegion(true),
            keshiCode = window.keshi.getid();

        data['DEPT_TYPE'] = 1;
        data['REGION_TYPE'] = 1;

        if (cpc.val() != "") {
            if (!$.isNumeric(cpc.val())) {
                window.msg.call(cpc.get(0), {msg: 'cpc必须是数字！'});
                return false;
            }

            if (cpc.val() < 0.05) {
                window.msg.call(cpc.get(0), {msg: 'cpc大于0.05'});
                return false;
            }
        }

        if (budgetStart.val() != "" && !$.isNumeric(budgetStart.val())) {
            window.msg.call(budgetStart.get(0), {msg: '预算必须是数字！'});
            return false;
        }
        if (budgetEnd.val() != "" && !$.isNumeric(budgetEnd.val())) {
            window.msg.call(budgetEnd.get(0), {msg: '预算必须是数字！'});
            return false;
        }

        if (keshiCode) {
            data['DEPT_TYPE'] = 2;
            data['DEPT_SERIALIZE'] = keshiCode;
        }

        if (regionCode) {
            data['REGION_TYPE'] = 2;
            data['REGION_SERIALIZE'] = regionCode;
        }

        data["CPC_PRICE"] = cpc.val();
        data["ACCOUNT_NAME"] = accountName.val();
        data["BUDGET_LESS"] = budgetStart.val();
        data["BUDGET_MORE"] = budgetEnd.val();
        data["STATUS"] = order.val()||"";
        data["SORT_TYPE"] = sortMark;
        data["SORT_COLUMN"] = 3;
        data["PAGE_COUNT"] = $("#pageManager select[name='page_selectStyle_05']").val()||20;
        data["PAGE_INDEX"] = $("#pageManager select[name='page_selectStyle_06']").val()||1;

        window.ajax({
            path: "GET_MANAGER_DSP_LIST",
            type: 'post',
            data: data,
            calback: function(json) {
                if(!window.wm.msg(json.CODE,false)) return false;

                $("#infoList").html(template(json));

                // 设置分页
                itemCount = json.INFO.COUNT;
                pageIndex = json.INFO.PAGE_INDEX;

                if (isFirstLoad) {  // 如果是第一次加载，就来初始化分页
                    updatePageText(10);
                    isFirstLoad = false;
                }

                updatePageText(data["PAGE_COUNT"]);

                // 如果是倒序，需要修改箭头
                if (sortMark == 1) {
                    $("#infoList ul").eq(0).find("li").eq(2).text("CPC↑");
                }

                // 设置一下分页选中页码
                $("#pageManager select[name='page_selectStyle_06']").val(pageIndex);
            }
        });

    });


    var timer = setInterval(function() {
        if (window.region.isLoad && window.region.isLoad()) {
            clearInterval(timer);

            $("#checkInfo").trigger("click");
        }
    }, 100);

    /********************************分页*************************************/
    var pageManager = {},
        sele_1 = $("#pageManager select[name='page_selectStyle_05']"),
        sele_2 = $("#pageManager select[name='page_selectStyle_06']");

    sele_1.attr("onchange", "pageManager.change(true);");
    sele_2.attr("onchange", "pageManager.change(false);");

    pageManager.change = function(mark) {

        $("#checkInfo").trigger("click");

        if (!mark) { // 处理第几页
            pageIndex = sele_2.val();
        }

        updatePageText(sele_1.val());
    };

    function updatePageText(pageCountByOne) { // 每页条数
        var pageCount = Math.ceil((itemCount || 0) / pageCountByOne);
        $("#pageManager li[name='pageText']").html("显示 <span class='red'>1-" + (pageCountByOne || 10) + "</span> 条 共 "
                + (itemCount || 0) + " 条 " + (pageIndex || 1) + "/" + (pageCount || 1) + " 页");

        // 修改页码下拉条
        for (var i = 1; i < pageCount + 1; i++) {
            pageCountByOne += "<option value=" + i + ">第" + i + "页</option>";
        }

        if (pageCount == 0) {
            pageCountByOne += "<option value=" + 1 + ">第" + 1 + "页</option>";
        }

        pageCountByOne = "<select name='page_selectStyle_06'>" + pageCountByOne + "</select>";

        sele_2 = sele_2.parent();
        sele_2.html("");
        sele_2.html(pageCountByOne);
        sele_2 = $("#pageManager select[name='page_selectStyle_06']");
        sele_2.attr("onchange", "pageManager.change(false);");
    }

    window.pageManager = pageManager;

    // 上页下页首页末页
    $("#pageManager").on("click", "li[name='pageKey'] a", function() {
        var index = $(this).index(),
            pageCount =  Math.ceil((itemCount || 0) / (sele_1.val() || 10));

        pageIndex = parseInt(pageIndex);

        if (index == 0) {   // 首页
            pageIndex = 1;
        } else if (index == 1) {    // 上页
            pageIndex = pageIndex > 1 ? (pageIndex - 1) : pageIndex;
        } else if (index == 2) {    // 下页
            pageIndex = pageIndex < pageCount ? (pageIndex + 1) : pageIndex;
        } else if (index == 3) {    // 末页
            pageIndex = pageCount;
        } else {
            return false;
        }

        sele_2.val(pageIndex);
        $("#checkInfo").trigger("click");

        updatePageText(sele_1.val());
    });

    /********************************状态修改*************************************/
    $("#infoList").on("click", "ul li a.a_dsp_style", function() {
        var status = $(this).attr("name") == "start" ? 0 : 1,
            creativeId = $(this).parent().parent().attr("creativeId"),
            img = $(this).find("img"),
            imgUrl = status ? "/static/ads_m_1.0/web/images/li6_new.gif" : "/static/ads_m_1.0/web/images/li5_new.gif",
            _this = $(this),
            textStatus = status ? '您确定暂停DSP广告投放吗？' : "您确定启动DSP广告投放吗？";

        window.gconfirm({
            msg: textStatus
            ,	title:'确认提示信息'
            ,	fn:function(isTrue){
                if (isTrue) {
                    window.ajax({
                        path: "SET_MANAGER_DSP_IMG",
                        type: 'post',
                        data: {
                            STATUS: status,
                            CREATIVE_ID: creativeId
                        },
                        calback: function(json) {
                            if(!window.wm.msg(json.CODE,false)) return false;

                            window.altBox.show({
                                title:'修改状态提醒',
                                msg: status ? '暂停成功!' : "启用成功!"
                            });

                            _this.attr("name", status ? "start" : "");

                            var text = status ? "暂停" : "有效",
                                cClass = status ? "orange" : "green";

                            _this.parent().parent().find("li").eq(4).text(text);
                            _this.parent().parent().find("li").eq(4).removeClass("green orange").addClass(cClass);
                            img.attr("src", imgUrl);
                        }
                    });
                }
            }
        });

    });
    /********************************排序*************************************/
    $("#infoList").on("click", "ul li[name='sort']", function() {
        sortMark = sortMark == 1 ? 2 : 1;
        $("#checkInfo").trigger("click");
    });
    /********************************Hover效果*************************************/
    $("#infoList").on("mouseout mouseover", "ul", function(e) {
        if (!$(this).hasClass("b_line")) {
            if (e.type == "mouseout") {
                $(this).removeClass("hover_bg");
            } else {
                $(this).addClass("hover_bg");
            }
        }
    });

    /********************************上传图片*************************************/
    var uploadCreateId; // 点击上传后，被点击创意的ID 会被保存在此变量中

        // 编译上传文件列表的模板
        uploadFileTemplate = Handlebars.compile($("#uploadFileTemplate").html()),
        uploadFileTemplateTwo = Handlebars.compile($("#uploadFileTemplateTwo").html()),

        // 保存上传后提交的文件ID  保存删除后保存需要提交的文件ID
        subFiles = "",
        delFiles = "";

    var upflieFn = function(ini) {
        return $G.upflie({
            success: function(file, serverData) {
                serverData = $.parseJSON(serverData);

                if (serverData.CODE == "1014") {
                    window.altBox.show({
                        title:'提示信息'
                        ,	msg:'尺寸不符合标准！'
                    });
                    return false;
                } else {
                    if(!window.wm.msg(serverData.CODE,false)) return false;
                }

                //var isLoadImgs = false;
                //
                //var timer = setInterval(function() {
                //    if (isLoadImgs) {
                //
                //        clearInterval(timer);
                //
                //        if (subFiles != "") {
                //            subFiles += ",";
                //        }
                //        subFiles += serverData.CREATIVE_IMG_ID;
                //
                //        $("#fileList").append(uploadFileTemplateTwo(serverData));
                //        updateToolText();
                //    }
                //},100);
                //
                //if (!$("#fileList li .zu_cont_rg").length) {
                //    isLoadImgs = true;
                //}
                //
                //$("#fileList li .zu_cont_rg").each(function(i, ele) {
                //    if ($(this).text() == serverData.CREATIVE_IMG_SIZE) {
                //
                //        window.altBox.show({
                //            title:'提示信息'
                //            ,	msg:'同样尺寸只能上传一张！'
                //        });
                //
                //        clearInterval(timer);
                //        return false;
                //    }
                //
                //    if ($(this).get(0) == ele && $(this).text() != serverData.CREATIVE_IMG_SIZE) {
                //        isLoadImgs = true;
                //    }
                //});

                if (subFiles != "") {
                    subFiles += ",";
                }
                subFiles += serverData.CREATIVE_IMG_ID;

                $("#fileList").append(uploadFileTemplateTwo(serverData));
                updateToolText();
            },
            swfupload_loaded_handler: function() {  // 在flash初始化完成之后
                upflie.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILES);
            },
            // 当文件选取对话框关闭后触发的事件处理函数
            file_dialog_complete_handler: function(numberSelected, numberQueued) {
                upflie.startUpload();
            },
            upload_start_handler: function(file) {
                return true;
            },
            file_queue_error_handler: function(file, errorCode, message) {
                console.log("file_queue_error_handler");
                var msg = message;
                if (errorCode == '-100') msg = '当前还可以上传' + message + '张图片';
                else if (errorCode == '-110') msg = '您上传的图片大小，不能超过55KB';
                else alert(errorCode + '=' + message);

                window.altBox.show({
                    title:'提示信息',
                    msg:msg
                });
            },
            upid: ini.upid, // 按钮ID
            pic_w: 62,  // 按钮尺寸
            pic_h: 24,
            file_upload_limit: 0,    //限制文件上传个数 0为不限制
            types: "*.jpg;*.jpeg;*.gif;*.png;*.bmp", // 上传文件的类型
            pic: '/static/ads_c_2.0/web/images/btn_shangc.jpg',
            url: ini.url
        })
    };
    var upflie = upflieFn({upid: 'upIdeas', url: "/uploadfile"});

    var uploadTools = function() {
        var preview = $G('#step_three'),
            adiv = window.alertDiv({
                findObj : '#step_three',
                position : 'absolute',
                move : $G('div:scommon_title', preview[0])
            });
        return {
            show : function(fn) {
                fn && fn.call(preview[0], adiv);
                adiv.show();
            },
            none : adiv.close
        }
    }(),
        uploadIdeasDemoPreview = function() {
        var preview = $G('#preview_default'),
            adiv = window.alertDiv({
                findObj : '#preview_default',
                position : 'absolute',
                closeObj: ".close_bnt",
                move : $G('div:check_title', preview[0])
            });
        return {
            show : function(fn) {
                fn && fn.call(preview[0], adiv);
                adiv.show();
            },
            none : adiv.close
        }
    }();

    // 删除文件
    $("#step_three").on("click", "a[name='delete']", function() {
        var liEle = $(this).parent(),
            imgId = liEle.attr("imgId");

        liEle.remove();
        updateToolText();
        if (!liEle.attr("isNew")) {
            if (delFiles != "") {
                delFiles += ",";
            }
            delFiles += imgId;
        } else {
            subFiles = subFiles.replace(new RegExp(imgId + "[,]?", "g"), "");
            subFiles = subFiles.replace(new RegExp(",$"), "");
        }
    });

    // 更新上传了几个文件
    function updateToolText() {
        $("#step_three .already_upload span").eq(0).text("已经上传" + $("#fileList li").length + "张");
    }

    // 取消或者关闭
    $("#step_three a[name='cancel']").click(function() {
        // 清空带提交的添加文件和删除文件的id、设置以上传数量为0

        subFiles = delFiles = "";
        uploadTools.none();
    });

    // 保存上传文件
    $("#step_three").on("click", "a[name='save']", function() {

        var msgMark = "",
            isUpdatedOne = true,
            isUpdatedTwo = true;

        if (delFiles != "") {
            isUpdatedOne = false;
            window.ajax({
                path: "DEL_MANAGER_DSP_IMG",
                type: 'post',
                data: {
                    IMG_ID: delFiles,
                    CREATIVE_ID: uploadCreateId
                },
                calback: function(json) {
                    if(!window.wm.msg(json.CODE,false)) return false;
                    isUpdatedOne = true;
                    msgMark = "删除成功！"
                }
            });
        }

        if (subFiles != "") {
            isUpdatedTwo = false;
            window.ajax({
                path: "ADD_MANAGER_DSP_IMG",
                type: 'post',
                data: {
                    UPLOAD_ID: subFiles,
                    CREATIVE_ID: uploadCreateId
                },
                calback: function(json) {
                    if(!window.wm.msg(json.CODE,false)) return false;
                    isUpdatedTwo = true;
                    msgMark = "上传成功！"
                }
            });
        }

        setTimeout(function() {
            if (isUpdatedTwo && isUpdatedOne) {
                $("#checkInfo").trigger("click");

                if (msgMark != "") {
                    window.altBox.show({
                        title: '修改状态提醒',
                        msg: msgMark
                    });
                }
            } else {
                setTimeout(arguments.callee, 300);
            }
        }, 300);

        $("#step_three a[name='cancel']").trigger("click");
    });

    // 上传按钮 弹出上传框、显示出已经上传过的文件
    $("#infoList").on("click", "a[name='uploadTool']", function() {
        uploadCreateId = $(this).parent().parent().attr("creativeId");
        uploadTools.show();

        $("#step_three .white_bg img").attr("src", ""); // 清除预览图片

        window.ajax({
            path: "GET_MANAGER_DSP_IMG",
            type: 'post',
            data: {
                CREATIVE_ID: uploadCreateId
            },
            calback: function(json) {
                if(!window.wm.msg(json.CODE,false)) return false;
                $("#fileList").html(uploadFileTemplate(json));
                updateToolText();
            }
        });
    });

    // 查看预览图
    $("#fileList").on("click", "li", function() {
        $("#step_three .show_img_photo img").attr("src", window.wm.path.pic.url + $(this).attr("imgUrl"));
        $("#step_three .show_img_photo img").attr("picName", $(this).find(".key_div").text());
        $("#step_three .show_img_photo img").attr("picWHSize", $(this).find(".zu_cont_rg").text());
        $("#step_three .show_img_photo img").attr("picSize", $(this).attr("filesize"));
    });

    // 查看大图
    $("#step_three a[name='viewBig']").click(function() {
        var img = $(this).parent().find("img").eq(0),
            oldImg = $("#step_three .show_img_photo img").eq(0),
            width = oldImg.attr("picWHSize"),
            widthNew = width.substring(0, width.indexOf("X")||width.indexOf("x")),
            size = (parseInt(oldImg.attr("picSize"))/1024).toFixed(2);

        if (img.attr("src") != "") {

            $("#preview_default").css("width", parseInt(widthNew) + 20);
            $("#preview_default .check_cont_step3 img").attr("src", oldImg.attr("src"));
            $("#preview_default .miaoshu .xia_line").text(oldImg.attr("picName"));
            $("#preview_default .miaoshu .m_guige").text(oldImg.attr("picWHSize") + " | " + size + "kb");
            $("#preview_default .miaoshu .download").attr("href", oldImg.attr("src"));

            uploadIdeasDemoPreview.show();
        }
    });

    // 清除全部
    $("#step_three .already_upload span").eq(1).click(function() {
        $("#step_three .zu_content li").each(function() {
            var imgId = $(this).attr("imgId");
            $(this).remove();

            if (!$(this).attr("isNew")) {
                if (delFiles != "") {
                    delFiles += ",";
                }
                delFiles += imgId;
            } else {
                subFiles = subFiles.replace(new RegExp(imgId + "[,]?", "g"), "");
                subFiles = subFiles.replace(new RegExp(",$"), "");
            }
        });
        updateToolText();
    });

});