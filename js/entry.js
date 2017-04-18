window.$ = window.jQuery = require('jquery');
var api = require('./lib/api'),
    map = require('./lib/map'),
    config = require('../config'),
    charts = require('./lib/charts'),
    slider = require('./lib/slider'),
    errors = require('./lib/errors'),
    $form,
    $perhouseholdcontainer,
    $btn,
    $postcode,
    $county,
    $noloss,
    $council;

require("../node_modules/bootstrap/js/button.js");
import validate from 'jquery-validation';

window.init = function() {

    // initialise slider to allow for browser back navigation
    slider.init();

    // set up DOM variables
    $form = $('#postcode-lookup');
    $btn = $form.find('input[type=submit]');
    $postcode = $form.find('#postcode');
    $county = $('span.county');
    $noloss = $('#no-loss');
    $council = $('span.council');
    $perhouseholdcontainer = $('#perhouseholdcontainer');

    // add jquery validation to main form
    $form.validate({
        errorClass: "error small",
        errorElement: "span",
        highlight: function (element) {
            $(element).closest('.form-group')
                .addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group')
                .removeClass('has-error');
        },
        rules: {
            postcode: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            postcode: "Please enter a valid postcode"
        }
    });

    $form.submit(function (e) {

        e.preventDefault();

        if ($form.valid()) {
            $btn.button('loading');
            errors.clear();

            var postcode = $postcode.val().trim();

            api.getPostcode(postcode)
                .then(function (data) {
                    map.setMapCenter(parseFloat(data.latitude), parseFloat(data.longitude));
                });

            api.getCounty(postcode)
                .then(function (data) {
                    $county.text(", " + data.name);
                })
                .fail(function (data) {
                    $county.text("");
                });

            api.getCouncils(postcode)
                .then(function (data) {

                    if (checkCouncilInEngland(data.council)) {
                        getCutsData(data.council, data.nearbyCouncils);
                    }

                    $btn.button('reset');
                })
                .fail(function () {
                    errors.show(config.noResultsMessage);
                    $btn.button('reset');
                });

        }
    });

    function getCutsData(council, nearbyCouncils) {
        api.getPercentageCuts(council.onscode)
            .then(function (percentageData) {
                charts.drawPieChart(percentageData, council.name);
            });

        api.getPerHouseholdCuts(nearbyCouncils)
            .then(function (perhouseholdData) {
                showResults(council, nearbyCouncils, perhouseholdData);
            })
            .fail(function () {
                errors.show(config.noResultsMessage);
                $btn.button('reset');
            });
    }

    function showResults(council, nearbycouncils, data) {

        if (data.length > 0 && data[0].value > 0) {
            // show user a message explaining that their council is 1 of a few without cuts
            $noloss.show();
            // pie chart won't appear, so let bar chart become full width
            $perhouseholdcontainer.removeClass("col-sm-6");
        }
        else {
            $noloss.hide();
            $perhouseholdcontainer.addClass("col-sm-6");
        }

        // draw bar chart showing data for nearby councils
        charts.drawBarChart(nearbycouncils, data);
        $council.text(council.name);

        // show council boundaries on the background map
        map.loadGeoJson(council.location);

        // slide to results
        slider.slideTo(1);
    }

    function checkCouncilInEngland(council) {
        if (council.onscode[0] === 'W' || council.onscode[0] === 'S') {
            // Wales and Scotland, respectively
            errors.show(config.noEnglandMessage);
            return false;
        }

        return true;
    }
};