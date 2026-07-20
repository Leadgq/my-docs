import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    lang: 'zh-CN',
    title: '我的文档地址',
    description: '在线文档地址',
    base: '/vue-preess/',

    markdown: {
      lineNumbers: true,
    },

    themeConfig: {
      // 导航栏
      nav: [
        { text: '主页', link: '/' },
        {
          text: '基础知识',
          items: [
            {
              text: 'EcmaScript标准语法',
              items: [
                { text: '正则', link: '/base/EcmaScript/reg' },
                { text: '数组', link: '/base/EcmaScript/arr' },
                { text: '对象', link: '/base/EcmaScript/object' },
                { text: '字符串', link: '/base/EcmaScript/str' },
                { text: 'promise', link: '/base/EcmaScript/promise' },
                { text: 'this指向', link: '/base/EcmaScript/this' },
                { text: '原型链', link: '/base/EcmaScript/prototype' },
              ],
            },
            {
              text: 'WebApi',
              items: [
                { text: 'api记录', link: '/base/WebApi/window' },
                { text: 'css新特性', link: '/base/WebApi/css' },
              ],
            },
          ],
        },
        {
          text: '跨端',
          items: [
            { text: 'uniApp', link: '/cross/uniApp' },
            { text: 'electron', link: '/cross/electron' },
          ],
        },
        { text: '常用插件', link: '/plugin/plugin' },
        {
          text: '常用配置',
          items: [
            { text: 'vite常用配置', link: '/config/vite-config' },
            { text: 'tailwindcss的配置', link: '/config/tailwindcss' },
            { text: 'nodemon配置', link: '/config/nodemon' },
            { text: 'git', link: '/config/git' },
            { text: 'vscode', link: '/config/vscode' },
            { text: 'monorepo', link: '/config/monorepo' },
            { text: 'prisma', link: '/config/prisma' },
            { text: 'three', link: '/config/three' },
          ],
        },
        {
          text: 'node',
          items: [
            { text: 'node知识', link: '/node/node' },
            { text: 'Next.js', link: '/node/next' },
            { text: 'Lua', link: '/node/lua' },
          ],
        },
        {
          text: '题库',
          items: [
            { text: '基础问题', link: '/question/base' },
            { text: 'AI', link: '/question/AI' },
            { text: 'langchain', link: '/question/langchain' },
          ],
        },
        { text: '个人感悟', link: '/notes/mind' },
      ],

      // 侧边栏
      sidebar: {
        '/config/': [
          {
            text: '常用配置',
            items: [
              { text: 'vite常用配置', link: '/config/vite-config' },
              { text: 'tailwindcss的配置', link: '/config/tailwindcss' },
              { text: 'nodemon配置', link: '/config/nodemon' },
              { text: 'git', link: '/config/git' },
              { text: 'vscode', link: '/config/vscode' },
              { text: 'monorepo', link: '/config/monorepo' },
              { text: 'prisma', link: '/config/prisma' },
              { text: 'three', link: '/config/three' },
            ],
          },
        ],
        '/base/': [
          {
            text: 'EcmaScript 标准语法',
            items: [
              { text: '正则', link: '/base/EcmaScript/reg' },
              { text: '数组', link: '/base/EcmaScript/arr' },
              { text: '对象', link: '/base/EcmaScript/object' },
              { text: '字符串', link: '/base/EcmaScript/str' },
              { text: 'promise', link: '/base/EcmaScript/promise' },
              { text: 'this指向', link: '/base/EcmaScript/this' },
              { text: '原型链', link: '/base/EcmaScript/prototype' },
            ],
          },
          {
            text: 'WebApi',
            items: [
              { text: 'api记录', link: '/base/WebApi/window' },
              { text: 'css新特性', link: '/base/WebApi/css' },
            ],
          },
        ],
        '/plugin/': [
          {
            text: '常用插件',
            items: [{ text: '插件', link: '/plugin/plugin' }],
          },
        ],
        '/question/': [
          {
            text: '题库',
            items: [
              { text: '基础问题', link: '/question/base' },
              { text: 'AI', link: '/question/AI' },
              { text: 'langchain', link: '/question/langchain' },
            ],
          },
        ],
        '/cross/': [
          {
            text: '跨端',
            items: [
              { text: 'uniApp', link: '/cross/uniApp' },
              { text: 'electron', link: '/cross/electron' },
            ],
          },
        ],
        '/node/': [
          {
            text: 'Node',
            items: [
            { text: 'node知识', link: '/node/node' },
            { text: 'Next.js', link: '/node/next' },
            { text: 'Lua', link: '/node/lua' },
          ],
          },
        ],
        '/notes/': [
          {
            text: '个人感悟',
            items: [{ text: '个人感悟', link: '/notes/mind' }],
          },
        ],
      },

      // 社交链接
      socialLinks: [
        { icon: 'github', link: 'https://github.com/Leadgq' },
      ],

      // 页脚
      footer: {
        message: '作者: leaderGq | 时间: 2023-2025',
      },

      // 搜索
      search: {
        provider: 'local',
      },
    },
  })
)
