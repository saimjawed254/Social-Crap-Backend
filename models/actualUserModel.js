

import { mongoose } from "mongoose";

mongoose.connect('mongodb+srv://saimjawed254:9RrkG9kNJFiyw5x9@cluster0.lfbja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const actualSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    otp : {
        type : Number,
        required : true,
    },
    requestsCount : {
        type : Number,
        required : true,
    },
    premium : {
        type : Boolean,
        required : true,
    }
})

export const Actual = mongoose.model("Actual", actualSchema)