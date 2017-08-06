
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
String.prototype.parseURL = function() {
    'use strict';
    //url解析
    var url = this.toString()
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol,
        origin: a.origin,
        hostname: a.hostname,
        port: a.port,
        search: a.search,
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
String.prototype.isPhone = function(showType) {
    var num = this.toString();
    num = num.replace(/^\+86/,'');
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
    };
    if (/^1[34578]\d{9}$/.test(num)) {
        var n = num.split('');
        if (obj[n[0]] !== false) {
            if (typeof obj[n[0]] == 'number') {
                type = operators[obj[n[0]]];
                back = true;
            } else {
                if (typeof obj[n[0]][n[1]] == 'number') {
                    type = operators[obj[n[0]][n[1]]];
                    back = true;
                } else {
                    if (typeof obj[n[0]][n[1]][n[2]] == 'number') {
                        type = operators[obj[n[0]][n[1]][n[2]]];
                        back = true;
                    } else {
                        if (typeof obj[n[0]][n[1]][n[2]][n[3]] == 'number') {
                            type = operators[obj[n[0]][n[1]][n[2]][n[3]]];
                            back = true;
                        }
                    }
                }
            }
        }
    };
    if (showType) {
        return {
            is: back,
            type: type
        };
    } else {
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

String.prototype.renderHTML = function(obj) {
    var html = this;
    var reg = new RegExp('\\$\\{[\\s\\w_]+\\}', 'g');
    if (typeof obj === 'string') {
        html = html.replace(reg, obj);
    } else {
        html = html.replace(reg, function(v) {
            var key = v.replace(/\$\{\s*|\s*\}/g, '');
            v = obj[key];
            return v;
        });
    };
    return html;
};
String.prototype.mergeParams = function(obj) {
    if (obj) {
        var url = this;
        var urlObj = url.parseURL();
        var params = toUrl(Object.assign({}, obj, urlObj.params));
        url = urlObj.origin + urlObj.pathname + '?' + params;
        return url;
    } else {
        return this;
    }
};
String.prototype.decode = function() {
    var str = this.toString();
    try {
        str = decodeURIComponent(str)
    } catch (e) {}
    return str;
};
String.prototype.encode = function() {
    return encodeURIComponent(this.toString())
};
/**************************** window *****************************/

function toUrl(obj) {
    if (obj && obj instanceof Object) {
        var arr = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (Array.isArray(obj[i])) {
                    obj[i].forEach(function(v) {
                        arr.push(escape(i) + '=' + escape(v));
                    });
                } else {
                    if (typeof obj[i] == 'function') obj[i] = obj[i]();
                    if (obj[i] == null || obj[i] == undefined) obj[i] = '';
                    arr.push(escape(i) + '=' + escape(obj[i]));
                }
            }
        }
        return arr.join('&').replace(/%20/g, '+');
    } else {
        return obj;
    }
};
function randomString() {
    var str = 'str';
    str += Math.random() + new Date().getTime();
    str = str.replace('.', '');
    return str;
};
function uuid() {
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

/**************************** canvas *****************************/
//任意扇形
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
var ajax = function(options) {
    function empty() {}
    var opt = {
        url: '', //请求地址
        sync: true, //true，异步 | false　同步，会锁死浏览器，并且open方法会报浏览器警告
        method: 'GET', //提交方法
        data: null, //提交数据
        username: null, //账号
        password: null, //密码
        dataType: null, //返回数据类型
        success: empty, //成功返回回调
        error: empty, //错误信息回调
        timeout: 0, //请求超时ms
    };
    for (var i in options) {
        if (options.hasOwnProperty(i) && options[i] !== undefined) opt[i] = options[i];
    };
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
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && opt.data.parseURL().protocol == 'file:')) {
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
                            result = result.trim() == '' ? null : JSON.parse(result);
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
        opt.url = parse.pathname + '?' + toUrl(opt.data);
        opt.data = null;
    };
    xhr.open(opt.method, opt.url, opt.sync, opt.username, opt.password);
    if (opt.method == 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    };
    if (opt.timeout > 0) {
        abortTimeout = setTimeout(function() {
            xhr.onreadystatechange = empty;
            xhr.abort();
            opt.error('timeout', xhr);
        }, opt.timeout);
    };
    xhr.send(opt.data ? toUrl(opt.data) : null);
};
var request = (function() {
    var req = location.href.parseURL().params;
    var nReq = {};
    for (var i in req) {
        if (req.hasOwnProperty(i)) {
            var v = req[i];
            var k = i.toLowerCase();
            //将true,undefined,number,null,等转成对应数据类型，而不是统一的字符串'true','number'...
            if (/^(\d+|true|false|undefined|null)$/.test(v) && v.length<11) {
                nReq[k] = eval(v);
            } else {
                nReq[k] = v;
            }
        }
    }
    return nReq;
})();
var browser = (function() {
    var ua = window.navigator.userAgent;
    var os = {
        android: ua.match(/android [\d\.]+/i),
        ios: ua.match(/(iphone|ipad|ipod|itouch);[\w\s]+[\d_]+/i),
        mac: ua.match(/mac[\w\s]+[\d_]+/i),
        windows: ua.match(/windows[\w\s]+[\d\.]+/i),
        ie: ua.match(/(Edge|ie|rv)[\/\s:][\d.]+/i),
        weixin: ua.match(/micromessenger\/[\d\.]+/i),
        weixinJSBridge: typeof WeixinJSBridge == "object",
        mqqbrowser: ua.match(/mqqbrowser\/[\d\.]+/i),
        weibo: ua.match(/weibo[\d\._]+/i),
        qq: ua.match(/qq\/[\d\._]+/i),
        chrome: ua.match(/chrome[\/\s]+[\d\._]+/i),
    };
    var v = {};
    for (var i in os) {
        if (os.hasOwnProperty(i)) {
            if (os[i]) {
                var result = os[i][0];
                var version = result.match(/[\d\._]+/)[0];
                version = version.replace(/^_+|_+$/g, '');
                version = version.replace(/_+/g, '.');
                v[i + 'V'] = version;
                os[i] = true
            }
        }
    }
    os = Object.assign({}, os, v);
    os.mobile = /mobile/i.test(ua) ? true : null;
    os.nettype = /nettype/i.test(ua) ? ua.match(/nettype\/\w+/i)[0].split('/')[1].toLowerCase() : null;
    os.tbs = /tbs/i.test(ua) ? ua.match(/tbs\/\d+/i)[0].split('/')[1] : null;
    if (os.chrome && os.chromeV.match(/\d+/ > 100)) {
        os.chrome = null;
        os.chromeV = null;
    }
    return os;
})();
function loadCss(url, back, err) {
    var back = back || function() {};
    var err = err || function() {};
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    link.addEventListener('load', function() {
        back();
    }, false);
    link.addEventListener('error', function() {
        err();
    }, false);
};

function loadScript(src, back, err) {
    var back = back || function() {};
    var err = err || function() {};
    var script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
    script.addEventListener('load', function() {
        back();
    }, false);
    script.addEventListener('error', function() {
        err();
    }, false);
}

function loadFile(files, back) {
    if (arguments.length == 0) {
        return;
    }
    var list = [];
    if (files instanceof Array) {
        list = files;
    } else {
        list = [files];
    };
    var back = back || function() {};
    var loaded = 0;
    for (var i = 0; i < list.length; i++) {
        var file = list[i];
        var isCSS = /\.css/.test(file);
        var isJS = /\.js/.test(file);
        var isHTML = /\.html/.test(file);
        var url = file.mergeParams({ t: new Date().getTime() });
        if (isCSS) {
            loadCss(url, function() {
                common();
            }, function() {
                common();
            });
        } else if (isJS) {
            loadScript(url, function() {
                common();
            }, function() {
                common();
            });
        } else if (isHTML) {
            ajax({
                url: url,
                dataType: 'html',
                success: function(d) {
                    common(d);
                },
                error: function(e) {
                    common(e);
                }
            });
        }
    }

    function common(text) {
        loaded++;
        if (list.length == loaded) {
            if (text != undefined) {
                back(text);
            } else {
                back();
            }
        }
    };
};
function setPageTitle(title) {
    document.title = title === undefined ? document.title : title;
    if (browser.weixin) {
        var iframe = document.createElement('iframe');
        iframe.src = 'favicon.ico';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.onload = function() {
            setTimeout(function() {
                iframe.parentNode.removeChild(iframe);
            }, 9);
        }
    }
};
//加法函数
Number.prototype.plus = function(arg) {
    var arg1 = this;
    var arg2 = arg;
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    return (arg1 * m + arg2 * m) / m;
};
//减法函数
Number.prototype.subtract = function(arg) {
    var arg1 = this;
    var arg2 = arg;
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //last modify by deeka
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg2 * m - arg1 * m) / m).toFixed(n);
};
//乘法函数
Number.prototype.multiply = function(arg) {
    var arg1 = this;
    var arg2 = arg;
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) {};
    try { m += s2.split(".")[1].length } catch (e) {};
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};
//除法函数
Number.prototype.divide = function(arg) {
    var arg1 = this;
    var arg2 = arg;
    var t1 = 0,
        t2 = 0,
        r1, r2;
    try { t1 = arg1.toString().split(".")[1].length } catch (e) {};
    try { t2 = arg2.toString().split(".")[1].length } catch (e) {};
    with(Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
};

var checkIdCard = {
    zh:function (number) {
        // 中国居民身份证
        var num = number.replace(/\s+/g, '');
        if (/^\d{17}[\dx]$/.test(num)) {
            return true;
        }else{
            return false;
        }
    },
    passport:function (number) {
        // 护照
        var num = number.replace(/\s+/g, '');
        if (/^[eg]\d{8}$/i.test(num)) {
            return true;
        }else{
            return false;
        }
    },
    officers:function (number) {
        // 军官证
        var num = number.replace(/\s+/g, '');
        if (/^\d{8}$/.test(num)) {
            return true;
        }else{
            return false;
        }
    },
    hk: function(number) {
        // 香港身份证
        var num = number.replace(/\s+/g, '');
        if (/^[a-zA-Z]\d{6}[（\(][aA0-9][\)）]$/.test(num)) {
            var codeTable = [0, "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            var firstCode = num.substr(0, 1).toUpperCase();
            var firstNum = codeTable.indexOf(firstCode);
            var codeNum = num.match(/\d{6}/)[0].split('').map(function(v, i) {
                return v * (7 - i) }).reduce(function(v1, v2) {
                return v1 + v2 });
            var checkCode = num.match(/(?![（\(])[aA0-9](?=[\)）])/)[0].toUpperCase();
            var resultCheckCode = (firstNum * 8 + codeNum) % 11;
            if (resultCheckCode == 1) {
                resultCheckCode = 'A';
            } else {
                resultCheckCode = 11 - resultCheckCode;
            }
            return checkCode == resultCheckCode;
        } else {
            return false;
        }
    },
    mac: function(number) {
        // 澳门身份证
        var num = number.replace(/\s+/g, '');
        if (/^[157]\/?\d{6}$\/?[（\(]\d[\)）]$/.test(num)) {
            return true;
        } else {
            return false;
        }
    },
    tw: function(number) {
        // 台湾身份证
        var num = number.replace(/\s+/g, '');
        if (/^[a-zA-Z][12]\d{8}$/.test(num)) {
            var codeTable = { A: [1, 0], B: [1, 1], C: [1, 2], D: [1, 3], E: [1, 4], F: [1, 5], G: [1, 6], H: [1, 7], I: [3, 4], J: [1, 8], K: [1, 9], L: [2, 0], M: [2, 1], N: [2, 2], O: [3, 5], P: [2, 3], Q: [2, 4], R: [2, 5], S: [2, 6], T: [2, 7], U: [2, 8], V: [2, 9], W: [3, 2], X: [3, 0], Y: [3, 1], Z: [3, 3] };
            var firstNums = codeTable[num.substr(0, 1)];
            var code = num.match(/\d{8}/)[0].split('');
            code.unshift(firstNums[1]);
            code = code.map(function (v,i) {
                return v*(9-i)
            }).reduce(function (v1,v2) {
                return v1+v2;
            });
            var endNum = num.match(/\d$/)[0]; 
            var resultNum = 10-(firstNums[0]+code)%10;
            return resultNum==endNum;
        } else {
            return false;
        }
    },
    checkAll:function (number) {
        return this.zh(number)|| this.hk(number)|| this.mac(number)|| this.tw(number)
    }
};

function uploadFile(file,fileName,back) {
    var file = file;
    var formdata = new FormData();
    formdata.append(fileName, file);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState == 4) {
            var data = JSON.parse(xhr.responseText);
            typeof back =='function'&&back(data);
        }
    });
    xhr.open('POST', 'url');
    xhr.send(formdata);
}
function checkFileType(type, file, back) {
    /**
     * type png jpg mp4 ...
     * file input.change=> this.files[0]
     * back callback(boolean)
     */
    // http://www.garykessler.net/library/file_sigs.html
    var args = arguments;
    if (args.length != 3) {
        back(0);
    }
    var type = args[0]; // type = '(png|jpg)' , 'png'
    var file = args[1];
    var back = typeof args[2] == 'function' ? args[2] : function() {};
    if (file.type == '') {
        // 如果系统无法获取文件类型，则读取二进制流，对二进制进行解析文件类型
        var imgType = [
            'ff d8 ff', //jpg
            '89 50 4e', //png

            '0 0 0 14 66 74 79 70 69 73 6F 6D', //mp4
            '0 0 0 18 66 74 79 70 33 67 70 35', //mp4
            '0 0 0 0 66 74 79 70 33 67 70 35', //mp4
            '0 0 0 0 66 74 79 70 4D 53 4E 56', //mp4
            '0 0 0 0 66 74 79 70 69 73 6F 6D', //mp4

            '0 0 0 18 66 74 79 70 6D 70 34 32', //m4v
            '0 0 0 0 66 74 79 70 6D 70 34 32', //m4v

            '0 0 0 14 66 74 79 70 71 74 20 20', //mov
            '0 0 0 0 66 74 79 70 71 74 20 20', //mov
            '0 0 0 0 6D 6F 6F 76', //mov

            '4F 67 67 53 0 02', //ogg
            '1A 45 DF A3', //ogg
        ];
        var typeName = [
            'jpg',
            'png',
            'mp4',
            'mp4',
            'mp4',
            'mp4',
            'mp4',
            'm4v',
            'm4v',
            'mov',
            'mov',
            'mov',
            'ogg',
            'ogg',
        ];
        var sliceSize = /png|jpg|jpeg/.test(type) ? 3 : 12;
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.addEventListener("load", function(e) {
            // 读取二进制，截取前几个字节             
            var slice = e.target.result.slice(0, sliceSize);
            // 释放内存
            reader = null;
            if (slice && slice.byteLength == sliceSize) {
                // 将二进制转成十进制array
                var view = new Uint8Array(slice);
                var arr = [];
                view.forEach(function(v) {
                    // 将十进制转成16进制
                    arr.push(v.toString(16));
                });
                // 释放内存
                view = null;
                var idx = arr.join(' ').indexOf(imgType);
                if (idx > -1) {
                    back(typeName[idx]);
                } else {
                    back(false);
                }
            } else {
                back(false);
            }

        });
    } else {
        back(file.type.match(/\/(\w+)/)[1]);
    }
}
