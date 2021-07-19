// -------------------------------- Get Country Info from GeoNames --------------------------------
    
let countryUsername = 'API KEY HERE'

function getCountryInfo(country){

    $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
            user: countryUsername
        },
        success: function(result) {

            if (result.status.name == "ok") {
                
                country.area = result['data']['geonames']['0']['areaInSqKm'];
                country.capitalCity = result['data']['geonames']['0']['capital'];
                country.continent = result['data']['geonames']['0']['continentName'];
                country.currencyCode = result['data']['geonames']['0']['currencyCode'];
                country.languages = result['data']['geonames']['0']['languages'];
                country.population = result['data']['geonames']['0']['population'];  
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 
};