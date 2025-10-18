'use client';

import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      });

      toast.success('Account verified successfully!', {
        description: 'You can now sign in to your account.',
        action: {
          label: 'Sign In',
          onClick: () => router.replace('/sign-in'),
        },
      });
      
      // Redirect to sign-in page after successful verification
      setTimeout(() => {
        router.replace('/sign-in');
      }, 1500);
      
    } catch (error) {
      console.error('Error in verification:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Verification failed', {
        description: axiosError.response?.data.message ?? 'Invalid verification code. Please try again.',
        action: {
          label: 'Retry',
          onClick: () => form.reset({ code: '' }),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await axios.post('/api/resend-verification', {
        username: params.username,
      });
      toast.success('Verification code sent!', {
        description: 'Please check your email for the new verification code.',
      });
    } catch (error) {
      console.error('Error resending code:', error);
      toast.error('Failed to resend code', {
        description: 'Please try again later.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-slate-600 dark:text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        {/* Main card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Verify Your Account
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Enter the 6-digit verification code sent to your email
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 font-medium">
              Username: {params.username}
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Verification Code Field */}
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter 6-digit code"
                          {...field}
                          maxLength={6}
                          className="text-center text-lg font-mono tracking-widest h-14 border-2 border-slate-200 dark:border-slate-600 focus:border-yellow-500 dark:focus:border-yellow-400 rounded-xl bg-white/50 dark:bg-slate-700/50 placeholder:text-slate-400"
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            // Only allow numeric input
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                        {field.value?.length === 6 && (
                          <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !form.watch('code') || form.watch('code').length !== 6}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 text-white dark:text-slate-900 font-semibold rounded-xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Verify Account
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Resend code section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendCode}
              className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-medium text-sm underline underline-offset-4 hover:no-underline transition-all"
            >
              Resend verification code
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Need help?{' '}
            <a
              href="/contact"
              className="text-yellow-600 dark:text-yellow-400 hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;