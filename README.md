# Bilibili图片分享平台

一个基于Vue3的图片分享平台，模仿Bilibili的界面设计，包含前端展示页面和管理后台。

## 功能特性

### 前端展示页面
- 🎨 仿Bilibili界面设计
- 📱 响应式布局，支持移动端
- 🔍 搜索功能
- 📂 分类筛选
- 🎠 轮播图展示
- 📊 图片统计信息（观看数、点赞数）
- ⚡ 流畅的动画效果

### 管理后台
- 🔐 管理员登录验证
- 📊 数据概览仪表板
- 🖼️ 图片管理（增删改查）
- 📂 分类管理
- 📱 响应式管理界面

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **路由**: Vue Router 4
- **状态管理**: Pinia
- **UI组件库**: Element Plus
- **HTTP客户端**: Axios
- **样式**: CSS3 + Flexbox + Grid

## 项目结构

```
bilibili/
├── public/
├── src/
│   ├── components/          # 公共组件
│   ├── views/              # 页面组件
│   │   ├── Home.vue        # 首页
│   │   ├── Admin.vue       # 管理后台
│   │   └── AdminLogin.vue  # 管理员登录
│   ├── router/             # 路由配置
│   ├── stores/             # Pinia状态管理
│   ├── App.vue             # 根组件
│   ├── main.js             # 入口文件
│   └── style.css           # 全局样式
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 安装和运行

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 构建生产版本
```bash
npm run build
```

### 4. 预览生产版本
```bash
npm run preview
```

## 使用说明

### 前端页面
- 访问 `http://localhost:3000` 查看主页
- 点击分类标签筛选不同类型的内容
- 使用搜索框搜索内容
- 点击图片卡片模拟播放功能

### 管理后台
- 访问 `http://localhost:3000/admin/login` 进入管理员登录页面
- 默认账号：`admin`，密码：`123456`
- 登录后可以管理图片和分类

### 主要功能

#### 数据概览
- 显示总图片数、总观看数、总点赞数、分类数量等统计信息

#### 图片管理
- 查看所有图片列表
- 添加新图片（标题、作者、分类、时长、缩略图）
- 编辑现有图片信息
- 删除图片

#### 分类管理
- 查看所有分类
- 添加新分类
- 删除分类

## 特色功能

1. **仿Bilibili设计**: 高度还原Bilibili的界面风格和交互体验
2. **响应式设计**: 完美适配桌面端和移动端
3. **现代化技术栈**: 使用最新的Vue3 Composition API和相关生态
4. **完整的管理系统**: 包含完整的后台管理功能
5. **优雅的动画**: 流畅的过渡动画和交互效果

## 开发说明

### 添加新功能
1. 在 `src/views/` 中添加新页面
2. 在 `src/router/index.js` 中配置路由
3. 在 `src/stores/` 中添加状态管理

### 自定义样式
- 全局样式在 `src/style.css`
- 组件样式使用scoped CSS
- 支持CSS变量和现代CSS特性

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 许可证

MIT License