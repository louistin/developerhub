# 07 Ping 程序

## Ping

```bash
ping 程序是对两个 TCP/IP 系统连接性进行测试的基本工具. 只利用 ICMP 回显请求和回显应答报文,
  不用经过传输层.
ping 服务器一般在内核中实现 ICMP 功能.
```

## LAN Ping 示例

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

## WAN Ping

```bash
当源主机与目的主机不在同一网段时, 会由网关转发.
```