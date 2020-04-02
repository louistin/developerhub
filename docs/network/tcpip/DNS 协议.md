# DNS 协议
> Domain Name System

## DNS 协议基础

* 域名空间

    ```bash
    使用层次的地址结构
    顶级域名(.com .cn .edu ...) -> 二级域名 -> 三级域名
    ```

* 域名资源记录

    ```bash
    Domain_name Time_to_live Class Type Value
    Domain_name : 指出此条记录适用于那个域名
    Time_to_live : 记录生存周期
    Class : 一般为 IN
    Type : 记录的类型
    Value : 记录的值
        A (IPv4)
        AAA (IPv6)
        CNAME (当前域名别名)
        NS (该域名所在域的权威域名服务器)
        MX (接受特定域名电子邮件的服务器域名)
    ```

* 域名服务器

    ```bash
    将域名的名字空间划分为不重叠的区域(DNS Zone), 然后将每个区域与多个域名服务器(其中一个是
      master, 其他为 slave)关联起来, 这些域名服务器为该地区的权威域名服务器.

    权威域名服务器保存域名资源记录:
        该区域内所有域名的域名资源记录
        父区域和子区域的域名服务器对应的域名资源记录(NS 记录)

    根域名服务器保存所有顶级区域的权威域名服务器记录, 通过其可以找到所有顶级区域的权威域名服务
      器, 然后可以往下一级一级查找.
    ```

* 域名解析

    ```bash
    Client -> 本地域名服务器(8.8.8.8) - 查到了 -> 返回记录
                    - 没查到 -> 从根域名服务器开始向下搜索, 逐级查找

    ```

## 缓存机制

    ```bash
    本机缓存
    域名服务器缓存
    Time_to_live 字段决定缓存有效期
    ```

## 其他

* 域名解析相关指令

    ```bash
    [root@ ~]# dig baidu.com -t A +short
    39.156.69.79
    220.181.38.148

    [root@ ~]#  dig -x 119.3.85.251 +short
    ecs-119-3-85-251.compute.hwclouds-dns.com.

    # 解析路径查询
    dig baidu.com +trace @8.8.8.8
    ```

* DNS 劫持

    ```bash
    # 域名服务器自己搞怪, 解析错误

    [root@ ~]#  nslookup google.com
    Server:		183.60.83.19
    Address:	183.60.83.19#53

    Non-authoritative answer:
    Name:	google.com
    Address: 46.82.174.69
    Name:	google.com
    Address: 2404:6800:4012::200e

    # 验证
    [root@ ~]# whois 46.82.174.69

    # 指定解析 DNS
    [root@ ~]# nslookup facebook.com 8.8.8.8
    ```

* DNS 欺骗

    ```bash
    Client 请求 DNS Server 后, 收到伪造的欺骗响应数据
    ```