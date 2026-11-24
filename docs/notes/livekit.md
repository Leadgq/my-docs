# LiveKit 服务器配置与 SSH 连接

适用于本次个人学习环境。配置采用开发模式，通过 SSH 隧道访问 LiveKit。

## 1. 服务器信息

| 项目 | 配置 |
| --- | --- |
| 云服务 | 阿里云 ECS |
| 公网 IP | `8.153.182.126` |
| 系统 | Ubuntu 22.04 64 位 |
| 规格 | 2 核 / 2GiB，40GiB 系统盘，3Mbps 带宽 |
| LiveKit | `v1.13.11` |
| 登录用户 | `root` |

在 ECS 控制台点击「远程连接」，使用 Workbench 免密登录。以下标注“服务器”的命令都在 Workbench 中执行。

## 2. 检查 Docker

服务器执行。

```bash
sudo docker --version
sudo docker compose version
```

本次 Docker 和 Compose 已安装。

## 3. 安全组

ECS → 网络与安全组 → 添加入方向规则。

| 策略 | 协议 | 目的端口 | 访问来源 |
| --- | --- | --- | --- |
| 允许 | TCP | `22/22` | 建议填写自己电脑的公网 IP `/32` |
| 允许 | TCP | `7881/7881` | `0.0.0.0/0` |
| 允许 | UDP | `7882/7882` | `0.0.0.0/0` |

22 用于 SSH，7881 和 7882 用于音视频。7880 通过 SSH 隧道访问。本次系统防火墙 `sudo ufw status` 显示 `inactive`。

## 4. 部署 LiveKit

服务器执行，创建配置文件。

```bash
sudo mkdir -p /opt/livekit
sudo tee /opt/livekit/livekit.yaml > /dev/null <<'EOF'
port: 7880

rtc:
  tcp_port: 7881
  udp_port: 7882
  use_external_ip: false
  node_ip: 8.153.182.126
EOF
```

下载固定版本并启动。

```bash
sudo docker pull livekit/livekit-server:v1.13.11
sudo docker run -d \
  --name livekit \
  --restart unless-stopped \
  -p 127.0.0.1:7880:7880/tcp \
  -p 7881:7881/tcp \
  -p 7882:7882/udp \
  -v /opt/livekit/livekit.yaml:/etc/livekit.yaml:ro \
  livekit/livekit-server:v1.13.11 \
  --dev \
  --bind 0.0.0.0 \
  --config /etc/livekit.yaml
```

如果已有本次创建的 `livekit` 测试容器，需要重新创建时，先执行 `sudo docker rm -f livekit`，再运行启动命令。此操作会中断正在进行的通话。

检查日志。

```bash
sudo docker logs --tail 30 livekit
```

确认版本为 `1.13.11`、公网地址正确、TCP 为 7881、UDP 为 7882。

## 5. 配置 SSH 密钥

在自己 Windows 电脑的 PowerShell 执行。本次已生成并配置过的密钥可以继续使用。

```powershell
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\livekit_learning" -C "livekit-learning"
Get-Content "$env:USERPROFILE\.ssh\livekit_learning.pub"
```

生成时可设置密钥口令。遇到同名文件已存在时保留原文件。复制 `.pub` 文件输出的完整公钥。

在服务器 Workbench 执行，将占位内容替换为自己的完整公钥。

```bash
mkdir -p /root/.ssh
chmod 700 /root/.ssh
printf '%s\n' '这里替换为完整公钥' >> /root/.ssh/authorized_keys
chmod 600 /root/.ssh/authorized_keys
```

无 `.pub` 后缀的文件是私钥，保存在自己电脑上。

## 6. 建立 SSH 隧道

在电脑 PowerShell 执行。

```powershell
ssh -i "$env:USERPROFILE\.ssh\livekit_learning" -N -L 127.0.0.1:7880:127.0.0.1:7880 root@8.153.182.126
```

首次连接时核对目标服务器，并确认主机指纹。设置过密钥口令的，输入密钥口令。连接后窗口保持等待属于正常现象，使用期间保持窗口打开。按 `Ctrl+C` 可断开隧道。

浏览器打开 `http://localhost:7880`，显示 `OK` 表示 HTTP 服务和隧道可达。它只验证这部分连接，通话还需要 Token 和 WebRTC 连接成功。

## 7. 测试与常见问题

- 测试页面为 <https://meet.livekit.io>，Custom 中填写 `ws://localhost:7880` 和有效 Token。
- 开发模式使用 `devkey` / `secret`。正式开发时更换密钥，由业务后端验证权限并签发 Token。
- `Permission denied (publickey)` 表示需要检查 SSH 私钥路径及服务器上的公钥，单独修改 root 密码无法解决密钥登录问题。
- `401 / invalid authorization token` 时检查 Token 是否完整、有效。之前生成的测试 Token 有效期为 1 小时。
- `could not establish pc connection` 时检查媒体端口和代理。本次关闭 Clash TUN 后连接成功。
- `Could not start video source` 表示摄像头启动失败，可先关闭摄像头测试连接。
- 本次 `latest` 镜像得到旧版 0.14.2，因此使用已验证的固定版本 `v1.13.11`。

常用排查命令。

```bash
# 服务器查看容器及近期日志
sudo docker ps
sudo docker logs --since 5m --tail 100 livekit
```

```powershell
# 电脑检查 TCP 媒体端口
Test-NetConnection 8.153.182.126 -Port 7881
```

## 参考

- [LiveKit 官方部署说明](https://docs.livekit.io/transport/self-hosting/deployment/)
- [LiveKit 端口说明](https://docs.livekit.io/transport/self-hosting/ports-firewall/)
