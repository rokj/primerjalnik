function justDates(value) {
    return value["price_date"];
}

function justPrices(value, quantity) {
    let price = value["price"] * quantity;
    price = Math.round((price + Number.EPSILON) * 100) / 100;

    return price;
}

function changeProduct(productId) {
    let product = products[productId];
    if (!product) {
        return;
    }

    let dates = product["prices"].map(justDates);
    let prices = product["prices"].map(element => justPrices(element, product["quantity"]));

    const labels = dates;
    const data = {
        labels: labels,
        datasets: [{
            label: '',
            data: prices,
            fill: false,
            borderColor: '#36a2eb',
            tension: 0.1
        }]
    };

    let y_text = "€";
    if (product["name"].includes("Inflacija")) {
	y_text = "%";
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: "€"
                    }
                },
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "datum"
                    }
                }
            }
        }
    };

    /*
    document.getElementById("product-name").textContent = product["name"].substring(0, 40) + " ... ";

    let pricesTableBody = product["prices"].map(p => "<tr><td>" + p["price_date"] + "</td><td>" + p["price"] + "</td></tr>").join('');
    document.getElementById("product-prices").innerHTML = pricesTableBody;
     */

    if (product["url"] != "") {
        document.getElementById("source").setAttribute('href', product['url']);
        document.getElementById("source").classList.add("d-block");
    }

    document.getElementById("store").innerHTML = product["store"] != "" ? "trgovina " + product["store"] : "";
    document.getElementById("current-price").innerHTML = prices.length > 0 ? "trenutna cena " + prices.at(-1) + " " + y_text : "";

    const ctx = document.getElementById('pc-chart');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, config);
}

new TomSelect("#select-product", {
	create: true,
    responsive: true,
	sortField: {
		field: "text",
		direction: "asc"
	},
    onChange: changeProduct,
    render: {
		option_create: function(data, escape) {
			return '<div class="create">Dodaj <strong>' + escape(data.input) + '</strong>&hellip;</div>';
		},
		no_results: function(data, escape) {
			return '<div class="no-results">Ni najdenih besed za "' + escape(data.input) + '"</div>';
		},
        option: function(data, escape) {
            let store = "";
            if (data.store != "") {
                if (data.store == "Špar") {
                    store = 'spar';
                } else if (data.store == "Mercator") {
                    store = 'mercator';
                } else if (data.store == "Tuš") {
                    store = 'tus';
                }

                store = '<span class="store ' + store + '"></span>';
            }

			return '<div>' + escape(data.text) + store  +'</div>';
		},
    }
});

let chart = null;
