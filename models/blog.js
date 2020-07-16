var mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date, default:Date.now},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});

module.exports = mongoose.model("Blog", blogSchema);