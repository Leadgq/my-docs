## node常用命令

```bash
 npm config list
 node -v
 npm ls -g 
```

```
 npm config list 这个命令可展示
 registry = "https://registry.npmmirror.com/" 这个是npm的镜像地址
 node bin location = C:\Program Files\nodejs\node.exe 这个是node的安装地址
 node version = v16.16.0   这个是node的版本
 npm local prefix = C:\Users\Admin 这个是npm的安装地址
 npm version = 8.11.0 这个是npm的版本
 cwd = C:\Users\Admin    这个是当前的工作目录
 HOME = C:\Users\Admin 这个是当前的用户目录
```

## package.json

```json
{
  "name": "node",
  "version": "1.0.0",
  "description": "node",
  // commonjs模块 找个模块
  "main": "index.js",
  // esm模块 找找个模块
  "module": "index.js",
  // 这个是模块的类型 有两种类型 一种是commonjs 一种是esm
  // module 是esm
  // commonjs 是commonjs
  "type":"module",
  // 你要上传的文件报名
  "files": [
    "lib",
    "esm"
  ],
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    // 这个是自定义的命令
    "start": "node index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  // 这个是依赖
  "dependencies": {
    "axios": "^0.24.0",
    "express": "^4.17.2"
  },
  // 这个是开发依赖
  "devDependencies": {
    "nodemon": "^2.0.15",
    "webpack" : "^5.65.0",
  }
}
```


## npm install 原理

```
首先安装的依赖都会存放在根目录的node_modules,默认采用扁平化的方式安装，
并且排序规则.bin第一个然后@系列，再然后按照首字母排序abcd等，
并且使用的算法是广度优先遍历，在遍历依赖树时,npm会首先处理项目根目录下的依赖，
然后逐层处理每个依赖包的依赖，
直到所有依赖都被处理完毕。在处理每个依赖时，
npm会检查该依赖的版本号是否符合依赖树中其他依赖的版本要求，
如果不符合，则会尝试安装适合的版本
```

## npm install 后序过程

```
 npm install 之后 会执行npm config list
 先去项目级别找寻.npmrc文件，如果没有找到，就去用户级别找寻.npmrc文件，
 如果还是没有找到，就去全局级别找寻.npmrc文件，
 如果还是没有找到，就去内置的npmrc文件中找寻，如果还是没有找到，就使用默认的配置。
 在检查是否存在packag.json文件和package-lock文件，
 如果存在，就会根据package-lock.json文件中的依赖版本号进行安装，
 如果不存在，就会根据package.json文件中的依赖版本号进行安装。
 有冲突的时候，会根据package.json中的依赖版本号进行安装
 没有冲突的时候，下载完毕进行缓存检查，如果缓存中存在，直接将文件解压到node_modules中。
```
![image](/images/node.png)


## node_modules .bin

```
node_modules中的.bin文件夹会存放可执行文件，这些文件只需要你在
scripts中提供、其他平台的所有跨端命令都会被制作好
```


## npx 命令

```
  npm 5.2.0版本之后，就有了npx命令，
  npx可运行.bin文件夹下中可执行文件
  npx专注于命令 
  npm专注于包管理
```
## npx 使用方式

```bash
  npx create-react-app my-app
  npx webpack
  npx webpack --config webpack.config.js
  npx webpack-dev-server
```

## npx 原理

```
  npx会首先检查本地是否存在该命令，如果存在就执行本地命令，
  如果不存在就会去远程仓库下载该命令并执行，执行完毕后删除。
  它是一次性的，不占用空间。
```

## 模块化

```
    模块化是指将一个复杂的系统分解到多个模块以方便编码。
    模块化可以解决命名冲突、文件依赖管理、代码复用、代码解耦等问题。
    模块化的规范有commonjs、amd、cmd、esm等。
    commonjs是nodejs的模块化规范，amd和cmd是浏览器的模块化规范，
    esm是es6的模块化规范。
```

## CommonJS 规范

``` 
     1. 支持引入内容模块 http fs
     2. 支持导入第三方模块
     3. 支持引入自己写的模块
     4. 支持引入addon模块
```

## ESM模块规范
``` js
    1.引入模块 import 必须写在头部
        注意:使用esm必须在package.json中配置type:module 否则报错
    2.引入json文件必须 需要增加断言并且指定类型json node低版本不支持
        import data from './data.json' assert { type: "json" };
    3.加载模块的整体对象
        import * as echarts from  "echarts";
    4.导入动态模块
        import('./math').then(math => {
          console.log(math.add(1, 2));
        });
    5. 导出一个默认对象 default只能有一个不可重复export default
        export default {
          name: 'zhangsan',
          age: 18
       }
    6. 导出变量
        export const name = 'zhangsan'
        export const age = 18       
```

## Cjs 和 ESM 的区别

```
    common.js 是同步的 esm是异步的
    common.js 的值可以修改的 esm的值是只读的
    common.js的this 是当前模块的exports对象 esm的this是undefined
    common.js 是可以tree-shaking的 esm是不可以的
    common.js 是运行时加载 esm是编译时加载（也就说当你引入的时候我就知道你要用那个模块的内容）
```

## node全局变量
    
```
    __dirname 当前文件所在的目录,当前运行的文件在那个目录下
    __filename 当前文件的绝对路径,E:\project\node测试\fs\test\index2.js
    process 进程对象
    module 当前模块对象
    exports 导出对象
    require 引入模块
    globalThis 全局对象(代替global)
```


## CSR SSR SEO

```
    CSR: 客户端渲染  vue react angular
    SSR: 服务端渲染 (可选 nuxt.js react-ssr)
    SEO: 搜索引擎优化
```

```
  ssr 对seo更加友好
  csr 对seo不友好，但是对服务器压力更小， 初始化加载js比较多，首屏渲染时间长
```

## path

``` 
  path模块主要是处理路径,不需要引入就可直接应用
```

```js
  resolve返回绝对路径
  最常用方法 path.resolve(__direname,'./index.js')返回绝对路径
  path.join() 用于拼接路径使用
  path.basename('c://a.html') 返回路径的最后一部分   返回 a.html
  path.extname('a.html')  返回扩展名   返回.html
  path.dirname() 返回路径的目录部分 
```

```js
  path.dirname(url.fileURLToPath(import.meta.url))  ==> 模块在哪个目录下（E:\project\node测试\fs\test）
  import.meta.url  ==> 模块的绝对路径（file:///E:/project/node%E6%B5%8B%E8%AF%95/fs/test/index.js）
  url.fileURLToPath(import.meta.url)  ==> 模块的绝对路径（E:\project\node测试\fs\test\index.js）
  这种方式多用于esm模块 
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  // 因为node不支持esm模块，所以需要使用这种方式，如果直接是用__dirname会报错
```

## fs模块

```
  fs模块主要是用于文件操作
```

```js
  // 异步读取文件
  fs.readFile('index.js','utf-8',function(err,data){
    console.log(data)
  })
  // 同步读取文件
  fs.writeFile('index.js','hello world',function(err){
    console.log('写入成功')
  })
  // 异步写入文件
  fs.appendFile('index.js','hello world',function(err){
    console.log('追加成功')
  })
  // 删除文件
  fs.unlink('index.js',function(err){
    console.log('删除成功')
  })
  // 重命名文件
  fs.rename('index.js','index2.js',function(err){
    console.log('重命名成功')
  })
  // 复制文件
  fs.copyFile('index.js','index2.js',function(err){
    console.log('复制成功')
  })
  // 创建文件夹
  fs.mkdir('test',function(err){
    console.log('创建成功')
  })
  // 删除文件夹
  fs.rmdir('test',function(err){
    console.log('删除成功')
  })
  // 读取文件夹
  fs.readdir('test',function(err,files){
    console.log(files)
  })
  // 监听文件变化
  fs.watch('index.js',function(event,filename){
    console.log(event,filename)
  })
  // 文件是否存在
  fs.statSync();
  // 是否是文件夹
  fs.statSync(filePath).isDirectory()
```

## os

```
  Nodejs os 模块可以跟操作系统进行交互
```

```
   例如判断系统类型，当前cpu的架构等,实际例子
```

```js
const os =  require('os');
const { exec } = require('child_process');
function  openBrowser(url){
    // mac
    if(os.platform() === 'darwin'){
       exec(`open ${url}`)
    } else if(os.platform() === 'win32'){
      exec(`start ${url}`)
    } else {  // Linux, Unix-like
     exec(`xdg-open ${url}`); //执行shell脚本
    }
}
openBrowser('http://www.baidu.com');
```

```js
  // 获取当前电脑的 address 192.168.1.1
  os.networkInterfaces().en0[1].address
```

```js
  os.arch() // 返回当前cpu的架构   
  os.type() // 返回当前操作系统的类型  windows linux darwin
  os.platform()  //返回操作系统的平台  win32 linux darwin
```


## process 

```
   进程模块
```

```js
  process.arch() // 返回当前cpu的架构 
  process.cwd() // 返回当前工作目录 
  process.env() // 返回当前系统环境变量 比如NODE_ENV
  process.argv() // 返回当前进程的命令行参数 例如 node index.js --port 3000
  process.exit() // 退出当前进程
  process.nextTick() // 用于异步回调
  process.kill() // 杀死进程
```

## child_process

```
 在node中只要是涉及到异步的操作都需要回调函数、 在每个异步操作的都对于一个同步的api
```

```js
  const {exec} = require('child_process')
  // exec 用于执行shell命令
  exec('ls -al',function(err,stdout,stderr){
    console.log(err,stdout,stderr)
  })
  exec('node -v',(err,stdout)=>{
    if(err) return;
    const nodeVersion = stdout.slice(1).toString().trim()
  })
 // exec 只适合执行小的shell 
```

```js
  const {spawn} = require('child_process')
  // spawn 用于执行大的shell命令 
  const child = spawn('netstat',['-an'])
  child.stdout.on('data',function(data){
    console.log(data.toString())
  })
  child.stderr.on('data',function(data){
    console.log(data.toString())
  })
  child.on('close',function(code){
    console.log(code)
  })
```

```js
  const {fork} = require('child_process')
  // fork 用于执行js文件 相当于开启一个新的进程
  // 因为node 不适合cpu密集型的操作，所以一般用于开启一个新的进程
  // 处理一些cpu密集型的操作
  const child = fork('./child.js')
  child.on('message',function(data){
    console.log(data)
  })
  child.send('hello')
```

```js
    process.send();
    process.on('event',callBack)
```



## cli 创建

```
  你需要4个包 commander inquirer download-git-repo ora
  commander 用于创建命令
  inquirer 用于创建交互式命令
  download-git-repo 用于下载git仓库
  ora 用于创建loading
```

```json
"bin":{
  "my-cli":"src/index.js"
}
```

```
上面的代码是用于创建命令的，my-cli是你的命令名字，src/index.js是你的入口文件
```

```
在执行npm link 之后，你就可以在全局使用my-cli命令了
```

```js
#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const ora = require('ora');
// 如果type是module的话使用import
```


```js
// index.js

#!/usr/bin/env node

import { program } from "commander"
import fs from "node:fs";
import inquirer from "inquirer";
import { checkPath, downloadTemp } from "./util.js";
let packageJson = JSON.parse(fs.readFileSync("./package.json"))
program.version(packageJson.version)


program.command("create  <projectName>").description("创建项目").action((projectName) => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: '请输入项目名称',
        },
        {
            type: 'confirm',
            name: 'isTs',
            message: '是否使用ts',
        }
    ]).then((answers) => {
        if (checkPath(answers.projectName)) {
            console.log("项目已存在")
            return;
        }
        if (answers.isTs) {
            downloadTemp('ts', answers.projectName)
        } else {
            downloadTemp('js', answers.projectName)
        }
    })
})

program.parse(process.argv)

```


```js
// util.js

import fs from "node:fs"
import download from 'download-git-repo'
import ora from 'ora'
const spinner = ora('下载中...')

export const checkPath = (path) => {
    return fs.existsSync(path)
}

export const downloadTemp = (branch, projectName) => {
    spinner.start();
    return new Promise((resolve, reject) => {
        download(`direct:https://gitee.com/chinafaker/vue-template.git#${branch}`, projectName, { clone: true }, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
            spinner.succeed('下载成功');
        })
    })
}
  
 ```

## makeDown文档转换

```
  需要marked、ejs、browserSync
  marked 用于将markdown转换成html
  esj 创建模板
  browserSync 用于创建本地服务
```

```sh
  npm install marked ejs browser-sync -D
```
<ul>
    <li>1.创建ejs模板</li>
    <li>2.更改模版内容</li>
    <li>3.内容引入css</li>
</ul>


```html 
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <%= title %>
    </title>
    <link rel="stylesheet" href="./index.css">
</head>

<body>
  我是模板
    <%- content %>
</body>

</html>
```


```js
const marked = require('marked');
const ejs = require('ejs');
const fs = require("node:fs")
const browserSync = require('browser-sync')
let browser = null;

const init = () => {
    const readme = fs.readFileSync('README.md', "utf-8");
    const makerDown = marked.parse(readme);
    ejs.renderFile('./template.ejs', {
        content: makerDown,
        title: 'makerDown 转换测试'
    }, (err, html) => {
        if (err) {
            throw new Error(err);
        } else {
          // 可使用流的方式写入
            fs.writeFileSync('index.html', html);
            openBrowser();
            // 流方式写入
            // const writeStream = fs.createWriteStream('index.html');
            // writeStream.write(html);
            // writeStream.close();
            // writeStream.on('finish', () => { openBrowser() })
        }
    });
}
const openBrowser = () => {
    if (browser) {
        browser.reload();
        return;
    }
    browser = browserSync.create();
    browser.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });
}

fs.watchFile('README.md', (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        init();
    }
})

init();

```

##  node反向代理

```
  用于解决跨域问题
  需要http-proxy-middleware
```

```sh
  npm install http-proxy-middleware -D
```

```js
const fs = require('node:fs');
const url = require('node:url');
const http = require('node:http');
const html = fs.readFileSync('./index.html');
//代理配置，例如vue.config.js中的proxy
const proxyConfig = require("./file.config.js")
//代理中间件
const { createProxyMiddleware } = require("http-proxy-middleware")

http.createServer((req, res) => {
  // 所有的请求都会走这里
    const { pathname } = url.parse(req.url, true);
    // 获取所有代理的key
    const proxyList = Object.keys(proxyConfig.server.proxy);
    // 如果是代理的请求就走代理
    if (proxyList.includes(pathname)) {
        const proxy = createProxyMiddleware(proxyConfig.server.proxy[pathname])
        proxy(req, res);
        return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);

}).listen(8080);
```


```
 开发环境,例如vue-cli vite 都会开一个本地服务器,代理的源码就是上面所写,
 但是生产环境就不一样了，因为vue打包之后只有一个index.html文件,js，和css,
 不能进行代理，所以生产的情况下前端的代理方式采用nginx来实现的
```


```ts
  //vite实现的反向代理
  const { proxy } = serverConfig
  if (proxy) {
    middlewares.use(proxyMiddleware(httpServer, proxy, config))
  }

export function proxyMiddleware(
   httpServer: http.Server | null,
  options: NonNullable<CommonServerOptions['proxy']>,
  config: ResolvedConfig,

) {
   Object.keys(options).forEach((context) => {
  let opts = options[context]
    if (!opts) {
      return
    }
    if (typeof opts === 'string') {
      opts = { target: opts, changeOrigin: true } as ProxyOptions
    }
    const proxy = httpProxy.createProxyServer(opts) as HttpProxy.Server
   })
}
```

```bash
  vite 采用的是http-proxy作为反向代理 
```
[gitHub地址](https://github.com/http-party/node-http-proxy?tab=readme-ov-file)


## 邮件服务

```
 例子采用qq
 需要的包 nodemailer js-yaml
 nodemailer: 用于发送邮件
 js-yaml: 用于解析yaml文件
```

```sh
  npm install nodemailer js-yaml
```


```js
import nodemailer from "nodemailer";
import yaml from "js-yaml";
import http from "node:http";
import url from "node:url"
import fs from "node:fs";
const mailConfig = yaml.load(fs.readFileSync("./main.yaml", "utf8"));
const transporter = nodemailer.createTransport({
    service: "qq",
    port: 587,
    host: 'smtp.qq.com',
    secure: true,
    auth: {
        user: mailConfig.user,
        pass: mailConfig.pass,
    }
});

http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    if (pathname === '/send/mail' && req.method === 'POST') {
        let mainInfo = '';
        req.on('data', chunk => {
            mainInfo += chunk;
        });
        req.on('end', () => {
            const { to, subject, text } = JSON.parse(mainInfo);
            transporter.sendMail({
                from: mailConfig.user,
                to,
                subject,
                text,
            });
            res.end('success');
        });
    }
}).listen(3000, () => {
    console.log("Server running on port 3000");
});
```