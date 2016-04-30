var http = require("http");
var url = require("url");
var lroute;
var lhandle;

function onRequest(request, response){
    var pathname = url.parse(request.url).pathname;
    console.log("Request "+pathname+" received.");
    lroute(pathname,lhandle);
    response.writeHead(200,{"Content-Type":"text/plain"});
    response.write("Hello World");
    response.end();
}
  
function start(route,handle) {
    lroute = route;
    lhandle = handle;
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;
  




