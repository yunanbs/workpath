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
handle["/QuerySqlNew"] = dblib.QuerySqlNew;
handle["/QuerySqlCO"] =dblib.QuerySqlCO;

server.start(route.route,handle);