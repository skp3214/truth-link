'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Send } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

const PublicProfilePage = () => {
  const params = useParams<{ username: string }>()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: params.username,
        content,
      })

      toast.success('Message sent!', {
        description: 'Your anonymous message has been sent successfully.',
      })
      setContent('')
    } catch (error: unknown) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to send message',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <MessageSquare className="w-16 h-16 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            Send Anonymous Message
          </h1>
          <p className="text-yellow-600 dark:text-yellow-400">
            to @{params.username}
          </p>
        </div>

        <Card className="bg-white/60 dark:bg-gray-800/60 border-yellow-200 dark:border-yellow-700/50">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-200 text-center">
              Your Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <Textarea
                placeholder="Write your anonymous message here..."
                className="min-h-[120px] bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 focus:border-yellow-400 dark:focus:border-yellow-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={300}
              />
              <div className="text-right text-sm text-yellow-600 dark:text-yellow-400">
                {content.length}/300
              </div>
              <Button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Your message will be sent anonymously. Please be respectful and kind.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage
