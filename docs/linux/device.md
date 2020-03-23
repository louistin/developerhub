# 设备

<style>

table th:first-of-type {
    width: 10%;
}

table th:nth-of-type(2) {
	width: 12%;
}

table th:nth-of-type(3) {
	width: 18%;
}

table th:nth-of-type(4) {
	width: 30%;
}

table th:nth-of-type(5) {
	width: 30%;
}
</style>

## 2.1 保存
> HTTP 方法: GET    
> PATH: /openapi/user/device   
> ACTION: save  

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注  
:--:|:-------| :--------| :-----| :-----
1	|token	|varchar	|登陆成功时的标识码	|必须项
2	|userid	|varchar	|当前登陆用户名	|必须项
3	|deviceid|	varchar	|设备序列号	    |必须项
4	|mode	|varchar	|模式	        |可选项
5	|domain	|varchar	|域名	        |可选项
6	|alias	|varchar	|别名	        |可选，统一转换成UTF-8编码后并进行base64编码
7	|property|	varchar	|扩展属性	    |
8	|location|	json	|位置信息	    |


**响应**

序号 | 名称   | 数据类型  | 含义  | 备注
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar	|用户名	|必须项
2	|deviceid	|varchar	|设备序列号	|必须项
3	|errno	|int	    |错误码	|可选字段，正常返回时无此字段；
4	|errstr	|varchar	|错误信息	|可选字段，正常返回时无此字段；

请求示例:
```http request
GET /openapi/user/device?action=save&userid=testuser&token=m2bd2l0xd0oy04mu&deviceid=it0eca514s9x00fe&accessid=openapiuser&expires=1572457265&signature=bQwEJM8g1RKPLhqJWSF4WWSjjus%3D HTTP/1.1
Host: 47.96.116.53:9361
Connection: Keep-Alive
Accept: */*
Content-Type: application/json;charsets: utf-8
Content-Length: 0
```

响应示例:
```http request
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 51

{"userid":"testuser","deviceid":"it0eca514s9x00fe"}
```

## 2.2 查询
> HTTP 方法: GET    
> PATH: /openapi/user/device   
> ACTION: query  

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|token	|varchar	|登陆成功时的标识码	|必须项
2	|userid	|varchar	|当前登陆用户名	    |必须项
3	|deviceid|	varchar	|设备DEVICEID	
4	|alias	|varchar	|设备别名	
5	|mode	|varchar	|模式	
6	|domain	|varchar	|域	


**响应**

序号 | 名称   | 数据类型  | 含义  | 备注  
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar	|用户名	|必须项
2	|deviceid|	varchar	|设备序列号	
3	|mode	|varchar	|模式	
4	|domain	|varchar	|接入域名	
5	|alias	|varchar	|别名	
6	|property|	varchar	|扩展属性	
7	|location|	json	|位置信息	
8	|       |           | |2-7为数组

*备注*:
* 只有普通用户有此权限；

请求示例:
```http request
GET /openapi/user/device?action=query&userid=testuser&token=m2bd2l0xd0oy04mu&deviceid=it0eca514s9x00fe&accessid=openapiuser&expires=1572457426&signature=%2Fv2htwmTj786eTESF89VeMuUoTo%3D HTTP/1.1
Host: 47.96.116.53:9361
Connection: Keep-Alive
Accept: */*
Content-Type: application/json;charsets: utf-8
Content-Length: 0
```

响应示例:
```http request
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 60

{"userid":"testuser","result":[{"uuid":"it0eca514s9x00fe"}]}
```

## 2.3 删除
> HTTP 方法: GET    
> PATH: /openapi/user/device   
> ACTION: delete

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar	|当前登陆用户名	|为空时为保存当前登陆用户的注册信息
2	|token	|varchar	|登陆成功时的标识码	|必须项
3	|deviceid|	varchar	|设备DEVICEID	|必须项

**响应**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	    |varchar	|用户名	            |必须项
2	|deviceid	|varchar	|设备DEVICEID	    |必须项
3	|errno	    |int	    |错误码	            |可选字段，正常返回时无此字段；
4	|errstr	    |varchar	|错误信息	        |可选字段，正常返回时无此字段；

请求示例:
```http request
GET /openapi/user?action=update&userid=testuser&token=mnd4fb5gvcpg92rp&password=123456&accessid=openapiuser&expires=1572457139&signature=As%2BXM2TGRSF091IJj3516AqZsGE%3D HTTP/1.1
Host: 47.96.116.53:9361
Connection: Keep-Alive
Accept: */*
Content-Type: application/json;charsets: utf-8
Content-Length: 0
```

响应示例:
```http request
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 21

{"userid":"testuser"}
```

## 2.4 配置
> HTTP 方法: GET    
> PATH: /openapi/user/device/config    
> ACTION: set

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar	|当前登陆用户名	|必须项
2	|token	|varchar	|登陆成功时的标识码	|必须项
3	|deviceid	|varchar|	设备DEVICEID	|必须项
4	|params	|varchar	|设置数据请求	|必须项, 不能超过16*1024字节
5	|flag	|int	    |是否需要等待设备端回复|	可选项

**响应**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	    |varchar	|用户名	            |必须项
2	|deviceid	|varchar	|设备DEVICEID	    |必须项
3	|params	|varchar	|设置响应结果	        |可选，如果无需等设备端响应时为空
4	|errno	|int	|错误码	                    |可选字段，正常返回时无此字段；
5	|errstr	|varchar|	错误信息	                |可选字段，正常返回时无此字段；


请求示例:
```http request
GET /openapi/user/device/config?action=set&userid=testuser&token=m2bd2l0xd0oy04mu&deviceid=it0eca514s9x00fe&params=eyJhY3Rpb24iOiJyZXEiLCJtZXRob2QiOiJ2ZXIifQ%3D%3D&accessid=openapiuser&expires=1572460964&signature=l2V5pH%2FNifBihvwj33MdEJzLvx0%3D HTTP/1.1 
Host: 47.96.116.53:9361
Connection: Keep-Alive
Accept: */*
Content-Type: application/json;charsets: utf-8
Content-Length: 0
```

响应示例:
```http request
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 202

{"sid":"thznocchh47osw9l90by4zs1q9k0rf","userid":"testuser","deviceid":"it0eca514s9x00fe","params":"eyJhY3Rpb24iOiJyc3AiLCJtZXRob2QiOiJ2ZXIiLCJ2ZXIiOjIxMDE1LCJydW50aW1lIjoyODcyLCJ0IjoiMTU3MjQ2MDA2NSJ9"}
```

## 2.5 状态查询
> HTTP 方法: GET    
> PATH: /openapi/user/device/status   
> ACTION: query

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|deviceid|	varchar |	设备DEVICEID  |	必须项

**响应**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|deviceid	|varchar	|设备DEVICEID	|必须项
2	|status	    |varchar	|状态：<br>1. offline；不在线<br>2. online；在线<br>3. notfound；未找到| 必须项
3	|extra_params| varchar	|设备携带扩展参数	
4	|conn_params|varchar	|服务器携带参数	
...	|			|||其它扩展字段


请求示例:
```http request
GET /openapi/user/device/status?action=query&deviceid=it0eca514s9x00fe&accessid=openapiuser&expires=1572457546&signature=8qTRiCQAkaN6i48Fn%2Fls%2B33yzk0%3D HTTP/1.1
Host: 47.96.116.53:9361
Connection: Keep-Alive
Accept: */*
Content-Type: application/json;charsets: utf-8
Content-Length: 0
```

响应示例:
```http request
# 未查询到
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 51

{"deviceid":"it0eca514s9x00fe","status":"notfound"}

# 查询到
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 314

{"deviceid":"it0eca514s9x00fe","status":"online","continent":"Asia","country":"China","province":"ZheJiang","conn_params":{"contact":{"keepalive":{"node":"natsvr","domain":"natsvr.cn","transport":"tcp","type":"binary","ip":"47.96.116.53","port":44198}},"medium":[{"mode":"xts","transport":"tcp","type":"binary"}]}}
```

