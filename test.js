var express = require("express"),
    http = require("http"),
    app = express();

app.use('/', express.static(__dirname));

server = http.createServer(app);
server.listen(8000);

console.log("run tests by visiting http://127.0.0.1:8000/spec/SpecRunner.html");