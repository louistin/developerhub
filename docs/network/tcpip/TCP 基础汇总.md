# TCP 基础汇总
> 利用 wireshark 软件分析三次握手与四次挥手

* wireshark 抓包与协议分层
    <img :src="$withBase('/image/network/tcp_basic_wireshark_001.png')" alt="TCP 与分层协议">

## TCP 协议基础

* TCP 协议报文首部

    <img :src="$withBase('/image/network/tcp_basic_wireshark_002.png')" alt="TCP 与分层协议">

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

* 三次握手

    <img :src="$withBase('/image/network/tcp_connect_wireshark_001.png')" alt="TCP 三次握手">

    **第一次握手**<br>
    <img :src="$withBase('/image/network/tcp_connect_wireshark_002.png')" alt="TCP 第一次握手">

    **第二次握手**<br>
    <img :src="$withBase('/image/network/tcp_connect_wireshark_003.png')" alt="TCP 第二次握手">

    **第三次握手**<br>
    <img :src="$withBase('/image/network/tcp_connect_wireshark_004.png')" alt="TCP 第三次握手">

* 四次挥手

    <img :src="$withBase('/image/network/tcp_close_wireshark_001.png')" alt="TCP 四次挥手">

    **第一次挥手**<br>
    <img :src="$withBase('/image/network/tcp_close_wireshark_002.png')" alt="TCP 第一次挥手">

    **第二三次挥手**<br>
    <img :src="$withBase('/image/network/tcp_close_wireshark_003.png')" alt="TCP 第二三次挥手">

    **第四次挥手**<br>
    <img :src="$withBase('/image/network/tcp_close_wireshark_004.png')" alt="TCP 第四次挥手">