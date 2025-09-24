import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, UIMessage } from 'ai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemma-3-27b-it'),
    messages: convertToModelMessages(messages),
    system: "You are Memory, a friendly assistant. Keep responses short, chat warmly, encourage positivity, and don’t give medical advice.",
  });

  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}