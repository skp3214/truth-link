'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/schemas/passwordResetSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import * as z from 'zod';

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      newPassword: '',
    },
  });

  useEffect(() => {
    if (token) {
      form.setValue('token', token);
    }
  }, [token, form]);

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/reset-password', data);
      toast.success("Password reset successfully!", {
        description: "You can now sign in with your new password.",
        action: {
          label: "Go to Sign In",
          onClick: () => router.replace('/sign-in'),
        },
      });
      setTimeout(() => router.push('/sign-in'), 2000);
    } catch (error: any) {
      toast.warning("Error", {
        description: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-md border border-gray-800 text-center">
          <h1 className="text-2xl font-bold text-red-400">Invalid Reset Link</h1>
          <p className="text-gray-300">The password reset link is invalid or missing.</p>
          <Link href="/forgot-password" className="text-yellow-400 hover:text-yellow-300">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-md border border-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-yellow-400">
            Reset Password
          </h1>
          <p className="mb-4 text-gray-300">Enter your new password</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              {...form.register('newPassword')}
              type="password"
              placeholder="New Password"
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400"
            />
            {form.formState.errors.newPassword && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-400">
            Remember your password?{' '}
            <Link href="/sign-in" className="text-yellow-400 hover:text-yellow-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
