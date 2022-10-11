CREATE USER 'employeeTrackerUser'@'localhost' IDENTIFIED BY 'looksLikeAPassword+';
GRANT ALL PRIVILEGES ON *.* TO 'employeeTrackerUser'@'localhost'
     WITH GRANT OPTION;
 CREATE USER 'employeeTrackerUser'@'%' IDENTIFIED BY 'looksLikeAPassword+';
 GRANT ALL PRIVILEGES ON *.* TO 'employeeTrackerUser'@'%'
     WITH GRANT OPTION;
