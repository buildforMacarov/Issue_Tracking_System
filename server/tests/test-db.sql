create table users (
  id int(8) not null auto_increment,
  name tinytext not null,
  email varchar(35) not null,
  password varchar(35) not null,
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
  user_id int,
  issue_id int,
  primary key (user_id, issue_id),
  foreign key (user_id) references users(id),
  foreign key (issue_id) references issues(id)
);

insert into users values
(null,'Zenkov','tenkov@gmail.com','#hashisahash'),
(null,'Markov','tokenmail@yahoo.com','$%%%%R123ijs'),
(null,'Dreskonivich','dreskonmail@hotmail.com','$%%1515frvf'),
(null,'Glastembree','poopoopop@gmail.com','afawnismyday'),
(null,'Drankula','drankculawow@gmail.com','hashypassword'),
(null,'Daniel','danny56@hotmail.com','fjie48&*Rijd'),
(null,'Maria','mariakoskova@aol.com','qwerty'),
(null,'Coco','coco@yahoo.com','jidjf$%%^^YU');

insert into issues values
(null, 'Tea too cold', 'klsdjfal lskdfjs lk erwef', null, 'open'),
(null, 'Coffee too hot', 'sdfsdvv ghrtr lk gdfgg', null, 'open'),
(null, 'Function too slow', 'klsdjfal dhfhgh lk sldkdfjsldf', null, 'open'),
(null, 'Cat too friendly', 'cbfbd sdfsdfas lk gghn', null, 'open'),
(null, 'Not enough cowbell', 'klsdjfal lskdfjs lk bnmbnm', null, 'open'),
(null, 'Hello there', 'efwefe lskdfjs lk grgsg d', null, 'open'),
(null, 'Makes no sense', 'dcsdse awefwef lk sfa dfsdf', null, 'open'),
(null, 'Give me food', 'klsdjfal lskdfjs lk wewe', null, 'open'),
(null, 'I like cookies', 'fererg rg  lk grrh dfg', null, 'open'),
(null, 'Yes.', 'rthrth dfvd lk dfgerer', null, 'open');

insert into user_issues values
(1, 4),
(1, 6),
(3, 2),
(2, 1),
(3, 3),
(7, 5),
(3, 7);
