# 字符串

```
String 对象用于表示和操作字符序列。
字符串大部分方法和数组方法一样
```

## 字符串取

```js
  String.prototype.at()
```

## 字符串遍历

```js
  String.prototype.forEach()
```

## 字符串转换数组

```js
  String.prototype.split()
```

## 字符串替换

```js
  String.prototype.replace()
  String.prototype.replaceAll()
```

## 字符串查找

```js
  String.prototype.indexOf()
  String.prototype.lastIndexOf()
  String.prototype.search()
```

## 字符串匹配

```js
  String.prototype.match()
  // 正则是test 字符串是match
```

## 字符串大小写转换

```js
  String.prototype.toUpperCase()
  String.prototype.toLowerCase()
```

## 字符串去空格

```js
  String.prototype.trim()
  String.prototype.trimStart()
  String.prototype.trimEnd()
```

## 字符串判断

```js
  String.prototype.startsWith()
  String.prototype.endsWith()
  String.prototype.includes()
```

## 字符串模板

```js
  String.raw()
```

## 字符串不足

```js
     // 开头不足
    String.prototype.padStart()
    // 结尾不足
    String.prototype.padEnd()
```

## 字符串重复

```js
  String.prototype.repeat()
```

## 字符串本地化

```js
  String.prototype.localeCompare()
  // 比如 ['大连','北京','上海'].sort((a,b)=>a.localeCompare(b))
  // ['北京','大连','上海']
```

## 字符串拼接

```js
  String.prototype.concat()
```

## 字符串截取

```js
  String.prototype.slice()
  // 使用这个截取
  String.prototype.substring()
  // 过时
  String.prototype.substr()
```
| 方法    | 参数 |       返回值 |
|:------|    :----:   |-------------:|
| slice |  start(必需) -起始位置； end(可选)-结束位置，若未指定，则默认到末尾所有元素      | 返回 [start,end)之间的元素             |
|    substring   |     start(必需) -起始位置； end(可选)-结束位置，若未指定，则默认到末尾所有元素    |   返回 [start,end)之间的元素           |
|    substr   |     不考虑（被遗弃的方法）   | 不考虑（被遗弃的方法）      |


| 方法    | 参数  |         返回值 |
|:------|:---:|------------:|
| slice | 负数  |        从后面算 |
|    substring   | 负数  |    把所有负数置为0 |
|    substr   | 负数  | 不考虑（被遗弃的方法） |


