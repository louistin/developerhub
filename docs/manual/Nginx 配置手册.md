# Nginx 配置手册

## Nginx 反向代理

* TCP 反向代理
  * 编译
    添加 `--with-stream` 参数, 以加载 `ngx_stream_core_module` 模块.
  * 配置

    ```bash
    worker_processes  1;

    events {
        worker_connections  1024;
    }

    # TCP 反向代理
    stream {
        upstream sipsvr_stream {
            server 139.159.216.240:9359;
        }

        server {
            listen 443 ssl;
            #server_name aisvr-rtsp.xmsecu.com;

            ssl_certificate     /opt/openresty/nginx/ssl/server.crt;
            ssl_certificate_key /opt/openresty/nginx/ssl/server.key;

            ssl_session_timeout 5m;
            ssl_protocols SSLv2 SSLv3 TLSv1 TLSv1.1 TLSv1.2;
            ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
            ssl_prefer_server_ciphers on;

            proxy_connect_timeout 1s;
            proxy_timeout 3s;
            proxy_pass sipsvr_stream;
        }
    }

    # HTTP 反向代理
    http {
        include       mime.types;
        default_type  application/octet-stream;

        sendfile        on;
        keepalive_timeout  65;
        server {
            listen       80;
            server_name  localhost;

            location / {
                root   html;
                index  index.html index.htm;
            }

            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   html;
            }
        }
    }

    ```