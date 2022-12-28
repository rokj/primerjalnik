import sqlite3
from poi.spar import Spar

db = sqlite3.connect('db.db')

# doing spar
s = Spar()
for p in s.get_prices():
    db.execute("insert into product(url, name, price) values (?, ?, ?)", [p["url"], p["product_name"], p["product_price"]])
    db.commit()
    print("{0}, {1}".format(p["product_name"], p["product_price"]))

db.close()
