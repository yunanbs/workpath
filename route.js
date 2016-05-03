function route(pathname,handle,response,data){
  console.log("About to route a request for "+ pathname);
  if(typeof(handle[pathname])==='function')
  {
     
      handle[pathname](response,data);
  }else
  {
      console.log("No request handler found for "+ pathname);
      response.writeHead(404,{"Content-Type":"text/json"});
      response.write("{\"Fail\":\"404 not found\"}");
      response.end(); 
  }
}

exports.route = route;