##javascriptFuction

```
document.querySelector('li').closet('ul');
Object.assign({},{a:1},{b:2});  // {a:1,b:2}
Object.assign({},{a:1,b:{a:1}},{b:{c:2}});  // {a:1,b:{c:2}}
new Date().format();  //default yyyy/MM/dd HH:mm:ss
new Date().format('yyyy.MM.dd HHmmss');
location.href.parseURL(); // like location
'http://a.io?a=1#b'.parseURL();
/**
{
    "source": "http://a.io/js/index.js?a=1#b",
    "protocol": "http",
    "host": "a.io",
    "port": "",
    "query": "?a=1",
    "file": "index.js",
    "hash": "b",
    "pathname": "/js/index.js",
    "relative": "/js/index.js?a=1#b",
    "segments": [
        "js",
        "index.js"
    ],
    "params": {
        "a": "1"
    }
}
*/

'汉字'.dbLength(); //4
'汉字abc'.dbLength(); //7

'13800138000'.phoneFilter(); // 138****8000
'+8613800138000'.phoneFilter();// +86138****8000
'13800138000'.phoneFilter('-'); // 138----8000

'13800138000'.isPhone(); //true
'+8613800138000'.isPhone(); //true
'+8613800138000'.isPhone(true); //{is:true,type:'中国移动'}

('2017/03/07 12:12:12').dateFormat('yyyy-MM-dd'); //2017-03-07
'20170307121212'.dateFormat();// NaN

bj2Url({a:1,b:2});// 'a=1&b=2'

randomString(); // str14888747383099563

uuid();//yB6540790v3610B2718hcWRpUdTYxab7
uuid(10);//TGf9F9jNp1
uuid(66);//YoG0565y4163dtBl9JnS6530g5Nf12SPu94847h5L85355eP76471Z198H29085KHh

[1,2,3,1].unique();//[1, 2, 3]
[{a:1},{a:2},{a:3},{a:1},{a:3}].unique('a');//[{a:1},{a:2},{a:3}]
[{a:1},{a:2,b:1},{a:2},{b:1}].unique('a');//[{"a":1},{"a":2,"b":1},{"b":1}]
[{a:1},{a:2,b:1},{a:2},{b:1}].unique('b');//[{"a":1},{"a":2,"b":1}] this is a bug

ajax({
    url: '',
    sync: true,
    method: 'GET',
    data: null,//{}
    username: null,
    password: null,
    dataType: null,
    success: function () {},
    error: function () {},
    timeout: 0,
});

request // globle var
browser // globle var
/**
{
    "android": null,
    "ios": true,
    "mac": null,
    "windows": null,
    "ie": null,
    "weixin": null,
    "weixinJSBridge": false,
    "mqqbrowser": null,
    "weibo": true,
    "qq": null,
    "chrome": null,
    "iosV": "9.3.4",
    "weiboV": "5.3.0",
    "mobile": true,
    "nettype": null,
    "tbs": null
}
*/

loadFile('css/demo.css');
loadFile('css/demo.css',function(){
    console.log('loaded');
});
loadFile(['css/demo.css','js/demo.js'],function(){
    console.log('loaded');
});

location.href.decode();
location.href.encode();
'http://a.io/index.html?a=1#b'.encode();//"http%3A%2F%2Fa.io%2Findex.html%3Fa%3D1%23b"



```

