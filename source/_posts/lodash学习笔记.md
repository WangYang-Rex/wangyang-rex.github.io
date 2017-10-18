---
title: lodash学习笔记
date: 2017-10-11 23:10:16
tags: [javascript, lodash]
---
Lodash 是这样的一套工具库，它内部封装了诸多对字符串、数组、对象等常见数据类型的处理函数，其中部分是目前 ECMAScript 尚未制定的规范，但同时被业界所认可的辅助函数。目前每天使用 npm 安装 Lodash 的数量在百万级以上，这在一定程度上证明了其代码的健壮性，值得我们在项目中一试。

## 模块组成
Lodash提供的辅助函数主要分为以下几类:

- `Array`，适用于数组类型，比如填充数据，部分适用于字符串，比如分组、查找、过滤等操作。
- `Collection`，适用于数组和对象类型，部分适用于字符串，比如分组、查找、过滤等操作。
- `Function`，适用于函数类型，比如节流、延迟、缓存、设置钩子等操作。
- `Lang`，普遍适用于各种类型，常用于执行类型判断和类型转换。
- `Math`，适用于数组类型，常用于执行数学运算。
- `Number`，适用于生成随机数，比较数值与数值区间的关系。
- `Object`，适用于对象类型，常用于对象的创建、扩展、类型转换、检索、集合等操作。
- `Seq`，常用于创建链式调用，提高执行性能（惰性计算）。
- `String`，适用于字符串类型。

<!--more-->

## 若干方法
受益于 Lodash 的普及程度，使用它可以提高多人开发时阅读代码的效率，减少彼此之间的误解。

### N次循环
```js
//1.基础循环
for(var i=0;i<5;i++){
  //...
}
//2.使用Array.apply模拟循环
Array.apply(null, Array(5)).forEach(function(){
  // ... 
})
//3.Lodash
_.times(5,function(){
  //...
})
```
for是循环的首选，但是_.times()的解决方式更加简洁和易于理解。

### 深层查找属性值
```js
//返回pets[0].name
var ownerArr=[{
  "owner":"wl",
  "pets":[{"name":"dog1"},{"name":"dog2"}]
},{
  "owner":"qw",
  "pets":[{"name":"dog3"},{"name":"dog4"}]
}];
//Array的map方法
ownerArr.map(function(owner){
  return owner.pets[0].name
})
//Lodash
_.map(ownerArr,'pets[0].name');
```
_.map方法是对原生map方法的改进，其中使用pets[0].name字符串对嵌套数据取值的方式简化了很多冗余的代码。

### 个性化数组
```js
//Array的map方法
Array.apply(null,Array(6)).map(function(item,index){
  return "ball_"+index;
})
//Lodash
_.times(6,_.uniqueId.bind(null,'ball_'))
//Lodash
_.times(6,_.partial(_.uniqueId,'ball_'))
```
在上面的代码中，我们要创建一个初始值不同，长度为6的数组，其中_.uniqueId方法用于生成独一无二的标识符（递增的数字，在程序运行期间保持独一无二），_partial方法是对bind的封装。

### 深拷贝
```js
var objA={
  "name":"wl"
}
//Lodash
var objB=_.cloneDeep(objA);
console.log(objA===objB)//false

```
JavaScript没有直接提供深拷贝的函数，但我们可以用其他函数来模拟，比如JSON.parse(JSON.stringify(objectToClone)),但这种方法要求对象中的属性值不能是函数。Lodash中的_.cloneDeep函数封装了深拷贝的逻辑，用起来更简洁。

### 随机数
```js
//js方法
function getRandomNumber(min,max){
  return Math.floor(Math.random()*(max-min+1))+min;
}
getRandomNumber(15,20);
//Lodash
_.random(15,20)
```
Lodash的随机数生成函数更贴近实际开发，ECMAScript的随机数生成函数是底层必备的接口，两者都不可或缺。此外，使用_.random(15,20,true)还可以在15到20之间生成随机的浮点数。

### 对象扩展
```js
Object.prototype.extend=function(obj){
  for(var i in obj){
    if(obj.hasOwnProperty(i)){
      this[i]=obj[i];
    }
  }
};
var objA={"name":"wl","car":"benz"};
var objB={"name":"jam","age":17};
objA.extend(objB);
objA;//{"name":"jam","age":17,"car":"benz"};
//Lodash
_.assign(objA,objB)
```
>_.assign分配来源对象的可枚举属性到目标对象上。 来源对象的应用规则是从左到右，随后的下一个对象的属性会覆盖上一个对象的属性。
注意：这方法会改变源对象，参考自Object.assign

```js
function Foo(){
  this.c=3;
}
function Bar(){
  this.e=5;
}
Foo.prototype.d=4;
Bar.prototype.f=6;
_.assign({'a':1},new Foo,new Bar);
//=>{'a':1,'c':3,'e':5}
```

### 筛选属性
```js
Object.prototype.remove=function(arr){
  var that=this;
  arr.forEach(function(key){
    delete(that[key]);
  })
}
var objA={"name":"colin","car":"suzuki","age":17};
objA.remove(['car','age']);
objA;//{"name":"colin"}
//Lodash
objA=_.omit(objA,['car','age']);
//=>{"name":"colin"}
objA=_.omit(objA,'car');
//=>{"name":"colin","age":17};
```
大多数情况下，Lodash所提供的辅助函数都会比原生的函数更贴近开发需求。
```js
Object.prototype.pick=function(arr){
  var that=this;
  var obj={};
  arr.forEach(function(key){
    obj[key]=that[key];
  })
  return obj;
}
var objA={"name": "colin", "car": "suzuki", "age": 17};
var objB=objA.pick(['car','age']);
//{"car":"suzuki","age":17}
//Lodash
var objB=_.pick(objA,['car','age']);
//{"car":"suzuki","age":17}
```
_.pick是_.omit的相反操作，用于从其他对象中挑选属性生成新的对象。

### 随机元素
```js
var luckyDraw=["Colin","John","James","Lily","Mary"];
function pickRandomPerson(luckyDraw){
  var index=Math.floor(Math.random()*(luckyDraw.length-1));
  return luckyDraw[index];
}
pickRandomPerson(luckyDraw);//John
//Lodash
_.sample(luckyDraw);//Colin
//Lodash-Getting 2 random item
_.sample(luckyDraw,2);//['Jhon','Lily']
```
_.sample支持随机挑选多个元素并返回新的数组。

### 针对JSON.parse的错误处理
```js
function parse(str){
  try{
    return JSON.parse(str);
  }catch(e){
    return false;
  }
}
//With Lodash
function parseLodash(str){
  return _.attempt(JSON.parse.bind(null,str));
}
parse('a');
//=>false
parseLodash('a');
//=>return an error object
parse('{"name":"colin"}');
//=>return {"name":"colin"}
parseLodash('{"name":"colin"}');
//=>return {"name":"colin"}
```
如果你在使用JSON.parse时没有预置错误处理，那么它很有可能会成为一个定时炸弹，我们不应该默认接受的JSON对象都是有效的。try-catch是最常见的错误处理方式，如果项目中Loadsh，那么可以使用_.attmpt替代try-catch的方式，当解析JSON出错时，该方法会返回一个Error对象。

>随着 ES6 的普及，Lodash 的功能或多或少会被原生功能所替代，所以使用时还需要进一步甄别，建议优先使用原生函数。