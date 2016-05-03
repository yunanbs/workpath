var server = require("./Server");
var route = require("./route");
var requestHandlers = require("./requestHandlers");
var dblib = require("./PostgreDBLib");

var handle ={}
handle["/"]= requestHandlers.start;
handle["/start"]= requestHandlers.start;
handle["/upload"]= requestHandlers.upload;
handle["/inidb"]= dblib.connectDB;
handle["/QuerySql"]= dblib.QuerySql;
handle["/MassSql"] = dblib.MassSql;

server.start(route.route,handle);