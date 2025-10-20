import { google } from "@ai-sdk/google"
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const userPrompt = prompt?.trim();
        const hasUserPrompt = userPrompt && userPrompt.length > 0;

        if (hasUserPrompt) {
            const result = streamText({
                model: google('gemini-2.5-flash'),
                prompt: `Generate exactly 3 relevant message suggestions based on this user message: "${userPrompt}"

                The user wants to send this message anonymously. Create 3 variations that:
                   - Maintain the same core intent and context
                   - Could be alternative phrasings or related questions
                   - Are engaging and conversational
                   - Ready to send as-is

                Format: Return ONLY the 3 suggestions separated by "||" without any introductory text.
                Now generate for: "${userPrompt}"`,
                temperature: 0.8,
            });

            return result.toUIMessageStreamResponse();
        } else {
            const result = streamText({
                model: google('gemini-2.5-flash'),
                prompt: `Generate exactly 3 general, friendly conversation starters for anonymous messaging.

                Format: Return ONLY the 3 suggestions separated by "||" without any introductory text.

                Examples:
                "What's something you're passionate about?||I really appreciate your perspective on things!||If you could learn any new skill, what would it be?"
                "What's a simple pleasure that always makes your day better?||What's the most interesting thing you've learned recently?||I admire your creativity and insights!"

                Generate 3 general conversation starters:`,
                temperature: 0.7,
            });

            return result.toUIMessageStreamResponse();
        }
    } catch (error) {
        console.error('Error in suggest-messages API:', error);
        
        // Handle quota exceeded error specifically
        if (error instanceof Error && (error.message.includes('quota') || error.message.includes('429'))) {
            return new Response(
                JSON.stringify({ 
                    error: 'Rate limit exceeded. Please try again later.' 
                }), 
                { 
                    status: 429,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
        
        return new Response(
            JSON.stringify({ 
                error: 'Unable to generate suggestions at the moment.' 
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}