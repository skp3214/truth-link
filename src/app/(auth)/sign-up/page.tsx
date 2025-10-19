"use client"
import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import * as z from "zod";
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
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
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, User, Mail, Lock, Sparkles } from 'lucide-react';
const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username && username.length > 2) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        setIsUsernameAvailable(null);
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setIsUsernameAvailable(response.data.success);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
          setIsUsernameAvailable(false);
        }
        finally {
          setIsCheckingUsername(false);
        }
      } else if (username && username.length > 0 && username.length <= 2) {
        setUsernameMessage('Username must be at least 3 characters long');
        setIsUsernameAvailable(false);
        setIsCheckingUsername(false);
      } else if (!username) {
        setUsernameMessage('');
        setIsCheckingUsername(false);
        setIsUsernameAvailable(null);
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.success("Account created successfully!", {
        description: response.data.message,
        action: {
          label: "Go to Verify",
          onClick: () => router.push(`/verify/${data.username}`),
        },
      });
      router.push(`/verify/${data.username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Sign up failed", {
        description: axiosError.response?.data.message ?? "Something went wrong. Please try again.",
        action: {
          label: "Retry",
          onClick: () => console.log("Retry signup"),
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
              <Sparkles className="w-8 h-8 text-white dark:text-slate-900" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-300 dark:to-amber-300 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Join TruthLink and start your anonymous journey
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Username Field */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <Input 
                          placeholder="Choose a unique username" 
                          {...field} 
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(e);
                            debounced(e.target.value);
                          }}
                          className="pl-10 h-12 border-yellow-200 dark:border-slate-600 focus:border-yellow-400 dark:focus:border-yellow-400 focus:ring-yellow-400/20 bg-white/50 dark:bg-slate-700/50"
                        />
                        {isCheckingUsername && (
                          <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-yellow-600" />
                        )}
                        {!isCheckingUsername && usernameMessage && (
                          <div className="absolute right-3 top-3">
                            {isUsernameAvailable === true ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : isUsernameAvailable === false ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {usernameMessage && (
                      <p className={`text-sm font-medium ${
                        isUsernameAvailable === true
                          ? 'text-green-600 dark:text-green-400'
                          : isUsernameAvailable === false
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-slate-700 dark:text-slate-300 font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <Input 
                          placeholder="Enter your email address" 
                          {...field}
                          type="email"
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
                          placeholder="Create a strong password" 
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

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 text-white dark:text-slate-900 font-semibold rounded-xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Sparkles className='mr-2 h-5 w-5' />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link 
                href="/sign-in" 
                className="font-semibold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms */}
          <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By creating an account, you agree to our{' '}
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

export default SignUpPage