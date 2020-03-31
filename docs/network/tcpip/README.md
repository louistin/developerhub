# 网络编程快速入门

## 快速理解网络通信协议

* 五层模型

    ```bash
    实体层
        光缆, 电缆等, 传输 0 1

    链接层
        以太网协议
            解决局域网点对点通信
            每帧(Frame): Head(18/22 byte) + Data(46 - 1500 byte)
        MAC 地址
            绑定在网卡上, 定位网卡和数据包路径
            48位, 通常表示为 12 个十六进制数 00-B0-D0-86-BB-F7
        广播
            ARP 协议
            以太网发包是向本(子)网络内所有计算机发送, 让每台计算机自己判断是否为接收方(根据
              每包标头MAC地址)

    网络层 (主机到主机)
        IP 协议
            连接多个局域网, 地址协议, 不保证数据完整性
            定位计算机所在的子网络, 为每台计算机分配 IP 地址
            网络地址 = 网络部分 + 主机部分
            子网掩码 = 网络部分全为 1 + 主机部分全为 0. 判断 IP 地址的网络部分与主机部分
        IP 数据包
            Head(20 60 byte) + Data(<= 65535 byte)
            Head 包括版本, 长度, IP地址等
            一个 IP 数据包在以太网中有可能会分包
        ARP 协议
            得到同一子网络中目标主机 IP
            为什么需要 ARP 协议?
                IP 协议传输数据必须知道 IP 地址和 MAC 地址, IP 地址一般已知
                根据 IP 地址获取 MAC 地址的方法:
                    两台主机位于非同一个子网络, 需要将数据包传给子网络连接处的
                      网关(Gateway), 让其处理
                    两台主机位于同一个子网络, ARP 协议发出数据包(包含在以太网数据帧中), 其
                      中包含目标主机 IP, 目标 MAC 填写 FF:FF:FF:FF:FF:FF, 表示为广播
                      地址. 子网络中每一台主机都会收到数据包, 取出 IP 地址后, 与自身 IP
                      比较, 相同则恢复, 告知自己的 MAC 地址, 否则就丢弃.

    传输层 (端到端)
        端口 Port
            每一个使用网卡的程序的编号
            0 - 1023 - 65535
            主机 + 端口 = 套接字 Socket
        UDP 协议
            Head(8 byte) + Data(<= 65527 byte)
            Head 发出端口 + 接收端口
            简单, 可靠性差
        TCP 协议
            数据包长度没有限制, 但为了保证网络效率, 通常不会超过 IP 数据包 Data 长度
            保证数据通信的完整性和可靠性, 防止丢包

    应用层
        直接面对客户

    Head + Head + Head + Data
    以太网  IP     TCP    应用层数据
    ```

* 电脑联网
    * 联网条件
        * 本机 IP, 子网掩码, 网关 IP 地址, DNS IP 地址

    ```bash
    静态 IP 地址
        手动配置

    动态 IP 地址
        DHCP 协议动态获取
            DHCP 协议是建立在 UDP 协议之上的应用层协议
            Head + Head + Head + Data
            以太网  IP     UDP    DHCP数据
                以太网标头: 本机 MAC 地址, 接收方(DHCP 服务器) MAC 地址(未知 广播
                    FF-FF-FF-FF-FF-FF)
                IP 标头: 发出方 IP 地址(0.0.0.0 未知), 接收方 IP 地址(未知
                    255.255.255.255)
                UDP 标头: 发出方端口(68), 接收方端口(67)
            子网中每台计算机都收到数据包, DHCP 服务器根据(0.0.0.0 255.255.255.255)判断
              自己为接收方, 其他丢弃
            DHCP 服务器分配好 IP 后, 发送 DHCP 响应包, 以太网标头为双方 MAC 地址, IP 标
              头地址为 DHCP 服务器地址和 255.255.255.255(接收方), 发送方端口(67), 接收
              方端口(68), 分配的 IP 地址等参数在 Data 中
    ```

* 互联网协议

    ```bash
    # www.google.com 的访问流程
    1. 浏览器地址输入 www.google.com
    2. 将地址发送到 DNS Server 8.8.8.8, 响应 Google IP 为 172.194.72.105
    3. 使用子网掩码 255.255.255.0 AND Google IP, 得到 172.194.72.0
        使用子网掩码 255.255.255.0 AND 本机 IP, 得到 192.168.1.0
        两者不相等, 说明 Google 不在本机子网上, 数据包必须经过网关 192.168.1.1 转发, 也即
          是接收方的 MAC 地址将是网关 MAC 地址
    4. HTTP 内容 4960 字节
        GET / HTTP/1.1
        Host: [url=http://www.google.com]www.google.com[/url]
        Connection: keep-alive
        User-Agent: Mozilla/5.0 (Windows NT 6.1) ......
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Encoding: gzip,deflate,sdch
        Accept-Language: zh-CN,zh;q=0.8
        Accept-Charset: GBK,utf-8;q=0.7,*;q=0.3
        Cookie: ... ...
    5. Google HTTP 端口为 80, 本机端口(1024-65535), 为 1080
        TCP 数据包长度 4980 = Head(20) + HTTP Data(4940)
    6. IP 数据包设置双方 IP 地址(172.194.72.105 192.168.1.11)
        IP 数据包长度 5000 = Head(20) + TCP Data(4980)
    7. 以太网数据包设置双方 MAC 地址, 接收方为网关 192.168.1.1 的 MAC 地址
       以太网数据包长度 1500 = Head(20) + IP Data(1480)
        IP 数据包分割为 1500 + 1500 + 1500 + 560
    8. 多个网关转发, Google 服务器根据 IP Head 序号, 拼包, 解析数据, 处理, 响应
    9. 完成一次网络通信
    ```

* 集线器 交换机 路由器

    ```bash
    集线器 Hub
        物理层
        通过网线直接传送数据
        不能分辨数据目的地, 只能广播

    交换机
        数据链路层
        根据 MAC 地址, 实现任意两台计算机之间的数据传输

    路由器
        网络层
        通过 IP 寻址
        TCP/IP 协议
    ```

---

## TCP UDP

* TCP 协议作用
    * 以太网协议解决局域网点对点通信
    * IP 协议可以连接多个局域网
    * TCP 协议保证数据通信的完整性和可靠性, 防止丢包

* TCP 数据包大小
    ```bash
    以太网负载payload 1500 字节
        IP 标头 >= 20 字节, payload <= 1480 字节
            TCP 头 >= 20 字节, payload <= 1460 字节

    TCP IP 协议往往有额外头信息, TCP 实际 payload ~= 1400 字节
    ```

* TCP 数据包编号 SEQ
    ```bash
    第一个包是随机数, 例如 1 号包, 假设负载长度为 100 字节, 则下一包编号就是 1 + 100 = 101
    每个包都可以得到两个编号: 自己的编号, 下一个包的编号. 接收方可以根据编号将其顺序还原
    ```

* TCP 数据包的组装
    ```bash
    TCP 不提供机制表示原始数据大小, 由应用层协议规定
    OS 根据 TCP 数据包中的端口, 将组装好的数据转给对应的应用
    ```

* ACK 和慢启动
    ```bash
    TCP 协议为做到效率和可靠性统一, 慢启动机制在开始时会发送的较慢, 根据丢包调整速率.

    内核中 TCP_INIT_CWND 设定, 开始时, 发送方一次性发送 10 个数据包, 即发送窗口为 10, 然
      后停下等待接收方确认, 再继续发送. 默认情况下, 接收方每收到两个 TCP 数据包, 发送一个确
      认消息, 即 ACK (acknowledgement).

    ACK 携带信息:
        期待要收到的下一个数据包编号
        接收方的接收窗口剩余容量
    发送方根据 ACK 信息, 推测接收方接收速率, 做出发送速率调整, 即发送窗口调整.

    TCP 是双向通信, 双方都需要发送 ACK, 两方窗口可以不一样
    ACK 很小, 通常与数据合并在同一个数据包中发送
    ```

* 数据可靠性保证
    ```bash
    每个数据包都带有下一个数据包编号, 如果下一个没收到, 则 ACK 不会变化, 会一直显示为期待值
    接收方未受到期待值包, 即使收到后面的包, ACK 也不会变
    发送方发现收到连续三个重复 ACK, 或超时还未收到任何 ACK, 即确认丢包, 会再次发送这个包
    ```

* TCP 三次握手 四次挥手
    <img :src="$withBase('/image/network/tcp001.jpg')" alt="TCP 三次握手 四次挥手">

    ```bash
    TCP 建立连接并初始化目标
        初始化资源
        告诉对方我的序列号

    流程
        1. Client 首先发送一个 SYN 包告诉 Server 自己的初始化序列号 X
        2. Sever 端收到后, 回复给 Client 一个 ACK 确认包, 告诉 Client 我收到了
        3. Server 向 Client 发送自己的初始序列号 Y
        4. Client 收到后, 回复 Server 一个 ACK 确认包
        其中, 2 3 可以合并为异步, 即将 ACK 确认包和 SYN 序列号包一同发送

    数据发送方式
        理论上发送的数据流不存在大小限制, 但由于缓冲区大小限制, 数据有可能截断
        数据到达有序
        一旦发生丢包, TCP 会将后续包缓存起来, 等前面的包重传并接收到后再继续发送

    使用场景
        When in doubt, use TCP.
    ```

* UDP
    ```bash
    面向数据报, 不可靠, 无连接
    只需知道对方 IP, 将数据报一份一份发送过去, 其他的不用关心
    最大长度存在限制, 协议头报文长度 16 位
        2^16 - 1 - 8(UDP Head) - 20(IP Head) = 65507 字节
        实际中为避免传输中数据包分割, 每个数据报最大字节为 576(MTU) - 8 - 20 = 548

    UDP 丢包可能因素
        数据报分片重组丢失
        UDP 缓冲区填满丢弃

    使用场景
        实时性要求高
        多点通信

    采用关键点
        网络带宽需求小, 实时性要求高
        应用无需维持连接
        低功耗
    ```

---

## HTTP

<img :src="$withBase('/image/network/httprequest001.png')" alt="HTTP 请求">
<img :src="$withBase('/image/network/httpresponse001.png')" alt="HTTP 响应">

* 响应状态码
    ```bash
    101 Switching Protocols : 服务器协议转换

    200 OK : 请求成功(其后是对 GET 和 POST 请求的应答文档)
    201 Created : 请求被创建完成, 同时新的资源被创建

    301 Moved Permanently : 所请求的页面已经转移至新的 url
    302 Found : 所请求的页面已经临时转移至新的 url
    303 See Other : 所请求的页面可在别的 url 下被找到

    400 Bad Request : 服务器未能理解请求
    401 Unauthorized : 被请求的页面需要用户名和密码

    500 Internal Server Error: 请求未完成, 服务器遇到不可预知的情况
    ```

---

## TCP 长连接

* Socket 创建
    ```bash
    Socket 其实是使用 <peer_addr:peer_port, local_addr:local_port> 四元组来区别不同
      socket 实例.
    一个客户端连接情况下, 有三个 socket
        服务端负责监听 ServerSocket <*:*, *:9877> 可接受任何客户端和本地任何 IP
        accept 返回 socket <127.0.0.1:client_port, 127.0.0.1:9877>
        客户端 socket <server_ip:9877, 127.0.0.1:client_port>
    ```