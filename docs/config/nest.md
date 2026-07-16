# nest

## 什么是 nest.js

Nest.js 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它基于 TypeScript 并结合了 Angular 的架构模式，提供了一种结构化的方式来开发应用程序。

## 鉴权

```bash
 pnpm install @nestjs/jwt
```

```ts
import { JwtModule } from "@nestjs/jwt";
import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
  providers: [],
  exports: [JwtModule, ConfigModule],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("SECRET_KEY"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
})
export class SharedModule {}
```

## 创建 token

```ts
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SharedModule } from "@libs/shared";

@Module({
  imports: [SharedModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

```ts
AuthService 实现生成token;
import { Token, TokenPayload, RefreshToken } from "@en/common/user";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateToken(payload: TokenPayload): Token {
    return {
      accessToken: this.jwtService.sign<RefreshToken>({
        ...payload,
        tokenType: "access",
      }),
      refreshToken: this.jwtService.sign<RefreshToken>(
        {
          ...payload,
          tokenType: "refresh",
        },
        {
          expiresIn: "7d",
        },
      ),
    };
  }
}
```

## 路由守卫

```bash
 创建一个守卫模块
 nest g guard auth
```

```ts
这是全局守卫;
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { RefreshToken } from "@en/common/user";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (!headers.authorization) {
      throw new UnauthorizedException("别偷了哥,买点东西吧");
    }
    const token = headers.authorization.split(" ")[1];
    try {
      const payload = this.jwtService.verify<RefreshToken>(token);
      if (payload.tokenType !== "access") {
        throw new UnauthorizedException("token类型错误");
      }
      request.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException("token 失效了");
    }
  }
}
```

## 局部守卫

```ts
在app.module.ts 中引入守卫模块;
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

```

```ts
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma-util/prisma-util.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("SECRET_KEY")!,
    });
  }

  async validate({ userId }) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
```

```ts
import { Controller, Post, Body, Req, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/auto-register.dot";
import { LoginDto } from "./dto/auth-login.dot";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get("all")
  @UseGuards(AuthGuard("jwt"))
  getAll(@Req() req: Request) {
    return this.authService.getAll();
  }
}
```

## 前端配合

```ts
import axios from "axios";
import type { Token } from "@en/common/user";
import type { Response } from "../index.ts";

const refreshServer = axios.create({
  baseURL: "/api/v1",
  timeout: 50000,
});

refreshServer.interceptors.response.use(
  (config) => {
    return config.data;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const refreshTokenApi = (data: Omit<Token, "accessToken">) => {
  return refreshServer.post("/user/refresh-token", data) as Promise<
    Response<Token>
  >;
};
```

```ts
export const serverApi = axios.create({
  baseURL: "/api/v1",
  timeout: TIMEOUT,
});

// 创建锁
let isRefreshing = false;
// 创建失败的队列
let requestQueue: ((newAccessToken: string) => void)[] = [];
// 请求拦截
serverApi.interceptors.request.use((config) => {
  const user = userStore();
  if (user.getAccessToken) {
    config.headers.Authorization = `Bearer ${user.getAccessToken}`;
  }
  return config;
});

// 响应拦截
serverApi.interceptors.response.use(
  (config) => {
    return config.data;
  },
  async (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    } else {
      const user = userStore();
      const accessToken = user.getAccessToken;
      const refreshToken = user.getRefreshToken;
      const originalRequest = error.config;
      if (!accessToken || !refreshToken) {
        ElMessage.error("没有任何token,无法刷新，请重新登录  ");
        user.loginOut();
        router.replace("/");
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise((resolve) => {
          // 加入队列
          requestQueue.push((newAccessToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(serverApi(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const newToken = await refreshTokenApi({ refreshToken });
        if (newToken.success) {
          user.updateToken(newToken.data);
        } else {
          user.loginOut();
          router.replace("/");
          return Promise.reject(error);
        }
        requestQueue.forEach((callback) => callback(newToken.data.accessToken));
        return serverApi(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        requestQueue = [];
        isRefreshing = false;
      }
    }
  },
);
```

## 表单验证

```bash
 pnpm add class-validator class-transformer
```

### dto

```ts
import { IsNotEmpty } from "class-validator";

// 这是dto
export class LoginDto {
  @IsNotEmpty({ message: "用户名不能为空" })
  username: string;

  @IsNotEmpty({ message: "密码不能为空" })
  password: string;
}

 // 这是controller的代码
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  在去main.ts中写全局过滤器

   app.useGlobalPipes(
    new ValidationPipe(),
  );

```

### 验证数据唯一性

```ts
import { PrismaService } from "../prisma-util/prisma-util.service";

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

// 表单字段是否唯一
export function isNotExistsRule(
  table: string,
  validationOptions: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: "isNotExistsRule",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: async (value: any, args: ValidationArguments) => {
          const prismaService = new PrismaService();
          const res = await prismaService[table].findFirst({
            where: {
              [args.property]: value,
            },
          });
          return !Boolean(res);
        },
      },
    });
  };
}
```

## minio

```bash
 pnpm add  minio
 pnpm add  @types/multer -D
```

### 安装 MinIO

打开网址：`https://minio.org.cn/download.shtml#/windows`

1. 下载 server -> minio.exe
2. 下载 client -> mc.exe

两个都要下载，下载完成之后放入文件夹即可,在文件夹里面新建两个文件名字可以随便取，我这儿叫`minio-data` `minio-data2`。进行集群存储，方便数据备份。

windows CMD 命令行启动

新建一个文件`start.cmd`

```cmd
set MINIO_ROOT_USER=admin
set MINIO_ROOT_PASSWORD=12345678
minio.exe server .\minio-data .\minio-data2 --console-address ":9001"
```

### 密钥生成

```bash
前置 mc alias set myminio http://localhost:9000 admin 12345678
mc admin user svcacct add myminio admin
```

### 删除 Bucket

```
mc rb --force myminio/avatar
```

### 使用密钥

```json

# minio access秘钥
MINIO_ACCESS_KEY="OZ0Q833E5RPMFALGKKXT"
# minio secret秘钥
MINIO_SECRET_KEY="deW1+xXBiCI6ep6BvUpUJQxfxbJjhCLoWiPPBgWd"
# minio 地址
MINIO_URL="192.168.101.32"
# minio 端口
MINIO_PORT=9000
# 是否使用SSL
MINIO_USE_SSL=0
# minio 桶名
MINIO_BUCKET="avatar"

```

```ts
//  自己创建service和module
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";
@Injectable()
export class MinioService implements OnModuleInit {
  private readonly minioClient: Minio.Client;
  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get("MINIO_URL")!,
      port: this.configService.get("MINIO_PORT"),
      useSSL: !!Number(this.configService.get("MINIO_USE_SSL")),
      accessKey: this.configService.get("MINIO_ACCESS_KEY"),
      secretKey: this.configService.get("MINIO_SECRET_KEY"),
    });
  }

  async onModuleInit() {
    // 读取桶命
    const bucket = this.getBucket();
    // 是否存在
    const bucketExists = await this.minioClient.bucketExists(bucket);
    if (!bucketExists) {
      // 创建桶
      await this.minioClient.makeBucket(bucket);
      // 设置桶策略
      await this.minioClient.setBucketPolicy(
        bucket,
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "PublicReadObjects", //给这个规则起一个名字
              Effect: "Allow", //允许打开这个规则 Allow 允许 Deny 拒绝
              Principal: "*", //所有人
              Action: ["s3:GetObject"], //允许浏览器获取对象
              Resource: ["arn:aws:s3:::avatar/*"], //允许读取 avatar桶内的所有资源
            },
          ],
        }),
      );
    }
  }

  getClient() {
    return this.minioClient;
  }

  getBucket() {
    return this.configService.get("MINIO_BUCKET")!;
  }
}
```

## ai

### 安装包下载

```bash
 pnpm add  @langchain/core  @langchain/deepseek @langchain/langgraph @langchain/langgraph-checkpoint-postgres langchain
```

## 初始化

```ts
// 初始化deepSeek模型
import { ChatDeepSeek } from "@langchain/deepseek";
import { ConfigService } from "@nestjs/config";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
export const createDeepSeek = () => {
  const configService = new ConfigService();
  const apiKey = configService.get("DEEPSEEK_API_KEY");
  const model = configService.get("DEEPSEEK_API_MODEL");
  return ChatDeepSeek({
    apiKey,
    model,
    maxTokens: 4399,
    streaming: true, // 开启流式输出
  });
};

// 初始化存储
export const createCheckPoint = async () => {
  const configService = new ConfigService();
  const dbUrl = configService.get("POSTGRES_URL");
  const checkpointer = PostgresSaver.fromConnString(dbUrl);
  await checkpointer.setup();
  return checkpointer;
};
```

### 在服务中使用

```ts
export const chatMode = [
  {
    role: "normal", //角色
    prompt:
      "你是一个智能助手，这是一个学英语的对话，根据用户的对话内容，给出相应的回答(使用简单易懂的表达)，请用中文回答",
    label: "💬 智能助手", //标签
    id: "1", //id
  },
  {
    role: "master",
    prompt:
      "你是一个英语大师，这是一个英语学习的对话，根据用户的对话内容，给出相应的回答(使用专业术语)，请用英文回答",
    label: "🎓 英语大师",
    id: "2",
  },
  {
    role: "business",
    prompt:
      "你是一个商务英语专家，这是一个商务英语的对话，根据用户的对话内容，给出相应的回答(使用商务英语专业术语)，请用中文回答",
    label: "💼 商务英语",
    id: "3",
  },
] as const;
```

```ts
// chatMode 这个是模型列表
import { chatMode } from "./../prompt/prompt.model";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { createDeepSeek, createCheckpoint } from "../llm/llm.config";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import type { ChatDto, ChatRoleType } from "@en/common/chat";
import type { AIMessageChunk, ReactAgent } from "langchain";
import { createAgent } from "langchain";
import { ResponseService } from "@libs/shared";
@Injectable()
export class ChatService implements OnModuleInit {
  private checkpointer: PostgresSaver;
  private agents: Map<ChatRoleType, ReactAgent> = new Map();
  constructor(private readonly responseService: ResponseService) {}

  async onModuleInit() {
    // 初始话
    this.checkpointer = await createCheckpoint();
    //初始化多个agent
    for (const mode of chatMode) {
      const agent = createAgent({
        model: createDeepSeek(),
        systemPrompt: mode.prompt,
        checkpointer: this.checkpointer,
      });
      this.agents.set(mode.role, agent);
    }
  }

  streamCompletion(createChatDto: ChatDto) {
    const agent = this.agents.get(createChatDto.role);
    if (!agent) {
      throw new Error(`Agent for role ${createChatDto.role} not found`);
    }
    const threadId = `${createChatDto.userId}-${createChatDto.role}`;
    const stream = agent.stream(
      {
        messages: [{ role: "human", content: createChatDto.content }],
      },
      {
        configurable: {
          thread_id: threadId,
        },
        streamMode: "messages",
      },
    );
    return stream; // 这是个迭代器，需要在controller中处理
  }

  // 获取历史记录
  async getHistory(userId: string, role: ChatRoleType) {
    const messages = await this.checkpointer.get({
      configurable: { thread_id: `${userId}-${role}` },
    });
    const list = messages?.channel_values?.messages as AIMessageChunk[];
    if (!list) return this.responseService.success([]);
    return this.responseService.success(
      list.map((item) => ({
        content: item.content,
        role: item.type,
      })),
    );
  }
}
```

### 在控制层

```ts
import { Controller, Get, Post, Body, Res, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import type { ChatDto, ChatRoleType } from '@en/common/chat';
import type { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() createChatDto: ChatDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream'); // 流式传输的MIME类型
    res.setHeader('Cache-Control', 'no-cache'); // 禁用缓存
    res.setHeader('Connection', 'keep-alive'); // 保持连接
    const stream = await this.chatService.streamCompletion(createChatDto);
    for await (const chunk of stream) {
      const [msg] = chunk;
      res.write(
        `data: ${JSON.stringify({ content: msg.content, role: 'ai' })}\n\n`,
      );
    }
    res.end();
  }

  @Get('history')
  getHistory(@Query('userId') userId: string, @Query('role') role: ChatRoleType) {
    return this.chatService.getHistory(userId, role);
  }
```

### 前端配合

```ts
function sendMessage(message: string, deepThink: boolean, webSearch: boolean) {
    loading.value = true
    list.value.push({
        role: "human",
        content: message,
        type: "chat",
    })
    list.value.push({
        role: "ai",
        content: "",
        reasoning: '',
        type: "chat",
    })
    sse<ChatMessage, ChatDto>(CHAT_URL, "POST", {
        role: active.value,
        content: message,
        userId: userInstance.user!.id,
        deepThink,
        webSearch,
    }, (data) => {
        const last = list.value[list.value.length - 1]
        if (last) {
            if (data.type === 'reasoning') {
                last.reasoning += data.content
            } else if (data.type === 'chat') {
                last.content += data.content
            }
        }
        loading.value = false
    }, () => {
        loading.value = false
    })
}
```

```ts
import type { Method } from "axios";
export const CHAT_URL = "/ai/v1/chat";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export const sse = <T, V>(
  url: string,
  method: Method,
  body: V,
  callback?: (data: T) => void,
  errorCallback?: (error: Error) => void,
) => {
  fetchEventSource(url, {
    method: method.toLocaleLowerCase(),
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    onmessage: (event) => {
      callback?.(JSON.parse(event.data) as T);
    },
    onerror: (error) => {
      errorCallback?.(error);
    },
  });
};
```

### 深度思考

```ts
export const createDeepSeekReasoner = () => {
  const configService = new ConfigService();
  const apiKey = configService.get("DEEPSEEK_API_KEY");
  // 将模型更换
  //DEEPSEEK_REASONER_API_MODEL="deepseek-reasoner"
  const model = configService.get("DEEPSEEK_REASONER_API_MODEL");
  return new ChatDeepSeek({
    apiKey,
    model,
    temperature: 1.3,
    maxTokens: 18000,
    streaming: true, // 开启流式输出
  });
};
```

### 联网

```ts

## 博查服务地址
BOCHA_SEARCH_URL="https://api.bochaai.com/v1/web-search"
## 博查api key
BOCHA_API_KEY="sk-abce35bd3d5141c9804adbd27c674aba"

export const createBoChaSearch = async (query: string, count: number = 10) => {
  const configService = new ConfigService();
  const boChaUrl = configService.get('BOCHA_SEARCH_URL')!;
  const result = await fetch(boChaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${configService.get('BOCHA_API_KEY')}`,
    },
    body: JSON.stringify({
      query,
      count,
      summary: true, // 是否返回长文本摘要
      freshness: 'noLimit', // 是否返回结果 freshness 字段
    }),
  });
  const { data } = await result.json();
  const values = data.webPages.value;
  const prompt = values.map((item) => (
    `
    标题: ${item.name}
    链接: ${item.url}
    摘要: ${item?.summary?.replace(/\n/g, '') ?? ''}
    网站名称: ${item.siteName}
    网站logo: ${item.siteIcon}
    发布时间: ${item.dateLastCrawled}
    `
  )).join('\n');
  return prompt;
};

```

### 使用深度思考和联网之后服务代码的更改

```ts
import { chatMode } from './../prompt/prompt.model';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createDeepSeek,
  createCheckpoint,
  createBoChaSearch,
  createDeepSeekReasoner,
} from '../llm/llm.config';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import type { ChatDto, ChatRoleType } from '@en/common/chat';
import type { AIMessageChunk, ReactAgent } from 'langchain';
import { createAgent } from 'langchain';
import { ResponseService } from '@libs/shared';
@Injectable()
export class ChatService implements OnModuleInit {
  private checkpointer: PostgresSaver;
  constructor(private readonly responseService: ResponseService) {}

  async onModuleInit() {
    // 初始话
    this.checkpointer = await createCheckpoint();
  }

  async streamCompletion(createChatDto: ChatDto) {
    let prompt = chatMode.find(
      (item) => item.role === createChatDto.role,
    )?.prompt;
    if (!prompt) {
      throw new Error(`Prompt for role ${createChatDto.role} not found`);
    }
    if (createChatDto.webSearch) {
      const webSearchPrompt = await createBoChaSearch(createChatDto.content);
      prompt += `请根据以下搜索结果回答问题：${webSearchPrompt}(并且返回你参考的网站名称)，用户问题：${createChatDto.content}`;
    }
    let model = createDeepSeek();
    if (createChatDto.deepThink) {
      model = createDeepSeekReasoner();
    }
    const agent = createAgent({
      model,
      systemPrompt: prompt,
      checkpointer: this.checkpointer,
    });
    const threadId = `${createChatDto.userId}-${createChatDto.role}`;
    const stream = agent.stream(
      {
        messages: [{ role: 'human', content: createChatDto.content }],
      },
      {
        configurable: {
          thread_id: threadId,
        },
        streamMode: 'messages',
      },
    );
    return stream;
  }

  async getHistory(userId: string, role: ChatRoleType) {
    const messages = await this.checkpointer.get({
      configurable: { thread_id: `${userId}-${role}` },
    });
    const list = messages?.channel_values?.messages as AIMessageChunk[];
    if (!list) return this.responseService.success([]);
    return this.responseService.success(
      list.map((item) => ({
        content: item.content,
        role: item.type,
        reasoning: item.additional_kwargs?.reasoning_content,
      })),
    );
  }
}

```

### 更改之后控制层的修改

```ts

  @Post()
  async create(@Body() createChatDto: ChatDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream'); // 流式传输的MIME类型
    res.setHeader('Cache-Control', 'no-cache'); // 禁用缓存
    res.setHeader('Connection', 'keep-alive'); // 保持连接
    const stream = await this.chatService.streamCompletion(createChatDto);
    for await (const chunk of stream) {
      const [msg] = chunk;
      const thinkMsg = msg.additional_kwargs?.reasoning_content ?? '';
      if (thinkMsg) {
        res.write(
          `data: ${JSON.stringify({ content: thinkMsg, role: 'ai', type: 'reasoning' })}\n\n`,
        );
      }
      const content = msg.content;
      if (content) {
        res.write(
          `data: ${JSON.stringify({ content: content, role: 'ai', type: 'chat' })}\n\n`,
        );
      }
    }
    res.end();
  }
```

## 支付相关

### 支付宝

```bash
 npm i  alipay-sdk nanoid
```

支付宝API文档：<a href="https://opendocs.alipay.com/open/59da99d0_alipay.trade.page.pay">https://opendocs.alipay.com/open/59da99d0\_alipay.trade.page.pay</a>

支付宝沙箱地址：<a href="https://open.alipay.com/develop/sandbox/app">https://open.alipay.com/develop/sandbox/app</a>

支付宝SDK-npm地址：<a href="https://www.npmjs.com/package/alipay-sdk">https://www.npmjs.com/package/alipay-sdk</a>

ngrok地址：<a href="https://www.ngrok.cc/">https://www.ngrok.cc/</a>

socket.io-client地址：<a href="https://www.npmjs.com/package/socket.io-client">https://www.npmjs.com/package/socket.io-client</a>

nanoid地址：<a href="https://www.npmjs.com/package/nanoid">https://www.npmjs.com/package/nanoid</a>

```bash
#支付宝appId
ALIPAY_APP_ID="XXXXXXXXX"
#支付宝沙箱网关地址
ALIPAY_GATEWAY="https://openapi-sandbox.dl.alipaydev.com/gateway.do"
#支付宝公钥
ALIPAY_PUBLIC_KEY="XXXXXX"
#支付宝应用私钥
ALIPAY_PRIVATE_KEY="XXXXXXX"
#支付宝异步回调地址
ALIPAY_NOTIFY_URL="http://xiaoman.vs4.tunnelfrp.com"
```

## 支付服务代码

```ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlipaySdk } from 'alipay-sdk';

@Injectable()
export class PayService implements OnModuleInit {
    public alipaySdk: AlipaySdk;
    constructor(private readonly configService: ConfigService) { }
    onModuleInit() {
        this.alipaySdk = new AlipaySdk({
            appId: this.configService.get<string>('ALIPAY_APP_ID')!,
            privateKey: this.configService.get<string>('ALIPAY_PRIVATE_KEY')!,
            alipayPublicKey: this.configService.get<string>('ALIPAY_PUBLIC_KEY')!,
            gateway: this.configService.get<string>('ALIPAY_GATEWAY')!,
        });
    }

    getAlipaySdk() {
        return this.alipaySdk;
    }
}
```

### 支付具体代码

```ts
  private createOutTradeNo() {
    const prefix = 'EN';
    return `${prefix}${nanoid.nanoid(12)}`;
  }

  async create(createPayDto: CreatePayDto, user: TokenPayload) {
    const courseRecord = await this.prisma.courseRecord.findFirst({
      where: {
        userId: user.userId,
        courseId: createPayDto.courseId,
      },
    });
    if (courseRecord) {
      return this.responseService.error(null, '课程已购买');
    }
    // 创建实务
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. create order
      const outTradeNo = this.createOutTradeNo();
      await tx.paymentRecord.create({
        data: {
          userId: user.userId,
          outTradeNo,
          amount: createPayDto.total_amount,
          subject: createPayDto.subject,
          body: createPayDto.body,
        },
      });
      // 2. create sdk
      const alipaySdk = this.sharedPayService.getAlipaySdk();
      const dateTime = dayjs().add(1, 'minute');
      const payUrl = alipaySdk.pageExecute('alipay.trade.page.pay', 'GET', {
        bizContent: {
          out_trade_no: outTradeNo,
          total_amount: createPayDto.total_amount,
          subject: createPayDto.subject,
          product_code: 'FAST_INSTANT_TRADE_PAY',
          time_expire: dateTime.format('YYYY-MM-DD HH:mm:ss'),
          body: JSON.stringify({
            courseId: createPayDto.courseId,
            userId: user.userId,
          }),
        },
        notify_url: `${this.configService.get<string>('ALIPAY_NOTIFY_URL')!}/api/v1/pay/notify`,
      });
      return {
        payUrl,
        // 时间戳
        timeExpire: dateTime.toDate().getTime(),
      };
    });
    return this.responseService.success(result);
  }


  async notify(req: Request) {
    const userInfo = JSON.parse(req.body.body) as {
      userId: string;
      courseId: string;
    };
    await this.prisma.$transaction(async (tx) => {
      // 更新支付记录
      const { trade_no, out_trade_no, gmt_payment } = req.body;
      const paymentRecord = await tx.paymentRecord.update({
        where: {
          //out_trade_no 这是自定义的
          outTradeNo: out_trade_no,
        },
        data: {
          // 支付宝的交易号
          tradeNo: trade_no,
          sendPayTime: dayjs(gmt_payment).toDate(),
          tradeStatus: TradeStatus.TRADE_SUCCESS,
        },
      });
      // 创建一条我的课程记录
      await tx.courseRecord.create({
        data: {
          userId: userInfo.userId,
          courseId: userInfo.courseId,
          isPurchased: true,
          paymentRecordId: paymentRecord.id,
        },
      });
      // 发送支付成功事件
      this.socketGateway.emitPaymentSuccess(userInfo.userId);
    });
    return true;
  }

```

### getWay

```ts
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      client.join(`user_${userId}`);
    }
  }
  emitPaymentSuccess(userId: string) {
    this.server.to(`user_${userId}`).emit('paymentSuccess', userId);
  }
}
```
