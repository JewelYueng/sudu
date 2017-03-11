# 数独
##使用工具 node.js + mongoDB + pug
##使用说明：
###1.安装mongoDB
###2.打开mongoDB
###3.在控制台中输出`npm start`
###4.进入localhost::3000进入页面

# 要注意的地方
-有一个开放给其他端口的接口‘／getRank’
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
