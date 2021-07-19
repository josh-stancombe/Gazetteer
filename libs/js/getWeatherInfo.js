// -------------------------------- Get Weather Info From OpenWeather  --------------------------------
    
let weatherUsername = 'API KEY HERE'
function getWeatherInfo(country){
    $.ajax({
        url: "libs/php/getWeather.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: country.lat,
            lng: country.lng,
            user: weatherUsername
        },
        success: function(result) {
                        
            if (result.status.name == "ok") {

                country.weather_current.push(result['data']['current']['temp'],result['data']['current']['feels_like'],result['data']['current']['weather']['0']['main'],result['data']['current']['weather']['0']['icon']);

                country.weather_tomorrow.push(result['data']['daily']['0']['temp']['day'], result['data']['daily']['0']['feels_like']['day'],result['data']['daily']['0']['weather']['0']['main'],result['data']['daily']['0']['weather']['0']['icon']);

                country.weather_2days.push(result['data']['daily']['1']['temp']['day'], result['data']['daily']['1']['feels_like']['day'],result['data']['daily']['1']['weather']['0']['main'],result['data']['daily']['1']['weather']['0']['icon']);

                country.weather_3days.push(result['data']['daily']['2']['temp']['day'], result['data']['daily']['2']['feels_like']['day'],result['data']['daily']['2']['weather']['0']['main'],result['data']['daily']['2']['weather']['0']['icon']);

                country.weather_4days.push(result['data']['daily']['3']['temp']['day'], result['data']['daily']['3']['feels_like']['day'],result['data']['daily']['3']['weather']['0']['main'],result['data']['daily']['3']['weather']['0']['icon']);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 
}