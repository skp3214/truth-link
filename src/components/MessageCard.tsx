import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X, Clock } from 'lucide-react'
import { Message } from '@/models/message.model'
import { toast } from 'sonner'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast.success("Message deleted successfully!", {
                description: response.data.message,
            });
            onMessageDelete(message._id as string)
        } catch (error: unknown) {
            toast.error("Failed to delete message", {
                description: error instanceof Error ? error.message : "Something went wrong",
            });
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return (
        <Card className="relative bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] dark:from-yellow-900/20 dark:to-amber-900/20 dark:border-yellow-700/50">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {formatDate(message.createdAt)}
                        </span>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-gray-900 border-yellow-200 dark:border-yellow-700">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-yellow-800 dark:text-yellow-200">
                                    Delete Message?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                    This action cannot be undone. This will permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/20">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 border border-yellow-100 dark:border-yellow-800/30">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                        {message.content}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default MessageCard
