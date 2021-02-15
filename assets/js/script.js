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
});