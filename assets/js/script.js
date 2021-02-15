$("document").ready( function() {
    var map = L.map('map').setView([48.864, 2.349], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}@2x?access_token={accessToken}', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 22,
        id: 'julio4/ckkpby3kv0sk817mxkx2alq4s',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoianVsaW80IiwiYSI6ImNra3BibjJwZzAzM20ycXBmMGpvcnQzdGIifQ.P4y50vETMB-nqKBAdk6Ptg'
    }).addTo(map);

});