//引用数据库操作模块
var dblib = require("./DBLib");
//引用服务模块
var server = require("./Server");

//输出sql结果
function outjsonresult(error,result,response) {
    if(error)
    {
        //有异常时输出异常
        server.ResponsOut(response,JSON.stringify(error));
    }else{
        
        //正常输出执行结果
        if(result.command=="SELECT"){
            server.ResponsOut(response,JSON.stringify(result.rows));
        }else{
            server.ResponsOut(response,JSON.stringify(result.rowCount));
        }
        
    }
}

//会员信息全文检索
exports.CustomerFullTextSearch = function (response,data) {
    //全文检索基础语句
    var basesql = "select * from customerdata where cdata#>>('{$path}')@@'$value'";    
    //获取传递过来的查询路径
    var path = data.path;    
    //获取查询关键字
    var value = data.value;    
    //获取查询语句
    var todosql = basesql.replace('$path',path).replace('$value',value);    
    //执行sql   
    dblib.ExcuteSql(todosql,function (error,result) {
        //输出sql语句执行结果
        outjsonresult(error,result,response);
    });   
}

//添加会员基本信息，注册新会员
exports.AddCustomerBasicInfo = function (response,data) {
    //新增会员信息基本语句
    var basesql = "insert into customerdata(cdata) values('$customerdata')";    
    //获取传递过来的用户信息
    var customerdata = data.customerdata;        
    //获取查询语句
    var todosql = basesql.replace('$customerdata',customerdata);    
    //执行sql   
    dblib.ExcuteSql(todosql,function (error,result) {
        //输出sql语句执行结果
        outjsonresult(error,result,response);
    });
    
}

//会员信息通用更新语句，可以进行任意位置的数据更新。
//值可以是简单的类型如string 也可以是json对象。
//如果最后一个路径不存在，则会新建路径该属性
exports.CommCustomerUpdate = function (response,data) {
    //系统用户编号
    var cid = data.cid;
    //路径信息
    var path = data.path;
    //值
    var val = data.val;
    //基本更新语句
    var basesql = "update customerdata set cdata = jsonb_set(cdata,'{#path}','#val',true)";
    //获取update语句
    var todosql = basesql.replace('#path',path).replace('#val',val);
    //执行sql   
    dblib.ExcuteSql(todosql,function (error,result) {
        //输出sql语句执行结果
        outjsonresult(error,result,response);
    });
}