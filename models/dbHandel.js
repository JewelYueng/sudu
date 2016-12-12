let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let models = require("./models");

for(let m in models){
	mongoose.model(m,new Schema(models[m]));
}



let _getModel = function(type){
	return mongoose.model(type);
};

module.exports.getModel = function (type) {
        return _getModel(type);
    };
	

