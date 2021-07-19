// Global Variables
let countryNames = [];
let listHTML, currentLat, currentLng, currentCountry, userCountryName, userCountry;

// Setup the map
let mymap = L.map('mapid', 3)
//let Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'}).addTo(mymap);

var Esri_NatGeoWorldMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; National Geographic. Icons made by <a href="https://www.freepik.com" title="Freepik">Freepik</a> and <a href="https://smashicons.com/" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>', maxZoom: 12}).addTo(mymap);


// AJAX & jQuery Code
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

                countryNames.push(name);

                noSpaceName = name.replace(/\s+/g, '');
                window[noSpaceName] = new Country(name, iso_a2, iso_a3, iso_n3, geoType, coordinates)
                findAvgLatLng(window[noSpaceName]);

            }
            
            // ---------------- Generate The Country List ----------------
            listHTML += `<option value="Select..." selected>Select...</option>`;
            countryNames.sort();
            for(i=0; i < countryNames.length; i++){
                    listHTML += `<option value="${countryNames[i]}">${countryNames[i]}</option>`
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

                }, 2000); 
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
        
        var selectedCountry = $(`#country`).val();
        var countryNoSpaces = selectedCountry.replace(/\s+/g, '');
        currentCountry = window[countryNoSpaces];

        updateMap(currentCountry.geoType, currentCountry.coordinates, true);

        getAllInfo(currentCountry);
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
