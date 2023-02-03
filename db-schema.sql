drop table if exists products;
drop table if exists prices;

create table products (
	id integer primary key autoincrement,
	url text not null unique,
	name text,
	store text,

	created_at datetime default current_timestamp,
	updated_at datetime default current_timestamp
);

create table prices (
	id integer primary key autoincrement,
	product_id integer,
	price decimal(10,5),
	price_date date default current_date,

	created_at datetime default current_timestamp,
	updated_at datetime default current_timestamp,
	foreign key (product_id) REFERENCES products(id),
	unique(product_id, price_date) on conflict ignore
);

insert into products(id, url, store) values (1, 'https://www.spar.si/online/ajdov-kruh-z-orehi-zito-400g/p/422108', 'Špar');
insert into products(id ,url, store) values (2, 'https://www.spar.si/online/jabolka-gala-1kg/p/296981', 'Špar');
insert into products(id, url, store) values (3, 'https://www.spar.si/online/testenine-tortiglioni-spar-500g/p/493086', 'Špar');
insert into products(id, url, store) values (4, 'https://www.spar.si/online/trajno-mleko-35-mm-spar-1l/p/270241', 'Špar');
insert into products(id, url, store) values (5, 'https://www.spar.si/online/mleto-goveje-meso-spar-480g/p/411702', 'Špar');
insert into products(id, url, store) values (6, 'https://www.spar.si/online/mleta-kava-classic-barcaffe-200g/p/311658', 'Špar');

insert into prices(product_id, price, price_date) values (1, 2.29, '2022-08-22');
insert into prices(product_id, price, price_date) values (2, 0.74, '2022-08-22');
insert into prices(product_id, price, price_date) values (3, 0.83, '2022-08-22');
insert into prices(product_id, price, price_date) values (4, 1.09, '2022-08-22');
insert into prices(product_id, price, price_date) values (5, 4.99, '2022-08-22');
insert into prices(product_id, price, price_date) values (6, 2.99, '2022-08-22');

alter table products add column sync_from_internet int default 1;

insert into products(url, name, sync_from_internet) values ('https://www.stat.si/StatWeb/Field/Index/5/30?1', 'Cena električne energije za gospodinjstva', 0);
insert into products(url, name, sync_from_internet) values ('https://www.stat.si/StatWeb/Field/Index/5/30?2', 'Cena električne energije za negospodinjstva', 0);
insert into products(url, name, sync_from_internet) values ('https://www.stat.si/StatWeb/Field/Index/5/30?3', 'Cena zemeljskega plina za gospodinjstva', 0);
insert into products(url, name, sync_from_internet) values ('https://www.stat.si/StatWeb/Field/Index/5/30?4', 'Cena zemeljskega plina za negospodinjstva', 0);

alter table products add column show int default 1;
alter table products add column quantity int default 1;
alter table products add column ean text default '';
create index ean_index ON products(ean);

create table products_history(
	id integer primary key autoincrement,
	ref_id integer,
	data text not null,
	action_after text,
	created_at datetime default current_timestamp
);