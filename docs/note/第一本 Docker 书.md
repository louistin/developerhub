# 第一本 Docker 书

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>

[[TOC]]

---

## 01 - 简介
### Docker
* Docker 鼓励面向服务的架构和微服务架构, 单个容器只运行一个应用程序或进程

### Docker 组件
* docker 客户端和服务器
  * docker 是一个 C/S 架构程序
  * 客户端向服务器或守护进程发送请求, 由其完成所有工作并返回结果
* docker 镜像
  * 生命周期中**构建**阶段
  * 容器的源代码
* Registry
  * 保存用户构建的镜像
  * 分为共有和私有
* docker 容器
  * 生命周期中**启动**阶段
  * 容器基于镜像启动起来的


## 02 - 安装 docker

```bash
# kernel > 3.8
yum update
yum remove docker  docker-common docker-selinux docker-engine
yum install -y yum-utils device-mapper-persistent-data lvm2

# 加载 device mapper 模块, device-mapper 作为存储驱动
# ls -l /sys/class/misc/device-mapper/ 或 grep device-mapper /proc/devices 查看
modeprobe dm_mod

yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 直接使用 yum install -y docker 安装的版本不是最新
yum install -y docker-ce
docker info

systemctl enable docker
systemctl start/stop/restart docker
```

## 03 - docker 入门

### 交互式运行容器 interactive container

  ```bash
  # -i 保证容器中的 STDIN 开启
  # -t 为要创建的容器分配一个伪 tty 终端
  # ubuntu 镜像名称, 这里为基础镜像
  # /bin/bash 容器中运行的命令
  [louis@louis ~]$ sudo docker run --name ubuntu_20.04 -i -t ubuntu /bin/bash
  [sudo] password for louis:
  Unable to find image 'ubuntu:latest' locally
  latest: Pulling from library/ubuntu
  d51af753c3d3: Pull complete
  fc878cd0a91c: Pull complete
  6154df8ff988: Pull complete
  fee5db0ff82f: Pull complete
  Digest: sha256:747d2dbbaaee995098c9792d99bd333c6783ce56150d1b11e333bbceed5c54d7
  Status: Downloaded newer image for ubuntu:latest
  root@30a9c7599262:/# uname -r
  4.4.223-1.el7.elrepo.x86_64
  root@30a9c7599262:/etc/apt# cat /etc/lsb-release
  DISTRIB_ID=Ubuntu
  DISTRIB_RELEASE=20.04
  DISTRIB_CODENAME=focal
  DISTRIB_DESCRIPTION="Ubuntu 20.04 LTS"

  # 替换源
  root@30a9c7599262:/etc/apt# sed -i s@/security.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
  root@30a9c7599262:/etc/apt# sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
  apt clean && apt update && apt upgrade
  apt install vim net-tools

  root@30a9c7599262:~# exit
  exit
  [louis@louis ~]$

  # CONTAINER ID 和 NAMES 都可以唯一标识容器
  [root@louis ~]# sudo docker ps -a
  CONTAINER ID    IMAGE   COMMAND       CREATED         STATUS        PORTS      NAMES
  5e01a9401a5d    ubuntu  "/bin/bash"   4 minutes ago   Up 2 seconds             ubuntu_20.04

  # 显示最后 10 个容器
  sudo docker ps -n 10

  # 附着到docer, shell 退出 container 随之 stop
  [louis@louis ~]$ sudo docker attach ubuntu_20.04
  root@5e01a9401a5d:/#

  # 容器管理
  sudo docker start/stop/restart ubuntu_20.04
  sudo docker rm ubuntu_20.04
  ```

### 守护式容器 deamonized container

  ```bash
  [louis@louis ~]# sudo docker run --name daemon_dave -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"
  740f6405a0a87c2d7fdf20c902304ff3da3748f09f360f52a00e9a9d84db1565

  # 查看日志
  sudo docker logs -f daemon_dave
  sudo docker logs --tail 10 daemon_dave  # 最新10条
  sudo docker logs --tail 0 -ft daemon_dave # 最新带时间戳

  # 查看进程
  sudo docker top daemon_dave

  # 在容器内部运行进程
  sudo docker exec -t -i daemon_dave touch /root/new_file
  # 在容器中启动 shell
  sudo docker exec -t -i daemon_dave /bin/bash

  # 容器管理
  sudo docker kill daemon_dave    # 快速停止, 其他同上
  # 无论容器退出码是什么, 都会自动重启容器
  sudo docker run --restart=always --name daemon_dave -d ubuntu /bin/sh -c "echo hello world"
  # 只有当退出码非 0 时才重启, 最多重启 5 次
  sudo docker run --restart=on-failure:5 --name daemon_dave -d ubuntu /bin/sh -c "echo hello world"
  ```

### 容器管理

  ```bash
  # 容器详细信息
  sudo docker inspect daemon_dave
  # 选定查看结果
  sudo docker inspect daemon_dave --format '{{ .NetworkSettings.IPAddress }}'

  # 删除所有容器
  sudo docker rm `sudo docker ps -a -q`
  ```


## 04 - 使用 docker 镜像和仓库

### 什么是 docker 镜像

* docker 镜像是由文件系统叠加而成
* docker 中, root 文件系统永远只能是只读状态
* docker 利用联合加载 union mount 技术在 root 文件系统层上加载更多的只读文件系统
  * 联合加载一次同时加载多个文件系统, 但是外面只能看到一个文件系统
  * 联合加载将各层文件系统叠加在一起, 最终的文件系统会包含所有底层的文件和目录
* 写时复制 copy on write
  * 创建新容器时, docker 会构建出一个镜像栈, 并在栈的最顶层添加一个读写层
  * 这个读写层及其下面的镜像层以及一些配置数据, 就构成一个容器

**Docker 文件系统层**<br>
  <img :src="$withBase('/image/note/thedockerbook/04_001_docker文件系统层.webp')" alt="Docker 文件系统层">

### 列出镜像

  ```bash
  [louis@louis ~]$ sudo docker images
  REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
  ubuntu              latest              1d622ef86b13        2 weeks ago         73.9MB

  # 指定 tag 启动容器
  sudo docker run -t -i --name new_container ubuntu:latest /bin/bash

  # 本地镜像保存路径 /var/lib/docker
  # 容器路径 /var/lib/docker/containers
  ```

### 拉取及查找镜像

  ```bash
  # 默认拉取 latest 版本, 可添加 tag 拉取指定版本
  sudo docker pull IMAGE_NAME:TAG

  # OFFICIAL 官方构建
  sudo docker search IMAGE_NAME:TAG
  ```

### 构建镜像

* 使用 `commit` 构建

  ```bash
  sudo docker run -it ubuntu:latest /bin/bash
  root@bdcfd6b79a7f:/# apt -y update && apt install -y apache2
  # 获取 CONTAINER ID
  [louis@louis ~]$ sudo docker ps -l -q
  bdcfd6b79a7f

  # 创建镜像
  sudo docker commit -m="A new custom image" --author="louis" bdcfd6b79a7f louis/apache2:webserver

  # 查看
  sudo docker images

  # 运行
  sudo docker run -it louis/apache2:webserver /bin/bash
  ```

* 使用 Dcokerfile 构建
  * Dockerfile 执行流程
    * Docker 从基础镜像运行一个容器
    * 执行一条指令, 对容器做出修改
    * 执行类似 `docker commit` 的操作, 提交一个新的镜像层
    * docker 基于刚提交的镜像运行一个新容器
    * 执行 Dockerfile 的下一条指令, 直到所有指令执行完毕
  * docker 构建镜像过程中会将之前的镜像层视为缓存, 再次构建时会从最新修改的指令处开始执行

  ```bash
  # 创建目录 static_web, 并在其中创建文件 Dockerfile
  # Dockerfile 如下
  # 构建
  # --no-cache 略过缓存功能
  sudo docker build -t="louis/static_web:v0.0.1" .
  # 查看构建过程
  sudo docker histoty IMAGE_ID

  # 启动
  # -d 以分离 detached 的方式在后台启动
  # -p docker 运行时公开端口给外部宿主机, 默认自动分配, 可以绑定IP:PORT
  # -P 后无需指定端口, 自动公开所有 EXPOSE 端口
  # nginx -g "daemon off;" 以前台方式启动 nginx
  sudo docker run -d -p 127.0.0.1::80 --name static_web louis/static_web:v0.0.1 nginx -g "daemon off;"

  # 查看宿主机映射端口
  [louis@louis static_web]$ sudo docker ps
  CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS                     NAMES
  708aca0da6b4        louis/static_web:v0.0.1   "nginx -g 'daemon of…"   14 seconds ago      Up 13 seconds       127.0.0.1:32769->80/tcp   static_web

  [louis@louis static_web]$ sudo docker port CONTAINER_ID 80
  127.0.0.1:32769
  ```

  ```dockerfile
  # Version: 0.0.1
  FROM ubuntu:20.04
  MAINTAINER Louis Tian "louis.tianlu@gmail.com"
  RUN sed -i s@/security.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
  RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
  # 修改时间戳, 前面的缓存命中, 后面的指令将会重新执行
  ENV REFRESHED_AT 2020-05-13
  # RUN 指令会在shell 中使用 /bin/sh -c 执行
  # 其他方式 exec 格式: RUN ["apt", " install", "-y", "nginx"]
  RUN apt update
  RUN apt install -y nginx
  RUN echo 'Hi, I am in your container' > /var/www/html/index.nginx-debian.html
  # 指定端口
  EXPOSE 80
  ONBUILD ADD . /app/src
  ```

* Dockerfile 指令
  * `CMD`
    * 指定容器启动时要运行的命令
    * `docker run` 命令会覆盖 `CMD` 命令
    * Dockerfile 中只能指定一条 CMD, 多条只有最后一条有效, 可以结合 Supervisor 管理多进程

  * `ENTRYPOINT`
    * 不会被 `docker run` 命令覆盖
    * `docker run --entrypoint` 可覆盖 `ENTRYPOINT`

  * `WORKDIR`
    * 从镜像创建一个新容器时, 在容器内部设置一个工作目录(同时切到该目录), `ENCRYPOINT`,
      `/`, `CMD` 指定的程序在该目录下执行
    * 可以多次执行, 每次执行就会切换到对应目录, 后续命令都在该目录执行
    * `docker run -w` 可覆盖 `WORKDIR`

  * `ENV`
    * 在镜像构建过程中设置环境变量, 持久保存
    * 新的环境变量可以在后续任何 RUN 指令中使用
    * `docker run -e` 旨在运行时有效

  * `USER`
    * 指定镜像会以什么样的用户去运行
    * `docker run -u` 覆盖该值
    * 不指定默认为 root

  * `VOLUME`
    * 向基于镜像创建的容器添加卷, 一个卷可以存在以一个或多个容器内的特定目录

  * `ADD`
    * 将构建环境下的文件和目录复制到镜像中, 已存在不会覆盖, 目的路径不全会自动创建
    * 文件源也可以使用 URL
    * gzip bzip2 xz 文件添加时会自动 unpack
    * 后续指令构建缓存失效

  * `COPY`
    * 只关心文件复制, 不做提取和解压
    * 本地文件必须在 Dockerfile 同一目录

  * `ONBUILD`
    * 为镜像添加触发器 trigger, 当一个镜像被用作其他镜像的基础镜像时, 该镜像的触发器会被执行
    * 构建时, 会在 `FROM` 后立即执行
    * 只会被子镜像继承一次, 不能继续被孙镜像继承
    * 不能使用指令 `FROM` `MAINTAINER` `ONBUILD`
    * `sudo docker inspect CONTAINER_ID` 查看

    ```bash
    # sudo docker run -i -t louis/static_web 不需要再指定 /bin/bash, 并传入 -l 参数
    CMD ["/bin/bash", "-l"]
    ENCRYPONIT ["/usr/sbin/nginx", "-g", "daemon off;"]

    # 组合 CMD ENCRYPOINT, 可在 docker run 时灵活传入参数
    ENCRYPONIT ["/usr/sbin/nginx"]
    CMD ["-h"]

    WORKDIR /opt/nginx/conf
    RUN mkdir conf.d
    WORKDIR /opt/nginx/conf/conf.d
    ENTRYPOINT ["touch louis.com.conf"]

    ENV RVM_PATH /home/rvm
    RUN gem install unicorn

    # docker run -e "TARGET_PATH=/opt/app" 只在运行时有效
    ENV TARGET_PATH /opt/app
    WORKDIR $TARGET_PATH   # WORKDIR 值设置为 /opt/app

    USER nginx

    # 为基于此镜像创建的容器创建一个或多个挂载点
    VOLUME ["opt/project", "/data"]

    ADD software.lic /opt/application/software.lic

    COPY conf.d /etc/apache2/

    ONBUILD ADD . /app/src
    ONBUILD RUN cd /app/src && make
    ```

* 镜像推送到 Docker hub

  ```bash
  sudo docker login
  sudo docker tag IMAGE_ID DOCKERHUB_USRNAME/IMAGE_NAME:TAG
  sudo docker push DOCKERHUB_USRNAME/IMAGE_NAME:TAG
  ```

* 删除镜像

  ```bash
  sudo docker rmi IMAGE_NAME
  ```


## 05 - 在测试中使用 docker

### 使用 docker 测试静态网站

  ```bash
  # 构建目录
  [louis@louis sample]$ tree
  .
  |-- Dockerfile
  |-- nginx
  |   |-- global.conf
  |   `-- nginx.conf
  `-- website
      `-- index.html

  # 构建与运行
  sudo docker build -t louistian/nginx .

  [louis@louis sample]$ sudo docker images
  REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
  louistian/nginx     latest              3fdba3a08ccb        20 minutes ago      510MB
  centos              7                   b5b4d78bc90c        8 days ago          203MB

  # -v 将宿主机 website/ 作为卷, 挂载到容器中
  # 卷的修改会直接生效, 提交或创建镜像时, 卷不被包含在镜像中. 容器停止, 卷内容依然存在
  sudo docker run -d -p 80 --name website -v $PWD/website:/var/www/html/website louistian/nginx nginx

  [louis@louis sample]$ sudo docker ps -l
  CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS                   NAMES
  2e41582b07fa        louistian/nginx     "nginx"             18 minutes ago      Up 18 minutes       0.0.0.0:32780->80/tcp   website
  ```

  ```dockerfile
  # Dockerfile VERSION: 0.0.1
  FROM centos:7
  MAINTAINER Louis "louis.tianlu@gmail.com"
  ENV REFRESHED_AT 2020-05-14
  RUN yum update -y
  RUN yum install epel-release -y
  RUN yum install nginx -y
  RUN mkdir -p /var/www/html
  # 不同风格的复制
  ADD nginx/global.conf /etc/nginx/conf.d/
  ADD nginx/nginx.conf /etc/nginx/nginx.conf
  EXPOSE 80
  ```

  ```bash
  # global.conf
  server {
    listen          0.0.0.0:80;
    server_name     _;

    root            /var/www/html/website;
    index           index.html index.htm;

    access_log      /var/log/nginx/default_accesss.log;
    error_log       /var/log/nginx/default_error.log;
  }
  ```

  ```conf
  # nginx.conf
  user root;
  worker_processes 2;
  pid /run/nginx.pid;
  daemon off;   # nginx 强制前台运行, 进程不中断, 保持容器活跃状态

  events {}

  http {
      sendfile on;
      tcp_nopush on;
      tcp_nodelay on;
      keepalive_timeout 65;
      types_hash_max_size 2048;
      include /etc/nginx/mime.types;
      default_type application/octet-stream;
      access_log /var/log/nginx/access.log;
      error_log /var/log/nginx/error.log;
      gzip on;
      gzip_disable "msie6";
      include /etc/nginx/conf.d/*.conf;
  }
  ```

  ```html
  <!-- index.html -->
  Hello World.<br>
  louis.tianlu@gmail.com
  ```

### 使用 Docker 构建并测试 Web 应用程序

#### 构建 sinatra 镜像与容器

  ```bash
  # 添加 webapp 目录, 并确保 webapp/bin/webapp 权限可执行
  [louis@louis sinatra]$ tree
  .
  |-- Dockerfile
  `-- webapp
      |-- bin
      |   `-- webapp
      |-- Dockerfile
      `-- lib
          `-- app.rb

  sudo docker build -t louistian/sinatra .
  sudo docker run -d -p 4567 --name webapp -v $PWD/webapp:/opt/webapp louistian/sinatra

  # docker logs 类似 tail
  sudo docker logs webapp
  sudo docker logs -f webapp

  sudo docker top webapp
  sudo docker port webapp 4567

  [louis@louis sinatra]$ curl -i -H 'Accept: application/json' -d 'name=louis&status=online' http://localhost:32781/json
  HTTP/1.1 200 OK
  Content-Type: text/html;charset=utf-8
  Content-Length: 34
  X-Xss-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Server: WEBrick/1.6.0 (Ruby/2.7.0/2019-12-25)
  Date: Thu, 14 May 2020 08:22:01 GMT
  Connection: Keep-Alive

  {"name":"louis","status":"online"}
  ```

  ```dockerfile
  # Version: 0.0.1
  FROM ubuntu:20.04
  MAINTAINER Louis "louis.tianlu@gmail.com"
  ENV REFRESHED_AT 2020-05-14

  RUN sed -i s@/security.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
  RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
  RUN apt update -y
  RUN apt install -y ruby ruby-dev build-essential redis-tools
  RUN gem install --no-document sinatra json redis

  RUN mkdir -p /opt/webapp

  EXPOSE 4567

  CMD [ "/opt/webapp/bin/webapp" ]
  ```

#### 构建 redis 镜像与容器

  ```bash
  [louis@louis redis]$ tree
  .
  `-- Dockerfile

  sudo docker build -t louistian/redis .
  # 添加 --protected-mode no 否则测试时连接后不能操作
  sudo docker run -d -p 6379 --name redis louistian/redis --protected-mode no

  # 可以在宿主机连接测试
  redis-cli -h 127.0.0.1 -p PORT
  ```

  ```dockerfile
  # Version: 0.0.1
  FROM ubuntu:18.04
  LABEL maintainer="louis.tianlu@gmail.com"
  ENV REFRESHED_AT 2020-05-14

  RUN sed -i s@/security.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
  RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list
  RUN apt update -y
  RUN apt install -y redis-server redis-tools

  EXPOSE 6379

  ENTRYPOINT ["/usr/bin/redis-server"]

  CMD [ ]
  ```

  * docker 自己的网络栈
    * docker 容器公开端口并绑定到本地网络接口, 这样可以把容器里的服务在本地宿主机所在的外部网络
      上公开
    * 内部网络
      * docker0
        * 虚拟的以太网桥, 用于连接容器和本地宿主网络
      * veth*
        * 容器创建时会创建一组互联的网络接口. 接口其中一端作为容器里的 eth0 接口, 另一端统一命
          名为 veth*, 作为宿主机的一个端口
        * 每个 veth* 接口都绑定到 docker0 网桥, 由此创建一个由宿主机和所有容器共享的虚拟子网

      ```bash
      # 宿主机
      # docker0 虚拟网桥
      [louis@louis redis]$ ifconfig
      docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
              inet 172.18.0.1  netmask 255.255.0.0  broadcast 172.18.255.255
              inet6 fe80::42:faff:fe65:fc0  prefixlen 64  scopeid 0x20<link>
              ether 02:42:fa:65:0f:c0  txqueuelen 0  (Ethernet)
              RX packets 76935  bytes 4351084 (4.1 MiB)
              RX errors 0  dropped 0  overruns 0  frame 0
              TX packets 172917  bytes 1111531538 (1.0 GiB)
              TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

      eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
              inet 172.17.0.2  netmask 255.255.240.0  broadcast 172.17.15.255
              inet6 fe80::5054:ff:fe1d:9861  prefixlen 64  scopeid 0x20<link>
              ether 52:54:00:1d:98:61  txqueuelen 1000  (Ethernet)
              RX packets 2232356  bytes 1938976249 (1.8 GiB)
              RX errors 0  dropped 0  overruns 0  frame 0
              TX packets 1259922  bytes 288469632 (275.1 MiB)
              TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

      lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
              inet 127.0.0.1  netmask 255.0.0.0
              inet6 ::1  prefixlen 128  scopeid 0x10<host>
              loop  txqueuelen 1  (Local Loopback)
              RX packets 213  bytes 34695 (33.8 KiB)
              RX errors 0  dropped 0  overruns 0  frame 0
              TX packets 213  bytes 34695 (33.8 KiB)
              TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

      veth36ad046: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
              inet6 fe80::c434:a4ff:fe9a:e233  prefixlen 64  scopeid 0x20<link>
              ether c6:34:a4:9a:e2:33  txqueuelen 0  (Ethernet)
              RX packets 0  bytes 0 (0.0 B)
              RX errors 0  dropped 0  overruns 0  frame 0
              TX packets 7  bytes 578 (578.0 B)
              TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

      vethb6c2a94: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
              inet6 fe80::68b3:89ff:fe9a:6296  prefixlen 64  scopeid 0x20<link>
              ether 6a:b3:89:9a:62:96  txqueuelen 0  (Ethernet)
              RX packets 0  bytes 0 (0.0 B)
              RX errors 0  dropped 0  overruns 0  frame 0
              TX packets 10  bytes 828 (828.0 B)
              TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

      # 容器
      # docker 为容器分配了 IP 172.18.0.3
      root@cb9492edd6b6:/# ifconfig
      eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
              inet 172.18.0.3  netmask 255.255.0.0  broadcast 172.18.255.255
              ether 02:42:ac:12:00:03  txqueuelen 0  (Ethernet)
              RX packets 6639  bytes 31259333 (31.2 MB)
              RX errors 0  dropped 0  overruns 0  frame 0
              TX packets 760  bytes 50193 (50.1 KB)
              TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

      lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
              inet 127.0.0.1  netmask 255.0.0.0
              loop  txqueuelen 1  (Local Loopback)
              RX packets 0  bytes 0 (0.0 B)
              RX errors 0  dropped 0  overruns 0  frame 0
              TX packets 0  bytes 0 (0.0 B)
              TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

      # 容器访问外网, 第一跳就是宿主机网络上的 docker0 接口的网关 IP
      root@cb9492edd6b6:/# traceroute www.baidu.com
      traceroute to www.baidu.com (180.101.49.11), 30 hops max, 60 byte packets
      1  172.18.0.1 (172.18.0.1)  0.028 ms  0.011 ms  0.009 ms
      2  * 100.105.105.130 (100.105.105.130)  2.081 ms  2.970 ms
      3  * 100.104.251.210 (100.104.251.210)  0.643 ms *
      ```

  * 连接 redis
    * 通过映射到宿主机的 PORT
    * 直接使用虚拟子网 IP PORT

      ```bash
      [louis@louis redis]$ sudo docker inspect redis
      [
        {
          "NetworkSettings": {
                "Bridge": "",
                "SandboxID": "868e968ad8ca579357c716c6f6786651c8a1c00efda93f15f7c151a416902d0b",
                "HairpinMode": false,
                "LinkLocalIPv6Address": "",
                "LinkLocalIPv6PrefixLen": 0,
                "Ports": {
                    "6379/tcp": [
                        {
                            "HostIp": "0.0.0.0",
                            "HostPort": "32786"
                        }
                    ]
                },
                "SandboxKey": "/var/run/docker/netns/868e968ad8ca",
                "SecondaryIPAddresses": null,
                "SecondaryIPv6Addresses": null,
                "EndpointID": "3ccba82cda80d3f56e545182d779e4b91c3e905ef03d57c5c17a4f83b582d0fa",
                "Gateway": "172.18.0.1",
                "GlobalIPv6Address": "",
                "GlobalIPv6PrefixLen": 0,
                "IPAddress": "172.18.0.2",
                "IPPrefixLen": 16,
                "IPv6Gateway": "",
                "MacAddress": "02:42:ac:12:00:02",
                "Networks": {
                    "bridge": {
                        "IPAMConfig": null,
                        "Links": null,
                        "Aliases": null,
                        "NetworkID": "7e1e523b599001e0d6b924e457ece4e960ab73aee50bac5f27e5763066570839",
                        "EndpointID": "3ccba82cda80d3f56e545182d779e4b91c3e905ef03d57c5c17a4f83b582d0fa",
                        "Gateway": "172.18.0.1",
                        "IPAddress": "172.18.0.2",
                        "IPPrefixLen": 16,
                        "IPv6Gateway": "",
                        "GlobalIPv6Address": "",
                        "GlobalIPv6PrefixLen": 0,
                        "MacAddress": "02:42:ac:12:00:02",
                        "DriverOpts": null
                    }
                }
            }
        }
      ]

      # 使用映射 PORT
      [louis@louis redis]$ redis-cli -h 127.0.0.1 -p 32786
      127.0.0.1:32786>

      # 直接使用子网 IP PORT
      [louis@louis redis]$ redis-cli -h 172.18.0.2 -p 6379
      172.18.0.2:6379>
      ```

  * 容器互连

    ```bash
    # 确保 redis 容器启动
    sudo docker run -d --name redis louistian/redis

    # --link 建立两个容器间的父子关系
    #         redis 要连接的容器名称
    #         db 连接后容器别名
    [louis@louis sinatra]$ sudo docker run -p 4567 --name webapp --link redis:db -t -i -v $PWD/webapp:/opt/webapp louistian/sinatra /bin/bash

    # 查看连接信息
    root@d99a012cf351:/# cat /etc/hosts
    127.0.0.1	localhost
    172.18.0.2	db 34177ffe0f93 redis
    172.18.0.3	d99a012cf351

    root@d99a012cf351:/# env
    REFRESHED_AT=2020-05-14
    HOSTNAME=d99a012cf351
    PWD=/
    DB_PORT_6379_TCP_ADDR=172.18.0.2
    DB_PORT_6379_TCP=tcp://172.18.0.2:6379
    DB_PORT=tcp://172.18.0.2:6379
    HOME=/root
    ...
    ```

  * 容器通信

    ```bash
    # louistian/sinatra 中启动
    root@d99a012cf351:~# /opt/webapp/bin/webapp &

    # 宿主机请求
    [louis@louis lib]$ curl -i -H 'Accept: application/json' -d 'name=louis&status=online' http://localhost:32790/json
    # 查看 redis 容器数据
    [louis@louis lib]$ curl -i http://localhost:32790/json
    HTTP/1.1 200 OK
    Content-Type: text/html;charset=utf-8
    Content-Length: 46
    X-Xss-Protection: 1; mode=block
    X-Content-Type-Options: nosniff
    X-Frame-Options: SAMEORIGIN
    Server: WEBrick/1.6.0 (Ruby/2.7.0/2019-12-25)
    Date: Fri, 15 May 2020 02:36:13 GMT
    Connection: Keep-Alive

    "[{\"name\":\"louis\",\"status\":\"online\"}]"
    ```

    ```bash
    # /home/louis/studio/sinatra/webapp/lib
    require "rubygems"
    require "sinatra"
    require "json"
    require "redis"

    class App < Sinatra::Application
          redis = Redis.new(:host => 'db', :port => '6379')

          set :bind, '0.0.0.0'

          get '/' do
            "<h1>DockerBook Test Redis-enabled Sinatra app</h1>"
          end

          get '/json' do
            params = redis.get "params"
            params.to_json
          end

          post '/json/?' do
            redis.set "params", [params].to_json
            params.to_json
          end
    end
    ```

> ! docker 学习暂时告一段落, 接下来内容主要以应用为主