
var config = {
    coords : {
        x1 : [48.91619985711495, 2.231047776092844],
        x2 : [48.800022104662695, 2.455194519756189]
    },
    osm : {
        url : 'https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}',
        attrib : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom : 12,
        maxZoom : 22,
        id : 'julio4/ckkpby3kv0sk817mxkx2alq4s',
        accessToken : 'pk.eyJ1IjoianVsaW80IiwiYSI6ImNra3BibjJwZzAzM20ycXBmMGpvcnQzdGIifQ.P4y50vETMB-nqKBAdk6Ptg',
    }
}

function fetchJSON(url) {
    return fetch(url)
      .then(function(response) {
        return response.json();
      });
  }

  function onEachFeature(feature, layer) {
    /*var popupContent = "";

    if (feature.properties && feature.properties.nom_tournage) {
        popupContent += feature.properties.nom_tournage + "";
    }

    layer.bindPopup(popupContent);*/
    var title = "";
    var director = "";
    var annee = "";
    var address = "";
    var type = "";

    if (feature.properties && feature.properties.nom_tournage) {
        title += feature.properties.nom_tournage + "";
    }
    if (feature.properties && feature.properties.nom_realisateur) {
        director += feature.properties.nom_realisateur + "";
    }
    if (feature.properties && feature.properties.annee_tournage) {
        annee += feature.properties.annee_tournage + "";
    }
    if (feature.properties && feature.properties.adresse_lieu) {
        address += feature.properties.adresse_lieu + "";
    }
    if (feature.properties && feature.properties.type_tournage) {
        type += feature.properties.type_tournage + "";
    }
    layer.on({
        click: function populate(){
            $("#information").show();
            document.getElementById('title').innerHTML = title
            document.getElementById('director').innerHTML = director
            document.getElementById('annee').innerHTML = annee
            document.getElementById('address').innerHTML = address
            document.getElementById('type').innerHTML = type
        }
    })
}

mapView = L.tileLayer(config.osm.url, {
    minZoom : config.osm.minZoom,
    maxZoom : config.osm.maxZoom,
    attribution : config.osm.attrib,
    id : config.osm.id,
    accessToken : config.osm.accessToken,
    tileSize : 512,
    zoomOffset : -1,
})
bounds = new L.LatLngBounds(new L.LatLng(...config.coords.x1), new L.LatLng(...config.coords.x2));

$("document").ready( function() {

    var map = new L.Map('map', {
        center: bounds.getCenter(),
        zoom: 13,
        layers: [mapView],
        maxBounds: bounds,
        maxBoundsViscosity: 0.85
      });


    var renderCanvas = L.canvas({ padding: 0.2, tolerance: 0.1 });
    var markers = L.markerClusterGroup();

    var geoJsonLayer = L.geoJSON(paris2016,{
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                renderer: renderCanvas,
                color: '#3388ff'
            });
        },
        onEachFeature: onEachFeature
    });

    markers.addLayer(geoJsonLayer);
    map.addLayer(markers);
});