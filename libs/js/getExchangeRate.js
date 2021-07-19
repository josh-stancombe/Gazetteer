// -------------------------------- Get Exchange Rate from Open Exchange Rate  --------------------------------
    
let exchangeUsername = 'API KEY HERE'

function getExchangeRate(country){
    $.ajax({
        url: "libs/php/getExchangeRate.php",
        type: 'GET',
        dataType: 'json',
        data: {
            user: exchangeUsername
        },
        success: function(result) {

            if (result.status.name == "ok") {
                country.exchangeRate = result['data']['rates'][country.currencyCode];
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 
}