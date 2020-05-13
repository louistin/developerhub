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

* 交互式运行容器 interactive container

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

* 守护式容器 deamonized container

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

* 容器管理

  ```bash
  # 容器详细信息
  sudo docker inspect daemon_dave
  # 选定查看结果
  sudo docker inspect daemon_dave --format '{{ .NetworkSettings.IPAddress }}'

  # 删除所有容器
  sudo docker rm 'sudo docker ps -a -q'
  ```