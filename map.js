var CENTER = [17.51171875, -7.1546875];
var COLORS = {
    1: '#ff6e59',
    2: '#ffb287',
    3: '#ffda76',
    4: '#76c8ff',
    5: '#76aeff',
    6: '#7695ff',
    7: '#5fbd58',
    8: '#59f72f',
    9: '#8eff70'
};

var minValue = 1;

var closestFeat = null;

var map = L.map('map').setView(CENTER, 7);


// https://stackoverflow.com/a/41337005
var P = 0.017453292519943295;
function distance(lat1, lon1, lat2, lon2) {
    a = 0.5 - Math.cos((lat2-lat1)*P)/2 + Math.cos(lat1*P)*Math.cos(lat2*P) * (1-Math.cos((lon2-lon1)*P)) / 2;
    return 12742 * Math.asin(Math.sqrt(a))
}


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGF2aWRlc2N1IiwiYSI6ImNqbmh1dDJ1ZjBnbDQzd3RsZnZoaGtnYm0ifQ.4Tjqx1sfNRtoixMPMr1Egg', {
    maxZoom: 17,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);


function onEachFeature(feature, layer) {
    var popupContent = "<p>Lat:"+feature.geometry.coordinates[1]+" , Lng:"+feature.geometry.coordinates[0]+" </p><p>Water present for " +
            feature.properties.value + " years!</p>";

    layer.bindPopup(popupContent);
}


var lDataset = L.geoJSON(Dataset, {

    onEachFeature: onEachFeature,

    filter: function (feature, layer) {
        
        var featLatLng = { lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] };
        var closest = closestFeat ? closestFeat.lat === featLatLng.lat && featLatLng.lng === closestFeat.lng : true;
       
        var filterValue = feature.properties.value >= minValue;
        var filterDistance = closest;
        
        return filterValue && filterDistance;

    },
    
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 8,
            fillColor: COLORS[feature.properties.value],
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    }
});
lDataset.addTo(map);

var elValue = document.querySelector('#value');

var cursor = null;

elValue.addEventListener('change', function(evt){
    minValue = parseInt(evt.target.value, 10);
    redraw();
});


function redraw() {
    lDataset.clearLayers();
    lDataset.addData(Dataset);
}


map.on('click', function(evt){
    var latLng = evt.latlng;
    var lat = latLng.lat;
    var lng = latLng.lng;
    console.log(latLng);
    
    if (cursor != null) {
        map.removeLayer(cursor);
        cursor = null;
        closestFeat = null;
    }
    else {
        cursor = L.circleMarker(latLng, {
            radius: 8,
            fillColor: '#fff',
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        closestFeat = null;
        
        for (var i = 0; i < Dataset.features.length; i++) {
            var feature = Dataset.features[i];
            // filter on selected value before filtering on distance
            if (feature.properties.value >= minValue) {
                var featGeo = feature.geometry;
                var featLatLng = { lat: featGeo.coordinates[1], lng: featGeo.coordinates[0] };
                
                if (!closestFeat || distance(featLatLng.lat, featLatLng.lng, lat, lng) < distance(closestFeat.lat, closestFeat.lng, lat, lng)) {
                    closestFeat = featLatLng;
                };
            }
        }
       
    }
    
    redraw();
    
    console.log(closestFeat);
    
});



