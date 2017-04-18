/**
 * client to retrieve data from external geocoding API
 */
var $ = require('jquery'),
    map = require('./map'),
    config = require('../../config'),
    errors = require('./errors'),
    APIUrl = config.geocoderAPI,
    searchUrl = APIUrl + '/search/',
    cutsUrl = APIUrl + '/stats/cuts/',
    Q = require('Q');

exports.getPostcode = function (postcode) {
    return $.getJSON(searchUrl + postcode);
};

exports.getCouncil = function (postcode) {
    return $.getJSON(searchUrl + "localauthority/" + postcode + '?location=true');
};

exports.getCouncils = function (postcode) {
    return $.when($.getJSON(searchUrl + "localauthority/" + postcode + '?location=true'),
        $.getJSON(searchUrl + "localauthorities/" + postcode))
        .then(function (councilData, nearbyCouncilsData) {
            // each argument here is in the form [data, status, jqXHR] so we just want to return the first element of each
            return {council: councilData[0], nearbyCouncils: nearbyCouncilsData[0]}
        });
};

exports.getCounty = function (postcode) {
    return $.getJSON(searchUrl + "county/" + postcode);
};

// retrieve cuts data for each council in array, and return when all ajax calls have completed
exports.getPerHouseholdCuts = function (councils) {

    if (councils.length === 0) {
        var deferred = Q.defer();
        deferred.reject();
        return deferred.promise;
    }

    // nb .filter is ES5, will not work in older IE
    var ajaxCalls = councils.map(function(council){
        return $.getJSON(cutsUrl + council.onscode + '/perhouseholdcuts');
    });

    return $.when.apply($, ajaxCalls)
        .then(function () {

            return ajaxCalls.map(function(promise){
                // responseJSON will be in the form [{type: 'perhouseholdcuts', value: something}]
                return promise.responseJSON[0];
            })
        });
};

exports.getPercentageCuts = function (onscode) {
    return $.getJSON(cutsUrl + onscode + '/percentagecuts');
};

module.exports = exports;