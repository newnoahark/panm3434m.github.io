// $Id: jquery.labphp.js $

/**
 * 选择/取消 所有复选框
 */
(function($) {
	
	$.fn.chkall = function(objs) {

		return $(this).click(function() {

			var checked = this.checked;
			$(objs).each(function() {

				this.checked = checked;
			});
		});
	}

})(jQuery);

(function($) {

	function switcher(obj) {

		var config = $.data(obj, "labSwitcher").config;

		if ($(obj).hasClass(config.down)) {
			$(obj).removeClass(config.down).addClass(config.up);
		}
		else if ($(obj).hasClass(config.up)) {
			$(obj).removeClass(config.up).addClass(config.down);
		}

		else if ($(obj).hasClass(config.right)) {
			$(obj).removeClass(config.right).addClass(config.left);
		}
		else if ($(obj).hasClass(config.left)) {
			$(obj).removeClass(config.left).addClass(config.right);
		}
	}

	$.fn.labSwitcher = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labSwitcher.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labSwitcher = $.data(this, "labSwitcher");
			var _this = this;
			if ($labSwitcher) {
				$.extend($labSwitcher.options, config);
			}
			else {
				$labSwitcher = $.data(this, "labSwitcher", {
					config: $.extend({}, $.fn.labSwitcher.defaults, config),
					handle: null
				});
			}
		});
	};

	$.fn.labSwitcher.methods = {
		configuration: function(jq) {

			return $.data(jq[0], "labSwitcher").config;
		},
		switcher: function(jq) {

			return switcher(jq[0]);
		}
	};

	$.fn.labSwitcher.defaults = {
		up: "switcher-up",
		down: "switcher-down",
		left: "switcher-left",
		right: "switcher-right",
		hover: true
	};

})(jQuery);

/**
 * labToggle
 */
(function($) {

	function switcher(obj) {

		var config = $.data(obj, "labToggle").config;
		var $obj = $(obj);

		if (config.switcher) {
			var $switcher = $(obj).children(config.switcher);
			if ($switcher.length == 0) {
				$switcher = $(obj).children(":first").children(config.switcher);
			}
			$switcher.labSwitcher('switcher');
		}

	}

	function isOpen(obj) {

		var data = $.data(obj, "labToggle");
		if (!data) {
			return false;
		}
		var config = data.config;

		return $(obj).children('.sub').is(":visible") && parseInt($(obj).children('.sub').css('opacity')) == 1 || config.refer && $(config.refer).is(":visible") && parseInt($(config.refer).css('opacity'));
	}

	function show(obj) {

		var config = $.data(obj, "labToggle").config;
		var $obj = $(obj);

		$obj.addClass('hover');
		switch (config.animate) {
			case 'fade':
				$obj.children('.sub').fadeIn(config.speed);
				if (config.refer) {
					$(config.refer).fadeIn(config.speed);
				}
				break;
			default:
				$obj.children('.sub').show(config.speed);
				if (config.refer) {
					$(config.refer).show(config.speed);
				}
		}

		config.onShow.call(obj);
		return $(obj);
	}

	function hide(obj) {

		var config = $.data(obj, "labToggle").config;
		var $obj = $(obj);

		$obj.removeClass('hover');
		switch (config.animate) {
			case 'fade':
				$obj.children('.sub').show(config.speed);
				if (config.refer) {
					$(config.refer).fadeOut(config.speed);
				}
				break;
			default:
				$obj.children('.sub').hide(config.speed);
				if (config.refer) {
					$(config.refer).hide(config.speed);
				}
		}

		return $(obj);
	}

	$.fn.labToggle = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labToggle.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labToggle = $.data(this, "labToggle");
			var _this = this;
			if ($labToggle) {
				$.extend($labToggle.options, config);
			}
			else {
				$labToggle = $.data(this, "labToggle", {
					config: $.extend({}, $.fn.labToggle.parseOptions(this), config),
					handle: null
				});

				if ($labToggle.config.switcher) {
					var $switcher = $(this).children($labToggle.config.switcher);
					if ($switcher.length == 0) {
						$switcher = $(this).children(":first").children($labToggle.config.switcher);
					}

					$switcher.labSwitcher();
				}

				hide(this);

				if ($labToggle.config.hover) {

					$(this).hover(function(e) {

						// $labToggle.handle = setTimeout(function() {

						show(_this);
						switcher(_this);
						// }, 0);

						// e.stopPropagation();
					}, function(e) {

						// clearTimeout($labToggle.handle);
						hide(this);
						switcher(_this);
						// e.stopPropagation();
					});
				}
				else {
					$(this).click(function(e) {

						$(this).toggleClass("active");
						$(this).toggleClass('hover');
						$(this).children(".sub").toggle();
						if ($labToggle.config.refer) {
							$($labToggle.config.refer).toggle();
						}
						switcher(_this);
					});

					$(document).click(function(e) {

						if (isOpen(_this)) {
							if ($(e.target).closest(_this).length == 0) {
								switcher(_this);
								hide(_this);
							}
						}
					});
				}
			}
		});
	};

	$.fn.labToggle.methods = {
		configuration: function(jq) {

			return $.data(jq[0], "labToggle").config;
		},
		hide: function(jq) {

			return hide(jq[0]);
		},
		show: function(jq) {

			return show(jq[0]);
		}
	};

	$.fn.labToggle.parseOptions = function(obj) {

		return $.extend({}, $.fn.labToggle.defaults, $.parser.parseOptions(obj, [{
			hover: "boolean",
			refer: "string",
			speed: 'stringt',
			animate: 'string'
		}]));
	};

	$.fn.labToggle.defaults = {
		hover: false,
		refer: "",
		speed: 0,
		animate: null,
		switcher: null,
		onShow: function() {

		},
		onHide: function() {

		}
	};

})(jQuery);

/**
 * labDropdown
 */
(function($) {

	$.fn.labDropdown = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labDropdown.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labDropdown = $.data(this, "labDropdown");
			var _this = this;
			if ($labDropdown) {
				$.extend($labDropdown.options, config);
				$(this).labToggle(config);
			}
			else {
				$labDropdown = $.data(this, "labDropdown", {
					config: $.extend({}, $.fn.labDropdown.parseOptions(this), config),
					handle: null
				});

				$(this).labToggle($.extend({
					switcher: ".switcher"
				}, config));
			}
		});
	};

	$.fn.labDropdown.methods = {
		configuration: function(jq) {

			return $.data(jq[0], "labDropdown").config;
		},
		hide: function(jq) {

			return hide(jq[0]);
		},
		show: function(jq) {

			return show(jq[0]);
		}
	};

	$.fn.labDropdown.parseOptions = function(obj) {

		return $.extend({}, $.fn.labToggle.parseOptions(obj), $.fn.labDropdown.defaults, $.parser.parseOptions(obj, [{}]));
	};

	$.fn.labDropdown.defaults = {};
})(jQuery);

/**
 * labSelect
 */
(function($) {

	function empty(obj) {

		removeOptions(obj);
		removeSelected(obj);
	}

	function removeOptions(obj) {

		var config = $.data(obj, "labSelect").config;

		$(obj).children(config.sub).find('.option').remove();
	}

	function loadOptions(obj) {

		var data = $.data(obj, "labSelect");
		var config = data.config;

		if (!config.multi && config.initText && $(obj).children(config.sub).find('.option').first().attr(config.optionsValue)) {

			insertOption(obj, config.initValue, config.initText, 0);
		}

		var rows = [];
		var i = 0;
		$(obj).children(config.sub).find('.option').each(function() {

			var val = $(this).attr(config.optionsValue);
			var text = $(this).find(config.optionsText).length > 0 ? $(this).find(config.optionsText).text() : $(this).text();

			if ($(this).attr(config.optionsValue)) {
				eval('rows[i++] = {' + config.keyColumn + ': "' + val + '",' + config.textColumn + ': "' + text + '"};');
			}
			$(this).click(function() {

				select(obj, this)
			});
		});

		data.config.rows = rows.length > 0 ? rows : null;
		$.data(obj, "labSelect", data);
	}

	function loadData(obj, url, param) {

		var data = $.data(obj, "labSelect");
		var config = data.config;

		if (url) {
			data.config.url = url;
		}

		if (param) {
			data.config.param = param;
		}

		if (!data.config.url) {
			loadOptions(obj);
			setValue(obj, data.config.value);
			return $(obj);
		}

		var load = data.config.loader.call(obj, function(rows) {

			data.config.rows = rows;

			$.data(obj, "labSelect", data);

			empty(obj);

			parseData(obj);

			setValue(obj, data.config.value);

			return $(obj);
		}, function() {

			data.config.onLoadError.apply(obj, textStatus);
			return $(obj);
		});

	}

	function parseData(obj) {

		var data = $.data(obj, "labSelect");
		var config = data.config;
		var multi = data.multi;

		if (!multi && config.initText) {

			addOption(obj, config.initValue, config.initText);
		}

		if (config.rows) {
			$.each(config.rows, function(i, row) {

				addOption(obj, row[config.keyColumn], row[config.textColumn]);
			});
		}
	}

	function insertOption(obj, key, text, index) {

		var data = $.data(obj, "labSelect");
		var config = data.config;
		var multi = data.multi;
		var $container = config.optionsContainer ? $(obj).children(config.sub).find(config.container) : $(obj).children(config.sub);

		var $option = $(config.options).addClass(config.optionsClass).attr(config.optionsValue, key).append($("<a></a>").addClass(config.optionsText).attr('href', 'javascript:;').text(text)).click(function() {

			select(obj, this);
		});

		if (multi && $.isArray(config.value) && $.inArray(key, config.value) >= 0 || config.value == key || config.value == null && !key) {
			$option.addClass('active');
		}
		$container.find('.option').eq(index).before($option);

		return true;
	}

	function addOption(obj, key, text) {

		var data = $.data(obj, "labSelect");
		var config = data.config;
		var multi = data.multi;
		var $container = config.optionsContainer ? $(obj).children(config.sub).find(config.container) : $(obj).children(config.sub);

		var $option = $(config.options).addClass(config.optionsClass).attr(config.optionsValue, key).append($("<a></a>").addClass(config.optionsText).attr('href', 'javascript:;').text(text)).click(function() {

			select(obj, this);
		});

		if (multi && $.isArray(config.value) && $.inArray(key, config.value) >= 0 || config.value == key || config.value == null && !key) {
			$option.addClass('active');
		}
		$container.append($option);

		return true;
	}

	function showCaption(obj) {

		var data = $.data(obj, "labSelect");

		if (data.config.caption) {
			$(obj).find(data.config.selected).text(data.config.caption);
		}
	}

	function hideCaption(obj) {

		var data = $.data(obj, "labSelect");
		$(obj).find(data.config.selected).text('');
	}

	function setValue(obj, value) {

		var data = $.data(obj, "labSelect");
		var config = data.config;
		var multi = data.multi;
		var $container = $(obj).find(config.selected);

		if (!config.caption) {
			data.config.caption = $container.text();
		}

		if (!data.config.caption) {
			data.config.caption = config.initText;
		}

		$.data(obj, 'labSelect', data);

		if (!value || $.isArray(value) && value.length == 0) {
			removeSelected(obj);
		}
		else if (config.rows) {
			$.each(config.rows, function(key, val) {

				if ($.isArray(value) && value.indexOf(val[config.keyColumn]) >= 0 || val[config.keyColumn] == value) {
					addSelected(obj, val[config.keyColumn], val[config.textColumn]);
					if (!multi) {
						return false;
					}
					else if ($.isArray(value)) {
						value.remove(val[config.keyColumn]);

						if (value.length == 0) {
							return false;
						}
					}
				}
			});
		}

		return $(obj);
	}

	function addSelected(obj, value, text) {

		var data = $.data(obj, "labSelect");
		var config = data.config;
		var multi = data.multi;
		var $container = $(obj).find(config.selected);
		var $selected = $container.find("li");
		var select_name = multi ? config.selectName + "[]" : config.selectName;

		// 多选数量限制
		if (multi && $.isNumeric(config.size) && $selected.length >= config.size) {
			config.onSelectError.call(obj, "最多只能选择 " + config.size + " 项");
			return false;
		}

		// 忽略已选
		var selected = false;
		$.each($selected, function() {

			if ($(this).find("input").val() == value) {
				selected = true;
				return false;
			}
		});
		if (selected) {
			return false;
		}

		$selected_item = $("<li></li>").text(text).append($("<input>").val(value).attr("type", 'hidden').attr("name", select_name));

		if (multi) {
			$selected_item.click(function() {

				unSelect(obj, this);
				return false;
			});
			if ($container.find("li").length == 0) {
				$container.empty();
			}
			$container.append($selected_item);
		}
		else {
			$container.empty().append($selected_item);
		}

		return true;
	}

	function removeSelected(obj) {

		var data = $.data(obj, "labSelect");
		$(obj).find(data.config.selected).empty();
		showCaption(obj);
	}

	function select(obj, selected) {

		var data = $.data(obj, "labSelect");
		var config = data.config;

		var value = $(selected).attr(config.optionsValue);
		var text = $(selected).find("." + config.optionsText).text() || $(obj).text();

		if (!value) {
			removeSelected(obj);
			if (data.child) {
				data.child.labSelect('empty');
			}
			return $(obj);
		}
		else {
			addSelected(obj, value, text);
		}

		if (data.child) {
			data.child.labSelect('reload', {
				url: '',
				param: {
					id: value
				}
			});
		}
	}

	function unSelect(obj, unSelected) {

		var data = $.data(obj, "labSelect");
		var config = data.config;
		var $container = $(obj).find(config.selected);

		$(unSelected).remove();

		if ($container.find("li").length == 0) {
			showCaption(obj);
		}
	}

	function getSelect(obj, value, type) {

		var data = $.data(obj, "labSelect");
		var config = data.config;
		var $container = $(obj).find(config.selected);
		var $selected = $container.find("li");

		type ? 1 : type = 'value';

		if (type == 'index') {
			if (value > $selected.length) {
				return false;
			}
			else {
				return $selected[value];
			}
		}
		else {
			var item = false;
			$.each($selected, function() {

				var val = $(this).find("input").val();
				if (val == value || !val && !value) {
					item = this;
					return false;
				}
			});
			return item;
		}
	}

	function cascade(obj) {

		var data = $.data(obj, "labSelect");
		var config = data.config;
		var cascade = config.cascade;

		if ($.isArray(cascade)) {

			var $child = $("#" + cascade[0].id).length ? $("#" + cascade[0].id) : $(obj).clone().attr('id', config.cascade[0].id);
			var url = cascade[0].url ? cascade[0].url : config.url;
			var value = cascade[0].value ? cascade[0].value : '';
			var config2 = $.extend({}, config, {
				url: url,
				param: config.value ? {
					id: config.value
				} : '',
				value: value,
				load: config.value ? true : false,
				cascade: cascade ? cascade : null
			});
			cascade.shift();
			$(obj).after($child);
			$child.addClass('labSelect').labSelect(config2);
			data.child = $child;
			$.data(obj, "labSelect", data);
		}
		else {

		}
	}

	$.fn.labSelect = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labSelect.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labSelect = $.data(this, "labSelect");
			var _this = this;
			// 如果对象已经存在
			if ($labSelect) {
				$.data(this, "labSelect", {
					config: $.extend($labSelect.config, config),
					multi: $labSelect.multi,
					handle: $labSelect.handle
				});
				$(this).labDropdown($labSelect.config);
			}
			// 对象不存在
			else {
				// 获得是否多选
				var multi = $(this).hasClass("multi");

				// 获得参数
				$labSelect = $.data(this, "labSelect", {
					config: $.extend({}, $.fn.labSelect.parseOptions(this), config),
					multi: multi,
					handle: null
				});

				// 调用labDropdown插件
				$(this).labDropdown($labSelect.config);

				// 处理级联
				if ($labSelect.config.cascade && $labSelect.config.cascade.length > 0) {
					cascade(this);
				}

				// 设置默认提示
				showCaption(this);

				// 非动态加载
				if (!$labSelect.config.load) {
					loadOptions(this);
					setValue(this, $labSelect.config.value);
				}
				// 如果指定了列表项
				else if ($labSelect.config.rows) {
					parseData(this);
					setValue(this, $labSelect.config.value);
				}
				// 如果是动态加载
				else {
					loadData(this);
				}
			}
		});
	};

	$.fn.labSelect.methods = {
		configuration: function(jq) {

			return $.data(jq[0], "labSelect").config;
		},
		loadData: function(jq) {

			return jq.each(function() {

				loadData(this);
			});
		},
		reload: function(jq, param) {

			return jq.each(function() {

				loadData(this, param.url, param.param);
			});
		},
		empty: function(jq) {

			return jq.each(function() {

				empty(this);
			});
		},
		select: function(jq, selected) {

			return jq.each(function() {

				select(this, selected);
			});
		},
		unSelect: function(jq, unSelected) {

			return jq.each(function() {

				unSelect(this, unSelected);
			});
		},
		getSelect: function(jq, value, type) {

			return jq.each(function() {

				getSelect(this, value, type);
			})
		}
	};

	$.fn.labSelect.parseOptions = function(obj) {

		return $.extend({}, $.fn.labDropdown.parseOptions(obj), $.fn.labSelect.defaults, $.parser.parseOptions(obj, [{
			size: "number",
			value: "string",
			text: "string",
			selectName: 'string',
			optionsValue: "string",
			optionsText: "string",
			required: "boolean",
			initText: 'string',
			initValue: 'string',
			param: 'string',
			selectName: 'string',
			url: 'string',
			child: 'string'
		}]));
	};

	$.fn.labSelect.defaults = {
		size: null,
		options: "<li></li>", // 下拉选项
		optionsContainer: '', // 下拉选项容器
		optionsClass: "option submenu", // 下拉选项的样式
		optionsValue: "rel", // 下拉选项的值
		optionsText: "ref", // 下拉选项的文本
		keyColumn: 'id',
		textColumn: 'name',
		selected: ".input ul",
		selectName: 'select',
		value: '',
		initValue: '', // 单选时的默认值
		initText: '', // 单选时的默认文本
		caption: '', // 说明文本，可当成placeholder
		required: false,
		rows: null,
		url: '',
		param: '',
		method: 'get',
		load: true,
		cascade: null,
		child: null,
		loader: function(onSuccess, onError) {

			var config = $(this).labSelect("configuration");

			if (!config.url) {
				return false;
			}
			$.ajax({
				type: config.method,
				url: config.url,
				data: config.param,
				dataType: "json",
				success: function(data) {

					onSuccess(data);
				},
				error: function(XMLHttpRequest, textStatus) {

					onError.apply(this, textStatus);
				}
			});
		},
		onLoadSuccess: function() {

		},
		onLoadError: function() {

		},
		onSelect: function() {

		},
		onSelectError: function(message) {

		},
		onUnSelect: function() {

		},
		onUnSelectError: function(message) {

		},
		onGetSelectError: function(message) {

		}
	};

})(jQuery);

(function($) {

	$.labMasker = {
		masker: null,
		zIndex: 1,
		opacity: 0.4,
		delay: 200,
		windows: 0,
		create: function() {

			var $overlay = $(".lab-window-mask");
			if ($overlay.length == 0) {
				$overlay = $("<div class='lab-window-mask'></div>");
				$("body").append($overlay);

				$overlay.css({
					"display": "none",
					"z-index": this.zIndex,
					opacity: 0
				});
			}

			this.masker = $overlay;
		},
		open: function(zIndex) {

			if (!this.masker) {
				this.create();
			}

			if (this.isOpen()) {
				return this;
			}

			this.masker.css({
				'z-index': zIndex
			});

			this.masker.fadeTo(this.delay, this.opacity);
			return this;
		},
		close: function() {

			if (!this.isOpen() || this.windows > 1) {
				return this;
			}
			this.masker.fadeOut(this.opacity);
			return this;
		},
		isOpen: function() {

			return this.masker.is(":visible");
		}
	};

})(jQuery);

/**
 * labPanel
 */
(function($) {

	function create(obj) {

		var data = $(obj).data('labPanel');
		var config = data.config;

		$(obj).css({
			"display": "none",
			"position": "fixed",
			"opacity": 0,
			'min-width': config.minWidth,
			'min-height': config.minHeight
		});

		reset(obj);
	}

	function reset(obj) {

		var data = $(obj).data('labPanel');
		var config = data.config;

		/*
		 * 如果没有设置最大宽度和高度，则设为窗口的最大宽度和高度
		 */
		if (!config.maxWidth) {
			data.config.maxWidth = $(window).innerWidth();
		}
		if (!config.maxHeight) {
			data.config.maxHeight = $(window).innerHeight();
		}
		$(obj).data('labPabel', data);
		// -

		/*
		 * 如果一开始没有标题栏div，追加标题栏
		 */
		if (config.hasTitle && $(obj).children(config.titleOjb).length == 0) {
			// $(obj).append(<);
		}
		/*
		 * end
		 */

		/*
		 * 如果一开始没有标题栏div，追加标题栏
		 */
		/*
		 * end
		 */

		if (config.model && !$.labMasker.masker) {
			$.labMasker.create();
		}

		if (config.model && config.maskerClose) {
			$.labMasker.masker.on('click', function() {

				if ($.labMasker.windows == 1) {

					close(obj);
				}
			});
		}

		$(obj).children(config.closeButton).off('click').on('click', function() {

			close(obj);
		});

		if (config.trigger) {
			$(config.trigger).off('click').on('click', function(e) {

				open(obj);
			});
		}

		if (config.open) {
			open(obj);
		}

	}

	function load(obj, onLoad) {

		var data = $(obj).data('labPanel');
		var config = data.config;

		if (config.title) {
			$(obj).children(config.titleObj).text(config.title);
		}

		if (config.url) {
			$.get(config.url, function(data) {

				$(obj).children(config.contentObj).children().remove();
				$(obj).children(config.contentObj).html(data)
				resize(obj);
				if (typeof (onLoad) == 'function') {
					onLoad();
				}
			}, 'html');
		}
		else if (config.content) {
			$(obj).children(config.contentObj).empty().html(config.content);
			resize(obj);
			if (typeof (onLoad) == 'function') {
				onLoad();
			}
		}
		else {
			resize(obj);
			if (typeof (onLoad) == 'function') {
				onLoad();
			}
		}
	}

	function resize(obj) {

		var data = $(obj).data('labPanel');
		var config = data.config;

		if (!config.isWindow) {
			return true;
		}

		/*
		 * 填充内容后的宽高
		 */
		// 先将宽高还原为自动填充
		$(obj).css({
			'width': 'auto',
			'height': 'auto'
		});
		$(obj).children('.box').css({
			'width': 'auto',
			'height': 'auto',
			'overflow-x': 'hidden',
			'overflow-y': 'hidden'
		});
		// -
		// 获得填充后的宽高
		var height = $(obj).outerHeight();
		var width = $(obj).outerWidth();
		// -

		/*
		 * 如果设置了宽高
		 */
		if (config.width) {
			$(obj).width(config.width);

			if (width > config.width) {
				$(obj).children('.box').width(config.width - 30).css('overflow-x', 'scroll');
			}
		}
		else if (width > config.maxWidth) {
			$(obj).width(config.maxWidth);
			$(obj).children('.box').width(config.maxWidth - 30).css('overflow-x', 'scroll');
		}

		if (config.height) {
			$(obj).height(config.height);

			if (height > config.height) {
				$(obj).children('.box').height(config.height - 60).css('overflow-y', 'scroll');
			}
		}
		else if (height > config.maxHeight) {
			$(obj).height(config.maxHeight);
			$(obj).children('.box').height(config.maxHeight - 60).css('overflow-y', 'scroll');
		}
		position(obj);
	}

	function position(obj) {

		var data = $(obj).data('labPanel');
		var config = data.config;

		var height = $(obj).outerHeight();
		var width = $(obj).outerWidth();

		$(obj).css({
			"left": 50 + "%",
			"margin-left": -(width / 2) + "px",
			"top": 50 + "%",
			"margin-top": -(height / 2) - config.top + "px"
		});
	}

	function reload(obj) {

		load(obj);
	}

	function open(obj) {

		var data = $(obj).data('labPanel');
		var config = data.config;
		var maxZIndex = $.labcore.maxZIndex();

		// 自动关闭
		if (config.autoClose) {
			setTimeout(function() {

				close(obj);
			}, config.closeDelay);
		}

		if (isOpen(obj)) {
			reload(obj);
			return false;
		}

		load(obj, function() {

			$(obj).fadeTo(config.delay, config.opacity).focus();

			config.onOpen.call(obj);
		});

		if (config.model) {

			$.labMasker.open(++maxZIndex);
			$.labMasker.windows++;
			$(obj).css('z-index', ++maxZIndex);
		}

		data.isOpen = true;
		$(obj).data('labPanel', data);
		/*
		 * 暂时放到Load显示窗口，可改进为先显示一个加载的Loading...动画
		 */
		// $(obj).fadeTo(config.delay, config.opacity).focus();
		//
		// config.onOpen.call(obj);
	}

	function close(obj) {

		var data = $(obj).data('labPanel');
		var config = data.config;

		if (!isOpen(obj)) {
			return false;
		}

		$(obj).animate({
			"opacity": 0
		}, config.delay);

		if (config.model) {
			$.labMasker.close();
			$.labMasker.windows--;
			$(obj).css('z-index', -1);
		}

		data.isOpen = false;
		$(obj).data('labPanel', data);

		config.onClose.call(obj);
	}

	function isOpen(obj) {

		var data = $(obj).data('labPanel');

		return data.isOpen;

		// return $(obj).is(":visible") && parseInt($(obj).css('opacity')) == 1;
	}

	$.fn.labPanel = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labPanel.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labPanel = $(this).data("labPanel");
			var _this = this;
			if ($labPanel) {
				$labPanel = $(this).data("labPanel", {
					config: $.extend($labPanel.config, $.fn.labPanel.parseOptions(this), config),
					handle: $labPanel.handle,
					isOpen: $labPanel.isOpen
				});

				reset(this);
			}
			else {
				$labPanel = $(this).data("labPanel", {
					config: $.extend({}, $.fn.labPanel.parseOptions(this), config),
					handle: null,
					isOpen: false
				});

				create(this);
			}

		});
	};

	$.fn.labPanel.methods = {
		configuration: function(jq) {

			return $(jq[0]).data("labPanel").config;
		},
		resize: function(jq) {

			return jq.each(function() {

				resize(this);
			});
		},
		open: function(jq, param) {

			return jq.each(function() {

				var config = $(this).data('labPanel').config;

				if (param) {
					if (!config.open) {
						param.open = true;
					}
					$(this).labPanel($.extend(config, param));
				}
				else {
					open(this);
				}
			});
		},
		close: function(jq) {

			return jq.each(function() {

				close(this);
			});
		},
		isOpen: function(jq) {

			return jq.each(function() {

				isOpen(this);
			});
		}
	};

	$.fn.labPanel.parseOptions = function(obj) {

		return $.extend({}, $.fn.labPanel.defaults, $.parser.parseOptions(obj, [{
			url: 'string',
			width: 'number',
			height: 'number',
			minWidth: 'number',
			minHeight: 'number',
			maxWidth: 'number',
			maxHeight: 'number',
			title: 'string'
		}]));
	};

	$.fn.labPanel.defaults = {
		open: true,
		model: false,
		maskerClose: true, // 点击遮盖层是否关闭
		isWindow: false,
		trigger: "", // 触发器
		closeButton: ".close", // 关闭按钮
		delay: 200, // 弹出层移出时间
		top: 0, // 弹出框居中并且向上偏移的像素
		closeDelay: 2000, // 自动关闭时间
		autoClose: false, // 是否自动关闭
		title: null,
		content: null,
		titleObj: '.title',
		contentObj: '.box',
		opacity: 1,
		url: '',
		width: null,
		height: null,
		minWidth: 300,
		minHeight: 100,
		maxWidth: null,
		maxHeight: null,
		onClose: function() {

		},
		onOpen: function() {

		},
		onResize: function() {

		},
		onCreate: function() {

		},
		onDestroy: function() {

		}
	};
})(jQuery);

/**
 * labWindow
 */
(function() {

	$.fn.labWindow = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labWindow.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labPanel = $.data(this, "labPanel");
			var _this = this;

			if ($labPanel) {
				$(this).labPanel($.extend({
					isWindow: true,
					autoClose: false,
					maskerClose: true
				}, config));
			}
			else {

				$(this).labPanel($.extend({
					isWindow: true,
					autoClose: false,
					maskerClose: true
				}, $.fn.labWindow.parseOptions(this), config));
			}
		});
	};

	$.fn.labWindow.methods = {
		configuration: function(jq) {

			return $.data(jq[0], "labPanel").config;
		},
		open: function(jq, param) {

			return jq.each(function() {

				$(this).labPanel('open', param);
			});
		},
		close: function(jq, param) {

			return jq.each(function() {

				$(this).labPanel('close');
			});
		}
	};

	$.fn.labWindow.parseOptions = function(obj) {

		return $.extend({}, $.fn.labWindow.defaults, $.parser.parseOptions(obj, [{}]));
	};

	$.fn.labWindow.defaults = {};
})(jQuery);

/**
 * labMessage
 */
(function($) {

	$.fn.labMessage = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labMessage.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labPanel = $.data(this, "labPanel");
			var _this = this;
			if ($labPanel) {
				$(this).labWindow($.extend({
					autoClose: true,
					maskerClose: false
				}, config));
			}
			else {
				$(this).labWindow($.extend({
					autoClose: true,
					maskerClose: false
				}, $.fn.labMessage.parseOptions(this), config));
			}
		});
	};

	$.fn.labMessage.methods = {
		configuration: function(jq) {

			return $.data(jq[0], "labPanel").config;
		},
		open: function(jq, param) {

			return jq.each(function() {

				$(this).labWindow('open', param);
			});
		},
		close: function(jq, param) {

			return jq.each(function() {

				$(this).labWindow('close');
			});
		}
	};

	$.fn.labMessage.parseOptions = function(obj) {

		return $.extend({}, $.fn.labMessage.defaults, $.parser.parseOptions(obj, [{}]));
	};

	$.fn.labMessage.defaults = {};
})(jQuery);

/**
 * labProgress
 */
(function() {

	function progress(obj) {

		var data = $.data(obj, 'labProgress');
		var config = data.config;

		if (config.now > config.min) {
			if (config.now > config.max) {
				config.now = config.max;
			}
		}
		else if (config.min > 0) {
			config.now = config.min;
		}

		$(obj).children(config.bar).width(config.min + '%').animate({
			width: config.now + '%'
		}, 1000);
	}

	$.fn.labProgress = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labProgress.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labProgress = $.data(this, "labProgress");
			var _this = this;
			if ($labProgress) {
				$.extend($labProgress.config, config);
			}
			else {
				$labProgress = $.data(this, "labProgress", {
					config: $.extend({}, $.fn.labProgress.parseOptions(this), config),
					handle: null
				});

				if ($(this).hasClass("labWindow")) {

					$(this).labWindow({
						minHeight: 20,
						minWidth: 300,
						onOpen: function() {

							progress(_this);
						}
					});
				}
				else if ($(this).hasClass("labPanel")) {
					$(this).labPanel({
						minHeight: 20,
						minWidth: 300,
						onOpen: function() {

							progress(_this);
						}
					});
				}
				else {
					progress(this);
				}
			}
		});
	};

	$.fn.labProgress.methods = {
		configuration: function(jq) {

			return $.data(jq[0], "labProgress").config;
		}
	};

	$.fn.labProgress.parseOptions = function(obj) {

		return $.extend({}, $.fn.labProgress.defaults, $.parser.parseOptions(obj, [{
			max: 'number',
			min: 'number',
			now: 'number'
		}]));
	};

	$.fn.labProgress.defaults = {
		max: 100,
		min: 20,
		now: 20,
		bar: '.progress-bar'
	};
})();

/**
 * Tab切换
 * 
 * @author sqlhost
 * 
 * 2013-10-11: 增加click事件的callback功能
 */
(function($) {

	$.fn.labStep = function(settings) {

		var config = $.extend({
			tab: 'li',
			step: '.step',
			mouseover: false,
			tabClass: '',
			stepClass: '',
			callback: function() {

			}
		}, settings);
		return this.each(function() {

			$(this).find(config.tab + ":first").addClass(config.tabClass);
			$(config.step).not(":first").hide();
			$(config.step).find(":first").show().addClass(config.stepClass);
			$(this).find(config.tab).each(function(i) {

				$(this).click(function() {

					$(this).addClass(config.tabClass).siblings(config.tab).removeClass(config.tabClass);
					$(config.step).not($(config.step).eq(i).show().addClass(config.stepClass)).hide().removeClass(config.stepClass);
					config.callback(i);
				});
				if (config.mouseover) {
					$(this).mouseover(function() {

						$(config.step).not($(config.step).eq(i).show().addClass(config.stepClass)).hide().removeClass(config.stepClass);
					});
				}
			});
		});
	}
})(jQuery);

(function($) {

	$.fn.labAccordion = function() {

		return this.each(function() {

			// $(this).find('.box').not(':first').hide();

			$(this).find('.block .title').each(function() {

				$(this).click(function() {

					$(this).siblings('.box').slideToggle('fast');
					$(this).parent().siblings().find('.box').slideUp('fast');
				});
			});
		});
	};
})(jQuery);

/*
 * labSlide
 * 
 * @Desc 幻灯片插件
 * 
 * @Version 0.0.1 @Author XieJH @Date 2013-2-4
 */

(function($) {

	function create(obj) {

		var $obj = $(obj);
		var data = $.data(obj, 'labSlide');
		var opt = data.options;
		var prop = data.prop;
		var w = $obj.width();
		var h = $obj.height();

		$obj.css('position', 'relative').css('overflow', 'hidden');
		prop.ul.css({
			position: 'absolute',
			top: 0,
			left: 0
		});

		if (opt.direct == 'left' || opt.direct == 'right') {
			var width = prop.w * prop.n; // ul宽度
			prop.ul.width(width);

			if (opt.circle && width < 2 * w) {
				repeat = Math.floor(2 * w / width);
				var html = prop.ul.html();

				for ( var i = 0; i < repeat; i++) {
					prop.ul.append(html);
				}

				prop.ul.width((repeat + 1) * width);
			}
		}
		else if (opt.direct == 'up' || opt.direct == 'down') {
			var height = prop.h * prop.n; // ul高度
			prop.ul.height(height);

			if (opt.circle && height < 2 * h) {
				repeat = Math.floor(2 * h / height);
				var html = prop.ul.html();

				for ( var i = 0; i < repeat; i++) {
					prop.ul.append(html);
				}

				prop.ul.height((repeat + 1) * height);
			}
		}
		else if (opt.direct == 'fade') {

			prop.ul.find(opt.li).hide().first().show();
		}

		/*
		 * 按钮
		 */
		if (opt.btn) {
			if (opt.btnStyle == 'button') {
				var $btnArea = $("<div class='btn'></div>").appendTo($obj).css('position', 'absolute').css('zIndex', 30).css('display', 'block');

				if ($.inArray(opt.btnPos, [1, 2, 3]) >= 0) {
					$btnArea.css('top', opt.btnTop);
				}
				else if ($.inArray(opt.btnPos, [4, 5, 6]) >= 0) {
					$btnArea.css('top', "50%");
				}
				else {
					$btnArea.css('bottom', opt.btnBottom);
				}

				if ($.inArray(opt.btnPos, [1, 4, 7]) >= 0) {
					$btnArea.css('left', opt.btnLeft);
				}
				else if ($.inArray(opt.btnPos, [2, 5, 8]) >= 0) {
					/* $btnArea.css('left', "50%"); */
				}
				else {
					$btnArea.css('right', opt.btnRight);
				}
				for (i = 0; i < prop.n; i++) {
					$('<a></a>').appendTo($btnArea).html(opt.btnStyle == 'full' ? prop.li.eq(i).find('img').attr('alt') : (opt.btnText ? i + 1 : '&nbsp;')).css('font-size', opt.btnFontSize).css('font-family', opt.btnFont).css('text-align', 'center').css('width', opt.btnWidth).css('height', opt.btnHeight).css('display', 'block').css('float', opt.btnAlign == 'h' ? 'left' : 'none').css('background', opt.btnColor).css('margin-' + (opt.btnAlign == 'h' ? ($.inArray(opt.btnPos, [1, 4, 7]) >= 0 ? 'right' : 'left') : ($.inArray(opt.btnPos, [1, 2, 3]) >= 0 ? 'bottom' : 'top')), opt.btnMargin).css('border-radius', opt.btnBorderRadius).css('cursor', 'pointer');
				}
				data.btn = $btnArea.find("a");
				data.btn.first().css('background', opt.btnActiveColor);

			}
			else if (opt.btnStyle == 'custom' && opt.btnCustom) {
				// 自定义按钮
				data.btn = $(opt.btnCustom).find(opt.btnCustomItem);
			}

			$.data(obj, 'labSlide', data);

			// 按钮点击事件
			data.btn.each(function(i) {

				$(this).click(function() {

					if (data.ctrl > 0) {
						return false;
					}

					data.ctrl = 1;

					$.data(obj, 'labSlide', data);

					slide(obj, i);

					setTimeout(function() {

						data.ctrl = 0;
						$.data(obj, 'labSlide', data);
					}, opt.duration);
				});
			});
		}

		$.data(obj, 'labSlide', data);

		if (opt.auto && (opt.circle || opt.direct == 'fade' || opt.direct == 'none' || $(obj).width() < prop.ul.width())) {
			slideStart(obj);
			if (opt.hover) {
				$(obj).hover(function() {

					slideStop(obj);
				}, function() {

					slideStart(obj);
				});

				if (opt.prev) {
					$(opt.prev).mouseover(function() {

						slideStop(obj);
					});
				}

				if (opt.next) {
					$(opt.next).mouseover(function() {

						slideStop(obj);
					});
				}
			}
		}

		if (opt.prev && (opt.circle || opt.direct == 'fade' || opt.direct == 'none' || $(obj).width() < prop.ul.width())) {
			$prev = $(opt.prev);
			$prev.click(function() {

				if (data.ctrl > 0) {
					return false;
				}

				data.ctrl = 1;
				$.data(obj, 'labSlide', data);

				if (!opt.hover) {
					slideStop(obj);
				}

				slide(obj, 'prev');

				setTimeout(function() {

					data.ctrl = 0;
					$.data(obj, 'labSlide', data);
				}, opt.duration);
			});
		}

		if (opt.next && (opt.circle || opt.direct == 'fade' || opt.direct == 'none' || $(obj).width() < prop.ul.width())) {
			$next = $(opt.next);
			$next.click(function() {

				if (data.ctrl > 0) {
					return false;
				}

				data.ctrl = 1;
				$.data(obj, 'labSlide', data);

				if (!opt.hover) {
					slideStop(obj);
				}

				slide(obj, 'next');

				setTimeout(function() {

					data.ctrl = 0;
					$.data(obj, 'labSlide', data);
				}, opt.duration);
			});
		}
	}
	function slide(obj, trigger) {

		var data = $.data(obj, 'labSlide');
		var opt = data.options;
		var btn = data.btn;
		var i = data.current;
		var amount = 1;

		// 方向及定位
		// 如果传入的是数字
		if (!isNaN(trigger)) {
			amount = trigger - i;
			data.current = trigger;

			if (amount == 0) {
				return false;
			}
			else if (amount > 0) {
				if (opt.direct == 'right' || opt.direct == 'left') {
					opt.direct = 'left';
				}
				else if (opt.direct == 'down' || opt.direct == 'up') {
					opt.direct = 'up';
				}
			}
			else {
				if (opt.direct == 'right' || opt.direct == 'left') {
					opt.direct = 'right';
					amount = -amount;
				}
				else if (opt.direct == 'down' || opt.direct == 'up') {
					opt.direct = 'down';
					amount = -amount;
				}
			}
		}
		// 如果传入的非数字
		else {
			if (trigger == 'prev') {
				if (opt.direct == 'right' || opt.direct == 'left') {
					opt.direct = 'right';
				}
				else if (opt.direct == 'down' || opt.direct == 'up') {
					opt.direct = 'down';
				}
			}
			else if (trigger == 'next') {
				if (opt.direct == 'right' || opt.direct == 'left') {
					opt.direct = 'left';
				}
				else if (opt.direct == 'down' || opt.direct == 'up') {
					opt.direct = 'up';
				}
			}

			if (trigger == 'next' || opt.direct == 'left' || opt.direct == 'up') {
				if (i == data.prop.n - 1) {
					if (!opt.circle) {
						return false;
					}
					data.current = 0;
				}
				else {
					data.current = i + 1;
				}
			}
			else if (trigger == 'prev' || opt.direct == 'right' || opt.direct == 'down') {
				if (i == 0) {
					if (!opt.circle) {
						return false;
					}
					data.current = data.prop.n - 1;
				}
				else {
					data.current = i - 1;
				}

				if (opt.direct == 'fade' || opt.direct == 'none') {
					amount = -1;
				}
			}
			else {
				if (i == data.prop.n - 1) {
					if (!opt.circle) {
						return false;
					}
					data.current = 0;
				}
				else {
					data.current = i + 1;
				}
			}

			amount = amount * opt.amount;
		}

		$.data(obj, 'labSlide', data);

		if (opt.control) {
			var control_data = $.data($(opt.control)[0], 'labSlide');
			if (control_data.options.auto) {
				control_data.options.auto = false;
				$(opt.control).labSlide('slideStop');
			}
			$(opt.control).labSlide('slide', data.current);
		}

		switch (opt.direct) {
			case 'left':
				slideLeft(obj, amount);
				break;
			case 'right':
				slideRight(obj, amount);
				break;
			case 'up':
				slideUp(obj, amount);
				break;
			case 'down':
				slideDown(obj, amount);
				break;
			case 'fade':
				slideFade(obj);
				break;
			default:
				slideNone(obj);
		}

		if (opt.btn) {
			if (opt.btnStyle == 'button') {
				btn.eq(i).css('background', opt.btnColor);
				btn.eq(data.current).css('background', opt.btnActiveColor);
			}
			else if (opt.btnStyle == 'custom' && opt.btnCustomClass) {
				btn.eq(i).removeClass(opt.btnCustomClass);
				btn.eq(data.current).addClass(opt.btnCustomClass);
			}
		}

		return $(obj);
	}

	function slideFade(obj) {

		var data = $.data(obj, 'labSlide');
		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		prop.ul.find(opt.li).not(":hidden").fadeOut();
		prop.ul.find(opt.li).eq(data.current).fadeIn(opt.duration, function() {

		});
	}

	function slideNone(obj) {

		var data = $.data(obj, 'labSlide');
		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		prop.ul.find(opt.li).not(":hidden").hide();
		prop.ul.find(opt.li).eq(data.current).show(opt.duration, function() {

		});
	}

	function slideLeft(obj, amount) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		if (opt.circle) {
			var $first = prop.ul.find(opt.li).slice(0, amount);
			prop.ul.animate({
				left: -prop.w * amount
			}, opt.duration, function() {

				$first.appendTo(prop.ul);
				prop.ul.css({
					left: 0
				});
			});
		}
		else {
			var pos = prop.ul.position();
			prop.ul.animate({
				left: pos.left - prop.w * amount
			}, opt.duration, function() {

			});
		}
	}

	function slideRight(obj, amount) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		if (opt.circle) {
			prop.ul.find(opt.li).slice(-amount).prependTo(prop.ul);
			prop.ul.css({
				left: -prop.w * amount
			});

			prop.ul.animate({
				left: 0
			}, opt.duration, function() {

			});
		}
		else {
			var pos = prop.ul.position();
			prop.ul.animate({
				left: pos.left + prop.w * amount
			}, opt.duration, function() {

			});
		}

	}

	function slideUp(obj, amount) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		if (opt.circle) {
			var $first = prop.ul.find(opt.li).slice(0, amount);

			prop.ul.animate({
				top: -prop.h * amount
			}, opt.duration, function() {

				prop.ul.css({
					top: 0
				});
				$first.appendTo(prop.ul);
			});
		}
		else {
			var pos = prop.ul.position();
			prop.ul.animate({
				top: pos.top - prop.h * amount
			}, opt.duration, function() {

			});
		}
	}

	function slideDown(obj, amount) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		if (opt.circle) {
			prop.ul.find(opt.li).slice(-amount).prependTo(prop.ul);
			prop.ul.css({
				top: -prop.h * amount
			});

			prop.ul.animate({
				top: 0
			}, opt.duration, function() {

			});
		}
		else {
			var pos = prop.ul.position();
			prop.ul.animate({
				top: pos.top + prop.h * amount
			}, opt.duration, function() {

			});
		}
	}

	function slideStart(obj) {

		var data = $.data(obj, 'labSlide');
		data.handle = setInterval(function() {

			$.data(obj, 'labSlide', data);
			slide(obj);
		}, data.options.interval);
		return $(obj);
	}

	function slideStop(obj) {

		var data = $.data(obj, 'labSlide');

		clearInterval(data.handle);
		data.handle = null;
		$.data(obj, 'labSlide', data);
		return $(obj);
	}

	$.fn.labSlide = function(config, param) {

		if (typeof (config) == "string") {
			return $.fn.labSlide.methods[config](this, param);
		}
		config = config || {};

		return this.each(function() {

			var $labSlide = $.data(this, "labSlide"); // _5d
			var opt; // _5e
			var _this = this;
			if ($labSlide) {
				opt = $.extend($labSlide.options, config);
			}
			else {

				opt = $.extend({}, $.fn.labSlide.defaults, config);

				var $ul = $(this).find(opt.ul);
				var $li = $ul.children(opt.li);

				var prop = {
					ul: $ul,
					li: $li,
					n: $li.size(),
					w: $li.eq(0).width(),
					h: $li.eq(0).height(),
					prev: $(this).find(opt.prev),
					next: $(this).find(opt.next)
				};

				$.data(this, "labSlide", {
					options: opt,
					prop: prop,
					handle: null,
					ctrl: 0,
					current: 0
				});

				create(this);
			}

		});
	};

	$.fn.labSlide.methods = {
		options: function(jq) {

			return $.data(jq[0], "labSlide").options;
		},
		slideStart: function(jq) {

			return slideStart(jq[0]);
		},
		slideStop: function(jq) {

			return slideStop(jq[0]);
		},
		slide: function(jq, trigger) {

			return slide(jq[0], trigger);
		}
	};

	$.fn.labSlide.parseOptions = function(obj) {

		return {};
	};

	$.fn.labSlide.defaults = {
		direct: 'fade', // 滚动方向：left, up, right, down, none, fade
		amount: 1, // 每次滚动的数量
		interval: 2000, // 滚动时间间隔
		duration: 400, // 滚动动画执行时间
		auto: true, // 是否自动滚动
		hover: true, // 鼠标经过是否停止滚动
		circle: true, // 是否无缝循环滚动
		ul: 'ul', // 父容器
		li: 'li', // 元素容器
		prev: '', // 上一个按钮
		next: '', // 下一下按钮

		bgBar: false, // 是否背景条
		bgColor: '#666', // 背景色
		bgOpacity: .5, // 背景透明度
		bgHeight: 40, // 背景高
		bgPos: 'bottom', // 位置: bottom, top, left, right

		/*
		 * 按钮设置
		 */
		btn: false, // 是否显示按钮
		btnStyle: 'button', // 按钮风格：full - 全屏，button - 按钮，custom - 自定义
		btnCustom: null, // 自定义按钮
		btnCustomItem: null, // 自定义按钮项
		btnCustomClass: 'active', // 自定义按钮选中样式

		btnText: false, // 是否显示文本
		btnColor: '#FFF', // 按钮颜色
		btnActiveColor: '#ff0000',
		btnOpacity: .5, // 未选中按钮透明度
		btnFont: 'Verdana', // 按钮文本字体
		btnFontSize: 12, // 按钮文字大小(注意:Chrome有默认最小字号的限制)
		btnFontColor: '#000', // 按钮文本颜色
		btnActiveFontColor: '#FFF',

		btnWidth: 15, // 按钮宽
		btnHeight: 15, // 按钮高
		btnMargin: 5, // 按钮间距
		btnBorder: 0, // 按钮边框
		btnBorderColor: '#ccc', // 按钮边框颜色
		btnBorderPos: 'all', // 按钮边框: all, bottom, top, left, right
		btnBorderRadius: '50%',

		btnAlign: 'h', // 按钮垂直位置:h - 水平，v - 垂直
		btnPos: 8, // 1至9，全屏无效
		btnLeft: 0, // 按钮左边距，全屏无效
		btnRight: 0, // 按钮右边距，全屏无效
		btnTop: 0, // 按钮上边距，全屏无效
		btnBottom: 30, // 按钮下边距，全屏无效
		btnShowdow: 1, // 阴影，全屏无效

		btnImage: false, // 是否使用图片作为背景
		btnImageUrl: '', // 不指定时使用大图，全屏无效
		btnActiveImageUrl: '', // ，全屏无效
		control: null
	// btnCtrl: null
	};
})(jQuery);

/**
 * Collapsible, jQuery Plugin
 * 
 * This plugin enables the management of collapsibles on the page with cookie
 * support.
 * 
 * Copyright (c) 2010 John Snyder (snyderplace.com)
 * 
 * @license http://www.snyderplace.com/collapsible/license.txt New BSD
 * @version 1.1
 */
(function($) {

	$.fn.collapsible = function(cmd, arg) {

		if (typeof cmd == 'string') {
			return $.fn.collapsible.dispatcher[cmd](this, arg);
		}
		return $.fn.collapsible.dispatcher['_create'](this, cmd);
	};
	$.fn.collapsible.dispatcher = {
		_create: function(obj, arg) {

			createCollapsible(obj, arg);
		},
		toggle: function(obj) {

			toggle(obj, loadOpts(obj));
			return obj;
		},
		open: function(obj) {

			open(obj, loadOpts(obj));
			return obj;
		},
		close: function(obj) {

			close(obj, loadOpts(obj));
			return obj;
		},
		collapsed: function(obj) {

			return collapsed(obj, loadOpts(obj));
		}
	};
	function createCollapsible(obj, options) {

		var opts = $.extend({}, $.fn.collapsible.defaults, options);
		var opened = new Array();
		obj.each(function() {

			var $this = $(this);
			saveOpts($this, opts);
			if (opts.bind == 'mouseenter') {
				$this.bind('mouseenter', function(e) {

					e.preventDefault();
					toggle($this, opts);
				});
			}
			if (opts.bind == 'mouseover') {
				$this.bind('mouseover', function(e) {

					e.preventDefault();
					toggle($this, opts);
				});
			}
			if (opts.bind == 'click') {
				$this.bind('click', function(e) {

					e.preventDefault();
					toggle($this, opts);
				});
			}
			if (opts.bind == 'dblclick') {
				$this.bind('dblclick', function(e) {

					e.preventDefault();
					toggle($this, opts);
				});
			}
			id = $this.attr('id');
			if (!useCookies(opts)) {
				dOpenIndex = inDefaultOpen(id, opts);
				if (dOpenIndex === false) {
					$this.addClass(opts.cssClose);
					$this.next().hide();
				}
				else {
					$this.addClass(opts.cssOpen);
					$this.next().show();
					opened.push(id);
				}
			}
			else {
				if (issetCookie(opts)) {
					cookieIndex = inCookie(id, opts);
					if (cookieIndex === false) {
						$this.addClass(opts.cssClose);
						$this.next().hide();
					}
					else {
						$this.addClass(opts.cssOpen);
						$this.next().show();
						opened.push(id);
					}
				}
				else {
					dOpenIndex = inDefaultOpen(id, opts);
					if (dOpenIndex === false) {
						$this.addClass(opts.cssClose);
						$this.next().hide();
					}
					else {
						$this.addClass(opts.cssOpen);
						$this.next().show();
						opened.push(id);
					}
				}
			}
		});
		if (opened.length > 0 && useCookies(opts)) {
			setCookie(opened.toString(), opts);
		}
		else {
			setCookie('', opts);
		}
		return obj;
	}
	;
	function loadOpts($this) {

		return $this.data('collapsible-opts');
	}
	function saveOpts($this, opts) {

		return $this.data('collapsible-opts', opts);
	}
	function collapsed($this, opts) {

		return $this.hasClass(opts.cssClose);
	}
	function close($this, opts) {

		$this.addClass(opts.cssClose).removeClass(opts.cssOpen);
		opts.animateOpen($this, opts);
		if (useCookies(opts)) {
			id = $this.attr('id');
			unsetCookieId(id, opts);
		}
	}
	function open($this, opts) {

		$this.removeClass(opts.cssClose).addClass(opts.cssOpen);
		opts.animateClose($this, opts);
		if (useCookies(opts)) {
			id = $this.attr('id');
			appendCookie(id, opts);
		}
	}
	function toggle($this, opts) {

		if (collapsed($this, opts)) {
			open($this, opts);
		}
		else {
			close($this, opts);
		}
		return false;
	}
	function useCookies(opts) {

		if (!$.cookie || opts.cookieName == '') {
			return false;
		}
		return true;
	}
	function appendCookie(value, opts) {

		if (!useCookies(opts)) {
			return false;
		}
		if (!issetCookie(opts)) {
			setCookie(value, opts);
			return true;
		}
		if (inCookie(value, opts)) {
			return true;
		}
		cookie = $.cookie(opts.cookieName);
		cookie = unescape(cookie);
		cookieArray = cookie.split(',');
		cookieArray.push(value);
		setCookie(cookieArray.toString(), opts);
		return true;
	}
	function unsetCookieId(value, opts) {

		if (!useCookies(opts)) {
			return false;
		}
		if (!issetCookie(opts)) {
			return true;
		}
		cookieIndex = inCookie(value, opts);
		if (cookieIndex === false) {
			return true;
		}
		cookie = $.cookie(opts.cookieName);
		cookie = unescape(cookie);
		cookieArray = cookie.split(',');
		cookieArray.splice(cookieIndex, 1);
		setCookie(cookieArray.toString(), opts);
	}
	function setCookie(value, opts) {

		if (!useCookies(opts)) {
			return false;
		}
		$.cookie(opts.cookieName, value, opts.cookieOptions);
	}
	function inCookie(value, opts) {

		if (!useCookies(opts)) {
			return false;
		}
		if (!issetCookie(opts)) {
			return false;
		}
		cookie = unescape($.cookie(opts.cookieName));
		cookieArray = cookie.split(',');
		cookieIndex = $.inArray(value, cookieArray);
		if (cookieIndex == -1) {
			return false;
		}
		return cookieIndex;
	}
	function issetCookie(opts) {

		if (!useCookies(opts)) {
			return false;
		}
		if ($.cookie(opts.cookieName) == null) {
			return false;
		}
		return true;
	}
	function inDefaultOpen(id, opts) {

		defaultOpen = getDefaultOpen(opts);
		index = $.inArray(id, defaultOpen);
		if (index == -1) {
			return false;
		}
		return index;
	}
	function getDefaultOpen(opts) {

		defaultOpen = new Array();
		if (opts.defaultOpen != '') {
			defaultOpen = opts.defaultOpen.split(',');
		}
		return defaultOpen;
	}
	$.fn.collapsible.defaults = {
		cssClose: 'collapse-close',
		cssOpen: 'collapse-open',
		cookieName: 'collapsible',
		cookieOptions: {
			path: '/',
			expires: 7,
			domain: '',
			secure: ''
		},
		defaultOpen: '',
		speed: 'slow',
		bind: 'click',
		animateOpen: function(elem, opts) {

			elem.next().slideUp(opts.speed);
		},
		animateClose: function(elem, opts) {

			elem.next().slideDown(opts.speed);
		}
	};
})(jQuery);
/*
 * ! jQuery UI Effects 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/category/effects-core/
 */
(function($, undefined) {

	var dataSpace = "ui-effects-";

	$.effects = {
		effect: {}
	};

	/*
	 * ! jQuery Color Animations v2.1.2 https://github.com/jquery/jquery-color
	 * 
	 * Copyright 2013 jQuery Foundation and other contributors Released under
	 * the MIT license. http://jquery.org/license
	 * 
	 * Date: Wed Jan 16 08:47:09 2013 -0600
	 */
	(function(jQuery, undefined) {

		var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

		// plusequals test for += 100 -= 100
		rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
		// a set of RE's that can match strings and generate color tuples.
		stringParsers = [{
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function(execResult) {

				return [execResult[1], execResult[2], execResult[3], execResult[4]];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function(execResult) {

				return [execResult[1] * 2.55, execResult[2] * 2.55, execResult[3] * 2.55, execResult[4]];
			}
		}, {
			// this regex ignores A-F because it's compared against an already
			// lowercased string
			re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
			parse: function(execResult) {

				return [parseInt(execResult[1], 16), parseInt(execResult[2], 16), parseInt(execResult[3], 16)];
			}
		}, {
			// this regex ignores A-F because it's compared against an already
			// lowercased string
			re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
			parse: function(execResult) {

				return [parseInt(execResult[1] + execResult[1], 16), parseInt(execResult[2] + execResult[2], 16), parseInt(execResult[3] + execResult[3], 16)];
			}
		}, {
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			space: "hsla",
			parse: function(execResult) {

				return [execResult[1], execResult[2] / 100, execResult[3] / 100, execResult[4]];
			}
		}],

		// jQuery.Color( )
		color = jQuery.Color = function(color, green, blue, alpha) {

			return new jQuery.Color.fn.parse(color, green, blue, alpha);
		}, spaces = {
			rgba: {
				props: {
					red: {
						idx: 0,
						type: "byte"
					},
					green: {
						idx: 1,
						type: "byte"
					},
					blue: {
						idx: 2,
						type: "byte"
					}
				}
			},

			hsla: {
				props: {
					hue: {
						idx: 0,
						type: "degrees"
					},
					saturation: {
						idx: 1,
						type: "percent"
					},
					lightness: {
						idx: 2,
						type: "percent"
					}
				}
			}
		}, propTypes = {
			"byte": {
				floor: true,
				max: 255
			},
			"percent": {
				max: 1
			},
			"degrees": {
				mod: 360,
				floor: true
			}
		}, support = color.support = {},

		// element for support tests
		supportElem = jQuery("<p>")[0],

		// colors = jQuery.Color.names
		colors,

		// local aliases of functions called often
		each = jQuery.each;

		// determine rgba support immediately
		supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
		support.rgba = supportElem.style.backgroundColor.indexOf("rgba") > -1;

		// define cache name and alpha properties
		// for rgba and hsla spaces
		each(spaces, function(spaceName, space) {

			space.cache = "_" + spaceName;
			space.props.alpha = {
				idx: 3,
				type: "percent",
				def: 1
			};
		});

		function clamp(value, prop, allowEmpty) {

			var type = propTypes[prop.type] || {};

			if (value == null) {
				return (allowEmpty || !prop.def) ? null : prop.def;
			}

			// ~~ is an short way of doing floor for positive numbers
			value = type.floor ? ~~value : parseFloat(value);

			// IE will pass in empty strings as value for alpha,
			// which will hit this case
			if (isNaN(value)) {
				return prop.def;
			}

			if (type.mod) {
				// we add mod before modding to make sure that negatives values
				// get converted properly: -10 -> 350
				return (value + type.mod) % type.mod;
			}

			// for now all property types without mod have min and max
			return 0 > value ? 0 : type.max < value ? type.max : value;
		}

		function stringParse(string) {

			var inst = color(), rgba = inst._rgba = [];

			string = string.toLowerCase();

			each(stringParsers, function(i, parser) {

				var parsed, match = parser.re.exec(string), values = match && parser.parse(match), spaceName = parser.space || "rgba";

				if (values) {
					parsed = inst[spaceName](values);

					// if this was an rgba parse the assignment might happen
					// twice
					// oh well....
					inst[spaces[spaceName].cache] = parsed[spaces[spaceName].cache];
					rgba = inst._rgba = parsed._rgba;

					// exit each( stringParsers ) here because we matched
					return false;
				}
			});

			// Found a stringParser that handled it
			if (rgba.length) {

				// if this came from a parsed string, force "transparent" when
				// alpha is 0
				// chrome, (and maybe others) return "transparent" as
				// rgba(0,0,0,0)
				if (rgba.join() === "0,0,0,0") {
					jQuery.extend(rgba, colors.transparent);
				}
				return inst;
			}

			// named colors
			return colors[string];
		}

		color.fn = jQuery.extend(color.prototype, {
			parse: function(red, green, blue, alpha) {

				if (red === undefined) {
					this._rgba = [null, null, null, null];
					return this;
				}
				if (red.jquery || red.nodeType) {
					red = jQuery(red).css(green);
					green = undefined;
				}

				var inst = this, type = jQuery.type(red), rgba = this._rgba = [];

				// more than 1 argument specified - assume ( red, green, blue,
				// alpha )
				if (green !== undefined) {
					red = [red, green, blue, alpha];
					type = "array";
				}

				if (type === "string") {
					return this.parse(stringParse(red) || colors._default);
				}

				if (type === "array") {
					each(spaces.rgba.props, function(key, prop) {

						rgba[prop.idx] = clamp(red[prop.idx], prop);
					});
					return this;
				}

				if (type === "object") {
					if (red instanceof color) {
						each(spaces, function(spaceName, space) {

							if (red[space.cache]) {
								inst[space.cache] = red[space.cache].slice();
							}
						});
					}
					else {
						each(spaces, function(spaceName, space) {

							var cache = space.cache;
							each(space.props, function(key, prop) {

								// if the cache doesn't exist, and we know how
								// to convert
								if (!inst[cache] && space.to) {

									// if the value was null, we don't need to
									// copy it
									// if the key was alpha, we don't need to
									// copy it either
									if (key === "alpha" || red[key] == null) {
										return;
									}
									inst[cache] = space.to(inst._rgba);
								}

								// this is the only case where we allow nulls
								// for ALL properties.
								// call clamp with alwaysAllowEmpty
								inst[cache][prop.idx] = clamp(red[key], prop, true);
							});

							// everything defined but alpha?
							if (inst[cache] && jQuery.inArray(null, inst[cache].slice(0, 3)) < 0) {
								// use the default of 1
								inst[cache][3] = 1;
								if (space.from) {
									inst._rgba = space.from(inst[cache]);
								}
							}
						});
					}
					return this;
				}
			},
			is: function(compare) {

				var is = color(compare), same = true, inst = this;

				each(spaces, function(_, space) {

					var localCache, isCache = is[space.cache];
					if (isCache) {
						localCache = inst[space.cache] || space.to && space.to(inst._rgba) || [];
						each(space.props, function(_, prop) {

							if (isCache[prop.idx] != null) {
								same = (isCache[prop.idx] === localCache[prop.idx]);
								return same;
							}
						});
					}
					return same;
				});
				return same;
			},
			_space: function() {

				var used = [], inst = this;
				each(spaces, function(spaceName, space) {

					if (inst[space.cache]) {
						used.push(spaceName);
					}
				});
				return used.pop();
			},
			transition: function(other, distance) {

				var end = color(other), spaceName = end._space(), space = spaces[spaceName], startColor = this.alpha() === 0 ? color("transparent") : this, start = startColor[space.cache] || space.to(startColor._rgba), result = start.slice();

				end = end[space.cache];
				each(space.props, function(key, prop) {

					var index = prop.idx, startValue = start[index], endValue = end[index], type = propTypes[prop.type] || {};

					// if null, don't override start value
					if (endValue === null) {
						return;
					}
					// if null - use end
					if (startValue === null) {
						result[index] = endValue;
					}
					else {
						if (type.mod) {
							if (endValue - startValue > type.mod / 2) {
								startValue += type.mod;
							}
							else if (startValue - endValue > type.mod / 2) {
								startValue -= type.mod;
							}
						}
						result[index] = clamp((endValue - startValue) * distance + startValue, prop);
					}
				});
				return this[spaceName](result);
			},
			blend: function(opaque) {

				// if we are already opaque - return ourself
				if (this._rgba[3] === 1) {
					return this;
				}

				var rgb = this._rgba.slice(), a = rgb.pop(), blend = color(opaque)._rgba;

				return color(jQuery.map(rgb, function(v, i) {

					return (1 - a) * blend[i] + a * v;
				}));
			},
			toRgbaString: function() {

				var prefix = "rgba(", rgba = jQuery.map(this._rgba, function(v, i) {

					return v == null ? (i > 2 ? 1 : 0) : v;
				});

				if (rgba[3] === 1) {
					rgba.pop();
					prefix = "rgb(";
				}

				return prefix + rgba.join() + ")";
			},
			toHslaString: function() {

				var prefix = "hsla(", hsla = jQuery.map(this.hsla(), function(v, i) {

					if (v == null) {
						v = i > 2 ? 1 : 0;
					}

					// catch 1 and 2
					if (i && i < 3) {
						v = Math.round(v * 100) + "%";
					}
					return v;
				});

				if (hsla[3] === 1) {
					hsla.pop();
					prefix = "hsl(";
				}
				return prefix + hsla.join() + ")";
			},
			toHexString: function(includeAlpha) {

				var rgba = this._rgba.slice(), alpha = rgba.pop();

				if (includeAlpha) {
					rgba.push(~~(alpha * 255));
				}

				return "#" + jQuery.map(rgba, function(v) {

					// default to 0 when nulls exist
					v = (v || 0).toString(16);
					return v.length === 1 ? "0" + v : v;
				}).join("");
			},
			toString: function() {

				return this._rgba[3] === 0 ? "transparent" : this.toRgbaString();
			}
		});
		color.fn.parse.prototype = color.fn;

		// hsla conversions adapted from:
		// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

		function hue2rgb(p, q, h) {

			h = (h + 1) % 1;
			if (h * 6 < 1) {
				return p + (q - p) * h * 6;
			}
			if (h * 2 < 1) {
				return q;
			}
			if (h * 3 < 2) {
				return p + (q - p) * ((2 / 3) - h) * 6;
			}
			return p;
		}

		spaces.hsla.to = function(rgba) {

			if (rgba[0] == null || rgba[1] == null || rgba[2] == null) {
				return [null, null, null, rgba[3]];
			}
			var r = rgba[0] / 255, g = rgba[1] / 255, b = rgba[2] / 255, a = rgba[3], max = Math.max(r, g, b), min = Math.min(r, g, b), diff = max - min, add = max + min, l = add * 0.5, h, s;

			if (min === max) {
				h = 0;
			}
			else if (r === max) {
				h = (60 * (g - b) / diff) + 360;
			}
			else if (g === max) {
				h = (60 * (b - r) / diff) + 120;
			}
			else {
				h = (60 * (r - g) / diff) + 240;
			}

			// chroma (diff) == 0 means greyscale which, by definition,
			// saturation = 0%
			// otherwise, saturation is based on the ratio of chroma (diff) to
			// lightness (add)
			if (diff === 0) {
				s = 0;
			}
			else if (l <= 0.5) {
				s = diff / add;
			}
			else {
				s = diff / (2 - add);
			}
			return [Math.round(h) % 360, s, l, a == null ? 1 : a];
		};

		spaces.hsla.from = function(hsla) {

			if (hsla[0] == null || hsla[1] == null || hsla[2] == null) {
				return [null, null, null, hsla[3]];
			}
			var h = hsla[0] / 360, s = hsla[1], l = hsla[2], a = hsla[3], q = l <= 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;

			return [Math.round(hue2rgb(p, q, h + (1 / 3)) * 255), Math.round(hue2rgb(p, q, h) * 255), Math.round(hue2rgb(p, q, h - (1 / 3)) * 255), a];
		};

		each(spaces, function(spaceName, space) {

			var props = space.props, cache = space.cache, to = space.to, from = space.from;

			// makes rgba() and hsla()
			color.fn[spaceName] = function(value) {

				// generate a cache for this space if it doesn't exist
				if (to && !this[cache]) {
					this[cache] = to(this._rgba);
				}
				if (value === undefined) {
					return this[cache].slice();
				}

				var ret, type = jQuery.type(value), arr = (type === "array" || type === "object") ? value : arguments, local = this[cache].slice();

				each(props, function(key, prop) {

					var val = arr[type === "object" ? key : prop.idx];
					if (val == null) {
						val = local[prop.idx];
					}
					local[prop.idx] = clamp(val, prop);
				});

				if (from) {
					ret = color(from(local));
					ret[cache] = local;
					return ret;
				}
				else {
					return color(local);
				}
			};

			// makes red() green() blue() alpha() hue() saturation() lightness()
			each(props, function(key, prop) {

				// alpha is included in more than one space
				if (color.fn[key]) {
					return;
				}
				color.fn[key] = function(value) {

					var vtype = jQuery.type(value), fn = (key === "alpha" ? (this._hsla ? "hsla" : "rgba") : spaceName), local = this[fn](), cur = local[prop.idx], match;

					if (vtype === "undefined") {
						return cur;
					}

					if (vtype === "function") {
						value = value.call(this, cur);
						vtype = jQuery.type(value);
					}
					if (value == null && prop.empty) {
						return this;
					}
					if (vtype === "string") {
						match = rplusequals.exec(value);
						if (match) {
							value = cur + parseFloat(match[2]) * (match[1] === "+" ? 1 : -1);
						}
					}
					local[prop.idx] = value;
					return this[fn](local);
				};
			});
		});

		// add cssHook and .fx.step function for each named hook.
		// accept a space separated string of properties
		color.hook = function(hook) {

			var hooks = hook.split(" ");
			each(hooks, function(i, hook) {

				jQuery.cssHooks[hook] = {
					set: function(elem, value) {

						var parsed, curElem, backgroundColor = "";

						if (value !== "transparent" && (jQuery.type(value) !== "string" || (parsed = stringParse(value)))) {
							value = color(parsed || value);
							if (!support.rgba && value._rgba[3] !== 1) {
								curElem = hook === "backgroundColor" ? elem.parentNode : elem;
								while ((backgroundColor === "" || backgroundColor === "transparent") && curElem && curElem.style) {
									try {
										backgroundColor = jQuery.css(curElem, "backgroundColor");
										curElem = curElem.parentNode;
									}
									catch (e) {
									}
								}

								value = value.blend(backgroundColor && backgroundColor !== "transparent" ? backgroundColor : "_default");
							}

							value = value.toRgbaString();
						}
						try {
							elem.style[hook] = value;
						}
						catch (e) {
							// wrapped to prevent IE from throwing errors on
							// "invalid" values like 'auto' or 'inherit'
						}
					}
				};
				jQuery.fx.step[hook] = function(fx) {

					if (!fx.colorInit) {
						fx.start = color(fx.elem, hook);
						fx.end = color(fx.end);
						fx.colorInit = true;
					}
					jQuery.cssHooks[hook].set(fx.elem, fx.start.transition(fx.end, fx.pos));
				};
			});

		};

		color.hook(stepHooks);

		jQuery.cssHooks.borderColor = {
			expand: function(value) {

				var expanded = {};

				each(["Top", "Right", "Bottom", "Left"], function(i, part) {

					expanded["border" + part + "Color"] = value;
				});
				return expanded;
			}
		};

		// Basic color names only.
		// Usage of any of the other color names requires adding yourself or
		// including
		// jquery.color.svg-names.js.
		colors = jQuery.Color.names = {
			// 4.1. Basic color keywords
			aqua: "#00ffff",
			black: "#000000",
			blue: "#0000ff",
			fuchsia: "#ff00ff",
			gray: "#808080",
			green: "#008000",
			lime: "#00ff00",
			maroon: "#800000",
			navy: "#000080",
			olive: "#808000",
			purple: "#800080",
			red: "#ff0000",
			silver: "#c0c0c0",
			teal: "#008080",
			white: "#ffffff",
			yellow: "#ffff00",

			// 4.2.3. "transparent" color keyword
			transparent: [null, null, null, 0],

			_default: "#ffffff"
		};

	})(jQuery);

	/** *************************************************************************** */
	/**
	 * **************************** CLASS ANIMATIONS
	 * *****************************
	 */
	/** *************************************************************************** */
	(function() {

		var classAnimationActions = ["add", "remove", "toggle"], shorthandStyles = {
			border: 1,
			borderBottom: 1,
			borderColor: 1,
			borderLeft: 1,
			borderRight: 1,
			borderTop: 1,
			borderWidth: 1,
			margin: 1,
			padding: 1
		};

		$.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function(_, prop) {

			$.fx.step[prop] = function(fx) {

				if (fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr) {
					jQuery.style(fx.elem, prop, fx.end);
					fx.setAttr = true;
				}
			};
		});

		function getElementStyles(elem) {

			var key, len, style = elem.ownerDocument.defaultView ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.currentStyle, styles = {};

			if (style && style.length && style[0] && style[style[0]]) {
				len = style.length;
				while (len--) {
					key = style[len];
					if (typeof style[key] === "string") {
						styles[$.camelCase(key)] = style[key];
					}
				}
				// support: Opera, IE <9
			}
			else {
				for (key in style) {
					if (typeof style[key] === "string") {
						styles[key] = style[key];
					}
				}
			}

			return styles;
		}

		function styleDifference(oldStyle, newStyle) {

			var diff = {}, name, value;

			for (name in newStyle) {
				value = newStyle[name];
				if (oldStyle[name] !== value) {
					if (!shorthandStyles[name]) {
						if ($.fx.step[name] || !isNaN(parseFloat(value))) {
							diff[name] = value;
						}
					}
				}
			}

			return diff;
		}

		// support: jQuery <1.8
		if (!$.fn.addBack) {
			$.fn.addBack = function(selector) {

				return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
			};
		}

		$.effects.animateClass = function(value, duration, easing, callback) {

			var o = $.speed(duration, easing, callback);

			return this.queue(function() {

				var animated = $(this), baseClass = animated.attr("class") || "", applyClassChange, allAnimations = o.children ? animated.find("*").addBack() : animated;

				// map the animated objects to store the original styles.
				allAnimations = allAnimations.map(function() {

					var el = $(this);
					return {
						el: el,
						start: getElementStyles(this)
					};
				});

				// apply class change
				applyClassChange = function() {

					$.each(classAnimationActions, function(i, action) {

						if (value[action]) {
							animated[action + "Class"](value[action]);
						}
					});
				};
				applyClassChange();

				// map all animated objects again - calculate new styles and
				// diff
				allAnimations = allAnimations.map(function() {

					this.end = getElementStyles(this.el[0]);
					this.diff = styleDifference(this.start, this.end);
					return this;
				});

				// apply original class
				animated.attr("class", baseClass);

				// map all animated objects again - this time collecting a
				// promise
				allAnimations = allAnimations.map(function() {

					var styleInfo = this, dfd = $.Deferred(), opts = $.extend({}, o, {
						queue: false,
						complete: function() {

							dfd.resolve(styleInfo);
						}
					});

					this.el.animate(this.diff, opts);
					return dfd.promise();
				});

				// once all animations have completed:
				$.when.apply($, allAnimations.get()).done(function() {

					// set the final class
					applyClassChange();

					// for each animated element,
					// clear all css properties that were animated
					$.each(arguments, function() {

						var el = this.el;
						$.each(this.diff, function(key) {

							el.css(key, "");
						});
					});

					// this is guarnteed to be there if you use jQuery.speed()
					// it also handles dequeuing the next anim...
					o.complete.call(animated[0]);
				});
			});
		};

		$.fn.extend({
			addClass: (function(orig) {

				return function(classNames, speed, easing, callback) {

					return speed ? $.effects.animateClass.call(this, {
						add: classNames
					}, speed, easing, callback) : orig.apply(this, arguments);
				};
			})($.fn.addClass),

			removeClass: (function(orig) {

				return function(classNames, speed, easing, callback) {

					return arguments.length > 1 ? $.effects.animateClass.call(this, {
						remove: classNames
					}, speed, easing, callback) : orig.apply(this, arguments);
				};
			})($.fn.removeClass),

			toggleClass: (function(orig) {

				return function(classNames, force, speed, easing, callback) {

					if (typeof force === "boolean" || force === undefined) {
						if (!speed) {
							// without speed parameter
							return orig.apply(this, arguments);
						}
						else {
							return $.effects.animateClass.call(this, (force ? {
								add: classNames
							} : {
								remove: classNames
							}), speed, easing, callback);
						}
					}
					else {
						// without force parameter
						return $.effects.animateClass.call(this, {
							toggle: classNames
						}, force, speed, easing);
					}
				};
			})($.fn.toggleClass),

			switchClass: function(remove, add, speed, easing, callback) {

				return $.effects.animateClass.call(this, {
					add: add,
					remove: remove
				}, speed, easing, callback);
			}
		});

	})();

	/** *************************************************************************** */
	/**
	 * ********************************* EFFECTS
	 * *********************************
	 */
	/** *************************************************************************** */

	(function() {

		$.extend($.effects, {
			version: "1.10.4",

			// Saves a set of properties in a data storage
			save: function(element, set) {

				for ( var i = 0; i < set.length; i++) {
					if (set[i] !== null) {
						element.data(dataSpace + set[i], element[0].style[set[i]]);
					}
				}
			},

			// Restores a set of previously saved properties from a data storage
			restore: function(element, set) {

				var val, i;
				for (i = 0; i < set.length; i++) {
					if (set[i] !== null) {
						val = element.data(dataSpace + set[i]);
						// support: jQuery 1.6.2
						// http://bugs.jquery.com/ticket/9917
						// jQuery 1.6.2 incorrectly returns undefined for any
						// falsy value.
						// We can't differentiate between "" and 0 here, so we
						// just assume
						// empty string since it's likely to be a more common
						// value...
						if (val === undefined) {
							val = "";
						}
						element.css(set[i], val);
					}
				}
			},

			setMode: function(el, mode) {

				if (mode === "toggle") {
					mode = el.is(":hidden") ? "show" : "hide";
				}
				return mode;
			},

			// Translates a [top,left] array into a baseline value
			// this should be a little more flexible in the future to handle a
			// string & hash
			getBaseline: function(origin, original) {

				var y, x;
				switch (origin[0]) {
					case "top":
						y = 0;
						break;
					case "middle":
						y = 0.5;
						break;
					case "bottom":
						y = 1;
						break;
					default:
						y = origin[0] / original.height;
				}
				switch (origin[1]) {
					case "left":
						x = 0;
						break;
					case "center":
						x = 0.5;
						break;
					case "right":
						x = 1;
						break;
					default:
						x = origin[1] / original.width;
				}
				return {
					x: x,
					y: y
				};
			},

			// Wraps the element around a wrapper that copies position
			// properties
			createWrapper: function(element) {

				// if the element is already wrapped, return it
				if (element.parent().is(".ui-effects-wrapper")) {
					return element.parent();
				}

				// wrap the element
				var props = {
					width: element.outerWidth(true),
					height: element.outerHeight(true),
					"float": element.css("float")
				}, wrapper = $("<div></div>").addClass("ui-effects-wrapper").css({
					fontSize: "100%",
					background: "transparent",
					border: "none",
					margin: 0,
					padding: 0
				}),
				// Store the size in case width/height are defined in % - Fixes
				// #5245
				size = {
					width: element.width(),
					height: element.height()
				}, active = document.activeElement;

				// support: Firefox
				// Firefox incorrectly exposes anonymous content
				// https://bugzilla.mozilla.org/show_bug.cgi?id=561664
				try {
					active.id;
				}
				catch (e) {
					active = document.body;
				}

				element.wrap(wrapper);

				// Fixes #7595 - Elements lose focus when wrapped.
				if (element[0] === active || $.contains(element[0], active)) {
					$(active).focus();
				}

				wrapper = element.parent(); // Hotfix for jQuery 1.4 since some
				// change in wrap() seems to
				// actually lose the reference to
				// the wrapped element

				// transfer positioning properties to the wrapper
				if (element.css("position") === "static") {
					wrapper.css({
						position: "relative"
					});
					element.css({
						position: "relative"
					});
				}
				else {
					$.extend(props, {
						position: element.css("position"),
						zIndex: element.css("z-index")
					});
					$.each(["top", "left", "bottom", "right"], function(i, pos) {

						props[pos] = element.css(pos);
						if (isNaN(parseInt(props[pos], 10))) {
							props[pos] = "auto";
						}
					});
					element.css({
						position: "relative",
						top: 0,
						left: 0,
						right: "auto",
						bottom: "auto"
					});
				}
				element.css(size);

				return wrapper.css(props).show();
			},

			removeWrapper: function(element) {

				var active = document.activeElement;

				if (element.parent().is(".ui-effects-wrapper")) {
					element.parent().replaceWith(element);

					// Fixes #7595 - Elements lose focus when wrapped.
					if (element[0] === active || $.contains(element[0], active)) {
						$(active).focus();
					}
				}

				return element;
			},

			setTransition: function(element, list, factor, value) {

				value = value || {};
				$.each(list, function(i, x) {

					var unit = element.cssUnit(x);
					if (unit[0] > 0) {
						value[x] = unit[0] * factor + unit[1];
					}
				});
				return value;
			}
		});

		// return an effect options object for the given parameters:
		function _normalizeArguments(effect, options, speed, callback) {

			// allow passing all options as the first parameter
			if ($.isPlainObject(effect)) {
				options = effect;
				effect = effect.effect;
			}

			// convert to an object
			effect = {
				effect: effect
			};

			// catch (effect, null, ...)
			if (options == null) {
				options = {};
			}

			// catch (effect, callback)
			if ($.isFunction(options)) {
				callback = options;
				speed = null;
				options = {};
			}

			// catch (effect, speed, ?)
			if (typeof options === "number" || $.fx.speeds[options]) {
				callback = speed;
				speed = options;
				options = {};
			}

			// catch (effect, options, callback)
			if ($.isFunction(speed)) {
				callback = speed;
				speed = null;
			}

			// add options to effect
			if (options) {
				$.extend(effect, options);
			}

			speed = speed || options.duration;
			effect.duration = $.fx.off ? 0 : typeof speed === "number" ? speed : speed in $.fx.speeds ? $.fx.speeds[speed] : $.fx.speeds._default;

			effect.complete = callback || options.complete;

			return effect;
		}

		function standardAnimationOption(option) {

			// Valid standard speeds (nothing, number, named speed)
			if (!option || typeof option === "number" || $.fx.speeds[option]) {
				return true;
			}

			// Invalid strings - treat as "normal" speed
			if (typeof option === "string" && !$.effects.effect[option]) {
				return true;
			}

			// Complete callback
			if ($.isFunction(option)) {
				return true;
			}

			// Options hash (but not naming an effect)
			if (typeof option === "object" && !option.effect) {
				return true;
			}

			// Didn't match any standard API
			return false;
		}

		$.fn.extend({
			effect: function( /* effect, options, speed, callback */) {

				var args = _normalizeArguments.apply(this, arguments), mode = args.mode, queue = args.queue, effectMethod = $.effects.effect[args.effect];

				if ($.fx.off || !effectMethod) {
					// delegate to the original method (e.g., .show()) if
					// possible
					if (mode) {
						return this[mode](args.duration, args.complete);
					}
					else {
						return this.each(function() {

							if (args.complete) {
								args.complete.call(this);
							}
						});
					}
				}

				function run(next) {

					var elem = $(this), complete = args.complete, mode = args.mode;

					function done() {

						if ($.isFunction(complete)) {
							complete.call(elem[0]);
						}
						if ($.isFunction(next)) {
							next();
						}
					}

					// If the element already has the correct final state,
					// delegate to
					// the core methods so the internal tracking of "olddisplay"
					// works.
					if (elem.is(":hidden") ? mode === "hide" : mode === "show") {
						elem[mode]();
						done();
					}
					else {
						effectMethod.call(elem[0], args, done);
					}
				}

				return queue === false ? this.each(run) : this.queue(queue || "fx", run);
			},

			show: (function(orig) {

				return function(option) {

					if (standardAnimationOption(option)) {
						return orig.apply(this, arguments);
					}
					else {
						var args = _normalizeArguments.apply(this, arguments);
						args.mode = "show";
						return this.effect.call(this, args);
					}
				};
			})($.fn.show),

			hide: (function(orig) {

				return function(option) {

					if (standardAnimationOption(option)) {
						return orig.apply(this, arguments);
					}
					else {
						var args = _normalizeArguments.apply(this, arguments);
						args.mode = "hide";
						return this.effect.call(this, args);
					}
				};
			})($.fn.hide),

			toggle: (function(orig) {

				return function(option) {

					if (standardAnimationOption(option) || typeof option === "boolean") {
						return orig.apply(this, arguments);
					}
					else {
						var args = _normalizeArguments.apply(this, arguments);
						args.mode = "toggle";
						return this.effect.call(this, args);
					}
				};
			})($.fn.toggle),

			// helper functions
			cssUnit: function(key) {

				var style = this.css(key), val = [];

				$.each(["em", "px", "%", "pt"], function(i, unit) {

					if (style.indexOf(unit) > 0) {
						val = [parseFloat(style), unit];
					}
				});
				return val;
			}
		});

	})();

	/** *************************************************************************** */
	/**
	 * ********************************* EASING
	 * **********************************
	 */
	/** *************************************************************************** */

	(function() {

		// based on easing equations from Robert Penner
		// (http://www.robertpenner.com/easing)

		var baseEasings = {};

		$.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(i, name) {

			baseEasings[name] = function(p) {

				return Math.pow(p, i + 2);
			};
		});

		$.extend(baseEasings, {
			Sine: function(p) {

				return 1 - Math.cos(p * Math.PI / 2);
			},
			Circ: function(p) {

				return 1 - Math.sqrt(1 - p * p);
			},
			Elastic: function(p) {

				return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
			},
			Back: function(p) {

				return p * p * (3 * p - 2);
			},
			Bounce: function(p) {

				var pow2, bounce = 4;

				while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {
				}
				return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
			}
		});

		$.each(baseEasings, function(name, easeIn) {

			$.easing["easeIn" + name] = easeIn;
			$.easing["easeOut" + name] = function(p) {

				return 1 - easeIn(1 - p);
			};
			$.easing["easeInOut" + name] = function(p) {

				return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
			};
		});

	})();

})(jQuery);
/*
 * ! jQuery UI Effects Blind 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/blind-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	var rvertical = /up|down|vertical/, rpositivemotion = /up|left|vertical|horizontal/;

	$.effects.effect.blind = function(o, done) {

		// Create element
		var el = $(this), props = ["position", "top", "bottom", "left", "right", "height", "width"], mode = $.effects.setMode(el, o.mode || "hide"), direction = o.direction || "up", vertical = rvertical.test(direction), ref = vertical ? "height" : "width", ref2 = vertical ? "top" : "left", motion = rpositivemotion.test(direction), animation = {}, show = mode === "show", wrapper, distance, margin;

		// if already wrapped, the wrapper's properties are my property. #6245
		if (el.parent().is(".ui-effects-wrapper")) {
			$.effects.save(el.parent(), props);
		}
		else {
			$.effects.save(el, props);
		}
		el.show();
		wrapper = $.effects.createWrapper(el).css({
			overflow: "hidden"
		});

		distance = wrapper[ref]();
		margin = parseFloat(wrapper.css(ref2)) || 0;

		animation[ref] = show ? distance : 0;
		if (!motion) {
			el.css(vertical ? "bottom" : "right", 0).css(vertical ? "top" : "left", "auto").css({
				position: "absolute"
			});

			animation[ref2] = show ? margin : distance + margin;
		}

		// start at 0 if we are showing
		if (show) {
			wrapper.css(ref, 0);
			if (!motion) {
				wrapper.css(ref2, margin + distance);
			}
		}

		// Animate
		wrapper.animate(animation, {
			duration: o.duration,
			easing: o.easing,
			queue: false,
			complete: function() {

				if (mode === "hide") {
					el.hide();
				}
				$.effects.restore(el, props);
				$.effects.removeWrapper(el);
				done();
			}
		});

	};

})(jQuery);
/*
 * ! jQuery UI Effects Bounce 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/bounce-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.bounce = function(o, done) {

		var el = $(this), props = ["position", "top", "bottom", "left", "right", "height", "width"],

		// defaults:
		mode = $.effects.setMode(el, o.mode || "effect"), hide = mode === "hide", show = mode === "show", direction = o.direction || "up", distance = o.distance, times = o.times || 5,

		// number of internal animations
		anims = times * 2 + (show || hide ? 1 : 0), speed = o.duration / anims, easing = o.easing,

		// utility:
		ref = (direction === "up" || direction === "down") ? "top" : "left", motion = (direction === "up" || direction === "left"), i, upAnim, downAnim,

		// we will need to re-assemble the queue to stack our animations in
		// place
		queue = el.queue(), queuelen = queue.length;

		// Avoid touching opacity to prevent clearType and PNG issues in IE
		if (show || hide) {
			props.push("opacity");
		}

		$.effects.save(el, props);
		el.show();
		$.effects.createWrapper(el); // Create Wrapper

		// default distance for the BIGGEST bounce is the outer Distance / 3
		if (!distance) {
			distance = el[ref === "top" ? "outerHeight" : "outerWidth"]() / 3;
		}

		if (show) {
			downAnim = {
				opacity: 1
			};
			downAnim[ref] = 0;

			// if we are showing, force opacity 0 and set the initial position
			// then do the "first" animation
			el.css("opacity", 0).css(ref, motion ? -distance * 2 : distance * 2).animate(downAnim, speed, easing);
		}

		// start at the smallest distance if we are hiding
		if (hide) {
			distance = distance / Math.pow(2, times - 1);
		}

		downAnim = {};
		downAnim[ref] = 0;
		// Bounces up/down/left/right then back to 0 -- times * 2 animations
		// happen here
		for (i = 0; i < times; i++) {
			upAnim = {};
			upAnim[ref] = (motion ? "-=" : "+=") + distance;

			el.animate(upAnim, speed, easing).animate(downAnim, speed, easing);

			distance = hide ? distance * 2 : distance / 2;
		}

		// Last Bounce when Hiding
		if (hide) {
			upAnim = {
				opacity: 0
			};
			upAnim[ref] = (motion ? "-=" : "+=") + distance;

			el.animate(upAnim, speed, easing);
		}

		el.queue(function() {

			if (hide) {
				el.hide();
			}
			$.effects.restore(el, props);
			$.effects.removeWrapper(el);
			done();
		});

		// inject all the animations we just queued to be first in line (after
		// "inprogress")
		if (queuelen > 1) {
			queue.splice.apply(queue, [1, 0].concat(queue.splice(queuelen, anims + 1)));
		}
		el.dequeue();

	};

})(jQuery);
/*
 * ! jQuery UI Effects Clip 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/clip-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.clip = function(o, done) {

		// Create element
		var el = $(this), props = ["position", "top", "bottom", "left", "right", "height", "width"], mode = $.effects.setMode(el, o.mode || "hide"), show = mode === "show", direction = o.direction || "vertical", vert = direction === "vertical", size = vert ? "height" : "width", position = vert ? "top" : "left", animation = {}, wrapper, animate, distance;

		// Save & Show
		$.effects.save(el, props);
		el.show();

		// Create Wrapper
		wrapper = $.effects.createWrapper(el).css({
			overflow: "hidden"
		});
		animate = (el[0].tagName === "IMG") ? wrapper : el;
		distance = animate[size]();

		// Shift
		if (show) {
			animate.css(size, 0);
			animate.css(position, distance / 2);
		}

		// Create Animation Object:
		animation[size] = show ? distance : 0;
		animation[position] = show ? 0 : distance / 2;

		// Animate
		animate.animate(animation, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: function() {

				if (!show) {
					el.hide();
				}
				$.effects.restore(el, props);
				$.effects.removeWrapper(el);
				done();
			}
		});

	};

})(jQuery);
/*
 * ! jQuery UI Effects Drop 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/drop-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.drop = function(o, done) {

		var el = $(this), props = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"], mode = $.effects.setMode(el, o.mode || "hide"), show = mode === "show", direction = o.direction || "left", ref = (direction === "up" || direction === "down") ? "top" : "left", motion = (direction === "up" || direction === "left") ? "pos" : "neg", animation = {
			opacity: show ? 1 : 0
		}, distance;

		// Adjust
		$.effects.save(el, props);
		el.show();
		$.effects.createWrapper(el);

		distance = o.distance || el[ref === "top" ? "outerHeight" : "outerWidth"](true) / 2;

		if (show) {
			el.css("opacity", 0).css(ref, motion === "pos" ? -distance : distance);
		}

		// Animation
		animation[ref] = (show ? (motion === "pos" ? "+=" : "-=") : (motion === "pos" ? "-=" : "+=")) + distance;

		// Animate
		el.animate(animation, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: function() {

				if (mode === "hide") {
					el.hide();
				}
				$.effects.restore(el, props);
				$.effects.removeWrapper(el);
				done();
			}
		});
	};

})(jQuery);
/*
 * ! jQuery UI Effects Explode 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/explode-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.explode = function(o, done) {

		var rows = o.pieces ? Math.round(Math.sqrt(o.pieces)) : 3, cells = rows, el = $(this), mode = $.effects.setMode(el, o.mode || "hide"), show = mode === "show",

		// show and then visibility:hidden the element before calculating offset
		offset = el.show().css("visibility", "hidden").offset(),

		// width and height of a piece
		width = Math.ceil(el.outerWidth() / cells), height = Math.ceil(el.outerHeight() / rows), pieces = [],

		// loop
		i, j, left, top, mx, my;

		// children animate complete:
		function childComplete() {

			pieces.push(this);
			if (pieces.length === rows * cells) {
				animComplete();
			}
		}

		// clone the element for each row and cell.
		for (i = 0; i < rows; i++) { // ===>
			top = offset.top + i * height;
			my = i - (rows - 1) / 2;

			for (j = 0; j < cells; j++) { // |||
				left = offset.left + j * width;
				mx = j - (cells - 1) / 2;

				// Create a clone of the now hidden main element that will be
				// absolute positioned
				// within a wrapper div off the -left and -top equal to size of
				// our pieces
				el.clone().appendTo("body").wrap("<div></div>").css({
					position: "absolute",
					visibility: "visible",
					left: -j * width,
					top: -i * height
				})

				// select the wrapper - make it overflow: hidden and absolute
				// positioned based on
				// where the original was located +left and +top equal to the
				// size of pieces
				.parent().addClass("ui-effects-explode").css({
					position: "absolute",
					overflow: "hidden",
					width: width,
					height: height,
					left: left + (show ? mx * width : 0),
					top: top + (show ? my * height : 0),
					opacity: show ? 0 : 1
				}).animate({
					left: left + (show ? 0 : mx * width),
					top: top + (show ? 0 : my * height),
					opacity: show ? 1 : 0
				}, o.duration || 500, o.easing, childComplete);
			}
		}

		function animComplete() {

			el.css({
				visibility: "visible"
			});
			$(pieces).remove();
			if (!show) {
				el.hide();
			}
			done();
		}
	};

})(jQuery);
/*
 * ! jQuery UI Effects Fade 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/fade-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.fade = function(o, done) {

		var el = $(this), mode = $.effects.setMode(el, o.mode || "toggle");

		el.animate({
			opacity: mode
		}, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: done
		});
	};

})(jQuery);
/*
 * ! jQuery UI Effects Fold 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/fold-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.fold = function(o, done) {

		// Create element
		var el = $(this), props = ["position", "top", "bottom", "left", "right", "height", "width"], mode = $.effects.setMode(el, o.mode || "hide"), show = mode === "show", hide = mode === "hide", size = o.size || 15, percent = /([0-9]+)%/.exec(size), horizFirst = !!o.horizFirst, widthFirst = show !== horizFirst, ref = widthFirst ? ["width", "height"] : ["height", "width"], duration = o.duration / 2, wrapper, distance, animation1 = {}, animation2 = {};

		$.effects.save(el, props);
		el.show();

		// Create Wrapper
		wrapper = $.effects.createWrapper(el).css({
			overflow: "hidden"
		});
		distance = widthFirst ? [wrapper.width(), wrapper.height()] : [wrapper.height(), wrapper.width()];

		if (percent) {
			size = parseInt(percent[1], 10) / 100 * distance[hide ? 0 : 1];
		}
		if (show) {
			wrapper.css(horizFirst ? {
				height: 0,
				width: size
			} : {
				height: size,
				width: 0
			});
		}

		// Animation
		animation1[ref[0]] = show ? distance[0] : size;
		animation2[ref[1]] = show ? distance[1] : 0;

		// Animate
		wrapper.animate(animation1, duration, o.easing).animate(animation2, duration, o.easing, function() {

			if (hide) {
				el.hide();
			}
			$.effects.restore(el, props);
			$.effects.removeWrapper(el);
			done();
		});

	};

})(jQuery);
/*
 * ! jQuery UI Effects Highlight 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/highlight-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.highlight = function(o, done) {

		var elem = $(this), props = ["backgroundImage", "backgroundColor", "opacity"], mode = $.effects.setMode(elem, o.mode || "show"), animation = {
			backgroundColor: elem.css("backgroundColor")
		};

		if (mode === "hide") {
			animation.opacity = 0;
		}

		$.effects.save(elem, props);

		elem.show().css({
			backgroundImage: "none",
			backgroundColor: o.color || "#ffff99"
		}).animate(animation, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: function() {

				if (mode === "hide") {
					elem.hide();
				}
				$.effects.restore(elem, props);
				done();
			}
		});
	};

})(jQuery);
/*
 * ! jQuery UI Effects Pulsate 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/pulsate-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.pulsate = function(o, done) {

		var elem = $(this), mode = $.effects.setMode(elem, o.mode || "show"), show = mode === "show", hide = mode === "hide", showhide = (show || mode === "hide"),

		// showing or hiding leaves of the "last" animation
		anims = ((o.times || 5) * 2) + (showhide ? 1 : 0), duration = o.duration / anims, animateTo = 0, queue = elem.queue(), queuelen = queue.length, i;

		if (show || !elem.is(":visible")) {
			elem.css("opacity", 0).show();
			animateTo = 1;
		}

		// anims - 1 opacity "toggles"
		for (i = 1; i < anims; i++) {
			elem.animate({
				opacity: animateTo
			}, duration, o.easing);
			animateTo = 1 - animateTo;
		}

		elem.animate({
			opacity: animateTo
		}, duration, o.easing);

		elem.queue(function() {

			if (hide) {
				elem.hide();
			}
			done();
		});

		// We just queued up "anims" animations, we need to put them next in the
		// queue
		if (queuelen > 1) {
			queue.splice.apply(queue, [1, 0].concat(queue.splice(queuelen, anims + 1)));
		}
		elem.dequeue();
	};

})(jQuery);
/*
 * ! jQuery UI Effects Scale 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/scale-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.puff = function(o, done) {

		var elem = $(this), mode = $.effects.setMode(elem, o.mode || "hide"), hide = mode === "hide", percent = parseInt(o.percent, 10) || 150, factor = percent / 100, original = {
			height: elem.height(),
			width: elem.width(),
			outerHeight: elem.outerHeight(),
			outerWidth: elem.outerWidth()
		};

		$.extend(o, {
			effect: "scale",
			queue: false,
			fade: true,
			mode: mode,
			complete: done,
			percent: hide ? percent : 100,
			from: hide ? original : {
				height: original.height * factor,
				width: original.width * factor,
				outerHeight: original.outerHeight * factor,
				outerWidth: original.outerWidth * factor
			}
		});

		elem.effect(o);
	};

	$.effects.effect.scale = function(o, done) {

		// Create element
		var el = $(this), options = $.extend(true, {}, o), mode = $.effects.setMode(el, o.mode || "effect"), percent = parseInt(o.percent, 10) || (parseInt(o.percent, 10) === 0 ? 0 : (mode === "hide" ? 0 : 100)), direction = o.direction || "both", origin = o.origin, original = {
			height: el.height(),
			width: el.width(),
			outerHeight: el.outerHeight(),
			outerWidth: el.outerWidth()
		}, factor = {
			y: direction !== "horizontal" ? (percent / 100) : 1,
			x: direction !== "vertical" ? (percent / 100) : 1
		};

		// We are going to pass this effect to the size effect:
		options.effect = "size";
		options.queue = false;
		options.complete = done;

		// Set default origin and restore for show/hide
		if (mode !== "effect") {
			options.origin = origin || ["middle", "center"];
			options.restore = true;
		}

		options.from = o.from || (mode === "show" ? {
			height: 0,
			width: 0,
			outerHeight: 0,
			outerWidth: 0
		} : original);
		options.to = {
			height: original.height * factor.y,
			width: original.width * factor.x,
			outerHeight: original.outerHeight * factor.y,
			outerWidth: original.outerWidth * factor.x
		};

		// Fade option to support puff
		if (options.fade) {
			if (mode === "show") {
				options.from.opacity = 0;
				options.to.opacity = 1;
			}
			if (mode === "hide") {
				options.from.opacity = 1;
				options.to.opacity = 0;
			}
		}

		// Animate
		el.effect(options);

	};

	$.effects.effect.size = function(o, done) {

		// Create element
		var original, baseline, factor, el = $(this), props0 = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"],

		// Always restore
		props1 = ["position", "top", "bottom", "left", "right", "overflow", "opacity"],

		// Copy for children
		props2 = ["width", "height", "overflow"], cProps = ["fontSize"], vProps = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], hProps = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],

		// Set options
		mode = $.effects.setMode(el, o.mode || "effect"), restore = o.restore || mode !== "effect", scale = o.scale || "both", origin = o.origin || ["middle", "center"], position = el.css("position"), props = restore ? props0 : props1, zero = {
			height: 0,
			width: 0,
			outerHeight: 0,
			outerWidth: 0
		};

		if (mode === "show") {
			el.show();
		}
		original = {
			height: el.height(),
			width: el.width(),
			outerHeight: el.outerHeight(),
			outerWidth: el.outerWidth()
		};

		if (o.mode === "toggle" && mode === "show") {
			el.from = o.to || zero;
			el.to = o.from || original;
		}
		else {
			el.from = o.from || (mode === "show" ? zero : original);
			el.to = o.to || (mode === "hide" ? zero : original);
		}

		// Set scaling factor
		factor = {
			from: {
				y: el.from.height / original.height,
				x: el.from.width / original.width
			},
			to: {
				y: el.to.height / original.height,
				x: el.to.width / original.width
			}
		};

		// Scale the css box
		if (scale === "box" || scale === "both") {

			// Vertical props scaling
			if (factor.from.y !== factor.to.y) {
				props = props.concat(vProps);
				el.from = $.effects.setTransition(el, vProps, factor.from.y, el.from);
				el.to = $.effects.setTransition(el, vProps, factor.to.y, el.to);
			}

			// Horizontal props scaling
			if (factor.from.x !== factor.to.x) {
				props = props.concat(hProps);
				el.from = $.effects.setTransition(el, hProps, factor.from.x, el.from);
				el.to = $.effects.setTransition(el, hProps, factor.to.x, el.to);
			}
		}

		// Scale the content
		if (scale === "content" || scale === "both") {

			// Vertical props scaling
			if (factor.from.y !== factor.to.y) {
				props = props.concat(cProps).concat(props2);
				el.from = $.effects.setTransition(el, cProps, factor.from.y, el.from);
				el.to = $.effects.setTransition(el, cProps, factor.to.y, el.to);
			}
		}

		$.effects.save(el, props);
		el.show();
		$.effects.createWrapper(el);
		el.css("overflow", "hidden").css(el.from);

		// Adjust
		if (origin) { // Calculate baseline shifts
			baseline = $.effects.getBaseline(origin, original);
			el.from.top = (original.outerHeight - el.outerHeight()) * baseline.y;
			el.from.left = (original.outerWidth - el.outerWidth()) * baseline.x;
			el.to.top = (original.outerHeight - el.to.outerHeight) * baseline.y;
			el.to.left = (original.outerWidth - el.to.outerWidth) * baseline.x;
		}
		el.css(el.from); // set top & left

		// Animate
		if (scale === "content" || scale === "both") { // Scale the children

			// Add margins/font-size
			vProps = vProps.concat(["marginTop", "marginBottom"]).concat(cProps);
			hProps = hProps.concat(["marginLeft", "marginRight"]);
			props2 = props0.concat(vProps).concat(hProps);

			el.find("*[width]").each(function() {

				var child = $(this), c_original = {
					height: child.height(),
					width: child.width(),
					outerHeight: child.outerHeight(),
					outerWidth: child.outerWidth()
				};
				if (restore) {
					$.effects.save(child, props2);
				}

				child.from = {
					height: c_original.height * factor.from.y,
					width: c_original.width * factor.from.x,
					outerHeight: c_original.outerHeight * factor.from.y,
					outerWidth: c_original.outerWidth * factor.from.x
				};
				child.to = {
					height: c_original.height * factor.to.y,
					width: c_original.width * factor.to.x,
					outerHeight: c_original.height * factor.to.y,
					outerWidth: c_original.width * factor.to.x
				};

				// Vertical props scaling
				if (factor.from.y !== factor.to.y) {
					child.from = $.effects.setTransition(child, vProps, factor.from.y, child.from);
					child.to = $.effects.setTransition(child, vProps, factor.to.y, child.to);
				}

				// Horizontal props scaling
				if (factor.from.x !== factor.to.x) {
					child.from = $.effects.setTransition(child, hProps, factor.from.x, child.from);
					child.to = $.effects.setTransition(child, hProps, factor.to.x, child.to);
				}

				// Animate children
				child.css(child.from);
				child.animate(child.to, o.duration, o.easing, function() {

					// Restore children
					if (restore) {
						$.effects.restore(child, props2);
					}
				});
			});
		}

		// Animate
		el.animate(el.to, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: function() {

				if (el.to.opacity === 0) {
					el.css("opacity", el.from.opacity);
				}
				if (mode === "hide") {
					el.hide();
				}
				$.effects.restore(el, props);
				if (!restore) {

					// we need to calculate our new positioning based on the
					// scaling
					if (position === "static") {
						el.css({
							position: "relative",
							top: el.to.top,
							left: el.to.left
						});
					}
					else {
						$.each(["top", "left"], function(idx, pos) {

							el.css(pos, function(_, str) {

								var val = parseInt(str, 10), toRef = idx ? el.to.left : el.to.top;

								// if original was "auto", recalculate the new
								// value from wrapper
								if (str === "auto") {
									return toRef + "px";
								}

								return val + toRef + "px";
							});
						});
					}
				}

				$.effects.removeWrapper(el);
				done();
			}
		});

	};

})(jQuery);
/*
 * ! jQuery UI Effects Shake 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/shake-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.shake = function(o, done) {

		var el = $(this), props = ["position", "top", "bottom", "left", "right", "height", "width"], mode = $.effects.setMode(el, o.mode || "effect"), direction = o.direction || "left", distance = o.distance || 20, times = o.times || 3, anims = times * 2 + 1, speed = Math.round(o.duration / anims), ref = (direction === "up" || direction === "down") ? "top" : "left", positiveMotion = (direction === "up" || direction === "left"), animation = {}, animation1 = {}, animation2 = {}, i,

		// we will need to re-assemble the queue to stack our animations in
		// place
		queue = el.queue(), queuelen = queue.length;

		$.effects.save(el, props);
		el.show();
		$.effects.createWrapper(el);

		// Animation
		animation[ref] = (positiveMotion ? "-=" : "+=") + distance;
		animation1[ref] = (positiveMotion ? "+=" : "-=") + distance * 2;
		animation2[ref] = (positiveMotion ? "-=" : "+=") + distance * 2;

		// Animate
		el.animate(animation, speed, o.easing);

		// Shakes
		for (i = 1; i < times; i++) {
			el.animate(animation1, speed, o.easing).animate(animation2, speed, o.easing);
		}
		el.animate(animation1, speed, o.easing).animate(animation, speed / 2, o.easing).queue(function() {

			if (mode === "hide") {
				el.hide();
			}
			$.effects.restore(el, props);
			$.effects.removeWrapper(el);
			done();
		});

		// inject all the animations we just queued to be first in line (after
		// "inprogress")
		if (queuelen > 1) {
			queue.splice.apply(queue, [1, 0].concat(queue.splice(queuelen, anims + 1)));
		}
		el.dequeue();

	};

})(jQuery);
/*
 * ! jQuery UI Effects Slide 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/slide-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.slide = function(o, done) {

		// Create element
		var el = $(this), props = ["position", "top", "bottom", "left", "right", "width", "height"], mode = $.effects.setMode(el, o.mode || "show"), show = mode === "show", direction = o.direction || "left", ref = (direction === "up" || direction === "down") ? "top" : "left", positiveMotion = (direction === "up" || direction === "left"), distance, animation = {};

		// Adjust
		$.effects.save(el, props);
		el.show();
		distance = o.distance || el[ref === "top" ? "outerHeight" : "outerWidth"](true);

		$.effects.createWrapper(el).css({
			overflow: "hidden"
		});

		if (show) {
			el.css(ref, positiveMotion ? (isNaN(distance) ? "-" + distance : -distance) : distance);
		}

		// Animation
		animation[ref] = (show ? (positiveMotion ? "+=" : "-=") : (positiveMotion ? "-=" : "+=")) + distance;

		// Animate
		el.animate(animation, {
			queue: false,
			duration: o.duration,
			easing: o.easing,
			complete: function() {

				if (mode === "hide") {
					el.hide();
				}
				$.effects.restore(el, props);
				$.effects.removeWrapper(el);
				done();
			}
		});
	};

})(jQuery);
/*
 * ! jQuery UI Effects Transfer 1.10.4 http://jqueryui.com
 * 
 * Copyright 2014 jQuery Foundation and other contributors Released under the
 * MIT license. http://jquery.org/license
 * 
 * http://api.jqueryui.com/transfer-effect/
 * 
 * Depends: jquery.ui.effect.js
 */
(function($, undefined) {

	$.effects.effect.transfer = function(o, done) {

		var elem = $(this), target = $(o.to), targetFixed = target.css("position") === "fixed", body = $("body"), fixTop = targetFixed ? body.scrollTop() : 0, fixLeft = targetFixed ? body.scrollLeft() : 0, endPosition = target.offset(), animation = {
			top: endPosition.top - fixTop,
			left: endPosition.left - fixLeft,
			height: target.innerHeight(),
			width: target.innerWidth()
		}, startPosition = elem.offset(), transfer = $("<div class='ui-effects-transfer'></div>").appendTo(document.body).addClass(o.className).css({
			top: startPosition.top - fixTop,
			left: startPosition.left - fixLeft,
			height: elem.innerHeight(),
			width: elem.innerWidth(),
			position: targetFixed ? "fixed" : "absolute"
		}).animate(animation, o.duration, o.easing, function() {

			transfer.remove();
			done();
		});
	};

})(jQuery);

$(function($) {

	$(".chkall").chkall();
	$(".labToggle").labToggle();
	$(".labDropdown").labDropdown();
	$(".labSelect").labSelect();
	$(".labPanel").labPanel();
	$(".labWindow").labWindow();
	$(".labMessage").labMessage();
	$(".labProgress").labProgress();
})
