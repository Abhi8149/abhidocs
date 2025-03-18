import { resend } from "../lib/resend";
import verificationEmail from "../email/verificationemail";
export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
){
 try {
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Abhi Docs | Verification Code',
        react: verificationEmail({username,otp:verifyCode}),
      });

    return {success:true,message:'Succesfully send verification email'}
    
 } catch (emailerror) {
    console.log('Falied to send verification email',emailerror);
    return {success:false,message:'Failed to send verification email'}
 }
}