# SQL 数据库
> 关系型数据库以 `MySQL 必知必会`, `MySQL 5.1 参考手册`为参考书籍对 SQL 数据库做一个比较系统全面的认知

## 29 - 数据库维护
1. 备份与恢复
```sql
# 确保数据都写入磁盘
FLUSH TABLES;

# 备份整个数据库
mysqldump -u root -h host -p dbname > backdb.sql
# 备份某个表
mysqldump -u root -h host -p dbname tbname1, tbname2 > backdb.sql
# 备份多个数据库
mysqldump -u root -h host -p --databases dbname1, dbname2 > backdb.sql

# 执行前先创建 dbname, mysqldump 创建的备份文件执行时无需 dbname 参数
mysql -u root -p [dbname] < backup.sql
# 选择对应的数据库后执行
source backup.sql;
```