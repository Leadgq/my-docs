# 原型链

## __proto__

任何对象都有一个 `__proto__` 属性，指向该对象的原型对象。原型对象也有 `__proto__` 属性，指向它的原型对象，
以此类推，形成一个原型链。原型链的末端是 `null`。

## prototype

任何函数都会拥有prototype,而prototype也是一个对象

## 例子

```js

function testFn() {

}

const test = new testFn()

test.__proto__ === testFn.prototype // true 
testFn.prototype.__proto__ === Object.prototype // true
```

``` 
  test:{
    __proto__:testFn.prototype{
    __proto__:Object.prototype{
      __proto__:null    
    }
    }
  }
```
