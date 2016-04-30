var http = require("http");
var url = require("url");
var lroute;
var lhandle;

function onRequest(request, response){
    var pathname = url.parse(request.url).pathname;
    console.log("Request "+pathname+" received.");
    lroute(pathname,lhandle,response);
}  

function start(route,handle) {
    lroute = route;
    lhandle = handle;
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;