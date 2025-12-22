# Geek Photowall - 极客风格摄影师网站

一个具有极客风格的摄影师作品集网站，支持照片上传、批量导入、数据可视化和技术分析。

## 🎨 特色功能

- **🖥️ 黑客风格界面** - 暗色主题配合绿色和品红色点缀
- **📸 照片管理** - 支持单文件上传和批量导入
- **📊 数据仪表板** - 实时统计和可视化分析
- **🔬 技术分析** - EXIF数据、直方图、色彩分析
- **💾 数据流可视化** - 动态背景效果

## 🚀 快速启动

### 前置要求

- Node.js (v14+)
- npm

### 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client
npm install
cd ..
```

### 启动应用

#### 方法一：使用批处理文件（推荐）

```bash
# Windows用户
start.bat
```

#### 方法二：手动启动

```bash
# 启动服务器（自动构建前端）
node server.js
```

### 访问应用

- 主页面：http://localhost:5000
- API端口：3000（内部使用）

## 📁 项目结构

```
├── client/                 # React前端
│   ├── src/
│   │   ├── components/     # 组件文件
│   │   └── simple-app.js   # 主应用
│   └── build/             # 构建输出
├── uploads/               # 上传文件目录
│   ├── photos/           # 原始照片
│   └── thumbnails/       # 缩略图
├── server.js             # Express服务器
├── package.json          # 后端依赖
└── README.md            # 项目说明
```

## 🎯 功能说明

### 作品展示
- 网格布局展示所有照片
- 支持刷新和实时更新
- 显示照片基本信息

### 照片上传
- 支持拖拽上传
- 终端模式/普通模式切换
- 实时进度显示
- 自动生成缩略图

### 数据仪表板
- 照片统计信息
- 文件格式分布
- 尺寸分析图表
- 最近上传记录

### 技术分析
- EXIF数据解析
- RGB直方图
- 色彩分析
- 文件元数据

## ⚙️ 配置说明

- 照片存储路径：`uploads/photos/`
- 缩略图路径：`uploads/thumbnails/`
- 最大文件大小：10MB
- 支持格式：JPG、PNG、GIF、WebP

## 🔧 开发模式

```bash
# 开发模式启动前端
cd client
npm start

# 生产模式构建
npm run build
```

## 📝 技术栈

- **后端**: Node.js + Express
- **前端**: React + CSS
- **图像处理**: Sharp
- **文件上传**: Multer

## 🌐 部署

应用已配置为生产模式，前端构建文件自动由Express服务。

## 📄 许可证

MIT License