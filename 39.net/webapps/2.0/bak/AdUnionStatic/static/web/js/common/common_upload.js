var upimgfn=function(o){
	o=o||{};
	var progress_gettime
	,	eachLog=function(file, serverData){
			$G.log('*************************file***********************');
			$G.log('id:'+file.id);
			$G.log('index:'+file.index);
			$G.log('name:'+file.name);
			$G.log('size:'+file.size);
			$G.log('type:'+file.type);
			$G.log('creationdate:'+file.creationdate);
			$G.log('modificationdate:'+file.modificationdate);
			$G.log('filestatus:'+file.filestatus);
		}
	;
	/*
	stats对象包含以下属性:
	{
		in_progress : 数字 //1或0表示一个文件是否处于上传中
		files_queued : 数字 //当前上传队列中的文件数量
		successful_uploads : 数字 //上传成功的文件数量 (上传成功将触发uploadSuccess事件)
		upload_errors : 数字 //发生错误的文件数量 (除了取消文件)
		upload_cancelled : 数字 //被取消的文件数量
		queue_errors : 数字 //触发
		fileQueueError事件的文件数量
	}
	
	SWFUpload.QUEUE_ERROR = {
		QUEUE_LIMIT_EXCEEDED : -100,
		FILE_EXCEEDS_SIZE_LIMIT : -110,
		ZERO_BYTE_FILE : -120,
		INVALID_FILETYPE : -130
	};
	
	SWFUpload.UPLOAD_ERROR = {
		HTTP_ERROR : -200,
		MISSING_UPLOAD_URL : -210,
		IO_ERROR : -220,
		SECURITY_ERROR : -230,
		UPLOAD_LIMIT_EXCEEDED : -240,
		UPLOAD_FAILED : -250,
		SPECIFIED_FILE_ID_NOT_FOUND : -260,
		FILE_VALIDATION_FAILED : -270,
		FILE_CANCELLED : -280,
		UPLOAD_STOPPED : -290
	};
	SWFUpload.FILE_STATUS = {
		QUEUED : -1,
		IN_PROGRESS : -2,
		ERROR : -3,
		SUCCESS : -4,
		CANCELLED : -5
	};
	file	{
		id : string, // SWFUpload控制的文件的id,通过指定该id可启动此文件的上传、退出上传等 
		index : number, // 文件在选定文件队列（包括出错、退出、排队的文件）中的索引，
		getFile可使用此索引 
		name : string, // 文件名，不包括文件的路径。 
		size : number, // 文件字节数 
		type : string, // 客户端操作系统设置的文件类型 
		creationdate : Date, // 文件的创建时间 
		modificationdate : Date, // 文件的最后修改时间 
		filestatus : number
	}
	*/
	return settings = {
		flash_url : "/static/web/flash/swfupload.swf",
		upload_url: o.url||'/upflie',
		post_params: o.data||{},
		file_size_limit : o.file_size_limit||"55000 B",
		file_types : o.types||"*.xls;*.txt",
		file_types_description : o.test||"浏览",
		file_upload_limit : o.file_upload_limit||0,
		file_post_name:o.file_post_name||'creativeSingleUploadTo.file',
		//select_mode:o.select_mode||'',
		//file_queue_limit : 1,
		//button_action : SWFUpload.BUTTON_ACTION.SELECT_FILE,//单个文件
		button_cursor : SWFUpload.CURSOR.HAND,
		debug: false,
		button_image_url :o.pic||'/static/sem_web_1.0/web/images/shangc.gif',
		button_placeholder_id : o.upid||'upflie',
		button_width: o.pic_w||97,
		button_height: o.pic_h||22,
		//文件上传数量、类型、大小不符合时
		file_queue_error_handler :function(file, errorCode, message){
			eachLog(file);
			$G.log('swfErr:'+errorCode);
			$G.log('serverErr:'+message);
			o.file_queue_error_handler&&o.file_queue_error_handler.call(this,file, errorCode, message);
		},
		//用户成功地选择了文件
		file_queued_handler:o.queued_handler||function(file) {    
			/*this.customSettings.queue = this.customSettings.queue || new Array();
			while (this.customSettings.queue.length > 0) {
				this.cancelUpload(this.customSettings.queue.pop(), false);
			}
			this.customSettings.queue.push(file.id);*/
			return true;
		},
		//开始上传文件前触发的事件处理函数
		upload_start_handler :o.upload_start_handler||function(file){
			try {
				progress_gettime=new Date().getTime();
				return true;
			} catch (e) {
			}
		},
		//刚打开与服务器的连接与文件上传过程中
		upload_progress_handler : o.upload_progress_handler||function(file, bytesLoaded, bytesTotal){
			if(o.upload_progress_handlerIni){
				try {
					var percent = Math.ceil((bytesLoaded / bytesTotal) * 100)
					,	filesize=$G.toDecimal2((file.size / 1024)/1024)
					,	kbing=(bytesLoaded / 1024)/1024
					,	upsize=$G.toDecimal2(kbing)
					,	ctime=progress_gettime
					,	timeing=new Date().getTime()
					,	otime=timeing-ctime
					,	skb=(kbing*1024)/otime
					,	alltime=(file.size-bytesLoaded)/(skb*1024)
					,	formatalltime=new Date().setTime(alltime)
					,	speeding=$G.toDecimal2(skb*1000)
					,	overtime=$G.formatdate(new Date(formatalltime-(8*60*60*1000)),'hh:mm:ss')
					;
					o.upload_progress_handlerIni({
						name:file.name
					,	percent:percent
					,	filesize:filesize
					,	upsize:upsize
					,	speeding:speeding
					,	overtime:overtime
					});
				} catch (ex) {
					
				}
				
			}
		},
		//上传失败时
		upload_error_handler : o.upload_error_handler||function(file, errorCode, message){
			
		},
		//文件上传成功或者等待服务器数据返回超时
		upload_success_handler : function(file, serverData) {
			eachLog(file);
			$G.log('*************************服务器返回***********************');
			$G.log('serverData:'+serverData);
			o.success&&o.success.call(this,file, serverData);
		},
		//上传完成时，在upload_success_handler之后触发
		upload_complete_handler : o.upload_complete_handler||function(file, serverData){
		},
		//当文件选取对话框弹出前出发的事件处理函数
		file_dialog_start_handler : o.file_dialog_start_handler||function(numberSelected, numberQueued){
		},
		//当文件选取对话框关闭后触发的事件处理函数
		file_dialog_complete_handler : o.file_dialog_complete_handler||function(numberSelected, numberQueued){
		},
		//在flash初始化完成之后 	没有参数
		swfupload_loaded_handler:o.swfupload_loaded_handler||function(){
		}
	};
}
;
$G.upflie=function(o){
	return new SWFUpload(upimgfn(o));
	//upFileObj.startUpload();
};