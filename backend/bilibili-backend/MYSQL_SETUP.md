# MySQL数据库切换指南

## 当前状态
✅ 后端代码已配置为使用MySQL  
✅ 环境变量已设置  
✅ MySQL2驱动已安装  
❌ MySQL服务器需要安装和配置  

## 1. 安装MySQL

### 方法一：官方安装包
1. 访问 [MySQL官网](https://dev.mysql.com/downloads/mysql/)
2. 下载MySQL Community Server for Windows
3. 运行安装程序，选择"Developer Default"配置
4. 设置root密码（记住此密码）

### 方法二：使用Chocolatey
```powershell
# 以管理员身份运行PowerShell
choco install mysql
```

### 方法三：使用Docker（推荐）
```powershell
# 拉取MySQL镜像
docker pull mysql:8.0

# 运行MySQL容器
docker run --name mysql-bilibili -e MYSQL_ROOT_PASSWORD=123456 -p 3306:3306 -d mysql:8.0
```

## 2. 配置数据库

### 如果使用本地MySQL安装：
1. 打开MySQL Command Line Client或MySQL Workbench
2. 运行以下命令创建数据库：
```sql
source D:/Project/web/ai-demo/bilibili/backend/bilibili-backend/init-mysql.sql
```

### 如果使用Docker：
```powershell
# 进入MySQL容器
docker exec -it mysql-bilibili mysql -uroot -p123456

# 在MySQL命令行中运行：
CREATE DATABASE IF NOT EXISTS bilibili CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bilibili;
```

## 3. 更新环境变量

编辑 `.env` 文件，根据你的MySQL配置更新：

```env
# 本地MySQL配置
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=你的MySQL密码
DB_DATABASE=bilibili

# 如果使用Docker，密码为123456
# DB_PASSWORD=123456
```

## 4. 启动后端服务

```powershell
cd backend/bilibili-backend
npm run start:dev
```

## 5. 初始化测试数据

```powershell
# 在backend/bilibili-backend目录下运行
npx ts-node src/scripts/init-banners.ts
```

## 故障排除

### 连接被拒绝错误
- 确保MySQL服务正在运行
- 检查端口3306是否被占用
- 验证用户名和密码是否正确

### 数据库不存在错误
- 运行 `init-mysql.sql` 脚本创建数据库
- 或手动创建：`CREATE DATABASE bilibili;`

### 权限错误
- 确保MySQL用户有足够权限
- 可能需要运行：`GRANT ALL PRIVILEGES ON bilibili.* TO 'root'@'localhost';`

## 验证安装

成功配置后，你应该看到类似输出：
```
[Nest] Application successfully started
[Nest] Mapped {/api/banners, GET} route
```

然后可以测试API：
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/banners" -Method GET
```