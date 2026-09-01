# 设计模式

## 简介

<!-- 什么是设计模式、为什么要用 -->

## 创建型

<!-- 单例、工厂、建造者等 -->

- 单例 ->（略）

-> 工厂 -> (略)

- 建造者模式

```js
class QueryBuilder {
    params = {};

    withPage(page) {
        if (page) {
            this.params.page = page
        }
        return this;
    }

    withKeyWord(keyWord) {
        if (keyWord) {
            this.params.keyWord = keyWord
        }
        return this;
    }
}

const queryBuild = new QueryBuilder();
queryBuild
    .withPage(1)
    .withKeyWord("hello")
console.log(queryBuilder.params);
```

## 结构型

<!-- 适配器、装饰器、代理、外观等 -->

- 适配器

```js
// 将不同的数据整合统一，以后全部认这个
const adapters = {
    wechat: (raw) => ({orderId: raw.out_trade_no, amount: raw.total_fee / 100}),
    alipay: (raw) => ({orderId: raw.out_trade_no, amount: Number(raw.total_amount)}),
}
```

- 装饰器

扩展函数能力

## 行为型

<!-- 观察者、策略、责任链、发布订阅等 -->

- 观察者模式

```js
 // 如果希望当状态变化，所有状态跟着变化就可以使用，例如vue2的观察者
class Subject {

    constructor() {
        this.observers = []
    }

    add(fn) {
        this.observers.push(fn);
    }

    notify(data) {
        this.observers.forEach((fn) => fn(data))
    }
}

const user = new Subject()
user.add((name) => console.log('日志:', name))
user.add((name) => console.log('UI 更新:', name))
user.notify('张三')   // 直接挨个叫
```

- 发布订阅 ->(略)

- 策略模式

```ts
// 所谓的策略模式：同一件事，多套可替换的算法
type User = 'vip' | 'normal';

const doVip = () => console.log('处理VIP逻辑');
const doNormal = () => console.log('处理普通用户逻辑');

const map: Record<User, () => void> = {
    vip: doVip,
    normal: doNormal,
};

function doSomething(userRole: User) {
    return map[userRole]();
}

```

- 责任链

```js
     // 责任链模式
class Handler {
    nextHandler = null;

    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }

    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
}

class ValidateHandler extends Handler {
    handle(request) {
        if (!request || request.length === 0) {
            throw new Error('错误：评论不能为空');
        }
        return super.handle(request);
    }
}

class SanitizeHandler extends Handler {
    handle(request) {
        const cleanStr = request.replace('脏话', '**');
        return super.handle(cleanStr);
    }
}

class SuccessHandler extends Handler {
    handle(request) {
        return super.handle(request);
    }
}

const validator = new ValidateHandler();
const sanitizer = new SanitizeHandler();
const successHandler = new SuccessHandler();
validator.setNext(sanitizer).setNext(successHandler)

const result = validator.handle('今天天气真好！');
```

- 责任链配合适配器

```js
// 个人建议 如果要使用责任模式， 在javaScript使用next的方式
const adapters = {
    wechat: (raw) => ({orderId: raw.out_trade_no, amount: raw.total_fee / 100}),
    alipay: (raw) => ({orderId: raw.out_trade_no, amount: Number(raw.total_amount)}),
}
const chain = [
    (order, next) => order.amount > 0 ? next() : '金额非法',
    (order, next) => order.amount < 100000 ? next() : '触发风控',
    (order, next) => {
        console.log('入账', order);
        return '成功'
    },
]

function handler(channel, raw) {
    const order = adapters[channel](raw);
    const run = (i = 0) => {
        return chain[i](order, () => run(i + 1));
    }
    return run();
}

const result = handler("alipay", {out_trade_no: '1234566', total_amount: 1000})
console.log(result);
```

## 其他

<!-- 组合式、依赖注入等前端常见写法 -->
