var pg = require("pg");
var querystring = require("querystring");

var dbStr = "tcp://postgres:bs@127.0.0.1:5432/SimpleDB";

var hw = "hello";

function ResponsOut(response,content) {
  response.writeHead(200,{"Content-Type":"text/json"});
  response.write(content);
  response.end();
}

function connectDB(response,data) {

    var dbClient = new pg.Client(dbStr);
    dbClient.connect(function (error,result) {
        if(error){  
            console.log('ClientConnectionReady Error: ' + error.message);  
            ResponsOut(response,error.message);
        }else{
             ResponsOut(response,"DB Connected Succeed");
        }
        dbClient.end();
    })
}

function QuerySql(response,data) {
     //lresponse = response;
     console.log(hw);
     var dbClient = new pg.Client(dbStr);
     dbClient.connect(function (error,result) {
        if(error){  
            console.log('ClientConnectionReady Error: ' + error.message);  
            dbClient.end();  
            ResponsOut(response,error.message);
            return;
        }
        
       var sql= data.sql;
       dbClient.query(sql,function (error,result) {
           if(error){  
            console.log('GetData Error: ' + error.message);  
            ResponsOut(response,error.message);
            
        }else{
            var jsonStr = '';
             if(result.command=="SELECT"){
                 jsonStr = JSON.stringify(result.rows);
             }else{
                 jsonStr = JSON.stringify(result.rowCount);
             }
             
             ResponsOut(response,jsonStr);
        }
        dbClient.end();
       })
        
    })
}

function MassSql(response,data) {
    
    hw = hw +" world";
    console.log(hw);
    
    var dbClient = new pg.Client(dbStr);
    dbClient.on('end',function (error,result) {
        console.log("DB Closed");
    })
    dbClient.connect(function (error,result) {
        if(error){  
            console.log('ClientConnectionReady Error: ' + error.message);  
            return "-1";
        }
        console.log("DB Opened");
        insertSqls(data,dbClient,response);
    });
    
}

function insertSqls(data,dbcon,response) {
    var count = data.count;
    var curIndex = 0;
    var delsql = "delete from dmtable";
    var finish = 0;
    var succeed = 0;
    
    dbcon.query(delsql,function (error,result) {
        if(error){
            ResponsOut("deldata fail");
            return;
        }
        
        while(curIndex<count){
            var tmpsql = "insert into dmtable values('"+curIndex+"','"+curIndex+"','{}')";
            dbcon.query(tmpsql,function (error,result) {
                if(error){
                    ResponsOut(response,"");
                }
                
                if(!error){
                   
                    finish = finish+1;
                    Console.log(finish);
                    succeed  =succeed+result.rowCount;
                    if(finish==count){
                        dbcon.end();
                        console.log(" finished and "+succeed + " row affacted");
                        ResponsOut(response,finish +" finished and "+succeed + "succeed");
                    }
                }
            });
            curIndex = curIndex+1;
        }
    })
}

function InsertCallBack(params) {
    
}

function DoSql(dbClient,sql) {
     dbClient.query(sql,function (error,result) {
           if(error){  
            console.log('GetData Error: ' + error.message);  
            return "-1";            
        }else{
            var jsonStr = '';
             if(result.command=="SELECT"){
                 jsonStr = JSON.stringify(result.rows);
             }else{
                 jsonStr = JSON.stringify(result.rowCount);
             }
             return jsonStr;
        }
       })
}

function IniDB() {
    var dbClient = new pg.Client(dbStr);
    dbClient.connect(function (error,result) {
        if(error){  
            console.log('ClientConnectionReady Error: ' + error.message);  
            return "-1";
        }else{
             return dbClient;
        }
    })
}

exports.connectDB = connectDB;
exports.QuerySql = QuerySql;
exports.MassSql = MassSql;
