var express = require("express"),
    path = require('path'),
    fs = require("fs"),
    config = require('./config'),
    bodyParser = require('body-parser'),
    http = require("http"),
    app = express(),
    robots = require('express-robots'),
    router = express.Router();

app.set('view engine', 'ejs');
app.set('view options', {layout: false});

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/fonts', express.static(__dirname + '/fonts', {
    setHeaders: function (res, path, stat) {

        var req = res.req;
        for (var i = 0, ii = config.allowedOrigins.length;i++;i<ii){
            res.set("Access-Control-Allow-Origin", config.allowedOrigins[i]);
        }
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(robots({UserAgent: '*', Disallow: ''}));

router.get('/', function (req, res) {

    res.render('index',
        {
            description: "Find out how government cuts are affecting your local area.",
            title: "Local cuts calculator",
            bundle: config.env === 'development' ? "/js/bundle.js" : "/js/bundle.min.js",
            googleMapsAPIKey: config.googleMapsAPIKey
        });
});

app.use(router);

server = http.createServer(app);
server.listen(process.env.PORT || 8000);