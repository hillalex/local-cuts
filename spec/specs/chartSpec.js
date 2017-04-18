var $ = jQuery = require('jquery'),
    drawBarChart = require('../../js/lib/charts').drawBarChart,
    drawPieChart = require('../../js/lib/charts').drawPieChart,
    format = require('../../js/lib/format');

describe('drawBarChart', () => {

    beforeEach((done) => {

        loadFixtures('results.html');

        spyOn(format, 'numberWithCommas').and.returnValue("24");
        spyOn(jQuery.fn, 'highcharts');

        drawBarChart([{name: "TestName1"}, {name: "TestName2"}], [{value: "-23.6"}, {value: "-10.2"}]);

        setTimeout(function () {
            done();
        }, 500);
    });

    it("should show formatted number", function () {
        expect(format.numberWithCommas).toHaveBeenCalledWith(24);
    });

    it('should show message for negative value', function () {
        var message = $("#perhousehold").html();
        expect(message).toEqual('<span class="perhousehold">£24</span> less');
    });

    it('should show message for positive value', function () {
        drawBarChart([{name: "TestName1"}, {name: "TestName2"}], [{value: "23.6"}, {value: "-10.2"}]);
        var message = $("#perhousehold").html();
        expect(message).toEqual("£24 more");
    });

    it('should create labels', function () {
        expect(jQuery.fn.highcharts)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                xAxis: {
                    categories: ["TestName1", "TestName2"]
                }
            }));
    });

    it('should create data points', function () {
        expect(jQuery.fn.highcharts)
            .toHaveBeenCalledWith(jasmine.objectContaining({
                series: [{
                    data: [-24, -10]
                }]
            }));
    })
});

describe('drawPieChart', () => {


    beforeEach((done)=>{

        loadFixtures('results.html');

        setTimeout(function () {
            done();
        }, 500);
    });


    it('should populate percentage', function () {
        drawPieChart([{'type': 'percentagecuts', value: -12.3}], 'TestCouncil');
        var percentage = $("#percentage").html();
        expect(percentage).toEqual('12%');
    });

    it('should show percentage container when loss', function () {
        drawPieChart([{'type': 'percentagecuts', value: -12.3}], 'TestCouncil');

        var display = $("#percentagecontainer").css('display');
        expect(display).toEqual('block');
    });

    it('should not show percentage container when no loss', function () {
        drawPieChart([{'type': 'percentagecuts', value: 12.3}], 'TestCouncil');

        var display = $("#percentagecontainer").css('display');
        expect(display).toEqual('none');
    });

});