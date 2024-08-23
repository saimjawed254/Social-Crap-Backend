import nodemailer from "nodemailer"

export const sendMail = async (mailData)=>{


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
               to:process.env.SMTP_MAIL_RECEIVER,
               subject:mailData.subject,
               text:"Name : "+mailData.name+"\n Number : "+mailData.number+"\n Email : "+mailData.mail+"\n Message : "+mailData.message,
           },

           );
       }
       catch(error){
       }

       try{
        transporter.sendMail({
           from:process.env.SMTP_MAIL,
           to:mailData.mail,
           subject:"From Saim Jawed",
           text:"Your message has been sent to me successfully.\n I will revert to you as soon as possible",
       },
       );
    }
    catch(error){
    }
}