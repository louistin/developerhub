# Supervisor FAQ
> ChangeLog
> 20181205: 创建文档, 添加安装配置和conf 示例

## 安装配置
```bash
# 安装
yum install supervisor

# 配置路径, 注意修改include 目录
vim /etc/supervisor
```

## conf 示例
```bash
# /etc/supervisord.d/nginx.conf

[program:nginx]
environment=
process_name=%(program_name)s
directory=/opt/openresty/%(program_name)s/sbin/
user=root
startsecs=10
startretries=3
stopsignal=QUIT
stopwaitsecs=10
autostart=true
directory=/opt/openresty/%(program_name)s/sbin/
stderr_logfile_maxbytes=16MB
stderr_logfile_backups=3
stderr_logfile=/opt/logs/%(program_name)s/stderr.log
stdout_logfile_maxbytes=16MB
stdout_logfile_backups=3
stdout_logfile=/opt/logs/%(program_name)s/stdout.log
;; nginx
command=/opt/openresty/%(program_name)s/sbin/nginx -g 'daemon off;' -c /opt/openresty/nginx/conf/nginx.conf
```

supervisor 只能管理前台程序, 默认后台启动的程序需要加上`-g 'daemon off;'`保证前台启动.