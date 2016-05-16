var server = require("./Server");
var route = require("./route");
var requestHandlers = require("./requestHandlers");
var dblib = require("./DBLib");
var filehelper = require("./CheckFile");
var cluster = require("cluster");
var cpus = require("os").cpus();

var handle ={}
handle["/"]= requestHandlers.start;
handle["/start"]= requestHandlers.start;
handle["/upload"]= requestHandlers.upload;
//handle["/inidb"]= dblib.connectDB;
//handle["/QuerySql"]= dblib.QuerySql;
//handle["/MassSql"] = dblib.MassSql;
//handle["/QuerySqlNew"] = dblib.QuerySqlNew;
//handle["/QuerySqlCO"] =dblib.QuerySqlCO;
//handle["/MassSqlCO"] = dblib.MassSqlCO;
handle["/AutoSqlQuery"] = dblib.AutoSqlQuery;
handle["/GetFileList"] = filehelper.GetFileList;
handle["/ReadFile"] = filehelper.ReadFile;
handle["/ReadFileByType"] = filehelper.ReadFileByType;
// 多进程负载均衡 
//在vscode debug环境下 无法使用  
//在服务环境下 可以正常使用。调试时关闭  运行时启动

/*if(cluster.isMaster){
    console.log('Master start');
    
    for(var cpu in cpus){
        cluster.fork();
    }
    
    cluster.on('listening',function (worker,address) {
        //console.log('worker '+worker.id+ ' start work at ' +worker.address+' : '+worker.port);
    });
    cluster.on('exit',function (worker,code,signal) {
        console.log('worker '+worker.process.pid+ ' is died');
    });
}else if(cluster.isWorker){
    console.log('Worker start');
    server.start(route.route,handle);
}*/

server.start(route.route,handle);


