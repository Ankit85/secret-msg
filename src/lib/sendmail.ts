import {resend} from "@/helpers/resend"
import VerificationEmail from "../../email/VerificationEmail";
import {ApiResponse} from "@/types/ApiResponse";

export default  async function sendmail(username:string,email:string,verificationCode:string):Promise<ApiResponse>{
    try{
        await resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: email,
                subject: 'Secret Message | Verification Code',
                react: VerificationEmail({username,otp:verificationCode}),
            })

        return {
            success: true,
            message:"Verification code sent to Email"
        }
}
    catch (e){
        console.log("Error while sending Email",e)
        return {
            success: false,
            message:"Failed to send verification Email"
        }
    }

}