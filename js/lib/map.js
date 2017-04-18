exports._map = false;
exports._features = [];

exports.loadGeoJson = function (geom) {
    var geoJson = geometryToGeoJson(geom);

    var interval = setInterval(function () {
        if (exports._map) {
            // NOTE: This uses cross-domain XHR, and may not work on older browsers.
            exports._features = exports._map.data.addGeoJson(geoJson);

            exports._map.data.setStyle({
                fillColor: 'purple',
                strokeWeight: 1,
                strokeColor: 'purple'
            });
            clearInterval(interval);
        }

    }, 100)

};

exports.removeGeoJson = function () {

    var interval = setInterval(function () {
        if (exports._map) {
            exports._map.data.remove(exports._features[0]);
            exports._map.data.setStyle({
                fillColor: 'purple',
                strokeWeight: 1,
                strokeColor: 'purple'
            });
            clearInterval(interval);
        }

    }, 100)

};

exports.setMapCenter = function (lat, lng) {

   var interval = setInterval(function () {
        if (exports._map) {
            exports._map.panTo({lat: lat, lng: lng});
            exports._map.setZoom(13);
            clearInterval(interval);
        }

    }, 100)

};

// takes a geometry object and converts it to geoJson
function geometryToGeoJson(geo) {
    geo = JSON.parse(geo);
    return {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": geo
            }]
    }
}

// function for google maps callback
window.initMap = function () {

    exports._map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.948158, lng: -1.5341047},
        zoom: 10
    });

};

module.exports = exports;