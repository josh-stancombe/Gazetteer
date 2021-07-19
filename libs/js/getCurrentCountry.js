// -------------------------------- Get User Current Country Info From GeoNames --------------------------------

// Geonames API username
let currentCountryUsername = 'API KEY HERE';


async function getCurrentCountry(lat,lng){

    // API Call to GeoNames to get users country info
    await $.ajax({
        url: "libs/php/getCurrentCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng,
            user: currentCountryUsername
        },
        success: function(result) {

            //console.log(JSON.stringify(result));

            if (result.status.name == "ok") {
                userCountryName = result['data']['countryName'];
                var userCountrySpaces = userCountryName 
                var userCountryNoSpaces = userCountrySpaces.replace(/\s+/g, '');
                currentCountry = window[userCountryNoSpaces];
                
            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 

    updateMap(currentCountry.geoType, currentCountry.coordinates, false); 

    getAllInfo(currentCountry);
   
    // ---------------- Stop the PreLoader ----------------
    $('#preloader').fadeOut(function(){
        $(this).remove();
    });
    
}