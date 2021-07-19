// -------------------------------- Get REST Country Info  --------------------------------
    
function getRESTCountryInfo(country){

    $.ajax({
        url: "libs/php/getRESTCountryInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            alpha3: country.iso_a3,
        },
        success: function(result) {

            if (result.status.name == "ok") {
                country.flag = result['data']['flag'];
                country.languages = result['data']['languages']['0']['name'];
                country.currencyCode = result['data']['currencies']['0']['code'];
                country.currencyName = result['data']['currencies']['0']['name'];
                country.currencySymbol = result['data']['currencies']['0']['symbol'];
                country.topLevelDomain = result['data']['topLevelDomain']['0'];
                country.callingCode = result['data']['callingCodes'];
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 
};