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