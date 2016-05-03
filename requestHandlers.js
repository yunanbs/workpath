var exec = require("child_process").exec;

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