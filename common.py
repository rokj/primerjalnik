import json


def trigger(db, table, id, action):
    cur = db.execute("select * from {} where id = ?".format(table), [id])
    data = cur.fetchone()
    if data:
        data_in_json = json.dumps(dict(data))
        db.execute('insert into {}_history(ref_id, data, action_after) values (?, ?, ?)'.format(table), [
            id,
            data_in_json,
            action
        ])
        db.commit()


def update_product_name(db, product_id, name, current_product_name):
    if name != current_product_name:
        trigger(db, 'products', product_id, 'update')
        db.execute("update products set name = ? where id = ?", [
            name,
            product_id
        ])

        db.commit()


def insert_price(db, product_id, product_price, price_date):
    db.execute("insert into prices(product_id, price, price_date) values (?, ?, ?)", (
        product_id,
        str(product_price),
        price_date,
    ))
    db.commit()