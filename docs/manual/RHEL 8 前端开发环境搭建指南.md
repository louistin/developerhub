# RHEL 8 前端开发环境搭建指南

## 1. Spring Boot 开发环境搭建
```bash
yum install java java-devel
yum install maven

# vscode 插件安装与配置
Java Extension Pack
Spring Boot Extension Pack

# 创建项目
Ctrl + Shift + P
Spring 选择创建 Maven 项目
需要引入的包:
    DevTools    代码修改热更新, 无需重启
    Web         集成tomcat, SpringMVC
    Lombok      智能生成setter、getter、toString等接口

# 项目debug
vscode dubbger

# 项目打包
mvn clean package -Dmaven.test.skip=true

# 测试
java -jar test.jar
```
```bash
# /etc/maven/setting 配置
# 这里只是个参考, 实际操作中修改了编译会报错
<mirrors>
    <mirror>                                                                   
        <id>alimaven</id>                                                        
        <mirrorOf>central</mirrorOf>                                             
        <name>aliyun maven</name>                                                
        <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>   
    </mirror>                                                                  
    <mirror>                                                                   
        <id>alimaven</id>                                                        
        <name>Nexus aliyun</name>                                                
        <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
        <mirrorOf>*</mirrorOf>                                                   
    </mirror>                                                                  
</mirrors> 

# 配置本地仓库, 这个用起来没问题
<localRepository>/usr/local/etc/maven/repository</localRepository> 
```

## 2. Vue 开发环境搭建
```bash
yum install -y npm 

npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm install -g @vue/cli

cnpm install -g @vue/cli-init

# 关于webpack 的安装部分好像即使不单独安装vue 中也有包含
cnpm install webpack -g

[louis@louis Documents]$ vue init webpack vue_demo

? Project name vue_demo
? Project description A Vue.js project
? Author louis.tianlu@gmail.com
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) npm

   vue-cli · Generated "vue_demo".

cd vue_demo
npm run dev
npm run build

# vscode 插件安装与配置
vetur
Prettier - Code formatter
ESLint

Ctrl + Sgift + I    格式化代码

# node_modules 没办法, npm 机制就是放在项目目录下的, 不好配制成全局的
```

{{$page.readingTime.words}}
{{Math.ceil($page.readingTime.minutes)}}