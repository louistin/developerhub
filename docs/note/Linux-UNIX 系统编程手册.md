# Linux-UNIX 系统编程手册

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>
> 针对一直弄不明白的部分先总体阅读, 建立基本的认知体系概念

[[TOC]]

---

## 02 - 基本概念

### 内核

* 侠义上的内核指的是管理和分配计算机资源的核心软件层
* 内核职责
  * 进程调度
    * Linux 属于抢占式多任务操作系统
  * 内存管理
    * Linux 采用虚拟内存管理机制
  * 提供文件系统
  * 创建和终止进程
  * 对设备的访问
  * 联网
  * 提供系统调用应用编程接口 API
* 内核态和用户态
  * 用户态下运行时, CPU 只能访问被标记为用户空间的内存
  * 内核态时, CPU 既能访问用户空间内存, 也能访问内核空间内存, 并且可以执行某特特定操作, 如关
    闭系统
* 以进程及内核视角检视系统
  * 进程间不能直接通信, 进程本身也无法创建出新进程, 进程也不能与计算机外接的输入输出设备通信等
  * 进程间所有通信都要通过内核提供的通信机制完成, 创建新进程, 与设备通信也需要通过内核操作

### shell

* shell 是一种具有特殊用途的程序, 主要用于读取用户输入的命令, 并执行相应的程序以相应命令

### 用户和组

* 系统的每个用户都拥有唯一的登陆用户名和与之相对应的整数型用户ID

### 单根目录层级, 目录, 链接及文件

* 内核维护着一套单根目录结构

### 文件 I/O 模型

* 本质上, 内核只提供一种文件类型: 字节流序列
* UNIX 系统没有文件结束符概念, 读取文件时如无数据返回, 便会认定抵达文件末尾
* 文件描述符, 指代打开的文件的非负整数
  * stdin  0
  * stdout 1
  * stderr 2
* I/O 系统调用层
  * `open(), close(), read(), write()`
* stdio 函数库
  * `fopen(), fclose(), scanf(), printf(), fgets(), fputs()`

### 程序

### 进程

* 进程的内存布局
  * 文本, 程序的指令
  * 数据, 程序使用的静态变量
  * 堆
  * 栈
* 创建进程
  * 系统调用 `fork()` 可以创建一个新进程
  * 内核通过对父进程的复制来创建子进程, 子进程从父进程处继承数据段, 栈段及堆段副本后, 可以修改
    这些内容, 不会影响父进程内容.(其中程序文本标记为只读, 由父子进程共享)
  * 子进程要么去执行父进程共享代码段中的另一组不同函数, 或者使用系统调用 `execve()` 加载并执
    行一个全新程序.
* 进程的终止和终止状态
  * 使用 `_exit()` 系统调用或 `exit()` 库函数退出进程. 进程会指明自己的终止状态
  * 向进程传递信号, 将其杀死. 根据导致进程死亡的信号类型来设置进程的终止状态
  * 0 表示进程正常终止, 非 0 表示有错误. (`$?` 查看前一程序的终止状态)
* init 进程
  * 系统中所有进程都是 init 进程的子进程及孙进程. 其进程号总为 1, 总是以超级用户权限运行

### 内存映射

* 调用系统函数 `mmap()` 的进程, 会在其虚拟地址空间中创建一个新的内存映射
* 由某一进程所映射的内存可以与其他进程的映射共享

### 静态库和共享库

* 静态库
  * 要使用静态库中的函数, 需要在创建程序的链接命令中指定相应的库. 主程序会对静态库中隶属于各目
    标模块的不同函数加以引用. 链接器在解析了引用情况后, 会从库中抽取所需目标模块的副本, 将其复
    制到最终的可执行文件中.
  * 每个程序中都存有所需库内各目标模块的副本, 空间浪费
  * 库函数修改后, 需要重新编译生成新静态库, 所有调用的应用, 都必须与新的静态库重新链接
* 动态库
  * 连接器会在可执行文件中写入一条记录, 以表明可执行文件在运行时需要使用该共享库
  * 节约空间
  * 只需更新共享库文件, 程序就可以在下次执行时自动使用新函数

### 进程间通信及同步

* 进程间通信 IPC
  * 信号, 表示事件的发生
  * 管道和 FIFO, 进程间传递数据
  * 套接字, 同一台或联网的不同主机上运行的进程间传递数据
  * 文件锁定
  * 消息队列, 用于在进程间交换信息
  * 信号量, 同步进程动作
  * 共享内存, 允许两个及以上进程共享一块内存, 当某进程改变了共享内存内容时, 其他所有进程会立刻
    了解到这一变化

### 信号

* 内核, 其他进程或进程自身都可以向进程发送信号
* 发生条件
  * 用户键入中断字符
  * 进程的子进程之一终止
  * 由进程设定的定时器到期
  * 进程尝试访问无效的内存地址
* 进程收到信号后的动作
  * 忽略信号
  * 被信号杀死
  * 先挂起, 之后再被专用信号唤醒

### 线程

* 每个线程都会执行相同的程序代码, 共享同一数据区域和堆. 每个线程都拥有自己的栈, 用来装载本地变
  量和函数调用链接信息
* 线程的主要优点
  * 协同线程间的数据共享(通过全局变量)更为容易
  * 多线程应用可以在多核处理器上并行

### 进程组和 shell 控制任务

* shell 执行的每个程序都会在一个新的进程内发起
  * `$ ls -l | grep "louis"` 2 个进程

### 会话, 控制终端和控制进程

* 会话, 一组进程组
* shell 创建的所有进程组与 shell 自身隶属于同一会话, shell 是此会话的会话首进程
* 断开与终端的连接, 控制进程会收到 SIGHUP 信号

### 伪终端

* 伪终端是一对相互连接的虚拟设备, 在这对设备之间, 设有一条 IPC 信道, 可供数据进程双向传递

### 日期和时间

* 真实时间, 在进程生命期内, 以某个标准时间点为起点测得的时间, UTC 时间
* 进程时间/CPU时间, 进程自启动一来, 所占用的 CPU 时间总量

  ```bash
  [louis@louis ~]$ time ps
    PID TTY          TIME CMD
  24672 pts/2    00:00:00 bash
  30111 pts/2    00:00:00 ps

  real    0m0.007s
  user    0m0.002s
  sys     0m0.005s
  ```

### 客户端服务器架构

### 实时性

### /proc 文件系统

* /proc 文件系统是一种虚拟文件系统, 以文件系统目录和文件形式, 提供一个指向内核数据结构的接口

```bash
[louis@louis ~]$ cd /proc
[louis@louis proc]$ ls
1      12    13667  19    22     24645  261  270    28358  30     5    620   652   7822  buddyinfo  diskstats    iomem      kpagecgroup  modules       scsi           sysvipc      vmstat
10     1215  1399   193   22601  24656  262  271    29     30161  57   621   6811  7864  bus        dma          ioports    kpagecount   mounts        self           thread-self  zoneinfo
10412  1222  14     2     22711  24672  263  272    291    30165  58   6216  6812  7865  cgroups    driver       irq        kpageflags   mtrr          slabinfo       timer_list
1098   1268  1473   20    23     24724  264  27227  295    30230  589  6222  689   8     cmdline    execdomains  kallsyms   loadavg      net           softirqs       timer_stats
11     1278  15     203   24     24825  265  273    29556  303    59   632   7     9     consoles   fb           kcore      locks        pagetypeinfo  stat           tty
1105   13    16     21    24581  24828  266  275    29854  304    60   634   70    914   cpuinfo    filesystems  keys       mdstat       partitions    swaps          uptime
1191   1315  17     2101  24588  25     267  278    29882  392    61   639   71    990   crypto     fs           key-users  meminfo      sched_debug   sys            version
1193   1316  18     2109  24589  260    268  28     3      460    617  651   7819  acpi  devices    interrupts   kmsg       misc         schedstat     sysrq-trigger  vmallocinfo
[louis@louis proc]$ cat version
Linux version 4.4.223-1.el7.elrepo.x86_64 (mockbuild@Build64R7) (gcc version 4.8.5 20150623 (Red Hat 4.8.5-39) (GCC) ) #1 SMP Sat May 9 08:36:51 EDT 2020
[louis@louis proc]$ cd 1473
[louis@louis 1473]$ sudo cat stat
[sudo] password for louis:
1473 (mysqld) S 1 1473 1473 0 -1 4194560 38854 0 35 0 110995 164748 0 0 20 0 43 0 1742 1364955136 85090 18446744073709551615 4194304 59551560 140734682543072 0 0 0 543239 4096 9448 0 0 0 17 0 0 0 68 0 0 59559680 64632192 94765056 140734682550043 140734682550060 140734682550060 140734682550247 0
[louis@louis 1473]$ sudo cat status
Name:   mysqld
State:  S (sleeping)
Tgid:   1473
Ngid:   0
Pid:    1473
PPid:   1
TracerPid:      0
Uid:    27      27      27      27
Gid:    27      27      27      27
FDSize: 64
Groups: 27
NStgid: 1473
NSpid:  1473
NSpgid: 1473
NSsid:  1473
VmPeak:  1335740 kB
VmSize:  1332964 kB
VmLck:         0 kB
VmPin:         0 kB
VmHWM:    364136 kB
VmRSS:    340360 kB
VmData:  1197276 kB
VmStk:       132 kB
VmExe:     54060 kB
VmLib:     10036 kB
VmPTE:      1044 kB
VmPMD:        16 kB
VmSwap:        0 kB
HugetlbPages:          0 kB
Threads:        43
SigQ:   0/15722
SigPnd: 0000000000000000
ShdPnd: 0000000000000000
SigBlk: 0000000000084a07
SigIgn: 0000000000001000
SigCgt: 00000001800024e8
CapInh: 0000000000000000
CapPrm: 0000000000000000
CapEff: 0000000000000000
CapBnd: 0000003fffffffff
CapAmb: 0000000000000000
Seccomp:        0
Speculation_Store_Bypass:       vulnerable
Cpus_allowed:   1
Cpus_allowed_list:      0
Mems_allowed:   00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000000,00000001
Mems_allowed_list:      0
voluntary_ctxt_switches:        253
nonvoluntary_ctxt_switches:     40
```


## 03 - 系统编程概念

无论何时, 只要执行了系统调用或者库函数, 就必须检查调用的返回状态以确定调用是否成功.

### 系统调用

* 内核以应用程序编程接口 API 的形式, 提供一系列服务供程序访问.
* 系统调用将处理器从用户态切换到内核态, 以便 CPU 访问受保护的内核内存
* 系统调用的组成是固定的, 每个系统调用都由一个唯一的数字标识(程序不可知)
* 每个系统调用可辅之一套参数, 对用户空间和内核空间之间传递的信息加以规范

**系统调用的执行步骤**<br>
<img :src="$withBase('/image/note/tlpi/03_001_系统调用的执行步骤.webp')" alt="系统调用的执行步骤">

**系统调用的执行步骤**<br>
<img :src="$withBase('/image/note/tlpi/03_002_系统调用的执行步骤.webp')" alt="系统调用的执行步骤">

### 库函数

* 库函数是比底层调用更为方便的调用接口

### 标准 C 语言函数库: GNU C 语言库 glibc

* 查看动态库依赖及确定 glibc 版本

  ```bash
  [root@louis tmp]# ldd a.out
    linux-vdso.so.1 =>  (0x00007ffce43cf000)
    libc.so.6 => /lib64/libc.so.6 (0x00007fc0257fb000)
    /lib64/ld-linux-x86-64.so.2 (0x00007fc025bc9000)
  [root@louis tmp]# /lib64/libc.so.6
  GNU C Library (GNU libc) stable release version 2.17, by Roland McGrath et al.
  Copyright (C) 2012 Free Software Foundation, Inc.
  This is free software; see the source for copying conditions.
  There is NO warranty; not even for MERCHANTABILITY or FITNESS FOR A
  PARTICULAR PURPOSE.
  Compiled by GNU CC version 4.8.5 20150623 (Red Hat 4.8.5-39).
  Compiled on a Linux 3.10.0 system on 2020-03-31.
  Available extensions:
    The C stubs add-on version 2.1.2.
    crypt add-on version 2.1 by Michael Glad and others
    GNU Libidn by Simon Josefsson
    Native POSIX Threads Library by Ulrich Drepper et al
    BIND-8.2.3-T5B
    RT using linux kernel aio
  libc ABIs: UNIQUE IFUNC
  For bug reporting instructions, please see:
  <http://www.gnu.org/software/libc/bugs.html>.
  ```

  ```cpp
  #include <gnu/libc-version.h>

  // 返回指向版本字符串的指针
  const char *gnu_get_libc_version(void);
  ```

### 处理来自系统调用和库函数的错误

#### 处理系统调用失败

* 系统调用失败时, 会将全局整形变量 errno 设置为一个正值, 以标识具体的错误.
  * 程序应包含 `<errno.h>` 头文件, 提供对 errno 的声明, 及一组针对各种错误编号而定义的常量
  * 这些常量都以 `E` 开头
* 调用系统调用或库函数成功, errno 也不会被重置为 0. 所以在仅从错误检查时, 必须首先检查函数的
  返回值是否表明调用出错, 然后再检查 errno 确定错误原因
* 针对少数调用成功返回 -1 的系统调用, 需要在调用前将 errno 设置为 0, 并在调用后对其进行检查
* 系统调用失败后, 使用库函数 `perror() strerror()` 根据 errno 打印错误消息

  ```cpp
  #include <stdio.h>

  void perror(const char *msg);
  ```
  ```cpp
  #include <string.h>

  // 根据 errnum 错误号, 返回相应的错误字符串
  char *strerror(int errnum);
  ```

#### 处理来自库函数的错误

* 使用前需要查看手册
* 某些库函数错误返回值为 -1, 并以 errno 号来表示具体错误
* 某些库函数在出错时会返回 -1 之外的值, 但仍会设置 errno 来表明具体的出错情况
* 有些函数不适用 errno

### 可移植性问题

* 特性测试宏, 可显露遵循特定标准的定义

  ```bash
  #define _BSD_SOURCE 1

  # 或者
  gcc -D_BSD_SOURCE
  ```

* 系统数据类型
  * SUSv3 规范了各种标准系统数据类型, 每种类型的定义均使用 C 语言的 typedef 特性.
  * 标准系统数据类型大多数以 `_t` 结尾
  * 大部分声明在 `<sys/types.h>`
  * 应用程序应采用这些类型定义(而非原生 C 语言类型)来声明其使用的变量, 才能保证可移植性
* 打印系统数据类型值
  * 一般的应对策略是强制转换相应值为 long 类型后, 再使用 `%ld` 限定符
  * `off_t` 大小与 long long 相当, 一般使用 `%lld` 限定符

    ```cpp
    pid_t mypid = getpid();
    printf("%ld\n", (long) mypid);
    ```
* 初始化操作和使用结构
  * 结构体内部成员顺序不做规范, 所以初始化时必须对每一个成员进行初始化
  * C99 新的初始化方法

    ```cpp
    struct sembuf {
      unsigned short sem_num;
      short sem_op;
      sgort sem_flg;
    };

    struct sembuf s = { .sem_num = 3, .sem_op = -1, .sem_flg = SEM_UNDO };
    ```


## 04 - 文件 I/O: 通用的 I/O 模型

* 文件描述符用以表示所有类型的已打开文件, 包括管道(pipe), FIFO, socket, 终端, 设备和普通文
  件, 针对每个进程, 文件描述符都自成一套
  * 头文件 `<unistd.h>`

  **标准文件描述符**<br>
  <img :src="$withBase('/image/note/tlpi/04_001_标准文件描述符.webp')" alt="标准文件描述符">

* 通用 I/O
  * 系统调用 `open() read() write() close()` 可以对所有类型的文件执行 I/O 操作

  ```cpp
  #include <sys/stat.h>
  #include <fcntl.h>

  // flags 位掩码
  //    O_RDONLY O_WRONLY O_RDWR 等
  // mode 当调用 open() 创建新文件时, 位掩码参数 mode 指定了文件的访问权限, open 未指定
  //      O_CREAT 标志, 则省略 mode 参数
  // 调用成功返回文件描述符(进程未使用的最小文件描述符)
  // 调用失败返回 -1, 并将 errno 置为相应的错误标识
  int open(const char *pathname, int flags, .../* mode_t mode */);

  #include <unistd.h>

  // count 指定最多能读取的字节数
  // 调用成功返回实际读取的字节数
  // 遇到 EOF 返回 0
  // 出现错误返回 -1
  // size_t 无符号整数类型
  // ssize_t 有符号整数类型
  // read() 能够从文件中读取任意序列的字节, 包括文本及二进制数据等, 所以需要手动在 buffer
  //   尾部添加 '\0', 同时 count == sizeof(buff) - 1
  ssize_t read(int fd, void *buffer, size_t count);

  // 调用成功返回实际写入的字节数
  // 对磁盘文件执行 I/O 操作时, write() 调用成功并不能保证数据已经写入磁盘, 内核会缓存磁盘
  //    I/O 操作
  ssize_t write(int fd, void *buffer, size_t count);

  // 应该对 close() 系统调用进行错误检查
  int close(int fd);
  ```

  **open() 系统调用的 flags 参数值**<br>
  <img :src="$withBase('/image/note/tlpi/04_002_open()系统调用的flags参数值.webp')" alt="open() 系统调用的 flags 参数值">

* 改变文件偏移量 lseek()
  * 调整内核中与文件描述符相关的文件偏移量记录, 不引起任何对物理设备的访问

  ```cpp
  #include <unistd.h>

  // offset 指定一个以字节为单位的数值
  // whence 执行操作的基点
  //    SEEK_SET  (offset 必须为非负数)
  //    SEEK_CUR
  //    SEEK_END
  // 调用成功返回新的文件偏移量
  off_t lseek(int fd, off_t offset, int whence);
  ```

* 文件空洞
  * 如果程序的文件偏移量已经越过文件结尾, 然后再执行 I/O 操作, `read()` 返回 0, `write()`
    可以在文件结尾后的任意位置写入数据.
  * 从文件结尾到新写入数据间的这段空间被称为文件空洞
  * 文件空洞不占用任何磁盘空间, 直到后续某个点时, 在文件空洞中写入了数据, 文件系统才会为之分配
    磁盘块
  * 文件空洞的优势在于, 与为实际需要的空字节分配磁盘块相比, 系数填充的文件会占用较少的磁盘空间

* 通用 I/O 模型外的操作 ioctl()

  ```cpp
  #include <sys/ioctl.h>

  // request 指定了将在 fd 上执行的控制操作
  // argp 一般根据 request 的参数值来确定 argp 期望的类型
  int ioctl(int fd, int request, ... /* argp */);
  ```


## 06 - 进程

### 进程和程序

* 进程 process
  * 由内核定义的抽象的实体, 并为该实体分配用以执行程序的各项系统资源
* 进程组成部分
  * 用户内存空间
    * 程序代码
    * 代码所使用的变量
  * 一系列内核数据结构
    * 维护进程状态信息
      * 进程标识号
      * 虚拟内存表
      * 打开的文件描述符
      * 信号传递及处理的有关信息
      * ...

* 程序
  * 包含了一系列信息的文件, 这些信息描述了如何在运行时创建一个进程
* 程序包含内容
  * 二进制格式标识, a.out 等
  * 机器语言指令: 对程序算法进行编码
  * 程序入口地址: 表示程序开始执行时的起始指令位置
  * 数据
  * 符号表及重定位表
  * 共享库和动态链接信息
  * 其他信息

### 进程号和父进程号

* 每个进程都有一个进程号 PID, 进程号是一个正数, 用以唯一标识系统中的某个进程
  * Linux 内核限制进程号 <=32767
  * 新进程创建时, 内核按顺序将分配下一个可用进程号. 当达到 32767 时, 内核重置计数器,
    从 300 重新开始
    * <300 为系统进程及守护进程
  * `/proc/sys/kernel/pid_max` 调整进程号上限 (值: 最大进程号 + 1)

* 每个进程都有一个创建自己的父进程 PPID
  * init 进程号为 1, 是所有进程的十足

* 相关指令及代码

    ```cpp
    #include <unistd.h>

    // 返回调用进程进程号
    pid_t getpid(void);
    // 返回父进程进程号
    pid_t getppid(void);
    ```

    ```bash
    [root@louis ~]# cat /proc/sys/kernel/pid_max
    32768

    # nginx master PID 651
    [root@louis ~]# cat /proc/651/status
    Name:	nginx
    State:	S (sleeping)
    Tgid:	651
    Ngid:	0
    Pid:	651
    PPid:	1
    TracerPid:	0
    Uid:	0	0	0	0
    Gid:	0	0	0	0
    FDSize:	64
    ...

    # 查看进程 PID 对应的家族树 family tree
    [root@louis ~]# pstree 1
    systemd─┬─acpid
            ├─2*[agetty]
            ├─atd
            ├─auditd───{auditd}
            ├─containerd─┬─containerd-shim─┬─bash
            │            │                 └─9*[{containerd-shim}]
            │            └─8*[{containerd}]
            ...
            ├─mysqld───38*[{mysqld}]
            ├─nginx───nginx
            ...
    ```

### 进程内存布局

* 每个进程所分配的内存由很多段(segment) 组成
  * 文本段 text
    * 只读
    * 可共享
      * 一份程序代码的拷贝可以映射到多个进程的虚拟地址空间中
  * 初始化数据段 user-initialized data
    * 显式初始化的全局变量和静态变量
    * 程序加载到内存时, 从可执行文件中读取这些变量的值
  * 未初始化数据段 zero-initialized data
    * 未显式初始化的全局变量和静态变量
    * 程序启动前本段内存初始化为 0
    * 可执行文件只记录未初始化数据段的位置及所需大小, 运行时再由程序加载器分配空间
    * 又称 BSS 段
  * 栈 stack
    * 动态增长和收缩的段, 由栈帧(stack frames) 组成
    * 栈帧中存储了函数的局部变量(即自动变量), 实参和返回值
  * 堆 heap
    * 在运行时动态进行内存分配的区域
    * 堆顶端称作 program break

* 二进制可执行文件显示

  ```bash
  [louis@louis studio]$ size a.out
  text	   data	    bss	    dec	    hex	filename
  2635	    620	      4	   3259	    cbb	a.out
  ```

  **典型的进程内存结构**<br>
  <img :src="$withBase('/image/note/tlpi/06_001_典型的进程内存结构.webp')" alt="典型的进程内存结构">

  ```cpp
  // C语言编程环境提供3个全局符号, 必须显式声明
  extern char etext, edata, end;
  ```


* 程序变量在进程内存各段中的位置

  ```cpp
  // 使用非优化编译器, 在 ABI 中, 通过栈来传递所有参数
  #include <stdio.h>
  #include <stdlib.h>

  char global_buff[1024];       // zero-initialized data segment
  int primes[] = {2, 3, 4, 5};  // user-initialized data seament

  static int square(int x) {    // stack frame of square()
    int result;                 // stack frame of square()
    result = x * x;
    return result;              // return value passed via register
  }

  int main(int argc, char *argv[]) {  // stack frame of main()
    static int key = 100;       // user-initialized data seament
    static mbuf[10240];         // zero-initialized data seament
    char *p;                    // stack frame of main()

    p = malloc(1024);           // points to memory in heap segment

    int s = square(key);

    exit(EXIT_SUCCESS);
  }
  ```

### 虚拟内存管理

* Linux 内核采用虚拟内存管理技术, 利用访问局部性(locality of reference), 高效使用 CPU
  和 RAM
  * 空间局部性 Spatial locality, 程序倾向于访问最近访问过的内存地址附近的内存(顺序执行)
  * 时间局部性 Temporal locality, 程序倾向于短期内再次访问刚被访问过的内存(循环等)
* 虚拟内存规划
  * 将内阁程序使用的内存分割成为小型固定大小的页 Page 单元. 同时将 RAM 划分为一系列与虚拟内
    存页相同的页帧
  * 任一时刻, 每个程序仅有部分页需要驻留在 RAM 内存页帧中, 这些页构成驻留集 resident set
  * 程序未使用的页拷贝保存在交换区 swap area, 即磁盘空间的保留区与, 仅在需要时才会载入内存
  * 程序访问的页面不在内存中时, 将会发生页面错误 page fault, 内核挂起进程的执行, 并从磁盘
    将该页面载入内存
* 页表 page table
  * 描述每页在进程虚拟地址空间 virtual address space 中的位置
  * 页表中每个条目指出一个虚拟页面在 RAM 中的位置, 或表明其当前驻留在磁盘
  * 在进程虚拟地址空间中, 不是所有地址范围都需要页表条目. 进程试图访问的地址无页表条目对应时
    将会收到 SIGSEVG 信号
* 虚拟内存管理
  * 分页内存管理单元 PMMU 将要访问的每个虚拟内存地址转换成相应的物理内存地址, 虚拟内存地址没
    所对应的页没有驻留于 RAM 中时, 将以页面错误通知内核
  * 虚拟内存管理使虚拟地址空间与 RAM 物理地址空间隔离开来
    * 进程与进程, 进程与内核相互隔离
    * 适当条件下, 两个或更多进程能够共享内存
      * 执行同意程序的多个进程, 共享一份只读的程序代码副本
      * 进程通过 `shmget()` `mmap()` 系统调用显式请求与其他进程共享内存区, 用于进程间通信
    * 便于实现内存保护机制, 对页表条目标记可读/可写/可执行等, 多进程共享 RAM 页面时互不干扰
    * 程序员无需关注程序在 RAM 中的内存布局
    * 需要驻留在 RAM 中的仅是程序的一部分, 加快程序加载, 同时一个进程所占的虚拟内存大小能够
      超出 RAM 容量
    * 减少每个进程使用的 RAM, RAM 中可同时容纳多个进程

  **虚拟内存概览**<br>
  <img :src="$withBase('/image/note/tlpi/06_002_虚拟内存概览.webp')" alt="虚拟内存概览">

### 栈和栈帧

* Linux 栈驻留在内存的高端并向下增长
  * 专用寄存器, 栈指针用于跟踪当前栈顶.
  * 每次调用函数时, 会在栈上新分配一帧, 函数返回时, 再从栈上将此帧移除.
  * 栈帧释放后, 栈大小并未减少(在分配新栈帧时, 会对这些内存重新加以利用)
* 内核栈是每个进程保留在内核内存中的内存区域, 在执行系统中调用的过程中供(内核)内部函数调用使用
* 用户栈帧
  * 函数实参和局部变量
    * 调用函数时自动创建
  * (函数)调用的链接信息: CPU 寄存器
    * 函数调用另一函数时, 会在被调用函数的栈帧中保存这些寄存器的副本, 以便函数返回时能为函数
      调用这将寄存器恢复原状
* 函数能够嵌套调用, 所以栈中也可能有多个栈帧

  **进程栈**<br>
  <img :src="$withBase('/image/note/tlpi/06_003_进程栈.webp')" alt="进程栈">

### 命令行参数 `(argc, argv)`

* int argc
  * 命令行参数个数
* char *argv[]
  * 指向命令行参数的指针数组, 指针列表以 NULL 指针结尾
* `getopt()` 库函数解析命令行选项

### 环境列表

* 每个进程都有与其相关的称之为环境列表 environment list 的字符串数组
  * 每个字符串亿 name=value 形式定义
* 新进程创建时, 会继承其父进程的环境副本. 创建成功后, 二者环境变量相互不可见且无关

  ```bash
  # 添加环境变量
  export SHELL=/bin/bash

  # 显示当前环境列表
  [louis@louis root]$ printenv
  XDG_SESSION_ID=36
  HOSTNAME=louis
  SHELL=/bin/bash
  TERM=xterm
  HISTSIZE=3000
  SSH_CLIENT=117.147.24.5 13009 22
  SSH_TTY=/dev/pts/1
  USER=louis

  # 查看进程环境列表
  cat /proc/PID/environ
  ```

* 从程序中访问环境

  **进程环境列表数据结构**<br>
  <img :src="$withBase('/image/note/tlpi/06_004_进程环境列表数据结构.webp')" alt="进程环境列表数据结构">

  ```cpp
  #include <stdlib.h>

  // 从进程环境中检索单个值
  char *getenv(const char *name);
  // 向环境中添加一个变量
  int setenv(const char *name, const char *value, int overwrite);
  // 从环境中移除由 name 参数标识的变量
  int unsetenv(const char *name);
  // 清除整个环境
  int clearenv(void);
  ```

### 执行非局部跳转 `setjmp()` `longjmp()`


## 07 - 内存分配

### 在堆上分配内存

* 进程可以通过增加堆的大小来分配内存
  * 堆是一段长度可变的连续虚拟内存
  * 堆的当前内存边界称为 program break
* 调整 program break
  * `int brk(void *end_data_segment)`
    * end_data_segment 低于初始值 %end 时, 导致未知错误
  * `void *sbrk(intptr_t increment)`
    * 返回指向新分配内存起始位置的指针

* `malloc()` `free()`
  * `malloc()`
    * `malloc()` 返回的内存块采用的字节对齐方式总是适宜于高效访问任何类型的 C 语言数据结构
    * 无法分配内存返回 NULL, 并设置 errno 以返回错误信息
    * 实现
      * 首先扫描之前由 `free()` 释放的空闲内存块列表, 寻找尺寸大于等于要求的空闲内存
      * 正好相当则直接将其返回给调用者, 大于则进行分割, 返回所需的内存, 同时将剩下的那块空闲
        内存保留在空闲列表中
      * 如果空闲内存列表中找不到足够大的空闲内存, 则会调用 `sbrk()` 分配更多内存(以虚拟内存
        页大小的数倍来增加 program break), 并将超出部分置于空闲内存列表
  * `free()`
    * `free()` 并不降低 program break 位置, 而是将这块内存添加到空闲内存列表中, 供后续
      `malloc()` 函数循环使用
    * 传参为 NULL, 什么也不做
    * 对同一 ptr 重复调用 `free()` 将会报错并产生不可预知结果
    * 实现
      * `free()` 将内存块至于空闲内存列表(双向链表)之上
      * `malloc()` 分配内存时, 会额外分配几个自己来存放内存大小的整数值. 该值位于内存块起
        始处, 实际返回给调用者的内存地址位于长度记录字节之后
      * `free()` 使用内存块本身空间来存放链表指针, 将其自身添加到链表中
      * 空闲内存列表中的空闲内存和已分配内存一般混杂在一起
  * 遵守规则
    * 分配内存后, 不要改变内存范围外的任何内容
    * 不用多次释放同一块已分配内存
    * `free()` 不能释放非 malloc 函数包中函数所返回的指针
    * 避免内存泄露

  **malloc 返回的内存块**<br>
  <img :src="$withBase('/image/note/tlpi/06_005_malloc返回的内存块.webp')" alt="malloc 返回的内存块">

  **空闲列表中的内存块**<br>
  <img :src="$withBase('/image/note/tlpi/06_006_空闲列表中的内存块.webp')" alt="空闲列表中的内存块">

  **包含有已分配内存和空闲内存列表的堆**<br>
  <img :src="$withBase('/image/note/tlpi/06_007_包含有已分配内存和空闲内存列表的堆.webp')" alt="包含有已分配内存和空闲内存列表的堆">

* 调试工具和库
  * 工具
    * `mtrace()` `muntrace()`
    * `mcheck()` `mprobe()`
    * MALLOC_CHECK
  * 库
    * Valgrind
    * Insure++

* 在堆上分配内存的其他方法
  * `calloc()`
    * 将已分配内存初始化为 0
  * `realloc()`
    * 调整 `malloc()` 分配的内存大小
    * 不会对额外增加的字节初始化
    * 首先试图合并空闲列表中紧随其后的满足大小需求的内存块, 原内存块位于顶部则对堆进行扩展,
      位于中部且紧邻其后空闲内存空间大小不足时, 会重新分配一块新内存, 并复制原有数据
    * 可能会移动内存, 且占用 CPU 资源较大, 尽量避免使用
    * 失败返回 NULL, 成功返回新的地址

  ```cpp
  #include <stdlib>

  // 将 program break 设置为 end_data_segment 所指定的位置
  int brk(void *end_data_segment);
  // 将 program break 在原有地址上增加参数 increment 传入的大小
  void *sbrk(intptr_t increment);

  void *malloc(size_t size);
  void free(void *ptr);

  // numitems 分配对象数量, size 每个对象大小
  void *calloc(size_t numitems, size_t size);
  // size 期望值, 不要直接使用 ptr = realloc(ptr, size);
  void *realloc(void *ptr, size_t size);
  ```

### 在栈上分配内存

* `alloca()`
  * 不能在函数的参数列表中调用
* 相对 `malloc()` 的优势
  * 速度快, 编译器将其作为内联代码处理, 直接调整栈指针来实现, 无需维护空闲内存块列表
  * 随栈帧的移除而自动释放

  ```cpp
  #include <alloca.h>

  void *alloca(size_t size);
  ```

  ```cpp
  // 用法
  void *y;
  y = alloca(size);
  func(x, y, z);
  ```


## 13 - 文件 I/O 缓冲

* 出于速度和效率的考虑, 系统 I/O 调用(内核调用)和标准 C 语言库 I/O 函数(stdio 函数)在操作
  磁盘文件时会对数据进行缓冲

### 文件 I/O 的内核缓冲: 缓冲区高速缓存

* `raed()` 和 `write()` 系统调用在操作磁盘文件时不会直接发起磁盘访问, 而是仅在用户空间缓冲
  区和内核缓冲区高速缓存间复制数据.
  * 对于 write 函数调用后立刻返回, 在后续某个时刻, 内核会将其缓冲区中数据写入磁盘
  * 对于 read 函数, 内核会从磁盘中读取数据并存储到内核缓冲区中, read 调用将从缓冲区读取数据

### stdio 库的缓冲

* 操作磁盘文件时, 缓冲大块数据减少系统调用
* C 语言函数库 I/O 函数都带有缓冲
  * `fprintf()`, `fscanf()`, `fputs()`, `fgets()`, `fputc()`, `fgetc()`


  ```c
  #include <stdio.h>

  // stdio 库缓冲区控制函数
  // buff 为 NULL 时为 stream 自动分配缓冲区, 忽略 szie
  //      不为 NULL, 以其指向大小为size 的内存块作为 stream 的缓冲区
  // mode _IONBUF 不缓冲
  //      _IOLBF 行缓冲
  //      _LOFBF 全缓冲 (缓冲区满为止)
  int setvbuf(FILE *stream, char *buf, int mode, size_t size);

  // 相当于 setvbuf(stream, buf, (buf != NULL) ? _IOFBUF : _IONBUF, BUFSIZE);
  // BUFSIZE 8192
  void setbuf(FILE *stream, char *buf);

  // 相当于 setvbuf(stream, buf, (buf != NULL) ? _IOFBUF : _IONBUF, size);
  void setbufex(FILE *stream, char *buf, size_t size);

  // stream NULL 刷新所有 stdio 缓冲区
  // 关闭相应流时, 将自动刷新其缓冲区
  int fflush(FILE *stream);
  ```

### 控制文件 I/O 的内核缓冲

* 两种同步 I/O 完成类型(区别设计用于描述文件的元数据)
  * synchronized I/O data integrity completion
    * 确保针对文件的一次更新传递了足够的信息到磁盘, 以便之后对数据的获取
  * synchronized I/O file integrity completion
    * 前一种的超集
    * 在对文件的一次更新过程中, 要将所有发生更新的文件元数据都传递到磁盘上, 即使有些在后续对
      文件数据的操作中并不需要

  ```cpp
  #include <unistd.h>

  // 使缓冲数据和于fd相关的所有元数据都刷新到磁盘上, synchronized I/O file integrity completion
  int fsync(int fd);

  // 可能会减少对磁盘的操作次数, synchronized I/O data integrity completion
  int fdatasync(int fd);

  // 会使包含更新文件信息的所有内核缓冲区刷新到磁盘上
  void sync(void);
  ```

* 使所有写入同步: O_SYNC
  * synchronized I/O file integrity completion
  * `fd = open(pathname, OWRONLY | O_SYNC);`
  * 使用 O_SYNC 或频繁调用上述函数对性能影响极大
  * 不推荐在打开文件时就使用 O_SYNC 标志, 如果需要强制刷新内核缓冲区, 考虑使用大尺寸 `write()`
    缓冲区, 或谨慎调用上述函数
* O_DSYNC, O_RSYNC
  * O_DSYNC
    * synchronized I/O data integrity completion
  * O_RSYNC
    * 配和 O_DSYNC, O_SYNC 将这些标志对写操作的作用结合到读操作中

  **I/O 缓冲**<br>
  <img :src="$withBase('/image/note/tlpi/13_001_IO缓冲.webp')" alt="I/O 缓冲">

### 就 I/O 模式向内核提出建议

* 内核可以根据(但不必要) `posix_fadvise()` 所提供的信息来优化对缓冲区高速缓存的使用

### 绕过缓冲区高速缓存: 直接 I/O

* 直接 I/O direct I/O
  * 应用程序在执行磁盘 I/O 时绕过缓冲区高速缓存, 从用户空间直接将数据传递到文件或磁盘设备
  * 直接 I/O 只适用于有特定 I/O 需求的应用, 如数据库.
  * `fd = open(pathname, RDONLY | O_DIRECT);` 打开指定标志 `O_DIRECT`
* 直接 I/O 对齐限制
  * 用于传递数据的缓冲区, 其内存边界必须对齐为块大小的整数倍
  * 数据传输的开始点, 即文件和设备的偏移量, 必须是块大小的整数倍
  * 带传递数据的长度必须时块大小的整数倍
  * 未对齐导致 EINVAL 错误

### 混合使用库函数和系统调用进行文件 I/O

* I/O 系统调用会直接将数据传递到内核缓冲区高速缓存
* stdio 库函数会等到用户空间的流缓冲区填满, 再调用 `write()` 将其传递到内核缓冲区高速缓存
* 可以使用 `fflush()` 规避混用问题

```cpp
#include <stdio.h>

// 返回对应的文件描述符
int fileno(FILE *stream);
// 创建使用该文件描述符进行文件 I/O 的流
FILE *fdopen(int fd, const char *mode);
```


## 20 - 信号: 基本概念

### 概念和概述

* 信号是事件发生时对进程的通知机制, 也称之为软中断.
* 一个进程能够向另一个进程发送信号(可将其作为一种同步机制), 也可以向自身发送信号.
* 信号产生条件
  * 硬件发生异常, 如引用无法访问的内存区域
  * 用户键入能够产生信号的终端特殊字符, 如键入 `Ctrl + C`
  * 发生了软件事件, 如终端窗口大小调整
* 每个信号, 都定义了一个唯一的正数, 从 1 开始顺序展开. `<signal.h>` 定义形如 `SIGxxxx`
* 信号分类
  * 标准信号, 内核向进程通知事件, 编号 [1, 31]
  * 实时信号
* 信号在产生后, 会稍后被传递给某一进程, 在产生和到达期间, 信号处于等待(pending)状态. 如果需
  要确保一段代码不为传递来的信号所中断, 可以将信号添加到信号掩码中, 会阻止该信号的到达, 直到
  稍后对其解除阻塞
* 信号到达后, 进程默认操作
  * 忽略信号
  * 终止进程, 异常终止
  * 产生核心转储文件, 同事进程终止
  * 停止进程, 暂停进程执行
  * 于之前暂停后再度恢复进程的执行
* 程序对信号的处置(disposition)设置
  * 采取默认行为
  * 忽略信号: 内核将信号丢失
  * 执行信号处理器程序(程序员编写)
    * 建立信号处理器程序, 即通知内核应当去调用某一处理器程序的行为
    * 信号已处理(handled), 即调用信号处理器程序以响应传递来的信号
  * 无法将信号处置设置为终止进程或转储核心
    * 近似操作为调用 `exit()` 或 `abort()`
* `proc/PID/status` 可以通过各种掩码位字段确定进程对信号的处理

### 信号类型和默认行为

### 改变信号处置 `signal()`

* 优先使用 `sigaction()`
* `signal()`

  ```cpp
  #include <signal.h>

  typedef void (*sighandler_t)(int);

  // handler 也可替换为
  //    SIG_DFL 将信号处置重置为默认值
  //    SIG_IGN 忽略该信号
  // 成功返回先前的信号处置, 即先前的 handler 函数地址, 或 SIG_DFL SIG_IGN
  // 失败返回 SIG_ERR
  sighandler_t signal(int signum, sighandler_t handler);

  void handler(int sig) {
    printf("%d\n", sig);
  }
  ```

* 当指定信号传递给进程时会调用信号处理函数
* 调用信号处理函数, 可能会随时打断主程序流程, 内核代表进程来调用处理函数, 函数返回时, 主程序会
  在中断的位置恢复执行

  **信号到达并执行处理器程序**<br>
  <img :src="$withBase('/image/note/tlpi/20_001_信号处理函数.webp')" alt="信号到达并执行处理器程序">

### 发送信号 `kill()`

* 一个进程可以使用 `kill()` 系统调用向另一进程发送信号

  ```cpp
  #include <signal.h>

  int kill(pid_t pid, int sig);
  ```

  * pid 参数是一个或多个目标进程, sig 指定要发送的信号
    * pid > 0, 发送信号给 pid 指定的进程
    * pid == 0, 发送信号给与调用进程同组的每个进程, 包括调用进程自身
    * pid < -1, 向组 ID 等于该 pid 绝对值的进程组内所有下属进程发送信号
    * pid == -1, 调用进程有权将信号发往每个目标进程, 除去 init 和调用进程自身. 这种信号发
      送方式也称之为广播信号.
  * 如果无进程与指定 pid 相匹配, `kill()` 调用失败, 同时将 errno 设置为 ESRCH
  * 进程要发送信号给另一个进程, 需要适当的权限
    * 特权级进程可以向任何进程发送信号
    * 以 root 用户和组运行的 init 进程是一种特例, 仅能接收已安装了处理器函数的信号
    * 如果发送者的实际或有效用户 ID 匹配于接受者的实际用户 ID 或者保存设置用户 ID, 那么非特
      权进程也可以向另一进程发送信号
    * SIGCONT 信号需要特殊处理
  * 如果进程无权发送信号给所请求的 pid, 那么 kill() 调用将失败, 且将 errno 置为 EPERM

### 检查进程的存在

* 将 sig 参数指定为 0, 则无信号发送, 但 `kill()` 会去执行错误检查, 查看是否可以向目标进程
  发送信号. 这样可以利用空信号检测具有特定进程 ID 的进程是否存在.
  * 发送失败, 且 errno 为 ESRCH, 表明进程不存在
  * 发送失败, 且 errno 为 EPERM, 或调用成功, 表示进程存在
* 上述方式并不能保证特定程序仍在运行, 因为此进程 ID 有可能为重用

> TODO: 这部分内容看的不是很明白

### 发送信号的其他方式

  ```cpp
  #include <signal.h>

  // 进程向自身发送信号, 立即执行
  // sig 无效时发生错误 EINVAL
  int raise(int sig);

  // 向某一进程组的所有成员发送一个信号, pgrp 为 0 时, 向调用者所属的进程组的所有进程发送信号
  int kill(pid_t pgrp, int sig);
  ```

### 显示信号描述

  ```cpp
  #define _GNU_SOURCE
  #include <string.h>

  // 返回指向针对该信号的可打印描述字符串, 或者当信号编号无效时指向错误字符串
  // 信号描述位于数组 sys_siglist 中
  char *strsignal(int sig);

  #include <signal.h>

  // 在标准错误输出上, 显示 msg 所给定的字符串 + ":" + 对应于 sig 的信号描述
  void psignal(int sig, const char *msg);
  ```

### 信号集

* 信号集, 可以表示多个信号的数据结构, 数据类型为 `sigset_t`

  ```cpp
  #include <signal.h>

  // 两种初始化方式
  // 初始化一个未包含任何成员的信号集
  int sigemptyset(sigset_t *set);
  // 初始化一个信号集, 包含所有实时信号
  int sigfillset(sigset_t *set);

  // 向集合中添加单个信号
  int sigaddset(sigset_t *set, int sig);
  // 从集合中删除单个信号
  int sigdelset(sigset_t *set, int sig);

  int sigismember(const sigset_t *set, int sig);

  #define _GNU_SOURCE

  int sigandset(sigset_t *set, sigset_t *left, sigset_t *right);
  int sigorset(sigset_t *set, sigset_t *left, sigset_t *right);
  int sigisemptyset(sigset_t *set);
  ```

### 信号掩码

* 内核会为每个进程维护一个信号掩码, 并将阻塞其针对该进程的传递, 直到从进程信号掩码中移除该信号

  ```cpp
  #include <signal.h>

  // how 指定函数想给信号掩码带来的变化
  // SIG_BLOCK 将信号掩码这只为当前值和 set 的并集
  // SIG_UNBLOCK 将 set 中的信号从信号掩码中移除
  // SIG_SETMASK 将 set 指向的信号集赋给信号掩码
  // set 为空则将忽略 how 参数
  // lodset 不为空则指向一个 sigset_t 结构缓冲区, 返回之前的信号掩码
  int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);

  // 系统会忽略试图阻塞 SIGKILL, SIGSTOP 的信号请求
  // 以下将阻塞出 SIGKILL SIGSTOP 外的所有信号
  sigfillset(&blockset);
  if (sigprocmask(SIG_BLOCK, &blockset, NULL) == -1) {
    perror("sigprocmask");
  }
  ```

### 处于等待状态的信号

* 进程接受了一个该进程正在阻塞的信号, 会将该信号添加到进程的等待信号集中, 解除阻塞后, 会将信号
  传递给此进程

  ```cpp
  #include <signal.h>

  // 获取处于等待状态的信号集
  int sigpending(sigset_t *set);

  #include <unistd.h>
  // 暂停程序执行, 直到信号处理器函数中断该调用为止(或直到一个未处理信号终止进程为止)
  int pause(void);
  ```

* 等待信号集只是一个掩码, 仅表明信号是否发生, 不表明发生次数. 同一信号在阻塞状态下, 即使发生
  多次, 在解除阻塞后也只会传递一次


## 24 - 进程的创建

### fork() exit() wait() execve()


## 29 - 线程

### 概述

* 一个进程可以包含多个线程, 传统意义上的 UNIX 进程是只包含一个线程的多线程程序特例
* 同一进程中的所有线程均会独立执行相同的程序, 且共享同一份全局内存域, 其中包括初始化数据段, 未
    初始化数据段, 堆内存段
* 同一进程中的多个线程可以并发, 多核处理器中多线程可以并行

  **同时执行4个线程的进程**<br>
  <img :src="$withBase('/image/note/tlpi/29_001_同时执行4个线程的进程.webp')" alt="同时执行4个线程的进程">

* 线程间共享内容
  * 进程 ID
  * 进程组 ID 与 会话 ID
  * 打开的文件描述符
  ...
* 各线程独有
  * 线程 ID (`pthread_self()` 与 `gettid()` 的值并不相同, 前者来自线程库, 后者来自内核)
  * 信号掩码
  * 线程特有数据
  * errno 变量
  * 栈, 本地变量和函数的调用链接信息
  ...

### Pthreads API 的详细背景

* Pthreads 数据类型

  ```cpp
  pthread_t
  pthread_cond_t
  pthread_mutex_t
  pthread_key_t
  pthread_once_t
  pthread_attr_t
  ```

* 线程和 errno
  * 多线程程序中, 每个线程都有属于自己的 errno
* Pthreads 函数返回值
  * 所有 Pthreads 函数均以返回值 0 表示成功, 返回一正值表示失败, 此时的返回值与传统 UNIX
    调用置于 errno 的值含义相同
* 编译 Pthreads 程序
  * `gcc -pthread`

### 线程 API

* 创建线程
  * pthread 创建后无法确定系统如何调度线程使用 CPU 资源

  ```cpp
  // thread
  // attr 指定新线程的各种属性, 一般为 NULL
  int pthread_create(pthread_t *thread, const phread_attr_t *attr, void*(*start)(void *), void *arg);
  ```

* 终止线程
  * 线程 `start()` 函数执行 return 语句并返回指定值
  * 线程调用 `pthread_exit()`
  * 调用 `pthread_cancel()` 取消线程
  * 任意线程调用 `exit()` (此时所有线程都将立即终止) 或主线程执行了 return 语句
* 主线程调用 `pthread_exit()` 而非 `exit()` 或 return 语句, 其他线程将继续运行
  * 线程可以调用 `pthread_exit()` 独立退出

  ```cpp
  // retval 指定线程返回值, 另一线程通过调用 pthread_join() 获取
  // retval 值不要分配于线程栈中, 线程终止后, 可能无效
  void pthread_exit(void *retval);
  ```


* 示例

  ```cpp
  #include <pthread.h>
  #include <stdio.h>
  #include <stdlib.h>
  #include <string.h>
  #include <unistd.h>

  char *ret = NULL;

  void *pthread_sub(void *arg) {
    printf("I am sub thread: %ld.\n", (long)pthread_self());

    sleep(1);

    printf("sub thread over.\n");

    ret = (char *)malloc(32);
    memset(ret, 0, sizeof(ret));
    sprintf(ret, "%s", "sub thread");

    pthread_exit(ret);

  #if 0
    exit(0);
  #endif

    return ret;
  }

  int main(int argc, char *argv[]) {
    pthread_t tid;

    pthread_create(&tid, NULL, pthread_sub, NULL);

    printf("I am main thread.\n");

    char *retval = NULL;
  #if 0
    pthread_exit(NULL);
  #elif 1
    pthread_join(tid, (void **)&retval);
  #elif 0
    pthread_detach(tid);
  #elif 0
    sleep(5);
  #elif 0
    pthread_join(pthread_self(), NULL);
  #endif

    printf("main thread over, retval: %s.\n", retval);

    return 0;
  }
  ```

### 线程 ID

* Linux 中线程 ID 在所有进程中是唯一的
* `pthread_create()` 向调用者返回线程 ID
* 线程获取自身线程 ID

  ```cpp
  pthread_t pthread_self(void);

  // pthread_t 应视作是不透明的, Linux 中实现为 unsigned long
  int pthread_equal(pthread_t t1, pthread_t t2);
  ```

### 连接 (joining) 已终止的线程

* `pthread_join()` 等待线程 thread 的终止, 如果已终止, 则立即返回
* 传入一个已连接的 thread 将会导致无法预知的行为
* 如果线程未分离 (detached), 则必须使用 `pthread_join()` 来进行连接, 否则会导致僵尸线程
* 线程间关系对等, 进程中的任意线程都可以调用 `pthread_join()` 与该进程的任意其他线程连接

  ```cpp
  // retval 保存线程终止时的返回值的拷贝, pthread_exit() 或 return 返回值
  int pthread_join(pthread_t thread, void **retval);
  ```

### 线程的分离

* 当不关心线程的返回状态, 只希望系统在线程终止时自动清理移除的, 可以调用 `pthread_detach()`
  并向 thread 参数传入指定线程的标识符, 将该线程标记为处于分离状态
* 一旦线程处于 detached 状态, 就不能再使用 `pthread_join()` 获取状态, 也不能再恢复可连接
  状态
* 其他线程调用 `exit()` 或主线程执行 return, 处于 detached 状态的线程也还是会受到影响, 会
  立刻终止

  ```cpp
  // 只控制线程终止之后发生的事情, 而非何时或如何终止
  int pthread_detach(pthread_t thread);
  ```

### 线程属性

* 使用分离属性创建线程

  ```cpp
  pthread_t thr;
  pthread_attr_t attr;
  int s;

  s = pthread_arrt_init(&attr);
  s = pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED);
  s = pthread_create(&thr, &attr, thread_func, NULL);
  S = pthread_attr_destroy(&attr);

  ```

### 线程 VS 进程

* 线程优点
  * 线程间共享数据简单
  * 创建线程速度快
* 线程缺点
  * 多线程编程时, 需要确保调用线程安全(thread-safe) 的函数, 或者以线程安全的方式来调用函数
  * 某个线程中的 bug 可能会危及该进程的所有线程, 因为他们共享着相同的地址空间和其他属性
  * 每个线程都在争用输注进程中有限的虚拟地址空间
* 其他
  * 多线程应用中应避免使用信号
  * 所有线程必须运行同一个程序(可能是位于不同函数中)
  * 除数据外, 线程还可以共享某些其他信息(文件描述符等)


## 30 - 线程: 线程同步

多线程应用必须使用互斥量和条件变量等同步原语来协调对共享变量的访问. 互斥量提供了对共享变量的独
占式访问. 条件变量允许一个或多个线程等候通知: 其他线程改变了共享变量的状态.

### 互斥量 mutex: 保护对共享变量的访问

  * 临界区
    * 访问某一共享资源的代码片段, 并且这段代码的执行应为原子操作
  * 加锁和解锁互斥量
    * 其他线程已锁定该互斥量, 则另一线程所定时会阻塞直到该互斥量被解锁
    * 死锁问题
      * 同一线程重复锁定互斥量
    * 错误用法
      * 解锁未锁定互斥量
      * 解锁由其他线程锁定的互斥量
  * 其他变体
    * `pthread_mutex_trylock()`
    * `pthread_mutex_timedlock()`
  * 避免死锁问题
    * 方案一, 定义互斥量的层级关系 (设计好层级关系)
    * 方案二, 在锁定第一个互斥量后, 使用 `pthread_mutex_trylock()` 尝试锁定其他互斥量,
      失败就全部解锁, 再重试. (效率低, 但灵活)
  * 动态初始化场景
    * 动态分配于堆中的互斥量
    * 互斥量是在栈中分配的自动变量
    * 初始化经由静态分配, 且不使用默认属性的互斥量
  * 自动或动态分配的互斥量销毁
    * 只有当互斥量处于未锁定状态, 且后续也无任何线程企图锁定它时
    * 动态内存 free 前应将其互斥量 destroy
    * destroy 后的互斥量可以调用 init 重新初始化

  ```cpp
  #include <pthread.h>

  // 静态分配的互斥量, 无需 destroy
  pthread_mutex_t mtx = PTHREAD_MUTEX_INITIALIZER;

  int pthread_mutex_lock(pthread_mutex_t *mutex);
  int pthread_mutex_unlock(pthread_mutex_t *mutex);

  // 动态初始化互斥量
  int pthread_mutex_init(pthread_t *mutex, const pthread_mutexattr_t *attr);
  int pthread_mutex_destroy(pthread_mutex_t *mutex);
  ```

### 条件变量 condition variable: 通知状态的改变

* 条件变量允许一个线程就某个共享变量的状态变化通知其他线程, 并让其他线程等待(阻塞于)这一通知.
* 条件变量并不保存状态信息, 只是传递应用程序状态的一种通讯机制
* `pthread_cond_wait()` 执行步骤
  * 解锁互斥量 mutex
  * 阻塞线程调用, 直至另一线程就条件变量发出信号
  * 重新锁定 mutex
* 动态初始化场景
  * 自动或动态分配的条件变量
  * 未采用默认属性经由静态分配的条件变量
* 自动或动态分配的条件变量销毁
  * 没有任何线程在等待它时
  * 动态内存 free 前应将其条件变量 destroy
  * destroy 后的条件变量可以调用 init 重新初始化
* 测试条件变量的判断的条件
  * 必须使用 while 而不是 if 来控制对 `pthread_connd_wait()` 的调用. 因为当代码从阻塞返
    回时, 并不能确定判断条件的状态, 所以应该立即重新检查判断条件, 在条件不满足的情况下继续休眠.
    * 其他线程可能会率先获取互斥量并改变相关共享变量的状态
    * 设计时设置 "宽松的" 判断条件获取更简单, 使用条件变量表示可能性而非确定性
    * 可能会发生虚假唤醒情况. 在一些实现中, 即使没有任何其他线程真的就条件变量发出信号, 等待条
      件变量的线程仍有可能醒来

  ```cpp
  #include <pthread.h>

  // 静态分配的条件变量
  pthread_cond_t cond = PTHREAD_COND_INITIALIZER;

  // 至少唤醒任意一个等待线程 (适用所有线程执行完全相同的任务)
  int pthread_cond_signal(pthread_cond_t *conf);
  // 唤醒所有阻塞的线程 (适用所有线程执行的任务不同)
  int pthread_cond_broadcast(pthread_cond_t *conf);
  int pthread_cond_wait(pthread_cond_t *conf, pthread_mutex_t *mutex);
  // abstime 指定时间到期且无相关条件变量的通知, 返回 ETIMEOUT 错误
  int pthread_cond_wait(pthread_cond_t *conf, pthread_mutex_t *mutex, const struct timespec *abstime);

  int pthread_cond_init(pthread_cont_t *cond, pthread_condattr_t *attr);
  int pthread_cond_destroy(pthread_cond_t *cond);
  ```

  ```cpp
  int msgsvr_queue_read(void *handler, msgsvr_message_t *message) {
    msgsvr_queue_t *queue = (msgsvr_queue_t *)handler;
    msgsvr_message_t *__message = NULL;

    pthread_mutex_lock(&queue->mutex);
    // 使用 while 而非 if
    // 不能对判断条件的状态进行假设
    while (queue->queue->empty()) {
      pthread_cond_wait(&queue->c_cond, &queue->mutex);
    }

    __message = (msgsvr_message_t *)queue->queue->front();
    queue->queue->pop();

    pthread_mutex_unlock(&queue->mutex);
    pthread_cond_signal(&queue->p_cond);

    if (!__message) {
      return ERROR;
    }

    memcpy(message, __message, sizeof(msgsvr_message_t));
    free(__message);
    __message = NULL;

    return OK;
  }

  int msgsvr_queue_write(void *handler, msgsvr_message_t *message) {
    msgsvr_queue_t *queue = (msgsvr_queue_t *)handler;

    pthread_mutex_lock(&queue->mutex);
    while (queue->queue->size() >= queue->size) {
      pthread_cond_wait(&queue->p_cond, &queue->mutex);
    }

    queue->queue->push(message);

    pthread_mutex_unlock(&queue->mutex);
    pthread_cond_signal(&queue->c_cond);

    return OK;
  }
  ```


## 31 - 线程: 线程安全和每线程存储

### 线程安全 (再论可重入性)

* 若一个函数可由多个线程同时安全调用, 则称之为线程安全的函数. 使用全局或静态变量是导致函数非线程
  安全的通常原因.
* 多线程应用中, 保障非线程安全函数安全的方法
  * 运用互斥锁来防护对该函数的所有调用.
    * 可能带来性能的下降
  * 仅在函数中操作共享变量(临界区)的代码前后加入互斥锁
* 如能避免使用全局或静态变量, 可重入函数无需使用互斥量即可实现线程安全


## 32 - 线程: 线程取消

###


## 33 - 线程: 更多细节

### 线程栈

* 创建线程时, 每个线程都有一个属于自己的固定大小的线程栈. 主线程栈的空间大, 其他所有线程缺省大
  小 (2M 32位, 32M 64位)
  * `ulimit -s` 查看默认线程栈大小
* 操作线程栈大小函数
  * `pthread_attr_setstacksize()`
  * `pthread_attr_setstack()`

### 线程和信号

* 不要将线程和信号混合使用, 只要可能多线程应用程序的设计应该避免使用信号
* 如果多线程应用必须处理异步信号的话, 最简洁的做法是所有的线程都阻塞信号, 创建一个专门的线程调
  用 `sigwait()` 函数来接收收到的信号, 这个线程可以安全的执行共享内存修改和调用非异步信号安全
  的函数

### 线程和进程控制

* 线程和 `exec()`
  * 只要由任一线程调用了 `exec()` 系列函数之一, 调用程序将被完全替换, 除了调用线程外, 其他线
    程将会立即消失
* 线程和 `fork()`
  * 当多线程进程调用 `fork()` 时, 仅会将发起调用的线程复制到子进程中, 其他线程均会在子进程中
    立刻消失
    * 此时子进程中会保留全局变量及 Pthreads 对象等
    * 有可能导致子进程内存泄漏
  * 只有当其后紧跟 `exec()` 调用时, 因为新程序会覆盖原内存, 才推荐在多线程程序中调用 `fork()`
* 线程与 `exit()`
  * 任何线程调用了 `exit()`, 或主线程执行 return, 所有线程都将会消失


## 41 - 共享库基础

### 静态库

```bash
# 创建静态库
# -g 包含调试信息
gcc -g -c mod1.c mod2.c mod3.c
ar r libdemo.a mod1.o mod2.o mod3.o
rm mod1.o mod2.o mod3.o

# 显示目录表
ar tv libevent.a
rw-rw-r-- 1000/1000  70088 May 25 09:52 2020 event.o
rw-rw-r-- 1000/1000  31504 May 25 09:52 2020 buffer.o
rw-rw-r-- 1000/1000  32464 May 25 09:52 2020 evbuffer.o

# 删除模块
ar d libdemo.a mod3.o

# 使用静态库
# 可执行文件会包含所有被链接进程序的目标文件的副本
# 链接器只会包含程序需要的模块
# 链接实际上是由一个单独的链接器程序 ld 来完成的, 调用 gcc 时, 编译器会在后台调用 ld
gcc -g -o prog prog.o libdemo.a
# 将静态库放在链接器搜索的其中一个标准目录中 (如 /usr/lib)
gcc -g -o prog prog.o -ldemo
# 指定链接器搜索的额外目录
gcc -g -o prog prog.o -LLIBDIR -ldemO
```

### 共享库

* 当地一个需要共享库中的模块的程序启动时, 库的单个副本就会在运行时被加载进内存. 当后面使用同一共
  享库的其他程序启动时, 他们也会使用已经被加载进内存的库的副本.
  * 共享库的代码是由多个进程共享, 但其中变量不是, 每个使用库的进程会拥有自己在库中定义的全局和
    静态变量的副本
* 共享库的创建和使用

  ```bash
  [louis@louis shared_lib]$ ls
  mod1.c  mod1.h  mod2.c  mod2.h  prog.c
  [louis@louis shared_lib]$ gcc -c -fPIC -Wall mod1.c mod2.c
  [louis@louis shared_lib]$ ls
  mod1.c  mod1.h  mod1.o  mod2.c  mod2.h  mod2.o  prog.c
  [louis@louis shared_lib]$ gcc -g -shared -Wl,-soname,libdemo.so.1 -o libdemo.so.1.0.1 mod1.o mod2.o
  [louis@louis shared_lib]$ ls
  libdemo.so.1.0.1  mod1.c  mod1.h  mod1.o  mod2.c  mod2.h  mod2.o  prog.c
  [louis@louis shared_lib]$ ln -s libdemo.so.1.0.1 libdemo.so.1
  [louis@louis shared_lib]$ ln -s libdemo.so.1.0.1 libdemo.so
  [louis@louis shared_lib]$ ll
  total 36
  lrwxrwxrwx 1 louis louis   16 Jun 25 12:20 libdemo.so -> libdemo.so.1.0.1
  lrwxrwxrwx 1 louis louis   16 Jun 25 12:20 libdemo.so.1 -> libdemo.so.1.0.1
  -rwxrwxr-x 1 louis louis 8104 Jun 25 12:20 libdemo.so.1.0.1
  -rw-rw-r-- 1 louis louis   89 Jun 25 12:17 mod1.c
  -rw-rw-r-- 1 louis louis   67 Jun 25 12:16 mod1.h
  -rw-rw-r-- 1 louis louis 1544 Jun 25 12:19 mod1.o
  -rw-rw-r-- 1 louis louis   89 Jun 25 12:18 mod2.c
  -rw-rw-r-- 1 louis louis   67 Jun 25 12:17 mod2.h
  -rw-rw-r-- 1 louis louis 1544 Jun 25 12:19 mod2.o
  -rw-rw-r-- 1 louis louis  125 Jun 25 12:18 prog.c
  [louis@louis shared_lib]$ gcc -g -Wall -o prog prog.c -L. -ldemo
  [louis@louis shared_lib]$ LD_LIBRARY_PATH=. ./prog
  called mod1
  called mod2
  [louis@louis shared_lib]$ ldd libdemo.so
    linux-vdso.so.1 =>  (0x00007ffc939eb000)
    libc.so.6 => /lib64/libc.so.6 (0x00007f9075bc1000)
    /lib64/ld-linux-x86-64.so.2 (0x00007f9076191000)
  ```


## 63 - 其他备选的 I/O 模型

### 整体概览

* 非阻塞式 I/O 可以让我们轮询某个文件内描述符上是否可以执行 I/O 操作. (轮询浪费 CPU)
* 多进程/多线程能够同时检查多个文件描述符, 看其中任何一个是否可以执行 I/O 操作. (编程复杂)

* I/O 模型
  * I/O 多路复用允许进程同时检查多个文件描述符以找出其中的任何一个是否可以执行 I/O 操作.
    * `select()`, `poll()`
  * 信号驱动 I/O 当有输入或数据可写时, 内核向请求数据的进程发送一个信号. 检查大量文件描述符时
    信号驱动 I/O 相比 `select()`, `poll()` 提升显著
  * epoll API Linux 专有特性
    * 能够让应用程序高效地检查大量文件描述符
    * 同信号驱动 I/O 模型相比避免了处理信号的复杂性, 可以指定想要检查的事件类型, 可以选择水平
      触发或边缘触发的进程通知形式
  * 三个 I/O 模型都是用来实现 **同时检查多个文件描述符, 看 I/O 系统调用是否可以非阻塞执行**

* 水平触发
  * 如果文件描述符上可以非阻塞地执行 I/O 系统调用, 此时认为它已经就绪, 触发通知
  * 收到通知时, 程序可以在任意时刻重复检查文件描述符的就绪状态
  * `select()`, `poll()`, `epoll()`
* 边缘触发
  * 如果文件描述符自上次状态检查以来有了新的 I/O 活动, 此时就会触发通知
  * 收到事件通知后, 程序在某个时刻应该在相应的文件描述符上尽可能多的执行 I/O
  * 程序采用循环来对文件描述符执行尽可能多的 I/O 时, 每个被检查的文件描述符应该置于非阻塞模式,
    在得到 I/O 事件通知后重复执行 I/O 操作, 直到相应的系统调用 `read()` `write()` 以错误
    码 EAGAIN 或 EWOULDBLOCK 形式失败
  * 信号驱动 I/O, `epoll()`

### I/O 多路复用

* `select()`

  ```cpp
  #include <sys/select.h>

  // nfd 设置为 3 个文件描述符集所包含的最大文件描述符 + 1
  // readfds 检测输入是否就绪的文件描述符集合
  // writefds 检测输出是否就绪的文件描述符集合
  // exceptfds 检测异常情况是否发生的文件描述符集合
  //    异常包括: 流式套接字上接收到了带外数据; 连接到处于信包模式下的伪终端主设备上的从设备状态发生了改变
  // timeout 控制 select() 阻塞行为
  //    设置为 NULL 一直阻塞到有文件描述符就绪
  //    设置为 0 只是简单轮询指定的文件描述符集, 查看是否有就绪的文件描述符并立刻返回
  //    设置为大于 0 最长阻塞相应的时间
  int select(int nfds, fd_set *readfds, fd_set *writefds, fd_set *exceptfds, struct timeval *timeout);

  void FD_ZERO(fd_set *fdset);    // 将 fdset 指向的集合初始化为空
  void FD_SET(int fd, fd_set *fdset); // 将 fd 添加到 fdset
  void FD_CLR(int fd, fd_set *fdset); // 将 fd 从 fdset 中移除
  int FD_ISSET(int fd, fd_set *fdset);  // 判断 fd 是否为 fdset 成员
  ```

  * `fdset` 最大容量限制为 `FD_SETSIZE 1024`
  * timeout 设置为非 0 值时, 返回条件是:
    * 三个文件描述符集至少有一个就绪
    * 该调用被信号处理例程中断
    * timeout 超时
  * `select()` 就绪返回或被信号中断, timeout 不为空时, 会被修改为表示剩余超时时间值
  * `select()` 返回值
    * -1 表示有错误发生
      * EBADF 传入字符集中有一个文件描述符非法
      * EINTR 该调用被信号处理例程中断
    * 0 无文件描述符就绪, 调用超时
    * `n > 0` 有 n 个文件描述符就绪. 同一文件描述符可以被多个信号集中被指定

  * 编程示例

    ```cpp
    #include <sys/select.h>
    #include <sys/time.h>
    #include <stdio.h>

    int main(int argc, char const *argv[]) {
      fd_set readfds, writefds;
      int ready, nfds, fd, num_read, j;
      struct timeval timeout;
      struct timeval *pto;
      char buf[16];

      // 修改 pto 值为 NULL 或 timeout 值为 0, 大于 0
      pto = &timeout;
      timeout.tv_sec = 0;
      timeout.tv_usec = 0;

      nfds = 0;
      // readfds writefds 大小固定为 FD_SETSIZE
      FD_ZERO(&readfds);
      FD_ZERO(&writefds);

      nfds = nfds > 0 ? nfds : 0 + 1;
      FD_SET(0, &readfds);

      nfds = nfds > 1 ? nfds : 1 + 1;
      FD_SET(1, &writefds);

      ready = select(nfds, &readfds, &writefds, NULL, pto);
      if (ready == -1) {
        perror("select");
        return -1;
      }

      printf("ready: %d\n", ready);

      for (fd = 0; fd < nfds; fd++) {
        printf("%d: %s%s\n", fd, FD_ISSET(fd, &readfds) ? "r" : "", FD_ISSET(fd, &writefds) ? "w" : "");
      }

      if (pto != NULL) {
        printf("timeout after select(): %ld.%03ld\n", (long) timeout.tv_sec, (long) timeout.tv_usec / 1000);
      }

      return 0;
    }
    ```
    ```bash
    [louis@louis 63]$ ./select
    ready: 1
    0:
    1: w
    timeout after select(): 9.999
    ```

    * 性能
      * 适用场景
        * 待检查的文件描述符范围较小(最大文件描述符号较低)
        * 有大量的文件描述符待检查, 但分布很集中
      * 存在的问题
        * 每次调用时, 内核都必须检查所有被指定的文件描述符, 看其是否处于就绪态
        * 每次调用, 程序都必须传递一个表示所有需要被检查的文件描述符的数据结构到内核, 内核检
          查过描述符后, 修改这个数据结构并返回给程序. 这个数据结构的大小固定为 FD_SETSIZE
        * 调用完成后, 程序必须检查返回的数据结构中的每个元素, 以确定哪个描述符处于就绪状态
        * 随着待检查文件描述符的增加, CPU 资源占用也会随之增加

* `poll()`

  ```c
  #include <poll.h>

  struct pollfd {
    int fd;
    short events;
    short revents;
  };

  // fds 需要检查的文件描述符数组
  //    events 调用时初始化指定需要为描述符 fd 做检查的事件
  //    revents 返回时表示该文件描述符上实际发生的事件
  // nfds 指定数组 fds 中元素的个数
  int poll(struct pollfd fds[], nfds_t nfds, int timeout);
  ```

  > TODO: 关于 `poll()` 的部分, 暂时不做过多讨论

### 信号驱动 I/O

* 信号驱动 I/O 中, 当文件描述符上可执行 I/O 操作时, 进程请求内核为自己发送一个信号. 之后进程
  久可以执行任何其他任务直到 I/O 就绪位置, 此时内核会发送信号给进程.

  * 编程范例

    ```cpp
    #include <signal.h>
    #include <ctype.h>
    #include <fcntl.h>
    #include <unistd.h>
    #include <stdio.h>
    #include <string.h>

    static volatile sig_atomic_t got_sigio = 0;

    // 信号处理例程
    static void sigio_handler(int sig) {
      printf("sigio handler.\n");
      got_sigio = 1;
    }

    int main(int argc, char const *argv[]) {
      int flags, j, cnt;
      char str[32];
      char ch;
      struct sigaction sa;
      int done;

      sigemptyset(&sa.sa_mask);
      sa.sa_flags = SA_RESTART;
      // 1. 为内核发送的通知信号安装一个信号处理例程
      sa.sa_handler = sigio_handler;
      if (sigaction(SIGIO, &sa, NULL) == -1) {
        perror("sigaction");
        return -1;
      }

      // 2. 设定文件描述符的属主, 即接收通知信号的进程或进程组
      //    参数 pid 为负值时, 其绝对值为进程组 ID 号
      if (fcntl(STDIN_FILENO, F_SETOWN, getpid()) == -1) {
        perror("fcntl(F_SETOWN)");
        return -1;
      }

      // 获取接收信号的进程或进程组 ID 号, 其中进程组 ID 号为负数
      // id = fcntl(fd, F_GETOWN);

      flags = fcntl(STDIN_FILENO, F_GETFL); // 获取当前 flags
      // 3. 设定 O_NONBLOCK 使能非阻塞 I/O
      //        O_ASYNC 使能信号驱动 I/O
      if (fcntl(STDIN_FILENO, F_SETFL, flags | O_ASYNC | O_NONBLOCK) == -1) {
        perror("fcntl(F_SETFL)");
        return -1;
      }

      // TODO: 这里需要做什么暂时没搞清楚
      // 5. 调用进程可以执行其他任务, 当 I/O 操作就绪时, 内核会为进程发送一个信号, 然后调用
      //    1 中设置的信号处理例程

      // 6. 信号驱动 I/O 是边缘触发通知, 一旦进程被通知 I/O 就绪, 应尽可能多的执行 I/O, 直到
      // 系统调用失败位置, 此时错误码为 EAGAIN 或 EWOULDBLOCK
      if (got_sigio) {
        while (read(STDIN_FILENO, &ch, 1) > 0) {
          printf("cnt = %d, read %c\n", cnt, ch);
        }
      }

      return 0;
    }
    ```

    > TODO: 信号驱动 I/O 暂时没看完

### `epoll` 编程接口

* 优点
  * 检查大量文件描述符时, 性能比 `select()`, `poll()` 好
  * epoll API 既支持水平触发又支持边缘触发
* epoll API 核心数据结构称为 epoll 实例.
  * 记录了在进程中声明过的感兴趣的文件描述符列表 interest list
  * 维护了处于 I/O 就绪态的文件描述符列表 ready list
* `/proc/sys/fs/epoll/max_user_watches` 每个用户可以注册到 epoll 实例上的文件描述总数
* 多线程程序中, 可以在一个线程中使用 `epoll_ctl()` 将文件描述符添加到另一个线程中由 `epoll_wait`
  所监视的 epoll 实例的兴趣列表中.

  ```cpp
  #include <sys/epoll.h>

  // 创建 epoll 实例
  // size 指定想要通过 epoll 实例来检查的文件描述符个数, 不是上限, 只是告诉内核应该为内部
  //      数据结构划分的初始大小
  // 返回代表新创建的 epoll 实例的文件描述符. 用完需要 close()
  int epoll_create(int size);
  int epoll_create1(int flags);

  typedef union epoll_data {
    void *ptr;
    int fd;
    unit32_t u32;
    unit64_t u64;
  } epoll_data_t;

  struct epoll_event {
    unit32_t events;  // 该描述符上已经发生的事件掩码
    epoll_data_t data;
  };

  // 修改 epoll 兴趣列表
  // epfd epoll 实例
  // fd 要修改的兴趣列表中的文件描述符, 可以为管道, FIFO, Socket, POSIX 消息队列,
  //    inotify 实例, 总段, 设备, 另一个 epoll 实例的文件描述符
  // op
  //    EPOLL_CTL_ADD 向兴趣列表中添加 fd, 添加已存在 fd 则报错 EEXIST
  //    EPOLL_CTL_MOD 修改 fd 设定事件, 使用 ev 指向的信息, 修改不存在 fd 则报错 ENOENT
  //    EPOLL_CTL_DEL 从兴趣列表中删除 fd, 忽略参数 ev, 移除不存在 fd 则报错 ENOENT
  //                  关闭文件描述符将会自动从所有 epoll 实例兴趣列表中移除
  int epoll_ctl(int opfd, int op, int fd, struct epoll_event *ev);

  // 事件等待
  // epfd epoll 实例
  // evlist 就绪文件描述符(空间由调用者申请, 包含元素个数为 maxevents)
  // timeout 确定阻塞行为
  //    -1, 调用一直阻塞, 直到兴趣列表中文件描述符上有事件产生或捕获到一个信号
  //     0, 执行一次非阻塞式检查, 查看兴趣列表中的文件描述符上产生了哪个事件
  //   > 0, 阻塞至多 timeout 毫秒, 直到兴趣列表中文件描述符上有事件产生或捕获到一个信号
  // 调用成功返回数组 evlist 中元素个数; 没有就绪的返回 0; 出错返回 -1, 并在errno 中设定错误码
  int epoll_wait(int epfd, struct epoll_event *evlist, int maxevents, int timeout);
  ```

* epoll 事件

  **epoll 中 events 字段上的位掩码值**<br>
  <img :src="$withBase('/image/note/tlpi/63_epoll_events_mask.webp')" alt="epoll 中 events 字段上的位掩码值">

  * EPOLLONESHOT
    * 文件描述符处于就绪后, 就会在兴趣列表中被标记为非激活状态(未被删除), 直到通过
      `epoll_ctl() EPOLL_CTL_MOD` 再次激活

* 深入探究 epoll
  * 当 `epoll_create()` 创建一个 epoll 实例时, 内核在内存中创建一个新的 i-node 并打开文
    件描述 file description (打开文件的上下文信息数据结构, 由内核管理), 随后在调用进程中为
    打开的这个文件描述分配一个新的文件描述符 file discriptor (一个整数, 用户空间). 同 epoll
    实例的兴趣列表相关联的是打开的文件描述, 而不是 epoll 文件描述符.
    * 当使用 `dup()` 复制一个 epoll 文件描述符, 那么被复制的文件描述符所指代的 epoll 兴趣
      列表和就绪列表同原始的 epoll 文件描述符相同. 二者通过 `epoll_ctl()` 操作的效果一致
    * `fork()` 调用后, 子进程通过继承复制了父进程的 epoll 文件描述符, 效果同上
  * 执行 `epoll_ctl()` 的 EPOLL_CTL_ADD 操作时, 内核在 epoll 兴趣列表中添加一个元素,
    这个元素同时记录了需要检查的文件描述符数量(多个文件描述符可以对应一个文件描述)以及对应的打
    开文件描述的引用
  * `epoll_wait()` 调用的目的就是让内核负责监视打开的文件描述. 一旦所有指向打开的文件描述的
    文件描述符都被关闭后, 这个打开的文件描述将从 epoll 的兴趣列表中移除

* epoll 同 I/O 多路复用的性能对比
  * 每次调用 select/poll 时, 内核必须检查所有在调用中指定的文件描述符.<br>
    当通过 `epoll_ctl()` 指定了需要监视的文件描述符时, 内核会在与打开的文件描述符上下文相关
    联的列表中记录该描述符. 之后每当执行 I/O 操作使得文件描述符称为就绪态时, 内核就在 epoll
    描述符的就绪列表中添加一个元素. 之后 `epoll_wait()` 调用就从就绪列表中简单的取出这些元素
  * 每次调用 select/poll 时, 我们传递一个标记hi了所有待监视的文件描述符的数据结构给内核, 调
    用返回时, 内核将所有标记为就绪态的文件描述符的数据结构再传给我们.<br>
    epoll 中使用 `epoll_ctl()` 在内核空间中建立一个数据结构, 该数据结构会将待监视的文件描
    述符都记录下来, 一旦这个数据结构建立完成, 后面每次调用 `epoll_wait()` 时就不需要再传递
    任何与文件描述符有关的信息给内核, 调用返回的信息中只包含那些已经处于就绪态的描述符
  * select 每次调用前需要先初始化输入数据, select/poll 都必须对返回的数据结构做检查, 以找出
    N 个文件描述符中哪些是处于就绪态的<br>
    epoll 调用返回的信息中只包含那些已经处于就绪态的描述符

* 边缘触发通知
  * 默认情况下 epoll 提供的是水平触发通知, epoll 会告诉我们何时能在文件描述符上以非阻塞的方
    式执行 I/O 操作
  * 边缘触发方式
    * 告诉我们自上一次调用 `epoll_wait()` 以来文件描述符上是都已经有 I/O 活动了
    * 如果有多个 I/O 事件发生的话, epoll 会将其合并成一次单独通知, 通过 `epoll_wait()` 返回
  * 水平触发与边缘触发区别
    * 当对就绪的文件描述符再次调用 `epoll_wait()`, 水平触发机制将会告诉我们套接字处于就绪
      状态; 边缘触发机制 `epoll_wait()` 调用将会阻塞
  * 边缘触发通知机制程序基本框架
    * 让所有待监视的文件描述符都成为非阻塞的
    * 通过 `epoll_ctl()` 构建 epoll 的兴趣列表
    * 通过如下的循环处理 I/O 事件
      * 通过 `epoll_wait()` 取得处于就绪态的描述符列表
      * 针对每一个处于就绪态的文件描述符, 不断进行 I/O 处理直到相关的系统调用(`read()`, `write()`,
        `recv()`, `send()`, `accept()`) 返回 EAGAIN 或 EWOULDBLOCK 错误
  * 采用边缘触发机制时避免出现文件描述符饥饿现象
    * 调用 `epoll_wait()` 监视文件描述符, 并将处于就绪态的描述符添加到应用程序维护的列表中
    * 在应用程序维护的列表中, 只在那些已经注册为就绪态的文件描述符上进行一定限度的 I/O 操作,
      当相关的非阻塞 I/O 系统调用出现 EAGAIN 或 EWOULDBLOCK 错误时, 文件描述符就可以在应
      用程序维护的列表中移除

  ```cpp
  #include <sys/epoll.h>
  #include <fcntl.h>
  #include <stdio.h>
  #include <string.h>
  #include <errno.h>

  #define MAX_BUF   1024
  #define MAX_EVENTS  8

  // $ mkfifo p q
  // $ ./demo_epoll p q     # 终端 1
  // $ cat > p              # 终端 2
  int main(int argc, char const *argv[]) {
    int epfd, ready, fd, s, j, num_open_fds;
    struct epoll_event ev;
    struct epoll_event evlist[MAX_EVENTS];
    char buf[MAX_BUF];

    if (argc < 2 || strcasecmp(argv[1], "--help") == 0) {
      printf("usage: %s file ...\n", argv[0]);
      return -1;
    }

    epfd = epoll_create(argc - 1);
    if (epfd == -1) {
      printf("epoll_create error.\n");
      return -1;
    }

    for (j = 1; j < argc; j++) {
      fd = open(argv[j], O_RDONLY);
      if (fd == -1) {
        printf("open %s error.\n", argv[j]);
        return -1;
      }

      printf("opened \"%s\" on fd %d.\n", argv[j], fd);

      ev.events = EPOLLIN;
      ev.data.fd = fd;
      if (epoll_ctl(epfd, EPOLL_CTL_ADD, fd, &ev) == -1) {
        printf("epoll_ctl error.\n");
        return -1;
      }

      num_open_fds = argc - 1;

      while (num_open_fds > 0) {
        printf("about to epoll_wait()\n");

        ready = epoll_wait(epfd, evlist, MAX_EVENTS, -1);
        if (ready == -1) {
          if (errno == EINTR) {
            continue;
          } else {
            printf("epoll_wait error.\n");
            return -1;
          }
        }

        printf("ready: %d\n", ready);

        for (j = 0; j < ready; j++) {
          printf("  fd = %d; events: %s%s%s\n", evlist[j].data.fd,
                  (evlist[j].events & EPOLLIN) ? "EPOLLIN " : "",
                  (evlist[j].events & EPOLLHUP) ? "EPOLLHUP " : "",
                  (evlist[j].events & EPOLLERR) ? "EPOLLERR " : "");

          if (evlist[j].events & EPOLLIN) {
            s = read(evlist[j].data.fd, buf, MAX_BUF);
            if (s == -1) {
              printf("read error.\n");
              return -1;
            }

            printf("    read %d bytes: %.*s\n", s, s, buf);

          } else if (evlist[j].events & (EPOLLHUP | EPOLLERR)) {
            printf("    closing fd %s\n", evlist[j].data.fd);
            if (close(evlist[j].data.fd) == -1) {
              printf("close error.\n");
              return -1;
            }

            num_open_fds--;
          }
        }
      }
    }

    printf("all file description closed; bye\n");

    return 0;
  }
  ```

### 在信号和文件描述符上等待

同时等待信号和文件描述符状态.

* `pselect()`

  ```cpp
  #define _XOPEN_SOURCE 600
  #include <sys/select.h>

  // timeout 允许时间精度为纳秒
  // sigmask 指定了当调用被阻塞时哪些信号可以不被过滤掉
  // 返回时不会修改 timeout
  int pselect(int nfds, fd_set *readfds, fd_set *writefds, fd_set *exceptfds,
              struct timespec *timeout, const sigset_t sigmask);
  ```

* self-pipe 技巧
  * 参考 libevent 中的信号事件转 I/O 事件处理方式