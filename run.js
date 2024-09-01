import scrape from "./main.js";

export async function actual(loggedIn, premium , username){

const data=await scrape(loggedIn, premium,username)

console.log(data)

if(data.message == "username invalid" || data.message == "private account" || data.message == "unexpected error"){
    return {
        data
    }
}
if(data.message == "login problem"){
    return {
        message : "login problem"
    }
}

var avgLikes;

if(data.postLikes == null){
    var totalLikes=0;
    avgLikes=0;
} else{
    const Likes=data.postLikes;
var totalLikes=0;
var i=0;
var num
const LikeSet=new Set()

Likes.map((e)=>{
    var digits=e.split('')
    num="";
    digits.map((e)=>{
        if(e!= ","){
            num=num+e
        }
    })
    LikeSet.add(Number(num))
    i=i+1;
})

const LikeArr = Array.from(LikeSet)
LikeArr.map((e)=>{
    totalLikes=totalLikes+e;
})

var avgLikes=Math.round(totalLikes/i);

}



const ratio = Math.round((data.userData.followers/data.userData.following)*100)/100;
const avgLikesScore=Math.round((avgLikes/data.userData.followers)*100)/100
const totalLikesScore=Math.round((totalLikes/data.userData.followers)*100)/100

const cescore = Math.round((ratio*0.2 + avgLikesScore*0.7 + totalLikesScore*0.1)*100)/100

let Followers;
let Following;
const NotFollowingBack=[]

if( data.followersName != null && data.followingName != null){
 Followers=Array.from(data.followersName)
 Following=Array.from(data.followingName)


Following.map((e)=>{
    if(!Followers.includes(e)){
        NotFollowingBack.push(e)
      }
})
}

console.log(NotFollowingBack)


const postData={
    avgLikes,
    totalLikes,
    likesArray : data.postLikes,
}

const userData={
    pfp:data.userData.src,
    name:data.userData.name,
    bio:data.userData.bio,
    followers:data.userData.followers,
    following:data.userData.following,
    posts:data.userData.posts,
}

const userRecords={
    userData,
    followersName : data.followersName,
    followingName : data.followingName,
    NotFollowingBack,
    postLikes : postData,
    cescore,
}


return userRecords;
}