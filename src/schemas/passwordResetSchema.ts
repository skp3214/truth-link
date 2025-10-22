import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
