
if (typeof String.prototype.parseURL != 'function') {
    String.prototype.parseURL = function() {
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
String.prototype.dateFormat = function(format) {
      var s = this.toString();
      var d = Date.parse(s);
      if (isNaN(d)) {
          return 'NaN';
      } else {
          //extend Date.format
          return new Date(s).format(format)
      }
  }
if (typeof Date.prototype.format != 'function') {
    Date.prototype.format = function(formatString) {
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

/**************************** window *****************************/

window.getRequest = function(toCase) {
    /**
     * get url request params
     * default
     * toLowerCase
     * toUpperCase
     */
    var params = location.href.parseURL().params;
    var arg = toCase && (toCase == 'toLowerCase' || toCase == 'toUpperCase');
    if (arg) {
        var newParams = {};
        for (var i in params) {
            if (params.hasOwnProperty(i)) {
                newParams[i[toCase]()] = params[i];
            }
        }
        return newParams;
    } else {
        return params;
    }
}

/**************************** canvas *****************************/
CanvasRenderingContext2D.prototype.sector=function(xAxis,yAxis,radius,startAngle,endAngle,bgColor){
	this.moveTo(xAxis,yAxis);
	this.arc(xAxis,yAxis,radius,startAngle,endAngle);
	this.lineTo(xAxis,yAxis);
	this.fillStyle=bgColor;
	this.fill();
	this.save();
}
/**************************** array *****************************/
if (typeof Array.prototype.unique != 'function') {
    // 一维数组去重
    Array.prototype.unique = function(key) {
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
