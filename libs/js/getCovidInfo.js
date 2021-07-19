// -------------------------------- Get Coronavirus Info From corona-api.com --------------------------------

function getCovidInfo(country){

    $.ajax({
        url: "libs/php/getCovidInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            code: country.iso_a2,
        },
        success: function(result) {

            if (result.status.name == "ok") {

                country.covid_total.push(result['data']['data']['latest_data']['confirmed'],result['data']['data']['latest_data']['deaths'],result['data']['data']['latest_data']['recovered']);
                
                country.covid_latest.push(result['data']['data']['timeline']['0']['new_confirmed'],result['data']['data']['timeline']['0']['new_deaths'],result['data']['data']['timeline']['0']['new_recovered']);

                country.covid_3MonthsAgo.push(result['data']['data']['timeline']['90']['confirmed'],result['data']['data']['timeline']['90']['deaths'],result['data']['data']['timeline']['90']['recovered']);

                country.covid_6MonthsAgo.push(result['data']['data']['timeline']['180']['confirmed'],result['data']['data']['timeline']['180']['deaths'],result['data']['data']['timeline']['180']['recovered']);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    });
} 
