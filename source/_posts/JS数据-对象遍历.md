---
title: JS数据&对象遍历
date: 2022-08-18 14:24:29
tags: [js]
---

### JS数组遍历

JS的数组的遍历方式有很多，每个的功能又不尽相同，因此想好好地整理一下它们之间的区别。这里只列举数组自带的API，主要有forEach、filter、map、reduce、some、every.


#### 1.循环遍历
```js
let arr = [1,9,4,2];
for(let i = 0; i < arr.length; i++) {
  onsole.log(arr[i]);
}

```

#### 2.for of 方法
```js
for(var item of arr) {
  item 遍历的数组的元素
}

```

#### 3.forEach
```js
let arr = [1,9,4,2];
arr.forEach(function(item,index,self){
  console.log(element);
  item 遍历出的每一个元素
  index 元素对应的下标
  self 数组本身
  无返回值
})

```
forEach几乎是最常用的遍历数组的方法了，forEach()被调用时不会直接改变原数组，没有返回值，也无法终止或者跳出。

#### 4.map
```js
let arr = [1,9,4,2]
let arrMap = arr.map((element, index, array) => {
    console.log(element)
    return element * 2
})
console.log(arr);
console.log(arrMap);
```
map和forEach类似，被调用时不修改数组本身，但是会返回一个新数组。
#### 5.filter
```js
let arr = [1,9,4,2]
let arrFilter = arr.filter((element, index, array) => {
    return element > 3;
})
console.log(arrFilter);
```
filter顾名思义就是过滤，因此数组的filter用来筛选符合条件的值。filter 不会直接改变原数组，它返回过滤后的新数组。


#### 6.reduce
```js
let arr = [1,9,4,2]
let arrReduce = arr.reduce((accumulator, currentValue, currentIndex, array)=>{
    console.log("accumulator:"+accumulator);
    console.log("currentValue:"+currentValue);
    console.log("currentIndex:"+currentIndex);
    console.log("array:");
    console.dir(array);
    return accumulator + currentValue;
})
console.log("arrReduce:"+arrReduce);
```
reduce和前面的3个循环不同，它的参数里有一个累加器的概念，并且有没有initialValue执行的次数也会有差别。为此整理了一个reduce的执行记录。
首先是没有initialValue的情况：
![](/images/page/2022/0819/1.png)

如果有initialValue，那如上的函数这样改写：

```js
let arr = [1,9,4,2]
let arrReduce = arr.reduce((accumulator, currentValue, currentIndex, array)=>{
    console.log("accumulator:"+accumulator);
    console.log("currentValue:"+currentValue);
    console.log("currentIndex:"+currentIndex);
    console.log("array:");
    console.dir(array);
    return accumulator + currentValue;
},5)
console.log("arrReduce:"+arrReduce);
```
![](/images/page/2022/0819/2.png)

理解了reduce的执行过程就知道reduce的具体功用是什么了，MDN官方给出了如下几个场景:求和、计算单元素次数、按顺序执行promise、功能性管道等。

#### 7.some
```js
let arr = [1,9,4,2]
let arrSome = arr.some((element,index,array) => {
   return element>4
})
console.log(arr)
console.log(arrSome);
```
some遍历数组找寻符合条件的，找到了返回true，遍历完毕没有找到返回false。

#### 8.every
```js
let arr = [1,9,4,2]
let arrEvery = arr.every((element,index,array) => {
   return element<10
})
console.log(arr)
console.log(arrEvery);
```
every遍历数组检查符合条件的，有不符合立即返回false，遍历完毕全符合才返回true。

以上所列举的方法都不会改变原数组，遍历范围在第一次执行之后就已经确定，在callback中如果改变了数组，也不会生效。每一个API背后的运用场景MDN上都有详细的举例，如果想要有更高阶的运用就需要工作积累了。
