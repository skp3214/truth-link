'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/schemas/passwordResetSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import * as z from 'zod';

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/forgot-password', data);
      toast.success("Password reset link sent!", {
        description: "Check your email for the reset link.",
        action: {
          label: "Go to Dashboard",
          onClick: () => router.replace('/dashboard'),
        },
      });
      setEmailSent(true);
    } catch (error: any) {
      toast.warning("Error", {
        description: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-md border border-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-yellow-400">
            Forgot Password
          </h1>
          <p className="mb-4 text-gray-300">Enter your email or username to reset your password</p>
        </div>
        
        {!emailSent ? (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                {...form.register('identifier')}
                placeholder="Email or Username"
                className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400"
              />
              {form.formState.errors.identifier && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.identifier.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-400">Reset link sent successfully!</p>
            <div className="space-y-2">
              <Link href="/dashboard">
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          </div>
        )}
        
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
