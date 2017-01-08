/**
 * Created by yidianyouxiu on 17/1/8.
 */


module.exports = function () {
    //获取时间戳
    var date = new Date();
//获取年份
    var year = date.getFullYear();
//获取月份，月份必须加 1
    var month = date.getMonth() + 1;
//获取日，注意是getdate不是getday
    var day = date.getDate();
//获取小时
    var hours = date.getHours();
//获取分钟
    var minutes = date.getMinutes();
//获取秒
    var seconds = date.getSeconds();

    month =  month <10 ? '0'+ month : month ;
    day = day<10   ? '0' + day : day ;
    seconds = seconds<10 ? '0' + seconds : seconds ;
    return year + '年' + month + '月' + day + '日' + hours + '时'+ minutes + '分' + seconds + '秒'
   // console.log(year + '年' + month + '月' + day + '日' + hours + '时'+ minutes + '分' + seconds + '秒'  )

}
