# Element Plus 命名空间配置（namespace = ep）

## 1. 背景

Ticket 子应用（Vue 3 + Element Plus）通过 qiankun 嵌入主应用。主应用使用 Element UI，类名前缀为 `.el-*`。

若子应用 Element Plus 仍用默认 `el` 命名空间，两边样式会冲突。因此子应用与 `yo-pc-ui-component` 统一改为 **`ep`**：

| 类型 | 示例 |
|------|------|
| DOM 类名 | `.ep-button`、`.ep-input__wrapper` |
| CSS 变量 | `--ep-color-primary`、`--ep-border-color` |

---


## 2. 核心约定

以下三处 **必须同为 `ep`**，改一处需同步其余：

| 层级 | 作用 |
|------|------|
| JS 常量 `YO_EP_NAMESPACE` | 运行时 Element Plus、ConfigProvider |
| SCSS 变量 `$namespace` | 编译期主题、业务 scss |
| `app.use(..., { namespace })` | 子应用入口注册 |

---

## 4. 组件库（yo-pc-ui）



### 4.1 定义 JS 常量

**文件：** `src/core/namespace.js`

```js
/** Element Plus DOM/CSS 前缀，须与 styles/element/index.scss 中 $namespace 一致 */
export const YO_EP_NAMESPACE = 'ep'
```

**文件：** `src/components/index.js`（对外导出）

```js
export { YO_EP_NAMESPACE } from '../core/namespace.js'
```

---

### 4.2 定义 SCSS 变量

**文件：** `src/styles/element/index.scss`

```scss
// Element Plus 自定义命名空间（与主应用 Element UI 的 .el-* 隔离）
@forward 'element-plus/theme-chalk/src/mixins/config.scss' with (
  $namespace: 'ep'
);
```

---

### 4.3 安装时注册 namespace

**文件：** `src/components/index.js`（install 方法内）

```js
import { YO_EP_NAMESPACE } from '../core/namespace.js'

// namespace 必须与 styles/element/index.scss 的 $namespace 一致
app.use(ElementPlus, {
  locale: options.locale,
  namespace: options.namespace || YO_EP_NAMESPACE,
})
```

---

### 4.4 Vite 构建：业务 scss 自动注入 $namespace

**文件：** `vite.config.js`

```js
const elementNamespaceScss = path
  .resolve(__dirname, 'src/styles/element/index.scss')
  .replace(/\\/g, '/')

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // 不在库构建里用 unplugin-element-plus 按需注入样式：
    // 会绕过 namespace forward，打出 .el-*
  ],
  css: {
    preprocessorOptions: {
      scss: {
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
})
```

---

### 4.5 主题打包（打出 dist/style.css）

**文件：** `src/components/style/index.scss`

```scss
// namespace=ep 由 vite additionalData 注入
// 勿用 element-plus/dist/index.css，否则 namespace 不生效
@use 'element-plus/theme-chalk/src/index.scss' as *;

@use './theme' as *;
@use "./button" as *;
// ... 其他业务样式
```

构建后 `dist/style.css` 中类名均为 `.ep-*`。

---

### 4.6 组件内样式写法

业务组件覆盖 Element Plus 样式时，选择器用 `.ep-*`：

**示例：** `src/components/search/search.vue`

```scss
:deep(.ep-input__wrapper) {
  // ...
}
:deep(.ep-button) {
  // ...
}
```

---

## 5. 子应用（也是会下载你的包的应用）

根目录：`你的项目`

### 5.1 入口注册组件库 + namespace

**文件：** `src/main.js`

```js
import yoPcUI, { zhCn, YO_EP_NAMESPACE } from 'yo-pc-ui-component'
import 'yo-pc-ui-component/dist/style.css'

function render (props = {}) {
  app = createApp(App)

  // namespace=ep：与主应用 Element UI 的 .el-* 隔离
  app.use(yoPcUI, { locale: zhCn, namespace: YO_EP_NAMESPACE })
  app.use(router)
  // ...
}
```

---

### 5.2 根组件 ConfigProvider

**文件：** `src/App.vue`

```vue
<template>
  <!-- element 提供  你可以修改成ElConfigProvider -->
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
```

---

### 5.3 子应用 SCSS 变量（与组件库内容一致）

**文件：** `src/styles/element/index.scss`（`7003ef2` 新增）

```scss
// Element Plus 自定义命名空间（与主应用 Element UI 的 .el-* 隔离）
// 须与 yo-pc-ui-component 的 YO_EP_NAMESPACE / $namespace 保持一致
@forward 'element-plus/theme-chalk/src/mixins/config.scss' with (
  $namespace: 'ep'
);
```

---

### 5.4 Webpack：业务 scss 自动注入 $namespace

**文件：** `build/utils.js`（`7003ef2` 修改 `cssLoaders` 内 scss 配置）

```js
// Element Plus 自定义 namespace=ep（跳过 node_modules，避免循环依赖）
const elementNamespaceScss = path
  .resolve(__dirname, '../src/styles/element/index.scss')
  .replace(/\\/g, '/')

const scssAdditionalData = (content, loaderContext) => {
  const resource = (loaderContext && loaderContext.resourcePath) || ''
  if (
    resource.includes('node_modules') ||
    resource.replace(/\\/g, '/').endsWith('styles/element/index.scss')
  ) {
    return content
  }
  return `@use "${elementNamespaceScss}" as *;\n${content}`
}

// scss loader 配置
scss: generateLoaders('sass', {
  implementation: require('sass'),
  api: 'modern',
  additionalData: scssAdditionalData
}),
```

效果：子应用 `.vue` / `.scss` 编译时自动带上 `$namespace: ep`，无需每个文件手动 `@use`。

---

### 5.5 子应用业务页样式写法

页面里若需覆盖 EP 组件样式：

```scss
<style lang="scss" scoped>
.my-wrap {
  :deep(.ep-form-item__label) {
    // ...
  }
}
</style>
```