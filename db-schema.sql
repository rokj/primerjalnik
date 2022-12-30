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

insert into products(id, url, store) values (1, 'https://www.spar.si/online/ajdov-kruh-z-orehi-zito-400g/p/422108', 'spar');
insert into products(id ,url, store) values (2, 'https://www.spar.si/online/jabolka-gala-1kg/p/296981', 'spar');
insert into products(id, url, store) values (3, 'https://www.spar.si/online/testenine-tortiglioni-spar-500g/p/493086', 'spar');
insert into products(id, url, store) values (4, 'https://www.spar.si/online/trajno-mleko-35-mm-spar-1l/p/270241', 'spar');
insert into products(id, url, store) values (5, 'https://www.spar.si/online/mleto-goveje-meso-spar-480g/p/411702', 'spar');
insert into products(id, url, store) values (6, 'https://www.spar.si/online/mleta-kava-classic-barcaffe-200g/p/311658', 'spar');

insert into prices(product_id, price, price_date) values (1, 2.29, "2022-08-22");
insert into prices(product_id, price, price_date) values (2, 0.74, "2022-08-22");
insert into prices(product_id, price, price_date) values (3, 0.83, "2022-08-22");
insert into prices(product_id, price, price_date) values (4, 1.09, "2022-08-22");
insert into prices(product_id, price, price_date) values (5, 4.99, "2022-08-22");
insert into prices(product_id, price, price_date) values (6, 2.99, "2022-08-22");
