let express = require('express');
let dbHandle = require("../models/dbHandel");
let Board = require("../models/board")
let request = require('request');
let rank = require("../models/rank")
let Rank = dbHandle.getModel("rank");
let router = express.Router();
let levels = require("../models/level")
/* GET home page. */
global.time = "10min21s"
global.uname = ''
global.curLevel = '1'
global.isWin = ''
//全服最高分
global.pName = "未知"
//本区最高分
global.webName = "未知"
//初始化本服排行榜
global.localRank = [
    {uname: "null", level: "1", time: "1"},
    {uname: "null", level: "2", time: "1"},
    {uname: "null", level: "3", time: "1"},
    {uname: "null", level: "4", time: "1"}
]
global.url = "http://192.168.43.125:8080/Android/AllRanking_android"
let android_rank
//初始化全服排行榜
global.totalRank = [
    {uname: "null", level: "1", time: "9999"},
    {uname: "null", level: "2", time: "9999"},
    {uname: "null", level: "3", time: "9999"},
    {uname: "null", level: "4", time: "9999"}
]

//获取排行榜信息
rank.find_all(Rank,function(err,doc){
    if(err){
        console.log(err)
    }else if(!doc){
        console.log('no rank')
    }
    global.localRank = doc
    console.log(global.localRank)
})
//获取全服排行榜
rank.getTotalRank(global.localRank)

//路由分发
router.get('/', function(req, res, next) {
  res.render('hello', {
    webTitle: 'web_sudu', helloText: '欢迎来到我们的数独游戏'
  });
});
router.get('/introduce', function (req, res, next) {
   res.render('introduce');
});
router.get('/start', function (req, res, next) {
    res.render('game');
});
router.get('/contact', function (req, res, next) {
    res.render('contact');
});
router.get('/game/result', function(req, res, next){

    let result = ''

    if(global.isWin){
        result = "恭喜你成功完成了数独"
    }else{
        result = "非常抱歉，你提交的数独并不合法"
    }

    //请求全服信息
    // request(url, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         android_rank = JSON.parse(body)
    //         console.log(android_rank[0]) //输出获得的数据
    //     }
    // })
    // for(let i = 0;i < global.levels.length; i++){
    //     if(global.localRank[i])
    // }
    // console.log(global.localRank[parseInt(global.curLevel) - 1].uname)
    rank.getTotalRank(global.localRank)

    res.render('result', {
        result: result,
        time: global.time
    })
})
router.post('/game/result', function(req, res, next){

    let board = new Array(9)
    for(let i = 0; i < 9;i++){
        board[i] = req.body.board[i].split(',')
    }

    global.time = req.body.time
    global.curLevel = req.body.level
    global.uname = req.body.username
    console.log(board)
    // let test = [
    //     ["3","1","6","2","8","7","4","5","9"],
    //     ["2","8","7","4","5","9","3","1","6"],
    //     ["4","5","9","3","1","6","2","8","7"],
    //     ["1","6","3","8","7","2","5","9","4"],
    //     ["8","7","2","5","9","4","1","6","3"],
    //     ["5","9","4","1","6","3","8","7","2"],
    //     ["6","3","1","7","2","8","9","4","5"],
    //     ["7","2","8","9","4","5","6","3","1"],
    //     ["9","4","5","6","3","1","7","2","8"]
    // ]

    rank.find_peak(Rank,global.uname,global.curLevel,global.time,function (err, doc) {
        if(err){
            console.log('500')
        }else if(!doc){
            if(Board.checkValid(board)) {
                rank.add_peak(Rank, global.uname, global.curLevel, global.time, function (err, doc) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(doc)
                    }
                })
            }
        }else{
            if(parseInt(global.time) < parseInt(doc.time) && Board.checkValid(board)){
                console.log("update success")
                rank.update_peak(Rank,global.uname,global.curLevel,global.time,function(err,doc){
                    if(err){
                        console.log(err)
                    }else{
                        console.log(doc)
                    }
                })
            }else {
                console.log("用时不是最短的")
            }
        }
    })

    rank.find_peak(Rank,global.uname,global.curLevel,global.time,function (err, doc){
        if(err){
            console.log(err)
        }else if(!doc){
            console.log("找不到这一关")
        }else{
            console.log("find_peak is" + doc.uname)
            global.webName = doc.uname
        }
    })

    if(Board.checkValid(board)){
        global.isWin = true
        rank.find_peak(Rank,global.uname,global.curLevel,global.time,function(err, doc){
            if(err){
                console.log(err)
            }else if(!doc){
                console.log("找不到这一关")
            }else{
                rank.find_all(Rank,function(err,doc){
                    if(err){
                        console.log(err)
                    }else if(!doc){
                        console.log('no rank')
                    }
                    global.localRank = doc
                    console.log(global.localRank)
                })
                rank.getTotalRank()
                res.send({
                    status: 1,
                    msg: '恭喜你过关了',
                    time: req.body.time,
                    name: req.body.username
                });
            }
        })

    }else{
        global.isWin = false
        res.send({
            status: 0,
            msg: 'submit succeed!But you lose',
            time: req.body.time,
            name: req.body.username
        });
    }

});
router.get('/game/:level', function (req, res, next) {
    global.curLevel = req.params.level


    res.render('board', {
        levelName: global.curLevel,
        board: levels.getAllLevel().level[parseInt(global.curLevel-1)].array
    });
});
//开放给其他端的接口
router.get('/getRank', function (req, res, next) {
    rank.find_all(Rank,function (err, doc) {
        if(err) console.log(err)
        else if(!doc){
            res.send(global.localRank)
        }else{
            res.send(doc)
        }
    })
})
router.get('/rank',function (req, res, next) {
    console.log(global.totalRank)

    // rank.getTotalRank(global.localRank)
    // request(url, function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         console.log(body) //输出获得的数据
    //     }
    //     console.log(body)
    // })
    rank.getTotalRank(global.localRank)
    res.render('rank',{
        localRank:global.localRank,
        totalRank:global.totalRank
    })
})
module.exports = router;
