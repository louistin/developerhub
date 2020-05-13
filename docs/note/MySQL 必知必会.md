# MySQL 必知必会

> <p align="left" style="font-family:Arial;font-size:80%;color:#C0C0C0">全文字数 {{ $page.readingTime.words}} words &nbsp;|&nbsp; 阅读时间 {{Math.ceil($page.readingTime.minutes)}} mins</p>

## 29 - 数据库维护
1. 备份与恢复
```sql
# 确保数据都写入磁盘
FLUSH TABLES;

# shell 下执行
# 备份整个数据库
mysqldump -u root -h host -p dbname > backdb.sql
# 备份某个表
mysqldump -u root -h host -p dbname tbname1, tbname2 > backdb.sql
# 备份多个数据库
mysqldump -u root -h host -p --databases dbname1, dbname2 > backdb.sql

# 以下两种选择其一
# 执行前先创建 dbname, mysqldump 创建的备份文件执行时无需 dbname 参数
mysql -u root -p [dbname] < backup.sql
# 选择对应的数据库后执行
source /path/backup.sql;
```
