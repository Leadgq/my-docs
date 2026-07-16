# tailwindcss

```handlebars
tailwindcss是现代前端组织css的工具,具备响应式,同时继承大量常用css的缩写,节省自定义类所花费的时间
以下是vue3 + vite的配置
```

## 下载准备tailwindcss

```handlebars
下载:
npm install -D tailwindcss@latest postcss@latest autoprefixer@lates
初始化:
npx tailwindcss init -p
```

## 引入tailwindcss

```handlebars
在您的 CSS 中引入 Tailwind
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 使用tailwindcss

```handlebars
// src/main.js | main.ts
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
createApp(App).mount('#app')
```
