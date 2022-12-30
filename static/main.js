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
            borderColor: 'rgb(126,126,126)',
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
            }
        }
    };

    document.getElementById("product-name").textContent = product["name"].substring(0, 40) + " ... ";

    let pricesTableBody = product["prices"].map(p => "<tr><td>" + p["price_date"] + "</td><td>" + p["price"] + "</td></tr>").join('');
    document.getElementById("product-prices").innerHTML = pricesTableBody;

    const ctx = document.getElementById('pc-chart');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, config);
}

new TomSelect("#select-product", {
	create: true,
	sortField: {
		field: "text",
		direction: "asc"
	},
    onChange: changeProduct
});

let chart = null;
