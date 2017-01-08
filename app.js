/**
 * Created by yidianyouxiu on 17/1/3.
 */

var express = require('express');
var app = express();
var router = require('./router/router')
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.urlencoded({extended: false }));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.set('view engine','ejs')

//静态页面
app.use(express.static('./public'));
app.use('/avatar', express.static('./avatar'));


//路由表
app.get('/',router.showIndex);                          //显示首页
app.get('/regist',router.showRegist);                   //显示注册页面
app.post('/doregist',router.doregist);                  //执行注册
app.get('/login',router.showLogin);                     //显示登录页面
app.post('/dologin',router.dologin);                    //执行登录
app.get('/setavatar',router.showSetavatar);             //显示上传头像页面
app.post('/dosetavatar',router.dosetavatar);            //执行上传头像操作
app.get('/cut',router.showCut);                         //显示剪裁页面
app.get('/docut',router.docut);                         //执行剪裁
app.post('/release',router.dopost);                     //发表说说
app.get('/getAllshuoshuo',router.getAllshuoshuo);       //获得数据库中所有说说
app.get('/getCount',router.getCount);                   //获取评论总数，制作分页功能
app.get("/user/:user",router.showUser);                 //显示用户所有说说
app.get('/userlist',router.showUserlist)                //显示所有用户

app.listen(5000);
