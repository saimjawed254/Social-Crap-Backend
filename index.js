import express from "express";
import cors from "cors";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

import { sendMail } from "./utils/sendEmail.js";
import { sendOtp } from "./utils/sendOTP.js";

import { actual } from "./run.js";

import { Actual } from "./models/actualUserModel.js";
import { User } from "./models/userModel.js";

const app = express();
const router = express.Router();
app.use(cookieParser());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

config({ path: "./config.env" });
const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

let loggedIn = true;
let premium;

app.get("/", async (req, res) => {
  const data = await User.find({}).sort({'cescore': 'desc'}).limit(3)
  const length = await User.find({}).sort({'cescore': 'desc'})

  let top1,top2,top3;
  const dataArr=Array.from(data)
  top1={
    username : dataArr[0].username,
    pfp : dataArr[0].pfp,
    cescore : dataArr[0].cescore,
  }
  top2={
    username : dataArr[1].username,
    pfp : dataArr[1].pfp,
    cescore : dataArr[1].cescore,
  }
  top3={
    username : dataArr[2].username,
    pfp : dataArr[2].pfp,
    cescore : dataArr[2].cescore,
  }

  res.json({ 
    message: Array.from(length).length, 
    top1,
    top2,
    top3,
  });
});

router.post("/send", async (req, res, next) => {
  const { name, number, mail, message } = req.body;
  try {
    await sendMail({
      name,
      number,
      mail,
      message,
      subject: " MESSAGE FROM SOCIAL CRAP ",
    });
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try after some time.",
    });
  }
});



router.post("/signup", async (req, res) => {
  const { receiver } = req.body;

  let digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  otp = Number(otp);

  let checkUser = await Actual.findOne({ email: receiver });

  if (!checkUser) {
    let userEmail = await Actual.create({
      email: receiver,
      otp: otp,
      requestsCount: 0,
      premium : false
    });
  } else {
    let updatedUser = await Actual.findOneAndUpdate(
      { email: receiver },
      { $set: { otp: otp } }
    );
  }
  try {
    await sendOtp({
      subject: "SOCIAL CRAP OTP",
      receiver,
      otp,
    });
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try after some time.",
    });
  }
});

app.post("/otp-verify", async (req, res) => {
  const { otp, receiver } = req.body;

  let checkUser = await Actual.findOne({ email: receiver });
  premium = checkUser.premium

  if (checkUser.otp == otp) {
    const token = jwt.sign({ email: receiver }, "flamsaim7404", {
      expiresIn: "1h",
    });
    res.cookie("stringcookie", token, {
      maxAge: 3600000,
      httpOnly: true,
    });
    res.json({
      success: true,
      message: "User Authorized ",
    });
  } else {
    res.status(500).json({
      success: false,
      message: "OTP is incorrect. ",
    });
  }
});

router.post("/dashboard", isLoggedin, async (req, res) => {
  const { username } = req.body;
  const datafromActual = await actual(loggedIn, premium , username);
  if (datafromActual.message == "user error") {
    return res.status(500).json({
      success: false,
      message: "Please check that your account is public and your username is valid",
    });
  }
  const {
    pfp,
    name,
    bio,
    posts,
    followers,
    following,
  } = datafromActual.userData;
  const {
    avgLikes,
    likesArray,
    totalLikes,
  } = datafromActual.postLikes;

  const cescore=datafromActual.cescore;
  
  let checkUser = await User.findOne({ username : username });

  if (!checkUser) {
    let datacreate = await User.create({
      username,
      cescore,
      pfp,
      name,
      bio,
      posts,
      followers,
      following,
      avgLikes,
      likesArray,
      totalLikes,
      followersName:datafromActual.followersName,
      followingName:datafromActual.followingName,
    });
  } else {
    let updatedUser = await User.findOneAndUpdate(
      { username : username },
      { $set: { 
        pfp : pfp,
        cescore : cescore,
        bio: bio ,
        name: name,
        posts : posts,
        followers : followers,
        following : following,
        avgLikes : avgLikes,
        likesArray : likesArray,
        totalLikes: totalLikes,
        followersName : datafromActual.followersName,
        followingName : datafromActual.followingName,
        
       } }
    );
  }

  
  let i=1;
  let j=0;
  let c=0;
  const data = await User.find({}).sort({'cescore' : 'desc'})
  data.forEach((element) => {
    c=c+1;
    if(element.cescore === cescore){
      j=i;
    } else {
      i=i+1
    }
   
  });


  const rank = j;
  let beatsRank;
  if(j-1===0){
  beatsRank=100;
  } else{
  beatsRank =(100-Math.round(((j-1)/c)*100));
  }
  i=1;
  j=0;
  const dataavgLikes = await User.find({}).sort({'avgLikes' : 'desc'})
  dataavgLikes.forEach((element) => {
    if(element.avgLikes === avgLikes){
      j=i;
    } else {
      i=i+1
    }
   
  });

  let beatsavgLikes;
  if(j-1===0){
  beatsavgLikes=100;
  } else{
  beatsavgLikes=(100-Math.round(((j-1)/c)*100));
  }

  i=1;
  j=0;
  const datatotalLikes = await User.find({}).sort({'totalLikes' : 'desc'})
  datatotalLikes.forEach((element) => {
    if(element.totalLikes === totalLikes){
      j=i;
    } else {
      i=i+1
    }
   
  });

  let beatsTotalLikes;
  if(j-1===0){
  beatsTotalLikes=100;
  } else{
  beatsTotalLikes=(100-Math.round(((j-1)/c)*100));
  }

  res.json({
    message: "Received",
    datafromActual,
    rank : rank,
    beatsRank : beatsRank,
    beatsavgLikes : beatsavgLikes,
    beatsTotalLikes : beatsTotalLikes,
  });
});


app.use(router);

app.get("/logout", (req, res) => {
  res.cookie("stringcookie", "").json({
    success: true,
    message: "You have been logged out",
  });
});

function isLoggedin(req, res, next) {
  const token = req.cookies["stringcookie"];
  if (!token) {
    return res.status(500).json({
      success: false,
      message: "You need to login first",
    });
  }

  try {
    const data = jwt.verify(token, "flamsaim7404");
    req.user = data;
    next();
  } catch (error) {
    return res.json({
      success: false,
      message: "Invalid token",
    });
  }
}

app.listen(process.env.PORT);
