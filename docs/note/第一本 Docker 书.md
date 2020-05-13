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
  sudo docker rm 'sudo docker ps -a -q'
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
  <img :src="$withBase('/image/note/thedockerbook/04_001_docker文件系统层.png')" alt="Docker 文件系统层">

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

  ```bash
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
    ```