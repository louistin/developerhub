# Spring-boot + Vue FAQ

## 0. 前置条件及名词解释
前置条件:
* Windows 上安装 Git, node, npm (npm 可以替换为cnpm 加快速度), Nginx
* 集成IDE: IDEA, WebStorm

名词解释:
* Spring Boot: 基于Spring 的一套框架, 简化了基于Spring 的应用开发
* Maven: 项目管理工具, 可以对 Java 项目进行构建, 依赖管理.

* Vue: 是一套构建用户界面的渐进式框架.
* webpack: 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler).
* iview: 一套基于 Vue.js 的高质量 UI 组件库.
* jquery: 一个 JavaScript 库, 极大的简化 JavaScript 编程.
* ajax: 通过在后台与服务器进行少量数据交换, 使网页实现异步更新. 这意味着可以在不重载整个页面的情况下, 对网页的某些部分进行更新.

相关参考链接:
* https://cn.vuejs.org/
* https://www.webpackjs.com/
* http://v1.iviewui.com/docs/guide/introduce
* https://www.runoob.com/jquery/jquery-tutorial.html
* https://www.runoob.com/php/php-ajax-intro.html

---
## 1. Spring Boot 项目构建
* 使用IDEA 创建 Spring Boot 项目基础框架
* 使用 Maven 作为项目构建工具
```bash
# 编译, Terminal 下
mvn clean package -Dmaven.test.skip=true
```

---
## 2. Vue 项目构建
```bash
# 进入项目, 安装基础模块
cnpm install

# 开发模式下调试预览
npm run dev

# 项目打包
npm run build

# 其他组件引入
cnpm install --save iview
cnpm install --save jquery
```

---
## 3. 调试与部署
### 调试配置:
```bash
# Windows 端 Nginx 使用
# 直接去 http://openresty.org/en/download.html 下载压缩包, 解压到目标目录
# 操作指令
start nginx.exe
nginx.exe -s reload
nginx.ext -s quit
```

```conf
# Windows 开发调试 nginx.conf 配置
# 1080 网页请求 port
# 2560 Vue 项目 port
# 2561 String Boot 项目 port 
# 以上端口号可以根据代码中的配置进行更改
server {
    listen       1080;
    server_name  localhost;

    location / {
        proxy_pass   http://localhost:2560;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   Cookie $http_cookie;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    location /system/ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Headers Origin,X-Requested-With,Content-Type,Accept,Cookie,Set-Cookie;
        add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
        add_header Access-Control-Allow-Credentials: true;
        if ($request_method = 'OPTIONS') {
            return 204;
        }

        proxy_pass  http://localhost:2561;
    }

    location /status/ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Headers Origin,X-Requested-With,Content-Type,Accept,Cookie,Set-Cookie;
        add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
        add_header Access-Control-Allow-Credentials: true;
        if ($request_method = 'OPTIONS') {
            return 204;
        }

        proxy_pass  http://localhost:2561;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

### 正式布署:
* Nginx 配置
* jar 文件运行

```conf
# Linux 正式布署配置
# Vue build 生成的网页文件放在 html/cms 
server {
    listen 	1080;
    server_name localhost;

    location / {
        root   html/cms;
        index  index.html index.htm;
    }

    location /system/ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Headers Origin,X-Requested-With,Content-Type,Accept,Cookie,Set-Cookie;
        add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
        add_header Access-Control-Allow-Credentials: true;
        if ($request_method = 'OPTIONS') {
            return 204;
        }

        proxy_pass  http://localhost:2561;
    }

    location /status/ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Headers Origin,X-Requested-With,Content-Type,Accept,Cookie,Set-Cookie;
        add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
        add_header Access-Control-Allow-Credentials: true;
        if ($request_method = 'OPTIONS') {
            return 204;
        }

        proxy_pass  http://localhost:2561;
    }

    location ~ .*\.(gif|jpg|jpeg|png)$ {
        root /opt/openresty/nginx/html/cms;
        autoindex on;
    }   

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
}
```

```bash
# jar 运行
# 确保Linux 上具有JDK 环境
# 将jar 文件上传到指定目录, 如 /opt/jar

# 运行命令
nohup java -jar xxx.jar > output.log 2>&1&

# nohup 相当于在后台执行

# 日志查看
tail -2000f output.log

# 关闭
ps -aux | grep java
kill -9 pid
```

```conf
# 使用supervisor 管理 jar
[program:cms]
environment=JAVA_HOME=/usr/bin
process_name=%(program_name)s
directory=/home/xmcloud/apps/%(program_name)s
user=root
startsecs=10    ; 启动10s 后没有异常退出, 认为是正常启动
startretries=3  ; 启动失败自动重试次数
stopsignal=QUIT 
stopwaitsecs=10 
autostart=true
stderr_logfile_maxbytes=50MB
stderr_logfile_backups=2
stderr_logfile=/home/xmcloud/logs/%(program_name)s/stderr.log
stdout_logfile_maxbytes=50MB
stdout_logfile_backups=2
stdout_logfile=/home/xmcloud/logs/%(program_name)s/stdout.log
;; cms-springboot
command= java -Xms128m -Xmx512m -Dspring.profiles.active=prd -Dserver.port=2560 -jar /home/xmcloud/apps/%(program_name)s/cms.jar

; -Xms  JVM 启动分配内存
; -Xmx  JVM 运行中分配最大内存
; -Xss  JVM 每个启动线程分配的内存
```