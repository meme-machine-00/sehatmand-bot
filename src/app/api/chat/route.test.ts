import { POST } from './route';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

jest.mock('@ai-sdk/anthropic');
jest.mock('@ai-sdk/google');
jest.mock('ai');

describe('POST API Route', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should use Gemini model when provider is set to "gemini"', async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ messages: [] }),
    };

    const mockGeminiModel = jest.fn();
    (createGoogleGenerativeAI as jest.Mock).mockReturnValue(() => mockGeminiModel);

    (streamText as jest.Mock).mockResolvedValue({
      toDataStreamResponse: jest.fn().mockReturnValue('mocked response'),
    });

    const response = await POST(mockRequest as any);

    expect(createGoogleGenerativeAI).toHaveBeenCalledWith({
      apiKey: process.env.GOOGLE_API_KEY,
    });
    expect(mockGeminiModel).toHaveBeenCalledWith(process.env.GEMINI_MODEL, expect.any(Object));
    expect(streamText).toHaveBeenCalledWith(expect.objectContaining({
      model: mockGeminiModel,
    }));
    expect(response).toBe('mocked response');
  });

  // Add more tests here for different scenarios, such as:
  // - Using Anthropic model when provider is set to "anthropic"
  // - Handling errors in the request
  // - Verifying the correct parameters are passed to streamText
});