# CentOS 最小化配置安装

1. shadowsocks 安装配置
```
yum install python
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py   # 下载安装脚本
sudo python get-pip.py    # 运行安装脚本 
pip install shadowsocks

[root@louis etc]# cat shadowsocks.conf 
{
    "server":"::",
    "server_port":8388,
    "local_address": "127.0.0.1",
    "local_port":10800,
    "password":"st271828",
    "timeout":300,
    "method":"aes-256-cfb",
    "workers": 2,
    "fast_open": false
}
```

2. git 安装配置
```
wget https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.22.0.tar.gz
./configure
make && make install
```