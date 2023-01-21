import datetime
import sqlite3
import requests
from pyquery import PyQuery


def update_product_name(product_id, name, current_product_name):
    global db

    if current_product_name == "" or current_product_name is None and (name is not None and name != ""):
        db.execute("update products set name = ? where id = ?", [
            name,
            product_id
        ])

        db.commit()


def insert_price(product_id, product_price, price_date):
    global db

    price = product_price.replace("€", "").replace(",", ".")

    db.execute("insert into prices(product_id, price, price_date) values (?, ?, ?)", [
        product_id,
        price,
        price_date
    ])
    db.commit()


db = sqlite3.connect('db.db')
db.row_factory = sqlite3.Row
cur = db.execute("select id, url, name, store from products where sync_from_internet = 1")
products = cur.fetchall()

total = len(products)
i = 1
for p in products:
    print("doing {0}/{1} {2}".format(i, total, p["url"]))

    r = requests.get(p["url"], allow_redirects=False)
    if r.status_code == 302:
        print("will omit this one since its redirecting {0}".format(p["url"]))
        continue
    elif r.status_code != 200:
        print("check website {0}".format(p["url"]))

    base_pq = PyQuery(r.content)

    if p["store"] == "Špar":
        product_name = base_pq(".productMainDetails .productDetailsName")
        product_price = base_pq(".productMainDetails .productDetailsPrice")

        update_product_name(p["id"], product_name.attr("title"), p["name"])
        if product_price and product_price is not None:
            insert_price(p["id"], product_price.attr("data-baseprice"), datetime.date.today())

    elif p["store"] == "Mercator":
        product_name = base_pq(".productHolder h1")
        product_price = base_pq(".productHolder .price-box .price")

        update_product_name(p["id"], product_name.text(), p["name"])
        if product_price and product_price is not None:
            insert_price(p["id"], product_price.text(), datetime.date.today())

    elif p["store"] == "Tuš":
        product_name = base_pq("#main .article h1")
        product_price = base_pq("#main .article .buy-module .price-discounted strong")

        update_product_name(p["id"], product_name.text(), p["name"])
        if product_price and product_price is not None:
            insert_price(p["id"], product_price.text(), datetime.date.today())

    i += 1

db.close()
