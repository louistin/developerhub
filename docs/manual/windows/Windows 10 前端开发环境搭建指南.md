# Windows 10 前端开发环境搭建指南

## NodeJS 环境搭建

```bash
# 下载 LTS 版本 nodejs
https://nodejs.org/en/

# 安装到自定义目录
X:\louis\opt\nodejs

# 在该目录下新建 node_cache node_global 目录, 并配置
C:\Users\Louis>npm config set prefix "X:\Louis\opt\nodejs\node_global"
C:\Users\Louis>npm config set cache "X:\Louis\opt\nodejs\node_cache"

# 验证安装
C:\Users\Louis>node -v
v12.18.3

C:\Users\Louis>npm -v
6.14.6

# 安装测试, 随后在 X:\louis\opt\nodejs\node_global\node_modules 下查看是否安装
C:\Users\Louis>npm install -g express
+ express@4.17.1
added 50 packages from 37 contributors in 100.283s

# 将 X:\louis\opt\nodejs\node_global 加入系统环境变量
```

## Java 环境搭建

```bash
# JDK 下载
http://www.oracle.com/technetwork/java/javase/downloads/index.html

# 安装目录 X:\louis\opt\Java

# 设置环境变量
# 新建变量 JAVA_PATH  X:\louis\opt\Java
# 系统 Path 添加 %JAVA_HOME%\bin  %JAVA_HOME%\jre\bin
```