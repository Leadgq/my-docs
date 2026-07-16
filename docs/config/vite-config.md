# vite常用配置

```
vite的常用配置包括:跨域配置,自动导入hook,自动加载组件,mock数据配置,别名配置
yarn add  unplugin-auto-import
yarn add  unplugin-vue-components
```

## 跨域配置

```
server: {
            port: 5173,
            open: true,
            proxy: {
                '/api': {
                    target: env.VITE_HOST,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/api/, '')
                },
                '/ws': {
                    target: env.VITE_WS,
                    changeOrigin: true,
                    rewrite: path => path.replace(/^\/ws/, '')
                }
            }
}
```

## 自动导入hook

<p>导入<i style="color: red">hook</i>可以让你节省对方法的导入比如ref,reactive</p>

```js
 import {ref} from  "vue"
```

```js
import AutoImport from "unplugin-auto-import/vite";
plugins:[
       AutoImport({
                imports: ['vue', 'vue-router', '@vueuse/core', {
                    '@vueuse/math': ['useSum']
                }],
                // 什么地方可以使用自动导入 
                include: [/\.vue$/, /\.vue\?vue/, /\.md$/,/\.nvue$/],
                dts: "src/auto-import.d.ts"
            })
]
```

## 自动加载组件

```handlebars
自动加载组件,不需要你每次进行导入,而是可以使用第三方包的组件
例如
<el-button>按钮</el-button> 在页面中就可以直接使用
```

```js
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver, ElementPlusResolver } from "unplugin-vue-components/resolvers";
Components({
dirs: ['src/components'],
resolvers: [ElementPlusResolver(),AntDesignVueResolver()],
dts: true,
include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
deep: true
})
```

## 别名配置

```js
import path from "path";
resolve: {
    alias: {
    '@': path.resolve(__dirname, 'src')
    }
}
```

## mock数据

```handlebars
    yarn add vite-plugin-mock
    import { viteMockServe } from "vite-plugin-mock";
    viteMockServe({
        mockPath: './src/mock',
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && Boolean(env.VITE_MOCK_STATE),
        injectCode: `
        import { setupProdMockServer } from './mock/mockProdServer';
        setupProdMockServer();
    `
    })
```

## webWork
```handlebars
   开启webWorker之后打包会报错,所以需要处理一下打包方式
     worker: {
        format: 'es'
    },
```

## 开发npm包

```json
// 来到package.json文件中
{
  "name": "tree-esm-lib",  //包名
  "description": "树方法",
  "private": false,
  "version": "0.1.0",
  "type": "module",
  "files": [   // 那些文件需要打包
    "dist"
  ],
  // 脚手架命令
  "bin":{
    "tree-cli":"./src/index.js"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "license": "ISC",
  "main": "./dist/tree-lib.umd.cjs",  // umd格式入口
  "module": "./dist/tree-lib.js",  // esm格式入口
  "devDependencies": {
    "vite": "^4.4.5"
  },
  "dependencies": {
    "rollup-plugin-terser": "^7.0.2"
  }
}
```

```js
 // 来vite.config.js文件中
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { createVuePlugin}  from  "vite-plugin-vue2"
import libCss from 'vite-plugin-libcss';
/** @type {import('vite').UserConfig} */

export default defineConfig({
  build: {
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'main.js'),
      name: 'treeLib',     
      fileName: 'tree-lib', 
    },
    plugins: [
      createVuePlugin(), // vue2.0的插件.识别vue2.0的语法
      libCss()   // 能帮助你打包之后，把css文件引入到js文件中
    ],
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```