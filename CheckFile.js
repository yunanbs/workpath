//引用文件模块
var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    server = require('./Server');

//获取指定路径下的文件列表
function GetFileList(filepath,callback) {
    fs.readdir(filepath,function (error,result) {
        if(error){
            callback(error);
        }else{
            callback(null,result);
        }
    });
}

//读取文件
function ReadFile(filename,callback) {
    fs.readFile(filename,{encoding:'utf8'},function (error,result) {
         if(error){
            callback(error);
        }else{
            callback(null,result);
        }
    })
}

//读取包含关键字的文件
function ReadFileByType(typename,filename,callback) {
    if(filename.indexOf(typename)>0){
        ReadFile(filename,callback);
    }
}

exports.GetFileList = function (response,data) {
    var filepath = data.path;
    GetFileList(filepath,function (error,result) {
        console.log('in callback');
        if(error){
            console.log(error);
        }else{
            console.log(result);
        }
        var jsonresult = JSON.stringify(result);
        server.ResponsOut(response,jsonresult);
    });
}

exports.ReadFile = function (response,data) {
    ReadFile(data.filename,function (error,result) {
        console.log('in callback');
        if(error){
            console.log(error);
        }else{
            console.log(result);
        }
        var jsonresult = JSON.stringify(result);
        server.ResponsOut(response,jsonresult);
    });
}

exports.ReadFileByType = function (response,data) {
    var filecache = '';
    var errorcache = '';
    async.auto({
        getlist:function (cb) {
            GetFileList(data.path,cb);
        },
        
        readfile:['getlist',function (results,cb) {
            var filelist = results.getlist;
            for(var i=0;i<filelist.length;i++){
                var filename = data.path+filelist[i];
                ReadFileByType(data.filetype,filename,function (error,result) {
                    if(error){
                        errorcache = errorcache+error;
                    }else{
                        filecache = filecache+result;
                    }
                    
                });
            }
            
            cb(errorcache,filecache);
        }],
        outfile:['readfile',function (results,cb) {
            cb(errorcache,filecache);
        }]
        
    }
    ,function (error,results) {
         console.log('in callback');
        if(error){
            console.log(error);
        }else{
            console.log(results);
        }
        var jsonresult = JSON.stringify(results.readfile);
        server.ResponsOut(response,jsonresult);
    });
}