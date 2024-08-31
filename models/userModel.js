
import { mongoose } from "mongoose";
import { config } from "dotenv";

config({ path: "../config.env" });

mongoose.connect(process.env.mongodbConnect)

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