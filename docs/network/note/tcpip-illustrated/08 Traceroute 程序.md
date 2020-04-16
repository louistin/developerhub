# 08 Traceroute 程序
> Traceroute 程序可以让我们看到 IP 数据报从一台主机传到另一台主机所经过的路由.

## Traceroute

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
