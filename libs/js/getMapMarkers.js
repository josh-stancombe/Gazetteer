// -------------------------------- Get Map Markers from GeoNames --------------------------------
    
let mapMarkerUsername = 'API KEY HERE'

function getMapMarkers(country){

    // -------------------------------- Capital City Information --------------------------------
    $.ajax({
        url: "libs/php/mapMarkers/getMapCapital.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
            user: mapMarkerUsername
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
            user: mapMarkerUsername
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
            user: mapMarkerUsername
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
            user: mapMarkerUsername
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
            user: mapMarkerUsername
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
            user: mapMarkerUsername
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
            user: mapMarkerUsername
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