# epoll 详解

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>
> 综合网络上关于 epoll 相关文章, 梳理 epoll 本质

[[TOC]]

---

## 数据的接收

### 网卡接收数据
* 网卡接收数据后, 将数据写入内存

### 中断信号通知 CPU

* 网卡将数据写入内存后, **网卡向 CPU 发出一个中断信号, 内核就能知道有新数据到来**, 再通过
  **网卡中断程序**去处理数据

> 中断
> * 计算机执行程序时, 会有优先级要求. 由硬件产生的信号需要 CPU 立刻做出回应, 优先级很高.
> * CPU 接收到中断信后后, 会立刻中断掉正在执行的程序, 做出响应; 当 CPU 完成对硬件的响应后,
>   再重新执行用户程序.
> * 中断的位置由信号决定
> * **中断程序调用**<br><img :src="$withBase('/image/network/socket-api/001_epoll_interrupt.webp')" alt="中断程序调用">

### 操作系统进程调度处理数据

* 阻塞是进程调度的关键一环, 指的是进程在等待某事件(如接收到网络数据) 发生之前的等待状态,
  `recv()`, `select()`, `epoll()` 都是阻塞方法.

#### 为什么进程阻塞不占用 CPU 资源

* 工作队列
  * 操作系统为支持多任务, 实现了进程调度功能, 会将进程分为 **运行** 和 **等待** 等几种状态
    * 运行状态, 进程获得 CPU 使用权
    * 等待状态, 阻塞状态
  * A B C 三个进程都被操作系统工作队列引用, 处于运行态, 分时执行

  **工作队列**<br><img :src="$withBase('/image/network/socket-api/001_epoll_workqueue.webp')" alt="工作队列">

* 等待队列
  * 当进程 A 执行到 `socket()` 的语句时, 操作系统会创建一个由文件系统管理的 socket 对象.
    这个 socket 对象包括可发送缓冲区, 接收缓冲区, 等待队列等成员.
  * 等待队列指向所有需要等待该 socket 事件的进程
  * 当程序执行到 `recv()` 时, 操作系统会将进程 A 从工作队列移动到该 socket 的等待队列中(实
    际是添加对这个进程的引用, 以便在接收到数据时获取进程对象, 将其唤醒), 此时工作队列只剩下
    B C 两个进程, 依据进程调度, CPU 会轮流执行这两个进程的程序, 不会执行A 进程. 此时
    **A 进程被阻塞, 不会往下执行代码, 也不会占用 CPU 资源**

  **Socket 创建**<br><img :src="$withBase('/image/network/socket-api/001_epoll_socket_create.webp')" alt="Socket 创建">

  **等待队列**<br><img :src="$withBase('/image/network/socket-api/001_epoll_waitqueue.webp')" alt="等待队列">

* 唤醒进程
  * 当 socket 接收到数据后, 操作系统将该 socket 等待队列上的进程重新放回到工作队列, 该进程
    变为运行状态, 急促执行代码. 此时由于 socket 的接收缓冲区已经有了数据, `recv()` 可以返
    回接收到的数据.

  **唤醒进程**<br><img :src="$withBase('/image/network/socket-api/001_epoll_wakeup.webp')" alt="唤醒进程">

**内核接收数据全过程**<br><img :src="$withBase('/image/network/socket-api/001_epoll_recv_data.webp')" alt="内核接收数据全过程">

> 操纵系统根据网络数据包中的 IP:PORT 信息, 找到对应的 socket

## 同时监听多个 Socket 的简单方法

服务器端需要管理多个客户端连接, `recv()` 只能监视单个 socket. `select()` 设计思想是, 预先
传入一个 socket 列表, 如果列表中的 socket 都没有数据, 挂起进程, 直到有一个 socket 收到数
据, 唤醒进程. 由此就能监视多个 socket.

### `select()`

  ```cpp
  int s = socket(AF_INET, SOCK_STREAM, 0);
  bind(s, ...)
  listen(s, ...)

  int fds[] =  存放需要监听的socket;

  while(1) {
    int n = select(..., fds, ...);
    for (int i = 0; i < fds.count; i++){
      if (FD_ISSET(fds[i], ...)) {
        //fds[i]的数据处理
      }
    }
  }
  ```

* select 流程
  * 程序同时监视 sock1, sock2, sock3, 在调用 `select()` 后, 操作系统把进程 A 分别加入这
    三个 socket 的等待队列中
  * 当任何一个 socket 接收到数据后, 中断程序将唤起进程, 将进程从所有等待队列中移除, 加入工作
    队列
  * 当进程被唤醒后, 程序需要遍历一遍 socket 列表, 获取就绪的 socket

* 缺点
  * 每次调用 `select()` 都需将进程加入到所有监视 socket 的等待队列, 每次唤醒都需要从每个队
    列中移除. 这里涉及到两次遍历, 并且每次都要将整个 fds 列表传递给内核, 也有一定的开销. 所
    以出于效率考量, select 默认的最大监视 socket 数为 FD_SETSIZE 1024
  * 进程被唤醒后, 程序并不知道哪些 socket 就绪, 需要再遍历一遍

  **操作系统把进程 A 分别加入这三个 socket 的等待队列中**<br><img :src="$withBase('/image/network/socket-api/001_epoll_select_001.webp')" alt="操作系统把进程 A 分别加入这三个 socket 的等待队列中">

  **sock2 接收到了数据, 中断程序唤起进程 A**<br><img :src="$withBase('/image/network/socket-api/001_epoll_select_002.webp')" alt="sock2 接收到了数据, 中断程序唤起进程 A">

  **将进程 A 从所有等待队列中移除, 再加入到工作队列里面**<br><img :src="$withBase('/image/network/socket-api/001_epoll_select_003.webp')" alt="将进程 A 从所有等待队列中移除, 再加入到工作队列里面">

## epoll 设计思路

  ```cpp
  int s = socket(AF_INET, SOCK_STREAM, 0);
  bind(s, ...)
  listen(s, ...)

  int epfd = epoll_create(...);
  epoll_ctl(epfd, ...); //将所有需要监听的socket添加到epfd中

  while (1) {
      int n = epoll_wait(...);
      for (接收到数据的socket) {
          //处理
      }
  }
  ```

### 功能分离

* select 中维护等待队列和阻塞进程两个步骤在一起, 每次调用都需要执行这两步操作.
* epoll 使用 `epoll_ctl()` **维护等待队列**, 再调用 `epoll_wait()` **阻塞进程**, 将这
  两个步骤分开, 提升了效率

  **select epoll 对比**<br><img :src="$withBase('/image/network/socket-api/001_epoll_select_epoll.webp')" alt="select epoll 对比">

### 就绪列表

* select 中程序不知道哪些 socket 收到数据, 需要遍历
* epoll 中, 内核维护一个就绪列表 rdlist, 引用收到数据的 socket, 当进程被唤醒后, 只要获取
  rdlist 内容, 就能够知道哪些 socket 收到数据

  **就绪列表**<br><img :src="$withBase('/image/network/socket-api/001_epoll_rdlist.webp')" alt="就绪列表">

## epoll 原理和流程

### 创建 epoll 对象

* 进程调用 `epoll_create()` 时, 内核会创建一个 eventpoll 对象(即 epfd 指向的对象).
  eventpoll 是文件系统中的一员, 有自己的等待队列

  **内核创建 eventpoll 对象**<br><img :src="$withBase('/image/network/socket-api/001_epoll_create_eventpoll.webp')" alt="内核创建 eventpoll 对象">

### 维护监视列表

* 创建 epoll 对象后, 可以使用 `epoll_ctl()` 管理所要监听的 socket, 内核会将 eventpoll
  添加到对应 socket 的等待队列, 或从所在的 socket 等待队列删除
* 当 socket 收到数据后, 中断程序会操作 eventpoll 对象, 而不是直接操作进程

  **添加要监听的 socket**<br><img :src="$withBase('/image/network/socket-api/001_epoll_add_rdlist.webp')" alt="添加要监听的 socket">

### 接收数据

* socket 接收到数据后, 中断程序会给 eventpoll 的 rdlist 添加 socket 引用
* eventpoll 对象相当与 socket 和进程之间的中介, socket 的数据接收并不直接影响进程, 而是通
  过改变 eventpoll 的 rdlist 来改变进程状态
* 当程序执行 `epoll_wait()` 时, 如果 rdlist 已经引用了 socket, 那么 `epoll_wait()`
  直接返回, 如果 rdlist 为空则进程阻塞

  **给 rdlist 添加引用**<br><img :src="$withBase('/image/network/socket-api/001_epoll_rdlist_add_reference.webp')" alt="给 rdlist 添加引用">

### 阻塞和唤醒进程

* 程序运行到 `epoll_wait()` 时, 进程阻塞. 此时内核会将进程放入到 eventpoll 的等待队列
* socket 接收到数据后, 中断程序一方面修改 rdlist, 另一方面唤醒 eventpoll 等待队列中的进程,
  进程再次进入运行态. 进程根据 rdlist 可以知道哪些 socket 发生了变化

  **epoll_wait 阻塞进程**<br><img :src="$withBase('/image/network/socket-api/001_epoll_epoll_wait.webp')" alt="epoll_wait 阻塞进程">

  **epoll 唤醒进程**<br><img :src="$withBase('/image/network/socket-api/001_epoll_wakeup_process.webp')" alt="epoll 唤醒进程">

## epoll 实现细节

  ```cpp
  struct eventpoll {
    wait_queue_head_t wq;
    wait_queue_head_t poll_wait;
    struct list_head rdllist;
    struct rb_root rbr;
    struct epitem *ovflist;
    struct file *file;    // fd对应的文件表入口
  };

  struct epitem {
    union {
      struct rb_node rbn;
    };

    struct list_head rdllink;
    struct epitem *next;
    struct epoll_filefd ffd;
    struct list_head pwqlist;
    struct eventpoll *ep;
    struct list_head fllink;
    struct epoll_event event;
  };
  ```

* rdlist
  * 双向链表, 快速插入和删除
  * rdlist 通过 epitem 间接引用 socket
* 索引结构
  * 红黑树, 快速添加, 删除, 搜索
  * 保存监视的 socket

  **epoll 原理**<br><img :src="$withBase('/image/network/socket-api/001_epoll_principle.webp')" alt="epoll 原理">

## 参考资料
[如果这篇文章说不清 epoll 的本质, 那就过来掐死我吧!](https://zhuanlan.zhihu.com/p/63179839)