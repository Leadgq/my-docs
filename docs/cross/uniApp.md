# uniApp

```handlebars
uniApp 可以跨端、现在支持vue2、vue3的使用、主要记录常见问题
```

## 添加生命周期

```shell
pnpm install dcloudio
```

```handlebars
在新版uniApp中是可以使用vue3的组合式的
如果你直接使用组合式无法使用{onLaunch, onShow, onHide, onLoad}页面周期函数
```

## 参数获取

```vue

<script setup>
import {onMounted} from "vue";
// 不这么用、报错
import {onLaunch, onShow, onHide, onLoad, onReady} from '@dcloudio/uni-app'

onMounted(() => {

})
onLoad(() => {
  console.log(33)
})
// 参数使用
onLoad((params) => {
  console.log(params)
})
</script>
```

## 参数获取建议

```handlebars
如果是页面级别 推荐使用onLoad 、如果是组件级别使用props获取参数
如果是页面级别 推荐使用onReady初始化数据、如果是组件级别使用onMounted、或者watchEffect初始化数据
当然vue3不限制onLoad 或者 onMounted的个数  
```

## 生命周期

| onLoad | onReady | onMounted |
|:------:|:-------:|:---------:|
|   最快   |   其次    |    最慢     |

## 使用实例

```vue

<template>
  <view>
    <view v-for="item in data" :key="item.id">{{item.name}}---{{item.age}}</view>
  </view>
</template>

<script setup>
import {ref} from "vue";
import {
  onLoad,
  onReady
} from '@dcloudio/uni-app'

let data = ref([]);
onReady(async () => {
  data.value = await mockData();
})
const mockData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve([{
        id: 1,
        name: 'zs',
        age: '33'
      },
        {
          id: 2,
          name: 'lisi',
          age: '33'
        },
        {
          id: 3,
          name: 'ww',
          age: '33'
        },
      ])
    })
  })
}
</script>
```

### 总结

```handlebars
vue3一样、如果实在不喜欢uniApp的生命周期、完全使用vue3的工作方式、一样可以(已经测试)
```

## ui引入

```shell
npm install uview-plus
```

```js
// 来到main.js
import uviewPlus from 'uview-plus'

app.use(uviewPlus)
// 如此配置即可
uni.$u.config.unit = 'rpx'
```

```handlebars
在项目根目录的uni.scss中引入此文件。
@import 'uview-plus/theme.scss';
引入uview-plus基础样式
在App.vue中首行的位置引入，注意给style标签加入lang="scss"属性
<style lang="scss">
    /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
    @import "uview-plus/index.scss";
</style>
```

```handlebars
// 来到  pages.json
{
    "easycom": {
        // 注意一定要放在custom里，否则无效，https://ask.dcloud.net.cn/question/131175
        "custom": {
        "^u-(.*)": "uview-plus/components/u-$1/u-$1.vue"
        }
    }
}
```
## 页面级上拉加载、下拉刷新

```handlebars
    {
        "path": "pages/index/test",
        "style": {
        "navigationBarTitleText": "测试",
        "onReachBottomDistance": 0,
        "enablePullDownRefresh": true
        }
    }
```

```vue
<script setup>
import {onPullDownRefresh, onReachBottom} from '@dcloudio/uni-app';
import {ref} from "vue";
let data = ref([])
onPullDownRefresh(() => {
  setTimeout(() => uni.stopPullDownRefresh(), 200)
})
onReachBottom(() => {
  console.log("12345")
})
</script>
```
