import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        
        const basePrompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be
        separated by '||'. These questions are for an anonymous social messagging platform, like Qooh.me, and should be suitable for a diverse audience.
        Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. 
        For example, your output should be structured like this: 'Whats a hobby you've recently started || if you could have dinner with any historical figure,
        who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a
        positive and welcoming conversational environment.`;
        
        const contextualPrompt = messages 
            ? `${basePrompt}\n\nContext: The user mentioned "${messages}". Generate questions that could be related to this context or theme while maintaining the anonymous and engaging nature described above.`
            : basePrompt;

        const result = streamText({
            model: openai('gpt-4o'),
            prompt: contextualPrompt
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error in suggest-messages API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}