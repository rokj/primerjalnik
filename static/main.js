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
    secondProductId = null;
    secondTomSelect.clear();

    showCharts();
});

function justPriceAndDates(value, quantity) {
    let price = value["price"] * quantity;
    price = Math.round((price + Number.EPSILON) * 100) / 100;

    return {x: value["price_date"], y: price};
}

// multiple lines, multiple labels https://stackoverflow.com/questions/49489670/chart-js-displaying-multiple-line-charts-using-multiple-labels
function showCharts() {
    let product1 = products[firstProductId];
    let product2 = secondTomSelectShown ? products[secondProductId] : null;

    let prices1 = product1["prices"].map(element => justPriceAndDates(element, product1["quantity"]));
    let prices2 = product2 ? product2["prices"].map(element => justPriceAndDates(element, product2["quantity"])) : [];

    let datasets = [];
    let dataSet1 = {
        label: product1["name"],
        data: prices1,
        fill: false,
        showLine: true,
        borderColor: '#36a2eb',
        tension: 0.1,
    };
    datasets.push(dataSet1);

    if (secondTomSelectShown) {
        let dataSet2 = {
            label: product2["name"],
            data: prices2,
            fill: false,
            showLine: true,
            borderColor: '#eb3636',
            tension: 0.1,
        }

        datasets.push(dataSet2);
    }

    const data = {
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
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
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

    const ctx = document.querySelector('#pc-chart');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, config);

    let currency_1 = "€";
    if (product1["name"].includes("Inflacija")) {
	    currency_1 = "%";
    }

    if (product1["url"] != "") {
        document.querySelector("#source-a").setAttribute('href', product1['url']);
    }

    document.querySelector("#product-a").classList.remove("hide");
    document.querySelector("#name-a").innerHTML = product1["name"];
    document.querySelector("#store-a").innerHTML = product1["store"] != "" ? "trgovina " + product1["store"] : "";
    document.querySelector("#current-price-a").innerHTML = prices1.length > 0 ? "trenutna vrednost " + prices1.at(-1).y + " " + currency_1 : "";

    if (secondTomSelectShown) {
        let currency_2 = "€";
        if (product2["name"].includes("Inflacija")) {
            currency_2 = "%";
        }

        if (product2["url"] != "") {
            document.querySelector("#source-b").setAttribute('href', product2['url']);
        }

        document.querySelector("#product-b").classList.remove("hide");
        document.querySelector("#product-a .title").classList.remove("hide");

        document.querySelectorAll(".select-product-wrapper .title").forEach((item) => {
            item.classList.remove("hide");
        });

        document.querySelector("#name-b").innerHTML = product2["name"];
        document.querySelector("#store-b").innerHTML = product2["store"] != "" ? "trgovina " + product2["store"] : "";
        document.querySelector("#current-price-b").innerHTML = prices2.length > 0 ? "trenutna vrednost " + prices2.at(-1).y + " " + currency_2 : "";
    } else {
        document.querySelector("#product-b").classList.add("hide");
        document.querySelector("#product-a .title").classList.add("hide");
        document.querySelectorAll(".select-product-wrapper .title").forEach((item) => {
            item.classList.add("hide");
        });
    }
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
		item: function(data, escape) {
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
		}
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