// 9RrkG9kNJFiyw5x9

import { mongoose } from "mongoose";

mongoose.connect('mongodb+srv://saimjawed254:9RrkG9kNJFiyw5x9@cluster0.lfbja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    cescore : {
        type : Number,
    },
    pfp : {
        type : String
    },
    name:{
        type : String,
    },
    bio : {
        type : String
    },
    posts : {
        type : Number,
    },
    followers : {
        type : Number,
    },
    following : {
        type : Number,
    },
    avgLikes : {
        type : Number,
    },
    likesArray : [
        {
            type : String,
        }
    ],
    totalLikes : {
        type : Number,
    },
    followersName : Array,
    followingName : Array
})

export const User = mongoose.model("User", userSchema)