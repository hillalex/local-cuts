var format = {

    // returns a nice, human readable number string
    numberWithCommas: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

};

module.exports = format;