/**
 * Created by yidianyouxiu on 17/1/3.
 */

var MongoClient = require('mongodb').MongoClient
var settings = require('./settings');

//封装连接数据库操作
function _connectDB(callback)
{
    var url = settings.dburl;
    MongoClient.connect(url,function (err,db) {
        if(err){
            callback(err,null);
            return;
        }
        callback(err,db);
    });
};

exports.insertOne = function (collectionName, json,callback) {
    _connectDB(function (err,db) {
        db.collection(collectionName).insertOne(json,function (err,result) {
            callback(err,result);
            db.close();
        })
    })
};

//C是一个数组，查询条件，pagemount一页多少内容，page 页数，sort排序条件
exports.find = function (collectionName, json , C , D ) {
    var result = [];
    if(arguments.length == 3){
        var callback =  C ;
        var skipNumber = 0;
        var limit = 0;
    }else if(arguments.length == 4){
        var args = C;
        var callback = D ;
        var skipNumber = args.pagemount * args.page || 0;
        var limit = args.pagemount || 0;
        var sort = args.sort || {};
    }else{
        throw new Error('find函数的参数必须是三个或者四个');
        return;
    }

    _connectDB(function(err,db){
       var cursor =  db.collection(collectionName).find(json).skip(skipNumber).limit(limit).sort(sort);
       cursor.each(function (err , doc) {
           if(err){
               callback(err,null);
               db.close();
               return;
           }
           if(doc != null){
               result.push(doc);
           }else {
               callback(null,result);
               db.close();
           }
       })
    })
};

exports.deleteMany = function (collectionName,json,callback) {
    _connectDB(function (err,db) {
        db.collection(collectionName).deleteMany(json,
            function (err,results) {
            callback(err,results);
            db.close();
        })
    })
}

//更新记录
exports.update = function (collectionName , json1 , json2 ,callback ) {
    _connectDB(function (err,db) {
        db.collection(collectionName).update(
            json1,
            json2,
            function (err,result) {
                callback(err,result);
                db.close();
            }
        )
    })
}

//查询集合中有多少条记录
exports.getCount = function (collectionName,json,callback) {
    _connectDB(function (err,db) {
        db.collection(collectionName).count(json).then(function (count) {
            callback(err,count);
            db.close();
        })
    })
}

function init() {
    _connectDB(function (err,db) {
        if(err){
            console.log(err);
            return;
        }
        db.collection('users').createIndex(
            {'username':1},
            null,
            function (err,results) {
                if(err){
                    console.log(err);
                }
                console.log('索引建立成功');
            })
    })
}

init();


