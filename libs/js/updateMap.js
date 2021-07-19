// -------------------------------- Update Country Border --------------------------------
function updateMap(type, coordinates, borderChange){
       
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