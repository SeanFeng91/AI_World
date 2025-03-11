#!/bin/bash

# 显示环境信息
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# 安装依赖
npm ci

# 构建项目
npx vite build

# 检查构建结果
if [ -d "dist" ]; then
  echo "Build successful! Files in dist directory:"
  ls -la dist
else
  echo "Build failed! dist directory not found."
  exit 1
fi 