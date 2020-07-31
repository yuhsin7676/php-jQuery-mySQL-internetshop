# php-jQuery-mySQL-internetshop

Файл htaccess.txt нужно переименовать в .htaccess
mySQL-таблицы catalogs, enter и goods нужно создавать вручную (например, через phpMyAdmin) по следующей схеме:

catalogs:

1) id             int(11)           auto-increment        (ключевой пункт)
2) description    longtext          
3) image	        varchar(100)          
4) name 	        varchar(100)         

enter:

1) user           int(5)            auto-increment        (ключевой пункт)
2) username       varchar(100)          
3) password	      varchar(100)           

goods:

1) id             int(5)            auto-increment        (ключевой пункт)
2) name           varchar(100)
2) price          double
2) description    longtext
2) img            varchar(100)
2) color          varchar(100)
2) catalog        varchar(100)

Данные $servername, $username, $password и $database в файле admin/function.php необходимо изменить на те, которые соответствуют
той базе данных mySQL, какую использует установленный на сервер сайт
