set foreign_key_checks = 0;
drop table if exists users;
drop table if exists developers;
drop table if exists admins;
drop table if exists issues;
drop table if exists login_tokens;
drop table if exists user_issue_open;
drop table if exists developer_issue_assignment;
drop table if exists user_tokens;
drop table if exists developer_tokens;
drop table if exists admin_tokens;
set foreign_key_checks = 1;

create table users (
  id int not null auto_increment,
  name varchar(20) not null,
  email varchar(35) not null unique,
  password text not null,
  primary key (id)
);

create table developers (
  id int not null auto_increment,
  name varchar(20) not null,
  email varchar(35) not null unique,
  password text not null,
  primary key (id)
);

create table admins (
  id int not null auto_increment,
  name varchar(20) not null,
  email varchar(35) not null unique,
  password text not null,
  primary key (id)
);

create table issues (
  id int not null auto_increment,
  heading tinytext not null,
  description text default null,
  time timestamp not null default now(),
  status enum('open', 'closed', 'ongoing') not null,
  primary key (id)
);

create table login_tokens (
  id int not null auto_increment,
  tokenVal text not null,
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
  admin_id int not null,
  developer_id int not null,
  issue_id int not null,
  primary key (developer_id, issue_id),  -- different admins cannot assign the same dev to the same issue
  foreign key (admin_id) references admins(id),
  foreign key (developer_id) references developers(id),
  foreign key (issue_id) references issues(id)
);

create table user_tokens (
  user_id int not null,
  token_id int not null,
  primary key (user_id, token_id),
  foreign key (user_id) references users(id),
  foreign key (token_id) references login_tokens(id)
);

create table developer_tokens (
  developer_id int not null,
  token_id int not null,
  primary key (developer_id, token_id),
  foreign key (developer_id) references developers(id),
  foreign key (token_id) references login_tokens(id)
);

create table admin_tokens (
  admin_id int not null,
  token_id int not null,
  primary key (admin_id, token_id),
  foreign key (admin_id) references admins(id),
  foreign key (token_id) references login_tokens(id)
);

insert into users values
(1,'Zenkov','tenkov@gmail.com','$2a$12$xx2nP6AeXeWQsVYWX61IXu7AV979vJd9Gw81sGG7ifR/59LOU84X2'), -- mansnothot1432!
(2,'Markov','tokenmail@yahoo.com','$2a$12$kpjqr4v68o2lVnrwGwjVPOS/ApJFMiQxjlna2rRtVSZM9H1N1Bdm.'),  -- cookie1n1he1ar
(3,'Dreskonivich','dreskonmail@hotmail.com','$2a$12$9bNg0kFSQN8rFcncM0sdqeH2SG5dHzrA9Bi61uFUKYoLOv0shwNo2');  -- ilikespaceM00n

insert into developers values
(1,'Foo','foofoo@gmail.com','$2a$12$0JW53.bqpkxUS.FCGUyqF.mIJmaoVo6XHvN75ekAPghdMN1LUsD8G'), -- mansnothot1432!
(2,'Sam','samuel@yahoo.com','$2a$12$6hYBKuQxf2lAOGct6qmAYOGMObs490D/7LtFrS3TXyztwb/iXamfe'),  -- cookie1n1he1ar
(3,'Dave','davedave@hotmail.com','$2a$12$HXZPSw4CohQSJP9Kvs3a8e6DBnJ0BAu.yk1.In9IO/oR0/kshsTPK'),  -- ilikespaceM00n
(4,'Fam', 'famfam@fam.com', '$2a$12$E3zNniELqAks8ZiXjFwjGeN.0h80Ier.H/ncpGVviUwdXHHyrZlCi');  -- famdoedoefam

insert into admins values
(1,'Josh','peoplepeepes@gmail.com','$2a$12$omrHgF.XIGnau321NJeGrONzSCLdrlQy9w3lANjdlU/UISmNDCiFy'),  -- yesthisistrue
(2,'Sophie','yesnoyes@yahoo.com','$2a$12$2sgOMXWNe827uALY0wG2XucpD898/qGYHc5lHgKeuLt/Ae7gbFwaa');  -- fillupmyglass

insert into issues values
(1, 'Tea too cold', 'klsdjfal lskdfjs lk erwef', null, 'open'),
(2, 'Coffee too hot', 'sdfsdvv ghrtr lk gdfgg', null, 'open'),
(3, 'Function too slow', 'klsdjfal dhfhgh lk sldkdfjsldf', null, 'open');

-- jwt secret = 2okejf0jfkeflj20ef89e8fkl
insert into login_tokens values
(1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiR4eDJuUDZBZVhlV1FzVllXWDYxSVh1N0FWOTc5dkpkOUd3ODFzR0c3aWZSLzU5TE9VODRYMiIsImlhdCI6MTUyMzIxMjA3MH0.zIDcd1ZlMaa3EVIntRMuWxYQ_8REbrJpEHPMAJWAdEw'),
(2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRrcGpxcjR2NjhvMmxWbnJ3R3dqVlBPUy9BcEpGTWlReGpsbmEyclJ0VlNaTTlIMU4xQmRtLiIsImlhdCI6MTUyMzIxMjEzNn0.-OfyeL1y8ONTKiVpLFybxNnPVPGmWV4Xx1X7s75yflM'),
(3, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRrcGpxcjR2NjhvMmxWbnJ3R3dqVlBPUy9BcEpGTWlReGpsbmEyclJ0VlNaTTlIMU4xQmRtLiIsImlhdCI6MTUyMzIxMjE2M30.GJxwAC7fRAF9UzQ4AaP3r5bnWG8TPXZgw-jfYx0aaJE'),
(4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRIWFpQU3c0Q29oUVNKUDlLdnMzYThlNkRCbkowQkF1LnlrMS5JbjlJTy9vUjAva3Noc1RQSyIsImlhdCI6MTUyMzI2MzI4MX0.p-jmoRcn8DlQxs3ERFNXHdKE_g_cMOuQg0LcOKptmvA'),
(5, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiQyc2dPTVhXTmU4Mjd1QUxZMHdHMlh1Y3BEODk4L3FHWUhjNWxIZ0tldUx0L0FlN2diRndhYSIsImlhdCI6MTUyMzI2NDIxN30.kn34Zc76XRrBH8JxGIYONljP8-YMaaCyF9RU00-1EDE'),
(6, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IiQyYSQxMiRFM3pObmlFTHFBa3M4WmlYakZ3akdlTi4waDgwSWVyLkgvbmNwR1Z2aVV3ZFhISHlyWmxDaSIsImlhdCI6MTUyMzUzNjQ1MH0.gYF11NIeMZ8Ft0e-hAxYaEM0Q6kCkgNUmSk4f3oVJko');

insert into user_issue_open values
(2, 1),
(1, 2),
(2, 3);

insert into developer_issue_assignment values
(1, 3, 1),
(1, 1, 1),
(2, 3, 2),
(2, 2, 1),
(2, 2, 2);

insert into user_tokens values
(1, 1),
(2, 2),
(2, 3);

insert into developer_tokens values
(3, 4),
(4, 6);

insert into admin_tokens values
(2, 5);
