# TCP 基础汇总
> 利用 wireshark 软件分析三次握手与四次挥手

* wireshark 抓包与协议分层
    <img :src="$withBase('/image/network/tcp_basic_wireshark_001.png')" alt="TCP 与分层协议">

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
    ```

    <img :src="$withBase('/image/network/tcp_basic_wireshark_002.png')" alt="TCP 与分层协议">

* 三次握手

    <img :src="$withBase('/image/network/tcp_connect_wireshark_001.png')" alt="TCP 三次握手">

    **第一次握手**<br>
    <img :src="$withBase('/image/network/tcp_connect_wireshark_002.png')" alt="TCP 第一次握手">

    ```bash
    Client 将标志位 SYN 置为 1, 随机产生一个值 seq = J
    将数据包发送给 Server, Client 进入 SYN_SENT 状态, 等待 Server 确认
    ```

    **第二次握手**<br>
    <img :src="$withBase('/image/network/tcp_connect_wireshark_003.png')" alt="TCP 第二次握手">

    ```bash
    Server 收到数据包后由标志位 SYN = 1 知道 Client 请求建立连接, Server 将标志位 SYN
      和 ACK 都置为 1, ack = J + 1, 随机产生一个值 seq = K
    将数据包发送给 Client, Server 进入 SYN_RCVD 状态
    ```

    **第三次握手**<br>
    <img :src="$withBase('/image/network/tcp_connect_wireshark_004.png')" alt="TCP 第三次握手">

    ```bash
    Client 收到数据包, 检查 ack 是否为 J + 1, 正确则将标志位 ACK 值置为 1, ack = K + 1
    将数据包发送给 Server
    Server 收到数据包, 检查 ack 是否为 K + 1, 标志位 ACK 是否为 1, 正确则连接成功.
    Client 和 Server 进入 ESTABLISHED 状态, 完成三次握手, 双方可以发送数据
    ```

    - 参考资料

        [SYN 攻击与防范](https://www.cnblogs.com/huskiesir/p/10212053.html)

* 四次挥手

    <img :src="$withBase('/image/network/tcp_close_wireshark_001.png')" alt="TCP 四次挥手">

    ```bash
    TCP 连接为全双工, 可以由任一方发起关闭. 同时每一个方向都必须单独关闭.
    收到一个 FIN 只表示这一方向上没有数据流动(不再收到数据), 但此方向上仍然可以发送数据, 直到
      这一方向上也发送了 FIN.
    首先发送的一方主动关闭, 另一方被动关闭.
    ```

    **第一次挥手**<br>
    <img :src="$withBase('/image/network/tcp_close_wireshark_002.png')" alt="TCP 第一次挥手">

    ```bash
    Client 发送 FIN, 关闭 Client 到 Server 的数据传输, Client 进入 FIN_WAIT_1 状态
    ```

    **第二三次挥手**<br>
    <img :src="$withBase('/image/network/tcp_close_wireshark_003.png')" alt="TCP 第二三次挥手">

    ```bash
    这里的第二次, 第三次挥手在一个数据包中
    Server 收到 FIN 后, 发送一个 ACK 到 Client, 确认序列号 ack 为收到序列号 seq + 1,
      Server 进入 CLOSE_WAIT 状态
    Server 发送 FIN, 关闭 Server 到 Client 的数据传输, Server 进入 LAST_ACK 状态
    ```

    **第四次挥手**<br>
    <img :src="$withBase('/image/network/tcp_close_wireshark_004.png')" alt="TCP 第四次挥手">

    ```bash
    Client 收到 FIN 后, 进入 TIME_WAIT 状态, 再发送一个 ACK 给 Server, 确认序列号 ack
      为收到序列号 syn + 1, Server 收到后进入 CLOSED 状态, 完成四次挥手
    ```

    - 参考资料

        [TIME_WAIT 状态的产生原因及解决方法](https://blog.csdn.net/knowledgebao/article/details/84626238?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)