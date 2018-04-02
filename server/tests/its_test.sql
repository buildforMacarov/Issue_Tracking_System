set foreign_key_checks = 0;
drop table if exists users;
drop table if exists developers;
drop table if exists issues;
drop table if exists user_issues;
drop table if exists developer_issues;
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

create table issues (
  id int not null auto_increment,
  heading tinytext not null,
  description text default null,
  time timestamp not null default now(),
  status enum('open', 'close') not null,
  primary key (id)
);

create table user_issues (
  user_id int not null,
  issue_id int not null,
  primary key (user_id, issue_id),
  foreign key (user_id) references users(id),
  foreign key (issue_id) references issues(id)
);

create table developer_issues (
  developer_id int not null,
  issue_id int not null,
  primary key (developer_id, issue_id),
  foreign key (developer_id) references developers(id),
  foreign key (issue_id) references issues(id)
);

insert into users values
(1,'Zenkov','tenkov@gmail.com','#hashisahash'),
(2,'Markov','tokenmail@yahoo.com','$%%%%R123ijs'),
(3,'Dreskonivich','dreskonmail@hotmail.com','$%%1515frvf'),
(4,'Glastembree','poopoopop@gmail.com','afawnismyday'),
(5,'Drankula','drankculawow@gmail.com','hashypassword'),
(6,'Daniel','danny56@hotmail.com','fjie48&*Rijd'),
(7,'Maria','mariakoskova@aol.com','qwerty'),
(8,'Coco','coco@hotmail.com','jidjf$%%^^YU');

insert into developers values
(1,'Foo','foofoo@gmail.com','#hashisahash'),
(2,'Sam','samuel@yahoo.com','$%%%%R123ijs'),
(3,'Dave','davedave@hotmail.com','$%%1515frvf'),
(4,'Sarah','pooppoop@gmail.com','afawnismyday'),
(5,'Joe','sucky@gmail.com','hashypassword'),
(6,'Maria','yes@aol.com','qwerty');

insert into issues values
(1, 'Tea too cold', 'klsdjfal lskdfjs lk erwef', null, 'open'),
(2, 'Coffee too hot', 'sdfsdvv ghrtr lk gdfgg', null, 'open'),
(3, 'Function too slow', 'klsdjfal dhfhgh lk sldkdfjsldf', null, 'open'),
(4, 'Cat too friendly', 'cbfbd sdfsdfas lk gghn', null, 'open'),
(5, 'Not enough cowbell', 'klsdjfal lskdfjs lk bnmbnm', null, 'open'),
(6, 'Hello there', 'efwefe lskdfjs lk grgsg d', null, 'open'),
(7, 'Makes no sense', 'dcsdse awefwef lk sfa dfsdf', null, 'open'),
(8, 'Give me food', 'klsdjfal lskdfjs lk wewe', null, 'open'),
(9, 'I like cookies', 'fererg rg  lk grrh dfg', null, 'open'),
(10, 'Yes.', 'rthrth dfvd lk dfgerer', null, 'open'),
(11, 'Tires too hot', 'rthrth werwer lk rtyrty', null, 'open'),
(12, 'Coffee too soft', 'fghfgh dfvd lk dfgdfg', null, 'open'),
(13, 'Balls too big', 'dbbfd dfgdfg lk tyutyu', null, 'open');

insert into user_issues values
(1, 4),
(1, 6),
(3, 2),
(2, 1),
(3, 3),
(7, 5),
(3, 7);

insert into developer_issues values
(3, 9),
(5, 10),
(3, 8),
(5, 11),
(2, 12);
