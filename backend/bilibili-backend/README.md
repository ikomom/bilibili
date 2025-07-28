# Bilibili 管理后台 API

基于 NestJS 构建的图片分享平台后端 API，为前端 Vue 3 项目提供数据支持。

## 功能特性

### 🔐 用户认证
- JWT 身份验证
- 管理员登录
- 密码加密存储

### 📸 图片管理
- 图片上传
- 图片 CRUD 操作
- 图片分类筛选
- 图片搜索
- 浏览量和点赞统计

### 📂 分类管理
- 分类 CRUD 操作
- 分类状态管理

### 📊 数据统计
- 图片总数统计
- 浏览量统计
- 点赞数统计

## 技术栈

- **框架**: NestJS 11
- **数据库**: MySQL + TypeORM
- **认证**: JWT + Passport
- **文件上传**: Multer
- **验证**: class-validator
- **配置**: @nestjs/config

## 项目结构

```
src/
├── auth/                 # 认证模块
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── jwt-auth.guard.ts
│   └── dto/
├── images/               # 图片管理模块
│   ├── images.controller.ts
│   ├── images.service.ts
│   ├── images.module.ts
│   └── dto/
├── categories/           # 分类管理模块
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── categories.module.ts
│   └── dto/
├── entities/             # 数据库实体
│   ├── user.entity.ts
│   ├── image.entity.ts
│   └── category.entity.ts
├── database/             # 数据库相关
│   └── seed.ts
├── app.module.ts
└── main.ts
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env` 文件并根据需要修改配置：

```env
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=bilibili_admin

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-here

# 应用配置
PORT=3001
```

### 3. 创建数据库

确保 MySQL 服务运行，并创建数据库：

```sql
CREATE DATABASE bilibili_admin;
```

### 4. 初始化数据

运行数据库种子脚本：

```bash
npm run seed
```

这将创建：
- 默认管理员账户：`admin/admin123`
- 默认分类数据
- 示例图片数据

### 5. 启动应用

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

应用将在 `http://localhost:3001` 启动。

## API 接口

### 认证接口

- `POST /api/auth/login` - 管理员登录

### 图片接口

- `GET /api/images` - 获取图片列表（支持分页、分类筛选、搜索）
- `GET /api/images/:id` - 获取单个图片
- `POST /api/images` - 创建图片（需要认证）
- `PATCH /api/images/:id` - 更新图片（需要认证）
- `DELETE /api/images/:id` - 删除图片（需要认证）
- `POST /api/images/:id/view` - 增加浏览量
- `POST /api/images/:id/like` - 增加点赞数
- `GET /api/images/stats` - 获取统计数据（需要认证）

### 分类接口

- `GET /api/categories` - 获取分类列表
- `GET /api/categories/:id` - 获取单个分类
- `POST /api/categories` - 创建分类（需要认证）
- `PATCH /api/categories/:id` - 更新分类（需要认证）
- `DELETE /api/categories/:id` - 删除分类（需要认证）

### 文件上传

- 上传的文件存储在 `uploads/` 目录
- 通过 `/uploads/filename` 访问静态文件

## 与前端集成

### CORS 配置

已配置允许来自 `http://localhost:3000` 的跨域请求。

### API 基础 URL

前端应使用 `http://localhost:3001/api` 作为 API 基础 URL。

### 认证方式

使用 Bearer Token 认证：

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 开发说明

### 数据库同步

开发环境下，TypeORM 的 `synchronize` 选项设为 `true`，会自动同步数据库结构。

**注意**: 生产环境应设为 `false` 并使用迁移。

### 文件上传

- 支持的文件类型：图片文件
- 文件大小限制：默认无限制（可在 MulterModule 中配置）
- 文件存储：本地 `uploads/` 目录

### 安全性

- 密码使用 bcryptjs 加密
- JWT Token 有效期 24 小时
- 敏感操作需要管理员认证

## 部署

### 生产环境配置

1. 设置环境变量
2. 修改 `synchronize: false`
3. 配置反向代理（如 Nginx）
4. 设置文件上传目录权限
5. 配置 HTTPS

### Docker 部署

可以使用 Docker 进行容器化部署，需要配置 MySQL 容器和应用容器。

## 许可证

[MIT](LICENSE)
