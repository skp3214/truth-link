'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Copy, RefreshCw, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Message } from '@/models/message.model'
import MessageCard from '@/components/MessageCard'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import * as z from 'zod'

type AcceptMessageFormData = z.infer<typeof acceptMessageSchema>

const DashboardPage = () => {
  const { data: session } = useSession()

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')

  const { register, watch, setValue } = useForm<AcceptMessageFormData>({
    resolver: zodResolver(acceptMessageSchema),
  })

  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message._id !== messageId))
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('URL Copied!', {
      description: 'Profile URL has been copied to clipboard.',
    })
  }

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages as boolean)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description: axiosError.response?.data.message ?? 'Failed to fetch messages',
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success('Refreshed Messages', {
          description: 'Showing latest messages',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description: axiosError.response?.data.message ?? 'Failed to fetch messages',
      })
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return
    fetchAcceptMessages();
    fetchMessages();

    const { username } = session.user;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;
    setProfileUrl(profileUrl);
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast.success('Success', {
        description: response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description: axiosError.response?.data.message ?? 'Failed to update message settings',
      })
    }
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-black dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-yellow-400/5 dark:bg-yellow-400/10"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 2px, transparent 2px), radial-gradient(circle at 75% 75%, #fbbf24 2px, transparent 2px)`,
              backgroundSize: '60px 60px',
              backgroundPosition: '0 0, 30px 30px'
            }}>
          </div>
        </div>
        <div className="text-center relative">
          <h1 className="text-xl md:text-2xl font-bold text-yellow-800 dark:text-yellow-300">Please sign in</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-black dark:via-gray-900 dark:to-gray-800 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-yellow-400/5 dark:bg-yellow-400/10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #fbbf24 2px, transparent 2px), radial-gradient(circle at 75% 75%, #fbbf24 2px, transparent 2px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }}>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6 relative">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-800 dark:text-yellow-300 mb-2">
            User Dashboard
          </h1>
          <p className="text-sm md:text-base text-yellow-600 dark:text-yellow-200">
            Manage your anonymous messaging experience
          </p>
        </div>

        {/* Copy Your Link Section */}
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 md:p-6 border border-yellow-200 dark:border-yellow-700/50">
          <h2 className="text-xl md:text-2xl font-semibold text-yellow-800 dark:text-yellow-300 mb-4">
            Copy Your Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 bg-yellow-50 dark:bg-gray-700 border-yellow-300 dark:border-gray-600 text-yellow-800 dark:text-yellow-200"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-yellow-600 dark:bg-yellow-500 hover:bg-yellow-700 dark:hover:bg-yellow-600 text-white px-6"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Toggle */}
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 md:p-6 border border-yellow-200 dark:border-yellow-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-yellow-800 dark:text-yellow-300">
                Accept Messages
              </h3>
              <p className="text-yellow-600 dark:text-yellow-200 text-sm">
                Allow others to send you anonymous messages
              </p>
            </div>
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600"
            />
          </div>
        </div>

        {/* Refresh Messages */}
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 md:p-6 border border-yellow-200 dark:border-yellow-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-yellow-800 dark:text-yellow-300">
                Messages
              </h3>
              <p className="text-yellow-600 dark:text-yellow-200 text-sm">
                Refresh to get your latest messages
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              variant="outline"
              className="border-yellow-600 dark:border-yellow-400 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Messages Display */}
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
              <MessageSquare className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                No messages yet
              </h3>
              <p className="text-yellow-600 dark:text-yellow-200 text-sm md:text-base">
                When you receive anonymous messages, they will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
