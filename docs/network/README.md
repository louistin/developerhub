# 开放平台

## 账号

所有的 OpenAPI 请求必须通过帐号和密钥进行签名, 未签名或签名不正确的请求无法接入到开放平台. 

签名的方式有两种:
* 一种是在 HTTP URL 的参数中携带签名
* 一种是在 HTTP Header 中携带签名
    * HTTP GET 方法推荐使用 URL 参数中携带签名方式
    * HTTP POST 请求推荐在Header中携带签名
    * 如果 Header 和 URL 参数中都携带有签名, 以URL参数为准.

## API 概述

### 关于用户的操作
<style>
table {
    width: 100%; /*表格宽度*/
    max-width: 65em; /*表格最大宽度，避免表格过宽*/
    border: 0px solid #dedede; /*表格外边框设置*/
    margin: 15px auto; /*外边距*/
    border-collapse: collapse; /*使用单一线条的边框*/
    empty-cells: show; /*单元格无内容依旧绘制边框*/
}

table th:first-of-type {
    width: 20%;
}

table th:nth-of-type(2) {
	width: 20%;
}

table td {
  height: 35px; /*统一每一行的默认高度*/
  border: 1px solid #dedede; /*内部边框样式*/
  padding: 0 10px; /*内边距*/
}
</style>



API         | 描述  
:-----------|:--------------
Register	| 用户注册
Unregister	| 用户注销
Login	    | 用户登陆
Logout	    | 用户登出
Update	    | 修改用户信息

### 关于设备的操作

API         | 描述  
:-----------|:--------------
Save	    | 添加/修改设备
Delete	    | 删除设备
Query	    | 获取设备
Status	    | 设备状态查询
Config	    | 设备配置

### 公共请求头

OpenAPI 接口中使用了一些公共请求头. 这些请求头可以被所有的 OpenAPI 请求所使用, 其详细定义如下:

名称                | 类型      | 描述  
:------------------ |:------:   |:--------------
Authorization	    | 字符串	| 用于验证请求合法性的认证信息.<br>默认值：无<br>使用场景：非匿名请求
Content-Length	    | 字符串	| RFC2616中定义的HTTP请求内容长度.<br>默认值：无<br>使用场景：需要提交数据的请求
Content-Type	    | 字符串	| RFC2616中定义的HTTP请求内容类型.<br>默认值：无<br>使用场景：需要提交数据的请求
Date	            | 字符串	| HTTP 1.1协议中规定的GMT时间, 例如: Wed, 05 Sep. 2012 23:00:00 GMT<br>默认值：无
Host	            | 字符串	| 访问Host值.<br>默认值：openapi.hircloud.com

### 公共响应头

OpenAPI接口中使用了一些公共响应头. 这些响应头可以被所有的OpenAPI请求所使用, 其详细定义如下:

名称                | 类型      | 描述  
:------------------ |:------:   |:--------------
Content-Length	    | 字符串	| RFC2616中定义的HTTP请求内容长度.<br>默认值：无<br>使用场景：需要向OSS提交数据的请求
Connection	        | 枚举	| 标明客户端和OSS服务器之间的链接状态.<br>有效值：open、close<br>默认值：无
Date	            | 字符串	| HTTP 1.1协议中规定的GMT时间, 例如: Wed, 05 Sep. 2012 23:00:00 GMT<br>默认值：无

## 访问控制

### 在URL中进行签名

**URL签名示例**:

```http
http://hircloud.com/openapi/user?action=login&userid=mytestuser&password=2da9Addka2adffdf&accessid=cake9ffaddaa&expires=1141889120&signature=vjfadkdflaweiNdsm
```

必填参数说明:

* **expire** 
    * Unix time(自UTC时间1970年1月1号开始的秒数), 标识该URL的超时时间.
    * 如果OpenAPI接收到这个URL请求的时间晚于签名中包含的Expires参数时，则返回请求超时的错误码
        * 例如：当前时间是1141889060，开发者希望创建一个60秒后自动失效的URL，则可以设置Expires时间为1141889120
    * 默认URL的有效时间为3600秒，最大为64800秒

* **accessid**
    * 即创建的帐号名称

* **signature**
    * 表示签名信息
    * 签名方法:
        ```bash
        signature = urlencode(base64(hmac-sha1(accesskey,
                    VERB + "\n" 
                    + "\n" 
                    + "\n" 
                    + expires + "\n" 
                    + path
                    + action)))
        ```
        * accesskey 表示创建帐号生成的秘钥
        * VERB表示HTTP方法，如GET等
        * \n表示换行符
        * path 和 action 填定方法请参考详细API接口定义

###  在Header中包含签名

**Header签名示例**：

```http
POST /hircloud/openapi/user/device/config?action=set HTTP/1.1
Host: openapi.hircloud.com
Connection: Keep-Alive
Content-Type: application/json;
Content-Length: 400
Content-MD5: 577wVPrmrbcqCgw1xx+Zy8n6d4E=
Date: Thu, 09 May 2019 14:22:07 GMT
Authorization: hircloud: 5Yi8DEBt1zkT/dcCfwYurXoocMw=

{"userid":"testuser","deviceid":" it0eca514s9x00fe ","params":" eyJhY3Rpb24iOiJyZXEiLCJtZXRob2QiOiJ2ZXIifQ==&
accessid=openapiuser&expires=1572460964&signature=l2V5pH%2FNifBihvwj33MdEJzLvx0=" }
```

必填参数说明:

* Authorization 
    * 计算方法:
        ```bash
        Authorization = accessid + ":" + signature
        signature = base64(hmac-sha1(AccessKey,
                    VERB + "\n"
                    + Content-MD5 + "\n" 
                    + Content-Type + "\n" 
                    + Date + "\n" 
                    + path
                    + action))
        ```
        * accessid 即创建的帐号名称。
        * accesskey 表示帐号中生成的密钥。
        * VERB 表示HTTP请求的Method，主要有PUT、GET、POST、HEAD、DELETE等。
        * \n 表示换行符。
        * Content-MD5 表示请求内容数据的MD5值，对消息内容（不包括头部）计算MD5值获得128比特位数字，对该数字进行base64编码得出。
            该请求头可用于消息合法性的检查（消息内容是否与发送时一致），例如”eB5eJF1ptWaXm4bijSPyxw==”，也可以为空。详情请参见
            RFC2616Content-MD5。
        * Content-Type 表示请求内容的类型，例如”application/m3u8可以为空。
        * Date 表示此次操作的时间，且必须为GMT格式，例如”Sun, 22 Nov 2015 08:16:38 GMT”。
        * path 和 action 填定方法请参考详细API接口定义。
    * 如果请求中的Date时间和OSS服务器的当前时间差15分钟以上，OSS服务器将拒绝该请求，并返回HTTP 403错误。

### 编码

所有的OpenAPI请求中携带的非ASCII编码统一使用UTF-8编码并进行base64编码得到ASCII字符串，并进行URL编码。

