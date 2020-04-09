# 06 ICMP Internet 控制报文协议
> IP 层的一部分, 主要传递差错报文及其他需要注意的信息.<br>
> ICMP 通常被 IP 层或更高层协议使用.
>> 确认 IP 包是否成功到达目的地址
>> 通知在发送过程中 IP 包被丢弃的原因

## ICMP 控制报文协议

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

## Ping

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

## ICMP 相关应用

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

