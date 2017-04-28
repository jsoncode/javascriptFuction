# javascriptFuction

#### 获取一个最近的祖先元素 closet
```
document.querySelector('li').closet('ul');
```

#### 合并两个一级深度的json对象，不支持二级深度合并
```

Object.assign({},{a:1},{b:2});  // {a:1,b:2}

Object.assign({},{a:1,b:{a:1}},{b:{c:2}});  // {a:1,b:{c:2}}
```

#### 日期格式化
```
new Date().format();  //default yyyy/MM/dd HH:mm:ss
new Date().format('yyyy.MM.dd HHmmss');
('2017/03/07 12:12:12').dateFormat('yyyy-MM-dd'); //2017-03-07
'20170307121212'.dateFormat();// NaN
```

#### 解析url
```
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
```
#### json转链接需要的字符串格式
```
bj2Url({a:1,b:2,c:[1,2]});// 'a=1&b=2&c=1&c=2'
```

##### 获取带有双字节字符的字符串长度
```
'汉字'.dbLength(); //4
'汉字abc'.dbLength(); //7
```

#### 过滤中国手机号，自定义过滤符号
```
'13800138000'.phoneFilter(); // 138****8000
'+8613800138000'.phoneFilter();// +86138****8000
'13800138000'.phoneFilter('-'); // 138----8000
```

#### 判断中国手机号格式
```
'13800138000'.isPhone(); //true
'+8613800138000'.isPhone(); //true
'+8613800138000'.isPhone(true); //{is:true,type:'中国移动'}
```
#### 获取一个随机字符串，作为临时id
```
randomString(); // str14888747383099563
```

#### 生成一个类似的uuid字符串，随机，无规律，无解密方法
```
uuid();//yB6540790v3610B2718hcWRpUdTYxab7
uuid(10);//TGf9F9jNp1
uuid(66);//YoG0565y4163dtBl9JnS6530g5Nf12SPu94847h5L85355eP76471Z198H29085KHh
```

#### 一维二维数组去重（二位需要传入基准键值）
```
[1,2,3,1].unique();//[1, 2, 3]
[{a:1},{a:2},{a:3},{a:1},{a:3}].unique('a');//[{a:1},{a:2},{a:3}]
[{a:1},{a:2,b:1},{a:2},{b:1}].unique('a');//[{"a":1},{"a":2,"b":1},{"b":1}]
[{a:1},{a:2,b:1},{a:2},{b:1}].unique('b');//[{"a":1},{"a":2,"b":1}] this is a bug
```

#### ajax 用法同jq
```
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

```
#### 常用的自定义两个全局变量
```
request // globle var
browser // globle var
/*{
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
```

#### 加载一个文件
```
loadFile('css/demo.css');
loadFile('css/demo.css',function(){
    console.log('loaded');
});
loadFile(['css/demo.css','js/demo.js'],function(){
    console.log('loaded');
});

loadFile('template/test.vue',function(html){
    console.log(html);
});
//带有返回值的的html不能和css，js混合使用
```

#### 字符串转码解码
```
location.href.decode();
location.href.encode();
'http://a.io/index.html?a=1#b'.encode();//"http%3A%2F%2Fa.io%2Findex.html%3Fa%3D1%23b"
```

#### 新增链接参数合并方法
```
'http://a.com?a=1'.mergeParams({b:2,c:[1,2]}); // http://a.com?a=1&b=2&c=1&c=2
```

#### 新增html拼接方法：
```
'http://a.com?a=${a}&b=${b}'.renderHTML({a:1,b:2}); // http://a.com?a=1&b=2 ,解决复杂字符串拼接繁琐易出错的问题
```

#### 添加校验港澳台身份证，大陆护照，身份证格式，格式正确，返回true,否则false
```
checkIdCard.zh('大陆身份证');
checkIdCard.passport('大陆身护照');//其他护照未知
checkIdCard.officers('军官证');
checkIdCard.hk('香港身份证');
checkIdCard.mac('澳门身份证');
checkIdCard.tw('台湾身份证');
```

#### 新增H5上传文件方法uploadFile(file,name,back)

```
input.addEventListener('change',function () {
    uploadFile(this.files[0],'testFile',function (data) {
        console.log(data);
    });
})
```


#### 部分安卓机在上传文件时，无法获取文件类型的问题

```
input.addEventListener(function(){
    var file = this.files[0];
    if(file.type==''){
        // 第一个参数支持单类型，或多类型，多类型时用竖线分隔，用于生成正则式
        checkFileType('(png|jpg|jpeg|mp4|mov|m4v|ogg)',file,function(fileType){
            console.log(fileType);
            //'png'
        });
        checkFileType('jpg',file,function(fileType){
            console.log(fileType);
            //false
        });
    }
});
```


