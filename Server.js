var http = require("http");
var url = require("url");
var querystring = require("querystring");
var lroute;
var lhandle;


function onRequest(request, response){
   
    var postData='';
    var pathname = url.parse(request.url).pathname;
    console.log("Request "+pathname+" received.");
    request.on("data",function (data) {
        postData +=data
    });
    request.on("end",function(){
        postData = querystring.parse(postData);
        lroute(pathname,lhandle,response,postData);
    });
    
}

function start(route,handle) {
    lroute = route;
    lhandle = handle;
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
}

exports.start = start;