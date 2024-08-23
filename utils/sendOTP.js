import nodemailer from "nodemailer"

export const sendOtp = async (mailData)=>{


    const transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure:false,
            service:process.env.SMTP_SERVICE,
            auth:{
                user:process.env.SMTP_MAIL,
                pass:process.env.SMTP_PASSWORD,
            }
            },
        )
        try{
            transporter.sendMail({
               from:process.env.SMTP_MAIL,
               to:mailData.receiver,
               subject:mailData.subject,
               text:"Your OTP for Social Crap Sign Up is : "+mailData.otp,
           },
           );
       }
       catch(error){
       }
    }