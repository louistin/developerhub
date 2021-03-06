# UNIX-LINUX 编程实践教程

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>

[[TOC]]

---

## 01 - Unix 系统编程概述

### 系统编程

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

### 理解 Unix

* 用户登录时, 系统会启动 `shell` 进程, 然后将用户交给这个进程, 由这个进程处理用户请求, 每个
    用户都有属于自己的 `shell` 进程. 用户注销时, 内核会结束所有分配给这个用户的进程.

* Unix 系统中, 文件和目录备被组织成树状结构

    **目录树**<br>
    <img :src="$withBase('/image/note/uulp/01/dir_tree_001.webp')" alt="目录树">

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


## 02 - 用户, 文件操作与联机帮助: 编写 who 命令

### Unix 文件操作

* 文件操作函数

    ```cpp
    open();
    creat();
    read();
    write();
    lseek();
    close();
    ```
    - 每次系统调用都会导致用户模式和内核模式的切换以及执行内核代码, 减少程序中系统调用次数可以
        提高程序运行效率


* 系统调用
    - 程序可以使用缓冲技术来减少系统调用次数, 仅当写缓冲区满或读缓冲区为空时才调用内核服务
    - Unix 内核可以通过内核缓冲区减少访问磁盘 IO 次数
    - 当系统调用出错时, 会将全局变量 `errno` 的值置为响应的错误码, 然后返回 -1
    - `perror(string)` 函数会自动查找错误代码, 在标准错误输出中显示相应的错误信息,
        `string` 为同时显示的描述性信息

### FAQ
1. 理解系统调用 `open` `read` 和 C 标准库 `fopen` `fread` 的原理与区别.


## 03 - 目录与文件属性: 编写 ls
