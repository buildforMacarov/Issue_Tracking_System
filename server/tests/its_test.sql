set foreign_key_checks = 0;
drop table if exists users;
drop table if exists developers;
drop table if exists admins;
drop table if exists issues;
drop table if exists user_issue_open;
drop table if exists developer_issue_assignment;
set foreign_key_checks = 1;

create table users (
  id int not null auto_increment,
  name varchar(20) not null,
  email varchar(35) not null,
  password varchar(50) not null,
  primary key (id)
);

create table developers (
  id int not null auto_increment,
  name varchar(20) not null,
  email varchar(35) not null,
  password varchar(50) not null,
  primary key (id)
);

create table admins (
  id int not null auto_increment,
  name varchar(20) not null,
  email varchar(35) not null,
  password varchar(50) not null,
  primary key (id)
);

create table issues (
  id int not null auto_increment,
  heading tinytext not null,
  description text default null,
  time timestamp not null default now(),
  status enum('open', 'close') not null,
  primary key (id)
);

create table user_issue_open (
  user_id int not null,
  issue_id int not null,
  primary key (user_id, issue_id),
  foreign key (user_id) references users(id),
  foreign key (issue_id) references issues(id)
);

create table developer_issue_assignment (
  developer_id int not null,
  issue_id int not null,
  primary key (developer_id, issue_id),
  foreign key (developer_id) references developers(id),
  foreign key (issue_id) references issues(id)
);

insert into users values
(1,'Zenkov','tenkov@gmail.com','#hashisahash'),
(2,'Markov','tokenmail@yahoo.com','$%%%%R123ijs'),
(3,'Dreskonivich','dreskonmail@hotmail.com','$%%1515frvf');

insert into developers values
(1,'Foo','foofoo@gmail.com','#hashisahash'),
(2,'Sam','samuel@yahoo.com','$%%%%R123ijs'),
(3,'Dave','davedave@hotmail.com','$%%1515frvf');

insert into admins values
(1,'Josh','peoplepeepes@gmail.com','#4th4hthtdfgdfg'),
(2,'Sophie','yesnoyes@yahoo.com','$%%%%ghrhrh');

insert into issues values
(1, 'Tea too cold', 'klsdjfal lskdfjs lk erwef', null, 'open'),
(2, 'Coffee too hot', 'sdfsdvv ghrtr lk gdfgg', null, 'open'),
(3, 'Function too slow', 'klsdjfal dhfhgh lk sldkdfjsldf', null, 'open');

insert into user_issue_open values
(2, 1),
(1, 2),
(2, 3);

insert into developer_issue_assignment values
(3, 1),
(1, 1),
(3, 2);
