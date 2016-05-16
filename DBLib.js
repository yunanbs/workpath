var pg = require("pg");
var querystring = require("querystring");
var async = require("async");
var server = require("./Server");

var dbStr = "tcp://postgres:bs@127.0.0.1:5432/SimpleDB";


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

exports.InsertData = function (response,data) {
    var count = data.count;
    var sqllist=[];
    for(var i=0;i<count;i++){
        var usercontent = {
            name:"people"+i,
            age:i*20,
            parent:[
                {
                    father:"f"+i
                },
                {
                    mother:"m"+i
                }
            ]
        }
        
        var jstr = JSON.stringify(usercontent);
        sqllist[i] = jstr;
    }
    
    async.auto({
        inidb:function (callback) {
             var tmpDB = new pg.Client(dbStr);
            console.log("create db : "+dbStr);
            tmpDB.connect(function (error,result) {
                callback(error,result);
            });
        },
        inisertsqls:["inidb",function (results,callback) {
            async.map(sqllist,function (item,callback) {
                var dbclient = results.inidb;
                var sql = "insert into sp_usertable(usercontent) values('"+item+"')";
                dbclient.query(sql,function (error,result) {
                    callback(error,result);
                })
            },function (error,result) {
                callback(error,result);
            })
        }]
                
    },function (error,results) {
        var result;
        if(error){
            result = "fail";
        }else{
            result = "succeed";
        }
        
      server.ResponsOut(response,JSON.stringify(result));
    });
     
     
}