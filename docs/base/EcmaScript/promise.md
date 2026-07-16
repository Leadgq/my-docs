# Promise简介

```
  promise是一个异步操作的容器，它代表了某个未来才会知道结果的事件
  从语法上说，promise是一个对象，从它可以获取异步操作的消息
  promise提供统一的API，各种异步操作都可以用同样的方法进行处理
```

- **pending**：初始状态，既不是成功，也不是失败状态
- **fulfilled**：意味着操作成功完成
- **rejected**：意味着操作失败

```
  promise对象的状态改变，只有两种可能：
  从pending变为fulfilled
  从pending变为rejected
  状态改变只能发生一次
```

## promise.all

```
  promise.all接收一个promise对象的数组作为参数
  如果其中一个 Promise 对象的状态为拒绝（即状态为 rejected）
  那么该 Promise 对象会传递给 Promise.all() 方法的 reject() 方法，
  该方法会拒绝该 Promise 对象。此时，Promise.all() 方法的解决状态也会被设置为拒绝。
  因此，如果一个 Promise 对象的状态为拒绝，那么 Promise.all() 方法仍然会进行
  并且最终解决状态也会被设置为拒绝。
```
```js
   // 一个promise对象的状态为拒绝会进入catch
    Promise.all([promise1, promise2, promise3 ])
    .then(function (values) {
        console.log(values);
    }).catch(function (reason) {
        console.log(reason);
    })
```

## promise.allSettled

```
  promise.allSettled接收一个promise对象的数组作为参数
  该方法返回一个在所有给定的promise已被决议或被拒绝后决议的promise，
  并带有一个对象数组，每个对象表示对应的promise结果。
  它不会因为promise被拒绝而失败，所以不需要使用try/catch来捕获错误。
  它会返回一个数组，数组中每个对象对应每个promise的结果,每个结果中
  都会包含status状态，fulfilled表示成功，rejected表示失败，
  value表示成功的值，reason表示失败的原因
```

```js
   // 不会出现catch，因为不管成功还是失败都会进入then
    Promise.allSettled([promise1, promise2, promise3 ])
    .then(function (values) {
        console.log(values);
    })
```

## promise.any

```
    promise.any接收一个promise对象的数组作为参数
    当输入的任何一个 Promise 兑现时，这个返回的 Promise 将会兑现，并返回第一个兑现的值。
    当所有输入 Promise 都被拒绝（包括传递了空的可迭代对象）时，
    它会以一个包含拒绝原因数组的 AggregateError 拒绝。
```

```js
    // 只要有一个成功就会进入then，如果都失败了就会进入catch
   // 只要成功的最快的那个promise对象的值
   Promise.any([promise1, promise2, promise3 ])
    .then(function (values) {
        console.log(values);
    }).catch(function (reason) {
        console.log(reason);
    })
```

## promise.race

```js
    // 只要最快的那个promise对象的值，
    // 如果最快的那个promise对象的状态为拒绝会进入catch
    // 如果最快的那个promise对象的状态为成功会进入then
  Promise.race([promise1, promise2, promise3 ])
    .then(function (values) {
        console.log(values);
    }).catch(function (reason) {
        console.log(reason);
    })
```

## promise.withResolvers

```
    Promise.withResolvers 是 ES2023 中的一种新方法，
    它允许您创建使用自定义值resolve或reject的Promise。
    这对于各种任务都很有用，例如创建使用异步操作结果解决的Promise或因自定义错误而被拒绝的Promise
```

```
    就是说如果我有一个函数，内部是异步或者希望返回一个promise对象和其他方法，当
    内部函数执行完毕，外界还可以继续调用这个promise对象进行下一步操作
```

```js
// 以前的做法
function cancelableTimeout(ms) {
    let res;
    let rej;
    const promise = new Promise((resolve, reject) => {
        res = resolve;
        rej = reject;
    });
    const timeId = setTimeout(res, ms);
    const cancel = () => {
        clearTimeout(timeId);
        rej(new Error('cancel'));
    }
    return {promise, cancel};
}
// 现在的做法
function cancelableTimeout(ms) {
    const {promise, resolve, reject} = Promise.withResolvers();
    const timeId = setTimeout(resolve, ms);
    const cancel = () => {
        clearTimeout(timeId);
        reject(new Error('cancel'));
    }
    return {promise, cancel};
}

const {promise, cancel} = cancelableTimeout(1000);
promise.then(() => {
    console.log('timeout');
}).catch((err) => {
    console.log(err);
});
```
