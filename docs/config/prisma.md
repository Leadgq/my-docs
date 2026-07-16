# prisma

## 安装 prisma

```bash
npm install prisma --save-dev
npm install dotenv
npm install @prisma/adapter-pg
npm install @prisma/client
```

## 依赖展示

```json
  "dependencies": {
    "@prisma/adapter-pg": "^7.3.0",
    "@prisma/client": "^7.3.0",
    "@types/node": "^25.0.10",
    "prisma": "^7.3.0"
  },
  "devDependencies": {
    "dotenv": "^17.2.3"
  }
```

## 初始化 prisma

```bash
npx prisma init
```

在 schema.prisma 中进行对表的定义

```ts
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
  moduleFormat = "cjs" // 模块格式必须，否则报错
}

datasource db {
  provider = "postgresql"
}

model user {
  id        String   @id @default(cuid())
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
  userId    String
  user      user     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
}


@relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
它的意思是当用户被删除时，所有关联的帖子也会被删除。
```

## 链接数据库

### 在.env 文件中配置数据库连接

```ts

DATABASE_URL = "postgresql://postgres:123456@localhost:5432/test";

含义: 配置数据库连接字符串, 用于连接到 PostgreSQL 数据库。
用户名：postgres
密码：123456
主机：localhost
端口：5432
数据库名：test
```

## 创建迁移文件

```bash
npx prisma migrate dev --name
含义: 创建一个迁移文件, 用于初始化数据库 schema。
```

## 生成 prisma 客户端

```bash
npx prisma generate
```

## 使用

```ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 连接数据库
  await prisma.$connect();

  // 创建用户
  await prisma.user.create({
    data: {
      email: "@qq.com",
      password: "123456",
      posts: {
        create: {
          title: "第一篇文章",
          content: "这是第一篇文章的内容",
        },
      },
    },
  });

  // 查询用户 并包含关联的帖子
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });

  // 更新用户
  const updateUser = await prisma.user.update({
    where: {
      id: "cmktmvb470000xougod9rr0rn",
    },
    data: {
      email: "newss@qq.com",
    },
    include: {
      posts: true,
    },
  });

  // 删除用户
  const deletePost = await prisma.user.delete({
    where: {
      id: "cmktmvb470000xougod9rr0rn",
    },
  });

  const where = {
    email: {
      contains: "test",
    },
  };
  // 查询用户
  const users = await prisma.user.findMany({
    where: where,
  });
  //   console.log(users);

  // 实务==> 满足所谓的一致性
  //   prisma.$transaction(async (tx) => {
  //     // 比如说 A 转账给 B
  //     // 1. 从 A 中减去金额
  //     // 2. 向 B 中加上金额
  //     // 你要么都成功，要么都失败
  //     console.log("转账开始",tx);
  //   });

  // 分页
  const page = 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  // 查询用户 分页
  const usersPage = await prisma.user.findMany({
    skip,
    take: pageSize,
    orderBy: {
      email: "desc",
    },
  });
  console.log(usersPage);

  prisma.$disconnect();
}

main();

```
