---
title: Ts高手篇：22个示例深入讲解Ts最晦涩难懂的高级类型工具
date: 2022-02-25 12:32:06
tags: [ts, typescript]
---

## 本文基本分为三部分：

第一部分讲解一些基本的关键词的特性（比如索引查询、索引访问、映射、extends等），但是该部分更多的讲解小伙伴们不清晰的一些特性，而基本功能则不再赘述。更多的关键词及技巧将包含在后续的例子演示中再具体讲述；

第二部分讲解Ts内置的类型工具以及实现原理，比如Pick、Omit等；

第三部分讲解自定义的工具类型，该部分也是最难的部分，将通过一些复杂的类型工具示例进行逐步剖析，对于其中的晦涩的地方以及涉及的知识点逐步讲解。此部分也会包含大量Ts类型工具的编程技巧，也希望通过此部分的讲解，小伙伴的Ts功底可以进一步提升！

## 第一部分 前置内容

- `keyof` 索引查询

对应任何类型`T`,`keyof T`的结果为该类型上所有共有属性key的联合：

```ts
interface Eg1 {
  name: string,
  readonly age: number,
}
// T1的类型实则是name | age
type T1 = keyof Eg1

class Eg2 {
  private name: string;
  public readonly age: number;
  protected home: string;
}
// T2实则被约束为 age
// 而name和home不是公有属性，所以不能被keyof获取到
type T2 = keyof Eg2
```

- `T[K]` 索引访问

```ts
interface Eg1 {
  name: string,
  readonly age: number,
}
// string
type V1 = Eg1['name']
// string | number
type V2 = Eg1['name' | 'age']
// any
type V2 = Eg1['name' | 'age2222']
// string | number
type V3 = Eg1[keyof Eg1]
```

`T[keyof T]`的方式，可以获取到T所有key的类型组成的联合类型；
`T[keyof K]`的方式，获取到的是T中的key且同时存在于K时的类型组成的联合类型；
注意：如果[]中的key有不存在T中的，则是any；因为ts也不知道该key最终是什么类型，所以是any；且也会报错；

- `&` 交叉类型注意点
  交叉类型取的多个类型的并集，但是如果相同`key`但是类型不同，则该`key`为`never`。

```ts
interface Eg1 {
  name: string,
  age: number,
}

interface Eg2 {
  color: string,
  age: string,
}

/**
 * T的类型为 {name: string; age: number; age: never}
 * 注意，age因为Eg1和Eg2中的类型不一致，所以交叉后age的类型是never
 */
type T = Eg1 & Eg2
// 可通过如下示例验证
const val: T = {
  name: '',
  color: '',
  age: (function a() {
    throw Error()
  })(),
}
```

### extends关键词特性（重点）

- 用于接口，表示继承

```ts
interface T1 {
  name: string,
}

interface T2 {
  sex: number,
}

/**
 * @example
 * T3 = {name: string, sex: number, age: number}
 */
interface T3 extends T1, T2 {
  age: number,
}
```

注意，接口支持多重继承，语法为逗号隔开。如果是type实现继承，则可以使用交叉类型`type A = B & C & D`。

- 表示条件类型，可用于条件判断
  表示条件判断，如果前面的条件满足，则返回问号后的第一个参数，否则第二个。类似于js的三元运算。

```ts
/**
 * @example
 * type A1 = 1
 */
type A1 = 'x' extends 'x' ? 1 : 2;

/**
 * @example
 * type A2 = 2
 */
type A2 = 'x' | 'y' extends 'x' ? 1 : 2;

/**
 * @example
 * type A3 = 1 | 2
 */
type P<T> = T extends 'x' ? 1 : 2;
type A3 = P<'x' | 'y'>
```
<!--more-->
**提问：为什么A2和A3的值不一样？**

- 如果用于简单的条件判断，则是直接判断前面的类型是否可分配给后面的类型
- 若extends前面的类型是泛型，且泛型传入的是联合类型时，则会依次判断该联合类型的所有子类型是否可分配给extends后面的类型（是一个分发的过程）。

**总结，就是extends前面的参数为联合类型时则会分解（依次遍历所有的子类型进行条件判断）联合类型进行判断。然后将最终的结果组成新的联合类型。**

**阻止extends关键词对于联合类型的分发特性**
如果不想被分解（分发），做法也很简单，可以通过简单的元组类型包裹以下：

```ts
type P<T> = [T] extends ['x'] ? 1 : 2;
/**
 * type A4 = 2;
 */
type A4 = P<'x' | 'y'>
```

[条件类型的分布式特性文档](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)

### 类型兼容性 重要！重要！重要

>集合论中，如果一个集合的所有元素在集合B中都存在，则A是B的子集；
类型系统中，如果一个类型的属性更具体，则该类型是子类型。（因为属性更少则说明该类型约束的更宽泛，是父类型）

**因此，我们可以得出基本的结论：子类型比父类型更加具体,父类型比子类型更宽泛。** 下面我们也将基于类型的可复制性（可分配性）、协变、逆变、双向协变等进行进一步的讲解。

- 可赋值性

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  break(): void;
}

let a: Animal;
let b: Dog;

// 可以赋值，子类型更佳具体，可以赋值给更佳宽泛的父类型
a = b;
// 反过来不行
b = a;
```

- 可赋值性在联合类型中的特性

```ts
type A = 1 | 2 | 3;
type B = 2 | 3;
let a: A;
let b: B;

// 不可赋值
b = a;
// 可以赋值
a = b;
```

是不是A的类型更多，A就是子类型呢？恰恰相反，A此处类型更多但是其表达的类型更宽泛，所以A是父类型，B是子类型。

因此b = a不成立（父类型不能赋值给子类型），而a = b成立（子类型可以赋值给父类型）

- 协变

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  break(): void;
}

let Eg1: Animal;
let Eg2: Dog;
// 兼容，可以赋值
Eg1 = Eg2;

let Eg3: Array<Animal>
let Eg4: Array<Dog>
// 兼容，可以赋值
Eg3 = Eg4
```

通过Eg3和Eg4来看，在Animal和Dog在变成数组后，Array<Dog>依旧可以赋值给Array<Animal>，因此对于type MakeArray = Array<any>来说就是协变的。

最后引用维基百科中的定义：

>协变与逆变(Covariance and contravariance )是在计算机科学中，描述具有父/子型别关系的多个型别通过型别构造器、构造出的多个复杂型别之间是否有父/子型别关系的用语。

简单说就是，具有父子关系的多个类型，在通过某种构造关系构造成的新的类型，如果还具有父子关系则是协变的，而关系逆转了（子变父，父变子）就是逆变的。可能听起来有些抽象，下面我们将用更具体的例子进行演示说明：

- 逆变

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  break(): void;
}

type AnimalFn = (arg: Animal) => void
type DogFn = (arg: Dog) => void

let Eg1: AnimalFn;
let Eg2: DogFn;
// 不再可以赋值了，
// AnimalFn = DogFn不可以赋值了, Animal = Dog是可以的
Eg1 = Eg2;
// 反过来可以
Eg2 = Eg1;
```

理论上，`Animal = Dog`是类型安全的，那么`AnimalFn = DogFn`也应该类型安全才对，为什么Ts认为不安全呢？看下面的例子：

```ts
let animal: AnimalFn = (arg: Animal) => {}
let dog: DogFn = (arg: Dog) => {
  arg.break();
}

// 假设类型安全可以赋值
animal = dog;
// 那么animal在调用时约束的参数，缺少dog所需的参数，此时会导致错误
animal({name: 'cat'});
```

从这个例子看到，如果dog函数赋值给animal函数，那么animal函数在调用时，约束的是参数必须要为Animal类型（而不是Dog），但是animal实际为dog的调用，此时就会出现错误。
因此，`Animal`和`Dog`在进行`type Fn<T> = (arg: T) => void`构造器构造后，父子关系逆转了，此时成为“逆变”。

- 双向协变

Ts在函数参数的比较中实际上默认采取的策略是双向协变：只有当源函数参数能够赋值给目标函数或者反过来时才能赋值成功。

这是不稳定的，因为调用者可能传入了一个具有更精确类型信息的函数，但是调用这个传入的函数的时候却使用了不是那么精确的类型信息（典型的就是上述的逆变）。 但是实际上，这极少会发生错误，并且能够实现很多JavaScript里的常见模式：

```ts
// lib.dom.d.ts中EventListener的接口定义
interface EventListener {
  (evt: Event): void;
}
// 简化后的Event
interface Event {
  readonly target: EventTarget | null;
  preventDefault(): void;
}
// 简化合并后的MouseEvent
interface MouseEvent extends Event {
  readonly x: number;
  readonly y: number;
}

// 简化后的Window接口
interface Window {
  // 简化后的addEventListener
  addEventListener(type: string, listener: EventListener)
}

// 日常使用
window.addEventListener('click', (e: Event) => {});
window.addEventListener('mouseover', (e: MouseEvent) => {});
```

可以看到`Window`的`listener`函数要求参数是`Event`，但是日常使用时更多时候传入的是`Event`子类型。但是这里可以正常使用，正是其默认行为是双向协变的原因。可以通过`tsconfig.js`中修改`strictFunctionType`属性来严格控制协变和逆变。

#### infer 关键词 **敲重点！！！敲重点！！！敲重点！！！**

`infer`关键词的功能暂时先不做太详细的说明了，主要是用于`extends`的条件类型中让Ts自己推导类型，具体的可以查阅官网。但是关于`infer`的一些容易让人忽略但是非常重要的特性，这里必须要提及一下：

- `infer`推导的名称相同并且都处于逆变的位置，则推导的结果将会是交叉类型。

```ts
type Bar<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
} ? U : never;

// type T1 = string
type T1 = Bar<{ a: (x: string) => void; b: (x: string) => void }>;

// type T2 = never
type T2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;
```

- `infer`推导的名称相同并且都处于协变的位置，则推导的结果将会是联合类型。

```ts
type Foo<T> = T extends {
  a: infer U;
  b: infer U;
} ? U : never;

// type T1 = string
type T1 = Foo<{ a: string; b: string }>;

// type T2 = string | number
type T2 = Foo<{ a: string; b: number }>;
```

[inter与协变逆变的参考文档点击这里](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)

## 第二部分 Ts内置类型工具原理解析

### Partial实现原理解析

`Partial<T>`将`T`的所有属性变成可选的。
```ts
/**
 * 核心实现就是通过映射类型遍历T上所有的属性，
 * 然后将每个属性设置为可选属性
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
}
```
- `[P in keyof T]`通过映射类型，遍历T上的所有属性
- `?:`设置为属性为可选的
- `T[P]`设置类型为原来的类型

扩展一下，将制定的key变成可选类型:

```ts
/**
 * 主要通过K extends keyof T约束K必须为keyof T的子类型
 * keyof T得到的是T的所有key组成的联合类型
 */
type PartialOptional<T, K extends keyof T> = {
  [P in K]?: T[P];
}

/**
 * @example
 *     type Eg1 = { key1?: string; key2?: number }
 */
type Eg1 = PartialOptional<{
  key1: string,
  key2: number,
  key3: ''
}, 'key1' | 'key2'>;
```

### Readonly原理解析

```ts
/**
 * 主要实现是通过映射遍历所有key，
 * 然后给每个key增加一个readonly修饰符
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

/**
 * @example
 * type Eg = {
 *   readonly key1: string;
 *   readonly key2: number;
 * }
 */
type Eg = Readonly<{
  key1: string,
  key2: number,
}>
```

### Pick

挑选一组属性并组成一个新的类型。

```ts
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

### Record

构造一个`type`，`key`为联合类型中的每个子类型，类型为`T`。文字不好理解，先看例子：

```ts
/**
 * @example
 * type Eg1 = {
 *   a: { key1: string; };
 *   b: { key1: string; };
 * }
 * @desc 就是遍历第一个参数'a' | 'b'的每个子类型，然后将值设置为第二参数
 */
type Eg1 = Record<'a' | 'b', {key1: string}>
```

Record具体实现：

```ts
/**
 * 核心实现就是遍历K，将值设置为T
 */
type Record<K extends keyof any, T> = {
  [P in K]: T
}

/**
 * @example
 * type Eg2 = {a: B, b: B}
 */
interface A {
  a: string,
  b: number,
}
interface B {
  key1: number,
  key2: string,
}
type Eg2 = Record<keyof A, B>
```

- 值得注意的是`keyof any`得到的是`string | number | symbol`
- 原因在于类型`key`的类型只能为`string | number | symbol`

### 扩展: 同态与非同态。划重点！！！ 划重点！！！ 划重点！！！

- Partial、Readonly和Pick都属于同态的，即其实现需要输入类型T来拷贝属性，因此属性修饰符（例如readonly、?:）都会被拷贝。可从下面例子验证：

```ts
/**
 * @example
 * type Eg = {readonly a?: string}
 */
type Eg = Pick<{readonly a?: string}, 'a'>
```

从Eg的结果可以看到，`Pick`在拷贝属性时，连带拷贝了`readonly`和`?:`的修饰符。

- `Record`是非同态的，不需要拷贝属性，因此不会拷贝属性修饰符

可以看到`Pick`的实现中，注意`P in K`（本质是`P in keyof T`），`T`为输入的类型，而`keyof T`则遍历了输入类型；而`Record`的实现中，并没有遍历所有输入的类型，`K`只是约束为`keyof any`的子类型即可。
最后再类比一下`Pick`、`Partial`、`readonly`这几个类型工具，无一例外，都是使用到了`keyof T`来辅助拷贝传入类型的属性。

### Exclude原理解析

Exclude<T, U>提取存在于T，但不存在于U的类型组成的联合类型。

```ts
/**
 * 遍历T中的所有子类型，如果该子类型约束于U（存在于U、兼容于U），
 * 则返回never类型，否则返回该子类型
 */
type Exclude<T, U> = T extends U ? never : T;

/**
 * @example
 * type Eg = 'key1'
 */
type Eg = Exclude<'key1' | 'key2', 'key2'>
```

#### never敲重点！！！

- never表示一个不存在的类型
- never与其他类型的联合后，是没有never的

```ts
/**
 * @example
 * type Eg2 = string | number
 */
type Eg2 = string | number | never
```
因此上述`Eg`其实就等于`key1 | never`,也就是`type Eg = key1`

### Extract

Extract<T, U>提取联合类型T和联合类型U的所有交集。

```ts
type Extract<T, U> = T extends U ? T : never;

/**
 * @example
 *  type Eg = 'key1'
 */
type Eg = Extract<'key1' | 'key2', 'key1'>
```

### Omit原理解析

`Omit<T, K>`从类型T中剔除K中的所有属性。

```ts
/**
 * 利用Pick实现Omit
 */
type Omit = Pick<T, Exclude<keyof T, K>>;
```

- 换种思路想一下，其实现可以是利用`Pick`提取我们需要的`keys`组成的类型
- 因此也就是 `Omit = Pick<T, 我们需要的属性联合>`
- 而我们需要的属性联合就是，从`T`的属性联合中排出存在于联合类型K中的
- 因此也就是`Exclude<keyof T, K>`;

如果不利用Pick实现呢?

```ts
/**
 * 利用映射类型Omit
 */
type Omit2<T, K extends keyof any> = {
  [P in Exclude<keyof T, K>]: T[P]
}
```

- 其实现类似于`Pick`的原理实现
- 区别在于是遍历的我们需要的属性不一样
- 我们需要的属性和上面的例子一样，就是`Exclude<keyof T, K>`
- 因此，遍历就是`[P in Exclude<keyof T, K>]`

### Parameters 和 ReturnType

Parameters 获取函数的参数类型，将每个参数类型放在一个元组中。

```ts
/**
 * @desc 具体实现
 */
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/**
 * @example
 * type Eg = [arg1: string, arg2: number];
 */
type Eg = Parameters<(arg1: string, arg2: number) => void>;
```

- `Parameters`首先约束参数`T`必须是个函数类型，所以`(...args: any) => any>`替换成`Function`也是可以的
- 具体实现就是，判断`T`是否是函数类型，如果是则使用`inter P让ts`自己推导出函数的参数类型，并将推导的结果存到类型`P`上，否则就返回`never`；

#### 敲重点！！！敲重点！！！敲重点！！！

- `infer`关键词作用是让`Ts`自己推导类型，并将推导结果存储在其参数绑定的类型上。`Eg:infer P` 就是将结果存在类型`P`上，供使用。
- `infer`关键词只能在`extends`条件类型上使用，不能在其他地方使用。

#### 再敲重点！！！再敲重点！！！再敲重点！！！

- `type Eg = [arg1: string, arg2: number]`这是一个元组，但是和我们常见的元组`type tuple = [string, number]`。官网未提到该部分文档说明，其实可以把这个作为类似命名元组，或者具名元组的意思去理解。实质上没有什么特殊的作用，比如无法通过这个具名去取值不行的。但是从语义化的角度，个人觉得多了语义化的表达罢了。

- 定义元祖的可选项，只能是最后的选项
```ts
/**
 * 普通方式
 */
type Tuple1 = [string, number?];
const a: Tuple1 = ['aa', 11];
const a2: Tuple1 = ['aa'];

/**
 * 具名方式
 */
type Tuple2 = [name: string, age?: number];
const b: Tuple2 = ['aa', 11];
const b2: Tuple2 = ['aa'];
```

扩展：`infer`实现一个推导数组所有元素的类型：

```ts
/**
 * 约束参数T为数组类型，
 * 判断T是否为数组，如果是数组类型则推导数组元素的类型
 */
type FalttenArray<T extends Array<any>> = T extends Array<infer P> ? P : never;

/**
 * type Eg1 = number | string;
 */
type Eg1 = FalttenArray<[number, string]>
/**
 * type Eg2 = 1 | 'asd';
 */
type Eg2 = FalttenArray<[1, 'asd']>
```

### ReturnType 获取函数的返回值类型。

```ts
/**
 * @desc ReturnType的实现其实和Parameters的基本一样
 * 无非是使用infer R的位置不一样。
 */
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

### Ts compiler内部实现的类型

#### Uppercase

```ts
/**
 * @desc 构造一个将字符串转大写的类型
 * @example
 * type Eg1 = 'ABCD';
 */
type Eg1 = Uppercase<'abcd'>;
```

#### Lowercase

```ts
/**
 * @desc 构造一个将字符串转小大写的类型
 * @example
 * type Eg2 = 'abcd';
 */
type Eg2 = Lowercase<'ABCD'>;
```

#### Capitalize

```ts
/**
 * @desc 构造一个将字符串首字符转大写的类型
 * @example
 * type Eg3 = 'Abcd';
 */
type Eg3 = Capitalize<'abcd'>;
```

#### Uncapitalize

```ts
/**
 * @desc 构造一个将字符串首字符转小写的类型
 * @example
 * type Eg3 = 'aBCD';
 */
type Eg3 = Uncapitalize<'ABCD'>;
```

这些类型工具，在lib.es5.d.ts文件中是看不到具体定义的：

```ts
type Uppercase<S extends string> = intrinsic;
type Lowercase<S extends string> = intrinsic;
type Capitalize<S extends string> = intrinsic;
type Uncapitalize<S extends string> = intrinsic;
```

## 第三部分 自定义Ts高级类型工具及类型编程技巧

### SymmetricDifference

`SymmetricDifference<T, U>`获取没有同时存在于`T`和`U`内的类型。

```ts
/**
 * 核心实现
 */
type SymmetricDifference<A, B> = SetDifference<A | B, A & B>;

/**
 * SetDifference的实现和Exclude一样
 */
type SymmetricDifference<T, U> = Exclude<T | U, T & U>;

/**
 * @example
 * type Eg = '1' | '4';
 */
type Eg = SymmetricDifference<'1' | '2' | '3', '2' | '3' | '4'>
```

其核心实现利用了3点：分发式联合类型、交叉类型和`Exclude`。

- 首先利用Exclude从获取存在于第一个参数但是不存在于第二个参数的类型
- Exclude第2个参数是T & U获取的是所有类型的交叉类型
- Exclude第一个参数则是T | U，这是利用在联合类型在extends中的分发特性，可以理解为Exclude<T, T & U> | Exclude<U, T & U>;

总结一下就是，提取存在于`T`但不存在于`T & U`的类型，然后再提取存在于`U`但不存在于`T & U`的，最后进行联合。

### FunctionKeys

获取T中所有类型为函数的key组成的联合类型。

```ts
/**
 * @desc NonUndefined判断T是否为undefined
 */
type NonUndefined<T> = T extends undefined ? never : T;

/**
 * @desc 核心实现
 */
type FunctionKeys<T extends object> = {
  [K in keyof T]: NonUndefined<T[K]> extends Function ? K : never;
}[keyof T];

/**
 * @example
 * type Eg = 'key2' | 'key3';
 */
type AType = {
    key1: string,
    key2: () => void,
    key3: Function,
};
type Eg = FunctionKeys<AType>;
```

- 首先约束参数T类型为`object`
- 通过映射类型`K in keyof T`遍历所有的`key`，先通过`NonUndefined<T[K]>`过滤`T[K]`为`undefined | null`的类型，不符合的返回`never`
- 若`T[K]`为有效类型，则判断是否为`Function`类型，是的话返回`K`,否则`never`；此时可以得到的类型，例如：

```ts
/**
 * 上述的Eg在此时应该是如下类型，伪代码：
 */
type TempType = {
    key1: never,
    key2: 'key2',
    key3: 'key3',
}
```

最后经过`{省略}[keyof T]`索引访问，取到的为值类型的联合类型`never | key2 | key3`,计算后就是`key2 | key3`;

#### 

- `T[]`是索引访问操作，可以取到值的类型
- `T['a' | 'b']`若`[]`内参数是联合类型，则也是分发索引的特性，依次取到值的类型进行联合
- `T[keyof T]`则是获取T所有值的类型类型；
- `never`和其他类型进行联合时，`never`是不存在的。例如：`never | number | string`等同于`number | string`

#### 再敲重点！！！再敲重点！！！再敲重点！！！

- null和undefined可以赋值给其他类型（开始该类型的严格赋值检测除外）,所以上述实现中需要使用`NonUndefined先行判断。
- NonUndefined中的实现，只判断了T extends undefined，其实也是因为两者可以互相兼容的。所以你换成T extends null或者T extends null | undefined都是可以的。

```ts
// A = 1
type A = undefined extends null ? 1 : 2;
// B = 1
type B = null extends undefined ? 1 : 2;
```

### 增强Pick

PickByValue提取指定值的类型

// 辅助函数，用于获取T中类型不为never的类型组成的联合类型

```ts
type TypeKeys<T> = T[keyof T];

/**
 * 核心实现
 */
type PickByValue<T, V> = Pick<T,
  TypeKeys<{[P in keyof T]: T[P] extends V ? P : never}>
>;

/**
 * @example
 *  type Eg = {
 *    key1: number;
 *    key3: number;
 *  }
 */
type Eg = PickByValue<{key1: number, key2: string, key3: number}, number>;
```

Ts的类型兼容特性，所以类似string是可以分配给string | number的，因此上述并不是精准的提取方式。如果实现精准的方式，则可以考虑下面个这个类型工具。

PickByValueExact精准的提取指定值的类型

```ts
/**
 * 核心实现
 */
type PickByValueExact<T, V> = Pick<T,
  TypeKeys<{[P in keyof T]: [T[P]] extends [V]
    ? ([V] extends [T[P]] ? P : never)
    : never;
  }>
>

// type Eg1 = { b: number };
type Eg1 = PickByValueExact<{a: string, b: number}, number>
// type Eg2 = { b: number; c: number | undefined }
type Eg2 = PickByValueExact<{a: string, b: number, c: number | undefined}, number>
```
PickByValueExact的核心实现主要有三点：
一是利用Pick提取我们需要的key对应的类型
二是利用给泛型套一层元组规避extends的分发式联合类型的特性
三是利用两个类型互相兼容的方式判断是否相同。
具体可以看下下面例子：

```ts
type Eq1<X, Y> = X extends Y ? true : false;
type Eq2<X, Y> = [X] extends [Y] ? true : false;
type Eq3<X, Y> = [X] extends [Y]
  ? ([Y] extends [X] ? true : false)
  : false;

// boolean, 期望是false
type Eg1 = Eq1<string | number, string>
// false
type Eg2 = Eq2<string | number, string>

// true，期望是false
type Eg3 = Eq2<string, string | number>
// false
type Eg4 = Eq3<string, string | number>

// true，非strictNullChecks模式下的结果
type Eg5 = Eq3<number | undefined, number>
// false，strictNullChecks模式下的结果
type Eg6 = Eq3<number | undefined, number>
```

- 从Eg1和Eg2对比可以看出，给extends参数套上元组可以避免分发的特性，从而得到期望的结果；
- 从Eg3和Eg4对比可以看出，通过判断两个类型互相是否兼容的方式，可以得到从属类型的正确相等判断。
- 从Eg5和Eg6对比可以看出，非strictNullChecks模式下，undefined和null可以赋值给其他类型的特性，导致number | undefined, number是兼容的，因为是非strictNullChecks模式，所以有这个结果也是符合预期。如果不需要此兼容结果，完全可以开启strictNullChecks模式。

最后，同理想得到OmitByValue和OmitByValueExact基本一样的思路就不多说了，大家可以自己思考实现。

### Overwrite 和 Assign

`Overwrite<T, U>`从U中的同名属性的类型覆盖T中的同名属性类型。(后者中的同名属性覆盖前者)

```ts
/**
 * Overwrite实现
 * 获取前者独有的key和类型，再取两者共有的key和该key在后者中的类型，最后合并。
 */
type Overwrite<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T>
> = Pick<I, keyof I>;

/**
 * @example
 * type Eg1 = { key1: number; }
 */
type Eg1 = Overwrite<{key1: string}, {key1: number, other: boolean}>
```

- 首先约束T和U这两个参数都是object
- 借助一个参数I的默认值作为实现过程，使用的时候不需要传递I参数（只是辅助实现的）
- 通过Diff<T, U>获取到存在于T但是不存在于U中的key和其类型。（即获取T自己特有key和类型）。
- 通过Intersection<U, T>获取U和T共有的key已经该key在U中的类型。即获取后者同名key已经类型。
- 最后通过交叉类型进行合并，从而曲线救国实现了覆盖操作。

扩展：如何实现一个Assign<T, U>（类似于Object.assign()）用于合并呢？

```ts
// 实现
type Assign<
  T extends object,
  U extends object,
  I = Diff<T, U> & U
> = Pick<I, keyof I>;

/**
 * @example
 * type Eg = {
 *   name: string;
 *   age: string;
 *   other: string;
 * }
 */
type Eg = Assign<
  { name: string; age: number; },
  { age: string; other: string; }
>;
```

想一下，是不是就是先找到前者独有的key和类型，再和U交叉。
