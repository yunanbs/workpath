var http = require("http");
var url = require("url");
var querystring = require("querystring");
var lroute;
var lhandle;


function onRequest(request, response){
   
   //ajax 调用 统一添加回复头
   response.writeHead(200,{
           "Content-Type":"application/json;charset=utf-8",
           "Access-Control-Allow-Origin":"*",
           "Access-Control-Allow-Headers":"Content-Type,Accept",
           "Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS",
        });
       
   if(request.method=="OPTIONS"){
        response.write("{}");
        response.end();
   }
   else{
       var postData='';
    var pathname = url.parse(request.url).pathname;
    console.log("Request "+pathname+" received.");
    request.on("data",function (data) {
        postData +=data
    });
    request.on("end",function(){
        //postData = JSON.parse(querystring.parse(postData));
        try{
             postData = JSON.parse(postData);
        }catch(e){
            ResponsOut(response,"404");
            return;
        }
       
        lroute(pathname,lhandle,response,postData);
    });
   }
    
    
}

function start(route,handle) {
    lroute = route;
    lhandle = handle;
    http.createServer(onRequest).listen(8888);
    console.log("Server has started.");
    
}

function ResponsOut(response,content) {
  response.write(content);
  response.end();
}


exports.start = start;
exports.ResponsOut = ResponsOut;