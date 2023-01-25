let chart = null;
let secondTomSelectShown = false;
let firstProductId = null;
let secondProductId = null;

// when we click compare button, we hide or show next tom select element
let compare = document.querySelector(".compare");
compare.addEventListener("click", () => {
    if (! secondTomSelectShown) {
        document.querySelector(".select-product-base:nth-child(2)").classList.remove("hide");
        secondTomSelectShown = true;

        return;
    }

    document.querySelector(".select-product-base:nth-child(2)").classList.add("hide");
    secondTomSelectShown = false;
});

function justDates(value) {
    return value["price_date"];
}

function justPrices(value, quantity) {
    let price = value["price"] * quantity;
    price = Math.round((price + Number.EPSILON) * 100) / 100;

    return price;
}

function showCharts() {
    let product1 = products[firstProductId];
    let product2 = secondTomSelectShown ? products[secondProductId] : null;

    let dates1 = product1["prices"].map(justDates);
    let dates2 = product2 ? product2["prices"].map(justDates) : null;
    let prices1 = product1["prices"].map(element => justPrices(element, product1["quantity"]));
    let prices2 = product2 ? product2["prices"].map(element => justPrices(element, product2["quantity"])) : [];

    let datasets = [];
    let dataSet1 = {
        label: 'prvi',
        data: prices1,
        fill: false,
        borderColor: '#36a2eb',
        tension: 0.1,
        labels: dates1
    };
    datasets.push(dataSet1);

    if (secondTomSelectShown) {
        let dataSet2 = {
            label: 'drugi',
            data: prices2,
            fill: false,
            borderColor: '#eb3636',
            tension: 0.1,
            labels: dates2
        }

        datasets.push(dataSet2);
    }

    const data = {
        labels: dates1,
        datasets: datasets
    };

    let y_text = "€";
    if (product1["name"].includes("Inflacija")) {
	    y_text = "%";
    }

    if (secondTomSelectShown && (
        product1["name"].includes("Inflacija") || product2["name"].includes("Inflacija")
    )) {
        y_text = "€ oz. %";
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            stacked: false,
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
                        text: y_text
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
    if (product["url"] != "") {
        document.querySelector("#source").setAttribute('href', product['url']);
        document.querySelector("#source").classList.add("d-block");
    }

    document.querySelector("#store").innerHTML = product["store"] != "" ? "trgovina " + product["store"] : "";
    document.querySelector("#current-price").innerHTML = prices.length > 0 ? "trenutna vrednost " + prices.at(-1) + " " + y_text : "";
     */

    const ctx = document.querySelector('#pc-chart');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, config);
}

function changeProduct2(productId) {
    secondProductId = productId;
    showCharts();
}

let firstTomSelect = new TomSelect(".select-product-1", {
    create: true,
    responsive: true,
    sortField: {
        field: "text",
        direction: "asc"
    },
    onChange: (productId) => {
        firstProductId = productId;
        showCharts();
    },
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

let secondTomSelect = new TomSelect(".select-product-2", {
    create: true,
    responsive: true,
    sortField: {
        field: "text",
        direction: "asc"
    },
    onChange: (productId) => {
        secondProductId = productId;
        showCharts();
    },
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