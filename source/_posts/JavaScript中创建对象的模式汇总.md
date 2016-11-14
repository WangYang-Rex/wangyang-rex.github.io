---
title: JavaScript中创建对象的模式汇总
date: 2016-07-05 14:19:25
tags: [javascript,对象]
---


### 前言
因为超级营销无线装修用到了很多创建对象的方法，而不同的方法对于对象的设计，功能的实现会有很大的不同，所以最近在看代码的时候特意查了下<b>创建对象</b>的各种方法，在这里记录一下

> 1.对象字面量
> 2.工厂模式
> 3.构造函数模式
> 4.原型模式
> 5.结合构造函数和原型模式
> 6.原型动态模式

<!--more-->

### 1、对象字面量
```
var person = {
    name : 'Nicholas';
    age : '22';
    job :"software Engineer"
    sayName: function() {
      alter(this.name);
  }
}
```
例子中创建一个名为person的对象，并为它添加了三个属性（name,age,job）和一个方法（sayName()），其中，sayName()方法用于显示this.name(被解析为person.name)的值。

<b>对象字面量可以用来创建单个对象，但这个方法有个明显的缺点：使用同一个接口创建很多对象，会产生大量重复的代码。</b>


### 2、工厂模式

工厂模式是软件工程领域中一种广为人知的设计模式，工厂模式抽象了创建具体对象的过程，用函数来封装以特定的接口创建对象的细节。

```
function createPerson(name,age,job){
  var o = new object{};
  o.name=name;
  o.age=age;
  o.job=job;
  o.sayName=function(){
    alert(this.name);
  };
  return o;
}
var person1=creatPerson("Nicholas",22,"software Engineer");
var person2=creatPerson("Greg",24,"student");
```
函数creatPerson{}能够根据接受的参数构建一个包含所有必要信息的Person对象。可以无数次的调用这个函数，每次都会返回一个包含三个属性一个方法的对象。

<b>工厂模型虽然解决了创建多个相似对象的问题，却没有解决对象识别的问题（即怎么知道一个对象的类型）。 </b>

### 3、构造函数模式

```
function Person(name,age,job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    alert(this.name);
  }
}
//通过new操作符创建Person的实例
var person1 = new Person("Nicholas",22,"software Engineer");
var person2 = new Person("Greg",24,"student");
person1.sayName(); //Nicholas
person2.sayName(); //Greg
```

<b>与工厂模式不同的是</b>
没有显示的创建对象

直接将属性和方法赋给了this对象

没有return语句

创建Person的新实例，必须使用new操作符。调用构造函数的4个步骤：

创建一个新对象

将构造函数的作用域赋给新对象（this指向了这个新对象）

执行构造函数中的代码

返回新对象

这个例子中创建的所有对象既是Object的实例，也是Person实例。可以通过instanceof操作符验证。

```
alert(person1 instanceof Object);//true
```
构造函数模式也有自己的问题，实际上，sayName方法在每个实例上都会被重新创建一次，需要注意的是，通过实例化创建的方法并不相等，以下代码可以证明
```
alert(person1.sayName == person2.sayName);//false
```
可以将方法移到构造器的外部作为全局函数来解决这个问题。
```
function Person(name,age,job) {
  this.name = name;
  this.age = age;
  this.job = job;
}
function sayName() {
  alert(this.name);
}
```
在全局下创建的全局函数实际上只能被经由Person创建的实例调用，这就有点名不副实了；如果对象需要定义很对方法，那么就要定义很多个全局函数，缺少封装性。

### 4、原型模式

JavaScript中创建的每个函数都有一个prototype（原型）属性，它是一个指针，指向一个对象，包含了可以由特定类型的所有实例共享的属性和方法（让所有的对象实例共享它的属性和方法）
```
function Person() {}
  Person.prototype.name ="Nicholas";
  Person.prototype.age = 22;
  Person.prototype.job = "software Engineer";
  Person.prototype.sayName(){
    alert(this.name);
  };
 var person1 = new Person();
 person1.sayName(); //Nicholas
alert(person1.sayName == person2.sayName);//true
```
以上代码做了这几件事情：

定义了一个构造函数Person，Person函数自动获得一个prototype属性，该属性默认只包含一个指向Person的constructor属性

通过Person.prototype添加三个属性，和一个方法

创建一个Person的实例，随后在实例上调用了sayName()方法

使用Person构造函数和Person.prototype创建实例的代码为例，展示个对象之间的关系

<img src="/images/page/createObject/1.png">

图中展示了Person构造函数、Person的原型属性以及Person的两个实例，之间的关系。Person.prototype指向了原型对象，Person.prototype.constructor有指回了Person。原型对象中除了包含constructor属性，还包含后来添加的其他属性和方法，Person的两个实例person1和person2都包含一个内部属性，该属性仅指向Person.prototype。

<b>sayName()方法的调用过程：</b>

在person1实例上查找sayame()方法，发现没有这个方法，于是追溯到person1的原型

在person1的原型上查找sayame()方法，有这个方法，于是调用该方法

基于这样一个查找过程，我们可以通过在实例上定义原型中的同名属性，来阻止该实例访问原型上的同名属性，需要注意的是，这样做并不会删除原型上的同名属性，仅仅是阻止实例访问。

```
function Person() {}
  Person.prototype.name ="Nicholas";
  Person.prototype.age = 22;
  Person.prototype.job = "software Engineer";
  Person.prototype.sayName(){
    alert(this.name);
  };
 var person1 = new Person();
 var person2 = new Person();
 person1.name="Greg"
alert(person1.name) //Greg 来自实例
alert(person2.name) //Nicholas 来自原型
```
使用delete操作符可以完全删除实例属性
```
delete person1.name;
alert(person1.name) //Nicholas 来自原型
```
使用hasOwnProperty()方法可以检测一个属性是存在于实例还是原型中
```
function Person() {}
  Person.prototype.name ="Nicholas";
  Person.prototype.age = 22;
  Person.prototype.job = "software Engineer";
  Person.prototype.sayName(){
    alert(this.name);
  };
 var person1 = new Person();
 var person2 = new Person();
 alert(person1,hasOwnProperty("name"));//false
 person1.name="Greg"
alert(person1.name) //Greg 来自实例
 alert(person1,hasOwnProperty("name"));//true
alert(person2.name) //Nicholas 来自原型
 alert(person2,hasOwnProperty("name"));//false
 delete person1.name;
alert(person1.name) //Nicholas 来自原型
 alert(person1,hasOwnProperty("name"));//false
```
下图展示了在不同情况下实例与原型之间的关系
<img src="/images/page/createObject/2.png">

### 5、简单的原型语法
```
function Person() {}
 Person.prototype={
 name ："Nicholas",
 age ： 22,
 job ： "software Engineer",
 sayName：function(){
    alert(this.name);
    }
  };
```
在上面的代码中constructor属性不再指向Person了，通过constructor无法确定对象的类型了。可以像下面这样特意将他设置回适当的值
```
function Person() {}
 Person.prototype={
 constructor:Person,
 name ："Nicholas",
 age ： 22,
 job ： "software Engineer",
 sayName：function(){
    alert(this.name);
    }
  };
```
重设constructor属性会导致它的[[Enumerable]]特性被设置为true，默认情况，原生的constructor属性是不可枚举的，可以使用Object.defineProperty()方法来改变
```
Object.defineProperty(Person.prototype,"constructor",{
  enumerable:false,
  value:Person
});
```
原型中查找值的过程是一次搜索，原型对象所做的任何修改都能从实例上立即反应出来
```
var friend=new Person();
Person.prototype.sayHi=function(){
  alert("hi);
}
friend,sayHi();//"hi"(没有问题)
```
person实例是在添加新方法之前创建的，但仍可以访问新添加的方法，原因是实例与原型之间的松散连接关系

重写原型对象后的情况
```
function Person() {}
var friend=new Person();
 Person.prototype={
 name ："Nicholas",
 age ： 22,
 job ： "software Engineer",
 sayName：function(){
    alert(this.name);
    }
  };
  friend.sayName();//error
```
调用friend.sayName()时发生错误的原因是，friend指向的原型中不包含以该字段命名的属性，如下图。
<img src="/images/page/createObject/3.png">

<b>原型对象的问题</b>
原型对象省略了为构造函数传递初始化参数这一环节，所有势力在默认情况下都取得相同的属性值。原型模型最大的问题是有其共享本性所导致的。当原型模型包含引用类型的属性来说，问题就比较严重了。来看下面的例子。
```
function Person() {}
 Person.prototype={
 constructor:Person,
 name ："Nicholas",
 age ： 22,
 job ： "software Engineer",
 friends:["Shelby","Court"],
 sayName：function(){
    alert(this.name);
    }
  };
  var person1=new Person();
  var person2=new Person();
  person1.friend.push("Van");
  alert(person1.friends);//"Shelby,Court,Van"
  alert(person2.friends);//"Shelby,Court,Van"
 alert(person1.friends==person2.friends);//true
```
### 5、组合使用构造函数模式和原型模式
组合使用构造函数模式和原型模式中，构造函数用于定义实例属性，原型模型用于定义方法和共享的属性。这样每个实例都会有自己的一份实例属性的副本，同时也可以共享对方法的引用，最大限度的节省了内存。

```
function Person(name,age,job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.friends=["Shelby","Court"];
}
Person.prototype={
 constructor：Person，
 sayName：function(){
    alert(this.name);
    }
  }
var person1=new Person("Nicholas",22,"software Engineer");
var person2 = new Person("Greg",24,"student");
person1.friend.push("Van");
  alert(person1.friends);//"Shelby,Court,Van"
  alert(person2.friends);//"Shelby,Court"
 alert(person1.friends==person2.friends);//false
 alert(person1.sayName==person2.sayName);//true
```

### 6、动态原型模式
原型动态模式将需要的所有信息都封装到构造函数中，通过if语句判断原型中的某个属性是否存在，若不存在（在第一次调用这个构造函数的时候），执行if语句内部的原型初始化代码。

```
function Person(name,age) {
  this.name = name;
  this.age = age;
  this.job =job;
//方法
  if(typeof this.sayName != 'function') {
  Person.prototype.sayName = function() {
      alert(this.name);
    };
  }
}
var friend = new Person('Nicholas','22','Software Engineer');//初次调用构造函数，此时修改了原型
var person2 = new Person('amy','21');//此时sayName()方法已经存在，不会再修改原型

```