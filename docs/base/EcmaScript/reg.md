# 正则表达式

```handlebars
 javaScript所提供的处理字符串的方法有限,所以需要更强大的处理的方式进行处理,这个方式就是正则
```

## 正则的基本使用

```js
let str = '13342391269';
let reg = /1269/gi;
console.log(str.match(reg));
```
## 方法
```handlebars
 math 字符串方法
 test  正则方法
 exec 正则方法  ===> lastIndex
matchAll 全局匹配的时候显示细节
```

## 正则常用字符

```handlebars
    \d 数字 \D 非数字
    \w 字母数字下划线  \W 非字母数字下划线
    \s 空格   \S 非空格
    \. 转义.   . 除了空格之外
    .* 0或多个  + 多次
    ^ 开始  & 结束
    {} 位置限制
    (.*?) 禁止贪婪
    (?:) 不记录组 
    $& 本身
   [^] 非
```

## 匹配模式

```handlebars
  g  全局模式
  y  局部模式
  i  忽略大小写
  s  忽略空格
  m  多行处理
```

## 原子表

```js
   // [] 称为原子表 在原子表内容只要是匹配到就行
    let data = 13342391268
    let reg = /^[a-z0-9]{10}$/gi;
```

## 原子组

```js
  // () 被称为原子组 ?:不记录组
  // ?: 不记录组在字符串执行匹配之后,不会出现在匹配的返回结果
    let data = `<img src='api/file/1.png'/><span>123</span><img src='api/file/1.png'/>`;
    let reg = /(<img.*)(['"])(.+?)(\2)(\/>)/gi;
    data = data.replace(reg, (v, ...args) => {
      args[2] = args[2].replace("api", "http");
      return args.splice(0, 5).join("")
    });
```


## 限制条件
```js
   // ?= 后面是什么   ?<= 前面是什么
   //  ?! 后面不能是什么 ?<! 前面不是什么
  let data = `<img src='api/file/1.png'/><span>123</span><img src='api/file/1.png'/>`;
  let reg = /(?<=src=(['"]))(.+?)(?=\1)/gi;
  data = data.replace(reg,(v)=>v.replace("api","http"))
```

