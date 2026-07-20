# Next.js

> 基于学习项目 `D:\project\learn\next` 整理，版本：**Next.js 16.2** + **React 19** + **Prisma 7** + **PostgreSQL**

## 简介

Next.js 是基于 React 的全栈 Web 框架，核心能力：

- **文件系统路由**：目录即路由，不用手写路由表
- **Server / Client 双组件模型**：服务端渲染 + 客户端交互
- **API Route**：同一项目里写后端接口
- **中间层（Proxy）**：请求到达页面前做鉴权、重定向等
- **缓存与渲染策略**：静态预渲染、动态请求时渲染

数据库（Prisma + PostgreSQL）**不属于 Next.js 框架本身**，是项目自己接入的数据层。

---

## 整体架构

```
浏览器
  │
  ▼
Proxy（src/proxy.ts）          ← Next.js 请求拦截层
  │
  ├── Server Component         ← 服务端组件（默认，可 async、可调数据库）
  ├── Client Component         ← 客户端组件（"use client"，交互、hooks）
  └── API Route（/api/*）      ← 后端接口
          │
          ▼
      Prisma Client            ← 项目自选 ORM
          │
          ▼
      PostgreSQL               ← 外部数据库
```

### Next.js 框架包含

| 层级 | 说明 |
|------|------|
| 客户端 | `"use client"` 组件，浏览器运行 |
| 服务端 | Server Component，Node 端运行 |
| API Route | `app/api/**/route.ts` |
| Proxy / 中间件 | `src/proxy.ts`，请求拦截 |
| 路由 | `page.tsx`、`layout.tsx`、动态路由 |
| 缓存 | `cacheComponents`、`connection()`、`Suspense` |

### 项目自己加的（非 Next.js 内置）

| 层级 | 说明 |
|------|------|
| Prisma | ORM，操作数据库 |
| PostgreSQL | 数据存储 |
| `.env` | 环境变量（数据库连接等） |
| `migrate` / `seed` | 建表、初始数据 |

---

## 项目结构

```
learn/next/
├── prisma/
│   ├── schema.prisma          # 数据模型定义
│   ├── seed.ts                # 种子数据
│   └── migrations/            # 迁移 SQL
├── prisma.config.ts             # Prisma 配置（读 .env）
├── next.config.ts               # Next.js 配置
├── .env                         # 环境变量（DATABASE_URL）
└── src/
    ├── proxy.ts                 # 请求拦截（鉴权）
    ├── lib/
    │   └── prisma.ts            # Prisma 客户端单例
    ├── generated/prisma/        # prisma generate 生成的代码
    ├── components/
    │   └── Greeting.tsx         # 公共组件
    └── app/                     # App Router 根目录
        ├── layout.tsx           # 根布局
        ├── page.tsx             # 首页（登录/注册）
        ├── globals.css          # 全局样式
        ├── not-found.tsx        # 404 页面
        ├── about/
        │   ├── layout.tsx       # about 嵌套布局
        │   ├── page.tsx         # 用户列表
        │   └── detail/page.tsx  # 详情页
        ├── me/
        │   ├── layout.tsx
        │   └── page.tsx         # 查询参数示例
        ├── connection/
        │   ├── page.tsx         # connection() 示例
        │   └── click-button.tsx # Client 子组件
        ├── dynamic/
        │   └── [[...id]]/page.tsx  # 可选 catch-all 动态路由
        └── api/
            ├── login/route.ts   # 登录
            └── user/
                ├── route.ts     # 用户列表 / 注册
                └── [id]/route.ts # 单个用户 CRUD
```

---

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 环境变量（.env）

```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/nextjs"
```

> **注意**：`.env` 里的数据库名必须和你在客户端（如 DBeaver）连接的数据库一致。  
> 之前连的是 `postgres` 库，客户端看的是 `nextjs` 库，所以客户端显示"No tables found"。

### 常用命令

```bash
# 启动开发服务器
pnpm dev

# 数据库：修改 schema 后同步到数据库（真正建表/改表）
npx prisma migrate dev --name 描述

# 仅生成 Prisma Client 代码（不建表！）
npx prisma generate

# 写入种子数据
npx prisma db seed

# 构建 / 生产启动
pnpm build
pnpm start
```

### migrate vs generate（易混淆）

| 命令 | 作用 | 是否改数据库 |
|------|------|-------------|
| `prisma migrate dev` | 执行迁移 SQL，建表/改表 | ✅ 是 |
| `prisma generate` | 生成 TypeScript 客户端代码到 `src/generated/prisma` | ❌ 否 |
| `prisma db push` | 开发时快速同步 schema（无迁移文件） | ✅ 是 |

**改 schema 后的正确流程：**

```
改 schema.prisma → migrate dev → （自动 generate）
```

---

## 路由

App Router 下，**文件夹 + 特殊文件名 = 路由**。

| 文件 | 作用 |
|------|------|
| `page.tsx` | 页面（可访问的路由） |
| `layout.tsx` | 布局（包裹子页面，不刷新） |
| `not-found.tsx` | 404 页面 |
| `route.ts` | API 接口（不是页面） |

### 项目中的路由一览

| URL | 文件 | 类型 |
|-----|------|------|
| `/` | `app/page.tsx` | 登录/注册页 |
| `/about` | `app/about/page.tsx` | 用户列表 |
| `/about/detail` | `app/about/detail/page.tsx` | 详情 |
| `/me` | `app/me/page.tsx` | 个人中心 |
| `/me?id=5` | 同上 + 查询参数 | 查询参数路由 |
| `/connection` | `app/connection/page.tsx` | connection 示例 |
| `/dynamic` | `app/dynamic/[[...id]]/page.tsx` | 可选 catch-all |
| `/dynamic/5` | 同上 | 路径动态路由 |
| `/dynamic/a/b/c` | 同上 | 多段 catch-all |
| `/api/login` | `app/api/login/route.ts` | 登录 API |
| `/api/user` | `app/api/user/route.ts` | 用户 API |
| `/api/user/[id]` | `app/api/user/[id]/route.ts` | 单个用户 API |

### 路径动态路由 vs 查询参数（SEO）

| 方式 | 示例 | SEO | 适用场景 |
|------|------|-----|----------|
| 路径动态路由 | `/dynamic/5` | ✅ 更好 | 内容页、详情页、文章 |
| 查询参数 | `/me?id=5` | 一般 | 筛选、排序、分页、临时状态 |

路径型 URL 更清晰，搜索引擎更容易当作独立页面；查询参数适合功能型参数（`?sort=asc&page=2`）。

### 动态路由：`[[...id]]`（可选 catch-all）

```
/dynamic          → id = undefined
/dynamic/5        → id = ["5"]
/dynamic/a/b/c    → id = ["a", "b", "c"]
```

```tsx
// app/dynamic/[[...id]]/page.tsx
"use client";
import { useParams } from "next/navigation";

const params = useParams();
const id = params.id;
// Array.isArray(id) ? id.join(" / ") : id
```

### 查询参数：`searchParams`

```tsx
// Server Component 接收
export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) { ... }

// Client Component 接收
import { useSearchParams } from "next/navigation";
const id = useSearchParams().get("id");
// /me?id=5 → id = "5"
```

### Layout 嵌套布局

`about/layout.tsx` 提供 header + sidebar + footer，`about/page.tsx` 和 `about/detail/page.tsx` 共享该布局。

```tsx
// about/layout.tsx
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <header>...</header>
      <main>{children}</main>
      <footer>...</footer>
    </section>
  );
}
```

---

## Server Component vs Client Component

### 对比

| | Server Component（默认） | Client Component（`"use client"`） |
|---|---|---|
| 运行环境 | Node 服务端 | 浏览器 |
| 能否 async | ✅ 可以 | ❌ 不可以 |
| 能否用 hooks | ❌ 不可以 | ✅ 可以 |
| 能否 onClick | ❌ 不可以 | ✅ 可以 |
| 能否调 Prisma | ✅ 可以直接 | ❌ 需通过 API |
| 能否用 connection() | ✅ 可以 | ❌ 不可以 |

### 规则

1. 文件顶部写 `"use client"` → 整个文件都是 Client Component
2. **不能**在同一个 Client 文件里写 `async` 组件 + `connection()` + `onClick`
3. 需要交互的部分拆到单独的 Client 文件

### 正确拆分示例（connection 页）

```tsx
// app/connection/page.tsx — Server Component
import { connection } from "next/server";
import { ClickButton } from "./click-button";

async function DynamicContent() {
  await connection();
  return <h1>{Math.random()}</h1>;
}

export default function ConnectionPage() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <DynamicContent />
      </Suspense>
      <ClickButton />
    </>
  );
}
```

```tsx
// app/connection/click-button.tsx — Client Component
"use client";

export function ClickButton() {
  return <button onClick={() => console.log("Click me")}>Click me</button>;
}
```

### 数据获取两种方式

```
Client Component  ──fetch──►  API Route  ──►  Prisma  ──►  DB
Server Component  ─────────直接调用──────►  Prisma  ──►  DB
```

项目里 `about/page.tsx` 用 fetch 调 API；Server Component 也可以跳过 API 直接查库。

---

## connection() 与缓存

### connection() 是什么

来自 `next/server`，表示「等到真实用户请求再继续渲染」，用于：

- `Math.random()`、`new Date()` 等每次请求不同的值
- 没有用到 `cookies()` / `headers()` 但仍需动态渲染

```tsx
import { connection } from "next/server";

export default async function Page() {
  await connection(); // 预渲染在此停止，以下代码只在请求时运行
  const rand = Math.random();
  return <span>{rand}</span>;
}
```

### cacheComponents

`next.config.ts` 中开启：

```ts
const nextConfig: NextConfig = {
  cacheComponents: true,
};
```

配合 `Suspense` 做流式渲染和缓存边界。

### Suspense

异步组件需要包裹在 `<Suspense fallback={...}>` 中：

```tsx
<Suspense fallback={<div>加载中...</div>}>
  <AsyncComponent />
</Suspense>
```

Client Component 使用 `useSearchParams()` 时也建议外层包 Suspense（见 `me/layout.tsx`）。

---

## API Routes（Route Handlers）

文件位置：`app/api/xxx/route.ts`，导出 HTTP 方法函数。

### 登录 — POST /api/login

```ts
// app/api/login/route.ts
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });

  // 验证密码...
  const token = Buffer.from(JSON.stringify({ id, email, name, iat: Date.now() })).toString("base64");

  const response = NextResponse.json({ message: "登录成功", user });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24小时
  });
  return response;
}
```

### 用户 — /api/user

| 方法 | 路径 | 作用 |
|------|------|------|
| GET | `/api/user` | 获取用户列表 |
| POST | `/api/user` | 注册新用户 |
| GET | `/api/user/[id]` | 获取单个用户 |
| PUT | `/api/user/[id]` | 更新用户 |
| DELETE | `/api/user/[id]` | 删除用户 |

动态路由参数（Next.js 16）：

```ts
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

---

## Proxy 中间层（鉴权）

文件：`src/proxy.ts`（Next.js 16 中 middleware 的演进形式）

### 流程

```
请求进入 → proxy 检查 cookie token
  ├── 公开路径 → 放行
  └── 无 token → 重定向到 /?redirect=原路径
```

### 公开路径（无需登录）

- `/` — 登录页
- `/api/login` — 登录接口
- `POST /api/user` — 注册接口

### 核心代码

```ts
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath =
    pathname === "/" ||
    pathname.startsWith("/api/login") ||
    (pathname === "/api/user" && request.method === "POST");

  const token = request.cookies.get("token");

  if (!token && !isPublicPath) {
    const loginUrl = new URL("/", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|...).*)"],
};
```

### 登录后跳回

1. 未登录访问 `/about` → 重定向到 `/?redirect=/about`
2. 登录成功 → `router.push(redirectTo)` 跳回 `/about`

---

## Prisma + PostgreSQL

### schema.prisma

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

### Prisma 客户端（src/lib/prisma.ts）

```ts
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: pool });
export default prisma;
```

### 种子数据（prisma/seed.ts）

```bash
npx tsx prisma/seed.ts
# 或配置 package.json 的 prisma.seed 后：
npx prisma db seed
```

默认创建：`admin@qq.com` / `123456`

### PostgreSQL 表名注意

Prisma 创建的表名是 **大写带引号** 的 `"User"`、`"Post"`，不是小写 `user`。  
查表 SQL：

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

---

## 各页面功能说明

### `/` — 登录/注册（Client Component）

- 使用 `use-immer` 管理表单状态
- 登录 → `POST /api/login` → 写 cookie → 跳转
- 注册 → `POST /api/user` → 切换回登录模式
- `searchParams.redirect` 支持登录后跳回原页面
- `Suspense` 包裹使用 `use(searchParams)` 的子组件

### `/about` — 用户列表（Client Component）

- `useEffect` + `fetch("/api/user")` 拉取列表
- 删除用户 → `DELETE /api/user/[id]`
- 嵌套在 `about/layout.tsx` 布局中

### `/about/detail` — 详情页（Server Component）

- 引用公共组件 `Greeting`

### `/me` — 查询参数示例（Client Component）

- `useSearchParams().get("id")` 读取 `?id=5`
- 外层 `me/layout.tsx` 用 Suspense 包裹

### `/connection` — 动态渲染示例

- Server Component + `connection()` + `Math.random()`
- Client 子组件 `ClickButton` 处理点击

### `/dynamic/[[...id]]` — 路径动态路由

- `useParams()` 读取路径段

### `not-found.tsx` — 404

- 访问不存在的路由时显示

---

## 样式

- **Tailwind CSS v4**：`globals.css` 中 `@import "tailwindcss"`
- **Google Fonts**：`layout.tsx` 中 Geist / Geist_Mono
- **CSS 变量**：`:root` 定义 `--background`、`--foreground`，支持 dark mode

---

## 与 Nuxt 对照

| 概念 | Next.js | Nuxt |
|------|---------|------|
| 页面路由 | `app/**/page.tsx` | `pages/` 或 `app/` |
| 布局 | `layout.tsx` | `layout.vue` |
| API | `app/api/**/route.ts` | `server/api/` |
| 中间件 | `src/proxy.ts` | `middleware/` |
| 服务端组件 | Server Component | SSR / async setup |
| 客户端组件 | `"use client"` | 普通 Vue 组件 |
| 数据库 ORM | Prisma（自选） | Drizzle / Prisma（自选） |
| 环境变量 | `.env` | `.env` |
| 数据库迁移 | `prisma migrate dev` | `prisma migrate dev` / drizzle-kit |

---

## 常见问题

### Q: `prisma generate` 后数据库没有表？

`generate` 只生成代码，不建表。需要 `prisma migrate dev`。

### Q: 客户端看到 No tables found？

`.env` 的 `DATABASE_URL` 数据库名和客户端连接的数据库不一致。  
确保两边都是同一个库（如 `nextjs`）。

### Q: `"use client"` 里能用 connection() 吗？

不能。`connection()` 是 Server API，Client 组件里会报错。

### Q: async Client Component 报错？

Client Component 不能是 async。需要 async 就用 Server Component。

### Q: Math.random() hydration mismatch？

Client 组件里直接用随机数会导致服务端和客户端渲染不一致。  
用 Server Component + `connection()` 在请求时生成。

---

## 部署

```bash
pnpm build    # 构建
pnpm start    # 生产模式启动
```

也可部署到 Vercel（Next.js 官方平台），环境变量在平台配置 `DATABASE_URL`。

---

## 依赖清单

```json
{
  "next": "16.2.10",
  "react": "19.2.4",
  "prisma": "^7.8.0",
  "@prisma/client": "^7.8.0",
  "@prisma/adapter-pg": "^7.8.0",
  "pg": "^8.22.0",
  "use-immer": "^0.11.0",
  "tailwindcss": "^4"
}
```
