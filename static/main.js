function justDates(value) {
    return value["price_date"]
}

function justPrices(value) {
    return value["price"]
}

function changeProduct(productId) {
    let product = products[productId];
    if (!product) {
        return;
    }

    let dates = product["prices"].map(justDates);
    let prices = product["prices"].map(justPrices);

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

    document.getElementById("source").setAttribute('href', product['url']);

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
		no_results: function(data,escape){
			return '<div class="no-results">Ni najdenih besed za "'+escape(data.input)+'"</div>';
		},
    }
});

let chart = null;
