/**
 * <h2>{project.displayName}</h2>
 *
 * <p>
 * Command-line Options:
 * <ul>
 *      <li>--main:  starts the server</li>
 *      <li>--port:  defaults to 9000</li>
 * </ul>
 * </p>
 *
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var args = require("minimist")(process.argv);

// For express
var express = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    config = require("config"),
    project = require("./project.json"),
    app = express();



//============================================================ Middleware
app.use(methodOverride());
// parse application/x-www-form-urlencoded
// Causes POST requests to hang when proxied.  See https://github.com/nodejitsu/node-http-proxy/issues/530
//app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use(project.context, express.static("./build"));

app.get("/stormcloud-services/test", function(req, res){
    res.send("Hello, from " + project.displayName)
});



//=========================================================== Public
exports.start = function(port){
    app.listen(port, function(){
        console.log("Starting " + project.displayName + " on port " + port + "....");
    });
};

if (args.main){
    exports.start(args.port || process.env.PORT || config.port || 9000);
}