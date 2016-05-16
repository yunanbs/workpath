var pg = require("pg");
var querystring = require("querystring");
var async = require("async");

var dbStr = "tcp://postgres:bs@127.0.0.1:5432/SimpleDB";

function ResponsOut(response,content) {
  //response.writeHead(200,{"Content-Type":"applilcation/json"});
  response.write(content);
  response.end();
}

function AutoSqlQuery(response,data) {
    async.auto({
        inidb:function (callback) {
            var tmpDB = new pg.Client(dbStr);
            console.log("create db : "+dbStr);
            tmpDB.connect(function (error,result) {
                callback(error,result);
            });
        },
        
        sqlresult:["inidb",function (results,callback) {
            console.log("do sql: "+data.sql);
            var dbclient = results.inidb;
            dbclient.query(data.sql,function (error,result) {
                 callback(error,result);
            });
        }
        ]
    },
    function (error,results) {
        var dbclient = results.inidb;
        if(dbclient!==undefined)
        {
            dbclient.end();
            console.log("db close");
        }
        
       
        console.log("error:"+error);
        console.log("results:"+results);
       
        var sqlresult = results.sqlresult;
        console.log(sqlresult);
        
        var jsonresult;
        if(sqlresult.command=="SELECT"){
            jsonresult = JSON.stringify(sqlresult.rows);
        }else{
            jsonresult =  JSON.stringify(sqlresult.rowCount);
        }
        ResponsOut(response,jsonresult);
    })    
}

exports.AutoSqlQuery = AutoSqlQuery;