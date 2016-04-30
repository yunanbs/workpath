function route(pathname,handle){
  console.log("About to route a request for "+ pathname);
  if(typeof(handle[pathname])=='function')
  {
      handle[pathname]();
  }else
  {
      console.log("No request for "+ pathname);    
  }
}

exports.route = route;