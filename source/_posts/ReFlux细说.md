---
title: ReFlux详解
date: 2017-03-22 15:53:49
tags: [react, reflux]
---

> ps内容较多，请细心看完

Flux作为一种应用架构（application architecture）或是设计模式（pattern），阐述的是单向数据流（a unidirectional data flow）的思想，并不是一个框架（framework）或者库（library）。

<!--more-->

### 前言
在细说Flux之前，还是得提一下React ，毕竟Flux这个名字，是因为它才逐渐进入到大众视野。
React是facebook提出来的一个库，用来构建用户界面（User Interface），它的三大特点（来自官方）：
- JUST THE UI： 仅仅是一个View（components），可以认为是MVC中V，用来构建UI界面。
- VIRTUAL DOM ： 虚拟dom，为的是：高性能dom渲染（利用diff算法）、组件化（向web components看齐）、多端同构（node，react native）。
- DATA FLOW： 单向数据流（one-way data flow），指的是：一种自上而下的渲染方式（top-down rendering）。

总而言之，对于一个react web应用，它的UI将会由无数个组件（react component）嵌套组合而成，它们之间存在着层级（hierarchy）关系（通过JSX的语法糖可以轻易看出），也就因此有了父组件，子组件和顶层组件的概念。

然而就像上述第一点所说，React仅仅是一个View，对于一个web应用，没有数据就显得毫无意义。

现在，假使我们通过一个WebAPI模块取得了数据，那么如何传递给React 组件（components），从而实现UI渲染呢？结合组件的层级关系，想到上述所说的第三点：自上而下的渲染，我们将数据传递给顶层组件(controller-view)，同样作为父组件的它，便可以通过组件的属性（properties）将一些有用数据传递给它的各个子组件（各取所需数据），就这样一级一级自上而下地传递下去（直到每一个叶子组件），最终，每一个组件都将得到自己渲染所需要的数据，从而完成UI的渲染。

那么，倘若此时数据变化了（比如：对于一个列表而言，用户点击删除按钮，删除了一条数据），我们又该如何通知各个组件进行UI更新呢？

有这样一种清晰的思路：
首先，我们应该需要一个数据存储（Store），存储着react web应用当前的状态（State），就像MVC中的Model一样。
然后，当用户点击删除按钮时，将会触发一个消息（Action），告诉Store数据变化了，以及哪里变化了（payload）。
最后，Store修改了数据之后，再将新的数据传递给最顶层组件，重新完成一次自上而下的渲染（re-render），从而更新了UI（不要过分担心性能问题，VIRTUAL DOM就是用来解决这个的）。

显然上述的几步，React作为一个View是不可能做到的，也正因为这样，**Flux作为一种架构方案才被提出来**，它的思想大体就是上述这几步，通过一个**单向数据的流动**，完成了UI的更新，用一张图可以表示，如下（以Facebook Flux为例）：
![](/images/page/reflux/1.png)

当然，作为应用数据处理的模式，除了Flux，还有很多（如：传统的MVC，MVVM），只是Flux凭借其单向数据流特点，使得数据流变得简单，易于调试和追踪问题，所以更适合与React进行组合使用。
前面，我们就一直在说，**Flux是一种架构，一种模式，并不是一个框架，也不是一个库**，就像我们说MVC（VM）的概念一样，所以，遵循着Flux模式所阐述的思想自然就会出现一些库，如：Facebook Flux、Reflux、Fluxxor、Redux等等。
本文主要讲解的Reflux，不过在这之前还是需要先提一下Facebook Flux，从而为后面一些对比做一些铺垫。

### Facebook Flux
[Facebook Flux](https://github.com/facebook/flux)，是Facebook在提出Flux架构后，给出的一个对Flux的简单实现，可以认为是Flux库的第一个范例，所以，也有人称之为Original Flux。
Facebook Flux中引入了四个概念： Dispatcher、 Actions、Stores、Views（Controller-Views），而它们之间的关系就如同上面的那张图所描述的一样，构成了一个单向数据流的闭环，简化版如下：
![](/images/page/reflux/2.png)
接下来，将以官方的TodoMVC Demo为例，来说明它们各自的作用，以及它们之间是如何配合工作的？（PS：建议读者将源代码clone下来，边看边调试）
![](/images/page/reflux/3.png)
#### Views and Controller-Views
Facebook Flux中所指的Views，其实就是React Components，用作UI渲染，而相对特别的，Controller-Views指的则是顶层React Component，除了UI渲染外，它还负责接收来自Store变化的数据，并传递给它的Child Component（即Controller-View -> Child Views），用于子View的渲染。
在这个例子中，TodoApp就是一个Controller-View，它监听到TodoStore的数据变化后，便会重新从TodoStore中获取数据，然后通过调用组件setState()方法，触发render()方法的执行，从而得到UI的更新（自上而下的渲染）。
```
// 从TodoStore中获取数据
function getTodoState() {
  return {
    allTodos: TodoStore.getAll(),
    areAllComplete: TodoStore.areAllComplete()
  };
}

var TodoApp = React.createClass({

  componentDidMount: function() {
	// TodoApp监听TodoStore的数据变化
    TodoStore.addChangeListener(this._onChange);
  },

  render: function() {
	return (
		<div>{/* 此处代码省去 */}</div>
	);
  },

  _onChange: function() {
	// 重新获取TodoStore的数据，并通过调用setState，触发re-render
    this.setState(getTodoState());
  }

});
```

### Stores
Facebook Flux中的Stores，作为数据存储的模块，类似于MVC中的Model，它负责接收Dispatcher分发过来的actions，针对不同的actionType，对数据就进行不同的操作（如：增删改查），最后再通知View，数据变化了，需要进行UI更新。

在这个例子中，TodoStore通过变量_todos变量存储着整个应用的数据（一个列表），并通过AppDispatcher（Dispatcher实例）注册回调，来接收不同类型的Action指令，进而执行不同的数据操作（mutate data），最后通知TodoApp View数据改变，需要更新UI（re-render）。
```
// 数据存储（一个列表）
var _todos = {};

// 操作数据的函数
function create(text) {/*此处代码省去*/}
function update(id, updates) {/*此处代码省去*/}
function destroy(id) {
  delete _todos[id];
}

// 接收分发过来的Action
AppDispatcher.register(function(action) {
  var text;
  
  // 判断Action类型，采取不同的数据操作
  switch(action.actionType) {
  
	// 新增
    case TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        create(text);  // 创建数据，并存储
        TodoStore.emitChange(); // 通知TodoApp数据变化，需要更新UI
      }
      break;
      
	// 更新
    case TodoConstants.TODO_UPDATE_TEXT:/*此处代码省去*/
	  break;
	  
	// 删除
    case TodoConstants.TODO_DESTROY:/*此处代码省去*/
	  break;
	  
   /*此处省去部分代码*/
  }
});
```
### Dispatcher
Facebook Flux中，Dispatcher起到了一个中央枢纽（Central Hub）的角色，它存储着一张Stores列表清单，并且负责Actions的分发工作，即Action的一旦触发，Dispatcher将会通知列表清单上的**所有的Stores**，每一个Store则选择性地针对该Action进行特定处理（或者不处理）。
在一个应用中，Dispatcher实例只允许有一个（Single），也就是说它将作为一个单例而存在。
在这个例子中，AppDispatcher就是这样一个单例，我们在TodoStores通过AppDispatcher.register()注册回调（见上段代码），来接收不同类型的Actions（消息订阅），在TodoActions里通过AppDispatcher.dispatch()执行不同Actions的分发（消息发布），如下：
```
var TodoActions = {
  // 新增Action
  create: function(text) {
    AppDispatcher.dispatch({  // 通知TodoStore对数据进行修改（带有Action类型和关联数据）
      actionType: TodoConstants.TODO_CREATE, // Action类型：create
      text: text  // 传递给TodoStore的数据
    });
  },
  // 更新Action
  updateText: function(id, text) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_UPDATE_TEXT, // Action类型：update
      id: id,
      text: text
    });
  },
  // 删除Action
  destroy: function(id) {
    AppDispatcher.dispatch({
      actionType: TodoConstants.TODO_DESTROY, // Action类型：destroy
      id: id
    });
  }
  
  /*此处省去部分代码*/
};
```

### Actions
Facebook Flux中的有一个概念叫做Action Creator，可以将它理解为一个方法（即helper method），专门用来创建某种类型的Action。
上一段代码中，TodoActions模块就提供了这些helper methods（或者叫做Action Creators），如：
TodoActions.create(text)
TodoActions.updateText(id, text)
TodoActions.destroy(id)
...
上述每一个方法在内部，都定义了自己的常量类型（actionType），并且将接收的参数作为数据（payload），从而封装成一个完整的Action（即actionType + payload = Action）。
最后，再统一通过调用Dispatcher.dispatch()将特定的Action以消息的形式分发出去（即传递给Stores），Stores在得到Action后，便可以通过Action.actionType来判定采取某种操作（或者忽略这个Action），而执行操作时需要用到的数据则来自Action.payload。

### 思考
Facebook Flux中提出的这四个概念，承担着各自角色，通过互相协作，形成了一个单向数据流的闭环。
------【推荐大家看下这篇文章[《A cartoon guide to Flux》](https://code-cartoons.com/a-cartoon-guide-to-flux-6157355ab207)，生动形象地描述了这几个角色。】
说完了Facebook Flux，让我们静静思考一下，存在的不足：
倘若，有一个单页面应用，程序中就可能存在N个store，每个store都会监听1~N个action，代码就会像这样：
```
// storeA.js
Dispatcher.register(function (action) {
	switch(action.actionType) {
		case 'actionA': break;
		case 'actionB': break;

		/* ... 1~N个action */
		
		case 'actionN': break;
	}
});

// storeB.js
Dispatcher.register(function () {
	// 同上
});

/* ... */
/* ... 1~N个store */
/* ... */

// storeN.js
Dispatcher.register(function () {
	// 同上
});
```
假使此时，触发了一个actionX，那么storeA~storeB的通过Dispatcher.register()注册的回调函数会按注册顺序依次被触发(无一例外)，也就是说每个store都会得到actionX通知，唯一不同的可能就是：每个store模块，会通过各自的switch语句进行判断，有的对actionX做处理，有的则不处理（忽略），那么问题来了：

『既然有些store对actionX不需要处理，那么它们注册的回调执行是否有必要？毕竟是函数执行是有开销的，如果有1000个store对actionX不"感冒"的的话，会不会很浪费资源？』
分析下这个问题：Facebook Flux是以Dispatcher（发布者）作为消息中枢，所有的Action消息都会统一从这里分发出去，广播给所有的Store（订阅者），也就是说：发布者（Dispatcher）和订阅者（Stores）之间存在着一对多的关系，而事实上Actions（消息）和Stores（订阅者）之间却存在着一个多对多的关系，如下图：
![](/images/page/reflux/4.png)

这样的矛盾，就使得，每一个Store不得不在自己的回调函数里通过Switch语句，来判断当前Action的类型，来决定要不要进行处理，那么暂且抛开性能不说，显然，这样写法，却显得繁重且不够优雅。
于是，接下来，看看Reflux在Facebook Flux的基础之上，做了那些优化？

## Reflux
[Reflux](https://github.com/reflux/refluxjs)，是另一个实现Flux模式的库，旨在使整个应用架构变得更加简单。
准确地说，Reflux是由Facebook Flux演变而来（inspired by Facebook Flux），可以说是它的一个进化版本，自然而言就会拿两者进行比较：[详见这里](https://github.com/reflux/refluxjs#comparing-refluxjs-with-facebook-flux)。
简要概括一下重点，就是：

1.Reflux保留了Facebook Flux中原有的三个概念：Actions、Stores、Views（Controller-Views），去除了Dispatcher，如果要用一张图表示的话，就是这样：
![](/images/page/reflux/5.png)

此时会有人问：没有了消息中枢（Dispatcher），消息Actions如何发布出去，并传递到Stores呢？
答：在Reflux中，每一个Action本身就是一个Publisher（消息发布者），即自带了消息发布功能；而每一个Store除了作为数据存储之外，它还是一个Subscriber，或者叫做Listener（消息订阅者），自然就可以通过监听Action，来获取到变化的数据。

2.Store之间可以互相监听
这样的场景还是有的，比如：在单页面应用中，如果不同Page拥有不同的Store，那么就可能会出现：**子页面Store数据变化后，需要通知到父页面Store进行相应修改**的情况。
---
回顾上一节中，对于Facebook Flux的思考，所遗留的问题点，在Reflux中是否解决了呢？
答案是：肯定的。
这里先简单说明下：
前面讲到Actions和Stores（消息订阅者）间本身就存在着多对多的关系，而作为Publisher（消息发布者），
在Facebook Flux中只有一个，即Dispatcher，所以，不得不在消息发布时，通过在payload中添加actionType字段来区分消息类型，且Store也因此不得不在回调函数中用Switch语句进行判断actionType处理。
而在Reflux中，由于每一个Action都是一个Publisher，且具有特定的含义（actionType），即多个Publisher对应于多个Subscriber（或叫做Listener），Store便可以有目的性地选择订阅想监听的Action，而不是监听所有的Action，再通过Switch语句进行筛选；另外，Action（消息）的发布，也只会通知给之前有订阅过的Store，而不是所有Store，所以并不会造成任何资源浪费。
归结一点，就是Reflux将Dispatcher的功能合并到Action中去，使得每一个Action都具有了消息发布的功能，可以直接被Store所监听（即listenable）。

### 本质
无论是从具体的用法，还是从源码的架构来看，**Reflux本质上可以理解为一个PubSub库**。
可以用一张具体的图来表现这一说法，如下：
![](/images/page/reflux/6.png)

从图中可以看出，Actions、Stores和Views在Reflux中分别承担着消息发布订阅模式中的一个或多个角色，即：发布者（Publisher）或者 订阅者（Subscriber/Listener），也正是基于这样的角色扮演，才使得它能够实现作为Flux所应该具有的单向数据流特性（图中红线部分）。
总结一下：

#### Reflux单向数据流的实现，是完全基于PubSub设计模式的。
Action，Store和View三者的角色分配以及分工合作，如下：
- Action 是一个Publisher，负责消息的分发，一般是由用户行为（User Interaction），或是Web API触发。
- Store 不仅是一个Publisher，还是一个Subscriber（或者叫做Listener），作为Subscriber，负责监听Action的触发；作为Publisher，则负责通知View更新UI。
- View 是一个Subscriber，负责监听Store的数据变化，做到及时更新UI。

既然Reflux中的对象不是Publisher就是Subscriber/Listener，那么代码是如何组织的呢？
答：Reflux抽取出两个模块：PublisherMethods 和 ListenerMethods，顾名思义，这两个集合分别存储着一个对象作为Publisher和Listener所应该具有的方法。

比如：
PublisherMethods中包括：trigger、triggerAsync等消息发布方法。
ListenerMethods中就包括listenTo、listenToMany等消息订阅方法。
具体的细节，感兴趣的同学可以看一下源码，以及这篇文章《[The Reflux data flow model](http://blog.krawaller.se/posts/the-reflux-data-flow-model/)》详细介绍了Reflux与PubSub的关系。

## 详解
这一节的主要目的是：通过代码示例和应用场景，尽可能地讲解Reflux每个API的全貌，以及将代码如何写得更简洁优雅？

### Action
在Reflux中，因为没有了Action Creator的概念，所以，Action的创建都是通过统一的API：Reflux.createAction()或者Reflux.createActions()来实现。

1.通过Reflux.createAction()创建单个Action，代码如下：
```
// 拥有配置
var action = Reflux.createAction({
    actionName: 'addItem',  // 其实这个actionName并没有什么用，可不传
    asyncResult: true,
    sync: false,
    children: ['success']
});

// 简化
var action = Reflux.createAction('addItem')

// 或者匿名
var addItemAction = Reflux.createAction();
```
注意：Reflux.createAction()的返回值是一个特殊的对象 --- 函数（functor），这样的设计其实是为了方便Action的触发，显得更加函数化编程(FRP) ，就像下面这样使用：
```
addItemAction({a: 1});
action('hello world', 'Lovesueee');
```
action创建的时候，可以进行参数的配置，具体的参数意义如下：
sync： 设置为true，指定action的默认触发方式为同步
children： 用于创建子Action（主要是用在异步操作的时候，后面会讲到）
asyncResult：设置为true时，自动创建两个名为'completed'和'failed'的子Action（可以认为是设置子Action的一个快捷方式）
---
2.通过Reflux.createActions()创建多个Action，即Actions集合，代码如下：
```
var actions = Reflux.createActions(['addItem', 'deleteItem']);

// 个别action配置
var actions = Reflux.createActions(['addItem', {
	deleteItem: {
		asyncResult: true,
		children: ['success'],
	},
	updateItem: {...}
}]);

// 也可以这样
var actions = Reflux.createActions({
	addItem: {},
	deleteItem: {
		asyncResult: true,
		children: ['success']
	},
	updateItem: {...}
});
```
注意：Reflux.createActions()返回的是一个普通的对象，即Actions集合，所以Action触发时，需要指定actionName，就像这样：
```
actions.addItem({...});
actions.deleteItem();
```
一般说来，在实际项目代码中，由于涉及到的Action较多，所以一般都是调用Reflux.createActions()一次性创建Actions集合，比较方便。另外，之后Store通过listenables字段与Action进行关联时，需要的也是一个Actions集合。
---
之前就提到，Action作为一个Publisher，会拥有PublisherMethods集合里提供的一系列方法，这里统一举例说明：
listen：Action消息订阅
```
var addAction = Reflux.createAction();

addAction.listen(function (url) {
	// 默认上下文this是addAction
	$.ajax(url).done(function () {
		// todo: save to store
	});
});

addAction('/xxx/add');
```
---
trigger 同步触发Action消息，在触发具体的消息之前，首先会先执行preEmit和shouldEmit回调。
preEmit返回值(非undefined)将作为shouldEmit函数的入参，用于修改payload
shouldEmit的返回值(true or false)，将作为是否真正触发消息的标志
举几个例子说明下，preEmit和shouldEmit的使用，如下：
preEmit用于异步请求，下面两种方法是等价的：
```
var actions = Reflux.createActions({
	add: {
		asyncResult: true,
		preEmit: function (url) {
			$.ajax(url)
				.done(this.completed)
				.fail(this.failed);
		}
	}
});
// 等价于
var actions = Reflux.createActions({
	add: {
		asyncResult: true
	}
});

actions.add.listen(function(url) {
	$.ajax(url)
		.done(this.completed)
		.fail(this.failed)
});
```
preEmit用于修改payload
```
var actions = Reflux.createActions(['takePhoto']);

// 映射
var maps = {
	'photo': {
		maxSize: 1000     // 从相册获取
	},
	'camera': {           // 拍照
		maxSize: 2000,
		maxSelect: 10
	}
};

actions.takePhoto.preEmit = function (type) {
	return maps[type] || maps['photo'];
};

actions.takePhoto.listen(function (options) {
	// do ajax
	console.log(options);
});

actions.takePhoto('photo');
// 或者
// actions.takePhoto('camera');
```
shouldEmit的使用（防止action的频繁触发）
```
var requesting = false;
var actions = Reflux.createActions(['submit']);

actions.submit.shouldEmit = function () {
	return !requesting;
}

actions.submit.listen(function (url) {

	requesting = true;
	
	$.ajax(url).done(function () {
		// success
	}).fail(function () {
		// error
	}).always(function () {
		requesting = false;
	});
});

// 点击按钮
$('#btn').click(function () {
	actions.submit('url/submit');
});
```
---
promise: 语法糖，用于简写异步Action，下面两种方法是等价的：
```
var addAction = Reflux.createAction({
	children: ['completed', 'failed'] // 等价于 asyncResult: true
});

addAction.listen(function (url) {
	var me = this;
	$.ajax(url).done(function (data) {
		me.completed(data);
	}).fail(function () {
		me.failed();
	});
});

// 等价于
addAction.listen(function (url) {
	this.promise($.ajax(url));
});

addAction('/url/add');
```
listenAndPromise: 是上述两个方法listen和promise方法的结合，做了两件事情：消息订阅和异步回调。
比如上面的例子，就可以这样简写：
```
addAction.listenAndPromise(function(url) {
    return $.ajax(url);    // 注意：返回promise对象
});
```
---
triggerAsync: 异步触发Action消息（而trigger同步触发消息），类似于setTimeout(function () {action();}, 0)。
---
triggerPromise 触发Action消息，可以通过返回的promise将异步请求的数据直接带回，而不需要经过Store。
改写上面的例子，如下：
```
var addAction = Reflux.createAction({
	asyncResult: true
});

addAction.listenAndPromise(function(url) {
    return $.ajax(url);    // 注意：返回promise对象
});

// 触发消息，监听异步子action的成功与失败
// action这里可以获取到数据，
addAction.triggerPromise('/url/add').then(function (data) {
	console.log(data);
}, function () {
	console.log('failed');
});
```
---
最后再说说，子Action的概念，其实之前都用到了，主要是用于异步请求，成功和失败回调的执行，这里简单说明一下：
在利用Reflux.createAction创建Action之初，可以通过下面的两种方式创建子Action:
```
var addAction = Reflux.createAction({
	asyncResult: true
});

// 等价于

var addAction = Reflux.createAction({
	children: ['completed', 'failed']
});
```
在创建之后这两个子Action在数据存储结构中，便可以直接通过addAction.completed和addAction.failed访问。
---
### Store
Store作为数据存储中心，且因为介于Actions和Views之间，所以同时承担着Publisher（消息发布者）和Subscriber（消息订阅者）两种角色。
Reflux中，Store的创建同样是通过提供的API：Reflux.createStore()，就像下面这样：
```
var action = Reflux.createAction();

var store = Reflux.createStore({
	init: function () {
		// 存储数据
		this.data = {};
			
		// Action监听
		this.listenTo(action, this._onAction);
		// 或者
		// this.listenTo(action, '_onAction');
		// 或者
		// action.listen(this._onAction);
	},
	
	_onAction: function (msg) {
		console.log(msg);
	}
});

action('hello world');	// 触发动作
```
不同于Action，Store返回的是一个普通的对象，通常我们会在init方法中进行数据的存储 和Action的监听。
---
在创建Store时，我们可以通过传递一个特殊的字段mixins，它的功能就有点类似于React Component中的mixins。
在mixin中，对于几个特殊方法：init, preEmit, shouldEmit会进行特殊处理（组合），保证mixins里面的方法都会被执行而，对于其他自定义方法，有一定的覆盖规则，比如，下面的例子中myMethod方法的覆盖优先级就是：store > mixin3 > mixin2 > mixin。
```
var mixin = {
	init: function () {
		console.log('mixin:init')
	},
	myMethod: function () {
		console.log('mixin.myMethod');
	}
};

var mixin2 = {
	init: function () {
		console.log('mixin2:init')
	},
	myMethod: function () {
		console.log('mixin2.myMethod');
	}
};

var mixin3 = {
	mixins: [mixin2],
	init: function () {
		console.log('mixin3:init')
	},
	myMethod: function () {
		console.log('mixin3.myMethod');
	},
	otherMethod: function () {
		console.log('mixin3.otherMethod');
	}
};

var store = Reflux.createStore({
	mixins: [mixin, mixin3],
	init: function () {
		console.log('store:init');
	},
	myMethod: function () {
		console.log('store:myMethod');
	}
});

store.myMethod();

// mixin:init
// mixin2:init
// mixin3:init
// store:init
// store:myMethod
```
---
再从PubSub的角度说说Store：
作为消息的发布者，拥有着和Action一样的能力，即拥有PublisherMethods集合的所有方法；同时作为消息的订阅者，用来监听Action的触发（或其他Store的改变），从而改变自身数据，Store还拥有ListenerMehthods集合提供的方法。
这里重点说一下，Store作为消息订阅者这个角色，拥有的几个比较重要的方法：

listenTo: 监听指定的listenable的变化，从而执行回调（这里的listenable可以是Action，也可以是Store）
(注意：reflux中，Store之间是可以监听的，但是不可以互相监听哦，避免死循环（circular loop）)
举例几个例子，说明：
Store监听Action
```
var addAction = Reflux.createAction('add');

var store = Reflux.createStore({
	init: function () {
		this.data = {
			flag: false
		};
	},
	getInitialState: function () {
		return this.data;
	}
});

store.listenTo(addAction, function (flag) {
	this.data.flag = flag;
});

addAction(true);
```
Store监听其他Store（设置listenTo第三个回调，通过调用被监听Store的getInitialState方法获取其初始值）
```
var storeA = Reflux.createStore({
	init: function () {
		this.data = {
			a: 1
		};
	},
	getInitialState: function () {
		return this.data;
	}
});

var storeB = Reflux.createStore({
	init: function () {
		this.data = {
			b: 2
		};
	}
});

storeB.listenTo(storeA, function (a) {
	this.data.a = a;
}, function (data) {
	// storeB获取storeA的初始值
	this.data.a = data.a;
});

console.log(storeB); // storeB.data => {a: 1, b: 2}

storeA.trigger(3);

console.log(storeB); // storeB.data => {a: 3, b: 2}
```
---
listenToMany: 监听指定的listenables（对象集合）变化，从而执行对应的回调（这里的listenables是一个对象，它的每一个值可以是action，也可以是store）
通常会这样使用：
```
var actions = Reflux.createActions(['addItem', 'deleteItem']);

var store = Reflux.createStore({
	init: function () {
		this.items = [];
		this.listenToMany(actions);
	},
	onAddItem: function (item) {
		this.items.push(item);
	},
	onDeleteItem: function (item) {
		var items = this.items;
		
		items.forEach(function (val, index) {
			if (val === item) {
				items.splice(index, 1);
				// todo: break
			}
		});
	}
});

actions.addItem(1);
actions.addItem(2);

console.log(store); // store.items => [1, 2]

actions.deleteItem(1);

console.log(store); // store.items => [2]
```
当一个store监听listenables对象集合（即多个监听对象，比如：多个action）时，实际上做的事情也还是单个消息订阅store.listenTo(actionName, onActionName)，但是这里有一个约定（或者叫做映射关系），以上面的两个action为例:

**actionName	onActionName**
addItem	    onAddItem
deleteItem	onDeleteItem

actionName 对应的回调就是 on + actionName(驼峰写法)
然后Reflux还做了一些容错处理，如果你不按照这个约定（即命名不规范）的话，它会这样获取需要注册的回调：
以名为addItemaction为例，它的callback依次会取：
this.onAddItem -> this.addItem -> undefined（不注册回调）
自然而然，涉及到listenTo方法就会想起上面说的它的第三个参数defaultCallback用来初始化，那么在listenToMany方法对此就有这样的约定（或者叫做映射关系）：
以名为addItemaction为例（一般是store之间才会使用，且很少使用），它的defaultCallback依次会取：
this.onAddItemDefault -> this.addItemDefault -> undefined（没有初始化回调）
---
这里还需要再提起一次，子Action的概念，对于下面这段代码：
之前会这样做：
```
var addAction = Reflux.createAction({
	asyncResult: true
});

var store = Reflux.createStore({
	init: function () {
		this.listenTo(addAction.completed, 'onAddCompleted');
		this.listenTo(addAction.failed, 'onAddFailed');
	},

	onAddCompleted: function (data) {
		console.log('completed: ', data);
	},
	
	onAddFailed: function () {
		console.log('failed')
	}
});
```
如果用listenToMany方法来做的话，就可以这样简化：
```
var addAction = Reflux.createAction({
	asyncResult: true
});

var store = Reflux.createStore({
	init: function () {
		this.listenToMany({add: addAction}); // 注意：参数是一个对象
	},

	onAddCompleted: function (data) {
		console.log('completed: ', data);
	},
	
	onAddFailed: function () {
		console.log('failed')
	}
});
```
也就是说，listenToMany方法，不但关联了action，还会关联它的子action，即addAction.completed和addAction.failed，这里就又有一个约定（或者叫做映射关系）：

**actionName	onActionName	childActionName	onChildActionName**
add	onAdd	addCompleted / addFailed	onAddCompleted / onAddFailed

即：on + 主action名 + 子action名（驼峰）
---
然而，在利用Reflux.createStore()创建之初，我们可以利用更简洁的一种方式，对Store和Actions进行关联。
之前是这样：
```
var actions = Reflux.createActions(['addItem', 'deleteItem']);

var store = Reflux.createStore({
	init: function () {
		this.listenToMany(actions); // 关联actions
	},
	onAddItem: function () {
		// todo: add
	},
	onDeleteItem: function () {
		// todo: delete
	}
});
```
现在可以通过listenables字段来关联：
```
var actions = Reflux.createActions(['addItem', 'deleteItem']);

var store = Reflux.createStore({
	listenables: actions  // 关联actions
	init: function () {
		// init
	},
	onAddItem: function () {
		// todo: add
	},
	onDeleteItem: function () {
		// todo: delete
	}
});
```
这是一种快捷方式，其实内部原理就是store在创建的时候，调用了listenToMany方法。
注意：listenables这里可以是actions组成的数组，如：[actions1, actions2]，就相当于多调用几次listenToMany方法，如：
```
this.listenToMany(actions1); 
this.listenToMany(actions2); 
```

### View
对于View，只需在React Component里的生命周期函数里，负责监听Store的变化，并及时通过调用setState（）方法更新UI即可，就像下面这样：
```
var myStore = Reflux.createStore({
	init: function () {
		// init
	}
});

class MyComponent extends React.Component {
	
	componentDidMount() {
		this.unsubscribe = myStore.listen(this.onChange);
	}
    componentWillUnmount: function() {
        this.unsubscribe(); // 注意：在组件销毁时，一定要解除监听
    }
	onChange(data) {
		this.setState(data); // re-render
	}
}
```
上述方式，是通过myStore.listen()来进行消息订阅的，而实际上，View本身并没有消息订阅的能力，所以Reflux提供了一个mixin，叫做Reflux.ListenerMixin。
它的实现是这样的：
```
module.exports = _.extend({
    componentWillUnmount: ListenerMethods.stopListeningToAll
}, ListenerMethods);
```
作为React Component的一个mixin，它其实做了两件事情：
给View添加ListenerMethods集合里的方法，使View具备了消息订阅的能力。
在组件销毁componentWillUnmount生命周期方法里，对之前监听的Action自动解绑。
所以，上述代码可以简化为：
```
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';

class MyComponent extends React.Component {
	
	componentDidMount() {
		this.listenTo(myStore, this.onChange); // View本身具备了订阅的能力
	}
    componentWillUnmount: function() {
       // nothing 无需手动解除监听
    }
	onChange(data) {
		this.setState(data); // re-render
	}
}

// ES6 mixin写法
ReactMixin.onClass(MyComponent, Reflux.ListenerMixin);
```
然而还有更简单的写法，就是通过Reflux.connect()来写，如下：
```
import Reflux from 'reflux';
import ReactMixin from 'react-mixin';

class MyComponent extends React.Component {
	
	componentDidMount() {
		// nothing 无需手动监听
	}
    componentWillUnmount: function() {
       // nothing 无需手动解除监听
    }
	onChange(data) {
	   // noting 无需手动setState
	}
}

// ES6 mixin写法
ReactMixin.onClass(MyComponent, Reflux.connect(myStore));
```
原理是这样的，React.connect(myStore)返回的一个mixin，这个mixin内部在做了类似下面的事情：
```
this.listenTo(myStore, (data) => {
	this.setState(data);
});
```
所以，这才帮我们省去了手动监听，手动删除监听，还有手动触发UI更新这三步。