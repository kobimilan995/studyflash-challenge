import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, tool, UIMessage } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),

    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          // Generate more realistic weather data
          const baseTemp = Math.round(Math.random() * 20 + 15); // 15-35°C
          const temperature = Math.round(baseTemp * 9 / 5 + 32); // Convert to Fahrenheit for API
          const conditions = ['Mostly cloudy', 'Partly sunny', 'Sunny', 'Overcast', 'Light rain'][Math.floor(Math.random() * 5)];

          return {
            location,
            temperature,
            condition: conditions,
            high: Math.round(baseTemp + Math.random() * 5),
            low: Math.round(baseTemp - Math.random() * 5),
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'none',
    },
  });
}
