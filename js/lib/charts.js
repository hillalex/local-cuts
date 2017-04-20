var $ = require('jquery'),
    format = require('./format'),
    $pieContainer,
    $barContainer,
    $percentagecontainer,
    $percentage,
    $perhousehold;

require('highcharts');

// draws a bar chart comparing the user's local council to neighbouring councils
exports.drawBarChart = function (councils, data) {

    $barContainer = $('#bar-container');
    $perhousehold = $('#perhousehold');

    var labels = [];
    var dataPoints = [];

    // create labels and data for the bar chart's columns
    for (var i = 0; i < data.length; i++) {
        labels.push(councils[i].name);
        dataPoints.push(Math.round(data[i].value));
    }

    // data comes back negative if cuts, so get the absolute value for display
    var absoluteValue = Math.abs(Math.round(data[0].value));

    if (data[0].value < 0)
        $perhousehold.html('<span class="perhousehold">£' + format.numberWithCommas(absoluteValue) + "</span> less");
    else
        $perhousehold.html("£" + format.numberWithCommas(absoluteValue) + " more");

    $barContainer.highcharts({
        title: '',
        chart: {
            backgroundColor: "#f5f5f5",
            height: 230,
            type: 'column'
        },
        tooltip: {
            formatter: function () {
                return "£" + format.numberWithCommas(Math.round(this.y));
            }
        },
        xAxis: {
            categories: labels

        },
        yAxis: {
            plotLines: [{
                width: 2,
                value: 0,
                zIndex: 5,
                color: "#e5e5e5"
            }],
            labels: {
                formatter: function () {
                    return "£" + format.numberWithCommas(Math.round(this.value));
                }
            },
            title: {
                text: 'Change in spending power <br/> per household',
                x: -20,
                y: 10
            }
        },
        legend: {enabled: false},
        plotOptions: {
            column: {
                pointPadding: 0,
                groupPadding: 0,
                zones: [{
                    value: 0, // Values up to 0 (not including) ...
                    color: "#FF5A5E" // ... have the color red.
                }, {
                    color: "#5bc0de" // Values from 0 (including) and up have the color blue
                }]
            }
        },
        series: [{
            data: dataPoints
        }]
    });
};
exports.drawPieChart = function (data, name) {

    $pieContainer = $('#pie-container');
    $percentagecontainer = $('#percentagecontainer');
    $percentage = $('#percentage');

    if (data.length === 0 || data[0].value > 0) {
        // no cuts to this council, so don't show pie chart
        $percentagecontainer.hide();
        return;
    }

    // data comes back negative if cuts, but we want the absolute value here
    var percentage = Math.abs(data[0].value);
    percentage = Math.round(parseFloat(percentage));

    // build the chart
    $pieContainer.highcharts({
        chart: {
            plotBackgroundColor: "#f5f5f5",
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            backgroundColor: "#f5f5f5",
            width: 200,
            height: 200
        },

        title: '',
        tooltip: {
            formatter: function () {
                if (this.key === "Area")
                    return name + " council funding";
                else return percentage + '% cuts';
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'default',
                dataLabels: {
                    enabled: false
                },
                showInLegend: false
            }
        },
        series: [{
            name: '',
            borderColor: "#f5f5f5",
            colors: ["#FF5A5E", "#5bc0de"],
            colorByPoint: true,
            data: [{
                name: 'Cuts',
                y: percentage,
                selected: true
            },
                {
                    name: 'Area',
                    y: 100 - percentage,
                    selected: true,
                    sliced: true,
                }]
        }]
    });

    // populate percentage amount and show
    $percentage.text(percentage + '%');
    $percentagecontainer.show();

};

module.exports = exports;