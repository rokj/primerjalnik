function change_prices(in_last) {
    $(".price-changes tbody").empty();
    // products is object, so we use "in"
    for (id in products[in_last]) {
        let product = products[in_last][id];
        let html = '<tr>' +
            '<td><a href="' + product['url'] + '" target="_blank">' + product['name'] + '</a></td>' +
            '<td>' + product['store'] + '</td>' +
            '<td class="price-info"><span class="price">' + product["changes"][0]["price"] + ' €</span><span class="price-date">' + product["changes"][0]["price_date"] + '</span></span></td>' +
            '<td class="price-info"><span class="price">' + product["changes"].at(-1)["price"] + ' €</span><span class="price-date">' + product["changes"].at(-1)["price_date"] + '</span><span class="change-percent">(' + product["change_percent"] + '%)</span></td>' +
            '</tr>';
        $(".price-changes tbody").append(html)
    }
}

$('.price-changes-bar a').on('click', function () {
    $('.price-changes-bar a').removeClass('active');
    $(this).addClass('active');

    change_prices($(this).attr("data-in-last"));
});

let url = new URL(window.location);
if (url.pathname == '/visje-cene/' || url.pathname == '/nizje-cene/') {
    let in_last = url.href.split("#");
    if (in_last.length > 1) {
        let tmp = in_last[1].replace("zadnjih-", "");
        tmp = tmp.replace("dneh", "days");
        if (tmp == "zadnje-leto") tmp = "year";

        $('.price-changes-bar a').removeClass('active');
        $('.price-changes-bar a').each(function () {
           if ($(this).attr("data-in-last") == tmp) {
               $(this).addClass("active");
               return;
           }
        });

        change_prices(tmp);
    } else {
        change_prices("7-days");
    }
}