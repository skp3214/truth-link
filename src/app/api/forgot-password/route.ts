import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import { forgotPasswordSchema } from '@/schemas/passwordResetSchema';
import { Resend } from 'resend';
import PasswordResetEmail from '../../../../emails/PasswordResetEmail';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { identifier } = await request.json();
    
    const result = forgotPasswordSchema.safeParse({ identifier });
    if (!result.success) {
      return Response.json(
        { success: false, message: 'Invalid input' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
      isVerified: true,
    });

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Reset Your Password - Truth Link',
      react: PasswordResetEmail({ username: user.username, resetUrl }),
    });

    if (!emailResponse.data) {
      return Response.json(
        { success: false, message: 'Failed to send email' },
        { status: 500 }
      );
    }

    return Response.json(
      { success: true, message: 'Password reset email sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in forgot password:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
