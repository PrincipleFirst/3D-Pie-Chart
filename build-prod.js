#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始生产环境构建...');

try {
  // 1. 清理之前的构建
  console.log('📁 清理之前的构建文件...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // 2. 设置环境变量
  process.env.NODE_ENV = 'production';
  process.env.VITE_APP_ENV = 'production';
  process.env.VITE_APP_TITLE = '3D Pie Chart - Production';

  // 3. 安装依赖（如果需要）
  console.log('📦 检查依赖...');
  if (!fs.existsSync('node_modules')) {
    console.log('📦 安装依赖...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // 4. 执行构建
  console.log('🔨 执行构建...');
  execSync('npm run build', { stdio: 'inherit' });

  // 5. 验证构建结果
  console.log('✅ 验证构建结果...');
  if (!fs.existsSync('dist')) {
    throw new Error('构建失败：dist 目录不存在');
  }

  const distFiles = fs.readdirSync('dist');
  console.log('📁 构建文件列表:', distFiles);

  // 6. 生成部署说明
  const deployReadme = `# 生产环境部署说明

## 构建信息
- 构建时间: ${new Date().toLocaleString()}
- 环境: Production
- 版本: ${require('./package.json').version}

## 部署步骤
1. 将 dist 目录中的所有文件上传到您的 Web 服务器
2. 确保服务器支持单页应用（SPA）路由
3. 配置适当的 MIME 类型

## 文件说明
- index.html: 主页面
- assets/: 静态资源（JS、CSS、图片等）

## 注意事项
- 生产环境已关闭控制面板和 URL 同步功能
- 所有配置通过 config.js 文件管理
- 支持 CDN 部署

## 性能优化
- 启用了代码分割
- 启用了资源压缩
- 优化了静态资源加载
`;

  fs.writeFileSync('dist/DEPLOY.md', deployReadme);
  console.log('📝 生成部署说明文件');

  // 7. 构建完成
  console.log('🎉 生产环境构建完成！');
  console.log('📁 构建文件位于: dist/');
  console.log('📖 部署说明: dist/DEPLOY.md');
  console.log('');
  console.log('🚀 下一步：将 dist 目录部署到您的 Web 服务器');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}
