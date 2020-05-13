# Linux-UNIX 系统编程手册

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
    * 动态增长和首夺的段, 由栈帧(stack frames) 组成
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
  <img :src="$withBase('/image/note/lpi/06_001_典型的进程内存结构.png')" alt="典型的进程内存结构">

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
  <img :src="$withBase('/image/note/lpi/06_002_虚拟内存概览.png')" alt="虚拟内存概览">