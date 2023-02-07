import datetime
import sqlite3
import requests
from pyquery import PyQuery
from common import update_product_name, insert_price, parse_price

db = sqlite3.connect('db.db')
db.row_factory = sqlite3.Row
cur = db.execute('select id, url, name, store from products where sync_from_internet = 1 and store in ("www.energetika-portal.si")')
products = cur.fetchall()

print("--- START IMPORTING NAFTA PRICES ---")
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

    j = 0
    for tr in base_pq(".contenttable tr").items():
        j += 1

        if j <= 2:
            continue

        date = tr("td:nth-child(1)")
        petrol = tr("td:nth-child(2)")
        diesel = tr("td:nth-child(3)")
        oil = tr("td:nth-child(4)")

        if date and petrol and diesel and oil and date.text().strip() != "":
            date = datetime.datetime.strptime(date.text().strip(), '%d.%m.%Y')
            product_price = 0

            if p["name"] == "Bencin (NMB-95)":
                product_price = petrol.text().strip()
            elif p["name"] == "Dizelsko gorivo":
                product_price = diesel.text().strip()
            elif p["name"] == "Kurilno olje (ekstra lahko ELKO)":
                product_price = oil.text().strip()

            if product_price == "/":
                continue
            if product_price == "prenehanje regulacije - tržne cene":
                continue
            if product_price == "tržne cene":
                continue

            try:
                price = parse_price(product_price)
            except Exception as e:
                print("WARN could not get price for {0}".format(p["url"]))
                print(e)
                continue

            if date and price > 0:
                insert_price(db, p["id"], price, date.date())

db.close()

print(datetime.datetime.now())
print("--- END IMPORTING NAFTA PRICES ---")
