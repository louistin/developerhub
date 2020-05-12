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