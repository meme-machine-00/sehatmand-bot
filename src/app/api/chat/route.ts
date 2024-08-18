import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI  } from '@ai-sdk/google';
import { convertToCoreMessages, streamText } from "ai";
import { medicalSystemAssistPrompt } from './prompts';

const clientAnthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const clientGemini = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY
});

const provider: "anthropic" | "gemini" = "gemini";


export async function POST(req: Request) {
  const { messages } = await req.json();

  let model:any;
  if(provider === 'anthropic'){
    model = clientAnthropic(process.env.CLAUDE_MODEL!);
  }
  if(provider === 'gemini'){
    model = clientGemini(process.env.GEMINI_MODEL!,{
      safetySettings: [
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });
  }

  const result = await streamText({
    model: model,
    messages: convertToCoreMessages(messages),
    temperature: 0.5,
    topK: 0,
    topP: 0.95,
    system: medicalSystemAssistPrompt
  });


  return result.toDataStreamResponse();
}
