// Variables de configuration
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

//Propriétés de la map
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

//Après chargement de la page
$("document").ready( function() {

    //Création de la map
    var map = new L.Map('map', {
        center: bounds.getCenter(),
        zoom: 13,
        layers: [mapView],
        maxBounds: bounds,
        maxBoundsViscosity: 0.85
      });

    //Le canva sur lesquel les markers seront affiché (et non pas dans le DOM, pour la performance)
    var renderCanvas = L.canvas({ padding: 0.2, tolerance: 0.1 });
    
    //Le Grouper de marker afin de réaliser des fitres performants
    var mcg = L.markerClusterGroup(),
        films = L.featureGroup.subGroup(mcg),
        seriesTV = L.featureGroup.subGroup(mcg),
        seriesWeb = L.featureGroup.subGroup(mcg),
        control = L.control.layers(null, null, { collapsed: false });
    mcg.addTo(map)

    //Import des différents points geoJSON avec filtre
    function onEachFeature(feature, layer) {
        var popupContent = "";
        if (feature.properties && feature.properties.nom_tournage) {
            popupContent += feature.properties.nom_tournage + "";
        }
        layer.bindPopup(popupContent);
    }
    
    function pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
            renderer: renderCanvas,
            color: '#3388ff'
        });
    }
    
    var gJson_films = L.geoJSON(paris2016,{
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature,
        filter: function(feature, layer) {
            return feature.properties.type_tournage == "Long m\u00e9trage";
        }
    });
    var gJson_serieWeb = L.geoJSON(paris2016,{
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature,
        filter: function(feature, layer) {
            return feature.properties.type_tournage == "S\u00e9rie Web";
        }
    });
    var gJson_serieTV = L.geoJSON(paris2016,{
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature,
        filter: function(feature, layer) {
            return feature.properties.type_tournage == "T\u00e9l\u00e9film" || feature.properties.type_tournage == "S\u00e9rie TV";
        }
    });

    //Ajouts des différents layers et markers par groupe
    films.addLayer(gJson_films);
    gJson_films.addTo(films)

    seriesWeb.addLayer(gJson_serieWeb);
    gJson_serieWeb.addTo(seriesWeb)

    seriesTV.addLayer(gJson_serieTV);
    gJson_serieTV.addTo(seriesTV)

    //Barre de contrôle
    control.addOverlay(films, 'Films');
    control.addOverlay(seriesTV, 'Séries TV');
    control.addOverlay(seriesWeb, 'Séries Web');
    control.addTo(map);

    //ajout sur la map
    films.addTo(map)
    seriesWeb.addTo(map)
    seriesTV.addTo(map)
    map.addLayer(mcg);
});