let express = require('express');
let dbHandle = require("../models/dbHandel");
let Board = require("../models/board")
let rank = require("../models/rank")
let Rank = dbHandle.getModel("rank");
let router = express.Router();

/* GET home page. */
global.time = "10min21s"
global.uname = ''
global.curLevel = ''
global.isWin = ''
global.pName = "未知"
global.webName = "未知"

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
    console.log(global.webName)
    res.render('result', {
        result: result,
        time: global.time,
        phonePeak: pName,
        webPeak: global.webName
    })
})
router.post('/game/result', function(req, res, next){

    let board = new Array(9)
    for(let i = 0; i < 9;i++){
        board[i] = req.body.board[i].split(',')
    }
    console.log(Board.checkValid(board))
    global.time = req.body.time
    global.curLevel = req.body.level
    global.uname = req.body.username
    // console.log(board)
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
            console.log()
            if(parseInt(global.time) < parseInt(doc.time && Board.checkValid(board))){
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
        res.send({
            status: 1,
            msg: '恭喜你过关了',
            time: req.body.time,
            name: req.body.username
        });
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
    let level = req.params.level
    res.render('board', {
        levelName: level,
        board: global.levels.level[parseInt(level-1)].array
    });
});
module.exports = router;
