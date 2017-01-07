/**
 * Created by yidianyouxiu on 17/1/4.
 */

var db = require('../model/db');
var md5 = require('../model/md5');
exports.showIndex = function (req,res,next) {
    if(req.session.login == 1){
        var login = true;
        var username = req.session.username;

    }else {
        var login = false;
        var username = '';
    };

    db.find('users',{ username : username },function (err,result) {
        if(result.length == 0){
            var avatar = 'default.jpg';
        }else{
            var avatar =  result[0].avatar;
        }

        res.render('index',{
            'login':login,
            'username': username,
            'avatar': avatar,
            'active':'首页'
        });
    })




}

//展示切图页面
exports.showCut = function (req,res,next) {
    res.render('cut');
}

exports.showRegist = function (req,res,next) {
    res.render('regist');
}

//注册用户
exports.doregist = function (req,res,next) {
    //console.log(req.body.username);
    //查找数据库是否用户名重复
    db.find('users',{ 'username':req.body.username},function (err,result) {
    //服务器发生错误
       if(err){
           res.send('-3');//服务器错误
           return;
    //如果用户名重复了
       }else if(result.length != 0){
            var avatar = 'default.jpg';
            //用户名重复
            res.send('-1');
            return;
    //用户名不重复
       }else {
           //用MD5加密明码数据
            var md5password = md5(md5(req.body.password + 'zb'));
            //插入数据
           db.insertOne('users',{
               'username': req.body.username,
               'password': md5password,
               'avatar':'default.jpg'},
                function (err,result) {
               if(err){
                   res.send('-3');
                   return;
               }
           })

           req.session.login = '1';
           req.session.username = req.body.username;
           res.send('1');

       }
    })
};