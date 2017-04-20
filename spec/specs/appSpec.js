var $ = jQuery = require('jquery'),
    api = require('../../js/lib/api'),
    map = require('../../js/lib/map'),
    config = require('../../config'),
    charts = require('../../js/lib/charts'),
    slider = require('../../js/lib/slider'),
    errors = require('../../js/lib/errors'),
    Q = require('Q');

jasmine.getFixtures().fixturesPath = 'base/views/partials';

require('../../js/entry.js');

// function to call before each test
function beforeEachAsync(done) {
    loadFixtures('form.html', 'results.html');
    window.init();

    $('#postcode').val('SW8 5PZ');
    $('#postcode-lookup').trigger('submit');

    // set timeout to give async calls to come back
    setTimeout(function () {
        done();
    }, 500);
}

// set up default mocks
function setUpSpies() {
    spyOn(slider, 'slideTo');
    spyOn(slider, 'init');
    spyOn(map, 'loadGeoJson');
    spyOn(map, 'setMapCenter');
    spyOn(charts, 'drawPieChart');
    spyOn(charts, 'drawBarChart');

    getPostcode = spyOn(api, 'getPostcode').and.callFake(function () {
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    });

    getCouncils = spyOn(api, 'getCouncils').and.callFake(function () {
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    });

    getPerHouseholdCuts = spyOn(api, 'getPerHouseholdCuts').and.callFake(function () {
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    });

    getPercentageCuts = spyOn(api, 'getPercentageCuts').and.callFake(function () {
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    });

    getCounty = spyOn(api, 'getCounty').and.callFake(function () {
        var deferred = Q.defer();
        deferred.resolve();
        return deferred.promise;
    });
}

describe('happiest path', function() {

    beforeEach(function(done) {
        beforeEachAsync(done);
    });

    beforeAll(function() {

        setUpSpies();
        getPostcode.and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve({
                "postcode": "KT229LE",
                "latitude": "51.294645",
                "longitude": "-0.347324",
                "areas": {"localauthority": "E07000210", "county": "E10000030"}
            });
            return deferred.promise;
        });

        getCouncils.and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve({
                council: {
                    "onscode": "E0700001",
                    "location": "test geojson",
                    "name": "test council name"
                },
                nearbyCouncils: [{"onscode": "E0700001"},
                    {"onscode": "E0700002"},
                    {"onscode": "E0700003"},
                    {"onscode": "E0700004"},
                    {"onscode": "E0700005"}]
            });
            return deferred.promise;
        });

        getPerHouseholdCuts.and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve([12, 13, 43, 65, 1]);
            return deferred.promise;
        });

        getPercentageCuts.and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve([{value: 12}]);
            return deferred.promise;
        });

        getCounty.and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve({
                name: 'CountyName'
            });
            return deferred.promise;
        });

    });

    it('should fetch postcode and set map center', function() {
        expect(api.getPostcode).toHaveBeenCalledWith('SW8 5PZ');
        expect(map.setMapCenter).toHaveBeenCalledWith(51.294645, -0.347324);
    });

    it('should slide to next slider', function() {
        expect(slider.slideTo).toHaveBeenCalledWith(1);
    });

    it('should get council and set geoJson', function() {
        expect(api.getCouncils).toHaveBeenCalledWith('SW8 5PZ');
        expect(map.loadGeoJson).toHaveBeenCalledWith('test geojson');
    });

    it('should show county', function() {
        expect(($('.county'))).toHaveText(', CountyName');
    });

    it('should show council name', function() {
        expect(($($('.council')[0]))).toHaveText('test council name');
    });

    it('should not show no loss mesasge', function() {
        expect($('#no-loss').is(':visible')).toBe(false);
    });

    it('should draw charts', function() {
        expect(charts.drawBarChart).toHaveBeenCalledWith([{"onscode": "E0700001"},
            {"onscode": "E0700002"},
            {"onscode": "E0700003"},
            {"onscode": "E0700004"},
            {"onscode": "E0700005"}], [12, 13, 43, 65, 1]);

        expect(charts.drawPieChart).toHaveBeenCalledWith([{value: 12}], "test council name");
    });

    it('should make bar chart container half width', function() {
        expect($('#perhouseholdcontainer')).toHaveClass("col-xs-12");
        expect($('#perhouseholdcontainer')).toHaveClass("col-sm-6");
    });

});

describe('postcode without county', function() {

    beforeEach(function(done) {
        beforeEachAsync(done);
    });

    beforeAll(function(){

        setUpSpies();

        getCounty.and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve();
            return deferred.promise;
        });
    });

    it('should not show county', function() {

        expect(($('.county'))).toHaveText('');
    });
});

describe('postcode in Wales', function() {

    beforeEach(function(done) {
        beforeEachAsync(done);
    });

    beforeAll(function() {

        setUpSpies();

        getCouncils.and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve({
                council: {
                    onscode: "W0000000"
                }
            });
            return deferred.promise;
        });

        spyOn(config, 'noEnglandMessage').and.returnValue('no england message');
    });

    it('should not slide to results', function() {
        expect(slider.slideTo).not.toHaveBeenCalled();
    });

    it('should show no England message', function() {
        expect($('#error')).toHaveText('no england message');
    });
});

describe('council with no cuts', function() {

    beforeEach(function(done) {
        beforeEachAsync(done);
    });

    beforeAll(function() {

        setUpSpies();

        getPerHouseholdCuts.and.callFake(function () {

            var deferred = Q.defer();
            deferred.resolve([{value: 12}]);
            return deferred.promise;
        });

        getCouncils.and.callFake(function () {
            var deferred = Q.defer();
            deferred.resolve({
                council: {
                    "onscode": "E0700001",
                    "location": "test geojson"
                }, nearbyCouncils: []
            });
            return deferred.promise;
        });
    });

    it('should show no loss mesasge', function() {
        expect($('#no-loss').is(':visible')).toBe(true);
    });

    it('should make bar chart container full width', function() {
        expect($('#perhouseholdcontainer')).toHaveClass("col-xs-12");
        expect($('#perhouseholdcontainer')).not.toHaveClass("col-sm-6");
    });

});

describe('no council found', function() {

    beforeEach(function(done) {
        beforeEachAsync(done);
    });

    beforeAll(function() {
        setUpSpies();
        spyOn(config, 'noResultsMessage').and.returnValue('no results message');
    });

    it('should not slide to results', function() {
        expect(slider.slideTo).not.toHaveBeenCalled();
    });

    it('should show no England message', function() {
        expect($('#error')).toHaveText('no results message');
    });

});