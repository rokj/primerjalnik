import requests
from pyquery import PyQuery


class Spar:
    urls = [
        "https://www.spar.si/online/ajdov-kruh-z-orehi-zito-400g/p/422108",
        "https://www.spar.si/online/jabolka-gala-1kg/p/296981",
        "https://www.spar.si/online/testenine-tortiglioni-spar-500g/p/493086",
        "https://www.spar.si/online/trajno-mleko-35-mm-spar-1l/p/270241",
        "https://www.spar.si/online/mleto-goveje-meso-spar-480g/p/411702",
        "https://www.spar.si/online/mleta-kava-classic-barcaffe-200g/p/311658"
    ]

    def get_prices(self):
        total = len(self.urls)
        i = 1

        products = []
        for url in self.urls:
            r = requests.get(url)
            base_pq = PyQuery(r.content)

            product_name = base_pq(".productMainDetails .productDetailsName")
            product_price = base_pq(".productMainDetails .productDetailsPrice")

            p = {
                "url": url,
                "product_name": product_name.attr("title"),
                "product_price": product_price.attr("data-baseprice")
            }

            products.append(p)

            print("parsing {0}/{1}".format(i, total))

            i += 1

        return products
