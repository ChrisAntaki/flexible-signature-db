// Database
var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.FLEXIBLE_SIGNATURE_DATABASE_URI);

var Signature = sequelize.define('signature', {
    address: Sequelize.STRING,
    campaign: Sequelize.STRING,
    email: Sequelize.STRING,
    json: Sequelize.TEXT,
    name: Sequelize.STRING,
    optedIn: Sequelize.BOOLEAN,
    source: Sequelize.STRING,
    userAgent: Sequelize.STRING,
    zip: Sequelize.STRING,
});

// Signature.sync();



// Web Server
var express = require('express');
var multiparty = require('multiparty');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.post('/sign', function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        Signature.create({
            address: fields.address ? fields.address[0].trim() : null,
            campaign: fields.campaign ? fields.campaign[0].trim() : null,
            email: fields.email ? fields.email[0].trim().toLowerCase() : null,
            json: JSON.stringify(fields),
            name: fields.name ? fields.name[0].trim() : null,
            optedIn: fields.optedIn ? fields.optedIn[0] : false,
            source: fields.source ? fields.source[0].trim() : null,
            userAgent: fields.userAgent ? fields.userAgent[0].trim() : null,
            zip: fields.zip ? fields.zip[0].trim() : null,
        }).then(function() {
            res.send({ success: true });
        }).catch(function() {
            res.send({ error: true });
        });
    });
});
