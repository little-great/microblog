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
app.get('/',router.showIndex);
app.get('/cut',router.showCut);
app.get('/docut',router.docut);
app.get('/regist',router.showRegist);
app.post('/doregist',router.doregist);
app.get('/login',router.showLogin);
app.post('/dologin',router.dologin);
app.get('/setavatar',router.showSetavatar);
app.post('/dosetavatar',router.dosetavatar);

app.listen(5000);
