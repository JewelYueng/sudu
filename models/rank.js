/**
 * Created by jewel on 2016/12/10.
 */
module.exports.find_peak = function(Rank,uname,level,time,callback){

    Rank.findOne({curLevel:level},function (err,doc) {
        callback(err,doc);
    });
}
module.exports.add_peak = function(Rank,uname,level,time,callback){
    Rank.create({
        uname: uname,
        curLevel: level,
        time: time
    },function(err,doc){
        callback(err,doc);
    });
};


module.exports.update_peak = function(Rank,uname,level,time,callback){

    Rank.update({curLevel:level},{$set:{uname:uname,time:time,curLevel:level}},function(err,doc){
        callback(err,doc);
    })
}

module.exports.find_all = function(Rank,callback){
    Rank.find({},function(err, doc){
        callback(err,doc);
    }).sort({curLevel:1})
}
// {uname: "null", level: "4", time: "9999"}
module.exports.getTotalRank = function(){
    let request = require('request');
    let co = require('co')

        request(global.url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                global.android_rank = JSON.parse(body)
                for (let i = 0; i < 4; i++) {
                    for (let j = 0; j < 4; j++) {
                        if (parseInt(global.android_rank[i].title) == parseInt(global.localRank[j].curLevel)) {
                            if (parseInt(global.android_rank[i].usetime) < parseInt(global.localRank[j].time)) {
                                global.totalRank[i] = {
                                    "uname": global.android_rank[i].username,
                                    "level": global.android_rank[i].title,
                                    "time": global.android_rank[i].usetime
                                }
                            }
                            else
                                global.totalRank[i] = {
                                    "uname": global.localRank[j].uname,
                                    "level": global.localRank[j].curLevel,
                                    "time": global.localRank[j].time
                                }

                        }
                    }
                }
                global.pName = totalRank[parseInt(global.curLevel) - 1].uname
                console.log(global.totalRank)
                console.log("peak is "+ global.pName)

            }

        })
}
