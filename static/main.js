let chart = null;
let secondTomSelectShown = false;
let firstProductId = null;
let secondProductId = null;

// when we click compare button, we hide or show next tom select element
let compare = document.querySelector(".compare");
compare.addEventListener("click", () => {
    if (! secondTomSelectShown) {
        document.querySelector(".select-product-base-2").classList.remove("hide");
        secondTomSelectShown = true;

        return;
    }

    document.querySelector(".select-product-base-2").classList.add("hide");
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

function compareByDate(a, b) {
  if (Date.parse(a.x) < Date.parse(b.x)) {
    return -1;
  }
  if (Date.parse(a.x) > Date.parse(b.x)) {
    return 1;
  }
  return 0;
}

function fillTable(t1, t2) {
    for (const p1 of t1) {
        let inside = false;
        for (const p2 of t2) {
            if (p1.x == p2.x) {
                inside = true;
                break;
            }
        }

        if (!inside) {
            t2.push({x: p1.x, y: null})
        }
    }

    return t2;
}

function setNoPriceToLastPrice(prices) {
    let i = 1;
    let last_index_with_price = -1;
    while (i < prices.length) {
        if (prices[i].y) {
            last_index_with_price = i;
        }

        i++;
    }

    i = 1;
    while (i < prices.length) {
        if (!prices[i].y && (last_index_with_price >= i)) {
            prices[i].y = prices[i-1].y;
        }

        i++;
    }

    return prices;
}

function fillMissingPrices(prices1, prices2) {
    if (prices2.length == 0) {
        return {prices1, prices2};
    }

    prices2 = fillTable(prices1, prices2);
    prices1 = fillTable(prices2, prices1);

    prices1.sort(compareByDate);
    prices2.sort(compareByDate);

    prices1 = setNoPriceToLastPrice(prices1);
    prices2 = setNoPriceToLastPrice(prices2);

    return {prices1: prices1, prices2: prices2}
}

// multiple lines, multiple labels https://stackoverflow.com/questions/49489670/chart-js-displaying-multiple-line-charts-using-multiple-labels
function showCharts() {
    if (! firstProductId) {
        return;
    }

    let product1 = products[firstProductId];
    let product2 = secondTomSelectShown ? products[secondProductId] : null;

    let tmp_prices1 = product1["prices"].map(element => justPriceAndDates(element, product1["quantity"]));
    let tmp_prices2 = product2 ? product2["prices"].map(element => justPriceAndDates(element, product2["quantity"])) : [];

    const {prices1, prices2} = fillMissingPrices(tmp_prices1, tmp_prices2);

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
        if (product2) {
            let dataSet2 = {
                label: product2["name"],
                data: prices2,
                fill: false,
                showLine: true,
                borderColor: '#eb3636',
                tension: 0.1,
            }

            if (product1["unit"] != product2["unit"]) {
                dataSet2["yAxisID"] = 'y1'
            }

            datasets.push(dataSet2);
        }
    }

    const data = {
        datasets: datasets
    };

    const config = {
        responsive: true,
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
                        text: secondTomSelectShown && (product1["unit"] != product2["unit"]) ? product1["name"] + " (" + product1["unit"] + ")" : product1["unit"]
                    }
                },
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: "datum"
                    }
                },
            }
            /* ,
            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                            speed: 0.1,
                        },
                        mode: 'x',
                        speed: 0.1,
                        threshold: 1,
                        sensitivity: 1,
                    }
                }
            }
            */
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
        if (product1["unit"] != product2["unit"]) {
            config["options"]["scales"]["y1"] = {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: product2["name"] + " (" + product2["unit"] + ")"
                }
            }
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
        document.querySelector("#current-price-b").innerHTML = prices2.length > 0 && prices2.at(-1).y != null ? "trenutna vrednost " + prices2.at(-1).y + " " + product2["unit"] : "";
    } else {
        document.querySelector("#product-b").classList.add("hide");
        document.querySelector("#product-a .title").classList.add("hide");
        document.querySelectorAll(".select-product-wrapper .title").forEach((item) => {
            item.classList.add("hide");
        });
    }
}

function option_item_render(data, escape) {
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

function option_create_render(data, escape) {
    return '<div class="create">Dodaj <strong>' + escape(data.input) + '</strong>&hellip;</div>';
}

function option_no_results_render(data, escape) {
    return '<div class="no-results">Ni najdenih besed za "' + escape(data.input) + '"</div>';
}

let firstTomSelect = new TomSelect(".select-product-1", {
    create: true,
    responsive: true,
    sortField: {
        field: "text",
        direction: "asc"
    },
    maxOptions: null,
    onChange: (productId) => {
        firstProductId = productId;
        showCharts();
    },
    render: {
        option_create: option_create_render,
        no_results: option_no_results_render,
        option: option_item_render,
		item: option_item_render
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
        option_create: option_create_render,
        no_results: option_no_results_render,
        option: option_item_render,
		item: option_item_render
    }
});