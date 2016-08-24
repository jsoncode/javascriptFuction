# javascriptFuction api
> javascript functions

----
##String
#### String.parseURL
```
location.href.parseURL()
```

#### String.dbLength 
```
'中国한の'.dbLength();
//8
```

#### String.phoneNumFilter  
```
'balabala13838003800balabala13838003800'.phoneNumFilter();
//balabala138****3800balabala138****3800
```

#### String.dateFormat  
```
'2016-09-01'.dateFormat('MM/dd/yyyy');
// 09/01/2016
```


----
## Date
#### Date.format

```
new Date('2016-09-01').format('MM/dd/yyyy');
// 09/01/2016
```

----
##  window
#### window.getRequest
```
// Id=1&User=2
getRequest('toLowerCase');
// {id:1,user:2}
```
----
##  canvas
#### canvas.getContext("2d").sector
```
var bgcanvas = document.querySelector("#bgcanvas");
var ctx = bgcanvas.getContext("2d");
ctx.sector(250,250,200,0,2*Math.PI,"#fff");
```

