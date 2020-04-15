# 01. Unix 系统编程概述

## 系统编程

* 用来容纳操作系统的内存空间叫做系统空间, 容纳应用程序的空间叫做用户空间. 操作系统也叫内核.

* 编写普通程序时, 可以认为程序是直接连接到键盘鼠标显示器等设备, 但是在系统编程时, 必须对系统的
    结构和工作方式有更深的了解, 要知道内核提供哪些服务(系统调用), 如何使用它们, 系统有哪些资
    源和设备, 不同的资源和设备该如何操作.

    - 系统资源
        - 处理器 Processer
        - 输入输出 I/O
        - 进程管理 Process Managerment
        - 内存 Memory
        - 设备 Device
        - 计时器 Timer
        - 进程间通信 Interprocess Communication
        - 网络 Networking

* 系统编程学习方法
    - 分析程序 (它能做什么)
    - 学习系统调用 (它是如何实现的)
    - 编程实现 (能不能自己编写一个)

## 理解 Unix

* 用户登录时, 系统会启动 `shell` 进程, 然后将用户交给这个进程, 由这个进程处理用户请求, 每个
    用户都有属于自己的 `shell` 进程. 用户注销时, 内核会结束所有分配给这个用户的进程.

* Unix 系统中, 文件和目录备被组织成树状结构

    **目录树**<br>
    <img :src="$withBase('/image/os/uulp/01/dir_tree_001.png')" alt="目录树">

    - 目录操作命令
        - `ls`
        - `cd`
        - `pwd`
        - `mkdir` `rmdir`

* 文件操作
    - 文件名命名规则
        - 最长 250 字符
        - 允许大小写字符, 标点符号, 空格, tab, 回车
        - 不允许 "/"
    - 文件操作命令
      - `cat` `more` `less` `pg`
      - `cp`
      - `mv`
      - `rm`
      - `lpr` `lp`
    - 文件许可权限
        ```bash
        [louis@louis build]$ ll more
        -rwxr-xr-x. 1 louis louis 22944 Apr 15 21:28 more

        -rwx  r-x    r-x      read write execute
        user  group  other
        ```

