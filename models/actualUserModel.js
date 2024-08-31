import { mongoose } from "mongoose";
import { config } from "dotenv";

config({ path: "../config.env" });

mongoose.connect(process.env.mongodbConnect)

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