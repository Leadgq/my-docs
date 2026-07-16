# this指向问题


## 了解this

```
 对于this问题，首先需要了解作用域和箭头函数
 因为箭头函数没有自己的this，箭头函数的this是继承父级作用域的this
```


## 重点理解函数作用域

- **全局作用域**：脚本模式运行所有代码的默认作用域
- **模块作用域**：模块模式中运行代码的作用域
- **函数作用域**：由函数创建的作用域

```
   全局作用域：在所有函数声明或者大括号之外定义的变量，都在全局作用域中,可以抽象认为是window对象
   模块作用域：在模块中定义的变量，都在模块作用域中
   函数作用域：在函数中定义的变量，都在函数作用域中
```

```js
const obj = {
    message: 'hi',
    say() {
        return this.message
    },
    say2:() => {
        return this.message
    }
}
obj.say(); // hi
obj.say2(); // undefined
```
```
  这里打印结果是 hi  undefined
  对于普通函数而言，this指向的是调用它的对象除非调用apply、call、bind 修改了this指向
  对于箭头函数而言，this指向的是父级作用域的this，因为箭头函数没有自己的this，
  这里say2需要看自己父作用域,由于obj是一个对象没有形成作用域(全局作用域，模块作用域，函数作用域)
  所以它的父作用域还要往上看,有函数么？没有，继续往上看，有模块么？没有，继续往上看，有全局么？有
  所以是window对象，window对象没有message属性，所以是undefined
```

```js
 // 上述代码变换
const obj = {
    message: 'hi',
    say() {
        const say2 = () => {
            return this.message
        }
        return say2()
    },
}
obj.say();
// 这时候返回的就是 hi
// 因为say2的父级作用域是say函数，say函数的this指向的是obj对象

// 代码在转换
const say2 = ()=> {
    return this.message
}
const obj = {
    message: 'hi',
    say() {
        return say2()
    },
}
obj.say();  // undefined，因为say2的父级作用域是window对象
```