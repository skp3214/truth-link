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

  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user?.username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`
      setProfileUrl(`${baseUrl}/u/${session?.user.username}`)
    }
  }, [session?.user?.username])

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('URL Copied!', {
      description: 'Profile URL has been copied to clipboard.',
    })
  }, [profileUrl])

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages as boolean);
    } catch {
      toast.error('Error', {
        description: 'Failed to fetch message',
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
      setMessages(response.data.messages || []);
      if (response.data.messages?.length == 0) {
        toast.info("No Messages", {
          description: "You have no messages"
        });
      }
      if (response.data.messages?.length != 0 && refresh) {
        toast.success('Refreshed Messages!', {
          description: 'Showing latest messages.',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error in fetching message', {
        description: axiosError.message,
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return
    fetchAcceptMessages();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      })
      setValue('acceptMessages', !acceptMessages)
      toast.success('Success', {
        description: response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description: axiosError.message,
      });
    }
  }


  const handleMessageDelete = useCallback((messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }, [messages])


  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-yellow-800 dark:text-yellow-200">Please sign in</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            User Dashboard
          </h1>
          <p className="text-sm md:text-base text-yellow-600 dark:text-yellow-400">
            Manage your anonymous messaging experience
          </p>
        </div>

        {/* Copy Your Link Section */}
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 md:p-6 border border-yellow-200 dark:border-yellow-700/50">
          <h2 className="text-xl md:text-2xl font-semibold text-yellow-800 dark:text-yellow-200 mb-4">
            Copy Your Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-sm md:text-base"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-yellow-600 hover:bg-yellow-700 text-white w-full sm:w-auto"
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
              <h3 className="text-lg md:text-xl font-semibold text-yellow-800 dark:text-yellow-200">
                Accept Messages
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                Allow others to send you anonymous messages
              </p>
            </div>
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
        </div>

        {/* Refresh Messages */}
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 md:p-6 border border-yellow-200 dark:border-yellow-700/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-yellow-800 dark:text-yellow-200">
                Messages
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                Refresh to get your latest messages
              </p>
            </div>
            <Button
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white w-full sm:w-auto"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Messages Display */}
        <div className="space-y-4">
          {messages.length > 0 ? (
            <div className="grid gap-4">
              {messages.map((message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  onMessageDelete={handleMessageDelete}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-6 md:p-8 border border-yellow-200 dark:border-yellow-700/50 text-center">
              <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                No messages yet
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm md:text-base">
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
