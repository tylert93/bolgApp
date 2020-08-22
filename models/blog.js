import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({
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

export const Blog = mongoose.model("Blog", blogSchema);