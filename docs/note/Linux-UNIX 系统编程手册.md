# Linux-UNIX 系统编程手册

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>
> 针对一直弄不明白的部分先总体阅读, 建立基本的认知体系概念

[[TOC]]

---

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