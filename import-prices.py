import datetime
import sqlite3
import requests
from pyquery import PyQuery
from common import update_product_name, insert_price, parse_price

db = sqlite3.connect('db.db')
db.row_factory = sqlite3.Row
cur = db.execute('select id, url, name, store from products where sync_from_internet = 1 and store in (Tuš")')
products = cur.fetchall()

print("--- START IMPORTING PRICES ---")
print(datetime.datetime.now())

total = len(products)
i = 1
for p in products:
    print("doing {0}/{1} {2}".format(i, total, p["url"]))
    i += 1

    r = requests.get(p["url"], allow_redirects=False)
    if r.status_code == 302:
        print("WARN will omit this one since its redirecting {0}".format(p["url"]))
        continue
    elif r.status_code == 301:
        print("WARN will omit this one since it moved permanently {0}".format(p["url"]))
        continue
    elif r.status_code != 200:
        print("WARN getting status {1}. could not get product price from {0}".format(p["url"], r.status_code))

    base_pq = PyQuery(r.content)

    if p["store"] == "Špar":
        product_name = base_pq(".productMainDetails .productDetailsName")
        product_name(".productDescription").remove()
        product_name = product_name.text()
        product_price = base_pq(".productMainDetails .productDetailsPrice").attr("data-baseprice")

    elif p["store"] == "Mercator":
        product_name = base_pq(".productHolder h1").text()
        product_price = base_pq(".productHolder .price-box .price").text()

    elif p["store"] == "Tuš":
        product_name = base_pq("#main .article h1").text()
        product_price = base_pq("#main .article .buy-module .price-discounted strong").text()
    else:
        continue

    try:
        price = parse_price(product_price)
    except Exception:
        print("WARN could not get price for {0}".format(p["url"]))
        continue

    update_product_name(db, p["id"], product_name, p["name"])
    insert_price(db, p["id"], price, datetime.date.today())

db.close()

print(datetime.datetime.now())
print("--- END IMPORTING PRICES ---")
