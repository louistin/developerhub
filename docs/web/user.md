# 用户

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

## 1.1 注册
> HTTP 方法: GET    
> PATH: /openapi/user   
> ACTION: register  

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注  
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar|用户名  |必须项
2	|password|varchar|密码	|必须项
3	|domain	|varchar|域名	|可选项
4	|alias	|varchar|别名	|可选项
5	|property|varchar|扩展属性|可选项

**响应**

序号 | 名称   | 数据类型  | 含义  | 备注
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar	|用户名	|必须项
2	|token	|varchar	|注册成功时的标识码	|必须项
3	|errno	|int	    |错误码	|可选字段，正常返回时无此字段；
4	|errstr	|varchar	|错误信息	|可选字段，正常返回时无此字段；

请求示例:
```http request
GET /openapi/user?action=register&userid=testuser&password=123456&accessid=openapiuser&expires=1572457028&signature=%2BPDMvC2VhTEwykP4mMkPbJgUzAw%3D HTTP/1.1
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
Content-Length: 48

{"userid":"testuser","token":"mnd4fb5gvcpg92rp"}
```

## 1.2 登录
> HTTP 方法: GET    
> PATH: /openapi/user   
> ACTION: login  

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar|用户名  |必须项
2	|password|varchar|密码	|必须项

**响应**

序号 | 名称   | 数据类型  | 含义  | 备注  
:--:|:-------| :--------| :-----| :-----
1	|userid	    |varchar	|用户名	            |必须项
2	|token	    |varchar	|登陆成功时的标识码	|必须项
3	|domain	    |varchar	|域名	            |可选项
4	|alias	    |varchar	|别名	            |可选项
5	|property	|varchar	|扩展属性	        |可选项
6	|errno	    |int	    |错误码	            |可选字段，正常返回时无此字段；
7	|errstr	    |varchar	|错误信息	        |可选字段，正常返回时无此字段；

请求示例:
```http request
GET /openapi/user?action=login&userid=testuser&password=123456&accessid=openapiuser&expires=1572457091&signature=W8nNg3lobSHNzAF1CDDJ08a36C8%3D HTTP/1.1
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
Content-Length: 71

{"userid":"testuser","token":"mnd4fb5gvcpg92rp","datasvr":"datasvr.cn"}
```

## 1.3 更新
> HTTP 方法: GET    
> PATH: /openapi/user   
> ACTION: update

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar	|当前登陆用户名	|为空时为保存当前登陆用户的注册信息
2	|token	|varchar	|登陆成功时的标识码	|必须项
3	|password|	varchar	|密码	|可选项
4	|domain	|varchar	|域名	|可选项
5	|alias	|varchar	|别名	|可选项
6	|property|	varchar	|扩展属性	|可选项

**响应**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	    |varchar	|用户名	            |必须项
2	|errno	    |int	    |错误码	            |可选字段，正常返回时无此字段；
3	|errstr	    |varchar	|错误信息	        |可选字段，正常返回时无此字段；

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

## 1.4 登出
> HTTP 方法: GET    
> PATH: /openapi/user   
> ACTION: logout

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar	|当前登陆用户名	|必须项
2	|token	|varchar	|登陆成功时的标识码	|必须项

**响应**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	    |varchar	|用户名	            |必须项
2	|errno	    |int	    |错误码	            |可选字段，正常返回时无此字段；
3	|errstr	    |varchar	|错误信息	        |可选字段，正常返回时无此字段；

请求示例:
```http request
GET /openapi/user?action=logout&userid=testuser&token=mnd4fb5gvcpg92rp&accessid=openapiuser&expires=1572457174&signature=pH3qFq7P%2BIL6HJbWy9lkdkAEUss%3D HTTP/1.1
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

## 1.5 注销
> HTTP 方法: GET    
> PATH: /openapi/user   
> ACTION: unregister

**请求**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	|varchar	|当前登陆用户名	|必须项
2	|token	|varchar	|登陆成功时的标识码	|必须项

**响应**

序号 | 名称   | 数据类型  | 含义  | 备注 
:--:|:-------| :--------| :-----| :-----
1	|userid	    |varchar	|用户名	            |必须项
2	|errno	    |int	    |错误码	            |可选字段，正常返回时无此字段；
3	|errstr	    |varchar	|错误信息	        |可选字段，正常返回时无此字段；

请求示例:
```http request
GET /openapi/user?action=unregister&userid=testuser&token=1bkejefmwwtb0tbi&accessid=openapiuser&expires=1572457198&signature=Tn0550zwMjw2%2BlvicNOVF2shY5I%3D HTTP/1.1
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

