var $ = require('jquery'),
    map = require('./map'),
    $allSlides;

exports.init = function() {

    $allSlides = $('div.container');

    // start off on slide 0
    history.replaceState({slide: 0}, "slide 0", "?slide=0");

    $(window).on("popstate", function (e) {

        // allow for browser back navigation
        var i = e.originalEvent.state.slide || 0;
        exports.slideTo(i);

    });
};

exports.slideTo = function(i){

    // show appropriate slide
    $allSlides.addClass('hide');
    $('#slide-' + i).removeClass('hide');

    if (i === 0) {
        // reset map to center of England
        map.setMapCenter(52.948158, -1.5341047);
        map.removeGeoJson();
    }

    history.pushState({slide: i}, "slide " + i, "?slide=" + i);
};

module.exports = exports;