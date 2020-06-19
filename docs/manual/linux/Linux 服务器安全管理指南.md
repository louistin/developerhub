# Linux 服务器安全管理指南
> 收集总结 Linux 服务器安全管理相关内容<br>
> 内容主要基于 CentOS

## Busybox

[官方网站](https://busybox.net/)

> 有些病毒会修改替换系统命令, 包括 `top` 在内的系统命令都时假的, 此时只能重装系统了. 可以通过
> busybox 来确认是否替换系统命令.

  ```bash
  yum -y install wget make gcc perl glibc-static ncurses-devel libgcrypt-devel
  wget https://busybox.net/downloads/busybox-1.31.1.tar.bz2
  make menuconfig
  make && make install

  ./busybox top
  ```
