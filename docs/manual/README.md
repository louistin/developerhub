# 开发手册

* 编程语言
  - C
    - C 语言基础
      - 指针, 文件输入输出, UNIX 系统接口
    - C 标准库
      - 标准库 API 熟悉与使用

  - C++
    - C++ 基础
    - STL
    - OO
  - JavaScript/HTML/CSS
  - Lua
    - 基础知识
    - Lua 与 C 交互虚拟机
  - Makefile 编写
  - Shell
  - 正则表达式

* 系统编程
  - 文件 IO
  - 标准 IO
  - 进程
  - 线程
  - 信号
  - 高级 IO
    - select
    - epoll
  - 进程间通信
  - 网络 IPC
  - 消息队列
  - 重难点
    - 多线程多进程编程
    - 死锁
    - 调度模型
    - 同步 异步 阻塞 非阻塞

* 网络编程
  - 网络模型
  - 通信协议
    - TCP/IP
    - - 基本协议 HTTP DNS SMTP 等
      - TCP 报头
      - 三次握手, 四次挥手
      - 保证可靠
      - 粘包问题
      - 提高性能
      - 异常处理
      - 网络传输模型
      - 滑动窗口协议
      - 传输效率
    - UDP
      - 如何实现可靠传输
  - 套接字编程
  - HTTP 协议
    - 协议
    - 方法及使用场景
    - 优缺点
    - 网页从输入网址到打开的过程
  - RPC
  - RESTful API
    - 原理
    - 设计
    - 开发
  - Socket 编程
  - 高阶 IO
    - 5 种 IO 模型
    - 多路转接
    - IO 多路复用
    - SELECT
    - POLL
    - EPOLL
  - WebSocket

* 数据库
  - MySQL
    - 常用 SQL
    - 锁
    - 存储引擎
    - 事务
    - 主从分离
    - MySQL 代理
    - 索引的实现原理及使用
    - 数据库优化
    - 表分区
    - 主从复制
  - Redis
    - Redis 常用指令
    - 五种数据结构及适合场景

* 数据结构与算法
  - 深入理解链表, 数组, 串, 树, 哈希
  - 基本排序算法
  - 待补充

* 软件工程
  - 23 种设计模式
    - 反应堆模式
    - 其他常用设计模式
  - 代码规范
  - 微服务

* 中间件
  - Libevent
  - Nginx
    - 模块开发
    - 配置
      - HTTPS
        - 原理
      - 跨域
    - 负载均衡
    - 反向代理/正向代理
    - Nginx 实现原理
  - Redis
  - 辅助工具使用
    - tcpdump
    - gdb
    - gcc/g++
    - git
    - svn
    - supervisor
    - devops 概念
    - docker
      - 镜像
      - 容器
    - 分布式
    - WebRTC
    - P2P

* 服务器开发
  - 缓存技术
    - Cache
    - MQ
  - 高并发
  - 负载均衡
  - 安全性
    - 底层实现与具体业务分离
    - 提供状态监控 API
  - IO 操作
    - IO 操作异步化
    - IO 操作合并缓些(事务, 包合并等)
  - 内存管理
    - 内存池实现与使用
    - 内存保护函数: strncpy memcpy snprintf vsnprintf
    - 如何减少内存复制
  - 通信协议
    - JSON
      - 文本协议, 简单, 自解释, 可扩展性好, 方便包过滤和写日志
    - 私有二进制协议
      - 精简, 针对性强, 传输性能高, 项目内部完全可控, 扩展性差
  - 音视频协议
    - RTP/RTSP/RTCP
    - HLS