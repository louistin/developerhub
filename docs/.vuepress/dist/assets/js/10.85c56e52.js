(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{220:function(t,e,a){"use strict";var s=a(78);a.n(s).a},237:function(t,e,a){"use strict";a.r(e);a(220);var s=a(0),n=Object(s.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"开放平台"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#开放平台"}},[t._v("#")]),t._v(" 开放平台")]),t._v(" "),a("h2",{attrs:{id:"账号"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#账号"}},[t._v("#")]),t._v(" 账号")]),t._v(" "),a("p",[t._v("所有的 OpenAPI 请求必须通过帐号和密钥进行签名, 未签名或签名不正确的请求无法接入到开放平台.")]),t._v(" "),a("p",[t._v("签名的方式有两种:")]),t._v(" "),a("ul",[a("li",[t._v("一种是在 HTTP URL 的参数中携带签名")]),t._v(" "),a("li",[t._v("一种是在 HTTP Header 中携带签名\n"),a("ul",[a("li",[t._v("HTTP GET 方法推荐使用 URL 参数中携带签名方式")]),t._v(" "),a("li",[t._v("HTTP POST 请求推荐在Header中携带签名")]),t._v(" "),a("li",[t._v("如果 Header 和 URL 参数中都携带有签名, 以URL参数为准.")])])])]),t._v(" "),a("h2",{attrs:{id:"api-概述"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#api-概述"}},[t._v("#")]),t._v(" API 概述")]),t._v(" "),a("h3",{attrs:{id:"关于用户的操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#关于用户的操作"}},[t._v("#")]),t._v(" 关于用户的操作")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("API")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Register")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("用户注册")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Unregister")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("用户注销")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Login")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("用户登陆")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Logout")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("用户登出")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Update")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("修改用户信息")])])])]),t._v(" "),a("h3",{attrs:{id:"关于设备的操作"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#关于设备的操作"}},[t._v("#")]),t._v(" 关于设备的操作")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("API")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Save")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("添加/修改设备")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Delete")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("删除设备")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Query")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("获取设备")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Status")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("设备状态查询")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Config")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("设备配置")])])])]),t._v(" "),a("h3",{attrs:{id:"公共请求头"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#公共请求头"}},[t._v("#")]),t._v(" 公共请求头")]),t._v(" "),a("p",[t._v("OpenAPI 接口中使用了一些公共请求头. 这些请求头可以被所有的 OpenAPI 请求所使用, 其详细定义如下:")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("名称")]),t._v(" "),a("th",{staticStyle:{"text-align":"center"}},[t._v("类型")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Authorization")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("字符串")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("用于验证请求合法性的认证信息."),a("br"),t._v("默认值：无"),a("br"),t._v("使用场景：非匿名请求")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Content-Length")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("字符串")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("RFC2616中定义的HTTP请求内容长度."),a("br"),t._v("默认值：无"),a("br"),t._v("使用场景：需要提交数据的请求")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Content-Type")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("字符串")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("RFC2616中定义的HTTP请求内容类型."),a("br"),t._v("默认值：无"),a("br"),t._v("使用场景：需要提交数据的请求")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Date")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("字符串")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("HTTP 1.1协议中规定的GMT时间, 例如: Wed, 05 Sep. 2012 23:00:00 GMT"),a("br"),t._v("默认值：无")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Host")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("字符串")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("访问Host值."),a("br"),t._v("默认值：openapi.hircloud.com")])])])]),t._v(" "),a("h3",{attrs:{id:"公共响应头"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#公共响应头"}},[t._v("#")]),t._v(" 公共响应头")]),t._v(" "),a("p",[t._v("OpenAPI接口中使用了一些公共响应头. 这些响应头可以被所有的OpenAPI请求所使用, 其详细定义如下:")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",{staticStyle:{"text-align":"left"}},[t._v("名称")]),t._v(" "),a("th",{staticStyle:{"text-align":"center"}},[t._v("类型")]),t._v(" "),a("th",{staticStyle:{"text-align":"left"}},[t._v("描述")])])]),t._v(" "),a("tbody",[a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Content-Length")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("字符串")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("RFC2616中定义的HTTP请求内容长度."),a("br"),t._v("默认值：无"),a("br"),t._v("使用场景：需要向OSS提交数据的请求")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Connection")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("枚举")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("标明客户端和OSS服务器之间的链接状态."),a("br"),t._v("有效值：open、close"),a("br"),t._v("默认值：无")])]),t._v(" "),a("tr",[a("td",{staticStyle:{"text-align":"left"}},[t._v("Date")]),t._v(" "),a("td",{staticStyle:{"text-align":"center"}},[t._v("字符串")]),t._v(" "),a("td",{staticStyle:{"text-align":"left"}},[t._v("HTTP 1.1协议中规定的GMT时间, 例如: Wed, 05 Sep. 2012 23:00:00 GMT"),a("br"),t._v("默认值：无")])])])]),t._v(" "),a("h2",{attrs:{id:"访问控制"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#访问控制"}},[t._v("#")]),t._v(" 访问控制")]),t._v(" "),a("h3",{attrs:{id:"在url中进行签名"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在url中进行签名"}},[t._v("#")]),t._v(" 在URL中进行签名")]),t._v(" "),a("p",[a("strong",[t._v("URL签名示例")]),t._v(":")]),t._v(" "),a("div",{staticClass:"language-http line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[t._v("http:")]),t._v("//hircloud.com/openapi/user?action=login&userid=mytestuser&password=2da9Addka2adffdf&accessid=cake9ffaddaa&expires=1141889120&signature=vjfadkdflaweiNdsm\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br")])]),a("p",[t._v("必填参数说明:")]),t._v(" "),a("ul",[a("li",[a("p",[a("strong",[t._v("expire")])]),t._v(" "),a("ul",[a("li",[t._v("Unix time(自UTC时间1970年1月1号开始的秒数), 标识该URL的超时时间.")]),t._v(" "),a("li",[t._v("如果OpenAPI接收到这个URL请求的时间晚于签名中包含的Expires参数时，则返回请求超时的错误码\n"),a("ul",[a("li",[t._v("例如：当前时间是1141889060，开发者希望创建一个60秒后自动失效的URL，则可以设置Expires时间为1141889120")])])]),t._v(" "),a("li",[t._v("默认URL的有效时间为3600秒，最大为64800秒")])])]),t._v(" "),a("li",[a("p",[a("strong",[t._v("accessid")])]),t._v(" "),a("ul",[a("li",[t._v("即创建的帐号名称")])])]),t._v(" "),a("li",[a("p",[a("strong",[t._v("signature")])]),t._v(" "),a("ul",[a("li",[t._v("表示签名信息")]),t._v(" "),a("li",[t._v("签名方法:"),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[t._v("signature "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" urlencode"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("base64"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("hmac-sha1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("accesskey,\n            VERB + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),a("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v(" \n            + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),a("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v(" \n            + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),a("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v(" \n            + expires + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),a("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v(" \n            + path\n            + action"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("))")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br")])]),a("ul",[a("li",[t._v("accesskey 表示创建帐号生成的秘钥")]),t._v(" "),a("li",[t._v("VERB表示HTTP方法，如GET等")]),t._v(" "),a("li",[t._v("\\n表示换行符")]),t._v(" "),a("li",[t._v("path 和 action 填定方法请参考详细API接口定义")])])])])])]),t._v(" "),a("h3",{attrs:{id:"在header中包含签名"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在header中包含签名"}},[t._v("#")]),t._v(" 在Header中包含签名")]),t._v(" "),a("p",[a("strong",[t._v("Header签名示例")]),t._v("：")]),t._v(" "),a("div",{staticClass:"language-http line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-http"}},[a("code",[a("span",{pre:!0,attrs:{class:"token request-line"}},[a("span",{pre:!0,attrs:{class:"token property"}},[t._v("POST")]),t._v(" /hircloud/openapi/user/device/config?action=set HTTP/1.1")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[t._v("Host:")]),t._v(" openapi.hircloud.com\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[t._v("Connection:")]),t._v(" Keep-Alive\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[t._v("Content-Type:")]),t._v(" application/json;\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[t._v("Content-Length:")]),t._v(" 400\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[t._v("Content-MD5:")]),t._v(" 577wVPrmrbcqCgw1xx+Zy8n6d4E=\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[t._v("Date:")]),t._v(" Thu, 09 May 2019 14:22:07 GMT\n"),a("span",{pre:!0,attrs:{class:"token header-name keyword"}},[t._v("Authorization:")]),t._v(" hircloud: 5Yi8DEBt1zkT/dcCfwYurXoocMw="),a("span",{pre:!0,attrs:{class:"token application/json"}},[t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"userid"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"testuser"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"deviceid"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('" it0eca514s9x00fe "')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"params"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v('" eyJhY3Rpb24iOiJyZXEiLCJtZXRob2QiOiJ2ZXIifQ'),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("==")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("\naccessid"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("openapiuser"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("expires"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1572460964")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v("signature"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v("l2V5pH"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("%")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v("FNifBihvwj33MdEJzLvx0"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v('" '),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br")])]),a("p",[t._v("必填参数说明:")]),t._v(" "),a("ul",[a("li",[t._v("Authorization\n"),a("ul",[a("li",[t._v("计算方法:"),a("div",{staticClass:"language-bash line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[t._v("Authorization "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" accessid + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('":"')]),t._v(" + signature\nsignature "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" base64"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("hmac-sha1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("AccessKey,\n            VERB + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),a("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v("\n            + Content-MD5 + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),a("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v(" \n            + Content-Type + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),a("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v(" \n            + Date + "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"'),a("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[t._v("\\n")]),t._v('"')]),t._v(" \n            + path\n            + action"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("))")]),t._v("\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br")])]),a("ul",[a("li",[t._v("accessid 即创建的帐号名称。")]),t._v(" "),a("li",[t._v("accesskey 表示帐号中生成的密钥。")]),t._v(" "),a("li",[t._v("VERB 表示HTTP请求的Method，主要有PUT、GET、POST、HEAD、DELETE等。")]),t._v(" "),a("li",[t._v("\\n 表示换行符。")]),t._v(" "),a("li",[t._v("Content-MD5 表示请求内容数据的MD5值，对消息内容（不包括头部）计算MD5值获得128比特位数字，对该数字进行base64编码得出。\n该请求头可用于消息合法性的检查（消息内容是否与发送时一致），例如”eB5eJF1ptWaXm4bijSPyxw==”，也可以为空。详情请参见\nRFC2616Content-MD5。")]),t._v(" "),a("li",[t._v("Content-Type 表示请求内容的类型，例如”application/m3u8可以为空。")]),t._v(" "),a("li",[t._v("Date 表示此次操作的时间，且必须为GMT格式，例如”Sun, 22 Nov 2015 08:16:38 GMT”。")]),t._v(" "),a("li",[t._v("path 和 action 填定方法请参考详细API接口定义。")])])]),t._v(" "),a("li",[t._v("如果请求中的Date时间和OSS服务器的当前时间差15分钟以上，OSS服务器将拒绝该请求，并返回HTTP 403错误。")])])])]),t._v(" "),a("h3",{attrs:{id:"编码"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#编码"}},[t._v("#")]),t._v(" 编码")]),t._v(" "),a("p",[t._v("所有的OpenAPI请求中携带的非ASCII编码统一使用UTF-8编码并进行base64编码得到ASCII字符串，并进行URL编码。")])])}),[],!1,null,null,null);e.default=n.exports},78:function(t,e,a){}}]);