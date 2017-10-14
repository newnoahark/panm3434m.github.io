// $Id: jquery.labphp.js $

/**
 * dropdown
 */
(function($) {

	$(".dropdown").each(function() {

		var hover = eval($(this).attr("hover") || "true");
		var $this = $(this);
		var $switcher = $(this).find(".switcher");

		if (hover) {

			$(this).hover(function() {

				dropdown_toggle();
			}, function() {

				dropdown_toggle();
			});
		}
		else {
			$(this).click(function() {

				dropdown_toggle();
			});
		}

		function dropdown_toggle() {

			$this.toggleClass("active").find(".sub").toggle();

			if ($switcher.hasClass("switcher-down")) {
				$switcher.removeClass("switcher-down").addClass("switcher-up");
			}
			else if ($switcher.hasClass("switcher-up")) {
				$switcher.removeClass("switcher-up").addClass("switcher-down");
			}

			else if ($switcher.hasClass("switcher-right")) {
				$switcher.removeClass("switcher-right").addClass("switcher-left");
			}
			else if ($switcher.hasClass("switcher-left")) {
				$switcher.removeClass("switcher-left").addClass("switcher-right");
			}
		}
	});
})(jQuery);

/**
 * toggle
 */
(function($) {

	$(".toggle").each(function() {

		var $this = $(this);
		var toggleHover = eval($this.attr("toggle-hover") || "true");
		var target = $this.attr("target");

		$this.find(".toggle-switcher").click(function() {

			$(this).toggleClass("active");
			$this.find(".toggle-sub").toggle();
			$(target).toggle();
		});

		if (toggleHover) {
			$this.hover(function() {

				$(this).toggleClass("hover");
				$this.find(".toggle-sub").toggle();
				$(target).toggle();
			});
		}
	});
})(jQuery);

/**
 * multi-select
 */
(function() {

	$(".lab-select").each(function() {

		var $this = $(this);
		var opt = $.parseJSON($(this).attr("select-data"));
		var isMulti = $(this).hasClass("multi");

		var $selected = $(this).find(".input li");
		var $options = $(this).children(".sub").find(".option");

		if (!isMulti) {
			$selected.not(":first").remove();
		}
		else {
			$selected.each(function() {

				$(this).click(function() {

					$(this).remove();
				});
			});
		}

		$options.each(function() {

			$(this).click(function() {

				var selected = true;

				var rel = $(this).attr('rel') || '';
				var ref = $(this).find('.ref').text() || $(this).text();

				$this.find(".input li").each(function() {

					if ($(this).find("input").val() == rel) {
						selected = false;
						return 0;
					}
				});
				if (selected) {
					if (isMulti) {
						if (!opt.size || $this.find(".input li").length < opt.size) {
							$("<li></li>").text(ref).append($("<input>").val(rel).attr("type", 'hidden').attr("name", isMulti ? opt.inputName + "[]" : opt.inputName)).appendTo($this.find(".input ul")).click(function() {

								$(this).remove();
							});
						}
						else {
							alert("最多能选择 " + opt.size + " 项");
						}
					}
					else {
						$("<ul><li></li></ul>").text(ref).append($("<input>").val(rel).attr("type", 'hidden').attr("name", isMulti ? opt.inputName + "[]" : opt.inputName)).replaceAll($this.find(".input ul"))
					}
				}
			});
		});
	});
})(jQuery);

/**
 * progress
 */
(function() {

	$(".progress").each(function() {

		var $this = $(this);
		var $progress_bar = $this.find(".progress-bar");
		var max_value = eval($progress_bar.attr("max-value") || 100);
		var min_value = eval($progress_bar.attr("min-value") || 2);
		var now_value = eval($progress_bar.attr("now-value") || 2);

		if (!$this.hasClass("window")) {
			progress_animate();
		}
		else {
			var opt = $.parseJSON($this.attr("lab-window"));
			$(opt.trigger).click(function() {

				progress_animate();
			});
		}

		function progress_animate() {

			if (now_value > min_value) {
				if (now_value > max_value) {
					now_value = max_value;
				}
			}
			else if (min_value > 0) {
				now_value = min_value;
			}
			$progress_bar.animate({
				width: now_value + '%'
			}, 1000);
		}

	});

})(jQuery);

(function() {

	$(".close").click(function() {

		$(this).parent().hide();
	});
})(jQuery);

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

/*
 * ----------------------------------------------------------------------
 * LabDialog
 * ----------------------------------------------------------------------
 */
;
(function() {

	$.fn.labWindow = function(settings, callback) {

		var config = $.extend({
			open: true,
			trigger: "", // 触发器
			isModel: false, // 是否模态窗口
			top: 50, // 弹出框居中并且向上偏移的像素
			overlay: 0.4, // 遮盖层的透明度
			closeButton: ".close", // 关闭按钮
			maskClose: true, // 点击遮盖层是否关闭
			closeDelay: 2000, // 自动关闭时间
			autoClose: true, // 不是模态窗口时是否自动关闭
			animate: false, // 不是模态窗口时是否启用动画效果
			openDirect: 'left', // 弹出方向
			closeDirect: 'left', // 弹出层移出方向
			delay: 200, // 弹出层移出时间
			opacity: 1,
			title: '',
			content: '',
			titleObj: '.title',
			contentObj: '.content',
			closeFn: function() {

			}
		}, settings);

		// var $overlay = $("#lab-window-mask");

		return $(this).each(function() {

			var opt = config;
			var maxZIndex = $.maxZIndex() + 1;
			var $this = $(this);
			var $overlay;

			if (opt.isModel) {

				// if ($overlay.length == 0) {
				$overlay = $("<div class='lab-window-mask'></div>");
				$("body").append($overlay);
				// }

				$overlay.css({
					"display": "none",
					"z-index": maxZIndex++,
					opacity: 0
				});

				if (opt.maskClose) {
					$overlay.click(function(e) {

						close();
						e.preventDefault()
					});
				}
			}

			if (opt.title.length > 0) {
				$this.find(opt.titleObj).text(opt.title);
			}

			if (opt.content.length > 0) {
				$this.find(opt.contentObj).html(opt.content);
			}

			$this.find(opt.closeButton).click(function(e) {

				close();
				e.preventDefault()
			});

			$(opt.trigger).click(function() {

				open();
			});

			var height = $(this).outerHeight();
			var width = $(this).outerWidth();

			$(this).css({
				"display": "none",
				"position": "fixed",
				"opacity": 0,
				"z-index": maxZIndex,
				"left": 50 + "%",
				"margin-left": -(width / 2) + "px",
				"top": 50 + "%",
				"margin-top": -(height / 2) - opt.top + "px"
			});

			if (opt.open) {
				open();
			}

			function open() {

				if (opt.isModel) {
					$overlay.fadeTo(opt.delay, opt.overlay);
				}

				$this.fadeTo(opt.delay, opt.opacity).focus();

				if (!opt.isModel && opt.autoClose) {
					setTimeout(function() {

						close($this, opt);
					}, opt.closeDelay);
				}
			}

			function close() {

				if (opt.isModel) {
					$overlay.fadeOut(200);
				}

				if (opt.isModel || !opt.animate) {
					$this.hide();
				}
				else {
					if (opt.closeDirect == 'left') {
						$this.animate({
							left: 0,
							"opacity": 0
						}, opt.delay);
					}
					else if (opt.closeDirect == 'right') {
						$this.animate({
							right: 0,
							"opacity": 0
						}, opt.delay);
					}
					else if (opt.closeDirect == 'none') {
						$this.animate({
							"opacity": 0
						}, opt.delay);
					}
				}

				if (typeof (opt.closeFn) == 'function') {
					opt.closeFn();
				}
				else if (typeof (opt.closeFn) == 'string') {
					eval(opt.closeFn);
				}
			}
		});
	}

	$("[lab-window]").each(function() {

		var $this = $(this);
		var param = $this.attr("lab-window");

		if (param) {
			var paramJson = $.parseJSON(param);
		}

		$(this).labWindow(paramJson);
	});
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

/**
 * labSlide
 * 
 * @Desc 幻灯片插件
 * 
 * @Version 0.0.1
 * @Author XieJH
 * @Date 2013-2-4
 * @updated sqlhost 2014-12-2
 */

(function($) {

	function init(obj) {

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

			if (width < 2 * w) {
				repeat = Math.floor(2 * w / width);
				var html = $ul.html();

				for ( var i = 0; i < repeat; i++) {
					prop.ul.append(html);
				}

				prop.ul.width((repeat + 1) * width);
			}
		}
		else if (opt.direct == 'up' || opt.direct == 'down') {
			var height = prop.h * prop.n; // ul高度
			prop.ul.height(height);

			if (height < 2 * h) {
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

		if (opt.btn) {
			var $btnArea = $("<div></div>").appendTo($obj).css('position', 'absolute').css('zIndex', 30).css('display', 'block');

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
				$btnArea.css('left', "50%");
			}
			else {
				$btnArea.css('right', opt.btnRight);
			}
		}

		for (i = 0; i < prop.n; i++) {
			if (opt.btn) {
				if (opt.btnStyle == 'button') {
					$('<a></a>').appendTo($btnArea).html(opt.btnStyle == 'full' ? prop.li.eq(i).find('img').attr('alt') : (opt.btnText ? i + 1 : '&nbsp;')).css('font-size', opt.btnFontSize).css('font-family', opt.btnFont).css('text-align', 'center').css('width', opt.btnWidth).css('height', opt.btnHeight).css('display', 'block').css('float', opt.btnAlign == 'h' ? 'left' : 'none').css('background', opt.btnColor).css('margin-' + (opt.btnAlign == 'h' ? ($.inArray(opt.btnPos, [1, 4, 7]) ? 'right' : 'left') : ($.inArray(opt.btnPos, [1, 2, 3]) ? 'bottom' : 'top')), opt.btnMargin).css('border-radius', opt.btnBorderRadius).css('cursor', 'pointer');

				}
				else {
					// 图片按钮
				}
			}
		}

		if (opt.btn) {
			data.btn = $btnArea.find("a");
			data.btn.first().css('background', opt.btnActiveColor);
			data.btn.each(function(i) {
				
				$(this).click(function() {
					return false;
					slide(obj, i);
				});
			});
		}

		$.data(obj, 'labSlide', data);

		if (opt.auto) {
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

		if (opt.prev) {
			$prev = $(opt.prev);
			$prev.click(function() {

				if (!opt.hover) {
					var fn = slideStart(obj);
					slideStop(obj);
				}

				if (opt.direct == 'right' || opt.direct == 'left') {
					opt.direct = 'left';
				}
				else if (opt.direct == 'down' || opt.direct == 'up') {
					opt.direct = 'up';
				}

				slide(obj, fn);
			});
		}

		if (opt.next) {
			$next = $(opt.next);
			$next.click(function() {

				if (!opt.hover) {
					var fn = slideStart(obj);
					slideStop(obj);
				}

				if (opt.direct == 'right' || opt.direct == 'left') {
					opt.direct = 'right';
				}
				else if (opt.direct == 'down' || opt.direct == 'up') {
					opt.direct = 'down';
				}

				slide(obj, fn);
			});
		}
	}
	function slide(obj) {

		var data = $.data(obj, 'labSlide');
		var opt = data.options;
		var btn = data.btn;
		var i = data.current;

		switch (opt.direct) {
			case 'left':
				slideLeft(obj);
				if (i == data.prop.n - 1) {
					data.current = 0;
				}
				else {
					data.current = i + 1;
				}
				break;
			case 'right':
				slideRight(obj);
				if (i == 0) {
					data.current = data.prop.n - 1;
				}
				else {
					data.current = i - 1;
				}
				break;
			case 'up':
				slideUp(obj);
				if (i == data.prop.n - 1) {
					data.current = 0;
				}
				else {
					data.current = i + 1;
				}
				break;
			case 'down':
				slideDown(obj);
				if (i == 0) {
					data.current = data.prop.n - 1;
				}
				else {
					data.current = i - 1;
				}
				break;
			default:
				slideNone(obj);
		}

		if (opt.btn) {
			btn.eq(i).css('background', opt.btnColor);
			btn.eq(data.current).css('background', opt.btnActiveColor);
		}

		$.data(obj, 'labSlide', data);

	}

	function slideNone(obj) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		var $first = prop.ul.find(opt.li).slice(0, opt.amount);

		if (opt.direct == 'fade') {
			var $next = prop.ul.find(opt.li).not(":hidden").fadeOut().next();
			if ($next.length == 0) {
				prop.ul.find(opt.li).first().fadeIn(opt.duration, function() {

				});
			}
			else {
				$next.fadeIn(opt.duration, function() {

				});
			}

		}
		else {
			$first.appendTo(prop.ul);
		}
	}

	function slideLeft(obj) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		var $first = prop.ul.find(opt.li).slice(0, opt.amount);

		prop.ul.animate({
			left: '-' + prop.w * opt.amount + 'px'
		}, opt.duration, function() {

			$first.appendTo(prop.ul);
			prop.ul.css({
				left: 0
			});

		});
	}

	function slideRight(obj) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		prop.ul.find(opt.li).slice(-opt.amount).prependTo(prop.ul);
		prop.ul.css({
			left: '-' + prop.w * opt.amount + 'px'
		});

		prop.ul.animate({
			left: 0
		}, opt.duration, function() {

		});
	}

	function slideUp(obj) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		var $first = prop.ul.find(opt.li).slice(0, opt.amount);

		prop.ul.animate({
			top: -prop.h * opt.amount
		}, opt.duration, function() {

			if (opt.circle) {

				prop.ul.css({
					top: 0
				});
				$first.appendTo(prop.ul);

			}
		});
	}

	function slideDown(obj) {

		var opt = $.data(obj, 'labSlide').options;
		var prop = $.data(obj, 'labSlide').prop;

		prop.ul.find(opt.li).slice(-opt.amount).prependTo(prop.ul);
		prop.ul.css({
			top: '-' + prop.h * opt.amount + 'px'
		});

		prop.ul.animate({
			top: 0
		}, opt.duration, function() {

		});
	}

	function slideStart(obj) {

		var data = $.data(obj, 'labSlide');

		data.handle = setInterval(function() {

			$.data(obj, 'labSlide', data);
			slide(obj);
		}, data.options.interval);
	}

	function slideStop(obj) {

		var data = $.data(obj, 'labSlide');

		clearInterval(data.handle);
		data.handle = null;
		$.data(obj, 'labSlide', data);
	}

	$.fn.labSlide = function(config, param) {

		// config: _5b,param: _5c
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
				$labSlide.isLoaded = false;
			}
			else {

				opt = $.extend({}, $.fn.labSlide.defaults, config);

				var $ul = $(this).find(opt.ul);
				var $li = $ul.find(opt.li);

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
					isLoaded: false,
					handle: null,
					current: 0
				});

				init(this);
			}

		});
	};

	$.fn.labSlide.methods = {
		options: function(jq) {

			return $.data(jq[0], "labSlide").options;
		},
		slideStart: function(jq) {

			slideStart(jq[0]);
		},
		slideStop: function(jq) {

			slideStop(jq[0]);
		}
	};

	$.fn.labSlide.parseOptions = function(obj) {

		var $obj = $(obj);
		return $.fn.labSlide.parseOptions({}, {
		// 
		});
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
		btnStyle: 'button', // 按钮风格：full - 全屏，button - 按钮，

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
		btnActiveImageUrl: '' // ，全屏无效
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
