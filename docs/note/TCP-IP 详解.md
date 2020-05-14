# TCP/IP 详解

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>

[[TOC]]

---

## 01 - 概述

### 分层

**TCP/IP 协议族分层**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/01/tcpip_002.png')" alt="TCP/IP 协议族分层">

```bash
链路层
    设备驱动程序及接口卡
网络层
    IP ICMP IGMP
传输层
    TCP UNP
应用层
    Telnet FTP SMTP SNMP
```

### 互联网地址

**五类IP地址**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/01/ip_address_001.png')" alt="五类 IP 地址">

```bash
A: 0.0.0.0   - 127.255.255.255
B: 128.0.0.0 - 191.255.255.255
C: 192.0.0.0 - 223.255.255.255
D: 224.0.0.0 - 239.255.255.255
E: 240.0.0.0 - 247.255.255.255

单播 组播 广播
```

### 封装

**数据封装**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/01/data_package_001.png')" alt="数据封装">

```bash
TCP -> IP 的数据单元称为 TCP 段(TCP segment)
IP -> 网络接口层 的数据单元称为 IP 数据报(IP datagram)
以太网传输的比特流称为 帧(Frame)
```

### 分用

**数据分用**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/01/data_demultiplexing_001.png')" alt="数据分用">

```bash
Demultiplexing

目的主机收到以太网数据帧时, 数据开始从协议栈中由底向上升, 同时去掉各层协议加上报文首部.
  每层协议盒都要检查报文首部中的协议标识, 以确定接受数据的上层协议. 这个过程称作分用.
```

### 客户-服务器模型

```bash
重复型
并发型
```

### 端口号

```bash
/etc/service 查看
```


## 02 - 链路层

* 链路层
    - 为 IP 模块发送和接收 IP 数据报
    - 为 ARP 模块发送 ARP 请求和接收 ARP 应答
    - 为 RARP 发送 RARP 请求和接收 RARP 应答

### 环回接口

**环回接口处理IP数据报流程**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/02/lookback_interface_001.png')" alt="环回接口处理IP数据报流程">

```bash
Loopback Interface
允许运行在同一台主机上的客户程序和服务器程序通过 TCP/IP 进行通信.
    127.0.0.1(命名为 localhost)

1. 传给环回地址的任何数据均作为 IP 输入
2. 传给广播和多播地址的数据报会复制一份传给环回接口, 然后送到以太网上
3. 任何传给该主机 IP 地址的数据均送到环回接口
```

### 最大传输单元 MTU

```bash
MTU: 链路层以太网协议等对应的数据帧长度最大值(不包括以太网首部/尾部)
    以太网 MTU : 1500
    Internet MTU : 576
    IP 层数据报长度超出链路层 MTU 时, IP 层需要进行分片(fragmentation)

路径 MTU: 两台通信主机路径中最小 MTU
    路径 MTU 受两端各自方向选路不同, 两台主机间 MTU 值可能不一样
```

```bash
[root@ ~]# ifconfig -a
docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.18.0.1  netmask 255.255.0.0  broadcast 172.18.255.255
        inet6 fe80::42:1eff:fe10:960f  prefixlen 64  scopeid 0x20<link>
        ether 02:42:1e:10:96:0f  txqueuelen 0  (Ethernet)
        RX packets 624  bytes 106169 (103.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 502  bytes 1028258 (1004.1 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# eth0 以太网接口, 支持以太网协议
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.2  netmask 255.255.240.0  broadcast 172.17.15.255
        inet6 fe80::5054:ff:fe1d:9861  prefixlen 64  scopeid 0x20<link>
        ether 52:54:00:1d:98:61  txqueuelen 1000  (Ethernet)
        RX packets 9750326  bytes 2354351488 (2.1 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9518774  bytes 1918820423 (1.7 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# loopback 接口, 支持 loopback 协议
lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 7527  bytes 369759 (361.0 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 7527  bytes 369759 (361.0 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

# 查看各个链路层协议 MTU 值
[root@ ~]# netstat -in
Kernel Interface table
Iface             MTU    RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg
docker0          1500      624      0      0 0           502      0      0      0 BMU
eth0             1500  9750648      0      0 0       9519116      0      0      0 BMRU
lo              65536     7527      0      0 0          7527      0      0      0 LRU
```


## 03 - IP 网际协议

> 不可靠 unreliable
>> 不保证 IP 数据报能成功到达目的地, 任务的可靠性需要由上层来提供

> 无连接 connectionless
>> IP 并不维护任何关于后续数据报的状态信息, 每个数据报处理相互独立. 发送到达顺序, 路径均可不同

### IP 首部

**IP 首部**
<img :src="$withBase('/image/network/tcpip-illustrated/03/ip_header_001.png')" alt="IP 首部">


```bash
高位                                                        低位
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Version|  IHL  |Type of Service|          Total Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Identification        |Flags|      Fragment Offset    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Time to Live |    Protocol   |         Header Checksum       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Source Address                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Destination Address                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Options                    |    Padding    |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Version 版本
    目前为 4, 即 IPv4
IHL 首部长度
TOS 服务类型
    3bit 优先权子段 + 4bit TOS 子段 + 1bit 0
    TOS 子段
        最小时延
        最大吞吐量
        最高可靠性
        最小费用
Total Length 整个 IP 数据报长度
    16 bit, 最大长度 = 2^16 - 1 = 65535 byte
Identification 标识字段
    唯一的标识主机发送的每一份数据报, 通常每次 +1
TTL 生存时间
    数据报可以经过的最多路由器数, 每次 -1, 防止由于路由环路导致的不停转发
    TTL 为 0 时, 数据报被丢弃, 并发送 ICMP 报文通知源主机
Protocol
    标识上层所使用的协议(TCP UDP 等)
Header Checksum
    IP Header 部分的校验和, 不包括数据部分
Source Address / Destination Address
    除非使用 NAT, 否则整个传输中, 二者不变
Options
    以 32bit 为界限, 必要时插入 0 填充, 保证 IP 首部始终是 32bit 的整数倍
```

```bash
big endian 字节序
    传输顺序为 0-7, 8-15, 16-23, 24-31 bit
    TCP/IP 首部中所有二进制整数在网络中传输都为此次序
```

### IP 路由选择

```bash
1. 如果目的主机与源主机直接相连, 或在一个共享网络上, IP 数据报直接送到目的主机上.
2. 不直接相连时, 主机把数据报发往默认的路由器上, 又路由器转发该数据报

IP 层既可以配置成路由器功能, 也可以配置成主机功能.
    主机不会把数据报从一个接口转发到另一个接口, 路由器会转发.
IP 在内存中有一个路由表, 当收到一份数据报并进行发送时, 都要对该表搜索一次.
    接收到某个网络接口的数据报时, 检查目的 IP 地址是否为本机 IP 地址或 IP 广播地址, 是则由
      对应协议模块处理. 不是则, IP 层设置为路由器功能就转发, 否则就丢弃数据报

路由表信息
    目的 IP 地址
    下一站路由器 IP 地址 / 直连网络 IP 地址
    标志
        其中一个标志致命目的 IP 地址是网络地址还是主机地址
        另一个标志致命下一站路由器是否为真正的下一站路由器, 还是直连接口
    为数据报的传输指定一个网络接口

IP 路由选择
    通过逐跳来实现
    数据报在各站的传输过程中目的 IP 地址始终不变, 但是封装和目的链路层地址每一站都可以改变.
```

### 子网

```bash
A B 类地址一般都要进行子网划分, 用于子网号的比特数通过子网掩码来指定.

B 类地址子网编址
    一种划分: 16bit 网络号 + 8bit 子网号 + 8bit 主机号
子网编址可以缩小 Internet 路由表规模.

子网掩码
    值为 1 的比特留给网络号和子网号, 为 0 的比特留给主机号
```

### 特殊情况 IP

**特殊 IP地址**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/03/special_ip_001.png')" alt="特殊 IP地址">

### 命令

```bash
[root@ ~]# ifconfig
docker0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 172.18.0.1  netmask 255.255.0.0  broadcast 172.18.255.255
        inet6 fe80::42:1eff:fe10:960f  prefixlen 64  scopeid 0x20<link>
        ether 02:42:1e:10:96:0f  txqueuelen 0  (Ethernet)
        RX packets 624  bytes 106169 (103.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 502  bytes 1028258 (1004.1 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.2  netmask 255.255.240.0  broadcast 172.17.15.255
        inet6 fe80::5054:ff:fe1d:9861  prefixlen 64  scopeid 0x20<link>
        ether 52:54:00:1d:98:61  txqueuelen 1000  (Ethernet)
        RX packets 9793138  bytes 2358843500 (2.1 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9564495  bytes 1925846680 (1.7 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 7566  bytes 371672 (362.9 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 7566  bytes 371672 (362.9 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@ ~]# ifconfig eth0
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.0.2  netmask 255.255.240.0  broadcast 172.17.15.255
        inet6 fe80::5054:ff:fe1d:9861  prefixlen 64  scopeid 0x20<link>
        ether 52:54:00:1d:98:61  txqueuelen 1000  (Ethernet)
        RX packets 9793152  bytes 2358844444 (2.1 GiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 9564505  bytes 1925848928 (1.7 GiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

[root@ ~]# netstat -in
Kernel Interface table
Iface             MTU    RX-OK RX-ERR RX-DRP RX-OVR    TX-OK TX-ERR TX-DRP TX-OVR Flg
docker0          1500      624      0      0 0           502      0      0      0 BMU
eth0             1500  9793168      0      0 0       9564517      0      0      0 BMRU
lo              65536     7566      0      0 0          7566      0      0      0 LRU
```

### FAQ

1. 给定 IP 地址和子网掩码, 可以知道哪些信息?
> 本机 IP 的类型, 子网号, 主机号

2. 环回地址必须是 127.0.0.1 吗?
> 不是必须. 127.0.0.0 - 127.255.255.255 均是环回地址


## 04 - ARP 地址解析协议
> 地址解析为两种不同的地址形式提供映射: 32bit IP 地址和数据链路层使用的任何类型地址
>> ARP 地址解析协议: 32bit IP 地址 -> 48bit 以太网地址<br>
>> RARP 逆地址解析协议: 48bit 以太网地址 -> 32bit IP 地址

### ARP 协议

* ARP

    ```bash
    当一台主机把以太网数据帧发送到位于同一局域网的另一台主机时, 设备驱动程序不检查 IP 数据报
      中的 IP 地址, 而是根据 48bit 的以太网地址来确定目的主机的.
    ARP 为 IP 地址到对应的硬件地址间提供动态映射.
    ARP 用于运行 IPv4 的多接入链路层网络, 在点对点链路中不使用 ARP.
    ARP 是一个通用协议, 可以支持多种地址之间的映射, 实际中总是用于 32bit IPv4 地址和
      48bit MAC 地址之间的映射

    源主机发送数据前都会检查自己的 ARP 列表中是否有该 IP 对应的 MAC 地址, 有则直接发送, 没
      有则需要查询
    ```

* FTP 示例

    **FTP ARP 流程**<br>
    <img :src="$withBase('/image/network/tcpip-illustrated/04/arp_ftp_001.png')" alt="FTP ARP 流程">

    ```bash
    # ftp louistian.xyz

    1. 调用 gethostbyname() 将主机名转换为 32bit IP 地址. 转换过程使用 DNS 或者使用静
        态注记文件 /etc/hosts
    2. FTP 客户端请求 TCP 使用获取到的 IP 地址建立连接
    3. TCP 发送一个连接请求分段到远程主机, 即使用上述 IP 地址发送一份 IP 数据报
    4. 如果目的主机在本地网络上, 那么 IP 数据报可以直接送到目的主机上. 如果目的主机在一个远程
        网络上, 那么就通过 IP 选路函数来确定位于本地网络上的下一站路由器地址, 并让其转发 IP
        数据报. 此时, IP 数据报都是被送到位于本地网络上的一台主机或路由器
    5. 在以太网中, ARP 发送一份 ARP 请求以太网数据帧到以太网上的每个主机, 即广播. ARP 请求
        数据帧中包含目的主机 IP 地址
    6. 目的主机 ARP 层收到广播报文后, 识别与自己的 IP 地址一致, 发送一个 ARP 应答. 应答中
        包含 IP 地址和对应的 MAC 地址
    7. 收到 ARP 应答后, 可以根据 MAC 地址发送 IP 数据报
    8. IP 数据报发送到目的主机
    ```

* ARP 代理

    ```bash
    当发送主机和接收主机不在同一个局域网中时, 即使知道目的主机 MAC 地址, 两者也不能相互通信,
      必须经过路由器转发才可以. 此时发送主机通过 ARP 协议获取的不是目的主机的真实 MAC 地址,
      而是一台可以通往局域网外的路由器的 MAC 地址, 此后发送主机发往目的主机的所有帧, 都将发
      往该路由器, 由其进行向外发送.
    ```

### ARP 高速缓存

```bash
每个主机上都有 ARP 高速缓存, 缓存有效时间 20min

[louis@louis ~]$ arp -a
_gateway (192.168.6.2) at 00:50:56:eb:f3:c0 [ether] on ens160
? (192.168.6.1) at 00:50:56:c0:00:08 [ether] on ens160
```

### ARP 分组格式

**ARP 分组格式**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/04/arp_format_001.png')" alt="ARP 分组格式">

* PING 示例

    ```bash
    1. CMD 管理员运行, arp -d 清除所有高速缓存
    2. ping 192.168.2.106
    3. arp -a 查看高速缓存
        C:\Windows\system32>arp -a
        Interface: 192.168.2.104 --- 0xd
        Internet Address      Physical Address      Type
        192.168.2.1           30-fc-68-b4-2f-25     dynamic
        192.168.2.106         94-0c-98-6a-2a-97     dynamic
        192.168.2.255         ff-ff-ff-ff-ff-ff     static
        224.0.0.2             01-00-5e-00-00-02     static
        224.0.0.22            01-00-5e-00-00-16     static
        224.0.0.251           01-00-5e-00-00-fb     static
        224.0.0.252           01-00-5e-00-00-fc     static
        239.255.255.250       01-00-5e-7f-ff-fa     static
    ```

    - ARP 广播请求
    <img :src="$withBase('/image/network/tcpip-illustrated/04/arp_broadcast_001.png')" alt="ARP 广播请求">

    ```bash
    以太网帧头部分
    0-15bit : 以太网帧头目的地址, ff:ff:ff:ff:ff:ff 广播
    16-31bit : 以太网帧头源地址, 34:13:e8:5e:41:51
    32-39bit : 帧类型, 0806 表示 ARP 协议

    ARP 数据部分
    0-15bit : 硬件类型, 0001 以太网
    16-31bit : 协议类型, 0800 IPv4 协议
    32-39bit : MAC 地址长度, 06 6byte
    40-47bit : 协议地址长度, 05 4byte
    48-63bit : 操作码, 0001 ARP 请求
    64-111bit : 发送方 MAC 地址, 34:13:e8:5e:41:51
    112-143bit : 发送方 IP 协议地址, c0 a8 02 68 => 192.168.2.106
    144-191bit : 接收方 MAC 地址, 一般全 0
    192-123bit : 接收方 IP 协议地址(需对应协议类型), c0 a8 02 6a => 192.168.2.106
    ```

    - ARP 广播响应
    <img :src="$withBase('/image/network/tcpip-illustrated/04/arp_broadcast_002.png')" alt="ARP 广播响应">

    ```bash
    以太网帧头部分

    ARP 数据部分
    48-63bit : 操作码, 0002 ARP 响应
    64-111bit : 发送方 MAC 地址, 94:0c:98:6a:2a:97
    112-143bit : 发送方 IP 协议地址, c0 a8 02 6a => 192.168.2.106
    144-191bit : 接收方 MAC 地址, 34:13:e8:5e:41:51
    192-123bit : 接收方 IP 协议地址(需对应协议类型), c0 a8 02 68 => 192.168.2.106
    ```


## 05 - RARP 逆地址解析协议
> 具有本地磁盘的系统引导时, 一般从磁盘上的配置文件中读取 IP 地址. 无盘系统的 RARP 实现过程
> 是从接口卡上读取唯一的硬件地址, 然后发送一份 RARP 请求广播, 请求某个主机响应该无盘系统的
> IP 地址.

### RARP 协议

**RARP 分组格式**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/05/rarp_format_001.png')" alt="RARP 分组格式">

```bash
以太网帧类型代码 0x8035
请求操作代码 3
应答操作代码 4
```

### RARP 发送与接收

```bash
RARP 请求在网络上进行广播, 在分组中标明发送端的硬件地址, 以请求相应 IP 地址的响应. 应答通常
  是单播传送的.

ARP 服务器通常是 TCP/IP 在内核中实现.
RARP 服务器功能一般由用户进程提供.
每个网络中有多个 RARP 服务器, 每个服务器对每个 RARP 请求都要发送应答. 发送请求的无盘系统一
  般采用最先收到的 RARP 应答.
```


## 06 - ICMP Internet 控制报文协议
> IP 层的一部分, 主要传递差错报文及其他需要注意的信息.<br>
> ICMP 通常被 IP 层或更高层协议使用.
>> 确认 IP 包是否成功到达目的地址
>> 通知在发送过程中 IP 包被丢弃的原因

### ICMP 控制报文协议

**ICMP 报文封装**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_001.png')" alt="ICMP 报文封装">

**ICMP 报文**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_002.png')" alt="ICMP 报文">

```bash
0-7bit : ICMP 报文类型, 1-127 为差错报文, >=128 为信息报文
8-15bit : ICMP 报文代码, 与类型字段一起标识 ICMP 报文详细类型
16-31bit : 校验和
```

**ICMP 消息类型**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_003.png')" alt="ICMP 消息类型">

* 常见 ICMP 报文

    ```bash
    请求回显
        ping 操作包括请求回显(类型 8)和应答(类型 0) ICMP 报文
    目标不可达 (类型 3)
        路由器或主机不能传递数据时使用. 如连接对方不存在的系统端口
            网络不可达 (类型 3, 代码 0)
            主机不可达 (类型 3, 代码 1)
            协议不可达 (类型 3, 代码 2)
            端口不可达 (类型 3, 代码 3)
    源抑制报文 (类型 4, 代码 0)
        控制流量, 通知主机减少数据报流量. 停止则主机恢复传输速率
    超时报文 (类型 11)
        无连接网络传输出现问题, 触发 ICMP 超时报文
            传输超时 (代码 0)
            分段重组超时 (代码 1)
    时间戳请求
        测试两台主机间数据报来回一次传输的时间
            请求报文 (类型 13)
            应答报文 (类型 14)
    ```

    - 不产生 ICMP 差错报文的情况

        ```
        1. ICMP 差错报文
        2. 目的地址是广播地址或多播地址的 IP 数据报
        3. 作为链路层广播的数据报
        4. 不是 IP 分片的第一片
        5. 源地址不是单个主机的数据报 (零地址, 环回地址, 广播地址, 多播地址)
        ```

* ICMP 与 IP

    ```bash
    ICMP 内容放在 IP 数据包的数据部分来发送的, 但是ICMP 主要是辅助 IP 的一部分功能, 所以
      二者是同层的协议
    ```

### Ping

**Ping Request**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_ping_001.png')" alt="Ping Request">

**Ping Response**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_ping_002.png')" alt="Ping Response">

```bash
ping 功能
    验证网络连通性
    统计响应时间和 TTL
ping 是在网络层, 没有端口的概念
```

### ICMP 相关应用

**ICMP 路径 MTU 探索**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_004.png')" alt="ICMP 路径 MTU 探索">

**ICMP 改变路由**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_005.png')" alt="ICMP 改变路由">

**ICMP 源点抑制**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_006.png')" alt="ICMP 源点抑制">

**ICMP Ping**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_007.png')" alt="ICMP Ping">

**ICMP traceroute**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_008.png')" alt="ICMP traceroute">

**ICMP 端口扫描**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/06/icmp_009.png')" alt="ICMP 端口扫描">

> 只针对 UDP, TCP 可以通过建立连接来判断.<br>
> 注意即使 ICMP 端口不可达报文没有返回, 也不能断定端口一定就开着.



## 07 - Ping 程序

### Ping

```bash
ping 程序是对两个 TCP/IP 系统连接性进行测试的基本工具. 只利用 ICMP 回显请求和回显应答报文,
  不用经过传输层.
ping 服务器一般在内核中实现 ICMP 功能.
```

### LAN Ping 示例

**Ping ARP 请求**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/07/lan_ping_arp_001.png')" alt="Ping ARP 请求">

**Ping ARP 回复**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/07/lan_ping_arp_002.png')" alt="Ping ARP 回复">

**Ping ICMP 请求**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/07/lan_ping_icmp_001.png')" alt="Ping ICMP 请求">

**Ping ICMP 回复**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/07/lan_ping_icmp_002.png')" alt="Ping ICMP 回复">

```bash
1. 源主机发起 Ping 请求时, 会首先查询自己的 MAC 地址表(ARP 高速缓冲), 如果没有, 就需要发
     送ARP 广播包. 交换机接收到 ARP 报文后, 会检索自己的 MAC 地址表, 有则返回, 没有则向所
     有主机发送 ARP 广播, 其他主机收到后, 非目的主机丢弃该报文, 目的主机响应该报文, 同时缓
     存源主机 MAC 地址.
2. 源主机收到目的主机响应后, 根据其 MAC 地址, 封装 ICMP 协议请求报文并发送
3. 目的主机收到 ICMP 回显请求, 执行响应
```

### WAN Ping

```bash
当源主机与目的主机不在同一网段时, 会由网关转发.
```


## 08 - Traceroute 程序
> Traceroute 程序可以让我们看到 IP 数据报从一台主机传到另一台主机所经过的路由.

### Traceroute

```bash
程序使用 ICMP 报文和 IP 首部中的 TTL 字段.
    TTL 字段是由发送端初始设置一个 8bit 字段.
    每个处理数据报的路由器都需要把 TTL 字段的值减 1, 或数据报在路由器上停留的秒数.
    当路由器收到一份 IP 数据报, 如果其 TTL 字段是 0 或 1, 则路由器不转发该数据报, 路由器
      将该数据报丢弃, 并给信号源机发一份 ICMP "超时" 信息.
    traceroute 程序获取该 ICMP 信息的 IP 报文的信源地址即该路由器的 IP 地址.
    traceroute 程序发送给目的主机的 UDP 数据报, 一般都选择一个不可能的值作为 UDP 的端口,
      当 UDP 数据报到达目的主机时, 使目的主机产生一个 "端口不可达" ICMP 报文.
    traceroute 根剧区分接收到的 ICMP 报文是超时还是端口不可达, 即可判断何时结束.
```


**Traceroute 流程**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/08/traceroute_001.png')" alt="Traceroute 流程">

**Traceroute TTL 1**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/08/traceroute_002.png')" alt="Traceroute TTL 1">

**Traceroute TTL 2**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/08/traceroute_003.png')" alt="Traceroute TTL 2">

**Traceroute ICMP 超时**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/08/traceroute_004.png')" alt="Traceroute ICMP 超时">

**Traceroute ICMP 端口不可达**<br>
<img :src="$withBase('/image/network/tcpip-illustrated/08/traceroute_005.png')" alt="Traceroute 端口不可达">

* 指令

    ```bash
    [root@ ~]# traceroute 1.1.1.1
    traceroute to 1.1.1.1 (1.1.1.1), 30 hops max, 60 byte packets
    1  * * *
    2  100.104.251.210 (100.104.251.210)  0.653 ms *  0.835 ms
    3  * * *
    4  101.227.217.33 (101.227.217.33)  1.983 ms 10.196.4.217 (10.196.4.217)  1.700 ms 10.196.4.213 (10.196.4.213)  2.214 ms
    5  182.254.127.120 (182.254.127.120)  1.877 ms  1.935 ms 182.254.127.119 (182.254.127.119)  1.979 ms
    6  * 101.227.217.37 (101.227.217.37)  1.267 ms *
    7  101.89.240.37 (101.89.240.37)  2.740 ms 101.89.240.57 (101.89.240.57)  1.665 ms 101.95.120.178 (101.95.120.178)  5.875 ms
    8  101.95.206.17 (101.95.206.17)  3.283 ms 124.74.166.217 (124.74.166.217)  3.593 ms 124.74.166.149 (124.74.166.149)  10.170 ms
    9  202.97.12.210 (202.97.12.210)  6.108 ms 61.152.24.18 (61.152.24.18)  5.225 ms 61.152.86.142 (61.152.86.142)  3.788 ms
    10  * * 202.97.57.25 (202.97.57.25)  19.366 ms
    11  202.97.12.201 (202.97.12.201)  3.835 ms 202.97.12.190 (202.97.12.190)  4.261 ms 202.97.33.154 (202.97.33.154)  4.667 ms
    12  202.97.50.10 (202.97.50.10)  179.395 ms 202.97.43.234 (202.97.43.234)  173.581 ms 202.97.58.178 (202.97.58.178)  171.721 ms
    13  202.97.92.37 (202.97.92.37)  169.941 ms  164.142 ms 202.97.90.118 (202.97.90.118)  153.497 ms
    14  218.30.54.214 (218.30.54.214)  174.118 ms  185.178 ms  173.972 ms
    15  * * one.one.one.one (1.1.1.1)  161.288 ms
    ```

* 注意

    每个 IP 数据报所有的路由路径都有可能不同, 所以 traceroute 所探测的只是大概路径.


## 09 - IP 选路


## 10 - 动态选路协议


## 11 - UDP 用户数据报协议

## 12 - 广播和多播
> 广播和多播仅适用于 UDP
