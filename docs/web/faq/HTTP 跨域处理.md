# HTTP 跨域处理

## 20200325 请求百度百度开放平台接口数据跨域问题
* 请求数据
    ```bash
    # 当前请求
    /baiduapi/rpc/2.0/cvsaas/v1/event/list?access_token=xxxxx
    # 实际需要请求
    https://aip.baidubce.com/rpc/2.0/cvsaas/v1/event/list?access_token=xxxx
    ```

* Vue 配置 `proxyTable` 只对开发环境有效, 生产环境需要重新配置
* Jsonp 方法只对 `GET` 请求有效
* JavaScript 使用 `axios.post` 执行 `POST` 请求
* Nginx 配置
    ```bashig
    location /baiduapi/ {
      rewrite  ^.+baiduapi/?(.*)$ /$1 break;
      proxy_pass https://aip.baidubce.com/;
    }
    ```

