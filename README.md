# Bilibili Demo - 仿B站视频平台

一个基于 Vue.js 前端和 NestJS 后端的仿B站视频平台演示项目。

## 🚀 项目特性

### 前端功能
- 🎨 现代化的 Vue.js 3 + Element Plus UI
- 🎠 轮播图展示
- 📱 响应式设计
- 🔐 管理员登录系统
- 📊 管理后台

### 后端功能
- 🛡️ NestJS 框架 + TypeScript
- 🗄️ TypeORM + MySQL/SQLite 数据库
- 🔑 JWT 身份验证
- 📁 文件上传功能
- 🎯 RESTful API 设计

## 📁 项目结构

```
bilibili-demo/
├── frontend/                 # Vue.js 前端
│   ├── src/
│   │   ├── views/           # 页面组件
│   │   ├── api/             # API 接口
│   │   ├── stores/          # 状态管理
│   │   └── router/          # 路由配置
│   └── package.json
├── backend/bilibili-backend/ # NestJS 后端
│   ├── src/
│   │   ├── auth/            # 身份验证模块
│   │   ├── banners/         # 轮播图模块
│   │   ├── categories/      # 分类模块
│   │   ├── images/          # 图片模块
│   │   ├── entities/        # 数据库实体
│   │   └── scripts/         # 初始化脚本
│   ├── DATABASE_INIT_GUIDE.md
│   ├── MYSQL_SETUP.md
│   └── package.json
└── README.md
```

## 🛠️ 技术栈

### 前端
- **Vue.js 3** - 渐进式 JavaScript 框架
- **Element Plus** - Vue 3 UI 组件库
- **Vite** - 快速构建工具
- **Pinia** - 状态管理
- **Vue Router** - 路由管理

### 后端
- **NestJS** - Node.js 企业级框架
- **TypeScript** - 类型安全的 JavaScript
- **TypeORM** - 对象关系映射
- **MySQL/SQLite** - 数据库
- **JWT** - JSON Web Token 认证
- **Multer** - 文件上传中间件

## 🚀 快速开始

### 环境要求
- Node.js 16+
- MySQL 8.0+ (可选，也支持 SQLite)
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd bilibili-demo
```

### 2. 安装依赖

**前端依赖：**
```bash
npm install
```

**后端依赖：**
```bash
cd backend/bilibili-backend
npm install
```

### 3. 数据库配置

#### 使用 MySQL（推荐）
1. 参考 `backend/bilibili-backend/MYSQL_SETUP.md` 安装 MySQL
2. 创建数据库：
   ```sql
   CREATE DATABASE bilibili;
   ```
3. 配置环境变量（`backend/bilibili-backend/.env`）：
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=your_password
   DB_DATABASE=bilibili
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```

#### 使用 SQLite（开发环境）
无需额外配置，项目会自动创建 `database.sqlite` 文件。

### 4. 初始化数据库
```bash
cd backend/bilibili-backend
npm run init-db
```

### 5. 启动服务

**启动后端：**
```bash
cd backend/bilibili-backend
npm run start:dev
```
后端服务运行在 `http://localhost:3000`

**启动前端：**
```bash
# 在项目根目录
npm run dev
```
前端服务运行在 `http://localhost:3001`

### 6. 访问应用
- 前端页面：http://localhost:3001
- 管理后台：http://localhost:3001/admin
- 默认管理员账号：`admin` / `admin123`

## 📚 API 文档

### 主要接口
- `GET /api/banners` - 获取轮播图列表
- `POST /api/auth/login` - 用户登录
- `GET /api/categories` - 获取分类列表
- `POST /api/images/upload` - 图片上传

## 🗄️ 数据库初始化

项目提供了完整的数据库初始化方案：

```bash
# 完整初始化（推荐）
npm run init-db

# 仅初始化轮播图
npm run init-banners

# 初始化种子数据
npm run seed
```

详细说明请参考：`backend/bilibili-backend/DATABASE_INIT_GUIDE.md`

## 🔧 开发指南

### 添加新功能
1. 后端：在 `src/` 目录下创建新模块
2. 前端：在 `src/views/` 添加新页面组件
3. 更新路由和 API 接口

### 数据库迁移
```bash
cd backend/bilibili-backend
npm run migration:generate -- -n MigrationName
npm run migration:run
```

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题，请创建 Issue 或联系开发者。