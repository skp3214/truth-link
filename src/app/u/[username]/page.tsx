'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Send, Lightbulb, X } from 'lucide-react'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useCompletion } from '@ai-sdk/react'

const PublicProfilePage = () => {
  const params = useParams<{ username: string }>()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false) // Don't show by default
  const [hasLoadedInitial, setHasLoadedInitial] = useState(true) // Skip auto-load
  const [hasError, setHasError] = useState(false)

  const { completion, complete, isLoading: isGenerating } = useCompletion({
    api: '/api/suggest-messages',
    onFinish: (prompt, completion) => {
      console.log('Completion finished:', completion)
      const parsedSuggestions = completion
        .split('||')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .slice(0, 3)

      setSuggestions(parsedSuggestions)
      setShowSuggestions(true)
      setHasLoadedInitial(true)
      setHasError(false) // Reset error state on success
    },
    onError: (error) => {
      console.error('Error generating suggestions:', error)
      setHasError(true)
      setHasLoadedInitial(true)
      // Only show error toast if it's not a rate limit error
      const errorMessage = error?.message || '';
      if (!errorMessage.includes('quota') && !errorMessage.includes('429')) {
        toast.error('Failed to generate suggestions')
      }
    }
  })

  // Don't auto-load suggestions on mount to prevent quota issues
  // useEffect(() => {
  //   const loadInitialSuggestions = async () => {
  //     try {
  //       console.log('Loading initial suggestions...')
  //       await complete('')
  //     } catch (error) {
  //       console.error('Error loading initial suggestions:', error)
  //       setHasLoadedInitial(true)
  //     }
  //   }

  //   loadInitialSuggestions()
  // }, [complete])

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
      toast.success(response.data.message, {
        description: response.data.message,
      })
      setContent('')
      setShowSuggestions(false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to send message';
      toast.info('Info', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setContent(suggestion)
    setShowSuggestions(false)
  }

  const handleGetSuggestions = async () => {
    // Don't make API call if there was a previous error (likely quota exceeded)
    if (hasError) {
      toast.warning('Suggestions temporarily unavailable', {
        description: 'Please try again later or write your message manually.'
      })
      return
    }

    console.log('Generating suggestions for content:', content)
    try {
      setSuggestions([])
      setShowSuggestions(true)
      await complete(content.trim() || '')
    } catch (error) {
      console.error('Error generating suggestions:', error)
      setHasError(true)
      // Only show error toast if it's not a rate limit error
      const errorMessage = error instanceof Error ? error.message : '';
      if (!errorMessage.includes('quota') && !errorMessage.includes('429')) {
        toast.error('Failed to generate suggestions')
      }
    }
  }

  const handleCloseSuggestions = () => {
    setShowSuggestions(false)
  }

  const displaySuggestions = completion
    ? completion
      .split('||')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 3)
    : suggestions

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-800 dark:text-yellow-200 mb-2">
            Send Anonymous Message
          </h1>
          <p className="text-yellow-600 dark:text-yellow-400">
            to @{params.username}
          </p>
        </div>

        {/* Suggestions - Only show when explicitly requested */}
        {showSuggestions && !hasError && (
          <Card className="bg-white/60 dark:bg-gray-800/60 border-yellow-200 dark:border-yellow-700/50 mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-800 dark:text-yellow-200 text-lg">
                  {isGenerating ? 'Generating Suggestions...' : 'Suggested Messages'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseSuggestions}
                  className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isGenerating && displaySuggestions.length === 0 ? (
                <div className="text-center text-yellow-600 dark:text-yellow-400 py-2">
                  Generating suggestions...
                </div>
              ) : displaySuggestions.length > 0 ? (
                displaySuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto min-h-[3rem] p-3 text-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-yellow-200 whitespace-normal break-words"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="text-left leading-relaxed block w-full">
                      {suggestion}
                    </span>
                  </Button>
                ))
              ) : (
                <div className="text-center text-yellow-600 dark:text-yellow-400 py-2">
                  No suggestions available
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Message Form */}
        <Card className="bg-white/60 dark:bg-gray-800/60 border-yellow-200 dark:border-yellow-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-yellow-800 dark:text-yellow-200 text-center text-lg">
              Your Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <Textarea
                placeholder="Write your anonymous message here..."
                className="min-h-[100px] sm:min-h-[120px] bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 focus:border-yellow-400 dark:focus:border-yellow-500 text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={300}
              />
              <div className="flex justify-between items-center text-sm">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isGenerating || hasError}
                  onClick={handleGetSuggestions}
                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-50 disabled:opacity-50"
                  title={hasError ? 'Suggestions temporarily unavailable due to rate limits' : 'Get AI-powered message suggestions'}
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {isGenerating ? 'Generating...' : hasError ? 'Unavailable' : 'Suggest Messages'}
                </Button>
                <span className="text-yellow-600 dark:text-yellow-400">
                  {content.length}/300
                </span>
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

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 px-2">
            Your message will be sent anonymously. Please be respectful and kind.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage