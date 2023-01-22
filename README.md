# Primerjalnik cen

Primerjalnik cen je preprosta spletna stran za primerjavo cen osnovnih živil, storitev, ...  

Vsa izvorna koda je prosto dostopna, prav tako tudi baza.

Spletna stran se nahaja na https://primerjalnik-cen.si

# Ideja

58k?  

# Razvojno okolje

- python
- flask
- sqlite3
- js > ES6
- bootstrap
- KISS

# Navodila za razvijalce

Na računalniku morate imeti nameščen python, flask in sqlite3.

Ko imate kodo enkrat pri sebi, lahko zaženete strežnik z naslednjim ukazom:  
1. `flask --app web run`
2. odprite brskalnik na naslednjem naslovu `http://127.0.0.1:5000`

# Uvoz podatkov (novih produktov, storitev, ...)

Želite pomagati in imate zgodovino cen nekaterih artiklov ali storitev v neki Excel ali pa CSV datoteki?

Lahko jo prilagodite na naslednji način in jo date v https://github.com/rokj/primerjalnik/issues:
| url  | datum cene | cena |
| ------------- | ---------- | ------------- |
| https://trgovina.mercator.si/market/izdelek/17294885/kislo-zelje-mercator-1-kg | 2023-01-21 | 1.11 |
| https://trgovina.mercator.si/market/izdelek/17294885/kislo-zelje-mercator-1-kg | 2023-01-22 | 1.12 |
| https://trgovina.mercator.si/market/izdelek/17294885/kislo-zelje-mercator-1-kg | 2023-01-23 | 1.13 |
| https://trgovina.mercator.si/market/izdelek/17645533/piscancji-zrezki-mercator-pakirano-500-g-ik | 2023-02-11 | 2.11 |
| https://trgovina.mercator.si/market/izdelek/17645533/piscancji-zrezki-mercator-pakirano-500-g-ik | 2023-02-12 | 2.12 |
| https://trgovina.mercator.si/market/izdelek/17645533/piscancji-zrezki-mercator-pakirano-500-g-ik | 2023-02-13 | 2.13 |



