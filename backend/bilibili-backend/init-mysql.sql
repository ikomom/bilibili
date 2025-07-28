-- MySQL数据库初始化脚本
-- 请在MySQL安装完成后运行此脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS bilibili CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 使用数据库
USE bilibili;

-- 显示创建结果
SHOW DATABASES LIKE 'bilibili';

-- 创建用户（可选，如果需要专门的数据库用户）
-- CREATE USER 'bilibili_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON bilibili.* TO 'bilibili_user'@'localhost';
-- FLUSH PRIVILEGES;

SELECT 'MySQL数据库初始化完成！' AS message;