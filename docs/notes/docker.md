# Docker

## 查看运行的镜像

docker ps

## 多包情况

```bash
FROM node:22-bookworm-slim AS base
WORKDIR /workspace
RUN npm install --global pnpm@10.30.3 --registry=https://registry.npmjs.org

FROM base AS build
COPY . .
RUN pnpm install --frozen-lockfile --registry=https://registry.npmjs.org
RUN pnpm build

FROM build AS api-package
RUN pnpm --filter @welcome/api deploy --prod /out/api

FROM node:22-bookworm-slim AS api
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002
COPY --from=api-package --chown=node:node /out/api/ ./
USER node
CMD ["node", "dist/server.js"]

FROM scratch AS web
COPY --from=build /workspace/apps/web/dist/ /


```

- WORKDIR /workspace
- 创建文件夹为workspace 并在当前文件夹下下载全局pnpm

- 随后使用上一层base作为 build 并把项目copy过来，严格执行pnpm的lock文件，开始build

- 上述build 会执行前端、后端、和shared

- 第三步，将build作为api-package的基准，随后挑选 @welcome/api 将其放入/out/api中

- 第四步，拿新的镜像作为api，创建app文件夹， 并且将权限设置为node  把文件拿到api下
  使用node 命令执行server.js


- 第五步拿一个空的镜像

直接放静态文件就行了， 因为我们nginx.conf，放在阿里云内置的nginx就行，只限于小项目。


如果需要进行集群部署，这种情况就不行了

```json
{
  "name": "welcome-demo",
  "private": true,
  "version": "1.0.0",
  "packageManager": "pnpm@10.30.3",
  "scripts": {
    "build": "pnpm -r build",
    "typecheck": "pnpm -r typecheck",
    "dev:web": "pnpm --filter @welcome/shared build && pnpm --filter @welcome/web dev",
    "dev:api": "pnpm --filter @welcome/shared build && pnpm --filter @welcome/api dev"
  },
  "devDependencies": {
    "typescript": "5.9.3"
  }
}
```

build: -r 的含义是所有位于pnpm-workspace下的项目都要运行build

dev:web: 挑选 @welcome/shared项目进行build 并且web运行dev
