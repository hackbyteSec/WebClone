# WebClone - 在线扒站工具

> 🚀 轻量级在线网站源码下载工具，基于 Python Flask + WebSocket 实现

[![Python Version](https://img.shields.io/badge/python-3.9%2B-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-2.3%2B-green.svg)](https://flask.palletsprojects.com/)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

## 📖 项目简介

WebClone 是由 [黑客字节 HackByte.io](https://hackbyte.io) 开发的免费在线扒站工具。无需安装任何软件，只需粘贴网址即可快速获取网站完整源码，自动打包 HTML、CSS、JS、图片等所有静态资源。

🌐 **在线体验**：[wget.hackbyte.io](https://wget.hackbyte.io)

## ✨ 上面有个A开头的压缩包，更新了一些东西，直接下载，上传到根目录运行即可，或者使用宝塔面板的用户，可以在宝塔网站管理、python项目中创建这个项目，基本上一分钟之内可以部署完成，如果有不会的用户可以在社区进行交流。

- 🎯 **一键下载** - 输入网址即可获取完整网站源码
- 📦 **自动打包** - 自动识别并下载 HTML/CSS/JS/图片等资源
- ⚡ **多线程加速** - 支持并发下载，提升抓取速度
- 🔄 **实时反馈** - WebSocket 实时显示下载进度和日志
- 🎨 **Canvas 支持** - 自动识别 Canvas 动画资源
- 🛡️ **安全防护** - 内置请求频率限制，防止滥用
- 🐳 **Docker 部署** - 提供 Dockerfile，一键容器化部署
- 📱 **响应式设计** - 适配桌面端和移动端

## 🎬 功能演示

1. **输入网址** - 粘贴目标网站URL
2. **实时进度** - 查看下载进度和文件数量
3. **一键打包** - 自动生成 ZIP 压缩包下载

## 🚀 快速开始

### 方式一：直接运行

```bash
# 克隆项目
git clone https://github.com/你的用户名/webclone.git
cd webclone

# 安装依赖
pip install -r requirements.txt

# 启动服务
python app.py
```

访问 `http://localhost:8000`

### 方式二：Docker 部署

```bash
# 构建镜像
docker build -t webclone:latest .

# 运行容器
docker run -d -p 8000:8000 --name webclone webclone:latest
```

### 方式三：生产环境（Gunicorn）

```bash
# 安装 Gunicorn 和 Eventlet
pip install gunicorn eventlet

# 启动服务
gunicorn -k eventlet -w 1 -b 0.0.0.0:8000 app:app
```

## 📋 环境要求

- Python 3.9+
- Flask 2.3+
- BeautifulSoup4 4.12+
- Flask-SocketIO 5.3+

## 🛠️ 技术栈

- **后端框架**：Flask
- **WebSocket**：Flask-SocketIO
- **HTML解析**：BeautifulSoup4
- **并发处理**：ThreadPoolExecutor
- **HTTP请求**：urllib（Python内置）

## 📂 项目结构

```
webclone/
├── app.py              # 主程序入口
├── cleanup.py          # 清理脚本
├── dedupe.html         # 数据去重工具页面
├── templates/
│   └── index.html      # 主页面模板
├── static/
│   ├── css/
│   │   └── style.css   # 样式文件
│   └── js/
│       └── main.js     # 前端交互逻辑
├── downloads/          # 下载文件存储目录
├── requirements.txt    # Python依赖
├── Dockerfile          # Docker构建文件
└── README.md           # 项目说明
```

## ⚙️ 配置说明

### 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | `8000` | 服务监听端口 |
| `DEBUG` | `false` | 是否开启调试模式 |
| `SECRET_KEY` | 自动生成 | Flask 密钥 |

### 修改端口

```bash
# 方式1: 环境变量
PORT=9000 python app.py

# 方式2: 修改 app.py
port = int(os.environ.get('PORT', 8000))  # 改为你想要的端口
```

## 🎨 额外工具

### 数据去重工具

项目还包含一个数据去重工具页面 `dedupe.html`，支持：

- ✅ 上传 TXT/CSV/XLSX 文件
- ✅ 运营商分类（移动/联通/电信）
- ✅ 自定义去重字段
- ✅ 导出处理结果

## 🔒 安全特性

- 请求频率限制（60次/分钟）
- 防止内网 IP 访问
- 单个网站最大资源数限制（5000个）
- 文件大小限制（200MB）
- 请求超时控制（20秒）

## 📝 使用限制

- 仅支持 HTTP/HTTPS 协议
- 不支持需要登录的网站
- 不支持动态渲染的 SPA 应用
- 仅用于学习和研究，请遵守目标网站的 robots.txt

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目采用 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

## 🌟 关于我们

**黑客字节 HackByte.io** - 专注于技术分享与工具开发的社区平台

- 🌐 官网：[hackbyte.io](https://hackbyte.io)
- 🔧 在线工具：[hackbyte.io/tools](https://hackbyte.io/tools)
- 💬 社区交流：[hackbyte.io](https://hackbyte.io)

## ⭐ Star History

如果这个项目对你有帮助，请给我们一个 Star ⭐️

## 📮 联系我们

- 官网：[hackbyte.io](https://hackbyte.io)
- 在线扒站工具：[wget.hackbyte.io](https://wget.hackbyte.io)

---

<p align="center">Made with ❤️ by <a href="https://hackbyte.io">HackByte.io</a></p>

