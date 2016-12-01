(function(ElementPrototype) {
    'use strict';
    if (typeof ElementPrototype.closest != 'function') {
        ElementPrototype.matches = ElementPrototype.matches || ElementPrototype.matchesSelector || ElementPrototype.webkitMatchesSelector || ElementPrototype.msMatchesSelector || function(selector) {
            var node = this,
                nodes = (node.parentNode || node.document).querySelectorAll(selector),
                i = -1;
            while (nodes[++i] && nodes[i] != node);
            return !!nodes[i];
        }
        ElementPrototype.closest = ElementPrototype.closest || function(selector) {
            var el = this;
            while (el.matches && !el.matches(selector)) el = el.parentNode;
            return el.matches ? el : null;
        }
    }
    window.isFullScreen = function() {
        return document.fullScreenElement || document.webkitIsFullScreen || document.mozFullScreen || document.oFullScreen || document.fullScreen;
    }
    window.requestFullScreen = function(element) {
        if (element.requestFullscreen)
            element.requestFullscreen();
        else if (element.msRequestFullscreen)
            element.msRequestFullscreen();
        else if (element.mozRequestFullScreen)
            element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen)
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }

    window.exitFullScreen = function() {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
    }

    window.toggleFullScreen = function(element) {
        if (isFullScreen())
            cancelFullScreen();
        else
            requestFullScreen(element || document.documentElement);
    }
})(Element.prototype);

if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
if (typeof Date.prototype.format != 'function') {
    Date.prototype.format = function(formatString) {
        'use strict';
        var o = {
            Y: this.getFullYear(),
            M: this.getMonth() + 1,
            D: this.getDate(),
            H: this.getHours(),
            m: this.getMinutes(),
            S: this.getSeconds()
        };
        var reg = new RegExp('[Yy]+|M+|[Dd]+|[Hh]+|m+|[Ss]+', 'g');
        var regM = new RegExp('m');
        var regY = new RegExp('y', 'i');
        if (formatString) {
            return formatString.replace(reg, function(v) {
                var old = v;
                if (regM.test(v)) {
                    old = o.m;
                } else if (regY.test(v)) {
                    var y = '' + o.Y;
                    var le = y.length - (v.length == 1 ? 2 : v.length);
                    old = y.substring(y.length, le)
                } else {
                    var key = v.toUpperCase().substr(0, 1);
                    old = o[key];
                    if (v.length > 1 && o[key] < 10) {
                        old = '0' + old;
                    }
                }
                return old;
            });
        } else {
            return this.format('yyyy/MM/dd HH:mm:ss');
        }
    };
}
if (typeof String.prototype.parseURL != 'function') {
    String.prototype.parseURL = function() {
        'use strict';
        //url解析
        var url = this.toString()
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            pathname: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/'),
            params: (function() {
                var ret = {};
                var seg = a.search.replace(/^\?/, '').split('&').filter(function(v, i) {
                    if (v !== '' && v.indexOf('=')) {
                        return true;
                    }
                });
                for (var i = 0, element; element = seg[i++];) {
                    var idx = element.indexOf('=');
                    var key = element.substring(0, idx);
                    var val = element.substring(idx + 1);
                    ret[key] = val;
                }
                return ret
            })()
        }
    };
}

if (typeof String.prototype.dbLength != 'function') {
    String.prototype.dbLength = function() {
        'use strict';
        //判断双字节字符串长度
        var str = this;
        var leg = str.length;
        for (var i in str) {
            if (str.hasOwnProperty(i)) {
                var s = str[i];
                //转换Unicode 编码,再转16进制
                var db = s.charCodeAt(0).toString(16).length == 4;
                if (db) leg += 1;
            }
        }
        return leg;
    };
}

if (typeof String.prototype.phoneFilter != 'function') {
    String.prototype.phoneFilter = function(cf) {
        'use strict';
        //138****38000
        var str = this.toString();
        var confuse = cf || '*';
        var confuseStr = (function() {
            var s = '';
            for (var i = 0; i < 4; i++) {
                s += confuse;
            }
            return s;
        })();
        var num = str.match(/(1\d{10})/g);
        if (num) {
            for (var i = 0, re; re = num[i++];) {
                var reg = new RegExp(re, 'g');
                var pre = re.substr(0, 3);
                var end = re.substr(7, 4)
                str = str.replace(reg, pre + confuseStr + end);
            }
        }
        return str;
    };
}
if (typeof String.prototype.isPhone != 'function') {
    String.prototype.isPhone = function() {
        'use strict';
        var num = this.toString();
        var operators = ['移动', '联通', '电信'].map(function(v) {
            return '\u4e2d\u56fd' + v
        });
        operators.push('未知号段');
        var obj = [!1, [!1, !1, !1, [1, 1, 1, 2, [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, !1], 0, 0, 0, 0, 0, !1],
            [3, 3, 3, 3, 3, 1, 3, 0, 1, 2, !1],
            [0, 0, 0, 2, 1, 1, 1, 0, 0, 0, !1], !1, [
                [2, 2, 2, 0, 1, 0, 0, 1, 1, 1, !1], 1, !1, 2, !1, 1, 1, 2, 0, !1, !1
            ],
            [2, 2, 0, 0, 0, 1, 1, 0, 0, 2, !1], !1, !1
        ], !1, !1, !1, !1, !1, !1, !1, !1];
        var type = '';
        var back = false;
        if (!num) {
            return back;
        }
        if (/^1[34578]\d{9}$/.test(num)) {
            var n = num.split('');
            if (obj[n[0]] !== false) {
                if (typeof obj[n[0]] == 'number') {
                    type = operators[n[0]];
                    back = true;
                } else {
                    if (typeof obj[n[0]][n[1]] == 'number') {
                        type = operators[n[1]];
                        back = true;
                    } else {
                        if (typeof obj[n[0]][n[1]][n[2]] == 'number') {
                            type = operators[n[2]];
                            back = true;
                        } else {
                            if (typeof obj[n[0]][n[1]][n[2]][n[3]] == 'number') {
                                type = operators[n[3]];
                                back = true;
                            }
                        }
                    }
                }
            }
        }
        return back;
    }
}
String.prototype.dateFormat = function(format) {
    'use strict';
    var s = this.toString();
    var d = Date.parse(s);
    if (isNaN(d)) {
        return 'NaN';
    } else {
        //extend Date.format
        return new Date(s).format(format)
    }
}

/**************************** window *****************************/
if (typeof window.Obj2Url != 'function') {
    window.obj2Url = function(obj) {
        'use strict';
        if (obj && obj instanceof Object) {
            var arr = [];
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    if (typeof obj[i] == 'function') obj[i] = obj[i]();
                    if (obj[i] == null) obj[i] = '';
                    arr.push(escape(i) + '=' + escape(obj[i]));
                }
            }
            return arr.join('&').replace(/%20/g, '+');
        } else {
            return obj;
        }
    };
};
if (typeof window.hashString != 'function') {
    window.hashString = function() {
        'use strict';
        var leg = arguments.length ? arguments[0] : 32;
        var lowcaseArr = [];
        var uppercaseArr = [];
        var numArr = [];
        for (var i = 0; i < 26; i++) {
            var chat = String.fromCharCode(97 + i);
            lowcaseArr.push(chat);
            uppercaseArr.push(chat.toUpperCase());
            if (i < 10) {
                numArr.push(i);
            }
        }
        var chatArr = lowcaseArr.concat(uppercaseArr);
        var backStr = [];
        for (var i = 0; i < leg; i++) {
            if (i == 0) {
                backStr.push(chatArr[parseInt(Math.random() * chatArr.length)]);
            } else {
                var numOrChat = parseInt(Math.random() * 2);
                if (numOrChat == 0) {
                    backStr.push(numArr[parseInt(Math.random() * numArr.length)]);
                } else {
                    backStr.push(chatArr[parseInt(Math.random() * chatArr.length)]);
                }
            }
        }
        return backStr.join('');
    }
}

/**************************** canvas *****************************/
CanvasRenderingContext2D.prototype.sector = function(xAxis, yAxis, radius, startAngle, endAngle, bgColor) {
    'use strict';
    this.moveTo(xAxis, yAxis);
    this.arc(xAxis, yAxis, radius, startAngle, endAngle);
    this.lineTo(xAxis, yAxis);
    this.fillStyle = bgColor;
    this.fill();
    this.save();
};
/**************************** array *****************************/
if (typeof Array.prototype.unique != 'function') {
    // 一维数组去重
    Array.prototype.unique = function(key) {
        'use strict';
        var arr = this;
        var n = [arr[0]];
        for (var i = 1; i < arr.length; i++) {
            if (key === undefined) {
                if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
            } else {
                inner: {
                    var has = false;
                    for (var j = 0; j < n.length; j++) {
                        if (arr[i][key] == n[j][key]) {
                            has = true;
                            break inner;
                        }
                    }
                }
                if (!has) {
                    n.push(arr[i]);
                }
            }
        }
        return n;
    }
}
var API = {
    ajax: function(options) {
        function empty() {}
        var opt = {
            url: '',//请求地址
            sync: true, //true，异步 | false　同步，会锁死浏览器，并且open方法会报浏览器警告
            method: 'GET',//提交方法
            data: null,//提交数据
            username: null,//账号
            password: null,//密码
            dataType: null,//返回数据类型
            success: empty,//成功返回回调
            error: empty,//错误信息回调
            timeout: 0,//请求超时ms
        };
        for (var i in options) {
            if (options.hasOwnProperty(i)) opt[i] = options[i];
        }
        var accepts = {
            script: 'text/javascript, application/javascript, application/x-javascript',
            json: 'application/json',
            xml: 'application/xml, text/xml',
            html: 'text/html',
            text: 'text/plain'
        };
        var abortTimeout = null;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty;
                clearTimeout(abortTimeout);
                var result, error = false,
                    dataType;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob') {
                        result = xhr.response;
                    } else {
                        result = xhr.responseText;
                        dataType = opt.dataType ? opt.dataType : xhr.getResponseHeader('content-type').split(';', 1)[0];
                        for (var i in accepts) {
                            if (accepts.hasOwnProperty(i) && accepts[i].indexOf(dataType) > -1) {
                                dataType = i;
                            }
                        }
                        try {
                            if (dataType == 'script') {
                                eval(result);
                            } else if (dataType == 'xml') {
                                result = xhr.responseXML
                            } else if (dataType == 'json') {
                                result = result.trim() == '' ? null : JSON.parse(result)
                            }
                        } catch (e) {
                            opt.error(e, xhr);
                            xhr.abort();
                        }
                    }
                    opt.success(result, xhr);
                } else {
                    opt.error(xhr.statusText, xhr);
                }
            }
        };
        if (opt.method == 'GET') {
            var parse = opt.url.parseURL();
            opt.data = Object.assign({}, opt.data, parse.params);
            opt.url = parse.pathname + '?' + obj2Url(opt.data);
            opt.data = null;
        }
        xhr.open(opt.method, opt.url, opt.sync, opt.username, opt.password);
        if (opt.method == 'POST') {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        if (opt.timeout > 0) {
            abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty
                xhr.abort();
                opt.error('timeout', xhr);
            }, opt.timeout)
        }
        xhr.send(opt.data ? obj2Url(opt.data) : null);
    }
}
