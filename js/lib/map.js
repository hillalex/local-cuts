var _map = false;
var _features = [];

exports.loadGeoJson = function (geom) {
    var geoJson = geometryToGeoJson(geom);

    var interval = setInterval(function () {
        if (_map) {
            // NOTE: This uses cross-domain XHR, and may not work on older browsers.
            _features = _map.data.addGeoJson(geoJson);

            _map.data.setStyle({
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
        if (_map) {
            _map.data.remove(_features[0]);
            _map.data.setStyle({
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
        if (_map) {
            _map.panTo({lat: lat, lng: lng});
            _map.setZoom(13);
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

    _map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 52.948158, lng: -1.5341047},
        zoom: 10
    });

};

module.exports = exports;