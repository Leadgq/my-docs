# 数组定义

```
在 JavaScript 中，数组不是基本类型，而是具有以下核心特征的 Array 对象：
JavaScript 数组是可调整大小的，并且可以包含不同的数据类型。（当不需要这些特征时，可以使用类型化数组。）
JavaScript 数组不是关联数组，因此，不能使用任意字符串作为索引访问数组元素，但必须使用非负整数（或它们各自的字符串形式）作为索引访问。
JavaScript 数组的索引从 0 开始：数组的第一个元素在索引 0 处，第二个在索引 1 处，以此类推，最后一个元素是数组的 length 属性减去 1 的值。
JavaScript 数组复制操作创建浅拷贝。（所有 JavaScript 对象的标准内置复制操作都会创建浅拷贝，而不是深拷贝）。
注: 对象也是浅拷贝
```

## 数组具有迭代器

```
数组内部实现了迭代器，这使得数组被大多数期待可迭代进行使用
例如展开语法 ...arr 因为对象并没有实现迭代协议这导致你不能使用...obj
或者for ... of 方法
```

## 数组迭代

```js
Array.prototype.forEach(); // 不可打断。因为迭代器
// for ... of
// for
``` 

## 数组取

```js
Array.prototype.at();
Array[index];
```

## 数组增

```js
Array.prototype.push();
Array.prototype.unshift();
Array.prototype.splice(index, 1, item);
```

## 数组删

```js
// ***
Array.prototype.splice(index, 1);
Array.prototype.pop();
Array.prototype.shift();
```

## 数组查

```js
Array.prototype.find();
Array.prototype.findLast();
Array.prototype.findIndex();
Array.prototype.findLastIndex();
Array.prototype.indexOf();
Array.prototype.lastIndexOf();
Array.prototype.includes();
```

## 数组切割

```js
Array.prototype.slice(); 
```

## 数组连接

```js
Array.prototype.concat(); 
[...arr1, ...arr2];
```

## 数组判断

```js
Array.prototype.isArray(); 
```

## 数组过滤

```js
Array.prototype.filter(); 
```

## 数组重做

```js
Array.prototype.map(); 
Array.prototype.flatMap(); // 实用性一般
Array.prototype.flat(); //  这个没用，压平数组不适合使用提供的方法
```

## 数组翻转

```js
Array.prototype.reverse();
```

## 数组存在

```js
Array.prototype.some(); // 是否有一个满足
Array.prototype.every(); // 是否全部满足
```

## 数组填充

```js
Array.prototype.fill();
```

## 数组累加

```js
Array.prototype.reduce();
Array.prototype.reduceRight();
pass: 这里叫做数据降解更好 
why: 因为这个方法可以将数组降解为任意类型, 就是将数组降解为一个值
```

## 数组转换为字符串

```js
Array.prototype.join(); 
Array.prototype.toString(); //力推
```

## 伪数组转换

```js
[...伪数组];
Array.prototype.from();
```

## 数组实验语法

```js
Array.prototype.group();
Array.prototype.groupToMap();
```

## 数组this

```js
// 传递数组参数
Function.prototype.apply(this, Array);
// 返回一个函数
Function.prototype.bind(this);
// 传递多个参数
Function.prototype.call(this, a, b);
```

## 数组杂项

```js
// 下面只要是对象具有它都有,不太实用
keys();
values();
entries();
```

## 数组新增

### 返回一个元素顺序相反的新数组
    
```js
Array.prototype.toReversed();
```

### 返回一个新数组，其元素按升序排列

```js
Array.prototype.toSorted();
```

### 返回个新数组，并在给定的索引处删除和/或替换了一些元素

```js
Array.prototype.toSpliced();
```

### 返回一个新数组，其指定索引处的值会被新值替换
```js
Array.prototype.width(index, value);
```

## 树状数据的操作

```shell
npm install swc-lib
```
[gitHub中文地址](https://www.npmjs.com/package/tree-esm-lib)
