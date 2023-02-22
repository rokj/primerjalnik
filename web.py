import datetime
import json
from flask import Flask
from flask import render_template
from flask import g
import sqlite3

app = Flask(__name__)

DATABASE = 'db.db'


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def make_dicts(cursor, row):
    return dict((cursor.description[idx][0], value)
                for idx, value in enumerate(row))


def query_db(query, args=(), one=False):
    db = get_db()
    db.row_factory = make_dicts
    cur = db.execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


def higher_prices(higher=True):
    # let us show something
    tmp_products = query_db("select id, url, name, store, quantity from products where show = 1")
    products = {}

    for p in tmp_products:
        prices = query_db("select price, price_date from prices where product_id = ? order by price_date asc", [p["id"]])

        if len(prices) <= 1:
            continue

        if higher:
            if prices[-1]["price"] <= prices[0]["price"]:
                continue
        else:
            if prices[-1]["price"] >= prices[0]["price"]:
                continue

        changes = [prices[0]]
        for price in prices:
            if price["price"] != changes[-1]["price"]:
                changes.append(price)

        for c in changes:
            c["price"] = c["price"] * p["quantity"]

        if len(changes) <= 1:
            continue

        store = ""
        if p["store"]:
            store = p["store"]

        products[p["id"]] = {
            "id": p["id"],
            "name": p["name"],
            "url": p["url"],
            "quantity": p["quantity"],
            "store": store,
            "changes": changes
        }

    return render_template('visje-cene.html', products=products, higher=higher)



@app.route("/")
def index():
    # let us show something
    tmp_products = query_db("select id, url, name, store, quantity, unit from products where show = 1")
    products = {}

    for p in tmp_products:
        prices = query_db("select price, price_date from prices where product_id = ? order by price_date asc", [p["id"]])

        if len(prices) == 0:
            continue

        store = ""
        if p["store"]:
            store = p["store"]

        products[p["id"]] = {
            "id": p["id"],
            "name": p["name"],
            "url": p["url"],
            "quantity": p["quantity"],
            "store": store,
            "prices": prices,
            "unit": p["unit"]
        }

    product = products[1]

    return render_template('index.html', products=products, product=product)

@app.route("/visje-cene")
def higher_changes():
    return higher_prices(True)

@app.route("/nizje-cene")
def lower_changes():
    return higher_prices(False)