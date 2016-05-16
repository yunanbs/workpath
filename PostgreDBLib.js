var pg = require("pg");
var querystring = require("querystring");
var async = require("async");
var co = require("co");

var dbStr = "tcp://postgres:bs@127.0.0.1:5432/SimpleDB";

function ResponsOut(response,content) {
  response.writeHead(200,{"Content-Type":"text/json"});
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
        
        excuteSql:["inidb",function (results,callback) {
            console.log("do sql: "+data.sql);
            var dbclient = results.inidb;
            dbclient.query(data.sql,function (error,result) {
                 callback(error,result);
            });
        }
        ]
    },
    function (error,results) {
        console.log("in cb ");
        var dbclient = results.inidb;
        dbclient.end();
        console.log("db close");
        console.log(results.excuteSql);
        var jstr = JSON.stringify(results.excuteSql.rows);
        ResponsOut(response,jstr);
    })    
}

/* 普通调用逻辑
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
                    //Console.log(finish);
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
*/

/*async Series
function QuerySqlNew(response,data) {
    var dbClient = new pg.Client(dbStr);// create dbConnect
    async.series(
        [
           
            function (callback) {
                CreateCon(callback,dbClient);
            },
            function (callback) {
                DoSql(callback,dbClient,data);
            }
        ],
        function(err, results) {
            console.log('1.1 err: ', err);
            console.log('1.1 results: ', JSON.stringify(results[1].rows));
            Closedb(dbClient)
            ResponsOut(response, JSON.stringify(results[1].rows))
        }
    );
    
    
}

function CreateCon(callback,dbclient) {
    console.log('in createCon function');
    dbclient.connect(function (error,result) {
       if(error){
           callback(error);
       }else{
           callback(null,result);
       }
    })
}

function DoSql(callback,dbclient,data) {
     console.log('in dosql function');
    var sql = data.sql;
    dbclient.query(sql,function (error,result) {
        if(error){
           callback(error);
       }else{
           callback(null,result);
       }
    });
}

function Closedb(dbclient) {
    console.log('in Closedb function');
    dbclient.end();
}
*/


/*co
function QuerySqlCO(response,data) {
    var sql = data.sql;
    co(function *() {
        var dbconresult = yield cocreatedb(dbStr);
        var jresut = yield codosql(sql,dbconresult);
        dbconresult.end();
        console.log("DB Closed");
        //ResponsOut(response,jresut);
        return jresut;
    }).then(function (result){
                console.log(result);
                var jstr='';
                if(result.command=="SELECT")
                {
                    jstr = JSON.stringify(result.rows);
                }else{
                    jstr = JSON.stringify(result.rowCount);
                }
                ResponsOut(response,jstr);
            }, function(err){
                ResponsOut(response,"");
            });
}

function cocreatedb(dbStr) {
    return function (callback) {
        var dbclient = new pg.Client(dbStr);
        dbclient.connect(callback);
    }
}

function codosql(sql,dbclient) {
    return function (callbak){
        dbclient.query(sql,callbak);
    }
}

function MassSqlCO(response,data) {
    var sqlcount = data.count;
    var finished = 0;
    var succeed = 0;
    co(function *() {
        var dbclient =yield cocreatedb(dbStr);
        var delsql ="delete from dmtable";
        var tmp = yield codosql(delsql,dbclient);
        for(var i=0;i<sqlcount;i++){
            var tmpsql = "insert into dmtable values('"+i+"','"+i+"','{}')";
            var subResuslt =yield codosql(tmpsql,dbclient);
            finished = finished+1;
            succeed = succeed+subResuslt.rowCount;
        }
        var resultstr = "finish "+finished+" succeed "+succeed;
        console.log(resultstr);
        return resultstr
    }).then(function (result) {
        console.log(result);
        var jstr = JSON.stringify(result);
        ResponsOut(response,jstr);
    },function (error) {
        console.log(result);
        ResponsOut(response,"");
    })
}*/



//exports.connectDB = connectDB;
//exports.QuerySql = QuerySql;
//exports.MassSql = MassSql;
//exports.QuerySqlNew = QuerySqlNew;
//exports.QuerySqlCO = QuerySqlCO;
//exports.MassSqlCO = MassSqlCO;
exports.AutoSqlQuery = AutoSqlQuery;