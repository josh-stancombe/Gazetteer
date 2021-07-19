var markerClusters = L.markerClusterGroup();

var MapIcon = L.Icon.extend({
    options: {
        iconSize:     [30, 30],
        popupAnchor:  [0, -20]
    }
});

// -------------------------------- 1. Capital City --------------------------------

L.easyButton({
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
            <b>Population: </b> ${currentCountry.marker_capital[1]}
            `);
            markerClusters.addLayer( m );
        
            mymap.addLayer(markerClusters);

        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);



// -------------------------------- 2. Cities --------------------------------

L.easyButton({
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
                    <b>Population: </b> ${currentCountry.marker_cities[i][1]} 
                `);
                markerClusters.addLayer( m );
                
            }
        
            mymap.addLayer(markerClusters);

        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);


// -------------------------------- 3. Mountains --------------------------------

L.easyButton({
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

        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);



// -------------------------------- 4. Airports --------------------------------

L.easyButton({
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

        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);


// -------------------------------- 5. Museums --------------------------------

L.easyButton({
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

        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);


// -------------------------------- 6. Universities --------------------------------

L.easyButton({
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

        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);



// -------------------------------- 7. Ferries --------------------------------

L.easyButton({
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

        }
    }, {
        icon: '&#x238C;',
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