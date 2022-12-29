
INSERT INTO departments (dep_name) VALUES ('Marketing');
insert into departments (dep_name) values ('Sales');
insert into departments (dep_name) values ('Customer support');
insert into departments (dep_name) values ('IT');
insert into departments (dep_name) values ('accounting');
insert into departments (dep_name) values ('Administration');
-- #insert roles
insert into roles (title, salary,dep_id) values ('Engineer', 150000,4);
insert into roles (title, salary,dep_id) values ('Manager', 160000,6);
insert into roles (title, salary,dep_id) values ('graphic designer', 170000,1);
insert into roles (title, salary,dep_id) values ('sales rep',170000,2);
insert into roles (title, salary,dep_id) values ('call rep', 140000,3);
insert into roles (title, salary,dep_id) values ('accountant', 180000,5);

-- # insert employees
insert into employees (first_name,last_name,role_id,manager_id) values ('Jaacen', 'Wimmer', 1, 6);
insert into employees (first_name,last_name,role_id,manager_id) values ('Emm', 'Wimm', 3,6);
insert into employees (first_name,last_name,role_id,manager_id) values ('Emilee', 'Anderson', 4,6);
insert into employees (first_name,last_name,role_id,manager_id) values ('gandalf', 'White',5,6);
insert into employees (first_name,last_name,role_id,manager_id) values ('Gandalf', 'Grey',2,6);
insert into employees (first_name,last_name,role_id,manager_id) values ('Mister', 'President',2,5);
