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
            网络地址 = 网络号 + 主机号 192.168.1 + .34
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
                      比较, 相同则回复, 告知自己的 MAC 地址, 否则就丢弃.

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

* IP 地址

    **IP 地址分类**<br>

    <img :src="$withBase('/image/network/ip_address_001.png')" alt="IP 地址分类">
    <img :src="$withBase('/image/network/ip_address_002.png')" alt="IP 地址分类">

    ```bash
    网络地址 = Network ID + Host ID
              192.168.1 + .34
    A B C 类地址为单播地址, 用于一对一通信
    D 类地址用于多播
    E 类地址保留

    0.0.0.0
        不是真正意义上的 IP 地址, 表示所有不清楚的主机和目的网络
    255.255.255.255
        限制广播地址, 本网段内(同一广播域)所有主机. 这个地址不能被路由器转发
    127.0.0.1
        本机地址, 别名 localhost(但并不局限于 127.0.0.1, 例如还有 IPV6)
        所有 127.x.x.x 都属于回环地址(发往该类地址的数据包都应该被 loop back)
        用途: 回环测试 程序测试(Web 服务器绑定) DDos 攻击防御
    224.0.0.1
        组播地址, 从 224.0.0.0 - 239.255.255.255 都是这样的地址. 224.0.0.1 特指所有主
          机, 223.0.0.2 特指所有路由器.
    169.254.x.x
        主机使用 DHCP 时, 当 DHCP 服务故障时, Windows 系统会为你分配一个这样的地址
    10.x.x.x 172.16.x.x ~ 172.31.x.x 192.168.x.x
        私有地址. 接入 Internet 时, 要使用 NAT, 将私有地址翻译成共用地址

    127.0.0.1 是一个回环地址, 并不表示"本机", 0.0.0.0 真正表示"本网络中的本机"
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

* Ping

    **Socket 读写**<br>
    <img :src="$withBase('/image/network/icmp_001.jpg')" alt="ICMP 协议">

    ```bash
    基于 ICMP 协议工作, 探测本机与网络中另一台主机之间是否可达的命令
        ICMP 协议, Internet 控制报文协议, 基于 IP 协议
        ICMP 协议会要求目标主机在收到消息后, 必须返回 ICMP 应答消息给源主机. 如果源主机在一
          定时间内收到目标主机应答, 则表明两台主机间网络是可达的.

    1. 主机 A (192.168.0.1) 测试与主机 B (192.168.0.2), 执行 ping 192.168.0.2
    2. ping 命令在主机 A 上构建 ICMP 请求数据包, 然后 ICMP 协议将这个数据包以及目标 IP 等
        信息交给 IP 层协议
    3. IP 层协议的达消息后, 将源地址, 目标地址, 再加上一些其他控制信息, 构建 IP 数据包
    4. IP 数据包构建完成后, 需要加上 MAC 地址. 因此还需要通过 ARP 映射表找出目标 IP 所对应
        的 MAC 地址, 拿到目标 MAC 地址后, 和本机 MAC 一起交给数据链路层, 组装成一个数据帧,
        将其传送出去
    5. 目标主机收到数据帧之后, 首先检查其目标 MAC 是否为本机, 确认后检查数据帧, 将 IP 数据包
        取出, 交给本机 IP 层, 然后经 IP 层检查完后, 再将 ICMP 数据包取出来交给 ICMP 协议
        处理. 处理完毕后, 构建 ICMP 应答数据包, 会发给源主机
    6. 在一定时间内, 源主机收到应答包, 说明网络可达. 没收到则说明不可达. 除检测可达外, 还可以
        利用应答时间和发起时间差, 计算数据包延迟耗时

    ICMP 协议分类
        查询报文类型
            ping 查询 子网掩码查询 时间戳查询
        差错报文类型
            目标不可达 超时 参数问题 重定向

    Traceroute 指令
        利用 ICMP 的差错报文可以实现遍历到数据包传输路径上的所有路由器.
        每经过一个路由器, TTL 值 -1, 当 TTL = 0 时, 路由器会将数据包丢弃, 然后产生一个错
          误类型的 ICMP 数据包会发给源主机, 这时候源主机就拿到了第一个路由节点的 IP 和相关
          信息. 如此反复通过改变 TTL 值, 可以拿到源主机到目标主机间所有路由器信息.
        数据包到达目标主机后, 可以通过源主机设置一个不可达的目标端口号, 那么当这个数据包到达目
          标主机时, 目标主机会产生一个"端口不可达"的错误 ICMP 报文返回给源主机
    ```

* 参考资料

    [从 Tranceroute 看网络问题](https://cloud.tencent.com/developer/article/1004762)

---

## Socket

* Socket 创建
    ```bash
    Socket 其实是使用 <peer_addr:peer_port, local_addr:local_port> 四元组来区别不同
      socket 实例.
    一个客户端连接情况下, 有三个 socket
        服务端负责监听 ServerSocket <*:*, *:9877> 可接受任何客户端和本地任何 IP
        accept 返回 socket <127.0.0.1:client_port, 127.0.0.1:9877>
        客户端 socket <server_ip:9877, 127.0.0.1:client_port>
    ```

* Socket 读写

    **Socket 读写**<br>
    <img :src="$withBase('/image/network/socket_rdwr_001.gif')" alt="Socket 读写">

    ```bash
    read buffer, write buffer
        调用系统 API 对 socket 进行写操作是将数据拷贝到套接字对象的 write buffer, 内核网
          络模块会有专门的单独线程负责将 write buffer 的数据拷贝到网卡, 网卡再将数据发送
        读数据操作是调用系统 API 将 read buffer 的数据拷贝到用户程序内存中来

    阻塞
        write buffer 空间有限, 如果应用程序写数据太快, 空间写满了, 写操作就会阻塞, 直到这
          个空间有足够的位置空出来. NIO 写操作不阻塞, 通过返回值确定写入量, 未写入的数据用户
          程序会缓存起来, 后续再写入.
        read buffer 也可能内容为空, 此时读操作也会阻塞, 直到 read buffer 中有足够的内容.
          NIO 不会阻塞, 有多少读多少, 不够的后续继续读.
    ACK
        写缓冲数据拷贝到网卡后, 并不会立刻删除, 需要等待对方 ACK 过来后才会删除. 网络不好使,
          写缓冲也会满
    包头
        数据每经过一层, 就回添加上一层对应的包头
    速率
        读缓冲满后, 网卡收到的消息会丢弃, 也并不会发 ACK. 此时 TCP 协议会调整动态窗口,
          UDP 则会彻底丢失
    ````

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

    **三次握手 四次挥手**<br>
    <img :src="$withBase('/image/network/tcp001.jpg')" alt="TCP 三次握手 四次挥手">

    **三次握手**<br>
    <img :src="$withBase('/image/network/tcp_connect001.gif')" alt="TCP 三次握手状态">
    <img :src="$withBase('/image/network/tcp_connect002.gif')" alt="TCP 三次握手状态">
    ```bash
    半打开状态:
        syn_sent
        syn_rcvd
    ```

    **数据传输**<br>
    <img :src="$withBase('/image/network/tcp_data001.gif')" alt="TCP 数据传输">
    <img :src="$withBase('/image/network/tcp_data002.gif')" alt="TCP 数据传输">
    ```bash
    TCP 连接是双工的, 无论哪方都可以主动发起数据传输, 同时也都需要对方回复 ACK 确认
    数据发送与接收双方需要协商合适的发送与接收速率, 即 TCP 窗口大小
    接收方可以在接收到多个数据包后, 批量 ACK
    ```

    **四次挥手**<br>
    <img :src="$withBase('/image/network/tcp_disconnect001.gif')" alt="TCP 四次挥手状态">
    <img style="width: 40%" :src="$withBase('/image/network/tcp_disconnect002.gif')" alt="TCP 四次挥手状态">
    ```bash
    半关闭状态(主动关闭方发起关闭后, 并没有立刻关闭)
    time_wait 状态
        主动关闭的一方在回复完对方的挥手(ACK)后, 进入的长期状态(标准时间为 4min, 可调),
          然后才会进入 closed 状态, 释放套接字资源
        作用是重传最后一个 ACK 报文, 确保对方收到. 如果对方未收到, 重发 FIN 报文, 需要响应
        在此间, 网络上的残存报文传到时, 会被立刻丢弃
        4 min = 2 MSL (最长报文寿命), 确保残留文件彻底消失, 不影响当前端口再次利用
        四次挥手有可能中间两次合并为三次挥手, 主动关闭方从 fin_wait_1 直接进入 time_wait
    ```

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
        数据有重传也有去重

    使用场景
        When in doubt, use TCP.
    ```

    TODO: TCP 心跳, 长连接, 短连接等

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

* 概念
    ```bash
    REQUEST:
        <method> <request-url> <version>
        <headers>

        <entity-body>

    RESPONSE:
        <version> <status> <reason-phrase>
        <headers>

        <entity-body>
    ```

* Method

    ```bash
    GET
    POST
    ```


* 响应状态码
    ```bash
    101 Switching Protocols : 服务器协议转换

    200 OK : 请求成功(其后是对 GET 和 POST 请求的应答文档)
    201 Created : 请求被创建完成, 同时新的资源被创建

    301 Moved Permanently : 所请求的页面已经转移至新的 url
    302 Found : 所请求的页面已经临时转移至新的 url
    303 See Other : 所请求的页面可在别的 url 下被找到
    304 Not Modified : 资源未修改

    400 Bad Request : 服务器未能理解请求
    401 Unauthorized : 被请求的页面需要身份验证, 需要提供用户名和密码
    403 Forbidden : 服务器理解请求, 但拒绝执行
    404 Not Found : 请求失败, 请求所希望的资源未在服务器上发现

    500 Internal Server Error: 请求未完成, 服务器遇到不可预知的情况
    ```

* HTTP 缓存

    ```bash
    相关概念:
        新鲜度检测
            发起请求时, 先对缓存资源进行判断是否可以直接使用
            相关服务器响应报头字段
                Cache-Control: max-age
                Expire
        再验证
            发现缓存超时, 需要先去服务器查看该资源是否改变
            相关条件请求头部字段
                If-Modified-Since
                If-None-Match
                If-Unmodified-Since
                If-Range
                If-Match
        再验证命中
            服务器发现该 URL 资源没有发生变化, 返回 304 Not Modified, 且不再返回该实体

    流程:
        1. 从接收到的请求中, 解析出 URL 和各个首部
        2. 查询本地是否有混村副本可用
        3. 如果有缓存, 则进行新鲜度检测, 如果缓存足够新鲜, 则使用缓存作为响应返回; 如果不新
            鲜了, 则构造条件请求, 发往服务器验证. 如果没有缓存, 直接将请求发往服务器.
        4. 从服务器返回的响应, 更新或是新增到缓存中
    ```

* OAuth 认证授权协议

* HTTPS