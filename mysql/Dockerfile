FROM mysql:8.3.0
# 避免 warning: World-writable config file my.cnf is ignored
# mysql 會覺得這個文件會容易被修改，所以需要管制
# 755  要更改目錄權限，以確保 MySQL 使用者和其所在群組具有讀取和執行權限。 
RUN chown 755 /etc/mysql/conf.d

