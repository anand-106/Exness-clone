import sgMail from "@sendgrid/mail";

import dotenv from 'dotenv';
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(email:string,data:any){

    const msg = {
        to: email,
        from: "anands2003106@gmail.com",
        subject: "Order Update",
        text: "Order Update",
        html: `<p>${data}</p>`,
      };

      try{
 
          await sgMail.send(msg);
        }
        catch(err){
            console.error("error sending email :",err)
        }
      

}