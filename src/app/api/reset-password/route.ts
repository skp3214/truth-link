import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import { resetPasswordSchema } from '@/schemas/passwordResetSchema';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { token, newPassword } = await request.json();
    
    const result = resetPasswordSchema.safeParse({ token, newPassword });
    if (!result.success) {
      return Response.json(
        { success: false, message: 'Invalid input' },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return Response.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return Response.json(
      { success: true, message: 'Password reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reset password:', error);
    return Response.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
