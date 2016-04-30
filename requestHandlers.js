var exec = require("child_process").exec;

function start(response){
  
  console.log("Request handler 'start' was called.");
  exec("npm install pg",{timeout:100000},function(error,data){
      ResponsOut(response,data);
    });
  
}

function sleep(milliSeconds){
    var startTime =new Date().getTime();
    while(new Date().getTime()< startTime + milliSeconds);
  }

  

function upload(response){
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