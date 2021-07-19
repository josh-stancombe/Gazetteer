// -------------------------------- Get Timezone from GeoNames --------------------------------
    
let timezoneUsername = 'API KEY HERE'

function getTimezone(country){

    $.ajax({
        url: "libs/php/getTimezone.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: country.lat,
            lng: country.lng,
            user: timezoneUsername
        },
        success: function(result) {

            if (result.status.name == "ok") {
                country.timezone = result['data']['timezoneId'];
                country.timeOffset = result['data']['dstOffset'];
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 
};