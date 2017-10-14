(function($) {
//全局配置文件
var h5Options='';
//当前上上传文件属性
var h5CurrentUploadFile = {totalSlice:0, currentSlice:0, currentIndex:0, tmpName:''};
//需要生成控件的按钮
var h5UploadBtn = '';
//生成的id
var h5UploadId = '';
//文件列表
var fileList = '';
//文件上传列表
var fileUploadList = '';
//当前上传文件
var fileCurrentDeal = 0;
//已上传文件列表
var fileUploadedList = [];
//当前已上传文件
var currentFileUploaded = {};
//限制文件列表
var fileLimitList = [];
//文件总数
var fileAmount = 0;
//html 5本地文件读取控件
var fileReader = '';
//html 5文件上传控件
var fileXhr = '';
//控件是否已加载
var h5uploader = false;
//当前临时文件名
var h5CurrentTmpname = '';
//方法列表
var methods = {
	init : function() {
		var defaults = {multiple:true,ext:"jpg,png,xml,csv",width:0,height:0,type:"file",url:"html5fileupload.php",
				   fileSliceSize:4194304,showTitle:false,getButton:true};
		defaults.mousewheel = document.all?"mousewheel":"DOMMouseScroll";
		h5Options = $.extend({}, defaults, arguments[0].options);
		var h5UploadWindow = $("#h5-upload-window " + this.selector);
		//初始化响应
		var registerEvents = methods["registerEvents"];
		registerEvents.apply(this, arguments);
		
		if(h5Options.type == "image"){
			var windowTitle = '图片上传';
			var selectText = '选择图片';
			var uploadText = '上传图片';
			if(h5Options.width == 0 || h5Options.height == 0){
				h5Options.width = 160;
				h5Options.height = 90;
			}
		} else {
			var windowTitle = '文件上传';
			var selectText = '选择文件';
			var uploadText = '上传文件';
			if(h5Options.width == 0 || h5Options.height == 0){
				h5Options.width = 140;
				h5Options.height = 96;
			}
		}
		var insertText = '确认';
		if(typeof(h5UploadWindow.html()) != "undefined"){
			h5uploader = true;
		} else {
			var html = '<div id="h5-upload-window" style="display:none;" class="h5-upload-window">' + '<div class="modal">' + 
			'</div><div class="file-window"><div class="menu-bar"><div class="title">' + windowTitle + '</div>' + 
			'<div class="tools"><span class="close"></span></div></div><div class="file-list-area"><div class="file-list"></div>' + 
			'</div><div class="file-footer">&nbsp;<a class="h5-upload-btn-n h5-sz-s" ' + 
			'href="javascript:void(0);" id="h5-select-files">' + selectText + '</a> <a class="h5-upload-btn-n h5-sz-s" ' + 
			'href="javascript:void(0);" id="h5-upload-files">' + uploadText + '</a> <a class="h5-upload-btn-n h5-sz-s" ' + 
			'href="javascript:void(0);" id="h5-insert-files">' + insertText + '</a></div></div>';
			
			if(h5Options.type == "image"){
				html += '<div id="h5-upload-image-deal" class="hidden"><canvas id="h5-upload-image-canvas">' + '</canvas></div></div>';
			} else {
				html += '</div>';
			}
			$("body").append(html);
		}
		//初始化文件列表
		fileList = '';
		//初始化上传列表
		fileUploadList = new Array();
		//初始化文件读取程序
		fileReader = new FileReader();
		//初始化文件传输工具
		fileXhr = new XMLHttpRequest();
		h5UploadBtn = this;
		var h5UploadName = "h5upload_" + h5UploadBtn.attr("name");
		h5UploadId = "h5upload_" + h5UploadBtn.attr("id");
		if(typeof(h5UploadName) == 'undefined' && typeof(h5UploadId) != 'undefined'){
			h5UploadName = h5UploadId;
		} else if(typeof(h5UploadId) == 'undefined' && typeof(h5UploadName) != 'undefined'){
			h5UploadId = h5UploadName;
		} else {
			h5UploadName = h5UploadId = 'upload-tmp-file-tools';
		}
		var multiple = ''; 
		if(h5Options['multiple']){
			multiple = " multiple=true ";
		}
		//生成上传控件代码
		if(h5Options.getButton){
			//隐藏调用上传控件的元素
			this.hide();
			var html = '<div style="width:300px;"><div class="h5-upload-block"><div class="h5-upload-fileinfo">' + 
			'</div><div ><a class="h5-upload-button h5-sz-b" href="javascript:void(0);" >上传文件</a></div>' +
			'<div id="images-div"> </div>' +
			'</div></div><div id="h5-upload-uptools" style="display:none;"><input type="file" id="' + 
				h5UploadId  + '" name="' + h5UploadName + '"' + multiple + ' /></div>';
			this.after(html);
		} else {
			this.addClass("h5-upload-show-btn");
			var html = '<div id="h5-upload-uptools" style="display:none;"><input type="file" id="' + 
			h5UploadId  + '" name="' + h5UploadName + '"' + multiple + ' /></div>';
			this.after(html);
		}
		//初始化控件响应
		var e = events['init'];
		e.apply(this);
	},

	//记录不允许上传文件
	removeDisallowFiles : function(){
		var file = '';
		var ext = h5Options.ext.split(',');
		var m = methods['getFileExt'];
		var fileExt = '';
		for(i=0,j=fileList.length; i<j; i++){
			file = fileList[i];
			fileExt = m.apply(this, [file.name]);
			if(jQuery.inArray(fileExt, ext) == -1){
				var e = events['onDisallowFiles'];
				e.apply(this, [file.name]);
				fileLimitList.push(i);
			}
		}
	},
	
	//添加文件
	addFileBlock : function(file){
		var html = '';
		var title = '';
		var blockWidth = h5Options.width;
		for(i=0,j=fileList.length; i<j; i++){
			if(jQuery.inArray(i, fileLimitList) != -1){
				continue;
			}
			m = methods['readFile'];
			m.call(this);
			 var h = '<div class="file-info-block" style="width:' + h5Options.width + 'px; height:' + h5Options.height + 'px;">'+
			'<div tmpname="'+fileList[i].tmpname+'" upload="0" class="h5file-info h5-document-icon file-delete">' + 
			'<div class="process-bar" style="display:none;"></div>'+ '<div id="h5-upload-delete" style="display:none;">x</div>' + 
			'</div>$title$</div>';
			if(h5Options.showTitle){
				title = '<div id="file-title-show" style="font-size:12px;height:34px;word-break:break-all;overflow:hidden;}">' + 
				'<div id="title" style="width:' + blockWidth + 'px;">' + fileList[i].name + '</div></div>';
				h = h.replace("$title$", title);
			}
			html += h;
		}
		$("#h5-upload-window .file-list-area .file-list").append(html);
		m.call(this);
	},
	
	addLoading : function(){
		var mt = h5Options.height/2 - 27;
		var blockHeight = h5Options.height+10;
		var blockWidth = h5Options.width+10;
		if(h5Options.showTitle){
			blockHeight += 32;
		}
		var loadingBlock = '<div class="file-info-block" style="width:' + blockWidth + 'px;height:' + blockHeight + 'px;' +
		'"><div id="file-img-loading" class="file-img" style="width:' + h5Options.width + 'px;height:' + h5Options.height + 
		'px;text-align:center;">' + '<div style="margin:0 auto; width:54px;height:54px; margin-top:' +
		mt + 'px;" class="ball-scale-ripple">' + '<div></div></div>&nbsp;' + '</div>$title$</div>';

		for(i=0,j=fileList.length; i<j; i++){
			if(jQuery.inArray(i, fileLimitList) != -1){
				continue;
			}
			var title = '';
			if(h5Options.showTitle){
				title = '<div id="file-title-show" style="font-size:12px;height:34px;word-break:break-all;overflow:hidden;}">' + 
				'<div id="title" style="width:' + blockWidth + 'px;">' + fileList[i].name + '</div></div>';
				
			}
			var loading = loadingBlock.replace("$title$", title);
			$("#h5-upload-window .file-window .file-list").append(loading);
		}
		m = methods['readFile'];
		m.call(this);
		
	},

	readFile : function(){
		//文件读取完毕后初始化参数
		if(!(fileCurrentDeal < fileAmount)){
			fileCurrentDeal = 0;
			fileLimitList = [];
			return true;
		}
		//查看当前文件是否为允许上传的格式
		if(jQuery.inArray(fileCurrentDeal, fileLimitList) == -1){
			var file = fileList[fileCurrentDeal++];
			var date = new Date();
			file.tmpname = date.getTime() + "" + parseInt(Math.random()*10000) + ".tmp";
			var symbolIndex = file.type.indexOf("/");
			//var type = file.type.substring(0, symbolIndex);
			h5CurrentTmpname = file.tmpname;
			switch(h5Options.type){
				case "image":
					fileReader.readAsDataURL(file);
					fileReader.onloadend = events['onImageLoadend'];
					break;
				case "file":
					
					break;
			}
			fileUploadList.push(file);
		} else {
			fileCurrentDeal++;
			var m = methods['readFile'];
			m.call(this);
		}
	},

	dealImage : function(imageData){
		//初始化图像
		var image = new Image();
		image.src = imageData;
		//图片加载完成后进行图像处理
		image.onload = events['onImageReady'];
	},
	
	//文件上传
	uploadFile : function(){
		//文件上传禁止点击上传按钮
		$("body").off("click", ".h5-upload-window .file-footer #h5-select-files");
		if(fileUploadList.length > 0 && h5CurrentUploadFile.totalSlice == 0){
			h5CurrentUploadFile.file = fileUploadList.shift();
			h5CurrentUploadFile.totalSlice = Math.ceil(h5CurrentUploadFile.file.size/h5Options.fileSliceSize);
			h5CurrentUploadFile.currentSlice = 0;
			h5CurrentUploadFile.currentIndex++;
			//零时保存文件名
			h5CurrentUploadFile.tmpName = h5CurrentUploadFile.file.tmpname;
		}
		if(h5CurrentUploadFile.totalSlice > 0 && h5CurrentUploadFile.totalSlice > h5CurrentUploadFile.currentSlice){
			var startSlice = h5CurrentUploadFile.currentSlice * h5Options.fileSliceSize;
			var endSlice = ++h5CurrentUploadFile.currentSlice * h5Options.fileSliceSize;
			//文件分段上传
			var file = h5CurrentUploadFile.file.slice(startSlice, endSlice);
			var m = methods['sendFile'];
			m.apply(this, [file]);
		} else {
			//所有文件上传完毕后触发事件
			var e = events['allFileUploaded'];
			e.apply(this, [fileUploadedList]);
			h5CurrentUploadFile.file = '';
			h5CurrentUploadFile.totalSlice = 0;
			h5CurrentUploadFile.currentSlice = 0;
			//文件上传完毕重新绑定上传按钮
			$("body").on("click", ".h5-upload-window .file-footer #h5-select-files", function() {
				$("#h5-upload-uptools #" + h5UploadId).trigger("click");
			});
		}
	},
	
	//发送源码至服务器
	sendFile : function(file){
		var formData = new FormData();
		//是否为文件最后一个分段
		if(h5CurrentUploadFile.totalSlice == h5CurrentUploadFile.currentSlice){
			var m = methods['getFileExt'];
			formData.append("isFinal", true);
			formData.append("extname", m.apply(this, [h5CurrentUploadFile.file.name]));
			formData.append("filename", h5CurrentUploadFile.file.name);
			$(".file-window .file-list .h5file-info[upload=0]:first").attr('upload', 1);
		}
		formData.append("tmpName", h5CurrentUploadFile.tmpName);
		formData.append("type", h5Options.type);
		formData.append("file", file);
		fileXhr.open("POST", h5Options['url'], true);
		fileXhr.send(formData);
	},
	
	//获得文件扩展名
	getFileExt : function(filename){
		var symbolIndex = filename.lastIndexOf(".");
		if(symbolIndex){
			return filename.substr(symbolIndex+1);
		}
		return '';
	},
	
	//初始化响应
	registerEvents : function(){
		if(typeof(arguments[0].fileUploaded) != "undefined"){
			events.fileUploaded = arguments[0].fileUploaded;
		}
		if(typeof(arguments[0].allFileUploaded) != "undefined"){
			events.allFileUploaded = arguments[0].allFileUploaded;
		}
		if(typeof(arguments[0].noFileUpload) != "undefined"){
			events.noFileUpload = arguments[0].noFileUpload;
		}
		if(typeof(arguments[0].onInsertFiles) != "undefined"){
			events.onInsertFiles = arguments[0].onInsertFiles;
		}
		if(typeof(arguments[0].onBeforeShow) != "undefined"){
			events.onBeforeShow = arguments[0].onBeforeShow;
		}
		if(typeof(arguments[0].onAfterDeleteUploadedFile) != "undefined"){
			events.onAfterDeleteUploadedFile = arguments[0].onAfterDeleteUploadedFile;
		}
		if(typeof(arguments[0].onAfterClose) != "undefined"){
			events.onAfterClose = arguments[0].onAfterClose;
		}
		if(typeof(arguments[0].onDisallowFiles) != "undefined"){
			events.onDisallowFiles = arguments[0].onDisallowFiles;
		}
		
	},
	
	//关闭窗口
	close : function(){
		$(".h5-upload-window").hide();
		var m = methods["clear"];
		m.call(this);
		var e = events["onAfterClose"];
		e.call(this);
	},
	
	//打开窗口
	open : function(){
		var event = events['onBeforeShow'];
		event.call(this);
		$("#h5-upload-window").show();
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		var uploadHeight = $("#h5-upload-window .file-window").height();
		var uploadWidth = $("#h5-upload-window .file-window").width();
		var top = 0;
		if(uploadHeight > windowHeight){
			top = 20;
		} else {
			top = (windowHeight - uploadHeight) / 2;
		}
		$("#h5-upload-window .file-window").css("top", top);
		var left = 0;
		if(windowWidth < uploadWidth){
			left = 10;
		} else {
			left = (windowWidth - uploadWidth) / 2;
		}
		$("#h5-upload-window .file-window").css("left", left);
	},
	
	//清楚所上传文件
	clear : function(){
		fileList = '';
		fileUploadList = new Array();
		fileCurrentDeal = 0;
		fileUploadedList = [];
		currentFileUploaded = {};
		fileAmount = 0;
		h5CurrentTmpname = '';
		$("#h5-upload-window .file-list").html("");
	},
	
	//销毁窗口
	destroy : function(){
		$("#h5-upload-window").remove();
		$("body").off();
		$("#h5-upload-uptools").remove();
	}
};
//响应列表
var events = {
	init : function(){
		//控件未加载不进行初始化
		if(h5uploader){
			return false;
		}
		//初始化窗口
		$("body").on("click", ".h5-upload-button,.h5-upload-show-btn",function(){
			var m = methods["open"];
			m.call(this);
		});
		
		//窗口关闭
		$("body").on("click", ".h5-upload-window .tools .close", function(){
			var m = methods["close"];
			m.call(this);
		});
		//鼠标移入
		$("body").on("mouseenter", ".h5-upload-window .tools .close", function(){
			$(this).css("background-color", "#CC0033");
		});
		$("body").on("mouseleave", ".h5-upload-window .tools .close", function(){
			$(this).css("background-color", "");
		});
		//文件鼠标移入
		$("body").on("mouseover", ".h5-upload-window .file-list .file-delete", function(){
			var deleteBtn = $(this).find("#h5-upload-delete");
			deleteBtn.show();
		});
		$("body").on("mouseenter", ".h5-upload-window .file-list .file-delete #h5-upload-delete", function(){
			$(this).css("color", "#F00");
		});
		//文件鼠标移出
		$("body").on("mouseout", ".h5-upload-window .file-list .file-delete", function(){
			$(this).find("#h5-upload-delete").hide();
		});
		$("body").on("mouseleave", ".h5-upload-window .file-list .file-delete #h5-upload-delete", function(){
			$(this).css("color", "#000");
		});
		//点击删除上传
		$("body").on("click", ".h5-upload-window .file-list .h5file-info[upload=0] #h5-upload-delete", function(){
			var index = $(this).parents("div").index(".h5-upload-window .file-list .h5file-info[upload=0]");
			var e = events['onDeleteUploadFile'];
			e.apply(this, [index]);
		});
		
		$("body").on("click", ".h5-upload-window .file-list .h5file-info[upload=1] #h5-upload-delete", function(){
			var index = $(this).parents("div").index(".h5-upload-window .file-list .h5file-info[upload=1]");
			var file = fileUploadedList[index];
			var e = events['onDeleteUploadedFile'];
			e.apply(this, [index]);
			e = events["onAfterDeleteUploadedFile"];
			e.apply(this, [file]);
		});
		//文件名动态展示
		$("body").on("mouseenter", ".h5-upload-window .file-list div[id='file-title-show']", function() {
			var a = animates['titleUp'];
			a.apply(this, [$(this)]);
		});
		
		$("body").on("mouseleave", ".h5-upload-window .file-list div[id='file-title-show']", function() {
			var a = animates['titleDown'];
			a.apply(this, [$(this)]);
		});
		
		$("body").on("click", ".h5-upload-window .file-footer #h5-insert-files", function(){
			var e = events['onInsertFiles'];
			e.apply(this, [fileUploadedList]);
			return true;
			var html = '';
			if(fileUploadedList.length < 1){
				alert("请上传图片后再插入图片");
				return false;
			}
			var index = $("#images-div div:last").index() + 1;
			for(i=0,j=fileUploadedList.length; i<j; i++){
				html += '<div id="news-image-block"><div style="left"><img src="' + fileUploadedList[i] + '" style="width:160px;margin-top:10px;"/>' +
				'</div>' + '<div style="right">' + '<a href="javascript:void(0);" id="image-details-up">上移</a>'
				+ ' <a href="javascript:void(0);" id="image-details-down">下移</a>' + 
				' <a href="javascript:void(0);" imageUrl="' + fileUploadedList[i] + '" id="image-details-delete">删除</a>' + '</div>' +
				'<p>图片描述：</p><textarea id="details" style="width:450px;height:150px;margin-top:5px;" name="' +
				'details[' + index + ']"></textarea>' + '<input type="hidden" id="image" value="' + fileUploadedList[index] + '" name="images['+ index + ']" />' +
				'<input id="sort" type="hidden" name="sorts['+ index + ']" value="' + (++index) + '" /></div>';			
			}
			$("#images-div").append(html);
			fileUploadedList = [];
			$(".file-window .file-list .file-img[upload=1]").remove();
			$(".h5-upload-window").hide();
		});
		//窗口移动
		$("body").on("mousedown", ".h5-upload-window .menu-bar .title", function(e){
			if(e.button != 0){
				return false;
			}
			var width = $(".h5-upload-window .file-window").width();
			var height = $(".h5-upload-window .file-window").height();
			var offset = $(".h5-upload-window .file-window").offset();
			var border = ($(".h5-upload-window .file-window").outerWidth() - width) / 2;
			var html = '<div id="h5-upload-window-move" style="cursor:default;background-color:none;border:3px solid #CCCCCC;position:absolute;width:' + (width
			+ border) + 'px; height:' + height + 'px; top:' + offset.top + 'px; left:' + offset.left + 'px;z-index:10;"></div>';
			$(".h5-upload-window").append(html);
			var mouseTop = e.pageY;
			var mouseLeft= e.pageX;
			$(".h5-upload-window").addClass("h5-no-select");
			$(window).bind("mousemove", function(e){
				var moveTop = offset.top + e.pageY - mouseTop;
				var moveLeft = offset.left + e.pageX - mouseLeft;
				$("#h5-upload-window-move").css({left:moveLeft, top:moveTop});
				return false;
			});
			$(window).bind("mouseup", function(){
				var newOffset = $("#h5-upload-window-move").offset();
				var windowPosition = $(".h5-upload-window .file-window").position();
				var top = newOffset.top - offset.top + windowPosition.top;
				var left = newOffset.left - offset.left + windowPosition.left;
				if(top >= 0){
					$(".h5-upload-window .file-window").css({top:top, left:left});
				}
				$(".h5-upload-window").removeClass("h5-no-select");
				$(window).unbind("mousemove");
				$(window).unbind("mouseup");
				$("#h5-upload-window-move").remove();
				return false;
			});
		});
		//选择需要上传的问题
		$("body").on("click", ".h5-upload-window .file-footer #h5-select-files", function() {
			$("#h5-upload-uptools #" + h5UploadId).trigger("click");
		});
		
		//文件上传
		$("body").on("click", ".h5-upload-window .file-footer #h5-upload-files", function() {
			if(fileUploadList.length < 1){
				var e = events['noFileUpload'];
				e.call(this);
				return false;
			}
			//文件上传
			var m = methods['uploadFile'];
			m.call(this);
		});
		
		//读取文件
		$("body").on("change", "#h5-upload-uptools input[id='" + h5UploadId + "']", function() {
			fileList = $(this)[0].files;
			fileAmount = fileList.length;
			var m = '';
			//去除不允许上传格式文件
			m = methods['removeDisallowFiles'];
			m.call(this);
			if(h5Options.type == "image"){
				var m = methods['addLoading'];
				m.call(this);
			} else if(h5Options.type == "file"){
				var m = methods['addFileBlock'];
				m.call(this);
			}
			/* m = methods['readFile'];
			m.call(this); */
		});
		
		//事件注册
		fileXhr.upload.onprogress = function(event){
			var e = events['fileUploadProgress'];
			e.apply(this, [event]);
		};
		fileXhr.onloadend = function(event){
			var e = events['fileUploadNext'];
			e.apply(this, [event]);
		};
		fileXhr.onreadystatechange = function(event){
			var e = events['fileXhrReadyStateChange'];
			e.apply(this, [e]);
		}
	},
	
	//关闭窗口
	onAfterClose : function(e){
		
	},

	//图片加载完成
	onImageLoadend : function(e){
		var m = methods["dealImage"];
		m.apply(this, [this.result]);
	},

	onImageReady : function(){
		var imageCanvas = $(".h5-upload-window #h5-upload-image-canvas");
		var imageDeal = null;
		var width = this.width;
		var height = this.height;
		var setWidth = h5Options.width;
		var setHeight = h5Options.height;
		var imageData = this.src;
		//获得图片类型
		var subStart = imageData.indexOf(":") + 1;
		var subEnd = imageData.indexOf(";");
		var type = imageData.substr(subStart, (subEnd - subStart));
		//初始化Canvas用于图片处理
		imageCanvas = imageCanvas[0];
		if(imageCanvas.getContext){
			imageDeal = imageCanvas.getContext("2d");
		}
		//按比例缩放
		if(width/height >= setWidth/setHeight){
			var ratio = width / setWidth;
			width = setWidth;
			height /= ratio;
		} else {
			var ratio = height / setHeight;
			width /= ratio;
			height = setHeight;
		}
		imageCanvas.width = width;
		imageCanvas.height = height;
		//重新绘制图片
		imageDeal.drawImage(this, 0, 0, width, height);
		//获得所绘制图片
		var canvasImg = imageCanvas.toDataURL();
		//处理完成后将图片放入预览框
		var img = '<img src="' + canvasImg + '"/>';
		var html = '<div upload="0" tmpname=' + h5CurrentTmpname + ' class="h5file-info file-img file-delete" style="width:' + h5Options.width + 'px;height:' +
		h5Options.height + 'px;line-height:' + h5Options.height + 'px;text-align:center;text-align: center;">' + img + 
		'<div id="h5-upload-delete" style="display:none;">x</div><div class="process-bar" style="display:none;"></div></div>';
		//移除读取提示
		$(html).replaceAll(".file-window .file-list #file-img-loading:first");
		//处理下一文件
		var m = methods['readFile'];
		m.call(this);
	},
	
	//处理文件上传响应
	fileXhrReadyStateChange : function(event){
		//文件上传完成后触发（分段上传则为最后一段上传完成后触发）
		if(h5CurrentUploadFile.totalSlice == h5CurrentUploadFile.currentSlice && fileXhr.readyState == 4){
	        //判断对象状态是否交互成功,如果成功则为200  
	        if(fileXhr.status == 200) {
	            //接收数据,得到服务器输出的纯文本数据  
	            var response = jQuery.parseJSON(fileXhr.responseText);
	            var jsonData = {path:response.path, filename:response.filename};
	            fileUploadedList.push(jsonData);
	            currentFileUploaded = jsonData;
	        } 
	    }
	},
	
	//处理文件上传进度事件
	fileUploadProgress : function(event){
		$("#h5-upload-window .process-bar").show();
		//计算占比
		var uploadParent = event.loaded / event.total / h5CurrentUploadFile.totalSlice * 100 * h5CurrentUploadFile.currentSlice;
		var tmpname = h5CurrentUploadFile.tmpName;
		if(h5CurrentUploadFile.totalSlice == h5CurrentUploadFile.currentSlice && uploadParent<100 && event.loaded == event.total){
			uploadParent = 100;
		}
		$("#h5-upload-window div[tmpname='" + tmpname + "'] .process-bar").css("width", uploadParent+"%");
	},
	
	//文件上传完成，开始下一个文件上传
	fileUploadNext : function(event){
		//上传完文件最后一个分段后重置
		if(h5CurrentUploadFile.totalSlice <= h5CurrentUploadFile.currentSlice){
			h5CurrentUploadFile.totalSlice = 0;
			//文件上传完成触发
			var e = events['fileUploaded'];
			e.apply(this,[currentFileUploaded]);
		}
		var m = methods['uploadFile'];
		m.call(this);
	},
	
	//单个文件上传完毕
	fileUploaded : function(file){
		//console.log(file);
	},
	
	//窗口初始化之前
	onBeforeShow : function(){
		
	},
	
	//所有文件上传完毕
	allFileUploaded : function(files){
		//console.log(file);
	},
	
	//没有文件上传
	noFileUpload : function(){
		if(h5Options.type == "image"){
			alert("请选择需要上传的图片");
		} else if(h5Options.type == "file"){
			alert("请选择需要上传的文件");
		}
	},
	
	//点击插入按钮
	onInsertFiles : function(files){
		if(files.length < 1){
			alert("请上传图片后再确认");
			return false;
		}
	},
	
	//删除准备上传文件
	onDeleteUploadFile : function(index){
		fileUploadList.splice(index, 1);
		$(this).parents(".file-info-block").remove();
	},
	
	//删除已上传文件
	onDeleteUploadedFile : function(index){
		fileUploadedList.splice(index, 1);
		$(this).parents(".file-info-block").remove();
	},
	
	onAfterDeleteUploadedFile : function(file){
		
	},
	
	onDisallowFiles : function(name){
		alert("您上传的文件“" + name + "”格式不支持");
	}
};

//处理动画完毕效果
var animates = {
		//标题升起
		titleUp : function(target){
			var height = target.height();
			var child =  target.children("#title");
			var childrenHeight = child.height();
			child.stop(false, true);
			if(height < childrenHeight){
				//动画快速结束
				$("body").bind(h5Options.mousewheel, function() {
					child.stop(false, true);
				});
				child.css("background-color", "#fff");
				child.css("opacity", 0.9);
				var value = height-childrenHeight;
				target.css({height:(height-value), marginTop:value+"px"});
				child.css("margin-top", -value);
				child.animate({
					marginTop: '0px'
				}, 300, function() {
				});
			}
		},
		
		//标题降下
		titleDown : function(target){
			var parent = target;
			var moveTop = parseInt(parent.css("margin-top"));
			var child = target.children("#title");
			child.stop(false, true);
			if(moveTop != 0){
				target.unbind(h5Options.mousewheel);
				child.animate({
					marginTop: -moveTop + 'px'
				}, 300, function() {
					var height = parent.height()+moveTop > 32 ? parent.height()+moveTop : 32;
					parent.css({height:height, marginTop:"0px"});
					child.css("margin-top", 0);
					child.css("background-color", "");
					child.css("opacity", 1);
				});
			}
		}
}
$.fn.h5file = function() {
	var m = '';
	if(arguments[0].length > 1){
		m = methods[arguments[0]];
		if(!m){
			 $.error( '调用的方法' +  arguments[0] + '不存在' );
	         return this;
		}
	} else {
		m = methods['init']
	}
	return m.apply(this, arguments);		
};
})(jQuery);