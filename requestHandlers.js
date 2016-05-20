var server = require("./Server");
var https = require('https'); 

function start(response,data){
  
  console.log("Request handler 'start' was called.");
}
  

function upload(response,data){
  console.log("Request handler 'upload' was called.");
  ResponsOut(response,"Upload Math");
}

function ResponsOut(response,MathName) {
  response.writeHead(200,{"Content-Type":"text/plain"});
  response.write(MathName);
  response.end();
}

exports.start = start;
exports.upload = upload;

exports.getweather = function (response) {
  var url = "https://api.heweather.com/x3/weather?cityid=CN101020100&key=fd09ae477d9b4c07ad7248a798d4d6cf";
  var options = {
    hostname:'api.heweather.com',
    port: 443,
    //path: '/pay/pay_callback?' + content,
    path:url,
    method: 'GET'
  };

  var req = https.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
      });
  });

  req.on('error', function (e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();
}