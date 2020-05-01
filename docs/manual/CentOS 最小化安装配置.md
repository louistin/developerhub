# CentOS 最小化配置安装

## 系统配置

```bash
# 添加管理员用户
adduser louis
passwd louis
/etc/sudoers
    root       ALL=(ALL)           ALL
    louis      ALL=(ALL)           ALL

# 修改主机名
hostnamectl set-hostname louis
```

---

## 应用配置

1. 基础应用安装
    ```bash
    # 这里面有些太老应用的需要卸载后重新安装
    yum install groupinstall "Development Tools"

    yum install epel-release \
        gcc-c++ \
        iftop \
        htop \
        python-pip python-devel \
        lrzsz \
        openssl openssl-devel \
        curl curl-devel \
        expat expat-devel \
        ncurses ncurses-devel \
        readline readline-devel \
        lua lua-devel luajit luajit-devel \
        java java-devel \
        maven \
        tcl tcl-devel \




    pip install mycli
    ```


2. GCC
    ```bash
    yum install centos-release-scl scl-utils-build
    yum install devtoolset-8-gcc.x86_64 devtoolset-8-gcc-c++.x86_64 devtoolset-8-gcc-gdb-plugin.x86_64
    scl enable devtoolset-8 bash    # 切换到 gcc 8, 只对当前 bash 有效
    exit                            # 退出当前 bash 环境, 恢复系统默认 bash
    ```

3. Git
    ```bash
    # 下载源码
    https://codeload.github.com/git/git/zip/master

    yum -y install openssl openssl-devel curl curl-devel unzip perl perl-devel \
                    expat expat-devel zlib zlib-devel asciidoc xmlto \
                    gettext-devel openssh-clients

    make all && make prefix=/usr/local/git install

    # 添加环境变量 /etc/profile
    GIT_HOME=/usr/local/git
    PATH=$GIT_HOME/bin:$GIT_HOME/libexec/git-core:$PATH

    # 效果同上
    export $GIT_HOME=/usr/local/git
    export PATH=$GIT_HOME/bin:$GIT_HOME/libexec/git-core:$PATH

    source /etc/profile

    # 配置 生成公钥 ~/.ssh/id_rsa.pub
    git config --global user.name "louis"
    git config --global user.email "louis.tianlu@gmail.com"
    ssh-keygen -t rsa -C "louis.tianlu@gmail.com"
    ```

4. Vim
    ```bash
    # 系统自带 vim 不支持某些脚本插件
    yum install ncurses ncurses-devel readline readline-devel

    ./configure --prefix=/usr --with-features=huge --enable-rubyinterp \
        --enable-pythoninterp --enable-python3interp --enable-luainterp \
        --with-lua-prefix=/usr

    make && make install
    ```

5. MySQL
    ```bash
    # 下载 rpm 源
    https://dev.mysql.com/downloads/repo/yum/
    rpm -ivh *.rpm
    # 安装
    yum install mysql-community-server mysql mysql-devel
    # 启动/重启/停止
    systemctl start/restart/stop mysqld
    # 设置开机启动
    systemctl enable mysqld
    systemctl daemon-reload
    # 获取初始密码并登录
    grep 'temporary password' /var/log/mysqld.log
    # 修改密码 大小写字母 + 数字 + 特殊符号
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'St#271828';
    # 修改默认编码 /etc/my.cnf
    socket=/var/lib/mysql/mysql.sock # 添加到此句之后
    character-set-server=utf8
    ```

6. Jenkins
    ```bash
    # https://pkg.jenkins.io/redhat-stable/
    wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
    rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
    yum install jenkins

    systemctl start jenkins

    # 修改端口号 /etc/sysconfig/jenkins
    # 初始密码 /var/lib/jenkins/secrets/initialAdminPassword
    # 输入密码后进入插件安装选择界面, 此时不要点, 先配置下面的内容, 不要重启, 替换完毕后再点
    # 选择安装默认插件

    # 解决插件安装慢问题
    http://ip:port/pluginManager/advanced
    # Update Site 替换为
    https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
    # Vim 替换 /var/lib/jenkins/updates/default.json
    :1,$s/http:\/\/updates.jenkins-ci.org\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g
    :1,$s/http:\/\/www.google.com/https:\/\/www.baidu.com/g
    # 替换后重启 Jenkins
    systemctl restart jenkins

    # 配置
    # Plugin Manager 安装 Github 插件
    # Global Tool Configuration 配置 git (安装的高版本) path: /usr/local/git/bin
    # 安装 NodeJS 插件, 配置 node path
    # 安装 workspace cleanup, Build Environment -> Delete workspace before build starts
    # NodeJS 配置最终解决方法是不适用系统node 而是使用插件安装
    ```

7. NodeJS
    ```bash
    # 下载源码 https://nodejs.org/en/
    ./configure
    make && make install
    ```

8. shadowsocks
    ```bash
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

9. Redis
    ```bash
    # 下载源码
    http://download.redis.io/redis-stable.tar.gz
    # 编译安装
    mkdir -p /usr/local/redis/etc
    make && make PREFIX=/usr/local/redis install
    # 修改配置 redis.conf
    cp redis.conf /usr/local/redis/etc
    daemonize yes
    # 追加环境变量 /etc/profile
    export PATH=/usr/local/redis/bin:${PATH}
    # 开机启动 /etc/rc.local 追加
    /usr/local/redis/bin/redis-server /usr/local/redis/etc/redis.conf
    ```

10. OpenResty
    ```bash
    # 下载源码
    http://openresty.org/cn/download.html
    # 编译安装
    ./configure --prefix=/opt/openresty --with-luajit
    gmake && gmake install
    ```