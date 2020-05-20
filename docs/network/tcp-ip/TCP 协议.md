# TCP 协议
> 利用 wireshark 软件分析三次握手与四次挥手

* wireshark 抓包与协议分层
    <img :src="$withBase('/image/network/tcp-ip/001_tcp_basic_wireshark_001.webp')" alt="TCP 与分层协议">

## TCP 协议基础

* TCP 协议报文首部

    ```bash
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |          Source Port          |       Destination Port        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                        Sequence Number                        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                    Acknowledgment Number                      |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |  Data |           |U|A|P|R|S|F|                               |
    | Offset| Reserved  |R|C|S|S|Y|I|            Window             |
    |       |           |G|K|H|T|N|N|                               |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |           Checksum            |         Urgent Pointer        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                    Options                    |    Padding    |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                             data                              |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

    Sequence Number : 包序号, 解决网络包乱序问题
    Acknowledgment Number : ACK 确认收到, 解决丢包问题
    Window : 滑动窗口, 解决流量控制
    TCP Flags : 包的类型, 用于操控 TCP 的状态机
    ```

    <img :src="$withBase('/image/network/tcp-ip/001_tcp_header_001.webp')" alt="TCP Header">

    <img :src="$withBase('/image/network/tcp-ip/001_tcp_basic_wireshark_002.webp')" alt="TCP 与分层协议">

* TCP 状态机

    TCP 所谓的连接, 其实是通讯双方维护的一个 **连接状态**, 使其看起来好像连接一样.


    <img :src="$withBase('/image/network/tcp-ip/001_tcp_statemachine_001.webp')" alt="TCP 状态机">

* 三次握手

    <img :src="$withBase('/image/network/tcp-ip/001_tcp_connect_wireshark_001.webp')" alt="TCP 三次握手">

    **第一次握手**<br>
    <img :src="$withBase('/image/network/tcp-ip/001_tcp_connect_wireshark_002.webp')" alt="TCP 第一次握手">

    ```bash
    Client 将标志位 SYN 置为 1, 随机产生一个值 seq = J
    将数据包发送给 Server, Client 进入 SYN_SENT 状态, 等待 Server 确认
    ```

    **第二次握手**<br>
    <img :src="$withBase('/image/network/tcp-ip/001_tcp_connect_wireshark_003.webp')" alt="TCP 第二次握手">

    ```bash
    Server 收到数据包后由标志位 SYN = 1 知道 Client 请求建立连接, Server 将标志位 SYN
      和 ACK 都置为 1, ack = J + 1, 随机产生一个值 seq = K
    将数据包发送给 Client, Server 进入 SYN_RCVD 状态
    ```

    **第三次握手**<br>
    <img :src="$withBase('/image/network/tcp-ip/001_tcp_connect_wireshark_004.webp')" alt="TCP 第三次握手">

    ```bash
    Client 收到数据包, 检查 ack 是否为 J + 1, 正确则将标志位 ACK 值置为 1, ack = K + 1
    将数据包发送给 Server
    Server 收到数据包, 检查 ack 是否为 K + 1, 标志位 ACK 是否为 1, 正确则连接成功.
    Client 和 Server 进入 ESTABLISHED 状态, 完成三次握手, 双方可以发送数据
    ```

    - 注意事项

    > 1. 建立连接时 SYN 超时
    >> Server 回复 Client SYN-ACK 后没有收到 Client 回复的 ACK, 那么连接处于一个既没成
       功, 也没失败的中间状态. 此时 Server 会每隔 1 2 4 8 16s 重发一次 SYN-ACK 数据包,
       总计 1 + 2 + 4 + 8 + 16 + 32 = 63s 后, TCP 会断开连接

    > 2. ISN (Inital Sequence Number)
    >> ISN 为什么不能从 1 开始? 考虑到假设 Client 发出 10 个 segment 后, 网络断开, 此时
       Client 重连, 又实用 1 为 ISN, 但之前的包到了, 此时会被当做新连接的包处理, Client
       和 Server 端的 SYN 就对不上了. ISN 的周期是与一个每 4 微妙 +1 的逻辑时钟绑定, 直到
       大于 2^32, 再从 0 开始, 所以 TCP segment 在网络上最大存活时间不会超过这一个周期
       即 MSL <= 4.55h

    > 3. MSL 与 TIME_WAIT
    >> RFC 规定 MSL = 120s, Linux 设置为 30s.
       从 TIME_WAIT -> CLOSED 状态, 超时时间设置为 2MSL. 主要是为了<br>
       1). TIME_WAIT 确保有足够的时间让对方受到 ACK, 被动关闭方没有收到 ACK, 会触发重发
           FIN, 来回时间满足 2MSL<br>
       2). 有足够时间让此连接不与后面的连接混在一起

    > 4. TIME_WAIT 数量太多
    >> 大并发短连接时出现, 会消耗系统资源
       解决方法待补充

    - 参考资料

        [SYN 攻击与防范](https://www.cnblogs.com/huskiesir/p/10212053.html)

* 四次挥手

    <img :src="$withBase('/image/network/tcp-ip/001_tcp_close_wireshark_001.webp')" alt="TCP 四次挥手">

    ```bash
    TCP 连接为全双工, 可以由任一方发起关闭. 同时每一个方向都必须单独关闭.
    收到一个 FIN 只表示这一方向上没有数据流动(不再收到数据), 但此方向上仍然可以发送数据, 直到
      这一方向上也发送了 FIN.
    首先发送的一方主动关闭, 另一方被动关闭.
    ```

    **第一次挥手**<br>
    <img :src="$withBase('/image/network/tcp-ip/001_tcp_close_wireshark_002.webp')" alt="TCP 第一次挥手">

    ```bash
    Client 发送 FIN, 关闭 Client 到 Server 的数据传输, Client 进入 FIN_WAIT_1 状态
    ```

    **第二三次挥手**<br>
    <img :src="$withBase('/image/network/tcp-ip/001_tcp_close_wireshark_003.webp')" alt="TCP 第二三次挥手">

    ```bash
    这里的第二次, 第三次挥手在一个数据包中 (如果此时 Server 还有数据要发送, 就不能合并)
    Server 收到 FIN 后, 发送一个 ACK 到 Client, 确认序列号 ack 为收到序列号 seq + 1,
      Server 进入 CLOSE_WAIT 状态
    Server 发送 FIN, 关闭 Server 到 Client 的数据传输, Server 进入 LAST_ACK 状态
    ```

    **第四次挥手**<br>
    <img :src="$withBase('/image/network/tcp-ip/001_tcp_close_wireshark_004.webp')" alt="TCP 第四次挥手">

    ```bash
    Client 收到 FIN 后, 进入 TIME_WAIT 状态, 再发送一个 ACK 给 Server, 确认序列号 ack
      为收到序列号 syn + 1, Server 收到后进入 CLOSED 状态, 完成四次挥手
    ```

    - 参考资料

        [TIME_WAIT 状态的产生原因及解决方法](https://blog.csdn.net/knowledgebao/article/details/84626238?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)

* TCP 传输

    - TCP 重传机制

      ```bash
      TCP 重传机制中 Timeout 设置
          时间过长, 重发变慢, 效率低, 性能差
          时间过短, 可能导致重发未丢失的包, 增加网络拥塞, 导致更多超时
      ```
---

## FAQ

1. SYN Flood 攻击
