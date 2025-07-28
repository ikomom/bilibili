# GitHub 上传指导

本指南将帮助您将项目上传到 GitHub。

## 📋 准备工作

✅ **已完成的步骤：**
- Git 仓库已初始化
- 所有文件已添加到 Git
- 初始提交已完成
- .gitignore 文件已配置
- README.md 文档已更新

## 🚀 上传到 GitHub

### 方法一：通过 GitHub 网站创建仓库（推荐）

1. **登录 GitHub**
   - 访问 [github.com](https://github.com)
   - 登录您的账户

2. **创建新仓库**
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"
   - 填写仓库信息：
     - **Repository name**: `bilibili-demo`
     - **Description**: `A Bilibili-like video platform demo with Vue.js frontend and NestJS backend`
     - **Visibility**: 选择 Public 或 Private
     - **⚠️ 重要**: 不要勾选 "Add a README file"、"Add .gitignore" 或 "Choose a license"（因为我们已经有这些文件）
   - 点击 "Create repository"

3. **连接本地仓库到 GitHub**
   
   在创建仓库后，GitHub 会显示指令。在您的项目目录中运行：
   
   ```bash
   # 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/bilibili-demo.git
   
   # 推送代码到 GitHub
   git branch -M main
   git push -u origin main
   ```

### 方法二：使用 GitHub CLI（如果已安装）

```bash
# 创建仓库并推送
gh repo create bilibili-demo --public --source=. --remote=origin --push
```

### 方法三：使用 Git 命令行（如果您已有 GitHub 仓库）

```bash
# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/bilibili-demo.git

# 推送到主分支
git branch -M main
git push -u origin main
```

## 🔧 常见问题解决

### 问题 1: 推送时要求身份验证

**解决方案：**
- 使用 Personal Access Token (PAT) 代替密码
- 在 GitHub Settings > Developer settings > Personal access tokens 创建 token
- 推送时使用 token 作为密码

### 问题 2: 远程仓库已存在文件

**解决方案：**
```bash
# 强制推送（谨慎使用）
git push -f origin main

# 或者先拉取远程更改
git pull origin main --allow-unrelated-histories
git push origin main
```

### 问题 3: 分支名称问题

**解决方案：**
```bash
# 重命名当前分支为 main
git branch -M main

# 或者推送到 master 分支
git push -u origin master
```

## 📝 推送后的步骤

1. **验证上传**
   - 访问您的 GitHub 仓库页面
   - 确认所有文件都已上传
   - 检查 README.md 是否正确显示

2. **设置仓库描述**
   - 在仓库页面点击 "Edit" 按钮
   - 添加描述和标签
   - 设置网站链接（如果有部署）

3. **配置 GitHub Pages（可选）**
   - 在仓库 Settings > Pages
   - 选择源分支进行部署

## 🎯 后续维护

### 日常提交流程
```bash
# 添加更改
git add .

# 提交更改
git commit -m "feat: add new feature"

# 推送到 GitHub
git push origin main
```

### 提交信息规范
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 🔗 有用的链接

- [GitHub 官方文档](https://docs.github.com/)
- [Git 基础教程](https://git-scm.com/book/zh/v2)
- [GitHub Desktop](https://desktop.github.com/) - 图形界面工具
- [VS Code GitHub 扩展](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)

## 🎉 完成！

恭喜！您的项目现在已经在 GitHub 上了。您可以：
- 与他人分享您的项目
- 接受贡献和 Pull Requests
- 使用 GitHub Actions 进行 CI/CD
- 部署到 GitHub Pages 或其他平台

---

**需要帮助？** 如果遇到问题，请查看 GitHub 的官方文档或在项目中创建 Issue。