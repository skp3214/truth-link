import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { render } from "@react-email/render";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));
        
        await resend.emails.send({
            from:'onboarding@resend.dev',
            to:email,
            subject:"Verification Code Truth-Link",
            html: emailHtml
        })
        return {success:true,message:"Verification email sent successfully"}
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return {success:false,message:'Failed to send verification email'}
    }
}
