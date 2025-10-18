"use client"
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import * as z from "zod";
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2, Eye, EyeOff, User, Lock, LogIn, Sparkles } from 'lucide-react';

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast("Sign in failed", {
          description: "Invalid credentials. Please check your email/username and password.",
          action: {
            label: "Retry",
            onClick: () => console.log("Retry sign in"),
          },
        });
      } else if (result?.url) {
        toast("Welcome back!", {
          description: "You have successfully signed in to TruthLink.",
          action: {
            label: "Continue",
            onClick: () => router.replace('/dashboard'),
          },
        });
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error("Error in sign in", error);
      toast("Sign in failed", {
        description: "Something went wrong. Please try again.",
        action: {
          label: "Retry",
          onClick: () => console.log("Retry sign in"),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-yellow-400/5 dark:bg-slate-400/5" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 2px, transparent 2px), radial-gradient(circle at 75% 75%, #fbbf24 2px, transparent 2px)`,
               backgroundSize: '60px 60px',
               backgroundPosition: '0 0, 30px 30px'
             }}>
        </div>
      </div>
      
      <div className="w-full max-w-md relative">
        {/* Main Card */}
        <div className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-yellow-200/50 dark:border-slate-700/50 rounded-2xl shadow-2xl shadow-yellow-500/10 dark:shadow-slate-900/50 p-8 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 dark:from-yellow-300 dark:to-amber-400 rounded-2xl shadow-lg shadow-yellow-500/25 mb-4">
              <LogIn className="w-8 h-8 text-white dark:text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-300 dark:to-amber-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to continue your TruthLink journey
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Identifier Field */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Email or Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <Input 
                          placeholder="Enter your email or username" 
                          {...field}
                          className="pl-10 h-12 border-yellow-200 dark:border-slate-600 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-yellow-400/20 bg-white/50 dark:bg-slate-700/50"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <Input 
                          placeholder="Enter your password" 
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10 h-12 border-yellow-200 dark:border-slate-600 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-yellow-400/20 bg-white/50 dark:bg-slate-700/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Forgot Password */}
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 text-white dark:text-slate-900 font-semibold rounded-xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className='mr-2 h-5 w-5' />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link 
                href="/sign-up" 
                className="font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
