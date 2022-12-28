drop table if exists product;
create table product(
	id integer primary key autoincrement,
	url text not null,
	name text,
	price decimal(10,5),
	created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp
);