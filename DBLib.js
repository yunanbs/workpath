var pg = require("pg");
var querystring = require("querystring");
var async = require("async");
var server = require("./Server");

var dbStr = "tcp://baosight:bs@127.0.0.1:5432/simpledb";


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
       if(error){
            server.ResponsOut(response,JSON.stringify(error));
            return;
        }
        
        var sqlresult = results.sqlresult;
        console.log(sqlresult);
        
        var jsonresult;
        if(sqlresult.command=="SELECT"){
            jsonresult = JSON.stringify(sqlresult.rows);
        }else{
            jsonresult =  JSON.stringify(sqlresult.rowCount);
        }
        server.ResponsOut(response,jsonresult);
    })    
}

function ExcuteSql(sql,callback) {
    async.auto({
        inidb:function (cb) {
            var tmpDB = new pg.Client(dbStr);
            console.log("create db : "+dbStr);
            tmpDB.connect(function (error,result) {
                cb(error,result);
            });
        },
        
        sqlresult:["inidb",function (results,cb) {
            console.log("do sql: "+sql);
            var dbclient = results.inidb;
            dbclient.query(sql,function (error,result) {
                 cb(error,result);
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
        if(error){
            callback(error,null);
        }else{
            callback(error,results.sqlresult);
        }
        
    })    
}

exports.AutoSqlQuery = AutoSqlQuery;

exports.ExcuteSql = ExcuteSql;
