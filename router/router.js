/**
 * Created by yidianyouxiu on 17/1/4.
 */

var db = require('../model/db');
var md5 = require('../model/md5');
var gm =require('gm');
var fs =require('fs');
var fm = require('formidable');
var time = require('../model/date');
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
    res.render('cut',{
        'avatar':req.session.avatar
    });
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

//显示登录页面
exports.showLogin = function (req,res,next) {
    res.render('login');
}

//执行登录业务
exports.dologin = function (req,res,next) {
    //查询数据库
    db.find('users',{
        'username':req.body.username
    },function (err,result) {
        if(err){
            res.send('-3');
            return;
            //如果查询不到用户名，则用户不存在
        }else if (result.length == 0){
            res.send('-2');
            return;
        }else {
            var md5password = md5(md5(req.body.password + 'zb'));
            //如果密码不一样则密码错误
            if(md5password !== result[0].password){
                res.send('-1');
                return;
                //登录成功
            }else{
                req.session.login = '1';
                req.session.username = req.body.username;
                res.send('1');
                return;
            }
        }
    })
};

exports.showSetavatar = function (req,res,next) {
    res.render('setavatar');
};

exports.dosetavatar = function (req,res,next) {

    if(req.session.login !== '1'){
        res.end('请先登录再设置头像');
        return;
    }

        // parse a file upload
        //表单中的文件input一定要设置name否则上传不了，切记
        var form = new fm.IncomingForm();

        //先设置路径，dirname是从系统根目录到当前文件的地址
        //如果不设置，则上传文件夹是uploadDir: '/var/folders/42/bn16b5c12w1b6jw5mqjh0ghc0000gn/T'
        //不知道什么鬼
         form.uploadDir = __dirname + '/../avatar';

        //console.log(form);
        form.parse(req, function (err, fields, files) {
            //console.log(files);

            //改文件名，注意，path变量的位置是files.touxiang.path
            var old = files.touxiang.path;
            var newpath = __dirname + '/../avatar/' + req.session.username + '.jpg';
            fs.rename(old, newpath, function (err) {

                if(err){
                    res.send('上传失败');
                    return;
                }
                req.session.avatar = req.session.username + '.jpg';
                res.redirect('/cut');
            })

        });

};

exports.docut = function (req,res,next) {
    gm(__dirname + '/../avatar/'+ req.session.avatar)
    .crop(
        req.query.w,
        req.query.h,
        req.query.x,
        req.query.y )
    .resize(100, 100, "!")
    .write(__dirname + '/../avatar/'+ req.session.avatar,function (err) {
        if(err){
            console.log(err);
            res.send('-1');
            return;
        }
        db.update('users',{'username' : req.session.username},{
            $set:{'avatar': req.session.avatar}
        },function (err) {
            if(err){
                console.log(err);
            }
            res.send('1');
        })
    })
};

//发表说说
exports.dopost = function (req,res,next) {
    //console.log(req.body.username);
    //必须保证登陆
    if (req.session.login != "1") {
        res.end("非法闯入，这个页面要求登陆！");
        return;
    }

    //插入数据
    var time2 = time()
    db.insertOne('posts', {
            'username': req.session.username,
            'content': req.body.content,
            'datetime': time2
        },
        function (err, result) {
            if (err) {
                //服务器错误
                res.send('-3');
                return;
            }
            res.send("1"); //发表成功
        })
};

exports.getAllshuoshuo = function (req,res,next) {
    db.find('posts',{},{'pagemount':10,'page': req.query.page,'sort':{'datetime' : -1 }},function (err,result) {
        if(err){
            console.log(err);
            return;
        }
        res.json(result);
    })
}