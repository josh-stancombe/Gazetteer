
// -------------------------------- Add Country average lat and long values --------------------------------
function findAvgLatLng(country){

    // Call to JSON file
    $.ajax({
        type: 'GET',
        url: "libs/js/json/countryInfo.json",
        data: {},
        dataType: 'json',
        success: function(data) {

            let alpha2 = country.iso_a2;

            for(let i=0; i < data.length; i++){
                
                let jsonalpha2 = data[i]['Alpha-2 code'];
                let latAvg = data[i]['Latitude'];
                let lngAvg = data[i]['Longitude'];

                if (alpha2 == jsonalpha2){
                    country.lat = latAvg; 
                    country.lng = lngAvg;
                } 
            }
        }
    })
};