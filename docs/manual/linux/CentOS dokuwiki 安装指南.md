# CentOS dokuwiki 安装指南
> dokuwiki 运行需要依赖于 php 环境, 由于 CentOS 7 环境较老, 所以需要编译安装.

## 1. PHP 安装配置
```bash
# 下载最新stable PHP
https://www.php.net/downloads.php#v7.4.1

# 解压, 安装依赖
https://blog.csdn.net/gao449812984/article/details/80843118

./confgure
make && make install

# php-fpm 修改
/usr/local/etc/php-fpm.conf
    include=/usr/local/etc/php-fpm.d/*.conf

/usr/local/etc/php-fpm.d/www.conf
    user = www
    group = www
    listen = 127.0.0.1:9000
    listen.owner = www
    listen.group = www
    listen.mode = 0660

# 启动 php-fpm, 可以看到监听9000端口
/usr/local/sbin/php-fpm -c etc/php.ini -y /usr/local/etc/php-fpm.conf

```

## dokuwiki 安装配置
```bash
# 下载后解压
/opt/openresty/nginx/html/liteman/wiki
chown www:www wiki -R
```

```
# conf 配置参考
server {
    listen 1080;
    #server_name liteman.xyz;
    server_name 127.0.0.1;

    # Maximum file upload size is 4MB - change accordingly if needed
    client_max_body_size 4M;
    client_body_buffer_size 128k;

    root /opt/openresty/nginx/html/liteman/wiki;
    index doku.php;

    #Remember to comment the below out when you're installing, and uncomment it when done.
    #    location ~ /(conf/|bin/|inc/|install.php) { deny all; }

    #Support for X-Accel-Redirect
    location ~ ^/data/ { internal ; }

    location ~ ^/lib.*\.(js|css|gif|png|ico|jpg|jpeg)$ {
        expires 365d;
    }

    location / { try_files $uri $uri/ @wiki; }
    #location / { try_files $uri $uri/ =404; }

    location @wiki {
        # rewrites "doku.php/" out of the URLs if you set the userwrite setting to .htaccess in dokuwiki config page
        rewrite ^/_media/(.*) /lib/exe/fetch.php?media=$1 last;
        rewrite ^/_detail/(.*) /lib/exe/detail.php?media=$1 last;
        rewrite ^/_export/([^/]+)/(.*) /doku.php?do=export_$1&id=$2 last;
        rewrite ^/(.*) /doku.php?id=$1&$args last;
    }

    location ~ \.php$ {
        try_files $uri $uri/ /doku.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param REDIRECT_STATUS 200;
        fastcgi_pass 127.0.0.1:9000;
        # fastcgi_pass unix:/var/run/php5-fpm.sock; #old php version
    }
}
```