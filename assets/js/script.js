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
    var colorsVar = {
        "ic-blue" : "#577590",
        "ic-green" : "#90be6d",
        "ic-red" : "#f94144",
        "default" : "orange"
    }
    control.addOverlay(films, '<i class="fas fa-film" id="ic-blue"></i>');
    control.addOverlay(seriesTV, '<i class="fas fa-tv" id="ic-green"></i>');
    control.addOverlay(seriesWeb, '<i class="fab fa-youtube" id="ic-red"></i>');
    control.addTo(map);

    //ajout sur la map
    films.addTo(map)
    seriesWeb.addTo(map)
    seriesTV.addTo(map)
    map.addLayer(mcg);

    //Pour le style de la barre de controle :
    
    function colorLayer(layer) {
        let color = (colorsVar[$(layer).siblings('span').children('i').attr('id')] || colorsVar['default']);
        $(layer).parentsUntil('.leaflet-control-layers-overlays','label').css('background-color', color)
    }

    let controls = $('.leaflet-control-layers-overlays input');

    controls.each((i) => colorLayer(controls.eq(i)));

    controls.click(function() {
        if(this.checked)
            colorLayer(this)
        else
            $(this).parentsUntil('.leaflet-control-layers-overlays','label').css('background-color', '#555')
    });
});