import datetime
import sqlite3
import requests
from pyquery import PyQuery

db = sqlite3.connect('db.db')
db.row_factory = sqlite3.Row
cur = db.execute("select id, url, name, store from products where sync_from_internet = 1")
products = cur.fetchall()

total = len(products)
i = 1
for p in products:
    if p["store"] == "Špar":
        r = requests.get(p["url"])
        base_pq = PyQuery(r.content)

        product_name = base_pq(".productMainDetails .productDetailsName")
        product_price = base_pq(".productMainDetails .productDetailsPrice")

        if p["name"] == "" or p["name"] is None:
            db.execute("update products set name = ? where id = ?", [
                product_name.attr("title"),
                p["id"]
            ])

        db.execute("insert into prices(product_id, price, price_date) values (?, ?, ?)", [
            p["id"],
            product_price.attr("data-baseprice"),
            datetime.date.today()
        ])
        db.commit()
    elif p["store"] == "Mercator":
        r = requests.get(p["url"])
        base_pq = PyQuery(r.content)

        product_name = base_pq(".productHolder h1")
        product_price = base_pq(".productHolder .price-box .price")

        if p["name"] == "" or p["name"] is None:
            db.execute("update products set name = ? where id = ?", [
                product_name.text(),
                p["id"]
            ])

        db.execute("insert into prices(product_id, price, price_date) values (?, ?, ?)", [
            p["id"],
            product_price.text().replace("€", "").replace(",", "."),
            datetime.date.today()
        ])
        db.commit()

    print("doing {0}/{1}".format(i, total))
    i += 1

db.close()
