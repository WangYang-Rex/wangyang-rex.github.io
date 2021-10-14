---
title: 浅谈前端AST的概念与实际应用
date: 2021-10-14 15:32:20
tags: [javascript]
---

回想日常开发中使用的框架，脚手架，打包工具，再到编辑器的代码补全，代码格式化等功能，用一句话概括他们做的事那就是**批量修改源代码**，再精确一点即代码转换。既然要转换，那么首先第一步一定是理解源程序。如何能阅读和理解源程序？这就要引出一个关键概念-AST，本文将依次介绍AST的概念，生成过程，基本结构，节点类型，如何操作AST等，最后通过一个AST的实际应用来进行总结。

### AST的概念

抽象语法树（Abstract Syntax Tree）简称AST，顾名思义，它是一棵树，用分支和节点的组合来描述代码结构。他可以让计算机理解我们写的代码，我们不妨先试着按自己的理解来想象一下这棵树的构造。例如下面这段代码

```js
function foo(a) {
  const b = a + 1;
  return b;
}
```

分析，首先这是一个函数，有名字(foo)，参数(a)，函数体(body)三个基本属性。再来看body，他有两条语句，分别是声明语句和return语句。先看声明语句，他由变量b和一条表达式语句组成，表达式语句由三个元素：a,+,1组成。而return语句则由元素b组成。我们可以依照上述并按照节点与分支的组合描绘出这段代码的AST的大致结构如下。

![](/images/page/20211014/1.webp)

<!--more-->

在真正的AST中，每个节点都有自己的type以及一系列相关属性来描述它，那么真正的AST长什么样子？我们可以借助一个工具[astexplorer](https://astexplorer.net/)，上述代码的AST结构如下。

![](/images/page/20211014/2.webp)

可以看到其基本结构与我们自己描述的结构图是类似的，只是其节点的描述属性会更加丰富。关于AST的详细结构与节点类型在下文会继续讨论，这里先不做展开。
现在我们知道，有了AST，计算机才能理解我们写的代码，那么我们不禁要问：AST到底是如何生成的？

### 生成过程

AST的生成是个复杂度极高过程，今天我们只关心一个关键概念——**编译**，以及两个关键步骤——**词法分析，语法分析**，下面对其做简单介绍。

- 什么是编译：编译，就是把一门编程语言转成另一门编程语言的过程，一般是指高级语言到低级语言。

我们平时开发使用的开发语言写出的代码计算机无法直接识别，计算机能直接识别的程序语言或指令代码是机器语言。而将高级语言转化为机器语言的过程就是编译的过程，与将英语翻译成汉语是一个道理。那什么是低级语言，什么又是高级语言？

低级语言：描述指令具体在机器上的执行过程，与硬件和执行细节有关，会操作寄存器、内存，需要开发者理解熟悉计算机的工作原理，熟悉具体的执行细节，无需经过翻译，每一操作码在计算机内部都有相应的电路来完成它。

高级语言：高级语言有很多用于描述逻辑的语言特性，如分支、循环、函数、面向对象等，接近人的思维，可以让开发者快速的通过它来表达各种逻辑。比如 c++、javascript。计算机无法直接识别高级语言，它需要被编译成低级语言的指令才能被执行，这个过程就是编译。

- 编译的过程

编译的本质就是转换，而转换的前提则是要理解被转换的东西，前面提到编译器通过AST理解高级语言代码，因此编译的第一步就是解析源代码，得到AST。具体来讲这个解析的过程分为如下几步：

#### 词法分析

何为词法？词法组成语言的单词， 是语言中最小单元。我们写的高级语言代码 ，本质上就是一段文本，只不过是按照一定的格式组织的描述逻辑的文本。 因此词法可以理解成我们代码中一系列独立的单词，var，for ，if，while等。词法分析的过程就是读取代码，识别每一个单词及其种类，将它们按照预定的规则合并成一个个的标识，也叫 token，同时，它会移除空白符，注释，等，最终产出一个token数组。即词法分析阶段把会字符串形式的代码转换为 **令牌**（tokens） 流，用一段伪代码举例：

```js
const a = 10;
[
{ type: "KEYWORD_CONST", value: "const" }, { type: "VARIABLE", value: "a" },
{ type: "OPERATOR_EQUAL", value: "=" }, { type: "INTEGER", value: "10" }
...
]
```

#### 语法分析

语法，是词法之间的组合方式。前面说到，我们写的源程序是按照一定的格式组织的描述逻辑的文本，而所谓描述逻辑的格式就是指语法。语法分析的任务就是用由词法分析得到的令牌流，在上下文无关文法（一般指某种程序设计语言上的语法）的约束下，生成树形的中间表示（便于描述逻辑结构），该中间表示给出了令牌流的结构表示，同时验证语法，语法如果有错的话，抛出语法错误。

经过词法、语法分析之后就产生了AST，用一棵树形的数据结构来描述源代码，从这里开始就是计算机可以理解的了。有了AST，就可以根据不用需求进行不同操作，如编译器会将AST转换成线性中间代码，生成汇编代码，最后生成机器码。解释器会将AST解释执行或转成线性的中间代码再解释执行。转译器则会将AST转换为另一个AST，再生成目标代码，例如Babel就是一个典型的Javascript转译器，其主要能力是将ES6+代码转换成兼容旧的浏览器或环境的js代码，我们今天也会利用Babel的能力进行AST操作，关于编译的后续步骤如语义分析，代码优化，代码生成等这里就不再过多讨论，接下来具体了解AST。

### 如何处理AST

知己知彼，百战不殆。要对AST做处理，我们要清楚他的基本结构，节点类型，这将是我们基于AST进行实际应用的基础。
首先我们回顾前文的AST结构。我们会注意到，AST 的每一层都拥有近乎相同的结构，都有一个type属性以及一系列描述属性，type属性用来表示节点的类型（`CallExpression`,`Identifier`,`MemberExpression`等等）。这样的每一层结构称为一个 **节点（Node）**。 一个 AST 可以由单一的节点或是成百上千个节点构成。 抽象语法树有一套约定的规范：[GitHub - estree/estree: The ESTree Spec](https://github.com/estree/estree)，社区称为 estree。借助这个约定的 AST 规范，整个前端社区，生产类工具统一产出该格式的数据结构而无需关心下游，消费类工具统一使用该格式进行处理而无需关心上游。
AST的所有节点类型可分为以下几个大类：字面量、标识符、表达式、语句、模块语法，每个大类下又分类多个子类，下面介绍一些基本且开发常用的节点类型 ，更全面的信息可以查文档或者在ASTExplorer中具体查看。

### Literal 字面量

- StringLiteral 字符串字面量（"foo"）
- NumericLiteral 数值字面量（123）
- BooleanLiteral 布尔字面量 （true）
- TemplateLiteral 模板字面量 （${obj}）
  ...

#### dentifier 标识符

标识符即各种声明与引用的名字，js中的变量名，函数名，属性名等都是标识符。如下面代码中的bar,foo,num都是标识符。

```js
const bar = foo(num)
```

#### Statement 语句

这个比较好理解，它就是一段可以**独立执行**的代码。下面代码的每一行都是一条语句。

```js
const a = 1;
console.log(a);
export default a;
```

Statement 分为众多子类型，下面举几个例子。

```js
return a; // ReturnStatement
try {
  // TryStatement
} catch (error) {}
for (let index = 0; index < array.length; index++) {
  // ForStatement
  const element = array[index];
}
while (condition) {} // WhileStatement
```

#### Declaration 声明语句

他是一种特殊的语句，用于在作用域内声明变量、函数、class、import、export 等，同样有众多子类型。

```js
const a = 1; // VariableDeclaration
function b(){} // FunctionDeclaration
class C {} // ClassDeclaration
```

#### Expression 表达式

表达式与语句的区别是表达式执行后会有返回结果，举例：

```js
a = 1; // AssignmentExpression
a+b; // BinaryExpression
this；// ThisExpression
```

#### Modules ES module模块语法

```js
import name from 'name'; // ImportDeclaration
export const newName = 'newName'; // ExportNamedDeclaration
export default name; // ExportDefaultDeclaration
export * from 'name'; // ExportAllDeclaration
```

#### Program & Directive

program 是代表整个程序的节点，它包裹了所有具体执行语句的节点，而Directive则是代码中的指令部分。

![](/images/page/20211014/3.webp)

了解了AST的构造与节点类型，接下来就可以基于AST做些事情。工欲善其事，必先利其器，要处理AST，我们需要一个能遍历，访问，处理AST节点的工具，而Babel就是其中之一。

### Babel基础

Babel 是一个 JavaScript 的转译器，其执行过程就是一个编译转换的过程。作为一个js转译器，babel暴露了很多 api，利用这些 api 可以完成源代码到 AST 的 parse，AST 的遍历与处理以及目标代码的生成。babel将这些功能的实现放到了不同的包里面，下面逐一介绍。
@babel/parser 解析源码得到AST。
@babel/traverse 遍历 AST。
@babel/types 用于构建AST节点和校验AST节点类型；
@babel/generate 打印 AST，生成目标代码和 sorucemap。

#### babel的处理步骤

主要有三个阶段：解析（parse）， 转换 （transform），生成（generate）

- parse：将源码转成 AST，用到@babel/parser模块。
- transform：对AST 进行遍历，在此过程中对节点进行添加、更新及移除等操作。因此这是bebel处理代码的核心步骤，是我们的讨论重点，主要使用@babel/traverse和@babel/types模块。
- generate：打印 AST 成目标代码并生成 sourcemap，用到@babel/generate模块。

接下来我们来重点了解转换这一步，上面我们提到，转换的第一步是遍历AST。说到这里就不得不提到一个设计模式——**访问者模式**。

#### 访问者模式

在访问者模式（Visitor Pattern）中，我们使用了一个访问者类，它改变了目标元素的执行算法。通过这种方式，元素的执行算法可以随着访问者改变而改变。而在这里，访问者即是一个用于 AST 遍历的模式， 简单的说它就是一个对象，定义了用于在一个树状结构中获取具体节点的方法。当访问者把它用于遍历中时，每当在树中遇见一个对应类型时，都会调用该类型对应的方法。

因此我们只需根据需求，**针对我们需要修改的节点类型去定义相应的遍历方法并指定相应的回调函数即可**。举个例子，若我们想将所有var替换为let，则只需遍历所有的VariableDeclaration类型的节点，找到名为var的节点，将其替换为let即可。

先通过一段简单的代码结合astexplorer看一下变量声明语句的结构。

```js
var a = 2
let b = 3
```

![](/images/page/20211014/4.webp)

我们发现变量声明语句节点的kind属性就是其名字，因此问题迎刃而解。

```js
const generator = require('@babel/generator');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
const transToLet = code => {
  const ast = parser.parse(code);
  // 访问者对象
  const visitor = {
    // 遍历声明表达式
    VariableDeclaration(path) {
      if (path.node.type === 'VariableDeclaration') {
        // 替换
        if (path.node.kind === 'var') {
          path.node.kind = 'let';
        }
      }
    },
  };
  traverse.default(ast, visitor);
  // 生成代码
  const newCode = generator.default(ast, {}, code).code;
  return newCode;
};
const code = `const a = 1
var b = 2
let c = 3`;
```

![](/images/page/20211014/5.webp)

可以发现var节点变成了let节点，接下来来实现一个稍微复杂一些的应用。
