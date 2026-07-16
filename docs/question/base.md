# 题库

## vue 父子组件的生命周期

```vue
<!-- 父组件 -->
<template>
  <div>
    <child></child>
  </div>
</template>

<script>
  import child from "./child.vue";

  export default {
    components: {
      child,
    },
  };
</script>

<!-- 子组件 -->
<template>
  <div>
    <p>子组件</p>
  </div>
</template>
```

```
 只要你懂的render函数的运行时机那么上面的问题就很简单
     1.运行父 beforeCreate 我得先创建父亲
     2.运行父 created 父亲创建好了
     3.运行父 beforeMount 父亲准备挂载
        这时候 render函数开始运行
        render(){
            // 在这里我发现我需要子组件，那么我就去创建子组件
             4.运行子 beforeCreate 我得先创建儿子
             5.运行子 created 儿子创建好了
             6.运行子 beforeMount 儿子准备挂载
             7.运行子 mounted 儿子挂载完毕
        }
    8.运行父 mounted 父亲挂载完毕
```

## webView 嵌入模式，生产发布时，代码缓存

```
发生问题：生产发布时，代码缓存，导致页面不更新
发生问题的原因：由于浏览器的协商缓存机制，导致页面不更新
解决方案：在生产发布时，需要修改nginx配置，添加如下配置
add_header Cache-Control "no-cache, must-revalidate, proxy-revalidate, no-store";
如果使用 no-cache, 那么每次都去服务器验证，如果资源未修改，可以使用缓存，如果资源已修改，
那么就重新下载资源。
如果使用 no-store, 不会使用缓存，直接去服务器下载资源。
如果都不像使用 no-store 可以使用移除 etag 或者 last-modified
no-store ===  etag off; last_modified off;
```

## webView 预加载

```vue
发生问题：嵌入的时候，当访问子应用的时候，白屏时间过长 h5 uniApp 的解决方法 :
创建一个空白的webView 用来预加载
<web-view :src="url" :style="width:0,height:0"></web-view>
url 就是子应用的地址, 宽高为0,这样就不会显示出来
```

## 如何唤起 app

```vue

<template>
  <div>
    <button @click="openApp">打开抖音</button>
  </div>
</template>
<script>
  export default {
    components: {},
    data() {
      return {};
    },
    mounted() {
    },
    computed: {},
    methods: {
      openApp() {
        // window.location.href = 'snssdk1128://';
        window.location.href = "weixin://scanqrcode";
      },
    },
  };
</script>
```

## 资源提示符

```html
async:
<script async src="xxx.js"></script>
1. 正常解析dom树 2. 遇到async的script标签，开始下载，不阻塞dom树的解析 3.
下载完毕，立即执行，执行完毕 4. 暂停dom树的解析 5. 执行完毕，恢复dom树的解析 6.
所以无法确认当前解析dom树的dom节点 defer:
<script defer src="xxx.js"></script>
1. 正常解析dom树 2. 遇到defer的script标签，开始下载，不阻塞dom树的解析 3.
下载完毕，等待dom树解析完毕，再执行 4. 执行完毕，恢复dom树的解析 5.
所以可以确认当前解析dom树的dom节点 6. 在执行完毕之后DOMContentLoaded事件触发
tips：
<script type="module"></script>
会自动添加defer属性 上述都是作用于 script 标签,都是需要执行的 preload:
<link rel="preload" href="xxx.js" as="script"/> 1.不会停止dom的解析
2.会提前下载资源（优先级高）当我看到这个标签立刻去拿资源,但不执行 prefetch:
<link rel="prefetch" href="xxx.css"/> 1.不会停止dom的解析
2.会提前下载资源（优先级低）当浏览器空闲的时候去拿资源,但不执行
```

## 多个 gl 导致地图崩溃的原因

  注意点:
    webGl的创建是有个数限制的一般来说是16个
创建过多的实例对象会出现, Too many active WebGL contexts.Oldest  context will be lost错误
例如在大屏项目，存在地图，和多个echart - 3D模式的图表
解决方案:
- 获取echarts的canvas实例并
调用
canvas.getContext('webgl')?.getExtension('WEBGL_lose_context')?.loseContext();
来模拟上下文丢失, 这样就会释放webgl的实例对象，我们还需要使用
- let chartInstance = echarts.getInstanceByDom(dom);
if (chartInstance) {
    chartInstance.dispose();
}
如果不这么做随着页面过多，会出现卡顿
- 3.地图内部进行对地图的销毁
const destroyMapInstance = () => {
    map && map.destroy();
};

## gl 的恢复和丢失使用的方法?

```js
 1.
上下文丢失
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");
const loseContext = gl.getExtension('WEBGL_lose_context');
loseContext && loseContext.loseContext();
2.
上下文恢复
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");
const loseContext = gl.getExtension('WEBGL_lose_context');
loseContext && loseContext.restoreContext();
```

## vue2 vs vue3

### question: what is the different between vue2 and vue3?

- At the writing level, vue2 is configuration, vue3 is option.
  vue2 requires that user data be written in the data function.
  But in vue3, yuo can write anywhere you want,you just need to import ref or reactive that proxy your responsive data.
  it is a good design, we can create a function that it its own "hook" state by itself. for example, in js, in vue, in
  ts.

- In the Underling design, Object.defineProperty was used data Proxy in the vue2. vue3 uses Proxy to proxy data.
  This results in it being faster than vue2.

## css question

### question: what is grid layout?

- The grid layout can provide a two-dimensional layout for the web page,
  for example, If you have a container And you want to arrange it in four rows and four columns.
  You can use "display: grid; grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);".
  The above code means that the container has four rows and four columns,and each row and column are equally divided.
  Grid items get bigger as the pages gets bigger and smaller as the pages gets smaller,
  Now you can put your content in it. But now they did not have any gaps, so you can use "gap: 10px;" to add gaps.
  In this way, a easy grid layout is created.

### question: what is flex layout?

- For elements , there are two types of elements , one is inline, the other is block.
  For block elements. By default, they are arranged downward. we have to use "float" to arrange them horizontally.
  But it is not a good way to do it. Because we must consider use "clear" to clear the float. It is a terrible
  experience.

- The flex layout is used to resolve the issue. we only use "display:flex". then elements will be arranged horizontally.

### question: new Features for ES6?

```
 what have new Features for ES6? And take about your understanding for them.
```

- ES6 is new standard for JavaScript. This new Version provides many ways
  to standardize our code. such as:

1. use let and const to define variable.
2. arrow function to define function.
3. we can insert dynamic variables into string template by using ${}.
4. Add "includes" method to String.

### question: what is new Features for Vue3.5?

```
   You would like to take about your understanding for them ?
```

- Of course. The new Vue3.5 was published at September 1, 2024.
  This is new Version provide so new Features that you can use Vue better.
- First, We can not deconstruct Props until then. If you do that , Vue will be lost the ability to monitor data.
  But, Vue3.5 has solved this issue. This is data can be used directly. The improvement is very excited for me,
  Because, I do not write so many "props" that I keep clean in my code.
- Second, "useTemplateRef" is a new method to replace ref when you need to get a document instance.
  The author said "The ref should be used to define reactive data,rather than get a document instance or a component
  instance ".
- Third, The Version add a new method called "useId". But so far, I do not know what is it used for.
- Four, The new Version improved the watch method. The watch method has the ability to observe whether the data has
  changed.
  But, If you do not want to observe data which has a particularly deep level. Because the watch method only receives a
  Boolean configuration. so, Now you can provide a number type to dynamically control the depth of observation.
