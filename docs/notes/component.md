# 组件库

## 命名空间

 为了做样式隔离，否则在微前端的情况下一定会有样式冲突，我们不可以一直做垫板，那样无休止

## 依赖分开

 所谓的依赖分离，就是想所有依赖的包剥离在库之内，由外界的宿主环境提供（就是你现在运行的项目）

 ```js
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.js'),
        locale: path.resolve(__dirname, 'src/core/i18n/index.js'),
      },
      name: 'MyComponents',
      formats: ['es']
    },
    rollupOptions: {
      // vue-office / file-saver / xgplayer 勿打进 dist 异步 chunk：
      // 宿主 webpack + npm link 会把相对路径 chunk 解析成错误 publicPath（如 localhost:60001/C_Users_...）
      external: (id) =>
        id === 'vue' ||
        id === 'element-plus' ||
        id.startsWith('element-plus/') ||
        id.startsWith('@element-plus/') ||
        id.startsWith('@vue-office/') ||
        id === 'file-saver' ||
        id === 'xgplayer' ||
        id.startsWith('xgplayer/'),
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    },
  },
 ```

## 样式隔离

 以element-plus为例子

- 创建空间scss
- 提供provider

```scss
@forward 'element-plus/theme-chalk/src/mixins/config.scss' with (
  $namespace: 'ep'
);
```

上述的文件可以在任何位置

来到vite,这一步才是真正修改的地方

```js
  css: {
    preprocessorOptions: {
      scss: {
        // 业务 scss 编译前注入 $namespace=ep；跳过 node_modules 避免循环
        additionalData: (source, filename) => {
          const file = typeof filename === 'string' ? filename : ''
          if (
            file.includes('node_modules') ||
            file.replace(/\\/g, '/').endsWith('styles/element/index.scss')
          ) {
            return source
          }
          return `@use "${elementNamespaceScss}" as *;\n${source}`
        },
      },
    },
  },
```

暴露你的命名空间

```js
export const YO_EP_NAMESPACE = 'ep'
```

在注册入口接受这个命名空间

```js
export default {
  install(app, options = {}) {
    app.use(ElementPlus, {
      locale: options.locale,
      namespace: options.namespace || YO_EP_NAMESPACE,
    })
  }
};

```

以上都是组件内部所做，外界所着做
 - 引入命名空间
```js
import {YO_EP_NAMESPACE}  from  "xxx"
  app.use(yoPcUI, {
    namespace: YO_EP_NAMESPACE,
  })
```
- 来到根,修改运行时

```vue
<template>
  <YoConfigProvider :namespace="namespace">
    <div id="app">
      <router-view />
    </div>
  </YoConfigProvider>
</template>

<script>
import { YO_EP_NAMESPACE } from 'yo-pc-ui-component'

export default {
  name: 'App',
  data () {
    return {
      namespace: YO_EP_NAMESPACE
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>

```
