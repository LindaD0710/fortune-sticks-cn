# GitHub 上传指南

## 📋 前置准备

1. **确保已安装 Git**
   ```bash
   git --version
   ```

2. **配置 Git 用户信息**（如果还没配置）
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## 🚀 上传到 GitHub 的步骤

### 方法一：使用 GitHub 网页创建仓库（推荐）

1. **登录 GitHub**
   - 访问 [github.com](https://github.com)
   - 登录你的账户

2. **创建新仓库**
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"
   - 填写仓库信息：
     - **Repository name**: `oriental-oracle` 或 `fortune-stick-app`（你喜欢的名字）
     - **Description**: `AI-powered Chinese fortune stick reading application`
     - **Visibility**: 
       - 选择 **Private**（私有，推荐）或 **Public**（公开）
     - **不要**勾选 "Initialize this repository with a README"（我们已经有了）
   - 点击 "Create repository"

3. **连接本地仓库到 GitHub**
   
   GitHub 会显示连接命令，类似这样：
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```
   
   在你的终端执行这些命令（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）：
   
   ```bash
   cd "/Users/lindadong/Desktop/小创意/【破局】AI编程出海/签筒抽签解读"
   
   # 添加远程仓库（替换为你的 GitHub 仓库 URL）
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # 将主分支重命名为 main（如果还没重命名）
   git branch -M main
   
   # 推送到 GitHub
   git push -u origin main
   ```

4. **如果提示输入密码**
   - GitHub 不再支持密码认证
   - 需要使用 **Personal Access Token (PAT)** 或 **SSH 密钥**
   - 见下面的"认证设置"部分

### 方法二：使用 GitHub CLI（如果已安装）

```bash
# 安装 GitHub CLI（如果还没安装）
# macOS: brew install gh

# 登录 GitHub
gh auth login

# 创建并推送仓库
gh repo create oriental-oracle --private --source=. --remote=origin --push
```

## 🔐 认证设置

### 选项 1：使用 Personal Access Token (PAT)（推荐）

1. **创建 Personal Access Token**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 填写信息：
     - **Note**: `Oriental Oracle Project`
     - **Expiration**: 选择过期时间（建议 90 天或 No expiration）
     - **Scopes**: 勾选 `repo`（完整仓库权限）
   - 点击 "Generate token"
   - **重要**：复制生成的 token（只显示一次！）

2. **使用 Token 推送**
   ```bash
   # 当 Git 提示输入密码时，使用 token 作为密码
   # Username: 你的 GitHub 用户名
   # Password: 粘贴你的 Personal Access Token
   git push -u origin main
   ```

3. **保存 Token 到 Git Credential Helper**（可选，避免每次输入）
   ```bash
   # macOS
   git config --global credential.helper osxkeychain
   
   # 然后推送，输入一次后会自动保存
   git push -u origin main
   ```

### 选项 2：使用 SSH 密钥

1. **检查是否已有 SSH 密钥**
   ```bash
   ls -al ~/.ssh
   ```

2. **生成新的 SSH 密钥**（如果没有）
   ```bash
   ssh-keygen -t ed25519 -C "your.email@example.com"
   # 按 Enter 使用默认路径
   # 设置密码（可选，但推荐）
   ```

3. **添加 SSH 密钥到 ssh-agent**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

4. **复制公钥**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # 复制输出的内容
   ```

5. **添加到 GitHub**
   - 访问：https://github.com/settings/keys
   - 点击 "New SSH key"
   - **Title**: `My MacBook` 或任何描述性名称
   - **Key**: 粘贴刚才复制的公钥
   - 点击 "Add SSH key"

6. **使用 SSH URL 连接仓库**
   ```bash
   # 删除之前的 HTTPS remote
   git remote remove origin
   
   # 添加 SSH remote（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）
   git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # 推送
   git push -u origin main
   ```

## ✅ 验证上传成功

1. **刷新 GitHub 仓库页面**
   - 应该能看到所有文件
   - README.md 会显示在仓库首页

2. **检查文件**
   ```bash
   git remote -v  # 查看远程仓库地址
   git log        # 查看提交历史
   ```

## 📝 后续操作

### 日常更新代码

```bash
# 1. 查看更改
git status

# 2. 添加更改的文件
git add .

# 3. 提交更改
git commit -m "描述你的更改"

# 4. 推送到 GitHub
git push
```

### 创建新分支

```bash
# 创建并切换到新分支
git checkout -b feature/new-feature

# 开发完成后，推送新分支
git push -u origin feature/new-feature

# 在 GitHub 上创建 Pull Request
```

## 🆘 常见问题

### 问题 1: "remote origin already exists"
```bash
# 删除现有的 remote
git remote remove origin

# 重新添加
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 问题 2: "Permission denied"
- 检查你的 GitHub 用户名和 token/SSH 密钥是否正确
- 确保仓库权限允许你推送

### 问题 3: "fatal: refusing to merge unrelated histories"
```bash
# 如果本地和远程有不同的历史，使用：
git pull origin main --allow-unrelated-histories
```

## 📚 有用的 Git 命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline

# 查看远程仓库
git remote -v

# 拉取最新更改
git pull

# 查看分支
git branch

# 切换分支
git checkout branch-name
```

---

**需要帮助？** 查看 [GitHub 官方文档](https://docs.github.com/) 或 [Git 官方文档](https://git-scm.com/doc)
