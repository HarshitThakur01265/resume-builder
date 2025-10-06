var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/index.html', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/process_post', urlencodedParser, function (req, res) {
    const fname = req.body.first_name;
    const lname = req.body.last_name;
    

    res.write( `<h1> Your First Name is:   ${fname}  </h1>`);
    res.write(`<h1>Your Last Name is:  ${lname}  </h1>`);
    
    console.log(req.body);
})
var server = app.listen(8000, function () {

    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})