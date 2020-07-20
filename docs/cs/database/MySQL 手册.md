# MySQL 手册

### 1. MySQL 安装
**OS: CentOS 7.3**
1. `https://dev.mysql.com/downloads/repo/yum/` 下载对应的rpm文件;
https://dev.mysql.com/get/mysql80-community-release-el7-1.noarch.rpm
2. `rpm -ivh mysql57-community-release-el7-9.noarch.rpm` 安装yum源, 然后去`/etc`中将mysql相关`.repo`文件中`5.7`的选项打开;
3. `yum install mysql-community-server mysql mysql-devel`;
4. `systemctl start mysqld` 启动MySQL;
5. 设置开机启动, `systemctl enable mysqld`, `systemctl daemon-reload`;
6. 查看初始安装密码: `grep 'temporary password' /var/log/mysqld.log`;
7. 修改初始密码: `mysql -uroot -p`
    `ALTER USER 'root'@'localhost' IDENTIFIED BY 'St@271828';`
    密码规则: 大小字字母+特殊符号, 长度 > 8
8. 添加远程登录用户
    `GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'St@271828' WITH GRANT OPTION;`
9. 配置默认编码为 utf-8
    * 打开 `/etc/my.cnf`
    * 在[mysqld] 下添加编码配置
        ```SHELL
        socket=/var/lib/mysql/mysql.sock # 添加到此句之后
        character-set-server=utf8
        ```
10. 重新启动MySQL服务: `service mysqld restart`
11. 停止MySQL服务: `service mysqld stop`

* MySQL 源码编译安装

```bash
# 下载 MySQL 源码, 选择带有 Boost Headers 的版本
https://downloads.mysql.com/archives/community/
https://downloads.mysql.com/archives/get/p/23/file/mysql-boost-5.7.17.tar.gz

# 安装常用依赖包
yum -y install gcc gcc-c++ ncurses ncurses-devel bison libgcrypt perl make cmake openssl

# 新建 MySQL 安装目录及创建 MySQL 用户组和用户, 修改目录所有者权限
mkdir -p /usr/local/mysql /usr/local/mysql/{data,logs,pids}

groupadd mysql
useradd -r -g mysql -s /bin/false -M mysql
chown -R mysql:mysql /usr/local/mysql

# 编译, 此处对应的是自带 boost headers 的版本
cmake . -DCMAKE_INSTALL_PREFIX=/usr/local/mysql -DMYSQL_DATADIR=/usr/local/mysql/data -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci -DMYSQL_TCP_PORT=3306 -DMYSQL_USER=mysql -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_ARCHIVE_STORAGE_ENGINE=1 -DWITH_BLACKHOLE_STORAGE_ENGINE=1 -DWITH_MEMORY_STORAGE_ENGINE=1 -DENABLE_DOWNLOADS=0 -DDOWNLOAD_BOOST=0 -DWITH_BOOST=/home/xmcloud/mysql-5.7.17/boost
```


### 2. MySQL 配置
#### 重要目录
```shell
# 数据库目录
/var/lib/mysql

# 配置文件(mysql.server命令及配置文件)
/usr/share/mysql

# 相关命令(mysqladmin mysqldump等)
/usr/bin

# 启动脚本
/etc/rc.d/init.d

```
启动与结束
```shell
systemctl start mysql.service
systemctl stop mysql.service
systemctl status mysql.service

# 察看是否在自动启动列表中
/sbin/chkconfig –list
# 添加到系统的启动服务组中
/sbin/chkconfig　– add　mysql
# 从启动服务组中删除
/sbin/chkconfig　– del　mysql

```




*注意* : 我们需要在CentOS 7 上禁用 firewall, 启用iptables
```SHELL
# 禁用firewall
sudo systemctl stop firewalld.service && sudo systemctl disable firewalld.service
# 安装并使用iptables
sudo yum install iptables-services
sudo systemctl enable iptables && sudo systemctl enable ip6tables
sudo systemctl start iptables && sudo systemctl start ip6tables
```
1. 开放3306端口
    ```SHELL
    vim /etc/sysconfig/iptables
    # 添加以下内容
    -A INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT
    # 重启iptables
    service iptables restart
    ```
***

1. 数据库保存位置
```SQL
-- 查看数据库保存位置
mysql> show global variables like "%datadir%";

-- 修改数据库位置
-- 1. 找到mysql进程并杀掉
    systemctl stop mysqld.service
-- 2. 迁移mysql目录
	shell> mv /var/lib/mysql　/new/path/
-- 3. 修改mysql目录
	shell> vim /etc/my.cnf
	-- 找到以下两行
	datadir=/var/lib/mysql
	socket=/var/lib/mysql/mysql.sock
	-- 修改为
	datadir=/new/path/mysql
	socket=/new/path/mysql/mysql.sock

    -- 在文件最后添加
    [client]
	socket=/new/path/mysql/mysql.sock

-- 4. 关闭SElinux
-- 临时
    setenforce 0
-- 永久
    shell> vim /etc/selinux/config
            SELINUX=disabled
    shell> reboot

-- TODO: 这一步在CentOS中存疑, 根本就没这个目录
-- 修改mysql启动脚本
	shell> vim etc/init.d/mysql
	-- 找到以下一行
	datadir=/var/lib/mysql
	-- 修改为
	datadir=/new/path/mysql

```

2. 错误日志
	* 错误日志类型
		a、错误日志：记录启动、运行或停止mysqld时出现的问题。
		b、通用日志：记录建立的客户端连接和执行的语句。
		c、更新日志：记录更改数据的语句。该日志在MySQL 5.1中已不再使用。
		d、二进制日志：记录所有更改数据的语句。还用于复制。
		e、慢查询日志：记录所有执行时间超过long_query_time秒的所有查询或不使用索引的查询。
		f、Innodb日志：innodb redo log

		缺省情况下，所有日志创建于mysqld数据目录中。
		可以通过刷新日志，来强制mysqld来关闭和重新打开日志文件（或者在某些情况下切换到一个新的日志）。
		当你执行一个FLUSH LOGS语句或执行mysqladmin flush-logs或mysqladmin refresh时，则日志被老化。
		对于存在MySQL复制的情形下，从复制服务器将维护更多日志文件，被称为接替日志。
	* 错误日志
		错误日志是一个文本文件。
		  错误日志记录了MySQL Server每次启动和关闭的详细信息以及运行过程中所有较为严重的警告和错误信息。
		  可以用--log-error[=file_name]选项来开启mysql错误日志，该选项指定mysqld保存错误日志文件的位置。
		  对于指定--log-error[=file_name]选项而未给定file_name值，mysqld使用错误日志名host_name.err 并在数据目录中写入日志文件。
		  在mysqld正在写入错误日志到文件时，执行FLUSH LOGS 或者mysqladmin flush-logs时，服务器将关闭并重新打开日志文件。
		  建议在flush之前手动重命名错误日志文件，之后mysql服务将使用原始文件名打开一个新文件。
		  以下为错误日志备份方法：
		      shell> mv host_name.err host_name.err-old
		      shell> mysqladmin flush-logs
		      shell> mv host_name.err-old backup-directory
	*




### 账户管理
1. 创建普通用户并授权
    ```SHELL
    # 默认已使用root登陆, 并创建数据库database
    use mysql;
    # 创建username用户并设置密码password, 从安装mysql服务的及其本地访问
    grant all on database.* to 'username'@'localhost' identified by 'password';
    # 同上, 但是任何机器都可以访问
    grant all on database.* to 'username'@'%' identified by 'password';
    # 刷新生效
    flush privileges;
    ```

***

### DATABASE/TABLE 管理
* DATABASE

```SQL
-- 创建数据库
CREATE DATABASE database

-- 修改数据库
ALTER DATABASE

-- 显示数据库
SHOW DATABASES

-- 打开数据库
USE database

-- 删除数据库
DROP DATABASE database
```

* TABLE

```SQL
-- 查看DATABASE下的表结构
SHOW TABLES

-- 创建新表
CREATE TABLE table

-- 变更表(在已有的表中添加, 删除或修改)
ALTER TABLE table ADD newfield datatype
ALTER TABLE table DROP COLUMN field
ALTER TABLE table ALTER COLUMN field newdatatype

-- 删除表(表结构, 属性, 索引等都删除)
DROP TABLE table

-- 仅删除表中数据, 不删除表本身
TRUNCATE TABLE table

-- 创建索引 field 为需要索引的列
CREATE INDEX index ON table (field)

-- 删除表中索引
ALTER TABLE table DROP INDEX index
```
***

### SQL 语句
> 基础内容 增 删 改 查

**INSERT INTO**
> 向表格中插入新的行

```SQL
-- 插入单行数据
INSERT INTO table VALUES (val1, val2, ...)
INSERT INTO table (field1, field2, ...) VALUES (val1, val2, ...)

-- 将现有表中的数据添加到已有的表中
INSERT INTO newtable (field1, field2, ...) SELECT field1, field2, ... FROM sourcetable
```

**DELETE**
> 删除表中的行

```SQL
-- 在不删除表的情况下删除所有行
DELETE FROM table
DELETE * FROM table

-- 条件删除
DELETE FROM table WHERE field = val
```

**UPDATE**
> 更新修改数据

```SQL
-- 更新所有行的数据
UPDATE table SET field = newval

-- 条件更新
UPDATE table SET field = newval WHERE field1 = val
```

**SELECT**
> 从表中查询数据

* 普通查询

```SQL
-- 查询所有数据行和列
SELECT * FROM table

-- 条件查询
SELECT field1, field2 FROM table WHERE field3 = val

-- 条件查询, 并在查询中使用 AS 更改列名显示
SELECT oldfield AS newfield FROM table WHERE field1 = val

-- 查询空行
SELECT field FROM table WHERE field1 IS NULL

-- 查询oldfield列中满足职位val的列, 并命名为newfiled
SELECT oldfield = val AS newfield FROM table

-- 查询结果排序(可选参数: ASC 升序, DESC降序)
SELECT field1, field2 FROM table ORDER BY field3 [DESC/ASC]

-- 不同field采用不同的升序/降序
SELECT SELECT field1, field2 FROM table ORDER BY field3 [DESC/ASC], field4 [DESC/ASC]
```

* 模糊查询

```SQL
-- 使用 LIKE 作用于字符串 (例如 filed 中字段以 A 开头的值 )
SELECT field FROM table WHERE filed LIKE 'A%'

-- 范围查询
SELECT field FROM table WHERE filed BETWEEN val1 AND val2

-- 在列举值内查询
SELECT field FROM table WHERE field IN (val1, val2, ...)
```

* 分组查询

```SQL
-- GROUP BY 根据一个或多个结果集进行分组
--  aggregate_function 包含: AVG 平均数, SUM 求和, COUNT 计数, MAX 求最大值, MIN 求最小值等
SELECT field, aggregate_function(field) FROM table GROUP BY field

-- HAVING 子句进行分组筛选(HAVING 后为条件)
SELECT field, aggregate_function(field) FROM table GROUP BY field HAVING aggregate_function(field) operator val
```

* 多表联查

```SQL
-- WHERE 子句指定连接条件(可以自己去改变)
SELECT table1.field1, table2.field2 FROM table1, table2 WHERE table1.field1 = table2.field1
```
***

## TABLE 设计要点
1. 设计原则
    * 使用不超出范围的最小数据类型
    * 数据类型尽量简单
    * 避免 `NULL`, 尽量将字段定义为 `NOT NULL` (可以使用0, -1, 特殊值或字符串替代`NULL`)
2. 字段类型选择
    * 字段类型
        * 整数 `TINYINT` `SMALLINT` `MEDIUMINT` `INT` `BIGINT` (可选UNSIGNED属性)
        * 实数 `FLOAT` `DOUBLE`
    * 字符串类型
        * `VARCHAR` 可变长度字符串
        * `CHAR` 固定长度字符串
    * 日期和时间(精度为秒)
        * `DATATIME` `yyyy:MM:dd:HH:mm:ss`格式时间, 与时区无关
        * `TIMESTAMP` UNIX时间戳, 依赖于时区
    * 特殊类型数据
        * IP 使用`INT UNSIGNED`保存 (转换函数INET_ATON(), INET_NTOA())
3. 命名规范
    * DATABSE, TABLE, 字段名使用有意义英文单词+下划线分割
    * < 32字符
    * 禁止使用MySQL保留字
4. 基础规范
    * 使用INNODB存储引擎
    * 表字符集使用 UTF-8
    * 除逐渐外其他字段都需要增加注释
    * 每张表数据量 < 5000W
5. 库表设计
    * 不使用分区表 (TODO: 为什么?)
    * 数据冷热分离, 将大字段, 访问频率低的字段拆分到单独的表中存储
    * 采用适合的分库分表策略
    * 设计时包含日期字段(CREATE_TIME, UPDATE_TIME)
6. 索引规范 (TODO: 索引部分知识补充)
    * 单表索引数 < 5
    * 单个索引中字段数 < 5
    * 索引全小写
    * 不要有 NULL

TODO: 优化内容待补充

**建表语句范例:**

```SQL
CREATE TABLE `SHOP_GAY` (
  `ID` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '店铺ID',
  `SHOP_NAME` VARCHAR(50) DEFAULT '' COMMENT '店铺名称',
  `LEGAL_PERSON_MOBILE` VARCHAR(11) DEFAULT NULL COMMENT '法人移动电话',
  `SCORE` BIGINT(20) DEFAULT 0 COMMENT '积分',
  `MANAGER_NAME` VARCHAR(20) DEFAULT '' COMMENT '店长姓名',
  `BRIEF` VARCHAR(500) DEFAULT '' COMMENT '店铺简介',
  `HAS_WAREHOUSE` CHAR(1) DEFAULT '0' COMMENT '是否有仓库, 0:没有; 1：有 ',
  `DESCRIPTION_FIT` DECIMAL(3,1) DEFAULT 0 COMMENT '描述相符--通过对所有订单商品的评价计算平均值取一位小数得到',
  `BACKGROUND` VARCHAR(200) DEFAULT '' COMMENT '店铺标题图片',
  `CREATED_DATE` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `UPDATED_DATE` DATETIME DEFAULT '1970-12-31 00:00:00.0' COMMENT '更新时间',
  PRIMARY KEY (`ID`),
  KEY IDX_MOB(LEGAL_PERSON_MOBILE),
  KEY IDX_CRETIME(CREATED_DATE),
  KEY IDX_UPTIME(UPDATED_DATE)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT='GAY店铺'
```

**添加字段范例:**

```SQL
ALTER TABLE AUTH_MALL ADD COLUMN SHORT_NAME VARCHAR(20) DEFAULT '' COMMENT '广场名简写' AFTER FULL_NAME;
```

**修改表字段范例:**

```SQL
ALTER TABLE GATEWAY_PAYMENT_ORDER MODIFY COLUMN STAT varchar(2)  DEFAULT '0' COMMENT '交易状态   0:待支付/退款,1:等待第三方渠道回调,2:支付/退款成功,3:支付/退款失败,4:支付/退款确认成功,5:支付/退款确认失败,6;交易关闭,7:待收款(如果是此状态-需要确认收款账号是否正常),8:支付/退款确认成功-不可再进行其他操作,9:验签失败,10:同步确认/买家已付款-等待卖家发货WAIT_SELLER_SEND_GOODS,11:同步确认/卖家已发货等待买家确认WAIT_BUYER_CONFIRM_GOODS' AFTER DESCRIPTION;
```
***

## 主从复制
> 通过主从复制(读写分离) 可以减轻主数据库负载, 提升业务系统性能, 提升系统可靠性

配置前最好将防火墙关掉
`service iptables stop`
`telnet ip host` 试试主从是否能连通

1. 系统配置

```SHELL
# master
vim /etc/my.cnf
    #[必须]启用二进制日志
    log-bin=mysql-bin
    #[必须]服务器唯一ID，默认是1，一般取IP最后一段
    server-id=1

# slave
vim /etc/my.cnf
    #[可选]启用二进制日志
    log-bin=mysql-bin
    #[必须]服务器唯一ID，默认是1，一般取IP最后一段
    server-id=2
    # relay 日志
    relay_log=relay_20161218

    #  master 和 slave 都重启
    service mysqld restart
```

2. 用GRANT 创建用户并授权远程登陆
**MASTER**

    ```SQL
    -- 登陆MySQL后
    mysql> grant replication slave on *.* to 'root'@'%' identified by 'St@271828';
    -- 查看是否成功, 里面有东西就成功了
    mysql> show master status;
    ```
    查询显示这样的就说明成功了
    +------------------+------------+----------------+--------------------+---------------------+
    | File             |   Position | Binlog_Do_DB   | Binlog_Ignore_DB   | Executed_Gtid_Set   |
    |------------------+------------+----------------+--------------------+---------------------|
    | mysql-bin.000006 |        325 |                |                    |                     |
    +------------------+------------+----------------+--------------------+---------------------+



**SLAVE**
    配置slave启动主从复制

```SQL
mysql> CHANGE MASTER TO master_host='192.168.159.140', master_user='slave', master_password='St@271828', master_log_file='mysql-bin.000006', master_log_pos=154;

mysql> start slave;

mysql> show slave status \G;
***************************[ 1. row ]***************************
Slave_IO_State                | Waiting for master to send event
Master_Host                   | 192.168.159.140
Master_User                   | slave
Master_Port                   | 3306
Connect_Retry                 | 60
Master_Log_File               | mysql-bin.000006
Read_Master_Log_Pos           | 325
Relay_Log_File                | relay_20161218.000002
Relay_Log_Pos                 | 491
Relay_Master_Log_File         | mysql-bin.000006
Slave_IO_Running              | Yes
Slave_SQL_Running             | Yes
Replicate_Do_DB               |
Replicate_Ignore_DB           |
Replicate_Do_Table            |
Replicate_Ignore_Table        |
Replicate_Wild_Do_Table       |
```

```SQL
-- 在master中
mysql> CREATE DATABASE test;

-- 在slave中 ,结果中有test表示就成功了
mysql> SHOW DATABASES;
```

-- 下面二者都为YES 就表示成功了
Slave_IO_Running              | Yes
Slave_SQL_Running             | Yes


TODO: 添加其他主从复制相关查询命令及1master, 多slave配置


SELECT mci.channelName, mci.channelURL, mci.channelType,
    COUNT(1) AS userCount , (SELECT COUNT(1) FROM marketDatasourceInfo mdi
    WHERE mdi.`dataType`= 2 AND mdi.channel=mci.channelName) AS loanCount
FROM marketChannelInfo mci LEFT JOIN marketDatasourceInfo mdi ON mci.channelName=mdi.channel GROUP BY mci.channelName ORDER BY mci.createTime DESC LIMIT 0,10

