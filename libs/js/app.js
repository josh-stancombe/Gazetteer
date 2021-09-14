// Global Variables
let countryNames = [];
let countryISO = [];
let listHTML, currentLat, currentLng, currentCountry, userCountryName, userCountry;

// Setup the map
let mymap = L.map('mapid', 3)

var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; National Geographic. Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> and <a href="https://smashicons.com/" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>', maxZoom: 12}).addTo(mymap);


// -------------------------------- Country Object Definition --------------------------------

function Country(name, iso_a2, iso_a3, iso_n3, geoType, coordinates){
    this.name = name;
    this.iso_a2 = iso_a2;
    this.iso_a3 = iso_a3;
    this.iso_n3 = iso_n3;
    this.coordinates = coordinates;
    this.geoType = geoType;
    this.lat;
    this.lng;
    
    // Modal 1 - Country Info
    this.flag;
    this.capitalCity;
    this.timezone;
    this.timeOffset;
    this.population;
    this.area;
    this.languages;
    this.currencyCode;
    this.currencyName;
    this.currencySymbol;
    this.exchangeRate;
    this.topLevelDomain;
    this.callingCode;
    
    // Modal 2 - Weather - ([Temp] [FeelsLike] [Weather] [WeatherIcon])
    this.weather_current = [];
    this.weather_tomorrow = []; 
    this.weather_2days = []; 
    this.weather_3days = []; 
    this.weather_4days = []; 
    
    // Modal 3 - COVID-19 Stats - ([Cases] [Deaths] [Recovered])
    this.covid_total = [];
    this.covid_latest = [];
    this.covid_3MonthsAgo = [];
    this.covid_6MonthsAgo = [];
    
    // Modal 4 - News Articles - ([Image] [Title] [URL] [Source] [Published])
    this.news_article1 = [];
    this.news_article2 = [];
    this.news_article3 = [];

    // Map Markers
    this.marker_capital = [];
    this.marker_cities = [];
    this.marker_mountains = [];
    this.marker_airports = [];
    this.marker_museums = [];
    this.marker_universities = [];
    this.marker_hospitals = [];
    this.marker_ferries = [];
}

// Main AJAX & jQuery Code
$(document).ready(() => {

    // Get the country information
    $.ajax({
        type: 'GET',
        url: "libs/js/json/countryBorders.json",
        data: {},
        dataType: 'json',
        success: function(data) {

            // ---------------- Generate Country Objects ----------------
            const results = data["features"]      
            for(let i=0; i < results.length; i++){
                
                let name = results[i]['properties']['name'];
                let iso_a2 = results[i]['properties']['iso_a2'];
                let iso_a3 = results[i]['properties']['iso_a3'];
                let iso_n3 = results[i]['properties']['iso_n3'];
                let geoType = results[i]['geometry']['type'];
                let coordinates = results[i]['geometry']['coordinates'];;

                countryNames.push([name, iso_a2]);

                noSpaceName = name.replace(/\s+/g, '');
                window[noSpaceName] = new Country(name, iso_a2, iso_a3, iso_n3, geoType, coordinates)
                findAvgLatLng(window[noSpaceName]);

            }
            
            // ---------------- Generate The Country List ----------------
            listHTML += `<option value="Select..." selected>Select...</option>`;
            countryNames.sort();
            for(i=0; i < countryNames.length; i++){
                    listHTML += `<option value="${countryNames[i][1]}">${countryNames[i][0]}</option>`
            }
            $('#country').html(listHTML);

        
            // ---------------- Find The Users Location And Set Map ----------------
           
            function geoSuccess(position) {
                currentLat = position.coords.latitude;
                currentLng = position.coords.longitude;
                getCurrentCountry(currentLat, currentLng);

                // ---------------- Welcome Alert Message ----------------
                setTimeout(function(){    
                    Swal.fire({
                        title: 'Welcome to Gazetteer!',
                        html: `<br>Select a country from the list and click any of the map icons to get started. <br><br>
                        
                        <i>We see that you are visiting us from <b>${currentCountry.name}</b>. We've left the map here for you...</i>`,
                        confirmButtonText: 'OK',
                        background: '#D3D3D3'
                    })

                }, 3000); 
            }
              
            function geoError(err) { 
                
                Swal.fire({
                    title: 'Welcome to Gazetteer!',
                    html: `<br>Select a country from the list and click any of the map icons to get started. <br><br>
                    <i>Unfortunately your location could not be determined... Defaulting your location to <b>United Kingdom</b>.</i>`,
                    confirmButtonText: 'OK',
                    background: '#D3D3D3'
                });

                getCurrentCountry(54,-2);

            }
              
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

        }
        
    });


    // ---------------- Behaviour for New County Selection ----------------
    $('#country').change(() => {
        
        //Reset the map markers!
        currentCountry.marker_capital = [];
        currentCountry.marker_cities = [];
        currentCountry.marker_mountains = [];
        currentCountry.marker_airports = [];
        currentCountry.marker_museums = [];
        currentCountry.marker_universities = [];
        currentCountry.marker_hospitals = [];
        currentCountry.marker_ferries = [];

        var e = document.getElementById("country");
        var value = e.options[e.selectedIndex].value;// get selected option value
        var selectedCountry = e.options[e.selectedIndex].text;

        var countryNoSpaces = selectedCountry.replace(/\s+/g, '');
        currentCountry = window[countryNoSpaces];

        updateMap(currentCountry.geoType, currentCountry.coordinates, true);

        getAllInfo(currentCountry)

        setTimeout(function(){    
            $('#capital').click();
            $('#cities').click();
        }, 2000); 


    })

});

// -------------------------------- Get Country Info --------------------------------
function getAllInfo(country){

    // Country Info
    getCountryInfo(country);

    // Get Exchange Rate
    getExchangeRate(country);

    // Weather
    getWeatherInfo(country);

    // Timezone
    getTimezone(country);

    // REST Countries
    getRESTCountryInfo(country);

    // COVID-19 Tracker
    getCovidInfo(country);

    // Top Country News
    getNews(country);

    // Map Markers
    getMapMarkers(country);

}

// -------------------------------- Get User Current Country Info From GeoNames --------------------------------

// Geonames API username
async function getCurrentCountry(lat,lng){

    // API Call to GeoNames to get users country info
    await $.ajax({
        url: "libs/php/getCurrentCountry.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng,
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

    $('#country').val(currentCountry.iso_a2).change();


    // ---------------- Stop the PreLoader ----------------
    $('#preloader').fadeOut(function(){
        $(this).remove();
    });
    
}

// -------------------------------- Get Country Info from GeoNames --------------------------------
    
function getCountryInfo(country){

    $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
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

// -------------------------------- Get Exchange Rate from Open Exchange Rate  --------------------------------
    
function getExchangeRate(country){
    $.ajax({
        url: "libs/php/getExchangeRate.php",
        type: 'GET',
        dataType: 'json',
        data: {},
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

// -------------------------------- Get Weather Info From OpenWeather  --------------------------------
    
function getWeatherInfo(country){
    $.ajax({
        url: "libs/php/getWeather.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: country.lat,
            lng: country.lng,
        },
        success: function(result) {
                        
            if (result.status.name == "ok") {

                country.weather_current.push(result['data']['current']['temp'] - 273.15,result['data']['current']['feels_like'] - 273.15,result['data']['current']['weather']['0']['main'],result['data']['current']['weather']['0']['icon']);

                country.weather_tomorrow.push(result['data']['daily']['0']['temp']['day'] - 273.15, result['data']['daily']['0']['feels_like']['day'] - 273.15,result['data']['daily']['0']['weather']['0']['main'],result['data']['daily']['0']['weather']['0']['icon']);

                country.weather_2days.push(result['data']['daily']['1']['temp']['day'] - 273.15, result['data']['daily']['1']['feels_like']['day'] - 273.15,result['data']['daily']['1']['weather']['0']['main'],result['data']['daily']['1']['weather']['0']['icon']);

                country.weather_3days.push(result['data']['daily']['2']['temp']['day'] - 273.15, result['data']['daily']['2']['feels_like']['day'] - 273.15,result['data']['daily']['2']['weather']['0']['main'],result['data']['daily']['2']['weather']['0']['icon']);

                country.weather_4days.push(result['data']['daily']['3']['temp']['day'] - 273.15, result['data']['daily']['3']['feels_like']['day'] - 273.15,result['data']['daily']['3']['weather']['0']['main'],result['data']['daily']['3']['weather']['0']['icon']);

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 
}

// -------------------------------- Get Timezone from GeoNames --------------------------------
    
function getTimezone(country){

    $.ajax({
        url: "libs/php/getTimezone.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: country.lat,
            lng: country.lng,
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

// -------------------------------- Get News From NewsAPI  --------------------------------
    
function getNews(country){
    $.ajax({
        url: "libs/php/getNews.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
        },
        success: function(result) {
                        
            if (result.status.name == "ok") {

                // Modal 4 - News Articles - ([Image] [Title] [URL] [Source] [Published])
                country.news_article1.push(result['data']['articles']['0']['urlToImage'], result['data']['articles']['0']['title'], result['data']['articles']['0']['url'], result['data']['articles']['0']['source']['name'], result['data']['articles']['0']['publishedAt']);

                country.news_article2.push(result['data']['articles']['1']['urlToImage'], result['data']['articles']['1']['title'], result['data']['articles']['1']['url'], result['data']['articles']['1']['source']['name'], result['data']['articles']['1']['publishedAt']);
                
                country.news_article3.push(result['data']['articles']['2']['urlToImage'], result['data']['articles']['2']['title'], result['data']['articles']['2']['url'], result['data']['articles']['2']['source']['name'], result['data']['articles']['2']['publishedAt'])

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 
}

// -------------------------------- Get Map Markers from GeoNames --------------------------------
    
function getMapMarkers(country){

    // -------------------------------- Capital City Information --------------------------------
    $.ajax({
        url: "libs/php/mapMarkers/getMapCapital.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
        },
        success: function(result) {
          
            if (result.status.name == "ok") {                
                country.marker_capital = [result['data']['geonames']['0']['name'],result['data']['geonames']['0']['population'],result['data']['geonames']['0']['lat'],result['data']['geonames']['0']['lng']];
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 

    // -------------------------------- Additional 25 Cities --------------------------------
    $.ajax({
        url: "libs/php/mapMarkers/getMapCities.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
        },
        success: function(result) {
          
            if (result.status.name == "ok") {                
                
                for(let i=0; i < result['data']['geonames'].length; i++){
                
                    country.marker_cities.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['population'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
                }
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 

    // -------------------------------- Mountains / Mountain Ranges --------------------------------
    $.ajax({
        url: "libs/php/mapMarkers/getMapMountains.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
        },
        success: function(result) {
          
            if (result.status.name == "ok") {                
                
                for(let i=0; i < result['data']['geonames'].length; i++){
                
                    country.marker_mountains.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
                }
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 

    
    // -------------------------------- Airports --------------------------------
    $.ajax({
        url: "libs/php/mapMarkers/getMapAirports.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
        },
        success: function(result) {
          
            if (result.status.name == "ok") {                
                
                for(let i=0; i < result['data']['geonames'].length; i++){
                
                    country.marker_airports.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
                }
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 


    // -------------------------------- Museums --------------------------------
    $.ajax({
        url: "libs/php/mapMarkers/getMapMuseums.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
        },
        success: function(result) {
        
            if (result.status.name == "ok") {                
                
                for(let i=0; i < result['data']['geonames'].length; i++){
                
                    country.marker_museums.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
                }
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 

    // -------------------------------- Universities --------------------------------
    $.ajax({
        url: "libs/php/mapMarkers/getMapUniversities.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
        },
        success: function(result) {
        
            if (result.status.name == "ok") {                
                
                for(let i=0; i < result['data']['geonames'].length; i++){
                
                    country.marker_universities.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
                }
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 

    // -------------------------------- Ferries --------------------------------
    $.ajax({
        url: "libs/php/mapMarkers/getMapFerries.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
        },
        success: function(result) {
        
            if (result.status.name == "ok") {                
                
                for(let i=0; i < result['data']['geonames'].length; i++){
                
                    country.marker_ferries.push([result['data']['geonames'][i]['name'],result['data']['geonames'][i]['lat'],result['data']['geonames'][i]['lng']]);
                }
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 

};

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

// -------------------------------- Button 1 - Country Information --------------------------------

L.easyButton({
    position: 'topleft',
    id: 'countryBtn',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Country Information',
        onClick: function(btn,map) {

            $("#countryInfoModal").modal("show");

            $(".close").click(function(){
                $("#countryInfoModal").modal('hide');
            });

            document.getElementById('Modal1Title').innerHTML = `${currentCountry.name} Information`
            document.getElementById('countryFlag').src = currentCountry.flag;
            document.getElementById('countryInfoName').innerHTML = currentCountry.name;
            document.getElementById('countryInfoCapital').innerHTML = currentCountry.capitalCity;
            document.getElementById('countryInfoTimezone').innerHTML = currentCountry.timezone;
            document.getElementById('countryInfoOffset').innerHTML = currentCountry.timeOffset;
            document.getElementById('countryInfoPopulation').innerHTML = `${(currentCountry.population / 1000000).toFixed(1)} M`;
            document.getElementById('countryInfoArea').innerHTML = `${Math.floor(currentCountry.area)}`;
            document.getElementById('countryInfoLanguage').innerHTML = currentCountry.languages;
            document.getElementById('countryInfoCurrencyCode').innerHTML = `${currentCountry.currencyCode} (${currentCountry.currencySymbol})`;
            document.getElementById('countryInfoCurrencyName').innerHTML = currentCountry.currencyName;
            document.getElementById('countryInfoExchange').innerHTML = `${(currentCountry.exchangeRate).toFixed(2)}`;
            document.getElementById('countryInfoTLD').innerHTML = currentCountry.topLevelDomain;
            document.getElementById('countryInfoCalling').innerHTML = `+${currentCountry.callingCode}`;

        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);

// -------------------------------- Button 2 - Weather --------------------------------

L.easyButton({

    id: 'weatherBtn',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Weather Forecast',
        onClick: function(btn,map) {
            
            // Calculate the upcoming days
            const d = new Date();
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var twoDays = d.getDay() + 2;
            var threeDays = d.getDay() + 3;

            if(twoDays > 6){
                twoDays -=7;
            } 
            if (threeDays > 6){
                threeDays -= 7;
            }

            twoDays = days[twoDays], 
            threeDays = days[threeDays];

            $("#weatherModal").modal("show");

            $(".close").click(function(){
                $("#weatherModal").modal('hide');
            });

            document.getElementById('Modal2Title').innerHTML = `Weather Forecast for ${currentCountry.name}`
            document.getElementById('currentIcon').src = `http://openweathermap.org/img/w/${currentCountry.weather_current[3]}.png`
            document.getElementById('currentTemp').innerHTML = `${Math.floor(currentCountry.weather_current[0])}°C`;
            document.getElementById('currentFeelsLike').innerHTML = `${Math.floor(currentCountry.weather_current[1])}°C`;
            document.getElementById('currentConditions').innerHTML = currentCountry.weather_current[2];
            document.getElementById('tomorrowIcon').src = `http://openweathermap.org/img/w/${currentCountry.weather_tomorrow[3]}.png`
            document.getElementById('tomorrowTemp').innerHTML = `${Math.floor(currentCountry.weather_tomorrow[0])}°C`;
            document.getElementById('tomorrowFeelsLike').innerHTML = `${Math.floor(currentCountry.weather_tomorrow[1])}°C`;
            document.getElementById('tomorrowConditions').innerHTML = currentCountry.weather_tomorrow[2];
            document.getElementById('2DayName').innerHTML = twoDays;
            document.getElementById('2dayIcon').src = `http://openweathermap.org/img/w/${currentCountry.weather_2days[3]}.png`
            document.getElementById('2dayTemp').innerHTML = `${Math.floor(currentCountry.weather_2days[0])}°C`;
            document.getElementById('2dayFeelsLike').innerHTML = `${Math.floor(currentCountry.weather_2days[1])}°C`;
            document.getElementById('2dayConditions').innerHTML = currentCountry.weather_2days[2];
            document.getElementById('3DayName').innerHTML = threeDays;
            document.getElementById('3dayIcon').src = `http://openweathermap.org/img/w/${currentCountry.weather_3days[3]}.png`
            document.getElementById('3dayTemp').innerHTML = `${Math.floor(currentCountry.weather_3days[0])}°C`;
            document.getElementById('3dayFeelsLike').innerHTML = `${Math.floor(currentCountry.weather_3days[1])}°C`;
            document.getElementById('3dayConditions').innerHTML = currentCountry.weather_3days[2];
        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]


}).addTo(mymap);


// -------------------------------- Button 3 - Coronavirus Tracker --------------------------------

L.easyButton({

    id: 'covidBtn',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show COVID-19 Country Statistics',
        onClick: function(btn,map) {

            $("#covidModal").modal("show");

            $(".close").click(function(){
                $("#covidModal").modal('hide');
            });

            document.getElementById('Modal3Title').innerHTML = `COVID-19 Statistics for ${currentCountry.name}`;
            document.getElementById('totalCases').innerHTML = currentCountry.covid_total[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('totalDeaths').innerHTML = currentCountry.covid_total[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('totalRecovered').innerHTML = currentCountry.covid_total[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('newCases').innerHTML = currentCountry.covid_latest[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('newDeaths').innerHTML = currentCountry.covid_latest[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('newRecovered').innerHTML = currentCountry.covid_latest[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('3mCases').innerHTML = currentCountry.covid_3MonthsAgo[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('3mDeaths').innerHTML = currentCountry.covid_3MonthsAgo[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('3mRecovered').innerHTML = currentCountry.covid_3MonthsAgo[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('6mCases').innerHTML = currentCountry.covid_6MonthsAgo[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('6mDeaths').innerHTML = currentCountry.covid_6MonthsAgo[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            document.getElementById('6mRecovered').innerHTML = currentCountry.covid_6MonthsAgo[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]


}).addTo(mymap);



// -------------------------------- Button 4 - Country News --------------------------------

L.easyButton({

    id: 'newsBtn',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Top Country News',
        onClick: function(btn,map) {
            if(currentCountry.news_article1[0]){

                $("#newsModal").modal("show");

                $(".close").click(function(){
                    $("#newsModal").modal('hide');
                });
                
                document.getElementById('Modal4Title').innerHTML = `Latest Top News Stories for ${currentCountry.name}`;
                document.getElementById('article1Link').href = currentCountry.news_article1[2];
                document.getElementById('article1Img').src = currentCountry.news_article1[0];
                document.getElementById('article1Title').innerHTML = currentCountry.news_article1[1];
                document.getElementById('article1Source').innerHTML = `<em>Source: ${currentCountry.news_article2[3]}</em>`;
                document.getElementById('article2Link').href = currentCountry.news_article2[2];
                document.getElementById('article2Img').src = currentCountry.news_article2[0];
                document.getElementById('article2Title').innerHTML = currentCountry.news_article2[1];
                document.getElementById('article2Source').innerHTML = `<em>Source: ${currentCountry.news_article2[3]}</em>`;
                document.getElementById('article3Link').href = currentCountry.news_article3[2];
                document.getElementById('article3Img').src = currentCountry.news_article3[0];
                document.getElementById('article3Title').innerHTML = currentCountry.news_article3[1];
                document.getElementById('article3Source').innerHTML = `<em>Source: ${currentCountry.news_article3[3]}</em>`;

            } else {
                $("#newsError").modal("show");

                $(".close").click(function(){
                    $("#newsError").modal('hide');
                });

                document.getElementById('errorCountry').innerHTML = currentCountry.name;               

            }
        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]


}).addTo(mymap);

var markerClusters = L.markerClusterGroup();

var MapIcon = L.Icon.extend({
    options: {
        iconSize:     [30, 30],
        popupAnchor:  [0, -20]
    }
});


// -------------------------------- 1. Capital City --------------------------------

function capitalDisable(){
    capitalBtn.disable();
}

var capitalBtn = L.easyButton({
    position: 'topright',
    id: 'capital',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Capital City',
        onClick: function(btn,map) {            

            var countryCapitalIcon = L.Icon.extend({
                options: {
                    iconSize:     [45, 45],
                    popupAnchor:  [0, -20]
                }
            });
        
            var capitalIcon = new countryCapitalIcon({iconUrl: 'libs/icons/capital.png'});

            var m = L.marker(new L.LatLng(currentCountry.marker_capital[2], currentCountry.marker_capital[3]), {icon: capitalIcon}).bindPopup(`
            <b>Capital City: </b> ${currentCountry.marker_capital[0]} <br>
            <b>Population: </b> ${(currentCountry.marker_capital[1] / 1000000).toFixed(1)} M
            `);
            markerClusters.addLayer( m );
        
            mymap.addLayer(markerClusters);

            capitalDisable();

        }
    }, {
        icon: "none",
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);



// -------------------------------- 2. Cities --------------------------------

function cityDisable(){
    cityBtn.disable();
}

var cityBtn = L.easyButton({
    position: 'topright',
    id: 'cities',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Top 25 Cities',
        onClick: function(btn,map) {

            var cityIcon = new MapIcon({iconUrl: 'libs/icons/place.png'});

                for(i=0;i<currentCountry.marker_cities.length;i++){
                    
                    var m = L.marker(new L.LatLng(currentCountry.marker_cities[i][2], currentCountry.marker_cities[i][3]), {icon: cityIcon}).bindPopup(`
                        <b>City:</b> ${currentCountry.marker_cities[i][0]} <br> 
                        <b>Population: </b> ${currentCountry.marker_cities[i][1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
                    `);
                    markerClusters.addLayer( m );
                    
                }

            mymap.addLayer(markerClusters);

            cityDisable();
        }
    }, {
        icon: "none",
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);


// -------------------------------- 3. Mountains --------------------------------

function mountainsDisable(){
    mountainsBtn.disable();
}

var mountainsBtn = L.easyButton({
    position: 'topright',
    id: 'mountains',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Mountains',
        onClick: function(btn,map) {
                   
            var mountainIcon = new MapIcon({iconUrl: 'libs/icons/mountain.png'});

            for(i=0;i<currentCountry.marker_mountains.length;i++){
                
                var m = L.marker(new L.LatLng(currentCountry.marker_mountains[i][1], currentCountry.marker_mountains[i][2]), {icon: mountainIcon}).bindPopup(`${currentCountry.marker_mountains[i][0]}`);
                markerClusters.addLayer( m );
        
            }
        
            mymap.addLayer(markerClusters);

            mountainsDisable();

        }
    }, {
        icon: "none",
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);



// -------------------------------- 4. Airports --------------------------------

function airportsDisable(){
    airportsBtn.disable();
}

var airportsBtn = L.easyButton({
    position: 'topright',
    id: 'airports',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Airports',
        onClick: function(btn,map) {

            var airportIcon = new MapIcon({iconUrl: 'libs/icons/airport.png'});

            for(i=0;i<currentCountry.marker_airports.length;i++){
                
                var m = L.marker(new L.LatLng(currentCountry.marker_airports[i][1], currentCountry.marker_airports[i][2]), {icon: airportIcon}).bindPopup(`${currentCountry.marker_airports[i][0]}`);
                markerClusters.addLayer( m );
                
            }
        
            mymap.addLayer(markerClusters);
            
            airportsDisable();

        }
    }, {
        icon: "none",
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);


// -------------------------------- 5. Museums --------------------------------

function museumsDisable(){
    museumsBtn.disable();
}

var museumsBtn = L.easyButton({
    position: 'topright',
    id: 'museums',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Museums',
        onClick: function(btn,map) {
                   
            var museumIcon = new MapIcon({iconUrl: 'libs/icons/museum.png'});

            for(i=0;i<currentCountry.marker_museums.length;i++){
                
                var m = L.marker(new L.LatLng(currentCountry.marker_museums[i][1], currentCountry.marker_museums[i][2]), {icon: museumIcon}).bindPopup(`${currentCountry.marker_museums[i][0]}`);
                markerClusters.addLayer( m );
                
            }
        
            mymap.addLayer(markerClusters);

            museumsDisable();

        }
    }, {
        icon: "none",
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);


// -------------------------------- 6. Universities --------------------------------

function universitiesDisable(){
    universitiesBtn.disable();
}

var universitiesBtn = L.easyButton({
    position: 'topright',
    id: 'universities',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Universities',
        onClick: function(btn,map) {
                   
            var uniIcon = new MapIcon({iconUrl: 'libs/icons/uni.png'});

            for(i=0;i<currentCountry.marker_universities.length;i++){
        
                var m = L.marker(new L.LatLng(currentCountry.marker_universities[i][1], currentCountry.marker_universities[i][2]), {icon: uniIcon}).bindPopup(`${currentCountry.marker_universities[i][0]}`);
                markerClusters.addLayer( m );
            }
        
            mymap.addLayer(markerClusters);

            universitiesDisable();

        }
    }, {
        icon: "none",
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);



// -------------------------------- 7. Ferries --------------------------------

function ferriesDisable(){
    ferriesBtn.disable();
}

var ferriesBtn = L.easyButton({
    position: 'topright',
    id: 'ferry',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Ferry Ports',
        onClick: function(btn,map) {
                   
            var ferryIcon = new MapIcon({iconUrl: 'libs/icons/ship.png'});  
        
            for(i=0;i<currentCountry.marker_ferries.length;i++){
                
                ferryMarkers = L.marker(new L.LatLng(currentCountry.marker_ferries[i][1], currentCountry.marker_ferries[i][2]), {icon: ferryIcon}).bindPopup(`${currentCountry.marker_ferries[i][0]}`)
                markerClusters.addLayer(ferryMarkers);
                
            }
        
            mymap.addLayer(markerClusters);

            ferriesDisable();

        }
    }, {
        icon: "none",
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);


// -------------------------------- 8. Reset Button --------------------------------
L.easyButton({
    position: 'topright',
    id: 'reset',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Reset Icons',
        onClick: function(btn,map) {
            
            updateMap(currentCountry.geoType, currentCountry.coordinates, true);      
        
        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]


}).addTo(mymap);


// -------------------------------- Update Country Border --------------------------------
function updateMap(type, coordinates, borderChange){

    capitalBtn.enable();
    cityBtn.enable();
    mountainsBtn.enable();
    airportsBtn.enable();
    museumsBtn.enable();
    universitiesBtn.enable();
    ferriesBtn.enable();

    markerClusters = L.markerClusterGroup();
    
    mymap.eachLayer(function (layer) {
        if(layer != Esri_NatGeoWorldMap){
            mymap.removeLayer(layer);
        }
    });

    border = new L.geoJSON({
        "type": type,
        "coordinates": coordinates
    },{
        style: {
            color: "brown"
        }
    }).addTo(mymap);

    mymap.fitBounds(border.getBounds());
}