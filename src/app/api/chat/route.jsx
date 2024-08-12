import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const runtime = 'edge';

export async function POST(req) {
  const { messages, model, image } = await req.json();

  switch (model) {
    case 'openai':
      // OpenAI doesn't support image input in this API version
      const openaiResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages,
      });
      const openaiStream = OpenAIStream(openaiResponse);
      return new StreamingTextResponse(openaiStream);

    case 'anthropic':
      let anthropicMessages = messages.map(m => ({ role: m.role, content: m.content }));
      if (image) {
        anthropicMessages.push({
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image.split(',')[1]
              }
            },
            {
              type: 'text',
              text: "What's in this image?"
            }
          ]
        });
      }
      const anthropicResponse = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: anthropicMessages,
        stream: true,
      });
      const anthropicStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of anthropicResponse) {
            controller.enqueue(chunk.text);
          }
          controller.close();
        },
      });
      return new StreamingTextResponse(anthropicStream);

    case 'gemini':
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      let geminiParts = [{ text: messages[messages.length - 1].content }];
      if (image) {
        geminiParts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: image.split(',')[1]
          }
        });
      }
      const geminiResponse = await geminiModel.generateContentStream(geminiParts);
      const geminiStream = new ReadableStream({
        async start(controller) {
          for await (const chunk of geminiResponse.stream) {
            controller.enqueue(chunk.text());
          }
          controller.close();
        },
      });
      return new StreamingTextResponse(geminiStream);

    default:
      return new Response('Invalid model specified', { status: 400 });
  }
}