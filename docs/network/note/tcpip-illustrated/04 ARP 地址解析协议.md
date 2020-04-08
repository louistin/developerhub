# 04 ARP 地址解析协议
> 地址解析为两种不同的地址形式提供映射: 32bit IP 地址和数据链路层使用的任何类型地址
>> ARP 地址解析协议: 32bit IP 地址 -> 48bit 以太网地址<br>
>> RARP 逆地址解析协议: 48bit 以太网地址 -> 32bit IP 地址

## ARP 协议

* ARP

    ```bash
    当一台主机把以太网数据帧发送到位于同一局域网的另一台主机时, 设备驱动程序不检查 IP 数据报
      中的 IP 地址, 而是根据 48bit 的以太网地址来确定目的主机的.
    ARP 为 IP 地址到对应的硬件地址间提供动态映射.
    ARP 用于运行 IPv4 的多接入链路层网络, 在点对点链路中不使用 ARP.
    ARP 是一个通用协议, 可以支持多种地址之间的映射, 实际中总是用于 32bit IPv4 地址和
      48bit MAC 地址之间的映射
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

## ARP 高速缓存

```bash
每个主机上都有 ARP 告诉缓存, 缓存有效时间 20min

[louis@louis ~]$ arp -a
_gateway (192.168.6.2) at 00:50:56:eb:f3:c0 [ether] on ens160
? (192.168.6.1) at 00:50:56:c0:00:08 [ether] on ens160
```

## ARP 分组格式

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


