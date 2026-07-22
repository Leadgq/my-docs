# Lua

## 简介

Lua 是一门轻量级脚本语言，语法简单、嵌入性强。常见用途：

- **Redis 脚本**：在 Redis 内部执行原子操作
- **游戏开发**：World of Warcraft、Love2D 等
- **配置脚本**：Nginx OpenResty、Wireshark 等

Node.js 本身不运行 Lua，通常是通过 Redis 客户端把 Lua 脚本发送到 Redis 执行。

## 基本类型

Lua 只有 8 种基本类型：

| 类型 | 说明 | 示例 |
|------|------|------|
| `nil` | 空值 | `nil` |
| `boolean` | 布尔 | `true` / `false` |
| `number` | 数字（整数和浮点统一） | `42` / `3.14` |
| `string` | 字符串 | `"hello"` |
| `table` | 表（数组 + 字典） | `{ 1, 2, 3 }` |
| `function` | 函数 | `function() end` |
| `userdata` | 用户数据（C 扩展） | — |
| `thread` | 协程 | — |

```lua
-- 变量默认是全局的，局部变量用 local
local name = "Lua"
local age = 30
local isOk = true

-- 类型判断
print(type(name))   -- string
print(type(age))    -- number
print(type(isOk))   -- boolean
```

## 字符串

```lua
local s1 = "hello"
local s2 = 'world'
local s3 = [[
多行
字符串
]]

-- 拼接
local msg = s1 .. " " .. s2   -- "hello world"

-- 常用方法
print(string.len(s1))              -- 5
print(string.upper(s1))            -- HELLO
print(string.sub(s1, 1, 3))        -- hel（索引从 1 开始）
print(string.find(s1, "ll"))       -- 3
print(string.gsub("a-b-c", "-", "_"))  -- a_b_c
```

## 运算符

```lua
-- 算术
local a, b = 10, 3
print(a + b)   -- 13
print(a - b)   -- 7
print(a * b)   -- 30
print(a / b)   -- 3.333...
print(a // b)  -- 3（整除，Lua 5.3+）
print(a % b)   -- 1
print(a ^ b)   -- 1000

-- 比较（注意：没有 ===，只有 ==）
print(a == b)   -- false
print(a ~= b)   -- true（不等于用 ~=）
print(a > b)    -- true

-- 逻辑
print(true and false)  -- false
print(true or false)   -- true
print(not true)        -- false
```

## 条件与循环

```lua
-- if / elseif / else
local score = 85
if score >= 90 then
  print("优秀")
elseif score >= 60 then
  print("及格")
else
  print("不及格")
end

-- while
local i = 1
while i <= 5 do
  print(i)
  i = i + 1
end

-- for 数值循环
for i = 1, 5 do
  print(i)
end

for i = 10, 1, -2 do   -- 起始, 结束, 步长
  print(i)             -- 10, 8, 6, 4, 2
end

-- for 遍历 table（ ipairs 数组部分，pairs 全部键值）
local arr = { "a", "b", "c" }
for index, value in ipairs(arr) do
  print(index, value)
end
```

## table（最重要）

table 是 Lua 唯一的数据结构，同时充当**数组**和**字典**。

```lua
-- 数组（索引从 1 开始）
local list = { "apple", "banana", "cherry" }
print(list[1])        -- apple
print(#list)          -- 3（长度运算符）

table.insert(list, "date")       -- 末尾插入
table.remove(list, 2)            -- 删除索引 2

-- 字典
local user = {
  name = "张三",
  age = 25,
}
print(user.name)      -- 张三
print(user["age"])    -- 25

user.email = "a@b.com"   -- 新增字段

-- 遍历
for key, value in pairs(user) do
  print(key, value)
end
```

## 函数

```lua
-- 基本定义
function add(a, b)
  return a + b
end

-- 局部函数
local function multiply(a, b)
  return a * b
end

-- 匿名函数
local divide = function(a, b)
  return a / b
end

-- 多返回值
function minMax(a, b)
  if a < b then
    return a, b
  else
    return b, a
  end
end

local min, max = minMax(3, 7)

-- 可变参数
function sum(...)
  local total = 0
  for _, v in ipairs({...}) do
    total = total + v
  end
  return total
end

print(sum(1, 2, 3, 4))   -- 10
```

## 闭包

```lua
function counter()
  local count = 0
  return function()
    count = count + 1
    return count
  end
end

local next = counter()
print(next())   -- 1
print(next())   -- 2
print(next())   -- 3
```

## 模块

```lua
-- math_utils.lua
local M = {}

function M.square(n)
  return n * n
end

function M.average(list)
  local sum = 0
  for _, v in ipairs(list) do
    sum = sum + v
  end
  return sum / #list
end

return M
```

```lua
-- main.lua
local mathUtils = require("math_utils")
print(mathUtils.square(5))          -- 25
print(mathUtils.average({1,2,3}))   -- 2
```

## 协程（coroutine）

```lua
local co = coroutine.create(function()
  print("step 1")
  coroutine.yield()
  print("step 2")
end)

coroutine.resume(co)   -- step 1
coroutine.resume(co)   -- step 2
```

## 常用标准库

```lua
-- table
table.concat({ "a", "b", "c" }, ", ")   -- "a, b, c"
table.sort({ 3, 1, 2 })                  -- 排序

-- string
string.format("name: %s, age: %d", "Lua", 30)

-- math
math.floor(3.7)    -- 3
math.ceil(3.2)     -- 4
math.random(1, 10) -- 1~10 随机整数

-- os（Redis 脚本中不可用）
os.date("%Y-%m-%d")
```

## Redis 中的 Lua

Redis 内置 Lua 5.1，脚本在 Redis 内部**原子执行**，适合多步读写合并成一次操作。

### 基本规则

- 通过 `EVAL` / `EVALSHA` 执行脚本
- `KEYS`：传入的键名列表
- `ARGV`：传入的参数列表
- 用 `redis.call()` 调 Redis 命令（出错会中断脚本）
- 用 `redis.pcall()` 调 Redis 命令（出错返回错误，不中断）

### 脚本示例

```lua
-- 原子 GET + 自增
local key = KEYS[1]
local current = redis.call('GET', key)
if not current then
  current = 0
else
  current = tonumber(current)
end
current = current + 1
redis.call('SET', key, current)
return current
```

```lua
-- 限流：60 秒内最多 100 次
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])

local count = redis.call('INCR', key)
if count == 1 then
  redis.call('EXPIRE', key, window)
end

if count > limit then
  return 0
end
return 1
```

### Node.js 调用

```js
import Redis from 'ioredis'

const redis = new Redis()

// EVAL script numkeys key [key ...] arg [arg ...]
const result = await redis.eval(
  `
  local key = KEYS[1]
  local val = redis.call('GET', key)
  return val or 'default'
  `,
  1,
  'mykey',
)

console.log(result)
```

```js
// 带参数
const ok = await redis.eval(
  `
  local key = KEYS[1]
  local limit = tonumber(ARGV[1])
  local count = redis.call('INCR', key)
  if count == 1 then
    redis.call('EXPIRE', key, 60)
  end
  return count <= limit and 1 or 0
  `,
  1,
  'rate:user:123',
  100,
)
```

### 注意点

- Redis 脚本中**不能**使用 `os.execute`、`io` 等阻塞/外部 IO
- 避免在脚本里写长循环，会阻塞 Redis 单线程
- 键名放 `KEYS`，业务参数放 `ARGV`，便于 Cluster 路由
- 生产环境建议用 `SCRIPT LOAD` + `EVALSHA` 减少传输开销

## 和 JavaScript 的差异

| 特性 | Lua | JavaScript |
|------|-----|------------|
| 数组索引 | 从 **1** 开始 | 从 **0** 开始 |
| 不等于 | `~=` | `!==` |
| 逻辑与/或 | `and` / `or` | `&&` / `\|\|` |
| 空值 | `nil` | `null` / `undefined` |
| 数据结构 | 只有 `table` | Object / Array / Map 等 |
| 作用域 | 默认全局，用 `local` 声明局部 | 块级 / 函数作用域 |

## 本地练习

```bash
# 安装 Lua（Windows 可用 scoop / choco）
# macOS
brew install lua

# 运行脚本
lua hello.lua
```

```lua
-- hello.lua
print("Hello, Lua!")
```
