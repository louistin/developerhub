# Reactor 反应堆模式

> Reactor 用于同步 I/O

[[TOC]]

---

## 前置概念

### 阻塞与非阻塞
描述的是用户线程调用系统内核 I/O 操作的方式

* 阻塞
  * I/O 操作需要彻底完成后才返回到用户空间
* 非阻塞
  * I/O 操作被调用后立即返回给用户一个状态值, 无需等到 I/O 操作彻底完成

### 同步与异步
描述的是用户线程与内核的交互方式

* 同步
  * 用户线程发起 I/O 请求后需要等待或轮询内核 I/O 操作完成后才能继续执行
* 异步
  * 用户线程发起 I/O 请求后仍继续执行, 当内核 I/O 操作完成后会通知用户线程, 或者调用用户线程
    注册的回调函数

### I/O 模型
#### 同步阻塞 I/O Blocking I/O
传统 I/O 模型, 用户线程在内核进行 I/O 操作时被阻塞.

**同步阻塞 I/O**<br><img :src="$withBase('/image/cs/design-pattern/001_reactor_blocking_io.webp')" alt="同步阻塞 I/O">

#### 同步非阻塞 I/O Non-Blocking I/O
默认创建的 socket 都是阻塞的, 非阻塞要求 socket 设置为 NONBLOCK.

**同步非阻塞 I/O**<br><img :src="$withBase('/image/cs/design-pattern/001_reactor_nonblocking_io.webp')" alt="同步非阻塞 I/O">

#### I/O 多路复用 I/O Multiplexing
也称异步阻塞 I/O. Reactor 设计模式.

I/O 多路复用模型是建立在内核提供的多路复用分离函数基础之上的.

* 使用 select 函数可以避免同步非阻塞模型中的轮询等待问题

**多路分离函数 select**<br><img :src="$withBase('/image/cs/design-pattern/001_reactor_io_multiplexing_select.webp')" alt="多路分离函数 select">


#### 异步 IO Asynchronous I/O
也称异步非阻塞 I/O. Proactor

### 网络请求处理结构

* 基于线程

* 事件驱动
  * 事件驱动程序的基本结构
    * 事件收集器, 负责收集所有事件, 包括来自用户, 硬件和软件的事件
    * 事件发送器, 将收集到的事件分发到目标对象中
    * 事件处理器, 执行具体的事件响应工作, 一般在实现阶段才完全确定
  * 事件驱动编程使用协作式处理任务, 而不是多线程抢占式, 处理器一般只有很短的生命周期
  * 优点:
    * 编程简单, 复杂度低
    * 事件驱动编程可以很好的实现 I/O 复用
    * 易于调试, 时间依赖只和事件有关, 而不是内部调度
  * 缺点:
    * 如果处理器占用时间较长, 会阻塞应用程序的响应
    * 无法通过时间来维护本地状态, 处理器必须返回
    * 在单 CPU 环境下, 比多线程要快, 因为没有锁的因素, 没有线程切换的损耗, CPU 不是并发

## Reactor 模式

Reactor 模式常用于处理并发 I/O, 用于同步 I/O. 主要设计思想是将所有要处理的 I/O 事件注册到
一个中心 I/O 多路复用器上, 同时主线程阻塞在多路复用器上, 一旦有 I/O 事件到来或准备就绪, 多路
复用器将返回并将相应的 I/O 事件分发到对应得处理器中.

Reactor 是一种事件驱动机制, 应用程序不会主动调用 API 来完成处理. Reactor 逆置了事件处理流
程, 应用程序需要提供相应得接口并注册到 Reactor 上, 如果有相应得事件发生, Reactor 将主动调用
应用程序注册得 API (回调函数).

* 优点:
  * 响应快, 不必为单个同步时间所阻塞, 虽然 Reactor 本身依然是同步的
  * 变成相对简单, 可以最大程度的避免复杂的多线程及同步问题, 并且避免了多线程/进程的切换开销
  * 可扩展性, 可以方便的通过增加 Reactor 实例个数来充分利用 CPU 资源
  * 可复用性, Reactor 框架本身与具体时间处理逻辑无关, 具有很高的复用性

### Reactor 模式框架

* 事件源 Handle
  * Linux 上为文件描述符, 称为句柄集 Handle, 程序在指定的句柄上注册关心的事件, 如 I/O 事件
* 事件多路分发机制 EventDemultiplexer
  * 由操作系统提供的 I/O 多路复用机制, select epoll 等. 程序首先将关心的句柄(事件源) 及其
    事件注册到多路复用机制上; 当有事件到达时, 事件多路复用机制会发出通知"在已注册的句柄集中,
    有一个或多个句柄的事件已就绪", 程序收到通知后, 就可以在非阻塞的情况下对事件进行处理了.
  * 事件分离器由操作系统提供, select epoll 等, 在一个 Handle 集合上等待事件的发生. 接收
    client 连接, 建立对应 client 的事件处理器 EventHandler, 并向事件分发器 Reactor 注
    册此事件处理器
* 反应器 Reactor
  * 事件管理的接口, 内部使用事件多路复用机制注册, 注销事件; 并运行事件循环, 当有事件进入就绪
    状态时, 调用注册事件的回调函数处理事件
  * 提供接口注册, 删除和分发 EventHandler, EventDemultiplexer 等待事件发生, 当检测到
    新的事件, 就把事件交给 dispatcher, 由其回调 EventHandler
* 事件处理程序 Eventhandler
  * 事件处理程序提供了一组接口, 每个接口对应了一种类型的事件, 供 Reactor 在相应的事件发生时
    调用, 执行相应的事件处理, 通常它会绑定一个有效的句柄.
  * 事件处理器, 负责处理特定事件的处理函数, 一般基本的 Handler 基础上还会有更进一步的层次划
    分, 用来抽象诸如 decode, process, encode 等过程.
* 具体的事件处理器 ConcreteEventHandler



  **Reactor 设计模式**<br><img :src="$withBase('/image/cs/design-pattern/001_reactor_001.webp')" alt="Reactor 设计模式">

#### 使用同步 I/O 模型 epoll 实现的 Reactor 模式工作流程

1. `epoll_create()`
2. `epoll_ctl(epfd, EPOLL_CTL_ADD, fd, event)` 主线程向 epoll 内核事件表中注册
    socket 上的 EPOLLIN 事件
3. 当 socket 上有数据可读时, `epoll_wait()` 通知主线程, 主线程将 socket 可读事件放入
   请求队列
4. 休眠在请求队列上的某个工作线程被唤醒, 从 socket 中读取数据并处理客户端请求, 然后向 epoll
    内核事件表中注册该 socket 上的写就绪事件
5. 主线程调用 `epoll_wait()` 等待 socket 可写
6. 当 socket 可写时 `epoll_wait()` 通知主线程, 主线程将 socket 可写事件放入请求队列
7. 休眠在请求队列上的某个工作线程被唤醒, 向 socket 上写入服务器处理请求的结果

  **epoll 流程**<br><img :src="$withBase('/image/cs/design-pattern/001_reactor_epoll_001.webp')" alt="epoll 流程">