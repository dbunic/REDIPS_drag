/*

Darko Bunic
http://www.redips.net/
Feb, 2010.

*/

create table redips_timetable (
  tbl_id int(10) unsigned not null auto_increment,
  sub_id char(2) not null,
  tbl_row smallint(6) not null,
  tbl_col smallint(6) not null,
  primary key (`tbl_id`) using btree
);

create table redips_subject (
  sub_id char(2) not null,
  sub_name varchar(40) not null
);

insert into redips_subject VALUES ('en','English'),('ma','Mathematics'),('ph','Physics'),('bi','Biology'),('ch','Chemistry'),('it','IT'),('ar','Arts'),('hi','History'),('et','Ethics');
