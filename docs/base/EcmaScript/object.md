# 对象定义

```handlebars
object是javaScript的一种数据类型,用于存储更复杂的数据类型,
在 JavaScript 中，几乎所有的对象都是Object，它们都会从 Object.prototype 继承属性和方法.
通过原型链，所有的object都可以观察Object原型链的改变、尽管这是不安全的，但提供更强大的机制
注：对象并没有实现迭代协议
```

## 对象迭代

```js
// (for in )
Object.keys();  // 返回可枚举的所有键 [key]
Object.values(); // 返回可枚举的所有值 [value]
Object.entries(); // 键值对  [key,value]
```

## 对象控制

```js
// 开发不常用一下方式
Object.seal() // 封闭对象  wang编译器就是用这样方式  可修改 
// 在vue的data中可用、禁止所有操作
Object.freeze()  // 冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。
Object.preventExtensions() // 控制对象永远不允许在添加属性
```

## 对象合并

```js
Object.assign();
let obj1 = {};
let obj2 = {};
const obj3 = {...obj1, ...obj2};
```

## 对象包含

```js
Object.hasOwn();  //对象是否包含某个键  
Object.prototype.hasOwnProperty()  // 对象是否包含某个键
// 注：Object.hasOwn() 替代Object.prototype.hasOwnProperty()  
// hasOwn 可检测Object.create(null);
```

## 对象的强比较

```js
 Object.is() // 强制比较 优先级大于 ===
//  注：可比较 +0 -0  NaN    
//  Object.is(NaN,NaN) true NaN === NaN  false 
//  Object.is(-0,+0) false  +0 === -0  true 
//  在数学角度看 -0 和 +0 是有特殊含义的，如果认为相同，
//  那么你就认为 Infinity(正无穷) 和 -Infinity是一个东西这是错误的
//  在vue3的源码中使用过这个方法、正常开发不必要、会导致歧义
```

## 对象创建

```js
//Object.create() 方法用于创建一个新对象，使用现有的对象来作为新创建对象的原型（prototype）。
Object.create()  // * 开发几乎不用
```

## 检查对象

```js
Object.isExtensible()  //是否可扩展
Object.isSealed()   // 是否被密封
Object.isFrozen()   // 是否被冻结
```

## 对象代理

```js
Object.defineProperty()
// vue2 实现的主要方法
let obj = {}
Object.defineProperty(obj, null, {
  writable: false,
  configurable: false,
  enumerable: false
})
```

## 结构化克隆

```js
let  anyTypeData = {a:1,b:2};
let  result = StructuredClone(anyTypeData);
```


## 对象分组

```js
Object.groupBy() // 分组实验性语法
```