/*
 * ! LabCore v3.0.3 (http://www.labcore.com) Copyright 2013 LabPHP, Inc.
 * Licensed under http://www.apache.org/licenses/LICENSE-2.0
 */
if (typeof jQuery === "undefined") {
	throw new Error("LabCore requires jQuery");
}

var keyboardCode = {
	ENTER: 13,
	ESC: 27,
	END: 35,
	HOME: 36,
	SHIFT: 16,
	TAB: 9,
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	DELETE: 46,
	BACKSPACE: 8
};

/**
 * 常用js全局函数
 */
jQuery.labcore = {
	undef: function(val, defaultVal) {

		return val === undefined ? defaultVal : val;
	},
	object2string: function(obj) {

		if (typeof (obj) == 'object') {
			var str = '';
			for (key in obj) {
				str = str + key + " => " + obj[key] + "\n";
			}
		}
		return str;
	},
	debug: function(msg) {

		if (typeof (msg) == 'object') {
			var str = '';
			for (key in msg) {
				str = str + key + " => " + msg[key] + "\n";
			}
			msg = str;
		}
		alert(msg);
	},
	layoutDebug: function() {

		$("div, header, footer, nav, aside, ol, ul, dl, table").each(function(i) {

			if (i % 2 == 0) {
				$(this).css('background-color', '#ff0');
			}
			else {
				$(this).css('background-color', '#00f');
			}
		});
	},
	date: function(format, timestamp) {

		if (!format || format.length == 0) {
			format = "yyyy-mm-dd";
		}

		// return new Date(parseInt(timestamp) *
		// 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
		return new Date(parseInt(timestamp) * 1000).format(format);
	},
	isArray: function(obj) {

		return Object.prototype.toString.call(obj) === '[object Array]';
	},
	isType: function(obj, type) {

		return (type === "Null" && obj === null) || (type === "Undefined" && obj === void 0) || (type === "Number" && isFinite(obj)) || Object.prototype.toString.call(obj).slice(8, -1) === type;
	},
	maxZIndex: function() {

		// var divs = document.getElementsByTagName("div");
		//
		// for ( var i = 0, max = 0; i < divs.length; i++) {
		// alert(divs[i].style.zIndex);
		// max = Math.max(max, divs[i].style.zIndex || 0);
		// }
		// return max;

		var maxZ = Math.max.apply(null, $.map($('body *'), function(e, n) {

			return parseInt($(e).css('z-index')) || 1;

		}));
		return maxZ;
	},
	/**
	 * @desc 添加到收藏夹，兼容firefox浏览器
	 */
	addToFavorite: function() {
		
		url = location.href;
		title = document.title;
		try {
			window.external.addFavorite(url, title);
		}
		catch (e) {
			try {
				window.sidebar.addPanel(title, url, '');
			}
			catch (e) {
				alert('加入收藏失败，请使用Ctrl+D进行添加');
			}
		}
	},
	setHomepage: function(obj, vrl) {

		try {
			obj.style.behavior = 'url(#default#homepage)';
			obj.setHomePage(vrl);
		}
		catch (e) {
			if (window.netscape) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
				}
				catch (e) {
					alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
				}
				var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
				prefs.setCharPref('browser.startup.homepage', vrl);
			}
		}
	}
};

(function($) {

	$.extend(Date.prototype, {
		format: function(format) {

			var o = {
				"M+": this.getMonth() + 1,
				"d+": this.getDate(),
				"h+": this.getHours(),
				"m+": this.getMinutes(),
				"s+": this.getSeconds(),
				"q+": Math.floor((this.getMonth() + 3) / 3),
				"S": this.getMilliseconds()
			}
			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for ( var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
				}
			}

			return format;
		}
	});
})(jQuery);

(function($) {

	$.extend(Array.prototype, {

		indexOf: function(val) {

			for ( var i = 0; i < this.length; i++) {
				if (this[i] == val)
					return i;
			}
			return -1;
		},
		remove: function(val) {

			var index = this.indexOf(val);
			if (index > -1) {
				this.splice(index, 1);
			}
		},
		del: function(index) {

			if (index > -1) {
				this.splice(index, 1);
			}
		}
	});
})(jQuery);

(function($) {

	/**
	 * 扩展String方法
	 */
	$.extend(String.prototype, {
		isPositiveInteger: function() {

			return (new RegExp(/^[1-9]\d*$/).test(this));
		},
		isInteger: function() {

			return (new RegExp(/^\d+$/).test(this));
		},
		isNumber: function(value, element) {

			return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(this));
		},
		trim: function() {

			return this.replace(/(^\s*)|(\s*$)|\r|\n/g, "");
		},
		startsWith: function(pattern) {

			return this.indexOf(pattern) === 0;
		},
		endsWith: function(pattern) {

			var d = this.length - pattern.length;
			return d >= 0 && this.lastIndexOf(pattern) === d;
		},
		replaceSuffix: function(index) {

			return this.replace(/\[[0-9]+\]/, '[' + index + ']').replace('#index#', index);
		},
		trans: function() {

			return this.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
		},
		encodeTXT: function() {

			return (this).replaceAll('&', '&amp;').replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;");
		},
		replaceAll: function(os, ns) {

			return this.replace(new RegExp(os, "gm"), ns);
		},
		replaceTm: function($data) {

			if (!$data)
				return this;
			return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function($1) {

				return $data[$1.replace(/[{}]+/g, "")];
			});
		},
		replaceTmById: function(_box) {

			var $parent = _box || $(document);
			return this.replace(RegExp("({[A-Za-z_]+[A-Za-z0-9_]*})", "g"), function($1) {

				var $input = $parent.find("#" + $1.replace(/[{}]+/g, ""));
				return $input.val() ? $input.val() : $1;
			});
		},
		isFinishedTm: function() {

			return !(new RegExp("{[A-Za-z_]+[A-Za-z0-9_]*}").test(this));
		},
		skipChar: function(ch) {

			if (!this || this.length === 0) {
				return '';
			}
			if (this.charAt(0) === ch) {
				return this.substring(1).skipChar(ch);
			}
			return this;
		},
		/*验证密码*/
		isValidPwd: function() {

			return (new RegExp(/^([_]|[a-zA-Z0-9]){6,32}$/).test(this));
		},
		/*验证邮箱*/
		isValidMail: function() {

			return (new RegExp(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/).test(this.trim()));
		},
		isSpaces: function() {

			for ( var i = 0; i < this.length; i += 1) {
				var ch = this.charAt(i);
				if (ch != ' ' && ch != "\n" && ch != "\t" && ch != "\r") {
					return false;
				}
			}
			return true;
		},
		/*验证手机号码*/
		isPhone: function() {
			
			return (new RegExp(/0?(13|14|15|18)[0-9]{9}/).test(this));
		},
		/*验证url*/
		isUrl: function() {

			return (new RegExp(/^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/).test(this));
		},
		/*验证身份证号码*/
		isCardId: function() {

			return (new RegExp(/\d{17}[\d|x]|\d{15}/).test(this));
		},
		/*验证日期格式*/
		isDateFormat: function() {

			return (new RegExp(/\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/).test(this));
		},
		/*验证中文字符*/
		isDateFormat: function() {

			return (new RegExp(/[\u4e00-\u9fa5]/).test(this));
		},
		/*验证外部url*/
		isExternalUrl: function() {

			return this.isUrl() && this.indexOf("://" + document.domain) == -1;
		}
	});
})(jQuery);

(function() {

	var matched, browser;

	// Use of jQuery.browser is frowned upon.
	// More details: http://api.jquery.com/jQuery.browser
	// jQuery.uaMatch maintained for back-compat
	jQuery.uaMatch = function(ua) {

		ua = ua.toLowerCase();

		var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

		return {
			browser: match[1] || "",
			version: match[2] || "0"
		};
	};

	matched = jQuery.uaMatch(navigator.userAgent);
	browser = {};

	if (matched.browser) {
		browser[matched.browser] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if (browser.chrome) {
		browser.webkit = true;
	}
	else if (browser.webkit) {
		browser.safari = true;
	}

	jQuery.browser = browser;

})(jQuery);

(function($) {

	var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g, meta = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"': '\\"',
		'\\': '\\\\'
	};

	/**
	 * jQuery.toJSON Converts the given argument into a JSON respresentation.
	 * 
	 * @param o
	 *            {Mixed} The json-serializble *thing* to be converted
	 * 
	 * If an object has a toJSON prototype, that will be used to get the
	 * representation. Non-integer/string keys are skipped in the object, as are
	 * keys that point to a function.
	 * 
	 */
	$.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function(o) {

		if (o === null) {
			return 'null';
		}

		var type = typeof o;

		if (type === 'undefined') {
			return undefined;
		}
		if (type === 'number' || type === 'boolean') {
			return '' + o;
		}
		if (type === 'string') {
			return $.quoteString(o);
		}
		if (type === 'object') {
			if (typeof o.toJSON === 'function') {
				return $.toJSON(o.toJSON());
			}
			if (o.constructor === Date) {
				var month = o.getUTCMonth() + 1, day = o.getUTCDate(), year = o.getUTCFullYear(), hours = o.getUTCHours(), minutes = o.getUTCMinutes(), seconds = o.getUTCSeconds(), milli = o.getUTCMilliseconds();

				if (month < 10) {
					month = '0' + month;
				}
				if (day < 10) {
					day = '0' + day;
				}
				if (hours < 10) {
					hours = '0' + hours;
				}
				if (minutes < 10) {
					minutes = '0' + minutes;
				}
				if (seconds < 10) {
					seconds = '0' + seconds;
				}
				if (milli < 100) {
					milli = '0' + milli;
				}
				if (milli < 10) {
					milli = '0' + milli;
				}
				return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
			}
			if (o.constructor === Array) {
				var ret = [];
				for ( var i = 0; i < o.length; i++) {
					ret.push($.toJSON(o[i]) || 'null');
				}
				return '[' + ret.join(',') + ']';
			}
			var name, val, pairs = [];
			for ( var k in o) {
				type = typeof k;
				if (type === 'number') {
					name = '"' + k + '"';
				}
				else if (type === 'string') {
					name = $.quoteString(k);
				}
				else {
					// Keys must be numerical or string. Skip others
					continue;
				}
				type = typeof o[k];

				if (type === 'function' || type === 'undefined') {
					// Invalid values like these return undefined
					// from toJSON, however those object members
					// shouldn't be included in the JSON string at all.
					continue;
				}
				val = $.toJSON(o[k]);
				pairs.push(name + ':' + val);
			}
			return '{' + pairs.join(',') + '}';
		}
	};

	/**
	 * jQuery.evalJSON Evaluates a given piece of json source.
	 * 
	 * @param src
	 *            {String}
	 */
	$.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function(src) {

		return eval('(' + src + ')');
	};

	/**
	 * jQuery.secureEvalJSON Evals JSON in a way that is *more* secure.
	 * 
	 * @param src
	 *            {String}
	 */
	$.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function(src) {

		var filtered = src.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		if (/^[\],:{}\s]*$/.test(filtered)) {
			return eval('(' + src + ')');
		}
		else {
			throw new SyntaxError('Error parsing JSON, source is not valid.');
		}
	};

	/**
	 * jQuery.quoteString Returns a string-repr of a string, escaping quotes
	 * intelligently. Mostly a support function for toJSON. Examples: >>>
	 * jQuery.quoteString('apple') "apple"
	 * 
	 * >>> jQuery.quoteString('"Where are we going?", she asked.') "\"Where are
	 * we going?\", she asked."
	 */
	$.quoteString = function(string) {

		if (string.match(escapeable)) {
			return '"' + string.replace(escapeable, function(a) {

				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + string + '"';
	};

})(jQuery);
/**
 * Cookie plugin
 * 
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de) Dual licensed under the MIT and
 * GPL licenses: http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 * 
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', {expires: 7, path: '/', domain:
 *          'jquery.com', secure: true});
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value.
 * 
 * @param String
 *            name The name of the cookie.
 * @param String
 *            value The value of the cookie.
 * @param Object
 *            options An object literal containing key/value pairs to provide
 *            optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date
 *         from now on in days or a Date object. If a negative value is
 *         specified (e.g. a date in the past), the cookie will be deleted. If
 *         set to null or omitted, the cookie will be a session cookie and will
 *         not be retained when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default:
 *         path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie
 *         (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be
 *         set and the cookie transmission will require a secure protocol (like
 *         HTTPS).
 * @type undefined
 * 
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 * 
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 * 
 * @param String
 *            name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 * 
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {

	if (typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			}
			else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires
			// attribute,
			// max-age is not
			// supported by IE
		}
		var path = options.path ? '; path=' + options.path : '';
		var domain = options.domain ? '; domain=' + options.domain : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	}
	else { // only name given, get cookie
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for ( var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};

// 兼容placeholder
(function() {

	$.fn.placeholder = function() {

		if (typeof document.createElement("input").placeholder == 'undefined') {
			$('[placeholder]').focus(function() {

				if ($(this).attr('type') == 'password') {
					return false;
				}
				var input = $(this);
				if (input.attr('placeholder')) {
					input.attr('pholder', input.attr('placeholder'));
				}
				if (input.val() == input.attr('placeholder')) {
					input.val('');
				}

			}).blur(function() {

				if ($(this).attr('type') == 'password') {
					return false;
				}
				var input = $(this);
				if (input.attr('placeholder')) {
					input.attr('pholder', input.attr('placeholder'));
				}
				if (input.val() == '') {
					input.val(input.attr('pholder'));
				}

			}).blur().parents('form').submit(function() {

				$(this).find('[placeholder]').each(function() {

					if ($(this).attr('type') == 'password') {
						return false;
					}
					var input = $(this);
					if (input.val() == input.attr('placeholder')) {
						input.val('');
					}
				})
			});
		}
	}

	$.fn.placeholder();

})();

/* ---------------------------------------------------------------------- */
/*
 * maxZIndex /*
 * ----------------------------------------------------------------------
 */
(function($) {

	$.maxZIndex = function() {

		// var divs = document.getElementsByTagName("div");
		//
		// for ( var i = 0, max = 0; i < divs.length; i++) {
		// alert(divs[i].style.zIndex);
		// max = Math.max(max, divs[i].style.zIndex || 0);
		// }
		// return max;

		var maxZ = Math.max.apply(null, $.map($('body *'), function(e, n) {

			return parseInt($(e).css('z-index')) || 1;

		}));
		return maxZ;
	}

})(jQuery);

/**
 * 组件标签属性解析
 */
(function($) {

	$.parser = {
		parseOptions: function(obj, options) {

			// _6, _7

			var $obj = $(obj); // t
			var defaults = {}; // _8
			var data_options = $.trim($obj.attr("data-options")); // s
			if (data_options) {
				var start_char = data_options.substring(0, 1); // _9
				var end_char = data_options.substring(data_options.length - 1, 1); // _a
				if (start_char != "{") {
					data_options = "{" + data_options;
				}
				if (end_char != "}") {
					data_options = data_options + "}";
				}
				defaults = (new Function("return " + data_options))();
			}
			if (options) {
				var defaults2 = {}; // _b
				for ( var i = 0; i < options.length; i++) {
					var pp = options[i];
					if (typeof pp == "string") {
						if (pp == "width" || pp == "height" || pp == "left" || pp == "top") {
							defaults2[pp] = parseInt(obj.style[pp]) || undefined;
						}
						else {
							defaults2[pp] = $obj.attr(pp);
						}
					}
					else {
						for ( var i in pp) { // _c
							var attr = pp[i]; // _d
							if (attr == "boolean") {
								defaults2[i] = $obj.attr(i) ? ($obj.attr(i) == "true") : undefined;
							}
							else {
								if (attr == "number") {
									defaults2[i] = $obj.attr(i) == "0" ? 0 : parseFloat($obj.attr(i)) || undefined;
								}
							}
						}
					}
				}
				$.extend(defaults, defaults2);
			}
			return defaults;
		}
	};
})(jQuery);

(function($) {

	$.fn.serializeJson = function() {

		var serializeObj = {};
		var array = this.serializeArray();
		var str = this.serialize();
		$(array).each(function() {

			if (serializeObj[this.name]) {
				if ($.isArray(serializeObj[this.name])) {
					serializeObj[this.name].push(this.value);
				}
				else {
					serializeObj[this.name] = [serializeObj[this.name], this.value];
				}
			}
			else {
				serializeObj[this.name] = this.value;
			}
		});
		return serializeObj;
	};
})(jQuery);